import { Market } from '@/lib/market-data/types'
import { MarketSparkline } from './MarketSparkline'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import Link from 'next/link'

export function MarketCard({ market }: { market: Market }) {
  const isPositive = market.priceChange24h >= 0;
  
  // Formatting logic
  const formatPrice = (price: number) => {
    return price < 0.1 
      ? price.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 8 })
      : price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 hover:border-foreground/20 transition-colors">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-foreground/10 flex items-center justify-center font-bold text-sm">
            {market.baseAsset[0]}
          </div>
          <div>
            <div className="font-medium text-foreground">{market.symbol}</div>
            <div className="text-xs text-muted-foreground">{market.name}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="font-mono text-foreground font-medium">${formatPrice(market.price)}</div>
          <div className={cn("text-xs font-mono font-medium", isPositive ? "text-success" : "text-danger")}>
            {isPositive ? '+' : ''}{market.priceChange24h.toFixed(2)}%
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between mt-4">
        <MarketSparkline data={market.sparkline} isPositive={isPositive} />
        <div className="flex gap-2">
          <Button size="sm" variant="ghost" className="h-8" asChild>
            <Link href={`/trade/${market.id}`}>View</Link>
          </Button>
          <Button size="sm" className="h-8" asChild>
            <Link href={`/trade/${market.id}`}>Trade</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
