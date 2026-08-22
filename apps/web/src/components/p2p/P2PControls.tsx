"use client";

import { useP2PStore } from "@/stores/p2p-store";
import { PAYMENT_METHODS } from "@/lib/p2p/constants";
import { useCurrencies } from "@/hooks/use-currencies";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";

export function P2PControls() {
  const { query, setQuery } = useP2PStore();
  const { assets, fiats } = useCurrencies();

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setQuery({ amount: isNaN(val) ? undefined : val });
  };

  return (
    <div className="py-6 space-y-6">
      {/* Primary mode toggle */}
      <div className="flex bg-muted/50 w-fit rounded-lg p-1 border border-border">
        <button
          onClick={() => setQuery({ side: "buy" })}
          className={`px-8 py-2 rounded-md font-medium transition-colors ${
            query.side === "buy"
              ? "bg-primary text-white shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
        >
          Buy
        </button>
        <button
          onClick={() => setQuery({ side: "sell" })}
          className={`px-8 py-2 rounded-md font-medium transition-colors ${
            query.side === "sell"
              ? "bg-primary text-white shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
        >
          Sell
        </button>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        
        {/* Asset */}
        <div className="space-y-1.5 lg:col-span-1">
          <label className="text-xs font-medium text-muted-foreground">Asset</label>
          <select 
            value={query.asset || "all"}
            onChange={(e) => setQuery({ asset: e.target.value })}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <option value="all">All Assets</option>
            {assets.map((asset) => (
              <option key={asset.code} value={asset.code}>
                {asset.code}
              </option>
            ))}
          </select>
        </div>

        {/* Fiat */}
        <div className="space-y-1.5 lg:col-span-1">
          <label className="text-xs font-medium text-muted-foreground">Fiat (Bank)</label>
          <select 
            value={query.fiat || "all"}
            onChange={(e) => setQuery({ fiat: e.target.value })}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <option value="all">All Fiat</option>
            {fiats.map((fiat) => (
              <option key={fiat.code} value={fiat.code}>
                {fiat.code}
              </option>
            ))}
          </select>
        </div>

        {/* Payment Method */}
        <div className="space-y-1.5 lg:col-span-1">
          <label className="text-xs font-medium text-muted-foreground">Payment Method</label>
          <select 
            value={query.paymentMethod}
            onChange={(e) => setQuery({ paymentMethod: e.target.value })}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <option value="all">All Methods</option>
            {PAYMENT_METHODS.filter(m => query.fiat === 'all' || m.currency.includes(query.fiat || "USD")).map((method) => (
              <option key={method.id} value={method.id}>
                {method.name}
              </option>
            ))}
          </select>
        </div>

        {/* Amount */}
        <div className="space-y-1.5 lg:col-span-2">
          <label className="text-xs font-medium text-muted-foreground">I want to {query.side === "buy" ? "spend" : "sell"}</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
              {query.fiat === 'all' ? '$' : fiats.find(f => f.code === query.fiat)?.symbol || "$"}
            </span>
            <Input 
              type="number" 
              placeholder="Enter amount" 
              className="pl-8"
              value={query.amount || ""}
              onChange={handleAmountChange}
            />
          </div>
        </div>

        {/* Filters Button */}
        <div className="space-y-1.5 lg:col-span-1 flex items-end">
          <Button variant="outline" className="w-full gap-2 border-dashed">
            <Filter className="w-4 h-4" /> Filters
          </Button>
        </div>

      </div>
    </div>
  );
}
