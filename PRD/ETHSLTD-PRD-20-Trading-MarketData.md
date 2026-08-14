# PRD 20: Trading Engine - Market Data API Integration

## Background
The Spot Trading Terminal in the `Ethsltd` frontend currently relies on a `MockMarketDataProvider` to supply market data (e.g. candlestick charts, order books, and recent trades). We need to replace this with a live integration using `apiClient` to fetch real data from our backend so that users see accurate and up-to-date market information.

## Objectives
1. Integrate the real API endpoints into the Trading UI, specifically for Market Data.
2. Remove dependencies on `MockMarketDataProvider` across the Trading UI components (`TradingTerminal.tsx`, `MarketSelector.tsx`, `RecentTrades.tsx`, `OrderBook.tsx`).
3. Ensure the chart library (`TradingView Lightweight Charts`) receives the correctly formatted live data from the backend.

## Scope of Work

### Phase 1: API Client Verification & Updates (`packages/api-client`)
- Verify that `apiClient` has the necessary methods to fetch:
  - Tickers / Market Data Summary
  - Candlesticks / K-Lines (`GET /trading/markets/:symbol/candles`)
  - Order Book (`GET /trading/markets/:symbol/orderbook`)
  - Recent Trades (`GET /trading/markets/:symbol/trades`)
- If they do not exist, add these methods.

### Phase 2: Trading Store Refactoring (`apps/web/src/stores`)
- Refactor the `trading-ui-store.ts` (or create a new `market-data-store.ts`) to manage live data fetching.
- Ensure the state structure matches the data provided by the API.
- Set up interval polling (e.g., every 5s) for live updates until WebSockets are available in a future iteration.

### Phase 3: UI Component Integration (`apps/web/src/components/trading`)
- **`MarketSelector.tsx`**: Replace `MockMarketDataProvider.getMarkets` with `apiClient` to list available pairs.
- **`TradingTerminal.tsx`**: Remove the `MockMarketDataProvider.getTicker`, `.getCandles`, `.getOrderBook`, and `.getRecentTrades` calls. Replace them with API calls.
- **`RecentTrades.tsx`**: Feed live API data into the trades list.
- **`OrderBook.tsx`**: Display the live depth data coming from the backend.

### Phase 4: Clean up
- Completely remove `MockMarketDataProvider` and associated mock data files from the codebase.
- Verify everything builds using `tsc`.

## Out of Scope
- Implementing WebSockets for Market Data (we will use HTTP polling as MVP).
- P2P Trading (already completed).
