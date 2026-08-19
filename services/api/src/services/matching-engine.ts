import { eq, and } from 'drizzle-orm';
import { orders, trades, wallets } from 'database';
import { generateBusinessId } from './id-generator';
import Decimal from 'decimal.js';

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

  let matchingOrders = await matchingOrdersQuery.all();

  // Sort: Buy orders want lowest Ask (asc), Sell orders want highest Bid (desc)
  matchingOrders.sort((a: any, b: any) => {
    const pA = new Decimal(a.price);
    const pB = new Decimal(b.price);
    if (isBuy) {
      return pA.cmp(pB); // ascending
    } else {
      return pB.cmp(pA); // descending
    }
  });

  let remainingToFill = new Decimal(newOrder.remainingAmount);
  let totalFilledAmount = new Decimal(0);
  let totalSpentOrReceived = new Decimal(0);
  
  const now = new Date();

  for (const makerOrder of matchingOrders) {
    if (remainingToFill.lte(0)) break;

    const makerPrice = new Decimal(makerOrder.price);
    
    if (newOrder.type === 'LIMIT') {
      const takerPrice = new Decimal(newOrder.price);
      if (isBuy && takerPrice.lt(makerPrice)) break; // limit buy price is lower than lowest ask
      if (!isBuy && takerPrice.gt(makerPrice)) break; // limit sell price is higher than highest bid
    }

    const makerRemaining = new Decimal(makerOrder.remainingAmount);
    const fillAmount = Decimal.min(remainingToFill, makerRemaining);

    // Execute match
    remainingToFill = remainingToFill.minus(fillAmount);
    totalFilledAmount = totalFilledAmount.plus(fillAmount);
    const cost = fillAmount.times(makerPrice);
    totalSpentOrReceived = totalSpentOrReceived.plus(cost);

    // Update Maker Order
    const newMakerRemaining = makerRemaining.minus(fillAmount);
    const newMakerFilled = new Decimal(makerOrder.filledAmount).plus(fillAmount);
    const makerStatus = newMakerRemaining.lte(0) ? 'FILLED' : 'OPEN';

    await db.update(orders).set({
      remainingAmount: newMakerRemaining.toString(),
      filledAmount: newMakerFilled.toString(),
      status: makerStatus,
      updatedAt: now
    }).where(eq(orders.id, makerOrder.id));

    // Create Trade Record
    const tradeId = crypto.randomUUID();
    const tradeDisplayId = await generateBusinessId(db, 'system', 'TRAD');

    const makerFeeAmt = fillAmount.times(makerPrice).times(marketInfo.makerFee);
    const takerFeeAmt = fillAmount.times(makerPrice).times(marketInfo.takerFee);

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
    const makerReceiveAsset = makerOrder.side === 'BUY' ? marketInfo.baseAsset : marketInfo.quoteAsset;
    const makerReceiveGross = makerOrder.side === 'BUY' ? fillAmount : fillAmount.times(makerPrice);
    
    // Fee in receive asset
    const mFee = makerReceiveGross.times(marketInfo.makerFee);
    const makerReceiveNet = makerReceiveGross.minus(mFee);

    // Credit maker receive wallet
    let mRecWallet = await db.select().from(wallets).where(and(eq(wallets.userId, makerOrder.userId), eq(wallets.assetSymbol, makerReceiveAsset), eq(wallets.type, mode))).get();
    if (mRecWallet) {
      await db.update(wallets).set({ 
        balance: new Decimal(mRecWallet.balance).plus(makerReceiveNet).toString(),
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
    const makerSpendGross = makerOrder.side === 'BUY' ? fillAmount.times(makerPrice) : fillAmount;
    
    let mSpdWallet = await db.select().from(wallets).where(and(eq(wallets.userId, makerOrder.userId), eq(wallets.assetSymbol, makerSpendAsset), eq(wallets.type, mode))).get();
    if (mSpdWallet) {
      await db.update(wallets).set({
        lockedBalance: Decimal.max(0, new Decimal(mSpdWallet.lockedBalance).minus(makerSpendGross)).toString(),
        updatedAt: now
      }).where(eq(wallets.id, mSpdWallet.id));
    }
  }

  return {
    remainingToFill: remainingToFill.toNumber(),
    totalFilledAmount: totalFilledAmount.toNumber(),
    totalSpentOrReceived: totalSpentOrReceived.toNumber(),
    averagePrice: totalFilledAmount.gt(0) ? totalSpentOrReceived.div(totalFilledAmount).toNumber() : 0
  };
}
