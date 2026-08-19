import { OrderBook as OrderBookType } from "@/lib/trading/types";
import { formatPrice } from "@/lib/trading/calculations";
import { useTradingUIStore } from "@/stores/trading-ui-store";

export function OrderBook({ data }: { data?: OrderBookType }) {
  const setOrderFormPrice = useTradingUIStore(state => state.setOrderFormPrice);

  if (!data) return <div className="p-4 text-center text-sm text-muted-foreground animate-pulse">Loading Order Book...</div>;

  const handlePriceClick = (price: number) => {
    setOrderFormPrice(price.toString());
  };

  const bestAsk = data.asks[data.asks.length - 1]?.price || 0;
  const bestBid = data.bids[0]?.price || 0;
  const spread = bestAsk - bestBid;

  const maxTotal = Math.max(
    ...data.asks.map(a => a.total),
    ...data.bids.map(b => b.total)
  );

  return (
    <div className="flex flex-col h-full text-sm">
      <div className="flex justify-between px-3 py-2 text-xs text-muted-foreground border-b border-border">
        <span>Price</span>
        <span>Amount</span>
        <span>Total</span>
      </div>
      
      {/* Asks (Red) */}
      <div className="flex flex-col flex-1 overflow-y-auto no-scrollbar justify-end py-1 min-h-[150px]">
        {data.asks.map((ask, i) => {
          const depth = (ask.total / maxTotal) * 100;
          return (
            <div 
              key={i} 
              className="relative flex justify-between px-3 py-[2px] cursor-pointer hover:bg-muted/50 group"
              onClick={() => handlePriceClick(ask.price)}
            >
              <div className="absolute right-0 top-0 bottom-0 bg-danger/10 z-0 transition-all duration-300" style={{ width: `${depth}%` }} />
              <span className="text-danger z-10 font-mono">{formatPrice(ask.price)}</span>
              <span className="z-10 font-mono text-foreground/80">{ask.amount.toFixed(4)}</span>
              <span className="z-10 font-mono text-foreground/80">{ask.total.toFixed(2)}</span>
            </div>
          )
        })}
      </div>
      
      {/* Spread */}
      <div className="py-2 px-3 border-y border-border flex items-center justify-between text-xs bg-muted/10 flex-wrap gap-y-4">
        <span className="text-muted-foreground">Spread</span>
        <span className="font-mono font-medium">{formatPrice(Math.abs(spread))}</span>
      </div>

      {/* Bids (Green) */}
      <div className="flex flex-col flex-1 overflow-y-auto no-scrollbar py-1 min-h-[150px]">
        {data.bids.map((bid, i) => {
          const depth = (bid.total / maxTotal) * 100;
          return (
            <div 
              key={i} 
              className="relative flex justify-between px-3 py-[2px] cursor-pointer hover:bg-muted/50 group"
              onClick={() => handlePriceClick(bid.price)}
            >
              <div className="absolute right-0 top-0 bottom-0 bg-success/10 z-0 transition-all duration-300" style={{ width: `${depth}%` }} />
              <span className="text-success z-10 font-mono">{formatPrice(bid.price)}</span>
              <span className="z-10 font-mono text-foreground/80">{bid.amount.toFixed(4)}</span>
              <span className="z-10 font-mono text-foreground/80">{bid.total.toFixed(2)}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
