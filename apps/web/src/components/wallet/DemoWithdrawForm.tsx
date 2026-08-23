"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useWalletStore } from "@/stores/wallet-store";
import { useTradingModeStore } from "@/stores/trading-mode-store";
import { apiClient } from "@ethsltd/api-client";
import { AssetBalance } from "@/lib/wallet/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Info, ArrowUpFromLine, AlertCircle } from "lucide-react";

const SUPPORTED_ASSETS = ["USD", "USDT", "USDC", "BTC", "ETH", "SOL"];

const withdrawSchema = z.object({
  asset: z.string().min(1, "Asset is required"),
  destination: z.string().min(10, "Destination address is required"),
  amount: z.number().positive("Amount must be greater than 0"),
});

export function DemoWithdrawForm({ defaultAsset = "USD" }: { defaultAsset?: string }) {
  const router = useRouter();
  const simulateWithdrawal = useWalletStore((state) => state.simulateWithdrawal);
  const [balances, setBalances] = useState<AssetBalance[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  const form = useForm<z.infer<typeof withdrawSchema>>({
    resolver: zodResolver(withdrawSchema),
    defaultValues: {
      asset: defaultAsset.toUpperCase(),
      amount: 100,
      destination: "SimulatedWithdrawalDestination123",
    },
  });

  const selectedAsset = form.watch("asset");
  const amount = form.watch("amount");

  const { mode } = useTradingModeStore();
  useEffect(() => {
    apiClient.getWalletBalances(mode).then(res => setBalances(res.data || []));
  }, [mode]);

  const activeBalance = balances.find((b) => b.symbol === selectedAsset);
  const availableAmount = activeBalance?.available || 0;
  
  // Calculate mock fee (e.g. 0.1% or flat fee)
  const isFiat = selectedAsset === "USD";
  const fee = isFiat ? 0 : amount * 0.001; 
  const totalDeduction = amount + fee;
  
  const hasInsufficientBalance = totalDeduction > availableAmount;

  const onReview = (values: z.infer<typeof withdrawSchema>) => {
    if (hasInsufficientBalance) {
      form.setError("amount", { message: "Insufficient available balance including fees." });
      return;
    }
    setIsConfirming(true);
  };

  const onConfirm = async () => {
    const values = form.getValues();
    setIsSubmitting(true);
    try {
      await simulateWithdrawal(values.asset, values.amount, values.destination, "Simulated Network", fee, mode);
      router.push("/wallet");
    } catch (error) {
      console.error("Withdrawal failed", error);
      setIsSubmitting(false);
      setIsConfirming(false);
    }
  };

  if (isConfirming) {
    return (
      <div className="max-w-xl mx-auto bg-card border border-border rounded-xl shadow-sm p-6 space-y-6">
        <h3 className="text-xl font-bold text-foreground">Review Withdrawal</h3>
        
        <div className="space-y-4 bg-muted/30 p-4 rounded-lg border border-border">
          <div className="flex justify-between items-center text-sm flex-wrap gap-y-4">
            <span className="text-muted-foreground">Asset</span>
            <span className="font-semibold text-foreground">{selectedAsset}</span>
          </div>
          <div className="flex justify-between items-center text-sm flex-wrap gap-y-4">
            <span className="text-muted-foreground">Network</span>
            <span className="font-medium text-foreground">Simulated Network</span>
          </div>
          <div className="flex justify-between items-center text-sm flex-wrap gap-y-4">
            <span className="text-muted-foreground">Amount</span>
            <span className="font-mono text-foreground">{amount.toLocaleString()} {selectedAsset}</span>
          </div>
          <div className="flex justify-between items-center text-sm flex-wrap gap-y-4">
            <span className="text-muted-foreground">Fee</span>
            <span className="font-mono text-foreground">{fee.toLocaleString()} {selectedAsset}</span>
          </div>
          <div className="pt-4 border-t border-border flex justify-between items-center flex-wrap gap-y-4">
            <span className="font-semibold text-foreground">You Receive</span>
            <span className="font-mono font-bold text-xl text-primary dark:text-primary">
              {amount.toLocaleString()} {selectedAsset}
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
          <Button className="flex-1" onClick={onConfirm} isLoading={isSubmitting} loadingText="Processing...">
            Confirm Withdrawal
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto bg-card border border-border rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-border bg-blue-50/50 dark:bg-blue-900/10">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
          <div>
            <h3 className="font-semibold text-blue-900 dark:text-blue-100">Simulation Mode</h3>
            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
              This withdrawal is simulated and does not transfer real funds.
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
            {SUPPORTED_ASSETS.map((asset) => (
              <button
                key={asset}
                type="button"
                onClick={() => form.setValue("asset", asset)}
                className={`py-2 px-3 text-sm font-medium rounded-md border transition-colors whitespace-nowrap flex-grow sm:flex-grow-0 text-center ${
                  selectedAsset === asset
                    ? "bg-primary text-white border-primary"
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
            placeholder={`Enter ${selectedAsset} address`}
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
                onClick={() => form.setValue("amount", availableAmount * 0.999)} // Leave a tiny bit for fee if needed
                className="text-xs font-semibold text-primary hover:text-primary"
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
              Insufficient available balance.
            </div>
          )}
        </div>
        
        <div className="bg-muted/30 p-4 rounded-lg border border-border space-y-2 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>Estimated Fee</span>
            <span className="font-mono">{fee.toLocaleString()} {selectedAsset}</span>
          </div>
          <div className="flex justify-between font-medium text-foreground">
            <span>Total Deduction</span>
            <span className="font-mono">{totalDeduction.toLocaleString()} {selectedAsset}</span>
          </div>
        </div>

        <Button type="submit" className="w-full h-12 text-base" disabled={hasInsufficientBalance || totalDeduction <= 0}>
          <ArrowUpFromLine className="w-5 h-5 mr-2" />
          Review Withdrawal
        </Button>
      </form>
    </div>
  );
}
