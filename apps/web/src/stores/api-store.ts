import { create } from "zustand";
import { ApiKey, CreateApiKeyRequest, CreateApiKeyResponse, ApiUsageStats } from "@/lib/api/types";
import { MockApiKeyProvider } from "@/lib/providers/mock-api-key-provider";

interface ApiKeyState {
  keys: ApiKey[];
  usage: ApiUsageStats | null;
  isLoadingKeys: boolean;
  isLoadingUsage: boolean;
  
  fetchKeys: (userId: string) => Promise<void>;
  createKey: (userId: string, req: CreateApiKeyRequest) => Promise<CreateApiKeyResponse>;
  revokeKey: (keyId: string) => Promise<void>;
  fetchUsage: (userId: string) => Promise<void>;
}

export const useApiStore = create<ApiKeyState>((set, get) => ({
  keys: [],
  usage: null,
  isLoadingKeys: false,
  isLoadingUsage: false,

  fetchKeys: async (userId: string) => {
    set({ isLoadingKeys: true });
    try {
      const keys = await MockApiKeyProvider.getKeys(userId);
      set({ keys, isLoadingKeys: false });
    } catch (error) {
      console.error("Failed to fetch API keys", error);
      set({ isLoadingKeys: false });
    }
  },

  createKey: async (userId: string, req: CreateApiKeyRequest) => {
    const res = await MockApiKeyProvider.createKey(userId, req);
    set(state => ({
      keys: [res.key, ...state.keys]
    }));
    return res;
  },

  revokeKey: async (keyId: string) => {
    await MockApiKeyProvider.revokeKey(keyId);
    set(state => ({
      keys: state.keys.map(k => k.id === keyId ? { ...k, status: "REVOKED" } : k)
    }));
  },

  fetchUsage: async (userId: string) => {
    set({ isLoadingUsage: true });
    try {
      const usage = await MockApiKeyProvider.getUsageStats(userId);
      set({ usage, isLoadingUsage: false });
    } catch (error) {
      console.error("Failed to fetch API usage", error);
      set({ isLoadingUsage: false });
    }
  }
}));
