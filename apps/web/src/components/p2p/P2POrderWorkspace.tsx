"use client";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@ethsltd/api-client";
import { P2PMerchant } from "@/lib/p2p/types";
import { FIAT_CURRENCIES } from "@/lib/p2p/constants";
import { P2PChat } from "@/components/p2p/P2PChat";
import { Loader2, AlertCircle, Copy, CheckCircle2, Clock, Check, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTradingModeStore } from "@/stores/trading-mode-store";

interface P2POrderWorkspaceProps {
  orderId: string;
}

export function P2POrderWorkspace({ orderId }: P2POrderWorkspaceProps) {
  const router = useRouter();
  const { mode } = useTradingModeStore();
  const [order, setOrder] = useState<any>(null);
  const [merchant, setMerchant] = useState<P2PMerchant | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    // Get current user to determine roles
    const userStr = localStorage.getItem('ethsltd_auth_user');
    if (userStr) {
      setCurrentUser(JSON.parse(userStr));
    }
  }, []);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let isSubscribed = true;

    const fetchOrderData = async (isPolling = false) => {
      try {
        const res = await apiClient.getP2pOrder(orderId);
        if (res.success && res.data && isSubscribed) {
          setOrder(res.data);
          if (res.merchant) {
            setMerchant(res.merchant);
          }
          
          // Poll every 10 seconds if order is active
          if (['CREATED', 'PAYMENT_PENDING', 'BUYER_MARKED_PAID', 'SELLER_PAYMENT_REVIEW'].includes(res.data.status)) {
            timeoutId = setTimeout(() => fetchOrderData(true), 10000);
          }
        }
      } catch(e) {
        console.error("Failed to load order", e);
      } finally {
        if (!isPolling && isSubscribed) {
          setIsLoading(false);
        }
      }
    };
    
    fetchOrderData();

    return () => {
      isSubscribed = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [orderId]);

  // Countdown timer logic
  useEffect(() => {
    if (order && (order.status === "CREATED" || order.status === "PAYMENT_PENDING")) {
      const updateTimer = () => {
        const expiry = new Date(order.expiresAt).getTime();
        const now = Date.now();
        const diff = Math.max(0, Math.floor((expiry - now) / 1000));
        setTimeLeft(diff);
        
        // Auto-refresh order if expired
        if (diff === 0 && order.status !== "EXPIRED") {
          window.location.reload();
        }
      };
      
      updateTimer();
      const interval = setInterval(updateTimer, 1000);
      return () => clearInterval(interval);
    }
  }, [order]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!order || !merchant) {
    return (
      <div className="text-center py-24">
        <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Order Not Found</h2>
        <p className="text-muted-foreground mb-6">This order does not exist or you do not have permission to view it.</p>
        <Button onClick={() => router.push("/p2p")}>Back to Marketplace</Button>
      </div>
    );
  }

  const fiatSymbol = FIAT_CURRENCIES.find(f => f.code === order.fiatCurrency)?.symbol || order.fiatCurrency || "$";
  const isBuy = order.role === 'BUYER';
  const perms = order.permissions || {};
  
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleMarkPaid = async () => {
    try {
      const res = await apiClient.updateP2pOrderStatus(order.id, "pay");
      if (res.success) {
        setOrder({ 
          ...order, 
          status: "BUYER_MARKED_PAID",
          permissions: {
            ...(order.permissions || {}),
            canMarkPaid: false,
            canCancel: false,
            canDispute: true
          }
        });
        toast.success("Payment marked as complete.");
        
        if (mode === 'DEMO') {
          // Simulate Merchant releasing crypto after a delay for demo
          setTimeout(async () => {
            await apiClient.updateP2pOrderStatus(order.id, "release");
            setOrder({ ...order, status: "COMPLETED" });
          }, 4000);
        }
      } else {
        toast.error(res.error || "Failed to mark paid.");
      }
    } catch(e) {
      toast.error("Error marking paid.");
    }
  };

  const handleCancel = async () => {
    const confirmMessage = mode === 'DEMO' 
      ? "Are you sure you want to cancel this order? This will release the simulated escrow."
      : "Are you sure you want to cancel this order? This will release the escrow.";
    if (confirm(confirmMessage)) {
      try {
        const res = await apiClient.updateP2pOrderStatus(order.id, "cancel");
        if (res.success) {
          setOrder({ ...order, status: "CANCELLED" });
          toast.success("Order cancelled.");
        } else {
          toast.error(res.error || "Failed to cancel.");
        }
      } catch(e) {
        toast.error("Error cancelling order.");
      }
    }
  };

  const handleDispute = async () => {
    if (confirm("Are you sure you want to open a dispute? An admin will review this trade.")) {
      try {
        const res = await apiClient.updateP2pOrderStatus(order.id, "dispute");
        if (res.success) {
          setOrder({ ...order, status: "DISPUTED" });
          toast.success("Dispute opened. Support will contact you shortly.");
        } else {
          toast.error(res.error || "Failed to open dispute.");
        }
      } catch(e) {
        toast.error("Error opening dispute.");
      }
    }
  };

  let parsedDetails: Record<string, string> | null = null;
  try {
    if (order.paymentDetails) {
      parsedDetails = JSON.parse(order.paymentDetails);
    }
  } catch (e) {
    console.error("Failed to parse payment details", e);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Left Column: Status and Order Details */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Header / Status Alert */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm flex items-center justify-between flex-wrap gap-y-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight mb-1">
              Order {order.displayId || order.id}
            </h1>
            <p className="text-muted-foreground flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                order.status === "COMPLETED" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                order.status === "CANCELLED" || order.status === "EXPIRED" || order.status === "DISPUTED" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" :
                "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
              }`}>
                {order.status.replace(/_/g, " ")}
              </span>
              <span>•</span>
              <span>{isBuy ? "Buy" : "Sell"} {order.asset}</span>
            </p>
          </div>
          
          {(order.status === "CREATED" || order.status === "PAYMENT_PENDING") && (
            <div className="text-right">
              <p className="text-sm text-muted-foreground mb-1">Time remaining to pay</p>
              <div className="text-2xl font-mono font-bold text-orange-600 dark:text-orange-400 flex items-center justify-end gap-2">
                <Clock className="w-5 h-5" />
                {formatTime(timeLeft)}
              </div>
            </div>
          )}
        </div>

        {/* Order Details & Payment Instructions */}
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border">
            <h3 className="font-semibold text-lg">Transaction Summary</h3>
          </div>
          
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-border flex-wrap gap-y-4">
                <span className="text-muted-foreground text-sm">
                  {isBuy ? "You Need To Pay" : "You Should Receive"}
                </span>
                <span className="text-xl font-bold font-display text-primary dark:text-primary">
                  {fiatSymbol}{parseFloat(order.fiatAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {order.fiatCurrency}
                </span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-border flex-wrap gap-y-4">
                <span className="text-muted-foreground text-sm">
                  {isBuy ? "Receive Crypto" : "Crypto Locked In Escrow"}
                </span>
                <span className="text-xl font-bold font-mono">
                  {parseFloat(order.cryptoAmount).toLocaleString()} {order.asset}
                </span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-border flex-wrap gap-y-4">
                <span className="text-muted-foreground text-sm">Price</span>
                <span className="font-medium">
                  {fiatSymbol}{parseFloat(order.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {order.fiatCurrency} / {order.asset}
                </span>
              </div>
            </div>

            <div className="space-y-4 bg-muted/30 p-4 rounded-lg border border-border">
              <h4 className="font-semibold text-sm flex items-center gap-2 text-primary dark:text-primary">
                <Info className="w-4 h-4" /> {mode === 'DEMO' ? 'SIMULATED ' : ''}PAYMENT DETAILS
              </h4>
              <p className="text-xs text-muted-foreground mb-4">
                {mode === 'DEMO' 
                  ? 'Please simulate transferring funds to the merchant using the details below. This is a demo environment.'
                  : 'Please transfer funds to the merchant using the details below. Ensure you use the correct reference number.'}
              </p>
              
              <div className="space-y-3">
                <div>
                  <span className="text-xs text-muted-foreground block mb-1">Method</span>
                  <span className="font-medium">{order.paymentMethod.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}</span>
                </div>
                
                {parsedDetails ? (
                  Object.entries(parsedDetails).map(([k, v]) => (
                    <div key={k}>
                      <span className="text-xs text-muted-foreground block mb-1">
                        {k.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </span>
                      <div className="flex justify-between items-center bg-background px-3 py-2 rounded border border-border flex-wrap gap-y-4">
                        <span className="font-mono text-sm">{v}</span>
                        <button onClick={() => copyToClipboard(v, k)} className="text-muted-foreground hover:text-foreground">
                          {copiedField === k ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <>
                    <div>
                      <span className="text-xs text-muted-foreground block mb-1">Recipient Name</span>
                      <div className="flex justify-between items-center bg-background px-3 py-2 rounded border border-border flex-wrap gap-y-4">
                        <span className="font-mono text-sm">{merchant.displayName}</span>
                        <button onClick={() => copyToClipboard(merchant.displayName, "name")} className="text-muted-foreground hover:text-foreground">
                          {copiedField === "name" ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <span className="text-xs text-muted-foreground block mb-1">{mode === 'DEMO' ? 'Simulated Account / ID' : 'Account / ID'}</span>
                      <div className="flex justify-between items-center bg-background px-3 py-2 rounded border border-border flex-wrap gap-y-4">
                        <span className="font-mono text-sm">
                          {mode === 'DEMO' ? `${merchant.username.toLowerCase()}@ethsltd.demo` : `${merchant.username.toLowerCase()}@bank.local`}
                        </span>
                        <button onClick={() => copyToClipboard(mode === 'DEMO' ? `${merchant.username.toLowerCase()}@ethsltd.demo` : `${merchant.username.toLowerCase()}@bank.local`, "account")} className="text-muted-foreground hover:text-foreground">
                          {copiedField === "account" ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <span className="text-xs text-muted-foreground block mb-1">Reference Number (Required)</span>
                  <div className="flex justify-between items-center bg-background px-3 py-2 rounded border border-border flex-wrap gap-y-4">
                    <span className="font-mono text-sm">{order.displayId || order.id}</span>
                    <button onClick={() => copyToClipboard(order.displayId || order.id, "ref")} className="text-muted-foreground hover:text-foreground">
                      {copiedField === "ref" ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {perms.canMarkPaid && (
            <div className="p-6 bg-muted/10 border-t border-border flex flex-col sm:flex-row gap-4 items-center justify-end">
              {perms.canCancel && (
                <Button variant="outline" onClick={handleCancel}>
                  Cancel Order
                </Button>
              )}
              <Button size="lg" className="w-full sm:w-auto" onClick={handleMarkPaid}>
                I've Paid
              </Button>
            </div>
          )}

          {order.status === "PAYMENT_PENDING" && !isBuy && (
            <div className="p-6 bg-muted/10 border-t border-border flex flex-col items-center justify-center text-center">
              <h3 className="font-semibold text-lg mb-1">Awaiting Buyer Payment</h3>
              <p className="text-sm text-muted-foreground">The buyer has {formatTime(timeLeft)} to complete the payment.</p>
            </div>
          )}

          {(order.status === "BUYER_MARKED_PAID" || order.status === "SELLER_PAYMENT_REVIEW") && isBuy && (
            <div className="p-6 bg-blue-50 dark:bg-blue-900/10 border-t border-blue-100 dark:border-blue-900/50 flex flex-col items-center justify-center text-center">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600 dark:text-blue-400 mb-4" />
              <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-1">Awaiting Merchant Release</h3>
              <p className="text-sm text-blue-800/80 dark:text-blue-400/80 max-w-md">
                You have marked the payment as complete. The merchant is verifying the funds and will release the crypto shortly.
              </p>
              {perms.canDispute && (
                <Button variant="outline" className="mt-6" size="sm" onClick={handleDispute}>
                  Open Dispute {mode === 'DEMO' ? '(Simulation)' : ''}
                </Button>
              )}
            </div>
          )}

          {perms.canReleaseCrypto && (
            <div className="p-6 bg-blue-50 dark:bg-blue-900/10 border-t border-blue-100 dark:border-blue-900/50 flex flex-col items-center justify-center text-center">
              <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-1">Buyer Marked as Paid</h3>
              <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-400 border border-red-200 dark:border-red-900/50 p-4 rounded-lg my-4 max-w-lg text-left">
                <p className="text-sm font-semibold mb-1 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" /> 
                  Verify Before Releasing Crypto
                </p>
                <p className="text-sm">
                  Please log in directly to your bank or payment account to verify that you have received exactly <strong>{fiatSymbol}{parseFloat(order.fiatAmount).toLocaleString()} {order.fiatCurrency}</strong>. Do not rely solely on screenshots provided by the buyer.
                </p>
              </div>
              <div className="flex gap-4 mt-2">
                {perms.canDispute && (
                  <Button variant="outline" size="lg" onClick={handleDispute}>Open Dispute</Button>
                )}
                <Button size="lg" onClick={async () => {
                  try {
                    const res = await apiClient.updateP2pOrderStatus(order.id, "release");
                    if (res.success) {
                      setOrder({ ...order, status: "COMPLETED" });
                      toast.success("Crypto released successfully.");
                    } else {
                      toast.error(res.error || "Failed to release crypto.");
                    }
                  } catch(e) {
                    toast.error("Error releasing crypto.");
                  }
                }}>Confirm Payment Received & Release</Button>
              </div>
            </div>
          )}

          {order.status === "COMPLETED" && (
            <div className="p-6 bg-green-50 dark:bg-green-900/10 border-t border-green-200 dark:border-green-900/50 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                <Check className="w-8 h-8 text-green-600 dark:text-green-500" />
              </div>
              <h3 className="text-xl font-bold text-green-900 dark:text-green-300 mb-2">Order Completed Successfully</h3>
              <p className="text-green-800/80 dark:text-green-400/80 max-w-md">
                The crypto has been transferred to your wallet. Thank you for trading on ETHSLTD!
              </p>
            </div>
          )}

          {order.status === "DISPUTED" && (
            <div className="p-6 bg-red-50 dark:bg-red-900/10 border-t border-red-200 dark:border-red-900/50 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-red-900 dark:text-red-300 mb-2">Order is under Dispute</h3>
              <p className="text-red-800/80 dark:text-red-400/80 max-w-md">
                An administrator is reviewing this transaction and will resolve it shortly. Please check the chat or your email for updates.
              </p>
            </div>
          )}

          {order.status === "EXPIRED" && (
            <div className="p-6 bg-gray-50 dark:bg-gray-900/10 border-t border-gray-200 dark:border-gray-900/50 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-900/30 rounded-full flex items-center justify-center mb-4">
                <Clock className="w-8 h-8 text-gray-600 dark:text-gray-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-300 mb-2">Order Expired</h3>
              <p className="text-gray-800/80 dark:text-gray-400/80 max-w-md">
                The payment time window has closed and the crypto has been returned to the seller.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Chat */}
      <div className="h-[600px] lg:h-auto">
        <P2PChat order={order} merchant={merchant} />
      </div>

    </div>
  );
}
