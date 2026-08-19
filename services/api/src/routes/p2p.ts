import { Hono } from 'hono';
import { Decimal } from 'decimal.js';
const runTx = async (db: any, cb: any) => await cb(db);
import { eq, and, desc, or, inArray } from 'drizzle-orm';
import { Bindings, Variables } from '../db';
import { p2pAds, p2pOrders, wallets, p2pMessages, users, ledgerAccounts, ledgerTransactions, ledgerEntries, p2pDisputes, notifications } from 'database';
import { jwtMiddleware } from '../middleware/jwt';
import { generateBusinessId } from '../services/id-generator';

export const p2pRoutes = new Hono<{ Bindings: Bindings; Variables: Variables }>();

// Removed DEFAULT_P2P_ADS array

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

// Removed fake data seeding block

  const formattedAds = adsWithUsers.map(({ ad, user }) => {
    return {
      ...ad,
      paymentMethods: JSON.parse(ad.paymentMethods),
      merchant: {
        id: ad.userId,
        displayName: user?.displayName || `User_${ad.userId.substring(0,4)}`,
        username: user?.email ? user.email.split('@')[0] : `user_${ad.userId.substring(0,4)}`,
        verified: user?.status === 'ACTIVE',
        isMerchant: user?.isMerchant || false,
        completionRate: user?.p2pCompletionRate || "0",
        totalOrders: user?.p2pTotalOrders || 0,
        positiveFeedback: user?.p2pPositiveFeedback || 0,
        negativeFeedback: user?.p2pNegativeFeedback || 0,
        joinedAt: user?.createdAt || new Date().toISOString(),
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
  const { type, asset, fiat, price, isFloating, priceMargin, totalAmount, minLimit, maxLimit, paymentWindow, paymentMethods, terms, autoReply, countryRestrictions } = body;

  const amountNum = parseFloat(totalAmount);

  // If user is SELLING crypto for fiat, they must have the crypto balance
  if (type === 'SELL') {
    let wallet = await db.select().from(wallets).where(and(eq(wallets.userId, user.id), eq(wallets.assetSymbol, asset), eq(wallets.type, mode))).get();
    if (!wallet || parseFloat(wallet.balance) < amountNum) {
      return c.json({ success: false, error: 'Insufficient crypto balance to create this ad.' }, 400);
    }
    
    // Lock the balance into escrowBalance
    const newBalance = (parseFloat(wallet.balance) - amountNum).toString();
    const newEscrow = (parseFloat(wallet.escrowBalance) + amountNum).toString();
    const now = new Date();
    await db.update(wallets).set({ balance: newBalance, escrowBalance: newEscrow, updatedAt: now }).where(eq(wallets.id, wallet.id));
  }

  const now = new Date();
  const dbUser = await db.select().from(users).where(eq(users.id, user.id)).get();
  const adDisplayId = await generateBusinessId(db, dbUser?.email, 'PADS');
  const adId = crypto.randomUUID();
  await db.insert(p2pAds).values({
    id: adId,
    displayId: adDisplayId,
    userId: user.id,
    mode,
    type,
    asset,
    fiat,
    price: price.toString(),
    isFloating: isFloating || false,
    priceMargin: priceMargin ? priceMargin.toString() : null,
    totalAmount: totalAmount.toString(),
    availableAmount: totalAmount.toString(),
    minLimit: minLimit.toString(),
    maxLimit: maxLimit.toString(),
    paymentWindow: paymentWindow || 15,
    paymentMethods: JSON.stringify(paymentMethods),
    terms: terms || '',
    autoReply: autoReply || null,
    countryRestrictions: countryRestrictions ? JSON.stringify(countryRestrictions) : null,
    status: 'ACTIVE',
    createdAt: now,
    updatedAt: now,
  });

  return c.json({ success: true, adId });
});

p2pRoutes.put('/ads/:id', async (c) => {
  const db = c.get('db');
  const user = c.get('user');
  const adId = c.req.param('id');
  const mode = (c.req.header('x-trading-mode') || 'REAL') as 'REAL' | 'DEMO';
  const body = await c.req.json();
  const { type, asset, fiat, priceType, price, minLimit, maxLimit, paymentWindow, paymentMethods, terms, autoReply, countryRestrictions } = body;

  try {
    const existingAd = await db.select().from(p2pAds).where(and(eq(p2pAds.id, adId), eq(p2pAds.userId, user.id))).get();
    if (!existingAd) return c.json({ success: false, error: 'Ad not found' }, 404);

    await db.update(p2pAds).set({
      type: type || existingAd.type,
      asset: asset || existingAd.asset,
      fiat: fiat || existingAd.fiat,
      isFloating: priceType ? priceType === 'floating' : existingAd.isFloating,
      price: price ? String(price) : existingAd.price,
      minLimit: minLimit ? String(minLimit) : existingAd.minLimit,
      maxLimit: maxLimit ? String(maxLimit) : existingAd.maxLimit,
      paymentWindow: paymentWindow || existingAd.paymentWindow,
      paymentMethods: paymentMethods ? JSON.stringify(paymentMethods) : existingAd.paymentMethods,
      terms: terms !== undefined ? terms : existingAd.terms,
      autoReply: autoReply !== undefined ? autoReply : existingAd.autoReply,
      countryRestrictions: countryRestrictions ? JSON.stringify(countryRestrictions) : existingAd.countryRestrictions,
      updatedAt: new Date()
    }).where(eq(p2pAds.id, adId)).run();

    return c.json({ success: true });
  } catch (err) {
    return c.json({ success: false, error: 'Failed to update ad' }, 500);
  }
});

p2pRoutes.put('/ads/:id/status', async (c) => {
  const db = c.get('db');
  const user = c.get('user');
  const adId = c.req.param('id');
  const { status } = await c.req.json();

  try {
    const existingAd = await db.select().from(p2pAds).where(and(eq(p2pAds.id, adId), eq(p2pAds.userId, user.id))).get();
    if (!existingAd) return c.json({ success: false, error: 'Ad not found' }, 404);

    await db.update(p2pAds).set({ status, updatedAt: new Date() }).where(eq(p2pAds.id, adId)).run();
    return c.json({ success: true });
  } catch (err) {
    return c.json({ success: false, error: 'Failed to update ad status' }, 500);
  }
});

p2pRoutes.get('/orders', async (c) => {
  const db = c.get('db');
  const user = c.get('user');
  const mode = (c.req.header('x-trading-mode') || 'REAL') as 'REAL' | 'DEMO';
  
  const orderRows = await db.select({
      order: p2pOrders,
      ad: p2pAds
    })
    .from(p2pOrders)
    .leftJoin(p2pAds, eq(p2pOrders.adId, p2pAds.id))
    .where(and(or(eq(p2pOrders.buyerId, user.id), eq(p2pOrders.sellerId, user.id)), eq(p2pOrders.mode, mode)))
    .orderBy(desc(p2pOrders.createdAt)).all();
    
  const enrichedOrders = orderRows.map(row => {
    const role = row.order.buyerId === user.id ? 'BUYER' : 'SELLER';
    return {
      ...row.order,
      role,
      asset: row.ad ? row.ad.asset : 'Unknown',
      fiatCurrency: row.ad ? row.ad.fiat : 'Unknown',
      type: row.order.buyerId === user.id ? 'BUY' : 'SELL'
    };
  });
    
  return c.json({ success: true, data: enrichedOrders });
});

p2pRoutes.post('/orders', async (c) => {
  const db = c.get('db');
  const user = c.get('user');
  const mode = (c.req.header('x-trading-mode') || 'REAL') as 'REAL' | 'DEMO';
  const body = await c.req.json();
  const { adId, cryptoAmount, fiatAmount, paymentMethod } = body;
  
  try {
    let finalOrderId = '';
    
    await runTx(db, async (tx: any) => {
      const ad = await tx.select().from(p2pAds).where(and(eq(p2pAds.id, adId), eq(p2pAds.mode, mode))).get();
      if (!ad || ad.status !== 'ACTIVE') {
        throw new Error('Ad is no longer active.');
      }
      
      if (user.id === ad.userId) {
        throw new Error('Cannot take your own ad.');
      }

      const cryptoNum = new Decimal(cryptoAmount);
      const availableNum = new Decimal(ad.availableAmount);
      
      if (availableNum.lessThan(cryptoNum)) {
        throw new Error('Not enough crypto available in this ad.');
      }

      const buyerId = ad.type === 'SELL' ? user.id : ad.userId;
      const sellerId = ad.type === 'SELL' ? ad.userId : user.id;
      const now = new Date();

      // If the ad is a BUY ad (the creator wants to buy crypto), 
      // the taker is SELLING crypto. We must lock the taker's crypto now into escrowBalance.
      if (ad.type === 'BUY') {
        const wallet = await tx.select().from(wallets).where(and(eq(wallets.userId, user.id), eq(wallets.assetSymbol, ad.asset), eq(wallets.type, mode))).get();
        if (!wallet || new Decimal(wallet.balance).lessThan(cryptoNum)) {
          throw new Error('Insufficient crypto balance to fulfill this order.');
        }
        const newBalance = new Decimal(wallet.balance).minus(cryptoNum).toString();
        const newEscrow = new Decimal(wallet.escrowBalance).plus(cryptoNum).toString();
        await tx.update(wallets).set({ balance: newBalance, escrowBalance: newEscrow, updatedAt: now }).where(eq(wallets.id, wallet.id));
      }

      // Update Ad available amount
      const newAvailable = availableNum.minus(cryptoNum).toString();
      await tx.update(p2pAds).set({ availableAmount: newAvailable, updatedAt: now }).where(eq(p2pAds.id, ad.id));

      const dbUser = await tx.select().from(users).where(eq(users.id, user.id)).get();
      const orderDisplayId = await generateBusinessId(tx, dbUser?.email, 'ORDE');
      const orderId = crypto.randomUUID();
      finalOrderId = orderId;
      const expiresAt = new Date(now.getTime() + (ad.paymentWindow * 60000));
      
      let paymentDetails = null;
      try {
        const parsedMethods = JSON.parse(ad.paymentMethods);
        if (Array.isArray(parsedMethods)) {
          const selectedMethodObj = parsedMethods.find((m: any) => m.type === paymentMethod || m === paymentMethod);
          if (selectedMethodObj && typeof selectedMethodObj === 'object' && selectedMethodObj.details) {
            paymentDetails = JSON.stringify(selectedMethodObj.details);
          }
        }
      } catch (e) {
        // Ignore JSON parse errors for legacy strings
      }

      await tx.insert(p2pOrders).values({
        id: orderId,
        displayId: orderDisplayId,
        adId,
        buyerId,
        sellerId,
        mode,
        cryptoAmount: cryptoAmount.toString(),
        fiatAmount: fiatAmount.toString(),
        price: ad.price,
        status: 'PAYMENT_PENDING',
        paymentMethod,
        paymentDetails,
        expiresAt,
        createdAt: now,
        updatedAt: now,
      });

      // Notify Ad Owner
      await tx.insert(notifications).values({
        id: `notif_${Date.now()}`,
        userId: ad.userId,
        title: 'New P2P Order',
        message: `A user has taken your P2P ad for ${fiatAmount} ${ad.fiat}. Order ${orderDisplayId} created.`,
        type: 'P2P',
        isRead: false,
        createdAt: now,
      });
    });

    return c.json({ success: true, orderId: finalOrderId });
  } catch (err: any) {
    return c.json({ success: false, error: err.message || 'Failed to create order.' }, 400);
  }
});

p2pRoutes.get('/orders/:id', async (c) => {
  const db = c.get('db');
  const user = c.get('user');
  const mode = (c.req.header('x-trading-mode') || 'REAL') as 'REAL' | 'DEMO';
  const orderId = c.req.param('id');
  
  let orderData = await db
    .select({
      order: p2pOrders,
      ad: p2pAds
    })
    .from(p2pOrders)
    .leftJoin(p2pAds, eq(p2pOrders.adId, p2pAds.id))
    .where(and(eq(p2pOrders.id, orderId), eq(p2pOrders.mode, mode)))
    .get();
    
  if (!orderData) return c.json({ success: false, error: 'Order not found.' }, 404);
  
  let order = orderData.order;
  let ad = orderData.ad;
  
  if (order.buyerId !== user.id && order.sellerId !== user.id && user.role !== 'SUPER_ADMIN') {
    return c.json({ success: false, error: 'Unauthorized.' }, 403);
  }

  const now = new Date();
  // Lazy Expiry Enforcement
  if (['CREATED', 'PAYMENT_PENDING'].includes(order.status) && now.getTime() > new Date(order.expiresAt).getTime()) {
    try {
      await runTx(db, async (tx: any) => {
        const currentOrder = await tx.select().from(p2pOrders).where(eq(p2pOrders.id, order.id)).get();
        if (!currentOrder || !['CREATED', 'PAYMENT_PENDING'].includes(currentOrder.status)) {
          return; // Already handled
        }
        
        if (ad) {
          const cryptoAmount = new Decimal(order.cryptoAmount);
          // Return crypto to Seller's available balance from Escrow
          const sellerWallet = await tx.select().from(wallets).where(and(eq(wallets.userId, order.sellerId), eq(wallets.assetSymbol, ad.asset))).get();
          if (sellerWallet) {
            const finalBalance = new Decimal(sellerWallet.balance).plus(cryptoAmount).toString();
            const finalEscrow = new Decimal(sellerWallet.escrowBalance).minus(cryptoAmount).toString();
            await tx.update(wallets).set({ balance: finalBalance, escrowBalance: finalEscrow, updatedAt: now }).where(eq(wallets.id, sellerWallet.id));
          }
          // Restore ad available amount
          const newAvailable = new Decimal(ad.availableAmount).plus(cryptoAmount).toString();
          await tx.update(p2pAds).set({ availableAmount: newAvailable, updatedAt: now }).where(eq(p2pAds.id, ad.id));
        }
        
        await tx.update(p2pOrders).set({ status: 'EXPIRED', updatedAt: now }).where(eq(p2pOrders.id, order.id));
        order.status = 'EXPIRED';

        // Ledger Reversal
        const txId = crypto.randomUUID();
        const txDisplayId = await generateBusinessId(tx, 'system@system.local', 'LTXN');
        await tx.insert(ledgerTransactions).values({
          id: txId,
          displayId: txDisplayId,
          idempotencyKey: `p2p-expire-${order.id}`,
          environment: order.mode,
          referenceType: 'P2P_ESCROW_REFUND',
          referenceId: order.id,
          status: 'REVERSED',
          createdAt: now,
        });
        
        const counterpartyId = order.buyerId === user.id ? order.sellerId : order.buyerId;
        await tx.insert(notifications).values({
          id: `notif_${Date.now()}_exp`,
          userId: counterpartyId,
          title: 'P2P Order Expired',
          message: `Order ${order.displayId} has expired.`,
          type: 'P2P',
          isRead: false,
          createdAt: now,
        });
      });
    } catch (e) {
      console.error('Failed to process lazy expiry:', e);
    }
  }
  
  // Fetch counterparty for UI
  const counterpartyId = order.buyerId === user.id ? order.sellerId : order.buyerId;
  const cp = await db.select().from(users).where(eq(users.id, counterpartyId)).get();
  
  const role = order.buyerId === user.id ? 'BUYER' : (order.sellerId === user.id ? 'SELLER' : 'ADMIN');
  const enrichedOrder = {
    ...order,
    role,
    asset: ad ? ad.asset : 'Unknown',
    fiatCurrency: ad ? ad.fiat : 'Unknown',
    permissions: {
      canMarkPaid: role === 'BUYER' && order.status === 'PAYMENT_PENDING',
      canConfirmPayment: false, 
      canReleaseCrypto: role === 'SELLER' && (order.status === 'BUYER_MARKED_PAID' || order.status === 'SELLER_PAYMENT_REVIEW'),
      canCancel: role === 'BUYER' && order.status === 'PAYMENT_PENDING',
      canDispute: ['PAYMENT_PENDING', 'BUYER_MARKED_PAID', 'SELLER_PAYMENT_REVIEW'].includes(order.status)
    }
  };

  return c.json({ 
    success: true, 
    data: enrichedOrder, 
    merchant: cp ? {
      id: cp.id,
      displayName: cp.displayName || `User_${cp.id.substring(0,4)}`,
      username: cp.email ? cp.email.split('@')[0] : `user_${cp.id.substring(0,4)}`,
      verified: cp.status === 'ACTIVE',
      completionRate: cp.p2pCompletionRate || "0",
      totalOrders: cp.p2pTotalOrders || 0,
      online: true, // For now assuming online if interacting
      joinedAt: cp.createdAt
    } : null 
  });
});

p2pRoutes.get('/orders/:id/messages', async (c) => {
  const db = c.get('db');
  const user = c.get('user');
  const mode = (c.req.header('x-trading-mode') || 'REAL') as 'REAL' | 'DEMO';
  const orderId = c.req.param('id');
  
  const order = await db.select().from(p2pOrders).where(and(eq(p2pOrders.id, orderId), eq(p2pOrders.mode, mode))).get();
  if (!order || (order.buyerId !== user.id && order.sellerId !== user.id && user.role !== 'SUPER_ADMIN')) {
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
  if (!order || (order.buyerId !== user.id && order.sellerId !== user.id && user.role !== 'SUPER_ADMIN')) {
    return c.json({ success: false, error: 'Unauthorized' }, 403);
  }
  
  const msgId = `msg_${Date.now()}`;
  const now = new Date();
  await db.insert(p2pMessages).values({
    id: msgId,
    orderId,
    senderId: user.id,
    mode,
    content: body.content,
    type: body.type || 'TEXT',
    attachmentUrl: body.attachmentUrl,
    createdAt: now,
  });
  
  // Notify Counterparty
  const counterpartyId = order.buyerId === user.id ? order.sellerId : order.buyerId;
  await db.insert(notifications).values({
    id: `notif_${Date.now()}_msg`,
    userId: counterpartyId,
    title: 'New P2P Message',
    message: `You have a new message regarding Order ${orderId}`,
    type: 'P2P',
    isRead: false,
    createdAt: now,
  });
  
  return c.json({ success: true, messageId: msgId });
});

p2pRoutes.post('/orders/:id/mark-paid', async (c) => {
  const db = c.get('db');
  const user = c.get('user');
  const orderId = c.req.param('id');
  
  const order = await db.select().from(p2pOrders).where(eq(p2pOrders.id, orderId)).get();
  if (!order || order.status !== 'PAYMENT_PENDING') return c.json({ success: false, error: 'Invalid order state.' }, 400);
  if (order.buyerId !== user.id) return c.json({ success: false, error: 'Only buyer can mark as paid.' }, 403);
  if (new Date().getTime() > new Date(order.expiresAt).getTime()) return c.json({ success: false, error: 'Order has expired.' }, 400);
  
  const result = await db.update(p2pOrders).set({ status: 'BUYER_MARKED_PAID', updatedAt: new Date() }).where(and(eq(p2pOrders.id, order.id), eq(p2pOrders.status, 'PAYMENT_PENDING'))).returning();
  if (result.length === 0) return c.json({ success: false, error: 'Race condition detected.' }, 409);
  
  // System Message
  const now = new Date();
  await db.insert(p2pMessages).values({
    id: `sysmsg_${Date.now()}`,
    orderId,
    senderId: user.id,
    mode: order.mode,
    content: "Buyer has marked the order as paid. Seller, please review the payment.",
    type: 'SYSTEM',
    createdAt: now,
  });

  // Notify Seller
  await db.insert(notifications).values({
    id: `notif_${Date.now()}`,
    userId: order.sellerId,
    title: 'P2P Payment Confirmed',
    message: `Buyer has marked Order ${orderId} as paid. Please review the payment.`,
    type: 'P2P',
    isRead: false,
    createdAt: now,
  });

  return c.json({ success: true });
});

p2pRoutes.post('/orders/:id/release', async (c) => {
  const db = c.get('db');
  const user = c.get('user');
  const orderId = c.req.param('id');
  
  try {
    await runTx(db, async (tx: any) => {
      const order = await tx.select().from(p2pOrders).where(eq(p2pOrders.id, orderId)).get();
      if (!order || (order.status !== 'BUYER_MARKED_PAID' && order.status !== 'SELLER_PAYMENT_REVIEW')) {
        throw new Error('Order cannot be released in this state.');
      }
      if (order.sellerId !== user.id && user.role !== 'SUPER_ADMIN') {
        throw new Error('Only seller or admin can release.');
      }
      
      const result = await tx.update(p2pOrders).set({ status: 'COMPLETED', updatedAt: new Date() }).where(and(eq(p2pOrders.id, order.id), or(eq(p2pOrders.status, 'BUYER_MARKED_PAID'), eq(p2pOrders.status, 'SELLER_PAYMENT_REVIEW')))).returning();
      if (result.length === 0) throw new Error('Race condition detected.');

      const ad = await tx.select().from(p2pAds).where(eq(p2pAds.id, order.adId)).get();
      if (!ad) throw new Error('Ad not found');

      const now = new Date();
      const cryptoAmount = new Decimal(order.cryptoAmount);
      
      // Deduct from Seller's escrow balance
      const sellerWallet = await tx.select().from(wallets).where(and(eq(wallets.userId, order.sellerId), eq(wallets.assetSymbol, ad.asset))).get();
      if (sellerWallet) {
        const finalEscrow = new Decimal(sellerWallet.escrowBalance).minus(cryptoAmount).toString();
        await tx.update(wallets).set({ escrowBalance: finalEscrow, updatedAt: now }).where(eq(wallets.id, sellerWallet.id));
      }

      // Add to Buyer's available balance
      const buyerWallet = await tx.select().from(wallets).where(and(eq(wallets.userId, order.buyerId), eq(wallets.assetSymbol, ad.asset))).get();
      if (buyerWallet) {
        const finalBalance = new Decimal(buyerWallet.balance).plus(cryptoAmount).toString();
        await tx.update(wallets).set({ balance: finalBalance, updatedAt: now }).where(eq(wallets.id, buyerWallet.id));
      } else {
        await tx.insert(wallets).values({
          id: crypto.randomUUID(),
          userId: order.buyerId,
          assetSymbol: ad.asset,
          balance: cryptoAmount.toString(),
          lockedBalance: '0',
          escrowBalance: '0',
          type: order.mode,
          createdAt: now,
          updatedAt: now,
        });
      }

      // Ledger Entries for Seller
      const txIdSeller = crypto.randomUUID();
      const txDisplayIdSeller = await generateBusinessId(tx, user?.email, 'LTXN');
      await tx.insert(ledgerTransactions).values({
        id: txIdSeller,
        displayId: txDisplayIdSeller,
        idempotencyKey: `p2p-release-seller-${order.id}`,
        environment: order.mode,
        referenceType: 'P2P_ESCROW_RELEASE',
        referenceId: order.id,
        status: 'COMMITTED',
        createdAt: now,
      });

      await tx.insert(ledgerEntries).values({
        id: crypto.randomUUID(),
        transactionId: txIdSeller,
        accountId: order.sellerId,
        type: 'DEBIT',
        asset: ad.asset,
        amount: cryptoAmount.toString(),
        description: `P2P Order ${order.displayId} Crypto Release`,
        createdAt: now,
      });

      // Ledger Entries for Buyer
      const txIdBuyer = crypto.randomUUID();
      const txDisplayIdBuyer = await generateBusinessId(tx, 'buyer@system.local', 'LTXN');
      await tx.insert(ledgerTransactions).values({
        id: txIdBuyer,
        displayId: txDisplayIdBuyer,
        idempotencyKey: `p2p-release-buyer-${order.id}`,
        environment: order.mode,
        referenceType: 'P2P_ESCROW_CREDIT',
        referenceId: order.id,
        status: 'COMMITTED',
        createdAt: now,
      });

      await tx.insert(ledgerEntries).values({
        id: crypto.randomUUID(),
        transactionId: txIdBuyer,
        accountId: order.buyerId,
        type: 'CREDIT',
        asset: ad.asset,
        amount: cryptoAmount.toString(),
        description: `P2P Order ${order.displayId} Crypto Received`,
        createdAt: now,
      });
      
      const sellerUser = await tx.select().from(users).where(eq(users.id, order.sellerId)).get();
      const buyerUser = await tx.select().from(users).where(eq(users.id, order.buyerId)).get();
      
      if (sellerUser) {
        await tx.update(users).set({ p2pTotalOrders: (sellerUser.p2pTotalOrders || 0) + 1 }).where(eq(users.id, order.sellerId));
      }
      if (buyerUser) {
        await tx.update(users).set({ p2pTotalOrders: (buyerUser.p2pTotalOrders || 0) + 1 }).where(eq(users.id, order.buyerId));
      }
      
      await tx.insert(notifications).values({
        id: `notif_${Date.now()}_comp`,
        userId: order.buyerId,
        title: 'P2P Order Completed',
        message: `Seller has released the crypto for Order ${order.displayId}.`,
        type: 'P2P',
        isRead: false,
        createdAt: now,
      });
    });
    
    return c.json({ success: true });
  } catch (err: any) {
    return c.json({ success: false, error: err.message || 'Transaction failed.' }, 400);
  }
});

p2pRoutes.post('/orders/:id/cancel', async (c) => {
  const db = c.get('db');
  const user = c.get('user');
  const orderId = c.req.param('id');
  
  try {
    await runTx(db, async (tx: any) => {
      const order = await tx.select().from(p2pOrders).where(eq(p2pOrders.id, orderId)).get();
      if (!order || !['CREATED', 'PAYMENT_PENDING', 'BUYER_MARKED_PAID'].includes(order.status)) {
        throw new Error('Cannot cancel this order.');
      }
      
      if (order.buyerId !== user.id && order.sellerId !== user.id && user.role !== 'SUPER_ADMIN') {
        throw new Error('Unauthorized.');
      }

      const result = await tx.update(p2pOrders).set({ status: 'CANCELLED', updatedAt: new Date() }).where(and(eq(p2pOrders.id, order.id), inArray(p2pOrders.status, ['CREATED', 'PAYMENT_PENDING', 'BUYER_MARKED_PAID']))).returning();
      if (result.length === 0) throw new Error('Race condition detected.');

      const ad = await tx.select().from(p2pAds).where(eq(p2pAds.id, order.adId)).get();
      if (!ad) throw new Error('Ad not found');

      const now = new Date();
      const cryptoAmount = new Decimal(order.cryptoAmount);
      
      // Return crypto to Seller's available balance from Escrow
      const sellerWallet = await tx.select().from(wallets).where(and(eq(wallets.userId, order.sellerId), eq(wallets.assetSymbol, ad.asset))).get();
      if (sellerWallet) {
        const finalBalance = new Decimal(sellerWallet.balance).plus(cryptoAmount).toString();
        const finalEscrow = new Decimal(sellerWallet.escrowBalance).minus(cryptoAmount).toString();
        await tx.update(wallets).set({ balance: finalBalance, escrowBalance: finalEscrow, updatedAt: now }).where(eq(wallets.id, sellerWallet.id));
      }

      // Restore ad available amount if it was an active ad
      const newAvailable = new Decimal(ad.availableAmount).plus(cryptoAmount).toString();
      await tx.update(p2pAds).set({ availableAmount: newAvailable, updatedAt: now }).where(eq(p2pAds.id, ad.id));

      // Ledger Reversal
      const txId = crypto.randomUUID();
      const txDisplayId = await generateBusinessId(tx, user?.email, 'LTXN');
      await tx.insert(ledgerTransactions).values({
        id: txId,
        displayId: txDisplayId,
        idempotencyKey: `p2p-cancel-${order.id}`,
        environment: order.mode,
        referenceType: 'P2P_ESCROW_REFUND',
        referenceId: order.id,
        status: 'REVERSED',
        createdAt: now,
      });

      // Notify Counterparty
      const counterpartyId = order.buyerId === user.id ? order.sellerId : order.buyerId;
      await tx.insert(notifications).values({
        id: `notif_${Date.now()}`,
        userId: counterpartyId,
        title: 'P2P Order Cancelled',
        message: `Order ${order.displayId} has been cancelled.`,
        type: 'P2P',
        isRead: false,
        createdAt: now,
      });
    });

    return c.json({ success: true });
  } catch (err: any) {
    return c.json({ success: false, error: err.message || 'Cancellation failed.' }, 400);
  }
});

p2pRoutes.post('/orders/:id/dispute', async (c) => {
  const db = c.get('db');
  const user = c.get('user');
  const orderId = c.req.param('id');
  const body = await c.req.json();
  
  const order = await db.select().from(p2pOrders).where(eq(p2pOrders.id, orderId)).get();
  if (!order || !['BUYER_MARKED_PAID', 'SELLER_PAYMENT_REVIEW'].includes(order.status)) {
    return c.json({ success: false, error: 'Order cannot be disputed in this state.' }, 400);
  }
  if (order.buyerId !== user.id && order.sellerId !== user.id) {
    return c.json({ success: false, error: 'Only participants can dispute.' }, 403);
  }

  const result = await db.update(p2pOrders).set({ status: 'DISPUTED', updatedAt: new Date() }).where(and(eq(p2pOrders.id, order.id), inArray(p2pOrders.status, ['BUYER_MARKED_PAID', 'SELLER_PAYMENT_REVIEW']))).returning();
  if (result.length === 0) return c.json({ success: false, error: 'Race condition detected.' }, 409);

  const now = new Date();
  const dbUser = await db.select().from(users).where(eq(users.id, user.id)).get();
  const disputeDisplayId = await generateBusinessId(db, dbUser?.email, 'DISP');
  const disputeId = crypto.randomUUID();
  await db.insert(p2pDisputes).values({
    id: disputeId,
    displayId: disputeDisplayId,
    orderId: order.id,
    openerId: user.id,
    reason: body.reason || 'Payment issue',
    evidenceUrls: body.evidenceUrls ? JSON.stringify(body.evidenceUrls) : null,
    status: 'OPEN',
    createdAt: now,
    updatedAt: now,
  });

  // Status updated earlier
  // await db.update(p2pOrders).set({ status: 'DISPUTED', updatedAt: now }).where(eq(p2pOrders.id, order.id));

  // System Message
  await db.insert(p2pMessages).values({
    id: `sysmsg_${Date.now()}`,
    orderId,
    senderId: user.id,
    mode: order.mode,
    content: "Order has been DISPUTED. An admin will review the trade shortly.",
    type: 'SYSTEM',
    createdAt: now,
  });

  // Notify Counterparty
  const counterpartyId = order.buyerId === user.id ? order.sellerId : order.buyerId;
  await db.insert(notifications).values({
    id: `notif_${Date.now()}_disp`,
    userId: counterpartyId,
    title: 'P2P Order Disputed',
    message: `A dispute has been opened for Order ${orderId}.`,
    type: 'P2P',
    isRead: false,
    createdAt: now,
  });

  return c.json({ success: true, disputeId });
});

p2pRoutes.get('/disputes', async (c) => {
  const db = c.get('db');
  const user = c.get('user');
  
  if (user.role !== 'SUPER_ADMIN' && user.role !== 'SUPPORT_ADMIN') {
    return c.json({ success: false, error: 'Unauthorized.' }, 403);
  }
  
  const disputes = await db.select().from(p2pDisputes).orderBy(desc(p2pDisputes.createdAt)).all();
  return c.json({ success: true, data: disputes });
});
