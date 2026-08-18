"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowDownToLine, Copy, Check, Building2, Wallet, FileText, Upload, AlertCircle, MessageCircle } from "lucide-react";
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
  const [manualAddresses, setManualAddresses] = useState<Record<string, string>>({});
  const [cryptoAssets, setCryptoAssets] = useState<string[]>(CRYPTO_ASSETS);
  const [loadingAddresses, setLoadingAddresses] = useState(false);

  const [activeMethods, setActiveMethods] = useState<string[]>([]);

  useEffect(() => {
    fetchDepositSettings();
  }, []);

  const fetchDepositSettings = async () => {
    setLoadingAddresses(true);
    try {
      const res: any = await apiClient.getDepositSettings();
      if (res.success) {
        if (res.activeMethods && res.activeMethods.length > 0) {
          const methods = res.activeMethods.map((m: any) => m.method);
          setActiveMethods(methods);
          
          // Auto-switch tab if current is not enabled
          let mappedMethod = method;
          if (method === 'CRYPTO') mappedMethod = 'AUTO' as any;
          if (method === 'BANK') mappedMethod = 'BANK_TRANSFER' as any;
          
          if (!methods.includes(mappedMethod)) {
             if (methods.includes('AUTO')) setMethod('CRYPTO');
             else if (methods.includes('MANUAL')) setMethod('MANUAL');
             else if (methods.includes('BANK_TRANSFER')) setMethod('BANK');
          }
        }
        
        if (res.manualAddresses) {
          setManualAddresses(res.manualAddresses);
          const assets = Object.keys(res.manualAddresses);
          if (assets.length > 0) {
            setCryptoAssets(assets);
            if (!assets.includes(selectedAsset)) setSelectedAsset(assets[0]);
          }
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAddresses(false);
    }
  };
  
  // Form state
  const [amount, setAmount] = useState("");
  const [transactionHash, setTransactionHash] = useState("");
  const [paymentReference, setPaymentReference] = useState("");
  const [bankCurrency, setBankCurrency] = useState("USD");
  const [proofFile, setProofFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Checkout Modal State
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  
  // Results & Previews
  const [bankDetails, setBankDetails] = useState<any | null>(null);
  const [preview, setPreview] = useState<any | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  useEffect(() => {
    const fetchPreview = async () => {
      const numAmount = Number(amount);
      if (!amount || isNaN(numAmount) || numAmount <= 0) {
        setPreview(null);
        return;
      }
      setPreviewLoading(true);
      try {
        const currency = method === 'BANK' ? bankCurrency : selectedAsset;
        const mappedMethod = method === 'CRYPTO' ? 'AUTO' : method === 'BANK' ? 'BANK_TRANSFER' : 'MANUAL';
        
        // Find methodId if possible
        // Actually, we don't have method list with IDs here easily, wait...
        // We can just pass method string as methodId to the backend and let backend find it by string if needed, 
        // but backend expects ID. Let's modify backend to accept method name if methodId is not uuid.
        
        const res = await apiClient.getDepositPreview(numAmount, currency, mappedMethod);
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
  }, [amount, method, selectedAsset, bankCurrency]);

  const copyToClipboard = (text: string, label: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

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

  const [showAutoDepositError, setShowAutoDepositError] = useState(false);

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
        if (res.error === 'AUTO_DEPOSIT_UNAVAILABLE') {
          setShowAutoDepositError(true);
        } else {
          toast.error(res.error || "Failed to create payment order");
        }
      }
    } catch (error: any) {
      if (error?.message === 'AUTO_DEPOSIT_UNAVAILABLE' || error?.response?.data?.error === 'AUTO_DEPOSIT_UNAVAILABLE') {
        setShowAutoDepositError(true);
      } else {
        toast.error(error.message || "An error occurred");
      }
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
            {activeMethods.includes('MANUAL') && (
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
            )}
            
            {activeMethods.includes('AUTO') && (
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
            )}
            
            {activeMethods.includes('BANK_TRANSFER') && (
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
            )}
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
                  <div className="flex flex-wrap gap-2">
                    {cryptoAssets.map((asset) => (
                      <button
                        key={asset}
                        type="button"
                        onClick={() => setSelectedAsset(asset)}
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

                {loadingAddresses ? (
                  <div className="flex items-center justify-center p-4 text-muted-foreground"><Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading deposit details...</div>
                ) : manualAddresses[selectedAsset] ? (
                  <div className="p-4 bg-brand-500/10 border border-brand-500/20 rounded-lg space-y-2">
                    <label className="text-sm font-semibold text-brand-600 dark:text-brand-400 block">Deposit Address for {selectedAsset}</label>
                    <div className="flex items-center justify-between gap-2 p-3 bg-background border rounded-md group">
                      <span className="font-mono text-sm break-all font-medium">{manualAddresses[selectedAsset]}</span>
                      <button type="button" onClick={() => copyToClipboard(manualAddresses[selectedAsset], `${selectedAsset} Address`)} className="p-2 hover:bg-muted rounded-md shrink-0 transition-colors">
                        <Copy className="w-4 h-4 text-muted-foreground group-hover:text-foreground" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20 rounded-md text-sm flex items-center">
                    <AlertCircle className="w-4 h-4 mr-2 shrink-0" />
                    No deposit address configured for {selectedAsset}. Please select another asset.
                  </div>
                )}

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
                
                {/* Real-time Calculation Breakdown */}
                {amount && Number(amount) > 0 && (
                  <div className="bg-brand-50/50 dark:bg-brand-900/10 border border-brand-500/20 rounded-md p-4 space-y-2 mt-4 text-sm relative">
                    {previewLoading && (
                      <div className="absolute inset-0 bg-background/50 backdrop-blur-[1px] flex items-center justify-center rounded-md z-10">
                        <Loader2 className="w-5 h-5 animate-spin text-brand-600" />
                      </div>
                    )}
                    <h5 className="font-semibold mb-3">Deposit Breakdown</h5>
                    
                    {preview ? (
                      <>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Deposit Amount:</span>
                          <span className="font-medium">{preview.originalAmount.toFixed(2)} {preview.originalCurrency}</span>
                        </div>
                        {preview.originalCurrency !== 'USDT' && (
                          <>
                            <div className="flex justify-between text-xs">
                              <span className="text-muted-foreground">Exchange Rate:</span>
                              <span className="font-medium">1 {preview.originalCurrency} = {preview.conversionRate} USDT</span>
                            </div>
                            <div className="flex justify-between text-brand-600 dark:text-brand-400">
                              <span className="text-muted-foreground text-brand-600 dark:text-brand-400">Converted Value:</span>
                              <span className="font-medium">{preview.grossUsdt.toFixed(2)} USDT</span>
                            </div>
                          </>
                        )}
                        <div className="flex justify-between text-red-500">
                          <span>Deposit Fee:</span>
                          <span>- {preview.totalFees.toFixed(2)} USDT</span>
                        </div>
                        <div className="h-px bg-border my-2"></div>
                        <div className="flex justify-between font-bold text-base">
                          <span>Expected Wallet Credit:</span>
                          <span className="text-emerald-600">{preview.netUsdt.toFixed(2)} USDT</span>
                        </div>
                      </>
                    ) : (
                      <div className="text-muted-foreground italic">Enter an amount to see the calculation</div>
                    )}
                  </div>
                )}
              </div>
            </div>
            <Button type="submit" className="w-full h-12 text-base whitespace-normal h-auto py-3" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="w-5 h-5 animate-spin mr-2 shrink-0" />}
              <span>Submit Manual Deposit</span>
            </Button>
          </form>
        )}

        {method === 'BANK' && (
          <div className="space-y-4 p-6 border border-brand-500/30 bg-brand-500/5 rounded-lg text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-brand-500/10 rounded-full flex items-center justify-center mb-2">
              <Building2 className="w-8 h-8 text-brand-600 dark:text-brand-400" />
            </div>
            <h4 className="font-semibold text-xl mb-2 text-foreground">Direct Bank Transfer</h4>
            <p className="text-muted-foreground mb-4 max-w-md mx-auto text-sm">
              If you want to deposit via direct bank transfer, please contact our support team. We will provide you with the necessary bank details for the transfer.
            </p>
            <div className="w-full max-w-md h-px bg-border my-4"></div>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto text-sm italic">
              Agar aap direct bank transfer se deposit karna chahte hain to hamse contact kijiye, ham aap ko Direct bank transfer ke liye Bank Details bhejenge.
            </p>
            <Button onClick={() => router.push('/support')} className="w-full sm:w-auto px-8 py-6 text-base bg-brand-600 hover:bg-brand-700 text-white shadow-lg shadow-brand-500/20">
              <MessageCircle className="w-5 h-5 mr-2" />
              Contact Support for Bank Details
            </Button>
            
            <div className="w-full mt-8 text-left border-t border-brand-500/20 pt-6">
              <h5 className="font-medium text-foreground mb-4 text-center">Already transferred? Submit details here:</h5>
              <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md mx-auto text-left">
                <div className="space-y-1">
                  <label className="text-sm font-medium">Deposit Amount</label>
                  <div className="flex gap-2">
                    <Input type="number" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" required />
                    <select 
                      value={bankCurrency} 
                      onChange={e => setBankCurrency(e.target.value)}
                      className="border border-border bg-background rounded-md px-3 text-sm focus:outline-none focus:ring-1 focus:ring-brand-primary"
                    >
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                      <option value="INR">INR</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Reference Number / Transaction ID</label>
                  <Input type="text" value={paymentReference} onChange={e => setPaymentReference(e.target.value)} placeholder="Enter Reference" required />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Payment Receipt (Screenshot)</label>
                  <Input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" required />
                </div>
                
                {/* Real-time Calculation Breakdown */}
                {amount && Number(amount) > 0 && (
                  <div className="bg-brand-50/50 dark:bg-brand-900/10 border border-brand-500/20 rounded-md p-4 space-y-2 mt-4 text-sm relative">
                    {previewLoading && (
                      <div className="absolute inset-0 bg-background/50 backdrop-blur-[1px] flex items-center justify-center rounded-md z-10">
                        <Loader2 className="w-5 h-5 animate-spin text-brand-600" />
                      </div>
                    )}
                    <h5 className="font-semibold mb-3">Deposit Breakdown</h5>
                    
                    {preview ? (
                      <>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Deposit Amount:</span>
                          <span className="font-medium">{preview.originalAmount.toFixed(2)} {preview.originalCurrency}</span>
                        </div>
                        {preview.originalCurrency !== 'USDT' && (
                          <>
                            <div className="flex justify-between text-xs">
                              <span className="text-muted-foreground">Exchange Rate:</span>
                              <span className="font-medium">1 {preview.originalCurrency} = {preview.conversionRate} USDT</span>
                            </div>
                            <div className="flex justify-between text-brand-600 dark:text-brand-400">
                              <span className="text-muted-foreground text-brand-600 dark:text-brand-400">Converted Value:</span>
                              <span className="font-medium">{preview.grossUsdt.toFixed(2)} USDT</span>
                            </div>
                          </>
                        )}
                        <div className="flex justify-between text-red-500">
                          <span>Deposit Fee:</span>
                          <span>- {preview.totalFees.toFixed(2)} USDT</span>
                        </div>
                        <div className="h-px bg-border my-2"></div>
                        <div className="flex justify-between font-bold text-base">
                          <span>Expected Wallet Credit:</span>
                          <span className="text-emerald-600">{preview.netUsdt.toFixed(2)} USDT</span>
                        </div>
                      </>
                    ) : (
                      <div className="text-muted-foreground italic">Enter an amount to see the calculation</div>
                    )}
                  </div>
                )}
                
                <Button type="submit" className="w-full h-12 text-base mt-2" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="w-5 h-5 animate-spin mr-2 shrink-0" />}
                  Submit Bank Transfer Details
                </Button>
              </form>
            </div>
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
          
          <div className="w-full space-y-3 mb-6 relative">
            {previewLoading && (
              <div className="absolute inset-0 bg-background/50 backdrop-blur-[1px] flex items-center justify-center rounded-md z-10">
                <Loader2 className="w-5 h-5 animate-spin text-brand-600" />
              </div>
            )}
            <div className="flex justify-between items-start sm:items-center text-sm gap-2">
              <span className="text-muted-foreground shrink-0">Deposit Amount (Wallet):</span>
              <span className="font-bold text-right break-words min-w-0">{Number(amount || 0).toFixed(2)} USD</span>
            </div>
            <div className="flex justify-between items-start sm:items-center text-sm gap-2">
              <span className="text-muted-foreground shrink-0">Extra Fee:</span>
              <span className="font-bold text-red-500 text-right break-words min-w-0">+{preview ? preview.totalFees.toFixed(2) : '0.00'} USD</span>
            </div>
            <div className="h-px bg-border my-2 w-full"></div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 sm:gap-2 w-full">
              <span className="font-medium shrink-0">Total Amount to Pay:</span>
              <span className="text-xl font-bold text-green-600 dark:text-green-500 text-right break-all min-w-0">{preview ? (Number(amount) + preview.totalFees).toFixed(2) : Number(amount || 0).toFixed(2)} USD</span>
            </div>
          </div>
          
          <div className="flex w-full gap-3">
            <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white" onClick={handleCheckoutConfirm} disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              Proceed to Payment
            </Button>
            <Button className="flex-1" variant="secondary" onClick={() => setShowConfirmModal(false)} disabled={isSubmitting}>
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showAutoDepositError} onOpenChange={setShowAutoDepositError}>
        <DialogContent className="sm:max-w-md text-center flex flex-col items-center p-8">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-2">
            <AlertCircle className="w-8 h-8 text-blue-500" />
          </div>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center w-full mb-2">Service Notice</DialogTitle>
            <DialogDescription className="text-center w-full text-brand-700 dark:text-brand-300">
              The automated payment gateway is temporarily unavailable. 
              <br /><br />
              To ensure your funds are deposited securely, please use the Manual Deposit method. We have transferred your requested amount to the manual flow.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex w-full gap-3 mt-4">
            <Button 
              className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold py-6" 
              onClick={() => {
                setShowAutoDepositError(false);
                handleTabChange('MANUAL');
              }}
            >
              Continue with Manual Deposit
            </Button>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}
