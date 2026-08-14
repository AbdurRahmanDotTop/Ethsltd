"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowDownToLine, Copy, Check, Building2, Wallet, FileText, Upload, AlertCircle } from "lucide-react";
import { apiClient } from "@ethsltd/api-client";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";

const CRYPTO_ASSETS = ["USDT", "USDC", "BTC", "ETH", "SOL"];

export function RealDepositForm({ defaultAsset = "USDT" }: { defaultAsset?: string }) {
  const router = useRouter();
  const [method, setMethod] = useState<'CRYPTO' | 'MANUAL' | 'BANK'>('CRYPTO');
  const [selectedAsset, setSelectedAsset] = useState(CRYPTO_ASSETS.includes(defaultAsset.toUpperCase()) ? defaultAsset.toUpperCase() : "USDT");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Form state
  const [amount, setAmount] = useState("");
  const [transactionHash, setTransactionHash] = useState("");
  const [paymentReference, setPaymentReference] = useState("");
  const [bankCurrency, setBankCurrency] = useState("USD");
  const [proofFile, setProofFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Checkout Modal State
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const FEE_PERCENTAGE = 0.01; // 1% fee
  
  // Results
  const [bankDetails, setBankDetails] = useState<any | null>(null);

  const resetForm = () => {
    setAmount("");
    setTransactionHash("");
    setPaymentReference("");
    setProofFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleTabChange = (newMethod: 'CRYPTO' | 'MANUAL' | 'BANK') => {
    setMethod(newMethod);
    resetForm();
    if (newMethod === 'BANK') setBankDetails(null);
  };

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);
    try {
      if (method === 'CRYPTO') {
        // Just show the confirm modal for AUTO checkout
        if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
          toast.error("Please enter a valid amount");
          setIsSubmitting(false);
          return;
        }
        setShowConfirmModal(true);
        setIsSubmitting(false);
      } else {
        const res = await apiClient.deposit({
          assetSymbol: method === 'BANK' ? bankCurrency : selectedAsset,
          amount: 0,
          mode: 'REAL',
          depositMethod: method
        });

        if (res.success) {
          setBankDetails(res.bankDetails);
        } else {
          toast.error(res.error || "Failed to initiate deposit");
        }
        setIsSubmitting(false);
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
      setIsSubmitting(false);
    }
  };

  const handleCheckoutConfirm = async () => {
    setIsSubmitting(true);
    setShowConfirmModal(false);
    try {
      const res = await apiClient.deposit({
        assetSymbol: 'USD',
        amount: Number(amount),
        mode: 'REAL',
        depositMethod: 'AUTO'
      });

      if (res.success && res.checkoutUrl) {
        // Redirect to Cregis Payment Engine
        window.location.href = res.checkoutUrl;
      } else {
        toast.error(res.error || "Failed to create payment order");
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProofFile(e.target.files[0]);
    }
  };

  const toBase64 = (file: File) => new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      return toast.error("Please enter a valid amount");
    }
    
    setIsSubmitting(true);
    try {
      let proofFileUrl = "";
      if (proofFile) {
        proofFileUrl = await toBase64(proofFile);
      }

      const res = await apiClient.deposit({
        assetSymbol: method === 'BANK' ? bankCurrency : selectedAsset,
        amount: Number(amount),
        mode: 'REAL',
        depositMethod: method,
        transactionHash: method === 'MANUAL' ? transactionHash : undefined,
        paymentReference: method === 'BANK' ? paymentReference : undefined,
        proofFileUrl
      });

      if (res.success) {
        toast.success(res.message || "Deposit submitted successfully");
        resetForm();
      } else {
        toast.error(res.error || "Failed to submit deposit");
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
          <label className="text-sm font-medium text-foreground">Select Payment Method</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleTabChange('MANUAL')}
              className={`py-3 px-2 text-sm font-medium rounded-md border flex flex-col items-center justify-center gap-2 transition-colors break-words text-center h-auto min-h-[80px] ${
                method === 'MANUAL'
                  ? "bg-brand-900 text-white border-brand-900"
                  : "bg-background text-muted-foreground border-border hover:bg-muted"
              }`}
            >
              <FileText className="w-5 h-5 shrink-0" />
              <span className="leading-tight">Manual Deposit</span>
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('CRYPTO')}
              className={`py-3 px-2 text-sm font-medium rounded-md border flex flex-col items-center justify-center gap-2 transition-colors break-words text-center h-auto min-h-[80px] ${
                method === 'CRYPTO'
                  ? "bg-brand-900 text-white border-brand-900"
                  : "bg-background text-muted-foreground border-border hover:bg-muted"
              }`}
            >
              <Wallet className="w-5 h-5 shrink-0" />
              <span className="leading-tight">Auto Deposit</span>
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('BANK')}
              className={`py-3 px-2 text-sm font-medium rounded-md border flex flex-col items-center justify-center gap-2 transition-colors break-words text-center h-auto min-h-[80px] ${
                method === 'BANK'
                  ? "bg-brand-900 text-white border-brand-900"
                  : "bg-background text-muted-foreground border-border hover:bg-muted"
              }`}
            >
              <Building2 className="w-5 h-5 shrink-0" />
              <span className="leading-tight">Bank Transfer</span>
            </button>
          </div>
        </div>

        {method === 'CRYPTO' && (
          <form onSubmit={handleGenerate} className="space-y-4">
            <div className="space-y-1">
              <h4 className="font-semibold text-lg break-words">Secure Ethsltd Payment Gateway</h4>
              <p className="text-sm text-muted-foreground">Make instant payments using our secure payment gateway. Your transaction will be processed immediately.</p>
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-medium">Amount (USD)</label>
              <Input type="number" step="any" value={amount} onChange={e => setAmount(e.target.value)} placeholder="e.g. 100.00" required />
            </div>

            <Button type="submit" className="w-full h-12 text-base bg-emerald-600 hover:bg-emerald-700 text-white whitespace-normal h-auto py-3" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="w-5 h-5 animate-spin mr-2 shrink-0" />}
              <span>Checkout with Ethsltd</span>
            </Button>
          </form>
        )}

        {method === 'MANUAL' && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4 p-4 border border-brand-500/30 bg-brand-500/5 rounded-lg">
              <h4 className="font-semibold">Submit Manual Deposit Details</h4>
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-sm font-medium">Asset</label>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {CRYPTO_ASSETS.map((asset) => (
                      <button
                        key={asset}
                        type="button"
                        onClick={() => setSelectedAsset(asset)}
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
                <div className="space-y-1">
                  <label className="text-sm font-medium">Amount</label>
                  <Input type="number" step="any" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" required />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Transaction Hash (TXID)</label>
                  <Input type="text" value={transactionHash} onChange={e => setTransactionHash(e.target.value)} placeholder="Enter HASH" required />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Payment Receipt (Screenshot)</label>
                  <Input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" required />
                </div>
              </div>
            </div>
            <Button type="submit" className="w-full h-12 text-base whitespace-normal h-auto py-3" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="w-5 h-5 animate-spin mr-2 shrink-0" />}
              <span>Submit Manual Deposit</span>
            </Button>
          </form>
        )}

        {method === 'BANK' && (
          <div className="space-y-4">
            {!bankDetails ? (
              <Button type="button" onClick={handleGenerate} className="w-full h-12 text-base" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Building2 className="w-5 h-5 mr-2" />}
                View Bank Instructions
              </Button>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-4 p-4 border border-brand-500/30 bg-brand-500/5 rounded-lg">
                  <h4 className="font-semibold">Bank Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex flex-col sm:flex-row sm:justify-between border-b border-border pb-2 gap-1 sm:gap-4">
                      <span className="text-muted-foreground shrink-0">Account Name</span>
                      <span className="font-medium sm:text-right break-words">{bankDetails.accountName}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between border-b border-border pb-2 gap-1 sm:gap-4">
                      <span className="text-muted-foreground shrink-0">Account Number</span>
                      <span className="font-medium sm:text-right break-words">{bankDetails.accountNumber}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between border-b border-border pb-2 gap-1 sm:gap-4">
                      <span className="text-muted-foreground shrink-0">Bank Name</span>
                      <span className="font-medium sm:text-right break-words">{bankDetails.bankName}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4 p-4 border border-brand-500/30 bg-brand-500/5 rounded-lg">
                  <h4 className="font-semibold">Submit Transfer Details</h4>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-sm font-medium">Currency</label>
                      <Input type="text" value={bankCurrency} onChange={e => setBankCurrency(e.target.value.toUpperCase())} placeholder="USD" required />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium">Amount Transferred</label>
                      <Input type="number" step="any" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" required />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium">Bank Reference / UTR</label>
                      <Input type="text" value={paymentReference} onChange={e => setPaymentReference(e.target.value)} placeholder="Enter UTR" required />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium">Payment Receipt (Optional)</label>
                      <Input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" />
                    </div>
                  </div>
                </div>
                
                <Button type="submit" className="w-full h-12 text-base whitespace-normal h-auto py-3" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="w-5 h-5 animate-spin mr-2 shrink-0" />}
                  <span>Submit Bank Transfer</span>
                </Button>
              </form>
            )}
          </div>
        )}

      </div>

      <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <DialogContent className="sm:max-w-md text-center flex flex-col items-center p-8">
          <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mb-2">
            <AlertCircle className="w-8 h-8 text-orange-500" />
          </div>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center w-full mb-4">Confirm Payment</DialogTitle>
            <DialogDescription className="text-center w-full sr-only">
              Confirm your checkout details
            </DialogDescription>
          </DialogHeader>
          
          <div className="w-full space-y-3 mb-6">
            <div className="flex justify-between items-start sm:items-center text-sm gap-2">
              <span className="text-muted-foreground shrink-0">Deposit Amount (Wallet):</span>
              <span className="font-bold text-right break-words min-w-0">${Number(amount || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-start sm:items-center text-sm gap-2">
              <span className="text-muted-foreground shrink-0">1% Extra Fee:</span>
              <span className="font-bold text-red-500 text-right break-words min-w-0">+${(Number(amount || 0) * FEE_PERCENTAGE).toFixed(2)}</span>
            </div>
            <div className="h-px bg-border my-2 w-full"></div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 sm:gap-2 w-full">
              <span className="font-medium shrink-0">Total Amount to Pay:</span>
              <span className="text-xl font-bold text-green-600 dark:text-green-500 text-right break-all min-w-0">${(Number(amount || 0) * (1 + FEE_PERCENTAGE)).toFixed(2)}</span>
            </div>
          </div>
          
          <div className="flex w-full gap-3">
            <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white" onClick={handleCheckoutConfirm} disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              Proceed to Payment
            </Button>
            <Button className="flex-1 bg-slate-500 hover:bg-slate-600 text-white" variant="secondary" onClick={() => setShowConfirmModal(false)}>
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
