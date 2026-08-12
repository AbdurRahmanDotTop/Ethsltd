import { Market, MarketStats } from './types';

// Helper to generate a realistic looking sparkline
const generateSparkline = (start: number, end: number, points: number = 20) => {
  const result = [start];
  let current = start;
  const trend = (end - start) / points;
  const volatility = start * 0.005; // 0.5% volatility

  for (let i = 1; i < points - 1; i++) {
    current = current + trend + (Math.random() - 0.5) * volatility;
    result.push(current);
  }
  result.push(end);
  return result;
};

// Base 20 markets as per PRD
const MOCK_MARKETS: Market[] = [
  {
    id: "btc-usdt", symbol: "BTC/USDT", baseAsset: "BTC", quoteAsset: "USDT", name: "Bitcoin",
    price: 104284.32, priceChange24h: 2.41, high24h: 105920.10, low24h: 101842.12, volume24h: 48200000000, marketCap: 2080000000000,
    sparkline: generateSparkline(101842.12, 104284.32), status: 'TRADING', isNew: false, updatedAt: new Date().toISOString()
  },
  {
    id: "eth-usdt", symbol: "ETH/USDT", baseAsset: "ETH", quoteAsset: "USDT", name: "Ethereum",
    price: 3842.15, priceChange24h: 1.83, high24h: 3950.00, low24h: 3750.40, volume24h: 18400000000, marketCap: 462000000000,
    sparkline: generateSparkline(3750.40, 3842.15), status: 'TRADING', isNew: false, updatedAt: new Date().toISOString()
  },
  {
    id: "sol-usdt", symbol: "SOL/USDT", baseAsset: "SOL", quoteAsset: "USDT", name: "Solana",
    price: 182.40, priceChange24h: 8.42, high24h: 185.00, low24h: 168.20, volume24h: 5200000000, marketCap: 81000000000,
    sparkline: generateSparkline(168.20, 182.40), status: 'TRADING', isNew: false, updatedAt: new Date().toISOString()
  },
  {
    id: "bnb-usdt", symbol: "BNB/USDT", baseAsset: "BNB", quoteAsset: "USDT", name: "BNB",
    price: 592.10, priceChange24h: -1.24, high24h: 605.00, low24h: 588.00, volume24h: 1200000000, marketCap: 87000000000,
    sparkline: generateSparkline(605.00, 592.10), status: 'TRADING', isNew: false, updatedAt: new Date().toISOString()
  },
  {
    id: "xrp-usdt", symbol: "XRP/USDT", baseAsset: "XRP", quoteAsset: "USDT", name: "Ripple",
    price: 0.6214, priceChange24h: 0.85, high24h: 0.6350, low24h: 0.6100, volume24h: 850000000, marketCap: 34000000000,
    sparkline: generateSparkline(0.6100, 0.6214), status: 'TRADING', isNew: false, updatedAt: new Date().toISOString()
  },
  {
    id: "ada-usdt", symbol: "ADA/USDT", baseAsset: "ADA", quoteAsset: "USDT", name: "Cardano",
    price: 0.5840, priceChange24h: 3.12, high24h: 0.5900, low24h: 0.5600, volume24h: 420000000, marketCap: 20000000000,
    sparkline: generateSparkline(0.5600, 0.5840), status: 'TRADING', isNew: false, updatedAt: new Date().toISOString()
  },
  {
    id: "doge-usdt", symbol: "DOGE/USDT", baseAsset: "DOGE", quoteAsset: "USDT", name: "Dogecoin",
    price: 0.1824, priceChange24h: -2.15, high24h: 0.1900, low24h: 0.1780, volume24h: 1100000000, marketCap: 26000000000,
    sparkline: generateSparkline(0.1900, 0.1824), status: 'TRADING', isNew: false, updatedAt: new Date().toISOString()
  },
  {
    id: "avax-usdt", symbol: "AVAX/USDT", baseAsset: "AVAX", quoteAsset: "USDT", name: "Avalanche",
    price: 48.25, priceChange24h: 7.18, high24h: 49.00, low24h: 44.50, volume24h: 680000000, marketCap: 18000000000,
    sparkline: generateSparkline(44.50, 48.25), status: 'TRADING', isNew: false, updatedAt: new Date().toISOString()
  },
  {
    id: "link-usdt", symbol: "LINK/USDT", baseAsset: "LINK", quoteAsset: "USDT", name: "Chainlink",
    price: 18.90, priceChange24h: 6.94, high24h: 19.20, low24h: 17.50, volume24h: 450000000, marketCap: 11000000000,
    sparkline: generateSparkline(17.50, 18.90), status: 'TRADING', isNew: false, updatedAt: new Date().toISOString()
  },
  {
    id: "dot-usdt", symbol: "DOT/USDT", baseAsset: "DOT", quoteAsset: "USDT", name: "Polkadot",
    price: 8.45, priceChange24h: 1.12, high24h: 8.60, low24h: 8.20, volume24h: 210000000, marketCap: 12000000000,
    sparkline: generateSparkline(8.20, 8.45), status: 'TRADING', isNew: false, updatedAt: new Date().toISOString()
  },
  {
    id: "matic-usdt", symbol: "MATIC/USDT", baseAsset: "MATIC", quoteAsset: "USDT", name: "Polygon",
    price: 0.942, priceChange24h: -1.05, high24h: 0.960, low24h: 0.920, volume24h: 310000000, marketCap: 9000000000,
    sparkline: generateSparkline(0.960, 0.942), status: 'TRADING', isNew: false, updatedAt: new Date().toISOString()
  },
  {
    id: "ltc-usdt", symbol: "LTC/USDT", baseAsset: "LTC", quoteAsset: "USDT", name: "Litecoin",
    price: 82.15, priceChange24h: 0.45, high24h: 83.50, low24h: 81.00, volume24h: 400000000, marketCap: 6000000000,
    sparkline: generateSparkline(81.00, 82.15), status: 'TRADING', isNew: false, updatedAt: new Date().toISOString()
  },
  {
    id: "trx-usdt", symbol: "TRX/USDT", baseAsset: "TRX", quoteAsset: "USDT", name: "TRON",
    price: 0.124, priceChange24h: 2.10, high24h: 0.125, low24h: 0.120, volume24h: 280000000, marketCap: 10000000000,
    sparkline: generateSparkline(0.120, 0.124), status: 'TRADING', isNew: false, updatedAt: new Date().toISOString()
  },
  {
    id: "shib-usdt", symbol: "SHIB/USDT", baseAsset: "SHIB", quoteAsset: "USDT", name: "Shiba Inu",
    price: 0.0000284, priceChange24h: -3.40, high24h: 0.0000301, low24h: 0.0000275, volume24h: 850000000, marketCap: 16000000000,
    sparkline: generateSparkline(0.0000301, 0.0000284), status: 'TRADING', isNew: false, updatedAt: new Date().toISOString()
  },
  {
    id: "uni-usdt", symbol: "UNI/USDT", baseAsset: "UNI", quoteAsset: "USDT", name: "Uniswap",
    price: 11.20, priceChange24h: 4.50, high24h: 11.40, low24h: 10.50, volume24h: 320000000, marketCap: 6700000000,
    sparkline: generateSparkline(10.50, 11.20), status: 'TRADING', isNew: false, updatedAt: new Date().toISOString()
  },
  {
    id: "atom-usdt", symbol: "ATOM/USDT", baseAsset: "ATOM", quoteAsset: "USDT", name: "Cosmos",
    price: 10.85, priceChange24h: 1.25, high24h: 11.10, low24h: 10.60, volume24h: 150000000, marketCap: 4200000000,
    sparkline: generateSparkline(10.60, 10.85), status: 'TRADING', isNew: false, updatedAt: new Date().toISOString()
  },
  {
    id: "arb-usdt", symbol: "ARB/USDT", baseAsset: "ARB", quoteAsset: "USDT", name: "Arbitrum",
    price: 1.62, priceChange24h: 5.80, high24h: 1.65, low24h: 1.50, volume24h: 410000000, marketCap: 4300000000,
    sparkline: generateSparkline(1.50, 1.62), status: 'TRADING', isNew: true, updatedAt: new Date().toISOString()
  },
  {
    id: "op-usdt", symbol: "OP/USDT", baseAsset: "OP", quoteAsset: "USDT", name: "Optimism",
    price: 3.42, priceChange24h: -1.80, high24h: 3.55, low24h: 3.35, volume24h: 220000000, marketCap: 3500000000,
    sparkline: generateSparkline(3.55, 3.42), status: 'TRADING', isNew: true, updatedAt: new Date().toISOString()
  },
  {
    id: "btc-usdc", symbol: "BTC/USDC", baseAsset: "BTC", quoteAsset: "USDC", name: "Bitcoin",
    price: 104282.10, priceChange24h: 2.40, high24h: 105918.00, low24h: 101840.00, volume24h: 4200000000, marketCap: 2080000000000,
    sparkline: generateSparkline(101840.00, 104282.10), status: 'TRADING', isNew: false, updatedAt: new Date().toISOString()
  },
  {
    id: "eth-usdc", symbol: "ETH/USDC", baseAsset: "ETH", quoteAsset: "USDC", name: "Ethereum",
    price: 3841.80, priceChange24h: 1.82, high24h: 3948.50, low24h: 3749.00, volume24h: 1200000000, marketCap: 462000000000,
    sparkline: generateSparkline(3749.00, 3841.80), status: 'HALTED', isNew: false, updatedAt: new Date().toISOString()
  }
];

export class MockMarketDataProvider {
  
  static async getMarkets(
    filters?: { category?: string, search?: string },
    sort?: { field: keyof Market, direction: 'asc'|'desc' },
    pagination?: { page: number, pageSize: number }
  ): Promise<{ items: Market[], total: number, page: number, pageSize: number, hasNext: boolean }> {
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    let result = [...MOCK_MARKETS];

    // Filter by search
    if (filters?.search) {
      const query = filters.search.toLowerCase().trim();
      result = result.filter(m => 
        m.symbol.toLowerCase().includes(query) || 
        m.name.toLowerCase().includes(query) || 
        m.baseAsset.toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (filters?.category && filters.category !== 'All' && filters.category !== 'Favorites') {
      if (filters.category === 'New') {
        result = result.filter(m => m.isNew);
      } else {
        result = result.filter(m => m.quoteAsset === filters.category || m.baseAsset === filters.category);
      }
    }

    // Sorting
    if (sort) {
      result.sort((a, b) => {
        const valA = a[sort.field];
        const valB = b[sort.field];
        if (valA < valB) return sort.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sort.direction === 'asc' ? 1 : -1;
        return 0;
      });
    } else {
      // Default sort by volume desc
      result.sort((a, b) => b.volume24h - a.volume24h);
    }

    // Pagination
    const page = pagination?.page || 1;
    const pageSize = pagination?.pageSize || 20;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    
    const paginatedItems = result.slice(start, end);

    return {
      items: paginatedItems,
      total: result.length,
      page,
      pageSize,
      hasNext: end < result.length
    };
  }

  static async getTrending(): Promise<Market[]> {
    const res = await this.getMarkets(undefined, { field: 'volume24h', direction: 'desc' });
    return res.items.slice(0, 3);
  }

  static async getTopGainers(): Promise<Market[]> {
    const res = await this.getMarkets(undefined, { field: 'priceChange24h', direction: 'desc' });
    return res.items.slice(0, 3);
  }

  static async getTopLosers(): Promise<Market[]> {
    const res = await this.getMarkets(undefined, { field: 'priceChange24h', direction: 'asc' });
    return res.items.slice(0, 3);
  }

  static async getNewListings(): Promise<Market[]> {
    const res = await this.getMarkets({ category: 'New' });
    return res.items.slice(0, 3);
  }

  static async getMarketStats(): Promise<MarketStats> {
    return {
      totalMarkets: 104,
      volume24h: 2840000000000,
      btcDominance: 58.4,
      activeAssets: 56,
      status: '24/7'
    };
  }

  static async getTicker(symbol: string): Promise<Market | undefined> {
    const market = MOCK_MARKETS.find(m => m.id === symbol || m.symbol === symbol);
    return market;
  }

  static async getCandles(symbol: string, interval: string): Promise<any[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const market = await this.getTicker(symbol);
    const currentPrice = market ? market.price : 100000;
    
    const candles = [];
    let price = currentPrice * 0.95; // start lower
    const now = Date.now();
    
    for(let i = 100; i >= 0; i--) {
      const isUp = Math.random() > 0.5;
      const change = price * (Math.random() * 0.005);
      const open = price;
      const close = isUp ? price + change : price - change;
      const high = Math.max(open, close) + price * (Math.random() * 0.002);
      const low = Math.min(open, close) - price * (Math.random() * 0.002);
      
      candles.push({
        time: (now - (i * 15 * 60 * 1000)) / 1000, // 15m intervals unix
        open, high, low, close,
        volume: Math.random() * 100
      });
      price = close;
    }
    
    // Last candle is current price
    candles[candles.length - 1].close = currentPrice;
    
    return candles;
  }

  static async getOrderBook(symbol: string): Promise<any> {
    const market = await this.getTicker(symbol);
    const currentPrice = market ? market.price : 100000;
    
    const asks = [];
    const bids = [];
    let currentAsk = currentPrice * 1.0001;
    let currentBid = currentPrice * 0.9999;
    
    for(let i = 0; i < 20; i++) {
      const askAmount = Math.random() * 2 + 0.1;
      asks.push({ price: currentAsk, amount: askAmount, total: currentAsk * askAmount });
      currentAsk *= (1 + (Math.random() * 0.001));
      
      const bidAmount = Math.random() * 2 + 0.1;
      bids.push({ price: currentBid, amount: bidAmount, total: currentBid * bidAmount });
      currentBid *= (1 - (Math.random() * 0.001));
    }
    
    // Sort asks descending for UI
    return { asks: asks.reverse(), bids };
  }

  static async getRecentTrades(symbol: string): Promise<any[]> {
    const market = await this.getTicker(symbol);
    const currentPrice = market ? market.price : 100000;
    
    const trades = [];
    for(let i = 0; i < 30; i++) {
      trades.push({
        id: Math.random().toString(),
        price: currentPrice * (1 + (Math.random() * 0.002 - 0.001)),
        amount: Math.random() * 1.5 + 0.01,
        time: new Date(Date.now() - Math.random() * 600000).toLocaleTimeString(),
        isBuyerMaker: Math.random() > 0.5
      });
    }
    
    return trades.sort((a,b) => b.time.localeCompare(a.time));
  }
}
