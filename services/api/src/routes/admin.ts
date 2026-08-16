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

// GET /api/v1/admin/wallets/overview
adminRoutes.get('/wallets/overview', async (c) => {
  const db = c.get('db');
  try {
    const { eq } = require('drizzle-orm');
    const { wallets, payment_methods } = require('database');
    
    const allRealWallets = await db.select().from(wallets).where(eq(wallets.type, 'REAL')).all();
    const overview: Record<string, { balance: number, locked: number, escrow: number, total: number }> = {};
    
    for (const w of allRealWallets) {
      const sym = w.assetSymbol;
      if (!overview[sym]) {
        overview[sym] = { balance: 0, locked: 0, escrow: 0, total: 0 };
      }
      const b = parseFloat(w.balance || '0');
      const l = parseFloat(w.lockedBalance || '0');
      const e = parseFloat(w.escrowBalance || '0');
      
      overview[sym].balance += b;
      overview[sym].locked += l;
      overview[sym].escrow += e;
      overview[sym].total += (b + l + e);
    }
    
    const methods = await db.select().from(payment_methods).all();
    const networks = methods.map((m: any) => ({
      id: m.id,
      name: m.name,
      currency: m.currency,
      type: m.type,
      enabled: m.enabled
    }));
    
    return c.json({ success: true, data: { overview, networks } });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to fetch wallets overview' }, 500);
  }
});

// GET /api/v1/admin/wallets/users
adminRoutes.get('/wallets/users', async (c) => {
  const db = c.get('db');
  try {
    const search = c.req.query('search');
    const { eq, like, or, and, inArray } = require('drizzle-orm');
    const { wallets, users } = require('database');
    
    let userQuery: any = db.select({
      id: users.id,
      email: users.email,
      displayName: users.displayName,
    }).from(users);
    
    if (search) {
      userQuery = userQuery.where(or(like(users.email, `%${search}%`), like(users.id, `%${search}%`)));
    }
    
    const usersList = await userQuery.limit(50).all();
    const userIds = usersList.map((u: any) => u.id);
    
    let walletsList: any[] = [];
    if (userIds.length > 0) {
      walletsList = await db.select().from(wallets).where(
        and(eq(wallets.type, 'REAL'), inArray(wallets.userId, userIds))
      ).all();
    }
    
    const result = usersList.map((u: any) => ({
      ...u,
      wallets: walletsList.filter((w: any) => w.userId === u.id)
    }));
    
    return c.json({ success: true, data: result });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to fetch user wallets' }, 500);
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

  // targetField can be 'balance', 'lockedBalance', or 'escrowBalance'
  const { assetSymbol, amount, type, action, targetField = 'balance' } = body;

  try {
    const { and, eq } = require('drizzle-orm');
    const { wallets, ledgerTransactions } = require('database');
    
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
        balance: targetField === 'balance' ? amount.toString() : '0',
        lockedBalance: targetField === 'lockedBalance' ? amount.toString() : '0',
        escrowBalance: targetField === 'escrowBalance' ? amount.toString() : '0',
        createdAt: new Date(),
        updatedAt: new Date()
      });
    } else {
      let currentBalance = parseFloat((wallet as any)[targetField] as string || '0');
      let adjustment = parseFloat(amount);
      if (action === 'DEBIT') {
        if (currentBalance < adjustment) {
          return c.json({ success: false, error: 'Insufficient balance' }, 400);
        }
        currentBalance -= adjustment;
      } else {
        currentBalance += adjustment;
      }
      
      const updateData: any = { updatedAt: new Date() };
      updateData[targetField] = currentBalance.toString();
      
      await db.update(wallets).set(updateData).where(eq(wallets.id, wallet.id));
    }

    // Ledger Entry for Admin Override
    await db.insert(ledgerTransactions).values({
      id: crypto.randomUUID(),
      idempotencyKey: `admin-adjust-${Date.now()}-${userId}`,
      environment: type,
      referenceType: 'ADJUSTMENT',
      referenceId: userId,
      status: 'COMMITTED',
      createdAt: new Date(),
    });

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

// POST /api/v1/admin/p2p/disputes/:id/resolve
adminRoutes.post('/p2p/disputes/:id/resolve', async (c) => {
  const db = c.get('db');
  const admin = c.get('user');
  const disputeId = c.req.param('id');
  const body = await c.req.json();
  const { resolution, notes } = body; // resolution: 'RELEASE_TO_BUYER' or 'REFUND_TO_SELLER'

  if (admin.role !== 'SUPER_ADMIN' && admin.role !== 'SUPPORT_ADMIN') {
    return c.json({ success: false, error: 'Unauthorized' }, 403);
  }

  try {
    const { and, eq } = require('drizzle-orm');
    const { p2pDisputes, p2pOrders, wallets, p2pMessages, p2pAds, ledgerTransactions } = require('database');
    
    const dispute = await db.select().from(p2pDisputes).where(eq(p2pDisputes.id, disputeId)).get();
    if (!dispute || !['OPEN', 'UNDER_REVIEW'].includes(dispute.status)) {
      return c.json({ success: false, error: 'Invalid dispute state' }, 400);
    }
    
    const order = await db.select().from(p2pOrders).where(eq(p2pOrders.id, dispute.orderId)).get();
    if (!order) return c.json({ success: false, error: 'Order not found' }, 404);
    
    const ad = await db.select().from(p2pAds).where(eq(p2pAds.id, order.adId)).get();
    if (!ad) return c.json({ success: false, error: 'Ad not found' }, 404);
    
    const cryptoNum = parseFloat(order.cryptoAmount);
    const now = new Date();

    if (resolution === 'RELEASE_TO_BUYER') {
      // Deduct from Seller's escrow balance
      const sellerWallet = await db.select().from(wallets).where(and(eq(wallets.userId, order.sellerId), eq(wallets.assetSymbol, ad.asset))).get();
      if (sellerWallet) {
        const finalEscrow = (parseFloat(sellerWallet.escrowBalance) - cryptoNum).toString();
        await db.update(wallets).set({ escrowBalance: finalEscrow, updatedAt: now }).where(eq(wallets.id, sellerWallet.id));
      }
      // Add to Buyer's available balance
      const buyerWallet = await db.select().from(wallets).where(and(eq(wallets.userId, order.buyerId), eq(wallets.assetSymbol, ad.asset))).get();
      if (buyerWallet) {
        const finalBalance = (parseFloat(buyerWallet.balance) + cryptoNum).toString();
        await db.update(wallets).set({ balance: finalBalance, updatedAt: now }).where(eq(wallets.id, buyerWallet.id));
      } else {
        await db.insert(wallets).values({
          id: crypto.randomUUID(), userId: order.buyerId, assetSymbol: ad.asset,
          balance: cryptoNum.toString(), lockedBalance: '0', escrowBalance: '0', createdAt: now, updatedAt: now,
        });
      }
      
      await db.update(p2pOrders).set({ status: 'COMPLETED', updatedAt: now }).where(eq(p2pOrders.id, order.id));
      await db.update(p2pDisputes).set({ status: 'RESOLVED_BUYER', adminNotes: notes, assignedAdminId: admin.id, updatedAt: now }).where(eq(p2pDisputes.id, disputeId));

    } else if (resolution === 'REFUND_TO_SELLER') {
      // Return crypto to Seller's available balance from Escrow
      const sellerWallet = await db.select().from(wallets).where(and(eq(wallets.userId, order.sellerId), eq(wallets.assetSymbol, ad.asset))).get();
      if (sellerWallet) {
        const finalBalance = (parseFloat(sellerWallet.balance) + cryptoNum).toString();
        const finalEscrow = (parseFloat(sellerWallet.escrowBalance) - cryptoNum).toString();
        await db.update(wallets).set({ balance: finalBalance, escrowBalance: finalEscrow, updatedAt: now }).where(eq(wallets.id, sellerWallet.id));
      }
      
      await db.update(p2pOrders).set({ status: 'CANCELLED', updatedAt: now }).where(eq(p2pOrders.id, order.id));
      await db.update(p2pDisputes).set({ status: 'RESOLVED_SELLER', adminNotes: notes, assignedAdminId: admin.id, updatedAt: now }).where(eq(p2pDisputes.id, disputeId));
    }
    
    // Ledger Entry for Admin resolution
    await db.insert(ledgerTransactions).values({
      id: crypto.randomUUID(),
      idempotencyKey: `p2p-admin-resolve-${order.id}`,
      environment: order.mode,
      referenceType: 'P2P_ESCROW',
      referenceId: order.id,
      status: 'COMMITTED',
      createdAt: now,
    });

    await db.insert(p2pMessages).values({
      id: `sysmsg_${Date.now()}`, orderId: order.id, senderId: admin.id, mode: order.mode,
      content: `Dispute Resolved by Admin. Action: ${resolution}. Notes: ${notes || ''}`, type: 'SYSTEM', createdAt: now,
    });

    return c.json({ success: true });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to resolve dispute' }, 500);
  }
});


