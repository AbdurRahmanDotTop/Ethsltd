import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { apiClient } from '@ethsltd/api-client';

interface AdminEnvState {
  adminMode: 'REAL';
  setAdminMode: (mode: 'REAL') => void;
}

export const useAdminEnvStore = create<AdminEnvState>()(
  persist(
    (set) => ({
      adminMode: 'REAL',
      setAdminMode: (mode) => {
        apiClient.setMode(mode);
        set({ adminMode: mode });
      },
    }),
    {
      name: 'admin-env-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          apiClient.setMode(state.adminMode);
        }
      },
    }
  )
);
