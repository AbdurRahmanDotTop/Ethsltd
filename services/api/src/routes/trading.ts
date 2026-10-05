import { Hono } from 'hono';
const runTx = async (db: any, cb: any) => {
  try {
    return await db.transaction(cb);
  } catch (e: any) {
    if (e.message && e.message.toLowerCase().includes('begin')) {
      console.warn('D1 transaction begin failed, falling back to sequential execution');
      return await cb(db);
    }
    throw e;
  }
};
import { eq, and, desc, inArray } from 'drizzle-orm';
import { Bindings, Variables } from '../db';
import { EmailService } from '../services/email';
import { markets, orders, trades, wallets, walletTransactions, currencyRates, positions } from 'database';
import { mt5Accounts } from 'database/schema/mt5';
import { jwtMiddleware } from '../middleware/jwt';
import { generateBusinessId } from '../services/id-generator';
import { processOrderMatching } from '../services/matching-engine';
import { users } from 'database';
import { getRealPrice } from '../utils/price';
import Decimal from 'decimal.js';
import { MT5Service } from '../services/mt5-client';

export const tradingRoutes = new Hono<{ Bindings: Bindings; Variables: Variables }>();

const DEFAULT_MARKETS = [
  { symbol: 'BTC-USDT', baseAsset: 'BTC', quoteAsset: 'USDT', minPrice: '1', maxPrice: '1000000', tickSize: '0.01', minAmount: '0.00001', stepSize: '0.00001', makerFee: '0.001', takerFee: '0.001' },
  { symbol: 'ETH-USDT', baseAsset: 'ETH', quoteAsset: 'USDT', minPrice: '1', maxPrice: '100000', tickSize: '0.01', minAmount: '0.001', stepSize: '0.001', makerFee: '0.001', takerFee: '0.001' },
  { symbol: 'SOL-USDT', baseAsset: 'SOL', quoteAsset: 'USDT', minPrice: '0.1', maxPrice: '1000', tickSize: '0.01', minAmount: '0.1', stepSize: '0.1', makerFee: '0.001', takerFee: '0.001' },
];

// ========== PUBLIC ENDPOINTS (No Auth Required) ==========

tradingRoutes.get('/markets', async (c) => {
  const db = c.get('db');
  let allMarkets = await db.select().from(markets).where(eq(markets.status, 'ACTIVE')).all();
  
  if (allMarkets.length === 0) {
    // Seed markets
    const now = new Date();
    await db.insert(markets).values(DEFAULT_MARKETS.map(m => ({
      id: crypto.randomUUID(),
      ...m,
      createdAt: now
    })));
    allMarkets = await db.select().from(markets).where(eq(markets.status, 'ACTIVE')).all();
  }
  
  // Fetch real data from MEXC (more reliable on Cloudflare workers than Binance)
  let tickerData: Record<string, any> = {};
  try {
    const res = await fetch(`https://api.mexc.com/api/v3/ticker/24hr`);
    if (res.ok) {
      const data = await res.json() as any[];
      if (Array.isArray(data)) {
        data.forEach(item => {
          const origSymbol = allMarkets.find(m => m.symbol.replace('-', '') === item.symbol)?.symbol;
          if (origSymbol) {
             tickerData[origSymbol] = item;
          }
        });
      }
    } else {
      console.warn("MEXC API returned status", res.status);
    }
  } catch(e) {
    console.warn('MEXC API error:', e);
  }

  // Fallback to Binance 24hr if MEXC failed or partial
  if (Object.keys(tickerData).length === 0) {
    try {
      const res = await fetch(`https://api.binance.com/api/v3/ticker/24hr`);
      if (res.ok) {
        const data = await res.json() as any[];
        if (Array.isArray(data)) {
          data.forEach(item => {
            const origSymbol = allMarkets.find(m => m.symbol.replace('-', '') === item.symbol)?.symbol;
            if (origSymbol) {
               tickerData[origSymbol] = {
                 lastPrice: item.lastPrice,
                 priceChangePercent: parseFloat(item.priceChangePercent) / 100,
                 highPrice: item.highPrice,
                 lowPrice: item.lowPrice,
                 volume: item.volume,
                 openPrice: item.openPrice
               };
            }
          });
        }
      }
    } catch(e) {
      console.warn('Binance API error:', e);
    }
  }

  // Format for frontend
  const formattedMarkets = await Promise.all(allMarkets.map(async m => {
    const bData = tickerData[m.symbol];
    if (bData) {
      const price = parseFloat(bData.lastPrice);
      return {
        id: m.symbol,
        symbol: m.symbol,
        name: m.symbol,
        baseAsset: m.baseAsset,
        quoteAsset: m.quoteAsset,
        price: price,
        priceChange24h: parseFloat(bData.priceChangePercent) * 100, 
        high24h: parseFloat(bData.highPrice),
        low24h: parseFloat(bData.lowPrice),
        volume24h: parseFloat(bData.volume),
        sparkline: [parseFloat(bData.openPrice), parseFloat(bData.lowPrice), parseFloat(bData.highPrice), price],
        isNew: false
      };
    } else {
      // Robust Fallback
      const fallbackPrice = await getRealPrice(m.symbol) || 0;
      return {
        id: m.symbol,
        symbol: m.symbol,
        name: m.symbol,
        baseAsset: m.baseAsset,
        quoteAsset: m.quoteAsset,
        price: fallbackPrice,
        priceChange24h: 0,
        high24h: fallbackPrice * 1.05,
        low24h: fallbackPrice * 0.95,
        volume24h: 0,
        sparkline: [fallbackPrice, fallbackPrice, fallbackPrice, fallbackPrice],
        isNew: false
      };
    }
  }));
  
  return c.json({ success: true, data: formattedMarkets });
});

tradingRoutes.get('/markets/:symbol/candles', async (c) => {
  const symbol = c.req.param('symbol');
  const interval = c.req.query('interval') || '15m';
  const mexcSymbol = symbol.replace('-', '').toUpperCase();

  // Try MEXC first
  try {
    const res = await fetch(`https://api.mexc.com/api/v3/klines?symbol=${mexcSymbol}&interval=${interval}&limit=100`);
    if (res.ok) {
      const data = await res.json() as any[];
      if (Array.isArray(data) && data.length > 0) {
        const candles = data.map((k: any) => ({
          time: k[0] / 1000,
          open: parseFloat(k[1]),
          high: parseFloat(k[2]),
          low: parseFloat(k[3]),
          close: parseFloat(k[4]),
          volume: parseFloat(k[5])
        }));
        return c.json({ success: true, data: candles });
      }
    }
  } catch(e) {
    console.error('MEXC API error (candles):', e);
  }

  // Fallback: try Binance
  try {
    const res = await fetch(`https://api.binance.com/api/v3/klines?symbol=${mexcSymbol}&interval=${interval}&limit=100`, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    if (res.ok) {
      const data = await res.json() as any[];
      if (Array.isArray(data) && data.length > 0) {
        const candles = data.map((k: any) => ({
          time: k[0] / 1000,
          open: parseFloat(k[1]),
          high: parseFloat(k[2]),
          low: parseFloat(k[3]),
          close: parseFloat(k[4]),
          volume: parseFloat(k[5])
        }));
        return c.json({ success: true, data: candles });
      }
    }
  } catch(e) {
    console.error('Binance API error (candles fallback):', e);
  }

  return c.json({ success: true, data: [] });
});

tradingRoutes.get('/markets/:symbol/orderbook', async (c) => {
  const symbol = c.req.param('symbol');
  const db = c.get('db');

  try {
    const activeOrders = await db.select()
      .from(orders)
      .where(
        and(
          eq(orders.marketSymbol, symbol),
          eq(orders.type, 'LIMIT')
        )
      )
      .all();

    const openOrders = activeOrders.filter((o: any) => 
      o.status === 'OPEN' || o.status === 'PARTIALLY_FILLED'
    );

    const askMap = new Map<number, number>();
    const bidMap = new Map<number, number>();

    // 1. Fetch Real Market Depth (Level 2) from MEXC
    const mexcSymbol = symbol.replace('-', '').toUpperCase();
    try {
      const res = await fetch(`https://api.mexc.com/api/v3/depth?symbol=${mexcSymbol}&limit=20`);
      if (res.ok) {
        const data = await res.json() as any;
        if (data.asks) {
           data.asks.forEach((ask: any[]) => askMap.set(parseFloat(ask[0]), parseFloat(ask[1])));
        }
        if (data.bids) {
           data.bids.forEach((bid: any[]) => bidMap.set(parseFloat(bid[0]), parseFloat(bid[1])));
        }
      }
    } catch(e) {
      console.warn("MEXC Orderbook fetch failed, falling back to local orders only");
    }

    // 2. Overlay Local DB Orders
    for (const o of openOrders) {
      if (!o.price) continue;
      const price = parseFloat(o.price);
      const amount = parseFloat(o.remainingAmount);
      
      if (o.side === 'SELL') {
        askMap.set(price, (askMap.get(price) || 0) + amount);
      } else {
        bidMap.set(price, (bidMap.get(price) || 0) + amount);
      }
    }

    const asks = Array.from(askMap.entries())
      .map(([price, amount]) => ({ price, amount, total: price * amount }))
      .sort((a, b) => a.price - b.price)
      .slice(0, 50);

    const bids = Array.from(bidMap.entries())
      .map(([price, amount]) => ({ price, amount, total: price * amount }))
      .sort((a, b) => b.price - a.price)
      .slice(0, 50);

    return c.json({ success: true, data: { asks, bids } });
  } catch (error) {
    console.error('Orderbook error:', error);
    return c.json({ success: true, data: { asks: [], bids: [] } });
  }
});

tradingRoutes.get('/markets/:symbol/trades', async (c) => {
  const symbol = c.req.param('symbol');
  const db = c.get('db');
  
  try {
    const recentTrades = await db.select()
      .from(trades)
      .where(eq(trades.marketSymbol, symbol))
      .orderBy(desc(trades.createdAt))
      .limit(50)
      .all();

    const formattedTrades = recentTrades.map((t: any) => ({
      id: t.id,
      price: parseFloat(t.price),
      amount: parseFloat(t.amount),
      total: parseFloat(t.quoteAmount || '0') || parseFloat(t.price) * parseFloat(t.amount),
      time: t.createdAt instanceof Date ? t.createdAt.toISOString() : t.createdAt,
      isBuyerMaker: false
    }));

    return c.json({ success: true, data: formattedTrades });
  } catch (error) {
    console.error('Trades error:', error);
    return c.json({ success: true, data: [] });
  }
});

tradingRoutes.get('/exchange-rate', async (c) => {
  const db = c.get('db');
  const base = (c.req.query('base') || 'USDT').toUpperCase();
  const quote = (c.req.query('quote') || 'INR').toUpperCase();

  // 1. Check Global Currency Rates managed by Admin
  if (base === 'USDT') {
    try {
      const adminRate = await db.select().from(currencyRates)
        .where(and(eq(currencyRates.code, quote), eq(currencyRates.status, 'ACTIVE')))
        .get();
      
      if (adminRate && adminRate.ratePerUsdt) {
        return c.json({ success: true, data: { rate: parseFloat(adminRate.ratePerUsdt), source: 'Admin' } });
      }
    } catch (e) {
      console.warn('Admin currency rate fetch failed', e);
    }
  }

  // 2. Fallback to external markets
  if (base === 'USDT' && quote === 'INR') {
    try {
      const res = await fetch('https://api.wazirx.com/sapi/v1/ticker/24hr?symbol=usdtinr');
      if (res.ok) {
        const data = await res.json() as any;
        if (data && data.lastPrice) {
          return c.json({ success: true, data: { rate: parseFloat(data.lastPrice), source: 'WazirX' } });
        }
      }
    } catch (e) {
      console.warn('WazirX exchange rate fetch failed', e);
    }

    try {
      const res = await fetch('https://api.coinbase.com/v2/exchange-rates?currency=USDT');
      if (res.ok) {
        const data = await res.json() as any;
        if (data && data.data && data.data.rates && data.data.rates.INR) {
          return c.json({ success: true, data: { rate: parseFloat(data.data.rates.INR), source: 'Coinbase' } });
        }
      }
    } catch (e) {
      console.warn('Coinbase exchange rate fetch failed', e);
    }
    
    return c.json({ success: true, data: { rate: 90.00, source: 'Fallback' } });
  }

  return c.json({ success: false, error: 'Unsupported pair' }, 400);
});


// ========== AUTHENTICATED ENDPOINTS ==========
tradingRoutes.use('*', jwtMiddleware);

// GET /orders — Fetch user's orders (no fake matching!)
tradingRoutes.get('/orders', async (c) => {
  const db = c.get('db');
  const user = c.get('user');
  
  const userOrders = await db.select().from(orders)
    .where(eq(orders.userId, user.id))
    .orderBy(desc(orders.createdAt))
    .all();
    
  const formattedOrders = userOrders.map((o: any) => ({
    id: o.id,
    market: o.marketSymbol,
    side: o.side,
    type: o.type,
    price: o.price ? parseFloat(o.price) : undefined,
    amount: parseFloat(o.amount),
    filled: parseFloat(o.filledAmount),
    remaining: parseFloat(o.remainingAmount),
    total: o.price ? parseFloat(o.amount) * parseFloat(o.price) : undefined,
    status: o.status,
    createdAt: o.createdAt instanceof Date ? o.createdAt.toISOString() : o.createdAt,
  }));
    
  return c.json({ success: true, data: formattedOrders });
});

// GET /trades — Fetch user's trade history
tradingRoutes.get('/trades', async (c) => {
  const db = c.get('db');
  const user = c.get('user');
  
  // Query trades where this user is buyer or seller
  const allTrades = await db.select().from(trades).orderBy(desc(trades.createdAt)).limit(200).all();
  
  const userTrades = allTrades.filter((t: any) => 
    t.buyUserId === user.id || t.sellUserId === user.id
  );
  
  const formattedTrades = userTrades.map((t: any) => {
    const isBuyer = t.buyUserId === user.id;
    return {
      id: t.id,
      market: t.marketSymbol,
      side: isBuyer ? 'BUY' : 'SELL',
      price: parseFloat(t.price),
      amount: parseFloat(t.amount),
      total: parseFloat(t.quoteAmount || '0') || parseFloat(t.price) * parseFloat(t.amount),
      fee: isBuyer ? parseFloat(t.buyFee || '0') : parseFloat(t.sellFee || '0'),
      feeAsset: isBuyer ? t.marketSymbol.split('-')[0] : t.marketSymbol.split('-')[1],
      createdAt: t.createdAt instanceof Date ? t.createdAt.toISOString() : t.createdAt,
    };
  });
  
  return c.json({ success: true, data: formattedTrades });
});

// POST /orders — Place a new spot order
tradingRoutes.post('/orders', async (c) => {
  const db = c.get('db');
  const user = c.get('user');
  const body = await c.req.json();
  const { market, side, type, amount, price, stopLoss, takeProfit, stopPrice, timeInForce } = body;
  
  // --- Validate market ---
  const marketInfo = await db.select().from(markets).where(eq(markets.symbol, market)).get();
  if (!marketInfo) {
    return c.json({ success: false, error: 'Market not found' }, 400);
  }
  if (marketInfo.status !== 'ACTIVE') {
    return c.json({ success: false, error: 'Market is currently not active' }, 400);
  }

  // --- Validate & set price ---
  const fetchedPrice = await getRealPrice(market);
  const orderPriceRaw = type === 'MARKET' ? fetchedPrice : parseFloat(price);
  
  if (!orderPriceRaw || orderPriceRaw <= 0) {
    return c.json({ success: false, error: 'Invalid price or price unavailable' }, 400);
  }

  const orderPrice = new Decimal(orderPriceRaw);
  const parsedAmount = new Decimal(amount);
  
  // --- Validate amount ---
  if (parsedAmount.lte(0)) {
    return c.json({ success: false, error: 'Amount must be greater than zero' }, 400);
  }
  
  const minAmount = new Decimal(marketInfo.minAmount);
  if (parsedAmount.lt(minAmount)) {
    return c.json({ success: false, error: `Minimum order amount is ${marketInfo.minAmount}` }, 400);
  }

  // --- Validate price bounds for limit orders ---
  if (type === 'LIMIT') {
    const minPrice = new Decimal(marketInfo.minPrice);
    const maxPrice = new Decimal(marketInfo.maxPrice);
    if (orderPrice.lt(minPrice) || orderPrice.gt(maxPrice)) {
      return c.json({ success: false, error: `Price must be between ${marketInfo.minPrice} and ${marketInfo.maxPrice}` }, 400);
    }
  }

  const totalValue = parsedAmount.times(orderPrice);
  
  let spendAsset = side === 'BUY' ? marketInfo.quoteAsset : marketInfo.baseAsset;
  let spendAmount = side === 'BUY' ? totalValue : parsedAmount;
  
  if (marketInfo.type !== 'SPOT') {
    spendAsset = marketInfo.quoteAsset;
    spendAmount = totalValue.div(100); // hardcoded leverage 100
  }
  
  const now = new Date();
  const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const dbUser = await db.select().from(users).where(eq(users.id, user.id)).get();
  const orderDisplayId = await generateBusinessId(db, dbUser?.email, 'ORDE');

  try {
    await runTx(db, async (tx: any) => {
      // --- Balance Check (Inside Transaction) ---
      let spendWallet = await tx.select().from(wallets)
        .where(and(eq(wallets.userId, user.id), eq(wallets.assetSymbol, spendAsset)))
        .get();
      
      if (!spendWallet || new Decimal(spendWallet.balance).lt(spendAmount)) {
        throw new Error(`Insufficient ${spendAsset} balance`);
      }
      
      // --- Reserve balance: move from available to locked ---
      const newSpendBalance = new Decimal(spendWallet.balance).minus(spendAmount).toString();
      const newLockedBalance = new Decimal(spendWallet.lockedBalance).plus(spendAmount).toString();
      await tx.update(wallets).set({
        balance: newSpendBalance,
        lockedBalance: newLockedBalance,
        updatedAt: now
      }).where(and(eq(wallets.userId, user.id), eq(wallets.assetSymbol, spendAsset)));
      
      // --- Create Order Record (PENDING for MT5) ---
      const newOrderRecord = {
        id: orderId,
        displayId: orderDisplayId,
        userId: user.id,
        marketSymbol: market,
        side,
        type,
        price: orderPrice.toString(),
        stopPrice: stopPrice ? stopPrice.toString() : null,
        stopLoss: stopLoss ? stopLoss.toString() : null,
        takeProfit: takeProfit ? takeProfit.toString() : null,
        amount: parsedAmount.toString(),
        filledAmount: '0',
        remainingAmount: parsedAmount.toString(),
        status: marketInfo.type !== 'SPOT' ? 'ROUTING' as const : 'ACCEPTED' as const,
        timeInForce: timeInForce || 'GTC',
        createdAt: now,
        updatedAt: now,
      };

      await tx.insert(orders).values(newOrderRecord);
    }); // End of DB lock transaction

    // ============================================
    // MT5 INTEGRATION (MARGIN / CFD)
    // ============================================
    if (marketInfo.type !== 'SPOT') {
      let positionId = crypto.randomUUID();
      let finalPrice = orderPrice.toString();
      
      // Native MT5-style CFD Execution (Without external API calls)
      const marginRequired = totalValue.div(100); // hardcoded leverage 100 for now
      
      // Update Order to FILLED and Create Position in our DB
      await runTx(db, async (tx: any) => {
        await tx.update(orders).set({ 
          status: 'FILLED', 
          filledAmount: parsedAmount.toString(), 
          remainingAmount: '0',
          price: finalPrice,
          updatedAt: new Date()
        }).where(eq(orders.id, orderId));
        
        const positionDisplayId = await generateBusinessId(db, dbUser?.email, 'POS');
        await tx.insert(positions).values({
          id: positionId,
          displayId: positionDisplayId,
          userId: user.id,
          marketSymbol: market,
          side: side === 'BUY' ? 'LONG' : 'SHORT',
          status: 'OPEN',
          leverage: '100',
          marginType: 'ISOLATED',
          marginAmount: marginRequired.toString(),
          entryPrice: finalPrice,
          stopLoss: stopLoss ? stopLoss.toString() : null,
          takeProfit: takeProfit ? takeProfit.toString() : null,
          liquidationPrice: side === 'BUY' ? new Decimal(finalPrice).times(0.99).toString() : new Decimal(finalPrice).times(1.01).toString(),
          amount: parsedAmount.toString(),
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        
        // Create Trade History Record for CFDs (Acting as Dealer)
        const tradeId = crypto.randomUUID();
        const tradeDisplayId = await generateBusinessId(tx, 'system', 'TRAD');
        const quoteAmount = parsedAmount.times(new Decimal(finalPrice));
        const takerFeeRate = new Decimal(marketInfo.takerFee);
        const fee = (side === 'BUY' ? parsedAmount : quoteAmount).times(takerFeeRate);
        
        await tx.insert(trades).values({
          id: tradeId,
          displayId: tradeDisplayId,
          marketSymbol: market,
          buyOrderId: side === 'BUY' ? orderId : null,
          sellOrderId: side === 'SELL' ? orderId : null,
          buyUserId: side === 'BUY' ? user.id : null,
          sellUserId: side === 'SELL' ? user.id : null,
          price: finalPrice,
          amount: parsedAmount.toString(),
          quoteAmount: quoteAmount.toString(),
          buyFee: side === 'BUY' ? fee.toString() : '0',
          sellFee: side === 'SELL' ? fee.toString() : '0',
          createdAt: new Date(),
        });
      });
      
      // Return early to prevent Spot matching engine from running
      const finalOrder = await db.select().from(orders).where(eq(orders.id, orderId)).get();
      return c.json({ success: true, message: 'CFD Order Executed Successfully', orderId: orderDisplayId, order: finalOrder });

    }

    // ============================================
    // SPOT MARKET MATCHING ENGINE (No MT5)
    // ============================================
    // Re-fetch the order inside a new tx to match it
    await runTx(db, async (tx: any) => {
      const pendingOrder = await tx.select().from(orders).where(eq(orders.id, orderId)).get();
      if (!pendingOrder) return;
      
      const matchResult = await processOrderMatching(tx, pendingOrder, marketInfo, user.id);
      
      const filledAmount = new Decimal(matchResult.totalFilledAmount);
      const remainingAmount = new Decimal(matchResult.remainingToFill);
      
      // --- Determine final order status ---
      let finalStatus: string;
      if (remainingAmount.lte(0)) {
        finalStatus = 'FILLED';
      } else if (filledAmount.gt(0)) {
        finalStatus = 'PARTIALLY_FILLED';
      } else {
        finalStatus = 'OPEN';
      }

      // For MARKET orders that couldn't be fully filled: 
      // The unfilled portion remains as OPEN (not FAILED), user can cancel it.
      // This is standard exchange behavior.
      
      // --- Update order with final state ---
      await tx.update(orders).set({
        filledAmount: filledAmount.toString(),
        remainingAmount: remainingAmount.toString(),
        status: finalStatus,
        updatedAt: now
      }).where(eq(orders.id, orderId));

      // --- MT5 BEHAVIOR: Create a Position for SPOT trades too ---
      if (filledAmount.gt(0)) {
        const positionDisplayId = await generateBusinessId(db, dbUser?.email, 'POS');
        const posId = crypto.randomUUID();
        await tx.insert(positions).values({
          id: posId,
          displayId: positionDisplayId,
          userId: user.id,
          marketSymbol: market,
          side: side === 'BUY' ? 'LONG' : 'SHORT',
          status: 'OPEN',
          leverage: '1',
          marginType: 'ISOLATED',
          marginAmount: spendAmount.toString(),
          entryPrice: orderPrice.toString(),
          stopLoss: stopLoss ? stopLoss.toString() : null,
          takeProfit: takeProfit ? takeProfit.toString() : null,
          liquidationPrice: null,
          amount: filledAmount.toString(),
          createdAt: now,
          updatedAt: now,
        });
      }

      // --- Handle unfilled remainder for market orders ---
      // If market order has remaining unfilled, and there are no matching limit orders,
      // we keep it OPEN for future matching. This is NOT fake execution.
      // The user can see the partially filled status and cancel the remainder.
      
      // --- Refund excess locked balance if fully filled at better price ---
      if (filledAmount.gt(0) && side === 'BUY') {
        const actualQuoteSpent = new Decimal(matchResult.totalQuoteSpent);
        const excessLocked = spendAmount.minus(actualQuoteSpent);
        
        if (excessLocked.gt(0) && finalStatus === 'FILLED') {
          // Refund the excess to available balance
          const freshWallet = await tx.select().from(wallets)
            .where(and(eq(wallets.userId, user.id), eq(wallets.assetSymbol, spendAsset))).get();
          
          if (freshWallet) {
            await tx.update(wallets).set({
              balance: new Decimal(freshWallet.balance).plus(excessLocked).toString(),
              lockedBalance: Decimal.max(0, new Decimal(freshWallet.lockedBalance).minus(excessLocked)).toString(),
              updatedAt: now
            }).where(and(eq(wallets.userId, user.id), eq(wallets.assetSymbol, spendAsset)));
          }
        }
      }
    }); // End Transaction
  } catch (error: any) {
    console.error('Order placement error:', error);
    return c.json({ success: false, error: error.message || 'Failed to place order' }, 400);
  }

  // Send email notification (fire-and-forget)
  const emailService = new EmailService(c.env, db);
  c.executionCtx.waitUntil((async () => {
    try {
      const appUrl = c.req.header('origin') || `https://${c.req.header('host')}`;
      const orderData = await db.select().from(orders).where(eq(orders.id, orderId)).get();
      if (orderData) {
          await emailService.sendAdminTradeAlert(orderData, appUrl);
        await emailService.sendUserTransactionAlert(
          user.email,
          'Trade Order Created',
          `Your ${side} order for ${amount} ${marketInfo.baseAsset} has been placed.`,
          [
            { key: 'Order ID', value: orderData.displayId },
            { key: 'Market', value: market },
            { key: 'Side', value: side },
            { key: 'Amount', value: `${amount} ${marketInfo.baseAsset}` },
            { key: 'Price', value: type === 'MARKET' ? 'Market Price' : `${price} ${marketInfo.quoteAsset}` },
            { key: 'Status', value: orderData.status }
          ],
          `${appUrl}/trade/${market.replace('-', '_')}`,
          'View Trade'
        );
      }
    } catch (e) {
      console.error("Failed to send trade email", e);
    }
  })());

  const finalOrder = await db.select().from(orders).where(eq(orders.id, orderId)).get();
  return c.json({ success: true, orderId, order: finalOrder });
});

// DELETE /orders/:id — Cancel an open order
tradingRoutes.delete('/orders/:id', async (c) => {
  const db = c.get('db');
  const user = c.get('user');
  const orderId = c.req.param('id');
  
  try {
    await runTx(db, async (tx: any) => {
      const order = await tx.select().from(orders)
        .where(and(eq(orders.id, orderId), eq(orders.userId, user.id)))
        .get();
      
      if (!order) {
        throw new Error('Order not found');
      }
      
      // Only OPEN or PARTIALLY_FILLED orders can be cancelled
      if (order.status !== 'OPEN' && order.status !== 'PARTIALLY_FILLED') {
        throw new Error('Only open or partially filled orders can be canceled');
      }
      
      const marketInfo = await tx.select().from(markets)
        .where(eq(markets.symbol, order.marketSymbol)).get();
      if(!marketInfo) throw new Error('Market not found');

      const now = new Date();
      await tx.update(orders).set({ status: 'CANCELED', updatedAt: now })
        .where(eq(orders.id, order.id));
      
      // Refund locked balance for the REMAINING (unfilled) portion
      const orderRemainingAmount = new Decimal(order.remainingAmount);
      const orderPrice = new Decimal(order.price || '0');
      
      const refundAsset = order.side === 'BUY' ? marketInfo.quoteAsset : marketInfo.baseAsset;
      const refundAmount = order.side === 'BUY' 
        ? orderRemainingAmount.times(orderPrice)  // BUY: locked in quote
        : orderRemainingAmount;                     // SELL: locked in base
      
      if (refundAmount.gt(0)) {
        let refundWallet = await tx.select().from(wallets)
          .where(and(eq(wallets.userId, user.id), eq(wallets.assetSymbol, refundAsset)))
          .get();
        
        if (refundWallet) {
          const newBalance = new Decimal(refundWallet.balance).plus(refundAmount).toString();
          const newLocked = Decimal.max(0, new Decimal(refundWallet.lockedBalance).minus(refundAmount)).toString();
          await tx.update(wallets).set({
            balance: newBalance,
            lockedBalance: newLocked,
            updatedAt: now
          }).where(eq(wallets.id, refundWallet.id));

          // Create wallet transaction for the refund
          await tx.insert(walletTransactions).values({
            id: crypto.randomUUID(),
            userId: user.id,
            type: 'TRADE',
            assetSymbol: refundAsset,
            amount: refundAmount.toString(),
            fee: '0',
            status: 'COMPLETED',
            reference: order.id,
            createdAt: now,
            updatedAt: now,
          });
        }
      }
    });
  } catch (e: any) {
    return c.json({ success: false, error: e.message || 'Failed to cancel order' }, 400);
  }
  
  return c.json({ success: true });
});


// GET /positions — Fetch user's open positions
tradingRoutes.get('/positions', async (c) => {
  const db = c.get('db');
  const user = c.get('user');
  
  const userPositions = await db.select().from(positions)
    .where(eq(positions.userId, user.id))
    .orderBy(desc(positions.createdAt))
    .all();
    
  // Fetch current market prices to calculate unrealized PNL
  // For production, this should use Redis/WebSocket feeds, but we fetch on demand here.
  let tickerData: Record<string, number> = {};
  for (const pos of userPositions) {
    if (pos.status === 'OPEN' && !tickerData[pos.marketSymbol]) {
      tickerData[pos.marketSymbol] = await getRealPrice(pos.marketSymbol) || 0;
    }
  }

  const formattedPositions = userPositions.map((p: any) => {
    const currentPrice = tickerData[p.marketSymbol] || parseFloat(p.entryPrice);
    const entry = parseFloat(p.entryPrice);
    const amount = parseFloat(p.amount);
    
    let unrealizedPnl = 0;
    if (p.status === 'OPEN') {
      unrealizedPnl = p.side === 'LONG' 
        ? (currentPrice - entry) * amount 
        : (entry - currentPrice) * amount;
    }
    
    return {
      id: p.id,
      ticket: p.displayId,
      market: p.marketSymbol,
      side: p.side,
      amount: amount,
      entryPrice: entry,
      currentPrice: currentPrice,
      stopLoss: p.stopLoss ? parseFloat(p.stopLoss) : null,
      takeProfit: p.takeProfit ? parseFloat(p.takeProfit) : null,
      margin: parseFloat(p.marginAmount),
      unrealizedPnl: unrealizedPnl,
      realizedPnl: parseFloat(p.realizedPnl),
      swap: parseFloat(p.swap),
      commission: parseFloat(p.commission),
      status: p.status,
      createdAt: p.createdAt instanceof Date ? p.createdAt.toISOString() : p.createdAt,
    };
  });
    
  return c.json({ success: true, data: formattedPositions });
});


// POST /positions/:id/close — Close an open position (Supports Partial Close)
tradingRoutes.post('/positions/:id/close', async (c) => {
  const db = c.get('db');
  const user = c.get('user');
  const positionId = c.req.param('id');
  const body = await c.req.json().catch(() => ({}));
  let requestedCloseAmount = body.amount ? new Decimal(body.amount) : null;
  
  try {
    // 1. Pre-fetch position outside of D1 transaction
    const position = await db.select().from(positions)
      .where(and(eq(positions.id, positionId), eq(positions.userId, user.id)))
      .get();
      
    if (!position) throw new Error('Position not found');
    if (position.status !== 'OPEN') throw new Error('Position is already closed');
    
    const marketInfo = await db.select().from(markets).where(eq(markets.symbol, position.marketSymbol)).get();
    if (!marketInfo) throw new Error('Market info missing');

    const totalAmount = new Decimal(position.amount);
    const totalMargin = new Decimal(position.marginAmount);
    const closeAmount = (requestedCloseAmount && requestedCloseAmount.gt(0) && requestedCloseAmount.lt(totalAmount)) 
      ? requestedCloseAmount 
      : totalAmount;
    const closeRatio = closeAmount.div(totalAmount);
    const releasedMargin = totalMargin.times(closeRatio);

    let pnl = new Decimal(0);

    // Calculate PnL natively using current market price
    const currentPriceRaw = await getRealPrice(position.marketSymbol);
    if (!currentPriceRaw) throw new Error('Could not fetch market price for closing');
    const currentPrice = new Decimal(currentPriceRaw);
    const entry = new Decimal(position.entryPrice);
    
    // Profit = (Current - Entry) * Amount for LONG
    // Profit = (Entry - Current) * Amount for SHORT
    if (position.side === 'LONG') {
      pnl = currentPrice.minus(entry).times(closeAmount);
    } else {
      pnl = entry.minus(currentPrice).times(closeAmount);
    }

    const totalReturn = releasedMargin.plus(pnl); // Margin + Profit (or - Loss)
    const now = new Date();

    // 3. Finalize Wallet and Position DB updates
    await runTx(db, async (tx: any) => {
      // Update position
      if (closeAmount.eq(totalAmount)) {
        // Full close
        await tx.update(positions).set({
          status: 'CLOSED',
          realizedPnl: new Decimal(position.realizedPnl).plus(pnl).toString(),
          updatedAt: now
        }).where(eq(positions.id, position.id));
      } else {
        // Partial close
        await tx.update(positions).set({
          amount: totalAmount.minus(closeAmount).toString(),
          marginAmount: totalMargin.minus(releasedMargin).toString(),
          realizedPnl: new Decimal(position.realizedPnl).plus(pnl).toString(),
          updatedAt: now
        }).where(eq(positions.id, position.id));
      }
      
      // Update Wallet & Ledger based on Market Type
      if (marketInfo.type !== 'SPOT') {
        // CFD / MARGIN Logic
        let quoteWallet = await tx.select().from(wallets)
          .where(and(eq(wallets.userId, user.id), eq(wallets.assetSymbol, marketInfo.quoteAsset)))
          .get();
          
        if (quoteWallet) {
           // For CFD, margin is locked in quote wallet. We unlock it and add/subtract PnL to balance.
           const newLocked = Decimal.max(0, new Decimal(quoteWallet.lockedBalance).minus(releasedMargin));
           const newBalance = new Decimal(quoteWallet.balance).plus(totalReturn); // releasedMargin + pnl
           
           await tx.update(wallets).set({
             lockedBalance: newLocked.toString(),
             balance: newBalance.toString(),
             updatedAt: now
           }).where(eq(wallets.id, quoteWallet.id));
           
           if (!pnl.isZero()) {
             await tx.insert(walletTransactions).values({
               id: crypto.randomUUID(),
               userId: user.id,
               type: pnl.gt(0) ? 'TRADING_CREDIT' : 'TRADING_DEBIT',
               assetSymbol: marketInfo.quoteAsset,
               amount: pnl.abs().toString(),
               fee: '0',
               status: 'COMPLETED',
               reference: `close_cfd_${position.id}`,
               createdAt: now,
               updatedAt: now,
             });
           }
        }
      } else {
        // SPOT Logic
        // For Spot, the asset was actually exchanged during order fill. 
        // We must reverse the exchange natively (sell the base asset back to quote asset, or vice versa)
        let baseWallet = await tx.select().from(wallets)
          .where(and(eq(wallets.userId, user.id), eq(wallets.assetSymbol, marketInfo.baseAsset)))
          .get();
        let quoteWallet = await tx.select().from(wallets)
          .where(and(eq(wallets.userId, user.id), eq(wallets.assetSymbol, marketInfo.quoteAsset)))
          .get();
          
        if (baseWallet && quoteWallet) {
          const valueInQuote = closeAmount.times(currentPrice); // Market value of closed amount
          
          if (position.side === 'LONG') {
             // Closing LONG means selling base asset for quote asset
             const newBaseBalance = Decimal.max(0, new Decimal(baseWallet.balance).minus(closeAmount));
             const newQuoteBalance = new Decimal(quoteWallet.balance).plus(valueInQuote);
             
             await tx.update(wallets).set({ balance: newBaseBalance.toString(), updatedAt: now }).where(eq(wallets.id, baseWallet.id));
             await tx.update(wallets).set({ balance: newQuoteBalance.toString(), updatedAt: now }).where(eq(wallets.id, quoteWallet.id));
             
             await tx.insert(walletTransactions).values({
               id: crypto.randomUUID(),
               userId: user.id,
               type: 'TRADE_EXCHANGE',
               assetSymbol: marketInfo.quoteAsset,
               amount: valueInQuote.toString(),
               fee: '0',
               status: 'COMPLETED',
               reference: `close_spot_${position.id}`,
               createdAt: now,
               updatedAt: now,
             });
          } else {
             // Closing SHORT means buying base asset with quote asset
             const newQuoteBalance = Decimal.max(0, new Decimal(quoteWallet.balance).minus(valueInQuote));
             const newBaseBalance = new Decimal(baseWallet.balance).plus(closeAmount);
             
             await tx.update(wallets).set({ balance: newBaseBalance.toString(), updatedAt: now }).where(eq(wallets.id, baseWallet.id));
             await tx.update(wallets).set({ balance: newQuoteBalance.toString(), updatedAt: now }).where(eq(wallets.id, quoteWallet.id));
          }
        }
      }
    });
    return c.json({ success: true, message: 'Position closed successfully' });
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 400);
  }
});
