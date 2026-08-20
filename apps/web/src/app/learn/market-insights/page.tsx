import { Button } from "@/components/ui/button"
import Link from "next/link"

export const metadata = {
  title: "Market Insights | ETHSLTD Learn",
  description: "Read simulated market updates and overviews.",
}

export default function MarketInsights() {
  const articles = [
    { title: "Bitcoin Surges Past $60k in Simulated Rally", date: "Oct 24, 2026", category: "Market Update" },
    { title: "Understanding Ethereum's Layer 2 Solutions", date: "Oct 22, 2026", category: "Education" },
    { title: "The Rise of DeFi Lending Protocols", date: "Oct 15, 2026", category: "Deep Dive" },
  ]

  return (
    <article className="max-w-3xl prose prose-invert">
      <div className="mb-6 flex gap-2 text-sm text-muted-foreground">
        <Link href="/learn" className="hover:text-foreground">Learn</Link>
        <span>/</span>
        <span className="text-foreground">Market Insights</span>
      </div>
      
      <h2 className="text-3xl font-bold text-foreground mb-6">Market Insights</h2>
      
      <div className="bg-primary/10 border border-primary/20 p-4 rounded-lg mb-8">
        <p className="text-sm text-primary">
          <strong>Note:</strong> The articles below are simulated content for the demo-trading environment and do not represent actual financial advice.
        </p>
      </div>

      <div className="space-y-4">
        {articles.map((article, i) => (
          <div key={i} className="p-4 border border-border rounded-lg bg-card hover:border-primary/20 transition-colors">
            <div className="flex gap-2 items-center mb-2">
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-muted text-muted-foreground">{article.category}</span>
              <span className="text-xs text-muted-foreground">{article.date}</span>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1">{article.title}</h3>
            <p className="text-sm text-muted-foreground">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...</p>
          </div>
        ))}
      </div>

      <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
        <Button variant="outline" className="w-full sm:w-auto" asChild>
          <Link href="/learn/security">&larr; Previous: Security</Link>
        </Button>
        <Button className="w-full sm:w-auto" asChild>
          <Link href="/learn">Return to Learn Hub &rarr;</Link>
        </Button>
      </div>
    </article>
  )
}
