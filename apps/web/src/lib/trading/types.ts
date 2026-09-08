export type OrderSide = 'buy' | 'sell';
export type OrderType = 'limit' | 'market';

/** Raw tuple from exchange APIs: [price, amount] */
export type OrderbookTuple = [number, number];

/** Orderbook entry with computed cumulative total (used by OrderBook component) */
export interface OrderbookEntry {
  price: number;
  amount: number;
  total: number;
}

export type Timeframe = '1m' | '3m' | '5m' | '15m' | '30m' | '1h' | '2h' | '4h' | '6h' | '12h' | '1d' | '1w';

export interface Candle {
  time: number | string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

export interface OrderBook {
  bids: OrderbookEntry[];
  asks: OrderbookEntry[];
  lastUpdateId?: number;
}
