"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useP2PStore } from "@/stores/p2p-store";
import { p2pProvider } from "@/lib/p2p/provider";
import { P2PMerchant, P2POrder } from "@/lib/p2p/types";
import { FIAT_CURRENCIES } from "@/lib/p2p/mock-data";
import { P2PChat } from "@/components/p2p/P2PChat";
import { Loader2, AlertCircle, Copy, CheckCircle2, Clock, Check, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

interface P2POrderWorkspaceProps {
  orderId: string;
}

export function P2POrderWorkspace({ orderId }: P2POrderWorkspaceProps) {
  const router = useRouter();
  const { orders, updateOrderStatus, addMessage } = useP2PStore();
  const [merchant, setMerchant] = useState<P2PMerchant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const order = orders.find(o => o.id === orderId);

  useEffect(() => {
    const fetchMerchant = async () => {
      if (order) {
        const m = await p2pProvider.getMerchant(order.merchantId);
        setMerchant(m);
      }
      setIsLoading(false);
    };
    fetchMerchant();
  }, [order]);

  // Countdown timer logic
  useEffect(() => {
    if (order && (order.status === "CREATED" || order.status === "AWAITING_PAYMENT")) {
      const updateTimer = () => {
        const expiry = new Date(order.expiresAt).getTime();
        const now = Date.now();
        const diff = Math.max(0, Math.floor((expiry - now) / 1000));
        setTimeLeft(diff);
        
        if (diff === 0 && order.status !== "EXPIRED") {
          updateOrderStatus(order.id, "EXPIRED");
        }
      };
      
      updateTimer();
      const interval = setInterval(updateTimer, 1000);
      return () => clearInterval(interval);
    }
  }, [order, updateOrderStatus]);

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

  const fiatSymbol = FIAT_CURRENCIES.find(f => f.code === order.fiat)?.symbol || "$";
  const isBuy = order.side === "sell"; // if ad was sell, user is buying
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

  const handleMarkPaid = () => {
    updateOrderStatus(order.id, "PAYMENT_MARKED");
    addMessage({
      id: `msg_sys_${Date.now()}`,
      orderId: order.id,
      sender: "system",
      message: "Buyer marked payment as complete. Waiting for merchant to confirm.",
      createdAt: new Date().toISOString(),
      read: true,
    });

    // Simulate Merchant releasing crypto after a delay
    setTimeout(() => {
      updateOrderStatus(order.id, "COMPLETED");
      addMessage({
        id: `msg_sys_${Date.now()}`,
        orderId: order.id,
        sender: "system",
        message: "Merchant confirmed payment and released crypto. Order completed successfully.",
        createdAt: new Date().toISOString(),
        read: true,
      });
    }, 4000); // 4 seconds simulated delay for merchant release
  };

  const handleCancel = () => {
    if (confirm("Are you sure you want to cancel this order? This will release the simulated escrow.")) {
      updateOrderStatus(order.id, "CANCELLED");
      addMessage({
        id: `msg_sys_${Date.now()}`,
        orderId: order.id,
        sender: "system",
        message: "Order was cancelled by the user.",
        createdAt: new Date().toISOString(),
        read: true,
      });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Left Column: Status and Order Details */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Header / Status Alert */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight mb-1">
              Order {order.id}
            </h1>
            <p className="text-muted-foreground flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                order.status === "COMPLETED" ? "bg-green-100 text-green-700" :
                order.status === "CANCELLED" || order.status === "EXPIRED" ? "bg-red-100 text-red-700" :
                "bg-yellow-100 text-yellow-800"
              }`}>
                {order.status.replace("_", " ")}
              </span>
              <span>•</span>
              <span>{isBuy ? "Buy" : "Sell"} {order.asset}</span>
            </p>
          </div>
          
          {(order.status === "CREATED" || order.status === "AWAITING_PAYMENT") && (
            <div className="text-right">
              <p className="text-sm text-muted-foreground mb-1">Time remaining to pay</p>
              <div className="text-2xl font-mono font-bold text-orange-600 flex items-center justify-end gap-2">
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
              <div className="flex justify-between items-center pb-4 border-b border-border">
                <span className="text-muted-foreground text-sm">Amount to Pay</span>
                <span className="text-xl font-bold font-display text-brand-600 dark:text-brand-400">
                  {fiatSymbol}{order.fiatAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {order.fiat}
                </span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-border">
                <span className="text-muted-foreground text-sm">Receive Crypto</span>
                <span className="text-xl font-bold font-mono">
                  {order.cryptoAmount.toLocaleString()} {order.asset}
                </span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-border">
                <span className="text-muted-foreground text-sm">Price</span>
                <span className="font-medium">
                  {fiatSymbol}{order.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / {order.asset}
                </span>
              </div>
            </div>

            <div className="space-y-4 bg-muted/30 p-4 rounded-lg border border-border">
              <h4 className="font-semibold text-sm flex items-center gap-2 text-brand-600 dark:text-brand-400">
                <Info className="w-4 h-4" /> SIMULATED PAYMENT DETAILS
              </h4>
              <p className="text-xs text-muted-foreground mb-4">
                Please simulate transferring funds to the merchant using the details below. This is a demo environment.
              </p>
              
              <div className="space-y-3">
                <div>
                  <span className="text-xs text-muted-foreground block mb-1">Method</span>
                  <span className="font-medium">{order.paymentMethod.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                </div>
                
                <div>
                  <span className="text-xs text-muted-foreground block mb-1">Recipient Name</span>
                  <div className="flex justify-between items-center bg-background px-3 py-2 rounded border border-border">
                    <span className="font-mono text-sm">{merchant.displayName}</span>
                    <button onClick={() => copyToClipboard(merchant.displayName, "name")} className="text-muted-foreground hover:text-foreground">
                      {copiedField === "name" ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <span className="text-xs text-muted-foreground block mb-1">Simulated Account / ID</span>
                  <div className="flex justify-between items-center bg-background px-3 py-2 rounded border border-border">
                    <span className="font-mono text-sm">{merchant.username.toLowerCase()}@ethsltd.demo</span>
                    <button onClick={() => copyToClipboard(`${merchant.username.toLowerCase()}@ethsltd.demo`, "account")} className="text-muted-foreground hover:text-foreground">
                      {copiedField === "account" ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <span className="text-xs text-muted-foreground block mb-1">Reference Number (Required)</span>
                  <div className="flex justify-between items-center bg-background px-3 py-2 rounded border border-border">
                    <span className="font-mono text-sm">{order.id}</span>
                    <button onClick={() => copyToClipboard(order.id, "ref")} className="text-muted-foreground hover:text-foreground">
                      {copiedField === "ref" ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {(order.status === "CREATED" || order.status === "AWAITING_PAYMENT") && (
            <div className="p-6 bg-muted/10 border-t border-border flex flex-col sm:flex-row gap-4 items-center justify-end">
              <Button variant="outline" onClick={handleCancel}>
                Cancel Order
              </Button>
              <Button size="lg" className="w-full sm:w-auto" onClick={handleMarkPaid}>
                Transferred, Notify Seller
              </Button>
            </div>
          )}

          {order.status === "PAYMENT_MARKED" && (
            <div className="p-6 bg-blue-50 dark:bg-blue-900/10 border-t border-blue-100 dark:border-blue-900/50 flex flex-col items-center justify-center text-center">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600 dark:text-blue-400 mb-4" />
              <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-1">Awaiting Merchant Release</h3>
              <p className="text-sm text-blue-800/80 dark:text-blue-400/80 max-w-md">
                You have marked the payment as complete. The merchant is verifying the funds and will release the crypto shortly.
              </p>
              <Button variant="outline" className="mt-6" size="sm">Open Dispute (Simulation)</Button>
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

        </div>
      </div>

      {/* Right Column: Chat */}
      <div className="h-[600px] lg:h-auto">
        <P2PChat order={order} merchant={merchant} />
      </div>

    </div>
  );
}
