"use client"
import { useState, useEffect } from "react"
import { MarketSummary } from "./MarketSummary"
import { MarketSelector } from "./MarketSelector"
import { TradingModeBadge } from "./TradingModeBadge"
import { TradingChart } from "./TradingChart"
import { OrderBook } from "./OrderBook"
import { RecentTrades } from "./RecentTrades"
import { OrderEntry } from "./OrderEntry"
import { TradingHistoryTabs } from "./TradingHistoryTabs"
import { apiClient } from "@ethsltd/api-client"
import { Market } from "@/lib/market-data/types"
import { useTradingModeStore } from "@/stores/trading-mode-store"

export function TradingTerminal({ symbol }: { symbol: string }) {
  const [market, setMarket] = useState<any>(null)
  const [candles, setCandles] = useState<any[]>([])
  const [orderbook, setOrderbook] = useState<any>(null)
  const [trades, setTrades] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [headerHeight, setHeaderHeight] = useState(64)
  const { mode } = useTradingModeStore()

  useEffect(() => {
    // Dynamically measure main header height to stick this bar exactly below it
    const updateHeight = () => {
      const header = document.querySelector('header');
      if (header) setHeaderHeight(header.getBoundingClientRect().height);
    };
    updateHeight();
    window.addEventListener('resize', updateHeight);
    
    const header = document.querySelector('header');
    let observer: MutationObserver;
    if (header) {
      observer = new MutationObserver(updateHeight);
      observer.observe(header, { childList: true, subtree: true, attributes: true });
    }

    return () => {
      window.removeEventListener('resize', updateHeight);
      if (observer) observer.disconnect();
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      // Don't show loading screen on background refresh
      if (!market) setLoading(true)
      
      try {
        const mRes = await apiClient.getMarkets()
        const m = mRes.data?.find((m: any) => m.symbol.toLowerCase() === symbol.toLowerCase() || m.id.toLowerCase() === symbol.toLowerCase())
        
        if (m) {
          const [cRes, oRes, tRes] = await Promise.all([
            apiClient.getMarketCandles(symbol, '15m'),
            apiClient.getMarketOrderBook(symbol),
            apiClient.getMarketTrades(symbol)
          ])
          if (mounted) {
            setMarket(m)
            setCandles(cRes.data || [])
            setOrderbook(oRes.data || { asks: [], bids: [] })
            setTrades(tRes.data || [])
          }
        }
      } catch (e) {
        console.error(e)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    
    // Simulate real-time updates every 5s
    const interval = setInterval(load, 5000);
    return () => { mounted = false; clearInterval(interval); }
  }, [symbol, mode]) // Remove market dependency to avoid infinite loop

  if (loading && !market) {
    return <div className="min-h-[80vh] flex items-center justify-center bg-background"><div className="animate-spin h-8 w-8 border-4 border-brand-foreground border-t-transparent rounded-full" /></div>
  }

  if (!market) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-background">
        <h2 className="text-2xl font-bold mb-4">Market Not Found</h2>
        <p className="text-muted-foreground">The market {symbol} does not exist or is currently unavailable.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col flex-1 bg-background pb-8 md:pb-0">
      {/* Header Bar */}
      <div 
        className="flex flex-col md:flex-row md:items-center justify-between px-4 py-2 border-b border-border bg-background z-40 sticky"
        style={{ top: headerHeight }}
      >
        <div className="flex items-center gap-4">
          <MarketSelector currentSymbol={market.symbol} />
          {mode === 'DEMO' && <TradingModeBadge />}
        </div>
        <div className="mt-2 md:mt-0 overflow-x-auto no-scrollbar">
          <MarketSummary market={market} />
        </div>
      </div>

      {/* Main Grid */}
      <div className="flex flex-col xl:flex-row flex-1 p-2 gap-2">
        
        {/* Left Col: Chart & Orders */}
        <div className="flex flex-col flex-1 gap-2 min-w-0">
          <div className="bg-muted/10 border border-border rounded-lg flex-1 min-h-[400px] xl:min-h-[500px] relative z-10 overflow-hidden">
            <TradingChart data={candles} />
          </div>
          <div className="bg-muted/10 border border-border rounded-lg min-h-[280px] hidden xl:block">
            <TradingHistoryTabs />
          </div>
        </div>

        {/* Middle Col: Orderbook & Recent Trades */}
        <div className="flex flex-col w-full xl:w-[300px] shrink-0 gap-2 hidden lg:flex">
          <div className="flex-1 bg-muted/10 border border-border rounded-lg flex flex-col overflow-hidden min-h-[400px]">
            <OrderBook data={orderbook} />
          </div>
          <div className="shrink-0 bg-muted/10 border border-border rounded-lg flex flex-col overflow-hidden h-[280px] hidden xl:flex">
            <RecentTrades data={trades} />
          </div>
        </div>

        {/* Right Col: Order Form */}
        <div className="flex flex-col w-full lg:w-[320px] shrink-0 gap-2">
          
          {/* Mobile/Tablet Orderbook */}
          <div className="lg:hidden flex-1 bg-muted/10 border border-border rounded-lg flex flex-col overflow-hidden h-[300px]">
            <OrderBook data={orderbook} />
          </div>

          <div className="shrink-0 z-10 relative">
            <OrderEntry market={market} />
          </div>
          
          {/* Mobile/Tablet only history and trades */}
          <div className="xl:hidden mt-2 flex flex-col gap-2">
             <div className="bg-muted/10 border border-border rounded-lg overflow-hidden h-[300px]">
               <RecentTrades data={trades} />
             </div>
             <div className="border border-border rounded-lg overflow-hidden">
               <TradingHistoryTabs />
             </div>
          </div>
        </div>

      </div>
    </div>
  )
}
