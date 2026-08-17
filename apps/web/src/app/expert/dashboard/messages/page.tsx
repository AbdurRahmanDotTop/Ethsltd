"use client";

import { useEffect, useState, useRef } from "react";
import { apiClient } from "@ethsltd/api-client";
import { toast } from "sonner";
import { Send, User, MessageSquare, Lock, Unlock, AlertCircle } from "lucide-react";

interface Booking {
  id: string;
  status: string;
  serviceTitle: string;
  userDisplayName: string;
}

interface ChatMessage {
  id: string;
  senderId: string;
  content: string;
  createdAt: string;
  senderName: string;
}

export default function ExpertMessagesPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isChatClosed, setIsChatClosed] = useState(false);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollingInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const currentUser = JSON.parse(typeof window !== 'undefined' ? localStorage.getItem("user") || "{}" : "{}");

  const fetchBookings = async () => {
    try {
      const res = await apiClient.expertGetBookings();
      if (res.success && res.data) {
        // Only show chats for accepted/completed or active bookings
        const valid = res.data.filter((b: Booking) => !['PENDING_PAYMENT', 'PENDING_EXPERT', 'CANCELLED', 'REFUNDED'].includes(b.status));
        setBookings(valid);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (bookingId: string) => {
    try {
      const res = await apiClient.getExpertMessages(bookingId);
      if (res.success) {
        setMessages(res.data.messages);
        setIsChatClosed(res.data.isChatClosed);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchBookings();
  }, []);

  useEffect(() => {
    if (selectedBooking) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchMessages(selectedBooking.id);
      
      if (pollingInterval.current) clearInterval(pollingInterval.current);
      
      pollingInterval.current = setInterval(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchMessages(selectedBooking.id);
      }, 3000); // Poll every 3 seconds
    }
    
    return () => {
      if (pollingInterval.current) clearInterval(pollingInterval.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBooking]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || sending || isChatClosed || !selectedBooking) return;
    
    const text = inputText;
    setInputText(""); // optimistic clear
    setSending(true);
    
    // Optimistic UI update
    const tempMsg = {
      id: "temp_" + Date.now(),
      senderId: currentUser.id,
      content: text,
      createdAt: new Date().toISOString(),
      senderName: "You"
    };
    setMessages(prev => [...prev, tempMsg]);
    
    try {
      const res = await apiClient.sendExpertMessage(selectedBooking.id, text);
      if (!res.success) {
        toast.error(res.error || "Failed to send message");
      }
    } catch (err) {
      toast.error("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const toggleChatStatus = async () => {
    if (!selectedBooking) return;
    try {
      const chatEnabled = isChatClosed; // If closed, we enable it. If open, we disable it.
      const res = await apiClient.expertToggleChat(selectedBooking.id, chatEnabled);
      if (res.success) {
        setIsChatClosed(!chatEnabled);
        toast.success(`Chat has been ${!chatEnabled ? 'closed' : 'opened'} for this user.`);
      } else {
        toast.error(res.error || "Failed to toggle chat");
      }
    } catch (err) {
      toast.error("An error occurred");
    }
  };

  if (loading) {
    return <div className="p-10 flex justify-center"><div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col md:flex-row overflow-hidden border-t border-border bg-background">
      {/* Sidebar - Booking List */}
      <div className="w-full md:w-1/3 lg:w-1/4 border-r border-border flex flex-col h-full bg-card/50">
        <div className="p-4 border-b border-border bg-card">
          <h2 className="font-semibold text-foreground">Your Conversations</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {bookings.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground text-sm">
              No active clients to chat with yet.
            </div>
          ) : (
            bookings.map((booking) => (
              <div 
                key={booking.id}
                onClick={() => setSelectedBooking(booking)}
                className={`p-4 border-b border-border cursor-pointer transition-colors hover:bg-muted ${selectedBooking?.id === booking.id ? 'bg-muted border-l-4 border-l-brand-500' : 'border-l-4 border-l-transparent'}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="font-medium text-foreground flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    {booking.userDisplayName || 'Client'}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground truncate">
                  Service: {booking.serviceTitle}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full bg-background relative">
        {selectedBooking ? (
          <>
            {/* Chat Header */}
            <div className="h-16 px-6 border-b border-border flex items-center justify-between bg-card shrink-0">
              <div>
                <h2 className="font-semibold text-foreground">{selectedBooking.userDisplayName || 'Client'}</h2>
                <div className="text-xs text-muted-foreground">{selectedBooking.serviceTitle}</div>
              </div>
              <button 
                onClick={toggleChatStatus}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${isChatClosed ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20' : 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20'}`}
              >
                {isChatClosed ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                {isChatClosed ? "Chat Locked" : "Chat Active"}
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {isChatClosed && (
                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-start gap-3 mb-6">
                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-red-500 mb-1">Chat is Currently Locked</h4>
                    <p className="text-sm text-red-400">
                      The user cannot send messages. If their monthly plan expired, they have been prompted to renew. You can unlock the chat manually using the button above.
                    </p>
                  </div>
                </div>
              )}
              
              {messages.length === 0 ? (
                <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                  No messages yet. Say hello!
                </div>
              ) : (
                messages.map((msg, idx) => {
                  const isMe = msg.senderId === currentUser.id;
                  return (
                    <div key={msg.id || idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
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

            {/* Chat Input */}
            <div className="p-4 bg-card border-t border-border shrink-0">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={isChatClosed ? "Chat is locked" : "Type a message..."}
                  disabled={isChatClosed}
                  className="flex-1 bg-background border border-border rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button
                  type="submit"
                  disabled={isChatClosed || !inputText.trim() || sending}
                  className="w-10 h-10 rounded-full bg-brand-600 text-white flex items-center justify-center hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                >
                  <Send className="w-4 h-4 ml-0.5" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <MessageSquare className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-medium text-foreground mb-2">Select a Conversation</h3>
            <p className="text-muted-foreground max-w-sm">
              Choose a client from the sidebar to view your messages and chat directly with them.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
