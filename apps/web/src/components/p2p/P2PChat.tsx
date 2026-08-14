"use client";

import { useState, useRef, useEffect } from "react";
import { P2POrder, P2PMessage, P2PMerchant } from "@/lib/p2p/types";
import { apiClient } from "@ethsltd/api-client";
import { useP2PStore } from "@/stores/p2p-store";
import { Send, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface P2PChatProps {
  order: P2POrder;
  merchant: P2PMerchant;
}

export function P2PChat({ order, merchant }: P2PChatProps) {
  const [messages, setMessages] = useState<P2PMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const isChatActive = order.status !== "COMPLETED" && order.status !== "CANCELLED";

  const addMessage = (msg: P2PMessage) => {
    setMessages(prev => [...prev, msg]);
  };

  useEffect(() => {
    // Initial system messages if chat is empty, and fetch from API
    const loadMessages = async () => {
      try {
        const res = await apiClient.getP2pMessages(order.id);
        if (res.success && res.data) {
          const formattedMsgs: P2PMessage[] = res.data.map((m: any) => ({
            id: m.id,
            orderId: m.orderId,
            sender: (m.senderId === "SYSTEM" ? "system" : (m.senderId === merchant.id ? "merchant" : "user")) as "system" | "merchant" | "user",
            message: m.content,
            createdAt: m.createdAt,
            read: !!m.isRead,
          }));
          
          if (formattedMsgs.length === 0) {
            // Seed local system messages for UX
            setMessages([
              {
                id: `msg_sys_${Date.now()}`,
                orderId: order.id,
                sender: "system",
                message: "P2P order created. The merchant has been notified.",
                createdAt: new Date().toISOString(),
                read: true,
              },
              {
                id: `msg_sys_${Date.now()+1}`,
                orderId: order.id,
                sender: "system",
                message: "Simulated escrow has been locked.",
                createdAt: new Date().toISOString(),
                read: true,
              }
            ]);
          } else {
            setMessages(formattedMsgs);
          }
        }
      } catch(e) {
        console.error("Failed to load messages", e);
      }
    };
    
    loadMessages();
    
    // Poll for new messages
    const interval = setInterval(loadMessages, 5000);
    return () => clearInterval(interval);
  }, [order.id, merchant.id]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages.length]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !isChatActive) return;

    const messageText = inputValue.trim().slice(0, 1000);
    setInputValue("");
    
    // Optimistic update
    addMessage({
      id: `msg_user_temp_${Date.now()}`,
      orderId: order.id,
      sender: "user",
      message: messageText,
      createdAt: new Date().toISOString(),
      read: true,
    });

    try {
      await apiClient.sendP2pMessage(order.id, messageText);
    } catch(e) {
      console.error("Failed to send message", e);
      // In a real app we might show a retry button or error state
    }
  };

  return (
    <div className="flex flex-col h-full bg-card border border-border rounded-xl shadow-sm overflow-hidden">
      <div className="p-4 border-b border-border bg-muted/30 flex items-center justify-between">
        <h3 className="font-semibold">Trade Chat</h3>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="relative flex h-2.5 w-2.5">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${merchant.online ? 'bg-green-400' : 'bg-gray-400'}`}></span>
            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${merchant.online ? 'bg-green-500' : 'bg-gray-500'}`}></span>
          </span>
          {merchant.online ? 'Online' : 'Offline'}
        </div>
      </div>

      <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[500px] min-h-[400px] scroll-smooth">
        {/* Safety Warning */}
        <div className="bg-yellow-50 dark:bg-yellow-900/10 text-yellow-800 dark:text-yellow-400 p-3 rounded-lg flex items-start gap-2 text-xs border border-yellow-200 dark:border-yellow-900/50">
          <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
          <p>Never release crypto before verifying payment in your bank account. ETHSLTD staff will never contact you directly or ask you to release funds.</p>
        </div>

        {messages.map((msg) => {
          if (msg.sender === "system") {
            return (
              <div key={msg.id} className="flex justify-center">
                <div className="bg-muted px-3 py-1.5 rounded-full text-xs text-muted-foreground font-medium">
                  {msg.message}
                </div>
              </div>
            );
          }

          const isUser = msg.sender === "user";
          return (
            <div key={msg.id} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                isUser 
                  ? "bg-brand-600 text-white rounded-br-sm" 
                  : "bg-muted rounded-bl-sm"
              }`}>
                <p className="text-sm break-words">{msg.message}</p>
                <div className={`text-[10px] mt-1 text-right ${isUser ? "text-brand-200" : "text-muted-foreground"}`}>
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <form onSubmit={handleSend} className="p-4 border-t border-border bg-muted/10 flex gap-2">
        <Input
          placeholder={isChatActive ? "Type a message..." : "Chat is disabled for completed/cancelled orders"}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={!isChatActive}
          className="flex-1"
          maxLength={1000}
        />
        <Button type="submit" disabled={!isChatActive || !inputValue.trim()} size="icon">
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
}
