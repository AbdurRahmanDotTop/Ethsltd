import { Hono } from 'hono';
import { db } from '../db';
import { apiKeys } from 'database/schema';
import { eq, desc } from 'drizzle-orm';
import { requireAuth } from '../middleware/auth';

const adminApiKeysRouter = new Hono();

adminApiKeysRouter.use('*', requireAuth);

adminApiKeysRouter.get('/', async (c) => {
  try {
    const keys = await db.select().from(apiKeys).orderBy(desc(apiKeys.createdAt));
    return c.json({ success: true, data: keys });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to fetch API keys' }, 500);
  }
});

adminApiKeysRouter.post('/:id/revoke', async (c) => {
  const id = c.req.param('id');
  try {
    await db.update(apiKeys).set({ status: 'REVOKED', updatedAt: new Date() }).where(eq(apiKeys.id, id));
    return c.json({ success: true });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to revoke API key' }, 500);
  }
});

export default adminApiKeysRouter;
