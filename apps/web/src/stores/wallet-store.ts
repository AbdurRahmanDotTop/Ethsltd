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
  withdraw: (asset: string, amount: number, destination: string, network: string) => Promise<any>;
  fiatCurrency: string;
  fiatExchangeRate: number;
  setFiatCurrency: (fiat: string) => void;
  fetchFiatExchangeRate: () => Promise<void>;
}

export const useWalletStore = create<WalletState>()(
  (set, get) => ({
    balances: [],
    transactions: [],
    isLoading: false,
    error: null,
    fiatCurrency: 'INR',
    fiatExchangeRate: 1,

    setFiatCurrency: (fiat) => {
      set({ fiatCurrency: fiat });
      get().fetchFiatExchangeRate();
    },

    fetchFiatExchangeRate: async () => {
      const fiat = get().fiatCurrency;
      if (fiat === 'USDT' || fiat === 'USD') {
        set({ fiatExchangeRate: 1 });
        return;
      }
      try {
        const res = await apiClient.getExchangeRate('USDT', fiat);
        if (res.success && res.data && res.data.rate) {
          set({ fiatExchangeRate: res.data.rate });
        }
      } catch (err) {
        console.error("Failed to fetch fiat exchange rate", err);
      }
    },

    fetchBalances: async () => {
      // Clear balances before fetching to prevent flickering from old mode
      set({ balances: [] });
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
      set({ transactions: [], isLoading: true, error: null });
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

    withdraw: async (asset, amount, destination, network) => {
      const res = await apiClient.withdraw({
        assetSymbol: asset,
        amount,
        network,
        destination,
      });
      
      if (res.success) {
        await get().fetchBalances();
        await get().fetchTransactions();
      }
      return res;
    },

  })
);
