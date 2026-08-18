import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { eq, isNull, or, and } from 'drizzle-orm';
import { generateBusinessId } from '../services/id-generator';
import * as schema from 'database';
import path from 'path';

// Assuming SQLite db file is located at wrangler local state
const sqlitePath = path.resolve(__dirname, '../../.wrangler/state/v3/d1/miniflare-D1DatabaseObject/3fa8f740d3febf923f5ac593e31a3f07f749768726848e738e51a6ad589d9e56.sqlite');
const client = createClient({ url: `file:${sqlitePath}` });
const db = drizzle(client, { schema });

async function backfill() {
  console.log('Starting Backfill for displayId...');

  // Helper to fetch user email efficiently
  const userEmails: Record<string, string | null> = {};
  async function getEmail(userId: string | null) {
    if (!userId) return null;
    if (userEmails[userId] !== undefined) return userEmails[userId];
    const u = await db.select().from(schema.users).where(eq(schema.users.id, userId)).get();
    userEmails[userId] = u?.email || null;
    return userEmails[userId];
  }

  // 1. Users
  const usersToUpdate = await db.select().from(schema.users).where(isNull(schema.users.displayId)).all();
  for (const u of usersToUpdate) {
    const displayId = await generateBusinessId(db, u.email, 'USER');
    await db.update(schema.users).set({ displayId }).where(eq(schema.users.id, u.id));
    console.log(`Updated User ${u.id} -> ${displayId}`);
  }

  // 2. Tickets
  const ticketsToUpdate = await db.select().from(schema.tickets).where(isNull(schema.tickets.displayId)).all();
  for (const t of ticketsToUpdate) {
    const email = await getEmail(t.userId);
    const displayId = await generateBusinessId(db, email, 'TICK');
    await db.update(schema.tickets).set({ displayId }).where(eq(schema.tickets.id, t.id));
    console.log(`Updated Ticket ${t.id} -> ${displayId}`);
  }

  // 3. Wallets
  const walletsToUpdate = await db.select().from(schema.wallets).where(isNull(schema.wallets.displayId)).all();
  for (const w of walletsToUpdate) {
    const email = await getEmail(w.userId);
    const displayId = await generateBusinessId(db, email, 'WALL');
    await db.update(schema.wallets).set({ displayId }).where(eq(schema.wallets.id, w.id));
    console.log(`Updated Wallet ${w.id} -> ${displayId}`);
  }

  // 4. Wallet Transactions
  const wtxToUpdate = await db.select().from(schema.walletTransactions).where(isNull(schema.walletTransactions.displayId)).all();
  for (const wt of wtxToUpdate) {
    const email = await getEmail(wt.userId);
    const displayId = await generateBusinessId(db, email, 'WTXN');
    await db.update(schema.walletTransactions).set({ displayId }).where(eq(schema.walletTransactions.id, wt.id));
    console.log(`Updated Wallet Transaction ${wt.id} -> ${displayId}`);
  }

  // 5. Ledger Transactions
  const ltxToUpdate = await db.select().from(schema.ledgerTransactions).where(isNull(schema.ledgerTransactions.displayId)).all();
  for (const lt of ltxToUpdate) {
    const displayId = await generateBusinessId(db, null, 'LTXN'); // Ledger Tx might not directly link to a single user in a straightforward way
    await db.update(schema.ledgerTransactions).set({ displayId }).where(eq(schema.ledgerTransactions.id, lt.id));
    console.log(`Updated Ledger Transaction ${lt.id} -> ${displayId}`);
  }

  // 6. Orders
  const ordersToUpdate = await db.select().from(schema.orders).where(isNull(schema.orders.displayId)).all();
  for (const o of ordersToUpdate) {
    const email = await getEmail(o.userId);
    const displayId = await generateBusinessId(db, email, 'ORDE');
    await db.update(schema.orders).set({ displayId }).where(eq(schema.orders.id, o.id));
    console.log(`Updated Order ${o.id} -> ${displayId}`);
  }

  // 7. Trades
  const tradesToUpdate = await db.select().from(schema.trades).where(isNull(schema.trades.displayId)).all();
  for (const t of tradesToUpdate) {
    const displayId = await generateBusinessId(db, null, 'TRAD'); // Trade crosses 2 users
    await db.update(schema.trades).set({ displayId }).where(eq(schema.trades.id, t.id));
    console.log(`Updated Trade ${t.id} -> ${displayId}`);
  }

  // 8. P2P Ads
  const padsToUpdate = await db.select().from(schema.p2pAds).where(isNull(schema.p2pAds.displayId)).all();
  for (const p of padsToUpdate) {
    const email = await getEmail(p.userId);
    const displayId = await generateBusinessId(db, email, 'PADS');
    await db.update(schema.p2pAds).set({ displayId }).where(eq(schema.p2pAds.id, p.id));
    console.log(`Updated P2P Ad ${p.id} -> ${displayId}`);
  }

  // 9. P2P Orders
  const pordersToUpdate = await db.select().from(schema.p2pOrders).where(isNull(schema.p2pOrders.displayId)).all();
  for (const p of pordersToUpdate) {
    // Usually buyer initiated
    const email = await getEmail(p.buyerId);
    const displayId = await generateBusinessId(db, email, 'ORDE');
    await db.update(schema.p2pOrders).set({ displayId }).where(eq(schema.p2pOrders.id, p.id));
    console.log(`Updated P2P Order ${p.id} -> ${displayId}`);
  }

  // 10. P2P Disputes
  const dispToUpdate = await db.select().from(schema.p2pDisputes).where(isNull(schema.p2pDisputes.displayId)).all();
  for (const d of dispToUpdate) {
    const email = await getEmail(d.openerId);
    const displayId = await generateBusinessId(db, email, 'DISP');
    await db.update(schema.p2pDisputes).set({ displayId }).where(eq(schema.p2pDisputes.id, d.id));
    console.log(`Updated Dispute ${d.id} -> ${displayId}`);
  }

  // 11. Expert Profiles
  const exppToUpdate = await db.select().from(schema.expertProfiles).where(isNull(schema.expertProfiles.displayId)).all();
  for (const ep of exppToUpdate) {
    const email = await getEmail(ep.userId);
    const displayId = await generateBusinessId(db, email, 'EXPP');
    await db.update(schema.expertProfiles).set({ displayId }).where(eq(schema.expertProfiles.id, ep.id));
    console.log(`Updated Expert Profile ${ep.id} -> ${displayId}`);
  }

  // 12. Expert Bookings
  const expbToUpdate = await db.select().from(schema.expertBookings).where(isNull(schema.expertBookings.displayId)).all();
  for (const eb of expbToUpdate) {
    const email = await getEmail(eb.userId);
    const displayId = await generateBusinessId(db, email, 'BOOK');
    await db.update(schema.expertBookings).set({ displayId }).where(eq(schema.expertBookings.id, eb.id));
    console.log(`Updated Expert Booking ${eb.id} -> ${displayId}`);
  }

  // 13. KYC Profiles
  const kycToUpdate = await db.select().from(schema.kycProfiles).where(isNull(schema.kycProfiles.displayId)).all();
  for (const k of kycToUpdate) {
    const email = await getEmail(k.userId);
    const displayId = await generateBusinessId(db, email, 'KYCP');
    await db.update(schema.kycProfiles).set({ displayId }).where(eq(schema.kycProfiles.id, k.id));
    console.log(`Updated KYC Profile ${k.id} -> ${displayId}`);
  }

  console.log('Backfill Complete!');
  process.exit(0);
}

backfill().catch(err => {
  console.error(err);
  process.exit(1);
});
