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

  async updateProfile(data: any) {
    return this.request<any>('/api/v1/auth/profile/update', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async changePassword(data: any) {
    // We haven't implemented this route yet, keeping as placeholder
    return { success: true };
  }

  async getSessions() {
    return this.request<any[]>('/api/v1/auth/sessions', {
      method: 'GET'
    });
  }

  async revokeSession(sessionId: string) {
    return this.request<any>('/api/v1/auth/sessions/revoke', {
      method: 'POST',
      body: JSON.stringify({ sessionId })
    });
  }

  async revokeAllSessions() {
    return this.request<any>('/api/v1/auth/sessions/revoke-all', {
      method: 'POST'
    });
  }

  async getWallets(userId: string) {
    return this.request<any[]>(`/api/v1/wallets?userId=${userId}`);
  }

  async getWalletBalances() {
    return this.request<any[]>('/api/v1/wallets/balances');
  }

  async getWalletPortfolio() {
    return this.request<any>('/api/v1/wallets/portfolio');
  }

  async getWalletTransactions(params?: any) {
    return this.request<any[]>('/api/v1/wallets/transactions');
  }

  async deposit(data: { assetSymbol: string; amount: number; network?: string; destination?: string }) {
    return this.request<any>('/api/v1/wallets/deposit', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async withdraw(data: { assetSymbol: string; amount: number; network?: string; destination?: string }) {
    return this.request<any>('/api/v1/wallets/withdraw', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getOrders(params?: any) {
    return this.request<any[]>('/api/v1/trading/orders');
  }

  async getTrades(params?: any) {
    return this.request<any[]>('/api/v1/trading/trades');
  }

  async createOrder(data: any) {
    return this.request<any>('/api/v1/trading/orders', {
      method: 'POST',
      body: JSON.stringify(data),
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
}

export const apiClient = new EthsltdClient();
