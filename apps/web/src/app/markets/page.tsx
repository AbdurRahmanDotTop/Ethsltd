import { Metadata } from "next"
import { MarketsHero } from "@/components/markets/MarketsHero"
import { MarketStats } from "@/components/markets/MarketStats"
import { MarketExplorer } from "@/components/markets/MarketExplorer"
import { MarketGridSection } from "@/components/markets/MarketGridSection"
import { MockMarketDataProvider } from "@/lib/market-data/mock-provider"
import { FinalCTA } from "@/components/home/FinalCTA"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"

export const metadata: Metadata = {
  title: "Crypto Markets | ETHSLTD",
  description: "Explore crypto markets on ETHSLTD. Track digital asset prices, 24h performance, volume, market trends, and trading opportunities.",
  openGraph: {
    title: "ETHSLTD Crypto Markets",
    description: "Explore crypto markets on ETHSLTD. Track digital asset prices, 24h performance, volume, market trends, and trading opportunities.",
  },
  twitter: {
    card: "summary_large_image",
  }
}

export default async function MarketsPage() {
  const stats = await MockMarketDataProvider.getMarketStats();
  const trending = await MockMarketDataProvider.getTrending();
  const topGainers = await MockMarketDataProvider.getTopGainers();
  const topLosers = await MockMarketDataProvider.getTopLosers();
  const newListings = await MockMarketDataProvider.getNewListings();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex flex-col">
        <MarketsHero />
        <MarketStats stats={stats} />
        <MarketExplorer />
        
        <div className="bg-muted/10 border-t border-border">
        <MarketGridSection title="Trending Markets" markets={trending} />
        <MarketGridSection title="Top Gainers" markets={topGainers} />
        <MarketGridSection title="Top Losers" markets={topLosers} />
        <MarketGridSection title="New on ETHSLTD" markets={newListings} />
      </div>

      <div className="py-12 border-t border-border bg-background text-center px-4">
        <p className="text-sm text-muted-foreground max-w-3xl mx-auto">
          Crypto markets are volatile. Prices and market data can change rapidly. Market information is provided for informational purposes and does not constitute financial advice.
        </p>
      </div>

      <FinalCTA />
      </main>
      <Footer />
    </div>
  )
}
