import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { users } from './auth';

export const wallets = sqliteTable('wallets', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  assetSymbol: text('asset_symbol').notNull(),
  balance: text('balance').notNull().default('0'), // stored as string to maintain precision
  lockedBalance: text('locked_balance').notNull().default('0'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

export const walletTransactions = sqliteTable('wallet_transactions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: text('type', { enum: ['DEPOSIT', 'WITHDRAWAL', 'TRADE', 'P2P', 'TRANSFER', 'FEE', 'REWARD', 'ADJUSTMENT'] }).notNull(),
  assetSymbol: text('asset_symbol').notNull(),
  amount: text('amount').notNull(),
  fee: text('fee').notNull().default('0'),
  status: text('status', { enum: ['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED', 'REVERSED'] }).notNull(),
  destination: text('destination'),
  network: text('network'),
  reference: text('reference'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});
