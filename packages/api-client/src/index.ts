import { User } from '@ethsltd/types';

export class EthsltdClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string = process.env.NEXT_PUBLIC_API_URL || 'https://api.ethsltd-api.workers.dev') {
    this.baseUrl = baseUrl;
    // Attempt to load token from localStorage if in browser environment
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('ethsltd_auth_token');
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('ethsltd_auth_token', token);
      } else {
        localStorage.removeItem('ethsltd_auth_token');
      }
    }
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<{ success: boolean; data?: T; error?: any }> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...((options?.headers as Record<string, string>) || {}),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const res = await fetch(`${this.baseUrl}${endpoint}`, {
        cache: 'no-store',
        ...options,
        headers,
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        return { success: false, error: data.error || data.message || 'API Error' };
      }
      
      return data;
    } catch (e: any) {
      return { success: false, error: e.message || 'Network Error' };
    }
  }

  async getMe() {
    return this.request<User>('/api/v1/auth/me');
  }

  async login(email: string, password: string) {
    const res = await this.request<{ token: string; user: User }>('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (res.success && res.data?.token) {
      this.setToken(res.data.token);
    }
    return res;
  }

  async register(email: string, password: string) {
    const res = await this.request<{ token: string; user: User }>('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (res.success && res.data?.token) {
      this.setToken(res.data.token);
    }
    return res;
  }

  async logout() {
    this.setToken(null);
    return { success: true };
  }

  async resendVerification() {
    // Placeholder until endpoint exists
    return { success: true };
  }

  async requestPasswordReset(email: string) {
    // Placeholder until endpoint exists
    return { success: true };
  }

  async resetPassword(password: string, token: string) {
    // Placeholder until endpoint exists
    return { success: true };
  }



  async changePassword(data: any) {
    return this.request<any>('/api/v1/settings/change-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async submitKYC(data: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    country: string;
    documentType: string;
    documentNumber: string;
    documentFrontBase64?: string;
    documentBackBase64?: string;
    selfieBase64?: string;
  }) {
    return this.request<any>('/api/v1/settings/kyc', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }


  async getWallets(userId: string) {
    return this.request<any[]>(`/api/v1/wallets?userId=${userId}`);
  }

  async getWalletBalances(mode: string = 'REAL') {
    return this.request<any[]>(`/api/v1/wallets/balances?mode=${mode}`);
  }

  async getWalletPortfolio(mode: string = 'REAL') {
    return this.request<any>(`/api/v1/wallets/portfolio?mode=${mode}`);
  }

  async getWalletTransactions(mode: string = 'REAL') {
    return this.request<any[]>(`/api/v1/wallets/transactions?mode=${mode}`);
  }

  async deposit(data: { assetSymbol: string; amount: number; network?: string; destination?: string; mode?: string }) {
    return this.request<any>('/api/v1/wallets/deposit', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async withdraw(data: { assetSymbol: string; amount: number; network?: string; destination?: string; mode?: string }) {
    return this.request<any>('/api/v1/wallets/withdraw', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async topUpPaperWallet() {
    return this.request<any>('/api/v1/wallets/top-up-paper', {
      method: 'POST',
    });
  }

  // Trading Data API Methods
  async getMarkets(params?: any) {
    return this.request<any[]>('/api/v1/trading/markets');
  }

  async getMarketCandles(symbol: string, interval: string = '15m') {
    return this.request<any[]>(`/api/v1/trading/markets/${symbol}/candles?interval=${interval}`);
  }

  async getMarketOrderBook(symbol: string) {
    return this.request<any>(`/api/v1/trading/markets/${symbol}/orderbook`);
  }

  async getMarketTrades(symbol: string) {
    return this.request<any[]>(`/api/v1/trading/markets/${symbol}/trades`);
  }

  // Trading Execution API Methods
  async getOrders(mode: string = 'REAL') {
    return this.request<any[]>(`/api/v1/trading/orders?mode=${mode}`);
  }

  async getTrades(mode: string = 'REAL') {
    return this.request<any[]>(`/api/v1/trading/trades?mode=${mode}`);
  }

  async createOrder(data: any) {
    return this.request<any>('/api/v1/trading/orders', {
      method: 'POST',
      body: JSON.stringify({ ...data, mode: data.mode || 'REAL' }),
    });
  }

  async cancelOrder(orderId: string) {
    return this.request<any>(`/api/v1/trading/orders/${orderId}`, {
      method: 'DELETE',
    });
  }

  // P2P API Methods
  async getP2pAds(params?: any) {
    return this.request<any[]>('/api/v1/p2p/ads');
  }

  async createP2pAd(data: any) {
    return this.request<any>('/api/v1/p2p/ads', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getP2pOrders(params?: any) {
    return this.request<any[]>('/api/v1/p2p/orders');
  }

  async createP2pOrder(data: any) {
    return this.request<any>('/api/v1/p2p/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateP2pOrderStatus(orderId: string, action: 'pay' | 'release' | 'cancel') {
    return this.request<any>(`/api/v1/p2p/orders/${orderId}/${action}`, {
      method: 'POST',
    });
  }

  async getP2pOrder(orderId: string) {
    return this.request<any>(`/api/v1/p2p/orders/${orderId}`);
  }

  async getP2pMessages(orderId: string) {
    return this.request<any[]>(`/api/v1/p2p/orders/${orderId}/messages`);
  }

  async sendP2pMessage(orderId: string, content: string) {
    return this.request<any>(`/api/v1/p2p/orders/${orderId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  }

  // Admin API Methods
  async getAdminStats() {
    return this.request<any>('/api/v1/admin/stats');
  }

  async getAdminUsers(params: { page?: number; limit?: number; search?: string; status?: string }) {
    const query = new URLSearchParams();
    if (params.page) query.append('page', params.page.toString());
    if (params.limit) query.append('limit', params.limit.toString());
    if (params.search) query.append('search', params.search);
    if (params.status) query.append('status', params.status);
    
    return this.request<any>(`/api/v1/admin/users?${query.toString()}`);
  }

  async updateAdminUserStatus(userId: string, status: string) {
    return this.request<any>(`/api/v1/admin/users/${userId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  async getAdminPendingKYC() {
    return this.request<any[]>('/api/v1/admin/kyc');
  }

  async updateAdminKYCStatus(kycId: string, status: string, rejectionReason?: string) {
    return this.request<any>(`/api/v1/admin/kyc/${kycId}/status`, {
      method: 'POST',
      body: JSON.stringify({ status, rejectionReason }),
    });
  }

  async getAdminTransactions() {
    return this.request<any[]>('/api/v1/admin/transactions');
  }

  // Notifications API Methods
  async getNotifications() {
    return this.request<any[]>('/api/v1/notifications');
  }

  async markNotificationRead(id: string) {
    return this.request<any>(`/api/v1/notifications/${id}/read`, {
      method: 'PATCH',
    });
  }

  async markAllNotificationsRead() {
    return this.request<any>('/api/v1/notifications/read-all', {
      method: 'POST',
    });
  }

  // Support API Methods
  async getTickets() {
    return this.request<any[]>('/api/v1/support/tickets');
  }

  async createTicket(data: { subject: string; category: string; message: string; priority?: string }) {
    return this.request<any>('/api/v1/support/tickets', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getTicketMessages(ticketId: string) {
    return this.request<any[]>(`/api/v1/support/tickets/${ticketId}/messages`);
  }

  async sendTicketMessage(ticketId: string, content: string) {
    return this.request<any>(`/api/v1/support/tickets/${ticketId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  }

  // ==========================
  // SETTINGS (Profile, MFA, Sessions)
  // ==========================

  // Profile
  async getProfile() {
    return this.request<any>('/api/v1/settings/profile');
  }

  async updateProfile(data: { displayName?: string; firstName?: string; lastName?: string; avatarUrl?: string }) {
    return this.request<any>('/api/v1/settings/profile', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // MFA
  async generateMfa() {
    return this.request<{ secret: string; qrCodeUrl: string }>('/api/v1/settings/mfa/generate', {
      method: 'POST',
    });
  }

  async enableMfa(token: string) {
    return this.request<any>('/api/v1/settings/mfa/enable', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  }

  async disableMfa(token: string) {
    return this.request<any>('/api/v1/settings/mfa/disable', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  }

  // Sessions
  async getSessions() {
    return this.request<any[]>('/api/v1/settings/sessions');
  }

  async revokeSession(sessionId: string) {
    return this.request<any>(`/api/v1/settings/sessions/${sessionId}`, {
      method: 'DELETE',
    });
  }

  async revokeAllOtherSessions() {
    return this.request<any>('/api/v1/settings/sessions/all-except-current', {
      method: 'DELETE',
    });
  }
}

export const apiClient = new EthsltdClient();
