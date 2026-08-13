import { 
  SupportTicket, 
  TicketStatus, 
  TicketPriority, 
  GetTicketsParams, 
  GetTicketsResponse,
  SupportMessage,
  TicketCategory
} from "./types";

const generateMockTickets = (): SupportTicket[] => {
  const now = new Date();
  const generateDate = (minutesAgo: number) => new Date(now.getTime() - minutesAgo * 60000).toISOString();

  return [
    {
      id: "SUP-1024",
      userId: "USR-000123",
      subject: "Withdrawal pending for too long",
      category: "Wallet",
      status: "OPEN",
      priority: "NORMAL",
      relatedTransaction: "Withdrawal #WD-10482",
      messages: [
        {
          id: "MSG-1",
          sender: "USER",
          text: "Why is my withdrawal still pending? It's been 2 hours.",
          timestamp: generateDate(60),
        },
        {
          id: "MSG-2",
          sender: "SUPPORT",
          text: "We are currently reviewing the transaction due to network congestion. It should clear shortly.",
          timestamp: generateDate(45),
        },
        {
          id: "MSG-3",
          sender: "SYSTEM",
          text: "INTERNAL NOTE: User has an open withdrawal review. Escalate to finance operations if not resolved in 1 hour.",
          timestamp: generateDate(40),
          isInternalNote: true
        }
      ],
      createdAt: generateDate(60),
      updatedAt: generateDate(40),
    },
    {
      id: "SUP-1019",
      userId: "USR-000123",
      subject: "P2P payment issue",
      category: "P2P",
      status: "WAITING_FOR_USER",
      priority: "HIGH",
      relatedProduct: "P2P Marketplace",
      messages: [
        {
          id: "MSG-4",
          sender: "USER",
          text: "I sent the payment but the seller isn't releasing the crypto.",
          timestamp: generateDate(1440),
        },
        {
          id: "MSG-5",
          sender: "SUPPORT",
          text: "Please provide a screenshot of the payment receipt so we can investigate this immediately.",
          timestamp: generateDate(1400),
        }
      ],
      createdAt: generateDate(1440),
      updatedAt: generateDate(1400),
    },
    {
      id: "SUP-0982",
      userId: "USR-000123",
      subject: "How do I change my 2FA device?",
      category: "Security",
      status: "RESOLVED",
      priority: "LOW",
      messages: [
        {
          id: "MSG-6",
          sender: "USER",
          text: "I got a new phone. How do I move my authenticator?",
          timestamp: generateDate(10080),
        },
        {
          id: "MSG-7",
          sender: "SUPPORT",
          text: "You can disable 2FA from your Security settings using your old phone, then re-enable it on the new one.",
          timestamp: generateDate(10000),
        }
      ],
      createdAt: generateDate(10080),
      updatedAt: generateDate(10000),
      resolvedAt: generateDate(10000),
    }
  ];
};

let ticketsStore = generateMockTickets();

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const MockSupportProvider = {
  async getTickets(params: GetTicketsParams): Promise<GetTicketsResponse> {
    await delay(600);
    
    let filtered = [...ticketsStore];

    if (params.userId) {
      filtered = filtered.filter(t => t.userId === params.userId);
    }

    if (params.status && params.status !== "ALL") {
      if (params.status === "OPEN_OR_PENDING") {
        filtered = filtered.filter(t => t.status === "OPEN" || t.status === "IN_PROGRESS" || t.status === "WAITING_FOR_USER" || t.status === "WAITING_INTERNAL");
      } else {
        filtered = filtered.filter(t => t.status === params.status);
      }
    }

    filtered.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

    const total = filtered.length;
    const page = params.page || 1;
    const limit = params.limit || 20;
    const start = (page - 1) * limit;
    const items = filtered.slice(start, start + limit);

    return { items, total };
  },

  async getTicket(id: string): Promise<SupportTicket | null> {
    await delay(400);
    return ticketsStore.find(t => t.id === id) || null;
  },

  async createTicket(payload: {
    userId: string;
    subject: string;
    category: TicketCategory;
    description: string;
    relatedProduct?: string;
    relatedTransaction?: string;
  }): Promise<SupportTicket> {
    await delay(800);
    const newTicket: SupportTicket = {
      id: `SUP-${Math.floor(1000 + Math.random() * 9000)}`,
      userId: payload.userId,
      subject: payload.subject,
      category: payload.category,
      status: "OPEN",
      priority: "NORMAL",
      relatedProduct: payload.relatedProduct,
      relatedTransaction: payload.relatedTransaction,
      messages: [
        {
          id: `MSG-${Date.now()}`,
          sender: "USER",
          text: payload.description,
          timestamp: new Date().toISOString(),
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    ticketsStore.unshift(newTicket);
    return newTicket;
  },

  async addMessage(ticketId: string, text: string, sender: "USER" | "SUPPORT" | "SYSTEM", isInternalNote?: boolean): Promise<SupportMessage> {
    await delay(500);
    const ticket = ticketsStore.find(t => t.id === ticketId);
    if (!ticket) throw new Error("Ticket not found");

    const newMessage: SupportMessage = {
      id: `MSG-${Date.now()}`,
      sender,
      text,
      timestamp: new Date().toISOString(),
      isInternalNote
    };

    ticket.messages.push(newMessage);
    ticket.updatedAt = new Date().toISOString();
    
    // Auto-update status based on sender
    if (sender === "USER" && ticket.status !== "OPEN") {
      ticket.status = "OPEN";
    }
    if (sender === "SUPPORT" && ticket.status === "OPEN" && !isInternalNote) {
      ticket.status = "WAITING_FOR_USER";
    }

    return newMessage;
  },

  // Admin Capabilities
  async updateTicketStatus(ticketId: string, status: TicketStatus): Promise<void> {
    await delay(400);
    const ticket = ticketsStore.find(t => t.id === ticketId);
    if (ticket) {
      ticket.status = status;
      ticket.updatedAt = new Date().toISOString();
      if (status === "RESOLVED" || status === "CLOSED") {
        ticket.resolvedAt = new Date().toISOString();
      }
    }
  },

  async getAllTickets(params: GetTicketsParams): Promise<GetTicketsResponse> {
    return this.getTickets(params); // Admin fetches all, no user filter applied if not provided
  }
};
