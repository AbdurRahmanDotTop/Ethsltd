# PRD 19: P2P Trading API Integration

## 1. Overview
The P2P Trading module allows users to buy and sell crypto directly with each other via escrow. Currently, `apps/web/src/stores/p2p-store.ts` uses simulated data. This PRD outlines the backend API requirements to transition P2P Trading to the live D1 database.

## 2. Objectives
- Implement real backend endpoints for browsing P2P advertisements (Offers).
- Implement backend endpoints for creating and managing P2P Orders (Trades).
- Connect the frontend P2P views (`apps/web/src/app/(dashboard)/p2p/page.tsx` and related components) to the `apiClient`.
- Implement basic simulated Escrow locking mechanism when an order is created.
- Replace dummy store logic with API integration.

## 3. Database Schemas
We need to verify or create `database/schema/p2p.ts`:
- **`p2pAds`**: Table to store advertisements (type: BUY/SELL, asset, fiat, price, limits, paymentMethods, merchantId).
- **`p2pOrders`**: Table to store active trades (adId, buyerId, sellerId, amount, status).
- **`p2pMessages`**: (Optional/Phase 2) Real-time chat messages for specific orders.

## 4. API Endpoints

### P2P Router (`services/api/src/routes/p2p.ts`)
- **Ads**
  - `GET /api/v1/p2p/ads` - Fetch available advertisements (with filters for buy/sell, currency).
  - `POST /api/v1/p2p/ads` - Create a new ad (Merchant only).
- **Orders**
  - `GET /api/v1/p2p/orders` - Fetch user's active/past P2P orders.
  - `POST /api/v1/p2p/orders` - Initiate a P2P trade (Locks funds in escrow).
  - `POST /api/v1/p2p/orders/:id/pay` - Mark as paid (Buyer).
  - `POST /api/v1/p2p/orders/:id/release` - Release crypto from escrow (Seller).
  - `POST /api/v1/p2p/orders/:id/cancel` - Cancel order and unlock escrow.

## 5. Frontend Refactoring
- Deprecate `MockP2PProvider` and `useP2PStore` dummy state logic.
- Ensure `P2PTable`, `P2POrderModal`, and `P2PChat` connect to the live API endpoints.
- Map the backend payload (especially status enums) to match the UI expectations to avoid TypeScript errors.

## 6. Acceptance Criteria
- [ ] User can browse live P2P ads fetched from the D1 database.
- [ ] User can initiate a trade, transitioning it to `AWAITING_PAYMENT`.
- [ ] User can mark payment complete and the seller can release funds.
- [ ] Full end-to-end API communication without TypeScript type mismatches.
