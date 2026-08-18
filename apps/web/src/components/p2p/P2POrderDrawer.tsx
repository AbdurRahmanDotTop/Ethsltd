"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiClient } from "@ethsltd/api-client";
import { P2PAdvertisement, P2PMerchant, P2POrder } from "@/lib/p2p/types";
import { toast } from "sonner";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { p2pOrderSchema, P2POrderInput } from "@/lib/validation/p2p";
import { useP2PStore } from "@/stores/p2p-store";
import { FIAT_CURRENCIES } from "@/lib/p2p/constants";
import { X, CheckCircle2, ShieldCheck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTradingModeStore } from "@/stores/trading-mode-store";

interface P2POrderDrawerProps {
  ad: P2PAdvertisement | null;
  merchant: P2PMerchant | null;
  onClose: () => void;
}

export function P2POrderDrawer({ ad, merchant, onClose }: P2POrderDrawerProps) {
  const router = useRouter();
  const requireAuth = useRequireAuth();
  const { query } = useP2PStore();
  const { mode } = useTradingModeStore();
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<P2POrderInput>({
    resolver: zodResolver(p2pOrderSchema),
    defaultValues: {
      fiatAmount: undefined,
      cryptoAmount: undefined,
      paymentMethod: (ad && ad.paymentMethods.length > 0 ? (typeof ad.paymentMethods[0] === 'string' ? ad.paymentMethods[0] : (ad.paymentMethods[0] as any).type) : ""),
    },
  });

  const fiatAmount = useWatch({ control, name: "fiatAmount" });
  const cryptoAmount = useWatch({ control, name: "cryptoAmount" });

  // Update crypto/fiat relative to each other based on ad price
  useEffect(() => {
    if (ad && fiatAmount !== undefined && document.activeElement?.id === "fiatAmount") {
      setValue("cryptoAmount", fiatAmount / ad.price, { shouldValidate: true });
    }
  }, [fiatAmount, ad, setValue]);

  useEffect(() => {
    if (ad && cryptoAmount !== undefined && document.activeElement?.id === "cryptoAmount") {
      setValue("fiatAmount", cryptoAmount * ad.price, { shouldValidate: true });
    }
  }, [cryptoAmount, ad, setValue]);

  // When drawer opens, initialize the payment method
  useEffect(() => {
    if (ad && ad.paymentMethods.length > 0) {
      const pm = ad.paymentMethods[0];
      setValue("paymentMethod", typeof pm === 'string' ? pm : (pm as any).type);
    }
  }, [ad, setValue]);

  if (!ad || !merchant) return null;

  const fiatSymbol = FIAT_CURRENCIES.find(f => f.code === ad.fiat)?.symbol || "$";
  const userSideLabel = query.side === "buy" ? "Pay" : "Sell";
  const userReceiveLabel = query.side === "buy" ? "Receive" : "Receive";

  const onSubmit = async (data: any) => {
    // Validate min/max limit explicitly
    if (data.fiatAmount < ad.minLimit) {
      toast.error(`Minimum order amount is ${fiatSymbol}${ad.minLimit.toLocaleString()}`);
      return;
    }
    if (data.fiatAmount > ad.maxLimit) {
      toast.error(`Maximum order amount is ${fiatSymbol}${ad.maxLimit.toLocaleString()}`);
      return;
    }
    if (data.cryptoAmount > ad.availableAmount) {
      toast.error(`This advertisement does not have enough available crypto.`);
      return;
    }

    requireAuth(async () => {
      setIsSubmittingOrder(true);
      
      try {
        const res = await apiClient.createP2pOrder({
          adId: ad.id,
          cryptoAmount: data.cryptoAmount.toString(),
          fiatAmount: data.fiatAmount.toString(),
          paymentMethod: data.paymentMethod,
        });

        if (res.success) {
          onClose();
          // Navigate to order workspace
          router.push(`/p2p/order/${(res as any).orderId}`);
        } else {
          toast.error(res.error || 'Failed to create order');
        }
      } catch(e) {
        toast.error('Failed to place order');
      } finally {
        setIsSubmittingOrder(false);
      }
    }, `To place a ${ad.side === "buy" ? "Sell" : "Buy"} order, please log in to your account.`);
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 transition-opacity" 
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 w-full md:w-[500px] bg-card border-l border-border shadow-2xl z-50 flex flex-col transform transition-transform duration-300">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-bold">Advertisement Details</h2>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-full text-muted-foreground transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {/* Merchant Info */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 font-bold flex items-center justify-center text-lg">
                {merchant.displayName.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-lg">{merchant.displayName}</span>
                  {merchant.verified && <CheckCircle2 className="w-4 h-4 text-brand-500" />}
                </div>
                <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                  <span className="text-green-600 dark:text-green-500 font-medium">{merchant.completionRate}% completion</span>
                  <span>•</span>
                  <span>{merchant.totalOrders} orders</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-y-4 gap-x-6 pt-4 border-t border-border">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Price</p>
              <p className="font-display font-bold text-xl text-brand-600 dark:text-brand-400">
                {fiatSymbol}{ad.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Available</p>
              <p className="font-mono font-medium">{ad.availableAmount.toLocaleString()} {ad.asset}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Order Limit</p>
              <p className="font-mono text-sm">{fiatSymbol}{ad.minLimit.toLocaleString()} - {fiatSymbol}{ad.maxLimit.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Avg. Release Time</p>
              <p className="text-sm font-medium">{merchant.averageReleaseTime} minutes</p>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-border">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Merchant Terms</h3>
            <p className="text-sm bg-muted/50 p-4 rounded-lg border border-border leading-relaxed text-muted-foreground">
              {ad.terms}
            </p>
          </div>

          {/* Order Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-6 border-t border-border">
            
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="fiatAmount">I want to {userSideLabel}</Label>
                  <span className="text-xs text-muted-foreground">Limit: {fiatSymbol}{ad.minLimit} - {fiatSymbol}{ad.maxLimit}</span>
                </div>
                <div className="relative">
                  <Input 
                    id="fiatAmount" 
                    type="number" 
                    step="any" 
                    placeholder={`Enter ${ad.fiat} amount`} 
                    {...register("fiatAmount", { valueAsNumber: true })}
                    className="pr-16"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-muted-foreground font-medium text-sm">
                    {ad.fiat}
                  </div>
                </div>
                {errors.fiatAmount && <p className="text-xs text-destructive">{errors.fiatAmount.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="cryptoAmount">I will {userReceiveLabel}</Label>
                <div className="relative">
                  <Input 
                    id="cryptoAmount" 
                    type="number" 
                    step="any"
                    placeholder={`Enter ${ad.asset} amount`} 
                    {...register("cryptoAmount", { valueAsNumber: true })}
                    className="pr-16"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-muted-foreground font-medium text-sm">
                    {ad.asset}
                  </div>
                </div>
                {errors.cryptoAmount && <p className="text-xs text-destructive">{errors.cryptoAmount.message}</p>}
              </div>

              <div className="space-y-2">
                <Label>Select Payment Method</Label>
                <div className="grid grid-cols-1 gap-2">
                  {ad.paymentMethods.map((methodObj, idx) => {
                    const method = typeof methodObj === 'string' ? methodObj : (methodObj as any).type;
                    const methodId = typeof methodObj === 'string' ? methodObj : (methodObj as any).id || method;
                    
                    return (
                      <label 
                        key={methodId}
                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                          useWatch({ control, name: "paymentMethod" }) === method
                            ? "border-brand-500 bg-brand-50 dark:bg-brand-900/20"
                            : "border-border hover:bg-muted"
                        }`}
                      >
                        <input 
                          type="radio" 
                          value={method} 
                          {...register("paymentMethod")} 
                          className="text-brand-600 focus:ring-brand-500 h-4 w-4"
                        />
                        <span className="text-sm font-medium">{method.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}</span>
                      </label>
                    );
                  })}
                </div>
                {errors.paymentMethod && <p className="text-xs text-destructive">{errors.paymentMethod.message}</p>}
              </div>
            </div>

            <div className="bg-green-50 dark:bg-green-900/10 text-green-800 dark:text-green-400 p-4 rounded-lg flex items-start gap-3 border border-green-200 dark:border-green-900/50">
              <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold mb-1">{mode === 'DEMO' ? 'Simulated Escrow Protection' : 'Escrow Protection'}</p>
                <p>The cryptocurrency will be held in {mode === 'DEMO' ? 'a simulated escrow' : 'escrow'} until the transaction is fully complete.</p>
              </div>
            </div>

            <Button type="submit" className="w-full h-12 text-base font-semibold" disabled={isSubmittingOrder}>
              {isSubmittingOrder ? (
                <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Creating Order...</>
              ) : (
                query.side === "buy" ? `Buy ${ad.asset}` : `Sell ${ad.asset}`
              )}
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}
