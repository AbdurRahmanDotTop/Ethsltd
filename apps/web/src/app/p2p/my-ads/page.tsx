"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@ethsltd/api-client";
import { P2PAdvertisement } from "@/lib/p2p/types";
import { useAuthStore } from "@/stores/auth-store";
import { Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { FIAT_CURRENCIES } from "@/lib/p2p/constants";
import { useTradingModeStore } from "@/stores/trading-mode-store";

export default function MyAdsPage() {
  const { user, status, hasHydrated } = useAuthStore();
  const router = useRouter();
  const { mode } = useTradingModeStore();
  const [ads, setAds] = useState<P2PAdvertisement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMyAds = async () => {
    setIsLoading(true);
    try {
      const res = await apiClient.getP2pAds();
      if (res.success && res.data) {
        const myAds = res.data.filter((ad: any) => ad.userId === user?.id || ad.merchant?.id === user?.id || ad.merchantId === user?.id);
        setAds(myAds);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (hasHydrated && status === "unauthenticated") {
      router.push("/login?callbackUrl=/p2p/my-ads");
      return;
    }

    if (status === "authenticated" && user) {
      fetchMyAds();
    }
  }, [user, status, router, mode]);

  const handleCloseAd = async (adId: string) => {
    if (!confirm("Are you sure you want to close this ad?")) return;
    try {
      const res = await apiClient.closeP2pAd(adId);
      if (res.success) {
        fetchMyAds();
      } else {
        alert(res.error || "Failed to close ad");
      }
    } catch (e) {
      alert("Error closing ad");
    }
  };

  if (!hasHydrated || status === "loading" || (status === "authenticated" && isLoading)) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] bg-muted/30">
        <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  return (
    <div className="bg-muted/30 pb-24 min-h-screen">
      <div className="bg-background border-b border-border py-12">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground mb-2">My P2P Ads</h1>
            <p className="text-muted-foreground">Manage your peer-to-peer buy and sell advertisements.</p>
          </div>
          <Button onClick={() => router.push('/p2p/post-ad')}>
            <Plus className="w-4 h-4 mr-2" />
            Post New Ad
          </Button>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-4 md:px-8 mt-8">
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          {ads.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="px-6 py-4 text-xs font-medium text-muted-foreground">Type</th>
                    <th className="px-6 py-4 text-xs font-medium text-muted-foreground">Asset / Fiat</th>
                    <th className="px-6 py-4 text-xs font-medium text-muted-foreground">Price</th>
                    <th className="px-6 py-4 text-xs font-medium text-muted-foreground">Available Amount</th>
                    <th className="px-6 py-4 text-xs font-medium text-muted-foreground">Limits</th>
                    <th className="px-6 py-4 text-xs font-medium text-muted-foreground text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {ads.map((ad: any) => {
                    const fiatSymbol = FIAT_CURRENCIES.find(f => f.code === ad.fiat)?.symbol || "$";
                    const isBuy = (ad.side || ad.type || "").toLowerCase() === "buy";
                    
                    return (
                      <tr key={ad.id} className="hover:bg-muted/10 transition-colors">
                        <td className="px-6 py-4 align-middle">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            isBuy ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                          }`}>
                            {isBuy ? 'BUY' : 'SELL'}
                          </span>
                        </td>
                        <td className="px-6 py-4 align-middle">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-foreground">{ad.asset}</span>
                            <span className="text-muted-foreground text-xs">/ {ad.fiat}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 align-middle">
                          <div className="font-medium text-foreground">
                            {fiatSymbol}{ad.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {ad.priceType === "floating" ? "Floating" : "Fixed"}
                          </div>
                        </td>
                        <td className="px-6 py-4 align-middle text-foreground">
                          {ad.availableAmount.toLocaleString()} {ad.asset}
                        </td>
                        <td className="px-6 py-4 align-middle">
                          <div className="text-sm text-foreground">
                            {fiatSymbol}{ad.minLimit.toLocaleString()} - {fiatSymbol}{ad.maxLimit.toLocaleString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 align-middle text-right">
                          {ad.status !== 'CLOSED' && (
                            <>
                              <Button variant="outline" size="sm" className="mr-2" onClick={() => router.push(`/p2p/edit-ad/${ad.id}`)}>Edit</Button>
                              <Button variant="destructive" size="sm" onClick={() => handleCloseAd(ad.id)}>Close</Button>
                            </>
                          )}
                          {ad.status === 'CLOSED' && (
                            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">CLOSED</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-16 text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📝</span>
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">No Ads Found</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                You haven't posted any P2P advertisements yet. Create one to start trading with other users.
              </p>
              <Button onClick={() => router.push('/p2p/post-ad')}>Post Your First Ad</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
