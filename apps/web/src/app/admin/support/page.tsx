"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { Search, Loader2, ChevronRight, MessageSquareWarning } from "lucide-react";
import { MockSupportProvider } from "@/lib/support/mock-support-provider";
import { SupportTicket } from "@/lib/support/types";
import { Button } from "@/components/ui/button";

export default function AdminSupportDashboard() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await MockSupportProvider.getAllTickets({});
        setTickets(res.items);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTickets();
  }, []);

  const openTicketsCount = tickets.filter(t => t.status === "OPEN").length;
  const waitingInternalCount = tickets.filter(t => t.status === "WAITING_INTERNAL").length;
  const urgentCount = tickets.filter(t => t.priority === "URGENT" || t.priority === "HIGH").length;
  
  const filteredTickets = tickets.filter(t => 
    t.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "OPEN": return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/10 text-blue-600">OPEN</span>;
      case "IN_PROGRESS": return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-600">IN PROGRESS</span>;
      case "WAITING_FOR_USER": return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-orange-500/10 text-orange-600">WAITING USER</span>;
      case "WAITING_INTERNAL": return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-500/10 text-red-600">WAITING INTERNAL</span>;
      case "RESOLVED": return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-green-500/10 text-green-600">RESOLVED</span>;
      case "CLOSED": return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-muted text-muted-foreground">CLOSED</span>;
      default: return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-muted text-muted-foreground">{status}</span>;
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Support Queue</h1>
        <p className="text-muted-foreground mt-1">Manage user tickets and inquiries.</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div className="bg-card border border-border p-4 rounded-xl shadow-sm">
          <p className="text-sm font-medium text-muted-foreground mb-1">Open Tickets</p>
          <p className="text-3xl font-bold text-blue-600">{openTicketsCount}</p>
        </div>
        <div className="bg-card border border-border p-4 rounded-xl shadow-sm">
          <p className="text-sm font-medium text-muted-foreground mb-1">Waiting Internal</p>
          <p className="text-3xl font-bold text-red-600">{waitingInternalCount}</p>
        </div>
        <div className="bg-card border border-border p-4 rounded-xl shadow-sm">
          <p className="text-sm font-medium text-muted-foreground mb-1">High/Urgent</p>
          <p className="text-3xl font-bold text-amber-600">{urgentCount}</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search by ID, User, or Subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
          </div>
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
                  <th className="px-6 py-4 font-semibold">ID</th>
                  <th className="px-6 py-4 font-semibold">User</th>
                  <th className="px-6 py-4 font-semibold">Subject</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Priority</th>
                  <th className="px-6 py-4 font-semibold">Last Updated</th>
                  <th className="px-6 py-4 font-semibold"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredTickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-muted/30 transition-colors group">
                    <td className="px-6 py-4 font-mono text-xs">{ticket.id}</td>
                    <td className="px-6 py-4 font-mono text-xs text-muted-foreground">{ticket.userId}</td>
                    <td className="px-6 py-4 font-medium max-w-[250px] truncate">{ticket.subject}</td>
                    <td className="px-6 py-4">{getStatusBadge(ticket.status)}</td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                        ticket.priority === 'HIGH' || ticket.priority === 'URGENT' 
                          ? 'bg-red-500/10 text-red-600' : 'bg-muted text-muted-foreground'
                      }`}>
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{format(new Date(ticket.updatedAt), "MMM d, HH:mm")}</td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/admin/support/tickets/${ticket.id}`} className="inline-flex items-center justify-center p-2 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                        <ChevronRight className="w-4 h-4" />
                      </Link>
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
