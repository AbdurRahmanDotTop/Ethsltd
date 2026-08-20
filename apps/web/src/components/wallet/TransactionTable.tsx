"use client";

import { useState } from "react";
import { WalletTransaction } from "@/lib/wallet/types";
import { ArrowDownLeft, ArrowUpRight, CheckCircle2, Clock, XCircle, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function TransactionTable({ transactions }: { transactions: WalletTransaction[] }) {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<string>("ALL");

  const filteredTxs = transactions.filter(tx => {
    if (filterType !== "ALL" && !tx.type.startsWith(filterType)) return false;
    if (search && !tx.id.toLowerCase().includes(search.toLowerCase()) && !tx.asset.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "COMPLETED": return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case "PENDING":
      case "PROCESSING": return <Clock className="w-4 h-4 text-yellow-500" />;
      default: return <XCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED": return "text-green-500 bg-green-500/10 border-green-500/20";
      case "PENDING":
      case "PROCESSING": return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
      default: return "text-red-500 bg-red-500/10 border-red-500/20";
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col h-full">
      <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-4 justify-between items-center bg-muted/20">
        <h3 className="font-semibold text-foreground">Transaction History</h3>
        
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <div className="flex flex-wrap items-center gap-1 bg-muted p-1 rounded-md w-full sm:w-auto justify-center">
            {["ALL", "DEPOSIT", "WITHDRAWAL", "TRADE", "P2P", "CONVERT", "SERVICE"].map(t => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-colors ${
                  filterType === t 
                    ? 'bg-background text-foreground shadow-sm' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {t === "ALL" ? "All" : t.charAt(0) + t.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
          
          <div className="relative w-full sm:w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search ID or Asset..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left min-w-[800px] border-collapse">
          <thead>
            <tr className="border-b border-border bg-muted/10">
              <th className="px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Asset</th>
              <th className="px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider text-right">Reference ID</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredTxs.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                  No transactions found.
                </td>
              </tr>
            ) : (
              filteredTxs.map((tx) => {
                const isPositive = tx.amount > 0;
                
                return (
                  <tr key={tx.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-foreground">
                        {new Date(tx.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {tx.type === "DEPOSIT" ? (
                          <div className="p-1.5 rounded-full bg-green-500/10 text-green-500"><ArrowDownLeft className="w-3.5 h-3.5" /></div>
                        ) : tx.type === "WITHDRAWAL" ? (
                          <div className="p-1.5 rounded-full bg-red-500/10 text-red-500"><ArrowUpRight className="w-3.5 h-3.5" /></div>
                        ) : (
                          <div className="p-1.5 rounded-full bg-blue-500/10 text-blue-500"><span className="w-3.5 h-3.5 flex items-center justify-center font-bold text-[10px]">⇄</span></div>
                        )}
                        <span className="text-sm font-medium text-foreground">{tx.type}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-foreground">{tx.asset}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`font-mono font-medium ${isPositive ? 'text-green-500' : 'text-foreground'}`}>
                        {isPositive ? '+' : ''}{tx.amount.toLocaleString(undefined, { maximumFractionDigits: 6 })} {tx.asset}
                      </div>
                      {tx.fee > 0 && (
                        <div className="text-xs text-muted-foreground mt-0.5">Fee: {tx.fee} {tx.asset}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${getStatusColor(tx.status)}`}>
                        {getStatusIcon(tx.status)}
                        {tx.status}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="font-mono text-xs text-muted-foreground">{tx.id}</div>
                      {tx.reference && (
                        <div className="text-xs text-muted-foreground mt-1 max-w-[200px] truncate ml-auto" title={tx.reference}>
                          {tx.reference}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
