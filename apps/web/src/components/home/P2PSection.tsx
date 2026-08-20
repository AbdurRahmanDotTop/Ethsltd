"use client";

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { apiClient } from "@ethsltd/api-client";

export function P2PSection() {
  const defaultAds = [
    { type: 'BUY', price: '1.00', paymentMethods: 'Zelle', availableAmount: '5000', assetSymbol: 'USDT' },
    { type: 'SELL', price: '0.99', paymentMethods: 'Bank Transfer', availableAmount: '7500', assetSymbol: 'USDT' },
  ];

  const [p2pAds, setP2pAds] = useState<any[]>(defaultAds);

  useEffect(() => {
    apiClient.getP2pAds().then((res) => {
      if (res.success && res.data) {
        const buyAd = res.data.find((ad: any) => ad.type.toUpperCase() === 'BUY');
        const sellAd = res.data.find((ad: any) => ad.type.toUpperCase() === 'SELL');
        
        const newAds = [];
        if (buyAd) newAds.push(buyAd);
        else newAds.push(defaultAds[0]);
        
        if (sellAd) newAds.push(sellAd);
        else newAds.push(defaultAds[1]);
        
        setP2pAds(newAds);
      }
    });
  }, []);

  return (
    <section className="bg-muted py-24">
      <div className="max-w-[1280px] mx-auto px-4 md:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-6">
              Buy & Sell Crypto Through P2P
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-lg">
              Discover peer-to-peer trading with structured trade workflows, escrow controls, messaging, and dispute support.
            </p>
            
            <ul className="space-y-4 mb-10">
              {[
                'Verified counterparties',
                'Structured trade workflow',
                'Escrow-based transaction flow',
                'P2P chat',
                'Dispute management'
              ].map((item, i) => (
                <li key={i} className="flex items-center text-muted-foreground">
                  <div className="w-5 h-5 rounded-full bg-primary/10 text-[var(--brand-foreground)] flex items-center justify-center mr-3 text-xs">✓</div>
                  {item}
                </li>
              ))}
            </ul>
            
            <Button size="lg" className="px-8" asChild>
              <Link href="/p2p">Explore P2P</Link>
            </Button>
          </div>
          
          <div className="space-y-4">
            {p2pAds.map((ad, i) => {
              const isBuy = ad.type.toUpperCase() === 'BUY';
              return (
                <div key={i} className="bg-card border border-border rounded-xl p-6 hover:border-border transition-colors">
                  <div className="flex justify-between items-center mb-6 flex-wrap gap-y-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full text-white flex items-center justify-center font-bold ${ad.assetSymbol === 'BTC' ? 'bg-[#F7931A]' : ad.assetSymbol === 'ETH' ? 'bg-[#627EEA]' : 'bg-[#26A17B]'}`}>
                        {ad.assetSymbol === 'BTC' ? '₿' : ad.assetSymbol === 'ETH' ? 'Ξ' : '₮'}
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground">{ad.assetSymbol}</h4>
                        <p className="text-xs text-muted-foreground">{ad.assetSymbol === 'BTC' ? 'Bitcoin' : ad.assetSymbol === 'ETH' ? 'Ethereum' : 'Tether US'}</p>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded text-xs font-bold uppercase ${isBuy ? 'bg-success/20 text-success' : 'bg-danger/20 text-danger'}`}>
                      {ad.type}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Price</p>
                      <p className="font-mono text-lg font-medium text-foreground">${parseFloat(ad.price).toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Available</p>
                      <p className="font-mono text-sm text-muted-foreground mt-1">${parseFloat(ad.availableAmount || ad.amount || 0).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Payment Method</p>
                      <p className="text-sm text-muted-foreground truncate" title={
                        Array.isArray(ad.paymentMethods) 
                          ? ad.paymentMethods.map((m: any) => typeof m === 'string' ? m : (m?.type || 'Unknown')).join(', ')
                          : String(ad.paymentMethods || '')
                      }>
                        {Array.isArray(ad.paymentMethods) 
                          ? ad.paymentMethods.map((m: any) => typeof m === 'string' ? m : (m?.type || 'Unknown')).join(', ')
                          : String(ad.paymentMethods || '')}
                      </p>
                    </div>
                  </div>
                  
                  <Button className="w-full" variant={isBuy ? 'success' : 'destructive'} asChild>
                    <Link href={`/p2p?type=${ad.type.toLowerCase()}`}>
                      {ad.type} {ad.assetSymbol}
                    </Link>
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
