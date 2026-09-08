import crypto from 'node:crypto';
import { Hono } from 'hono';
import { eq, and } from 'drizzle-orm';
import { Bindings, Variables } from '../db';
import { cregisDeposits, wallets, ledgerTransactions, ledgerEntries, ledgerAccounts, walletTransactions } from 'database';
import { CregisClient } from '../services/cregis';
import { generateBusinessId } from '../services/id-generator';

export const webhookRoutes = new Hono<{ Bindings: Bindings; Variables: Variables }>();

webhookRoutes.post('/cregis', async (c) => {
  const db = c.get('db');
  const env = c.env;
  const cregis = new CregisClient(env);
  
  const payloadStr = await c.req.text();
  const signature = c.req.header('x-cregis-signature') || ''; // Adjust header based on actual Cregis spec

  // Signature validation
  if (!cregis.verifyWebhookSignature(payloadStr, signature)) {
    return c.json({ error: 'Invalid signature' }, 401);
  }

  let payload;
  try {
    payload = JSON.parse(payloadStr);
  } catch (e) {
    return c.json({ error: 'Invalid JSON' }, 400);
  }

  // Example Cregis Deposit Payload logic
  const { event_type, data } = payload;

  if (event_type === 'DEPOSIT_CONFIRMED') {
    const { txid, cid, asset, amount, address, uid } = data;
    
    // Idempotency: Check if we already processed this txid outside of transaction to fail fast
    const existingTx = await db.select().from(cregisDeposits).where(eq(cregisDeposits.txid, txid)).get();
    if (existingTx && existingTx.status === 'CONFIRMED') {
      return c.json({ success: true, message: 'Already processed' });
    }

    try {
      await db.transaction(async (tx: any) => {
        // Double check inside transaction for idempotency
        const existingTxLock = await tx.select().from(cregisDeposits).where(eq(cregisDeposits.txid, txid)).get();
        if (existingTxLock && existingTxLock.status === 'CONFIRMED') {
          return; // Already processed
        }

        const now = new Date();
        
        // 1. Get or create Real Wallet
        let wallet = await tx.select().from(wallets).where(and(eq(wallets.userId, uid), eq(wallets.assetSymbol, asset))).get();
        if (!wallet) {
          await tx.insert(wallets).values({
            id: crypto.randomUUID(),
            userId: uid,
            assetSymbol: asset,
            balance: amount.toString(),
            lockedBalance: '0',
            escrowBalance: '0',
            createdAt: now,
            updatedAt: now
          });
        } else {
          const newBalance = (parseFloat(wallet.balance) + parseFloat(amount)).toString();
          await tx.update(wallets).set({ balance: newBalance, updatedAt: now }).where(eq(wallets.id, wallet.id));
        }

        // 2. Insert into cregisDeposits
        const depositId = crypto.randomUUID();
        const depDisplayId = await generateBusinessId(tx, null, 'CDEP');
        await tx.insert(cregisDeposits).values({
          id: depositId,
          displayId: depDisplayId,
          userId: uid,
          cid: cid,
          txid: txid,
          assetSymbol: asset,
          amount: amount.toString(),
          toAddress: address,
          status: 'CONFIRMED',
          createdAt: now,
          updatedAt: now
        });

        // 3. Insert WalletTransaction
        const wtDisplayId = await generateBusinessId(tx, null, 'WTXN');
        await tx.insert(walletTransactions).values({
          id: crypto.randomUUID(),
          displayId: wtDisplayId,
          userId: uid,
          type: 'DEPOSIT',
          assetSymbol: asset,
          amount: amount.toString(),
          status: 'COMPLETED',
          destination: address,
          reference: txid,
          createdAt: now,
          updatedAt: now
        });
      });
    } catch (error) {
      console.error('Webhook Deposit Error:', error);
      return c.json({ error: 'Internal Server Error' }, 500);
    }
  }

  return c.json({ success: true });
});
