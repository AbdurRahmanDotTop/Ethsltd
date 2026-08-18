import { PortfolioSummary } from "@/lib/wallet/types";
import { TrendingUp, TrendingDown, Info } from "lucide-react";
import { useWalletStore } from "@/stores/wallet-store";

export function WalletSummary({ summary }: { summary: PortfolioSummary }) {
  const isPositive = summary.change24hUsd >= 0;
  const { fiatCurrency, fiatExchangeRate } = useWalletStore();
  const exchangeRate = fiatExchangeRate || 1;
  const symbol = fiatCurrency === 'INR' ? '₹' : '$';

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
      <div className="flex items-center gap-2 text-muted-foreground text-sm mb-4">
        Total Portfolio Value
        <Info className="w-4 h-4" />
      </div>
      
      <div className="mb-6">
        <div className="text-4xl sm:text-5xl font-bold font-display text-foreground tracking-tight">
          {summary.totalValueUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-2xl sm:text-3xl text-muted-foreground">USDT</span>
        </div>
        <div className="text-muted-foreground font-medium mt-1">
          ≈ {symbol}{(summary.totalValueUsd * exchangeRate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
        <div className={`flex items-center gap-2 mt-2 text-sm font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
          {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          <span>
            {isPositive ? '+' : ''}{summary.change24hUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDT
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
            {summary.availableBalanceUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-sm text-muted-foreground">USDT</span>
          </div>
          <div className="text-xs text-muted-foreground mt-0.5">
            ≈ {symbol}{(summary.availableBalanceUsd * exchangeRate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground mb-1">Locked Funds</div>
          <div className="text-lg font-semibold text-foreground">
            {summary.lockedBalanceUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-sm text-muted-foreground">USDT</span>
          </div>
          <div className="text-xs text-muted-foreground mt-0.5">
            ≈ {symbol}{(summary.lockedBalanceUsd * exchangeRate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
      </div>
    </div>
  );
}
