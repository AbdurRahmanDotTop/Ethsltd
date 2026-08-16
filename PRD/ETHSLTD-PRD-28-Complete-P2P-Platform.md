# ETHSLTD P2P Platform Product Requirements Document (PRD)

## 1. Overview
The goal is to build a complete, production-ready Peer-to-Peer (P2P) cryptocurrency trading platform for ETHSLTD. This platform will rival industry leaders (like Binance P2P) in functionality, providing a secure, seamless, and reliable marketplace for buying and selling digital assets using fiat currencies.

This PRD outlines the end-to-end business logic, database modifications, escrow, dispute resolution, and UI requirements.

## 2. Core Components

### 2.1 P2P Marketplace (Express & Standard)
- **Standard P2P**: Users can browse buy/sell advertisements, filter by asset, fiat, payment method, and amount.
- **Express P2P**: A streamlined flow where the system automatically matches the user with the best available ad based on price, liquidity, and reliability.
- **Asset/Fiat Support**: Configurable support for multiple crypto assets (USDT, BTC, ETH) and fiat currencies (INR, USD, etc.).

### 2.2 Advertisement System
- Merchants and verified users can post "Buy" or "Sell" ads.
- **Ad Configuration**: Fixed or floating pricing, margins, min/max limits, supported payment methods, payment window, counterparty requirements, and auto-reply messages.
- **Inventory Management**: Sell ads will automatically reserve/lock the required crypto balance to prevent double-spending.

### 2.3 Order Lifecycle & Escrow
- **Escrow**: For every trade, the seller's crypto is locked in escrow. This is strictly separated from available balances and tracked on the double-entry ledger.
- **State Machine**:
  - `CREATED`
  - `PAYMENT_PENDING`
  - `BUYER_MARKED_PAID`
  - `SELLER_PAYMENT_REVIEW`
  - `COMPLETED` (Escrow released to buyer)
  - `CANCELLED` / `EXPIRED` (Escrow refunded to seller)
  - `DISPUTED` (Escrow frozen)

### 2.4 User Reputation & Merchant System
- **Profiles**: Display verified status, merchant badge, completion rate, order count, feedback percentages, and average release/payment times.
- **Merchant Rules**: Specific application process, volume limits, and special badges.

### 2.5 Dispute & Appeal System
- Users can open disputes (e.g., payment sent but crypto not released, or payment claimed but not received).
- Admins can review evidence, chat history, and manually resolve the trade (release to buyer or refund to seller).

### 2.6 Trade Room & Chat
- Real-time WebSockets-powered trade room.
- Real-time chat with attachment support, system messages (payment confirmed, etc.), and moderation flags.

## 3. Database Schema Upgrades

### `wallets`
- Add `escrow_balance` to explicitly separate P2P escrow from `locked_balance` (which might be used for spot trading).

### `p2p_ads`
- Add: `price_margin`, `is_floating`, `payment_window`, `auto_reply`, `country_restrictions`.

### `p2p_orders`
- Expand status enum: `['CREATED', 'PAYMENT_PENDING', 'BUYER_MARKED_PAID', 'SELLER_PAYMENT_REVIEW', 'COMPLETED', 'CANCELLED', 'EXPIRED', 'DISPUTED']`.

### `p2p_disputes` (New Table)
- Track dispute reason, evidence URLs, assigned admin, and resolution outcome.

### `p2p_payment_methods` (New Table)
- Reusable payment methods for users (e.g., UPI, Bank Transfer) as structured data.

### `p2p_feedback` (New Table)
- Track positive/negative feedback and comments per order.

### `users`
- Add P2P stats: `is_merchant`, `p2p_completion_rate`, `p2p_total_orders`, `p2p_positive_feedback`, etc. (or use a separate `user_p2p_profiles` table).

## 4. Wallet & Ledger Integration
Every P2P operation MUST create immutable ledger entries.
- **Escrow Creation**: Debit Seller Available, Credit Seller Escrow.
- **Trade Completion**: Debit Seller Escrow, Credit Buyer Available.
- **Trade Cancelled**: Debit Seller Escrow, Credit Seller Available.

## 5. Security & Anti-Scam
- Server-side state machine validation.
- Idempotency for critical payment/release actions.
- Warn users about external links and communicating outside the platform.

## 6. Super Admin Controls & Platform Management
The Super Admin must have **full control over the entire platform** from a central dashboard. No important platform functionality should be outside the Super Admin's control.
- **User & Wallet Management**: Super Admins can view and manually adjust any user's wallet balances (available, locked, escrow) to resolve edge cases or correct errors, with all changes logged to the immutable ledger.
- **P2P Activity & Trade Moderation**: Ability to monitor, freeze, cancel, or manually resolve any P2P order or dispute.
- **Configuration Management**: Centralized control over adding, editing, or disabling supported fiat currencies, crypto assets, and platform-wide payment methods.
- **Security & Permissions**: Control user status (suspend, ban, verify merchant status), manage global risk settings (trade velocity limits, rate limits), and configure admin RBAC (Role-Based Access Control) permissions.

## 7. Implementation Plan Next Steps
1. Apply database schema changes using Drizzle.
2. Develop core P2P services (Ads, Orders, Escrow, Disputes).
3. Develop API endpoints (tRPC / Hono).
4. Implement UI based on reference screenshots but using ETHSLTD design system.
5. Write Playwright E2E tests for the full lifecycle.
