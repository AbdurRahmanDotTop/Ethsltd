"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { LayoutDashboard, User, Shield, KeyRound, Bell, Settings, Code, Activity, FileSignature } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Overview", href: "/account", icon: LayoutDashboard },
  { name: "Profile", href: "/account/profile", icon: User },
  { name: "Security", href: "/account/security", icon: Shield },
  { name: "KYC Verification", href: "/account/kyc", icon: Shield },
  { name: "Sessions", href: "/account/sessions", icon: KeyRound },
  { name: "Notifications", href: "/account/preferences/notifications", icon: Bell },
  { name: "API Keys", href: "/account/api-keys", icon: Code },
  { name: "API Usage", href: "/account/api-usage", icon: Activity },
  { name: "Agreements & Contracts", href: "/account/contracts", icon: FileSignature },
  { name: "Preferences", href: "/account/preferences", icon: Settings },
];

export function AccountSidebar() {
  const pathname = usePathname();
  const activeItemRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (activeItemRef.current) {
      activeItemRef.current.scrollIntoView({ block: "center", behavior: "smooth" });
    }
  }, [pathname]);

  return (
    <nav className="space-y-1">
      {navigation.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;
        
        return (
          <Link
            key={item.name}
            href={item.href}
            ref={isActive ? activeItemRef : null}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
              isActive 
                ? "bg-brand-50 text-brand-700 dark:bg-brand-900/20 dark:text-brand-400" 
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Icon className={cn("w-4 h-4", isActive ? "text-brand-600 dark:text-brand-400" : "text-muted-foreground")} />
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
}
