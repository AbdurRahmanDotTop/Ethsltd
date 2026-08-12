"use client"
import { useEffect, useRef } from "react"
import { createChart, ColorType, CandlestickSeries } from "lightweight-charts"
import { Candle } from "@/lib/trading/types"
import { useTheme } from "next-themes"

export function TradingChart({ data }: { data: Candle[] }) {
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const { theme } = useTheme()

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // We can assume next-themes adds 'dark' class to html, or we can use the theme hook
    const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches) || document.documentElement.classList.contains('dark')

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)',
      },
      grid: {
        vertLines: { color: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)' },
        horzLines: { color: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)' },
      },
      rightPriceScale: {
        borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
      },
      timeScale: {
        borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        timeVisible: true,
      },
      crosshair: {
        mode: 0,
      }
    });

    // Use specific hex colors to ensure they work universally with the canvas engine
    const upColor = '#16c784';
    const downColor = '#ea3943';

    const series = chart.addSeries(CandlestickSeries, {
      upColor: upColor,
      downColor: downColor,
      borderVisible: false,
      wickUpColor: upColor,
      wickDownColor: downColor,
    });

    // Sort data ascending by time for lightweight-charts
    const sortedData = [...data].sort((a, b) => (a.time as number) - (b.time as number));

    series.setData(sortedData.map(d => ({
      time: Math.floor(d.time as number) as any, // ensure integer seconds
      open: d.open,
      high: d.high,
      low: d.low,
      close: d.close,
    })));

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth, height: chartContainerRef.current.clientHeight });
      }
    };

    window.addEventListener('resize', handleResize);
    
    // Fit content initially
    chart.timeScale().fitContent();

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [data, theme]);

  if (!data || data.length === 0) {
    return <div className="w-full h-full min-h-[300px] bg-muted/20 animate-pulse flex items-center justify-center text-muted-foreground text-sm">Loading Chart...</div>
  }

  return (
    <div ref={chartContainerRef} className="w-full h-full min-h-[400px]" />
  )
}
