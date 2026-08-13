# Product Requirements Document: Trading API Integration

## 1. Overview
This PRD outlines the migration of the Trading Engine (Markets & Orders) from the mock simulated environment to the real Cloudflare D1 Backend via Hono.js.

## 2. Scope
- **Backend API Routes**: Implement robust endpoints in `services/api/src/routes/trading.ts`.
  - `GET /api/v1/trading/markets`: Fetch all active trading pairs.
  - `GET /api/v1/trading/orders`: Fetch user's open and past orders.
  - `GET /api/v1/trading/trades`: Fetch user's execution history.
  - `POST /api/v1/trading/orders`: Submit a new Market or Limit order.
  - `DELETE /api/v1/trading/orders/:id`: Cancel an open order.
- **Frontend Integration**:
  - Deprecate mock implementations in `useOrderBookStore` and `useTradeStore`.
  - Update `@ethsltd/api-client` to connect `createOrder`, `cancelOrder`, `getOrders`, and `getTrades` to the live API endpoints.
- **Database Schema**:
  - Utilize existing `markets`, `orders`, and `trades` tables in `database/schema/trading.ts`.
  - Ensure balances are checked and locked when an order is placed, and deducted when filled.

## 3. Order Execution Logic (Simplified for MVP)
Since this is an MVP without a separate high-frequency matching engine:
1. **Market Orders**: Fill instantly against mock liquidity (or auto-match at current market price). Deduct quote/base asset immediately.
2. **Limit Orders**: Save as `OPEN` in the database. (Future cron job or matching loop will process these).

## 4. Wallet Integration
- Placing a BUY order must lock USD (Quote Asset).
- Placing a SELL order must lock BTC/ETH/SOL (Base Asset).
- When filled or cancelled, locks are released and available balances are updated.

## 5. Success Metrics
- User can place a Market order and instantly see their Wallet balance update.
- Order history is successfully persisted in the D1 Database.
- No `setTimeout` mocks remain in the trading flow.
