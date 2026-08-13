# Product Requirements Document: API Integration & Mock Data Removal

## 1. Overview
The current ETHSLTD frontend relies on mock data and fake timers to simulate user interactions (authentication, wallet balances, trading, and P2P transactions). Now that the Hono API backend and D1 database are live and deployed on Cloudflare Workers, we must replace all simulated data with real-time API integrations.

## 2. Objectives
- Ensure all frontend interactions read from and write to the live `ethsltd_db` database via the `ethsltd-api` Cloudflare Worker.
- Deprecate and remove all `mock-provider.ts` scripts in the `apps/web` workspace.
- Enhance the `@ethsltd/api-client` package to handle authentication tokens, sessions, and standardized error responses.
- Implement robust state management in the frontend (via Zustand and React Query) to cache and manage real API responses.

## 3. Scope
The following modules must be migrated from Mock to Real API:
- **Authentication**: Registration, Login, Session Persistence, Logout.
- **Wallet**: Fetching balances, Deposit requests, Withdrawal requests, Transaction History.
- **Trading**: Submitting market/limit orders, fetching order books, fetching user trades.
- **P2P**: Creating offers, fetching P2P listings, managing dispute states.

## 4. Technical Architecture
- **API Client**: `packages/api-client/src/index.ts` will be upgraded to use a unified fetch wrapper that injects Authorization headers automatically.
- **Environment Variables**: The frontend will use `NEXT_PUBLIC_API_URL` (pointing to `http://localhost:8787` locally or the live Cloudflare Worker URL in production).
- **State Management**: Existing Zustand stores (`auth-store.ts`, etc.) will be refactored to fetch data using the updated `apiClient`.

## 5. Security & Error Handling
- JWT tokens (or secure HttpOnly cookies) must be properly handled.
- API errors (400, 401, 500) must be gracefully caught and displayed to the user using UI toast notifications.
- Loading states must be integrated to replace the fake `setTimeout` delays.

## 6. Success Metrics
- 0 instances of `mock-provider.ts` remaining in the codebase.
- User can successfully register, log in, and view a zero-balance wallet originating directly from the D1 database.
- Trade submissions properly record in the database instead of local memory.
