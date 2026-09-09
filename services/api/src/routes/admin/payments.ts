import { Hono } from 'hono';
import { eq, and, or, isNull } from 'drizzle-orm';
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
  
  return c.json({ success: true, paymentMethods: methods });
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


// Get pending deposits (manual + bank) and history for Cregis
adminPaymentRoutes.get('/pending-deposits', async (c) => {
  const db = c.get('db');
  const manual = await db.select().from(realManualDeposits).where(
    and(
      eq(realManualDeposits.status, 'PENDING'),
      or(eq(realManualDeposits.remarks, 'MANUAL'), isNull(realManualDeposits.remarks))
    )
  ).all();
  
  const bank = await db.select().from(realManualDeposits).where(
    and(
      eq(realManualDeposits.status, 'PENDING'),
      eq(realManualDeposits.remarks, 'BANK')
    )
  ).all();
  
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
  
  try {
    await db.transaction(async (tx: any) => {
      const deposit = await tx.select().from(realManualDeposits).where(eq(realManualDeposits.id, id)).get();
      if (!deposit || deposit.status !== 'PENDING') {
        throw new Error('Invalid deposit or already processed');
      }
      
      // Atomic approval
      await tx.update(realManualDeposits)
        .set({ status: 'APPROVED', reviewed_by: user.id, reviewed_at: now })
        .where(eq(realManualDeposits.id, id));
      
      const { calculateDepositPreview } = require('../../services/calculations');
      const originalCurrency = deposit.original_currency || deposit.asset || 'USDT';
      const originalAmountStr = deposit.original_amount || deposit.amount.toString();
      const amountNum = parseFloat(originalAmountStr);
      
      // Calculate live conversion
      const preview = await calculateDepositPreview(db, amountNum, originalCurrency, null);
      
      const finalAsset = 'USDT';
      const finalAmount = preview.netUsdt;
      
      const conversionRateStr = preview.conversionRate.toString();
      const grossUsdtStr = preview.grossUsdt.toString();
      const totalFeesStr = preview.totalFees.toString();

      // Find or create REAL wallet for the FINAL asset (USDT)
      let wallet = await tx.select().from(wallets).where(and(eq(wallets.userId, deposit.user_id), eq(wallets.assetSymbol, finalAsset))).get();
      if (!wallet) {
        const walletId = crypto.randomUUID();
        const displayId = await generateBusinessId(tx, null, 'WALL');
        await tx.insert(wallets).values({
          id: walletId, displayId, userId: deposit.user_id, assetSymbol: finalAsset, balance: finalAmount.toString(), lockedBalance: '0', escrowBalance: '0', createdAt: now, updatedAt: now
        });
      } else {
        const newBalance = (parseFloat(wallet.balance) + finalAmount).toString();
        await tx.update(wallets).set({ balance: newBalance, updatedAt: now }).where(eq(wallets.id, wallet.id));
      }
      
      // Ledger
      const ltDisplayId = await generateBusinessId(tx, null, 'LTXN');
      const ledgerTxId = crypto.randomUUID();
      await tx.insert(ledgerTransactions).values({ 
        id: ledgerTxId,
        displayId: ltDisplayId,
        idempotencyKey: `MANUAL_DEP_APPROVE_${deposit.id}`,
        referenceType: 'DEPOSIT', 
        referenceId: deposit.id,
        status: 'COMMITTED', 
        createdAt: now
      });
      
      // Detailed Wallet Transaction History
      if (originalCurrency !== 'USDT') {
         const originalTxId = await generateBusinessId(tx, null, 'WTXN');
         await tx.insert(walletTransactions).values({
           id: crypto.randomUUID(),
           displayId: originalTxId,
           userId: deposit.user_id,
           type: 'DEPOSIT',
           assetSymbol: originalCurrency,
           amount: originalAmountStr,
           fee: '0',
           status: 'COMPLETED',
           network: 'Manual',
           reference: deposit.payment_reference,
           createdAt: now,
           updatedAt: now,
         });

         const conversionTxId = await generateBusinessId(tx, null, 'WTXN');
         await tx.insert(walletTransactions).values({
           id: crypto.randomUUID(),
           displayId: conversionTxId,
           userId: deposit.user_id,
           type: 'CONVERSION',
           assetSymbol: 'USDT',
           amount: grossUsdtStr,
           fee: '0',
           status: 'COMPLETED',
           network: 'System',
           reference: `Converted from ${originalCurrency}`,
           originalCurrency: originalCurrency,
           originalAmount: originalAmountStr,
           conversionRate: conversionRateStr,
           grossAmount: grossUsdtStr,
           netAmount: grossUsdtStr,
           createdAt: now,
           updatedAt: now,
         });
      }
      
      const wtDisplayId = await generateBusinessId(tx, null, 'WTXN');
      await tx.insert(walletTransactions).values({
        id: `TX-DEP-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
        displayId: wtDisplayId,
        userId: deposit.user_id,
        type: 'DEPOSIT',
        assetSymbol: finalAsset,
        amount: finalAmount.toString(),
        fee: totalFeesStr,
        status: 'COMPLETED',
        network: 'Manual',
        reference: deposit.payment_reference,
        originalCurrency: originalCurrency,
        originalAmount: originalAmountStr,
        conversionRate: conversionRateStr,
        grossAmount: grossUsdtStr,
        totalFees: totalFeesStr,
        netAmount: finalAmount.toString(),
        createdAt: now,
        updatedAt: now,
      });
    });
    return c.json({ success: true });
  } catch (error: any) {
    return c.json({ success: false, error: error.message || 'Failed to approve deposit' }, 400);
  }
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
  
  try {
    await db.transaction(async (tx: any) => {
      const deposit = await tx.select().from(realManualDeposits).where(eq(realManualDeposits.id, id)).get();
      if (!deposit || deposit.status !== 'PENDING') {
        throw new Error('Invalid deposit or already processed');
      }
      
      // Atomic approval
      await tx.update(realManualDeposits)
        .set({ status: 'APPROVED', reviewed_by: user.id, reviewed_at: now })
        .where(eq(realManualDeposits.id, id));
      
      const { calculateDepositPreview } = require('../../services/calculations');
      const originalCurrency = deposit.original_currency || deposit.asset || 'USDT';
      const originalAmountStr = deposit.original_amount || deposit.amount.toString();
      const amountNum = parseFloat(originalAmountStr);
      
      // Calculate live conversion
      const preview = await calculateDepositPreview(db, amountNum, originalCurrency, null);
      
      const finalAsset = 'USDT';
      const finalAmount = preview.netUsdt;
      
      const conversionRateStr = preview.conversionRate.toString();
      const grossUsdtStr = preview.grossUsdt.toString();
      const totalFeesStr = preview.totalFees.toString();

      // Find or create REAL wallet for the FINAL asset
      let wallet = await tx.select().from(wallets).where(and(eq(wallets.userId, deposit.user_id), eq(wallets.assetSymbol, finalAsset))).get();
      if (!wallet) {
        const walletId = crypto.randomUUID();
        const displayId = await generateBusinessId(tx, null, 'WALL');
        await tx.insert(wallets).values({ id: walletId, displayId, userId: deposit.user_id, assetSymbol: finalAsset, balance: finalAmount.toString(), lockedBalance: '0', escrowBalance: '0', createdAt: now, updatedAt: now });
      } else {
        const newBalance = (parseFloat(wallet.balance) + finalAmount).toString();
        await tx.update(wallets).set({ balance: newBalance, updatedAt: now }).where(eq(wallets.id, wallet.id));
      }
      
      // Ledger
      const ltDisplayId = await generateBusinessId(tx, null, 'LTXN');
      const ledgerTxId = crypto.randomUUID();
      await tx.insert(ledgerTransactions).values({ 
        id: ledgerTxId,
        displayId: ltDisplayId,
        idempotencyKey: `BANK_DEP_APPROVE_${deposit.id}`,
        referenceType: 'DEPOSIT', 
        referenceId: deposit.id,
        status: 'COMMITTED', 
        createdAt: now
      });

      // Detailed Wallet Transaction History
      if (originalCurrency !== 'USDT') {
         const originalTxId = await generateBusinessId(tx, null, 'WTXN');
         await tx.insert(walletTransactions).values({
           id: crypto.randomUUID(),
           displayId: originalTxId,
           userId: deposit.user_id,
           type: 'DEPOSIT',
           assetSymbol: originalCurrency,
           amount: originalAmountStr,
           fee: '0',
           status: 'COMPLETED',
           network: 'Bank',
           reference: deposit.payment_reference,
           createdAt: now,
           updatedAt: now,
         });

         const conversionTxId = await generateBusinessId(tx, null, 'WTXN');
         await tx.insert(walletTransactions).values({
           id: crypto.randomUUID(),
           displayId: conversionTxId,
           userId: deposit.user_id,
           type: 'CONVERSION',
           assetSymbol: 'USDT',
           amount: grossUsdtStr,
           fee: '0',
           status: 'COMPLETED',
           network: 'System',
           reference: `Converted from ${originalCurrency}`,
           originalCurrency: originalCurrency,
           originalAmount: originalAmountStr,
           conversionRate: conversionRateStr,
           grossAmount: grossUsdtStr,
           netAmount: grossUsdtStr,
           createdAt: now,
           updatedAt: now,
         });
      }
      
      // Wallet Transaction History
      const wtDisplayId = await generateBusinessId(tx, null, 'WTXN');
      await tx.insert(walletTransactions).values({
        id: `TX-DEP-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
        displayId: wtDisplayId,
        userId: deposit.user_id,
        type: 'DEPOSIT',
        assetSymbol: finalAsset,
        amount: finalAmount.toString(),
        fee: totalFeesStr,
        status: 'COMPLETED',
        network: 'Bank',
        reference: deposit.payment_reference,
        originalCurrency: originalCurrency,
        originalAmount: originalAmountStr,
        conversionRate: conversionRateStr,
        grossAmount: grossUsdtStr,
        totalFees: totalFeesStr,
        netAmount: finalAmount.toString(),
        createdAt: now,
        updatedAt: now,
      });
    });
    return c.json({ success: true });
  } catch (error: any) {
    return c.json({ success: false, error: error.message || 'Failed to approve deposit' }, 400);
  }
});

// Reject bank deposit
adminPaymentRoutes.post('/bank-deposits/:id/reject', async (c) => {
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

// Delete bank deposit
adminPaymentRoutes.delete('/bank-deposits/:id', async (c) => {
  const db = c.get('db');
  const id = c.req.param('id');
  const admin = c.get('user');
  if (admin.role !== 'SUPER_ADMIN') return c.json({ success: false, error: 'Unauthorized' }, 403);
  
  await db.delete(realManualDeposits).where(eq(realManualDeposits.id, id));
  return c.json({ success: true });
});
