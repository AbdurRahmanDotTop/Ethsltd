import { create } from 'zustand';
import { apiClient } from '@ethsltd/api-client';

interface AdminEnvState {
  adminMode: 'REAL' | 'DEMO';
  setAdminMode: (mode: 'REAL' | 'DEMO') => void;
}

export const useAdminEnvStore = create<AdminEnvState>()((set) => ({
  adminMode: 'REAL', // Default is strictly REAL. No persistence to avoid leaking.
  setAdminMode: (mode) => {
    apiClient.setMode(mode);
    set({ adminMode: mode });
  },
}));
