import { eq, and, asc, desc } from 'drizzle-orm';
import { orders, trades, wallets, users } from 'database';
import { generateBusinessId } from './id-generator';

export async function processOrderMatching(db: any, newOrder: any, marketInfo: any) {
  const isBuy = newOrder.side === 'BUY';
  const oppositeSide = isBuy ? 'SELL' : 'BUY';
  const mode = newOrder.mode;

  // Find opposite side OPEN LIMIT orders
  let matchingOrdersQuery = db.select()
    .from(orders)
    .where(
      and(
        eq(orders.marketSymbol, newOrder.marketSymbol),
        eq(orders.mode, mode),
        eq(orders.side, oppositeSide),
        eq(orders.status, 'OPEN'),
        eq(orders.type, 'LIMIT')
      )
    );

  // If new order is LIMIT, it can only match if price crosses
  if (newOrder.type === 'LIMIT') {
    // We filter in memory for simplicity or add to query, but let's do it in memory.
  }

  let matchingOrders = await matchingOrdersQuery.all();

  // Sort: Buy orders want lowest Ask (asc), Sell orders want highest Bid (desc)
  matchingOrders.sort((a: any, b: any) => {
    const pA = parseFloat(a.price);
    const pB = parseFloat(b.price);
    return isBuy ? pA - pB : pB - pA;
  });

  let remainingToFill = parseFloat(newOrder.remainingAmount);
  let totalFilledAmount = 0;
  let totalSpentOrReceived = 0;
  
  const now = new Date();

  for (const makerOrder of matchingOrders) {
    if (remainingToFill <= 0) break;

    const makerPrice = parseFloat(makerOrder.price);
    
    if (newOrder.type === 'LIMIT') {
      const takerPrice = parseFloat(newOrder.price);
      if (isBuy && takerPrice < makerPrice) break; // limit buy price is lower than lowest ask
      if (!isBuy && takerPrice > makerPrice) break; // limit sell price is higher than highest bid
    }

    const makerRemaining = parseFloat(makerOrder.remainingAmount);
    const fillAmount = Math.min(remainingToFill, makerRemaining);

    // Execute match
    remainingToFill -= fillAmount;
    totalFilledAmount += fillAmount;
    totalSpentOrReceived += fillAmount * makerPrice;

    // Update Maker Order
    const newMakerRemaining = makerRemaining - fillAmount;
    const newMakerFilled = parseFloat(makerOrder.filledAmount) + fillAmount;
    const makerStatus = newMakerRemaining <= 0 ? 'FILLED' : 'OPEN';

    await db.update(orders).set({
      remainingAmount: newMakerRemaining.toString(),
      filledAmount: newMakerFilled.toString(),
      status: makerStatus,
      updatedAt: now
    }).where(eq(orders.id, makerOrder.id));

    // Create Trade Record
    const tradeId = crypto.randomUUID();
    const tradeDisplayId = await generateBusinessId(db, 'system', 'TRAD'); // We don't have user email here easily, default to system prefix or similar

    const makerFeeAmt = (fillAmount * makerPrice) * parseFloat(marketInfo.makerFee);
    const takerFeeAmt = (fillAmount * makerPrice) * parseFloat(marketInfo.takerFee);

    await db.insert(trades).values({
      id: tradeId,
      displayId: tradeDisplayId,
      marketSymbol: newOrder.marketSymbol,
      mode,
      makerOrderId: makerOrder.id,
      takerOrderId: newOrder.id,
      price: makerPrice.toString(),
      amount: fillAmount.toString(),
      makerFee: makerFeeAmt.toString(),
      takerFee: takerFeeAmt.toString(),
      createdAt: now,
    });

    // --- Update Maker Wallet ---
    // Maker sold (opposite is SELL). They receive Quote Asset, spend Base Asset.
    // Maker bought (opposite is BUY). They receive Base Asset, spend Quote Asset.
    const makerReceiveAsset = makerOrder.side === 'BUY' ? marketInfo.baseAsset : marketInfo.quoteAsset;
    const makerReceiveGross = makerOrder.side === 'BUY' ? fillAmount : fillAmount * makerPrice;
    
    // In our simplified logic, maker fee is charged in the receive asset.
    const mFee = makerReceiveGross * parseFloat(marketInfo.makerFee);
    const makerReceiveNet = makerReceiveGross - mFee;

    // Credit maker receive wallet
    let mRecWallet = await db.select().from(wallets).where(and(eq(wallets.userId, makerOrder.userId), eq(wallets.assetSymbol, makerReceiveAsset), eq(wallets.type, mode))).get();
    if (mRecWallet) {
      await db.update(wallets).set({ 
        balance: (parseFloat(mRecWallet.balance) + makerReceiveNet).toString(),
        updatedAt: now 
      }).where(eq(wallets.id, mRecWallet.id));
    } else {
      const newWalletId = crypto.randomUUID();
      const newWalletDisplayId = await generateBusinessId(db, 'system', 'WALL');
      await db.insert(wallets).values({
        id: newWalletId,
        displayId: newWalletDisplayId,
        userId: makerOrder.userId,
        assetSymbol: makerReceiveAsset,
        type: mode,
        balance: makerReceiveNet.toString(),
        lockedBalance: '0',
        createdAt: now,
        updatedAt: now
      });
    }

    // Un-lock maker spend wallet
    const makerSpendAsset = makerOrder.side === 'BUY' ? marketInfo.quoteAsset : marketInfo.baseAsset;
    const makerSpendGross = makerOrder.side === 'BUY' ? fillAmount * makerPrice : fillAmount;
    
    let mSpdWallet = await db.select().from(wallets).where(and(eq(wallets.userId, makerOrder.userId), eq(wallets.assetSymbol, makerSpendAsset), eq(wallets.type, mode))).get();
    if (mSpdWallet) {
      await db.update(wallets).set({
        lockedBalance: Math.max(0, parseFloat(mSpdWallet.lockedBalance) - makerSpendGross).toString(),
        updatedAt: now
      }).where(eq(wallets.id, mSpdWallet.id));
    }
  }

  return {
    remainingToFill,
    totalFilledAmount,
    totalSpentOrReceived,
    averagePrice: totalFilledAmount > 0 ? totalSpentOrReceived / totalFilledAmount : 0
  };
}
