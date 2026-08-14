import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiClient } from "@ethsltd/api-client";

type TradingMode = 'REAL' | 'PAPER';

interface TradingModeState {
  mode: TradingMode;
  setMode: (mode: TradingMode) => void;
  toggleMode: () => void;
}

export const useTradingModeStore = create<TradingModeState>()(
  persist(
    (set) => ({
      mode: 'REAL',
      setMode: (mode) => {
        apiClient.setMode(mode);
        set({ mode });
      },
      toggleMode: () => set((state) => {
        const newMode = state.mode === 'REAL' ? 'PAPER' : 'REAL';
        apiClient.setMode(newMode);
        return { mode: newMode };
      }),
    }),
    {
      name: 'ethsltd-trading-mode',
    }
  )
);
