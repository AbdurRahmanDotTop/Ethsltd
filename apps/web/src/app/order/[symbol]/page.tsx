"use client"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, FileText, RefreshCw } from "lucide-react"
import { apiClient } from "@ethsltd/api-client"
import { OrderEntry } from "@/components/trading/OrderEntry"
import { OrderSuccessModal } from "@/components/trading/OrderSuccessModal"

export default function MobileOrderPage() {
  const router = useRouter()
  const params = useParams()
  const [market, setMarket] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  
  const rawSymbol = decodeURIComponent((params?.symbol as string) || "");
  const symbol = rawSymbol.replace('_', '-').replace(' ', '-'); // normalize

  useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        const res = await apiClient.getMarkets()
        const m = res.data?.find((m: any) => m.symbol.toLowerCase() === symbol.toLowerCase() || m.id.toLowerCase() === symbol.toLowerCase())
        if (m && mounted) {
          setMarket(m)
        }
      } catch (e) {
        console.error(e)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()

    // Real-time price updates via WS
    const wsUrl = (process.env.NEXT_PUBLIC_API_URL || '').replace('http', 'ws') + '/ws/stream'
    const ws = new WebSocket(wsUrl)
    ws.onopen = () => ws.send(JSON.stringify({ type: 'subscribe', symbol: symbol.toUpperCase() }))
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        if (data.type === 'ticker' && mounted) {
          setMarket((prev: any) => prev ? { ...prev, price: parseFloat(data.price) } : prev)
        }
      } catch(e) {}
    }
    return () => {
      mounted = false
      ws.close()
    }
  }, [symbol])

  if (loading) {
    return <div className="min-h-screen bg-black flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full" /></div>
  }

  if (!market) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
        <h2 className="text-xl font-bold mb-4">Market Not Found</h2>
        <button onClick={() => router.back()} className="px-4 py-2 bg-blue-600 rounded">Go Back</button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col">
      {/* MT5-Style Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-black border-b border-white/5">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="p-1 -ml-1">
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <div className="flex flex-col">
            <h1 className="text-xl font-medium tracking-tight leading-tight">{market.symbol.replace('-', '')}</h1>
            <span className="text-xs text-gray-400">{market.baseAsset} vs {market.quoteAsset}</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <RefreshCw className="w-5 h-5 text-gray-400" />
          <FileText className="w-5 h-5 text-gray-400" />
        </div>
      </div>

      {/* Main Order Entry Screen */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-2">
        <OrderEntry market={market} />
      </div>

      <OrderSuccessModal />
    </div>
  )
}
