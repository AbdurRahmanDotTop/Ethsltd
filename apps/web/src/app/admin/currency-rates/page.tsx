"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Activity, Power, PowerOff, Save, X, History, Trash2 } from "lucide-react";

type CurrencyRate = {
  code: string;
  name: string;
  symbol: string;
  ratePerUsdt: string;
  decimalPrecision: number;
  status: 'ACTIVE' | 'INACTIVE';
  lastUpdated: string;
  updatedBy: string;
};

type RateHistory = {
  id: string;
  previousRate: string | null;
  newRate: string;
  changedByEmail: string;
  changedAt: string;
};

export default function CurrencyRatesAdminPage() {
  const [rates, setRates] = useState<CurrencyRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  
  // Selected
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyRate | null>(null);
  const [historyData, setHistoryData] = useState<RateHistory[]>([]);
  
  // Forms
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    symbol: '',
    ratePerUsdt: '',
    decimalPrecision: 2,
    status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE'
  });

  const fetchRates = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/v1/admin/currency-rates', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setRates(data.data);
      } else {
        setError(data.error);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
  }, []);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/v1/admin/currency-rates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        setIsAddModalOpen(false);
        fetchRates();
      } else {
        alert(data.error);
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCurrency) return;
    try {
      const res = await fetch(`/api/v1/admin/currency-rates/${selectedCurrency.code}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          name: formData.name,
          symbol: formData.symbol,
          ratePerUsdt: formData.ratePerUsdt,
          decimalPrecision: formData.decimalPrecision
        })
      });
      const data = await res.json();
      if (data.success) {
        setIsEditModalOpen(false);
        fetchRates();
      } else {
        alert(data.error);
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const toggleStatus = async (code: string, currentStatus: string) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    if (!confirm(`Are you sure you want to mark ${code} as ${newStatus}?`)) return;
    
    try {
      const res = await fetch(`/api/v1/admin/currency-rates/${code}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        fetchRates();
      } else {
        alert(data.error);
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const openHistory = async (code: string) => {
    try {
      const res = await fetch(`/api/v1/admin/currency-rates/${code}/history`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setHistoryData(data.data);
        setIsHistoryModalOpen(true);
      } else {
        alert(data.error);
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const openEdit = (rate: CurrencyRate) => {
    setSelectedCurrency(rate);
    setFormData({
      code: rate.code,
      name: rate.name,
      symbol: rate.symbol,
      ratePerUsdt: rate.ratePerUsdt,
      decimalPrecision: rate.decimalPrecision,
      status: rate.status
    });
    setIsEditModalOpen(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Global Currency Rates</h1>
          <p className="text-muted-foreground text-sm">Manage fiat equivalent rates for platform calculations</p>
        </div>
        <button 
          onClick={() => {
            setFormData({ code: '', name: '', symbol: '', ratePerUsdt: '', decimalPrecision: 2, status: 'ACTIVE' });
            setIsAddModalOpen(true);
          }}
          className="bg-brand-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-brand-primary/90 flex items-center gap-2"
        >
          <Plus size={16} />
          Add Currency
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : error ? (
        <div className="text-red-500 bg-red-50 p-4 rounded-md">{error}</div>
      ) : (
        <div className="bg-card border rounded-lg overflow-hidden shadow-sm">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Currency</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Rate (per USDT)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Last Updated</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rates.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">No currency rates configured.</td>
                </tr>
              ) : (
                rates.map((rate) => (
                  <tr key={rate.code} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="w-8 h-8 flex items-center justify-center bg-muted rounded-full font-bold text-sm">
                          {rate.symbol}
                        </span>
                        <span className="font-medium">{rate.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-muted-foreground">
                      {rate.code}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-mono">
                      {parseFloat(rate.ratePerUsdt).toFixed(rate.decimalPrecision)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        rate.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {rate.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {new Date(rate.lastUpdated).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => openEdit(rate)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                          title="Edit Rate"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => toggleStatus(rate.code, rate.status)}
                          className={`p-1.5 rounded ${rate.status === 'ACTIVE' ? 'text-red-600 hover:bg-red-50' : 'text-green-600 hover:bg-green-50'}`}
                          title={rate.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                        >
                          {rate.status === 'ACTIVE' ? <PowerOff size={16} /> : <Power size={16} />}
                        </button>
                        <button 
                          onClick={() => openHistory(rate.code)}
                          className="p-1.5 text-gray-600 hover:bg-gray-100 rounded"
                          title="View History"
                        >
                          <History size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card w-full max-w-md rounded-lg shadow-xl overflow-hidden border">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="font-semibold text-lg">Add Currency</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddSubmit} className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium">Currency Code</label>
                  <input required type="text" placeholder="e.g. INR" className="w-full border rounded-md px-3 py-2 uppercase" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})} />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Symbol</label>
                  <input required type="text" placeholder="e.g. ₹" className="w-full border rounded-md px-3 py-2" value={formData.symbol} onChange={e => setFormData({...formData, symbol: e.target.value})} />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Currency Name</label>
                <input required type="text" placeholder="e.g. Indian Rupee" className="w-full border rounded-md px-3 py-2" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Rate per 1 USDT</label>
                <input required type="number" step="any" placeholder="e.g. 98.80" className="w-full border rounded-md px-3 py-2 font-mono" value={formData.ratePerUsdt} onChange={e => setFormData({...formData, ratePerUsdt: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Decimal Precision</label>
                <select className="w-full border rounded-md px-3 py-2" value={formData.decimalPrecision} onChange={e => setFormData({...formData, decimalPrecision: parseInt(e.target.value)})}>
                  <option value={0}>0</option>
                  <option value={2}>2</option>
                  <option value={4}>4</option>
                  <option value={6}>6</option>
                  <option value={8}>8</option>
                </select>
              </div>
              <div className="pt-4 flex justify-end gap-2">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 border rounded-md">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-brand-primary text-primary-foreground rounded-md flex items-center gap-2">
                  <Save size={16} /> Save Currency
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card w-full max-w-md rounded-lg shadow-xl overflow-hidden border">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="font-semibold text-lg">Edit {selectedCurrency?.code}</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="p-4 space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium">Rate per 1 USDT</label>
                <input required type="number" step="any" className="w-full border rounded-md px-3 py-2 font-mono" value={formData.ratePerUsdt} onChange={e => setFormData({...formData, ratePerUsdt: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Currency Name</label>
                <input required type="text" className="w-full border rounded-md px-3 py-2" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Symbol</label>
                <input required type="text" className="w-full border rounded-md px-3 py-2" value={formData.symbol} onChange={e => setFormData({...formData, symbol: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Decimal Precision</label>
                <select className="w-full border rounded-md px-3 py-2" value={formData.decimalPrecision} onChange={e => setFormData({...formData, decimalPrecision: parseInt(e.target.value)})}>
                  <option value={0}>0</option>
                  <option value={2}>2</option>
                  <option value={4}>4</option>
                  <option value={6}>6</option>
                  <option value={8}>8</option>
                </select>
              </div>
              <div className="pt-4 flex justify-end gap-2">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 border rounded-md">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-brand-primary text-primary-foreground rounded-md flex items-center gap-2">
                  <Save size={16} /> Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* History Modal */}
      {isHistoryModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card w-full max-w-2xl rounded-lg shadow-xl overflow-hidden border">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="font-semibold text-lg">Rate History</h3>
              <button onClick={() => setIsHistoryModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X size={20} />
              </button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto">
              <table className="w-full">
                <thead className="bg-muted sticky top-0">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase">Date</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase">Old Rate</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase">New Rate</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase">Updated By</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {historyData.length === 0 ? (
                    <tr><td colSpan={4} className="p-4 text-center text-muted-foreground">No history found.</td></tr>
                  ) : (
                    historyData.map(h => (
                      <tr key={h.id} className="hover:bg-muted/30">
                        <td className="px-4 py-3 text-sm">{new Date(h.changedAt).toLocaleString()}</td>
                        <td className="px-4 py-3 text-sm font-mono text-muted-foreground">{h.previousRate || '—'}</td>
                        <td className="px-4 py-3 text-sm font-mono font-medium">{h.newRate}</td>
                        <td className="px-4 py-3 text-sm">{h.changedByEmail || 'Unknown'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
