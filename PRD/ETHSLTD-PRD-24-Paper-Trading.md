# ETHSLTD PRD 24: Demo Trading Strict Separation

## 1. Goal
Implement strict separation between "Real Trading" and "Demo Trading" across the entire platform. The user must have a clear understanding of which environment they are currently operating in, and all financial data (wallets, transactions, orders, trades) must be distinctly segregated at both the database and UI levels.

## 2. Requirements

### 2.1 Database Schema Updates
- **`wallets` Table**: Add a `type` column with `enum(['REAL', 'DEMO'])`. Default to `'REAL'`.
- **`wallet_transactions` Table**: Add a `type` column or reuse `mode` (e.g., `enum(['REAL', 'DEMO'])`).
- **`orders` Table**: Add a `mode` column with `enum(['REAL', 'DEMO'])`.
- **`trades` Table**: Add a `mode` column with `enum(['REAL', 'DEMO'])`.

### 2.2 Global Trading Mode State (Frontend)
- Implement a global Zustand store: `useTradingModeStore` to hold `mode: 'REAL' | 'DEMO'`.
- Persist this mode in `localStorage` so the user stays in the same mode upon refresh.
- Add a prominent, highly visible toggle switch in the main navigation header (Header.tsx) to switch between Real and Demo mode. 
- When switched, the UI colors or a prominent banner should gently remind the user they are in "Demo Trading" mode (e.g., using a distinct accent color or label).

### 2.3 API Modifications
- **Wallets API (`/api/v1/wallets`)**:
  - All fetching (balances, portfolio, transactions) must accept a `?mode=REAL|DEMO` query parameter.
  - Deposits/Withdrawals must accept a `mode` in the body.
- **Trading API (`/api/v1/trading/orders`)**:
  - Creating orders must accept a `mode` parameter.
  - Fetching orders must accept a `?mode=REAL|DEMO` query parameter.
  - Order execution (matching engine) must only match `DEMO` with `DEMO` and `REAL` with `REAL`. Since we are using mock execution against market price, we just need to ensure the order is marked correctly and affects the correct wallet.

### 2.4 UI Updates
- **Wallet Page**: Display clearly whether viewing "Real Balance" or "Demo Balance" based on the global toggle.
- **Trade Page**: The order form should submit orders with the correct mode. Open orders list should only show orders matching the current mode.
- **Dashboard/Account**: Show wallet overview based on the active mode.

## 3. Demo Trading Initialization
- When a user signs up, or if a user switches to Demo Mode and doesn't have a demo wallet, the system should automatically create a Demo Wallet with a predefined simulated balance (e.g., 100,000 Demo USDT) to let them start testing immediately.

## 4. Risks & Considerations
- **Data Leakage**: Ensure the backend API correctly enforces the `mode` parameter so a user cannot accidentally spend real balance on a demo trade.
- **UI Clarity**: The UI must unambiguously communicate the current mode to prevent user panic or confusion.
