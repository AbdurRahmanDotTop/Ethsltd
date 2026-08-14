# ETHSLTD PRD 26: Real & Demo Mode Isolation

## 1. Overview
The ETHSLTD platform supports two main trading modes: **Real Trading** and **Demo Trading**. While the backend API has been updated to accept the `X-Trading-Mode` header and isolate data (P2P ads, wallets, orders) properly in the database, the frontend applications currently suffer from reactivity issues. When a user toggles the mode in the navigation bar, or creates new data (like posting a new P2P ad), the pages do not always dynamically refetch the data to reflect the new state or the newly created assets.

This PRD outlines the requirements for enforcing strict frontend reactivity and data isolation for the Real and Demo modes across the entire project.

## 2. Objectives
- Ensure that toggling between Real and Demo mode instantly updates the data on all visible pages without requiring a manual browser refresh.
- Ensure that creating new data (e.g., posting a P2P ad, creating an order) correctly updates the UI when navigating back to the list views.
- Audit all pages and components that fetch data and ensure they are subscribed to the `mode` state from `useTradingModeStore`.

## 3. Scope of Work

### 3.1. P2P Marketplace
- **My Ads (`/p2p/my-ads`)**: Must refetch ads immediately when `mode` changes.
- **Post Ad (`/p2p/post-ad`)**: After posting an ad, the redirect to `/p2p/my-ads` must trigger a fresh data fetch so the user sees their newly created ad immediately.
- **P2P Main Page (`/p2p`)**: Must refetch the ads list when `mode` changes.
- **P2P Table Component (`P2PTable.tsx`)**: Must react to `mode` changes, not just `query` changes.

### 3.2. Trading & Markets
- **Trading Terminal (`TradingTerminal.tsx`)**: Order books, market trades, and user balances must refresh when `mode` changes.
- **Trading History (`TradingHistoryTabs.tsx`)**: Open orders and trade history must swap to the respective mode's data immediately upon toggle.
- **Order Entry (`OrderEntry.tsx`)**: Available balances for buying/selling must update when `mode` changes.

### 3.3. Wallet & Funds
- **Wallet Overview (`/wallet`)**: Currently handles mode changes correctly via store subscriptions, but needs to be verified.
- **Withdraw Form (`WithdrawForm.tsx`)**: Must fetch the correct mode's balances.

## 4. Technical Requirements
- Utilize `useTradingModeStore(state => state.mode)` in all data-fetching components.
- Add `mode` to the `useEffect` dependency arrays where `apiClient` is called.
- In Next.js client components, when redirecting after mutations (like `createP2pAd`), use techniques like `router.refresh()` or force a re-fetch to clear stale cache.

## 5. Acceptance Criteria
- [ ] User posts a P2P ad -> Redirects to My Ads -> The new ad is instantly visible.
- [ ] User toggles Demo mode -> P2P Marketplace instantly updates to show only Demo ads.
- [ ] User toggles Demo mode -> Trade history and open orders instantly update.
- [ ] User toggles Demo mode -> Wallet balances and order entry available balances instantly update.
