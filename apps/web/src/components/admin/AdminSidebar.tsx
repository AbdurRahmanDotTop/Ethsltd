"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, Users, UserCheck, Activity, 
  ListOrdered, ArrowRightLeft, Wallet, ArrowDownToLine, 
  ArrowUpFromLine, Handshake, AlertTriangle, LifeBuoy, 
  FileSignature, Bell, ShieldCheck, Settings, Server,
  KeyRound, Code
} from "lucide-react";

export function AdminSidebar() {
  const pathname = usePathname();

  const navGroups = [
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
        { name: "Withdrawals", href: "/admin/withdrawals", icon: ArrowUpFromLine }
      ]
    },
    {
      title: "P2P Marketplace",
      items: [
        { name: "Orders", href: "/admin/p2p", icon: Handshake },
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
        { name: "System", href: "/admin/system", icon: Server }
      ]
    }
  ];

  return (
    <aside className="w-64 bg-card border-r border-border hidden xl:flex flex-col h-[calc(100vh-64px)] sticky top-16 overflow-y-auto custom-scrollbar">
      <div className="p-4 space-y-3">
        {navGroups.map((group) => (
          <div key={group.title}>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-3">
              {group.title}
            </h4>
            <nav className="space-y-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
                const Icon = item.icon;
                return (
                  <Link 
                    key={item.href} 
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
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
