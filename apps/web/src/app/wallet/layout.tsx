"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { Loader2 } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function WalletLayout({ children }: { children: React.ReactNode }) {
  const { status, hasHydrated } = useAuthStore();
  const router = useRouter();

  if (!hasHydrated || status === "loading") {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[500px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground text-sm animate-pulse">Loading wallet...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-1 bg-muted/10 w-full">
        <div className="max-w-[1200px] mx-auto px-4 py-8 flex-1">
          {children}
        </div>
      </div>
      <Footer />
    </div>
  );
}
