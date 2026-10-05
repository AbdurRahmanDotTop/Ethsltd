"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Home, LineChart, Wallet, CreditCard, Zap, ArrowUpDown, CandlestickChart, Briefcase, Clock, MessageSquare } from "lucide-react";

export function AppNavigation() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tab = searchParams?.get('tab');

  const navItems = [
    // Old Items
    {
      name: "Home",
      href: "/",
      icon: Home,
      isActive: pathname === "/",
    },
    {
      name: "Trade (Spot)",
      href: "/trade",
      icon: LineChart,
      isActive: pathname?.startsWith("/trade") && !pathname?.includes("/positions") && !pathname?.includes("/history"),
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
    // New MT5 Items
    {
      name: "Quotes",
      href: "/quotes",
      icon: ArrowUpDown,
      isActive: pathname === "/quotes",
    },
    {
      name: "Charts",
      href: "/chart/btc-usdt", // Default symbol, could be dynamic
      icon: CandlestickChart,
      isActive: pathname?.startsWith("/chart"),
    },
    {
      name: "Positions",
      href: "/positions",
      icon: Briefcase,
      isActive: pathname?.startsWith("/positions"),
    },
    {
      name: "History",
      href: "/wallet/history",
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
      <div className="fixed bottom-0 left-0 z-40 w-full bg-[#181A20] border-t border-white/5 pb-[env(safe-area-inset-bottom)]">
        <div className="flex h-16 w-full max-w-5xl mx-auto px-2 overflow-x-auto no-scrollbar justify-start md:justify-center items-center">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const activeClass = item.isActive ? "text-[#00C087]" : "text-muted-foreground hover:text-[#00C087]/70";

            return (
              <Link
                key={item.name + index}
                href={item.href!}
                className={`flex flex-col items-center justify-center gap-1 px-4 shrink-0 min-w-[72px] group transition-colors ${activeClass}`}
              >
                <Icon
                  className={`w-[22px] h-[22px] ${item.isActive ? "fill-[#00C087]/10" : ""}`}
                  strokeWidth={item.isActive ? 2.5 : 2}
                />
                <span className="text-[10px] font-medium leading-none whitespace-nowrap">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
