# Product Requirements Document (PRD)
## Deep Analysis & Implementation Plan: Trading System & Persistent Sessions

### Overview
This document outlines the requirements and architectural analysis to build a production-ready Trading System and Global Persistent Session architecture. It directly addresses the need to separate "Real" and "Demo" data entirely, eliminate all mock/demo frontend states, and implement resilient persistent authentication.

---

## 1. Deep Analysis of Trading Features

We are building a robust spot trading engine capable of rivaling industry standards (e.g., Binance, Coinbase Pro, OANDA).

### 1.1 Trading Modes (Real vs. Demo)
- **Strict Separation**: The `mode` flag (`REAL` | `DEMO`) must dictate all logic. Real mode interacts *only* with REAL wallets and orders. Demo mode interacts *only* with DEMO wallets and orders.
- **Backend Enforcement**: API endpoints will use `X-Trading-Mode` headers (or session state) to rigidly partition data. Cross-contamination (e.g., fulfilling a DEMO order with a REAL order) is strictly prohibited.

### 1.2 Order Types & Execution
- **Market Orders**: Executes immediately against available liquidity in the order book. Handles partial fills up to the requested quantity/amount. Rejects if liquidity is insufficient.
- **Limit Orders**: Placed on the order book. Matches when the market price meets the limit criteria.
- **Advanced Orders (Future phases / Scope Check)**: Stop Orders, Stop-Limit, Take-Profit, OCO (One-Cancels-the-Other), Trailing Stop. (Our architecture must support extending to these statuses).
- **Time In Force**: Support GTC (Good-Til-Cancelled), IOC (Immediate-Or-Cancel), FOK (Fill-Or-Kill), Post-Only.

### 1.3 Matching Engine Workflow
1. **Order Submission**: Validate balances (available vs. locked).
2. **Locking Balances**: Deduct required funds from the `available` balance and add to the `locked` balance.
3. **Matching**:
   - Buy Orders look for overlapping Asks.
   - Sell Orders look for overlapping Bids.
4. **Execution / Settlement**:
   - Create Trade records.
   - Un-lock balances and credit the received asset minus fees.
   - Deduct fees based on Maker/Taker rates.
   - Adjust wallet totals safely inside database transactions to prevent race conditions.

### 1.4 Market Data & Order Book
- **Bid/Ask Spread**: Accurately aggregated from the real database of active Limit Orders.
- **Last Traded Price**: Driven by *actual trades* executed by the matching engine.
- **External Liquidity Fallback**: If using Binance/KuCoin as a liquidity provider, we must implement proper market-making bots to proxy liquidity into our local order book, rather than sending fake mock prices to the frontend.

### 1.5 Fees & Limits
- **Calculation**: Strict mathematical calculation of Trading Fees (Maker/Taker) utilizing fixed-point precision (string-based decimal libraries) to avoid floating-point errors.
- **Validation**: Enforce minimum/maximum order limits, tick sizes, and step sizes per trading pair.

---

## 2. Deep Session Investigation & Architecture

### 2.1 Current Issue Diagnosis
- The application currently relies heavily on `localStorage` and `zustand` persistence for frontend state, while the backend issues a JWT token.
- **Next.js SSR Problem**: When a user hard-refreshes a page, the Next.js Server-Side Rendering (SSR) environment *cannot* access `localStorage`. Therefore, the server renders the page as unauthenticated. Hydration mismatches or middleware checks then forcibly log the user out.
- **Inertia/Next.js Navigation**: Misconfigured state hydration resets the authenticated user.

### 2.2 Production-Ready Architecture (HTTP-Only Secure Cookies)
1. **Login Flow**:
   - Client sends credentials. Backend validates.
   - Backend creates a robust Session in the `sessions` DB table.
   - Backend issues an **HTTP-Only, Secure, SameSite=Lax** Cookie containing a Session ID (or signed JWT).
2. **State Hydration (Next.js)**:
   - On every request, Next.js server components and middleware read the HTTP-Only cookie, validating it against the database (or verifying the JWT signature).
   - If valid, the server injects the authenticated `user` object directly into the initial SSR HTML state.
   - The frontend (`auth-store.ts`) initializes using this server-provided state, *never* relying on `localStorage`.
3. **Persistent Behavior**:
   - Refreshing preserves login (Cookie is sent automatically).
   - Multi-tab support inherently works.
   - Closing the browser preserves login until the cookie expires.

### 2.3 Security Measures
- CSRF Protection mechanism.
- Session invalidation on Logout (both database delete and cookie clear).
- Role-based access validation handled on the backend middleware, protecting routes.

---

## 3. Implementation Plan & Scope

### Step 1: Authentication Overhaul (Foundation)
- Refactor `services/api/src/routes/auth.ts` to set HTTP-Only Cookies.
- Implement API Gateway/Middleware to read the cookie instead of the `Authorization` header.
- Update Next.js frontend (`api-client` and SSR layout) to rely on Cookies and server-side state hydration.

### Step 2: Spot Trading Matching Engine
- Refactor `services/api/src/routes/trading.ts` to ensure NO mock prices or mock trades exist for actual user order placements.
- Implement an atomic matching engine using Drizzle ORM transactions.
- Implement Maker/Taker fee logic and balance locking flows.

### Step 3: Trading UI Integration
- Bind the real order book logic to the frontend `TradingHistoryTabs.tsx`, `OrderBook.tsx`, and `OrderEntry.tsx`.
- Guarantee real-time UI synchronization using WebSockets or robust polling intervals without degrading user session state.
