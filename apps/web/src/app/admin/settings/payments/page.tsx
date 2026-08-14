"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

export default function AdminPaymentSettingsPage() {
  const [methods, setMethods] = useState<any[]>([]);
  const [banks, setBanks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Edit Method State
  const [editingMethod, setEditingMethod] = useState<any | null>(null);
  const [editInstructions, setEditInstructions] = useState("");
  const [isSaving, setIsSaving] = useState(false);

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

  // Bank Account State
  const [editingBank, setEditingBank] = useState<any | null>(null);
  const [isBankModalOpen, setIsBankModalOpen] = useState(false);
  const [bankForm, setBankForm] = useState({
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
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8000/api/v1/admin/payments/settings", {
        headers: { Authorization: `Bearer ${token}` }
      }).then(r => r.json());
      
      if (res.success) {
        setMethods(res.paymentMethods || []);
        setBanks(res.bankAccounts || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleEditMethod = (method: any) => {
    setEditingMethod(method);
    // Format JSON if it is MANUAL to make it readable
    if (method.method === 'MANUAL' && method.instructions) {
      try {
        const parsed = JSON.parse(method.instructions);
        setEditInstructions(JSON.stringify(parsed, null, 2));
      } catch (e) {
        setEditInstructions(method.instructions || "");
      }
    } else {
      setEditInstructions(method.instructions || "");
    }
  };

  const handleSaveMethod = async () => {
    if (!editingMethod) return;
    setIsSaving(true);
    try {
      const token = localStorage.getItem("token");
      let finalInstructions = editInstructions;
      
      // If MANUAL, ensure it's valid JSON
      if (editingMethod.method === 'MANUAL' && editInstructions.trim() !== '') {
        try {
          JSON.parse(editInstructions); // Validate
        } catch (e) {
          toast.error("Invalid JSON format for crypto addresses.");
          setIsSaving(false);
          return;
        }
      }

      const res = await fetch(`http://localhost:8000/api/v1/admin/payments/methods/${editingMethod.id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ instructions: finalInstructions })
      }).then(r => r.json());

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

  const handleAddMethod = async () => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem("token");
      
      if (addMethodForm.method === 'MANUAL') {
        try { JSON.parse(addMethodForm.instructions); } catch(e) {
          toast.error("Invalid JSON format for crypto addresses.");
          setIsSaving(false); return;
        }
      }

      const res = await fetch(`http://localhost:8000/api/v1/admin/payments/methods`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(addMethodForm)
      }).then(r => r.json());

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

  const handleOpenBankModal = (bank: any = null) => {
    if (bank) {
      setEditingBank(bank);
      setBankForm({
        bank_name: bank.bank_name || "",
        account_holder: bank.account_holder || "",
        account_number: bank.account_number || "",
        currency: bank.currency || "USD",
        ifsc: bank.ifsc || "",
        swift: bank.swift || "",
        branch: bank.branch || "",
        instructions: bank.instructions || ""
      });
    } else {
      setEditingBank(null);
      setBankForm({
        bank_name: "", account_holder: "", account_number: "", currency: "USD", ifsc: "", swift: "", branch: "", instructions: ""
      });
    }
    setIsBankModalOpen(true);
  };

  const handleSaveBank = async () => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem("token");
      const isEdit = !!editingBank;
      const url = isEdit 
        ? `http://localhost:8000/api/v1/admin/payments/banks/${editingBank.id}`
        : `http://localhost:8000/api/v1/admin/payments/banks`;
      
      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(bankForm)
      }).then(r => r.json());

      if (res.success) {
        toast.success(isEdit ? "Bank account updated!" : "Bank account added!");
        setIsBankModalOpen(false);
        fetchSettings();
      } else {
        toast.error(res.error || "Failed to save bank account");
      }
    } catch (e: any) {
      toast.error(e.message || "Error saving");
    } finally {
      setIsSaving(false);
    }
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
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold">Payment Methods</h3>
          <Button onClick={() => setIsAddMethodModalOpen(true)}>Add Method</Button>
        </div>
        {loading ? <p>Loading...</p> : methods.map(method => (
          <div key={method.id} className="p-4 border border-border rounded-lg bg-card flex justify-between items-center">
            <div>
              <h4 className="font-semibold">{method.method}</h4>
              <p className="text-sm text-muted-foreground">Status: {method.enabled ? "Enabled" : "Disabled"}</p>
            </div>
            <Button variant="outline" onClick={() => handleEditMethod(method)}>Edit</Button>
          </div>
        ))}
        {methods.length === 0 && !loading && (
          <div className="p-4 border border-border rounded-lg bg-muted text-center text-sm">
            No payment methods configured yet.
          </div>
        )}
      </div>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold">Bank Accounts</h3>
          <Button onClick={() => handleOpenBankModal()}>Add Bank Account</Button>
        </div>
        {loading ? <p>Loading...</p> : banks.map(bank => (
          <div key={bank.id} className="p-4 border border-border rounded-lg bg-card flex justify-between items-center">
            <div>
              <h4 className="font-semibold">{bank.bank_name}</h4>
              <p className="text-sm text-muted-foreground">{bank.account_holder} - {bank.currency}</p>
            </div>
            <Button variant="outline" onClick={() => handleOpenBankModal(bank)}>Edit</Button>
          </div>
        ))}
        {banks.length === 0 && !loading && (
          <div className="p-4 border border-border rounded-lg bg-muted text-center text-sm">
            No bank accounts configured.
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
            <div className="space-y-2">
              <Label>Instructions / Addresses (JSON for MANUAL)</Label>
              <textarea 
                value={editInstructions}
                onChange={e => setEditInstructions(e.target.value)}
                rows={8}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-mono"
                placeholder={editingMethod?.method === 'MANUAL' ? '{\n  "USDT": "0x...",\n  "BTC": "bc1..."\n}' : "Instructions here..."}
              />
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
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
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
              <Label>Instructions (JSON for MANUAL)</Label>
              <textarea 
                value={addMethodForm.instructions} 
                onChange={e => setAddMethodForm({...addMethodForm, instructions: e.target.value})}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono min-h-[100px]"
                placeholder={addMethodForm.method === 'MANUAL' ? '{\n  "USDT": "0x...",\n  "BTC": "bc1..."\n}' : "Instructions"}
              />
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
            <DialogTitle>{editingBank ? "Edit" : "Add"} Bank Account</DialogTitle>
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
              <Input value={bankForm.currency} onChange={e => setBankForm({...bankForm, currency: e.target.value})} />
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
            <Button onClick={handleSaveBank} disabled={isSaving || !bankForm.bank_name || !bankForm.account_number}>
              {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Save Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
