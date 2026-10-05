"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ArrowUpDown, CandlestickChart, Briefcase, Clock, MessageSquare } from "lucide-react";

export function AppNavigation() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tab = searchParams?.get('tab');

  const navItems = [
    {
      name: "Quotes",
      href: "/markets",
      icon: ArrowUpDown,
      isActive: pathname === "/markets" || pathname === "/",
    },
    {
      name: "Charts",
      href: "/trade",
      icon: CandlestickChart,
      isActive: pathname?.startsWith("/trade") && !pathname?.includes("/positions") && !pathname?.includes("/history"),
    },
    {
      name: "Trade",
      href: "/wallet",
      icon: Briefcase,
      isActive: pathname?.startsWith("/wallet") && tab !== "asset",
    },
    {
      name: "History",
      href: "/account/history",
      icon: Clock,
      isActive: pathname?.startsWith("/account/history") || pathname?.startsWith("/wallet/history"),
    },
    {
      name: "Messages",
      href: "/support",
      icon: MessageSquare,
      isActive: pathname?.startsWith("/support") || pathname?.startsWith("/notifications"),
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
