import { 
  P2PAdvertisement, 
  P2PMerchant, 
  P2PAdvertisementQuery, 
  P2POrder, 
  P2POrderEvent, 
  P2PMessage 
} from "./types";
import { MOCK_ADVERTISEMENTS, MOCK_MERCHANTS } from "./mock-data";

export interface P2PDataProvider {
  getAdvertisements(params: P2PAdvertisementQuery): Promise<P2PAdvertisement[]>;
  getMerchant(merchantId: string): Promise<P2PMerchant | null>;
  getAdvertisement(advertisementId: string): Promise<P2PAdvertisement | null>;
}

export class MockP2PDataProvider implements P2PDataProvider {
  // Simulate network delay
  private async delay(ms = 600) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getAdvertisements(params: P2PAdvertisementQuery): Promise<P2PAdvertisement[]> {
    await this.delay(300);

    let results = [...MOCK_ADVERTISEMENTS];

    // Filter by side (Buy vs Sell tab)
    // Note: If user is on BUY tab, they want to see SELL ads (Merchants selling crypto)
    // If user is on SELL tab, they want to see BUY ads (Merchants buying crypto)
    const targetAdSide = params.side === "buy" ? "sell" : "buy";
    results = results.filter(ad => ad.side === targetAdSide);

    // Filter by Asset
    if (params.asset) {
      results = results.filter(ad => ad.asset === params.asset);
    }

    // Filter by Fiat
    if (params.fiat) {
      results = results.filter(ad => ad.fiat === params.fiat);
    }

    // Filter by Payment Method
    if (params.paymentMethod && params.paymentMethod !== "all") {
      results = results.filter(ad => 
        ad.paymentMethods.some(m => (typeof m === 'string' ? m : (m as any).type) === params.paymentMethod!)
      );
    }

    // Filter by Amount
    if (params.amount && params.amount > 0) {
      results = results.filter(ad => params.amount! >= ad.minLimit && params.amount! <= ad.maxLimit);
    }

    // Sort
    if (params.sortBy) {
      switch (params.sortBy) {
        case "Best Price":
        case "Lowest Price":
          results.sort((a, b) => a.price - b.price);
          // If user is selling, best price is highest price
          if (params.side === "sell") results.reverse();
          break;
        case "Highest Price":
          results.sort((a, b) => b.price - a.price);
          break;
        case "Fastest Completion":
          results.sort((a, b) => a.responseTimeMinutes - b.responseTimeMinutes);
          break;
        case "Highest Completion Rate":
          results.sort((a, b) => b.completionRate - a.completionRate);
          break;
        case "Most Trades":
          results.sort((a, b) => b.completedOrders - a.completedOrders);
          break;
      }
    } else {
      // Default sort is best price
      results.sort((a, b) => a.price - b.price);
      if (params.side === "sell") results.reverse();
    }

    return results;
  }

  async getMerchant(merchantId: string): Promise<P2PMerchant | null> {
    await this.delay(200);
    return MOCK_MERCHANTS.find(m => m.id === merchantId) || null;
  }

  async getAdvertisement(advertisementId: string): Promise<P2PAdvertisement | null> {
    await this.delay(200);
    return MOCK_ADVERTISEMENTS.find(ad => ad.id === advertisementId) || null;
  }
}

export const p2pProvider = new MockP2PDataProvider();
