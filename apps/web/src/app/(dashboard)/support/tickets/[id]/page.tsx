"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import { 
  ArrowLeft, Loader2, Send, Paperclip, User, ShieldAlert, AlertCircle 
} from "lucide-react";
import { useSupportStore } from "@/stores/support-store";
import { useAuthStore } from "@/stores/auth-store";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function TicketDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const { user } = useAuthStore();
  const { activeTicket, isLoading, fetchTicket, addMessage } = useSupportStore();
  
  const [replyText, setReplyText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (id) {
      fetchTicket(id);
    }
  }, [id, fetchTicket]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeTicket?.messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeTicket) return;

    setIsSending(true);
    try {
      await addMessage(activeTicket.id, replyText, "USER");
      setReplyText("");
    } catch (error) {
      console.error(error);
    } finally {
      setIsSending(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "OPEN": return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600">OPEN</span>;
      case "IN_PROGRESS": return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600">IN PROGRESS</span>;
      case "WAITING_FOR_USER": return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-500/10 text-orange-600">ACTION REQUIRED</span>;
      case "RESOLVED": return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-green-500/10 text-green-600">RESOLVED</span>;
      case "CLOSED": return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-muted text-muted-foreground">CLOSED</span>;
      default: return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-muted text-muted-foreground">{status}</span>;
    }
  };

  if (isLoading && !activeTicket) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center min-h-[500px]">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!activeTicket) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Ticket Not Found</h1>
          <Button onClick={() => router.push("/support/tickets")} variant="outline">
            Back to Tickets
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  const isClosed = activeTicket.status === "RESOLVED" || activeTicket.status === "CLOSED";

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 md:px-8 py-8 md:py-12 flex flex-col">
        {/* Header */}
      <div className="shrink-0 mb-6 flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <button 
            onClick={() => router.push("/support/tickets")}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" /> Back to tickets
          </button>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{activeTicket.subject}</h1>
            {getStatusBadge(activeTicket.status)}
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="font-mono">Ticket #{activeTicket.id}</span>
            <span>•</span>
            <span>{activeTicket.category}</span>
            <span>•</span>
            <span>Created {format(new Date(activeTicket.createdAt), "MMM d, yyyy")}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 min-h-0 bg-card border border-border rounded-xl shadow-sm flex flex-col overflow-hidden">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-muted/10">
          {activeTicket.messages.map((msg) => {
            // Hide internal notes from user view
            if (msg.isInternalNote) return null;

            const isUser = msg.sender === "USER";
            return (
              <div key={msg.id} className={`flex gap-4 max-w-[85%] ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}>
                <div className="shrink-0 mt-1">
                  {isUser ? (
                    <div className="w-8 h-8 rounded-full bg-brand-primary/20 flex items-center justify-center text-brand-primary">
                      <User className="w-4 h-4" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-600">
                      <ShieldAlert className="w-4 h-4" />
                    </div>
                  )}
                </div>
                <div className={`flex flex-col gap-1 ${isUser ? 'items-end' : 'items-start'}`}>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">{isUser ? 'You' : 'ETHSLTD Support'}</span>
                    <span>{format(new Date(msg.timestamp), "MMM d, h:mm a")}</span>
                  </div>
                  <div className={`p-4 rounded-2xl whitespace-pre-wrap text-sm shadow-sm ${
                    isUser 
                      ? 'bg-brand-primary text-brand-foreground rounded-tr-none' 
                      : 'bg-card border border-border text-foreground rounded-tl-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Composer */}
        <div className="shrink-0 p-4 border-t border-border bg-card">
          {isClosed ? (
            <div className="text-center p-4 bg-muted/50 rounded-lg text-sm text-muted-foreground">
              This ticket is marked as {activeTicket.status.toLowerCase()}. You cannot reply to a closed ticket.
            </div>
          ) : (
            <form onSubmit={handleSend} className="space-y-4">
              <div className="bg-amber-500/10 text-amber-800 dark:text-amber-400 p-3 rounded-lg flex gap-3 items-start text-sm">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <p>ETHSLTD will never ask for your password, private key, recovery phrase or authentication code.</p>
              </div>
              <div className="relative">
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write a reply..."
                  className="w-full min-h-[100px] max-h-[300px] rounded-xl border border-input bg-background px-4 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary resize-y pr-12 pb-14"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend(e);
                    }
                  }}
                />
                <div className="absolute bottom-3 left-3 flex items-center gap-2">
                  <button type="button" className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted">
                    <Paperclip className="w-4 h-4" />
                  </button>
                  <span className="text-xs text-muted-foreground/50">{replyText.length} characters</span>
                </div>
                <div className="absolute bottom-3 right-3">
                  <Button type="submit" size="sm" disabled={isSending || !replyText.trim()} className="gap-2">
                    {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    Send
                  </Button>
                </div>
              </div>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
