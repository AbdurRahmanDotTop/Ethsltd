import { create } from "zustand";
import { ApiKey, CreateApiKeyRequest, CreateApiKeyResponse, ApiUsageStats } from "@/lib/api/types";

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
      set({ keys: [], isLoadingKeys: false });
    } catch (error) {
      console.error("Failed to fetch API keys", error);
      set({ isLoadingKeys: false });
    }
  },

  createKey: async (userId: string, req: CreateApiKeyRequest) => {
    throw new Error("API Key creation not fully implemented yet");
  },

  revokeKey: async (keyId: string) => {
    throw new Error("API Key revocation not fully implemented yet");
  },

  fetchUsage: async (userId: string) => {
    set({ isLoadingUsage: true });
    try {
      set({ usage: null, isLoadingUsage: false });
    } catch (error) {
      console.error("Failed to fetch API usage", error);
      set({ isLoadingUsage: false });
    }
  }
}));
