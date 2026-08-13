export type NotificationCategory = 
  | "SECURITY"
  | "TRADING"
  | "WALLET"
  | "P2P"
  | "ACCOUNT"
  | "SYSTEM"
  | "MARKETING";

export type NotificationPriority = "LOW" | "NORMAL" | "HIGH" | "CRITICAL";

export type NotificationStatus = "UNREAD" | "READ" | "ARCHIVED" | "DELETED";

export type NotificationChannel = "IN_APP" | "EMAIL" | "PUSH";

export type NotificationType = 
  | "SECURITY_LOGIN"
  | "SECURITY_PASSWORD_CHANGED"
  | "SECURITY_2FA_CHANGED"
  | "SECURITY_SESSION_REVOKED"
  | "SECURITY_RESTRICTION"
  | "TRADE_ORDER_PLACED"
  | "TRADE_ORDER_FILLED"
  | "TRADE_ORDER_PARTIAL"
  | "TRADE_ORDER_CANCELLED"
  | "WALLET_DEPOSIT"
  | "WALLET_DEPOSIT_CONFIRMED"
  | "WALLET_WITHDRAWAL"
  | "WALLET_WITHDRAWAL_COMPLETED"
  | "WALLET_WITHDRAWAL_REJECTED"
  | "P2P_ORDER_CREATED"
  | "P2P_PAYMENT_MARKED"
  | "P2P_ORDER_COMPLETED"
  | "P2P_DISPUTE_OPENED"
  | "P2P_DISPUTE_RESOLVED"
  | "ACCOUNT_KYC_REQUIRED"
  | "ACCOUNT_KYC_APPROVED"
  | "ACCOUNT_KYC_REJECTED"
  | "SYSTEM_MAINTENANCE"
  | "SYSTEM_ANNOUNCEMENT"
  | "MARKETING_CAMPAIGN";

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  category: NotificationCategory;
  priority: NotificationPriority;
  title: string;
  message: string;
  status: NotificationStatus;
  channels: NotificationChannel[];
  referenceType?: "ORDER" | "TRADE" | "WITHDRAWAL" | "DEPOSIT" | "P2P_ORDER" | "TICKET" | "SESSION" | "KYC";
  referenceId?: string;
  actionUrl?: string; // Optional direct deep-link
  createdAt: string;
  readAt?: string;
  archivedAt?: string;
}

// Interface for fetching notifications (simulated backend call)
export interface GetNotificationsParams {
  userId: string;
  category?: NotificationCategory | "ALL" | "UNREAD";
  page?: number;
  limit?: number;
}

export interface GetNotificationsResponse {
  items: Notification[];
  total: number;
  unreadCount: number;
}
