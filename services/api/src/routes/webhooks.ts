import { Hono } from 'hono';
import { eq } from 'drizzle-orm';
import { Bindings, Variables } from '../db';
import { cregisDeposits, wallets, ledgerTransactions, ledgerEntries, ledgerAccounts } from 'database';
import { CregisClient } from '../services/cregis';

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
  // According to PRD, we must do idempotency checks and verify cid/txid.
  const { event_type, data } = payload;

  if (event_type === 'DEPOSIT_CONFIRMED') {
    const { txid, cid, asset, amount, address, uid } = data;
    
    // Idempotency: Check if we already processed this txid
    const existingTx = await db.select().from(cregisDeposits).where(eq(cregisDeposits.txid, txid)).get();
    if (existingTx && existingTx.status === 'CONFIRMED') {
      return c.json({ success: true, message: 'Already processed' });
    }

    // Process Deposit
    // 1. Get or create Real Wallet
    // NOTE: This assumes uid mapped to our internal user_id, or address mapped to user.
    // For simplicity, assuming `uid` is passed by Cregis as our `user_id`.
    let wallet = await db.select().from(wallets).where(eq(wallets.userId, uid)).get(); // Add asset symbol and type check
    // ... Implement full ledger update here based on PRD
  }

  return c.json({ success: true });
});
