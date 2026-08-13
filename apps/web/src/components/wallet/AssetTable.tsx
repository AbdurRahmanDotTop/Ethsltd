"use client";

import { useState } from "react";
import { AssetBalance } from "@/lib/wallet/types";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function AssetTable({ balances }: { balances: AssetBalance[] }) {
  const [search, setSearch] = useState("");
  const [hideZero, setHideZero] = useState(false);

  const filteredBalances = balances.filter((b) => {
    if (hideZero && b.total === 0) return false;
    if (search && !b.symbol.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col h-full">
      <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-4 justify-between items-center bg-muted/20">
        <h3 className="font-semibold text-foreground">Your Assets</h3>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search assets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9"
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer shrink-0">
            <input
              type="checkbox"
              checked={hideZero}
              onChange={(e) => setHideZero(e.target.checked)}
              className="rounded border-border bg-background"
            />
            Hide Zero
          </label>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left min-w-[700px] border-collapse">
          <thead>
            <tr className="border-b border-border bg-muted/10">
              <th className="px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Asset</th>
              <th className="px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Price / 24h</th>
              <th className="px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Balance</th>
              <th className="px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider text-right">USD Value</th>
              <th className="px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredBalances.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                  No assets found matching your criteria.
                </td>
              </tr>
            ) : (
              filteredBalances.map((b) => (
                <tr key={b.assetId} className="hover:bg-muted/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 font-bold flex items-center justify-center text-sm border border-brand-500/20">
                        {b.symbol.charAt(0)}
                      </div>
                      <span className="font-semibold text-foreground">{b.symbol}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-foreground">
                      ${b.usdPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: b.usdPrice < 1 ? 4 : 2 })}
                    </div>
                    {b.symbol !== 'USD' && b.symbol !== 'USDT' && b.symbol !== 'USDC' && (
                      <div className={`text-xs ${b.change24hPercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {b.change24hPercent >= 0 ? '+' : ''}{b.change24hPercent.toFixed(2)}%
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-foreground">
                      {b.total.toLocaleString(undefined, { maximumFractionDigits: 6 })} <span className="text-muted-foreground text-xs">{b.symbol}</span>
                    </div>
                    {b.locked > 0 && (
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {b.locked.toLocaleString(undefined, { maximumFractionDigits: 6 })} locked
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="font-medium text-foreground">
                      ${b.usdValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/wallet/deposit?asset=${b.symbol}`}>
                        <Button variant="ghost" size="sm" className="h-8 text-xs">Deposit</Button>
                      </Link>
                      <Link href={`/wallet/withdraw?asset=${b.symbol}`}>
                        <Button variant="ghost" size="sm" className="h-8 text-xs">Withdraw</Button>
                      </Link>
                      <Link href={`/trade?market=${b.symbol}-USDT`}>
                        <Button variant="secondary" size="sm" className="h-8 text-xs">Trade</Button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
