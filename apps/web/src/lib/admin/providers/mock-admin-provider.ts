import { AdminDashboardKPIs, AuditEvent, AdminUser, KycApplication, FinancialTransaction, AdminOrder, AdminTrade, AdminP2PDispute } from "../types";

export interface AdminProvider {
  getDashboardKPIs(): Promise<AdminDashboardKPIs>;
  getRecentActivity(): Promise<AuditEvent[]>;
  getUsers(params?: { page?: number; limit?: number; status?: string; search?: string }): Promise<{ items: AdminUser[]; total: number }>;
  getUser(id: string): Promise<AdminUser | null>;
  getKycApplications(params?: { page?: number; limit?: number; status?: string }): Promise<{ items: KycApplication[]; total: number }>;
  getWithdrawals(params?: { page?: number; limit?: number; status?: string }): Promise<{ items: FinancialTransaction[]; total: number }>;
  getDeposits(params?: { page?: number; limit?: number; status?: string }): Promise<{ items: FinancialTransaction[]; total: number }>;
  getOrders(params?: { page?: number; limit?: number; status?: string; market?: string }): Promise<{ items: AdminOrder[]; total: number }>;
  getTrades(params?: { page?: number; limit?: number; market?: string }): Promise<{ items: AdminTrade[]; total: number }>;
  getP2PDisputes(params?: { page?: number; limit?: number; status?: string }): Promise<{ items: AdminP2PDispute[]; total: number }>;
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
  },

  async getWithdrawals(params?: { page?: number; limit?: number; status?: string }): Promise<{ items: FinancialTransaction[]; total: number }> {
    await new Promise((resolve) => setTimeout(resolve, 400));
    
    let mockTxs: FinancialTransaction[] = Array.from({ length: 45 }).map((_, i) => ({
      id: `WD-500${i}`,
      userId: `USR-10${i}`,
      userName: `User 10${i}`,
      type: "WITHDRAWAL",
      asset: i % 3 === 0 ? "USDT" : i % 2 === 0 ? "BTC" : "ETH",
      amount: i % 5 === 0 ? Math.random() * 50000 : Math.random() * 1000,
      network: i % 3 === 0 ? "TRC20" : "ERC20",
      address: `0x${Math.random().toString(16).substr(2, 40)}`,
      status: i % 10 === 0 ? "REJECTED" : i % 4 === 0 ? "COMPLETED" : i % 3 === 0 ? "PROCESSING" : "PENDING",
      riskScore: i % 15 === 0 ? "HIGH" : i % 5 === 0 ? "MEDIUM" : "LOW",
      createdAt: new Date(Date.now() - Math.random() * 86400000 * 2).toISOString(),
    }));

    if (params?.status && params.status !== "ALL") {
      mockTxs = mockTxs.filter(tx => tx.status === params.status);
    }

    const page = params?.page || 1;
    const limit = params?.limit || 20;
    const start = (page - 1) * limit;

    return {
      items: mockTxs.slice(start, start + limit),
      total: mockTxs.length
    };
  },

  async getDeposits(params?: { page?: number; limit?: number; status?: string }): Promise<{ items: FinancialTransaction[]; total: number }> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    let mockTxs: FinancialTransaction[] = Array.from({ length: 60 }).map((_, i) => ({
      id: `DEP-800${i}`,
      userId: `USR-10${i}`,
      userName: `User 10${i}`,
      type: "DEPOSIT",
      asset: i % 4 === 0 ? "USDT" : i % 3 === 0 ? "USDC" : "BTC",
      amount: Math.random() * 5000,
      network: "ERC20",
      txHash: `0x${Math.random().toString(16).substr(2, 64)}`,
      status: i % 15 === 0 ? "PENDING" : "COMPLETED",
      riskScore: "LOW",
      createdAt: new Date(Date.now() - Math.random() * 86400000 * 5).toISOString(),
      completedAt: new Date(Date.now() - Math.random() * 86400000).toISOString(),
    }));

    if (params?.status && params.status !== "ALL") {
      mockTxs = mockTxs.filter(tx => tx.status === params.status);
    }

    const page = params?.page || 1;
    const limit = params?.limit || 20;
    const start = (page - 1) * limit;

    return {
      items: mockTxs.slice(start, start + limit),
      total: mockTxs.length
    };
  },

  async getOrders(params?: { page?: number; limit?: number; status?: string; market?: string }): Promise<{ items: AdminOrder[]; total: number }> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    let mockOrders: AdminOrder[] = Array.from({ length: 75 }).map((_, i) => ({
      id: `ORD-900${i}`,
      userId: `USR-20${i}`,
      userName: `Trader ${i}`,
      market: i % 3 === 0 ? "ETH/USD" : i % 2 === 0 ? "SOL/USD" : "BTC/USD",
      side: i % 2 === 0 ? "BUY" : "SELL",
      type: i % 5 === 0 ? "MARKET" : "LIMIT",
      price: i % 3 === 0 ? 3000 + Math.random() * 500 : 60000 + Math.random() * 5000,
      amount: Math.random() * 2,
      filled: i % 4 === 0 ? Math.random() * 2 : 0,
      status: i % 8 === 0 ? "CANCELED" : i % 5 === 0 ? "FILLED" : i % 4 === 0 ? "PARTIAL" : "OPEN",
      createdAt: new Date(Date.now() - Math.random() * 86400000).toISOString(),
    }));

    if (params?.status && params.status !== "ALL") {
      mockOrders = mockOrders.filter(o => o.status === params.status);
    }
    
    if (params?.market && params.market !== "ALL") {
      mockOrders = mockOrders.filter(o => o.market === params.market);
    }

    const page = params?.page || 1;
    const limit = params?.limit || 20;
    const start = (page - 1) * limit;

    return {
      items: mockOrders.slice(start, start + limit),
      total: mockOrders.length
    };
  },

  async getTrades(params?: { page?: number; limit?: number; market?: string }): Promise<{ items: AdminTrade[]; total: number }> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    let mockTrades: AdminTrade[] = Array.from({ length: 100 }).map((_, i) => ({
      id: `TRD-100${i}`,
      market: i % 3 === 0 ? "ETH/USD" : i % 2 === 0 ? "SOL/USD" : "BTC/USD",
      price: i % 3 === 0 ? 3000 + Math.random() * 500 : 60000 + Math.random() * 5000,
      amount: Math.random() * 2,
      total: 0, // calculated below
      makerId: `USR-MAKER-${i}`,
      takerId: `USR-TAKER-${i}`,
      side: (i % 2 === 0 ? "BUY" : "SELL") as "BUY" | "SELL",
      timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString(),
    })).map(t => ({ ...t, total: t.price * t.amount }));

    if (params?.market && params.market !== "ALL") {
      mockTrades = mockTrades.filter(t => t.market === params.market);
    }

    // Sort by timestamp descending
    mockTrades.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    const page = params?.page || 1;
    const limit = params?.limit || 20;
    const start = (page - 1) * limit;

    return {
      items: mockTrades.slice(start, start + limit),
      total: mockTrades.length
    };
  },

  async getP2PDisputes(params?: { page?: number; limit?: number; status?: string }): Promise<{ items: AdminP2PDispute[]; total: number }> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    let mockDisputes: AdminP2PDispute[] = Array.from({ length: 35 }).map((_, i) => ({
      id: `DSP-300${i}`,
      orderId: `P2P-ORD-70${i}`,
      buyerId: `USR-${i % 2 === 0 ? 100 : 200}${i}`,
      sellerId: `USR-${i % 2 === 0 ? 200 : 100}${i}`,
      asset: i % 3 === 0 ? "ETH" : "USDT",
      fiatAmount: 150 + Math.random() * 1000,
      fiatCurrency: i % 2 === 0 ? "USD" : "EUR",
      reason: i % 3 === 0 ? "Payment not received" : i % 2 === 0 ? "Buyer unresponsive" : "Seller refused to release",
      status: i % 8 === 0 ? "RESOLVED_BUYER" : i % 7 === 0 ? "RESOLVED_SELLER" : i % 6 === 0 ? "CANCELED" : i % 2 === 0 ? "UNDER_REVIEW" : "OPEN",
      raisedBy: i % 2 === 0 ? "BUYER" : "SELLER",
      assignedAdmin: i % 4 === 0 ? "ADMIN-001" : undefined,
      createdAt: new Date(Date.now() - Math.random() * 86400000).toISOString(),
    }));

    if (params?.status && params.status !== "ALL") {
      mockDisputes = mockDisputes.filter(d => d.status === params.status);
    }

    const page = params?.page || 1;
    const limit = params?.limit || 20;
    const start = (page - 1) * limit;

    return {
      items: mockDisputes.slice(start, start + limit),
      total: mockDisputes.length
    };
  }
};
