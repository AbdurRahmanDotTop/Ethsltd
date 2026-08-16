"use client"
import { useState, useEffect } from "react"
import { formatPrice } from "@/lib/trading/calculations"
import { Button } from "@/components/ui/button"
import { apiClient } from "@ethsltd/api-client"

import { useTradingModeStore } from "@/stores/trading-mode-store"
import { useTradingUIStore } from "@/stores/trading-ui-store"

export function TradingHistoryTabs() {
  const [activeTab, setActiveTab] = useState<'open'|'history'|'trades'|'positions'>('open')
  const [orders, setOrders] = useState<any[]>([])
  const [trades, setTrades] = useState<any[]>([])
  const [positions, setPositions] = useState<any[]>([])
  
  const { mode } = useTradingModeStore()
  const { marketType } = useTradingUIStore()

  const loadData = async () => {
    try {
      const oRes = await apiClient.getOrders(mode)
      if(oRes.success) setOrders(oRes.data || [])
      
      const tRes = await apiClient.getTrades(mode)
      if(tRes.success) setTrades(tRes.data || [])

      if (marketType === 'FUTURES') {
        const pRes = await apiClient.getFuturesPositions(mode)
        if (pRes.success) setPositions(pRes.data || [])
      } else if (marketType === 'OPTIONS') {
        const oRes = await apiClient.getOptionsPositions(mode)
        if (oRes.success) setPositions(oRes.data || [])
      }
    } catch(e) {
      console.error(e)
    }
  }

  // Effect to handle tab switches automatically
  useEffect(() => {
    if ((marketType === 'FUTURES' || marketType === 'OPTIONS') && activeTab === 'open') {
      setActiveTab('positions')
    } else if (marketType === 'SPOT' && activeTab === 'positions') {
      setActiveTab('open')
    }
  }, [marketType])

  useEffect(() => {
    loadData()
    const interval = setInterval(loadData, 5000)
    return () => clearInterval(interval)
  }, [mode, marketType])
  
  const openOrders = orders.filter(o => o.status === 'OPEN')
  
  const fmtDate = (d: string) => {
    try {
      const date = new Date(d);
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    } catch { return d }
  }

  const handleCancel = async (id: string) => {
    try {
      await apiClient.cancelOrder(id);
      loadData();
    } catch(e) { console.error(e) }
  }

  const handleClosePosition = async (id: string) => {
    try {
      await apiClient.closeFuturesPosition(id);
      loadData();
    } catch(e) { console.error(e) }
  }

  return (
    <div className="flex flex-col h-full bg-background border-t border-border mt-4">
      <div className="flex border-b border-border overflow-x-auto no-scrollbar">
        {marketType === 'SPOT' && (
          <button 
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'open' ? 'border-brand-foreground text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
            onClick={() => setActiveTab('open')}
          >
            Open Orders ({openOrders.length})
          </button>
        )}
        {(marketType === 'FUTURES' || marketType === 'OPTIONS') && (
          <button 
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'positions' ? 'border-brand-foreground text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
            onClick={() => setActiveTab('positions')}
          >
            Open Positions ({positions.filter(p => p.status === 'OPEN' || p.status === 'PENDING').length})
          </button>
        )}
        <button 
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'history' ? 'border-brand-foreground text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
          onClick={() => setActiveTab('history')}
        >
          {marketType === 'SPOT' ? 'Order History' : 'History'}
        </button>
        <button 
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'trades' ? 'border-brand-foreground text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
          onClick={() => setActiveTab('trades')}
        >
          Trade History
        </button>
      </div>

      <div className="flex-1 overflow-auto max-h-[400px]">
        {activeTab === 'open' && (
          <table className="w-full text-left text-sm">
            <thead className="text-muted-foreground border-b border-border text-xs sticky top-0 bg-background z-10">
              <tr>
                <th className="py-3 pl-4 font-medium hidden md:table-cell">Time</th>
                <th className="py-3 font-medium">Pair</th>
                <th className="py-3 font-medium hidden sm:table-cell">Type</th>
                <th className="py-3 font-medium">Side</th>
                <th className="py-3 font-medium">Price</th>
                <th className="py-3 font-medium">Amount</th>
                <th className="py-3 pr-4 text-right font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {openOrders.length === 0 ? (
                <tr><td colSpan={7} className="py-12 text-center text-muted-foreground">No open orders. Your active orders will appear here.</td></tr>
              ) : openOrders.map(order => (
                <tr key={order.id} className="hover:bg-muted/30">
                  <td className="py-3 pl-4 font-mono text-xs text-muted-foreground hidden md:table-cell">{fmtDate(order.createdAt)}</td>
                  <td className="py-3 font-semibold text-xs">{order.market}</td>
                  <td className="py-3 capitalize text-xs hidden sm:table-cell">{order.type.toLowerCase()}</td>
                  <td className={`py-3 capitalize text-xs font-semibold ${order.side === 'BUY' ? 'text-success' : 'text-danger'}`}>{order.side.toLowerCase()}</td>
                  <td className="py-3 font-mono text-xs">{order.price ? formatPrice(order.price) : 'Market'}</td>
                  <td className="py-3 font-mono text-xs">{order.amount}</td>
                  <td className="py-3 pr-4 text-right">
                    <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => handleCancel(order.id)}>Cancel</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === 'history' && (
          <table className="w-full text-left text-sm">
            <thead className="text-muted-foreground border-b border-border text-xs sticky top-0 bg-background z-10">
              <tr>
                <th className="py-3 pl-4 font-medium hidden md:table-cell">Time</th>
                <th className="py-3 font-medium">Pair</th>
                <th className="py-3 font-medium hidden sm:table-cell">Type</th>
                <th className="py-3 font-medium">Side</th>
                <th className="py-3 font-medium">Price</th>
                <th className="py-3 font-medium">Amount</th>
                <th className="py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {orders.length === 0 ? (
                <tr><td colSpan={7} className="py-12 text-center text-muted-foreground">No order history.</td></tr>
              ) : orders.map(order => (
                <tr key={order.id} className="hover:bg-muted/30">
                  <td className="py-3 pl-4 font-mono text-xs text-muted-foreground hidden md:table-cell">{fmtDate(order.createdAt)}</td>
                  <td className="py-3 font-semibold text-xs">{order.market}</td>
                  <td className="py-3 capitalize text-xs hidden sm:table-cell">{order.type.toLowerCase()}</td>
                  <td className={`py-3 capitalize text-xs font-semibold ${order.side === 'BUY' ? 'text-success' : 'text-danger'}`}>{order.side.toLowerCase()}</td>
                  <td className="py-3 font-mono text-xs">{order.price ? formatPrice(order.price) : 'Market'}</td>
                  <td className="py-3 font-mono text-xs">{order.amount}</td>
                  <td className="py-3 capitalize text-xs text-muted-foreground">{order.status.toLowerCase()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === 'trades' && (
          <table className="w-full text-left text-sm">
            <thead className="text-muted-foreground border-b border-border text-xs sticky top-0 bg-background z-10">
              <tr>
                <th className="py-3 pl-4 font-medium hidden md:table-cell">Time</th>
                <th className="py-3 font-medium">Pair</th>
                <th className="py-3 font-medium">Side</th>
                <th className="py-3 font-medium">Price</th>
                <th className="py-3 font-medium">Amount</th>
                <th className="py-3 font-medium hidden sm:table-cell">Fee</th>
                <th className="py-3 pr-4 text-right font-medium">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {trades.length === 0 ? (
                <tr><td colSpan={7} className="py-12 text-center text-muted-foreground">No trades yet. Your completed trades will appear here.</td></tr>
              ) : trades.map(trade => (
                <tr key={trade.id} className="hover:bg-muted/30">
                  <td className="py-3 pl-4 font-mono text-xs text-muted-foreground hidden md:table-cell">{fmtDate(trade.createdAt)}</td>
                  <td className="py-3 font-semibold text-xs">{trade.market}</td>
                  <td className={`py-3 capitalize text-xs font-semibold ${trade.side === 'BUY' ? 'text-success' : 'text-danger'}`}>{trade.side.toLowerCase()}</td>
                  <td className="py-3 font-mono text-xs">{formatPrice(trade.price)}</td>
                  <td className="py-3 font-mono text-xs">{trade.amount}</td>
                  <td className="py-3 font-mono text-xs text-muted-foreground hidden sm:table-cell">{trade.fee.toFixed(4)} {trade.feeAsset}</td>
                  <td className="py-3 pr-4 text-right font-mono text-xs font-medium">{trade.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === 'positions' && marketType === 'FUTURES' && (
          <table className="w-full text-left text-sm">
            <thead className="text-muted-foreground border-b border-border text-xs sticky top-0 bg-background z-10">
              <tr>
                <th className="py-3 pl-4 font-medium">Pair</th>
                <th className="py-3 font-medium">Size</th>
                <th className="py-3 font-medium">Entry Price</th>
                <th className="py-3 font-medium">Mark Price</th>
                <th className="py-3 font-medium">Liq. Price</th>
                <th className="py-3 font-medium">Margin</th>
                <th className="py-3 font-medium">uPnL</th>
                <th className="py-3 pr-4 text-right font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {positions.filter(p => p.status === 'OPEN').length === 0 ? (
                <tr><td colSpan={8} className="py-12 text-center text-muted-foreground">No open positions.</td></tr>
              ) : positions.filter(p => p.status === 'OPEN').map(pos => (
                <tr key={pos.id} className="hover:bg-muted/30">
                  <td className="py-3 pl-4 font-semibold text-xs">
                    <span className={pos.side === 'LONG' ? 'text-success' : 'text-danger'}>{pos.side}</span>
                    <span className="ml-2">{pos.marketSymbol}</span>
                    <span className="ml-2 text-muted-foreground">{pos.leverage}x</span>
                  </td>
                  <td className="py-3 font-mono text-xs">{pos.amount}</td>
                  <td className="py-3 font-mono text-xs">{formatPrice(pos.entryPrice)}</td>
                  <td className="py-3 font-mono text-xs">{formatPrice(pos.markPrice)}</td>
                  <td className="py-3 font-mono text-xs text-warning">{formatPrice(pos.liquidationPrice)}</td>
                  <td className="py-3 font-mono text-xs">{parseFloat(pos.marginAmount).toFixed(2)}</td>
                  <td className={`py-3 font-mono text-xs font-semibold ${pos.unrealizedPnl >= 0 ? 'text-success' : 'text-danger'}`}>
                    {pos.unrealizedPnl > 0 ? '+' : ''}{pos.unrealizedPnl.toFixed(2)} ({pos.marginRatio.toFixed(2)}%)
                  </td>
                  <td className="py-3 pr-4 text-right">
                    <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => handleClosePosition(pos.id)}>Close</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === 'positions' && marketType === 'OPTIONS' && (
          <table className="w-full text-left text-sm">
            <thead className="text-muted-foreground border-b border-border text-xs sticky top-0 bg-background z-10">
              <tr>
                <th className="py-3 pl-4 font-medium">Time</th>
                <th className="py-3 font-medium">Pair</th>
                <th className="py-3 font-medium">Direction</th>
                <th className="py-3 font-medium">Entry Price</th>
                <th className="py-3 font-medium">Wager</th>
                <th className="py-3 pr-4 text-right font-medium">Expires At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {positions.filter(p => p.status === 'PENDING').length === 0 ? (
                <tr><td colSpan={6} className="py-12 text-center text-muted-foreground">No open options contracts.</td></tr>
              ) : positions.filter(p => p.status === 'PENDING').map(opt => (
                <tr key={opt.id} className="hover:bg-muted/30">
                  <td className="py-3 pl-4 font-mono text-xs text-muted-foreground">{fmtDate(opt.createdAt)}</td>
                  <td className="py-3 font-semibold text-xs">{opt.marketSymbol}</td>
                  <td className={`py-3 capitalize text-xs font-semibold ${opt.direction === 'UP' ? 'text-success' : 'text-danger'}`}>{opt.direction}</td>
                  <td className="py-3 font-mono text-xs">{formatPrice(opt.entryPrice)}</td>
                  <td className="py-3 font-mono text-xs">{parseFloat(opt.amount).toFixed(2)} USDT</td>
                  <td className="py-3 pr-4 text-right font-mono text-xs">{fmtDate(opt.expiresAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
