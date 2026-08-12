import { TradingProvider, PlaceOrderRequest, Balance, Order, Trade } from './types';
import { usePaperAccountStore } from '@/stores/paper-account-store';

export class MockTradingProvider implements TradingProvider {
  
  // Simulated network delay
  private async delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getBalances(): Promise<Balance[]> {
    await this.delay(100);
    return usePaperAccountStore.getState().balances;
  }

  async getOpenOrders(symbol?: string): Promise<Order[]> {
    await this.delay(100);
    const orders = usePaperAccountStore.getState().orders;
    const openOrders = orders.filter(o => o.status === 'open' || o.status === 'partially_filled');
    if (symbol) return openOrders.filter(o => o.market === symbol);
    return openOrders;
  }

  async getOrderHistory(symbol?: string): Promise<Order[]> {
    await this.delay(100);
    const orders = usePaperAccountStore.getState().orders;
    if (symbol) return orders.filter(o => o.market === symbol);
    return orders;
  }

  async getTradeHistory(symbol?: string): Promise<Trade[]> {
    await this.delay(100);
    const trades = usePaperAccountStore.getState().trades;
    if (symbol) return trades.filter(o => o.market === symbol);
    return trades;
  }

  async placeOrder(req: PlaceOrderRequest): Promise<Order> {
    await this.delay(500); // simulate network & matching engine time
    const { placeOrder } = usePaperAccountStore.getState();
    try {
      const order = placeOrder(req.market, req.side, req.type, req.quantity, req.price);
      return order;
    } catch (err: any) {
      throw new Error(err.message || "Failed to place order");
    }
  }

  async cancelOrder(orderId: string): Promise<Order> {
    await this.delay(300);
    const { cancelOrder } = usePaperAccountStore.getState();
    try {
      const order = cancelOrder(orderId);
      return order;
    } catch (err: any) {
      throw new Error(err.message || "Failed to cancel order");
    }
  }
}

export const tradingProvider = new MockTradingProvider();
