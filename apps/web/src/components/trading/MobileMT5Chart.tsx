"use client"
import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { init, dispose, Chart, OverlayMode } from "klinecharts"
import { apiClient } from "@ethsltd/api-client"
import { Plus, Settings2, Crosshair, Clock, Layers } from "lucide-react"

export function MobileMT5Chart({ symbol }: { symbol: string }) {
  const router = useRouter()
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<Chart | null>(null)
  
  const [market, setMarket] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [currentPrice, setCurrentPrice] = useState<number | null>(null)
  const [timeframe, setTimeframe] = useState('15m')
  
  // Radial menu state
  const [showRadial, setShowRadial] = useState(false)
  const [radialPos, setRadialPos] = useState({ x: 0, y: 0 })

  const subscribeCallbackRef = useRef<((data: any) => void) | null>(null)
  const fullDataRef = useRef<any[]>([])

  useEffect(() => {
    let mounted = true
    const loadData = async () => {
      try {
        setLoading(true)
        const mRes = await apiClient.getMarkets()
        const m = mRes.data?.find((x: any) => x.symbol.toLowerCase() === symbol)
        if (m && mounted) setMarket(m)

        const cRes = await apiClient.getMarketCandles(symbol, timeframe)
        if (mounted && cRes.data) {
          const sortedData = cRes.data
            .map((d: any) => ({ ...d, time: Math.floor(Number(d.time)) * 1000 }))
            .sort((a: any, b: any) => a.time - b.time)

          const formattedData = sortedData.map((d: any) => ({
            timestamp: d.time,
            open: d.open,
            high: d.high,
            low: d.low,
            close: d.close,
            volume: d.volume,
          }))

          fullDataRef.current = formattedData
          if (formattedData.length > 0) {
             setCurrentPrice(formattedData[formattedData.length - 1].close)
          }

          if (chartRef.current) {
            chartRef.current.applyNewData(formattedData)
            
            // Fetch and draw orders
            apiClient.getOrders().then(oRes => {
              if (oRes.data) {
                const activeOrders = oRes.data.filter((o: any) => o.symbol.toLowerCase() === symbol && ['PENDING', 'OPEN'].includes(o.status));
                activeOrders.forEach((o: any) => {
                  const isBuy = o.side === 'BUY';
                  chartRef.current?.createOverlay({
                    name: 'simpleAnnotation',
                    extendData: `${o.side} ${o.amount}, ${o.status}`,
                    points: [{ timestamp: formattedData[formattedData.length - 1].timestamp, value: o.price }],
                    styles: {
                      symbol: {
                        type: 'circle',
                        size: 4,
                        color: isBuy ? '#3b82f6' : '#ef4444',
                        activeSize: 6,
                        activeColor: isBuy ? '#3b82f6' : '#ef4444'
                      }
                    }
                  });
                });
              }
            }).catch(console.error);
          }
        }
      } catch (e) {
        console.error("Failed to load chart data", e)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    loadData()

    // WebSocket for live prices
    const wsUrl = (process.env.NEXT_PUBLIC_API_URL || '').replace('http', 'ws') + '/ws/stream';
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      ws.send(JSON.stringify({ type: 'subscribe', symbol: symbol.toUpperCase() }));
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'ticker' && mounted) {
          const price = parseFloat(data.price)
          setCurrentPrice(price)
          
          if (chartRef.current && fullDataRef.current.length > 0) {
             const lastCandle = fullDataRef.current[fullDataRef.current.length - 1]
             const updatedCandle = {
               ...lastCandle,
               close: price,
               high: Math.max(lastCandle.high, price),
               low: Math.min(lastCandle.low, price)
             }
             chartRef.current.updateData(updatedCandle)
          }
        }
      } catch(e) {}
    };

    return () => {
      mounted = false
      ws.close()
    }
  }, [symbol, timeframe])

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = init(chartContainerRef.current, {
      styles: {
        grid: {
          horizontal: { color: "rgba(255, 255, 255, 0.05)", style: 'dashed' },
          vertical: { color: "rgba(255, 255, 255, 0.05)", style: 'dashed' }
        },
        candle: {
          bar: {
            upColor: '#00C087',
            downColor: '#ea3943',
            noChangeColor: '#888888',
            upBorderColor: '#00C087',
            downBorderColor: '#ea3943',
            upWickColor: '#00C087',
            downWickColor: '#ea3943'
          }
        },
        yAxis: {
          tickText: { color: "rgba(255, 255, 255, 0.6)", size: 10 },
          axisLine: { show: false },
          tickLine: { show: false }
        },
        xAxis: {
          tickText: { color: "rgba(255, 255, 255, 0.6)", size: 10 },
          axisLine: { show: false },
          tickLine: { show: false }
        },
        crosshair: {
          horizontal: {
            line: { color: '#ffffff', style: 'dashed' },
            text: { backgroundColor: '#ffffff', color: '#000000' }
          },
          vertical: {
            line: { color: '#ffffff', style: 'dashed' },
            text: { backgroundColor: '#ffffff', color: '#000000' }
          }
        }
      }
    });

    if (chart) {
      chartRef.current = chart;
      if (fullDataRef.current.length > 0) {
        chart.applyNewData(fullDataRef.current);
      }
    }

    const resizeObserver = new ResizeObserver(() => {
      chart?.resize();
    });
    resizeObserver.observe(chartContainerRef.current);

    return () => {
      resizeObserver.disconnect();
      if (chartRef.current && chartContainerRef.current) dispose(chartContainerRef.current as HTMLElement);
      chartRef.current = null;
    };
  }, []);

  const handleChartClick = (e: React.MouseEvent) => {
    // If clicking on the chart area, toggle radial menu
    const rect = chartContainerRef.current?.getBoundingClientRect()
    if (rect) {
      setRadialPos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      })
      setShowRadial(prev => !prev)
    }
  }

  const changeTimeframe = (tf: string) => {
    setTimeframe(tf)
    setShowRadial(false)
  }

  return (
    <div className="flex flex-col w-full h-full relative" style={{ height: 'calc(100vh - 64px)' }}>
      {/* Top MT5 Toolbar */}
      <div className="flex items-center justify-between px-3 h-12 bg-black border-b border-white/5 shrink-0">
        <div className="flex items-center gap-4 text-white">
          <button onClick={() => router.push('/quotes')} className="p-1">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          </button>
          <span className="font-bold text-lg tracking-wider">
            {symbol.toUpperCase().replace('-', '')}
          </span>
        </div>
        
        <div className="flex items-center gap-4 text-white">
          <button className="p-1"><Crosshair size={20} /></button>
          <button className="p-1"><Layers size={20} /></button>
          <button onClick={() => router.push(`/order/${symbol}`)} className="p-1 text-[#00C087] flex items-center gap-1">
            <Plus size={20} />
          </button>
        </div>
      </div>

      {/* Chart Info Overlay */}
      <div className="absolute top-14 left-3 z-10 pointer-events-none">
        <div className="flex items-center gap-2">
          <span className="text-[#00C087] font-bold text-sm">{symbol.toUpperCase().replace('-', '')}</span>
          <span className="text-white/60 text-xs">▼</span>
          <span className="text-white font-medium text-sm">{timeframe.toUpperCase()}</span>
        </div>
        {market && <div className="text-white/50 text-xs mt-0.5">{market.baseAsset} vs {market.quoteAsset}</div>}
      </div>

      {/* Chart Container */}
      <div 
        className="flex-1 w-full relative bg-black" 
        onClick={handleChartClick}
      >
        {loading && fullDataRef.current.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
            <div className="animate-spin h-8 w-8 border-2 border-white/20 border-t-[#00C087] rounded-full mb-4"></div>
            <span className="text-white/50 text-xs">Loading chart...</span>
          </div>
        )}
        <div ref={chartContainerRef} className="w-full h-full" />

        {/* Radial Menu */}
        {showRadial && (
          <div 
            className="absolute z-50 rounded-full border border-white/10 bg-[#1c1c1e]/90 backdrop-blur-md shadow-2xl transition-all"
            style={{
              left: radialPos.x,
              top: radialPos.y,
              transform: 'translate(-50%, -50%)',
              width: '240px',
              height: '240px'
            }}
          >
            {/* Center close button */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-white/10 flex items-center justify-center bg-[#2c2c2e]" onClick={(e) => { e.stopPropagation(); setShowRadial(false) }}>
              <span className="text-white font-bold text-xs">CLOSE</span>
            </div>
            
            {/* Circular Items - Hardcoded positions for typical radial menu */}
            <button onClick={(e) => { e.stopPropagation(); changeTimeframe('1m') }} className="absolute top-[10%] left-1/2 -translate-x-1/2 text-white/80 hover:text-white font-medium text-sm">M1</button>
            <button onClick={(e) => { e.stopPropagation(); changeTimeframe('5m') }} className="absolute top-[20%] right-[20%] text-white/80 hover:text-white font-medium text-sm">M5</button>
            <button onClick={(e) => { e.stopPropagation(); changeTimeframe('15m') }} className="absolute top-[45%] right-[5%] -translate-y-1/2 text-white/80 hover:text-white font-medium text-sm">M15</button>
            <button onClick={(e) => { e.stopPropagation(); changeTimeframe('30m') }} className="absolute bottom-[20%] right-[20%] text-white/80 hover:text-white font-medium text-sm">M30</button>
            <button onClick={(e) => { e.stopPropagation(); changeTimeframe('1h') }} className="absolute bottom-[10%] left-1/2 -translate-x-1/2 text-white/80 hover:text-white font-medium text-sm">H1</button>
            <button onClick={(e) => { e.stopPropagation(); changeTimeframe('4h') }} className="absolute bottom-[20%] left-[20%] text-white/80 hover:text-white font-medium text-sm">H4</button>
            <button onClick={(e) => { e.stopPropagation(); changeTimeframe('1d') }} className="absolute top-[45%] left-[5%] -translate-y-1/2 text-white/80 hover:text-white font-medium text-sm">D1</button>
            <button onClick={(e) => { e.stopPropagation(); changeTimeframe('1w') }} className="absolute top-[20%] left-[20%] text-white/80 hover:text-white font-medium text-sm">W1</button>
          </div>
        )}
      </div>

      {/* Floating Action Button for New Order (Alternative to top right) */}
      <button 
        onClick={() => router.push(`/order/${symbol}`)}
        className="absolute bottom-6 right-4 z-40 bg-[#00C087] text-white rounded-full w-14 h-14 flex items-center justify-center shadow-[0_0_15px_rgba(0,192,135,0.4)]"
      >
        <span className="font-bold">Buy</span>
      </button>
    </div>
  )
}
