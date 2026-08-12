export type TradingMode = "paper" | "live";
export type OrderType = "market" | "limit";
export type OrderSide = "buy" | "sell";
export type OrderStatus = 
  | "created"
  | "validating"
  | "accepted"
  | "open"
  | "partially_filled"
  | "filled"
  | "cancelled"
  | "rejected"
  | "expired";

export interface Order {
  id: string;
  market: string;
  side: OrderSide;
  type: OrderType;
  price?: number; // Only for limit orders
  quantity: number;
  filledQuantity: number;
  remainingQuantity: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Trade {
  id: string;
  orderId: string;
  market: string;
  side: OrderSide;
  price: number;
  quantity: number;
  quoteAmount: number;
  fee: number;
  feeAsset: string;
  timestamp: string;
}

export interface Balance {
  asset: string;
  available: number;
  locked: number;
  total: number;
}

export interface PlaceOrderRequest {
  market: string;
  side: OrderSide;
  type: OrderType;
  quantity: number;
  price?: number;
  idempotencyKey?: string;
}

export interface TradingProvider {
  getBalances(): Promise<Balance[]>;
  getOpenOrders(symbol?: string): Promise<Order[]>;
  getOrderHistory(symbol?: string): Promise<Order[]>;
  getTradeHistory(symbol?: string): Promise<Trade[]>;
  placeOrder(req: PlaceOrderRequest): Promise<Order>;
  cancelOrder(orderId: string): Promise<Order>;
}

// Chart types
export interface Candle {
  time: string | number; // YYYY-MM-DD or unix timestamp
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

export type Timeframe = "1m" | "5m" | "15m" | "30m" | "1H" | "4H" | "1D" | "1W";

// Orderbook types
export interface OrderBookLevel {
  price: number;
  amount: number;
  total: number;
}

export interface OrderBook {
  asks: OrderBookLevel[];
  bids: OrderBookLevel[];
}
