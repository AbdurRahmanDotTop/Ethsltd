import { formatPrice } from "@/lib/trading/calculations";

export function RecentTrades({ trades }: { trades: any[] }) {
  if (!trades) return <div className="p-4 text-center text-sm text-muted-foreground animate-pulse">Loading Trades...</div>;
  
  return (
    <div className="flex flex-col h-full text-sm">
      <div className="flex justify-between px-3 py-2 text-xs text-muted-foreground border-b border-border">
        <span>Price</span>
        <span>Amount</span>
        <span>Time</span>
      </div>
      <div className="flex flex-col overflow-y-auto py-1 no-scrollbar h-[350px]">
        {trades.map((trade, i) => {
          // Fallback to trade.time if timestamp doesn't exist (mock provider mismatch)
          let time = trade.time;
          if (trade.timestamp) {
            const d = new Date(trade.timestamp);
            time = d.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
          }
          
          const isUp = trade.isBuyerMaker !== undefined ? trade.isBuyerMaker : (trade.side === 'buy');
          
          return (
            <div key={i} className="flex justify-between px-3 py-[2px] hover:bg-muted/50">
              <span className={isUp ? "text-success font-mono" : "text-danger font-mono"}>
                {formatPrice(trade.price)}
              </span>
              <span className="font-mono text-foreground/80">{(trade.amount || trade.quantity).toFixed(4)}</span>
              <span className="font-mono text-muted-foreground">{time}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
