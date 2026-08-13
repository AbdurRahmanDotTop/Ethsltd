import { create } from "zustand";
import { persist } from "zustand/middleware";
import { P2PAdvertisementQuery, P2PSide, P2POrder, P2PMessage } from "@/lib/p2p/types";

interface P2PState {
  // Marketplace Filters
  query: P2PAdvertisementQuery;
  
  // Orders & Chat
  orders: P2POrder[];
  messages: P2PMessage[];
  
  // Actions
  setQuery: (query: Partial<P2PAdvertisementQuery>) => void;
  createOrder: (order: P2POrder) => void;
  updateOrderStatus: (orderId: string, status: P2POrder["status"]) => void;
  addMessage: (message: P2PMessage) => void;
}

const defaultQuery: P2PAdvertisementQuery = {
  side: "buy",
  asset: "USDT",
  fiat: "USD",
  paymentMethod: "all",
  amount: undefined,
  sortBy: "Best Price",
};

export const useP2PStore = create<P2PState>()(
  persist(
    (set, get) => ({
      query: defaultQuery,
      orders: [],
      messages: [],
      
      setQuery: (newQuery) => set((state) => ({ 
        query: { ...state.query, ...newQuery } 
      })),
      
      createOrder: (order) => set((state) => ({ 
        orders: [order, ...state.orders] 
      })),
      
      updateOrderStatus: (orderId, status) => set((state) => ({
        orders: state.orders.map(o => {
          if (o.id === orderId) {
            const updates: Partial<P2POrder> = { status };
            if (status === "PAYMENT_MARKED") updates.paymentMarkedAt = new Date().toISOString();
            if (status === "COMPLETED") updates.completedAt = new Date().toISOString();
            if (status === "CANCELLED") updates.cancelledAt = new Date().toISOString();
            return { ...o, ...updates };
          }
          return o;
        })
      })),
      
      addMessage: (message) => set((state) => ({
        messages: [...state.messages, message]
      })),
    }),
    {
      name: "ethsltd-p2p-storage",
      partialize: (state) => ({ 
        // Only persist orders and messages, not the search filters
        orders: state.orders, 
        messages: state.messages 
      }),
    }
  )
);
