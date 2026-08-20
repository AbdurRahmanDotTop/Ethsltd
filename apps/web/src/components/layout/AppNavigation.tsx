"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LineChart, Zap, Shield, Wallet } from "lucide-react";

export function AppNavigation() {
  const pathname = usePathname();

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
      isActive: pathname.startsWith("/trade"),
    },
    {
      name: "P2P",
      href: "/p2p", // Mapping "Option" to P2P/Options
      icon: Zap,
      isActive: pathname.startsWith("/p2p"),
    },
    {
      name: "P2P Orders",
      href: "/p2p/orders",
      icon: Shield,
      isActive: pathname.startsWith("/p2p/orders"),
    },
    {
      name: "Assets",
      href: "/wallet",
      icon: Wallet,
      isActive: pathname.startsWith("/wallet") || pathname === "/account/profile",
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 z-40 w-full bg-[#181A20] border-t border-white/5 pb-[env(safe-area-inset-bottom)]">
      <div className="grid h-16 w-full grid-cols-5 max-w-[1280px] mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const activeClass = item.isActive ? "text-[#00C087]" : "text-muted-foreground hover:text-[#00C087]/70";
          return (
            <Link
              key={item.name}
              href={item.href}
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
  );
}
