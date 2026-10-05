"use client"
import { useParams } from "next/navigation"
import { AppNavigation } from "@/components/layout/AppNavigation"
import { MobileMT5Chart } from "@/components/trading/MobileMT5Chart"

export default function ChartPage() {
  const params = useParams()
  const rawSymbol = decodeURIComponent((params?.symbol as string) || "btc-usdt");
  const symbol = rawSymbol.replace('_', '-').replace(' ', '-'); 

  return (
    <div className="flex flex-col min-h-screen bg-black text-white overflow-hidden">
      <main className="flex-1 flex flex-col relative w-full h-full max-w-2xl mx-auto md:border-x md:border-white/10">
        <MobileMT5Chart symbol={symbol.toLowerCase()} />
      </main>
      <AppNavigation />
    </div>
  )
}
