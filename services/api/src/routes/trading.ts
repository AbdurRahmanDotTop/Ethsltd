import { Hono } from 'hono';
import { Bindings, Variables } from '../db';
import { markets, orders, trades } from 'database';

export const tradingRoutes = new Hono<{ Bindings: Bindings; Variables: Variables }>();

tradingRoutes.get('/markets', async (c) => {
  const db = c.get('db');
  const allMarkets = await db.select().from(markets);
  return c.json({ success: true, data: allMarkets });
});

tradingRoutes.post('/orders', async (c) => {
  // place order stub
  return c.json({ success: true, message: 'Order placed' });
});
