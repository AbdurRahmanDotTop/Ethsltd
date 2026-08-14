# Product Requirement Document (PRD): Real vs Paper Trading Isolation

## 1. Objective
To completely separate Real Trading and Paper Trading environments across the entire ETHSLTD platform. The goal is to ensure that users, administrators, and the system backend clearly distinguish between the two modes. Real funds and mock funds must never mix, and the UI must consistently reflect the active mode.

## 2. Background
Currently, the platform has a frontend toggle for Real/Paper trading. However, this toggle is not fully functional, does not persist across the backend API, and does not display on mobile devices. The database schema supports a `mode` column (`REAL` | `PAPER`), but the API routes ignore it, leading to mixed data.

## 3. Scope
- **Frontend UI/UX**:
  - Fix the toggle button to be visible and fully functional on mobile interfaces.
  - Implement a persistent visual indicator (e.g., banner, color tint, or watermark) when the user is in "PAPER TRADING" mode to prevent confusion.
  - Automatically refetch all relevant user data (wallet balances, order history, active trades) when the mode is toggled.
- **Frontend API Client**:
  - Update the `@ethsltd/api-client` to accept and send the active trading mode with every authenticated request (e.g., via an `X-Trading-Mode` HTTP header).
- **P2P Demo Banner Visibility**:
  - Ensure the "P2P Demo Mode" banner only appears if the user has explicitly turned on the Paper Trading toggle (`mode === 'PAPER'`). It should remain hidden in Real Trading mode.
- **Paper Trading Auto-Funding**:
  - Upon user signup (registration), automatically seed their "PAPER" wallet with demo funds (e.g. 100,000 USDT, 10 BTC, 100 ETH) so they can immediately test trading strategies risk-free.
- **Backend API (`services/api`)**:
  - Update all Wallet endpoints (balances, deposits, withdrawals, history) to filter and mutate data based on the requested `mode`.
  - Update all Trading endpoints (order creation, order history, active trades) to respect the `mode`.
  - Ensure Admin endpoints allow filtering user data by `mode` so Super Admins can audit Real and Paper activities separately.
- **Database**:
  - Leverage the existing `mode` column in `wallets`, `wallet_transactions`, `orders`, and `trades` tables.

## 4. User Stories
1. **As a Trader**, I want to switch between Real and Paper trading on both my desktop and mobile devices seamlessly.
2. **As a Trader**, I want my Paper trading wallet and my Real trading wallet to have completely separate balances.
3. **As a Trader**, I want to clearly see a visual warning when I am in Paper trading mode so I don't accidentally mistake it for real trading.
4. **As an Admin**, I want to view platform statistics and user activities separated by Real and Paper modes to accurately track real revenue and simulated volume.

## 5. Technical Approach
1. **Header**: Send `X-Trading-Mode: PAPER` or `REAL` in the API client headers.
2. **Backend Context**: Add middleware in Hono to extract the mode from the header and attach it to the request context.
3. **Query Scoping**: Add `and(eq(table.userId, user.id), eq(table.mode, currentMode))` to all relevant SQL queries in `drizzle`.
4. **Mobile Navigation**: Move the toggle out of the desktop-only `div` in the `Header.tsx` and place it in the global mobile top-bar or the mobile sidebar.
5. **UI Invalidation**: Use React Query `queryClient.invalidateQueries()` or React state resets when the `useTradingModeStore` value changes.

## 6. Success Metrics
- 0 incidents of Paper trades executing against Real wallets.
- Toggle functions flawlessly on screen sizes < 1024px (Mobile).
- Admin dashboard correctly filters volume/orders by mode.
