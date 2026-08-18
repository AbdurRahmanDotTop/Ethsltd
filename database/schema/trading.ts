import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { users } from './auth';

export const markets = sqliteTable('markets', {
  id: text('id').primaryKey(),
  symbol: text('symbol').notNull().unique(), // e.g. BTC-USDT
  type: text('type', { enum: ['SPOT', 'FUTURES', 'OPTIONS'] }).notNull().default('SPOT'),
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
  maxLeverage: text('max_leverage').notNull().default('100'), // For futures
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

export const orders = sqliteTable('orders', {
  id: text('id').primaryKey(),
  displayId: text('display_id').unique(),
  userId: text('user_id').notNull().references(() => users.id),
  marketSymbol: text('market_symbol').notNull().references(() => markets.symbol),
  mode: text('mode', { enum: ['REAL', 'DEMO'] }).notNull().default('REAL'),
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
  displayId: text('display_id').unique(),
  marketSymbol: text('market_symbol').notNull().references(() => markets.symbol),
  mode: text('mode', { enum: ['REAL', 'DEMO'] }).notNull().default('REAL'),
  makerOrderId: text('maker_order_id').notNull(),
  takerOrderId: text('taker_order_id').notNull(),
  price: text('price').notNull(),
  amount: text('amount').notNull(),
  makerFee: text('maker_fee').notNull(),
  takerFee: text('taker_fee').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

export const positions = sqliteTable('positions', {
  id: text('id').primaryKey(),
  displayId: text('display_id').unique(),
  userId: text('user_id').notNull().references(() => users.id),
  marketSymbol: text('market_symbol').notNull().references(() => markets.symbol),
  mode: text('mode', { enum: ['REAL', 'DEMO'] }).notNull().default('REAL'),
  side: text('side', { enum: ['LONG', 'SHORT'] }).notNull(),
  status: text('status', { enum: ['OPEN', 'CLOSED', 'LIQUIDATED'] }).notNull().default('OPEN'),
  leverage: text('leverage').notNull().default('1'),
  marginType: text('margin_type', { enum: ['ISOLATED', 'CROSS'] }).notNull().default('ISOLATED'),
  marginAmount: text('margin_amount').notNull(), // Margin locked in the position
  entryPrice: text('entry_price').notNull(),
  liquidationPrice: text('liquidation_price').notNull(),
  amount: text('amount').notNull(), // Base asset amount (e.g. 1 BTC)
  realizedPnl: text('realized_pnl').notNull().default('0'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

export const binaryOptions = sqliteTable('binary_options', {
  id: text('id').primaryKey(),
  displayId: text('display_id').unique(),
  userId: text('user_id').notNull().references(() => users.id),
  marketSymbol: text('market_symbol').notNull().references(() => markets.symbol),
  mode: text('mode', { enum: ['REAL', 'DEMO'] }).notNull().default('REAL'),
  direction: text('direction', { enum: ['UP', 'DOWN'] }).notNull(),
  amount: text('amount').notNull(), // Amount wagered in quote asset (USDT)
  entryPrice: text('entry_price').notNull(),
  settlePrice: text('settle_price'),
  status: text('status', { enum: ['PENDING', 'WON', 'LOST', 'TIE'] }).notNull().default('PENDING'),
  payoutMultiplier: text('payout_multiplier').notNull().default('1.8'), // 80% profit
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});
