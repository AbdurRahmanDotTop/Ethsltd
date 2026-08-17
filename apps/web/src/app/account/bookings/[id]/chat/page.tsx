"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiClient } from "@ethsltd/api-client";
import { toast } from "sonner";
import { Send, ArrowLeft, AlertCircle, MessageCircle } from "lucide-react";
import Link from "next/link";

interface ChatMessage {
  id: string;
  senderId: string;
  content: string;
  createdAt: string;
  senderName: string;
}

export default function UserChatPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isChatClosed, setIsChatClosed] = useState(false);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [bookingStatus, setBookingStatus] = useState<string>("");
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollingInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const currentUser = JSON.parse(typeof window !== 'undefined' ? localStorage.getItem("user") || "{}" : "{}");

  const fetchMessages = async () => {
    try {
      const res = await apiClient.getExpertMessages(id);
      if (res.success) {
        setMessages(res.data.messages);
        setIsChatClosed(res.data.isChatClosed);
        setBookingStatus(res.data.bookingStatus);
      } else {
        toast.error("Failed to fetch chat or unauthorized");
        router.push("/account/bookings");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to connect to chat");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    
    pollingInterval.current = setInterval(() => {
      fetchMessages();
    }, 3000);
    
    return () => {
      if (pollingInterval.current) clearInterval(pollingInterval.current);
    };
  }, [id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || sending || isChatClosed) return;
    
    const text = inputText;
    setInputText("");
    setSending(true);
    
    const tempMsg = {
      id: "temp_" + Date.now(),
      senderId: currentUser.id,
      content: text,
      createdAt: new Date().toISOString(),
      senderName: "You"
    };
    setMessages(prev => [...prev, tempMsg]);
    
    try {
      const res = await apiClient.sendExpertMessage(id, text);
      if (!res.success) {
        toast.error(res.error || "Failed to send message");
      }
    } catch (err) {
      toast.error("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return <div className="p-10 flex justify-center"><div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-6 md:py-10">
      <div className="mb-6 flex items-center gap-4">
        <Link href="/account/bookings" className="p-2 bg-muted rounded-full hover:bg-muted/80 transition-colors">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </Link>
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Expert Chat</h1>
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            Status: 
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border flex w-fit items-center gap-1 ${
              bookingStatus === 'COMPLETED' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
              bookingStatus === 'ACCEPTED' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
              'bg-orange-500/10 text-orange-500 border-orange-500/20'
            }`}>
              {bookingStatus.replace('_', ' ')}
            </span>
          </p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden flex flex-col h-[600px] shadow-sm">
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {isChatClosed && (
            <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-start gap-3 mb-6">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-red-500 mb-1">Chat is Closed</h4>
                <p className="text-sm text-red-400">
                  This chat is currently closed. If your monthly plan has expired, please renew your service to continue chatting with the expert.
                </p>
              </div>
            </div>
          )}
          
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground text-sm opacity-50">
              <MessageCircle className="w-12 h-12 mb-4" />
              No messages yet. Send a message to start the conversation!
            </div>
          ) : (
            messages.map((msg, idx) => {
              const isMe = msg.senderId === currentUser.id;
              return (
                <div key={msg.id || idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  {!isMe && (
                    <div className="w-8 h-8 rounded-full bg-brand-500/20 flex items-center justify-center text-brand-600 font-bold text-xs mr-2 shrink-0">
                      {msg.senderName?.[0]?.toUpperCase() || 'E'}
                    </div>
                  )}
                  <div className={`max-w-[75%] rounded-2xl px-4 py-2 ${isMe ? 'bg-brand-600 text-white rounded-tr-sm' : 'bg-muted text-foreground rounded-tl-sm'}`}>
                    <div className="text-[15px] whitespace-pre-wrap">{msg.content}</div>
                    <div className={`text-[10px] mt-1 text-right ${isMe ? 'text-brand-200' : 'text-muted-foreground'}`}>
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-muted/30 border-t border-border shrink-0">
          <form onSubmit={handleSendMessage} className="flex gap-2 max-w-3xl mx-auto">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={isChatClosed ? "Chat is closed" : "Type your message..."}
              disabled={isChatClosed}
              className="flex-1 bg-background border border-border rounded-full px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
              type="submit"
              disabled={isChatClosed || !inputText.trim() || sending}
              className="w-12 h-12 rounded-full bg-brand-600 text-white flex items-center justify-center hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0 shadow-sm"
            >
              <Send className="w-5 h-5 ml-1" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
