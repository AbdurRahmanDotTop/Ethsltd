# Product Requirements Document: P2P Marketplace API Integration

## 1. Overview
This PRD outlines the migration of the P2P Marketplace from the mock simulated environment to the Cloudflare D1 Backend via Hono.js.

## 2. Scope
- **Backend API Routes (`services/api/src/routes/p2p.ts`)**:
  - `GET /api/v1/p2p/ads`: Fetch all active P2P ads (supports filtering by type, asset, fiat).
  - `POST /api/v1/p2p/ads`: Create a new P2P ad (Requires user to have funds to lock if it's a SELL ad).
  - `GET /api/v1/p2p/orders`: Fetch user's active/past P2P orders.
  - `POST /api/v1/p2p/orders`: Initiate a P2P trade against an ad (Locks funds from ad creator or taker depending on ad type).
  - `POST /api/v1/p2p/orders/:id/pay`: Buyer marks the order as PAID.
  - `POST /api/v1/p2p/orders/:id/release`: Seller releases the crypto to the Buyer.
  - `POST /api/v1/p2p/orders/:id/cancel`: Cancel the order (Releases locked crypto).
- **Frontend Integration**:
  - Deprecate `useP2PStore` and replace its methods with live `apiClient` calls.
  - Connect UI buttons (Buy/Sell, Paid, Release, Cancel) to corresponding API methods.
- **Database Schema**:
  - Utilize existing `p2p_ads`, `p2p_orders`, and `p2p_messages` tables.
  - Strict tracking of locked and available balances across the `wallets` table to ensure escrow safety.

## 3. Escrow & Wallet Integration
- **SELL Ad Creation**: If a user creates an ad to SELL crypto, their crypto is immediately locked in `wallets.lockedBalance`.
- **BUY Ad Creation**: If a user creates a BUY ad, no crypto is locked from them (since they are paying fiat). However, when someone initiates a trade against their BUY ad, the taker's crypto is locked.
- **Order Flow**: 
  1. `PENDING`: Crypto is held in escrow.
  2. `PAID`: Buyer indicates fiat transfer is complete. Crypto remains in escrow.
  3. `RELEASED`: Seller confirms fiat receipt. Crypto is moved from escrow to Buyer's wallet.
  4. `CANCELLED`: Crypto is returned from escrow back to the Seller's available balance.

## 4. Success Metrics
- A user can create a P2P ad which locks their balance.
- Another user can take the ad, creating a `PENDING` order.
- The order can transition from `PENDING` -> `PAID` -> `RELEASED`, successfully transferring the escrowed crypto balance to the buyer.
- Complete removal of `useP2PStore` from the frontend.
