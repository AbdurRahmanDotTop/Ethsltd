import { Market } from '@/lib/market-data/types'
import { MarketCard } from './MarketCard'

interface Props {
  title: string;
  markets: Market[];
}

export function MarketGridSection({ title, markets }: Props) {
  if (!markets || markets.length === 0) return null;
  return (
    <section className="py-10 border-b border-border last:border-0">
      <div className="max-w-[1280px] mx-auto px-4 md:px-8">
        <h2 className="text-2xl font-bold text-foreground mb-6 font-display">{title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {markets.map(m => <MarketCard key={m.id} market={m} />)}
        </div>
      </div>
    </section>
  )
}
