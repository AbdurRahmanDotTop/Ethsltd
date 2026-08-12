"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

const MOCK_TICKERS = [
  { pair: "BTC/USDT", price: "$104,284", change: "+2.41%", positive: true },
  { pair: "ETH/USDT", price: "$4,028", change: "+1.82%", positive: true },
  { pair: "SOL/USDT", price: "$188.32", change: "+4.20%", positive: true },
  { pair: "BNB/USDT", price: "$701.42", change: "-0.31%", positive: false },
  { pair: "XRP/USDT", price: "$2.91", change: "+1.14%", positive: true },
  { pair: "ADA/USDT", price: "$1.45", change: "-1.05%", positive: false },
  { pair: "DOGE/USDT", price: "$0.42", change: "+5.12%", positive: true },
  { pair: "DOT/USDT", price: "$18.90", change: "+0.45%", positive: true },
]

export function LiveMarketTicker() {
  return (
    <div className="w-full bg-muted border-y border-border py-3 overflow-hidden flex whitespace-nowrap">
      <div className="animate-marquee flex gap-12 px-6">
        {[...MOCK_TICKERS, ...MOCK_TICKERS].map((ticker, index) => (
          <div key={index} className="flex items-center gap-3 font-mono text-sm cursor-pointer hover:opacity-80 transition-opacity">
            <span className="text-foreground font-medium">{ticker.pair}</span>
            <span className="text-muted-foreground">{ticker.price}</span>
            <span className={cn(ticker.positive ? "text-success" : "text-danger")}>
              {ticker.change}
            </span>
          </div>
        ))}
      </div>
      <style jsx>{`
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  )
}
