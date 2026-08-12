import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Balance, Order, Trade, OrderSide, OrderType, OrderStatus } from '@/lib/trading/types';
import { calculateFee, calculateTotal, parseMarketSymbol } from '@/lib/trading/calculations';

interface PaperAccountState {
  balances: Balance[];
  orders: Order[];
  trades: Trade[];
  
  // Actions
  resetAccount: () => void;
  placeOrder: (market: string, side: OrderSide, type: OrderType, quantity: number, price?: number) => Order;
  cancelOrder: (orderId: string) => Order;
  
  // Internal actions (called by placeOrder)
  _lockFunds: (asset: string, amount: number) => void;
  _unlockFunds: (asset: string, amount: number) => void;
  _deductFunds: (asset: string, amount: number) => void;
  _addFunds: (asset: string, amount: number) => void;
}

const DEFAULT_BALANCES: Balance[] = [
  { asset: 'USDT', available: 10000, locked: 0, total: 10000 },
  { asset: 'USDC', available: 10000, locked: 0, total: 10000 },
  { asset: 'BTC', available: 0, locked: 0, total: 0 },
  { asset: 'ETH', available: 0, locked: 0, total: 0 },
  { asset: 'SOL', available: 0, locked: 0, total: 0 },
];

export const usePaperAccountStore = create<PaperAccountState>()(
  persist(
    (set, get) => ({
      balances: DEFAULT_BALANCES,
      orders: [],
      trades: [],

      resetAccount: () => {
        set({ balances: DEFAULT_BALANCES, orders: [], trades: [] });
      },

      _lockFunds: (asset: string, amount: number) => {
        set((state) => {
          const balances = [...state.balances];
          const idx = balances.findIndex(b => b.asset === asset);
          if (idx >= 0) {
            balances[idx] = {
              ...balances[idx],
              available: balances[idx].available - amount,
              locked: balances[idx].locked + amount,
            };
          }
          return { balances };
        });
      },

      _unlockFunds: (asset: string, amount: number) => {
        set((state) => {
          const balances = [...state.balances];
          const idx = balances.findIndex(b => b.asset === asset);
          if (idx >= 0) {
            balances[idx] = {
              ...balances[idx],
              available: balances[idx].available + amount,
              locked: balances[idx].locked - amount,
            };
          }
          return { balances };
        });
      },

      _deductFunds: (asset: string, amount: number) => {
        set((state) => {
          const balances = [...state.balances];
          const idx = balances.findIndex(b => b.asset === asset);
          if (idx >= 0) {
            balances[idx] = {
              ...balances[idx],
              total: balances[idx].total - amount,
              available: balances[idx].available - amount,
            };
          }
          return { balances };
        });
      },

      _addFunds: (asset: string, amount: number) => {
        set((state) => {
          const balances = [...state.balances];
          const idx = balances.findIndex(b => b.asset === asset);
          if (idx >= 0) {
            balances[idx] = {
              ...balances[idx],
              total: balances[idx].total + amount,
              available: balances[idx].available + amount,
            };
          } else {
            balances.push({ asset, available: amount, locked: 0, total: amount });
          }
          return { balances };
        });
      },

      placeOrder: (market: string, side: OrderSide, type: OrderType, quantity: number, price?: number) => {
        const { base, quote } = parseMarketSymbol(market);
        const { balances, _lockFunds, _deductFunds, _addFunds, orders, trades } = get();
        
        // 1. Validation and Fund Reservation
        const estimatedPrice = price || 0; // For market order, this would be current price passed in by UI
        const total = calculateTotal(estimatedPrice, quantity);
        const fee = calculateFee(total);
        const requiredQuote = total + fee;

        if (side === 'buy') {
          const quoteBal = balances.find(b => b.asset === quote)?.available || 0;
          if (quoteBal < requiredQuote) throw new Error(`Insufficient ${quote} balance.`);
          if (type === 'limit') {
            _lockFunds(quote, requiredQuote);
          }
        } else {
          const baseBal = balances.find(b => b.asset === base)?.available || 0;
          if (baseBal < quantity) throw new Error(`Insufficient ${base} balance.`);
          if (type === 'limit') {
            _lockFunds(base, quantity);
          }
        }

        // 2. Create Order
        const newOrder: Order = {
          id: `PAPER-ORD-${Date.now()}-${Math.floor(Math.random()*1000)}`,
          market,
          side,
          type,
          price,
          quantity,
          filledQuantity: 0,
          remainingQuantity: quantity,
          status: type === 'market' ? 'filled' : 'open',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        const newOrders = [newOrder, ...orders];
        let newTrades = [...trades];

        // 3. Immediate execution for Market Orders
        if (type === 'market') {
          newOrder.filledQuantity = quantity;
          newOrder.remainingQuantity = 0;
          
          const newTrade: Trade = {
            id: `PAPER-TRD-${Date.now()}`,
            orderId: newOrder.id,
            market,
            side,
            price: estimatedPrice,
            quantity,
            quoteAmount: total,
            fee,
            feeAsset: quote,
            timestamp: new Date().toISOString()
          };
          
          newTrades = [newTrade, ...newTrades];

          // Deduct/Add instantly
          if (side === 'buy') {
            _deductFunds(quote, requiredQuote);
            _addFunds(base, quantity);
          } else {
            _deductFunds(base, quantity);
            _addFunds(quote, total - fee);
          }
        }

        set({ orders: newOrders, trades: newTrades });
        return newOrder;
      },

      cancelOrder: (orderId: string) => {
        const { orders, _unlockFunds } = get();
        const orderIdx = orders.findIndex(o => o.id === orderId);
        if (orderIdx < 0) throw new Error("Order not found");
        
        const order = orders[orderIdx];
        if (order.status !== 'open' && order.status !== 'partially_filled') {
          throw new Error("Order cannot be cancelled in current state");
        }

        const newOrders = [...orders];
        newOrders[orderIdx] = {
          ...order,
          status: 'cancelled',
          updatedAt: new Date().toISOString()
        };

        const { base, quote } = parseMarketSymbol(order.market);
        
        // Unlock funds
        if (order.side === 'buy') {
          const total = calculateTotal(order.price || 0, order.remainingQuantity);
          const fee = calculateFee(total);
          _unlockFunds(quote, total + fee);
        } else {
          _unlockFunds(base, order.remainingQuantity);
        }

        set({ orders: newOrders });
        return newOrders[orderIdx];
      }
    }),
    {
      name: 'ethsltd-paper-account',
    }
  )
);
