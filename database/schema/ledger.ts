import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { users } from './auth';

export const ledgerAccounts = sqliteTable('ledger_accounts', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id), // null for system accounts
  environment: text('environment', { enum: ['REAL', 'DEMO'] }).notNull().default('REAL'),
  type: text('type', { enum: ['USER', 'SYSTEM_FEE', 'SYSTEM_REVENUE', 'SYSTEM_CUSTODY'] }).notNull(),
  assetSymbol: text('asset_symbol').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

export const ledgerTransactions = sqliteTable('ledger_transactions', {
  id: text('id').primaryKey(),
  idempotencyKey: text('idempotency_key').notNull().unique(),
  environment: text('environment', { enum: ['REAL', 'DEMO'] }).notNull().default('REAL'),
  referenceType: text('reference_type', { enum: ['DEPOSIT', 'WITHDRAWAL', 'TRADE', 'P2P_ESCROW', 'FEE'] }).notNull(),
  referenceId: text('reference_id').notNull(),
  status: text('status', { enum: ['PENDING', 'COMMITTED', 'FAILED', 'REVERSED'] }).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

export const ledgerEntries = sqliteTable('ledger_entries', {
  id: text('id').primaryKey(),
  transactionId: text('transaction_id').notNull().references(() => ledgerTransactions.id, { onDelete: 'cascade' }),
  accountId: text('account_id').notNull().references(() => ledgerAccounts.id),
  environment: text('environment', { enum: ['REAL', 'DEMO'] }).notNull().default('REAL'),
  direction: text('direction', { enum: ['DEBIT', 'CREDIT'] }).notNull(),
  amount: text('amount').notNull(),
  assetSymbol: text('asset_symbol').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});
