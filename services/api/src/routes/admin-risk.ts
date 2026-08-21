import { Hono } from 'hono';
import { db } from '../db';
import { riskAlerts } from 'database/schema';
import { desc } from 'drizzle-orm';
import { requireAuth } from '../middleware/auth';

const adminRiskRouter = new Hono();

adminRiskRouter.use('*', requireAuth);

adminRiskRouter.get('/', async (c) => {
  try {
    const alerts = await db.select().from(riskAlerts).orderBy(desc(riskAlerts.createdAt));
    return c.json({ success: true, data: alerts });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to fetch risk alerts' }, 500);
  }
});

export default adminRiskRouter;
