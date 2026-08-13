import { Hono } from 'hono';
import { eq } from 'drizzle-orm';
import { Bindings, Variables } from '../db';
import { wallets, ledgerAccounts, ledgerTransactions, ledgerEntries } from 'database';

export const walletRoutes = new Hono<{ Bindings: Bindings; Variables: Variables }>();

// A middleware should normally inject c.get('user'), for now we'll pass userId in body/query or mock
walletRoutes.get('/', async (c) => {
  const db = c.get('db');
  const userId = c.req.query('userId') || 'mock-user-id'; // To be replaced with auth middleware
  
  const userWallets = await db.select().from(wallets).where(eq(wallets.userId, userId));
  return c.json({ success: true, data: userWallets });
});

walletRoutes.post('/deposit', async (c) => {
  const db = c.get('db');
  const body = await c.req.json();
  const { userId, assetSymbol, amount } = body;

  const idempotencyKey = crypto.randomUUID();
  const transactionId = crypto.randomUUID();

  // Very simplified double entry ledger implementation for deposit
  // In real life, D1 transactions should be used: await db.batch([...]) or db.transaction()
  
  // Create transaction
  await db.insert(ledgerTransactions).values({
    id: transactionId,
    idempotencyKey,
    referenceType: 'DEPOSIT',
    referenceId: `dep_${Date.now()}`,
    status: 'COMMITTED',
    createdAt: new Date(),
  });

  // Check if wallet exists
  let wallet = await db.select().from(wallets).where(eq(wallets.userId, userId)).get();
  if (!wallet) {
    const walletId = crypto.randomUUID();
    await db.insert(wallets).values({
      id: walletId,
      userId,
      assetSymbol,
      balance: amount.toString(),
      lockedBalance: '0',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  } else {
    // We would need to parse BigInt/number and update. Simplified for now.
    const newBalance = (parseFloat(wallet.balance) + parseFloat(amount)).toString();
    // update wallet ...
  }

  return c.json({ success: true, transactionId });
});
