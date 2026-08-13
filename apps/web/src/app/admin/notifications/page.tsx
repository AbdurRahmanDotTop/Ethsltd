"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Bell, Search, Filter, Loader2, Send } from "lucide-react";
import { MockNotificationProvider } from "@/lib/notifications/mock-notification-provider";
import { Notification } from "@/lib/notifications/types";
import { Button } from "@/components/ui/button";

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const data = await MockNotificationProvider.getAllSystemNotifications();
        setNotifications(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAll();
  }, []);

  const filteredNotifications = notifications.filter(n => 
    n.userId.toLowerCase().includes(searchTerm.toLowerCase()) || 
    n.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notification System</h1>
          <p className="text-muted-foreground mt-1">Monitor platform-wide alerts and send announcements.</p>
        </div>
        <Button className="gap-2">
          <Send className="w-4 h-4" /> Send Announcement
        </Button>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border flex flex-col sm:flex-row items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search by User ID or title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" /> Filter
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-6 py-4 font-semibold">Time</th>
                  <th className="px-6 py-4 font-semibold">User ID</th>
                  <th className="px-6 py-4 font-semibold">Category</th>
                  <th className="px-6 py-4 font-semibold">Title</th>
                  <th className="px-6 py-4 font-semibold">Channels</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredNotifications.map((n) => (
                  <tr key={n.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">
                      {format(new Date(n.createdAt), "MMM d, HH:mm")}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs">{n.userId}</td>
                    <td className="px-6 py-4">{n.category}</td>
                    <td className="px-6 py-4 font-medium">{n.title}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1">
                        {n.channels.map(c => (
                          <span key={c} className="text-[10px] bg-muted px-1.5 py-0.5 rounded">{c}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                        n.status === 'READ' ? 'bg-green-500/10 text-green-600' : 'bg-brand-primary/10 text-brand-primary'
                      }`}>
                        {n.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
