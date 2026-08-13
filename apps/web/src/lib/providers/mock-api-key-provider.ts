import { ApiKey, CreateApiKeyRequest, CreateApiKeyResponse, ApiUsageStats, ApiStatus } from "@/lib/api/types";

// In-memory mock storage
const mockApiKeys: ApiKey[] = [
  {
    id: "eth_live_8f7d6a5e4b3c2d1",
    name: "Trading Bot Alpha",
    userId: "USR-12345",
    environment: "LIVE",
    permissions: ["READ", "TRADE"],
    ipRestrictions: ["192.168.1.100"],
    status: "ACTIVE",
    createdAt: Date.now() - 15 * 24 * 60 * 60 * 1000,
    lastUsedAt: Date.now() - 1000 * 60 * 5,
  },
  {
    id: "eth_test_9a8b7c6d5e4f3",
    name: "Development Test Key",
    userId: "USR-12345",
    environment: "TEST",
    permissions: ["READ"],
    ipRestrictions: [],
    status: "ACTIVE",
    createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
    lastUsedAt: Date.now() - 1000 * 60 * 60 * 2,
  },
  {
    id: "eth_live_1x2y3z4w5v6u",
    name: "Old Dashboard Integration",
    userId: "USR-12345",
    environment: "LIVE",
    permissions: ["READ"],
    ipRestrictions: [],
    status: "REVOKED",
    createdAt: Date.now() - 180 * 24 * 60 * 60 * 1000,
    lastUsedAt: Date.now() - 60 * 24 * 60 * 60 * 1000,
  }
];

const mockUsageStats: ApiUsageStats = {
  requestsToday: 12450,
  requestsThisMonth: 345890,
  successfulRequests: 12400,
  failedRequests: 15,
  rateLimitedRequests: 35,
  activeWebsockets: 2,
  lastActivityAt: Date.now() - 1000 * 60 * 2
};

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export class MockApiKeyProvider {
  static async getKeys(userId: string): Promise<ApiKey[]> {
    await delay(600);
    return mockApiKeys.filter(k => k.userId === userId || userId === 'ADMIN');
  }

  static async createKey(userId: string, req: CreateApiKeyRequest): Promise<CreateApiKeyResponse> {
    await delay(800);
    
    const prefix = req.environment === "LIVE" ? "eth_live_" : "eth_test_";
    const newId = prefix + Math.random().toString(36).substring(2, 15);
    const mockSecret = "sk_" + req.environment.toLowerCase() + "_" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    const newKey: ApiKey = {
      id: newId,
      name: req.name,
      userId,
      environment: req.environment,
      permissions: req.permissions,
      ipRestrictions: req.ipRestrictions,
      status: "ACTIVE",
      createdAt: Date.now(),
      expiresAt: req.expiresInDays ? Date.now() + (req.expiresInDays * 24 * 60 * 60 * 1000) : undefined,
    };

    mockApiKeys.unshift(newKey);

    return {
      key: newKey,
      secret: mockSecret
    };
  }

  static async revokeKey(keyId: string): Promise<void> {
    await delay(600);
    const index = mockApiKeys.findIndex(k => k.id === keyId);
    if (index !== -1) {
      mockApiKeys[index].status = "REVOKED";
    }
  }

  static async getUsageStats(userId: string): Promise<ApiUsageStats> {
    await delay(500);
    return { ...mockUsageStats };
  }
}
