"use client";

import { useState, useEffect } from "react";
import { 
  Activity, TrendingUp, PauseCircle, PlayCircle, 
  Settings2, Search, Filter, AlertTriangle, CheckCircle,
  Zap, ArrowRightLeft, Layers, Server, RefreshCw, Plus, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiClient } from "@ethsltd/api-client";
import Link from "next/link";

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

export default function AdminTradingPage() {
  const [pairs, setPairs] = useState<TradingPair[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [apiLatency, setApiLatency] = useState<number | null>(null);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Add Market Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [addForm, setAddForm] = useState({
    baseAsset: '',
    quoteAsset: 'USDT',
    minPrice: '0.1',
    maxPrice: '100000',
    tickSize: '0.01',
    minAmount: '0.001',
    stepSize: '0.001'
  });

  useEffect(() => {
    loadMarkets();
  }, []);

  const loadMarkets = async () => {
    try {
      setIsLoading(true);
      const startTime = performance.now();
      const res = await apiClient.getMarkets();
      const endTime = performance.now();
      setApiLatency(Math.round(endTime - startTime));
      if (res && res.success && res.data) {
        setPairs(res.data.map((m: any) => ({
          id: m.symbol,
          symbol: m.symbol,
          baseAsset: m.baseAsset,
          quoteAsset: m.quoteAsset,
          price: m.price || 0,
          volume24h: m.volume24h || 0,
          makerFee: m.makerFee || 0.1,
          takerFee: m.takerFee || 0.1,
          status: m.status?.toLowerCase() === 'paused' ? 'suspended' : (m.status?.toLowerCase() || 'active'),
        })));
      }
    } catch (error) {
      console.error("Failed to load markets:", error);
      showToast("Failed to load markets from the server.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filteredPairs = pairs.filter(p => {
    const matchesSearch = p.symbol.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || p.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const togglePairStatus = async (id: string, currentStatus: PairStatus) => {
    setIsProcessing(id);
    const newStatusDb = currentStatus === 'suspended' ? 'ACTIVE' : 'PAUSED';
    const newStatusUi = currentStatus === 'suspended' ? 'active' : 'suspended';
    
    try {
      const res = await apiClient.adminUpdateMarketStatus(id, newStatusDb);
      if (res.success) {
        setPairs(prev => prev.map(p => p.id === id ? { ...p, status: newStatusUi } : p));
        showToast(`Market ${id} status updated to ${newStatusUi}.`);
      } else {
        throw new Error("Update failed");
      }
    } catch (err) {
      showToast(`Failed to update status for ${id}.`, "error");
    } finally {
      setIsProcessing(null);
    }
  };

  const handleAddMarket = async () => {
    if (!addForm.baseAsset || !addForm.quoteAsset) {
      showToast("Base and Quote assets are required", "error");
      return;
    }
    
    setIsAdding(true);
    const symbol = `${addForm.baseAsset.toUpperCase()}-${addForm.quoteAsset.toUpperCase()}`;
    
    try {
      const res = await apiClient.adminAddMarket({
        symbol,
        baseAsset: addForm.baseAsset.toUpperCase(),
        quoteAsset: addForm.quoteAsset.toUpperCase(),
        minPrice: addForm.minPrice,
        maxPrice: addForm.maxPrice,
        tickSize: addForm.tickSize,
        minAmount: addForm.minAmount,
        stepSize: addForm.stepSize
      });
      
      if (res.success && res.data) {
        showToast(`Market ${symbol} added successfully!`);
        setIsAddModalOpen(false);
        setAddForm({
          baseAsset: '', quoteAsset: 'USDT', minPrice: '0.1', maxPrice: '100000', tickSize: '0.01', minAmount: '0.001', stepSize: '0.001'
        });
        // Optimistically add to list
        const m = res.data as any;
        setPairs(prev => [{
          id: m.symbol,
          symbol: m.symbol,
          baseAsset: m.baseAsset,
          quoteAsset: m.quoteAsset,
          price: 0,
          volume24h: 0,
          makerFee: m.makerFee || 0,
          takerFee: m.takerFee || 0,
          status: 'active'
        }, ...prev]);
      } else {
        throw new Error("Failed to add market");
      }
    } catch (err: any) {
      showToast(err.message || "An error occurred while adding the market", "error");
    } finally {
      setIsAdding(false);
    }
  };

  const getStatusBadge = (status: PairStatus) => {
    switch(status) {
      case 'active': return <span className="flex items-center gap-1 text-xs font-medium text-green-500 bg-green-500/10 px-2 py-1 rounded-full border border-green-500/20 w-fit"><CheckCircle className="w-3 h-3"/> Active</span>;
      case 'suspended': return <span className="flex items-center gap-1 text-xs font-medium text-red-500 bg-red-500/10 px-2 py-1 rounded-full border border-red-500/20 w-fit"><PauseCircle className="w-3 h-3"/> Suspended</span>;
      case 'maintenance': return <span className="flex items-center gap-1 text-xs font-medium text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded-full border border-yellow-500/20 w-fit"><Settings2 className="w-3 h-3"/> Maintenance</span>;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 6 }).format(value) + ' USDT';
  };

  const totalVolume = pairs.reduce((sum, p) => sum + p.volume24h, 0);

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto relative">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`fixed bottom-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 ${
          toastMessage.type === 'success' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'
        }`}>
          {toastMessage.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
          <p className="font-medium text-sm">{toastMessage.text}</p>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Activity className="w-6 h-6 text-brand-primary" /> Trading & Markets
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">Manage trading pairs and monitor matching engine health.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Link href="/admin/fees">
            <Button variant="outline" className="flex items-center gap-2 w-full sm:w-auto">
              <Settings2 className="w-4 h-4" /> Global Fees
            </Button>
          </Link>
          <Button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2 w-full sm:w-auto">
            <Plus className="w-4 h-4" /> Add Market
          </Button>
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
            <h3 className="text-2xl font-bold">{formatCurrency(totalVolume || 0)}</h3>
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
            <span className="text-xs text-muted-foreground font-medium">
              Latency: {apiLatency !== null ? `${apiLatency}ms` : '...'}
            </span>
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
            <span className="text-sm font-medium text-muted-foreground">Total Markets</span>
            <div className="p-2 rounded-md bg-orange-500/10">
              <Layers className="w-4 h-4 text-orange-500" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold">{pairs.length}</h3>
            <span className="text-xs text-muted-foreground">Available trading pairs</span>
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
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <RefreshCw className="w-6 h-6 animate-spin text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">Loading trading markets...</p>
                  </td>
                </tr>
              ) : filteredPairs.length > 0 ? (
                filteredPairs.map((pair) => (
                  <tr key={pair.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center font-bold text-xs">
                          {pair.baseAsset?.[0] || '?'}
                        </div>
                        <div>
                          <p className="font-bold text-foreground">{pair.symbol}</p>
                          <p className="text-xs text-muted-foreground">{pair.baseAsset} / {pair.quoteAsset}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-foreground">{formatCurrency(pair.price || 0)}</p>
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

      {/* Add Market Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setIsAddModalOpen(false)} />
          <div className="relative w-full max-w-lg bg-card border border-border rounded-xl shadow-2xl p-6 md:p-8 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6 border-b border-border pb-4">
              <div>
                <h3 className="text-lg font-bold">Add New Trading Pair</h3>
                <p className="text-sm text-muted-foreground">Maker and taker fees will be automatically inherited from Global Fees.</p>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Base Asset</label>
                  <input 
                    type="text" 
                    placeholder="e.g. ADA"
                    value={addForm.baseAsset}
                    onChange={(e) => setAddForm({...addForm, baseAsset: e.target.value.toUpperCase()})}
                    className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-brand-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Quote Asset</label>
                  <input 
                    type="text" 
                    placeholder="e.g. USDT"
                    value={addForm.quoteAsset}
                    onChange={(e) => setAddForm({...addForm, quoteAsset: e.target.value.toUpperCase()})}
                    className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-brand-primary outline-none"
                  />
                </div>
              </div>
              
              <div className="bg-muted/50 p-3 rounded-lg border border-border text-center">
                <span className="text-xs text-muted-foreground">Trading Symbol</span>
                <p className="text-lg font-bold tracking-wider">{addForm.baseAsset || 'BASE'}-{addForm.quoteAsset || 'QUOTE'}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Min Price</label>
                  <input 
                    type="number" 
                    value={addForm.minPrice}
                    onChange={(e) => setAddForm({...addForm, minPrice: e.target.value})}
                    className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-brand-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Max Price</label>
                  <input 
                    type="number" 
                    value={addForm.maxPrice}
                    onChange={(e) => setAddForm({...addForm, maxPrice: e.target.value})}
                    className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-brand-primary outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Min Amount</label>
                  <input 
                    type="number" 
                    value={addForm.minAmount}
                    onChange={(e) => setAddForm({...addForm, minAmount: e.target.value})}
                    className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-brand-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Tick Size (Price Step)</label>
                  <input 
                    type="number" 
                    value={addForm.tickSize}
                    onChange={(e) => setAddForm({...addForm, tickSize: e.target.value})}
                    className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-brand-primary outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Step Size (Amount Step)</label>
                <input 
                  type="number" 
                  value={addForm.stepSize}
                  onChange={(e) => setAddForm({...addForm, stepSize: e.target.value})}
                  className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-brand-primary outline-none"
                />
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-border">
              <Button variant="outline" onClick={() => setIsAddModalOpen(false)} disabled={isAdding}>
                Cancel
              </Button>
              <Button onClick={handleAddMarket} disabled={isAdding}>
                {isAdding ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                Add Market
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
