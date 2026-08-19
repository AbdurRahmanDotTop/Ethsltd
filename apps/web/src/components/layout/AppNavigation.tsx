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
      name: "Option",
      href: "/p2p", // Mapping "Option" to P2P/Options
      icon: Zap,
      isActive: pathname.startsWith("/p2p"),
    },
    {
      name: "Trust",
      href: "/support", // Mapping "Trust" to Support/Trust
      icon: Shield,
      isActive: pathname.startsWith("/support"),
    },
    {
      name: "Assets",
      href: "/wallet",
      icon: Wallet,
      isActive: pathname.startsWith("/wallet") || pathname === "/account/profile",
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 z-[100] w-full h-16 bg-[#181A20] border-t border-white/5 safe-area-bottom">
      <div className="grid h-full w-full grid-cols-5 max-w-[1280px] mx-auto">
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
