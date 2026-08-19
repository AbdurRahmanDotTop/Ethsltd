"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useTradingModeStore } from "@/stores/trading-mode-store";
import { apiClient } from "@ethsltd/api-client";
import { AssetBalance } from "@/lib/wallet/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, ArrowUpFromLine, AlertCircle, ShieldAlert } from "lucide-react";
import { toast } from "sonner";

const CRYPTO_ASSETS = ["USDT", "USDC", "BTC", "ETH", "SOL"];

const withdrawSchema = z.object({
  asset: z.string().min(1, "Asset is required"),
  destination: z.string().min(10, "Destination address is required"),
  amount: z.number().positive("Amount must be greater than 0"),
});

export function RealWithdrawForm({ defaultAsset = "USDT" }: { defaultAsset?: string }) {
  const router = useRouter();
  const [balances, setBalances] = useState<AssetBalance[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  const form = useForm<z.infer<typeof withdrawSchema>>({
    resolver: zodResolver(withdrawSchema),
    defaultValues: {
      asset: CRYPTO_ASSETS.includes(defaultAsset.toUpperCase()) ? defaultAsset.toUpperCase() : "USDT",
      amount: 10,
      destination: "",
    },
  });

  const selectedAsset = form.watch("asset");
  const amount = form.watch("amount");

  const { mode } = useTradingModeStore();
  const [preview, setPreview] = useState<any | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  useEffect(() => {
    if (mode === 'REAL') {
      apiClient.getWalletBalances(mode).then(res => setBalances(res.data || []));
    }
  }, [mode]);

  useEffect(() => {
    const fetchPreview = async () => {
      const numAmount = Number(amount);
      if (!amount || isNaN(numAmount) || numAmount <= 0) {
        setPreview(null);
        return;
      }
      setPreviewLoading(true);
      try {
        const res = await apiClient.getWithdrawalPreview(numAmount, selectedAsset, 'CRYPTO');
        if (res.success) {
          setPreview(res.data);
        } else {
          setPreview(null);
        }
      } catch (e) {
        setPreview(null);
      } finally {
        setPreviewLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchPreview();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [amount, selectedAsset]);

  const activeBalance = balances.find((b) => b.symbol === selectedAsset);
  const availableAmount = activeBalance?.available || 0;
  
  // Real withdrawal fee logic via preview
  const fee = preview ? preview.totalFees : 0;
  // If we don't have preview yet, we assume they withdraw `amount` exactly from balance.
  const totalDeduction = Number(amount || 0); // User requests `amount` to be deducted from balance
  
  const hasInsufficientBalance = totalDeduction > availableAmount;

  const onReview = (values: z.infer<typeof withdrawSchema>) => {
    if (hasInsufficientBalance) {
      form.setError("amount", { message: "Insufficient available balance." });
      return;
    }
    if (preview && preview.netUsdtReceived <= 0) {
      form.setError("amount", { message: "Amount must be greater than withdrawal fee" });
      return;
    }
    setIsConfirming(true);
  };

  const onConfirm = async () => {
    const values = form.getValues();
    setIsSubmitting(true);
    try {
      const res = await apiClient.withdraw({
        assetSymbol: values.asset,
        amount: values.amount,
        destination: values.destination,
        network: "Crypto", // Replace with actual network selection in a fully fleshed app
        mode: "REAL"
      });
      
      if (res.success) {
        toast.success("Withdrawal initiated successfully");
        router.push("/wallet");
      } else {
        toast.error(res.error || "Withdrawal failed");
      }
    } catch (error: any) {
      toast.error(error.message || "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
      setIsConfirming(false);
    }
  };

  if (isConfirming) {
    return (
      <div className="max-w-xl mx-auto bg-card border border-red-500/20 rounded-xl shadow-sm p-6 space-y-6">
        <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
          <ShieldAlert className="w-6 h-6 text-red-500" />
          Review Real Withdrawal
        </h3>
        
        <div className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-lg text-sm text-red-800 dark:text-red-300 flex gap-2">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <p>You are about to withdraw REAL funds. Cryptocurrency transactions are irreversible. Please double check the destination address.</p>
        </div>
        
        <div className="space-y-4 bg-muted/30 p-4 rounded-lg border border-border relative">
          {previewLoading && (
            <div className="absolute inset-0 bg-background/50 backdrop-blur-[1px] flex items-center justify-center rounded-lg z-10">
              <Loader2 className="w-5 h-5 animate-spin text-brand-600" />
            </div>
          )}
          <div className="flex justify-between items-center text-sm flex-wrap gap-y-4">
            <span className="text-muted-foreground">Asset</span>
            <span className="font-semibold text-foreground">{selectedAsset}</span>
          </div>
          <div className="flex justify-between items-center text-sm flex-wrap gap-y-4">
            <span className="text-muted-foreground">Withdrawal Amount</span>
            <span className="font-mono text-foreground">{amount.toLocaleString()} {selectedAsset}</span>
          </div>
          {preview && preview.currencyCode !== 'USDT' && (
             <div className="flex justify-between items-center text-sm flex-wrap gap-y-4">
               <span className="text-muted-foreground">Exchange Rate</span>
               <span className="font-mono text-foreground">1 {preview.currencyCode} = {preview.conversionRate} USDT</span>
             </div>
          )}
          <div className="flex justify-between items-center text-sm text-red-500 flex-wrap gap-y-4">
            <span className="text-muted-foreground">Network & Platform Fees</span>
            <span className="font-mono">- {fee.toLocaleString()} USDT</span>
          </div>
          <div className="pt-4 border-t border-border flex justify-between items-center flex-wrap gap-y-4">
            <span className="font-semibold text-foreground">You Will Receive</span>
            <span className="font-mono font-bold text-xl text-brand-600 dark:text-brand-400">
              {preview ? preview.netUsdtReceived.toLocaleString() : '0'} USDT
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <span className="text-sm text-muted-foreground">Destination</span>
          <div className="bg-muted p-3 rounded-md font-mono text-sm text-foreground break-all border border-border">
            {form.getValues("destination")}
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <Button variant="outline" className="flex-1" onClick={() => setIsConfirming(false)} disabled={isSubmitting}>
            Back
          </Button>
          <Button variant="destructive" className="flex-1" onClick={onConfirm} disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            {isSubmitting ? "Processing..." : "Confirm Real Withdrawal"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto bg-card border border-border rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-border bg-amber-50/50 dark:bg-amber-900/10">
        <div className="flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
          <div>
            <h3 className="font-semibold text-amber-900 dark:text-amber-100">Real Money Withdrawal</h3>
            <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
              This action will permanently withdraw real funds from your account. Ensure your destination address is absolutely correct.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onReview)} className="p-6 space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between items-center flex-wrap gap-y-4">
            <label className="text-sm font-medium text-foreground">Asset</label>
            <span className="text-xs text-muted-foreground">
              Available: <span className="font-mono font-medium text-foreground">{availableAmount.toLocaleString()} {selectedAsset}</span>
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {CRYPTO_ASSETS.map((asset) => (
              <button
                key={asset}
                type="button"
                onClick={() => form.setValue("asset", asset)}
                className={`py-2 px-3 text-sm font-medium rounded-md border transition-colors whitespace-nowrap flex-grow sm:flex-grow-0 text-center ${
                  selectedAsset === asset
                    ? "bg-brand-500 text-white border-brand-500"
                    : "bg-background text-muted-foreground border-border hover:bg-muted"
                }`}
              >
                {asset}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Destination Address</label>
          <Input
            {...form.register("destination")}
            placeholder={`Enter external ${selectedAsset} wallet address`}
            className="font-mono"
          />
          {form.formState.errors.destination && (
            <p className="text-sm text-red-500">{form.formState.errors.destination.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Amount</label>
          <div className="relative">
            <Input
              type="number"
              step="any"
              {...form.register("amount", { valueAsNumber: true })}
              className={`pl-4 pr-16 h-12 text-lg font-medium ${hasInsufficientBalance ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <button 
                type="button"
                onClick={() => form.setValue("amount", Math.max(0, availableAmount - fee))}
                className="text-xs font-semibold text-brand-600 hover:text-brand-700"
              >
                MAX
              </button>
              <span className="font-semibold text-muted-foreground border-l border-border pl-2">
                {selectedAsset}
              </span>
            </div>
          </div>
          {form.formState.errors.amount && (
            <p className="text-sm text-red-500">{form.formState.errors.amount.message}</p>
          )}
          {hasInsufficientBalance && !form.formState.errors.amount && (
            <div className="flex items-center gap-1.5 mt-1 text-sm text-red-500">
              <AlertCircle className="w-4 h-4" />
              Insufficient available balance to cover amount + fee.
            </div>
          )}
        </div>
        
        <div className="bg-muted/30 p-4 rounded-lg border border-border space-y-2 text-sm relative">
          {previewLoading && (
            <div className="absolute inset-0 bg-background/50 backdrop-blur-[1px] flex items-center justify-center rounded-lg z-10">
              <Loader2 className="w-5 h-5 animate-spin text-brand-600" />
            </div>
          )}
          {preview ? (
            <>
              {preview.currencyCode !== 'USDT' && (
                <div className="flex justify-between items-center text-xs text-muted-foreground flex-wrap gap-y-4">
                  <span>Exchange Rate</span>
                  <span className="font-mono">1 {preview.currencyCode} = {preview.conversionRate} USDT</span>
                </div>
              )}
              <div className="flex justify-between text-red-500">
                <span>Estimated Network & Platform Fees</span>
                <span className="font-mono">{fee.toLocaleString()} USDT</span>
              </div>
              <div className="flex justify-between font-medium text-foreground">
                <span>Total Deduction from Balance</span>
                <span className="font-mono">{totalDeduction.toLocaleString()} {selectedAsset}</span>
              </div>
            </>
          ) : (
            <div className="text-muted-foreground italic text-center">Enter amount to see fee breakdown</div>
          )}
        </div>

        <Button type="submit" className="w-full h-12 text-base" disabled={hasInsufficientBalance || totalDeduction <= fee}>
          <ArrowUpFromLine className="w-5 h-5 mr-2" />
          Review Withdrawal
        </Button>
      </form>
    </div>
  );
}
