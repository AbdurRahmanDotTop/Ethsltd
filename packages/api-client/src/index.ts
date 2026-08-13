import { User } from '@ethsltd/types';

export class EthsltdClient {
  private baseUrl: string;

  constructor(baseUrl: string = 'http://localhost:8787') {
    this.baseUrl = baseUrl;
  }

  async getMe(): Promise<{ success: boolean; data?: any; error?: any }> {
    try {
      const res = await fetch(`${this.baseUrl}/api/v1/auth/me`);
      return await res.json();
    } catch (e) {
      return { success: false, error: e };
    }
  }

  async login(email: string, password: string): Promise<any> {
    const res = await fetch(`${this.baseUrl}/api/v1/auth/login`, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: { 'Content-Type': 'application/json' }
    });
    return await res.json();
  }

  async register(email: string, password: string): Promise<any> {
    const res = await fetch(`${this.baseUrl}/api/v1/auth/register`, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: { 'Content-Type': 'application/json' }
    });
    return await res.json();
  }

  async getWallets(userId: string): Promise<any> {
    const res = await fetch(`${this.baseUrl}/api/v1/wallets?userId=${userId}`);
    return await res.json();
  }
}

export const apiClient = new EthsltdClient();
