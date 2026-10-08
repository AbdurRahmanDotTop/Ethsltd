"use client"
import { useState } from "react"
import { useAuthStore } from "@/stores/auth-store"
import { useTradingUIStore } from "@/stores/trading-ui-store"
import { apiClient } from "@ethsltd/api-client"
import { toast } from "sonner"

export function OneClickTrading({ market, currentPrice }: { market: any, currentPrice: number }) {
  const { user } = useAuthStore()
  const [amount, setAmount] = useState<string>("0.1")
  const [isHovered, setIsHovered] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleTrade = async (side: "BUY" | "SELL") => {
    if (!user) return toast.error("Please login to trade")
    if (!amount || parseFloat(amount) <= 0) return toast.error("Invalid amount")
    if (isSubmitting) return

    setIsSubmitting(true)
    const toastId = toast.loading(`${side} ${amount} ${market.baseAsset}...`)
    
    try {
      const data: any = await apiClient.createOrder({
        market: market.symbol,
        type: 'MARKET',
        side,
        amount,
      })

      if (data.success && data.order) {
        toast.dismiss(toastId)
        useTradingUIStore.getState().setSuccessOrder(data.order)
        if (data.position) {
          useTradingUIStore.getState().setSuccessPosition(data.position)
        }
      } else if (data.success) {
        toast.success(`Position Opened: ${side} ${amount} ${market.baseAsset}`, { id: toastId })
      } else {
        toast.error(data.error || 'Failed to open position', { id: toastId })
      }
    } catch (e: any) {
      toast.error('Network error', { id: toastId })
    } finally {
      setIsSubmitting(false)
    }
  }

  // MT5 style one-click trading widget
  return (
    <div 
      className={`hidden md:block absolute top-16 right-4 z-20 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-30 hover:opacity-100'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="bg-background/90 backdrop-blur-md border border-border rounded-lg shadow-lg overflow-hidden w-64 flex flex-col">
        {/* Header */}
        <div className="bg-muted px-2 py-1 flex items-center justify-between text-xs font-medium border-b border-border">
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            One-Click Trading
          </div>
          <span className="text-muted-foreground">{market.symbol}</span>
        </div>
        
        {/* Body */}
        <div className="p-2 flex gap-2">
          <button 
            disabled={isSubmitting}
            onClick={() => handleTrade('SELL')}
            className="flex-1 bg-danger hover:bg-danger/90 text-white rounded flex flex-col items-center justify-center py-2 transition-transform active:scale-95 disabled:opacity-50 shadow-sm"
          >
            <span className="text-[10px] font-bold uppercase">{isSubmitting ? '...' : 'SELL'}</span>
            <span className="text-sm font-mono font-bold mt-0.5">{currentPrice ? currentPrice.toFixed(4) : '---'}</span>
          </button>
          
          <div className="flex flex-col gap-1 w-16 shrink-0 justify-center">
            <div className="text-[9px] text-center text-muted-foreground uppercase tracking-wider">Amount</div>
            <input 
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-muted/50 border border-border rounded text-center text-sm py-1 outline-none focus:border-brand-foreground focus:ring-1 focus:ring-brand-foreground/50 transition-all font-mono"
              step={market.stepSize || "0.01"}
              min={market.minAmount || "0.01"}
            />
          </div>
          
          <button 
            disabled={isSubmitting}
            onClick={() => handleTrade('BUY')}
            className="flex-1 bg-success hover:bg-success/90 text-white rounded flex flex-col items-center justify-center py-2 transition-transform active:scale-95 disabled:opacity-50 shadow-sm"
          >
            <span className="text-[10px] font-bold uppercase">{isSubmitting ? '...' : 'BUY'}</span>
            <span className="text-sm font-mono font-bold mt-0.5">{currentPrice ? currentPrice.toFixed(4) : '---'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
