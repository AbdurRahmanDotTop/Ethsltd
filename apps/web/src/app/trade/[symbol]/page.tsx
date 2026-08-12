import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { TradingTerminal } from "@/components/trading/TradingTerminal"
import { Metadata } from "next"

export async function generateMetadata({ params }: { params: { symbol: string } }): Promise<Metadata> {
  const { symbol } = await params;
  return {
    title: `${symbol.toUpperCase().replace('-', '/')} Trading | ETHSLTD`,
    description: `Trade ${symbol.toUpperCase().replace('-', '/')} in the ETHSLTD paper trading terminal.`,
  }
}

export default async function TradePage({ params }: { params: { symbol: string } }) {
  const { symbol } = await params;
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex flex-col">
        <TradingTerminal symbol={symbol.toLowerCase()} />
      </main>
      <Footer />
    </div>
  )
}
