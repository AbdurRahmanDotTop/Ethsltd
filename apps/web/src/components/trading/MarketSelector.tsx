"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, ChevronDown } from "lucide-react"
import { Market } from "@/lib/market-data/types"
import { MockMarketDataProvider } from "@/lib/market-data/mock-provider"
import { Button } from "@/components/ui/button"

export function MarketSelector({ currentSymbol }: { currentSymbol: string }) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [markets, setMarkets] = useState<Market[]>([])
  const router = useRouter()

  useEffect(() => {
    if (open) {
      MockMarketDataProvider.getMarkets({ search }, undefined, { page: 1, pageSize: 20 }).then(res => setMarkets(res.items))
    }
  }, [search, open])

  return (
    <div className="relative">
      <Button variant="ghost" className="font-bold text-xl px-2 h-10 hover:bg-muted" onClick={() => setOpen(!open)}>
        {currentSymbol} <ChevronDown className="ml-2 h-4 w-4 text-muted-foreground" />
      </Button>
      
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute top-full left-0 mt-2 w-72 bg-background border border-border rounded-lg shadow-xl z-50 overflow-hidden">
            <div className="p-2 border-b border-border">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder="Search markets..." 
                  className="w-full bg-muted border-none h-8 pl-8 pr-2 rounded text-sm focus:outline-none focus:ring-1 focus:ring-brand-foreground"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="max-h-64 overflow-y-auto p-1">
              {markets.map(m => (
                <button 
                  key={m.id} 
                  className="w-full flex items-center justify-between p-2 hover:bg-muted rounded text-left text-sm"
                  onClick={() => {
                    setOpen(false)
                    router.push(`/trade/${m.id}`)
                  }}
                >
                  <span className="font-semibold">{m.symbol}</span>
                  <span className="text-muted-foreground">${m.price}</span>
                </button>
              ))}
              {markets.length === 0 && <div className="p-4 text-center text-sm text-muted-foreground">No markets found</div>}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
