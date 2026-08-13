import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { users } from './auth';

export const p2pAds = sqliteTable('p2p_ads', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  type: text('type', { enum: ['BUY', 'SELL'] }).notNull(), // Buy ad means creator wants to buy crypto with fiat
  asset: text('asset').notNull(), // crypto asset (e.g., USDT)
  fiat: text('fiat').notNull(), // fiat asset (e.g., USD, INR)
  price: text('price').notNull(), // fiat price per crypto
  totalAmount: text('total_amount').notNull(), // total crypto available in ad
  availableAmount: text('available_amount').notNull(), // remaining crypto
  minLimit: text('min_limit').notNull(), // min fiat amount per trade
  maxLimit: text('max_limit').notNull(), // max fiat amount per trade
  paymentMethods: text('payment_methods').notNull(), // JSON string array of supported methods
  terms: text('terms'),
  status: text('status', { enum: ['ACTIVE', 'PAUSED', 'COMPLETED', 'CANCELED'] }).notNull().default('ACTIVE'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

export const p2pOrders = sqliteTable('p2p_orders', {
  id: text('id').primaryKey(),
  adId: text('ad_id').notNull().references(() => p2pAds.id),
  buyerId: text('buyer_id').notNull().references(() => users.id),
  sellerId: text('seller_id').notNull().references(() => users.id),
  cryptoAmount: text('crypto_amount').notNull(),
  fiatAmount: text('fiat_amount').notNull(),
  price: text('price').notNull(),
  status: text('status', { enum: ['PENDING', 'PAID', 'RELEASED', 'CANCELLED', 'DISPUTED'] }).notNull().default('PENDING'),
  paymentMethod: text('payment_method').notNull(), // The selected method for this trade
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(), // Usually 15-30 mins after creation
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

export const p2pMessages = sqliteTable('p2p_messages', {
  id: text('id').primaryKey(),
  orderId: text('order_id').notNull().references(() => p2pOrders.id, { onDelete: 'cascade' }),
  senderId: text('sender_id').notNull().references(() => users.id),
  content: text('content').notNull(),
  attachmentUrl: text('attachment_url'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});
