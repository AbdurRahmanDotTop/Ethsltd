import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Notification, NotificationCategory } from "@/lib/notifications/types";
import { MockNotificationProvider } from "@/lib/notifications/mock-notification-provider";
import { apiClient } from "@ethsltd/api-client";

interface NotificationPreferences {
  inApp: boolean;
  email: boolean;
  push: boolean;
}

interface NotificationSettings {
  security: NotificationPreferences;
  trading: NotificationPreferences;
  wallet: NotificationPreferences;
  p2p: NotificationPreferences;
  marketing: NotificationPreferences;
  system: NotificationPreferences;
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
}

const defaultSettings: NotificationSettings = {
  security: { inApp: true, email: true, push: true }, // Cannot be fully disabled
  trading: { inApp: true, email: true, push: true },
  wallet: { inApp: true, email: true, push: false },
  p2p: { inApp: true, email: true, push: true },
  system: { inApp: true, email: true, push: false },
  marketing: { inApp: true, email: false, push: false },
  quietHours: { enabled: false, start: "22:00", end: "07:00" },
};

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  total: number;
  isLoading: boolean;
  settings: NotificationSettings;
  
  fetchNotifications: (userId: string, category?: NotificationCategory | "ALL" | "UNREAD") => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  archiveNotification: (id: string) => Promise<void>;
  updateSettings: (newSettings: Partial<NotificationSettings>) => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: [],
      unreadCount: 0,
      total: 0,
      isLoading: false,
      settings: defaultSettings,

      fetchNotifications: async (userId, category = "ALL") => {
        set({ isLoading: true });
        try {
          const res = await apiClient.getNotifications();
          if (res.success && res.data) {
            // Map backend data to frontend format
            const items = res.data.map((n: any) => {
              let parsedActionUrl = "";
              if (n.type === "P2P" && n.message.includes("Order P2P-ORD-")) {
                const match = n.message.match(/(P2P-ORD-\d+)/);
                if (match && match[1]) {
                  parsedActionUrl = `/p2p/order/${match[1]}`;
                }
              }
              
              return {
                id: n.id,
                userId: n.userId,
                title: n.title,
                message: n.message,
                category: n.type,
                type: "SYSTEM_ANNOUNCEMENT" as any,
                priority: "NORMAL" as any,
                channels: ["IN_APP"] as any,
                status: (n.isRead ? "READ" : "UNREAD") as any,
                createdAt: n.createdAt,
                actionUrl: parsedActionUrl,
                actionText: parsedActionUrl ? "View Order" : ""
              };
            });

            // Filter if category is specified
            let filtered = items;
            if (category === "UNREAD") {
              filtered = items.filter((i: any) => i.status === "UNREAD");
            } else if (category !== "ALL") {
              filtered = items.filter((i: any) => i.category === category);
            }

            const unreadCount = items.filter((i: any) => i.status === "UNREAD").length;

            set({ notifications: filtered, unreadCount, total: items.length, isLoading: false });
          } else {
            set({ isLoading: false });
          }
        } catch (error) {
          console.error("Failed to fetch notifications", error);
          set({ isLoading: false });
        }
      },

      markAsRead: async (id) => {
        try {
          await apiClient.markNotificationRead(id);
          set((state) => ({
            notifications: state.notifications.map((n) =>
              n.id === id ? { ...n, status: "READ", readAt: new Date().toISOString() } : n
            ),
            unreadCount: Math.max(0, state.unreadCount - 1),
          }));
        } catch (error) {
          console.error("Failed to mark notification as read", error);
        }
      },

      markAllAsRead: async () => {
        try {
          await apiClient.markAllNotificationsRead();
          set((state) => ({
            notifications: state.notifications.map((n) =>
              n.status === "UNREAD" ? { ...n, status: "READ", readAt: new Date().toISOString() } : n
            ),
            unreadCount: 0,
          }));
        } catch (error) {
          console.error("Failed to mark all as read", error);
        }
      },

      archiveNotification: async (id) => {
        try {
          // Marking as read is our equivalent of archive for MVP, or just remove from UI
          await apiClient.markNotificationRead(id);
          set((state) => ({
            notifications: state.notifications.filter((n) => n.id !== id),
          }));
        } catch (error) {
          console.error("Failed to archive notification", error);
        }
      },

      updateSettings: (newSettings) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings }
        }));
      }
    }),
    {
      name: "ethsltd-notifications",
      partialize: (state) => ({ settings: state.settings }), // Only persist settings locally
    }
  )
);
