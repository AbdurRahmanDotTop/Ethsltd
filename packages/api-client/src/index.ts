import { User } from '@ethsltd/types';

export class EthsltdClient {
  private baseUrl: string;

  constructor(baseUrl: string = 'http://localhost:8787') {
    this.baseUrl = baseUrl;
  }

  async getMe(): Promise<{ success: boolean; data?: User; error?: any }> {
    try {
      const res = await fetch(`${this.baseUrl}/api/v1/auth/me`);
      return await res.json();
    } catch (e) {
      return { success: false, error: e };
    }
  }
}

export const apiClient = new EthsltdClient();
