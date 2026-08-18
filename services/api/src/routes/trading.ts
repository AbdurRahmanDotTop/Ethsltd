import { Hono } from 'hono';
import { eq, and, desc, inArray } from 'drizzle-orm';
import { Bindings, Variables } from '../db';
import { markets, orders, trades, wallets, walletTransactions, positions, binaryOptions, currencyRates } from 'database';
import { jwtMiddleware } from '../middleware/jwt';
import { generateBusinessId } from '../services/id-generator';
import { processOrderMatching } from '../services/matching-engine';
import { users } from 'database';

export const tradingRoutes = new Hono<{ Bindings: Bindings; Variables: Variables }>();

const getRealPrice = async (symbol: string): Promise<number> => {
  const symbolNoDash = symbol.replace('-', '');
  
  // 1. Try Binance
  try {
    const res = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${symbolNoDash}`);
    if (res.ok) {
      const data = await res.json() as any;
      if (data.price) return parseFloat(data.price);
    }
  } catch (e) {
    console.warn(`Binance price fetch failed for ${symbol}`);
  }
  
  // 2. Try KuCoin as fallback
  try {
    const res = await fetch(`https://api.kucoin.com/api/v1/market/orderbook/level1?symbol=${symbol}`);
    if (res.ok) {
      const data = await res.json() as any;
      if (data.data && data.data.price) return parseFloat(data.data.price);
    }
  } catch (e) {
    console.warn(`KuCoin price fetch failed for ${symbol}`);
  }
  
  // 3. Fallback mock prices so the system never breaks
  const mocks: Record<string, number> = {
    'BTC-USDT': 104250.00,
    'ETH-USDT': 3500.00,
    'SOL-USDT': 140.00,
  };
  return mocks[symbol] || 100.00;
};

const DEFAULT_MARKETS = [
  { symbol: 'BTC-USDT', baseAsset: 'BTC', quoteAsset: 'USDT', minPrice: '1', maxPrice: '1000000', tickSize: '0.01', minAmount: '0.00001', stepSize: '0.00001', makerFee: '0.001', takerFee: '0.001' },
  { symbol: 'ETH-USDT', baseAsset: 'ETH', quoteAsset: 'USDT', minPrice: '1', maxPrice: '100000', tickSize: '0.01', minAmount: '0.001', stepSize: '0.001', makerFee: '0.001', takerFee: '0.001' },
  { symbol: 'SOL-USDT', baseAsset: 'SOL', quoteAsset: 'USDT', minPrice: '0.1', maxPrice: '1000', tickSize: '0.01', minAmount: '0.1', stepSize: '0.1', makerFee: '0.001', takerFee: '0.001' },
];

tradingRoutes.get('/markets', async (c) => {
  const db = c.get('db');
  let allMarkets = await db.select().from(markets).all();
  
  if (allMarkets.length === 0) {
    // Seed markets
    const now = new Date();
    await db.insert(markets).values(DEFAULT_MARKETS.map(m => ({
      id: crypto.randomUUID(),
      ...m,
      createdAt: now
    })));
    allMarkets = await db.select().from(markets).all();
  }
  
  // Fetch real data from Binance
  let binanceData: Record<string, any> = {};
  try {
    const symbolsParam = allMarkets.map(m => `"${m.symbol.replace('-', '')}"`).join(',');
    const res = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbols=[${symbolsParam}]`);
    if (res.ok) {
      const data = await res.json() as any[];
      if (Array.isArray(data)) {
        data.forEach(item => {
          const origSymbol = allMarkets.find(m => m.symbol.replace('-', '') === item.symbol)?.symbol || item.symbol;
          binanceData[origSymbol] = item;
        });
      }
    } else {
      console.warn("Binance API returned status", res.status);
    }
  } catch(e) {
    console.warn('Binance API error:', e);
  }

  // Format for frontend
  const formattedMarkets = await Promise.all(allMarkets.map(async m => {
    const bData = binanceData[m.symbol];
    if (bData) {
      const price = parseFloat(bData.lastPrice);
      return {
        id: m.symbol,
        symbol: m.symbol,
        name: m.symbol,
        baseAsset: m.baseAsset,
        quoteAsset: m.quoteAsset,
        price: price,
        priceChange24h: parseFloat(bData.priceChange),
        high24h: parseFloat(bData.highPrice),
        low24h: parseFloat(bData.lowPrice),
        volume24h: parseFloat(bData.volume),
        sparkline: [parseFloat(bData.openPrice), parseFloat(bData.lowPrice), parseFloat(bData.highPrice), price],
        isNew: false
      };
    } else {
      // Robust Fallback
      const fallbackPrice = await getRealPrice(m.symbol);
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

  try {
    const res = await fetch(`https://api.binance.com/api/v3/klines?symbol=${symbol.replace('-', '')}&interval=${interval}&limit=100`);
    const data = await res.json() as any[];
    if (Array.isArray(data)) {
      const candles = data.map(k => ({
        time: k[0] / 1000,
        open: parseFloat(k[1]),
        high: parseFloat(k[2]),
        low: parseFloat(k[3]),
        close: parseFloat(k[4]),
        volume: parseFloat(k[5])
      }));
      return c.json({ success: true, data: candles });
    }
  } catch(e) {
    console.error('Binance API error (candles):', e);
  }

  // Fallback to mock data if Binance fails
  const currentPrice = await getRealPrice(symbol) || 100000;
  
  const candles = [];
  let price = currentPrice * 0.95; // start lower
  const now = Date.now();
  
  for(let i = 100; i >= 0; i--) {
    const isUp = Math.random() > 0.5;
    const change = price * (Math.random() * 0.005);
    const open = price;
    const close = isUp ? price + change : price - change;
    const high = Math.max(open, close) + price * (Math.random() * 0.002);
    const low = Math.min(open, close) - price * (Math.random() * 0.002);
    
    candles.push({
      time: (now - (i * 15 * 60 * 1000)) / 1000, // 15m intervals unix
      open, high, low, close,
      volume: Math.random() * 100
    });
    price = close;
  }
  
  candles[candles.length - 1].close = currentPrice;
  return c.json({ success: true, data: candles });
});

tradingRoutes.get('/markets/:symbol/orderbook', async (c) => {
  const symbol = c.req.param('symbol');
  const mode = (c.req.query('mode') || 'REAL') as 'REAL' | 'DEMO';
  const db = c.get('db');

  try {
    const activeOrders = await db.select()
      .from(orders)
      .where(
        and(
          eq(orders.marketSymbol, symbol),
          eq(orders.mode, mode),
          eq(orders.type, 'LIMIT'),
          eq(orders.status, 'OPEN')
        )
      )
      .all();

    const askMap = new Map<number, number>();
    const bidMap = new Map<number, number>();

    for (const o of activeOrders) {
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
      .slice(0, 50); // Limit depth

    const bids = Array.from(bidMap.entries())
      .map(([price, amount]) => ({ price, amount, total: price * amount }))
      .sort((a, b) => b.price - a.price)
      .slice(0, 50); // Limit depth

    return c.json({ success: true, data: { asks, bids } });
  } catch (error) {
    console.error('Orderbook error:', error);
    return c.json({ success: true, data: { asks: [], bids: [] } });
  }
});

tradingRoutes.get('/markets/:symbol/trades', async (c) => {
  const symbol = c.req.param('symbol');
  const mode = (c.req.query('mode') || 'REAL') as 'REAL' | 'DEMO';
  const db = c.get('db');
  
  try {
    const recentTrades = await db.select()
      .from(trades)
      .where(
        and(
          eq(trades.marketSymbol, symbol),
          eq(trades.mode, mode)
        )
      )
      .orderBy(desc(trades.createdAt))
      .limit(50)
      .all();

    const formattedTrades = recentTrades.map(t => ({
      id: t.id,
      price: parseFloat(t.price),
      amount: parseFloat(t.amount),
      time: t.createdAt.toISOString(),
      isBuyerMaker: false // Or determine from logic
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

  // 2. Fallback to external markets if no active admin rate is found
  if (base === 'USDT' && quote === 'INR') {
    // Try WazirX for accurate Crypto INR rate
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

    // Try Coinbase Forex rate
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
    
    // Absolute Fallback
    return c.json({ success: true, data: { rate: 90.00, source: 'Fallback' } });
  }

  return c.json({ success: false, error: 'Unsupported pair' }, 400);
});


// Secure all other routes
tradingRoutes.use('*', jwtMiddleware);

const processOpenLimitOrders = async (db: any, userId: string, mode: 'REAL' | 'DEMO') => {
  const openOrders = await db.select().from(orders).where(and(eq(orders.userId, userId), eq(orders.mode, mode), eq(orders.status, 'OPEN'))).all();
  if (!openOrders.length) return;

  const marketCache: Record<string, number> = {};
  const marketInfoCache: Record<string, any> = {};

  const now = new Date();

  for (const order of openOrders) {
    if (order.type !== 'LIMIT' || !order.price) continue;
    
    if (!marketCache[order.marketSymbol]) {
      marketCache[order.marketSymbol] = await getRealPrice(order.marketSymbol);
      marketInfoCache[order.marketSymbol] = await db.select().from(markets).where(eq(markets.symbol, order.marketSymbol)).get();
    }
    
    const currentPrice = marketCache[order.marketSymbol];
    const marketInfo = marketInfoCache[order.marketSymbol];
    
    if (!currentPrice || !marketInfo) continue;
    
    const limitPrice = parseFloat(order.price);
    const isCrossed = order.side === 'BUY' ? currentPrice <= limitPrice : currentPrice >= limitPrice;
    
    if (isCrossed) {
      const executionPrice = limitPrice;
      const parsedAmount = parseFloat(order.remainingAmount);
      const totalValue = parsedAmount * executionPrice;
      
      const spendAsset = order.side === 'BUY' ? marketInfo.quoteAsset : marketInfo.baseAsset;
      const receiveAsset = order.side === 'BUY' ? marketInfo.baseAsset : marketInfo.quoteAsset;
      const spendAmount = order.side === 'BUY' ? totalValue : parsedAmount;
      
      let spendWallet = await db.select().from(wallets).where(and(eq(wallets.userId, userId), eq(wallets.assetSymbol, spendAsset), eq(wallets.type, mode))).get();
      if (!spendWallet) continue;
      
      // Unlock the balance
      const newLocked = (parseFloat(spendWallet.lockedBalance) - spendAmount).toString();
      await db.update(wallets).set({ lockedBalance: newLocked, updatedAt: now }).where(eq(wallets.id, spendWallet.id));
      
      // Deduct fee and add received asset
      const feeAmount = order.side === 'BUY' ? parsedAmount * parseFloat(marketInfo.makerFee) : totalValue * parseFloat(marketInfo.makerFee);
      const receiveAmountFinal = (order.side === 'BUY' ? parsedAmount : totalValue) - feeAmount;
      
      let receiveWallet = await db.select().from(wallets).where(and(eq(wallets.userId, userId), eq(wallets.assetSymbol, receiveAsset), eq(wallets.type, mode))).get();
      if (!receiveWallet) {
        await db.insert(wallets).values({
          id: crypto.randomUUID(),
          userId: userId,
          assetSymbol: receiveAsset,
          type: mode,
          balance: receiveAmountFinal.toString(),
          lockedBalance: '0',
          createdAt: now,
          updatedAt: now,
        });
      } else {
        const newReceiveBalance = (parseFloat(receiveWallet.balance) + receiveAmountFinal).toString();
        await db.update(wallets).set({ balance: newReceiveBalance, updatedAt: now }).where(eq(wallets.id, receiveWallet.id));
      }
      
      // Update order status
      await db.update(orders).set({
        status: 'FILLED',
        filledAmount: order.amount,
        remainingAmount: '0',
        updatedAt: now,
      }).where(eq(orders.id, order.id));
      
      // Create trade record
      await db.insert(trades).values({
        id: `TRD-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        marketSymbol: order.marketSymbol,
        mode: mode,
        makerOrderId: order.id,
        takerOrderId: 'mock-taker-order',
        price: executionPrice.toString(),
        amount: parsedAmount.toString(),
        makerFee: feeAmount.toString(),
        takerFee: '0',
        createdAt: now,
      });
    }
  }
};

tradingRoutes.get('/orders', async (c) => {
  const db = c.get('db');
  const user = c.get('user');
  const mode = (c.req.header('x-trading-mode') || 'REAL') as 'REAL' | 'DEMO';
  
  // Process lazy matching first
  await processOpenLimitOrders(db, user.id, mode);

  const userOrders = await db.select().from(orders)
    .where(and(eq(orders.userId, user.id), eq(orders.mode, mode)))
    .orderBy(desc(orders.createdAt))
    .all();
    
  // Format for frontend
  const formattedOrders = userOrders.map(o => ({
    id: o.id,
    market: o.marketSymbol,
    side: o.side,
    type: o.type,
    price: o.price ? parseFloat(o.price) : undefined,
    amount: parseFloat(o.amount),
    filled: parseFloat(o.filledAmount),
    total: o.price ? parseFloat(o.amount) * parseFloat(o.price) : undefined,
    status: o.status,
    createdAt: o.createdAt.toISOString(),
  }));
    
  return c.json({ success: true, data: formattedOrders });
});

tradingRoutes.get('/trades', async (c) => {
  const db = c.get('db');
  const user = c.get('user');
  const mode = (c.req.header('x-trading-mode') || 'REAL') as 'REAL' | 'DEMO';
  
  // Fetch user's orders first to match trades
  const userOrders = await db.select().from(orders).where(and(eq(orders.userId, user.id), eq(orders.mode, mode))).all();
  const orderIds = userOrders.map(o => o.id);
  
  if (orderIds.length === 0) {
    return c.json({ success: true, data: [] });
  }
  
  // A real implementation would query where makerOrderId in orderIds OR takerOrderId in orderIds
  // But Drizzle sqlite doesn't easily support dynamic OR IN array right now, so we do it in JS
  const allTrades = await db.select().from(trades).orderBy(desc(trades.createdAt)).all();
  const userTrades = allTrades.filter(t => orderIds.includes(t.makerOrderId) || orderIds.includes(t.takerOrderId));
  
  const formattedTrades = userTrades.map(t => {
    // Find matching user order to know if it was BUY or SELL
    const userOrder = userOrders.find(o => o.id === t.makerOrderId || o.id === t.takerOrderId);
    return {
      id: t.id,
      market: t.marketSymbol,
      side: userOrder?.side || 'BUY',
      price: parseFloat(t.price),
      amount: parseFloat(t.amount),
      total: parseFloat(t.price) * parseFloat(t.amount),
      fee: userOrder?.id === t.makerOrderId ? parseFloat(t.makerFee) : parseFloat(t.takerFee),
      feeAsset: userOrder?.side === 'BUY' ? t.marketSymbol.split('-')[0] : t.marketSymbol.split('-')[1], // Simplified
      createdAt: t.createdAt.toISOString(),
    };
  });
  
  return c.json({ success: true, data: formattedTrades });
});

tradingRoutes.post('/orders', async (c) => {
  const db = c.get('db');
  const user = c.get('user');
  const body = await c.req.json();
  const mode = (c.req.header('x-trading-mode') || 'REAL') as 'REAL' | 'DEMO';
  const { market, side, type, amount, price } = body;
  
  const marketInfo = await db.select().from(markets).where(eq(markets.symbol, market)).get();
  if (!marketInfo) {
    return c.json({ success: false, error: 'Market not found' }, 400);
  }

  const orderPrice = type === 'MARKET' ? await getRealPrice(market) : parseFloat(price);
  if (orderPrice <= 0) {
    return c.json({ success: false, error: 'Invalid price' }, 400);
  }

  const parsedAmount = parseFloat(amount);
  const totalValue = parsedAmount * orderPrice;
  
  const spendAsset = side === 'BUY' ? marketInfo.quoteAsset : marketInfo.baseAsset;
  const receiveAsset = side === 'BUY' ? marketInfo.baseAsset : marketInfo.quoteAsset;
  const spendAmount = side === 'BUY' ? totalValue : parsedAmount;
  
  // Wallet Check
  let spendWallet = await db.select().from(wallets).where(and(eq(wallets.userId, user.id), eq(wallets.assetSymbol, spendAsset), eq(wallets.type, mode))).get();
  if (!spendWallet || parseFloat(spendWallet.balance) < spendAmount) {
    return c.json({ success: false, error: 'Insufficient balance' }, 400);
  }
  
  const now = new Date();
  const orderId = `ORD-${Date.now()}`;
  
    const dbUser = await db.select().from(users).where(eq(users.id, user.id)).get();
    const orderDisplayId = await generateBusinessId(db, dbUser?.email, 'ORDE');
    
    // Deduct from available balance (lock it)
    const newSpendBalance = (parseFloat(spendWallet.balance) - spendAmount).toString();
    const newLockedBalance = (parseFloat(spendWallet.lockedBalance) + spendAmount).toString();
    await db.update(wallets).set({ balance: newSpendBalance, lockedBalance: newLockedBalance, updatedAt: now }).where(eq(wallets.id, spendWallet.id));
    
    const newOrderRecord = {
      id: orderId,
      displayId: orderDisplayId,
      userId: user.id,
      marketSymbol: market,
      mode,
      side,
      type,
      price: orderPrice.toString(),
      amount: amount.toString(),
      filledAmount: '0',
      remainingAmount: amount.toString(),
      status: 'OPEN',
      createdAt: now,
      updatedAt: now,
    };

    await db.insert(orders).values(newOrderRecord);
    
    // Call the matching engine
    const matchResult = await processOrderMatching(db, newOrderRecord, marketInfo);
    
    // Check if MARKET order and still has remaining. If so, bot fills it (External Liquidity Fallback)
    if (matchResult.remainingToFill > 0 && type === 'MARKET') {
      const fallbackPrice = orderPrice; // Extracted earlier via getRealPrice
      const fillAmount = matchResult.remainingToFill;
      
      const tradeId = crypto.randomUUID();
      const tradeDisplayId = await generateBusinessId(db, 'bot', 'TRAD');
      const takerFeeAmt = (fillAmount * fallbackPrice) * parseFloat(marketInfo.takerFee);
      
      await db.insert(trades).values({
        id: tradeId,
        displayId: tradeDisplayId,
        marketSymbol: market,
        mode,
        makerOrderId: 'external-liquidity-bot',
        takerOrderId: orderId,
        price: fallbackPrice.toString(),
        amount: fillAmount.toString(),
        makerFee: '0',
        takerFee: takerFeeAmt.toString(),
        createdAt: now,
      });
      
      matchResult.remainingToFill -= fillAmount;
      matchResult.totalFilledAmount += fillAmount;
      matchResult.totalSpentOrReceived += fillAmount * fallbackPrice;
    }
    
    // Update Taker Order (This User's Order)
    const takerStatus = matchResult.remainingToFill <= 0 ? 'FILLED' : 'OPEN';
    await db.update(orders).set({
      filledAmount: matchResult.totalFilledAmount.toString(),
      remainingAmount: matchResult.remainingToFill.toString(),
      status: takerStatus,
      updatedAt: now
    }).where(eq(orders.id, orderId));
    
    // Finalize Taker Wallet
    if (matchResult.totalFilledAmount > 0) {
      // 1. Remove from locked balance
      const avgPrice = matchResult.totalSpentOrReceived / matchResult.totalFilledAmount;
      const actualSpend = side === 'BUY' ? matchResult.totalFilledAmount * avgPrice : matchResult.totalFilledAmount;
      
      const finalSpendWallet = await db.select().from(wallets).where(eq(wallets.id, spendWallet.id)).get();
      if(finalSpendWallet) {
         // Free up locked balance that was used
         const usedLockedAmount = side === 'BUY' ? actualSpend : matchResult.totalFilledAmount;
         const finalLocked = Math.max(0, parseFloat(finalSpendWallet.lockedBalance) - usedLockedAmount).toString();
         
         // If MARKET order, we locked worst-case. We may need to refund the difference.
         // But for limits, we locked exact.
         const refundAmount = side === 'BUY' && type === 'MARKET' ? Math.max(0, (spendAmount * (matchResult.totalFilledAmount / parsedAmount)) - actualSpend) : 0;
         const finalBalance = (parseFloat(finalSpendWallet.balance) + refundAmount).toString();
         
         await db.update(wallets).set({ balance: finalBalance, lockedBalance: finalLocked, updatedAt: now }).where(eq(wallets.id, spendWallet.id));
      }
      
      // 2. Add received asset
      const receiveTotal = side === 'BUY' ? matchResult.totalFilledAmount : matchResult.totalSpentOrReceived;
      const receiveFee = receiveTotal * parseFloat(marketInfo.takerFee);
      const receiveAmountFinal = receiveTotal - receiveFee;
      
      let receiveWallet = await db.select().from(wallets).where(and(eq(wallets.userId, user.id), eq(wallets.assetSymbol, receiveAsset), eq(wallets.type, mode))).get();
      if (!receiveWallet) {
        const walletId = crypto.randomUUID();
        const walletDisplayId = await generateBusinessId(db, dbUser?.email, 'WALL');
        await db.insert(wallets).values({
          id: walletId,
          displayId: walletDisplayId,
          userId: user.id,
          assetSymbol: receiveAsset,
          type: mode,
          balance: receiveAmountFinal.toString(),
          lockedBalance: '0',
          createdAt: now,
          updatedAt: now,
        });
      } else {
        const newReceiveBalance = (parseFloat(receiveWallet.balance) + receiveAmountFinal).toString();
        await db.update(wallets).set({ balance: newReceiveBalance, updatedAt: now }).where(eq(wallets.id, receiveWallet.id));
      }
    }

  return c.json({ success: true, orderId });
});

tradingRoutes.delete('/orders/:id', async (c) => {
  const db = c.get('db');
  const user = c.get('user');
  const orderId = c.req.param('id');
  
  const order = await db.select().from(orders).where(and(eq(orders.id, orderId), eq(orders.userId, user.id))).get();
  
  if (!order) {
    return c.json({ success: false, error: 'Order not found' }, 404);
  }
  
  if (order.status !== 'OPEN') {
    return c.json({ success: false, error: 'Order cannot be canceled' }, 400);
  }
  
  const marketInfo = await db.select().from(markets).where(eq(markets.symbol, order.marketSymbol)).get();
  if(!marketInfo) return c.json({ success: false, error: 'Market missing' }, 400);

  const now = new Date();
  await db.update(orders).set({ status: 'CANCELED', updatedAt: now }).where(eq(orders.id, order.id));
  
  // Refund locked balance
  const remainingValue = parseFloat(order.remainingAmount) * parseFloat(order.price || '0');
  const refundAsset = order.side === 'BUY' ? marketInfo.quoteAsset : marketInfo.baseAsset;
  const refundAmount = order.side === 'BUY' ? remainingValue : parseFloat(order.remainingAmount);
  
  let refundWallet = await db.select().from(wallets).where(and(eq(wallets.userId, user.id), eq(wallets.assetSymbol, refundAsset), eq(wallets.type, order.mode))).get();
  if (refundWallet) {
    const newBalance = (parseFloat(refundWallet.balance) + refundAmount).toString();
    const newLocked = (parseFloat(refundWallet.lockedBalance) - refundAmount).toString();
    await db.update(wallets).set({ balance: newBalance, lockedBalance: newLocked, updatedAt: now }).where(eq(wallets.id, refundWallet.id));
  }
  
  return c.json({ success: true });
});

// --- PERPETUAL FUTURES ENDPOINTS ---

const processLiquidations = async (db: any, userId: string, mode: 'REAL' | 'DEMO') => {
  const userPositions = await db.select().from(positions)
    .where(and(eq(positions.userId, userId), eq(positions.mode, mode), eq(positions.status, 'OPEN')))
    .all();

  const now = new Date();
  for (const p of userPositions) {
    const markPrice = await getRealPrice(p.marketSymbol) || parseFloat(p.entryPrice);
    const liqPrice = parseFloat(p.liquidationPrice);

    let isLiquidated = false;
    if (p.side === 'LONG' && markPrice <= liqPrice) isLiquidated = true;
    if (p.side === 'SHORT' && markPrice >= liqPrice) isLiquidated = true;

    if (isLiquidated) {
      // Liquidate
      await db.update(positions).set({
        status: 'LIQUIDATED',
        realizedPnl: (-parseFloat(p.marginAmount)).toString(),
        updatedAt: now
      }).where(eq(positions.id, p.id));
      
      // Optionally we could move the margin to an insurance fund here, but for now we just deduct it (it was already deducted from wallet at open)
    }
  }
};

tradingRoutes.get('/futures/positions', async (c) => {
  const db = c.get('db');
  const user = c.get('user');
  const mode = (c.req.header('x-trading-mode') || 'REAL') as 'REAL' | 'DEMO';

  // Check liquidations before returning positions
  await processLiquidations(db, user.id, mode);

  const userPositions = await db.select().from(positions)
    .where(and(eq(positions.userId, user.id), eq(positions.mode, mode), eq(positions.status, 'OPEN')))
    .all();

  // Add uPnL calculation
  const formattedPositions = await Promise.all(userPositions.map(async p => {
    const markPrice = await getRealPrice(p.marketSymbol) || parseFloat(p.entryPrice);
    const entry = parseFloat(p.entryPrice);
    const amount = parseFloat(p.amount);
    
    // Calculate unrealized PnL
    let upnl = 0;
    if (p.side === 'LONG') {
      upnl = (markPrice - entry) * amount;
    } else {
      upnl = (entry - markPrice) * amount;
    }

    const marginAmt = parseFloat(p.marginAmount);
    const marginRatio = (marginAmt + upnl) / (markPrice * amount);

    return {
      ...p,
      markPrice,
      unrealizedPnl: upnl,
      marginRatio: marginRatio * 100, // as percentage
    };
  }));

  return c.json({ success: true, data: formattedPositions });
});

tradingRoutes.post('/futures/order', async (c) => {
  const db = c.get('db');
  const user = c.get('user');
  const body = await c.req.json();
  const mode = (c.req.header('x-trading-mode') || 'REAL') as 'REAL' | 'DEMO';
  
  // side: 'LONG' | 'SHORT'
  const { market, side, amount, leverage } = body;

  const marketInfo = await db.select().from(markets).where(eq(markets.symbol, market)).get();
  if (!marketInfo) {
    return c.json({ success: false, error: 'Market not found' }, 400);
  }

  const markPrice = await getRealPrice(market);
  if (markPrice <= 0) {
    return c.json({ success: false, error: 'Invalid market price' }, 400);
  }

  const lev = parseFloat(leverage || '1');
  if (lev < 1 || lev > parseFloat(marketInfo.maxLeverage || '100')) {
    return c.json({ success: false, error: 'Invalid leverage' }, 400);
  }

  const parsedAmount = parseFloat(amount); // in base asset (e.g. BTC)
  const positionNotionalValue = parsedAmount * markPrice;
  const requiredMargin = positionNotionalValue / lev;
  const fee = positionNotionalValue * parseFloat(marketInfo.takerFee);
  const totalCost = requiredMargin + fee;

  // Wallet check for margin in quote asset (USDT)
  let quoteWallet = await db.select().from(wallets).where(and(eq(wallets.userId, user.id), eq(wallets.assetSymbol, marketInfo.quoteAsset), eq(wallets.type, mode))).get();
  if (!quoteWallet || parseFloat(quoteWallet.balance) < totalCost) {
    return c.json({ success: false, error: 'Insufficient margin balance' }, 400);
  }

  const now = new Date();
  
  // Deduct margin + fee from available balance
  const newBalance = (parseFloat(quoteWallet.balance) - totalCost).toString();
  await db.update(wallets).set({ balance: newBalance, updatedAt: now }).where(eq(wallets.id, quoteWallet.id));

  // Calculate Liquidation Price (simplified isolated margin)
  // Long Liq = Entry - (Margin / Amount)
  // Short Liq = Entry + (Margin / Amount)
  const liqPrice = side === 'LONG' 
    ? markPrice - (requiredMargin / parsedAmount) * 0.9 // 90% maintenance margin threshold
    : markPrice + (requiredMargin / parsedAmount) * 0.9;

  const positionId = `POS-${Date.now()}`;
  await db.insert(positions).values({
    id: positionId,
    userId: user.id,
    marketSymbol: market,
    mode,
    side,
    status: 'OPEN',
    leverage: lev.toString(),
    marginType: 'ISOLATED',
    marginAmount: requiredMargin.toString(),
    entryPrice: markPrice.toString(),
    liquidationPrice: Math.max(0, liqPrice).toString(),
    amount: parsedAmount.toString(),
    realizedPnl: '0',
    createdAt: now,
    updatedAt: now,
  });

  return c.json({ success: true, positionId, message: 'Position opened' });
});

tradingRoutes.post('/futures/close', async (c) => {
  const db = c.get('db');
  const user = c.get('user');
  const body = await c.req.json();
  const { positionId } = body;

  const position = await db.select().from(positions).where(and(eq(positions.id, positionId), eq(positions.userId, user.id))).get();
  if (!position || position.status !== 'OPEN') {
    return c.json({ success: false, error: 'Position not found or already closed' }, 400);
  }

  const markPrice = await getRealPrice(position.marketSymbol) || parseFloat(position.entryPrice);
  const entry = parseFloat(position.entryPrice);
  const amount = parseFloat(position.amount);
  const marginAmt = parseFloat(position.marginAmount);

  // Calculate PnL
  let pnl = 0;
  if (position.side === 'LONG') {
    pnl = (markPrice - entry) * amount;
  } else {
    pnl = (entry - markPrice) * amount;
  }

  const marketInfo = await db.select().from(markets).where(eq(markets.symbol, position.marketSymbol)).get();
  const fee = (markPrice * amount) * parseFloat(marketInfo?.takerFee || '0.001');

  // Total return = Margin + PnL - Closing Fee
  const totalReturn = marginAmt + pnl - fee;

  const now = new Date();
  await db.update(positions).set({
    status: 'CLOSED',
    realizedPnl: pnl.toString(),
    updatedAt: now,
  }).where(eq(positions.id, position.id));

  if (totalReturn > 0) {
    const quoteAsset = marketInfo?.quoteAsset || 'USDT';
    let quoteWallet = await db.select().from(wallets).where(and(eq(wallets.userId, user.id), eq(wallets.assetSymbol, quoteAsset), eq(wallets.type, position.mode))).get();
    if (quoteWallet) {
      const newBalance = (parseFloat(quoteWallet.balance) + totalReturn).toString();
      await db.update(wallets).set({ balance: newBalance, updatedAt: now }).where(eq(wallets.id, quoteWallet.id));
    }
  }

  return c.json({ success: true, pnl, totalReturn });
});

// --- BINARY OPTIONS ENDPOINTS ---

const processOptions = async (db: any, userId: string, mode: 'REAL' | 'DEMO') => {
  const openOptions = await db.select().from(binaryOptions)
    .where(and(eq(binaryOptions.userId, userId), eq(binaryOptions.mode, mode), eq(binaryOptions.status, 'PENDING')))
    .all();

  const now = new Date();
  for (const opt of openOptions) {
    if (now.getTime() >= opt.expiresAt.getTime()) {
      const markPrice = await getRealPrice(opt.marketSymbol) || parseFloat(opt.entryPrice);
      const entry = parseFloat(opt.entryPrice);
      
      let status = 'LOST';
      if (opt.direction === 'UP' && markPrice > entry) status = 'WON';
      else if (opt.direction === 'DOWN' && markPrice < entry) status = 'WON';
      else if (markPrice === entry) status = 'TIE';

      await db.update(binaryOptions).set({
        status,
        settlePrice: markPrice.toString(),
        updatedAt: now
      }).where(eq(binaryOptions.id, opt.id));

      if (status === 'WON' || status === 'TIE') {
        const amount = parseFloat(opt.amount);
        const payout = status === 'WON' ? amount * parseFloat(opt.payoutMultiplier) : amount;
        
        const marketInfo = await db.select().from(markets).where(eq(markets.symbol, opt.marketSymbol)).get();
        const quoteAsset = marketInfo?.quoteAsset || 'USDT';
        
        let quoteWallet = await db.select().from(wallets).where(and(eq(wallets.userId, userId), eq(wallets.assetSymbol, quoteAsset), eq(wallets.type, mode))).get();
        if (quoteWallet) {
          const newBalance = (parseFloat(quoteWallet.balance) + payout).toString();
          await db.update(wallets).set({ balance: newBalance, updatedAt: now }).where(eq(wallets.id, quoteWallet.id));
        }
      }
    }
  }
};

tradingRoutes.get('/options/positions', async (c) => {
  const db = c.get('db');
  const user = c.get('user');
  const mode = (c.req.header('x-trading-mode') || 'REAL') as 'REAL' | 'DEMO';

  await processOptions(db, user.id, mode);

  const opts = await db.select().from(binaryOptions)
    .where(and(eq(binaryOptions.userId, user.id), eq(binaryOptions.mode, mode)))
    .orderBy(desc(binaryOptions.createdAt))
    .all();

  return c.json({ success: true, data: opts });
});

tradingRoutes.post('/options/order', async (c) => {
  const db = c.get('db');
  const user = c.get('user');
  const body = await c.req.json();
  const mode = (c.req.header('x-trading-mode') || 'REAL') as 'REAL' | 'DEMO';
  
  // direction: 'UP' | 'DOWN', timeframe: minutes
  const { market, direction, amount, timeframeMinutes } = body;

  const marketInfo = await db.select().from(markets).where(eq(markets.symbol, market)).get();
  if (!marketInfo) {
    return c.json({ success: false, error: 'Market not found' }, 400);
  }

  const markPrice = await getRealPrice(market);
  if (markPrice <= 0) {
    return c.json({ success: false, error: 'Invalid market price' }, 400);
  }

  const parsedAmount = parseFloat(amount); // in quote asset (USDT)
  if (parsedAmount <= 0) {
    return c.json({ success: false, error: 'Invalid amount' }, 400);
  }

  let quoteWallet = await db.select().from(wallets).where(and(eq(wallets.userId, user.id), eq(wallets.assetSymbol, marketInfo.quoteAsset), eq(wallets.type, mode))).get();
  if (!quoteWallet || parseFloat(quoteWallet.balance) < parsedAmount) {
    return c.json({ success: false, error: 'Insufficient balance' }, 400);
  }

  const now = new Date();
  const expiresAt = new Date(now.getTime() + (parseInt(timeframeMinutes) * 60000));
  
  // Deduct wager
  const newBalance = (parseFloat(quoteWallet.balance) - parsedAmount).toString();
  await db.update(wallets).set({ balance: newBalance, updatedAt: now }).where(eq(wallets.id, quoteWallet.id));

  const optionId = `OPT-${Date.now()}`;
  await db.insert(binaryOptions).values({
    id: optionId,
    userId: user.id,
    marketSymbol: market,
    mode,
    direction,
    amount: parsedAmount.toString(),
    entryPrice: markPrice.toString(),
    status: 'PENDING',
    payoutMultiplier: '1.8', // 80% profit
    expiresAt,
    createdAt: now,
    updatedAt: now,
  });

  return c.json({ success: true, optionId, message: 'Option contract placed' });
});
