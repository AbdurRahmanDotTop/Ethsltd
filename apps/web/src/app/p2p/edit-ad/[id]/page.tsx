"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/auth-store";
import { useRouter } from "next/navigation";
import { apiClient } from "@ethsltd/api-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2, Info } from "lucide-react";
import Link from "next/link";
import { FIAT_CURRENCIES, ASSETS } from "@/lib/p2p/mock-data";
import { P2PSide, PaymentMethodConfig } from "@/lib/p2p/types";
import { Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function EditAdPage({ params }: { params: { id: string } }) {
  const { user, status, hasHydrated } = useAuthStore();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    type: "BUY" as P2PSide | "BUY" | "SELL",
    asset: "USDT",
    fiat: "INR",
    price: "",
    isFloating: false,
    priceMargin: "",
    totalAmount: "",
    minLimit: "",
    maxLimit: "",
    paymentWindow: "15",
    terms: "",
    autoReply: ""
  });

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodConfig[]>([{
    id: crypto.randomUUID(),
    type: "Bank Transfer",
    details: { accountName: "", bankName: "", accountNumber: "", ifscCode: "" }
  }]);

  const [hasInsufficientBalance, setHasInsufficientBalance] = useState(false);
  const [isCheckingBalance, setIsCheckingBalance] = useState(true);
  const [showDepositPopup, setShowDepositPopup] = useState(false);

  useEffect(() => {
    if (hasHydrated && status === "unauthenticated") {
      router.push("/login?callbackUrl=/p2p/post-ad");
      return;
    }

    if (hasHydrated && status === "authenticated") {
      async function checkBalance() {
        try {
          const res = await apiClient.getWalletBalances('REAL');
          if (res.success && res.data) {
            let totalBalance = 0;
            for (const wallet of res.data) {
              totalBalance += parseFloat(wallet.balance) + parseFloat(wallet.lockedBalance || '0') + parseFloat(wallet.escrowBalance || '0');
            }
            if (totalBalance <= 0) {
              setHasInsufficientBalance(true);
              setShowDepositPopup(true);
            }
          }
        } catch (err) {
          console.error("Failed to check balance", err);
        } finally {
          setIsCheckingBalance(false);
        }
      }
      checkBalance();
    }
  }, [hasHydrated, status, router]);

  useEffect(() => {
    if (status === "authenticated" && params.id) {
      async function fetchAd() {
        try {
          const res = await apiClient.getP2pAds();
          if (res.success && res.data) {
            const ad = res.data.find((a: any) => a.id === params.id);
            if (ad) {
              setFormData({
                type: ad.type,
                asset: ad.asset,
                fiat: ad.fiat,
                price: String(ad.price),
                isFloating: ad.priceType === 'floating',
                priceMargin: "",
                totalAmount: String(ad.availableAmount),
                minLimit: String(ad.minLimit),
                maxLimit: String(ad.maxLimit),
                paymentWindow: String(ad.paymentWindow || "15"),
                terms: ad.terms || "",
                autoReply: ad.autoReply || ""
              });
              
              if (Array.isArray(ad.paymentMethods)) {
                try {
                  const methods = ad.paymentMethods.map((m: any) => {
                    if (typeof m === 'string') {
                      // Legacy string conversion
                      return { id: crypto.randomUUID(), type: m, details: { accountName: "", additionalInfo: "" } };
                    }
                    return m as PaymentMethodConfig;
                  });
                  setPaymentMethods(methods.length > 0 ? methods : [{ id: crypto.randomUUID(), type: "Bank Transfer", details: { accountName: "", bankName: "", accountNumber: "", ifscCode: "" } }]);
                } catch(e) {
                  console.error("Failed to parse payment methods", e);
                }
              }

            } else {
              toast.error("Ad not found");
              router.push('/p2p/my-ads');
            }
          }
        } catch (e) {
          console.error(e);
        }
      }
      fetchAd();
    }
  }, [status, params.id, router]);

  if (!hasHydrated || status === "loading" || status === "unauthenticated" || isCheckingBalance) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] bg-muted/30">
        <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
      </div>
    );
  }



  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    if (name === 'type') setError(null);
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate Payment Methods
    if (paymentMethods.length === 0) {
      toast.error("Please add at least one payment method");
      return;
    }

    for (const method of paymentMethods) {
      for (const [key, val] of Object.entries(method.details)) {
        if (!val || val.trim() === '') {
          toast.error(`Please fill all details for ${method.type}`);
          return;
        }
      }
    }

    setIsSubmitting(true);
    setError(null);

    try {
      if (hasInsufficientBalance) {
        setShowDepositPopup(true);
        setIsSubmitting(false);
        return;
      }

      const payload = {
        type: formData.type,
        asset: formData.asset,
        fiat: formData.fiat,
        priceType: formData.isFloating ? 'floating' : 'fixed',
        price: parseFloat(formData.price),
        minLimit: parseFloat(formData.minLimit),
        maxLimit: parseFloat(formData.maxLimit),
        paymentWindow: parseInt(formData.paymentWindow),
        paymentMethods,
        terms: formData.terms,
        autoReply: formData.autoReply,
      };

      const res = await apiClient.updateP2pAd(params.id, payload);

      if (res.success) {
        toast.success("Ad updated successfully");
        router.push("/p2p/my-ads");
      } else {
        if (res.error?.toLowerCase().includes("insufficient")) {
          setShowDepositPopup(true);
        } else {
          setError(res.error || "Failed to create ad");
          toast.error(res.error || "Failed to create advertisement");
        }
      }
    } catch (err: any) {
      if (err.message?.toLowerCase().includes("insufficient")) {
        setShowDepositPopup(true);
      } else {
        setError(err.message || "An unexpected error occurred");
        toast.error(err.message || "An unexpected error occurred");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const isBuy = formData.type === "BUY";
  const fiatSymbol = FIAT_CURRENCIES.find(f => f.code === formData.fiat)?.symbol || "$";

  return (
    <main className="flex-1 py-12 px-4 md:px-8 max-w-[800px] mx-auto w-full">
        <Link href="/p2p/my-ads" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to My Ads
        </Link>
        
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Edit Advertisement</h1>
          <p className="text-sm text-muted-foreground mt-1">Update the details of your P2P ad</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-sm flex items-start">
            <Info className="w-4 h-4 mr-2 mt-0.5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl shadow-sm p-6 md:p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Ad Type</Label>
              <div className="grid grid-cols-2 gap-2 p-1 bg-muted rounded-lg border border-border">
                <button
                  type="button"
                  onClick={() => handleSelectChange('type', 'BUY')}
                  className={`py-2 px-4 text-sm font-medium rounded-md transition-all ${isBuy ? 'bg-background shadow-sm text-green-500' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  I want to Buy
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectChange('type', 'SELL')}
                  className={`py-2 px-4 text-sm font-medium rounded-md transition-all ${!isBuy ? 'bg-background shadow-sm text-red-500' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  I want to Sell
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {isBuy 
                  ? "You will pay fiat to receive crypto." 
                  : "You will lock your crypto to receive fiat."}
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="asset">Crypto Asset</Label>
              <select 
                id="asset" 
                name="asset" 
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={formData.asset} 
                onChange={(e) => handleSelectChange('asset', e.target.value)}
              >
                {ASSETS.map((c) => (
                  <option key={c.symbol} value={c.symbol}>
                    {c.name} ({c.symbol})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="fiat">Fiat Currency</Label>
              <select 
                id="fiat" 
                name="fiat" 
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={formData.fiat} 
                onChange={(e) => handleSelectChange('fiat', e.target.value)}
              >
                {FIAT_CURRENCIES.map((f) => (
                  <option key={f.code} value={f.code}>
                    {f.name} ({f.code})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label>Pricing Type</Label>
              <div className="grid grid-cols-2 gap-2 p-1 bg-muted rounded-lg border border-border">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, isFloating: false }))}
                  className={`py-2 px-4 text-sm font-medium rounded-md transition-all ${!formData.isFloating ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  Fixed
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, isFloating: true }))}
                  className={`py-2 px-4 text-sm font-medium rounded-md transition-all ${formData.isFloating ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  Floating
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">{formData.isFloating ? 'Price Margin (%)' : 'Fixed Price'}</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-muted-foreground text-sm">{formData.isFloating ? '%' : fiatSymbol}</span>
                </div>
                <Input
                  id={formData.isFloating ? "priceMargin" : "price"}
                  name={formData.isFloating ? "priceMargin" : "price"}
                  type="number"
                  step="0.01"
                  required
                  placeholder="0.00"
                  className="pl-7"
                  value={formData.isFloating ? formData.priceMargin : formData.price}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="totalAmount">Total Trading Amount</Label>
              <div className="relative">
                <Input
                  id="totalAmount"
                  name="totalAmount"
                  type="number"
                  step="0.000001"
                  required
                  min="0.000001"
                  placeholder="0.00"
                  className="pr-16"
                  value={formData.totalAmount}
                  onChange={handleChange}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-muted-foreground text-sm font-medium">{formData.asset}</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="paymentWindow">Payment Window (Minutes)</Label>
              <Input
                id="paymentWindow"
                name="paymentWindow"
                type="number"
                required
                min="15"
                max="360"
                value={formData.paymentWindow}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="minLimit">Order Limit (Min)</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-muted-foreground text-sm">{fiatSymbol}</span>
                </div>
                <Input
                  id="minLimit"
                  name="minLimit"
                  type="number"
                  required
                  min="1"
                  className="pl-7"
                  value={formData.minLimit}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxLimit">Order Limit (Max)</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-muted-foreground text-sm">{fiatSymbol}</span>
                </div>
                <Input
                  id="maxLimit"
                  name="maxLimit"
                  type="number"
                  required
                  min="1"
                  className="pl-7"
                  value={formData.maxLimit}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Payment Methods</Label>
              <Button type="button" variant="outline" size="sm" onClick={() => {
                setPaymentMethods([...paymentMethods, { id: crypto.randomUUID(), type: 'UPI', details: { upiId: '', upiName: '' } }]);
              }}>
                <Plus className="w-4 h-4 mr-1" /> Add
              </Button>
            </div>
            
            <div className="space-y-4">
              {paymentMethods.map((pm, index) => (
                <div key={pm.id} className="p-4 bg-muted/30 border border-border rounded-lg space-y-4 relative">
                  <div className="flex items-center justify-between">
                    <select
                      value={pm.type}
                      onChange={(e) => {
                        const type = e.target.value;
                        const newMethods = [...paymentMethods];
                        newMethods[index].type = type;
                        if (type === 'Bank Transfer') {
                          newMethods[index].details = { accountName: "", bankName: "", accountNumber: "", ifscCode: "" };
                        } else if (type === 'UPI') {
                          newMethods[index].details = { upiId: "", upiName: "" };
                        } else {
                          newMethods[index].details = { accountName: "", additionalInfo: "" };
                        }
                        setPaymentMethods(newMethods);
                      }}
                      className="w-full max-w-[200px] border rounded-md px-3 py-2 text-sm bg-background font-medium text-brand-600"
                    >
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="UPI">UPI</option>
                      <option value="Other">Other</option>
                    </select>
                    
                    {paymentMethods.length > 1 && (
                      <button type="button" onClick={() => {
                        setPaymentMethods(paymentMethods.filter(m => m.id !== pm.id));
                      }} className="text-muted-foreground hover:text-red-500">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  
                  {pm.type === 'Bank Transfer' && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Account Holder Name</Label>
                        <Input required value={pm.details.accountName || ''} onChange={(e) => {
                          const newMethods = [...paymentMethods];
                          newMethods[index].details.accountName = e.target.value;
                          setPaymentMethods(newMethods);
                        }} />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Bank Name</Label>
                        <Input required value={pm.details.bankName || ''} onChange={(e) => {
                          const newMethods = [...paymentMethods];
                          newMethods[index].details.bankName = e.target.value;
                          setPaymentMethods(newMethods);
                        }} />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Account Number</Label>
                        <Input required value={pm.details.accountNumber || ''} onChange={(e) => {
                          const newMethods = [...paymentMethods];
                          newMethods[index].details.accountNumber = e.target.value;
                          setPaymentMethods(newMethods);
                        }} />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">IFSC Code</Label>
                        <Input required value={pm.details.ifscCode || ''} onChange={(e) => {
                          const newMethods = [...paymentMethods];
                          newMethods[index].details.ifscCode = e.target.value;
                          setPaymentMethods(newMethods);
                        }} />
                      </div>
                    </div>
                  )}

                  {pm.type === 'UPI' && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">UPI ID</Label>
                        <Input required value={pm.details.upiId || ''} onChange={(e) => {
                          const newMethods = [...paymentMethods];
                          newMethods[index].details.upiId = e.target.value;
                          setPaymentMethods(newMethods);
                        }} />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">UPI Name</Label>
                        <Input required value={pm.details.upiName || ''} onChange={(e) => {
                          const newMethods = [...paymentMethods];
                          newMethods[index].details.upiName = e.target.value;
                          setPaymentMethods(newMethods);
                        }} />
                      </div>
                    </div>
                  )}

                  {pm.type === 'Other' && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Account/User Name</Label>
                        <Input required value={pm.details.accountName || ''} onChange={(e) => {
                          const newMethods = [...paymentMethods];
                          newMethods[index].details.accountName = e.target.value;
                          setPaymentMethods(newMethods);
                        }} />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Additional Info (ID, Number, etc)</Label>
                        <Input required value={pm.details.additionalInfo || ''} onChange={(e) => {
                          const newMethods = [...paymentMethods];
                          newMethods[index].details.additionalInfo = e.target.value;
                          setPaymentMethods(newMethods);
                        }} />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="terms">Terms and Conditions (Optional)</Label>
            <textarea
              id="terms"
              name="terms"
              rows={3}
              placeholder="Enter any specific requirements for traders..."
              value={formData.terms}
              onChange={handleChange}
              className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="autoReply">Auto Reply Message (Optional)</Label>
            <textarea
              id="autoReply"
              name="autoReply"
              rows={2}
              placeholder="Sent automatically to the chat when a trade starts..."
              value={formData.autoReply}
              onChange={handleChange}
              className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
            />
          </div>

          <div className="pt-4 border-t border-border flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...</>
              ) : (
                "Update Ad"
              )}
            </Button>
          </div>
        </form>

        <Dialog open={showDepositPopup} onOpenChange={setShowDepositPopup}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Insufficient Balance</DialogTitle>
              <DialogDescription>
                You do not have enough funds in your wallet to post this P2P advertisement. To maintain security and trust, you must have the required balance available.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="sm:justify-start gap-2 mt-4">
              <Button type="button" variant="default" onClick={() => router.push('/wallet?deposit=true')} className="w-full sm:w-auto">
                Add Deposit
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowDepositPopup(false)} className="w-full sm:w-auto">
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </main>
  );
}
