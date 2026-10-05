"use client"
import React, { useState, useEffect } from "react"
import { apiClient } from "@ethsltd/api-client"
import { Plus, Edit2, Menu, TrendingUp, TrendingDown, Clock, Search, X } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

export function QuotesList() {
  const [markets, setMarkets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSymbol, setSelectedSymbol] = useState<any | null>(null)
  const [simpleMode, setSimpleMode] = useState(false)
  const router = useRouter()

  useEffect(() => {
    let interval: NodeJS.Timeout
    const fetchMarkets = async () => {
      try {
        const res = await apiClient.getMarkets()
        if (res.success && res.data) {
          setMarkets(res.data)
        }
      } catch (e) {
        console.error("Failed to fetch markets", e)
      } finally {
        setLoading(false)
      }
    }
    fetchMarkets()
    interval = setInterval(fetchMarkets, 5000) // Poll every 5s for real-time feel
    return () => clearInterval(interval)
  }, [])

  const formatPrice = (price: number, tickSize: number = 5) => {
    if (!price) return { main: "0.00", last: "0", superText: "" }
    const pStr = price.toFixed(tickSize)
    // For MT5 style: e.g. 1.1227 5 (where 5 is superscript)
    const main = pStr.slice(0, -1)
    const last = pStr.slice(-1)
    return { main, last }
  }

  const handleAction = (action: string) => {
    if (!selectedSymbol) return

    switch (action) {
      case "new_order":
        router.push(`/trade/${selectedSymbol.symbol}`)
        break
      case "chart":
        router.push(`/trade/${selectedSymbol.symbol}`)
        break
      case "properties":
        // Could open a properties modal. For now, redirect to trade or show alert
        alert(`Properties for ${selectedSymbol.symbol}\nBase Asset: ${selectedSymbol.baseAsset}\nQuote Asset: ${selectedSymbol.quoteAsset}\n24h Vol: ${selectedSymbol.volume24h}`)
        break
      case "dom":
        // Depth of market, typically the order book on trade page
        router.push(`/trade/${selectedSymbol.symbol}`)
        break
      case "stats":
        alert(`24h High: ${selectedSymbol.high24h}\n24h Low: ${selectedSymbol.low24h}\n24h Change: ${selectedSymbol.priceChange24h.toFixed(2)}%`)
        break
      case "simple_mode":
        setSimpleMode(!simpleMode)
        break
      default:
        break
    }
    setSelectedSymbol(null)
  }

  // Format time as HH:MM:SS
  const currentTime = new Date().toLocaleTimeString('en-US', { hour12: false })

  return (
    <div className="bg-black min-h-screen text-white font-sans pb-20">
      {/* Top Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-black border-b border-white/5">
        <div className="flex items-center gap-4">
          <Menu className="w-6 h-6" />
          <h1 className="text-xl font-medium">Quotes</h1>
        </div>
        <div className="flex items-center gap-4">
          <Plus className="w-6 h-6 text-gray-400" />
          <Edit2 className="w-5 h-5 text-gray-400" />
        </div>
      </div>

      {/* List */}
      <div className="flex flex-col">
        {loading ? (
          <div className="flex justify-center p-10"><div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full" /></div>
        ) : (
          markets.map((market, idx) => {
            // Mocking bid/ask spread based on price
            const spreadPercent = 0.0005 // 0.05%
            const bid = market.price * (1 - spreadPercent)
            const ask = market.price * (1 + spreadPercent)
            const spreadPoints = Math.floor((ask - bid) * 10000)
            
            const bidFmt = formatPrice(bid)
            const askFmt = formatPrice(ask)
            const isUp = market.priceChange24h >= 0

            return (
              <div 
                key={market.id} 
                className="flex items-center justify-between px-4 py-3 border-b border-white/5 active:bg-white/5 cursor-pointer relative"
                onClick={() => setSelectedSymbol(market)}
              >
                {/* Left corner accent */}
                <div className={cn(
                  "absolute left-0 top-0 w-3 h-3",
                  isUp ? "bg-blue-500" : "bg-red-500"
                )} style={{ clipPath: "polygon(0 0, 100% 0, 0 100%)" }} />

                {/* Left side: Symbol & Info */}
                <div className="flex flex-col gap-1 pl-2">
                  <div className="font-bold text-lg tracking-tight">
                    {market.symbol.replace('-', '')}
                  </div>
                  {!simpleMode && (
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>{currentTime}</span>
                      <span>spread: {spreadPoints}</span>
                    </div>
                  )}
                </div>

                {/* Right side: Bid / Ask */}
                <div className="flex gap-6 text-right">
                  {/* BID */}
                  <div className="flex flex-col">
                    <div className={cn("font-bold text-lg", isUp ? "text-blue-500" : "text-red-500")}>
                      {bidFmt.main}<span className="text-sm align-top">{bidFmt.last}</span>
                    </div>
                    {!simpleMode && (
                      <div className="text-xs text-gray-500 flex items-center gap-1 justify-end">
                        <span className="text-[10px]">L:</span> {market.low24h?.toFixed(5)}
                      </div>
                    )}
                  </div>
                  {/* ASK */}
                  <div className="flex flex-col">
                    <div className={cn("font-bold text-lg", isUp ? "text-blue-500" : "text-red-500")}>
                      {askFmt.main}<span className="text-sm align-top">{askFmt.last}</span>
                    </div>
                    {!simpleMode && (
                      <div className="text-xs text-gray-500 flex items-center gap-1 justify-end">
                        <span className="text-[10px]">H:</span> {market.high24h?.toFixed(5)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Action Sheet Backdrop */}
      {selectedSymbol && (
        <div 
          className="fixed inset-0 bg-black/60 z-50 transition-opacity"
          onClick={() => setSelectedSymbol(null)}
        />
      )}

      {/* Action Sheet Menu */}
      <div 
        className={cn(
          "fixed bottom-0 left-0 w-full bg-[#1e1e1e] rounded-t-xl z-50 transition-transform duration-300 ease-out transform pb-safe",
          selectedSymbol ? "translate-y-0" : "translate-y-full"
        )}
      >
        {selectedSymbol && (
          <div className="flex flex-col pb-4">
            <div className="px-5 py-4 border-b border-white/10 text-gray-400 text-sm font-medium">
              {selectedSymbol.symbol.replace('-', '')}: {selectedSymbol.baseAsset} vs {selectedSymbol.quoteAsset}
            </div>
            
            <button className="text-left px-5 py-4 text-white hover:bg-white/5 active:bg-white/10 text-lg" onClick={() => handleAction("new_order")}>
              New Order
            </button>
            <button className="text-left px-5 py-4 text-white hover:bg-white/5 active:bg-white/10 text-lg" onClick={() => handleAction("chart")}>
              Chart
            </button>
            <button className="text-left px-5 py-4 text-white hover:bg-white/5 active:bg-white/10 text-lg" onClick={() => handleAction("properties")}>
              Properties
            </button>
            <button className="text-left px-5 py-4 text-white hover:bg-white/5 active:bg-white/10 text-lg" onClick={() => handleAction("dom")}>
              Depth Of Market
            </button>
            <button className="text-left px-5 py-4 text-white hover:bg-white/5 active:bg-white/10 text-lg" onClick={() => handleAction("stats")}>
              Market Statistics
            </button>
            <button className="text-left px-5 py-4 text-white hover:bg-white/5 active:bg-white/10 text-lg" onClick={() => handleAction("simple_mode")}>
              {simpleMode ? "Advanced view mode" : "Simple view mode"}
            </button>
          </div>
        )}
      </div>

    </div>
  )
}
