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

import { useTradingModeStore } from "@/stores/trading-mode-store"

// Schema dynamically updated based on order type
const getOrderSchema = (type: OrderType) => z.object({
  price: type === 'limit' 
    ? z.string().refine(val => !isNaN(parseFloat(val)) && parseFloat(val) > 0, "Valid price required") 
    : z.string().optional(),
  quantity: z.string().refine(val => !isNaN(parseFloat(val)) && parseFloat(val) > 0, "Valid quantity required"),
});

export function OrderEntry({ market }: { market: Market }) {
  const { selectedSide, setSide, selectedOrderType, setOrderType, orderFormPrice, orderFormQuantity, setOrderFormPrice, setOrderFormQuantity, marketType, leverage, setLeverage } = useTradingUIStore()
  const { balances, fetchBalances } = useWalletStore()
  const { mode } = useTradingModeStore()
  const { base, quote } = parseMarketSymbol(market.symbol)
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{type: 'success'|'error', text: string} | null>(null)

  useEffect(() => {
    fetchBalances(mode);
  }, [fetchBalances, mode]);

  const { register, handleSubmit, formState: { errors }, setValue, watch, trigger } = useForm({
    resolver: zodResolver(getOrderSchema(selectedOrderType)),
    defaultValues: { price: orderFormPrice, quantity: orderFormQuantity }
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
  const fee = notionalValue * 0.001 // 0.1% taker fee
  const requiredMargin = marketType === 'FUTURES' ? notionalValue / leverage : notionalValue
  const total = requiredMargin + fee
  
  const quoteBalance = balances.find(b => b.symbol === quote)?.available || 0
  const baseBalance = balances.find(b => b.symbol === base)?.available || 0

  const handlePercentageClick = (pct: number) => {
    // If the price is zero (still loading), we can't calculate amount
    if (!currentPrice || currentPrice <= 0) return;

    if (selectedSide === 'buy') {
      let targetQuote = quoteBalance * pct;
      if (marketType === 'FUTURES') {
        // Calculate max notional based on leverage
        const maxNotional = targetQuote * leverage;
        const qty = maxNotional / currentPrice;
        if (qty > 0) {
          const qtyStr = qty.toFixed(6);
          setValue("quantity", qtyStr, { shouldValidate: true, shouldDirty: true });
          setOrderFormQuantity(qtyStr); 
        }
      } else {
        const qty = targetQuote / currentPrice;
        if (qty > 0) {
          const qtyStr = qty.toFixed(6);
          setValue("quantity", qtyStr, { shouldValidate: true, shouldDirty: true });
          setOrderFormQuantity(qtyStr);
        }
      }
    } else {
      if (marketType === 'FUTURES') {
         // For shorting in futures, we also use quote balance as margin
        let targetQuote = quoteBalance * pct;
        const maxNotional = targetQuote * leverage;
        const qty = maxNotional / currentPrice;
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
  }

  const onSubmit = async (data: any) => {
    setIsSubmitting(true)
    setMessage(null)
    
    const reqAmount = parseFloat(data.quantity);
    const reqPrice = selectedOrderType === 'limit' ? parseFloat(data.price) : currentPrice;
    const reqTotal = reqAmount * reqPrice;

    if (marketType === 'SPOT') {
      if (selectedSide === 'buy' && total > quoteBalance) {
        setMessage({ type: 'error', text: `Insufficient ${quote} balance.` });
        setIsSubmitting(false);
        return;
      } else if (selectedSide === 'sell' && reqAmount > baseBalance) {
        setMessage({ type: 'error', text: `Insufficient ${base} balance.` });
        setIsSubmitting(false);
        return;
      }
    } else if (marketType === 'FUTURES') {
      if (total > quoteBalance) {
        setMessage({ type: 'error', text: `Insufficient Margin (${quote}) balance.` });
        setIsSubmitting(false);
        return;
      }
    }
    
    try {
      let res;
      if (marketType === 'SPOT') {
        res = await apiClient.createOrder({
          market: market.id,
          side: selectedSide === 'buy' ? 'BUY' : 'SELL',
          type: selectedOrderType === 'market' ? 'MARKET' : 'LIMIT',
          price: selectedOrderType === 'limit' ? parseFloat(data.price) : undefined,
          amount: parseFloat(data.quantity),
          mode: mode
        });
      } else if (marketType === 'FUTURES') {
        res = await apiClient.createFuturesOrder({
          market: market.id,
          side: selectedSide === 'buy' ? 'LONG' : 'SHORT',
          amount: parseFloat(data.quantity),
          leverage: leverage.toString(),
        });
      } else if (marketType === 'OPTIONS') {
        res = await apiClient.createOptionsOrder({
          market: market.id,
          direction: selectedSide === 'buy' ? 'UP' : 'DOWN',
          amount: parseFloat(data.quantity),
          timeframeMinutes: '5', // Default 5m for now
        });
      }
      
      if (!res || !res.success) {
        throw new Error(res?.error || 'Failed to place order')
      }
      
      setMessage({ type: 'success', text: 'Order placed successfully' })
      setValue("quantity", "") // Reset quantity on success
      fetchBalances(mode) // Refresh balances
      setTimeout(() => setMessage(null), 3000)
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to place order' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col h-full bg-background rounded-lg border border-border p-4">
      {/* Buy/Sell Tabs */}
      <div className="flex bg-muted rounded-md p-1 mb-4 relative z-0">
        <div 
          className="absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded bg-background shadow transition-transform duration-200 z-0" 
          style={{ transform: selectedSide === 'sell' ? 'translateX(100%)' : 'translateX(0)' }} 
        />
        <button 
          className={cn("flex-1 py-1.5 text-sm font-semibold z-10 transition-colors", selectedSide === 'buy' ? 'text-success' : 'text-muted-foreground')}
          onClick={() => setSide('buy')}
          type="button"
        >
          {marketType === 'FUTURES' ? 'Long' : marketType === 'OPTIONS' ? 'Call (Up)' : 'Buy'}
        </button>
        <button 
          className={cn("flex-1 py-1.5 text-sm font-semibold z-10 transition-colors", selectedSide === 'sell' ? 'text-danger' : 'text-muted-foreground')}
          onClick={() => setSide('sell')}
          type="button"
        >
          {marketType === 'FUTURES' ? 'Short' : marketType === 'OPTIONS' ? 'Put (Down)' : 'Sell'}
        </button>
      </div>

      {/* Order Type (Hidden for Options) */}
      {marketType !== 'OPTIONS' && (
        <div className="flex gap-4 mb-4 border-b border-border text-sm">
          <button 
            className={cn("pb-2 font-medium transition-colors", selectedOrderType === 'limit' ? 'text-foreground border-b-2 border-brand-foreground' : 'text-muted-foreground')}
            onClick={() => setOrderType('limit')}
            type="button"
          >
            Limit
          </button>
          <button 
            className={cn("pb-2 font-medium transition-colors", selectedOrderType === 'market' ? 'text-foreground border-b-2 border-brand-foreground' : 'text-muted-foreground')}
            onClick={() => setOrderType('market')}
            type="button"
          >
            Market
          </button>
        </div>
      )}

      {/* Leverage Slider (Futures only) */}
      {marketType === 'FUTURES' && (
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-muted-foreground">Leverage</span>
            <span className="text-xs font-mono bg-muted px-2 py-0.5 rounded">{leverage}x</span>
          </div>
          <input 
            type="range" 
            min="1" 
            max="100" 
            value={leverage}
            onChange={(e) => setLeverage(parseInt(e.target.value))}
            className="w-full accent-brand-foreground"
          />
        </div>
      )}

      <div className="flex justify-between items-center mb-4 text-xs">
        <span className="text-muted-foreground">Available</span>
        <span className="font-mono font-medium">
          {marketType === 'SPOT' 
            ? (selectedSide === 'buy' ? `${quoteBalance.toLocaleString()} ${quote}` : `${baseBalance.toLocaleString()} ${base}`)
            : `${quoteBalance.toLocaleString()} ${quote}` // Futures & Options use Quote balance as margin
          }
        </span>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        
        {/* Price Input */}
        <div className="relative">
          <label className="text-xs text-muted-foreground mb-1 block">Price ({quote})</label>
          <div className="relative flex items-center">
            <input 
              {...register("price")}
              type="text" 
              inputMode="decimal"
              placeholder={selectedOrderType === 'market' ? "Market Price" : "0.00"}
              disabled={selectedOrderType === 'market'}
              className="w-full bg-muted border border-border rounded h-10 px-3 font-mono text-sm focus:outline-none focus:border-brand-foreground disabled:opacity-50"
            />
          </div>
          {errors.price && <span className="text-xs text-danger mt-1 absolute -bottom-5 left-0">{errors.price.message?.toString()}</span>}
        </div>

        {/* Quantity Input */}
        <div className="relative mt-2">
          <label className="text-xs text-muted-foreground mb-1 block">
            {marketType === 'OPTIONS' ? `Wager (${quote})` : `Amount (${base})`}
          </label>
          <div className="relative flex items-center">
            <input 
              {...register("quantity")}
              type="text" 
              inputMode="decimal"
              placeholder="0.00"
              className="w-full bg-muted border border-border rounded h-10 px-3 font-mono text-sm focus:outline-none focus:border-brand-foreground"
            />
          </div>
          {errors.quantity && <span className="text-xs text-danger mt-1 absolute -bottom-5 left-0">{errors.quantity.message?.toString()}</span>}
        </div>

        {/* Percentages */}
        <div className="flex gap-2 mt-3">
          {[0.25, 0.50, 0.75, 1].map(pct => (
            <button 
              key={pct}
              type="button"
              className="flex-1 bg-muted hover:bg-muted/80 text-muted-foreground text-xs py-1 rounded transition-colors"
              onClick={() => handlePercentageClick(pct)}
            >
              {pct * 100}%
            </button>
          ))}
        </div>

        {/* Summary */}
        <div className="mt-4 pt-4 border-t border-border space-y-2 text-sm">
          {marketType === 'FUTURES' && (
            <div className="flex justify-between">
              <span className="text-muted-foreground text-xs">Position Value</span>
              <span className="font-mono">{notionalValue > 0 ? notionalValue.toLocaleString(undefined, { maximumFractionDigits: 2 }) : "0.00"} {quote}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-muted-foreground text-xs">{marketType === 'FUTURES' ? 'Required Margin' : 'Est. Total'}</span>
            <span className="font-mono">{requiredMargin > 0 ? requiredMargin.toLocaleString(undefined, { maximumFractionDigits: 2 }) : "0.00"} {quote}</span>
          </div>
          {marketType !== 'OPTIONS' && (
            <div className="flex justify-between">
              <span className="text-muted-foreground text-xs">Est. Fee</span>
              <span className="font-mono">{fee > 0 ? fee.toLocaleString(undefined, { maximumFractionDigits: 4 }) : "0.00"} {quote}</span>
            </div>
          )}
        </div>

        {/* Messages */}
        {message && (
          <div className={cn("text-xs p-2 rounded text-center", message.type === 'error' ? "bg-danger/10 text-danger" : "bg-success/10 text-success")}>
            {message.text}
          </div>
        )}

        {/* Submit */}
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className={cn("w-full mt-2 font-bold", selectedSide === 'buy' ? "bg-success hover:bg-success/90 text-white" : "bg-danger hover:bg-danger/90 text-white")}
        >
          {isSubmitting ? "Placing..." : marketType === 'FUTURES' 
            ? `${selectedSide === 'buy' ? 'Open Long' : 'Open Short'} ${base}`
            : marketType === 'OPTIONS'
              ? `Place ${selectedSide === 'buy' ? 'Call' : 'Put'}`
              : `${selectedSide === 'buy' ? 'Buy' : 'Sell'} ${base}`
          }
        </Button>

      </form>
    </div>
  )
}
