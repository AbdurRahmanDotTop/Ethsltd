import { MarketStats as MarketStatsType } from '@/lib/market-data/types'

function formatCompact(value: number) {
  if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
  return `$${value}`;
}

export function MarketStats({ stats }: { stats: MarketStatsType }) {
  return (
    <section className="py-6 bg-muted/30 border-b border-border">
      <div className="max-w-[1280px] mx-auto px-4 md:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-8">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-foreground">{stats.totalMarkets}+</span>
            <span className="text-sm font-medium text-muted-foreground">Total Markets</span>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-foreground">{formatCompact(stats.volume24h)}</span>
            <span className="text-sm font-medium text-muted-foreground">24h Volume</span>
          </div>
          <div className="flex flex-col hidden md:flex">
            <span className="text-2xl font-bold text-foreground">{stats.btcDominance}%</span>
            <span className="text-sm font-medium text-muted-foreground">BTC Dominance</span>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-foreground">{stats.activeAssets}+</span>
            <span className="text-sm font-medium text-muted-foreground">Active Assets</span>
          </div>
          <div className="flex flex-col hidden md:flex">
            <span className="text-2xl font-bold text-foreground">{stats.status}</span>
            <span className="text-sm font-medium text-muted-foreground">Markets Status</span>
          </div>
        </div>
      </div>
    </section>
  )
}
