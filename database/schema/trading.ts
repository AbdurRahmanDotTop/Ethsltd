import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { users } from './auth';

export const markets = sqliteTable('markets', {
  id: text('id').primaryKey(),
  symbol: text('symbol').notNull().unique(), // e.g. BTC-USDT
  type: text('type', { enum: ['SPOT'] }).notNull().default('SPOT'),
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
  pricePrecision: integer('price_precision').notNull().default(2),
  quantityPrecision: integer('quantity_precision').notNull().default(6),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

export const orders = sqliteTable('orders', {
  id: text('id').primaryKey(),
  displayId: text('display_id').unique(),
  userId: text('user_id').notNull().references(() => users.id),
  marketSymbol: text('market_symbol').notNull().references(() => markets.symbol),
  side: text('side', { enum: ['BUY', 'SELL'] }).notNull(),
  type: text('type', { enum: ['MARKET', 'LIMIT'] }).notNull(),
  status: text('status', { enum: ['OPEN', 'PARTIALLY_FILLED', 'FILLED', 'CANCELED', 'REJECTED', 'EXPIRED', 'FAILED'] }).notNull().default('OPEN'),
  price: text('price'), // null for market orders initially
  amount: text('amount').notNull(), // total amount placed
  filledAmount: text('filled_amount').notNull().default('0'), // amount executed so far
  remainingAmount: text('remaining_amount').notNull(), // amount - filledAmount
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

export const trades = sqliteTable('trades', {
  id: text('id').primaryKey(),
  displayId: text('display_id').unique(),
  marketSymbol: text('market_symbol').notNull().references(() => markets.symbol),
  buyOrderId: text('buy_order_id').notNull(),
  sellOrderId: text('sell_order_id').notNull(),
  buyUserId: text('buy_user_id').notNull().references(() => users.id),
  sellUserId: text('sell_user_id').notNull().references(() => users.id),
  price: text('price').notNull(),
  amount: text('amount').notNull(),
  quoteAmount: text('quote_amount').notNull(), // price * amount
  buyFee: text('buy_fee').notNull(),
  sellFee: text('sell_fee').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

// Keep positions & binaryOptions exports as empty references so existing imports don't break at compile time
// These tables still exist in the DB but are no longer actively used
export const positions = sqliteTable('positions', {
  id: text('id').primaryKey(),
  displayId: text('display_id').unique(),
  userId: text('user_id').notNull().references(() => users.id),
  marketSymbol: text('market_symbol').notNull().references(() => markets.symbol),
  side: text('side', { enum: ['LONG', 'SHORT'] }).notNull(),
  status: text('status', { enum: ['OPEN', 'CLOSED', 'LIQUIDATED'] }).notNull().default('OPEN'),
  leverage: text('leverage').notNull().default('1'),
  marginType: text('margin_type', { enum: ['ISOLATED', 'CROSS'] }).notNull().default('ISOLATED'),
  marginAmount: text('margin_amount').notNull(),
  entryPrice: text('entry_price').notNull(),
  liquidationPrice: text('liquidation_price').notNull(),
  amount: text('amount').notNull(),
  realizedPnl: text('realized_pnl').notNull().default('0'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

export const binaryOptions = sqliteTable('binary_options', {
  id: text('id').primaryKey(),
  displayId: text('display_id').unique(),
  userId: text('user_id').notNull().references(() => users.id),
  marketSymbol: text('market_symbol').notNull().references(() => markets.symbol),
  direction: text('direction', { enum: ['UP', 'DOWN'] }).notNull(),
  amount: text('amount').notNull(),
  entryPrice: text('entry_price').notNull(),
  settlePrice: text('settle_price'),
  status: text('status', { enum: ['PENDING', 'WON', 'LOST', 'TIE'] }).notNull().default('PENDING'),
  payoutMultiplier: text('payout_multiplier').notNull().default('1.8'),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});
