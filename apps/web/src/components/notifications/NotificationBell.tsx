"use client";

import { useEffect, useState, useRef } from "react";
import { Bell, Check, Clock, ShieldAlert, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useNotificationStore } from "@/stores/notification-store";
import { useAuthStore } from "@/stores/auth-store";

function formatTimeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.round(diffMs / 60000);
  const diffHrs = Math.round(diffMins / 60);
  const diffDays = Math.round(diffHrs / 24);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHrs < 24) return `${diffHrs} hr ago`;
  if (diffDays === 1) return "Yesterday";
  return `${diffDays} days ago`;
}

export function NotificationBell() {
  const { user } = useAuthStore();
  const { fetchNotifications, notifications, unreadCount, markAsRead } = useNotificationStore();
  
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user?.id) {
      fetchNotifications(user.id);
    }
  }, [user, fetchNotifications]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const previewNotifications = notifications.slice(0, 5);

  const handleNotificationClick = async (id: string, actionUrl?: string) => {
    await markAsRead(id);
    setIsOpen(false);
    if (actionUrl) {
      // Actually navigate via window or router. For now we use the Link wrapping, 
      // but in some cases we might need imperative navigation.
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-muted-foreground hover:text-foreground transition-colors relative rounded-full hover:bg-muted focus:outline-none focus:ring-2 focus:ring-brand-primary"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-card" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-full max-w-[20rem] sm:w-96 bg-card border border-border rounded-lg shadow-xl overflow-hidden z-50 flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30 flex-wrap gap-y-4">
            <h3 className="font-semibold text-sm">Notifications</h3>
            {unreadCount > 0 && (
              <span className="text-xs bg-brand-primary/10 text-brand-primary px-2 py-0.5 rounded-full font-medium">
                {unreadCount > 99 ? "99+" : unreadCount} New
              </span>
            )}
          </div>

          <div className="flex-1 overflow-y-auto max-h-[400px]">
            {previewNotifications.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <Bell className="w-8 h-8 mx-auto mb-3 opacity-20" />
                <p className="text-sm">You're all caught up</p>
                <p className="text-xs mt-1">No new notifications</p>
              </div>
            ) : (
              <ul className="divide-y divide-border/50">
                {previewNotifications.map(notification => (
                  <li 
                    key={notification.id} 
                    className={`relative p-4 hover:bg-muted/50 transition-colors ${notification.status === 'UNREAD' ? 'bg-brand-primary/5' : ''}`}
                  >
                    <Link 
                      href={notification.actionUrl || "/notifications"} 
                      onClick={() => handleNotificationClick(notification.id)}
                      className="block"
                    >
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 mt-1">
                          {notification.category === "SECURITY" ? (
                            <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
                              <ShieldAlert className="w-4 h-4" />
                            </div>
                          ) : notification.category === "TRADING" || notification.category === "WALLET" ? (
                            <div className="w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                              <Check className="w-4 h-4" />
                            </div>
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                              <Bell className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm ${notification.status === 'UNREAD' ? 'font-semibold text-foreground' : 'font-medium text-foreground/80'}`}>
                            {notification.title}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-1.5 mt-2 text-[10px] text-muted-foreground/70 font-mono">
                            <Clock className="w-3 h-3" />
                            {formatTimeAgo(notification.createdAt)}
                          </div>
                        </div>
                        {notification.status === 'UNREAD' && (
                          <div className="w-2 h-2 rounded-full bg-brand-primary mt-1.5 flex-shrink-0 shadow-[0_0_8px_rgba(20,91,140,0.5)]" />
                        )}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="p-3 border-t border-border bg-muted/30">
            <Link 
              href="/notifications" 
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 text-sm text-brand-primary font-medium hover:text-brand-primary/80 transition-colors p-2"
            >
              View all notifications <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
