export type AdminRole = 
  | "SUPER_ADMIN"
  | "ADMIN"
  | "COMPLIANCE_ADMIN"
  | "KYC_ADMIN"
  | "FINANCE_ADMIN"
  | "TRADING_ADMIN"
  | "P2P_ADMIN"
  | "SUPPORT_ADMIN"
  | "RISK_MANAGER"
  | "AUDITOR"
  | "MODERATOR"
  | "USER";

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
  status: "ACTIVE" | "FROZEN" | "SUSPENDED" | "PENDING";
  kycStatus: "VERIFIED" | "PENDING" | "REJECTED" | "UNVERIFIED";
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  balanceUsd: number;
  tradingVolumeUsd: number;
  p2pVolumeUsd: number;
  createdAt: string;
  lastLoginAt: string;
}

export interface KycApplication {
  id: string;
  userId: string;
  name: string;
  country: string;
  documentType: "PASSPORT" | "ID_CARD" | "DRIVERS_LICENSE";
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
  submittedAt: string;
  status: "PENDING" | "UNDER_REVIEW" | "VERIFIED" | "REJECTED";
  assignedAdmin?: string;
}

export interface AdminDashboardKPIs {
  totalUsers: number;
  activeUsers: number;
  newUsers: number;
  suspendedUsers: number;
  
  volume24h: number;
  trades24h: number;
  openOrders: number;
  activeMarkets: number;
  
  totalPlatformBalance: number;
  depositsToday: number;
  withdrawalsToday: number;
  pendingWithdrawals: number;
  
  activeP2POrders: number;
  p2pVolume24h: number;
  pendingDisputes: number;
  activeMerchants: number;
  
  pendingKyc: number;
  rejectedKyc: number;
  highRiskAccounts: number;
  
  apiStatus: string;
  dbStatus: string;
  errorRate: number;
}

export interface AuditEvent {
  id: string;
  adminId: string;
  adminRole: AdminRole;
  action: string;
  entity: string;
  entityId: string;
  reason?: string;
  ip: string;
  timestamp: string;
}
