import { PortfolioSummary } from "@/lib/wallet/types";
import { TrendingUp, TrendingDown, Info } from "lucide-react";
import { useWalletStore } from "@/stores/wallet-store";

export function WalletSummary({ summary }: { summary: PortfolioSummary }) {
  const isPositive = summary.change24hUsd >= 0;
  const { fiatCurrency } = useWalletStore();
  const exchangeRate = fiatCurrency === 'INR' ? 84.5 : 1;
  const symbol = fiatCurrency === 'INR' ? '₹' : '$';

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
      <div className="flex items-center gap-2 text-muted-foreground text-sm mb-4">
        Total Portfolio Value
        <Info className="w-4 h-4" />
      </div>
      
      <div className="mb-6">
        <div className="text-4xl sm:text-5xl font-bold font-display text-foreground tracking-tight">
          {symbol}{(summary.totalValueUsd * exchangeRate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
        <div className={`flex items-center gap-2 mt-2 text-sm font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
          {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          <span>
            {isPositive ? '+' : ''}{symbol}{(Math.abs(summary.change24hUsd) * exchangeRate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <span className="px-1.5 py-0.5 rounded-md bg-background/50 border border-border">
            {isPositive ? '+' : ''}{summary.change24hPercent.toFixed(2)}%
          </span>
          <span className="text-muted-foreground font-normal ml-1">Today</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-6 border-t border-border">
        <div>
          <div className="text-sm text-muted-foreground mb-1">Available Balance</div>
          <div className="text-lg font-semibold text-foreground">
            {symbol}{(summary.availableBalanceUsd * exchangeRate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground mb-1">Locked Funds</div>
          <div className="text-lg font-semibold text-foreground">
            {symbol}{(summary.lockedBalanceUsd * exchangeRate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
      </div>
    </div>
  );
}
