"use client"
import { useEffect, useState } from "react"
import { apiClient } from "@ethsltd/api-client"
import { AppNavigation } from "@/components/layout/AppNavigation"
import { Plus, SortAsc } from "lucide-react"

export default function PositionsPage() {
  const [positions, setPositions] = useState<any[]>([])
  const [portfolio, setPortfolio] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const loadData = async () => {
    try {
      const [posRes, portRes] = await Promise.all([
        apiClient.getPositions().catch(() => ({ success: false, data: [] })),
        apiClient.getWalletPortfolio().catch(() => ({ success: false, data: null }))
      ])

      if (posRes.success && posRes.data) {
        setPositions(posRes.data.filter((p: any) => p.status === 'OPEN'))
      }
      
      if (portRes.success && portRes.data) {
        setPortfolio(portRes.data)
      } else if (portRes.success === false && !portRes.data) {
        console.warn("Portfolio data unavailable, showing without portfolio")
      }
    } catch (e) {
      console.error("Failed to load positions data", e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
    const interval = setInterval(loadData, 3000)
    return () => clearInterval(interval)
  }, [])

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  const formatTime = (isoString: string) => {
    try {
      const d = new Date(isoString)
      return d.getFullYear() + '.' + 
             String(d.getMonth() + 1).padStart(2, '0') + '.' + 
             String(d.getDate()).padStart(2, '0') + ' ' + 
             String(d.getHours()).padStart(2, '0') + ':' + 
             String(d.getMinutes()).padStart(2, '0') + ':' + 
             String(d.getSeconds()).padStart(2, '0')
    } catch { return isoString }
  }

  // Calculate total PnL from active positions
  const totalPnl = positions.reduce((acc, pos) => acc + (pos.unrealizedPnl || 0), 0)

  return (
    <div className="flex flex-col min-h-screen bg-black text-white pb-16">
      {/* Top Header */}
      <div className="flex items-center justify-between px-4 h-14 border-b border-white/5 sticky top-0 bg-black z-20">
        <div className="flex items-center gap-4">
          <button className="p-1">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          </button>
          <div>
            <div className="text-white font-medium text-base">Trade</div>
            <div className={`text-sm font-bold ${totalPnl >= 0 ? 'text-[#3b82f6]' : 'text-[#ef4444]'}`}>
              {totalPnl >= 0 ? '' : ''}{totalPnl.toFixed(2)} USD
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-1 text-white"><SortAsc size={20} /></button>
          <button className="p-1 text-white border border-white/20 rounded-sm"><Plus size={18} /></button>
        </div>
      </div>

      <main className="flex-1 flex flex-col w-full max-w-2xl mx-auto overflow-y-auto">
        {/* Account Summary Panel */}
        <div className="p-4 flex flex-col gap-2.5 text-[15px] font-mono font-medium tracking-tight">
          <div className="flex justify-between items-center">
            <span className="text-white/90 font-sans font-medium">Balance:</span>
            <div className="flex items-center gap-1">
              <span className="text-white/20">.........................</span>
              <span className="text-white">{portfolio?.balance ? portfolio.balance.toFixed(2) : '0.00'}</span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-white/90 font-sans font-medium">Equity:</span>
            <div className="flex items-center gap-1">
              <span className="text-white/20">..........................</span>
              <span className="text-white">{portfolio?.equity ? portfolio.equity.toFixed(2) : '0.00'}</span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-white/90 font-sans font-medium">Margin:</span>
            <div className="flex items-center gap-1">
              <span className="text-white/20">.........................</span>
              <span className="text-white">{portfolio?.margin ? portfolio.margin.toFixed(2) : '0.00'}</span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-white/90 font-sans font-medium">Free margin:</span>
            <div className="flex items-center gap-1">
              <span className="text-white/20">....................</span>
              <span className="text-white">{portfolio?.freeMargin ? portfolio.freeMargin.toFixed(2) : '0.00'}</span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-white/90 font-sans font-medium">Margin Level (%):</span>
            <div className="flex items-center gap-1">
              <span className="text-white/20">...............</span>
              <span className="text-white">{portfolio?.marginLevel ? portfolio.marginLevel.toFixed(2) : '0.00'}</span>
            </div>
          </div>
        </div>

        {/* Positions Header */}
        <div className="flex justify-between items-center bg-[#2c2c2e] px-4 py-2 mt-2">
          <span className="text-white/60 font-medium text-sm">Positions</span>
          <span className="text-white/60">•••</span>
        </div>

        {/* Positions List */}
        <div className="flex flex-col">
          {positions.length === 0 && !loading && (
            <div className="p-8 text-center text-white/40 text-sm">No open positions</div>
          )}
          
          {positions.map((pos) => {
            const isLong = pos.side === 'LONG' || pos.side === 'BUY';
            const isExpanded = expandedId === pos.id;
            const pnlColor = pos.unrealizedPnl >= 0 ? 'text-[#3b82f6]' : 'text-[#ef4444]';
            const sideColor = isLong ? 'text-[#3b82f6]' : 'text-[#ef4444]';
            
            return (
              <div 
                key={pos.id} 
                className="flex flex-col border-b border-white/10 px-4 py-3 active:bg-white/5 cursor-pointer"
                onClick={() => toggleExpand(pos.id)}
              >
                {/* Compact View */}
                <div className="flex justify-between items-center w-full">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1 font-bold text-[15px]">
                      <span>{pos.market || pos.symbol}</span>
                      <span className="font-normal text-white/50">,</span>
                      <span className={`${sideColor} font-normal lowercase`}>
                        {isLong ? 'buy' : 'sell'} {pos.amount}
                      </span>
                    </div>
                    <div className="text-white/70 font-mono text-[13px] mt-0.5">
                      {pos.entryPrice ? parseFloat(pos.entryPrice).toFixed(5) : '0.00000'} → {pos.currentPrice ? parseFloat(pos.currentPrice).toFixed(5) : '0.00000'}
                    </div>
                  </div>
                  <div className={`font-bold font-mono text-[16px] ${pnlColor}`}>
                    {pos.unrealizedPnl >= 0 ? '' : ''}{pos.unrealizedPnl ? pos.unrealizedPnl.toFixed(2) : '0.00'}
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="flex flex-col w-full mt-3 pt-3 border-t border-white/5 text-[13px] font-mono text-white/70">
                    <div className="flex justify-between mb-1.5">
                      <span>#{pos.ticket || pos.id || Math.floor(Math.random() * 10000000000)}</span>
                      <div className="flex gap-4">
                        <span className="w-10 text-right">Open:</span>
                        <span>{formatTime(pos.createdAt || new Date().toISOString())}</span>
                      </div>
                    </div>
                     <div className="flex justify-between mb-1.5">
                      <span className="w-10 text-right">Order:</span>
                      <span>{pos.orderId || '—'}</span>
                    </div>
                    <div className="flex justify-between mb-1.5">
                      <div className="flex gap-4">
                        <span className="w-8">S/L:</span>
                        <span className="text-white">{pos.stopLoss ? parseFloat(pos.stopLoss).toFixed(5) : '–'}</span>
                      </div>
                      <div className="flex gap-4">
                        <span className="w-10 text-right">Swap:</span>
                        <span className="text-white">{pos.swap ? parseFloat(pos.swap).toFixed(2) : '0.00'}</span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <div className="flex gap-4">
                        <span className="w-8">T/P:</span>
                        <span className="text-white">{pos.takeProfit ? parseFloat(pos.takeProfit).toFixed(5) : '–'}</span>
                      </div>
                      <div className="flex gap-4">
                        <span className="w-10 text-right"></span>
                        <span className="text-white"></span>
                      </div>
                    </div>
                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 mt-3 pt-3 border-t border-white/5">
                      <button 
                        className="px-4 py-1.5 rounded bg-white/10 text-white font-medium text-xs hover:bg-white/20 active:bg-white/30"
                        onClick={(e) => { e.stopPropagation(); /* TODO: Implement Modify */ }}
                      >
                        Modify
                      </button>
                      <button 
                        className="px-4 py-1.5 rounded bg-[#ef4444]/20 text-[#ef4444] font-medium text-xs hover:bg-[#ef4444]/30 active:bg-[#ef4444]/40"
                        onClick={async (e) => { 
                          e.stopPropagation();
                          if (confirm("Are you sure you want to close this position?")) {
                            try {
                              const res = await apiClient.closePosition(pos.id, { amount: pos.amount });
                              if (!res.success) {
                                alert(res.error || "Failed to close position");
                              }
                            } catch (err: any) {
                              alert(err.message || "Failed to close position");
                            } finally {
                              loadData();
                            }
                          }
                        }}
                      >
                        Close Position
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </main>

      <AppNavigation />
    </div>
  )
}
