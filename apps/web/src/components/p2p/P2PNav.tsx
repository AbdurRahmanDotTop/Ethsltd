"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function P2PNav() {
  const pathname = usePathname();

  const links = [
    { name: "P2P Marketplace", href: "/p2p", exact: true },
    { name: "Orders", href: "/p2p/orders", exact: false },
    { name: "My Ads", href: "/p2p/my-ads", exact: false },
    { name: "Expert Services", href: "/p2p/experts", exact: false },
  ];

  return (
    <div className="border-b border-border bg-background">
      <div className="max-w-[1280px] mx-auto px-4 md:px-8">
        <nav className="flex items-center gap-6 overflow-x-auto scrollbar-none">
          {links.map((link) => {
            const isActive = link.exact 
              ? pathname === link.href 
              : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`py-4 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                  isActive
                    ? "border-primary text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
