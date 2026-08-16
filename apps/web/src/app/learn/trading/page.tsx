import { Button } from "@/components/ui/button"
import Link from "next/link"

export const metadata = {
  title: "Trading Guide | ETHSLTD Learn",
  description: "Learn how to execute market orders, limit orders, and read order books.",
}

export default function TradingGuide() {
  return (
    <article className="max-w-3xl prose prose-invert">
      <div className="mb-6 flex gap-2 text-sm text-muted-foreground">
        <Link href="/learn" className="hover:text-foreground">Learn</Link>
        <span>/</span>
        <span className="text-foreground">Trading Guide</span>
      </div>
      
      <h2 className="text-3xl font-bold text-foreground mb-6">Trading Guide</h2>
      
      <div className="space-y-6 text-muted-foreground">
        <section>
          <h3 className="text-xl font-semibold text-foreground mb-3">Market Orders vs Limit Orders</h3>
          <p>
            <strong>Market Order:</strong> An order to buy or sell immediately at the best available current price. It guarantees execution but not the specific price.
          </p>
          <p className="mt-2">
            <strong>Limit Order:</strong> An order placed on the order book with a specific limit price. It guarantees the price (or better) but does not guarantee execution if the market never reaches your limit price.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-foreground mb-3">The Order Book</h3>
          <p>
            The order book is a list of all open buy and sell limit orders for an asset, organized by price. 
            The top of the book shows the highest bid (buy) and lowest ask (sell). The difference between these two prices is called the <strong>Spread</strong>.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-foreground mb-3">Reading Candlestick Charts</h3>
          <p>
            Candlestick charts show the price movement over a specific timeframe (e.g., 1 Hour). 
            Each candle displays the Open, High, Low, and Close (OHLC) prices. Green candles mean the price closed higher than it opened; red candles mean it closed lower.
          </p>
        </section>
      </div>

      <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
        <Button variant="outline" className="w-full sm:w-auto" asChild>
          <Link href="/learn/crypto-basics">&larr; Previous: Crypto Basics</Link>
        </Button>
        <Button className="w-full sm:w-auto" asChild>
          <Link href="/learn/demo-trading">Next: Demo Trading &rarr;</Link>
        </Button>
      </div>
    </article>
  )
}
