"use client";

import { useTradingUIStore } from "@/stores/trading-ui-store";
import { CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

export function OrderSuccessModal() {
  const router = useRouter();
  const { successOrder, setSuccessOrder } = useTradingUIStore();

  if (!successOrder) return null;

  const handleDone = () => {
    setSuccessOrder(null);
    router.push('/wallet/history');
  };

  const isBuy = successOrder.side === 'BUY';
  const price = successOrder.price ? parseFloat(successOrder.price).toFixed(5) : 'Market Price';

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background text-foreground">
      {/* Top Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-border/50">
        <h2 className="text-lg font-medium">New Order</h2>
        <button onClick={handleDone} className="text-muted-foreground hover:text-foreground">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center mt-[-10vh]">
        
        {/* Success Icon */}
        <div className="w-32 h-32 rounded-full bg-[#22c55e] flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(34,197,94,0.3)] animate-in zoom-in duration-300">
          <CheckCircle2 className="w-16 h-16 text-black" strokeWidth={2.5} />
        </div>

        {/* Done Text */}
        <h1 className="text-3xl font-bold mb-6">Done</h1>

        {/* Order Details */}
        <div className="space-y-1.5 text-lg flex flex-col items-center">
          <div className="flex gap-2 justify-center items-baseline">
            <span className={`font-bold ${isBuy ? 'text-[#3b82f6]' : 'text-[#ef4444]'}`}>
              {successOrder.side}
            </span>
            <span className="text-muted-foreground text-base">
              {successOrder.filledAmount !== '0' ? successOrder.filledAmount : successOrder.amount} / {successOrder.amount}
            </span>
          </div>

          <div className="text-muted-foreground flex gap-1 justify-center items-center">
            <span className="font-medium text-foreground">{successOrder.marketSymbol}</span>
            <span>at</span>
            <span className="font-mono text-foreground">{price}</span>
          </div>

          <div className="text-muted-foreground font-mono text-base pt-2">
            #{successOrder.displayId || successOrder.id}
          </div>

          {(successOrder.stopLoss || successOrder.takeProfit) && (
            <div className="flex gap-4 pt-2">
              {successOrder.stopLoss && (
                <div className="text-[#ef4444] font-mono text-base">
                  sl: {parseFloat(successOrder.stopLoss).toFixed(5)}
                </div>
              )}
              {successOrder.takeProfit && (
                <div className="text-[#22c55e] font-mono text-base">
                  tp: {parseFloat(successOrder.takeProfit).toFixed(5)}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Button */}
      <div className="p-4 w-full max-w-md mx-auto mb-4">
        <button 
          onClick={handleDone}
          className="w-full bg-[#2a2a2a] hover:bg-[#333] active:bg-[#444] text-white py-4 rounded-md font-bold tracking-wide uppercase transition-colors"
        >
          DONE
        </button>
      </div>
    </div>
  );
}
