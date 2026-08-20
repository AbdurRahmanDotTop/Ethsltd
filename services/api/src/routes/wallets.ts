import { Hono } from 'hono';
import { eq, desc, and } from 'drizzle-orm';
import { Bindings, Variables } from '../db';
import { wallets, walletTransactions, bankTransfers, real_manual_deposits, bank_accounts, payment_methods, assetConversions, users } from 'database';
import { jwtMiddleware } from '../middleware/jwt';
import { CregisClient } from '../services/cregis';
import { getFeeConfig, calculateFee, getLimit } from '../services/fees';
import { generateBusinessId } from '../services/id-generator';
import { calculateDepositPreview, calculateWithdrawalPreview } from '../services/calculations';
import { EmailService } from '../services/email';

export const walletRoutes = new Hono<{ Bindings: Bindings; Variables: Variables }>();

// Add JWT Middleware to all routes in this router
walletRoutes.use('*', jwtMiddleware);

walletRoutes.get('/asset-conversions', async (c) => {
  const db = c.get('db');
  const user = c.get('user');
  
  const conversions = await db.select().from(assetConversions).where(eq(assetConversions.userId, user.id)).orderBy(desc(assetConversions.createdAt)).limit(50);
  return c.json({ success: true, data: conversions });
});

walletRoutes.get('/deposit-settings', async (c) => {
  const db = c.get('db');
  
  // Get all active payment methods
  const activeMethods = await db.select()
    .from(payment_methods)
    .where(eq(payment_methods.enabled, true))
    .orderBy(desc(payment_methods.updated_at))
    .all();
    
  // Support legacy manualAddresses format for backward compatibility
  const manualMethod = activeMethods.find(m => m.method === 'MANUAL');
  let manualAddresses: Record<string, string> = {};
  if (manualMethod?.instructions) {
    try {
      manualAddresses = JSON.parse(manualMethod.instructions);
    } catch(e) {
      console.error('Failed to parse manual deposit instructions as JSON', e);
    }
  }
  
  return c.json({ success: true, activeMethods, manualAddresses });
});

walletRoutes.get('/deposit/preview', async (c) => {
  try {
    const db = c.get('db');
    const amount = parseFloat(c.req.query('amount') || '0');
    const currency = c.req.query('currency') || 'USDT';
    let methodId = c.req.query('methodId') || null;

    if (amount <= 0) return c.json({ success: false, error: 'Invalid amount' }, 400);

    // If methodId is not a UUID, try to look it up as a string name
    if (methodId && methodId.length < 30) {
      const pm = await db.select().from(payment_methods).where(eq(payment_methods.method, methodId as any)).get();
      if (pm) methodId = pm.id;
    }

    const preview = await calculateDepositPreview(db, amount, currency, methodId);
    return c.json({ success: true, data: preview });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 400);
  }
});

walletRoutes.get('/withdrawal/preview', async (c) => {
  try {
    const db = c.get('db');
    const amount = parseFloat(c.req.query('amount') || '0');
    const currency = c.req.query('currency') || 'USDT';
    let methodId = c.req.query('methodId') || null;

    if (amount <= 0) return c.json({ success: false, error: 'Invalid amount' }, 400);

    if (methodId && methodId.length < 30) {
      const pm = await db.select().from(payment_methods).where(eq(payment_methods.method, methodId as any)).get();
      if (pm) methodId = pm.id;
    }

    const preview = await calculateWithdrawalPreview(db, amount, currency, methodId);
    return c.json({ success: true, data: preview });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 400);
  }
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
      escrowBalance: '0',
      createdAt: now,
      updatedAt: now,
    });
  } else {
    // If they already have a wallet, top it up to 100k if it's below 10k, else just add 100k
    const newBalance = (parseFloat(wallet.balance) + parseFloat(amount)).toString();
    await db.update(wallets).set({ balance: newBalance, updatedAt: now }).where(eq(wallets.id, wallet.id));
  }
  
  const dbUser = await db.select().from(users).where(eq(users.id, user.id)).get();
  const txDisplayId = await generateBusinessId(db, dbUser?.email, 'WTXN');
  await db.insert(walletTransactions).values({
    id: `TX-DEMO-${Date.now()}`,
    displayId: txDisplayId,
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
    const locked = parseFloat(w.lockedBalance) + parseFloat(w.escrowBalance);
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
    const lockedAmt = parseFloat(w.lockedBalance) + parseFloat(w.escrowBalance);
    const total = parseFloat(w.balance) + lockedAmt;
    const usdValue = total * getMockPrice(w.assetSymbol);
    
    totalValueUsd += usdValue;
    availableBalanceUsd += parseFloat(w.balance) * getMockPrice(w.assetSymbol);
    lockedBalanceUsd += lockedAmt * getMockPrice(w.assetSymbol);
    
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
  try {
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
    const displayId = await generateBusinessId(db, user.email, 'WALL');
    await db.insert(wallets).values({
      id: walletId,
      displayId,
      userId: user.id,
      assetSymbol,
      type: mode,
      balance: '0',
      lockedBalance: '0',
      escrowBalance: '0',
      createdAt: now,
      updatedAt: now,
    });
    wallet = { id: walletId, displayId, userId: user.id, assetSymbol, type: mode as any, balance: '0', lockedBalance: '0', escrowBalance: '0', createdAt: now, updatedAt: now };
  }
  
  if (mode === 'DEMO') {
    // For DEMO, we instantly credit the wallet
    const newBalance = (parseFloat(wallet!.balance) + parseFloat(amount)).toString();
    await db.update(wallets).set({ balance: newBalance, updatedAt: now }).where(eq(wallets.id, wallet!.id));
    
    const dbUser = await db.select().from(users).where(eq(users.id, user.id)).get();
    const txDisplayId = await generateBusinessId(db, dbUser?.email, 'WTXN');
    // Record transaction
    await db.insert(walletTransactions).values({
      id: transactionId,
      displayId: txDisplayId,
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
        
        try {
          // Call Payment Engine API
          const checkoutUrl = await cregis.createPaymentOrder(totalAmount, 'USD', user.id);
          return c.json({ success: true, checkoutUrl, message: 'Checkout URL generated' });
        } catch (error: any) {
          console.error("Payment Order generation failed:", error);
          return c.json({ success: false, error: error.message || 'Failed to generate checkout link' }, 400);
        }
      } else {
        return c.json({ success: false, error: 'Valid amount required for checkout' }, 400);
      }
    } else if (depositMethod === 'BANK' || depositMethod === 'MANUAL') {
      const amountNum = Number(amount) || 0;
      
      // If BANK and amount is 0, we just return bank details
      if (depositMethod === 'BANK' && amountNum <= 0) {
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
            instructions: activeBank.instructions || 'Please ensure you include your tracking reference when submitting your proof of payment.'
          }
        });
      }

      if (amountNum <= 0) {
        return c.json({ success: false, error: 'Invalid amount' }, 400);
      }

      const mappedDepositMethod = depositMethod === 'BANK' ? 'BANK_TRANSFER' : depositMethod === 'CRYPTO' ? 'AUTO' : depositMethod;
      // We need methodId to calculate fee. We can fetch it by mappedDepositMethod string
      const pm = await db.select().from(payment_methods).where(eq(payment_methods.method, mappedDepositMethod)).get();
      const methodId = pm ? pm.id : null;

      // Centralized Calculation Service!
      const preview = await calculateDepositPreview(db, amountNum, assetSymbol, methodId);
      
      if (depositMethod === 'BANK') {
        // We will store bank transfers in real_manual_deposits as well since we added breakdown fields there,
        // or we store in bankTransfers. We will use bankTransfers but wait, we didn't add breakdown to bankTransfers.
        // Let's store all manual/bank in real_manual_deposits to keep the schema unified.
      }
      
      await db.insert(real_manual_deposits).values({
         id: crypto.randomUUID(),
         deposit_id: transactionId,
         user_id: user.id,
         amount: amountNum,
         asset: assetSymbol,
         payment_reference: paymentReference || `REF-${Date.now()}`,
         transaction_hash: transactionHash || null,
         proof_file_url: proofFileUrl || null,
         
         // Freeze the calculation breakdown
         original_currency: preview.originalCurrency,
         original_amount: preview.originalAmount.toString(),
         conversion_rate: preview.conversionRate.toString(),
         gross_usdt: preview.grossUsdt.toString(),
         deposit_fee: preview.depositFee.toString(),
         other_fees: preview.otherFees.toString(),
         total_fees: preview.totalFees.toString(),
         net_usdt: preview.netUsdt.toString(),
         expected_wallet_credit: preview.netUsdt.toString(),
         
         status: 'PENDING',
         created_at: now,
         updated_at: now,
      });

      // Async Email Dispatch
      const emailService = new EmailService(c.env, db);
      c.executionCtx.waitUntil((async () => {
        try {
          await emailService.sendAdminDepositAlert({
            id: transactionId,
            userId: user.id,
            amount: amountNum.toString(),
            asset: assetSymbol,
            mode: 'REAL',
          });
        } catch (e) {
          console.error("Background email failed for deposit", e);
        }
      })());

      return c.json({ success: true, message: `${depositMethod} deposit submitted successfully. Awaiting admin review.` });
    } else {
      return c.json({ success: false, error: 'Invalid deposit method for REAL mode' }, 400);
    }
  }
  } catch (globalError: any) {
    console.error("FATAL DEPOSIT ROUTE ERROR:", globalError);
    return c.json({ success: false, error: `Server Crash: ${globalError?.message || String(globalError)}` }, 500);
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

  // 1. Validate withdrawal limits
  const minWithdrawal = await getLimit(db, 'MIN_WITHDRAWAL', 10);
  if (parsedAmount < minWithdrawal) {
    return c.json({ success: false, error: `Minimum withdrawal is ${minWithdrawal}` }, 400);
  }

  // 2. Calculate dynamic withdrawal fee using the centralized service
  // We need methodId to calculate fee. We can fetch it by mode/network or we assume null for crypto for now.
  let methodId = null; 
  try {
     // Defaulting crypto withdrawals to MANUAL method for fee calculation if not specified
     const pm = await db.select().from(payment_methods).where(eq(payment_methods.method, 'MANUAL')).get();
     if (pm) methodId = pm.id;
  } catch(e) {}

  const preview = await calculateWithdrawalPreview(db, parsedAmount, assetSymbol, methodId);
  
  if (preview.netUsdtReceived <= 0) {
    return c.json({ success: false, error: 'Amount must be greater than withdrawal fee' }, 400);
  }
  
  const now = new Date();
  const transactionId = `TX-${Date.now()}`;
  
  if (mode === 'DEMO') {
    // Deduct balance instantly for DEMO
    const newBalance = (parseFloat(wallet.balance) - parsedAmount).toString();
    await db.update(wallets).set({ balance: newBalance, updatedAt: now }).where(eq(wallets.id, wallet.id));
    
    const dbUser = await db.select().from(users).where(eq(users.id, user.id)).get();
    const txDisplayId = await generateBusinessId(db, dbUser?.email, 'WTXN');
    // Record transaction
    await db.insert(walletTransactions).values({
      id: transactionId,
      displayId: txDisplayId,
      userId: user.id,
      type: 'WITHDRAWAL',
      mode: mode,
      assetSymbol,
      amount: parsedAmount.toString(),
      fee: preview.totalFees.toString(),
      status: 'COMPLETED', // Simulated demo trading completes instantly
      destination,
      network: network || 'Internal',
      createdAt: now,
      updatedAt: now,
    });

    return c.json({ success: true, transactionId });
  } else {
    // --- REAL MODE WITHDRAWAL (CREGIS WAAS) ---
    try {
      const cregis = new CregisClient(c.env);
      
      // Step 1: Call Cregis Payout API via PHP Proxy (payout actual net amount)
      // Note: Do we payout gross or net? Usually user requests 100, fee is 1, they receive 99.
      const payoutId = await cregis.createPayout(preview.netUsdtReceived, assetSymbol, destination, user.id);
      
      // Step 2: Move balance to locked_balance
      const newBalance = (parseFloat(wallet.balance) - parsedAmount).toString();
      const newLocked = (parseFloat(wallet.lockedBalance) + parsedAmount).toString();
      await db.update(wallets).set({ balance: newBalance, lockedBalance: newLocked, updatedAt: now }).where(eq(wallets.id, wallet.id));
      
      const dbUser = await db.select().from(users).where(eq(users.id, user.id)).get();
      const txDisplayId = await generateBusinessId(db, dbUser?.email, 'WTXN');
      
      // Step 3: Record transaction as PENDING (Wait for Cregis Webhook to mark COMPLETED)
      await db.insert(walletTransactions).values({
        id: transactionId,
        displayId: txDisplayId,
        userId: user.id,
        type: 'WITHDRAWAL',
        mode: mode,
        assetSymbol,
        amount: parsedAmount.toString(),
        fee: preview.totalFees.toString(),
        status: 'PENDING',
        destination,
        network: network || 'External',
        reference: payoutId, // Store Cregis payout ID for webhook matching
        
        // Detailed breakdown
        originalCurrency: preview.currencyCode,
        originalAmount: parsedAmount.toString(),
        conversionRate: preview.conversionRate.toString(),
        grossAmount: parsedAmount.toString(),
        totalFees: preview.totalFees.toString(),
        netAmount: preview.netUsdtReceived.toString(),
        
        createdAt: now,
        updatedAt: now,
      });

      // Async Email Dispatch
      const emailService = new EmailService(c.env, db);
      c.executionCtx.waitUntil((async () => {
        try {
          await emailService.sendAdminWithdrawalAlert({
            id: transactionId,
            userId: user.id,
            amount: parsedAmount.toString(),
            asset: assetSymbol,
            mode: 'REAL',
          });
        } catch (e) {
          console.error("Background email failed for withdrawal", e);
        }
      })());

      return c.json({ 
        success: true, 
        transactionId,
        message: 'Withdrawal initiated successfully. It will be processed by the network shortly.'
      });
      
    } catch (error: any) {
      console.error("Real Withdrawal Error:", error);
      return c.json({ success: false, error: error.message || 'Failed to process withdrawal.' }, 400);
    }
  }
});
