import { create } from 'zustand';
import { OrderSide, OrderType, Timeframe } from '@/lib/trading/types';

export type MarketType = 'SPOT';

interface TradingUIState {
  selectedSide: OrderSide;
  selectedOrderType: OrderType;
  selectedTimeframe: Timeframe;
  orderFormPrice: string;
  orderFormQuantity: string;
  isOrderSubmitting: boolean;
  marketType: MarketType;
  successOrder: any | null;
  successPosition: any | null;
  selectedLeverage: string;

  setSide: (side: OrderSide) => void;
  setOrderType: (type: OrderType) => void;
  setTimeframe: (timeframe: Timeframe) => void;
  setOrderFormPrice: (price: string) => void;
  setOrderFormQuantity: (quantity: string) => void;
  setIsOrderSubmitting: (isSubmitting: boolean) => void;
  setMarketType: (type: MarketType) => void;
  setSuccessOrder: (order: any | null) => void;
  setSuccessPosition: (position: any | null) => void;
  setSelectedLeverage: (leverage: string) => void;
}

export const useTradingUIStore = create<TradingUIState>((set) => ({
  selectedSide: 'buy',
  selectedOrderType: 'limit',
  selectedTimeframe: '15m',
  orderFormPrice: '',
  orderFormQuantity: '',
  isOrderSubmitting: false,
  marketType: 'SPOT',
  successOrder: null,
  successPosition: null,
  selectedLeverage: '100',

  setSide: (side) => set({ selectedSide: side }),
  setOrderType: (type) => set({ selectedOrderType: type }),
  setTimeframe: (timeframe) => set({ selectedTimeframe: timeframe }),
  setOrderFormPrice: (price) => set({ orderFormPrice: price }),
  setOrderFormQuantity: (quantity) => set({ orderFormQuantity: quantity }),
  setIsOrderSubmitting: (isSubmitting) => set({ isOrderSubmitting: isSubmitting }),
  setMarketType: (type) => set({ marketType: type }),
  setSuccessOrder: (order) => set({ successOrder: order }),
  setSuccessPosition: (position) => set({ successPosition: position }),
  setSelectedLeverage: (leverage) => set({ selectedLeverage: leverage }),
}));
