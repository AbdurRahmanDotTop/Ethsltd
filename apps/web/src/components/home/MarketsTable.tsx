import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Link from "next/link"

const MOCK_MARKETS = [
  { asset: "BTC", name: "Bitcoin", price: "$104,284", change: "+2.41%", high: "$105,120", low: "$101,940", vol: "$2.4B", up: true },
  { asset: "ETH", name: "Ethereum", price: "$4,028", change: "+1.82%", high: "$4,100", low: "$3,950", vol: "$1.1B", up: true },
  { asset: "SOL", name: "Solana", price: "$188.32", change: "+4.20%", high: "$192.50", low: "$180.10", vol: "$850M", up: true },
  { asset: "BNB", name: "Binance Coin", price: "$701.42", change: "-0.31%", high: "$710.00", low: "$695.20", vol: "$420M", up: false },
  { asset: "XRP", name: "Ripple", price: "$2.91", change: "+1.14%", high: "$3.05", low: "$2.80", vol: "$650M", up: true },
]

export function MarketsTable() {
  return (
    <section className="bg-muted py-24">
      <div className="max-w-[1280px] mx-auto px-4 md:px-8">
        <div className="mb-12">
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
            Explore the Markets
          </h2>
          <p className="text-muted-foreground text-lg">
            Track the digital assets and trading pairs available through ETHSLTD.
          </p>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border text-sm font-medium text-muted-foreground">
                <th className="pb-4 font-medium pl-4">Asset</th>
                <th className="pb-4 font-medium">Price</th>
                <th className="pb-4 font-medium">24h Change</th>
                <th className="pb-4 font-medium">24h High</th>
                <th className="pb-4 font-medium">24h Low</th>
                <th className="pb-4 font-medium">24h Volume</th>
                <th className="pb-4 font-medium text-right pr-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_MARKETS.map((market, i) => (
                <tr key={i} className="border-b border-border hover:bg-foreground/[0.02] transition-colors">
                  <td className="py-4 pl-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-foreground/10 flex items-center justify-center font-bold text-xs">
                        {market.asset[0]}
                      </div>
                      <div>
                        <div className="font-medium text-foreground">{market.asset}/USDT</div>
                        <div className="text-xs text-muted-foreground">{market.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 font-mono text-foreground">{market.price}</td>
                  <td className={cn("py-4 font-mono font-medium", market.up ? "text-success" : "text-danger")}>
                    {market.change}
                  </td>
                  <td className="py-4 font-mono text-muted-foreground/90">{market.high}</td>
                  <td className="py-4 font-mono text-muted-foreground/90">{market.low}</td>
                  <td className="py-4 font-mono text-muted-foreground/90">{market.vol}</td>
                  <td className="py-4 text-right pr-4">
                    <Button variant="outline" size="sm" className="border-border hover:bg-foreground/10" asChild>
                      <Link href={`/trade?market=${market.asset}-USDT`}>Trade</Link>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
          {MOCK_MARKETS.map((market, i) => (
            <div key={i} className="bg-card border border-border rounded-lg p-4">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-foreground/10 flex items-center justify-center font-bold text-xs">
                    {market.asset[0]}
                  </div>
                  <div>
                    <div className="font-medium text-foreground">{market.asset}</div>
                    <div className="text-xs text-muted-foreground">{market.name}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-foreground font-medium">{market.price}</div>
                  <div className={cn("text-xs font-mono font-medium", market.up ? "text-success" : "text-danger")}>
                    {market.change}
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-border">
                <div>
                  <div className="text-xs text-muted-foreground">24h Volume</div>
                  <div className="font-mono text-sm text-muted-foreground/90">{market.vol}</div>
                </div>
                <Button variant="outline" size="sm" className="border-border" asChild>
                  <Link href={`/trade?market=${market.asset}-USDT`}>Trade</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Button variant="ghost" className="text-[var(--brand-foreground)] hover:text-foreground">
            View All Markets &rarr;
          </Button>
        </div>
      </div>
    </section>
  )
}
