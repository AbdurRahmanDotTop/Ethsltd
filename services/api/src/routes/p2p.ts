import { Hono } from 'hono';
import { Bindings, Variables } from '../db';
import { p2pAds, p2pOrders } from 'database';

export const p2pRoutes = new Hono<{ Bindings: Bindings; Variables: Variables }>();

p2pRoutes.get('/ads', async (c) => {
  const db = c.get('db');
  const ads = await db.select().from(p2pAds);
  return c.json({ success: true, data: ads });
});

p2pRoutes.post('/orders', async (c) => {
  // p2p order stub
  return c.json({ success: true, message: 'P2P Order placed' });
});
