import { create } from "zustand";
import { SupportTicket, TicketStatus, TicketCategory } from "@/lib/support/types";
import { MockSupportProvider } from "@/lib/support/mock-support-provider";

interface SupportState {
  tickets: SupportTicket[];
  activeTicket: SupportTicket | null;
  total: number;
  isLoading: boolean;
  
  fetchTickets: (userId: string, status?: TicketStatus | "ALL" | "OPEN_OR_PENDING") => Promise<void>;
  fetchTicket: (id: string) => Promise<void>;
  createTicket: (payload: { userId: string; subject: string; category: TicketCategory; description: string; relatedProduct?: string; relatedTransaction?: string }) => Promise<void>;
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
        const res = await MockSupportProvider.getTickets({ userId, status });
        set({ tickets: res.items, total: res.total, isLoading: false });
      } catch (error) {
        console.error("Failed to fetch support tickets", error);
        set({ isLoading: false });
      }
    },

    fetchTicket: async (id) => {
      set({ isLoading: true });
      try {
        const ticket = await MockSupportProvider.getTicket(id);
        set({ activeTicket: ticket, isLoading: false });
      } catch (error) {
        console.error("Failed to fetch support ticket", error);
        set({ isLoading: false });
      }
    },

    createTicket: async (payload) => {
      set({ isLoading: true });
      try {
        const newTicket = await MockSupportProvider.createTicket(payload);
        set((state) => ({
          tickets: [newTicket, ...state.tickets],
          activeTicket: newTicket,
          isLoading: false
        }));
      } catch (error) {
        console.error("Failed to create support ticket", error);
        set({ isLoading: false });
        throw error;
      }
    },

    addMessage: async (ticketId, text, sender) => {
      try {
        const newMessage = await MockSupportProvider.addMessage(ticketId, text, sender);
        set((state) => {
          if (state.activeTicket && state.activeTicket.id === ticketId) {
            const updatedTicket = { 
              ...state.activeTicket, 
              messages: [...state.activeTicket.messages, newMessage],
              updatedAt: new Date().toISOString()
            };
            return { activeTicket: updatedTicket };
          }
          return state;
        });
      } catch (error) {
        console.error("Failed to add message", error);
        throw error;
      }
    }
  })
);
