import { Hono } from 'hono';
import { eq, and } from 'drizzle-orm';
import { Bindings, Variables } from '../../db';
import { bank_accounts as bankAccounts, payment_methods as paymentMethods, real_manual_deposits as realManualDeposits, bankTransfers, wallets, walletTransactions, ledgerEntries, ledgerTransactions } from 'database';
import { jwtMiddleware } from '../../middleware/jwt';

export const adminPaymentRoutes = new Hono<{ Bindings: Bindings; Variables: Variables }>();

// Ensure user is admin
adminPaymentRoutes.use('*', jwtMiddleware);
adminPaymentRoutes.use('*', async (c, next) => {
  const user = c.get('user');
  if (user.role !== 'ADMIN') {
    return c.json({ success: false, error: 'Unauthorized' }, 403);
  }
  await next();
});

// Get payment settings
adminPaymentRoutes.get('/settings', async (c) => {
  const db = c.get('db');
  const methods = await db.select().from(paymentMethods).all();
  const accounts = await db.select().from(bankAccounts).all();
  
  return c.json({ success: true, paymentMethods: methods, bankAccounts: accounts });
});

// Create payment method
adminPaymentRoutes.post('/methods', async (c) => {
  const db = c.get('db');
  const body = await c.req.json();
  const now = new Date();
  
  await db.insert(paymentMethods).values({ 
    id: crypto.randomUUID(),
    ...body, 
    created_at: now, 
    updated_at: now 
  });
  return c.json({ success: true });
});

// Update payment method
adminPaymentRoutes.put('/methods/:id', async (c) => {
  const db = c.get('db');
  const id = c.req.param('id');
  const body = await c.req.json();
  const now = new Date();
  
  await db.update(paymentMethods).set({ ...body, updated_at: now }).where(eq(paymentMethods.id, id));
  return c.json({ success: true });
});

// Create bank account
adminPaymentRoutes.post('/banks', async (c) => {
  const db = c.get('db');
  const body = await c.req.json();
  const now = new Date();
  
  await db.insert(bankAccounts).values({ 
    id: crypto.randomUUID(),
    ...body, 
    created_at: now, 
    updated_at: now 
  });
  return c.json({ success: true });
});

// Update bank account
adminPaymentRoutes.put('/banks/:id', async (c) => {
  const db = c.get('db');
  const id = c.req.param('id');
  const body = await c.req.json();
  const now = new Date();
  
  await db.update(bankAccounts).set({ ...body, updated_at: now }).where(eq(bankAccounts.id, id));
  return c.json({ success: true });
});

// Get pending deposits (manual + bank)
adminPaymentRoutes.get('/pending-deposits', async (c) => {
  const db = c.get('db');
  const manual = await db.select().from(realManualDeposits).where(eq(realManualDeposits.status, 'PENDING')).all();
  const bank = await db.select().from(bankTransfers).where(eq(bankTransfers.status, 'PENDING')).all();
  
  return c.json({ success: true, manualDeposits: manual, bankDeposits: bank });
});

// Approve manual deposit
adminPaymentRoutes.post('/manual-deposits/:id/approve', async (c) => {
  const db = c.get('db');
  const id = c.req.param('id');
  const user = c.get('user');
  const now = new Date();
  
  const deposit = await db.select().from(realManualDeposits).where(eq(realManualDeposits.id, id)).get();
  if (!deposit || deposit.status !== 'PENDING') return c.json({ success: false, error: 'Invalid deposit' }, 400);
  
  // Atomic approval
  await db.update(realManualDeposits).set({ status: 'APPROVED', reviewed_by: user.id, reviewed_at: now }).where(eq(realManualDeposits.id, id));
  
  // Find or create REAL wallet
  let wallet = await db.select().from(wallets).where(and(eq(wallets.userId, deposit.user_id), eq(wallets.assetSymbol, deposit.asset), eq(wallets.type, 'REAL'))).get();
  if (!wallet) {
    const walletId = crypto.randomUUID();
    await db.insert(wallets).values({
      id: walletId, userId: deposit.user_id, assetSymbol: deposit.asset, type: 'REAL', balance: '0', lockedBalance: '0', createdAt: now, updatedAt: now
    });
    wallet = { id: walletId, userId: deposit.user_id, assetSymbol: deposit.asset, type: 'REAL', balance: '0', lockedBalance: '0', createdAt: now, updatedAt: now };
  }
  
  // Update wallet
  const newBalance = (parseFloat(wallet.balance) + deposit.amount).toString();
  await db.update(wallets).set({ balance: newBalance, updatedAt: now }).where(eq(wallets.id, wallet.id));
  
  // Ledger
  await db.insert(ledgerTransactions).values({ 
    id: crypto.randomUUID(),
    idempotencyKey: `MANUAL_DEP_APPROVE_${deposit.id}_${now.getTime()}`,
    referenceType: 'DEPOSIT', 
    referenceId: deposit.id,
    environment: 'REAL', 
    status: 'COMMITTED', 
    createdAt: now
  });
  
  return c.json({ success: true });
});

// Approve bank deposit
adminPaymentRoutes.post('/bank-deposits/:id/approve', async (c) => {
  const db = c.get('db');
  const id = c.req.param('id');
  const user = c.get('user');
  const now = new Date();
  
  const deposit = await db.select().from(bankTransfers).where(eq(bankTransfers.id, id)).get();
  if (!deposit || deposit.status !== 'PENDING') return c.json({ success: false, error: 'Invalid deposit' }, 400);
  
  // Atomic approval
  await db.update(bankTransfers).set({ status: 'APPROVED', reviewedBy: user.id, reviewedAt: now }).where(eq(bankTransfers.id, id));
  
  // Find or create REAL wallet
  let wallet = await db.select().from(wallets).where(and(eq(wallets.userId, deposit.userId), eq(wallets.assetSymbol, deposit.currency), eq(wallets.type, 'REAL'))).get();
  if (!wallet) {
    const walletId = crypto.randomUUID();
    await db.insert(wallets).values({
      id: walletId, userId: deposit.userId, assetSymbol: deposit.currency, type: 'REAL', balance: '0', lockedBalance: '0', createdAt: now, updatedAt: now
    });
    wallet = { id: walletId, userId: deposit.userId, assetSymbol: deposit.currency, type: 'REAL', balance: '0', lockedBalance: '0', createdAt: now, updatedAt: now };
  }
  
  // Update wallet
  const newBalance = (parseFloat(wallet.balance) + parseFloat(deposit.amount)).toString();
  await db.update(wallets).set({ balance: newBalance, updatedAt: now }).where(eq(wallets.id, wallet.id));
  
  // Ledger
  await db.insert(ledgerTransactions).values({ 
    id: crypto.randomUUID(), 
    idempotencyKey: `BANK_TRANS_APPROVE_${deposit.id}_${now.getTime()}`,
    referenceType: 'DEPOSIT', 
    referenceId: deposit.id,
    environment: 'REAL', 
    status: 'COMMITTED', 
    createdAt: now 
  });
  
  return c.json({ success: true });
});
