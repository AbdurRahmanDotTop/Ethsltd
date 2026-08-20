import { Hono } from 'hono';
import { eq, and } from 'drizzle-orm';
import { Bindings, Variables } from '../../db';
import { bank_accounts as bankAccounts, payment_methods as paymentMethods, real_manual_deposits as realManualDeposits, bankTransfers, wallets, walletTransactions, ledgerEntries, ledgerTransactions, cregisDeposits, currencyRates, assetConversions } from 'database';
import { getFeeConfig, calculateFee } from '../../services/fees';
import { jwtMiddleware, adminMiddleware } from '../../middleware/jwt';
import { generateBusinessId } from '../../services/id-generator';

export const adminPaymentRoutes = new Hono<{ Bindings: Bindings; Variables: Variables }>();

// Ensure user is admin
adminPaymentRoutes.use('*', jwtMiddleware);
adminPaymentRoutes.use('*', adminMiddleware);

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

// Delete payment method
adminPaymentRoutes.delete('/methods/:id', async (c) => {
  const db = c.get('db');
  const id = c.req.param('id');
  
  await db.delete(paymentMethods).where(eq(paymentMethods.id, id));
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

// Delete bank account
adminPaymentRoutes.delete('/banks/:id', async (c) => {
  const db = c.get('db');
  const id = c.req.param('id');
  
  await db.delete(bankAccounts).where(eq(bankAccounts.id, id));
  return c.json({ success: true });
});

// Get pending deposits (manual + bank) and history for Cregis
adminPaymentRoutes.get('/pending-deposits', async (c) => {
  const db = c.get('db');
  const manual = await db.select().from(realManualDeposits).where(eq(realManualDeposits.status, 'PENDING')).all();
  const bank = await db.select().from(bankTransfers).where(eq(bankTransfers.status, 'PENDING')).all();
  
  // For Cregis, we just want to see recent deposits regardless of status
  const cregis = await db.select().from(cregisDeposits).orderBy(cregisDeposits.createdAt).limit(100).all();
  
  return c.json({ success: true, manualDeposits: manual, bankDeposits: bank, cregisDeposits: cregis });
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
  
  // Read from the frozen snapshot in the deposit record
  const finalAsset = 'USDT';
  const finalAmount = parseFloat(deposit.net_usdt || deposit.amount.toString());
  const feeAmount = parseFloat(deposit.total_fees || '0');
  const isConverted = deposit.original_currency && deposit.original_currency !== 'USDT';

  // Record conversion if applicable
  if (isConverted) {
    await db.insert(assetConversions).values({
      id: crypto.randomUUID(),
      userId: deposit.user_id,
      originalAsset: deposit.original_currency as string,
      originalAmount: deposit.original_amount as string,
      conversionRate: deposit.conversion_rate as string,
      grossUsdt: deposit.gross_usdt as string,
      depositFee: feeAmount.toString(),
      netUsdt: deposit.net_usdt as string,
      status: 'COMPLETED',
      referenceId: deposit.id,
      createdAt: now,
      updatedAt: now,
    });
  }

  // Find or create REAL wallet for the FINAL asset
  let wallet = await db.select().from(wallets).where(and(eq(wallets.userId, deposit.user_id), eq(wallets.assetSymbol, finalAsset), eq(wallets.type, 'REAL'))).get();
  if (!wallet) {
    const walletId = crypto.randomUUID();
    const displayId = await generateBusinessId(db, null, 'WALL');
    await db.insert(wallets).values({
      id: walletId, displayId, userId: deposit.user_id, assetSymbol: finalAsset, type: 'REAL', balance: '0', lockedBalance: '0', escrowBalance: '0', createdAt: now, updatedAt: now
    });
    wallet = { id: walletId, displayId, userId: deposit.user_id, assetSymbol: finalAsset, type: 'REAL', balance: '0', lockedBalance: '0', escrowBalance: '0', createdAt: now, updatedAt: now };
  }
  
  // Update wallet
  const newBalance = (parseFloat(wallet!.balance) + finalAmount).toString();
  await db.update(wallets).set({ balance: newBalance, updatedAt: now }).where(eq(wallets.id, wallet!.id));
  
  // Ledger
  const ltDisplayId = await generateBusinessId(db, null, 'LTXN');
  await db.insert(ledgerTransactions).values({ 
    id: crypto.randomUUID(),
    displayId: ltDisplayId,
    idempotencyKey: `MANUAL_DEP_APPROVE_${deposit.id}`,
    referenceType: 'DEPOSIT', 
    referenceId: deposit.id,
    environment: 'REAL', 
    status: 'COMMITTED', 
    createdAt: now
  });
  
  // Wallet Transaction History
  const wtDisplayId = await generateBusinessId(db, null, 'WTXN');
  await db.insert(walletTransactions).values({
    id: `TX-DEP-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
    displayId: wtDisplayId,
    userId: deposit.user_id,
    type: 'DEPOSIT',
    mode: 'REAL',
    assetSymbol: finalAsset,
    amount: finalAmount.toString(),
    fee: feeAmount.toString(),
    status: 'COMPLETED',
    network: 'Manual',
    reference: deposit.payment_reference,
    createdAt: now,
    updatedAt: now,
  });
  
  return c.json({ success: true });
});

// Reject manual deposit
adminPaymentRoutes.post('/manual-deposits/:id/reject', async (c) => {
  const db = c.get('db');
  const id = c.req.param('id');
  const user = c.get('user');
  const body = await c.req.json();
  const notes = body.notes;
  const now = new Date();
  
  const deposit = await db.select().from(realManualDeposits).where(eq(realManualDeposits.id, id)).get();
  if (!deposit || deposit.status !== 'PENDING') return c.json({ success: false, error: 'Invalid deposit' }, 400);
  
  const reason = notes ? notes : 'Rejected by Admin';
  await db.update(realManualDeposits).set({ 
    status: 'REJECTED', 
    reviewed_by: user.id, 
    reviewed_at: now, 
    rejection_reason: reason,
    remarks: reason 
  }).where(eq(realManualDeposits.id, id));
  
  return c.json({ success: true });
});

// Delete manual deposit
adminPaymentRoutes.delete('/manual-deposits/:id', async (c) => {
  const db = c.get('db');
  const id = c.req.param('id');
  const admin = c.get('user');
  if (admin.role !== 'SUPER_ADMIN') return c.json({ success: false, error: 'Unauthorized' }, 403);
  
  await db.delete(realManualDeposits).where(eq(realManualDeposits.id, id));
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
    const displayId = await generateBusinessId(db, null, 'WALL');
    await db.insert(wallets).values({
      id: walletId, displayId, userId: deposit.userId, assetSymbol: deposit.currency, type: 'REAL', balance: '0', lockedBalance: '0', escrowBalance: '0', createdAt: now, updatedAt: now
    });
    wallet = { id: walletId, displayId, userId: deposit.userId, assetSymbol: deposit.currency, type: 'REAL', balance: '0', lockedBalance: '0', escrowBalance: '0', createdAt: now, updatedAt: now };
  }
  
  // Update wallet
  const newBalance = (parseFloat(wallet!.balance) + parseFloat(deposit.amount)).toString();
  await db.update(wallets).set({ balance: newBalance, updatedAt: now }).where(eq(wallets.id, wallet!.id));
  
  // Ledger
  const ltDisplayId2 = await generateBusinessId(db, null, 'LTXN');
  await db.insert(ledgerTransactions).values({ 
    id: crypto.randomUUID(), 
    displayId: ltDisplayId2,
    idempotencyKey: `BANK_TRANS_APPROVE_${deposit.id}_${now.getTime()}`,
    referenceType: 'DEPOSIT', 
    referenceId: deposit.id,
    environment: 'REAL', 
    status: 'COMMITTED', 
    createdAt: now 
  });
  
  // Wallet Transaction History
  const wtDisplayId2 = await generateBusinessId(db, null, 'WTXN');
  await db.insert(walletTransactions).values({
    id: `TX-DEP-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
    displayId: wtDisplayId2,
    userId: deposit.userId,
    type: 'DEPOSIT',
    mode: 'REAL',
    assetSymbol: deposit.currency,
    amount: deposit.amount.toString(),
    status: 'COMPLETED',
    network: 'Bank Transfer',
    reference: deposit.bankReference,
    createdAt: now,
    updatedAt: now,
  });
  
  return c.json({ success: true });
});

// Reject bank deposit
adminPaymentRoutes.post('/bank-deposits/:id/reject', async (c) => {
  const db = c.get('db');
  const id = c.req.param('id');
  const user = c.get('user');
  const { notes } = await c.req.json();
  const now = new Date();
  
  const deposit = await db.select().from(bankTransfers).where(eq(bankTransfers.id, id)).get();
  if (!deposit || deposit.status !== 'PENDING') return c.json({ success: false, error: 'Invalid deposit' }, 400);
  
  const reason = notes ? `Rejected: ${notes}` : 'Rejected by Admin';
  await db.update(bankTransfers).set({ status: 'REJECTED', reviewedBy: user.id, reviewedAt: now, bankReference: reason }).where(eq(bankTransfers.id, id));
  
  return c.json({ success: true });
});

// Delete bank deposit
adminPaymentRoutes.delete('/bank-deposits/:id', async (c) => {
  const db = c.get('db');
  const id = c.req.param('id');
  const admin = c.get('user');
  if (admin.role !== 'SUPER_ADMIN') return c.json({ success: false, error: 'Unauthorized' }, 403);
  
  await db.delete(bankTransfers).where(eq(bankTransfers.id, id));
  return c.json({ success: true });
});
