import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { WalletTransaction, TransactionType, TransactionStatus } from '@/lib/wallet/types';
import { usePaperAccountStore } from '@/stores/paper-account-store';

interface WalletState {
  transactions: WalletTransaction[];
  
  // Actions
  addTransaction: (tx: Omit<WalletTransaction, 'id' | 'createdAt' | 'updatedAt'>) => WalletTransaction;
  updateTransactionStatus: (id: string, status: TransactionStatus) => void;
  
  // High level actions
  simulateDeposit: (asset: string, amount: number) => Promise<WalletTransaction>;
  simulateWithdrawal: (asset: string, amount: number, destination: string, network: string, fee: number) => Promise<WalletTransaction>;
}

function generateTxId() {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
  return `TX-${date}-${random}`;
}

export const useWalletStore = create<WalletState>()(
  persist(
    (set, get) => ({
      transactions: [],

      addTransaction: (txData) => {
        const newTx: WalletTransaction = {
          ...txData,
          id: generateTxId(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({ transactions: [newTx, ...state.transactions] }));
        return newTx;
      },

      updateTransactionStatus: (id, status) => {
        set((state) => ({
          transactions: state.transactions.map((tx) =>
            tx.id === id ? { ...tx, status, updatedAt: new Date().toISOString() } : tx
          ),
        }));
      },

      simulateDeposit: async (asset, amount) => {
        // Create pending transaction
        const tx = get().addTransaction({
          type: 'DEPOSIT',
          asset,
          amount,
          fee: 0,
          status: 'PENDING',
        });

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Mark as completed
        get().updateTransactionStatus(tx.id, 'COMPLETED');

        // Add funds to the paper account store (Ledger update)
        usePaperAccountStore.getState()._addFunds(asset, amount);

        return { ...tx, status: 'COMPLETED' };
      },

      simulateWithdrawal: async (asset, amount, destination, network, fee) => {
        // Deduct funds immediately to lock them (or deduct totally since it's withdrawing)
        // For withdrawal, we just deduct the available funds upfront.
        usePaperAccountStore.getState()._deductFunds(asset, amount + fee);

        // Create pending transaction
        const tx = get().addTransaction({
          type: 'WITHDRAWAL',
          asset,
          amount: -(amount + fee), // Negative for withdrawal
          fee,
          status: 'PENDING',
          destination,
          network,
        });

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Mark as completed
        get().updateTransactionStatus(tx.id, 'COMPLETED');

        return { ...tx, status: 'COMPLETED' };
      },
    }),
    {
      name: 'ethsltd-wallet-store',
    }
  )
);
