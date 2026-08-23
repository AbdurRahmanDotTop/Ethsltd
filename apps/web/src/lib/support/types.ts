export type TicketCategory =
  | "Account"
  | "Security"
  | "Trading"
  | "Wallet"
  | "Deposit"
  | "Withdrawal"
  | "P2P"
  | "KYC"
  | "Payment"
  | "Technical"
  | "Other";

export type TicketStatus = 
  | "OPEN" 
  | "IN_PROGRESS" 
  | "WAITING_FOR_USER" 
  | "WAITING_INTERNAL" 
  | "RESOLVED" 
  | "CLOSED";

export type TicketPriority = "LOW" | "NORMAL" | "HIGH" | "URGENT";

export interface SupportMessage {
  id: string;
  sender: "USER" | "SUPPORT" | "SYSTEM";
  text: string;
  timestamp: string;
  attachmentBase64?: string | null;
  isInternalNote?: boolean; // For admin view only
}

export interface SupportTicket {
  id: string;
  userId: string;
  subject: string;
  category: TicketCategory;
  status: TicketStatus;
  priority: TicketPriority;
  
  messages: SupportMessage[];
  
  relatedProduct?: string;
  relatedTransaction?: string;
  
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

export interface GetTicketsParams {
  userId?: string;
  status?: TicketStatus | "ALL" | "OPEN_OR_PENDING";
  page?: number;
  limit?: number;
}

export interface GetTicketsResponse {
  items: SupportTicket[];
  total: number;
}
