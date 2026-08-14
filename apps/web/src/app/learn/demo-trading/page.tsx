import { Button } from "@/components/ui/button"
import Link from "next/link"

export const metadata = {
  title: "Demo Trading | ETHSLTD Learn",
  description: "Learn how to use our simulated trading environment.",
}

export default function DemoTradingGuide() {
  return (
    <article className="max-w-3xl prose prose-invert">
      <div className="mb-6 flex gap-2 text-sm text-muted-foreground">
        <Link href="/learn" className="hover:text-foreground">Learn</Link>
        <span>/</span>
        <span className="text-foreground">Demo Trading</span>
      </div>
      
      <h2 className="text-3xl font-bold text-foreground mb-6">Demo Trading</h2>
      
      <div className="space-y-6 text-muted-foreground">
        <section>
          <h3 className="text-xl font-semibold text-foreground mb-3">What is Demo Trading?</h3>
          <p>
            Demo trading is simulated trading that allows you to buy and sell cryptocurrencies without risking real money. You are provided with a virtual balance (e.g., $10,000 USD) to practice trading against live, real-world market data.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-foreground mb-3">Why Use Demo Trading?</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Test Strategies:</strong> Try out new technical analysis methods without financial risk.</li>
            <li><strong>Learn the Interface:</strong> Get comfortable with placing Market and Limit orders on our platform.</li>
            <li><strong>Understand Volatility:</strong> See how fast crypto markets can move in real-time.</li>
          </ul>
        </section>
        
        <div className="bg-brand-500/10 border border-brand-500/20 p-4 rounded-lg my-6">
          <p className="text-sm text-brand-200">
            <strong>Note:</strong> Currently, the entire ETHSLTD platform operates in a simulated (demo trading) environment. Any funds shown in your Wallet or Trade pages are virtual and hold no real-world value.
          </p>
        </div>
      </div>

      <div className="mt-12 pt-8 border-t border-border flex justify-between items-center">
        <Button variant="outline" asChild>
          <Link href="/learn/trading">&larr; Previous: Trading Guide</Link>
        </Button>
        <Button asChild>
          <Link href="/trade">Start Demo Trading &rarr;</Link>
        </Button>
      </div>
    </article>
  )
}
