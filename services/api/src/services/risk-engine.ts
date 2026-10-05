import { Bindings, createDb } from '../db';
import { eq } from 'drizzle-orm';
import { positions } from 'database/schema/trading';
import { getRealPrice } from '../utils/price';
import Decimal from 'decimal.js';
import { and } from 'drizzle-orm';
import { markets } from 'database/schema/trading';
import { wallets, walletTransactions } from 'database/schema/wallets';
import { users } from 'database/schema/auth';
import { EmailService } from './email';

export async function runRiskEngine(env: Bindings, ctx?: any) {
  const db = createDb(env.DB);
  
  try {
    // 1. Fetch all OPEN positions
    const openPositions = await db.select().from(positions).where(eq(positions.status, 'OPEN')).all();
    if (!openPositions || openPositions.length === 0) return;

    // 2. Group by market to optimize price fetching
    const marketsToFetch = [...new Set(openPositions.map((p: any) => p.marketSymbol))];
    const prices: Record<string, Decimal> = {};
    
    for (const symbol of marketsToFetch) {
      const priceStr = await getRealPrice(symbol);
      if (priceStr) {
        prices[symbol] = new Decimal(priceStr);
      }
    }

    // 3. Evaluate each position
    for (const pos of openPositions) {
      const currentPrice = prices[pos.marketSymbol];
      if (!currentPrice) continue;

      const entry = new Decimal(pos.entryPrice);
      const amount = new Decimal(pos.amount);
      const margin = new Decimal(pos.marginAmount);

      let pnl = new Decimal(0);
      if (pos.side === 'LONG') {
        pnl = currentPrice.minus(entry).times(amount);
      } else {
        pnl = entry.minus(currentPrice).times(amount);
      }

      let shouldClose = false;
      let closeReason = '';

      // Check Stop Loss
      if (pos.stopLoss) {
        const sl = new Decimal(pos.stopLoss);
        if (pos.side === 'LONG' && currentPrice.lte(sl)) {
          shouldClose = true;
          closeReason = 'STOP_LOSS';
        } else if (pos.side === 'SHORT' && currentPrice.gte(sl)) {
          shouldClose = true;
          closeReason = 'STOP_LOSS';
        }
      }

      // Check Take Profit
      if (!shouldClose && pos.takeProfit) {
        const tp = new Decimal(pos.takeProfit);
        if (pos.side === 'LONG' && currentPrice.gte(tp)) {
          shouldClose = true;
          closeReason = 'TAKE_PROFIT';
        } else if (pos.side === 'SHORT' && currentPrice.lte(tp)) {
          shouldClose = true;
          closeReason = 'TAKE_PROFIT';
        }
      }

      // Check Liquidation (Stop-out level, assuming 50% for now)
      // Equity = Margin + PnL
      const equity = margin.plus(pnl);
      const marginLevel = equity.div(margin).times(100);
      
      if (!shouldClose && marginLevel.lte(50)) {
        shouldClose = true;
        closeReason = 'LIQUIDATION_STOP_OUT';
      }

      // Alert Engine: Margin Warning (Margin Call at 80%)
      if (!shouldClose && marginLevel.lte(80) && marginLevel.gt(50)) {
         console.log(`[AlertEngine] MARGIN CALL WARNING for position ${pos.id} on ${pos.marketSymbol}. Level: ${marginLevel.toFixed(2)}%`);
         // We should send an email to the user if we haven't recently. For now, we dispatch an email asynchronously.
         const emailService = new EmailService(env, db);
         const user = await db.select().from(users).where(eq(users.id, pos.userId)).get();
         if (user) {
            const emailPromise = emailService.sendUserTransactionAlert(
              user.email,
              'Margin Call Warning ⚠️',
              `Your position on ${pos.marketSymbol} has dropped to a margin level of ${marginLevel.toFixed(2)}%. Please add more funds to avoid liquidation at 50%.`,
              [
                { key: 'Position ID', value: pos.id },
                { key: 'Market', value: pos.marketSymbol },
                { key: 'Current PnL', value: pnl.toFixed(2) }
              ],
              `https://ethsltd.com/trading/${pos.marketSymbol}`,
              'Manage Position'
            ).catch(e => console.error(e));
            
            if (ctx?.waitUntil) {
               ctx.waitUntil(emailPromise);
            } else {
               await emailPromise;
            }
         }
      }

      // Execute Close (Mocking internal close call for now)
      if (shouldClose) {
        console.log(`[RiskEngine] Closing position ${pos.id} due to ${closeReason}. PnL: ${pnl.toString()}`);
        
        // In a real environment, we'd invoke the same atomic close logic 
        // as POST /positions/:id/close to ensure ledger updates happen safely.
        // For cron triggers, we call it internally:
        await internalClosePosition(db, pos, currentPrice, pnl, closeReason);
      }
    }
  } catch (err) {
    console.error('[RiskEngine] Error:', err);
  }
}

async function internalClosePosition(db: any, pos: any, currentPrice: Decimal, pnl: Decimal, reason: string) {
  const now = new Date();
  
  await db.transaction(async (tx: any) => {
    // 1. Mark position as closed
    await tx.update(positions).set({
      status: 'CLOSED',
      realizedPnl: new Decimal(pos.realizedPnl).plus(pnl).toString(),
      updatedAt: now
    }).where(eq(positions.id, pos.id));

    // 2. Fetch market info to know the quote asset
    const marketInfo = await tx.select().from(markets).where(eq(markets.symbol, pos.marketSymbol)).get();
    if (!marketInfo) return;

    // 3. Fetch user's quote wallet
    const quoteWallet = await tx.select().from(wallets)
      .where(and(eq(wallets.userId, pos.userId), eq(wallets.assetSymbol, marketInfo.quoteAsset)))
      .get();
      
    if (quoteWallet) {
      const margin = new Decimal(pos.marginAmount);
      // Determine what to return: original margin + pnl
      const totalReturn = margin.plus(pnl);
      
      const newLocked = Decimal.max(0, new Decimal(quoteWallet.lockedBalance).minus(margin));
      const newBalance = new Decimal(quoteWallet.balance).plus(totalReturn);
      
      await tx.update(wallets).set({
        lockedBalance: newLocked.toString(),
        balance: newBalance.toString(),
        updatedAt: now
      }).where(eq(wallets.id, quoteWallet.id));
      
      // 4. Create Ledger Entry for PnL
      if (!pnl.isZero()) {
        await tx.insert(walletTransactions).values({
          id: crypto.randomUUID(),
          userId: pos.userId,
          type: pnl.gt(0) ? 'TRADING_CREDIT' : 'TRADING_DEBIT',
          assetSymbol: marketInfo.quoteAsset,
          amount: pnl.abs().toString(),
          fee: '0',
          status: 'COMPLETED',
          reference: `risk_close_${pos.id}_${reason}`,
          createdAt: now,
          updatedAt: now,
        });
      }
    }
  });
}
