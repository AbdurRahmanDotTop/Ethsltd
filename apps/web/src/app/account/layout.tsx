"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { AccountSidebar } from "@/components/account/AccountSidebar";
import { Loader2, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const { status } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  if (status !== "authenticated") {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-8 md:py-12">
      <div className="mb-8 md:hidden">
        <Button 
          variant="outline" 
          className="w-full justify-between" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <span>Account Menu</span>
          <Menu className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <aside className={`w-full md:w-64 shrink-0 ${mobileMenuOpen ? 'block' : 'hidden md:block'}`}>
          <div className="sticky top-24">
            <h2 className="text-xl font-bold mb-6 hidden md:block">My Account</h2>
            <AccountSidebar />
          </div>
        </aside>

        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
