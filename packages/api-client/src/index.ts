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
    // Placeholder until endpoint exists
    return { success: true, data };
  }

  async changePassword(data: any) {
    // Placeholder until endpoint exists
    return { success: true };
  }

  async getSessions() {
    // Placeholder until endpoint exists
    return { success: true, data: [] as any[] };
  }

  async revokeSession(sessionId: string) {
    // Placeholder until endpoint exists
    return { success: true };
  }

  async revokeAllSessions() {
    // Placeholder until endpoint exists
    return { success: true };
  }

  async getWallets(userId: string) {
    return this.request<any[]>(`/api/v1/wallets?userId=${userId}`);
  }

  async getWalletBalances() {
    // Placeholder until endpoint exists
    return { success: true, data: [] };
  }

  async getWalletPortfolio() {
    // Placeholder until endpoint exists
    return { success: true, data: { summary: null, allocations: [] } };
  }

  async getWalletTransactions(params?: any) {
    // Placeholder until endpoint exists
    return { success: true, data: [] };
  }

  async getOrders(params?: any) {
    // Placeholder
    return { success: true, data: [] };
  }

  async getTrades(params?: any) {
    // Placeholder
    return { success: true, data: [] };
  }

  async createOrder(data: any) {
    // Placeholder
    return { success: true, data };
  }

  async cancelOrder(orderId: string) {
    // Placeholder
    return { success: true };
  }
}

export const apiClient = new EthsltdClient();
