import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
      setMode: (mode) => set({ mode }),
      toggleMode: () => set((state) => ({ mode: state.mode === 'REAL' ? 'PAPER' : 'REAL' })),
    }),
    {
      name: 'ethsltd-trading-mode',
    }
  )
);
