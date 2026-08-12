"use client"
import { useState, useEffect } from "react"
import { Search, Star, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
import { Market } from "@/lib/market-data/types"
import { MockMarketDataProvider } from "@/lib/market-data/mock-provider"
import { MarketSparkline } from "./MarketSparkline"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { cn } from "@/lib/utils"

const CATEGORIES = ["All", "Favorites", "USDT", "USDC", "BTC", "ETH", "New"]

export function MarketExplorer() {
  const [markets, setMarkets] = useState<Market[]>([])
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("All")
  const [sortField, setSortField] = useState<keyof Market>("volume24h")
  const [sortDir, setSortDir] = useState<'asc'|'desc'>("desc")
  const [loading, setLoading] = useState(true)
  const [favorites, setFavorites] = useState<string[]>([])

  useEffect(() => {
    try {
      const favs = JSON.parse(localStorage.getItem('ethsltd:market-favorites') || '[]')
      setFavorites(favs)
    } catch(e) { }
  }, [])

  useEffect(() => {
    setLoading(true)
    MockMarketDataProvider.getMarkets({ search, category }, { field: sortField, direction: sortDir }).then(res => {
      if (category === 'Favorites') {
        setMarkets(res.items.filter(m => favorites.includes(m.id)))
      } else {
        setMarkets(res.items)
      }
      setLoading(false)
    })
  }, [search, category, sortField, sortDir, favorites])

  const toggleFav = (id: string) => {
    const newFavs = favorites.includes(id) ? favorites.filter(f => f !== id) : [...favorites, id]
    setFavorites(newFavs)
    localStorage.setItem('ethsltd:market-favorites', JSON.stringify(newFavs))
  }

  const handleSort = (field: keyof Market) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDir('desc')
    }
  }

  const formatPrice = (price: number) => {
    return price < 0.1 
      ? price.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 8 })
      : price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };
  
  const formatCompact = (val: number) => {
    if (val >= 1e9) return `${(val/1e9).toFixed(2)}B`;
    if (val >= 1e6) return `${(val/1e6).toFixed(2)}M`;
    return val.toLocaleString();
  }

  const renderSortIcon = (field: keyof Market) => {
    if (sortField !== field) return <ArrowUpDown className="h-3 w-3 opacity-30 inline ml-1" />
    return sortDir === 'asc' ? <ArrowUp className="h-3 w-3 inline ml-1" /> : <ArrowDown className="h-3 w-3 inline ml-1" />
  }

  return (
    <section className="py-12 relative">
      <div className="max-w-[1280px] mx-auto px-4 md:px-8">
        
        {/* Search and Filter Row */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto no-scrollbar">
            {CATEGORIES.map(c => (
              <button 
                key={c}
                onClick={() => setCategory(c)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap",
                  category === c 
                    ? "bg-foreground text-background" 
                    : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                )}
              >
                {c}
              </button>
            ))}
          </div>
          
          <div className="relative w-full md:w-72 shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input 
              type="text"
              placeholder="Search markets or assets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-background border border-border rounded-lg h-10 pl-10 pr-4 text-sm focus:outline-none focus:border-brand-foreground transition-colors"
            />
          </div>
        </div>

        {/* Table Area */}
        <div className="bg-background rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-muted/50 border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="py-4 pl-4 w-[50px]"></th>
                  <th className="py-4 font-semibold cursor-pointer hover:text-foreground transition-colors whitespace-nowrap" onClick={() => handleSort('symbol')}>
                    Market {renderSortIcon('symbol')}
                  </th>
                  <th className="py-4 font-semibold cursor-pointer hover:text-foreground transition-colors whitespace-nowrap" onClick={() => handleSort('price')}>
                    Price {renderSortIcon('price')}
                  </th>
                  <th className="py-4 font-semibold cursor-pointer hover:text-foreground transition-colors whitespace-nowrap" onClick={() => handleSort('priceChange24h')}>
                    24h Change {renderSortIcon('priceChange24h')}
                  </th>
                  <th className="py-4 font-semibold cursor-pointer hover:text-foreground transition-colors whitespace-nowrap hidden lg:table-cell" onClick={() => handleSort('high24h')}>
                    24h High {renderSortIcon('high24h')}
                  </th>
                  <th className="py-4 font-semibold cursor-pointer hover:text-foreground transition-colors whitespace-nowrap hidden lg:table-cell" onClick={() => handleSort('low24h')}>
                    24h Low {renderSortIcon('low24h')}
                  </th>
                  <th className="py-4 font-semibold cursor-pointer hover:text-foreground transition-colors whitespace-nowrap hidden sm:table-cell" onClick={() => handleSort('volume24h')}>
                    24h Volume {renderSortIcon('volume24h')}
                  </th>
                  <th className="py-4 font-semibold hidden xl:table-cell">Chart</th>
                  <th className="py-4 font-semibold text-right pr-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  Array.from({length: 10}).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="py-5 pl-4"><div className="w-5 h-5 bg-muted rounded"></div></td>
                      <td className="py-5"><div className="w-24 h-5 bg-muted rounded"></div></td>
                      <td className="py-5"><div className="w-20 h-5 bg-muted rounded"></div></td>
                      <td className="py-5"><div className="w-16 h-5 bg-muted rounded"></div></td>
                      <td className="py-5 hidden lg:table-cell"><div className="w-20 h-5 bg-muted rounded"></div></td>
                      <td className="py-5 hidden lg:table-cell"><div className="w-20 h-5 bg-muted rounded"></div></td>
                      <td className="py-5 hidden sm:table-cell"><div className="w-20 h-5 bg-muted rounded"></div></td>
                      <td className="py-5 hidden xl:table-cell"><div className="w-20 h-8 bg-muted rounded"></div></td>
                      <td className="py-5 pr-4 text-right"><div className="w-20 h-8 bg-muted rounded ml-auto"></div></td>
                    </tr>
                  ))
                ) : markets.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-20 text-center">
                      <div className="text-muted-foreground mb-4">No markets found matching your criteria.</div>
                      <Button variant="outline" onClick={() => {setSearch(""); setCategory("All")}}>Clear Search</Button>
                    </td>
                  </tr>
                ) : (
                  markets.map(market => {
                    const isPositive = market.priceChange24h >= 0;
                    return (
                      <tr key={market.id} className="hover:bg-muted/30 transition-colors group">
                        <td className="py-4 pl-4">
                          <button onClick={() => toggleFav(market.id)} className="text-muted-foreground hover:text-yellow-500 focus:outline-none">
                            <Star className={cn("h-5 w-5 transition-colors", favorites.includes(market.id) ? "fill-yellow-500 text-yellow-500" : "")} />
                          </button>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-foreground/10 flex items-center justify-center font-bold text-xs shrink-0">
                              {market.baseAsset[0]}
                            </div>
                            <div>
                              <div className="font-semibold text-foreground text-sm">{market.symbol}</div>
                              <div className="text-xs text-muted-foreground">{market.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 font-mono font-medium text-foreground text-sm">
                          ${formatPrice(market.price)}
                        </td>
                        <td className="py-4 font-mono font-medium text-sm">
                          <span className={cn(isPositive ? "text-success bg-success/10" : "text-danger bg-danger/10", "px-2 py-1 rounded-md")}>
                            {isPositive ? '+' : ''}{market.priceChange24h.toFixed(2)}%
                          </span>
                        </td>
                        <td className="py-4 font-mono text-muted-foreground text-sm hidden lg:table-cell">
                          ${formatPrice(market.high24h)}
                        </td>
                        <td className="py-4 font-mono text-muted-foreground text-sm hidden lg:table-cell">
                          ${formatPrice(market.low24h)}
                        </td>
                        <td className="py-4 font-mono text-foreground text-sm hidden sm:table-cell">
                          ${formatCompact(market.volume24h)}
                        </td>
                        <td className="py-4 hidden xl:table-cell">
                          <MarketSparkline data={market.sparkline} isPositive={isPositive} className="h-[25px]" />
                        </td>
                        <td className="py-4 pr-4 text-right">
                          <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity mr-2 hidden md:inline-flex" asChild>
                            <Link href={`/markets/${market.id}`}>View</Link>
                          </Button>
                          <Button size="sm" asChild>
                            <Link href={`/trade/${market.id}`}>Trade</Link>
                          </Button>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  )
}
