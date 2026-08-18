"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { apiClient } from "@ethsltd/api-client"

export function LiveMarketTicker() {
  const [tickers, setTickers] = useState<any[]>([])

  useEffect(() => {
    let mounted = true;
    apiClient.getMarkets().then(res => {
      if (res.success && mounted && res.data) {
        const formatted = res.data.map((m: any) => ({
          pair: m.symbol,
          price: `$${m.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}`,
          change: `${m.priceChange24h >= 0 ? '+' : ''}${m.priceChange24h}%`,
          positive: m.priceChange24h >= 0
        }));
        setTickers(formatted);
      }
    }).catch(console.error);
    return () => { mounted = false; }
  }, []);

  if (tickers.length === 0) return null;

  return (
    <div className="w-full bg-muted border-y border-border py-3 overflow-hidden flex whitespace-nowrap">
      <div className="animate-marquee flex gap-12 px-6">
        {[...tickers, ...tickers, ...tickers, ...tickers].map((ticker, index) => (
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
