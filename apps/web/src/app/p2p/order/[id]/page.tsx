import { P2POrderWorkspace } from "@/components/p2p/P2POrderWorkspace";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function P2POrderPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-muted/30">
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-8">
        
        {/* Navigation */}
        <div className="mb-6">
          <Link href="/p2p" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Marketplace
          </Link>
        </div>

        {/* Workspace */}
        <P2POrderWorkspace orderId={params.id} />

      </div>
    </div>
  );
}
