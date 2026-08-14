# PRD: Demo Trading Feature

## 1. Overview
The platform's current "Demo Trading" feature will be rebranded and expanded into a comprehensive "Demo Trading" feature. The primary objective is to separate "Real Trading" and "Demo Trading" entirely across all modules, including Normal (Spot) Trading, P2P Trading, Wallet Balances, Orders, and Transaction History. This ensures a fully isolated, risk-free environment for users to practice every feature on the platform.

## 2. Terminology Changes
- "Demo Trading" -> "Demo Trading"
- "Demo Wallet" -> "Demo Wallet"
- Internal variables (e.g., `DEMO`) -> `DEMO`
- URLs (e.g., `/learn/demo-trading`) -> `/learn/demo-trading`

## 3. Data Isolation Requirements
To achieve complete separation between Real and Demo environments:
1. **API Client (`X-Trading-Mode`)**: The `mode` header will now send `DEMO` instead of `DEMO`. The backend logic will handle isolated databases/namespaces for Demo transactions.
2. **P2P Marketplace**:
   - The UI currently uses static mock data (`mock-data.ts`) for P2P.
   - P2P mock data must be logically separated (e.g., `MOCK_P2P_ADS_REAL` vs `MOCK_P2P_ADS_DEMO`), or the components must use `mode` to fetch different mock states, ensuring that placing a Demo order does not affect the Real P2P mock state.
3. **Wallet & Balances**:
   - The user will have a distinct "Demo Wallet" with virtual funds.
   - "Top Up Demo Balance" will only impact the Demo Wallet.
4. **Trading Terminal**:
   - Order history and active orders must filter strictly by mode.

## 4. UI/UX Updates
- **Global Header**: The mode toggle will switch between "Real" and "Demo". The active state banner will read `⚠️ YOU ARE IN DEMO TRADING MODE — NO REAL FUNDS AT RISK ⚠️`.
- **Badges**: All "DEMO TRADING" badges will update to "DEMO TRADING".
- **Learn Section**: All educational content referencing Demo Trading will be updated to Demo Trading.

## 5. Technical Scope
- `apps/web/src/stores/trading-mode-store.ts`: Update type `TradingMode = 'REAL' | 'DEMO'`.
- `packages/api-client/src/index.ts`: Update `setMode(mode: 'REAL' | 'DEMO')`.
- Global search and replace in UI components (Header, Footer, Hero, Forms, Pages).
- P2P Mock Data Separation: Refactor P2P state to respect the current Trading Mode.
