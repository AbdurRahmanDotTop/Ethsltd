import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { users } from './auth';

export const markets = sqliteTable('markets', {
  id: text('id').primaryKey(),
  symbol: text('symbol').notNull().unique(), // e.g. BTC-USDT
  baseAsset: text('base_asset').notNull(), // BTC
  quoteAsset: text('quote_asset').notNull(), // USDT
  status: text('status', { enum: ['ACTIVE', 'PAUSED', 'DELISTED'] }).notNull().default('ACTIVE'),
  minPrice: text('min_price').notNull(),
  maxPrice: text('max_price').notNull(),
  tickSize: text('tick_size').notNull(),
  minAmount: text('min_amount').notNull(),
  stepSize: text('step_size').notNull(),
  makerFee: text('maker_fee').notNull().default('0.001'), // 0.1%
  takerFee: text('taker_fee').notNull().default('0.001'), // 0.1%
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

export const orders = sqliteTable('orders', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  marketSymbol: text('market_symbol').notNull().references(() => markets.symbol),
  mode: text('mode', { enum: ['REAL', 'PAPER'] }).notNull().default('REAL'),
  side: text('side', { enum: ['BUY', 'SELL'] }).notNull(),
  type: text('type', { enum: ['MARKET', 'LIMIT'] }).notNull(),
  status: text('status', { enum: ['OPEN', 'FILLED', 'CANCELED', 'REJECTED'] }).notNull().default('OPEN'),
  price: text('price'), // null for market orders initially
  amount: text('amount').notNull(), // total amount placed
  filledAmount: text('filled_amount').notNull().default('0'), // amount executed so far
  remainingAmount: text('remaining_amount').notNull(), // amount - filledAmount
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

export const trades = sqliteTable('trades', {
  id: text('id').primaryKey(),
  marketSymbol: text('market_symbol').notNull().references(() => markets.symbol),
  mode: text('mode', { enum: ['REAL', 'PAPER'] }).notNull().default('REAL'),
  makerOrderId: text('maker_order_id').notNull().references(() => orders.id),
  takerOrderId: text('taker_order_id').notNull().references(() => orders.id),
  price: text('price').notNull(),
  amount: text('amount').notNull(),
  makerFee: text('maker_fee').notNull(),
  takerFee: text('taker_fee').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});
