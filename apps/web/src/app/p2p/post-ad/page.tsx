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
import { P2PSide } from "@/lib/p2p/types";

export default function PostAdPage() {
  const { user, status, hasHydrated } = useAuthStore();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    type: "BUY" as P2PSide | "BUY" | "SELL",
    asset: "USDT",
    fiat: "USD",
    price: "",
    isFloating: false,
    priceMargin: "",
    totalAmount: "",
    minLimit: "",
    maxLimit: "",
    paymentWindow: "15",
    paymentMethods: "Bank Transfer",
    terms: "",
    autoReply: ""
  });

  useEffect(() => {
    if (hasHydrated && status === "unauthenticated") {
      router.push("/login?callbackUrl=/p2p/post-ad");
    }
  }, [hasHydrated, status, router]);

  if (!hasHydrated || status === "loading" || status === "unauthenticated") {
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
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const payload = {
        ...formData,
        price: formData.price ? parseFloat(formData.price) : 0,
        priceMargin: formData.isFloating ? parseFloat(formData.priceMargin) : null,
        totalAmount: parseFloat(formData.totalAmount),
        minLimit: parseFloat(formData.minLimit),
        maxLimit: parseFloat(formData.maxLimit),
        paymentWindow: parseInt(formData.paymentWindow, 10),
        paymentMethods: formData.paymentMethods.split(',').map(m => m.trim())
      };

      const res = await apiClient.createP2pAd(payload);
      if (res.success) {
        toast.success("Advertisement posted successfully!");
        router.refresh();
        router.push("/p2p/my-ads");
      } else {
        setError(res.error || "Failed to create ad");
        toast.error(res.error || "Failed to create advertisement");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
      toast.error(err.message || "An unexpected error occurred");
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
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">Post P2P Advertisement</h1>
          <p className="text-muted-foreground mb-8">Create a new buy or sell advertisement to trade with other users.</p>
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

          <div className="space-y-2">
            <Label htmlFor="paymentMethods">Payment Methods (Comma separated)</Label>
            <Input
              id="paymentMethods"
              name="paymentMethods"
              required
              placeholder="e.g. Bank Transfer, Zelle, PayPal"
              value={formData.paymentMethods}
              onChange={handleChange}
            />
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
              {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Post Advertisement
            </Button>
          </div>
        </form>
      </main>
  );
}
