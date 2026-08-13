"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import { 
  ArrowLeft, Loader2, Send, Lock, User, ShieldAlert, CheckCircle, Save
} from "lucide-react";
import { MockSupportProvider } from "@/lib/support/mock-support-provider";
import { SupportTicket, TicketStatus } from "@/lib/support/types";
import { Button } from "@/components/ui/button";

export default function AdminTicketDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  
  const [ticket, setTicket] = useState<SupportTicket | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [replyText, setReplyText] = useState("");
  const [isInternalNote, setIsInternalNote] = useState(false);
  const [isSending, setIsSending] = useState(false);
  
  const [currentStatus, setCurrentStatus] = useState<TicketStatus>("OPEN");
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchTicketData();
  }, [id]);

  const fetchTicketData = async () => {
    try {
      const data = await MockSupportProvider.getTicket(id);
      setTicket(data);
      if (data) setCurrentStatus(data.status);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [ticket?.messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !ticket) return;

    setIsSending(true);
    try {
      // Simulate sending via store/provider
      await MockSupportProvider.addMessage(ticket.id, replyText, isInternalNote ? "SYSTEM" : "SUPPORT", isInternalNote);
      await fetchTicketData(); // re-fetch to see updates
      setReplyText("");
    } catch (error) {
      console.error(error);
    } finally {
      setIsSending(false);
    }
  };

  const handleStatusChange = async (newStatus: TicketStatus) => {
    if (!ticket) return;
    try {
      await MockSupportProvider.updateTicketStatus(ticket.id, newStatus);
      await fetchTicketData();
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Ticket Not Found</h1>
        <Button onClick={() => router.push("/admin/support")} variant="outline">Back to Queue</Button>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col md:flex-row gap-6 -m-4 md:-m-8 p-4 md:p-8 bg-muted/30">
      
      {/* Left Col - Conversation */}
      <div className="flex-1 flex flex-col min-w-0 bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border bg-card shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => router.push("/admin/support")} className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h2 className="font-semibold">{ticket.subject}</h2>
          </div>
          <span className="text-xs font-mono text-muted-foreground">#{ticket.id}</span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          {ticket.messages.map((msg) => {
            const isUser = msg.sender === "USER";
            const isInternal = msg.isInternalNote;

            return (
              <div key={msg.id} className={`flex gap-4 max-w-[85%] ${isUser ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}>
                <div className="shrink-0 mt-1">
                  {isUser ? (
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                      <User className="w-4 h-4" />
                    </div>
                  ) : isInternal ? (
                    <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-600">
                      <Lock className="w-4 h-4" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-brand-primary/20 flex items-center justify-center text-brand-primary">
                      <ShieldAlert className="w-4 h-4" />
                    </div>
                  )}
                </div>
                <div className={`flex flex-col gap-1 ${isUser ? 'items-start' : 'items-end'}`}>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">
                      {isUser ? `User (${ticket.userId})` : isInternal ? 'Internal Note' : 'Support Agent'}
                    </span>
                    <span>{format(new Date(msg.timestamp), "MMM d, h:mm a")}</span>
                  </div>
                  <div className={`p-4 rounded-2xl whitespace-pre-wrap text-sm shadow-sm ${
                    isUser 
                      ? 'bg-muted border border-border text-foreground rounded-tl-none' 
                      : isInternal 
                        ? 'bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-200 rounded-tr-none'
                        : 'bg-brand-primary text-brand-foreground rounded-tr-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        <div className="shrink-0 p-4 border-t border-border bg-card">
          <form onSubmit={handleSend}>
            <div className="flex items-center gap-4 mb-3">
              <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={isInternalNote} 
                  onChange={(e) => setIsInternalNote(e.target.checked)}
                  className="rounded border-input text-amber-500 focus:ring-amber-500"
                />
                <span className={isInternalNote ? "text-amber-600 font-medium" : ""}>Internal Note (Hidden from user)</span>
              </label>
            </div>
            <div className="relative">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder={isInternalNote ? "Write an internal note..." : "Write a reply to the user..."}
                className={`w-full min-h-[100px] rounded-xl border px-4 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 resize-y pr-12 pb-14 ${
                  isInternalNote 
                    ? 'bg-amber-500/5 border-amber-500/20 focus-visible:ring-amber-500 placeholder:text-amber-700/50' 
                    : 'bg-background border-input focus-visible:ring-brand-primary'
                }`}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend(e);
                  }
                }}
              />
              <div className="absolute bottom-3 right-3">
                <Button 
                  type="submit" 
                  size="sm" 
                  disabled={isSending || !replyText.trim()} 
                  className={isInternalNote ? "bg-amber-500 hover:bg-amber-600 text-white" : "gap-2"}
                >
                  {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  {isInternalNote ? "Add Note" : "Send Reply"}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Right Col - Meta */}
      <div className="w-full md:w-80 shrink-0 space-y-6">
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <h3 className="font-semibold mb-4">Ticket Details</h3>
          
          <div className="space-y-4">
            <div>
              <label className="text-xs text-muted-foreground">Status</label>
              <select 
                value={currentStatus}
                onChange={(e) => {
                  setCurrentStatus(e.target.value as TicketStatus);
                  handleStatusChange(e.target.value as TicketStatus);
                }}
                className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
              >
                <option value="OPEN">OPEN</option>
                <option value="IN_PROGRESS">IN PROGRESS</option>
                <option value="WAITING_FOR_USER">WAITING FOR USER</option>
                <option value="WAITING_INTERNAL">WAITING INTERNAL</option>
                <option value="RESOLVED">RESOLVED</option>
                <option value="CLOSED">CLOSED</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-muted-foreground">Priority</label>
              <div className="mt-1 text-sm font-medium">{ticket.priority}</div>
            </div>

            <div>
              <label className="text-xs text-muted-foreground">Category</label>
              <div className="mt-1 text-sm">{ticket.category}</div>
            </div>

            <div>
              <label className="text-xs text-muted-foreground">Created At</label>
              <div className="mt-1 text-sm">{format(new Date(ticket.createdAt), "MMM d, yyyy HH:mm")}</div>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <h3 className="font-semibold mb-4">User Information</h3>
          
          <div className="space-y-3 text-sm">
            <div>
              <span className="text-muted-foreground block text-xs">User ID</span>
              <span className="font-mono">{ticket.userId}</span>
            </div>
            
            <div className="pt-3 border-t border-border">
              <Button variant="outline" className="w-full text-xs" size="sm">
                View Account Profile
              </Button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
