import { Market } from "@/lib/market-data/types";
import { formatPrice } from "@/lib/trading/calculations";
import { cn } from "@/lib/utils";

interface MarketSummaryProps {
  market: Market;
}

export function MarketSummary({ market }: MarketSummaryProps) {
  const isPositive = market.priceChange24h >= 0;

  return (
    <div className="flex items-center gap-4 md:gap-6 text-sm py-1 whitespace-nowrap">
      <div className="flex flex-col">
        <span className="text-muted-foreground text-xs">Last Price</span>
        <span className={cn("font-mono font-medium text-base", isPositive ? "text-success" : "text-danger")}>
          {formatPrice(market.price)}
        </span>
      </div>

      <div className="flex flex-col">
        <span className="text-muted-foreground text-xs">24h Change</span>
        <span className={cn("font-mono font-medium", isPositive ? "text-success" : "text-danger")}>
          {isPositive ? '+' : ''}{market.priceChange24h.toFixed(2)}%
        </span>
      </div>

      <div className="flex flex-col hidden sm:flex">
        <span className="text-muted-foreground text-xs">24h High</span>
        <span className="font-mono text-foreground font-medium">{formatPrice(market.high24h)}</span>
      </div>

      <div className="flex flex-col hidden sm:flex">
        <span className="text-muted-foreground text-xs">24h Low</span>
        <span className="font-mono text-foreground font-medium">{formatPrice(market.low24h)}</span>
      </div>

      <div className="flex flex-col hidden md:flex">
        <span className="text-muted-foreground text-xs">24h Volume({market.baseAsset})</span>
        <span className="font-mono text-foreground font-medium">
          {(market.volume24h / market.price).toLocaleString(undefined, { maximumFractionDigits: 2 })}
        </span>
      </div>
      
      <div className="flex flex-col hidden lg:flex">
        <span className="text-muted-foreground text-xs">24h Volume(USDT)</span>
        <span className="font-mono text-foreground font-medium">
          ${(market.volume24h).toLocaleString(undefined, { maximumFractionDigits: 0 })}
        </span>
      </div>
    </div>
  )
}
