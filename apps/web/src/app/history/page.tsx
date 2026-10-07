"use client"
import { useEffect, useState } from "react"
import { apiClient } from "@ethsltd/api-client"
import { AppNavigation } from "@/components/layout/AppNavigation"
import { SortAsc, CalendarRange } from "lucide-react"

export default function HistoryPage() {
  const [activeTab, setActiveTab] = useState<'POSITIONS' | 'ORDERS' | 'DEALS'>('POSITIONS')
  const [positions, setPositions] = useState<any[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [deals, setDeals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [summaryStats, setSummaryStats] = useState({ profit: 0, deposit: 0, swap: 0, commission: 0, balance: 0 })

  const loadData = async () => {
    try {
      setLoading(true)
      const [posRes, ordRes, dealsRes, txRes, portRes] = await Promise.all([
        apiClient.getPositions().catch(() => ({ success: false, data: [] })),
        apiClient.getOrders().catch(() => ({ success: false, data: [] })),
        apiClient.getTrades().catch(() => ({ success: false, data: [] })),
        apiClient.getWalletTransactions().catch(() => ({ success: false, data: [] })),
        apiClient.getWalletPortfolio().catch(() => ({ success: false, data: null }))
      ])

      let closedPositions: any[] = [];
      if (posRes.success && posRes.data) {
        closedPositions = posRes.data.filter((p: any) => p.status !== 'OPEN');
        setPositions(closedPositions);
      }
      
      if (ordRes.success && ordRes.data) {
        setOrders(ordRes.data)
      }

      if (dealsRes.success && dealsRes.data) {
        setDeals(dealsRes.data)
      }

      // Calculate Summary Stats
      let profit = 0;
      let swap = 0;
      let commission = 0;
      closedPositions.forEach((p: any) => {
        profit += (p.realizedPnl || 0);
        swap += (p.swap || 0);
        commission += (p.commission || 0);
      });

      let deposit = 0;
      if (txRes.success && txRes.data) {
        txRes.data.forEach((tx: any) => {
          if (tx.type === 'DEPOSIT' && tx.status === 'COMPLETED') {
            deposit += parseFloat(tx.amount || '0');
          }
        });
      }

      let balance = 0;
      if (portRes.success && portRes.data?.summary) {
        balance = portRes.data.summary.totalValueUsd || 0;
      }

      setSummaryStats({ profit, deposit, swap, commission, balance });
    } catch (e) {
      console.error("Failed to load history data", e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

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

  return (
    <div className="flex flex-col min-h-screen bg-black text-white pb-16">
      {/* Top Header */}
      <div className="flex items-center justify-between px-4 h-14 border-b border-white/5 sticky top-0 bg-black z-20">
        <div className="flex items-center gap-4">
          <button className="p-1">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          </button>
          <div>
            <div className="text-white font-medium text-base leading-tight">History</div>
            <div className="text-white/60 text-xs">All symbols</div>
          </div>
        </div>
        <div className="flex items-center gap-4 text-white">
          <button className="p-1"><SortAsc size={20} /></button>
          <button className="p-1"><CalendarRange size={20} /></button>
        </div>
      </div>

      <main className="flex-1 flex flex-col w-full max-w-2xl mx-auto overflow-y-auto">
        
        {/* MT5 Summary Header */}
        {!loading && (
          <div className="flex flex-col px-4 py-3 bg-black border-b border-white/5 font-mono text-[13px] text-white/60">
            <div className="flex justify-between items-center mb-1">
              <span>Profit:</span>
              <span className="flex-1 border-b border-dotted border-white/20 mx-2 mb-1"></span>
              <span className={summaryStats.profit >= 0 ? "text-[#3b82f6]" : "text-[#ef4444]"}>
                {summaryStats.profit.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center mb-1">
              <span>Deposit:</span>
              <span className="flex-1 border-b border-dotted border-white/20 mx-2 mb-1"></span>
              <span className="text-white">{summaryStats.deposit.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center mb-1">
              <span>Swap:</span>
              <span className="flex-1 border-b border-dotted border-white/20 mx-2 mb-1"></span>
              <span className={summaryStats.swap < 0 ? "text-[#ef4444]" : "text-white"}>
                {summaryStats.swap.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center mb-1">
              <span>Commission:</span>
              <span className="flex-1 border-b border-dotted border-white/20 mx-2 mb-1"></span>
              <span className={summaryStats.commission < 0 ? "text-[#ef4444]" : "text-white"}>
                {summaryStats.commission.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center mt-2 pt-2 border-t border-white/10 text-white font-bold text-[14px]">
              <span>Balance:</span>
              <span className="flex-1 border-b border-dotted border-white/20 mx-2 mb-1"></span>
              <span>{summaryStats.balance.toFixed(2)}</span>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex w-full border-b border-white/10 mt-2">
          {['POSITIONS', 'ORDERS', 'DEALS'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`flex-1 py-3 text-xs font-medium tracking-wide ${activeTab === tab ? 'text-[#3b82f6] border-b-2 border-[#3b82f6]' : 'text-white/50 border-b-2 border-transparent hover:text-white/80'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex flex-col w-full">
          {loading && <div className="p-8 text-center text-white/40 text-sm">Loading...</div>}
          
          {/* POSITIONS TAB */}
          {activeTab === 'POSITIONS' && !loading && (
            <>
              {positions.length === 0 && (
                <div className="p-8 text-center text-white/40 text-sm">No positions in history</div>
              )}
              <div className="flex flex-col text-[14px]">
                {positions.map((pos) => {
                  const isLong = pos.side === 'LONG' || pos.side === 'BUY';
                  const sideColor = isLong ? 'text-[#3b82f6]' : 'text-[#ef4444]';
                  const pnlColor = (pos.realizedPnl || 0) >= 0 ? 'text-[#3b82f6]' : 'text-[#ef4444]';
                  return (
                    <div key={pos.id} className="flex flex-col border-b border-white/10 px-4 py-3">
                      <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center gap-1 font-bold">
                          <span>{pos.market || pos.symbol}</span>
                          <span className="font-normal text-white/50">,</span>
                          <span className={`${sideColor} font-normal lowercase`}>
                            {isLong ? 'buy' : 'sell'} {pos.amount}
                          </span>
                        </div>
                        <div className={`font-bold font-mono text-[16px] ${pnlColor}`}>
                          {pos.realizedPnl ? pos.realizedPnl.toFixed(2) : '0.00'}
                        </div>
                      </div>
                      <div className="flex justify-between text-white/60 font-mono text-[13px]">
                        <div>{formatTime(pos.createdAt)}</div>
                        <div className="text-white/90">{pos.status}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          )}

          {/* ORDERS TAB */}
          {activeTab === 'ORDERS' && !loading && (
            <>
              {orders.length === 0 && (
                <div className="p-8 text-center text-white/40 text-sm">No orders in history</div>
              )}
              {orders.length > 0 && (
                <div className="flex flex-col p-4 border-b border-white/10 gap-2 font-mono text-[13px] text-white/60">
                   <div className="flex justify-between"><span>Filled:</span><span className="text-white border-b border-dotted border-white/20 flex-1 mx-2"></span><span className="text-white">{orders.filter(o => o.status === 'FILLED').length}</span></div>
                   <div className="flex justify-between"><span>Canceled:</span><span className="text-white border-b border-dotted border-white/20 flex-1 mx-2"></span><span className="text-white">{orders.filter(o => o.status === 'CANCELED').length}</span></div>
                   <div className="flex justify-between"><span>Total:</span><span className="text-white border-b border-dotted border-white/20 flex-1 mx-2"></span><span className="text-white">{orders.length}</span></div>
                </div>
              )}
              <div className="flex flex-col text-[14px]">
                {orders.map((ord) => {
                  const isBuy = ord.side === 'BUY';
                  const sideColor = isBuy ? 'text-[#3b82f6]' : 'text-[#ef4444]';
                  return (
                    <div key={ord.id} className="flex flex-col border-b border-white/10 px-4 py-3">
                      <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center gap-1 font-bold">
                          <span>{ord.market}</span>
                          <span className="font-normal text-white/50">,</span>
                          <span className={`${sideColor} font-normal lowercase`}>
                            {isBuy ? 'buy' : 'sell'}
                          </span>
                        </div>
                        <div className="text-white/60 font-mono text-[13px]">
                          {formatTime(ord.createdAt)}
                        </div>
                      </div>
                      <div className="flex justify-between text-white/70 font-mono text-[13px]">
                        <div>{ord.filled} / {ord.amount} at {ord.type === 'MARKET' ? 'market' : ord.price}</div>
                        <div className="text-white font-sans text-[12px]">{ord.status}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          )}

          {/* DEALS TAB */}
          {activeTab === 'DEALS' && !loading && (
            <>
              {deals.length === 0 && (
                <div className="p-8 text-center text-white/40 text-sm">No deals in history</div>
              )}
              <div className="flex flex-col text-[14px]">
                {deals.map((deal) => {
                  const isBuy = deal.side === 'BUY';
                  const sideColor = isBuy ? 'text-[#3b82f6]' : 'text-[#ef4444]';
                  return (
                    <div key={deal.id} className="flex flex-col border-b border-white/10 px-4 py-3">
                      <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center gap-1 font-bold">
                          <span>{deal.market}</span>
                          <span className="font-normal text-white/50">,</span>
                          <span className={`${sideColor} font-normal lowercase`}>
                            {isBuy ? 'buy' : 'sell'}
                          </span>
                        </div>
                        <div className="text-white/60 font-mono text-[13px]">
                          {formatTime(deal.createdAt)}
                        </div>
                      </div>
                      <div className="flex justify-between text-white/70 font-mono text-[13px]">
                        <div>{deal.amount} at {deal.price}</div>
                        <div>Fee: {deal.fee || '0'} {deal.feeAsset || 'USDT'}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </div>
      </main>

      <AppNavigation />
    </div>
  )
}
