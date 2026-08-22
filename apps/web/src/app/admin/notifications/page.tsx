"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Bell, Search, Filter, Loader2, Send, X } from "lucide-react";
import { apiClient } from "@ethsltd/api-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Announcement Modal State
  const [showModal, setShowModal] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [announcement, setAnnouncement] = useState({
    title: "",
    message: "",
    type: "SYSTEM",
    target: "ALL",
    userId: ""
  });

  const fetchAll = async () => {
    setIsLoading(true);
    try {
      const res = await apiClient.getAdminNotifications();
      if (res.success && res.data) {
        setNotifications(res.data);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load notifications");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleSendAnnouncement = async () => {
    if (!announcement.title || !announcement.message) {
      toast.error("Title and message are required");
      return;
    }
    
    if (announcement.target === 'SPECIFIC' && !announcement.userId) {
      toast.error("User ID is required for specific target");
      return;
    }

    setIsSending(true);
    try {
      const res = await apiClient.sendAnnouncement(announcement);
      if (res.success) {
        toast.success(res.message || "Announcement sent successfully");
        setShowModal(false);
        setAnnouncement({ title: "", message: "", type: "SYSTEM", target: "ALL", userId: "" });
        fetchAll();
      } else {
        toast.error(res.error || "Failed to send announcement");
      }
    } catch (e) {
      toast.error("An error occurred");
    } finally {
      setIsSending(false);
    }
  };

  const filteredNotifications = notifications.filter(n => 
    n.userId?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    n.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notification System</h1>
          <p className="text-muted-foreground mt-1">Monitor platform-wide alerts and send announcements.</p>
        </div>
        <Button className="gap-2" onClick={() => setShowModal(true)}>
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
                  <th className="px-6 py-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredNotifications.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                      No notifications found.
                    </td>
                  </tr>
                ) : (
                  filteredNotifications.map((n) => (
                    <tr key={n.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">
                        {format(new Date(n.createdAt), "MMM d, HH:mm")}
                      </td>
                      <td className="px-6 py-4 font-mono text-xs">{n.userId}</td>
                      <td className="px-6 py-4">{n.type}</td>
                      <td className="px-6 py-4 font-medium">{n.title}</td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                          n.isRead ? 'bg-green-500/10 text-green-600' : 'bg-brand-primary/10 text-brand-primary'
                        }`}>
                          {n.isRead ? 'READ' : 'UNREAD'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Send Announcement Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-card w-full max-w-lg rounded-xl shadow-lg border border-border p-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Send Announcement</h2>
              <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Target Audience</label>
                <select 
                  value={announcement.target}
                  onChange={(e) => setAnnouncement({...announcement, target: e.target.value})}
                  className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                >
                  <option value="ALL">All Users</option>
                  <option value="SPECIFIC">Specific User</option>
                </select>
              </div>

              {announcement.target === 'SPECIFIC' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">User ID</label>
                  <Input 
                    placeholder="Enter user ID" 
                    value={announcement.userId}
                    onChange={(e) => setAnnouncement({...announcement, userId: e.target.value})}
                  />
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <select 
                  value={announcement.type}
                  onChange={(e) => setAnnouncement({...announcement, type: e.target.value})}
                  className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                >
                  <option value="SYSTEM">System</option>
                  <option value="TRADE">Trade</option>
                  <option value="DEPOSIT">Deposit</option>
                  <option value="WITHDRAWAL">Withdrawal</option>
                  <option value="SECURITY">Security</option>
                  <option value="P2P">P2P</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input 
                  placeholder="E.g., Scheduled Maintenance" 
                  value={announcement.title}
                  onChange={(e) => setAnnouncement({...announcement, title: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Message</label>
                <textarea 
                  rows={4}
                  placeholder="Enter announcement details..." 
                  value={announcement.message}
                  onChange={(e) => setAnnouncement({...announcement, message: e.target.value})}
                  className="w-full flex rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary resize-none"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
                <Button onClick={handleSendAnnouncement} disabled={isSending}>
                  {isSending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Send Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
