import { Hono } from 'hono';
import { eq, desc, and } from 'drizzle-orm';
import { Bindings, Variables } from '../db';
import { wallets, walletTransactions } from 'database';
import { jwtMiddleware } from '../middleware/jwt';

export const walletRoutes = new Hono<{ Bindings: Bindings; Variables: Variables }>();

// Add JWT Middleware to all routes in this router
walletRoutes.use('*', jwtMiddleware);

// Helper function to get mock prices for simulation
const getMockPrice = (symbol: string) => {
  const prices: Record<string, number> = {
    'BTC-USD': 104250.00,
    'ETH-USD': 3500.00,
    'SOL-USD': 140.00,
    'BTC': 104250.00,
    'ETH': 3500.00,
    'SOL': 140.00,
    'USDT': 1.00,
    'USDC': 1.00,
    'USD': 1.00,
  };
  return prices[symbol] || 0;
};

walletRoutes.post('/top-up-paper', async (c) => {
  const db = c.get('db');
  const user = c.get('user');
  
  // We'll give 100,000 USDT in paper mode
  const assetSymbol = 'USDT';
  const amount = '100000';
  const now = new Date();
  
  let wallet = await db.select().from(wallets).where(and(eq(wallets.userId, user.id), eq(wallets.assetSymbol, assetSymbol), eq(wallets.type, 'PAPER'))).get();
  
  if (!wallet) {
    await db.insert(wallets).values({
      id: crypto.randomUUID(),
      userId: user.id,
      assetSymbol,
      type: 'PAPER',
      balance: amount,
      lockedBalance: '0',
      createdAt: now,
      updatedAt: now,
    });
  } else {
    // If they already have a wallet, top it up to 100k if it's below 10k, else just add 100k
    const newBalance = (parseFloat(wallet.balance) + parseFloat(amount)).toString();
    await db.update(wallets).set({ balance: newBalance, updatedAt: now }).where(eq(wallets.id, wallet.id));
  }
  
  await db.insert(walletTransactions).values({
    id: `TX-PAPER-${Date.now()}`,
    userId: user.id,
    type: 'DEPOSIT',
    mode: 'PAPER',
    assetSymbol,
    amount,
    status: 'COMPLETED',
    network: 'System',
    createdAt: now,
    updatedAt: now,
  });
  
  return c.json({ success: true });
});

walletRoutes.get('/balances', async (c) => {
  const db = c.get('db');
  const user = c.get('user');
  const mode = (c.req.query('mode') || c.req.header('x-trading-mode') || 'REAL') as 'REAL' | 'PAPER';
  
  const userWallets = await db.select().from(wallets).where(and(eq(wallets.userId, user.id), eq(wallets.type, mode))).all();
  
  // Format to AssetBalance structure
  const formattedBalances = userWallets.map(w => {
    const available = parseFloat(w.balance);
    const locked = parseFloat(w.lockedBalance);
    const total = available + locked;
    const usdPrice = getMockPrice(w.assetSymbol);
    
    return {
      assetId: w.assetSymbol.toLowerCase(),
      symbol: w.assetSymbol,
      available,
      locked,
      total,
      usdPrice,
      usdValue: total * usdPrice,
      change24h: 0, // Mocked for now
      change24hPercent: 0 // Mocked for now
    };
  });
  
  return c.json({ success: true, data: formattedBalances });
});

walletRoutes.get('/portfolio', async (c) => {
  const db = c.get('db');
  const user = c.get('user');
  const mode = (c.req.query('mode') || c.req.header('x-trading-mode') || 'REAL') as 'REAL' | 'PAPER';
  
  const userWallets = await db.select().from(wallets).where(and(eq(wallets.userId, user.id), eq(wallets.type, mode))).all();
  
  let totalValueUsd = 0;
  let availableBalanceUsd = 0;
  let lockedBalanceUsd = 0;
  
  const allocations = userWallets.map(w => {
    const total = parseFloat(w.balance) + parseFloat(w.lockedBalance);
    const usdValue = total * getMockPrice(w.assetSymbol);
    
    totalValueUsd += usdValue;
    availableBalanceUsd += parseFloat(w.balance) * getMockPrice(w.assetSymbol);
    lockedBalanceUsd += parseFloat(w.lockedBalance) * getMockPrice(w.assetSymbol);
    
    return {
      asset: w.assetSymbol,
      usdValue,
      percentage: 0 // Will calculate below
    };
  });
  
  // Calculate percentages
  const finalAllocations = allocations.map(a => ({
    ...a,
    percentage: totalValueUsd > 0 ? (a.usdValue / totalValueUsd) * 100 : 0
  })).filter(a => a.percentage > 0).sort((a, b) => b.usdValue - a.usdValue);
  
  const summary = {
    totalValueUsd,
    change24hUsd: 0,
    change24hPercent: 0,
    availableBalanceUsd,
    lockedBalanceUsd,
  };
  
  return c.json({ success: true, data: { summary, allocations: finalAllocations } });
});

walletRoutes.get('/transactions', async (c) => {
  const db = c.get('db');
  const user = c.get('user');
  const mode = (c.req.query('mode') || c.req.header('x-trading-mode') || 'REAL') as 'REAL' | 'PAPER';
  
  const transactions = await db.select().from(walletTransactions)
    .where(and(eq(walletTransactions.userId, user.id), eq(walletTransactions.mode, mode)))
    .orderBy(desc(walletTransactions.createdAt))
    .all();
    
  const mappedTxs = transactions.map(tx => ({
    id: tx.id,
    type: tx.type,
    asset: tx.assetSymbol,
    amount: parseFloat(tx.amount),
    fee: parseFloat(tx.fee),
    status: tx.status,
    destination: tx.destination,
    network: tx.network,
    reference: tx.reference,
    createdAt: tx.createdAt.toISOString(),
    updatedAt: tx.updatedAt.toISOString(),
  }));
    
  return c.json({ success: true, data: mappedTxs });
});

walletRoutes.post('/deposit', async (c) => {
  const db = c.get('db');
  const user = c.get('user');
  const body = await c.req.json();
  const { assetSymbol, amount, network, destination, mode = 'REAL' } = body;

  const transactionId = `TX-${Date.now()}`;
  const now = new Date();
  
  // Check if wallet exists
  let wallet = await db.select().from(wallets).where(and(eq(wallets.userId, user.id), eq(wallets.assetSymbol, assetSymbol), eq(wallets.type, mode))).get();
  
  if (!wallet) {
    const walletId = crypto.randomUUID();
    await db.insert(wallets).values({
      id: walletId,
      userId: user.id,
      assetSymbol,
      type: mode,
      balance: amount.toString(),
      lockedBalance: '0',
      createdAt: now,
      updatedAt: now,
    });
  } else {
    const newBalance = (parseFloat(wallet.balance) + parseFloat(amount)).toString();
    await db.update(wallets).set({ balance: newBalance, updatedAt: now }).where(eq(wallets.id, wallet.id));
  }
  
  // Record transaction
  await db.insert(walletTransactions).values({
    id: transactionId,
    userId: user.id,
    type: 'DEPOSIT',
    mode: mode,
    assetSymbol,
    amount: amount.toString(),
    status: 'COMPLETED', // Simulated paper trading completes instantly
    network: network || 'Internal',
    destination: destination,
    createdAt: now,
    updatedAt: now,
  });

  return c.json({ success: true, transactionId });
});

walletRoutes.post('/withdraw', async (c) => {
  const db = c.get('db');
  const user = c.get('user');
  const body = await c.req.json();
  const { assetSymbol, amount, destination, network, mode = 'REAL' } = body;
  
  const parsedAmount = parseFloat(amount);

  let wallet = await db.select().from(wallets).where(and(eq(wallets.userId, user.id), eq(wallets.assetSymbol, assetSymbol), eq(wallets.type, mode))).get();
  
  if (!wallet || parseFloat(wallet.balance) < parsedAmount) {
    return c.json({ success: false, error: 'Insufficient balance' }, 400);
  }
  
  const now = new Date();
  const transactionId = `TX-${Date.now()}`;
  
  // Deduct balance
  const newBalance = (parseFloat(wallet.balance) - parsedAmount).toString();
  await db.update(wallets).set({ balance: newBalance, updatedAt: now }).where(eq(wallets.id, wallet.id));
  
  // Record transaction
  await db.insert(walletTransactions).values({
    id: transactionId,
    userId: user.id,
    type: 'WITHDRAWAL',
    mode: mode,
    assetSymbol,
    amount: amount.toString(),
    status: 'COMPLETED', // Simulated paper trading completes instantly
    destination,
    network: network || 'Internal',
    createdAt: now,
    updatedAt: now,
  });

  return c.json({ success: true, transactionId });
});
