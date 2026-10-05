const fs = require('fs');
const path = require('path');

const tradingTsPath = path.join(__dirname, '../services/api/src/routes/trading.ts');
let content = fs.readFileSync(tradingTsPath, 'utf8');

// Add positions to import
content = content.replace(
  `import { markets, orders, trades, wallets, walletTransactions, currencyRates } from 'database';`,
  `import { markets, orders, trades, wallets, walletTransactions, currencyRates, positions } from 'database';`
);

// Fix the @ts-ignore dynamic import hack
content = content.replace(
  /\/\/ @ts-ignore\s*await tx\.insert\(import\('database'\)\.then\(db => db\.positions\)\)/g,
  `await tx.insert(positions)`
);

// Add GET /positions
const getPositionsCode = `
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
      tickerData[pos.marketSymbol] = await getRealPrice(pos.marketSymbol);
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
`;

if (!content.includes('tradingRoutes.get(\'/positions\'')) {
  content = content + '\n' + getPositionsCode;
}

const closePositionCode = `
// POST /positions/:id/close — Close an open position
tradingRoutes.post('/positions/:id/close', async (c) => {
  const db = c.get('db');
  const user = c.get('user');
  const positionId = c.req.param('id');
  const body = await c.req.json().catch(() => ({}));
  const closeAmount = body.amount; // for partial close, not implemented fully in this snippet
  
  try {
    await runTx(db, async (tx: any) => {
      const position = await tx.select().from(positions)
        .where(and(eq(positions.id, positionId), eq(positions.userId, user.id)))
        .get();
        
      if (!position) throw new Error('Position not found');
      if (position.status !== 'OPEN') throw new Error('Position is already closed');
      
      const currentPrice = await getRealPrice(position.marketSymbol);
      if (!currentPrice) throw new Error('Could not fetch market price for closing');
      
      const entry = parseFloat(position.entryPrice);
      const amount = parseFloat(position.amount);
      const margin = parseFloat(position.marginAmount);
      
      const pnl = position.side === 'LONG' 
        ? (currentPrice - entry) * amount 
        : (entry - currentPrice) * amount;
        
      const totalReturn = margin + pnl; // Principal + Profit
      
      // Update position
      const now = new Date();
      await tx.update(positions).set({
        status: 'CLOSED',
        realizedPnl: pnl.toString(),
        updatedAt: now
      }).where(eq(positions.id, position.id));
      
      // Update Wallet (Quote asset)
      const marketInfo = await tx.select().from(markets).where(eq(markets.symbol, position.marketSymbol)).get();
      if (marketInfo) {
        let quoteWallet = await tx.select().from(wallets)
          .where(and(eq(wallets.userId, user.id), eq(wallets.assetSymbol, marketInfo.quoteAsset)))
          .get();
          
        if (quoteWallet) {
           const newLocked = Math.max(0, parseFloat(quoteWallet.lockedBalance) - margin);
           const newBalance = parseFloat(quoteWallet.balance) + totalReturn;
           
           await tx.update(wallets).set({
             lockedBalance: newLocked.toString(),
             balance: newBalance.toString(),
             updatedAt: now
           }).where(eq(wallets.id, quoteWallet.id));
        }
      }
    });
    return c.json({ success: true, message: 'Position closed successfully' });
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 400);
  }
});
`;

if (!content.includes('tradingRoutes.post(\'/positions/:id/close\'')) {
  content = content + '\n' + closePositionCode;
}

fs.writeFileSync(tradingTsPath, content, 'utf8');
console.log('Successfully updated trading.ts with MT5 routes');
