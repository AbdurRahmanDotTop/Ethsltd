"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { 
  Bell, Check, ShieldAlert, Clock, MoreVertical, CheckCheck, Trash2, Archive, Loader2, Info
} from "lucide-react";
import { useNotificationStore } from "@/stores/notification-store";
import { useAuthStore } from "@/stores/auth-store";
import { NotificationCategory } from "@/lib/notifications/types";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const tabs: { label: string; value: NotificationCategory | "ALL" | "UNREAD" }[] = [
  { label: "All", value: "ALL" },
  { label: "Unread", value: "UNREAD" },
  { label: "Security", value: "SECURITY" },
  { label: "Trading", value: "TRADING" },
  { label: "Wallet", value: "WALLET" },
  { label: "P2P", value: "P2P" },
  { label: "System", value: "SYSTEM" },
];

export default function NotificationsPage() {
  const { user } = useAuthStore();
  const { 
    notifications, isLoading, fetchNotifications, markAsRead, markAllAsRead, archiveNotification 
  } = useNotificationStore();
  
  const [activeTab, setActiveTab] = useState<NotificationCategory | "ALL" | "UNREAD">("ALL");

  useEffect(() => {
    if (user?.id) {
      fetchNotifications(user.id, activeTab);
    }
  }, [user, activeTab, fetchNotifications]);

  const handleMarkAllRead = async () => {
    await markAllAsRead();
  };

  const getIcon = (category: string) => {
    switch (category) {
      case "SECURITY":
        return <ShieldAlert className="w-5 h-5 text-red-500" />;
      case "TRADING":
      case "WALLET":
        return <Check className="w-5 h-5 text-brand-primary" />;
      case "P2P":
        return <Info className="w-5 h-5 text-blue-500" />;
      default:
        return <Bell className="w-5 h-5 text-muted-foreground" />;
    }
  };

  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground mt-1">Stay updated with your account activity.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link 
            href="/account/preferences/notifications" 
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-md hover:bg-muted"
          >
            Preferences
          </Link>
          <button 
            onClick={handleMarkAllRead}
            className="text-sm font-medium text-brand-primary hover:text-brand-primary/80 transition-colors flex items-center gap-2 px-3 py-2 rounded-md hover:bg-brand-primary/10"
          >
            <CheckCheck className="w-4 h-4" /> Mark all as read
          </button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col min-h-[500px]">
        {/* Tabs */}
        <div className="border-b border-border overflow-x-auto scrollbar-hide">
          <div className="flex px-2">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`px-4 py-4 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                  activeTab === tab.value
                    ? "border-brand-primary text-brand-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 bg-muted/10 relative">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-card/50 backdrop-blur-sm z-10">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Bell className="w-8 h-8 text-muted-foreground/50" />
              </div>
              <h3 className="text-lg font-semibold">No notifications</h3>
              <p className="text-muted-foreground mt-1">You're all caught up for now.</p>
            </div>
          ) : (
            <div className="divide-y divide-border/50">
              {notifications.map((notification) => (
                <div 
                  key={notification.id}
                  className={`p-6 transition-colors hover:bg-muted/30 flex gap-4 ${
                    notification.status === "UNREAD" ? "bg-brand-primary/[0.03]" : ""
                  }`}
                >
                  <div className="flex-shrink-0 mt-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      notification.category === "SECURITY" ? "bg-red-500/10" :
                      notification.category === "TRADING" || notification.category === "WALLET" ? "bg-brand-primary/10" :
                      "bg-muted"
                    }`}>
                      {getIcon(notification.category)}
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                      <div>
                        <h4 className={`text-base flex items-center gap-2 ${
                          notification.status === "UNREAD" ? "font-semibold text-foreground" : "font-medium text-foreground/80"
                        }`}>
                          {notification.title}
                          {notification.status === "UNREAD" && (
                            <span className="w-2 h-2 rounded-full bg-brand-primary" />
                          )}
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1 leading-relaxed max-w-2xl">
                          {notification.message}
                        </p>
                      </div>
                      <div className="text-xs text-muted-foreground whitespace-nowrap flex items-center gap-1 font-mono">
                        <Clock className="w-3.5 h-3.5" />
                        {format(new Date(notification.createdAt), "MMM d, h:mm a")}
                      </div>
                    </div>
                    
                    {notification.actionUrl && (
                      <div className="mt-4">
                        <Link 
                          href={notification.actionUrl}
                          onClick={() => markAsRead(notification.id)}
                          className="inline-flex items-center justify-center text-sm font-medium bg-background border border-border hover:bg-muted transition-colors px-4 py-2 rounded-lg"
                        >
                          View Details
                        </Link>
                      </div>
                    )}
                  </div>

                  <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block">
                    {/* Placeholder for individual actions if needed */}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
      </main>
      <Footer />
    </>
  );
}
