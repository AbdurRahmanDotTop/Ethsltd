"use client";

import { Search, Bell, Activity } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";

export function AdminHeader() {
  const { user, logout } = useAuthStore();

  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent">
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
        <div className="flex items-center gap-3 border-l border-border pl-6">
          <div className="flex flex-col items-end hidden sm:flex">
            <span className="text-sm font-medium leading-none">{user?.displayName || "Admin"}</span>
            <span className="text-xs text-muted-foreground mt-1">{user?.role || "Administrator"}</span>
          </div>
          <div 
            className="w-9 h-9 rounded-full bg-brand-primary/20 flex items-center justify-center cursor-pointer overflow-hidden border border-brand-primary/30"
            onClick={() => {
              if (confirm("Logout from Admin Console?")) {
                logout();
              }
            }}
          >
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="text-brand-primary font-bold text-sm">A</span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
