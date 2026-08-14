import { WithdrawForm } from "@/components/wallet/WithdrawForm";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function WithdrawPage({ searchParams }: { searchParams: { asset?: string } }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/wallet">
          <Button variant="ghost" size="icon" className="h-10 w-10">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Withdraw</h1>
          <p className="text-sm text-muted-foreground">Withdraw simulated funds from your demo trading wallet</p>
        </div>
      </div>

      <WithdrawForm defaultAsset={searchParams.asset} />
    </div>
  );
}
