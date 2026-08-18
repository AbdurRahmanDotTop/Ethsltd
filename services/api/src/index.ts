import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { createDb, Bindings, Variables } from './db';

// Import routes (we will create these next)
import { authRoutes } from './routes/auth';
import { walletRoutes } from './routes/wallets';
import { p2pRoutes } from './routes/p2p';
import { settingsRoutes } from './routes/settings';
import { supportRoutes } from './routes/support';
import { tradingRoutes } from './routes/trading';
import { adminRoutes } from './routes/admin';
import { adminPaymentRoutes } from './routes/admin/payments';
import { notificationRoutes } from './routes/notifications';
import { webhookRoutes } from './routes/webhooks';
import { expertRoutes } from './routes/experts';
import { adminCurrencyRateRoutes } from './routes/admin/currency-rates';
import { publicCurrencyRateRoutes } from './routes/currency-rates';
const app = new Hono<{ Bindings: Bindings; Variables: Variables }>();

app.use('*', cors({
  origin: (origin) => origin || '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'X-Trading-Mode'],
}));

// Setup DB context middleware
app.use('*', async (c, next) => {
  c.set('db', createDb(c.env.DB));
  await next();
});

app.get('/', (c) => c.json({ status: 'ok', service: 'Ethsltd API', version: '1.0' }));

// Mount routes
app.route('/api/v1/auth', authRoutes);
app.route('/api/v1/wallets', walletRoutes);
app.route('/api/v1/p2p', p2pRoutes);
app.route('/api/v1/settings', settingsRoutes);
app.route('/api/v1/support', supportRoutes);
app.route('/api/v1/trading', tradingRoutes);
app.route('/api/v1/admin', adminRoutes);
app.route('/api/v1/admin/payments', adminPaymentRoutes);
app.route('/api/v1/notifications', notificationRoutes);
app.route('/api/v1/experts', expertRoutes);
app.route('/api/v1/currency-rates', publicCurrencyRateRoutes);
app.route('/api/v1/admin/currency-rates', adminCurrencyRateRoutes);
app.route('/webhooks', webhookRoutes);

export default app;
