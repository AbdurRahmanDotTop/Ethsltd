"use client"
import { useState, useEffect } from "react"
import { MarketSummary } from "./MarketSummary"
import { MarketSelector } from "./MarketSelector"
import { TradingChart } from "./TradingChart"
import { MarketWatch } from "./MarketWatch"
import { OrderBook } from "./OrderBook"
import { RecentTrades } from "./RecentTrades"
import { OrderEntry } from "./OrderEntry"
import { TradingHistoryTabs } from "./TradingHistoryTabs"
import { OneClickTrading } from "./OneClickTrading"
import { OrderSuccessModal } from "./OrderSuccessModal"
import { apiClient } from "@ethsltd/api-client"
import { Market } from "@/lib/market-data/types"
import { useTradingUIStore, MarketType } from "@/stores/trading-ui-store"

export function TradingTerminal({ symbol }: { symbol: string }) {
  const [market, setMarket] = useState<any>(null)
  const [candles, setCandles] = useState<any[]>([])
  const [orderbook, setOrderbook] = useState<any>(null)
  const [trades, setTrades] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [headerHeight, setHeaderHeight] = useState(64)
  const { marketType, setMarketType } = useTradingUIStore()

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
    
    // Connect to WebSockets for real-time data
    const wsUrl = (process.env.NEXT_PUBLIC_API_URL || '').replace('http', 'ws') + '/ws/stream';
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log('Connected to Market Stream');
      ws.send(JSON.stringify({ type: 'subscribe', symbol: symbol.toUpperCase() }));
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'ticker') {
          // Update market price real-time
          setMarket((prev: any) => prev ? { ...prev, price: parseFloat(data.price) } : prev);
          // Also append to candles to see chart moving
          setCandles((prev: any[]) => {
             const last = prev[prev.length - 1];
             if (!last) return prev;
             return [...prev.slice(0, -1), { 
                ...last, 
                close: parseFloat(data.price), 
                high: Math.max(last.high, parseFloat(data.price)),
                low: Math.min(last.low, parseFloat(data.price))
             }];
          });
        } else if (data.type === 'orderbook') {
          // Update orderbook live
          setOrderbook(data.data);
        }
      } catch(e) {}
    };

    return () => { 
      mounted = false; 
      ws.close(); 
    }
  }, [symbol])

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
        </div>
        <div className="mt-2 md:mt-0 overflow-x-auto no-scrollbar">
          <MarketSummary market={market} />
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-2 p-2 flex-1">
        
        {/* Center: Chart */}
        <div className="order-1 xl:order-2 xl:col-span-6 2xl:col-span-7 flex flex-col gap-2 min-w-0">
          <div className="bg-muted/10 border border-border rounded-lg min-h-[400px] xl:min-h-[500px] relative z-10 overflow-hidden flex-1">
            <TradingChart data={candles} />
            {market && <OneClickTrading market={market} currentPrice={market.price} />}
          </div>
        </div>

        {/* Right: Order Entry & Book */}
        <div className="order-2 xl:order-3 xl:col-span-3 2xl:col-span-3 flex flex-col gap-2">
          <div className="shrink-0 z-10 relative">
            <OrderEntry market={market} />
          </div>
          <div className="flex-1 bg-muted/10 border border-border rounded-lg flex flex-col overflow-hidden min-h-[300px]">
            <OrderBook data={orderbook} />
          </div>
        </div>

        {/* Left: Market Watch & Recent Trades */}
        <div className="order-3 xl:order-1 xl:col-span-3 2xl:col-span-2 flex flex-col gap-2">
          <div className="flex-1 min-h-[400px]">
            <MarketWatch currentSymbol={market.symbol} />
          </div>
          <div className="h-[300px] bg-muted/10 border border-border rounded-lg flex flex-col overflow-hidden">
            <RecentTrades data={trades} />
          </div>
        </div>

        {/* Bottom: History Tabs */}
        <div className="order-4 xl:order-4 xl:col-span-12 flex flex-col gap-2">
          <div className="bg-muted/10 border border-border rounded-lg min-h-[280px]">
            <TradingHistoryTabs />
          </div>
        </div>

      </div>
      
      <OrderSuccessModal />
    </div>
  )
}
