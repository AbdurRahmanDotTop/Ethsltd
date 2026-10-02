"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Home, LineChart, Wallet, CreditCard, Zap } from "lucide-react";

export function AppNavigation() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tab = searchParams?.get('tab');

  const navItems = [
    {
      name: "Home",
      href: "/",
      icon: Home,
      isActive: pathname === "/",
    },
    {
      name: "Trade",
      href: "/trade",
      icon: LineChart,
      isActive: pathname?.startsWith("/trade"),
    },
    {
      name: "P2P",
      href: "https://p2p.ethsltd.com/",
      icon: Zap,
      isActive: false,
    },
    {
      name: "Wallet",
      href: "/wallet?tab=currency",
      icon: CreditCard,
      isActive: pathname?.startsWith("/wallet") && tab !== "asset",
    },
    {
      name: "Assets",
      href: "/wallet?tab=asset",
      icon: Wallet,
      isActive: (pathname?.startsWith("/wallet") && tab === "asset") || pathname === "/account/profile",
    },
  ];

  return (
    <>
      {/* Main Bottom Nav */}
      <div className="fixed bottom-0 left-0 z-40 w-full bg-[#181A20] border-t border-white/5 pb-[env(safe-area-inset-bottom)]">
        <div className="grid h-16 w-full grid-cols-5 max-w-[1280px] mx-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const activeClass = item.isActive ? "text-[#00C087]" : "text-muted-foreground hover:text-[#00C087]/70";

            return (
              <Link
                key={item.name}
                href={item.href!}
                className={`flex flex-col items-center justify-center gap-1 group transition-colors ${activeClass}`}
              >
                <Icon
                  className={`w-[22px] h-[22px] ${item.isActive ? "fill-[#00C087]/10" : ""}`}
                  strokeWidth={item.isActive ? 2.5 : 2}
                />
                <span className="text-[10px] font-medium leading-none">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
