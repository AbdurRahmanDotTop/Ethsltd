"use client";

import { useState, useRef, useEffect } from "react";
import { Search, Bell, Activity, User, Settings, LayoutDashboard, LogOut, Shield, Menu, X } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminNavGroups } from "./AdminSidebar";

export function AdminHeader() {
  const { user, logout } = useAuthStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const allHrefs = adminNavGroups.flatMap(g => g.items.map(i => i.href));
  const activeHref = allHrefs
    .filter(href => pathname === href || pathname.startsWith(href + '/'))
    .sort((a, b) => b.length - a.length)[0] || pathname;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        {/* Mobile Menu Toggle */}
        <button 
          className="xl:hidden p-2 -ml-2 text-muted-foreground hover:text-foreground transition-colors"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <Menu className="w-5 h-5" />
        </button>

        <h1 className="text-xl font-bold bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent hidden sm:block py-1 pr-4">
          ETHSLTD Admin
        </h1>
        
        {/* Global Search Shortcut */}
        <div className="hidden md:flex items-center ml-8 relative">
          <Search className="absolute left-3 text-muted-foreground w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search users, orders, TxID (Press '/')"
            className="pl-9 pr-4 py-2 w-72 bg-muted/50 border border-border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-brand-primary"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* System Status */}
        <div className="hidden lg:flex items-center gap-2">
          <Activity className="w-4 h-4 text-green-500" />
          <span className="text-xs font-medium text-foreground">API: Operational</span>
        </div>

        {/* Notifications */}
        <button className="relative text-muted-foreground hover:text-foreground transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-card"></span>
        </button>

        {/* Admin Profile */}
        <div className="flex items-center gap-3 border-l border-border pl-6 relative" ref={dropdownRef}>
          <div className="flex flex-col items-end hidden sm:flex">
            <span className="text-sm font-medium leading-none">{user?.displayName || "Admin"}</span>
            <span className="text-xs text-muted-foreground mt-1">{user?.role || "Administrator"}</span>
          </div>
          <button 
            className="w-9 h-9 rounded-full bg-brand-primary/20 flex items-center justify-center cursor-pointer overflow-hidden border border-brand-primary/30 transition-transform hover:scale-105"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="text-brand-primary font-bold text-sm">
                {user?.displayName ? user.displayName.charAt(0).toUpperCase() : "A"}
              </span>
            )}
          </button>

          {/* Profile Dropdown */}
          {isDropdownOpen && (
            <div className="absolute right-0 top-12 mt-2 w-56 bg-card border border-border rounded-xl shadow-xl overflow-hidden py-1 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="px-4 py-3 border-b border-border bg-muted/20">
                <p className="text-sm font-medium">{user?.displayName || "Admin User"}</p>
                <p className="text-xs text-muted-foreground truncate mt-0.5">{user?.email}</p>
                <div className="mt-2 flex items-center gap-1 text-[10px] uppercase font-bold text-brand-primary bg-brand-primary/10 px-2 py-0.5 rounded w-fit">
                  <Shield className="w-3 h-3" />
                  {user?.role?.replace('_', ' ') || "ADMIN"}
                </div>
              </div>
              
              <div className="py-1">
                <Link 
                  href="/account/profile" 
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-muted/50 transition-colors"
                >
                  <User className="w-4 h-4 text-muted-foreground" />
                  View Profile
                </Link>
                <Link 
                  href="/account" 
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-muted/50 transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4 text-muted-foreground" />
                  User Dashboard
                </Link>
                <Link 
                  href="/admin/settings" 
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-muted/50 transition-colors"
                >
                  <Settings className="w-4 h-4 text-muted-foreground" />
                  Settings
                </Link>
              </div>
              
              <div className="border-t border-border py-1">
                <button 
                  onClick={() => {
                    setIsDropdownOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 transition-colors text-left"
                >
                  <LogOut className="w-4 h-4" />
                  Log Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex xl:hidden">
          <div 
            className="fixed inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative w-72 max-w-[80vw] bg-card border-r border-border flex flex-col h-full animate-in slide-in-from-left">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <span className="font-bold text-lg">Admin Menu</span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-6 overflow-y-auto custom-scrollbar flex-1 pb-20">
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
                          onClick={() => setIsMobileMenuOpen(false)}
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
          </div>
        </div>
      )}
    </header>
  );
}
