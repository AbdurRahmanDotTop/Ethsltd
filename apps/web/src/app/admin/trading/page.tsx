"use client";

import { useState } from "react";
import { 
  Activity, TrendingUp, PauseCircle, PlayCircle, 
  Settings2, Search, Filter, AlertTriangle, CheckCircle,
  Zap, ArrowRightLeft, Layers, Server
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Types
type PairStatus = 'active' | 'suspended' | 'maintenance';

interface TradingPair {
  id: string;
  symbol: string;
  baseAsset: string;
  quoteAsset: string;
  price: number;
  volume24h: number;
  makerFee: number;
  takerFee: number;
  status: PairStatus;
}

// Mock Data
const MOCK_PAIRS: TradingPair[] = [
  { id: "pair-1", symbol: "BTC/USDT", baseAsset: "BTC", quoteAsset: "USDT", price: 64230.50, volume24h: 1250400000, makerFee: 0.1, takerFee: 0.1, status: "active" },
  { id: "pair-2", symbol: "ETH/USDT", baseAsset: "ETH", quoteAsset: "USDT", price: 3450.25, volume24h: 840500000, makerFee: 0.1, takerFee: 0.1, status: "active" },
  { id: "pair-3", symbol: "SOL/USDT", baseAsset: "SOL", quoteAsset: "USDT", price: 142.80, volume24h: 320100000, makerFee: 0.1, takerFee: 0.15, status: "active" },
  { id: "pair-4", symbol: "XRP/USDT", baseAsset: "XRP", quoteAsset: "USDT", price: 0.58, volume24h: 150000000, makerFee: 0.1, takerFee: 0.1, status: "maintenance" },
  { id: "pair-5", symbol: "PEPE/USDT", baseAsset: "PEPE", quoteAsset: "USDT", price: 0.000008, volume24h: 45000000, makerFee: 0.2, takerFee: 0.2, status: "suspended" },
];

export default function AdminTradingPage() {
  const [pairs, setPairs] = useState<TradingPair[]>(MOCK_PAIRS);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  const filteredPairs = pairs.filter(p => {
    const matchesSearch = p.symbol.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || p.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const togglePairStatus = (id: string, currentStatus: PairStatus) => {
    setIsProcessing(id);
    setTimeout(() => {
      setPairs(prev => prev.map(p => 
        p.id === id ? { ...p, status: currentStatus === 'suspended' ? 'active' : 'suspended' } : p
      ));
      setIsProcessing(null);
    }, 1000);
  };

  const getStatusBadge = (status: PairStatus) => {
    switch(status) {
      case 'active': return <span className="flex items-center gap-1 text-xs font-medium text-green-500 bg-green-500/10 px-2 py-1 rounded-full border border-green-500/20"><CheckCircle className="w-3 h-3"/> Active</span>;
      case 'suspended': return <span className="flex items-center gap-1 text-xs font-medium text-red-500 bg-red-500/10 px-2 py-1 rounded-full border border-red-500/20"><PauseCircle className="w-3 h-3"/> Suspended</span>;
      case 'maintenance': return <span className="flex items-center gap-1 text-xs font-medium text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded-full border border-yellow-500/20"><Settings2 className="w-3 h-3"/> Maintenance</span>;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Activity className="w-6 h-6 text-brand-primary" /> Trading & Markets
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">Manage trading pairs, fees, and monitor matching engine health.</p>
        </div>
      </div>

      {/* Engine & Market KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-sm font-medium text-muted-foreground">24h Global Volume</span>
            <div className="p-2 rounded-md bg-blue-500/10">
              <TrendingUp className="w-4 h-4 text-blue-500" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <h3 className="text-2xl font-bold">{formatCurrency(2600000000)}</h3>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-sm font-medium text-muted-foreground">Matching Engine</span>
            <div className="p-2 rounded-md bg-green-500/10">
              <Server className="w-4 h-4 text-green-500" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-green-500">Operational</h3>
            <span className="text-xs text-muted-foreground font-medium">Latency: 12ms</span>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-sm font-medium text-muted-foreground">Active Pairs</span>
            <div className="p-2 rounded-md bg-purple-500/10">
              <ArrowRightLeft className="w-4 h-4 text-purple-500" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold">{pairs.filter(p => p.status === 'active').length}</h3>
            <span className="text-xs text-muted-foreground">Out of {pairs.length} total markets</span>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-sm font-medium text-muted-foreground">Order Book Depth</span>
            <div className="p-2 rounded-md bg-orange-500/10">
              <Layers className="w-4 h-4 text-orange-500" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold">{formatCurrency(450000000)}</h3>
            <span className="text-xs text-muted-foreground">Total platform liquidity</span>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-card border border-border rounded-xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search by Symbol (e.g. BTC/USDT)..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-background border border-border rounded-md pl-10 pr-4 py-2 text-sm focus:ring-1 focus:ring-brand-primary outline-none transition-shadow"
          />
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Filter className="w-4 h-4" />
            <span>Status:</span>
          </div>
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-background border border-border rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-brand-primary outline-none"
          >
            <option value="all">All Pairs</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>
      </div>

      {/* Trading Pairs Table */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium">Trading Pair</th>
                <th className="px-6 py-4 font-medium">Price</th>
                <th className="px-6 py-4 font-medium">24h Volume</th>
                <th className="px-6 py-4 font-medium text-center">Fees (Maker/Taker)</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredPairs.length > 0 ? (
                filteredPairs.map((pair) => (
                  <tr key={pair.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center font-bold text-xs">
                          {pair.baseAsset[0]}
                        </div>
                        <div>
                          <p className="font-bold text-foreground">{pair.symbol}</p>
                          <p className="text-xs text-muted-foreground">{pair.baseAsset} / {pair.quoteAsset}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-foreground">${pair.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-foreground">{formatCurrency(pair.volume24h)}</p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="px-2 py-1 bg-muted rounded text-xs font-medium">
                        {pair.makerFee}% / {pair.takerFee}%
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(pair.status)}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Button variant="outline" size="sm">
                        Edit Fees
                      </Button>
                      
                      {pair.status === 'suspended' ? (
                        <Button 
                          size="sm"
                          disabled={isProcessing === pair.id}
                          onClick={() => togglePairStatus(pair.id, pair.status)}
                          className="bg-green-500/10 text-green-500 hover:bg-green-500/20 hover:text-green-600"
                        >
                          {isProcessing === pair.id ? <Zap className="w-4 h-4 animate-spin" /> : <PlayCircle className="w-4 h-4 mr-1" />}
                          Resume
                        </Button>
                      ) : (
                        <Button 
                          variant="destructive" 
                          size="sm"
                          disabled={isProcessing === pair.id || pair.status === 'maintenance'}
                          onClick={() => togglePairStatus(pair.id, pair.status)}
                        >
                          {isProcessing === pair.id ? <Zap className="w-4 h-4 animate-spin" /> : <PauseCircle className="w-4 h-4 mr-1" />}
                          Suspend
                        </Button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <AlertTriangle className="w-8 h-8 text-muted-foreground/50" />
                      <p>No trading pairs found matching your search.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
