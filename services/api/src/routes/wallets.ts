import { Hono } from 'hono';
import { eq, desc, and } from 'drizzle-orm';
import { Bindings, Variables } from '../db';
import { wallets, walletTransactions, bankTransfers, real_manual_deposits, bank_accounts, payment_methods } from 'database';
import { jwtMiddleware } from '../middleware/jwt';
import { CregisClient } from '../services/cregis';

export const walletRoutes = new Hono<{ Bindings: Bindings; Variables: Variables }>();

// Add JWT Middleware to all routes in this router
walletRoutes.use('*', jwtMiddleware);

walletRoutes.get('/deposit-settings', async (c) => {
  const db = c.get('db');
  
  // Get active MANUAL payment method
  const manualMethod = await db.select().from(payment_methods).where(and(eq(payment_methods.method, 'MANUAL'), eq(payment_methods.enabled, true))).get();
  
  let manualAddresses: Record<string, string> = {};
  if (manualMethod?.instructions) {
    try {
      manualAddresses = JSON.parse(manualMethod.instructions);
    } catch(e) {
      console.error('Failed to parse manual deposit instructions as JSON', e);
    }
  }
  
  return c.json({ success: true, manualAddresses });
});

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

walletRoutes.post('/top-up-demo', async (c) => {
  const db = c.get('db');
  const user = c.get('user');
  
  // We'll give 100,000 USDT in demo mode
  const assetSymbol = 'USDT';
  const amount = '100000';
  const now = new Date();
  
  let wallet = await db.select().from(wallets).where(and(eq(wallets.userId, user.id), eq(wallets.assetSymbol, assetSymbol), eq(wallets.type, 'DEMO'))).get();
  
  if (!wallet) {
    await db.insert(wallets).values({
      id: crypto.randomUUID(),
      userId: user.id,
      assetSymbol,
      type: 'DEMO',
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
    id: `TX-DEMO-${Date.now()}`,
    userId: user.id,
    type: 'DEPOSIT',
    mode: 'DEMO',
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
  const mode = (c.req.query('mode') || c.req.header('x-trading-mode') || 'REAL') as 'REAL' | 'DEMO';
  
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
  const mode = (c.req.query('mode') || c.req.header('x-trading-mode') || 'REAL') as 'REAL' | 'DEMO';
  
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
  const mode = (c.req.query('mode') || c.req.header('x-trading-mode') || 'REAL') as 'REAL' | 'DEMO';
  
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
  const { assetSymbol, amount, network, destination, mode = 'REAL', depositMethod } = body;

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
      balance: '0',
      lockedBalance: '0',
      createdAt: now,
      updatedAt: now,
    });
    wallet = { id: walletId, userId: user.id, assetSymbol, type: mode, balance: '0', lockedBalance: '0', createdAt: now, updatedAt: now };
  }
  
  if (mode === 'DEMO') {
    // For DEMO, we instantly credit the wallet
    const newBalance = (parseFloat(wallet.balance) + parseFloat(amount)).toString();
    await db.update(wallets).set({ balance: newBalance, updatedAt: now }).where(eq(wallets.id, wallet.id));
    
    // Record transaction
    await db.insert(walletTransactions).values({
      id: transactionId,
      userId: user.id,
      type: 'DEPOSIT',
      mode: mode,
      assetSymbol,
      amount: amount.toString(),
      status: 'COMPLETED',
      network: 'System',
      destination: 'Demo Wallet',
      createdAt: now,
      updatedAt: now,
    });
    return c.json({ success: true, transactionId, message: 'Demo balance added' });
  } else {
    // For REAL, we need to generate a Cregis Address or Bank Transfer Request
    const { transactionHash, proofFileUrl, paymentReference } = body;
    
    if (depositMethod === 'CRYPTO' || depositMethod === 'AUTO') {
      const cregis = new CregisClient(c.env);
      // For AUTO deposit (Payment Engine), generate checkout URL instead of direct WaaS address
      const amountNum = Number(amount) || 0;
      if (amountNum > 0) {
        // Calculate fee if needed (e.g., 1%)
        const fee = amountNum * 0.01;
        const totalAmount = amountNum + fee;
        
        // Log transaction to DB with PENDING status (simplified here for demo)
        const paymentReference = `ORD-${Date.now()}`;
        
        // Call Payment Engine API
        const checkoutUrl = await cregis.createPaymentOrder(totalAmount, 'USD', user.id);
        
        return c.json({ success: true, checkoutUrl, message: 'Checkout URL generated' });
      } else {
        return c.json({ success: false, error: 'Valid amount required for checkout' }, 400);
      }
    } else if (depositMethod === 'BANK') {
      const amountNum = Number(amount) || 0;
      if (amountNum <= 0) {
        // Fetch active bank details
        const activeBank = await db.select().from(bank_accounts).where(eq(bank_accounts.active, true)).get();
        if (!activeBank) {
          return c.json({ success: false, error: 'No active bank account available for deposits.' }, 400);
        }
        return c.json({ 
          success: true, 
          bankDetails: {
            accountName: activeBank.account_holder,
            accountNumber: activeBank.account_number,
            bankName: activeBank.bank_name,
            swift: activeBank.swift || '',
            ifsc: activeBank.ifsc || '',
            branch: activeBank.branch || '',
            country: activeBank.country || '',
            instructions: activeBank.instructions || 'Please ensure you include your tracking reference when submitting your proof of payment. International payments may take 2-5 business days to process.'
          }
        });
      }

      await db.insert(bankTransfers).values({
        id: crypto.randomUUID(),
        userId: user.id,
        amount: amount.toString(),
        currency: assetSymbol,
        bankReference: paymentReference || `UTR-${Date.now()}`,
        proofDocumentUrl: proofFileUrl,
        status: 'PENDING',
        createdAt: now,
        updatedAt: now,
      });
      return c.json({ success: true, message: 'Bank transfer submitted successfully. Awaiting admin review.' });
    } else if (depositMethod === 'MANUAL') {
       await db.insert(real_manual_deposits).values({
         id: crypto.randomUUID(),
         deposit_id: transactionId,
         user_id: user.id,
         amount: parseFloat(amount),
         asset: assetSymbol,
         payment_reference: paymentReference || `REF-${Date.now()}`,
         transaction_hash: transactionHash,
         proof_file_url: proofFileUrl,
         status: 'PENDING',
         created_at: now,
         updated_at: now,
       });
       return c.json({ success: true, message: 'Manual deposit submitted successfully. Awaiting admin review.' });
    } else {
      return c.json({ success: false, error: 'Invalid deposit method for REAL mode' }, 400);
    }
  }
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
    status: 'COMPLETED', // Simulated demo trading completes instantly
    destination,
    network: network || 'Internal',
    createdAt: now,
    updatedAt: now,
  });

  return c.json({ success: true, transactionId });
});
