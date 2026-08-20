import { DepositFormWrapper } from "@/components/wallet/DepositFormWrapper";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { use } from "react";

export default async function DepositPage({ searchParams }: { searchParams: Promise<{ asset?: string }> }) {
  const params = await searchParams;
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/wallet">
          <Button variant="ghost" size="icon" className="h-10 w-10">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Deposit</h1>
          <p className="text-sm text-muted-foreground">Add funds to your trading wallet</p>
        </div>
      </div>

      <DepositFormWrapper defaultAsset={params.asset} />
    </div>
  );
}


