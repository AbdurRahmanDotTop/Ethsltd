import { Hono } from 'hono';
import { db } from '../db';
import { auditLogs } from 'database/schema';
import { desc } from 'drizzle-orm';
import { requireAuth } from '../middleware/auth';

const adminAuditRouter = new Hono();

adminAuditRouter.use('*', requireAuth);

adminAuditRouter.get('/', async (c) => {
  try {
    const logs = await db.select().from(auditLogs).orderBy(desc(auditLogs.createdAt)).limit(100);
    return c.json({ success: true, data: logs });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to fetch audit logs' }, 500);
  }
});

export default adminAuditRouter;
