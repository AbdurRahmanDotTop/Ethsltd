import { create } from 'zustand';
import { WalletTransaction, AssetBalance } from '@/lib/wallet/types';
import { apiClient } from '@ethsltd/api-client';

interface WalletState {
  balances: AssetBalance[];
  transactions: WalletTransaction[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchBalances: (mode: string) => Promise<void>;
  fetchTransactions: (mode: string) => Promise<void>;
  simulateDeposit: (asset: string, amount: number, mode: string) => Promise<any>;
  simulateWithdrawal: (asset: string, amount: number, destination: string, network: string, fee: number, mode: string) => Promise<any>;
  fiatCurrency: string;
  setFiatCurrency: (fiat: string) => void;
}

export const useWalletStore = create<WalletState>()(
  (set, get) => ({
    balances: [],
    transactions: [],
    isLoading: false,
    error: null,
    fiatCurrency: 'INR',

    setFiatCurrency: (fiat) => set({ fiatCurrency: fiat }),

    fetchBalances: async (mode) => {
      // Clear balances before fetching to prevent flickering from old mode
      set({ balances: [] });
      try {
        const res = await apiClient.getWalletBalances(mode);
        if (res.success && res.data) {
          set({ balances: res.data });
        }
      } catch (err: any) {
        console.error("Failed to fetch balances", err);
      }
    },

    fetchTransactions: async (mode) => {
      set({ transactions: [], isLoading: true, error: null });
      try {
        const res = await apiClient.getWalletTransactions(mode);
        if (res.success && res.data) {
          set({ transactions: res.data, isLoading: false });
        } else {
          set({ error: res.error || 'Failed to fetch transactions', isLoading: false });
        }
      } catch (err: any) {
        set({ error: err.message, isLoading: false });
      }
    },

    simulateDeposit: async (asset, amount, mode) => {
      const res = await apiClient.deposit({
        assetSymbol: asset,
        amount,
        network: 'Simulation',
        mode
      });
      
      if (res.success) {
        await get().fetchBalances(mode);
        await get().fetchTransactions(mode);
      }
      return res;
    },

    simulateWithdrawal: async (asset, amount, destination, network, fee, mode) => {
      const res = await apiClient.withdraw({
        assetSymbol: asset,
        amount,
        network,
        destination,
        mode
      });
      
      if (res.success) {
        await get().fetchBalances(mode);
        await get().fetchTransactions(mode);
      }
      return res;
    },
  })
);
