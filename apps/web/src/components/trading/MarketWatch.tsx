"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { apiClient } from "@ethsltd/api-client"
import { formatPrice } from "@/lib/trading/calculations"
import { cn } from "@/lib/utils"

export function MarketWatch({ currentSymbol }: { currentSymbol: string }) {
  const [markets, setMarkets] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [prices, setPrices] = useState<Record<string, { bid: number, ask: number, change: number }>>({})
  const router = useRouter()

  useEffect(() => {
    let mounted = true
    const load = async () => {
      const res = await apiClient.getMarkets()
      if (res.success && res.data && mounted) {
        setMarkets(res.data)
        // Initialize prices
        const initialPrices: Record<string, { bid: number, ask: number, change: number }> = {}
        res.data.forEach((m: any) => {
          const spread = m.price * 0.0001; // Fake spread for UI
          initialPrices[m.symbol] = {
            bid: m.price - spread,
            ask: m.price + spread,
            change: m.priceChange24h || 0
          }
        })
        setPrices(initialPrices)
      }
    }
    load()

    // Setup WebSockets for real-time Market Watch
    const wsUrl = (process.env.NEXT_PUBLIC_API_URL || '').replace('http', 'ws') + '/ws/stream';
    const ws = new WebSocket(wsUrl);
    
    ws.onopen = () => {
      // In a real app we'd subscribe to "ALL" or specific watchlist
      ws.send(JSON.stringify({ type: 'subscribe', symbol: 'ALL' }));
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'ticker' && mounted) {
          setPrices(prev => {
             const spread = parseFloat(data.price) * 0.0001;
             return {
               ...prev,
               [data.symbol]: {
                 bid: parseFloat(data.price) - spread,
                 ask: parseFloat(data.price) + spread,
                 change: prev[data.symbol]?.change || 0
               }
             }
          });
        }
      } catch(e) {}
    }

    return () => { 
      mounted = false;
      ws.close();
    }
  }, [])

  const filtered = markets.filter(m => m.symbol.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="flex flex-col h-full bg-background border border-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-2 bg-muted/50 border-b border-border">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Market Watch</span>
      </div>

      {/* Search */}
      <div className="relative p-2 border-b border-border">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        <input 
          type="text" 
          placeholder="Click to add..." 
          className="w-full bg-muted/30 border border-border h-7 pl-8 pr-2 rounded-sm text-xs focus:outline-none focus:border-brand-foreground"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* List Header */}
      <div className="flex px-2 py-1.5 text-[10px] font-medium text-muted-foreground border-b border-border/50">
        <div className="flex-1">Symbol</div>
        <div className="w-20 text-right">Bid</div>
        <div className="w-20 text-right">Ask</div>
      </div>

      {/* Symbols List */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {filtered.map(m => {
          const p = prices[m.symbol]
          const isSelected = m.symbol === currentSymbol || m.id === currentSymbol
          
          return (
            <div 
              key={m.id}
              onClick={() => router.push(`/trade/${m.id}`)}
              className={cn(
                "flex px-2 py-1.5 text-xs border-b border-border/20 cursor-pointer transition-colors",
                isSelected ? "bg-brand-foreground/10" : "hover:bg-muted/30"
              )}
            >
              <div className="flex-1 flex flex-col justify-center">
                <span className={cn("font-bold", isSelected ? "text-brand-foreground" : "text-foreground")}>
                  {m.symbol}
                </span>
              </div>
              <div className="w-20 text-right flex flex-col justify-center">
                <span className={cn("font-mono", (p?.change ?? 0) >= 0 ? "text-info" : "text-danger")}>
                  {p?.bid ? formatPrice(p.bid) : "---"}
                </span>
              </div>
              <div className="w-20 text-right flex flex-col justify-center">
                <span className={cn("font-mono", (p?.change ?? 0) >= 0 ? "text-info" : "text-danger")}>
                  {p?.ask ? formatPrice(p.ask) : "---"}
                </span>
              </div>
            </div>
          )
        })}
        {filtered.length === 0 && <div className="p-4 text-center text-xs text-muted-foreground">No symbols found.</div>}
      </div>
    </div>
  )
}
