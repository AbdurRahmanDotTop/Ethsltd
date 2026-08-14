import { Hono } from 'hono';
import { eq, desc } from 'drizzle-orm';
import { Bindings, Variables } from '../db';
import { users, kycProfiles, markets } from 'database';
import { jwtMiddleware } from '../middleware/jwt';

export const adminRoutes = new Hono<{ Bindings: Bindings; Variables: Variables }>();

// All admin routes require JWT
adminRoutes.use('*', jwtMiddleware);

// Admin Middleware Check
adminRoutes.use('*', async (c, next) => {
  const user = c.get('user');
  if (user.role !== 'ADMIN') {
    return c.json({ success: false, error: 'Unauthorized: Admin access required' }, 403);
  }
  await next();
});

// GET /api/v1/admin/stats
adminRoutes.get('/stats', async (c) => {
  const db = c.get('db');
  
  try {
    const allUsers = await db.select().from(users).all();
    const allPendingKyc = await db.select().from(kycProfiles).where(eq(kycProfiles.status, 'PENDING')).all();
    const activeMarkets = await db.select().from(markets).where(eq(markets.status, 'ACTIVE')).all();
    
    // Mock volume
    const totalVolumeUsd = 1250000;
    
    return c.json({
      success: true,
      data: {
        totalUsers: allUsers.length,
        pendingKyc: allPendingKyc.length,
        activeMarkets: activeMarkets.length,
        totalVolumeUsd
      }
    });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to fetch admin stats' }, 500);
  }
});

// GET /api/v1/admin/users
adminRoutes.get('/users', async (c) => {
  const db = c.get('db');
  try {
    const allUsers = await db.select({
      id: users.id,
      email: users.email,
      displayName: users.displayName,
      status: users.status,
      role: users.role,
      createdAt: users.createdAt,
      lastLoginAt: users.lastLoginAt
    }).from(users).orderBy(desc(users.createdAt)).all();
    
    return c.json({ success: true, data: allUsers });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to fetch users' }, 500);
  }
});

// POST /api/v1/admin/users/:id/status
adminRoutes.post('/users/:id/status', async (c) => {
  const db = c.get('db');
  const userId = c.req.param('id');
  const body = await c.req.json();
  
  if (!['ACTIVE', 'FROZEN', 'BANNED'].includes(body.status)) {
    return c.json({ success: false, error: 'Invalid status' }, 400);
  }
  
  try {
    await db.update(users).set({ status: body.status, updatedAt: new Date() }).where(eq(users.id, userId));
    return c.json({ success: true });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to update user status' }, 500);
  }
});

// GET /api/v1/admin/kyc
adminRoutes.get('/kyc', async (c) => {
  const db = c.get('db');
  try {
    const pendingKyc = await db.select().from(kycProfiles).orderBy(desc(kycProfiles.createdAt)).all();
    // In a real app we might only get PENDING, but for admin it's good to see all or filter. Let's return all.
    return c.json({ success: true, data: pendingKyc });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to fetch KYC profiles' }, 500);
  }
});

// POST /api/v1/admin/kyc/:id/status
adminRoutes.post('/kyc/:id/status', async (c) => {
  const db = c.get('db');
  const admin = c.get('user');
  const kycId = c.req.param('id');
  const body = await c.req.json();
  
  if (!['APPROVED', 'REJECTED'].includes(body.status)) {
    return c.json({ success: false, error: 'Invalid status' }, 400);
  }
  
  try {
    await db.update(kycProfiles).set({ 
      status: body.status, 
      rejectionReason: body.rejectionReason || null,
      reviewedBy: admin.id,
      updatedAt: new Date()
    }).where(eq(kycProfiles.id, kycId));
    
    return c.json({ success: true });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to update KYC status' }, 500);
  }
});
