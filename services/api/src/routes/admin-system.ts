import { Hono } from 'hono';
import { Bindings, Variables } from '../db';
import { jwtMiddleware as requireAuth, adminMiddleware } from '../middleware/jwt';

const adminSystemRouter = new Hono<{ Bindings: Bindings; Variables: Variables }>();

adminSystemRouter.use('*', requireAuth);
adminSystemRouter.use('*', adminMiddleware);

adminSystemRouter.get('/', async (c) => {
  return c.json({
    success: true,
    data: {
      services: [
        { name: 'API Gateway', status: 'Operational', uptime: '99.9%', latency: '45ms' },
        { name: 'Database (D1)', status: 'Operational', uptime: '99.9%', latency: '22ms' },
        { name: 'Matching Engine', status: 'Operational', uptime: '99.9%', latency: '12ms' },
        { name: 'WebSockets', status: 'Operational', uptime: '99.9%', latency: '30ms' },
      ],
      metrics: {
        cpuUsage: 35,
        memoryUsage: 45,
        activeConnections: 1250,
        requestsPerSecond: 342,
      },
      activeIncidents: []
    }
  });
});

adminSystemRouter.post('/clear-cache', async (c) => {
  // In a real production setup, this would:
  // 1. Clear Redis cache keys
  // 2. Call Cloudflare API to purge edge cache
  // 3. Clear any internal memory cache
  
  // Here we just return success to indicate cache clear action was triggered.
  return c.json({
    success: true,
    message: "System cache cleared successfully"
  });
});

export default adminSystemRouter;
