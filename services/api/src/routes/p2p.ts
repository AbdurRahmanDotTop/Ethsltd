import { Hono } from 'hono';
import { eq, and, desc, or } from 'drizzle-orm';
import { Bindings, Variables } from '../db';
import { p2pAds, p2pOrders, wallets, p2pMessages, users } from 'database';
import { jwtMiddleware } from '../middleware/jwt';

export const p2pRoutes = new Hono<{ Bindings: Bindings; Variables: Variables }>();

const DEFAULT_P2P_ADS = [
  { id: 'ad-1', type: 'SELL' as const, asset: 'USDT', fiat: 'USD', price: '1.02', totalAmount: '1000', availableAmount: '1000', minLimit: '50', maxLimit: '1000', paymentMethods: JSON.stringify(['Bank Transfer']), status: 'ACTIVE' as const },
  { id: 'ad-2', type: 'BUY' as const, asset: 'USDT', fiat: 'USD', price: '0.98', totalAmount: '5000', availableAmount: '5000', minLimit: '100', maxLimit: '5000', paymentMethods: JSON.stringify(['Zelle', 'PayPal']), status: 'ACTIVE' as const },
  { id: 'ad-3', type: 'SELL' as const, asset: 'BTC', fiat: 'USD', price: '105000', totalAmount: '0.5', availableAmount: '0.5', minLimit: '500', maxLimit: '50000', paymentMethods: JSON.stringify(['Bank Transfer', 'Wire']), status: 'ACTIVE' as const }
];

p2pRoutes.get('/ads', async (c) => {
  const db = c.get('db');
  const mode = (c.req.header('x-trading-mode') || 'REAL') as 'REAL' | 'DEMO';
  
  let adsWithUsers = await db
    .select({
      ad: p2pAds,
      user: users
    })
    .from(p2pAds)
    .leftJoin(users, eq(p2pAds.userId, users.id))
    .where(and(eq(p2pAds.status, 'ACTIVE'), eq(p2pAds.mode, mode)))
    .orderBy(desc(p2pAds.createdAt))
    .all();

  if (adsWithUsers.length === 0) {
    const now = new Date();
    const dummyUserId = 'system-user-id'; 
    await db.insert(p2pAds).values(DEFAULT_P2P_ADS.map(ad => ({
      ...ad,
      mode,
      userId: dummyUserId,
      createdAt: now,
      updatedAt: now
    })));
    adsWithUsers = await db
      .select({ ad: p2pAds, user: users })
      .from(p2pAds)
      .leftJoin(users, eq(p2pAds.userId, users.id))
      .where(and(eq(p2pAds.status, 'ACTIVE'), eq(p2pAds.mode, mode)))
      .orderBy(desc(p2pAds.createdAt))
      .all();
  }

  const formattedAds = adsWithUsers.map(({ ad, user }) => {
    return {
      ...ad,
      paymentMethods: JSON.parse(ad.paymentMethods),
      merchant: {
        id: ad.userId,
        displayName: user?.displayName || `User_${ad.userId.substring(0,4)}`,
        username: user?.email ? user.email.split('@')[0] : `user_${ad.userId.substring(0,4)}`,
        verified: user?.status === 'ACTIVE',
        completionRate: 98,
        totalOrders: 150,
        averageReleaseTime: 5,
        online: true,
        positiveFeedback: 148,
        negativeFeedback: 2,
        joinedAt: user?.createdAt || new Date().toISOString(),
        supportedPaymentMethods: ["Bank Transfer"], // mocked for now until merchant profile table is built
      }
    };
  });

  return c.json({ success: true, data: formattedAds });
});

// Secure all other routes
p2pRoutes.use('*', jwtMiddleware);

p2pRoutes.post('/ads', async (c) => {
  const db = c.get('db');
  const user = c.get('user');
  const mode = (c.req.header('x-trading-mode') || 'REAL') as 'REAL' | 'DEMO';
  const body = await c.req.json();
  const { type, asset, fiat, price, totalAmount, minLimit, maxLimit, paymentMethods, terms } = body;

  const amountNum = parseFloat(totalAmount);

  // If user is SELLING crypto for fiat, they must have the crypto balance
  if (type === 'SELL') {
    let wallet = await db.select().from(wallets).where(and(eq(wallets.userId, user.id), eq(wallets.assetSymbol, asset), eq(wallets.type, mode))).get();
    if (!wallet || parseFloat(wallet.balance) < amountNum) {
      return c.json({ success: false, error: 'Insufficient crypto balance to create this ad.' }, 400);
    }
    
    // Lock the balance immediately
    const newBalance = (parseFloat(wallet.balance) - amountNum).toString();
    const newLocked = (parseFloat(wallet.lockedBalance) + amountNum).toString();
    const now = new Date();
    await db.update(wallets).set({ balance: newBalance, lockedBalance: newLocked, updatedAt: now }).where(eq(wallets.id, wallet.id));
  }

  const now = new Date();
  const adId = `AD-${Date.now()}`;
  await db.insert(p2pAds).values({
    id: adId,
    userId: user.id,
    mode,
    type,
    asset,
    fiat,
    price: price.toString(),
    totalAmount: totalAmount.toString(),
    availableAmount: totalAmount.toString(),
    minLimit: minLimit.toString(),
    maxLimit: maxLimit.toString(),
    paymentMethods: JSON.stringify(paymentMethods),
    terms: terms || '',
    status: 'ACTIVE',
    createdAt: now,
    updatedAt: now,
  });

  return c.json({ success: true, adId });
});

p2pRoutes.get('/orders', async (c) => {
  const db = c.get('db');
  const user = c.get('user');
  const mode = (c.req.header('x-trading-mode') || 'REAL') as 'REAL' | 'DEMO';
  
  const userOrders = await db.select().from(p2pOrders)
    .where(and(or(eq(p2pOrders.buyerId, user.id), eq(p2pOrders.sellerId, user.id)), eq(p2pOrders.mode, mode)))
    .orderBy(desc(p2pOrders.createdAt)).all();
    
  return c.json({ success: true, data: userOrders });
});

p2pRoutes.post('/orders', async (c) => {
  const db = c.get('db');
  const user = c.get('user');
  const mode = (c.req.header('x-trading-mode') || 'REAL') as 'REAL' | 'DEMO';
  const body = await c.req.json();
  const { adId, cryptoAmount, fiatAmount, paymentMethod } = body;
  
  const ad = await db.select().from(p2pAds).where(and(eq(p2pAds.id, adId), eq(p2pAds.mode, mode))).get();
  if (!ad || ad.status !== 'ACTIVE') {
    return c.json({ success: false, error: 'Ad is no longer active.' }, 400);
  }
  
  if (user.id === ad.userId) {
    return c.json({ success: false, error: 'Cannot take your own ad.' }, 400);
  }

  const cryptoNum = parseFloat(cryptoAmount);
  
  if (parseFloat(ad.availableAmount) < cryptoNum) {
    return c.json({ success: false, error: 'Not enough crypto available in this ad.' }, 400);
  }

  const buyerId = ad.type === 'SELL' ? user.id : ad.userId;
  const sellerId = ad.type === 'SELL' ? ad.userId : user.id;
  const now = new Date();

  // If the ad is a BUY ad (the creator wants to buy crypto), 
  // the taker is SELLING crypto. We must lock the taker's crypto now.
  if (ad.type === 'BUY') {
    let wallet = await db.select().from(wallets).where(and(eq(wallets.userId, user.id), eq(wallets.assetSymbol, ad.asset), eq(wallets.type, mode))).get();
    if (!wallet || parseFloat(wallet.balance) < cryptoNum) {
      return c.json({ success: false, error: 'Insufficient crypto balance to fulfill this order.' }, 400);
    }
    const newBalance = (parseFloat(wallet.balance) - cryptoNum).toString();
    const newLocked = (parseFloat(wallet.lockedBalance) + cryptoNum).toString();
    await db.update(wallets).set({ balance: newBalance, lockedBalance: newLocked, updatedAt: now }).where(eq(wallets.id, wallet.id));
  }

  // Update Ad available amount
  const newAvailable = (parseFloat(ad.availableAmount) - cryptoNum).toString();
  await db.update(p2pAds).set({ availableAmount: newAvailable, updatedAt: now }).where(eq(p2pAds.id, ad.id));

  const orderId = `P2P-ORD-${Date.now()}`;
  const expiresAt = new Date(now.getTime() + 15 * 60000); // 15 mins expiry
  
  await db.insert(p2pOrders).values({
    id: orderId,
    adId,
    buyerId,
    sellerId,
    mode,
    cryptoAmount: cryptoAmount.toString(),
    fiatAmount: fiatAmount.toString(),
    price: ad.price,
    status: 'PENDING',
    paymentMethod,
    expiresAt,
    createdAt: now,
    updatedAt: now,
  });

  return c.json({ success: true, orderId });
});

p2pRoutes.get('/orders/:id', async (c) => {
  const db = c.get('db');
  const user = c.get('user');
  const mode = (c.req.header('x-trading-mode') || 'REAL') as 'REAL' | 'DEMO';
  const orderId = c.req.param('id');
  
  const order = await db.select().from(p2pOrders).where(and(eq(p2pOrders.id, orderId), eq(p2pOrders.mode, mode))).get();
  if (!order) return c.json({ success: false, error: 'Order not found.' }, 404);
  
  if (order.buyerId !== user.id && order.sellerId !== user.id) {
    return c.json({ success: false, error: 'Unauthorized.' }, 403);
  }
  
  return c.json({ success: true, data: order });
});

p2pRoutes.get('/orders/:id/messages', async (c) => {
  const db = c.get('db');
  const user = c.get('user');
  const mode = (c.req.header('x-trading-mode') || 'REAL') as 'REAL' | 'DEMO';
  const orderId = c.req.param('id');
  
  const order = await db.select().from(p2pOrders).where(and(eq(p2pOrders.id, orderId), eq(p2pOrders.mode, mode))).get();
  if (!order || (order.buyerId !== user.id && order.sellerId !== user.id)) {
    return c.json({ success: false, error: 'Unauthorized' }, 403);
  }
  
  const msgs = await db.select().from(p2pMessages)
    .where(and(eq(p2pMessages.orderId, orderId), eq(p2pMessages.mode, mode)))
    .orderBy(p2pMessages.createdAt).all();
    
  return c.json({ success: true, data: msgs });
});

p2pRoutes.post('/orders/:id/messages', async (c) => {
  const db = c.get('db');
  const user = c.get('user');
  const mode = (c.req.header('x-trading-mode') || 'REAL') as 'REAL' | 'DEMO';
  const orderId = c.req.param('id');
  const body = await c.req.json();
  
  const order = await db.select().from(p2pOrders).where(and(eq(p2pOrders.id, orderId), eq(p2pOrders.mode, mode))).get();
  if (!order || (order.buyerId !== user.id && order.sellerId !== user.id)) {
    return c.json({ success: false, error: 'Unauthorized' }, 403);
  }
  
  const msgId = `msg_${Date.now()}`;
  await db.insert(p2pMessages).values({
    id: msgId,
    orderId,
    senderId: user.id,
    mode,
    content: body.content,
    createdAt: new Date(),
  });
  
  return c.json({ success: true, messageId: msgId });
});

p2pRoutes.post('/orders/:id/pay', async (c) => {
  const db = c.get('db');
  const user = c.get('user');
  const orderId = c.req.param('id');
  
  const order = await db.select().from(p2pOrders).where(eq(p2pOrders.id, orderId)).get();
  if (!order || order.status !== 'PENDING') return c.json({ success: false, error: 'Invalid order state.' }, 400);
  if (order.buyerId !== user.id) return c.json({ success: false, error: 'Only buyer can mark as paid.' }, 403);
  
  await db.update(p2pOrders).set({ status: 'PAID', updatedAt: new Date() }).where(eq(p2pOrders.id, order.id));
  return c.json({ success: true });
});

p2pRoutes.post('/orders/:id/release', async (c) => {
  const db = c.get('db');
  const user = c.get('user');
  const orderId = c.req.param('id');
  
  const order = await db.select().from(p2pOrders).where(eq(p2pOrders.id, orderId)).get();
  if (!order || order.status !== 'PAID') return c.json({ success: false, error: 'Order must be PAID to release.' }, 400);
  if (order.sellerId !== user.id) return c.json({ success: false, error: 'Only seller can release.' }, 403);
  
  const ad = await db.select().from(p2pAds).where(eq(p2pAds.id, order.adId)).get();
  if (!ad) return c.json({ success: false, error: 'Ad not found' }, 400);

  const now = new Date();
  
  // Deduct from Seller's locked balance
  const cryptoNum = parseFloat(order.cryptoAmount);
  const sellerWallet = await db.select().from(wallets).where(and(eq(wallets.userId, order.sellerId), eq(wallets.assetSymbol, ad.asset))).get();
  if (sellerWallet) {
    const finalLocked = (parseFloat(sellerWallet.lockedBalance) - cryptoNum).toString();
    await db.update(wallets).set({ lockedBalance: finalLocked, updatedAt: now }).where(eq(wallets.id, sellerWallet.id));
  }

  // Add to Buyer's available balance
  const buyerWallet = await db.select().from(wallets).where(and(eq(wallets.userId, order.buyerId), eq(wallets.assetSymbol, ad.asset))).get();
  if (buyerWallet) {
    const finalBalance = (parseFloat(buyerWallet.balance) + cryptoNum).toString();
    await db.update(wallets).set({ balance: finalBalance, updatedAt: now }).where(eq(wallets.id, buyerWallet.id));
  } else {
    await db.insert(wallets).values({
      id: crypto.randomUUID(),
      userId: order.buyerId,
      assetSymbol: ad.asset,
      balance: cryptoNum.toString(),
      lockedBalance: '0',
      createdAt: now,
      updatedAt: now,
    });
  }

  await db.update(p2pOrders).set({ status: 'RELEASED', updatedAt: now }).where(eq(p2pOrders.id, order.id));
  return c.json({ success: true });
});

p2pRoutes.post('/orders/:id/cancel', async (c) => {
  const db = c.get('db');
  const user = c.get('user');
  const orderId = c.req.param('id');
  
  const order = await db.select().from(p2pOrders).where(eq(p2pOrders.id, orderId)).get();
  if (!order || !['PENDING', 'PAID'].includes(order.status)) return c.json({ success: false, error: 'Cannot cancel this order.' }, 400);
  
  // Both buyer and seller can cancel, but typically if PAID, only seller/admin can cancel. For MVP we allow both.
  const ad = await db.select().from(p2pAds).where(eq(p2pAds.id, order.adId)).get();
  if (!ad) return c.json({ success: false, error: 'Ad not found' }, 400);

  const now = new Date();
  const cryptoNum = parseFloat(order.cryptoAmount);
  
  // Return crypto to Seller's available balance
  const sellerWallet = await db.select().from(wallets).where(and(eq(wallets.userId, order.sellerId), eq(wallets.assetSymbol, ad.asset))).get();
  if (sellerWallet) {
    const finalBalance = (parseFloat(sellerWallet.balance) + cryptoNum).toString();
    const finalLocked = (parseFloat(sellerWallet.lockedBalance) - cryptoNum).toString();
    await db.update(wallets).set({ balance: finalBalance, lockedBalance: finalLocked, updatedAt: now }).where(eq(wallets.id, sellerWallet.id));
  }

  // Restore ad available amount if it was an active ad
  const newAvailable = (parseFloat(ad.availableAmount) + cryptoNum).toString();
  await db.update(p2pAds).set({ availableAmount: newAvailable, updatedAt: now }).where(eq(p2pAds.id, ad.id));

  await db.update(p2pOrders).set({ status: 'CANCELLED', updatedAt: now }).where(eq(p2pOrders.id, order.id));
  return c.json({ success: true });
});
