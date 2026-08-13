import { AssetBalance, PortfolioSummary, AssetAllocation, WalletTransaction } from "./types";
import { usePaperAccountStore } from "@/stores/paper-account-store";
import { useWalletStore } from "@/stores/wallet-store";
import { MockMarketDataProvider } from "@/lib/market-data/mock-provider";

export const mockWalletProvider = {
  async getBalances(): Promise<AssetBalance[]> {
    // 1. Get balances from the unified paper account store
    const balances = usePaperAccountStore.getState().balances;
    
    const marketsInfo = await MockMarketDataProvider.getMarkets(undefined, undefined, { page: 1, pageSize: 100 });
    const markets = marketsInfo.items;

    // 3. Map raw balances to rich AssetBalance objects
    return balances.map((b) => {
      // Find the price for this asset against USD (or USDT as proxy)
      let price = 1; // Default for USD, USDC, USDT
      let change24hPercent = 0;
      let change24h = 0;

      if (b.asset !== "USD" && b.asset !== "USDT" && b.asset !== "USDC") {
        const market = markets.find((m: any) => m.baseAsset === b.asset && (m.quoteAsset === "USD" || m.quoteAsset === "USDT"));
        if (market) {
          price = market.price;
          change24hPercent = market.priceChange24h;
          // Rough estimation of change value
          change24h = price - (price / (1 + change24hPercent / 100));
        }
      }

      return {
        assetId: b.asset.toLowerCase(),
        symbol: b.asset,
        available: b.available,
        locked: b.locked,
        total: b.total,
        usdPrice: price,
        usdValue: b.total * price,
        change24h,
        change24hPercent,
      };
    });
  },

  async getPortfolio(): Promise<{ summary: PortfolioSummary; allocations: AssetAllocation[] }> {
    const balances = await this.getBalances();

    let totalValueUsd = 0;
    let availableBalanceUsd = 0;
    let lockedBalanceUsd = 0;
    let totalChangeValueUsd = 0; // Total 24h P&L in USD based on current holdings

    balances.forEach((b) => {
      totalValueUsd += b.usdValue;
      availableBalanceUsd += b.available * b.usdPrice;
      lockedBalanceUsd += b.locked * b.usdPrice;
      
      // Calculate how much the USD value changed in 24h
      // If holding 1 BTC, and BTC changed +$200, totalChange is +$200
      totalChangeValueUsd += (b.total * b.change24h);
    });

    const change24hPercent = totalValueUsd > 0 
      ? (totalChangeValueUsd / (totalValueUsd - totalChangeValueUsd)) * 100 
      : 0;

    const summary: PortfolioSummary = {
      totalValueUsd,
      availableBalanceUsd,
      lockedBalanceUsd,
      change24hUsd: totalChangeValueUsd,
      change24hPercent,
    };

    // Calculate allocations (only for assets > 0)
    const allocations: AssetAllocation[] = balances
      .filter((b) => b.usdValue > 0)
      .map((b) => ({
        asset: b.symbol,
        percentage: (b.usdValue / totalValueUsd) * 100,
        usdValue: b.usdValue,
      }))
      .sort((a, b) => b.percentage - a.percentage); // Sort largest to smallest

    return { summary, allocations };
  },

  async getTransactions(options?: { type?: string; limit?: number; offset?: number }): Promise<WalletTransaction[]> {
    let txs = useWalletStore.getState().transactions;
    
    if (options?.type && options.type !== 'ALL') {
      txs = txs.filter(t => t.type === options.type);
    }
    
    // Simple pagination
    if (options?.offset !== undefined && options?.limit !== undefined) {
       return txs.slice(options.offset, options.offset + options.limit);
    }
    
    return txs.slice(0, options?.limit || 50);
  }
};
