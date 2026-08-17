import { Hono } from 'hono';
import { eq, and, desc } from 'drizzle-orm';
import { expertProfiles, expertServices, expertBookings, users, wallets, ledgerTransactions, ledgerEntries, walletTransactions } from 'database';
import { jwtMiddleware } from '../middleware/jwt';
import { Bindings, Variables } from '../db';

export const expertRoutes = new Hono<{ Bindings: Bindings; Variables: Variables }>();

// 1. PUBLIC ROUTES
// Get all verified experts
expertRoutes.get('/', async (c) => {
  const db = c.get('db');
  
  try {
    const experts = await db.select({
      id: expertProfiles.id,
      displayName: users.displayName,
      avatarUrl: users.avatarUrl,
      bio: expertProfiles.bio,
      experienceYears: expertProfiles.experienceYears,
      languages: expertProfiles.languages,
      categories: expertProfiles.categories,
      rating: expertProfiles.rating,
      completedServices: expertProfiles.completedServices,
      customersHelped: expertProfiles.customersHelped,
      availabilityStatus: expertProfiles.availabilityStatus,
      verificationStatus: expertProfiles.verificationStatus,
    })
    .from(expertProfiles)
    .innerJoin(users, eq(users.id, expertProfiles.userId))
    .where(eq(expertProfiles.verificationStatus, 'VERIFIED'))
    .all();
    
    return c.json({ success: true, data: experts });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to fetch experts' }, 500);
  }
});

// Get specific expert's services
expertRoutes.get('/:id/services', async (c) => {
  const db = c.get('db');
  const expertId = c.req.param('id');
  
  try {
    const services = await db.select()
      .from(expertServices)
      .where(and(
        eq(expertServices.expertId, expertId),
        eq(expertServices.status, 'ACTIVE')
      ))
      .all();
      
    return c.json({ success: true, data: services });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to fetch services' }, 500);
  }
});

// 2. PROTECTED USER ROUTES
expertRoutes.use('/*', jwtMiddleware);

// Apply to be an expert
expertRoutes.post('/apply', async (c) => {
  const db = c.get('db');
  const user = c.get('user');
  const body = await c.req.json();
  
  try {
    // Check if profile already exists
    const existing = await db.select().from(expertProfiles).where(eq(expertProfiles.userId, user.id)).get();
    if (existing) {
      return c.json({ success: false, error: 'Expert profile already exists' }, 400);
    }
    
    const profileId = `exp_${crypto.randomUUID().replace(/-/g, '').substring(0, 12)}`;
    
    await db.insert(expertProfiles).values({
      id: profileId,
      userId: user.id,
      bio: body.bio,
      experienceYears: body.experienceYears || 0,
      languages: body.languages || [],
      categories: body.categories || [],
      verificationStatus: 'PENDING',
      availabilityStatus: 'OFFLINE',
      createdAt: new Date(),
      updatedAt: new Date()
    }).run();
    
    return c.json({ success: true, data: { id: profileId } });
  } catch (error) {
    console.error(error);
    return c.json({ success: false, error: 'Failed to submit application' }, 500);
  }
});

// Book a service & Pay from Wallet
expertRoutes.post('/bookings', async (c) => {
  const db = c.get('db');
  const user = c.get('user');
  const body = await c.req.json();
  const { serviceId, scheduledAt } = body;
  const mode = c.req.header('X-Trading-Mode') === 'DEMO' ? 'DEMO' : 'REAL';

  try {
    const service = await db.select().from(expertServices).where(eq(expertServices.id, serviceId)).get();
    if (!service || service.status !== 'ACTIVE') {
      return c.json({ success: false, error: 'Service is not available' }, 400);
    }
    
    const priceAmount = parseFloat(service.price);
    
    // Find wallet
    const wallet = await db.select().from(wallets).where(and(
      eq(wallets.userId, user.id),
      eq(wallets.assetSymbol, service.currency),
      eq(wallets.type, mode)
    )).get();
    
    if (!wallet) {
      return c.json({ success: false, error: `No wallet found for ${service.currency}` }, 400);
    }
    
    const availableBalance = parseFloat(wallet.balance) - parseFloat(wallet.lockedBalance) - parseFloat(wallet.escrowBalance);
    
    if (availableBalance < priceAmount) {
      return c.json({ 
        success: false, 
        error: 'INSUFFICIENT_BALANCE', 
        required: priceAmount, 
        available: availableBalance,
        currency: service.currency
      }, 400);
    }
    
    // Process Booking and Wallet Deduction
    const bookingId = `ebk_${crypto.randomUUID().replace(/-/g, '').substring(0, 12)}`;
    const txId = `txn_${crypto.randomUUID().replace(/-/g, '').substring(0, 12)}`;
    
    // Update Escrow Balance
    await db.update(wallets)
      .set({
        escrowBalance: (parseFloat(wallet.escrowBalance) + priceAmount).toString(),
        updatedAt: new Date()
      })
      .where(eq(wallets.id, wallet.id))
      .run();
      
    // Record Wallet Tx
    await db.insert(walletTransactions).values({
      id: txId,
      userId: user.id,
      type: 'EXPERT_SERVICE',
      mode: mode,
      assetSymbol: service.currency,
      amount: `-${priceAmount}`,
      status: 'COMPLETED',
      reference: bookingId,
      createdAt: new Date(),
      updatedAt: new Date()
    }).run();
    
    // Create Booking
    await db.insert(expertBookings).values({
      id: bookingId,
      userId: user.id,
      expertId: service.expertId,
      serviceId: service.id,
      scheduledAt: scheduledAt ? new Date(scheduledAt) : new Date(),
      status: 'PENDING_EXPERT',
      price: service.price,
      currency: service.currency,
      transactionId: txId,
      createdAt: new Date(),
      updatedAt: new Date()
    }).run();
    
    return c.json({ success: true, data: { bookingId } });
  } catch (error) {
    console.error(error);
    return c.json({ success: false, error: 'Booking failed' }, 500);
  }
});

// Get User's bookings
expertRoutes.get('/bookings/me', async (c) => {
  const db = c.get('db');
  const user = c.get('user');
  
  try {
    const bookings = await db.select({
      id: expertBookings.id,
      serviceTitle: expertServices.title,
      price: expertBookings.price,
      currency: expertBookings.currency,
      status: expertBookings.status,
      scheduledAt: expertBookings.scheduledAt,
      createdAt: expertBookings.createdAt
    })
    .from(expertBookings)
    .innerJoin(expertServices, eq(expertBookings.serviceId, expertServices.id))
    .where(eq(expertBookings.userId, user.id))
    .orderBy(desc(expertBookings.createdAt))
    .all();
    
    return c.json({ success: true, data: bookings });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to fetch bookings' }, 500);
  }
});
