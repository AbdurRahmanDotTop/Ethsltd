"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useP2PStore } from "@/stores/p2p-store";
import { FIAT_CURRENCIES } from "@/lib/p2p/mock-data";
import { ChevronLeft, History, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

import { useEffect, useState } from "react";
import { apiClient } from "@ethsltd/api-client";
import { Loader2 } from "lucide-react";

export default function P2POrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await apiClient.getP2pOrders();
        if (res.success && res.data) {
          setOrders(res.data);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
      </div>
    );
  }

  return (
    <div className="bg-muted/30">
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-8 min-h-[70vh]">
        
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/p2p" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-4">
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back to Marketplace
            </Link>
            <h1 className="text-3xl font-display font-bold tracking-tight">My P2P Orders</h1>
          </div>
          <Button onClick={() => router.push("/p2p")}>Trade Now</Button>
        </div>

        {orders.length === 0 ? (
          <div className="bg-card border border-border rounded-xl p-12 text-center shadow-sm">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <History className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No Order History</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              You haven't made any P2P trades yet. Head over to the marketplace to start trading crypto directly with other users.
            </p>
            <Button onClick={() => router.push("/p2p")}>Go to P2P Marketplace</Button>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="px-6 py-4 text-xs font-medium text-muted-foreground">Order ID</th>
                    <th className="px-6 py-4 text-xs font-medium text-muted-foreground">Type</th>
                    <th className="px-6 py-4 text-xs font-medium text-muted-foreground">Fiat Amount</th>
                    <th className="px-6 py-4 text-xs font-medium text-muted-foreground">Crypto Amount</th>
                    <th className="px-6 py-4 text-xs font-medium text-muted-foreground">Status</th>
                    <th className="px-6 py-4 text-xs font-medium text-muted-foreground text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {orders.map((order) => {
                    const fiatSymbol = FIAT_CURRENCIES.find(f => f.code === order.fiat)?.symbol || "$";
                    const isBuy = order.side === "sell"; // if ad was sell, user is buying
                    
                    return (
                      <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-5">
                          <span className="font-mono font-medium">{order.id}</span>
                          <div className="text-xs text-muted-foreground mt-1">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span className={`font-semibold ${isBuy ? "text-green-600 dark:text-green-500" : "text-red-600 dark:text-red-500"}`}>
                            {isBuy ? "Buy" : "Sell"} {order.asset}
                          </span>
                          <div className="text-xs text-muted-foreground mt-1">
                            Price: {fiatSymbol}{order.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </div>
                        </td>
                        <td className="px-6 py-5 font-medium">
                          {fiatSymbol}{order.fiatAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {order.fiat}
                        </td>
                        <td className="px-6 py-5 font-mono">
                          {order.cryptoAmount.toLocaleString()} {order.asset}
                        </td>
                        <td className="px-6 py-5">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                            order.status === "COMPLETED" ? "bg-green-100 text-green-700" :
                            order.status === "CANCELLED" || order.status === "EXPIRED" ? "bg-red-100 text-red-700" :
                            "bg-yellow-100 text-yellow-800"
                          }`}>
                            {order.status.replace("_", " ")}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <Button variant="ghost" size="sm" onClick={() => router.push(`/p2p/order/${order.id}`)}>
                            View Order <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
