"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { 
  LayoutDashboard, Users, UserCheck, Activity, 
  ListOrdered, ArrowRightLeft, Wallet, ArrowDownToLine, 
  ArrowUpFromLine, Handshake, AlertTriangle, LifeBuoy, 
  FileSignature, Bell, ShieldCheck, Settings, Server,
  KeyRound, Code
} from "lucide-react";

export const adminNavGroups = [
  {
    title: "Overview",
    items: [
      { name: "Dashboard", href: "/admin", icon: LayoutDashboard }
    ]
  },
  {
    title: "Identity",
    items: [
      { name: "Users", href: "/admin/users", icon: Users },
      { name: "Experts", href: "/admin/experts", icon: Handshake },
      { name: "KYC", href: "/admin/kyc", icon: UserCheck }
    ]
  },
  {
    title: "Developer",
    items: [
      { name: "API Platform", href: "/admin/api", icon: Code }
    ]
  },
  {
    title: "Market Activity",
    items: [
      { name: "Trading", href: "/admin/trading", icon: Activity },
      { name: "Orders", href: "/admin/orders", icon: ListOrdered },
      { name: "Trades", href: "/admin/trades", icon: ArrowRightLeft }
    ]
  },
  {
    title: "Financials",
    items: [
      { name: "Wallets", href: "/admin/wallets", icon: Wallet },
      { name: "Deposits", href: "/admin/deposits", icon: ArrowDownToLine },
      { name: "Deposit Settings", href: "/admin/deposits/settings", icon: Settings },
      { name: "Withdrawals", href: "/admin/withdrawals", icon: ArrowUpFromLine }
    ]
  },
  {
    title: "P2P Marketplace",
    items: [
      { name: "Orders", href: "/admin/p2p/orders", icon: Handshake },
      { name: "Disputes", href: "/admin/p2p/disputes", icon: AlertTriangle }
    ]
  },
  {
    title: "Operations",
    items: [
      { name: "Risk", href: "/admin/risk", icon: ShieldCheck },
      { name: "Support", href: "/admin/support", icon: LifeBuoy },
      { name: "Contracts", href: "/admin/contracts", icon: FileSignature },
      { name: "Notifications", href: "/admin/notifications", icon: Bell }
    ]
  },
  {
    title: "Platform",
    items: [
      { name: "Audit Logs", href: "/admin/audit", icon: ShieldCheck },
      { name: "Settings", href: "/admin/settings", icon: Settings },
      { name: "Payment Settings", href: "/admin/settings/payments", icon: Wallet },
      { name: "System", href: "/admin/system", icon: Server }
    ]
  }
];

export function AdminSidebar() {
  const pathname = usePathname();
  const activeItemRef = useRef<HTMLAnchorElement>(null);

  const allHrefs = adminNavGroups.flatMap(g => g.items.map(i => i.href));
  const activeHref = allHrefs
    .filter(href => pathname === href || pathname.startsWith(href + '/'))
    .sort((a, b) => b.length - a.length)[0] || pathname;

  useEffect(() => {
    if (activeItemRef.current) {
      activeItemRef.current.scrollIntoView({ block: "center", behavior: "smooth" });
    }
  }, [pathname]);

  return (
    <aside className="w-64 bg-card border-r border-border hidden xl:flex flex-col h-full overflow-y-auto custom-scrollbar">
      <div className="p-4 space-y-6">
        {adminNavGroups.map((group) => (
          <div key={group.title}>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-3">
              {group.title}
            </h4>
            <nav className="space-y-1">
              {group.items.map((item) => {
                const isActive = item.href === activeHref;
                const Icon = item.icon;
                return (
                  <Link 
                    key={item.href} 
                    href={item.href}
                    ref={isActive ? activeItemRef : null}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors ${
                      isActive 
                        ? "bg-brand-primary/10 text-brand-primary font-medium" 
                        : "text-foreground hover:bg-muted"
                    }`}
                  >
                    <Icon size={18} className={isActive ? "text-brand-primary" : "text-muted-foreground"} />
                    <span className="text-sm">{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        ))}
      </div>
    </aside>
  );
}
