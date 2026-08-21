import { Hono } from 'hono';
import { Bindings, Variables } from '../db';
import { riskAlerts } from 'database/schema';
import { desc } from 'drizzle-orm';
import { jwtMiddleware as requireAuth, adminMiddleware } from '../middleware/jwt';

const adminRiskRouter = new Hono<{ Bindings: Bindings; Variables: Variables }>();

adminRiskRouter.use('*', requireAuth);
adminRiskRouter.use('*', adminMiddleware);

adminRiskRouter.get('/', async (c) => {
  try {
    const alerts = await c.get('db').select().from(riskAlerts).orderBy(desc(riskAlerts.createdAt));
    return c.json({ success: true, data: alerts });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to fetch risk alerts' }, 500);
  }
});

export default adminRiskRouter;
