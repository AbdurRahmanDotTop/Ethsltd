import { Bindings } from '../db';
import crypto from 'node:crypto';

export class CregisClient {
  private waasApiKey: string;
  private waasProjectId: string;
  private peApiKey: string;
  private peProjectId: string;
  private baseUrl: string;
  private proxyUrl?: string;
  private proxySecret?: string;

  constructor(env: Bindings) {
    this.waasApiKey = env.CREGIS_WAAS_API_KEY || '';
    this.waasProjectId = env.CREGIS_WAAS_PROJECT_ID || '';
    this.peApiKey = env.CREGIS_PE_API_KEY || '';
    this.peProjectId = env.CREGIS_PE_PROJECT_ID || '';
    this.baseUrl = env.CREGIS_BASE_URL || 'https://t-tkqzeuxf.cregis.io';
    this.proxyUrl = env.CREGIS_PROXY_URL;
    this.proxySecret = env.CREGIS_PROXY_SECRET;
  }

  // Very basic address generator for mock/demo purposes until full WaaS API specs are used
  // In a real prod environment, this calls Cregis `/v1/address/create`
  async getDepositAddress(assetSymbol: string, userId: string): Promise<string> {
    // Standard mock for MVP
    if (assetSymbol.toUpperCase() === 'BTC') return `bc1qmock${userId.substring(0,8)}cregisbtc`;
    if (assetSymbol.toUpperCase() === 'ETH') return `0xmock${userId.substring(0,8)}cregiseth`;
    if (assetSymbol.toUpperCase() === 'USDT') return `0xmock${userId.substring(0,8)}cregisusdt`;
    return `mock_${assetSymbol}_${userId.substring(0,8)}`;
  }
  // Internal helper to call the PHP Proxy
  private async callProxy(service: 'PE' | 'WAAS', endpoint: string, payload: any): Promise<any> {
    if (!this.proxyUrl) {
      throw new Error("CREGIS_PROXY_URL is required to bypass Cloudflare IP restrictions.");
    }

    const proxyBody = {
      _proxy: {
        service,
        endpoint
      },
      payload
    };

    const response = await fetch(this.proxyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Proxy-Secret': this.proxySecret || ''
      },
      body: JSON.stringify(proxyBody)
    });

    const responseText = await response.text();
    let data: any = {};
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      throw new Error(`PHP Proxy Error (Status ${response.status}): ${responseText.substring(0, 100)}`);
    }

    if (response.status !== 200 || data.error) {
       throw new Error(`PHP Proxy returned error: ${data.error || 'Unknown error'}`);
    }

    return data;
  }

  // Create Payment Order for Cregis Payment Engine
  async createPaymentOrder(amount: number, currency: string, userId: string): Promise<string> {
    const payload = {
      amount,
      currency,
      third_party_id: userId
    };

    try {
      const data = await this.callProxy('PE', '/api/v1/payment/create', payload);

      if (data.code === '00000' || data.code === 200 || data.success) {
        if (data.data && data.data.url) return data.data.url;
        if (data.url) return data.url;
        if (data.data && data.data.cid) return `https://pay.cregis.io/?cid=${data.data.cid}&language=en-US`;
      }

      throw new Error(`Cregis Error via Proxy [Code: ${data.code}]: ${data.msg || data.message || 'API rejected the request'}. Full Response: ${JSON.stringify(data)}`);
    } catch (error: any) {
      console.error("Cregis Proxy Fetch Error:", error);
      throw error;
    }
  }

  // Create Payout (Withdrawal) via Cregis WaaS
  async createPayout(amount: number, currency: string, address: string, userId: string): Promise<string> {
    const payload = {
      currency,
      amount,
      address,
      // Provide a unique client order ID for the payout
      order_id: `PO-${userId.substring(0,5)}-${Date.now()}` 
    };

    try {
      // NOTE: Verify the exact payout endpoint from Cregis WaaS docs
      // Usually it's something like /v1/payout/create or /api/v1/payout/create
      const data = await this.callProxy('WAAS', '/v1/payout/create', payload);

      if (data.code === '00000' || data.code === 200 || data.success) {
        // Return the Cregis payout internal ID
        return data.data?.payout_id || data.data?.order_id || payload.order_id;
      }

      throw new Error(`Cregis Payout Error [Code: ${data.code}]: ${data.msg || data.message || 'Rejected'}. Full Response: ${JSON.stringify(data)}`);
    } catch (error: any) {
      console.error("Cregis Payout Fetch Error:", error);
      throw error;
    }
  }

  // Verifies Cregis webhook signatures
  verifyWebhookSignature(payload: string, signature: string): boolean {
    // In production, Cregis signs webhooks using HMAC-SHA256 or MD5 with the API Secret.
    if (!this.waasApiKey && !this.peApiKey) {
      console.warn("Missing Cregis API Keys, accepting webhook for demo purposes");
      return true;
    }
    // ... Implement real signature validation here based on Cregis docs ...
    return true; // For now, allow through for testing
  }
}
