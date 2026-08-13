import { Button } from "@/components/ui/button";
import { ArrowRight, Info, History } from "lucide-react";
import { useP2PStore } from "@/stores/p2p-store";
import Link from "next/link";

export function P2PHero() {
  const { query, setQuery } = useP2PStore();

  return (
    <div className="bg-background border-b border-border">

      <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-12 md:py-16">
        <div className="max-w-2xl">
          <p className="text-sm font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider mb-3">
            ETHSLTD P2P MARKETPLACE
          </p>
          <h1 className="text-3xl md:text-5xl font-display font-bold tracking-tight mb-4 text-foreground">
            Trade Crypto Directly With People.
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Find competitive offers, choose your preferred payment method, and complete your P2P transaction through a simple guided experience.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button 
              size="lg" 
              variant={query.side === "buy" ? "default" : "outline"}
              onClick={() => setQuery({ side: "buy" })}
            >
              Buy Crypto
            </Button>
            <Button 
              size="lg" 
              variant={query.side === "sell" ? "default" : "outline"}
              onClick={() => setQuery({ side: "sell" })}
            >
              Sell Crypto
            </Button>
            <Button variant="ghost" size="lg" asChild className="gap-2 text-muted-foreground hover:text-foreground">
              <Link href="/p2p/orders">
                <History className="w-4 h-4" /> My Orders
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
