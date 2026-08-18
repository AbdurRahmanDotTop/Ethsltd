"use client";

import { useState, useEffect } from "react";
import { 
  Wallet, Network, ArrowRightLeft, ShieldCheck, 
  AlertTriangle, RefreshCw, Lock, Unlock, HardDrive, 
  ArrowDownToLine, ArrowUpFromLine, Activity, Search, Edit2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiClient } from "@ethsltd/api-client";
import { useAdminEnvStore } from "@/stores/admin-env-store";

export default function AdminWalletsPage() {
  const [overview, setOverview] = useState<Record<string, any>>({});
  const [networks, setNetworks] = useState<any[]>([]);
  const [userWallets, setUserWallets] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [adjustingUser, setAdjustingUser] = useState<any>(null);
  const { adminMode, setAdminMode } = useAdminEnvStore();

  // Adjustment Modal State
  const [adjustAsset, setAdjustAsset] = useState("USDT");
  const [adjustType, setAdjustType] = useState<"REAL"|"DEMO">(adminMode);
  const [adjustAction, setAdjustAction] = useState<"CREDIT"|"DEBIT">("CREDIT");
  const [targetField, setTargetField] = useState<"balance"|"lockedBalance"|"escrowBalance">("balance");
  const [adjustAmount, setAdjustAmount] = useState("");
  const [adjustNotes, setAdjustNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [overviewRes, usersRes] = await Promise.all([
        apiClient.getAdminWalletsOverview(),
        apiClient.getAdminUserWalletsList(searchQuery)
      ]);

      if (overviewRes.success) {
        setOverview(overviewRes.data.overview);
        setNetworks(overviewRes.data.networks);
      }
      if (usersRes.success) {
        setUserWallets(usersRes.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    setAdjustType(adminMode);
  }, [adminMode]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadData();
  };

  const handleAdjustSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustingUser) return;
    setIsSubmitting(true);
    try {
      const res = await apiClient.adjustAdminUserWallet(adjustingUser.id, adjustAsset, adjustAmount, adjustType, adjustAction, targetField, adjustNotes);
      if (res.success) {
        alert("Balance adjusted successfully!");
        setAdjustingUser(null);
        setAdjustAmount("");
        setAdjustNotes("");
        loadData();
      } else {
        alert("Error: " + res.error);
      }
    } catch (err: any) {
      alert("Failed to adjust: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading && Object.keys(overview).length === 0) {
    return <div className="p-8 flex justify-center items-center min-h-[400px]"><RefreshCw className="w-8 h-8 animate-spin text-brand-primary" /></div>;
  }

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Wallet className="w-6 h-6 text-brand-primary" /> Wallets & Treasury
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">Monitor platform liquidity and manage user wallets.</p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" onClick={loadData}>
            <RefreshCw className="w-4 h-4 mr-2" /> Refresh Balances
          </Button>
        </div>
      </div>

      {/* Treasury KPIs (Real Data) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(overview).map(([symbol, data]: [string, any]) => (
          <div key={symbol} className="bg-card border border-border rounded-xl p-5 shadow-sm">
            <div className="flex justify-between items-start">
              <span className="text-sm font-medium text-muted-foreground">Total {symbol} Held</span>
              <div className="p-2 rounded-md bg-brand-500/10">
                <HardDrive className="w-4 h-4 text-brand-500" />
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-bold">{data.total.toLocaleString(undefined, {maximumFractionDigits: 4})}</h3>
              <div className="text-xs text-muted-foreground font-medium mt-1 flex flex-col gap-0.5">
                <span>Avail: {data.balance.toLocaleString(undefined, {maximumFractionDigits: 4})}</span>
                <span>Lock: {data.locked.toLocaleString(undefined, {maximumFractionDigits: 4})}</span>
                <span>P2P: {data.escrow.toLocaleString(undefined, {maximumFractionDigits: 4})}</span>
              </div>
            </div>
          </div>
        ))}
        {Object.keys(overview).length === 0 && (
          <div className="col-span-full p-8 text-center text-muted-foreground border border-dashed rounded-xl">
            No active balances found on the platform yet.
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* User Wallets Management */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <Wallet className="w-4 h-4" /> User Wallets Directory
            </h3>
            <form onSubmit={handleSearch} className="flex gap-2">
              <input 
                type="text" 
                placeholder="Search by Email or ID..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="bg-background border border-border rounded-md px-3 py-1.5 text-sm w-48 focus:outline-none focus:ring-1 focus:ring-brand-primary"
              />
              <Button type="submit" size="sm" variant="secondary"><Search className="w-4 h-4" /></Button>
            </form>
          </div>
          
          <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden divide-y divide-border">
            {userWallets.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">No users found.</div>
            ) : (
              userWallets.map(user => (
                <div key={user.id} className="p-4 flex flex-col sm:flex-row justify-between gap-4 hover:bg-muted/30 transition-colors">
                  <div>
                    <h4 className="font-semibold text-foreground">{user.displayName || 'Unknown User'}</h4>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                    <p className="text-xs text-muted-foreground font-mono mt-1 opacity-70">ID: {user.id}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    {user.wallets && user.wallets.length > 0 ? (
                      user.wallets.map((w: any) => (
                        <div key={w.id} className="flex items-center justify-end gap-3 text-sm">
                          <span className="font-bold text-brand-primary w-12 text-right">{w.assetSymbol}</span>
                          <span className="w-24 text-right">{parseFloat(w.balance).toFixed(2)}</span>
                          <span className="text-xs text-muted-foreground w-16 text-right">(Lock: {parseFloat(w.lockedBalance).toFixed(1)})</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-muted-foreground text-right italic">No active wallets</div>
                    )}
                    <div className="flex justify-end mt-2">
                       <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => setAdjustingUser(user)}>
                         <Edit2 className="w-3 h-3 mr-1" /> Manage Balances
                       </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Network & Node Status */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <Network className="w-4 h-4" /> Deposit Networks
          </h3>
          <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden divide-y divide-border">
            {networks.map((net) => (
              <div key={net.id} className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors">
                <div>
                  <h4 className="text-sm font-semibold text-foreground">{net.name}</h4>
                  <p className="text-xs text-muted-foreground uppercase mt-0.5">{net.currency} • {net.type}</p>
                </div>
                <div>
                  {net.enabled ? (
                    <span className="flex items-center gap-1 text-xs font-medium text-green-500 bg-green-500/10 px-2 py-1 rounded-full border border-green-500/20"><ShieldCheck className="w-3 h-3"/> Active</span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs font-medium text-red-500 bg-red-500/10 px-2 py-1 rounded-full border border-red-500/20"><Lock className="w-3 h-3"/> Disabled</span>
                  )}
                </div>
              </div>
            ))}
            {networks.length === 0 && <div className="p-4 text-sm text-center text-muted-foreground">No networks configured.</div>}
          </div>
        </div>
      </div>

      {/* Adjust Modal */}
      {adjustingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-md p-6 relative">
            <button onClick={() => setAdjustingUser(null)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">✕</button>
            <h2 className="text-xl font-bold mb-1">Adjust Wallet Balance</h2>
            <p className="text-sm text-muted-foreground mb-6">User: {adjustingUser.email}</p>
            
            <form onSubmit={handleAdjustSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Asset</label>
                  <input type="text" value={adjustAsset} onChange={e => setAdjustAsset(e.target.value.toUpperCase())} className="w-full bg-background border border-border rounded px-3 py-2 text-sm" placeholder="USDT" required />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Wallet Type</label>
                  <select value={adjustType} onChange={e => setAdjustType(e.target.value as any)} className="w-full bg-background border border-border rounded px-3 py-2 text-sm">
                    <option value="REAL">REAL</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Target Field</label>
                  <select value={targetField} onChange={e => setTargetField(e.target.value as any)} className="w-full bg-background border border-border rounded px-3 py-2 text-sm">
                    <option value="balance">Available Balance</option>
                    <option value="lockedBalance">Locked (Spot)</option>
                    <option value="escrowBalance">Escrow (P2P)</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Action</label>
                  <select value={adjustAction} onChange={e => setAdjustAction(e.target.value as any)} className="w-full bg-background border border-border rounded px-3 py-2 text-sm">
                    <option value="CREDIT">CREDIT (+)</option>
                    <option value="DEBIT">DEBIT (-)</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Amount</label>
                <input type="number" min="0" step="0.000001" value={adjustAmount} onChange={e => setAdjustAmount(e.target.value)} className="w-full bg-background border border-border rounded px-3 py-2 text-sm" placeholder="100.00" required />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Notes / Reason (Visible to user)</label>
                <input type="text" value={adjustNotes} onChange={e => setAdjustNotes(e.target.value)} className="w-full bg-background border border-border rounded px-3 py-2 text-sm" placeholder="e.g. Dispute #123 resolution, Correction" required />
              </div>
              <Button type="submit" className="w-full mt-2" disabled={isSubmitting}>
                {isSubmitting ? 'Processing...' : 'Confirm Adjustment'}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
