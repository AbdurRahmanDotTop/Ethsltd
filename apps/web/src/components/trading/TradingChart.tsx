"use client"
import { useEffect, useRef, useCallback, useState } from "react"
import { init, dispose, Chart, OverlayMode } from "klinecharts"
import { Candle } from "@/lib/trading/types"
import { useTheme } from "next-themes"

export function TradingChart({ data }: { data: Candle[] }) {
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const { theme } = useTheme()
  const chartRef = useRef<Chart | null>(null)
  const [activeIndicator, setActiveIndicator] = useState<string>('VOL')

  const subscribeCallbackRef = useRef<((data: any) => void) | null>(null)
  const fullDataRef = useRef<any[]>([])
  const isInitRef = useRef<boolean>(false)

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const isDark =
      theme === "dark" ||
      (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches) ||
      document.documentElement.classList.contains("dark");

    const chart = init(chartContainerRef.current, {
      styles: {
        grid: {
          horizontal: { color: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)" },
          vertical: { color: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)" }
        },
        candle: {
          bar: {
            upColor: '#16c784',
            downColor: '#ea3943',
            noChangeColor: '#888888',
            upBorderColor: '#16c784',
            downBorderColor: '#ea3943',
            upWickColor: '#16c784',
            downWickColor: '#ea3943'
          }
        },
        yAxis: {
          tickText: { color: isDark ? "rgba(255, 255, 255, 0.6)" : "rgba(0, 0, 0, 0.6)" },
          axisLine: { color: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)" }
        },
        xAxis: {
          tickText: { color: isDark ? "rgba(255, 255, 255, 0.6)" : "rgba(0, 0, 0, 0.6)" },
          axisLine: { color: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)" }
        }
      }
    });

    if (chart) {
      chartRef.current = chart;
      (chart as any).createIndicator('VOL', true, { id: 'candle_pane' });
      
      chart.setDataLoader({
        getBars: (params) => {
          if (params.type === 'init') {
             params.callback(fullDataRef.current, { backward: false, forward: false });
          } else {
             params.callback([], { backward: false, forward: false });
          }
        },
        subscribeBar: (params) => {
          subscribeCallbackRef.current = params.callback;
        },
        unsubscribeBar: () => {
          subscribeCallbackRef.current = null;
        }
      });
    }

    const resizeObserver = new ResizeObserver((entries) => {
      if (entries.length === 0 || entries[0].target !== chartContainerRef.current) return;
      chart?.resize();
    });

    resizeObserver.observe(chartContainerRef.current);

    return () => {
      resizeObserver.disconnect();
      if (chartRef.current && chartContainerRef.current) dispose(chartContainerRef.current as HTMLElement);
      chartRef.current = null;
      isInitRef.current = false;
    };
  }, [theme]);

  useEffect(() => {
    if (!chartRef.current || !data || data.length === 0) return;

    const seen = new Set<number>();
    const sortedData = [...data]
      .map(d => ({ ...d, time: Math.floor(Number(d.time)) * 1000 }))
      .sort((a, b) => a.time - b.time)
      .filter(d => {
        if (seen.has(d.time)) return false;
        seen.add(d.time);
        return true;
      });

    const formattedData = sortedData.map(d => ({
      timestamp: d.time,
      open: d.open,
      high: d.high,
      low: d.low,
      close: d.close,
      volume: d.volume,
    }));

    // If it's a big change (e.g. first load or timeframe change), re-init
    if (!isInitRef.current || Math.abs(fullDataRef.current.length - formattedData.length) > 5) {
        fullDataRef.current = formattedData;
        isInitRef.current = true;
        // Trigger init by setting symbol and period
        chartRef.current.setSymbol({ ticker: 'SYMBOL', pricePrecision: 2, volumePrecision: 4 });
        chartRef.current.setPeriod({ type: 'minute', span: 1 });
    } else {
        // Just an update
        fullDataRef.current = formattedData;
        if (subscribeCallbackRef.current) {
            subscribeCallbackRef.current(formattedData[formattedData.length - 1]);
        }
    }
  }, [data]);

  // Toolbar Handlers
  const addIndicator = (name: string) => {
    if (!chartRef.current) return;
    if (activeIndicator && activeIndicator !== 'VOL') {
      (chartRef.current as any).removeIndicator('pane_1', activeIndicator);
    }
    (chartRef.current as any).createIndicator(name, false, { id: 'pane_1' });
    setActiveIndicator(name);
  };

  const drawOverlay = (name: string) => {
    if (!chartRef.current) return;
    chartRef.current.createOverlay({ 
      name, 
      extendData: 'Draw',
      mode: 'normal' as OverlayMode
    });
  };

  if (!data || data.length === 0) {
    return (
      <div className="w-full h-full min-h-[300px] bg-muted/20 flex flex-col items-center justify-center text-muted-foreground text-sm gap-2">
        <svg className="w-10 h-10 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
        </svg>
        <span>Chart data unavailable</span>
      </div>
    );
  }

  const currentPrice = data[data.length - 1]?.close;
  const prevPrice = data.length > 1 ? data[data.length - 2]?.close : currentPrice;
  const isUp = (currentPrice ?? 0) >= (prevPrice ?? 0);

  return (
    <div className="relative w-full h-full min-h-[400px] flex flex-col">
      {/* MT5-Style Toolbar */}
      <div className="h-10 border-b border-border bg-muted/30 flex items-center px-2 gap-2 overflow-x-auto no-scrollbar shrink-0">
        <div className="flex items-center gap-1 border-r border-border pr-2">
          <button onClick={() => drawOverlay('trendLine')} className="p-1.5 hover:bg-muted rounded text-xs" title="Trend Line">📈</button>
          <button onClick={() => drawOverlay('horizontalLine')} className="p-1.5 hover:bg-muted rounded text-xs" title="Horizontal Line">➖</button>
          <button onClick={() => drawOverlay('fibonacciLine')} className="p-1.5 hover:bg-muted rounded text-xs" title="Fibonacci">📏</button>
          <button onClick={() => { if(chartRef.current) chartRef.current.removeOverlay() }} className="p-1.5 hover:bg-muted rounded text-xs text-danger" title="Clear Drawings">🗑️</button>
        </div>
        
        <div className="flex items-center gap-1">
          <span className="text-xs text-muted-foreground mx-1">Indicators:</span>
          <button onClick={() => addIndicator('MACD')} className={`px-2 py-1 hover:bg-muted rounded text-xs ${activeIndicator === 'MACD' ? 'bg-muted' : ''}`}>MACD</button>
          <button onClick={() => addIndicator('RSI')} className={`px-2 py-1 hover:bg-muted rounded text-xs ${activeIndicator === 'RSI' ? 'bg-muted' : ''}`}>RSI</button>
          <button onClick={() => addIndicator('BOLL')} className={`px-2 py-1 hover:bg-muted rounded text-xs ${activeIndicator === 'BOLL' ? 'bg-muted' : ''}`}>BOLL</button>
          <button onClick={() => addIndicator('KDJ')} className={`px-2 py-1 hover:bg-muted rounded text-xs ${activeIndicator === 'KDJ' ? 'bg-muted' : ''}`}>KDJ</button>
        </div>
      </div>

      <div ref={chartContainerRef} className="flex-1 w-full" />
      
      <div className="absolute bottom-6 left-4 z-10 pointer-events-none bg-background/60 backdrop-blur-sm px-3 py-1.5 rounded-md border border-border">
        <span className="text-xs text-muted-foreground mr-2">Live Price:</span>
        <span className={`font-mono font-bold ${isUp ? "text-success" : "text-danger"}`}>
          {currentPrice?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
        </span>
      </div>
    </div>
  );
}
