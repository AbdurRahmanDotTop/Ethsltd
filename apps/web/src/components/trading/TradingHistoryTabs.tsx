"use client"
import { useState } from "react"
import { usePaperAccountStore } from "@/stores/paper-account-store"
import { formatPrice } from "@/lib/trading/calculations"
import { Button } from "@/components/ui/button"
import { tradingProvider } from "@/lib/trading/mock-provider"

export function TradingHistoryTabs() {
  const [activeTab, setActiveTab] = useState<'open'|'history'|'trades'>('open')
  const { orders, trades } = usePaperAccountStore()
  
  const openOrders = orders.filter(o => o.status === 'open' || o.status === 'partially_filled')
  
  const fmtDate = (d: string) => {
    try {
      const date = new Date(d);
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    } catch { return d }
  }

  const handleCancel = async (id: string) => {
    try {
      await tradingProvider.cancelOrder(id);
    } catch(e) { console.error(e) }
  }

  return (
    <div className="flex flex-col h-full bg-background border-t border-border mt-4">
      <div className="flex border-b border-border overflow-x-auto no-scrollbar">
        <button 
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'open' ? 'border-brand-foreground text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
          onClick={() => setActiveTab('open')}
        >
          Open Orders ({openOrders.length})
        </button>
        <button 
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'history' ? 'border-brand-foreground text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
          onClick={() => setActiveTab('history')}
        >
          Order History
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
                  <td className="py-3 capitalize text-xs hidden sm:table-cell">{order.type}</td>
                  <td className={`py-3 capitalize text-xs font-semibold ${order.side === 'buy' ? 'text-success' : 'text-danger'}`}>{order.side}</td>
                  <td className="py-3 font-mono text-xs">{order.price ? formatPrice(order.price) : 'Market'}</td>
                  <td className="py-3 font-mono text-xs">{order.quantity}</td>
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
                  <td className="py-3 capitalize text-xs hidden sm:table-cell">{order.type}</td>
                  <td className={`py-3 capitalize text-xs font-semibold ${order.side === 'buy' ? 'text-success' : 'text-danger'}`}>{order.side}</td>
                  <td className="py-3 font-mono text-xs">{order.price ? formatPrice(order.price) : 'Market'}</td>
                  <td className="py-3 font-mono text-xs">{order.quantity}</td>
                  <td className="py-3 capitalize text-xs text-muted-foreground">{order.status}</td>
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
                  <td className="py-3 pl-4 font-mono text-xs text-muted-foreground hidden md:table-cell">{fmtDate(trade.timestamp)}</td>
                  <td className="py-3 font-semibold text-xs">{trade.market}</td>
                  <td className={`py-3 capitalize text-xs font-semibold ${trade.side === 'buy' ? 'text-success' : 'text-danger'}`}>{trade.side}</td>
                  <td className="py-3 font-mono text-xs">{formatPrice(trade.price)}</td>
                  <td className="py-3 font-mono text-xs">{trade.quantity}</td>
                  <td className="py-3 font-mono text-xs text-muted-foreground hidden sm:table-cell">{trade.fee.toFixed(4)} {trade.feeAsset}</td>
                  <td className="py-3 pr-4 text-right font-mono text-xs font-medium">{trade.quoteAmount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
