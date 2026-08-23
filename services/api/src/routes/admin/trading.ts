import { Hono } from 'hono';
import { eq, desc, and, sql } from 'drizzle-orm';
import { Bindings, Variables } from '../../db';
import { markets, orders, trades, users } from 'database';
import { jwtMiddleware } from '../../middleware/jwt';

export const adminTradingRoutes = new Hono<{ Bindings: Bindings; Variables: Variables }>();

adminTradingRoutes.use('*', jwtMiddleware);

adminTradingRoutes.use('*', async (c, next) => {
  const user = c.get('user');
  if (!['SUPER_ADMIN', 'COMPLIANCE_ADMIN', 'SUPPORT_ADMIN', 'ADMIN'].includes(user.role)) {
    return c.json({ success: false, error: 'Unauthorized' }, 403);
  }
  await next();
});

adminTradingRoutes.get('/markets', async (c) => {
  const db = c.get('db');
  const mode = c.req.query('mode') || 'REAL';
  
  try {
    const allMarkets = await db.select().from(markets).all();
    
    // We fetch trades to calculate 24h volume
    const now = Date.now();
    const allTrades = await db.select().from(trades)
      .where(and(eq(trades.mode, mode as any), sql`created_at > ${now - 86400000}`))
      .all();
      
    const results = allMarkets.map(m => {
      let volume24h = 0;
      allTrades.forEach(t => {
        if (t.marketSymbol === m.symbol) {
          volume24h += parseFloat(t.amount) * parseFloat(t.price);
        }
      });
      return {
        ...m,
        volume24h
      };
    });
    
    return c.json({ success: true, data: results });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

adminTradingRoutes.post('/markets', async (c) => {
  const db = c.get('db');
  const body = await c.req.json();
  const { symbol, baseAsset, quoteAsset, minPrice, maxPrice, tickSize, minAmount, stepSize } = body;
  
  if (!symbol || !baseAsset || !quoteAsset || !minPrice || !maxPrice || !tickSize || !minAmount || !stepSize) {
    return c.json({ success: false, error: 'Missing required fields' }, 400);
  }
  
  try {
    const { platformSettings } = require('database');
    const makerSetting = await db.select().from(platformSettings).where(eq(platformSettings.key, 'TRADING_FEE_MAKER')).get();
    const takerSetting = await db.select().from(platformSettings).where(eq(platformSettings.key, 'TRADING_FEE_TAKER')).get();
    
    let makerFee = '0.001';
    let takerFee = '0.001';
    
    if (makerSetting) {
      try {
        const parsed = JSON.parse(String(makerSetting.value));
        if (parsed?.percentage !== undefined) makerFee = String(parsed.percentage);
      } catch (e) {}
    }
    
    if (takerSetting) {
      try {
        const parsed = JSON.parse(String(takerSetting.value));
        if (parsed?.percentage !== undefined) takerFee = String(parsed.percentage);
      } catch (e) {}
    }

    const newMarket = {
      id: crypto.randomUUID(),
      symbol: symbol.toUpperCase(),
      baseAsset: baseAsset.toUpperCase(),
      quoteAsset: quoteAsset.toUpperCase(),
      minPrice: String(minPrice),
      maxPrice: String(maxPrice),
      tickSize: String(tickSize),
      minAmount: String(minAmount),
      stepSize: String(stepSize),
      makerFee,
      takerFee,
      createdAt: new Date(),
    };
    
    await db.insert(markets).values(newMarket).run();
    return c.json({ success: true, data: newMarket });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

adminTradingRoutes.patch('/markets/:symbol/status', async (c) => {
  const db = c.get('db');
  const symbol = c.req.param('symbol');
  const body = await c.req.json();
  const { status } = body;
  
  if (!['ACTIVE', 'PAUSED', 'DELISTED'].includes(status)) {
    return c.json({ success: false, error: 'Invalid status' }, 400);
  }
  
  try {
    await db.update(markets)
      .set({ status })
      .where(eq(markets.symbol, symbol))
      .run();
    return c.json({ success: true });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});


adminTradingRoutes.get('/orders', async (c) => {
  const db = c.get('db');
  const mode = c.req.query('mode') || 'REAL';
  const page = parseInt(c.req.query('page') || '1');
  const limit = parseInt(c.req.query('limit') || '50');
  const offset = (page - 1) * limit;
  const status = c.req.query('status');
  const market = c.req.query('market');
  
  try {
    const conditions = [eq(orders.mode, mode as any)];
    if (status && status !== 'ALL') {
       conditions.push(eq(orders.status, status as any));
    }
    
    const results = await db.select({
      order: orders,
      user: {
        id: users.id,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName
      }
    }).from(orders)
      .innerJoin(users, eq(orders.userId, users.id))
      .where(and(...conditions))
      .orderBy(desc(orders.createdAt)).all();
    
    let filtered = results;
    if (market && market !== 'ALL') {
       filtered = filtered.filter(r => r.order.marketSymbol === market);
    }
    
    const paginated = filtered.slice(offset, offset + limit);
    
    const mapped = paginated.map(r => ({
      id: r.order.displayId || r.order.id,
      internalId: r.order.id,
      userId: r.user.id,
      userName: r.user.email,
      market: r.order.marketSymbol,
      side: r.order.side,
      type: r.order.type,
      price: r.order.price || 'Market',
      amount: r.order.amount,
      filledAmount: r.order.filledAmount,
      status: r.order.status,
      createdAt: r.order.createdAt
    }));
    
    return c.json({ 
      success: true, 
      data: mapped,
      total: filtered.length
    });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

adminTradingRoutes.get('/trades', async (c) => {
  const db = c.get('db');
  const mode = c.req.query('mode') || 'REAL';
  const page = parseInt(c.req.query('page') || '1');
  const limit = parseInt(c.req.query('limit') || '50');
  const offset = (page - 1) * limit;
  const market = c.req.query('market');
  
  try {
    let query = db.select().from(trades).where(eq(trades.mode, mode as any));
    
    const results = await query.orderBy(desc(trades.createdAt)).all();
    
    let filtered = results;
    if (market && market !== 'ALL') {
       filtered = filtered.filter(r => r.marketSymbol === market);
    }
    
    const paginated = filtered.slice(offset, offset + limit);
    
    const mapped = paginated.map(t => ({
      id: t.displayId || t.id,
      market: t.marketSymbol,
      takerSide: 'BUY', // Taker side logic to be refined if schema provides it
      price: t.price,
      amount: t.amount,
      makerFee: t.makerFee,
      takerFee: t.takerFee,
      createdAt: t.createdAt
    }));
    
    return c.json({ 
      success: true, 
      data: mapped,
      total: filtered.length
    });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});
