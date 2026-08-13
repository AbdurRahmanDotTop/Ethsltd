import { create } from "zustand";
import { SupportTicket, TicketStatus, TicketCategory } from "@/lib/support/types";
import { apiClient } from "@ethsltd/api-client";

interface SupportState {
  tickets: SupportTicket[];
  activeTicket: SupportTicket | null;
  total: number;
  isLoading: boolean;
  
  fetchTickets: (userId?: string, status?: TicketStatus | "ALL" | "OPEN_OR_PENDING") => Promise<void>;
  fetchTicket: (id: string) => Promise<void>;
  createTicket: (payload: { subject: string; category: TicketCategory; description: string; relatedProduct?: string; relatedTransaction?: string }) => Promise<void>;
  addMessage: (ticketId: string, text: string, sender: "USER" | "SUPPORT" | "SYSTEM") => Promise<void>;
}

export const useSupportStore = create<SupportState>()(
  (set, get) => ({
    tickets: [],
    activeTicket: null,
    total: 0,
    isLoading: false,

    fetchTickets: async (userId, status = "ALL") => {
      set({ isLoading: true });
      try {
        const res = await apiClient.getTickets();
        if (res.success && res.data) {
          const formattedTickets = res.data.map((t: any) => ({
            id: t.id,
            userId: t.userId,
            subject: t.subject,
            category: t.category,
            status: t.status,
            priority: t.priority || "MEDIUM",
            createdAt: t.createdAt,
            updatedAt: t.updatedAt,
            messages: []
          }));
          set({ tickets: formattedTickets, total: formattedTickets.length, isLoading: false });
        } else {
          set({ isLoading: false });
        }
      } catch (error) {
        console.error("Failed to fetch support tickets", error);
        set({ isLoading: false });
      }
    },

    fetchTicket: async (id) => {
      set({ isLoading: true });
      try {
        // Find basic ticket from state, if not we could fetch single ticket
        const existing = get().tickets.find(t => t.id === id);
        
        const messagesRes = await apiClient.getTicketMessages(id);
        
        if (messagesRes.success && messagesRes.data && existing) {
          const messages = messagesRes.data.map((m: any) => ({
            id: m.id,
            ticketId: m.ticketId,
            sender: (m.isAdmin ? "SUPPORT" : "USER") as "USER" | "SUPPORT" | "SYSTEM",
            text: m.content,
            timestamp: m.createdAt,
            readBySupport: true,
            readByUser: true
          }));

          set({ activeTicket: { ...existing, messages }, isLoading: false });
        } else {
          set({ isLoading: false });
        }
      } catch (error) {
        console.error("Failed to fetch support ticket", error);
        set({ isLoading: false });
      }
    },

    createTicket: async (payload) => {
      set({ isLoading: true });
      try {
        const res = await apiClient.createTicket({
          subject: payload.subject,
          category: payload.category,
          message: payload.description,
        });

        if (res.success && res.data) {
          const newTicket = {
            id: res.data.id,
            userId: res.data.userId,
            subject: res.data.subject,
            category: res.data.category,
            status: res.data.status,
            priority: res.data.priority || "MEDIUM",
            createdAt: res.data.createdAt,
            updatedAt: res.data.updatedAt,
            messages: []
          };
          set((state) => ({
            tickets: [newTicket, ...state.tickets],
            activeTicket: newTicket,
            isLoading: false
          }));
        } else {
          set({ isLoading: false });
        }
      } catch (error) {
        console.error("Failed to create support ticket", error);
        set({ isLoading: false });
        throw error;
      }
    },

    addMessage: async (ticketId, text, sender) => {
      try {
        const res = await apiClient.sendTicketMessage(ticketId, text);
        if (res.success) {
          set((state) => {
            if (state.activeTicket && state.activeTicket.id === ticketId) {
              const newMessage = {
                id: `MSG-${Date.now()}`, // Temporary ID until refetch
                ticketId,
                sender,
                text,
                timestamp: new Date().toISOString(),
                readBySupport: false,
                readByUser: true
              };
              const updatedTicket = { 
                ...state.activeTicket, 
                messages: [...state.activeTicket.messages, newMessage],
                updatedAt: new Date().toISOString()
              };
              return { activeTicket: updatedTicket };
            }
            return state;
          });
        }
      } catch (error) {
        console.error("Failed to add message", error);
        throw error;
      }
    }
  })
);
