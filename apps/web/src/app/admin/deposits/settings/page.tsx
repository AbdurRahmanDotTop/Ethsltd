"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@ethsltd/api-client";
import { toast } from "sonner";
import { Loader2, Save, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DepositSettingsPage() {
  const [settings, setSettings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  // State for manual addresses edit
  const [manualAddresses, setManualAddresses] = useState<{asset: string, address: string}[]>([]);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await apiClient.adminGetDepositSettings();
      if (res.success && res.data) {
        setSettings(res.data);
        const manual = res.data.find((m: any) => m.method === 'MANUAL');
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
    } catch (e: any) {
      toast.error(e.message || "Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleToggle = async (id: string, currentEnabled: boolean) => {
    setSaving(id);
    try {
      const res = await apiClient.adminUpdateDepositSettings(id, { enabled: !currentEnabled });
      if (res.success) {
        toast.success("Settings updated");
        setSettings(settings.map(s => s.id === id ? { ...s, enabled: !currentEnabled } : s));
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-5xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Deposit Settings</h2>
        <p className="text-muted-foreground mt-1 text-sm">Configure available deposit methods and manual crypto addresses.</p>
      </div>

      <div className="grid gap-6">
        {settings.map((method) => (
          <div key={method.id} className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
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
              
              <Button 
                variant={method.enabled ? "destructive" : "default"}
                onClick={() => handleToggle(method.id, method.enabled)}
                disabled={saving === method.id}
              >
                {saving === method.id && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {method.enabled ? 'Disable' : 'Enable'}
              </Button>
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
                        className="flex h-10 w-1/3 rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={item.asset}
                        onChange={(e) => {
                          const newAddrs = [...manualAddresses];
                          newAddrs[index].asset = e.target.value;
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
    </div>
  );
}
