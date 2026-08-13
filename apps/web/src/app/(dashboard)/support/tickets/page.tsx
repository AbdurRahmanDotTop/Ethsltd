"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { 
  Ticket, Plus, Search, ChevronRight, Loader2, ArrowLeft, MessageSquare, AlertCircle
} from "lucide-react";
import { useSupportStore } from "@/stores/support-store";
import { useAuthStore } from "@/stores/auth-store";
import { Button } from "@/components/ui/button";
import { TicketCategory } from "@/lib/support/types";

export default function SupportTicketsPage() {
  const { user } = useAuthStore();
  const { tickets, isLoading, fetchTickets, createTicket } = useSupportStore();
  
  const [isCreating, setIsCreating] = useState(false);
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState<TicketCategory>("Account");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user?.id && !isCreating) {
      fetchTickets(user.id);
    }
  }, [user, isCreating, fetchTickets]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id || !subject.trim() || !description.trim()) return;

    setIsSubmitting(true);
    try {
      await createTicket({
        userId: user.id,
        subject,
        category,
        description,
      });
      setIsCreating(false);
      setSubject("");
      setDescription("");
      // refetch will happen via effect or store already unshifted it
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "OPEN": return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/10 text-blue-600">OPEN</span>;
      case "IN_PROGRESS": return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-600">IN PROGRESS</span>;
      case "WAITING_FOR_USER": return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-orange-500/10 text-orange-600">ACTION REQUIRED</span>;
      case "RESOLVED": return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-green-500/10 text-green-600">RESOLVED</span>;
      case "CLOSED": return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-muted text-muted-foreground">CLOSED</span>;
      default: return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-muted text-muted-foreground">{status}</span>;
    }
  };

  if (isCreating) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 md:py-12">
        <button 
          onClick={() => setIsCreating(false)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Back to tickets
        </button>
        
        <div className="bg-card border border-border rounded-xl p-6 md:p-8 shadow-sm">
          <h1 className="text-2xl font-bold tracking-tight mb-2">Create Support Ticket</h1>
          <p className="text-muted-foreground mb-8">Please describe your issue in detail so we can help you efficiently.</p>
          
          <form onSubmit={handleCreate} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value as TicketCategory)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
              >
                <option value="Account">Account</option>
                <option value="Security">Security</option>
                <option value="Trading">Trading</option>
                <option value="Wallet">Wallet</option>
                <option value="Deposit">Deposit</option>
                <option value="Withdrawal">Withdrawal</option>
                <option value="P2P">P2P</option>
                <option value="KYC">KYC</option>
                <option value="Payment">Payment</option>
                <option value="Technical">Technical</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Subject</label>
              <input 
                type="text" 
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Brief summary of the issue"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <textarea 
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide all relevant details, including transaction IDs if applicable..."
                className="flex min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary resize-y"
              />
            </div>

            <div className="bg-amber-500/10 text-amber-800 dark:text-amber-400 p-4 rounded-lg flex gap-3 items-start">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <p className="text-sm">ETHSLTD will never ask for your password, private key, recovery phrase or authentication code through unsolicited communication.</p>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <Button type="button" variant="outline" onClick={() => setIsCreating(false)}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...</>
                ) : "Submit Request"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-8 md:py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Support Tickets</h1>
          <p className="text-muted-foreground mt-1">Manage your support requests.</p>
        </div>
        <Button onClick={() => setIsCreating(true)} className="gap-2">
          <Plus className="w-4 h-4" /> Create Ticket
        </Button>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : tickets.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center p-6">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Ticket className="w-8 h-8 text-muted-foreground/50" />
            </div>
            <h3 className="text-lg font-semibold">No tickets</h3>
            <p className="text-muted-foreground mt-1 mb-6">You don't have any support tickets yet.</p>
            <Button onClick={() => setIsCreating(true)} variant="outline">Create your first ticket</Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-6 py-4 font-semibold text-foreground">Ticket</th>
                  <th className="px-6 py-4 font-semibold text-foreground">Subject</th>
                  <th className="px-6 py-4 font-semibold text-foreground">Category</th>
                  <th className="px-6 py-4 font-semibold text-foreground">Status</th>
                  <th className="px-6 py-4 font-semibold text-foreground">Updated</th>
                  <th className="px-6 py-4 font-semibold text-foreground"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {tickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-muted/30 transition-colors group">
                    <td className="px-6 py-4 font-mono text-xs text-muted-foreground">{ticket.id}</td>
                    <td className="px-6 py-4">
                      <Link href={`/support/tickets/${ticket.id}`} className="font-medium text-foreground hover:text-brand-primary transition-colors block">
                        {ticket.subject}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{ticket.category}</td>
                    <td className="px-6 py-4">{getStatusBadge(ticket.status)}</td>
                    <td className="px-6 py-4 text-muted-foreground">{format(new Date(ticket.updatedAt), "MMM d, yyyy")}</td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/support/tickets/${ticket.id}`} className="inline-flex items-center justify-center p-2 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
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
