import { create } from 'zustand';
import { OrderSide, OrderType, Timeframe } from '@/lib/trading/types';

export type MarketType = 'SPOT' | 'FUTURES' | 'OPTIONS';

interface TradingUIState {
  selectedSide: OrderSide;
  selectedOrderType: OrderType;
  selectedTimeframe: Timeframe;
  orderFormPrice: string;
  orderFormQuantity: string;
  isOrderSubmitting: boolean;
  marketType: MarketType;
  leverage: number;

  setSide: (side: OrderSide) => void;
  setOrderType: (type: OrderType) => void;
  setTimeframe: (timeframe: Timeframe) => void;
  setOrderFormPrice: (price: string) => void;
  setOrderFormQuantity: (quantity: string) => void;
  setIsOrderSubmitting: (isSubmitting: boolean) => void;
  setMarketType: (type: MarketType) => void;
  setLeverage: (leverage: number) => void;
}

export const useTradingUIStore = create<TradingUIState>((set) => ({
  selectedSide: 'buy',
  selectedOrderType: 'limit',
  selectedTimeframe: '15m',
  orderFormPrice: '',
  orderFormQuantity: '',
  isOrderSubmitting: false,
  marketType: 'SPOT',
  leverage: 10,

  setSide: (side) => set({ selectedSide: side }),
  setOrderType: (type) => set({ selectedOrderType: type }),
  setTimeframe: (timeframe) => set({ selectedTimeframe: timeframe }),
  setOrderFormPrice: (price) => set({ orderFormPrice: price }),
  setOrderFormQuantity: (quantity) => set({ orderFormQuantity: quantity }),
  setIsOrderSubmitting: (isSubmitting) => set({ isOrderSubmitting: isSubmitting }),
  setMarketType: (type) => set({ marketType: type }),
  setLeverage: (leverage) => set({ leverage: leverage }),
}));
