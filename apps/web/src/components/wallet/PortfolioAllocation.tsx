import { AssetAllocation } from "@/lib/wallet/types";
import { useWalletStore } from "@/stores/wallet-store";

export function PortfolioAllocation({ allocations }: { allocations: AssetAllocation[] }) {
  if (allocations.length === 0) {
    return (
      <div className="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col items-center justify-center h-full min-h-[300px]">
        <div className="text-muted-foreground">No assets in portfolio</div>
      </div>
    );
  }

  // Generate an SVG Donut Chart
  const size = 200;
  const strokeWidth = 24;
  const center = size / 2;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;

  // Colors mapping
  const colors = [
    "hsl(var(--brand-500))",
    "#F7931A", // BTC orange
    "#627EEA", // ETH blue
    "#26A17B", // USDT green
    "#2775CA", // USDC blue
    "#14F195", // SOL green
    "#8b5cf6"  // fallback purple
  ];

  const getColor = (symbol: string, index: number) => {
    switch (symbol) {
      case "BTC": return colors[1];
      case "ETH": return colors[2];
      case "USDT": return colors[3];
      case "USDC": return colors[4];
      case "SOL": return colors[5];
      default: return colors[0];
    }
  };

  let currentAngle = -90; // Start at top

  const { fiatCurrency, fiatExchangeRate } = useWalletStore();
  const exchangeRate = fiatExchangeRate || 1;
  const formatValue = (usd: number) => {
    if (fiatCurrency === 'INR') {
      return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(usd * exchangeRate);
    }
    return usd.toLocaleString('en-US', { maximumFractionDigits: 0 }) + ' USDT';
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm h-full">
      <h3 className="text-lg font-bold text-foreground mb-6">Asset Allocation</h3>
      
      <div className="flex flex-col items-center gap-6">
        <div className="relative w-[200px] h-[200px] shrink-0">
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            {allocations.map((alloc, i) => {
              const dasharray = `${(alloc.percentage / 100) * circumference} ${circumference}`;
              const rotation = currentAngle;
              
              // Move angle forward for next slice
              currentAngle += (alloc.percentage / 100) * 360;

              return (
                <circle
                  key={alloc.asset}
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="none"
                  stroke={getColor(alloc.asset, i)}
                  strokeWidth={strokeWidth}
                  strokeDasharray={dasharray}
                  strokeLinecap="butt"
                  transform={`rotate(${rotation} ${center} ${center})`}
                  className="transition-all duration-500 ease-in-out origin-center"
                />
              );
            })}
          </svg>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-3xl font-bold font-display text-foreground">{allocations.length}</span>
            <span className="text-xs text-muted-foreground uppercase font-medium tracking-wider">Assets</span>
          </div>
        </div>

        <div className="flex-1 w-full space-y-3">
          {allocations.slice(0, 5).map((alloc, i) => (
            <div key={alloc.asset} className="flex items-center justify-between flex-wrap gap-y-4">
              <div className="flex items-center gap-3">
                <div 
                  className="w-3 h-3 rounded-sm" 
                  style={{ backgroundColor: getColor(alloc.asset, i) }}
                />
                <span className="font-semibold text-foreground">{alloc.asset}</span>
              </div>
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-foreground">
                    {alloc.usdValue.toLocaleString(undefined, { maximumFractionDigits: 0 })} USDT
                  </span>
                  <span className="text-sm text-muted-foreground w-12 text-right">
                    {alloc.percentage.toFixed(1)}%
                  </span>
                </div>
                <span className="text-xs text-muted-foreground mt-0.5">
                  ≈ {formatValue(alloc.usdValue)}
                </span>
              </div>
            </div>
          ))}
          {allocations.length > 5 && (
            <div className="text-sm text-muted-foreground text-center pt-2">
              + {allocations.length - 5} other assets
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
