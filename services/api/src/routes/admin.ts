import { Hono } from 'hono';
import { eq, desc } from 'drizzle-orm';
import { Bindings, Variables } from '../db';
import { users, kycProfiles, markets, payment_methods } from 'database';
import { jwtMiddleware } from '../middleware/jwt';

export const adminRoutes = new Hono<{ Bindings: Bindings; Variables: Variables }>();

// All admin routes require JWT
adminRoutes.use('*', jwtMiddleware);

// Admin Middleware Check
adminRoutes.use('*', async (c, next) => {
  const user = c.get('user');
  if (!['SUPER_ADMIN', 'COMPLIANCE_ADMIN', 'SUPPORT_ADMIN', 'ADMIN'].includes(user.role)) {
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
  const admin = c.get('user');
  const userId = c.req.param('id');
  const body = await c.req.json();

  if (admin.role !== 'SUPER_ADMIN') {
    return c.json({ success: false, error: 'Unauthorized: Only Super Admins can change user status' }, 403);
  }
  
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

// PUT /api/v1/admin/users/:id/role
adminRoutes.put('/users/:id/role', async (c) => {
  const db = c.get('db');
  const admin = c.get('user');
  const userId = c.req.param('id');
  const body = await c.req.json();

  if (admin.role !== 'SUPER_ADMIN') {
    return c.json({ success: false, error: 'Unauthorized: Only Super Admins can change user roles' }, 403);
  }

  if (!['USER', 'SUPPORT_ADMIN', 'COMPLIANCE_ADMIN', 'SUPER_ADMIN'].includes(body.role)) {
    return c.json({ success: false, error: 'Invalid role' }, 400);
  }

  try {
    await db.update(users).set({ role: body.role, updatedAt: new Date() }).where(eq(users.id, userId));
    return c.json({ success: true });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to update user role' }, 500);
  }
});

// POST /api/v1/admin/users/:id/wallets/adjust
adminRoutes.post('/users/:id/wallets/adjust', async (c) => {
  const db = c.get('db');
  const admin = c.get('user');
  const userId = c.req.param('id');
  const body = await c.req.json();

  if (admin.role !== 'SUPER_ADMIN') {
    return c.json({ success: false, error: 'Unauthorized: Only Super Admins can adjust balances' }, 403);
  }

  const { assetSymbol, amount, type, action } = body;

  try {
    const { and, eq } = require('drizzle-orm');
    const { wallets } = require('database');
    
    let wallet = await db.select().from(wallets).where(
      and(eq(wallets.userId, userId), eq(wallets.assetSymbol, assetSymbol), eq(wallets.type, type))
    ).get();

    if (!wallet) {
      if (action === 'DEBIT') {
        return c.json({ success: false, error: 'Insufficient balance to debit' }, 400);
      }
      await db.insert(wallets).values({
        id: crypto.randomUUID(),
        userId,
        assetSymbol,
        type,
        balance: amount.toString(),
        lockedBalance: '0',
        createdAt: new Date(),
        updatedAt: new Date()
      });
    } else {
      let currentBalance = parseFloat(wallet.balance);
      let adjustment = parseFloat(amount);
      if (action === 'DEBIT') {
        if (currentBalance < adjustment) {
          return c.json({ success: false, error: 'Insufficient balance' }, 400);
        }
        currentBalance -= adjustment;
      } else {
        currentBalance += adjustment;
      }
      await db.update(wallets).set({ balance: currentBalance.toString(), updatedAt: new Date() }).where(eq(wallets.id, wallet.id));
    }

    return c.json({ success: true });
  } catch (error) {
    console.error(error);
    return c.json({ success: false, error: 'Failed to adjust wallet balance' }, 500);
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

// GET /api/v1/admin/deposit-settings
adminRoutes.get('/deposit-settings', async (c) => {
  const db = c.get('db');
  try {
    const methods = await db.select().from(payment_methods).all();
    return c.json({ success: true, data: methods });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to fetch deposit settings' }, 500);
  }
});

// PUT /api/v1/admin/deposit-settings/:id
adminRoutes.put('/deposit-settings/:id', async (c) => {
  const db = c.get('db');
  const admin = c.get('user');
  const id = c.req.param('id');
  const body = await c.req.json();

  if (admin.role !== 'SUPER_ADMIN') {
    return c.json({ success: false, error: 'Unauthorized: Only Super Admins can manage deposit settings' }, 403);
  }

  try {
    await db.update(payment_methods)
      .set({
        enabled: body.enabled,
        instructions: body.instructions !== undefined ? body.instructions : undefined,
        updated_at: new Date(),
        updated_by: admin.id
      })
      .where(eq(payment_methods.id, id));
      
    return c.json({ success: true });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to update deposit setting' }, 500);
  }
});

