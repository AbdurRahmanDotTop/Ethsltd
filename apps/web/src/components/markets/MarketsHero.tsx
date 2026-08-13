import { Button } from "@/components/ui/button"
import Link from "next/link"

export function MarketsHero() {
  return (
    <section className="relative pt-16 pb-12 md:pt-24 md:pb-16 overflow-hidden border-b border-border bg-background">
      {/* Background gradients */}
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-brand-foreground/5 to-transparent pointer-events-none" />
      
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 relative z-10 text-center">
        <h1 className="text-4xl md:text-6xl font-display font-bold text-foreground tracking-tight mb-4">
          Explore Crypto Markets
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Track prices, trends, volume, and performance across the ETHSLTD digital-asset markets.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button size="lg" className="w-full sm:w-auto h-12 px-8 text-base" asChild>
            <Link href="/trade">Start Trading</Link>
          </Button>
          <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 px-8 text-base" asChild>
            <Link href="/learn/paper-trading">Try Paper Trading</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
