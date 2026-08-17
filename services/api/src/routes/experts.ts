import { Hono } from 'hono';
import { eq, and, desc } from 'drizzle-orm';
import { expertProfiles, expertServices, expertBookings, users, wallets, ledgerTransactions, ledgerEntries, walletTransactions, expertReviews } from 'database';
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

// Get specific expert profile
expertRoutes.get('/:id', async (c) => {
  const db = c.get('db');
  const id = c.req.param('id');
  
  try {
    const expert = await db.select({
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
    .where(and(eq(expertProfiles.id, id), eq(expertProfiles.verificationStatus, 'VERIFIED')))
    .get();
    
    if (!expert) return c.json({ success: false, error: 'Expert not found' }, 404);
    
    // Fetch reviews
    const reviews = await db.select({
      id: expertReviews.id,
      rating: expertReviews.rating,
      comment: expertReviews.comment,
      createdAt: expertReviews.createdAt,
      userDisplayName: users.displayName,
      userAvatar: users.avatarUrl
    })
    .from(expertReviews)
    .innerJoin(users, eq(users.id, expertReviews.userId))
    .where(eq(expertReviews.expertId, id))
    .orderBy(desc(expertReviews.createdAt))
    .all();
    
    return c.json({ success: true, data: { ...expert, reviews } });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to fetch expert' }, 500);
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
      createdAt: expertBookings.createdAt,
      reviewId: expertReviews.id
    })
    .from(expertBookings)
    .innerJoin(expertServices, eq(expertBookings.serviceId, expertServices.id))
    .leftJoin(expertReviews, eq(expertBookings.id, expertReviews.bookingId))
    .where(eq(expertBookings.userId, user.id))
    .orderBy(desc(expertBookings.createdAt))
    .all();
    
    const formattedBookings = bookings.map(b => ({
      ...b,
      hasReviewed: !!b.reviewId
    }));
    
    return c.json({ success: true, data: formattedBookings });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to fetch bookings' }, 500);
  }
});

// Submit a review for a completed booking
expertRoutes.post('/bookings/:id/review', async (c) => {
  const db = c.get('db');
  const user = c.get('user');
  const bookingId = c.req.param('id');
  const { rating, comment } = await c.req.json();
  
  if (!rating || rating < 1 || rating > 5) {
    return c.json({ success: false, error: 'Rating must be between 1 and 5' }, 400);
  }
  
  try {
    const booking = await db.select().from(expertBookings).where(and(eq(expertBookings.id, bookingId), eq(expertBookings.userId, user.id))).get();
    
    if (!booking) return c.json({ success: false, error: 'Booking not found' }, 404);
    if (booking.status !== 'COMPLETED') return c.json({ success: false, error: 'You can only review completed sessions' }, 400);
    
    const existingReview = await db.select().from(expertReviews).where(eq(expertReviews.bookingId, bookingId)).get();
    if (existingReview) return c.json({ success: false, error: 'Review already submitted for this session' }, 400);
    
    // Insert Review
    await db.insert(expertReviews).values({
      id: `rev_${crypto.randomUUID().replace(/-/g, '').substring(0, 12)}`,
      bookingId,
      userId: user.id,
      expertId: booking.expertId,
      rating,
      comment,
      createdAt: new Date()
    }).run();
    
    // Recalculate average rating for the expert
    const allReviews = await db.select().from(expertReviews).where(eq(expertReviews.expertId, booking.expertId)).all();
    const avgRating = allReviews.reduce((acc, curr) => acc + curr.rating, 0) / allReviews.length;
    
    await db.update(expertProfiles).set({
      rating: parseFloat(avgRating.toFixed(1)),
      updatedAt: new Date()
    }).where(eq(expertProfiles.id, booking.expertId)).run();
    
    return c.json({ success: true });
  } catch (error) {
    console.error('Submit review error:', error);
    return c.json({ success: false, error: 'Failed to submit review' }, 500);
  }
});

// ==========================================
// EXPERT DASHBOARD ROUTES
// ==========================================

// Expert Middleware: Ensure user is an EXPERT or has a verified profile
expertRoutes.use('/dashboard/*', async (c, next) => {
  const user = c.get('user');
  
  if (user.role === 'EXPERT' || user.role === 'SUPER_ADMIN') {
    await next();
    return;
  }
  
  const db = c.get('db');
  const profile = await db.select().from(expertProfiles).where(eq(expertProfiles.userId, user.id)).get();
  
  if (profile && profile.verificationStatus === 'VERIFIED') {
    await next();
    return;
  }

  return c.json({ success: false, error: 'Unauthorized: Expert access required' }, 403);
});

// GET /api/v1/experts/dashboard/me
expertRoutes.get('/dashboard/me', async (c) => {
  const db = c.get('db');
  const user = c.get('user');
  try {
    const profile = await db.select().from(expertProfiles).where(eq(expertProfiles.userId, user.id)).get();
    return c.json({ success: true, data: profile });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to fetch expert profile' }, 500);
  }
});

// PUT /api/v1/experts/dashboard/me
expertRoutes.put('/dashboard/me', async (c) => {
  const db = c.get('db');
  const user = c.get('user');
  const body = await c.req.json();
  try {
    const existing = await db.select().from(expertProfiles).where(eq(expertProfiles.userId, user.id)).get();
    if (!existing) return c.json({ success: false, error: 'Profile not found' }, 404);

    await db.update(expertProfiles).set({
      bio: body.bio || existing.bio,
      experienceYears: body.experienceYears !== undefined ? body.experienceYears : existing.experienceYears,
      languages: body.languages || existing.languages,
      categories: body.categories || existing.categories,
      availabilityStatus: body.availabilityStatus || existing.availabilityStatus,
      updatedAt: new Date()
    }).where(eq(expertProfiles.userId, user.id));

    return c.json({ success: true });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to update profile' }, 500);
  }
});

// GET /api/v1/experts/dashboard/services
expertRoutes.get('/dashboard/services', async (c) => {
  const db = c.get('db');
  const user = c.get('user');
  try {
    const profile = await db.select().from(expertProfiles).where(eq(expertProfiles.userId, user.id)).get();
    if (!profile) return c.json({ success: false, error: 'Profile not found' }, 404);

    const services = await db.select().from(expertServices).where(eq(expertServices.expertId, profile.id)).all();
    return c.json({ success: true, data: services });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to fetch services' }, 500);
  }
});

// POST /api/v1/experts/dashboard/services
expertRoutes.post('/dashboard/services', async (c) => {
  const db = c.get('db');
  const user = c.get('user');
  const body = await c.req.json();
  try {
    const profile = await db.select().from(expertProfiles).where(eq(expertProfiles.userId, user.id)).get();
    if (!profile) return c.json({ success: false, error: 'Profile not found' }, 404);

    const serviceId = `srv_${crypto.randomUUID().replace(/-/g, '').substring(0, 12)}`;
    await db.insert(expertServices).values({
      id: serviceId,
      expertId: profile.id,
      title: body.title,
      description: body.description,
      category: body.category || 'General',
      durationMinutes: body.durationMinutes || 60,
      price: String(body.price),
      currency: body.currency || 'USD',
      pricingType: body.pricingType || 'FIXED',
      status: 'PENDING_APPROVAL', // Admin must approve
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return c.json({ success: true, data: { id: serviceId } });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to create service' }, 500);
  }
});

// PUT /api/v1/experts/dashboard/services/:id
expertRoutes.put('/dashboard/services/:id', async (c) => {
  const db = c.get('db');
  const user = c.get('user');
  const serviceId = c.req.param('id');
  const body = await c.req.json();
  try {
    const profile = await db.select().from(expertProfiles).where(eq(expertProfiles.userId, user.id)).get();
    if (!profile) return c.json({ success: false, error: 'Profile not found' }, 404);

    const service = await db.select().from(expertServices).where(and(eq(expertServices.id, serviceId), eq(expertServices.expertId, profile.id))).get();
    if (!service) return c.json({ success: false, error: 'Service not found' }, 404);

    await db.update(expertServices).set({
      title: body.title || service.title,
      description: body.description || service.description,
      category: body.category || service.category,
      durationMinutes: body.durationMinutes || service.durationMinutes,
      price: body.price ? String(body.price) : service.price,
      currency: body.currency || service.currency,
      status: body.status || service.status, // Allow toggling ACTIVE/PAUSED
      updatedAt: new Date()
    }).where(eq(expertServices.id, serviceId));

    return c.json({ success: true });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to update service' }, 500);
  }
});

// GET /api/v1/experts/dashboard/bookings
expertRoutes.get('/dashboard/bookings', async (c) => {
  const db = c.get('db');
  const user = c.get('user');
  try {
    const profile = await db.select().from(expertProfiles).where(eq(expertProfiles.userId, user.id)).get();
    if (!profile) return c.json({ success: false, error: 'Profile not found' }, 404);

    const bookings = await db.select({
      id: expertBookings.id,
      userId: users.id,
      userDisplayName: users.displayName,
      serviceTitle: expertServices.title,
      price: expertBookings.price,
      currency: expertBookings.currency,
      status: expertBookings.status,
      scheduledAt: expertBookings.scheduledAt,
      createdAt: expertBookings.createdAt
    })
    .from(expertBookings)
    .innerJoin(users, eq(expertBookings.userId, users.id))
    .innerJoin(expertServices, eq(expertBookings.serviceId, expertServices.id))
    .where(eq(expertBookings.expertId, profile.id))
    .orderBy(desc(expertBookings.createdAt))
    .all();

    return c.json({ success: true, data: bookings });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to fetch bookings' }, 500);
  }
});

// POST /api/v1/experts/dashboard/bookings/:id/action
expertRoutes.post('/dashboard/bookings/:id/action', async (c) => {
  const db = c.get('db');
  const user = c.get('user');
  const bookingId = c.req.param('id');
  const { action } = await c.req.json(); // ACCEPT, REJECT, COMPLETE
  
  try {
    const { platformSettings } = require('database');
    const profile = await db.select().from(expertProfiles).where(eq(expertProfiles.userId, user.id)).get();
    if (!profile) return c.json({ success: false, error: 'Profile not found' }, 404);

    const booking = await db.select().from(expertBookings).where(and(eq(expertBookings.id, bookingId), eq(expertBookings.expertId, profile.id))).get();
    if (!booking) return c.json({ success: false, error: 'Booking not found' }, 404);

    const now = new Date();

    if (action === 'ACCEPT' && booking.status === 'PENDING_EXPERT') {
      await db.update(expertBookings).set({ status: 'ACCEPTED', updatedAt: now }).where(eq(expertBookings.id, bookingId));
      return c.json({ success: true });
    }
    
    if (action === 'REJECT' && booking.status === 'PENDING_EXPERT') {
      // Refund Escrow to User
      const userWallet = await db.select().from(wallets).where(and(eq(wallets.userId, booking.userId), eq(wallets.assetSymbol, booking.currency))).get();
      if (userWallet) {
        const refundAmt = parseFloat(booking.price);
        const newEscrow = parseFloat(userWallet.escrowBalance) - refundAmt;
        const newBalance = parseFloat(userWallet.balance) + refundAmt;
        await db.update(wallets).set({ balance: newBalance.toString(), escrowBalance: newEscrow.toString(), updatedAt: now }).where(eq(wallets.id, userWallet.id));
        
        // Record Refund Wallet Tx
        await db.insert(walletTransactions).values({
          id: `txn_${crypto.randomUUID().replace(/-/g, '').substring(0, 12)}`,
          userId: booking.userId,
          type: 'ADJUSTMENT',
          mode: userWallet.type,
          assetSymbol: booking.currency,
          amount: refundAmt.toString(),
          status: 'COMPLETED',
          reference: bookingId,
          createdAt: now,
          updatedAt: now
        }).run();
      }
      
      await db.update(expertBookings).set({ status: 'REFUNDED', updatedAt: now }).where(eq(expertBookings.id, bookingId));
      return c.json({ success: true });
    }

    if (action === 'COMPLETE' && booking.status === 'ACCEPTED') {
      // Finalize Payment: Deduct Escrow from User -> Expert Balance & Platform Revenue
      const price = parseFloat(booking.price);
      
      const commissionSetting = await db.select().from(platformSettings).where(eq(platformSettings.key, 'EXPERT_COMMISSION_PERCENTAGE')).get();
      const commissionRate = commissionSetting ? parseFloat(commissionSetting.value) : 10;
      
      const platformFee = (price * commissionRate) / 100;
      const expertEarnings = price - platformFee;
      
      // 1. Deduct User Escrow and Overall Balance entirely
      const userWallet = await db.select().from(wallets).where(and(eq(wallets.userId, booking.userId), eq(wallets.assetSymbol, booking.currency))).get();
      if (userWallet) {
        const newEscrow = parseFloat(userWallet.escrowBalance) - price;
        const newBalance = parseFloat(userWallet.balance) - price;
        await db.update(wallets).set({ balance: newBalance.toString(), escrowBalance: newEscrow.toString(), updatedAt: now }).where(eq(wallets.id, userWallet.id));
      }
      
      // 2. Add to Expert Real Balance
      const expertWallet = await db.select().from(wallets).where(and(eq(wallets.userId, profile.userId), eq(wallets.assetSymbol, booking.currency))).get();
      if (expertWallet) {
        const newExpertBalance = parseFloat(expertWallet.balance) + expertEarnings;
        await db.update(wallets).set({ balance: newExpertBalance.toString(), updatedAt: now }).where(eq(wallets.id, expertWallet.id));
      } else {
        await db.insert(wallets).values({
          id: `wal_${crypto.randomUUID()}`,
          userId: profile.userId,
          assetSymbol: booking.currency,
          type: 'REAL',
          balance: expertEarnings.toString(),
          lockedBalance: '0',
          escrowBalance: '0',
          createdAt: now,
          updatedAt: now
        }).run();
      }

      // Record Expert Wallet Transaction
      const expertTxId = `txn_${crypto.randomUUID().replace(/-/g, '').substring(0, 12)}`;
      await db.insert(walletTransactions).values({
        id: expertTxId,
        userId: profile.userId,
        type: 'EXPERT_SERVICE',
        mode: 'REAL',
        assetSymbol: booking.currency,
        amount: expertEarnings.toString(),
        status: 'COMPLETED',
        reference: bookingId,
        createdAt: now,
        updatedAt: now
      }).run();
      
      // Record Platform Ledger Entry for Commission
      const ledgerTxId = `ltx_${crypto.randomUUID().replace(/-/g, '').substring(0, 12)}`;
      await db.insert(ledgerTransactions).values({
        id: ledgerTxId,
        idempotencyKey: `comm_${bookingId}`,
        referenceId: bookingId,
        referenceType: 'EXPERT_SERVICE',
        status: 'COMMITTED',
        createdAt: now
      }).run();
      
      await db.insert(ledgerEntries).values({
        id: `len_${crypto.randomUUID().replace(/-/g, '').substring(0, 12)}`,
        transactionId: ledgerTxId,
        accountId: 'SYSTEM_FEE',
        assetSymbol: booking.currency,
        amount: platformFee.toString(),
        direction: 'CREDIT',
        createdAt: now
      }).run();
      
      // 3. Update Booking
      await db.update(expertBookings).set({ 
        status: 'COMPLETED', 
        platformFee: platformFee.toString(),
        expertEarnings: expertEarnings.toString(),
        updatedAt: now 
      }).where(eq(expertBookings.id, bookingId));
      
      // 4. Expert Profile Stats Update
      await db.update(expertProfiles).set({ completedServices: profile.completedServices + 1, updatedAt: now }).where(eq(expertProfiles.id, profile.id));

      return c.json({ success: true });
    }

    return c.json({ success: false, error: 'Invalid action or booking state' }, 400);
  } catch (error: any) {
    console.error(error);
    return c.json({ success: false, error: 'Failed to process booking action' }, 500);
  }
});

