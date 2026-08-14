"use client";

import { useEffect, useState } from "react";
import { TransactionTable } from "@/components/wallet/TransactionTable";
import { WalletTransaction } from "@/lib/wallet/types";
import { apiClient } from "@ethsltd/api-client";
import { Loader2, ArrowLeft, Download } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useTradingModeStore } from "@/stores/trading-mode-store";

export default function WalletHistoryPage() {
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { mode } = useTradingModeStore();

  useEffect(() => {
    async function loadData() {
      try {
        const response = await apiClient.getWalletTransactions(mode);
        setTransactions(response.data || []);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [mode]);

  const handleExportCSV = () => {
    const headers = ["Transaction ID", "Date", "Type", "Asset", "Amount", "Fee", "Status"];
    const rows = transactions.map(tx => [
      tx.id,
      new Date(tx.createdAt).toISOString(),
      tx.type,
      tx.asset,
      tx.amount.toString(),
      tx.fee.toString(),
      tx.status
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      + rows.map(e => e.join(",")).join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "ethsltd_wallet_history.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/wallet">
            <Button variant="ghost" size="icon" className="h-10 w-10">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Transaction History</h1>
        </div>
        <Button variant="outline" onClick={handleExportCSV}>
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      <TransactionTable transactions={transactions} />
    </div>
  );
}
