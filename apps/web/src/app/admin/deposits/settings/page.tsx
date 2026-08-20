"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@ethsltd/api-client";
import { toast } from "sonner";
import { Loader2, Save, Plus, Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DepositSettingsPage() {
  const [settings, setSettings] = useState<any[]>([]);
  const [bankAccounts, setBankAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'METHODS' | 'BANK_ACCOUNTS'>('METHODS');

  // State for manual addresses edit
  const [manualAddresses, setManualAddresses] = useState<{asset: string, address: string}[]>([]);
  
  // State for bank account form
  const [editingBank, setEditingBank] = useState<any | null>(null);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [resSettings, resBanks] = await Promise.all([
        apiClient.adminGetDepositSettings(),
        apiClient.adminGetBankAccounts()
      ]);

      if (resSettings.success && resSettings.data) {
        setSettings(resSettings.data);
        const manual = resSettings.data.find((m: any) => m.method === 'MANUAL');
        if (manual && manual.instructions) {
          try {
            const parsed = JSON.parse(manual.instructions);
            const formatted = Object.keys(parsed).map(key => ({ asset: key, address: parsed[key] }));
            setManualAddresses(formatted);
          } catch (e) {
            console.error("Failed to parse manual instructions");
          }
        }
      }
      if (resBanks.success && resBanks.data) {
        setBankAccounts(resBanks.data);
      }
    } catch (e: any) {
      toast.error(e.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleUpdateMethod = async (id: string, updates: any) => {
    setSaving(id);
    try {
      const res = await apiClient.adminUpdateDepositSettings(id, updates);
      if (res.success) {
        toast.success("Settings updated");
        setSettings(settings.map(s => s.id === id ? { ...s, ...updates } : s));
      } else {
        toast.error(res.error || "Failed to update");
      }
    } catch (e: any) {
      toast.error(e.message || "An error occurred");
    } finally {
      setSaving(null);
    }
  };

  const saveManualAddresses = async (id: string) => {
    setSaving(id);
    try {
      const instructionsObj: Record<string, string> = {};
      manualAddresses.forEach(item => {
        if (item.asset.trim() && item.address.trim()) {
          instructionsObj[item.asset.trim().toUpperCase()] = item.address.trim();
        }
      });
      const instructionsString = JSON.stringify(instructionsObj);
      
      const res = await apiClient.adminUpdateDepositSettings(id, { instructions: instructionsString });
      if (res.success) {
        toast.success("Manual addresses updated successfully");
      } else {
        toast.error(res.error || "Failed to update addresses");
      }
    } catch (e: any) {
      toast.error(e.message || "An error occurred");
    } finally {
      setSaving(null);
    }
  };

  const handleSaveBank = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving('BANK_FORM');
    try {
      if (editingBank.id) {
        const res = await apiClient.adminUpdateBankAccount(editingBank.id, editingBank);
        if (res.success) {
          toast.success("Bank account updated");
          setBankAccounts(bankAccounts.map(b => b.id === editingBank.id ? { ...b, ...editingBank } : b));
          setEditingBank(null);
        } else toast.error(res.error);
      } else {
        const res = await apiClient.adminCreateBankAccount(editingBank);
        if (res.success) {
          toast.success("Bank account added");
          setBankAccounts([...bankAccounts, { ...editingBank, id: res.data.id }]);
          setEditingBank(null);
        } else toast.error(res.error);
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(null);
    }
  };

  const handleDeleteBank = async (id: string) => {
    if (!confirm("Are you sure you want to delete this bank account?")) return;
    try {
      const res = await apiClient.adminDeleteBankAccount(id);
      if (res.success) {
        toast.success("Bank account deleted");
        setBankAccounts(bankAccounts.filter(b => b.id !== id));
      } else toast.error(res.error);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-6xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Deposit Settings</h2>
        <p className="text-muted-foreground mt-1 text-sm">Configure deposit methods, fees, limits, and bank accounts.</p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-border pb-px">
        <button 
          onClick={() => setActiveTab('METHODS')}
          className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors ${activeTab === 'METHODS' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'}`}
        >
          Deposit Methods & Limits
        </button>
        <button 
          onClick={() => setActiveTab('BANK_ACCOUNTS')}
          className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors ${activeTab === 'BANK_ACCOUNTS' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'}`}
        >
          Bank Accounts Management
        </button>
      </div>

      {activeTab === 'METHODS' && (
        <div className="grid gap-6">
          {settings.map((method) => (
            <div key={method.id} className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    {method.method === 'AUTO' ? 'Auto Deposit (Cregis)' : 
                     method.method === 'MANUAL' ? 'Manual Crypto Deposit' : 
                     method.method === 'BANK_TRANSFER' ? 'Direct Bank Transfer' : method.method}
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${method.enabled ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                      {method.enabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {method.method === 'AUTO' && "Automated crypto deposits via Cregis payment gateway."}
                    {method.method === 'MANUAL' && "Manual crypto deposits where users send to a specified address and upload proof."}
                    {method.method === 'BANK_TRANSFER' && "Fiat deposits via direct bank transfer."}
                  </p>
                </div>
                
                <div className="flex items-center gap-3">
                  <Button 
                    variant={method.maintenance_mode ? "default" : "secondary"}
                    onClick={() => handleUpdateMethod(method.id, { maintenance_mode: !method.maintenance_mode })}
                    disabled={saving === method.id}
                  >
                    {method.maintenance_mode ? 'End Maintenance' : 'Maintenance Mode'}
                  </Button>
                  <Button 
                    variant={method.enabled ? "destructive" : "default"}
                    onClick={() => handleUpdateMethod(method.id, { enabled: !method.enabled })}
                    disabled={saving === method.id}
                  >
                    {saving === method.id && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    {method.enabled ? 'Disable' : 'Enable'}
                  </Button>
                </div>
              </div>

              {/* Configurations */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-muted/30 p-4 rounded-lg border border-border">
                 <div>
                   <label className="text-xs font-medium text-muted-foreground block mb-1">Min Amount</label>
                   <div className="flex gap-2">
                     <input 
                       type="number" 
                       className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                       defaultValue={method.min_amount}
                       onBlur={(e) => handleUpdateMethod(method.id, { min_amount: parseFloat(e.target.value) })}
                     />
                   </div>
                 </div>
                 <div>
                   <label className="text-xs font-medium text-muted-foreground block mb-1">Max Amount</label>
                   <div className="flex gap-2">
                     <input 
                       type="number" 
                       className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                       defaultValue={method.max_amount || ''}
                       placeholder="No Limit"
                       onBlur={(e) => handleUpdateMethod(method.id, { max_amount: e.target.value ? parseFloat(e.target.value) : null })}
                     />
                   </div>
                 </div>
                 <div>
                   <label className="text-xs font-medium text-muted-foreground block mb-1">Fee Type</label>
                   <select 
                     className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                     value={method.fee_type}
                     onChange={(e) => handleUpdateMethod(method.id, { fee_type: e.target.value })}
                   >
                     <option value="ZERO">Zero Fee</option>
                     <option value="FIXED">Fixed Amount</option>
                     <option value="PERCENTAGE">Percentage (%)</option>
                   </select>
                 </div>
                 <div>
                   <label className="text-xs font-medium text-muted-foreground block mb-1">Fee Value</label>
                   <input 
                     type="number" 
                     className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                     defaultValue={method.fee_value}
                     onBlur={(e) => handleUpdateMethod(method.id, { fee_value: parseFloat(e.target.value) })}
                     disabled={method.fee_type === 'ZERO'}
                   />
                 </div>
              </div>

              {/* Manual Crypto Deposit Addresses Configuration */}
              {method.method === 'MANUAL' && (
                <div className="mt-6 pt-6 border-t border-border">
                  <h4 className="font-medium mb-4">Supported Crypto Assets & Addresses</h4>
                  
                  <div className="space-y-3 mb-4">
                    {manualAddresses.map((item, index) => (
                      <div key={index} className="flex gap-2">
                        <input 
                          type="text" 
                          placeholder="Asset (e.g. USDT)" 
                          className="flex h-10 w-1/3 rounded-md border border-input bg-background px-3 py-2 text-sm uppercase"
                          value={item.asset}
                          onChange={(e) => {
                            const newAddrs = [...manualAddresses];
                            newAddrs[index].asset = e.target.value.toUpperCase();
                            setManualAddresses(newAddrs);
                          }}
                        />
                        <input 
                          type="text" 
                          placeholder="Wallet Address" 
                          className="flex h-10 flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm font-mono"
                          value={item.address}
                          onChange={(e) => {
                            const newAddrs = [...manualAddresses];
                            newAddrs[index].address = e.target.value;
                            setManualAddresses(newAddrs);
                          }}
                        />
                        <Button variant="ghost" size="icon" onClick={() => {
                          const newAddrs = [...manualAddresses];
                          newAddrs.splice(index, 1);
                          setManualAddresses(newAddrs);
                        }}>
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setManualAddresses([...manualAddresses, { asset: '', address: '' }])}>
                      <Plus className="w-4 h-4 mr-2" /> Add Asset
                    </Button>
                    <Button onClick={() => saveManualAddresses(method.id)} disabled={saving === method.id}>
                      {saving === method.id ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                      Save Addresses
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {activeTab === 'BANK_ACCOUNTS' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-lg">Fiat Bank Accounts</h3>
            <Button onClick={() => setEditingBank({ active: true, default_account: false })}>
              <Plus className="w-4 h-4 mr-2" /> Add Bank Account
            </Button>
          </div>

          {editingBank && (
            <form onSubmit={handleSaveBank} className="bg-card border border-border p-6 rounded-xl space-y-4 shadow-sm relative">
              <h4 className="font-medium text-lg">{editingBank.id ? 'Edit' : 'Add'} Bank Account</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">Bank Name *</label>
                  <input required className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={editingBank.bank_name || ''} onChange={e => setEditingBank({...editingBank, bank_name: e.target.value})} />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">Account Holder Name *</label>
                  <input required className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={editingBank.account_holder || ''} onChange={e => setEditingBank({...editingBank, account_holder: e.target.value})} />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">Account Number *</label>
                  <input required className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={editingBank.account_number || ''} onChange={e => setEditingBank({...editingBank, account_number: e.target.value})} />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">Currency (e.g. INR) *</label>
                  <input required className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm uppercase" value={editingBank.currency || ''} onChange={e => setEditingBank({...editingBank, currency: e.target.value.toUpperCase()})} />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">IFSC / Routing Number</label>
                  <input className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={editingBank.ifsc || ''} onChange={e => setEditingBank({...editingBank, ifsc: e.target.value})} />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">SWIFT / BIC</label>
                  <input className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={editingBank.swift || ''} onChange={e => setEditingBank({...editingBank, swift: e.target.value})} />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">Branch</label>
                  <input className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={editingBank.branch || ''} onChange={e => setEditingBank({...editingBank, branch: e.target.value})} />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">Country</label>
                  <input className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={editingBank.country || ''} onChange={e => setEditingBank({...editingBank, country: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">Deposit Instructions / Notes for Users</label>
                <textarea className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[80px]" value={editingBank.instructions || ''} onChange={e => setEditingBank({...editingBank, instructions: e.target.value})} />
              </div>
              <div className="flex gap-6 items-center pt-2">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={editingBank.active} onChange={e => setEditingBank({...editingBank, active: e.target.checked})} />
                  Active
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={editingBank.default_account} onChange={e => setEditingBank({...editingBank, default_account: e.target.checked})} />
                  Default Account
                </label>
              </div>
              <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={saving === 'BANK_FORM'}>
                  {saving === 'BANK_FORM' ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  Save Account
                </Button>
                <Button type="button" variant="ghost" onClick={() => setEditingBank(null)}>Cancel</Button>
              </div>
            </form>
          )}

          <div className="grid gap-4">
            {bankAccounts.length === 0 && !editingBank && (
              <div className="text-center text-muted-foreground p-8 bg-card border border-border rounded-xl">
                No bank accounts added yet.
              </div>
            )}
            {bankAccounts.map(bank => (
              <div key={bank.id} className={`p-4 rounded-xl border ${bank.active ? 'border-border bg-card shadow-sm' : 'border-dashed bg-muted/30 border-muted-foreground/30'} flex flex-col md:flex-row justify-between gap-4`}>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-lg">{bank.bank_name}</h4>
                    {bank.default_account && <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-primary text-primary-foreground">Default</span>}
                    {!bank.active && <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-muted-foreground/20 text-muted-foreground">Inactive</span>}
                  </div>
                  <p className="text-sm">Holder: <span className="font-medium text-foreground">{bank.account_holder}</span></p>
                  <p className="text-sm text-muted-foreground font-mono mt-1">{bank.account_number} <span className="ml-2 font-sans font-bold text-primary">{bank.currency}</span></p>
                </div>
                <div className="flex items-center gap-2 self-start md:self-center">
                  <Button variant="outline" size="sm" onClick={() => setEditingBank(bank)}>
                    <Edit className="w-4 h-4 mr-2" /> Edit
                  </Button>
                  <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => handleDeleteBank(bank.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
