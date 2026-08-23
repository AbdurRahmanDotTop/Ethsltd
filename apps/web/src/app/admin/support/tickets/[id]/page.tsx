"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import { 
  ArrowLeft, Loader2, Send, Lock, User, ShieldAlert, CheckCircle, Save, Paperclip, X
} from "lucide-react";
import { apiClient } from "@ethsltd/api-client";
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
  
  const [attachment, setAttachment] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchTicketData();
  }, [id]);

  const fetchTicketData = async () => {
    try {
      const res = await apiClient.adminGetSupportTicketDetails(id);
      if (res.success && res.data) {
        setTicket({ ...res.data.ticket, messages: res.data.messages });
        setCurrentStatus(res.data.ticket.status);
      } else {
        setTicket(null);
      }
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

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!replyText.trim() && !attachment) || !ticket) return;

    setIsSending(true);
    try {
      let attachmentBase64 = undefined;
      if (attachment) {
        attachmentBase64 = await fileToBase64(attachment);
      }

      await apiClient.adminSendSupportMessage(ticket.id, replyText, isInternalNote, attachmentBase64);
      await fetchTicketData(); // re-fetch to see updates
      setReplyText("");
      setAttachment(null);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSending(false);
    }
  };

  const handleStatusChange = async (newStatus: TicketStatus) => {
    if (!ticket) return;
    try {
      await apiClient.adminUpdateSupportTicketStatus(ticket.id, newStatus);
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
        <div className="p-4 border-b border-border bg-card shrink-0 flex items-center justify-between flex-wrap gap-y-4">
          <div className="flex items-center gap-3">
            <button onClick={() => router.push("/admin/support")} className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h2 className="font-semibold">{ticket.subject}</h2>
          </div>
          <span className="text-xs font-mono text-muted-foreground">#{ticket.id}</span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          {ticket.messages.map((msg: any) => {
            const isUser = !msg.isAdmin;
            const isInternal = false; // Internal notes not supported in real schema yet

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
                    <span>{msg.createdAt ? format(new Date(msg.createdAt), "MMM d, h:mm a") : 'Unknown time'}</span>
                  </div>
                  <div className={`p-4 rounded-2xl text-sm shadow-sm flex flex-col gap-3 ${
                    isUser 
                      ? 'bg-muted border border-border text-foreground rounded-tl-none' 
                      : isInternal 
                        ? 'bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-200 rounded-tr-none'
                        : 'bg-brand-primary text-brand-foreground rounded-tr-none'
                  }`}>
                    {msg.content && <div className="whitespace-pre-wrap">{msg.content}</div>}
                    {msg.attachmentBase64 && (
                      <div className="mt-1 rounded-lg overflow-hidden max-w-xs border border-border/50">
                        {msg.attachmentBase64.startsWith('data:image') ? (
                          <img src={msg.attachmentBase64} alt="Attachment" className="w-full h-auto object-cover" />
                        ) : (
                          <a href={msg.attachmentBase64} download="attachment.pdf" className="flex items-center gap-2 p-3 bg-background/50 hover:bg-background transition-colors text-foreground text-xs font-medium">
                            <Paperclip className="w-4 h-4 shrink-0" />
                            <span className="truncate">Download PDF Attachment</span>
                          </a>
                        )}
                      </div>
                    )}
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
                <div className="absolute bottom-3 left-3 flex items-center gap-2">
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*,application/pdf"
                    onChange={(e) => setAttachment(e.target.files?.[0] || null)} 
                  />
                  <button 
                    type="button" 
                    onClick={() => fileInputRef.current?.click()}
                    className={`p-2 transition-colors rounded-lg ${attachment ? 'bg-brand-primary/10 text-brand-primary' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`}
                  >
                    <Paperclip className="w-5 h-5" />
                  </button>
                  {attachment && (
                    <div className="flex items-center gap-1 text-xs font-medium bg-muted px-2 py-1 rounded-md">
                      <span className="truncate max-w-[120px]">{attachment.name}</span>
                      <button type="button" onClick={() => setAttachment(null)} className="text-muted-foreground hover:text-foreground">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
                <div className="absolute bottom-3 right-3">
                  <Button 
                    type="submit" 
                    size="sm" 
                    disabled={isSending || (!replyText.trim() && !attachment)} 
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
