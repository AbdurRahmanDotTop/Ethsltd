"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

export default function AdminPaymentSettingsPage() {
  const [methods, setMethods] = useState<any[]>([]);
  const [banks, setBanks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Edit Method State
  const [editingMethod, setEditingMethod] = useState<any | null>(null);
  const [editInstructions, setEditInstructions] = useState("");
  const [isSaving, setIsSaving] = useState(false);

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
        <h3 className="text-xl font-semibold">Payment Methods</h3>
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
          <Button>Add Bank Account</Button>
        </div>
        {loading ? <p>Loading...</p> : banks.map(bank => (
          <div key={bank.id} className="p-4 border border-border rounded-lg bg-card flex justify-between items-center">
            <div>
              <h4 className="font-semibold">{bank.bank_name}</h4>
              <p className="text-sm text-muted-foreground">{bank.account_holder} - {bank.currency}</p>
            </div>
            <Button variant="outline">Edit</Button>
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
    </div>
  );
}
