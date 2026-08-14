"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowDownToLine, Copy, Check, Building2, Wallet } from "lucide-react";
import { apiClient } from "@ethsltd/api-client";
import { toast } from "sonner";

const CRYPTO_ASSETS = ["USDT", "USDC", "BTC", "ETH", "SOL"];

export function RealDepositForm({ defaultAsset = "USDT" }: { defaultAsset?: string }) {
  const router = useRouter();
  const [method, setMethod] = useState<'CRYPTO' | 'BANK'>('CRYPTO');
  const [selectedAsset, setSelectedAsset] = useState(CRYPTO_ASSETS.includes(defaultAsset.toUpperCase()) ? defaultAsset.toUpperCase() : "USDT");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Results
  const [depositAddress, setDepositAddress] = useState<string | null>(null);
  const [bankDetails, setBankDetails] = useState<any | null>(null);

  const handleCopy = () => {
    if (depositAddress) {
      navigator.clipboard.writeText(depositAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("Address copied to clipboard");
    }
  };

  const handleGenerate = async () => {
    setIsSubmitting(true);
    try {
      const res = await apiClient.deposit({
        assetSymbol: selectedAsset,
        amount: 0, // Initial address generation has no specific amount
        mode: 'REAL',
        depositMethod: method
      });

      if (res.success) {
        if (method === 'CRYPTO') {
          setDepositAddress(res.address);
        } else {
          setBankDetails(res.bankDetails);
        }
      } else {
        toast.error(res.error || "Failed to initiate deposit");
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-card border border-border rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-border bg-brand-50/50 dark:bg-brand-900/10">
        <h3 className="font-semibold text-brand-900 dark:text-brand-100 flex items-center gap-2">
          <Wallet className="w-5 h-5" />
          Real Money Deposit
        </h3>
        <p className="text-sm text-brand-700 dark:text-brand-300 mt-1">
          Deposit actual funds into your account. Please ensure you select the correct network.
        </p>
      </div>

      <div className="p-6 space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Deposit Method</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => { setMethod('CRYPTO'); setDepositAddress(null); }}
              className={`py-3 text-sm font-medium rounded-md border flex flex-col items-center justify-center gap-2 transition-colors ${
                method === 'CRYPTO'
                  ? "bg-brand-500 text-white border-brand-500"
                  : "bg-background text-muted-foreground border-border hover:bg-muted"
              }`}
            >
              <Wallet className="w-5 h-5" />
              Crypto Transfer
            </button>
            <button
              type="button"
              onClick={() => { setMethod('BANK'); setBankDetails(null); }}
              className={`py-3 text-sm font-medium rounded-md border flex flex-col items-center justify-center gap-2 transition-colors ${
                method === 'BANK'
                  ? "bg-brand-500 text-white border-brand-500"
                  : "bg-background text-muted-foreground border-border hover:bg-muted"
              }`}
            >
              <Building2 className="w-5 h-5" />
              Bank Transfer
            </button>
          </div>
        </div>

        {method === 'CRYPTO' && (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Choose Asset</label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {CRYPTO_ASSETS.map((asset) => (
                  <button
                    key={asset}
                    type="button"
                    onClick={() => { setSelectedAsset(asset); setDepositAddress(null); }}
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

            {!depositAddress ? (
              <Button type="button" onClick={handleGenerate} className="w-full h-12 text-base" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <ArrowDownToLine className="w-5 h-5 mr-2" />}
                Generate Deposit Address
              </Button>
            ) : (
              <div className="space-y-4 p-4 border border-brand-500/30 bg-brand-500/5 rounded-lg">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Deposit Address ({selectedAsset})</label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-background p-3 rounded-md font-mono text-sm text-foreground border border-border overflow-hidden text-ellipsis">
                      {depositAddress}
                    </div>
                    <Button type="button" variant="outline" size="icon" onClick={handleCopy} className="shrink-0">
                      {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                  <p className="text-xs text-amber-500 font-medium">Send ONLY {selectedAsset} to this address. Any other asset may be lost permanently.</p>
                </div>
              </div>
            )}
          </>
        )}

        {method === 'BANK' && (
          <div className="space-y-4">
            {!bankDetails ? (
              <Button type="button" onClick={handleGenerate} className="w-full h-12 text-base" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Building2 className="w-5 h-5 mr-2" />}
                View Bank Instructions
              </Button>
            ) : (
              <div className="space-y-4 p-4 border border-brand-500/30 bg-brand-500/5 rounded-lg">
                <h4 className="font-semibold">Bank Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between border-b border-border pb-2">
                    <span className="text-muted-foreground">Account Name</span>
                    <span className="font-medium">{bankDetails.accountName}</span>
                  </div>
                  <div className="flex justify-between border-b border-border pb-2">
                    <span className="text-muted-foreground">Account Number</span>
                    <span className="font-medium">{bankDetails.accountNumber}</span>
                  </div>
                  <div className="flex justify-between border-b border-border pb-2">
                    <span className="text-muted-foreground">Bank Name</span>
                    <span className="font-medium">{bankDetails.bankName}</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">After making the transfer, please contact support with your proof of payment to credit your account.</p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
