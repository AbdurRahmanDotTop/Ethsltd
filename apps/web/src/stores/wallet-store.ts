import { create } from 'zustand';
import { WalletTransaction, AssetBalance } from '@/lib/wallet/types';
import { apiClient } from '@ethsltd/api-client';

interface WalletState {
  balances: AssetBalance[];
  transactions: WalletTransaction[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchBalances: () => Promise<void>;
  fetchTransactions: () => Promise<void>;
  simulateDeposit: (asset: string, amount: number) => Promise<any>;
  simulateWithdrawal: (asset: string, amount: number, destination: string, network: string, fee: number) => Promise<any>;
}

export const useWalletStore = create<WalletState>()(
  (set, get) => ({
    balances: [],
    transactions: [],
    isLoading: false,
    error: null,

    fetchBalances: async () => {
      try {
        const res = await apiClient.getWalletBalances();
        if (res.success && res.data) {
          set({ balances: res.data });
        }
      } catch (err: any) {
        console.error("Failed to fetch balances", err);
      }
    },

    fetchTransactions: async () => {
      set({ isLoading: true, error: null });
      try {
        const res = await apiClient.getWalletTransactions();
        if (res.success && res.data) {
          set({ transactions: res.data, isLoading: false });
        } else {
          set({ error: res.error || 'Failed to fetch transactions', isLoading: false });
        }
      } catch (err: any) {
        set({ error: err.message, isLoading: false });
      }
    },

    simulateDeposit: async (asset, amount) => {
      const res = await apiClient.deposit({
        assetSymbol: asset,
        amount,
        network: 'Simulation',
      });
      
      if (res.success) {
        await get().fetchBalances();
        await get().fetchTransactions();
      }
      return res;
    },

    simulateWithdrawal: async (asset, amount, destination, network, fee) => {
      const res = await apiClient.withdraw({
        assetSymbol: asset,
        amount,
        network,
        destination
      });
      
      if (res.success) {
        await get().fetchBalances();
        await get().fetchTransactions();
      }
      return res;
    },
  })
);
