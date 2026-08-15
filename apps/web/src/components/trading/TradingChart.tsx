"use client"
import { useEffect, useRef } from "react"
import { createChart, ColorType, CandlestickSeries } from "lightweight-charts"
import { Candle } from "@/lib/trading/types"
import { useTheme } from "next-themes"

export function TradingChart({ data }: { data: Candle[] }) {
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const { theme } = useTheme()
  const chartRef = useRef<any>(null)
  const seriesRef = useRef<any>(null)

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches) || document.documentElement.classList.contains('dark')

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)',
        attributionLogo: false,
      },
      grid: {
        vertLines: { color: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)' },
        horzLines: { color: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)' },
      },
      rightPriceScale: {
        borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        autoScale: true,
        scaleMargins: {
          top: 0.1,
          bottom: 0.1,
        },
      },
      timeScale: {
        borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        timeVisible: true,
        fixLeftEdge: true,
        fixRightEdge: true,
      },
      crosshair: {
        mode: 0,
      }
    });

    const upColor = '#16c784';
    const downColor = '#ea3943';

    const series = chart.addSeries(CandlestickSeries, {
      upColor: upColor,
      downColor: downColor,
      borderVisible: false,
      wickUpColor: upColor,
      wickDownColor: downColor,
    });

    chartRef.current = chart;
    seriesRef.current = series;

    const resizeObserver = new ResizeObserver((entries) => {
      if (entries.length === 0 || entries[0].target !== chartContainerRef.current) return;
      const newRect = entries[0].contentRect;
      chart.applyOptions({ height: newRect.height, width: newRect.width });
    });

    resizeObserver.observe(chartContainerRef.current);

    return () => {
      resizeObserver.disconnect();
      chart.remove();
      chartRef.current = null;
      seriesRef.current = null;
    };
  }, [theme]); // Only recreate on theme change

  useEffect(() => {
    if (!seriesRef.current || !data || data.length === 0) return;

    const sortedData = [...data].sort((a, b) => (a.time as number) - (b.time as number));
    const formattedData = sortedData.map(d => ({
      time: Math.floor(d.time as number) as any,
      open: d.open,
      high: d.high,
      low: d.low,
      close: d.close,
    }));

    seriesRef.current.setData(formattedData);
    
    if (chartRef.current) {
      chartRef.current.timeScale().fitContent();
    }
  }, [data]);

  if (!data || data.length === 0) {
    return <div className="w-full h-full min-h-[300px] bg-muted/20 animate-pulse flex items-center justify-center text-muted-foreground text-sm">Loading Chart...</div>
  }

  const currentPrice = data[data.length - 1]?.close;
  const prevPrice = data.length > 1 ? data[data.length - 2]?.close : currentPrice;
  const isUp = currentPrice >= prevPrice;

  return (
    <div className="relative w-full h-full min-h-[400px]">
      <div ref={chartContainerRef} className="absolute inset-0" />
      <div className="absolute bottom-6 left-4 z-10 pointer-events-none bg-background/60 backdrop-blur-sm px-3 py-1.5 rounded-md border border-border">
        <span className="text-xs text-muted-foreground mr-2">Live Price:</span>
        <span className={`font-mono font-bold ${isUp ? 'text-success' : 'text-danger'}`}>
          {currentPrice?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
        </span>
      </div>
    </div>
  )
}
