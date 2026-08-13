export type TransactionType = "DEPOSIT" | "WITHDRAWAL" | "TRADE" | "P2P" | "TRANSFER" | "FEE" | "REWARD" | "ADJUSTMENT";
export type TransactionStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED" | "CANCELLED" | "REVERSED";

export interface WalletTransaction {
  id: string; // e.g., TX-20260813-000001
  type: TransactionType;
  asset: string; // e.g., USD, BTC
  amount: number; // Positive for incoming, negative for outgoing
  fee: number;
  status: TransactionStatus;
  destination?: string;
  network?: string;
  createdAt: string;
  updatedAt: string;
  reference?: string;
}

export interface AssetBalance {
  assetId: string;
  symbol: string;
  available: number;
  locked: number;
  total: number;
  usdPrice: number;
  usdValue: number;
  change24h: number;
  change24hPercent: number;
}

export interface PortfolioSummary {
  totalValueUsd: number;
  change24hUsd: number;
  change24hPercent: number;
  availableBalanceUsd: number;
  lockedBalanceUsd: number;
}

export interface AssetAllocation {
  asset: string;
  percentage: number;
  usdValue: number;
}
