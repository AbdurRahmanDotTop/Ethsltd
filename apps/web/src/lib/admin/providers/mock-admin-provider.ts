import { AdminDashboardKPIs, AuditEvent, AdminUser, KycApplication } from "../types";

export interface AdminProvider {
  getDashboardKPIs(): Promise<AdminDashboardKPIs>;
  getRecentActivity(): Promise<AuditEvent[]>;
  getUsers(params?: { page?: number; limit?: number; status?: string; search?: string }): Promise<{ items: AdminUser[]; total: number }>;
  getUser(id: string): Promise<AdminUser | null>;
  getKycApplications(params?: { page?: number; limit?: number; status?: string }): Promise<{ items: KycApplication[]; total: number }>;
}

export const MockAdminProvider: AdminProvider = {
  async getDashboardKPIs(): Promise<AdminDashboardKPIs> {
    // Simulate network latency
    await new Promise((resolve) => setTimeout(resolve, 500));

    return {
      totalUsers: 14502,
      activeUsers: 8421,
      newUsers: 124,
      suspendedUsers: 45,
      
      volume24h: 4820500.25,
      trades24h: 12450,
      openOrders: 3210,
      activeMarkets: 104,
      
      totalPlatformBalance: 18425902.42,
      depositsToday: 245820.00,
      withdrawalsToday: 128450.75,
      pendingWithdrawals: 12,
      
      activeP2POrders: 85,
      p2pVolume24h: 94820.50,
      pendingDisputes: 3,
      activeMerchants: 42,
      
      pendingKyc: 18,
      rejectedKyc: 4,
      highRiskAccounts: 2,
      
      apiStatus: "Operational",
      dbStatus: "Operational",
      errorRate: 0.02,
    };
  },

  async getRecentActivity(): Promise<AuditEvent[]> {
    await new Promise((resolve) => setTimeout(resolve, 600));

    return [
      {
        id: "AUD-1001",
        adminId: "ADMIN-001",
        adminRole: "SUPER_ADMIN",
        action: "WITHDRAWAL_APPROVED",
        entity: "Withdrawal",
        entityId: "WD-1004",
        ip: "192.168.1.1",
        timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
      },
      {
        id: "AUD-1002",
        adminId: "ADMIN-002",
        adminRole: "KYC_ADMIN",
        action: "KYC_REJECTED",
        entity: "User",
        entityId: "USR-882",
        reason: "Document illegible",
        ip: "192.168.1.5",
        timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
      },
      {
        id: "AUD-1003",
        adminId: "ADMIN-001",
        adminRole: "SUPER_ADMIN",
        action: "USER_FROZEN",
        entity: "User",
        entityId: "USR-1024",
        reason: "Suspicious P2P activity",
        ip: "192.168.1.1",
        timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
      },
      {
        id: "AUD-1004",
        adminId: "ADMIN-003",
        adminRole: "P2P_ADMIN",
        action: "P2P_DISPUTE_RESOLVED",
        entity: "Dispute",
        entityId: "DSP-102",
        reason: "Buyer failed to provide payment proof",
        ip: "192.168.1.8",
        timestamp: new Date(Date.now() - 120 * 60000).toISOString(),
      },
      {
        id: "AUD-1005",
        adminId: "ADMIN-001",
        adminRole: "SUPER_ADMIN",
        action: "ADMIN_LOGIN",
        entity: "Session",
        entityId: "SESS-990",
        ip: "192.168.1.1",
        timestamp: new Date(Date.now() - 240 * 60000).toISOString(),
      }
    ];
  },

  async getUsers(params?: { page?: number; limit?: number; status?: string; search?: string }): Promise<{ items: AdminUser[]; total: number }> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    // Generate some mock users
    let mockUsers: AdminUser[] = Array.from({ length: 55 }).map((_, i) => ({
      id: `USR-100${i}`,
      email: `user${i}@example.com`,
      name: `User ${i}`,
      role: i === 0 ? "SUPER_ADMIN" : i % 15 === 0 ? "ADMIN" : "USER",
      status: i % 12 === 0 ? "FROZEN" : i % 20 === 0 ? "SUSPENDED" : "ACTIVE",
      kycStatus: i % 5 === 0 ? "PENDING" : i % 7 === 0 ? "REJECTED" : "VERIFIED",
      riskLevel: i % 25 === 0 ? "CRITICAL" : i % 10 === 0 ? "HIGH" : i % 5 === 0 ? "MEDIUM" : "LOW",
      balanceUsd: Math.random() * 50000,
      tradingVolumeUsd: Math.random() * 250000,
      p2pVolumeUsd: Math.random() * 10000,
      createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
      lastLoginAt: new Date(Date.now() - Math.random() * 100000000).toISOString(),
    }));

    if (params?.status && params.status !== "ALL") {
      mockUsers = mockUsers.filter(u => u.status === params.status);
    }
    
    if (params?.search) {
      const q = params.search.toLowerCase();
      mockUsers = mockUsers.filter(u => 
        u.email.toLowerCase().includes(q) || 
        u.id.toLowerCase().includes(q) ||
        u.name.toLowerCase().includes(q)
      );
    }

    const page = params?.page || 1;
    const limit = params?.limit || 20;
    const start = (page - 1) * limit;
    
    return {
      items: mockUsers.slice(start, start + limit),
      total: mockUsers.length
    };
  },

  async getUser(id: string): Promise<AdminUser | null> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const allUsers = await this.getUsers({ limit: 100 });
    return allUsers.items.find(u => u.id === id) || null;
  },

  async getKycApplications(params?: { page?: number; limit?: number; status?: string }): Promise<{ items: KycApplication[]; total: number }> {
    await new Promise((resolve) => setTimeout(resolve, 400));
    
    let mockKyc: KycApplication[] = Array.from({ length: 30 }).map((_, i) => ({
      id: `KYC-200${i}`,
      userId: `USR-100${i + 5}`,
      name: `User ${i + 5}`,
      country: i % 3 === 0 ? "United Kingdom" : i % 4 === 0 ? "Canada" : "United States",
      documentType: i % 2 === 0 ? "PASSPORT" : "ID_CARD",
      riskLevel: i % 10 === 0 ? "HIGH" : i % 5 === 0 ? "MEDIUM" : "LOW",
      submittedAt: new Date(Date.now() - Math.random() * 500000000).toISOString(),
      status: i % 8 === 0 ? "REJECTED" : i % 3 === 0 ? "UNDER_REVIEW" : i % 2 === 0 ? "VERIFIED" : "PENDING",
      assignedAdmin: i % 3 === 0 ? "ADMIN-002" : undefined,
    }));

    if (params?.status && params.status !== "ALL") {
      mockKyc = mockKyc.filter(k => k.status === params.status);
    }

    const page = params?.page || 1;
    const limit = params?.limit || 20;
    const start = (page - 1) * limit;

    return {
      items: mockKyc.slice(start, start + limit),
      total: mockKyc.length
    };
  }
};
