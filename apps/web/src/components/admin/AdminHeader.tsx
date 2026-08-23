"use client";

import { useState, useRef, useEffect } from "react";
import { Search, Bell, Activity, User, Settings, LayoutDashboard, LogOut, Shield, Menu, X } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminNavGroups } from "./AdminSidebar";
import { apiClient } from "@ethsltd/api-client";
import { formatDistanceToNow } from "date-fns";

export function AdminHeader() {
  const { user, logout } = useAuthStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
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
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    
    // Fetch notifications
    const fetchNotifs = async () => {
      try {
        const res = await apiClient.getNotifications();
        if (res.success && res.data) {
          setNotifications(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch notifications", err);
      }
    };
    fetchNotifs();
    const interval = setInterval(fetchNotifs, 30000); // Polling every 30s
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      clearInterval(interval);
    };
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkAsRead = async (id: string) => {
    await apiClient.readNotification(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  return (
    <header className="min-h-[4rem] py-2 border-b border-border bg-card flex items-center justify-between px-6 sticky top-0 z-30 flex-wrap gap-y-4">
      <div className="flex items-center gap-4">
        {/* Mobile Menu Toggle */}
        <button 
          className="xl:hidden p-2 -ml-2 text-muted-foreground hover:text-foreground transition-colors"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <Menu className="w-5 h-5" />
        </button>

        <h1 className="text-xl font-bold text-white tracking-wide hidden sm:block py-1 pr-4">
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
        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="relative text-muted-foreground hover:text-foreground transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[14px] h-[14px] bg-red-500 rounded-full border-2 border-card text-[8px] font-bold text-white px-0.5">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {isNotificationsOpen && (
            <div className="fixed left-4 right-4 top-[4.5rem] sm:absolute sm:left-auto sm:right-0 sm:top-12 sm:w-96 bg-card border border-border rounded-xl shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
              <div className="p-3 border-b border-border bg-muted/20 flex items-center justify-between flex-wrap gap-y-4">
                <h3 className="font-semibold text-sm">Notifications</h3>
                {unreadCount > 0 && (
                  <button 
                    onClick={async () => {
                      await apiClient.readAllNotifications();
                      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
                    }}
                    className="text-xs text-brand-primary hover:text-brand-primary/80 font-medium"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-[350px] overflow-y-auto custom-scrollbar">
                {notifications.length > 0 ? (
                  <div className="divide-y divide-border">
                    {notifications.map((n) => (
                      <div 
                        key={n.id} 
                        className={`p-3 text-sm flex gap-3 hover:bg-muted/50 transition-colors ${!n.isRead ? 'bg-muted/20' : ''}`}
                        onClick={() => {
                          if (!n.isRead) handleMarkAsRead(n.id);
                        }}
                      >
                        <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${!n.isRead ? 'bg-brand-primary' : 'bg-transparent'}`} />
                        <div className="flex-1 min-w-0 cursor-pointer">
                          <p className="font-medium text-foreground">{n.title}</p>
                          <p className="text-muted-foreground text-xs mt-0.5 break-words">{n.message}</p>
                          <p className="text-[10px] text-muted-foreground/70 mt-1">{formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-muted-foreground">
                    <Bell className="w-8 h-8 mx-auto mb-2 opacity-20" />
                    <p className="text-sm">No notifications</p>
                  </div>
                )}
              </div>
              <div className="p-2 border-t border-border bg-muted/10 text-center">
                <Link href="/admin/notifications" onClick={() => setIsNotificationsOpen(false)} className="text-xs text-muted-foreground hover:text-foreground font-medium block w-full py-1">
                  View all notifications
                </Link>
              </div>
            </div>
          )}
        </div>

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
                  onClick={async () => {
                    setIsDropdownOpen(false);
                    try {
                      const { apiClient } = await import('@ethsltd/api-client');
                      await apiClient.logout();
                    } catch(e) {}
                    logout();
                    window.location.href = '/login';
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
            <div className="flex items-center justify-between p-4 border-b border-border flex-wrap gap-y-4">
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
