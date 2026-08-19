"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useP2PStore } from "@/stores/p2p-store";
import { ASSETS, FIAT_CURRENCIES, PAYMENT_METHODS } from "@/lib/p2p/constants";
import { Zap, CreditCard, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface ExpressP2PModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ExpressP2PModal({ isOpen, onClose }: ExpressP2PModalProps) {
  const router = useRouter();
  const { setQuery } = useP2PStore();
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [asset, setAsset] = useState("USDT");
  const [fiat, setFiat] = useState("INR");
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("all");

  const fiatSymbol = FIAT_CURRENCIES.find(f => f.code === fiat)?.symbol || "$";

  const handlePickAds = () => {
    setQuery({
      side,
      asset,
      fiat,
      amount: amount ? parseFloat(amount) : undefined,
      paymentMethod
    });
    onClose();
    // The main table will auto-filter based on these new store values.
    // In a real app, this might directly match you to a single best Ad.
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl font-display">
            <Zap className="w-6 h-6 text-yellow-500 fill-yellow-500" /> Find an Ad
          </DialogTitle>
          <DialogDescription>
            Share your trading requirements, and we'll help you filter available offers in the Express P2P marketplace.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-muted-foreground">I want to</label>
            <div className="grid grid-cols-2 gap-2">
              <select 
                value={side}
                onChange={(e) => setSide(e.target.value as "buy" | "sell")}
                className="flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 font-medium focus:ring-2 focus:ring-ring focus:outline-none"
              >
                <option value="buy">Buy</option>
                <option value="sell">Sell</option>
              </select>
              <select 
                value={asset}
                onChange={(e) => setAsset(e.target.value)}
                className="flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 font-medium focus:ring-2 focus:ring-ring focus:outline-none"
              >
                {ASSETS.map(a => (
                  <option key={a.symbol} value={a.symbol}>{a.symbol}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-muted-foreground">Payment currency / amount</label>
            <div className="flex relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                {fiatSymbol}
              </span>
              <Input 
                type="number" 
                placeholder="Enter Amount" 
                className="pl-8 h-12 rounded-r-none border-r-0 text-lg font-medium"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <select 
                value={fiat}
                onChange={(e) => setFiat(e.target.value)}
                className="flex h-12 w-28 rounded-l-none rounded-r-md border border-input bg-muted/30 px-3 py-2 font-medium focus:ring-2 focus:ring-ring focus:outline-none"
              >
                {FIAT_CURRENCIES.map(f => (
                  <option key={f.code} value={f.code}>{f.code}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-muted-foreground">Payment Methods</label>
            <select 
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 font-medium focus:ring-2 focus:ring-ring focus:outline-none"
            >
              <option value="all">All payment methods</option>
              {PAYMENT_METHODS.filter(m => m.currency.includes(fiat)).map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>

          <Button size="lg" className="w-full text-lg h-12" onClick={handlePickAds}>
            Pick Ads Now
          </Button>

          <div className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t border-border flex-wrap gap-y-4">
            <div className="flex flex-col items-center gap-1">
              <span className="w-8 h-8 rounded-full bg-muted flex items-center justify-center font-bold text-foreground">1</span>
              <span>Pick an Ad</span>
            </div>
            <ChevronRight className="w-4 h-4 opacity-30" />
            <div className="flex flex-col items-center gap-1">
              <span className="w-8 h-8 rounded-full bg-muted flex items-center justify-center font-bold text-foreground">2</span>
              <span>Make payment</span>
            </div>
            <ChevronRight className="w-4 h-4 opacity-30" />
            <div className="flex flex-col items-center gap-1">
              <span className="w-8 h-8 rounded-full bg-muted flex items-center justify-center font-bold text-foreground">3</span>
              <span>Receive Crypto</span>
            </div>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}
