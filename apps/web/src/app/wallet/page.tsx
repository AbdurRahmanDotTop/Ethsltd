"use client";

import { useEffect, useState } from "react";
import { WalletHeader } from "@/components/wallet/WalletHeader";
import { WalletSummary } from "@/components/wallet/WalletSummary";
import { AssetTable } from "@/components/wallet/AssetTable";
import { PortfolioAllocation } from "@/components/wallet/PortfolioAllocation";
import { TransactionTable } from "@/components/wallet/TransactionTable";
import { apiClient } from "@ethsltd/api-client";
import { AssetBalance, PortfolioSummary, AssetAllocation, WalletTransaction } from "@/lib/wallet/types";
import { useWalletStore } from "@/stores/wallet-store";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useTradingModeStore } from "@/stores/trading-mode-store";

export default function WalletPage() {
  const [balances, setBalances] = useState<AssetBalance[]>([]);
  const [summary, setSummary] = useState<PortfolioSummary | null>(null);
  const [allocations, setAllocations] = useState<AssetAllocation[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<WalletTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { mode } = useTradingModeStore();

  // Subscribe to wallet store balances to trigger re-fetch when they change globally
  const storeBalances = useWalletStore(state => state.balances);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const balanceData = await apiClient.getWalletBalances(mode);
      setBalances(balanceData.data || []);
      
      const portfolioData = await apiClient.getWalletPortfolio(mode);
      if (portfolioData.success && portfolioData.data) {
        setSummary(portfolioData.data.summary);
        setAllocations(portfolioData.data.allocations);
      } else {
        setError(portfolioData.error || "Failed to load wallet data");
        // Set a fallback summary so it doesn't spin forever
        setSummary({
          totalValueUsd: 0,
          change24hUsd: 0,
          change24hPercent: 0,
          availableBalanceUsd: 0,
          lockedBalanceUsd: 0
        });
      }

      const txs = await apiClient.getWalletTransactions(mode);
      if (txs.success && txs.data) {
        setRecentTransactions(txs.data.slice(0, 5) || []);
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while loading wallet data");
      setSummary({
        totalValueUsd: 0,
        change24hUsd: 0,
        change24hPercent: 0,
        availableBalanceUsd: 0,
        lockedBalanceUsd: 0
      });
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [storeBalances, mode]);

  const handleTopUp = async () => {
    if (confirm("Are you sure you want to top up your paper trading balance with $100,000 USDT?")) {
      setIsLoading(true);
      await apiClient.topUpPaperWallet();
      await loadData();
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
        <p className="text-muted-foreground animate-pulse">Loading your wallet data...</p>
      </div>
    );
  }

  if (error && !summary) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="p-4 bg-destructive/10 text-destructive rounded-lg max-w-md text-center">
          <p className="font-semibold mb-2">Error Loading Wallet</p>
          <p className="text-sm">{error}</p>
        </div>
        <Button onClick={loadData} variant="outline">Try Again</Button>
      </div>
    );
  }

  if (!summary) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            {mode === 'PAPER' ? 'Paper Trading Wallet' : 'Spot Wallet'}
          </h2>
          <p className="text-muted-foreground mt-1">
            {mode === 'PAPER' 
              ? 'Manage your simulated balances and test strategies risk-free.' 
              : 'Manage your real digital assets and balances.'}
          </p>
        </div>
        {mode === 'PAPER' && (
          <Button onClick={handleTopUp} className="bg-orange-500 hover:bg-orange-600 text-white font-medium shadow shadow-orange-500/20">
            Top Up Paper Balance (100k USDT)
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <WalletSummary summary={summary} />
        </div>
        <div className="lg:col-span-4">
          <PortfolioAllocation allocations={allocations} />
        </div>
      </div>

      <div className="mt-8">
        <AssetTable balances={balances} />
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg text-foreground">Recent Activity</h3>
          <Link href="/wallet/history">
            <Button variant="link">View All</Button>
          </Link>
        </div>
        <TransactionTable transactions={recentTransactions} />
      </div>
    </div>
  );
}
