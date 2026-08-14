import { Hono } from 'hono';
import { eq, and, desc } from 'drizzle-orm';
import { Bindings, Variables } from '../db';
import { markets, orders, trades, wallets, walletTransactions } from 'database';
import { jwtMiddleware } from '../middleware/jwt';

export const tradingRoutes = new Hono<{ Bindings: Bindings; Variables: Variables }>();

const getRealPrice = async (symbol: string): Promise<number> => {
  try {
    const res = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${symbol.replace('-', '')}`);
    const data = await res.json() as any;
    return parseFloat(data.price || 0);
  } catch (e) {
    console.error('Error fetching real price:', e);
    return 0;
  }
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
    const data = await res.json() as any[];
    if (Array.isArray(data)) {
      data.forEach(item => {
        const origSymbol = allMarkets.find(m => m.symbol.replace('-', '') === item.symbol)?.symbol || item.symbol;
        binanceData[origSymbol] = item;
      });
    }
  } catch(e) {
    console.error('Binance API error:', e);
  }

  // Format for frontend
  const formattedMarkets = allMarkets.map(m => {
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
      return {
        id: m.symbol,
        symbol: m.symbol,
        name: m.symbol,
        baseAsset: m.baseAsset,
        quoteAsset: m.quoteAsset,
        price: 0,
        priceChange24h: 0,
        high24h: 0,
        low24h: 0,
        volume24h: 0,
        sparkline: [0, 0, 0, 0],
        isNew: false
      };
    }
  });
  
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

  try {
    const res = await fetch(`https://api.binance.com/api/v3/depth?symbol=${symbol.replace('-', '')}&limit=20`);
    const data = await res.json() as any;
    if (data && data.bids && data.asks) {
      const bids = data.bids.map((b: string[]) => ({ price: parseFloat(b[0]), amount: parseFloat(b[1]), total: parseFloat(b[0]) * parseFloat(b[1]) }));
      const asks = data.asks.map((a: string[]) => ({ price: parseFloat(a[0]), amount: parseFloat(a[1]), total: parseFloat(a[0]) * parseFloat(a[1]) })).reverse();
      return c.json({ success: true, data: { asks, bids } });
    }
  } catch(e) {
    console.error('Binance API error (orderbook):', e);
  }

  // Fallback to mock data if Binance fails
  const currentPrice = await getRealPrice(symbol) || 100000;
  
  const asks = [];
  const bids = [];
  let currentAsk = currentPrice * 1.0001;
  let currentBid = currentPrice * 0.9999;
  
  for(let i = 0; i < 20; i++) {
    const askAmount = Math.random() * 2 + 0.1;
    asks.push({ price: currentAsk, amount: askAmount, total: currentAsk * askAmount });
    currentAsk *= (1 + (Math.random() * 0.001));
    
    const bidAmount = Math.random() * 2 + 0.1;
    bids.push({ price: currentBid, amount: bidAmount, total: currentBid * bidAmount });
    currentBid *= (1 - (Math.random() * 0.001));
  }
  
  return c.json({ success: true, data: { asks: asks.reverse(), bids } });
});

tradingRoutes.get('/markets/:symbol/trades', async (c) => {
  const symbol = c.req.param('symbol');
  
  try {
    const res = await fetch(`https://api.binance.com/api/v3/trades?symbol=${symbol.replace('-', '')}&limit=30`);
    const data = await res.json() as any[];
    if (Array.isArray(data)) {
      const formattedTrades = data.map(t => ({
        id: t.id.toString(),
        price: parseFloat(t.price),
        amount: parseFloat(t.qty),
        time: new Date(t.time).toLocaleTimeString(),
        isBuyerMaker: t.isBuyerMaker
      })).reverse(); // Show newest trades first
      return c.json({ success: true, data: formattedTrades });
    }
  } catch(e) {
    console.error('Binance API error (trades):', e);
  }

  // Fallback to mock data if Binance fails
  const currentPrice = await getRealPrice(symbol) || 100000;
  
  const trades = [];
  for(let i = 0; i < 30; i++) {
    trades.push({
      id: Math.random().toString(),
      price: currentPrice * (1 + (Math.random() * 0.002 - 0.001)),
      amount: Math.random() * 1.5 + 0.01,
      time: new Date(Date.now() - Math.random() * 600000).toLocaleTimeString(),
      isBuyerMaker: Math.random() > 0.5
    });
  }
  
  const sortedTrades = trades.sort((a,b) => b.time.localeCompare(a.time));
  return c.json({ success: true, data: sortedTrades });
});


// Secure all other routes
tradingRoutes.use('*', jwtMiddleware);

tradingRoutes.get('/orders', async (c) => {
  const db = c.get('db');
  const user = c.get('user');
  const mode = (c.req.header('x-trading-mode') || 'REAL') as 'REAL' | 'DEMO';
  
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
  
  // Deduct from available balance (lock it)
  const newSpendBalance = (parseFloat(spendWallet.balance) - spendAmount).toString();
  const newLockedBalance = (parseFloat(spendWallet.lockedBalance) + spendAmount).toString();
  await db.update(wallets).set({ balance: newSpendBalance, lockedBalance: newLockedBalance, updatedAt: now }).where(eq(wallets.id, spendWallet.id));
  
  // For MARKET orders, simulate instant fill
  const orderStatus = type === 'MARKET' ? 'FILLED' : 'OPEN';
  const filledAmount = type === 'MARKET' ? amount.toString() : '0';
  const remainingAmount = type === 'MARKET' ? '0' : amount.toString();
  
  await db.insert(orders).values({
    id: orderId,
    userId: user.id,
    marketSymbol: market,
    mode,
    side,
    type,
    price: type === 'LIMIT' ? price.toString() : orderPrice.toString(),
    amount: amount.toString(),
    filledAmount,
    remainingAmount,
    status: orderStatus,
    createdAt: now,
    updatedAt: now,
  });
  
  if (type === 'MARKET') {
    // Process instant fill
    const tradeId = `TRD-${Date.now()}`;
    await db.insert(trades).values({
      id: tradeId,
      marketSymbol: market,
      mode,
      makerOrderId: 'mock-maker-order',
      takerOrderId: orderId,
      price: orderPrice.toString(),
      amount: amount.toString(),
      makerFee: '0',
      takerFee: (spendAmount * parseFloat(marketInfo.takerFee)).toString(),
      createdAt: now,
    });
    
    // Release lock and finalize transfer
    // 1. Remove locked balance (which was just added)
    const finalSpendWallet = await db.select().from(wallets).where(eq(wallets.id, spendWallet.id)).get();
    if(finalSpendWallet) {
       const finalLocked = (parseFloat(finalSpendWallet.lockedBalance) - spendAmount).toString();
       await db.update(wallets).set({ lockedBalance: finalLocked, updatedAt: now }).where(eq(wallets.id, spendWallet.id));
    }
    
    // 2. Add received asset
    const feeAmount = side === 'BUY' ? parsedAmount * parseFloat(marketInfo.takerFee) : totalValue * parseFloat(marketInfo.takerFee);
    const receiveAmountFinal = (side === 'BUY' ? parsedAmount : totalValue) - feeAmount;
    
    let receiveWallet = await db.select().from(wallets).where(and(eq(wallets.userId, user.id), eq(wallets.assetSymbol, receiveAsset), eq(wallets.type, mode))).get();
    if (!receiveWallet) {
      const walletId = crypto.randomUUID();
      await db.insert(wallets).values({
        id: walletId,
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
