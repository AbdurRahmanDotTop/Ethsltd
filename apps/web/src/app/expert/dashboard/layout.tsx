"use client";

import { useRequireAuth } from "@/hooks/use-require-auth";
import { useEffect, useState } from "react";
import { Loader2, LayoutDashboard, Briefcase, Calendar, MessageSquare, DollarSign, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { LogOut } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { apiClient } from "@ethsltd/api-client";

export default function ExpertDashboardLayout({ children }: { children: React.ReactNode }) {
  const requireAuth = useRequireAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuthStore();

  const handleLogout = async () => {
    await apiClient.logout();
    logout();
    router.push('/login');
  };

  useEffect(() => {
    requireAuth(() => {
      setIsAuthenticated(true);
    });
  }, [requireAuth]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand-500 mb-4" />
        <p className="text-muted-foreground">Authenticating Expert Session...</p>
      </div>
    );
  }

  const navItems = [
    { name: "Overview", href: "/expert/dashboard", icon: LayoutDashboard },
    { name: "My Services", href: "/expert/dashboard/services", icon: Briefcase },
    { name: "Bookings", href: "/expert/dashboard/bookings", icon: Calendar },
    { name: "Messages", href: "/expert/dashboard/messages", icon: MessageSquare },
    { name: "Earnings", href: "/expert/dashboard/earnings", icon: DollarSign },
    { name: "Settings", href: "/expert/dashboard/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-card border-r border-border hidden md:flex md:flex-col">
          <div className="p-6 border-b border-border">
            <h2 className="text-xl font-display font-bold text-foreground">Expert Hub</h2>
          <p className="text-xs text-muted-foreground mt-1">Manage your services</p>
        </div>
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link 
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive 
                    ? "bg-brand-500/10 text-brand-600 font-medium" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.name}
              </Link>
            );
          })}
          </nav>
          
          <div className="p-4 border-t border-border mt-auto">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-500 hover:bg-red-500/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-muted/30">
          {children}
        </main>
      </div>
    </div>
  );
}
