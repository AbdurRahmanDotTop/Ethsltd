"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function AdminPaymentSettingsPage() {
  const [methods, setMethods] = useState<any[]>([]);
  const [banks, setBanks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
            <Button variant="outline">Edit</Button>
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
    </div>
  );
}
