"use client"
import { useState } from "react"
import { useAuthStore } from "@/stores/auth-store"
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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/trading/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          marketSymbol: market.symbol,
          type: 'MARKET',
          side,
          amount,
        })
      })

      const data = await res.json()
      if (data.success) {
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
      className={`absolute top-12 left-4 z-20 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-30 hover:opacity-100'}`}
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
        <div className="p-2 flex gap-1">
          <button 
            disabled={isSubmitting}
            onClick={() => handleTrade('SELL')}
            className="flex-1 bg-danger/10 hover:bg-danger/20 border border-danger/30 text-danger rounded flex flex-col items-center justify-center py-2 transition-colors disabled:opacity-50"
          >
            <span className="text-[10px] font-bold uppercase">Sell</span>
            <span className="text-sm font-mono font-bold mt-0.5">{currentPrice ? currentPrice.toFixed(4) : '---'}</span>
          </button>
          
          <div className="flex flex-col gap-1 w-16 shrink-0">
            <div className="text-[10px] text-center text-muted-foreground">Amount</div>
            <input 
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-muted border border-border rounded text-center text-sm py-1 outline-none focus:border-brand-foreground"
              step={market.stepSize || "0.01"}
              min={market.minAmount || "0.01"}
            />
          </div>
          
          <button 
            disabled={isSubmitting}
            onClick={() => handleTrade('BUY')}
            className="flex-1 bg-success/10 hover:bg-success/20 border border-success/30 text-success rounded flex flex-col items-center justify-center py-2 transition-colors disabled:opacity-50"
          >
            <span className="text-[10px] font-bold uppercase">Buy</span>
            <span className="text-sm font-mono font-bold mt-0.5">{currentPrice ? currentPrice.toFixed(4) : '---'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
