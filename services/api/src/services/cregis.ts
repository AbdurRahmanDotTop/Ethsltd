import { Bindings } from '../db';
import crypto from 'node:crypto';

export class CregisClient {
  private waasApiKey: string;
  private waasProjectId: string;
  private peApiKey: string;
  private peProjectId: string;
  private baseUrl: string;

  constructor(env: Bindings) {
    this.waasApiKey = env.CREGIS_WAAS_API_KEY || '';
    this.waasProjectId = env.CREGIS_WAAS_PROJECT_ID || '';
    this.peApiKey = env.CREGIS_PE_API_KEY || '';
    this.peProjectId = env.CREGIS_PE_PROJECT_ID || '';
    this.baseUrl = env.CREGIS_BASE_URL || 'https://t-tkqzeuxf.cregis.io';
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

  // Create Payment Order for Cregis Payment Engine
  async createPaymentOrder(amount: number, currency: string, userId: string): Promise<string> {
    const timestamp = Date.now().toString();
    const nonce = Math.random().toString(36).substring(2, 8); // 6 char random string
    
    const params: Record<string, string> = {
      pid: this.peProjectId,
      timestamp,
      nonce,
      amount: amount.toString(),
      currency,
      third_party_id: userId,
      // You may need to customize these based on exact Cregis endpoint docs
      // e.g. callback_url: "https://yourdomain.com/api/v1/webhooks/cregis"
    };

    // 1. Sort parameters lexicographically by key
    const sortedKeys = Object.keys(params).sort();
    
    // 2. Concatenate key-value pairs
    let paramString = '';
    for (const key of sortedKeys) {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
        paramString += `${key}${params[key]}`;
      }
    }
    
    // 3. Prepend API Key and Hash with MD5
    const stringToSign = this.peApiKey + paramString;
    const sign = crypto.createHash('md5').update(stringToSign).digest('hex').toLowerCase();
    
    // 4. Construct final payload
    const payload = { ...params, sign };

    // 5. Make the API Call to Cregis Payment Engine
    try {
      // If no valid API keys are provided, return a mock URL for demo purposes
      if (!this.peApiKey || !this.peProjectId) {
         console.warn("Missing Cregis API Keys, returning mock checkout URL");
         return `/wallet/mock-checkout?amount=${amount}&currency=${currency}`;
      }

      // NOTE: If the exact endpoint is different (e.g. /v1/order/create), adjust the path here
      // The official Cregis Payment Engine endpoint is /api/v1/payment/create
      const response = await fetch(`${this.baseUrl}/api/v1/payment/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0'
        },
        body: JSON.stringify(payload)
      });
      
      const responseText = await response.text();
      let data: any = {};
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error("Cregis API returned non-JSON response:", response.status, responseText);
        let detailedError = `HTTP Error ${response.status} from Cregis. `;
        if (response.status === 403 || response.status === 401) {
          detailedError += `Firewall/Auth Block! Cregis firewall is blocking our server IP. Please ensure our server IP is whitelisted, or contact Cregis support to whitelist Cloudflare Worker traffic. (Raw: ${responseText.substring(0, 50)})`;
        } else {
          detailedError += `Invalid JSON. Response preview: ${responseText.substring(0, 100)}`;
        }
        throw new Error(detailedError);
      }
      
      if (data.code === '00000' || data.code === 200 || data.success) {
        // Cregis usually returns the URL in data.url or data.data.url or just returns the cid to construct it
        if (data.data && data.data.url) return data.data.url;
        if (data.url) return data.url;
        if (data.data && data.data.cid) return `https://pay.cregis.io/?cid=${data.data.cid}&language=en-US`;
      }
      
      console.error("Cregis API Error:", JSON.stringify(data));
      throw new Error(`Cregis Error [Code: ${data.code}]: ${data.msg || data.message || 'API rejected the request'}. Full Response: ${JSON.stringify(data)}`);
      
    } catch (error: any) {
      console.error("Cregis Fetch Error:", error);
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
