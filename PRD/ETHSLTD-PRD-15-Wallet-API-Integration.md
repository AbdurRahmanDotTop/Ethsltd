# PRD 15: Wallet & Portfolio API Integration

## 1. Overview
This PRD outlines the integration of the Wallet & Portfolio section of the ETHSLTD platform with the Cloudflare D1 backend. We will transition from mock local data stores to live database interactions, handling deposits, withdrawals, and transaction history tracking.

## 2. Objectives
- Ensure that the user's wallet balances dynamically reflect the live D1 `wallets` table.
- Create backend endpoints for managing deposits and withdrawals.
- Record all balance changes in a `transactions` ledger table.
- Update the Frontend Wallet UI to securely fetch data via the API client.

## 3. Scope of Work

### Phase 1: Backend Endpoints (Hono + D1)
1. **GET `/api/v1/wallet/balances`**
   - Retrieve current available and locked balances for the user.
2. **GET `/api/v1/wallet/transactions`**
   - Fetch the user's transaction history (deposits, withdrawals, trades, P2P transfers).
3. **POST `/api/v1/wallet/deposit`** (Simulated for Demo)
   - Add a simulated fiat/crypto deposit to the user's wallet.
   - Insert a record into the `transactions` table.
4. **POST `/api/v1/wallet/withdraw`**
   - Process a withdrawal request (deduct balance, add transaction record).
   - Ensure the user has sufficient available balance before deduction.

### Phase 2: Database Layer
- Ensure `transactions` table exists to record all deposits, withdrawals, and transfers with type, amount, status, and timestamps.
- Validate balance constraints during withdrawal.

### Phase 3: API Client Updates
- Add methods to `@ethsltd/api-client`:
  - `getBalances()`
  - `getTransactions()`
  - `requestDeposit(asset, amount, network)`
  - `requestWithdrawal(asset, amount, address, network)`

### Phase 4: Frontend UI Updates
- Replace `useWalletStore`'s mock state with real API calls using React `useEffect` or SWR/React Query.
- Refactor the Wallet Dashboard (`apps/web/src/app/wallet/page.tsx`).
- Refactor Deposit/Withdraw Modals to trigger API requests and handle loading states/errors.

## 4. Acceptance Criteria
- [ ] Wallet balances correctly load from the backend upon login.
- [ ] Simulated deposits immediately reflect in the backend `wallets` table and the UI.
- [ ] Withdrawals properly validate balances and deduct amounts.
- [ ] The transaction history page displays real data fetched from the API.
- [ ] All code is type-checked and successfully pushed to GitHub.

## 5. Security & Constraints
- Implement strict JWT authentication on all `/wallet` endpoints.
- Execute balance updates inside atomic SQL transactions where possible to prevent race conditions during withdrawals.
- Ensure all monetary values are stored as Strings in the DB to maintain precision.
