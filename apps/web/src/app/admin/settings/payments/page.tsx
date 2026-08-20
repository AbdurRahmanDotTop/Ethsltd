"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { apiClient } from "@ethsltd/api-client";
import { Loader2 } from "lucide-react";

export default function AdminPaymentSettingsPage() {
  const [methods, setMethods] = useState<any[]>([]);
  const [currencyRates, setCurrencyRates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Edit Method State
  const [editingMethod, setEditingMethod] = useState<any | null>(null);
  const [editInstructions, setEditInstructions] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  
  // Crypto Addresses Builder State (for both Add and Edit)
  const [cryptoAddresses, setCryptoAddresses] = useState<{asset: string, address: string}[]>([{ asset: "USDT", address: "" }]);

  // Add Method State
  const [isAddMethodModalOpen, setIsAddMethodModalOpen] = useState(false);
  const [addMethodForm, setAddMethodForm] = useState({
    method: "MANUAL",
    enabled: true,
    min_amount: 10,
    fee_type: "ZERO",
    fee_value: 0,
    display_order: 1,
    instructions: "{}"
  });

  // Dynamic Bank Accounts State (for BANK_TRANSFER method)
  const [bankAccountsList, setBankAccountsList] = useState<any[]>([]);
  const [editingBankIndex, setEditingBankIndex] = useState<number | null>(null);
  const [isBankModalOpen, setIsBankModalOpen] = useState(false);
  const [bankForm, setBankForm] = useState({
    id: "",
    bank_name: "",
    account_holder: "",
    account_number: "",
    currency: "USD",
    ifsc: "",
    swift: "",
    branch: "",
    instructions: ""
  });

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const [resSettings, resRates] = await Promise.all([
        apiClient.adminGetDepositSettings(),
        
        apiClient.adminGetCurrencyRates()
      ]);
      
      if (resSettings.success && resSettings.data) {
        setMethods(resSettings.data || []);
      }
      
      if (resRates.success && resRates.data) {
        setCurrencyRates(resRates.data || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleEditMethod = (method: any) => {
    setEditingMethod(method);
    // Format JSON if it is MANUAL to map to dynamic inputs
    if (method.method === 'MANUAL' && method.instructions) {
      try {
        const parsed = JSON.parse(method.instructions);
        const entries = Object.entries(parsed).map(([asset, address]) => ({ asset, address: address as string }));
        if (entries.length > 0) {
          setCryptoAddresses(entries);
        } else {
          setCryptoAddresses([{ asset: "USDT", address: "" }]);
        }
      } catch (e) {
        setCryptoAddresses([{ asset: "USDT", address: "" }]);
      }
    } else if (method.method === 'BANK_TRANSFER' && method.instructions) {
      try {
        const parsed = JSON.parse(method.instructions);
        if (Array.isArray(parsed)) {
          setBankAccountsList(parsed);
        } else {
          setBankAccountsList([]);
        }
      } catch (e) {
        setBankAccountsList([]);
      }
    } else {
      setEditInstructions(method.instructions || "");
      setBankAccountsList([]);
    }
  };

  const handleSaveMethod = async () => {
    if (!editingMethod) return;
    setIsSaving(true);
    try {
      const token = localStorage.getItem("ethsltd_auth_token");
      let finalInstructions = editInstructions;
      
      // If MANUAL, build the JSON object from the dynamic inputs
      if (editingMethod.method === 'MANUAL') {
        const obj: Record<string, string> = {};
        cryptoAddresses.forEach(item => {
          if (item.asset.trim() && item.address.trim()) {
            obj[item.asset.trim()] = item.address.trim();
          }
        });
        if (Object.keys(obj).length === 0) {
          toast.error("Please add at least one valid crypto asset and address.");
          setIsSaving(false);
          return;
        }
        finalInstructions = JSON.stringify(obj);
      } else if (editingMethod.method === 'BANK_TRANSFER') {
        finalInstructions = JSON.stringify(bankAccountsList);
      }

      const res = await apiClient.adminUpdateDepositSettings(editingMethod.id, { 
        instructions: finalInstructions,
        enabled: editingMethod.enabled,
        min_amount: editingMethod.min_amount
      });

      if (res.success) {
        toast.success("Payment method updated!");
        setEditingMethod(null);
        fetchSettings();
      } else {
        toast.error(res.error || "Failed to update");
      }
    } catch (e: any) {
      toast.error(e.message || "Error saving");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteMethod = async (methodId: string) => {
    if (!confirm("Are you sure you want to delete this payment method?")) return;
    try {
      const res = await apiClient.adminDeleteDepositSettings(methodId);
      if (res.success) {
        toast.success("Payment method deleted");
        fetchSettings();
      } else {
        toast.error(res.error || "Failed to delete");
      }
    } catch (e: any) {
      toast.error(e.message || "Error deleting");
    }
  };

  const handleAddMethod = async () => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem("ethsltd_auth_token");
      
      let finalAddMethodForm = { ...addMethodForm };
      
      if (addMethodForm.method === 'MANUAL') {
        const obj: Record<string, string> = {};
        cryptoAddresses.forEach(item => {
          if (item.asset.trim() && item.address.trim()) {
            obj[item.asset.trim()] = item.address.trim();
          }
        });
        if (Object.keys(obj).length === 0) {
          toast.error("Please add at least one valid crypto asset and address.");
          setIsSaving(false);
          return;
        }
        finalAddMethodForm.instructions = JSON.stringify(obj);
      } else if (addMethodForm.method === 'BANK_TRANSFER') {
        finalAddMethodForm.instructions = JSON.stringify(bankAccountsList);
      }

      const res = await apiClient.adminCreateDepositSettings(finalAddMethodForm);

      if (res.success) {
        toast.success("Payment method added!");
        setIsAddMethodModalOpen(false);
        fetchSettings();
      } else {
        toast.error(res.error || "Failed to add method");
      }
    } catch (e: any) {
      toast.error(e.message || "Error adding method");
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenBankModal = (index: number | null = null) => {
    if (index !== null) {
      setEditingBankIndex(index);
      setBankForm({ ...bankAccountsList[index] });
    } else {
      setEditingBankIndex(null);
      setBankForm({ id: crypto.randomUUID(), bank_name: "", account_holder: "", account_number: "", currency: "USD", ifsc: "", swift: "", branch: "", instructions: "" });
    }
    setIsBankModalOpen(true);
  };

  const handleSaveBankToLocalList = () => {
    if (!bankForm.bank_name || !bankForm.account_number) return;
    const newList = [...bankAccountsList];
    if (editingBankIndex !== null) {
      newList[editingBankIndex] = bankForm;
    } else {
      newList.push(bankForm);
    }
    setBankAccountsList(newList);
    setIsBankModalOpen(false);
  };

  const handleDeleteBankFromLocalList = (index: number) => {
    if (!confirm("Are you sure you want to remove this bank account?")) return;
    const newList = [...bankAccountsList];
    newList.splice(index, 1);
    setBankAccountsList(newList);
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-5xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Payment Settings</h2>
        <p className="text-muted-foreground mt-1 text-sm">Configure deposit methods and bank accounts.</p>
      </div>

      <div className="space-y-6">
        <div className="flex justify-between items-center flex-wrap gap-y-4">
          <h3 className="text-xl font-semibold">Payment Methods</h3>
          <Button onClick={() => {
            setCryptoAddresses([{ asset: "USDT", address: "" }]);
            setAddMethodForm({ ...addMethodForm, method: "MANUAL", instructions: "" });
            setIsAddMethodModalOpen(true);
          }}>Add Method</Button>
        </div>
        {loading ? <p>Loading...</p> : methods.map(method => (
          <div key={method.id} className="p-4 border border-border rounded-lg bg-card flex justify-between items-center flex-wrap gap-y-4">
            <div>
              <h4 className="font-semibold">{method.method}</h4>
              <p className="text-sm text-muted-foreground">Status: {method.enabled ? "Enabled" : "Disabled"}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => handleEditMethod(method)}>Edit</Button>
              <Button variant="destructive" onClick={() => handleDeleteMethod(method.id)}>Delete</Button>
            </div>
          </div>
        ))}
        {methods.length === 0 && !loading && (
          <div className="p-4 border border-border rounded-lg bg-muted text-center text-sm">
            No payment methods configured yet.
          </div>
        )}
      </div>



      {/* Edit Method Modal */}
      <Dialog open={!!editingMethod} onOpenChange={(open) => !open && setEditingMethod(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit {editingMethod?.method} Settings</DialogTitle>
            <DialogDescription>
              {editingMethod?.method === 'MANUAL' 
                ? "Provide a JSON object mapping asset symbols to wallet addresses. Example: {\"USDT\": \"0x123...\"}"
                : "Update instructions for this payment method."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                id="edit-enabled"
                checked={editingMethod?.enabled || false}
                onChange={e => setEditingMethod({...editingMethod, enabled: e.target.checked})}
                className="w-4 h-4"
              />
              <Label htmlFor="edit-enabled">Enabled (Show to users)</Label>
            </div>
            
            <div className="space-y-2">
              <Label>Minimum Deposit Amount (USD)</Label>
              <Input 
                type="number"
                value={editingMethod?.min_amount || 0}
                onChange={e => setEditingMethod({...editingMethod, min_amount: parseFloat(e.target.value) || 0})}
              />
            </div>

            <div className="space-y-2">
              <Label>{editingMethod?.method === 'MANUAL' ? "Crypto Wallets / Deposit Addresses" : "Instructions"}</Label>
              {editingMethod?.method === 'MANUAL' ? (
                <div className="space-y-4 bg-muted/50 p-4 rounded-lg border border-border">
                  <div className="space-y-3 max-h-[40vh] overflow-y-auto pr-2">
                    {cryptoAddresses.map((item, idx) => (
                      <div key={idx} className="flex gap-2 items-center bg-background p-2 rounded-md border border-border">
                        <select 
                          value={item.asset} 
                          onChange={e => {
                            const newAddresses = [...cryptoAddresses];
                            newAddresses[idx].asset = e.target.value;
                            setCryptoAddresses(newAddresses);
                          }}
                          className="flex h-10 w-1/3 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground"
                        >
                          <option value="">Select Asset</option>
                          {currencyRates.filter(c => c.isAsset).map(c => (
                            <option key={c.code} value={c.code}>{c.code}</option>
                          ))}
                        </select>
                        <Input 
                          placeholder="Wallet Address" 
                          value={item.address} 
                          onChange={e => {
                            const newAddresses = [...cryptoAddresses];
                            newAddresses[idx].address = e.target.value;
                            setCryptoAddresses(newAddresses);
                          }}
                          className="flex-1 font-mono text-sm"
                        />
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50"
                          onClick={() => setCryptoAddresses(cryptoAddresses.filter((_, i) => i !== idx))}
                          disabled={cryptoAddresses.length === 1}
                        >
                          ✕
                        </Button>
                      </div>
                    ))}
                  </div>
                  <Button type="button" variant="outline" className="w-full border-dashed" onClick={() => setCryptoAddresses([...cryptoAddresses, { asset: "", address: "" }])}>
                    + Add Another Asset
                  </Button>
                </div>
              ) : editingMethod?.method === 'BANK_TRANSFER' ? (
                <div className="space-y-4 bg-muted/50 p-4 rounded-lg border border-border">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold text-sm">Configured Bank Accounts</h4>
                    <Button size="sm" type="button" onClick={() => handleOpenBankModal()}>+ Add Bank</Button>
                  </div>
                  <div className="space-y-3 max-h-[40vh] overflow-y-auto pr-2">
                    {bankAccountsList.length === 0 ? (
                      <div className="text-center text-sm text-muted-foreground py-4 border rounded bg-background">No bank accounts configured.</div>
                    ) : (
                      bankAccountsList.map((bank, index) => (
                        <div key={bank.id || index} className="p-3 bg-background border rounded-md flex justify-between items-center gap-2">
                          <div>
                            <div className="font-medium text-sm">{bank.bank_name} <span className="text-xs text-muted-foreground">({bank.currency})</span></div>
                            <div className="text-xs text-muted-foreground">{bank.account_number}</div>
                          </div>
                          <div className="flex gap-1">
                            <Button size="sm" variant="ghost" onClick={() => handleOpenBankModal(index)}>Edit</Button>
                            <Button size="sm" variant="ghost" className="text-red-500" onClick={() => handleDeleteBankFromLocalList(index)}>Delete</Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ) : (
                <textarea 
                  value={editInstructions}
                  onChange={e => setEditInstructions(e.target.value)}
                  rows={8}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-mono"
                  placeholder="Instructions here..."
                />
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingMethod(null)}>Cancel</Button>
            <Button onClick={handleSaveMethod} disabled={isSaving}>
              {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Method Modal */}
      <Dialog open={isAddMethodModalOpen} onOpenChange={setIsAddMethodModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Payment Method</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Method Type</Label>
              <select 
                value={addMethodForm.method}
                onChange={e => setAddMethodForm({...addMethodForm, method: e.target.value})}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground"
              >
                <option value="MANUAL">MANUAL (Crypto)</option>
                <option value="BANK_TRANSFER">BANK TRANSFER</option>
                <option value="AUTO">AUTO (Payment Gateway)</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Min Deposit Amount (USD)</Label>
              <Input 
                type="number" 
                value={addMethodForm.min_amount} 
                onChange={e => setAddMethodForm({...addMethodForm, min_amount: parseFloat(e.target.value) || 0})} 
              />
            </div>
            <div className="space-y-2">
              <Label>{addMethodForm.method === 'MANUAL' ? "Crypto Wallets / Deposit Addresses" : "Instructions"}</Label>
              {addMethodForm.method === 'MANUAL' ? (
                <div className="space-y-4 bg-muted/50 p-4 rounded-lg border border-border">
                  <div className="space-y-3 max-h-[40vh] overflow-y-auto pr-2">
                    {cryptoAddresses.map((item, idx) => (
                      <div key={idx} className="flex gap-2 items-center bg-background p-2 rounded-md border border-border">
                        <select 
                          value={item.asset} 
                          onChange={e => {
                            const newAddresses = [...cryptoAddresses];
                            newAddresses[idx].asset = e.target.value;
                            setCryptoAddresses(newAddresses);
                          }}
                          className="flex h-10 w-1/3 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground"
                        >
                          <option value="">Select Asset</option>
                          {currencyRates.filter(c => c.isAsset).map(c => (
                            <option key={c.code} value={c.code}>{c.code}</option>
                          ))}
                        </select>
                        <Input 
                          placeholder="Wallet Address" 
                          value={item.address} 
                          onChange={e => {
                            const newAddresses = [...cryptoAddresses];
                            newAddresses[idx].address = e.target.value;
                            setCryptoAddresses(newAddresses);
                          }}
                          className="flex-1 font-mono text-sm"
                        />
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50"
                          onClick={() => setCryptoAddresses(cryptoAddresses.filter((_, i) => i !== idx))}
                          disabled={cryptoAddresses.length === 1}
                        >
                          ✕
                        </Button>
                      </div>
                    ))}
                  </div>
                  <Button type="button" variant="outline" className="w-full border-dashed" onClick={() => setCryptoAddresses([...cryptoAddresses, { asset: "", address: "" }])}>
                    + Add Another Asset
                  </Button>
                </div>
              ) : (
                <textarea 
                  value={addMethodForm.instructions} 
                  onChange={e => setAddMethodForm({...addMethodForm, instructions: e.target.value})}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[100px]"
                  placeholder="Instructions"
                />
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddMethodModalOpen(false)}>Cancel</Button>
            <Button onClick={handleAddMethod} disabled={isSaving}>
              {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Add Method
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add/Edit Bank Modal */}
      <Dialog open={isBankModalOpen} onOpenChange={setIsBankModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingBankIndex !== null ? "Edit" : "Add"} Bank Account</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto px-2">
            <div className="space-y-2">
              <Label>Bank Name *</Label>
              <Input value={bankForm.bank_name} onChange={e => setBankForm({...bankForm, bank_name: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Account Holder *</Label>
              <Input value={bankForm.account_holder} onChange={e => setBankForm({...bankForm, account_holder: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Account Number *</Label>
              <Input value={bankForm.account_number} onChange={e => setBankForm({...bankForm, account_number: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Currency *</Label>
              <select 
                value={bankForm.currency}
                onChange={e => setBankForm({...bankForm, currency: e.target.value})}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground"
              >
                {currencyRates.filter(c => c.isBank).map(c => (
                  <option key={c.code} value={c.code}>{c.code} - {c.name}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>SWIFT / BIC</Label>
                <Input value={bankForm.swift} onChange={e => setBankForm({...bankForm, swift: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>IFSC / Routing</Label>
                <Input value={bankForm.ifsc} onChange={e => setBankForm({...bankForm, ifsc: e.target.value})} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Branch</Label>
              <Input value={bankForm.branch} onChange={e => setBankForm({...bankForm, branch: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Extra Instructions</Label>
              <textarea 
                value={bankForm.instructions} 
                onChange={e => setBankForm({...bankForm, instructions: e.target.value})}
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBankModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveBankToLocalList} disabled={!bankForm.bank_name || !bankForm.account_number}>
              {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Save Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
