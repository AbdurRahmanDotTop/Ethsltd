"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@ethsltd/api-client";
import { P2PAdvertisement, P2PMerchant } from "@/lib/p2p/types";
import { useP2PStore } from "@/stores/p2p-store";
import { Loader2, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FIAT_CURRENCIES } from "@/lib/p2p/mock-data";

export function P2PTable({ onSelectAd }: { onSelectAd: (ad: P2PAdvertisement, merchant: P2PMerchant) => void }) {
  const { query } = useP2PStore();
  const [ads, setAds] = useState<P2PAdvertisement[]>([]);
  const [merchants, setMerchants] = useState<Record<string, P2PMerchant>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await apiClient.getP2pAds();
        if (res.success && res.data) {
          // Filter ads based on query locally for MVP
          const filteredAds = res.data.filter((ad: any) => 
            ad.type.toLowerCase() === query.side &&
            ad.asset === query.asset &&
            ad.fiat === query.fiat
          );
          setAds(filteredAds);
          
          const newMerchants: Record<string, P2PMerchant> = {};
          for (const ad of filteredAds) {
            newMerchants[ad.userId] = ad.merchant;
          }
          setMerchants(newMerchants);
        }
      } catch(e) {
        console.error(e)
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [query]);

  const fiatSymbol = FIAT_CURRENCIES.find(f => f.code === query.fiat)?.symbol || "$";

  return (
    <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="px-6 py-4 text-xs font-medium text-muted-foreground">Merchant</th>
              <th className="px-6 py-4 text-xs font-medium text-muted-foreground">Price</th>
              <th className="px-6 py-4 text-xs font-medium text-muted-foreground">Available / Limits</th>
              <th className="px-6 py-4 text-xs font-medium text-muted-foreground">Payment</th>
              <th className="px-6 py-4 text-xs font-medium text-muted-foreground text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-6 py-16 text-center">
                  <Loader2 className="w-8 h-8 animate-spin text-muted-foreground mx-auto" />
                </td>
              </tr>
            ) : ads.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-16 text-center">
                  <div className="text-muted-foreground mb-2">No offers match your criteria.</div>
                  <Button variant="outline" size="sm">Reset Filters</Button>
                </td>
              </tr>
            ) : (
              ads.map((ad) => {
                const merchant = merchants[ad.merchantId];
                if (!merchant) return null;

                return (
                  <tr key={ad.id} className="hover:bg-muted/30 transition-colors">
                    {/* Merchant Column */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 font-bold flex items-center justify-center text-sm">
                          {merchant.displayName.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-foreground">{merchant.displayName}</span>
                            {merchant.verified && <CheckCircle2 className="w-3.5 h-3.5 text-brand-500" />}
                          </div>
                          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                            <span>{merchant.completionRate}% completion</span>
                            <span>•</span>
                            <span>{merchant.totalOrders} orders</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Price Column */}
                    <td className="px-6 py-5">
                      <div className="font-display text-xl font-bold text-foreground">
                        {fiatSymbol}{ad.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {query.fiat} / {query.asset}
                      </div>
                    </td>

                    {/* Limits Column */}
                    <td className="px-6 py-5 space-y-1.5 whitespace-nowrap">
                      <div className="flex items-center text-sm gap-4">
                        <span className="text-muted-foreground w-16">Available</span>
                        <span className="font-mono text-foreground font-medium">{ad.availableAmount.toLocaleString()} {query.asset}</span>
                      </div>
                      <div className="flex items-center text-sm gap-4">
                        <span className="text-muted-foreground w-16">Limit</span>
                        <span className="font-mono text-foreground">{fiatSymbol}{ad.minLimit.toLocaleString()} - {fiatSymbol}{ad.maxLimit.toLocaleString()}</span>
                      </div>
                    </td>

                    {/* Payment Column */}
                    <td className="px-6 py-5">
                      <div className="flex flex-wrap gap-1.5 max-w-[200px]">
                        {ad.paymentMethods.slice(0, 3).map(methodId => {
                          return (
                            <span key={methodId} className="px-2 py-1 text-xs font-medium bg-muted text-muted-foreground rounded-md border border-border">
                              {methodId.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </span>
                          );
                        })}
                        {ad.paymentMethods.length > 3 && (
                          <span className="px-2 py-1 text-xs font-medium bg-muted text-muted-foreground rounded-md border border-border">
                            +{ad.paymentMethods.length - 3}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Action Column */}
                    <td className="px-6 py-5 text-right">
                      <Button 
                        variant={query.side === "buy" ? "default" : "destructive"} 
                        onClick={() => onSelectAd(ad, merchant)}
                      >
                        {query.side === "buy" ? `Buy ${query.asset}` : `Sell ${query.asset}`}
                      </Button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
