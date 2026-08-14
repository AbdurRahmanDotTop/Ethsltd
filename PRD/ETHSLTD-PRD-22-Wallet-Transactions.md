# PRD 22: Wallet & Transactions API (Deposits / Withdrawals)

## Overview
This PRD outlines the implementation of the Wallet & Transactions API for ETHSLTD. The module enables users to simulate deposits and withdrawals of crypto and fiat assets. Since ETHSLTD is currently an MVP, no real blockchain integrations or fiat payment gateways (Stripe/PayPal) are connected yet. The focus is on providing a realistic UI and DB persistence for testing.

## Scope
1. **Backend Routes (`services/api/src/routes/wallets.ts`)**:
   - `POST /wallets/deposit`: Simulates an incoming deposit. Increases `balance` and creates a `walletTransactions` record with `status = 'COMPLETED'`.
   - `POST /wallets/withdraw`: Simulates an outgoing withdrawal. Deducts from `balance`, calculates `fee`, and creates a `walletTransactions` record with `status = 'COMPLETED'` (or `PROCESSING` if simulating delay).
2. **Database Integrity**:
   - Ensure the `wallet_transactions` table records all details (network, address, fee, amount).
3. **Frontend SDK (`packages/api-client/src/index.ts`)**:
   - Wire `deposit(data)` and `withdraw(data)`.
4. **UI Integration (`apps/web/src/components/wallet/...`)**:
   - `DepositModal.tsx`: Connect form to `apiClient.deposit()`.
   - `WithdrawModal.tsx`: Connect form to `apiClient.withdraw()`.
   - `WalletTransactions.tsx` / `Portfolio.tsx`: Ensure it fetches real history.

## Constraints
- "USD-first" rule: The platform defaults to USD for fiat pairs and representations.
- All withdrawals require sufficient `available` balance (ignoring `lockedBalance`).
