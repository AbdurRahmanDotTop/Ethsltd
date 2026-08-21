import { Hono } from 'hono';
import { db } from '../db';
import { smartContracts } from 'database/schema';
import { desc } from 'drizzle-orm';
import { requireAuth } from '../middleware/auth';

const adminContractsRouter = new Hono();

adminContractsRouter.use('*', requireAuth);

adminContractsRouter.get('/', async (c) => {
  try {
    const contracts = await db.select().from(smartContracts).orderBy(desc(smartContracts.createdAt));
    return c.json({ success: true, data: contracts });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to fetch smart contracts' }, 500);
  }
});

export default adminContractsRouter;
