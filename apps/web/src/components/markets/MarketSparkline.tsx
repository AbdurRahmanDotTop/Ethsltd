import { cn } from "@/lib/utils"

export function MarketSparkline({ data, isPositive, className }: { data: number[], isPositive: boolean, className?: string }) {
  if (!data || data.length === 0) return null;
  
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  
  // Map data to 0-100 coordinates
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - ((d - min) / range) * 100;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className={cn("w-[80px] h-[30px]", className)}>
      <svg viewBox="0 -5 100 110" preserveAspectRatio="none" className="w-full h-full">
        <polyline 
          points={points} 
          fill="none" 
          stroke="currentColor"
          className={isPositive ? "text-success" : "text-danger"}
          strokeWidth="3" 
          strokeLinejoin="round" 
          strokeLinecap="round" 
        />
      </svg>
    </div>
  )
}
