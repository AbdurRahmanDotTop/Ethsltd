"use client"
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Market } from "@/lib/market-data/types"
import { apiClient } from "@ethsltd/api-client"
import { useTradingUIStore } from "@/stores/trading-ui-store"
import { useWalletStore } from "@/stores/wallet-store"
import { parseMarketSymbol } from "@/lib/trading/calculations"
import { OrderSide, OrderType } from "@/lib/trading/types"
import { cn } from "@/lib/utils"


import { useRequireAuth } from "@/hooks/use-require-auth"

// Schema dynamically updated based on order type
const getOrderSchema = (type: OrderType) => z.object({
  price: type === 'limit' 
    ? z.string().refine(val => !isNaN(parseFloat(val)) && parseFloat(val) > 0, "Valid price required") 
    : z.string().optional(),
  quantity: z.string().refine(val => !isNaN(parseFloat(val)) && parseFloat(val) > 0, "Valid quantity required"),
  stopLoss: z.string().optional(),
  takeProfit: z.string().optional(),
});

export function OrderEntry({ market }: { market: Market }) {
  const { selectedSide, setSide, selectedOrderType, setOrderType, orderFormPrice, orderFormQuantity, setOrderFormPrice, setOrderFormQuantity, marketType } = useTradingUIStore()
  const { balances, fetchBalances } = useWalletStore()

  const requireAuth = useRequireAuth()
  const { base, quote } = parseMarketSymbol(market.symbol)
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{type: 'success'|'error', text: string} | null>(null)

  useEffect(() => {
    fetchBalances();
  }, [fetchBalances]);

  const { register, handleSubmit, formState: { errors }, setValue, watch, trigger } = useForm({
    resolver: zodResolver(getOrderSchema(selectedOrderType)),
    defaultValues: { price: orderFormPrice, quantity: orderFormQuantity, stopLoss: "", takeProfit: "" }
  })

  // Sync external state changes (like clicking orderbook) to local form
  useEffect(() => {
    if (orderFormPrice) setValue("price", orderFormPrice)
  }, [orderFormPrice, setValue])

  useEffect(() => {
    if (orderFormQuantity) setValue("quantity", orderFormQuantity)
  }, [orderFormQuantity, setValue])

  const formPrice = watch("price")
  const formQuantity = watch("quantity")

  // Sync internal form changes out to external state
  useEffect(() => {
    if (formPrice !== orderFormPrice) setOrderFormPrice(formPrice || "")
  }, [formPrice, setOrderFormPrice, orderFormPrice])

  useEffect(() => {
    if (formQuantity !== orderFormQuantity) setOrderFormQuantity(formQuantity || "")
  }, [formQuantity, setOrderFormQuantity, orderFormQuantity])

  const parsedPrice = parseFloat(formPrice || "0")
  const parsedQty = parseFloat(formQuantity || "0")
  const currentPrice = selectedOrderType === 'limit' ? parsedPrice : market.price
  
  // Calculate Notional Value
  const notionalValue = currentPrice * parsedQty
  // In SPOT, fee is deducted from the received asset (Base for BUY, Quote for SELL)
  // So required quote for BUY is just notionalValue
  const requiredMargin = notionalValue
  const fee = notionalValue * 0.001 // just for display
  const total = requiredMargin
  
  const quoteBalance = balances.find(b => b.symbol === quote)?.available || 0
  const baseBalance = balances.find(b => b.symbol === base)?.available || 0

  const handlePercentageClick = (pct: number) => {
    // If the price is zero (still loading), we can't calculate amount
    if (!currentPrice || currentPrice <= 0) return;

    if (selectedSide === 'buy') {
      let targetQuote = quoteBalance * pct;
      const qty = targetQuote / currentPrice;
      if (qty > 0) {
        const qtyStr = qty.toFixed(6);
        setValue("quantity", qtyStr, { shouldValidate: true, shouldDirty: true });
        setOrderFormQuantity(qtyStr);
      }
    } else {
      const targetBase = baseBalance * pct;
      if (targetBase > 0) {
        const qtyStr = targetBase.toFixed(6);
        setValue("quantity", qtyStr, { shouldValidate: true, shouldDirty: true });
        setOrderFormQuantity(qtyStr);
      }
    }
  }

  const onSubmit = (data: any) => {
    requireAuth(async () => {
      setIsSubmitting(true)
      setMessage(null)
      
      const reqAmount = parseFloat(data.quantity);
      const reqPrice = selectedOrderType === 'limit' ? parseFloat(data.price) : currentPrice;
      const reqTotal = reqAmount * reqPrice;

      if (selectedSide === 'buy' && reqTotal > quoteBalance) {
        setMessage({ type: 'error', text: `Insufficient ${quote} balance.` });
        setIsSubmitting(false);
        return;
      } else if (selectedSide === 'sell' && reqAmount > baseBalance) {
        setMessage({ type: 'error', text: `Insufficient ${base} balance.` });
        setIsSubmitting(false);
        return;
      }
      
      try {
        let res = await apiClient.createOrder({
          market: market.id,
          side: selectedSide === 'buy' ? 'BUY' : 'SELL',
          type: selectedOrderType === 'market' ? 'MARKET' : 'LIMIT',
          stopLoss: data.stopLoss ? parseFloat(data.stopLoss) : undefined,
          takeProfit: data.takeProfit ? parseFloat(data.takeProfit) : undefined,
          price: selectedOrderType === 'limit' ? parseFloat(data.price) : undefined,
          amount: parseFloat(data.quantity)
        });
        
        if (!res || !res.success) {
          throw new Error(res?.error || 'Failed to place order')
        }
        
        setMessage({ type: 'success', text: 'Order placed successfully' })
        setValue("quantity", "") // Reset quantity on success
        fetchBalances() // Refresh balances
        setTimeout(() => setMessage(null), 3000)
      } catch (err: any) {
        setMessage({ type: 'error', text: err.message || 'Failed to place order' })
      } finally {
        setIsSubmitting(false)
      }
    }, "Please log in to trade.");
  }

  return (
    <div className="flex flex-col h-full bg-background rounded-lg border border-border p-4">
      {/* Order Type Header */}
      <div className="text-center font-semibold text-sm mb-4 text-foreground mt-2">
        {selectedOrderType === 'market' ? 'Market Execution' : 'Limit Order'}
      </div>

      {/* Volume Selector */}
      <div className="flex flex-wrap justify-center items-center gap-2 mb-6 text-brand-foreground font-mono font-medium">
        <button type="button" onClick={() => setValue("quantity", Math.max(0, parsedQty - 0.5).toFixed(2))} className="text-xs hover:text-foreground p-1">-0.5</button>
        <button type="button" onClick={() => setValue("quantity", Math.max(0, parsedQty - 0.1).toFixed(2))} className="text-xs hover:text-foreground p-1">-0.1</button>
        <button type="button" onClick={() => setValue("quantity", Math.max(0, parsedQty - 0.01).toFixed(2))} className="text-xs hover:text-foreground p-1">-0.01</button>
        <input 
          {...register("quantity")}
          className="w-16 md:w-20 text-center bg-transparent text-lg md:text-xl font-bold border-b border-foreground focus:outline-none focus:border-brand-foreground mx-1"
          inputMode="decimal"
        />
        <button type="button" onClick={() => setValue("quantity", (parsedQty + 0.01).toFixed(2))} className="text-xs hover:text-foreground p-1">+0.01</button>
        <button type="button" onClick={() => setValue("quantity", (parsedQty + 0.1).toFixed(2))} className="text-xs hover:text-foreground p-1">+0.1</button>
        <button type="button" onClick={() => setValue("quantity", (parsedQty + 0.5).toFixed(2))} className="text-xs hover:text-foreground p-1">+0.5</button>
      </div>

      {/* Big Bid/Ask Display */}
      <div className="flex justify-center items-center gap-4 mb-6">
        <div className="text-xl md:text-2xl font-bold text-danger cursor-pointer break-all text-center flex-1" onClick={() => setSide('sell')}>
          {market.price ? (market.price * 0.9998).toFixed(5) : "---"}
        </div>
        <div className="text-xl md:text-2xl font-bold text-success cursor-pointer break-all text-center flex-1" onClick={() => setSide('buy')}>
          {market.price ? market.price.toFixed(5) : "---"}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        
        {selectedOrderType === 'limit' && (
          <div className="relative mb-4">
            <label className="text-xs text-muted-foreground mb-1 block">Price</label>
            <input 
              {...register("price")}
              type="text" 
              inputMode="decimal"
              placeholder="0.00"
              className="w-full bg-muted/30 border-b border-border h-10 px-3 font-mono text-center text-sm focus:outline-none focus:border-brand-foreground"
            />
            {errors.price && <span className="text-xs text-danger mt-1 absolute -bottom-5 left-0">{errors.price.message?.toString()}</span>}
          </div>
        )}

        
        {/* MT5 Style SL/TP Fields */}
        <div className="flex gap-4 mb-4">
          <div className="flex-1 relative flex items-center border-b border-danger/50 pb-1">
            <button type="button" onClick={() => setValue("stopLoss", Math.max(0, parseFloat(watch("stopLoss") || "0") - 0.0001).toFixed(5))} className="text-info px-2">-</button>
            <input 
              {...register("stopLoss")}
              type="text" 
              inputMode="decimal"
              placeholder="SL"
              className="w-full bg-transparent text-center font-mono text-sm focus:outline-none"
            />
            <button type="button" onClick={() => setValue("stopLoss", (parseFloat(watch("stopLoss") || "0") + 0.0001).toFixed(5))} className="text-info px-2">+</button>
          </div>
          <div className="flex-1 relative flex items-center border-b border-success/50 pb-1">
            <button type="button" onClick={() => setValue("takeProfit", Math.max(0, parseFloat(watch("takeProfit") || "0") - 0.0001).toFixed(5))} className="text-info px-2">-</button>
            <input 
              {...register("takeProfit")}
              type="text" 
              inputMode="decimal"
              placeholder="TP"
              className="w-full bg-transparent text-center font-mono text-sm focus:outline-none"
            />
            <button type="button" onClick={() => setValue("takeProfit", (parseFloat(watch("takeProfit") || "0") + 0.0001).toFixed(5))} className="text-info px-2">+</button>
          </div>
        </div>

        {/* Fill Policy */}
        <div className="flex justify-between items-center text-xs text-muted-foreground mb-6">
          <span>Fill policy</span>
          <span>Fill or Kill</span>
        </div>

        {/* Tick Chart Placeholder (Visual Match for MT5) */}
        <div className="h-32 border border-border/50 rounded-md mb-6 relative overflow-hidden bg-muted/10 hidden md:block">
           <div className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground/30">
              Tick Chart Area
           </div>
        </div>

        <div className="text-center text-[11px] text-muted-foreground/70 mb-4 px-2">
          Attention! The trade will be executed at market conditions, difference with requested price may be significant!
        </div>

        {/* Messages */}
        {message && (
          <div className={cn("text-xs p-2 rounded text-center", message.type === 'error' ? "bg-danger/10 text-danger" : "bg-success/10 text-success")}>
            {message.text}
          </div>
        )}

        
        <div className="flex items-center gap-2 border-t border-border/30 pt-4">
          <Button 
            type="submit" 
            disabled={isSubmitting}
            onClick={() => setSide('sell')}
            variant="ghost"
            className="flex-1 h-14 font-medium text-base text-danger hover:bg-danger/10 hover:text-danger uppercase rounded-none flex flex-col items-center justify-center"
          >
            <span className="leading-tight">SELL</span>
            <span className="text-[10px] font-normal leading-tight">BY MARKET</span>
          </Button>
          
          <div className="w-[1px] h-10 bg-border/50"></div>
          
          <Button 
            type="submit" 
            disabled={isSubmitting}
            onClick={() => setSide('buy')}
            variant="ghost"
            className="flex-1 h-14 font-medium text-base text-info hover:bg-info/10 hover:text-info uppercase rounded-none flex flex-col items-center justify-center"
          >
            <span className="leading-tight">BUY</span>
            <span className="text-[10px] font-normal leading-tight">BY MARKET</span>
          </Button>
        </div>


      </form>
    </div>
  )
}
