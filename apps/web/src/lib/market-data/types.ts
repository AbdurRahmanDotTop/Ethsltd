export type MarketStatus = 'TRADING' | 'HALTED' | 'MAINTENANCE' | 'COMING_SOON';

export interface Market {
  id: string;
  symbol: string;
  baseAsset: string;
  quoteAsset: string;
  name: string;
  price: number;
  priceChange24h: number;
  high24h: number;
  low24h: number;
  volume24h: number;
  marketCap: number;
  sparkline: number[];
  status: MarketStatus;
  isNew: boolean;
  updatedAt: string;
}

export interface MarketStats {
  totalMarkets: number;
  volume24h: number;
  btcDominance: number;
  activeAssets: number;
  status: string;
}
