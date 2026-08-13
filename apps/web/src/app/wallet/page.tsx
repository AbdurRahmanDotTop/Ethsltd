"use client";

import { useEffect, useState } from "react";
import { WalletHeader } from "@/components/wallet/WalletHeader";
import { WalletSummary } from "@/components/wallet/WalletSummary";
import { AssetTable } from "@/components/wallet/AssetTable";
import { PortfolioAllocation } from "@/components/wallet/PortfolioAllocation";
import { TransactionTable } from "@/components/wallet/TransactionTable";
import { apiClient } from "@ethsltd/api-client";
import { AssetBalance, PortfolioSummary, AssetAllocation, WalletTransaction } from "@/lib/wallet/types";
import { usePaperAccountStore } from "@/stores/paper-account-store";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function WalletPage() {
  const [balances, setBalances] = useState<AssetBalance[]>([]);
  const [summary, setSummary] = useState<PortfolioSummary | null>(null);
  const [allocations, setAllocations] = useState<AssetAllocation[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<WalletTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Subscribe to changes in the paper account store so the wallet updates when trades happen
  const storeBalances = usePaperAccountStore(state => state.balances);

  useEffect(() => {
    async function loadData() {
      try {
        const balanceData = await apiClient.getWalletBalances();
        setBalances(balanceData.data || []);
        
        const portfolioData = await apiClient.getWalletPortfolio();
        if (portfolioData.success && portfolioData.data) {
          setSummary(portfolioData.data.summary);
          setAllocations(portfolioData.data.allocations);
        }

        const txs = await apiClient.getWalletTransactions({ limit: 5 });
        setRecentTransactions(txs.data || []);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadData();
  }, [storeBalances]);

  if (isLoading || !summary) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <WalletHeader />
      
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
