"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useWalletStore } from "@/stores/wallet-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Info, ArrowDownToLine, Copy, Check } from "lucide-react";
import { useTradingModeStore } from "@/stores/trading-mode-store";

const SUPPORTED_ASSETS = ["USD", "USDT", "USDC", "BTC", "ETH", "SOL"];

const depositSchema = z.object({
  asset: z.string().min(1, "Asset is required"),
  amount: z.number().positive("Amount must be greater than 0").max(100000, "Maximum demo deposit is $100,000"),
});

export function DemoDepositForm({ defaultAsset = "USD" }: { defaultAsset?: string }) {
  const router = useRouter();
  const simulateDeposit = useWalletStore((state) => state.simulateDeposit);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  const form = useForm<z.infer<typeof depositSchema>>({
    resolver: zodResolver(depositSchema),
    defaultValues: {
      asset: defaultAsset.toUpperCase(),
      amount: 1000,
    },
  });

  const { mode } = useTradingModeStore();
  const selectedAsset = form.watch("asset");

  const onSubmit = async (values: z.infer<typeof depositSchema>) => {
    setIsSubmitting(true);
    try {
      await simulateDeposit(values.asset, values.amount, mode);
      router.push("/wallet");
    } catch (error) {
      console.error("Deposit failed", error);
      setIsSubmitting(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText("0xSimulatedDemoTradingAddressOnly");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isFiat = selectedAsset === "USD";

  return (
    <div className="max-w-xl mx-auto bg-card border border-border rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-border bg-blue-50/50 dark:bg-blue-900/10">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
          <div>
            <h3 className="font-semibold text-blue-900 dark:text-blue-100">Simulation Mode</h3>
            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
              This deposit is simulated for Demo Trading and does not transfer real funds or execute on any blockchain.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Choose Asset</label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {SUPPORTED_ASSETS.map((asset) => (
              <button
                key={asset}
                type="button"
                onClick={() => form.setValue("asset", asset)}
                className={`py-2 text-sm font-medium rounded-md border transition-colors ${
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

        {!isFiat && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Simulated Deposit Address</label>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-muted/50 p-3 rounded-md font-mono text-sm text-muted-foreground border border-border overflow-hidden text-ellipsis">
                0xSimulatedDemoTradingAddressOnly
              </div>
              <Button type="button" variant="outline" size="icon" onClick={handleCopy} className="shrink-0">
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">Network: {selectedAsset} Native Network (Simulated)</p>
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Amount</label>
          <div className="relative">
            <Input
              type="number"
              step="any"
              {...form.register("amount", { valueAsNumber: true })}
              className="pl-4 pr-16 h-12 text-lg font-medium"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 font-semibold text-muted-foreground">
              {selectedAsset}
            </div>
          </div>
          {form.formState.errors.amount && (
            <p className="text-sm text-red-500">{form.formState.errors.amount.message}</p>
          )}
          <p className="text-xs text-muted-foreground text-right">
            Available Simulation Limit: $100,000.00
          </p>
        </div>

        <Button type="submit" className="w-full h-12 text-base" disabled={isSubmitting}>
          {isSubmitting ? (
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
          ) : (
            <ArrowDownToLine className="w-5 h-5 mr-2" />
          )}
          {isSubmitting ? "Processing Deposit..." : "Simulate Deposit"}
        </Button>
      </form>
    </div>
  );
}
