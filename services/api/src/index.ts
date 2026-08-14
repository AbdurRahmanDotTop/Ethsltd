import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { createDb, Bindings, Variables } from './db';

// Import routes (we will create these next)
import { authRoutes } from './routes/auth';
import { walletRoutes } from './routes/wallets';
import { tradingRoutes } from './routes/trading';
import { p2pRoutes } from './routes/p2p';
import { adminRoutes } from './routes/admin';
import { notificationRoutes } from './routes/notifications';
import { supportRoutes } from './routes/support';
import { settingsRoutes } from './routes/settings';

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
app.route('/api/v1/trading', tradingRoutes);
app.route('/api/v1/p2p', p2pRoutes);
app.route('/api/v1/admin', adminRoutes);
app.route('/api/v1/notifications', notificationRoutes);
app.route('/api/v1/support', supportRoutes);
app.route('/api/v1/settings', settingsRoutes);

export default app;
