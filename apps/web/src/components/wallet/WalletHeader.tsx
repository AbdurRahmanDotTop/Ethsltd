import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowDownToLine, ArrowUpFromLine, History } from "lucide-react";

export function WalletHeader() {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Your Wallet</h1>
          <span className="bg-brand-500/10 text-brand-600 dark:text-brand-400 text-xs font-semibold px-2 py-0.5 rounded-full border border-brand-500/20">
            Paper Trading
          </span>
        </div>
        <p className="text-muted-foreground text-sm">
          Manage your assets, track your portfolio, and move simulated funds.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Link href="/wallet/history">
          <Button variant="outline" className="h-10">
            <History className="w-4 h-4 mr-2" />
            History
          </Button>
        </Link>
        <Link href="/wallet/withdraw">
          <Button variant="outline" className="h-10">
            <ArrowUpFromLine className="w-4 h-4 mr-2" />
            Withdraw
          </Button>
        </Link>
        <Link href="/wallet/deposit">
          <Button className="h-10">
            <ArrowDownToLine className="w-4 h-4 mr-2" />
            Deposit
          </Button>
        </Link>
      </div>
    </div>
  );
}
