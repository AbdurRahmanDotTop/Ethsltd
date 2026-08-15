# ETHSLTD Platform - Complete Documentation

This is the living, comprehensive documentation for the **ETHSLTD** platform. It serves as the single source of truth for developers, administrators, stakeholders, and future team members to understand the platform's architecture, features, business logic, and future roadmap.

---

## 1. Project Overview

*   **Project Name:** ETHSLTD
*   **Platform Type:** Digital Asset Trading Platform & Cryptocurrency Exchange.
*   **Website & Mobile Apps Purpose:** To provide a seamless, secure, and intuitive interface for users to trade digital assets, participate in P2P marketplaces, and manage their crypto portfolios.
*   **Main Objective:** To build a robust, scalable, and highly secure cryptocurrency trading platform with institutional-grade ledger accuracy and advanced trading capabilities.
*   **Business Purpose:** Revenue generation through trading fees, withdrawal fees, P2P merchant fees, and premium institutional services.
*   **Target Users:** Retail crypto traders, P2P merchants, high-net-worth individuals, and institutional investors.
*   **Problems Solved:** Fragmented liquidity, unreliable payment gateways, poor UI/UX in existing exchanges, lack of demo trading environments seamlessly integrated alongside real trading, and complex P2P dispute resolutions.
*   **User Capabilities:** Users can register, complete KYC, deposit fiat/crypto, trade on spot markets, use P2P for local currency on-ramping/off-ramping, sign legal contracts, and practice in a completely risk-free Demo environment.
*   **Admin/Company Role:** Complete oversight of the platform, KYC approvals, dispute resolution in P2P, manual deposit approvals, risk monitoring, user management, and ledger reconciliation.
*   **Real-world Use Cases:** Cross-border remittances via P2P, day trading, long-term crypto holding, and safe on-ramping for beginners using Demo mode.
*   **Current Project Status:** Development & Production Hardening phase. Core trading, P2P, wallets, and UI components are built. Focus is on security, Cregis integration, and real-time data reliability.
*   **Production Vision:** A highly concurrent system capable of handling thousands of trades per second with zero financial discrepancies.
*   **Future Roadmap:** Margin trading, Futures/Derivatives, Staking, API platform for third-party developers, and advanced AI-driven trading bots.

---

## 2. Platform Scope

The platform encompasses the following modules and applications:

*   **Web Application:** Responsive React/Next.js SPA.
*   **Android Application:** React Native / Capacitor based Android app (Planned/In-progress).
*   **iOS Application:** React Native / Capacitor based iOS app (Planned/In-progress).
*   **Admin Panel:** Dedicated secure portal for platform management and operational control.
*   **User Panel:** Dashboard for users to manage their profiles, security, and portfolios.
*   **Trading System:** High-performance spot trading with charts, order books, and execution.
*   **Wallet System:** Multi-asset wallet for Demo and Real funds.
*   **Deposit/Withdrawal:** Cregis-powered crypto handling and manual/auto fiat handling.
*   **P2P Marketplace:** Secure escrow-based peer-to-peer trading.
*   **Contract/Signing System:** Legally binding e-signatures for institutional or high-volume users.
*   **KYC/AML:** Identity verification flows and compliance screening.
*   **Notifications:** Multi-channel alerts (Email, Push, In-App).
*   **Support System:** Ticketing system with live chat capabilities.
*   **Reporting:** User statements, tax reports, and admin financial reports.
*   **Risk Management:** Automated anomaly detection and account freezing.
*   **Security:** Rate-limiting, IP tracking, 2FA, WAF.
*   **Compliance:** Rule-based limitations based on jurisdiction.
*   **Realtime Systems:** WebSockets for live order books and trades.
*   **Payment Integrations:** Cregis WaaS & Payment Engine.
*   **Blockchain Integrations:** Direct on-chain monitoring via Cregis.
*   **External Services/APIs:** Binance API for market data fallback, Email providers, SMS providers.

---

## 3. Technology Stack

### Frontend
*   **TypeScript:** Type safety across the application.
*   **React & Next.js:** Core UI framework and server-side rendering/routing.
*   **Tailwind CSS:** Utility-first styling for rapid UI development.
*   **shadcn/ui:** Accessible, customizable UI components.
*   **TanStack Query:** Server state management, caching, and data synchronization.
*   **Zustand:** Lightweight client-side state management (e.g., Trading Mode, Wallet Store).
*   **React Hook Form & Zod:** Form building, validation, and type-safe schemas.
*   **Trading/Chart Libraries:** Lightweight Charts (TradingView) for candlestick rendering.
*   **WebSocket:** Native browser APIs for real-time market data.
*   **PWA Capabilities:** Service workers and manifests for mobile-like web experience.

### Backend
*   **Cloudflare Workers:** Edge computing platform for ultra-low latency API execution.
*   **TypeScript:** Type safety sharing interfaces with the frontend.
*   **REST API:** Standard HTTP endpoints for CRUD operations using Hono.
*   **WebSocket:** Handled via Cloudflare Durable Objects.
*   **Durable Objects:** Stateful edge execution for order matching and real-time broadcasts.
*   **Cloudflare Queues:** Guaranteed message delivery for background tasks (emails, webhooks).
*   **Cron Jobs:** Cloudflare Scheduled events for daily reconciliations and reporting.

### Database & Storage
*   **Cloudflare D1:** Serverless SQLite database for relational data (Users, Wallets, Orders, Trades, KYC). Extremely fast read access at the edge.
*   **Durable Objects SQLite:** Used for high-concurrency, stateful operations like the matching engine.
*   **Cloudflare R2:** S3-compatible object storage. Used for KYC documents, payment proofs, chat attachments, and PDF contracts.
*   **Cloudflare KV:** Low-latency key-value store for caching sessions, OTPs, and rate limits.

### Mobile (Architecture Vision)
*   **Android/iOS Architecture:** React Native or WebView wrapped Next.js (Capacitor).
*   **API Integration:** Identical REST/WebSocket consumption as the Web App.
*   **Authentication:** Secure Enclave/KeyStore backed JWT storage.
*   **Push Notifications:** Firebase Cloud Messaging (FCM) / APNs.
*   **Secure Storage:** Encrypted local storage for sensitive preferences.
*   **Realtime Trading:** Native WebSocket implementations.

### Infrastructure
*   **Cloudflare:** Core cloud provider.
*   **DNS & CDN:** Managed by Cloudflare for DDOS protection and global asset delivery.
*   **SSL/TLS:** Automated edge certificates.
*   **WAF:** Cloudflare Web Application Firewall rules protecting against SQLi, XSS.
*   **Cache:** Cloudflare Edge Caching for static assets and public market data.
*   **Environment Variables:** Managed securely via Cloudflare dashboard and `.dev.vars`.
*   **Deployment:** CI/CD via GitHub Actions / Wrangler.
*   **Monitoring & Logging:** Cloudflare analytics, Tail workers, and external log drains.

---

## 4. System Architecture

### High-Level Request Flow
```text
User
 ↓
Web / Android / iOS
 ↓
API Gateway / Cloudflare Workers (Edge Routing, WAF, Rate Limiting)
 ↓
Authentication / Authorization (JWT Verification, RBAC)
 ↓
Business Services
 ├── Trading (Order validation)
 ├── Wallet (Balance checks)
 ├── Ledger (Double-entry recording)
 ├── Deposit (Payment engine webhooks)
 ├── Withdrawal (Risk checks, Cregis API)
 ├── P2P (Escrow locks)
 ├── KYC (Document processing)
 ├── Risk (Anomaly detection)
 ├── Contracts (PDF Generation, Signing)
 ├── Notifications (Queues)
 └── Support (Ticketing)
 ↓
D1 (Relational Data) / Durable Objects (State/Matching) / R2 (Files) / KV (Cache) / Queues (Async)
```

### Realtime Architecture
```text
Client
 ↓
WebSocket Connection (wss://...)
 ↓
Cloudflare Durable Object (Acts as WebSocket Server & PubSub Broker)
 ↓
Realtime State (In-memory Order Book & Recent Trades)
 ↓
Broadcast (Push to all connected subscribers)
 ↓
Connected Clients (UI Updates instantly)
```

---

## 5. User Roles

The platform utilizes Role-Based Access Control (RBAC).

*   **USER:** Standard trader. Can deposit, trade, withdraw, use P2P. Subject to standard KYC limits.
*   **P2P_MERCHANT:** Verified merchant. Can create P2P Ads. Requires higher KYC and security deposits.
*   **INSTITUTIONAL_USER:** Corporate accounts. Access to API trading, higher limits, custom fee tiers. Requires corporate KYC.
*   **MODERATOR:** P2P dispute resolution and chat moderation. Cannot access financial ledgers.
*   **SUPPORT_ADMIN:** Handles support tickets, resets 2FA (with protocols), basic user queries. Read-only access to user state.
*   **KYC_ADMIN:** Dedicated to reviewing identity documents and approving/rejecting KYC.
*   **FINANCE_ADMIN:** Manages manual fiat deposits, bank transfers, and standard withdrawals. Cannot change system settings.
*   **TRADING_ADMIN:** Monitors market health, liquidity, pairs, and matching engine status.
*   **P2P_ADMIN:** Oversees the P2P marketplace, reviews merchant applications, handles escalated disputes.
*   **COMPLIANCE_ADMIN:** Monitors AML alerts, sanction screening, and suspicious activity reports (SARs).
*   **RISK_MANAGER:** Configures risk limits, velocity limits, and reviews automatically frozen accounts.
*   **AUDITOR:** Read-only access to the entire system including ledgers for regulatory auditing.
*   **ADMIN:** High-level operational access. Can manage other admins except Super Admins.
*   **SUPER_ADMIN:** Absolute control. Can view system secrets, modify core configurations, and assign any role. Requires hardware 2FA.

---

## 6. User Features

*   **Registration & Auth:** Email signup, OTP verification, Login, Logout, Session management.
*   **Security:** Password reset, 2FA (Authenticator App) setup, Device management, Login history.
*   **Profile & KYC:** Personal details, Identity verification (ID + Selfie), Address verification.
*   **Wallet:** Asset overview, Total Portfolio Value, Available/Locked balances.
*   **Transfers:** Crypto Deposits (via Cregis), Fiat Deposits (Manual/Bank), Withdrawals (with whitelist).
*   **Trading:** Spot trading interface, Candlestick charts, Order entry (Buy/Sell), Order Book, Recent Trades.
*   **Order Management:** Open orders tracking, Order cancellation, Order history, Trade history.
*   **P2P Marketplace:** Browse Ads, Create Orders, Escrow Chat, Release Crypto, Dispute.
*   **Contracts:** View legal agreements, e-sign with OTP, download PDFs.
*   **Support:** Create tickets, message support staff.
*   **Reports:** Download account statements and tax reports.

---

## 7. Trading System

### Markets
Pairs follow the `BASE-QUOTE` format (e.g., `BTC-USDT`, `ETH-USDT`). 

### Order Types
*   **Market:** Executes immediately at current order book prices.
*   **Limit:** Executes at a specific price or better.
*   *Planned/Future:* Stop, Stop Limit, IOC, FOK, GTC, Post Only, Reduce Only, Trailing Stop, OCO.

### Trading Features
*   **Order Book:** Aggregated display of bids (buyers) and asks (sellers).
*   **Market Depth:** Visual representation of liquidity.
*   **Charts:** Interactive TradingView Lightweight Charts.
*   **Positions & PnL:** Tracking average entry price and unrealized profit/loss.
*   **Fees:** Maker and Taker fees deducted directly from the receiving asset.
*   **Risk Limits:** Max order size, price band validation to prevent fat-finger errors.

### Matching Engine
*   **Priority:** Strict Price-Time priority.
*   **Execution Flow:** Order Validation -> Lock Balance -> Match against Orderbook -> Generate Trades -> Update Balances -> Broadcast.
*   **Fills:** Supports partial and full fills.
*   **Concurrency:** Handled via Durable Objects to ensure single-threaded, race-condition-free matching per market pair.

---

## 8. Demo vs Real Trading

**CRITICAL RULE:** Real and Demo environments must never bleed into each other.

*   **Completely Separate Systems:** They act as parallel universes. 
*   **Demo Toggle:** A global UI switch. When changed, the entire app (Wallet, Orders, History) re-fetches data for the specific mode.
*   **Backend Enforced:** Every authenticated API call includes `X-Trading-Mode` (`REAL` or `DEMO`). The database explicitly queries using `eq(orders.mode, mode)` and `eq(wallets.type, mode)`.
*   **Demo Properties:**
    *   Fictional balance (e.g., 100,000 Demo USDT provided upon clicking "Top Up Demo").
    *   Orders execute against real market prices but DO NOT affect the real order book.
    *   No real money is involved.
*   **Real Properties:**
    *   Uses actual deposited funds.
    *   Trades alter the real platform ledger.
    *   Withdrawals process on the actual blockchain.
*   **Market Data:** Live price charts and public order books remain identical across both modes.

---

## 9. Wallet System

```text
User -> Trading Account -> Wallet -> Asset Balance (e.g., USDT, BTC)
```

*   **Available Balance:** Funds ready to be withdrawn or traded.
*   **Locked Balance:** Funds currently tied up in open limit orders, pending withdrawals, or P2P escrows.
*   **Total Balance:** Available + Locked.
*   **Wallet Features:** Asset listing, unique deposit address generation (via Cregis), transaction history, blockchain confirmation tracking.

---

## 10. Deposit System

### Auto Deposit (Cregis Integration)
*   User generates a deposit address.
*   User sends crypto on the blockchain.
*   Cregis detects the payment and sends a Webhook to ETHSLTD.
*   System verifies the webhook, logs a transaction record, credits the user's `REAL` wallet, and updates the immutable ledger.

### Manual Deposit (Fiat / Third-Party)
*   User selects amount and payment method.
*   User uploads proof of payment (screenshot to R2).
*   Request goes to `PENDING` state.
*   `FINANCE_ADMIN` reviews proof and approves/rejects.
*   Upon approval, balance is credited.

### Direct Bank Transfer
*   Similar to Manual Deposit but includes bank references, SWIFT/IBAN validation.
*   Requires strict KYC verification before access.

---

## 11. Withdrawal System

*   **Request:** User inputs address, amount, and network.
*   **Validation:** Address format check, minimum amount check, fee calculation.
*   **Locking:** Amount + Fee is moved from `Available` to `Locked`.
*   **Security Checks:** 2FA validation, Risk engine evaluation (e.g., "Is this a new IP?").
*   **Admin Approval:** Large withdrawals may enter a `MANUAL_REVIEW` queue.
*   **Execution:** API call to Cregis WaaS to broadcast the blockchain transaction.
*   **Confirmation:** Webhook updates status to `COMPLETED` and permanently deducts the locked balance.
*   **Failure:** Reverses locked balance back to available.

---

## 12. Financial Ledger

The platform enforces a strict **Double-Entry Immutable Ledger** for all REAL financial movements.

*   Every credit to a user account must have an equal and opposite debit (e.g., from a master holding account, fee account, or counterparty).
*   **Immutability:** Financial records (transactions, trades) are APPEND-ONLY. You cannot `UPDATE` or `DELETE` a completed financial movement.
*   **Corrections:** If an error occurs, an auditable compensating transaction (reversal entry) must be created.
*   **Idempotency:** Webhooks and deposit processing use unique transaction hashes to prevent double-crediting.

---

## 13. P2P Trading

*   **Marketplace:** Board of Buy/Sell Advertisements.
*   **Merchants:** Users who post Ads with specific price limits and payment methods.
*   **Order Creation:** Taker selects an Ad, inputs fiat amount.
*   **Escrow:** Platform locks the crypto from the seller's wallet immediately.
*   **Payment:** Buyer transfers fiat outside the platform using provided instructions.
*   **Confirmation:** Buyer clicks "I have paid". Seller verifies bank account and clicks "Release Crypto".
*   **P2P Chat:** Realtime WebSockets chat for communication, encrypted, with attachment support (R2) and moderation capabilities.

---

## 14. Escrow & Dispute

*   **Escrow Locking:** Guarantees funds exist before a P2P trade starts.
*   **Dispute Creation:** If buyer claims payment but seller denies receiving it, either party can open a Dispute.
*   **Freeze:** The order and escrowed funds are frozen.
*   **Evidence Collection:** Both parties submit proof (bank statements, videos) in the chat.
*   **Admin Review:** A `MODERATOR` or `P2P_ADMIN` reviews the chat, evidence, and user history.
*   **Resolution:** Admin manually forces the release of crypto to the buyer OR cancels the order (returning crypto to the seller). All admin interventions leave an absolute audit trail.

---

## 15. KYC / AML / Compliance

*   **Tiered Verification:** 
    *   Tier 0: Email only (No deposits/trading).
    *   Tier 1: Basic Info + ID Document (Crypto deposits, small withdrawals).
    *   Tier 2: Selfie + Proof of Address (Fiat, unlimited crypto, P2P).
*   **AML Checks:** Background checks against sanctions lists (Future integration).
*   **Transaction Monitoring:** Flagging unusual velocity or interactions with blacklisted addresses.
*   **Compliance Review:** Automated freezes for suspicious accounts pending manual KYC_ADMIN review.

---

## 16. Risk Management

Automated Risk Engine evaluating user actions:
*   **Levels:** LOW, MEDIUM, HIGH, CRITICAL.
*   **Factors:** IP address changes, new device logins, rapid successive withdrawals, multiple failed 2FA attempts, interacting with high-risk P2P counter-parties.
*   **Actions:**
    *   *Allow:* Normal processing.
    *   *Require Verification:* Prompt for email/SMS OTP before proceeding.
    *   *Hold:* Suspend withdrawal for 24 hours.
    *   *Freeze:* Lock account completely requiring support contact.

---

## 17. Contract & E-Signature System

*   **Purpose:** For institutional onboarding, OTC trading agreements, or specific high-tier merchant agreements.
*   **Creation:** Admin creates a contract template.
*   **Consent:** User reviews the contract in the UI.
*   **Signature Flow:** User accepts, enters a 2FA OTP. System records Timestamp, IP, Device, and generates a cryptographic hash of the document and signature.
*   **Storage:** A finalized PDF is generated and securely stored in R2.
*   **Auditability:** Cryptographically verifiable trail proving user consent.

---

## 18. Admin Panel

The operational brain of the platform.
*   **Modules:** Dashboard, Users Management, KYC Approvals, Wallet Operations, Fiat Deposit Approvals, Withdrawal Reviews, Trading Market Config, P2P Dispute Resolution, Contract Management, System Settings.
*   **Security:** Accessible only to users with Admin roles. Protected by strict IP whitelisting and hardware 2FA (planned).

---

## 19. Admin Dashboard

Key real-time metrics for company oversight:
*   Total & Active Users.
*   Pending Actions (KYC, Manual Deposits, Withdrawals, P2P Disputes).
*   Financials: 24h Trading Volume, Total Deposits/Withdrawals, Revenue generated (Trading Fees + Withdrawal Fees).
*   System Health & Risk Alerts.

---

## 20. Notifications

Omnichannel alerting system.
*   **Channels:** Email (SendGrid/Resend), SMS (Twilio/AWS), In-App (Database + WebSockets).
*   **Triggers:** Login from new IP, Deposit successful, Withdrawal requested, Trade executed, P2P order updated, KYC approved/rejected, System maintenance.

---

## 21. Security

*   **Transport:** 100% HTTPS. Strict HSTS.
*   **Authentication:** JWTs stored in secure, HttpOnly cookies (or secure local storage for mobile).
*   **Password Hashing:** Argon2id or bcrypt.
*   **Protection Mechanisms:** CSRF tokens, Rate Limiting (Cloudflare), WAF Rules.
*   **Data Access:** Row-Level Security concepts implemented in API middleware. Users can only access their own `userId` records.
*   **Secrets Management:** Cloudflare Workers Environment Secrets. Never committed to GitHub.

---

## 22. API Documentation

*Standard RESTful architecture.*

**Core Groups:**
*   `/api/v1/auth`: Login, Register, MFA, Password Reset.
*   `/api/v1/users`: Profile, Settings, Device Management.
*   `/api/v1/wallets`: Balances, Deposit, Withdraw, Transactions.
*   `/api/v1/trading`: Markets, Orderbook, Orders, Trades.
*   `/api/v1/p2p`: Ads, Orders, Chat.
*   `/api/v1/admin`: Administrative endpoints (secured by Role).
*   `/api/v1/webhooks`: External system callbacks (Cregis).

*API standards mandate explicit validation (Zod), idempotency keys for financial mutations, and standardized `{ success: boolean, data?: any, error?: string }` responses.*

---

## 23. Realtime System

*   **Protocol:** WebSockets.
*   **Authentication:** Initial HTTP upgrade request verified via JWT.
*   **Topics/Channels:** 
    *   `market:${symbol}:ticker`
    *   `market:${symbol}:orderbook`
    *   `market:${symbol}:trades`
    *   `user:${userId}:orders`
    *   `p2p:${orderId}:chat`
*   **Resiliency:** Auto-reconnection logic on the client. Server heartbeat pings to clear dead connections.

---

## 24. Database Documentation

*Database: Cloudflare D1 (SQLite)*

**Key Tables:**
*   `users`: Authentication, profile, roles.
*   `user_security`: 2FA secrets, IP logs.
*   `wallets`: `userId`, `assetSymbol`, `type` (REAL/DEMO), `balance`, `lockedBalance`.
*   `wallet_transactions`: Ledger of all movements.
*   `markets`: Trading pairs and configurations.
*   `orders`: Spot trading orders.
*   `trades`: Executed matches.
*   `p2p_ads` & `p2p_orders`: Marketplace data.
*   `kyc_documents`: Verification records.

*All tables include `createdAt` and `updatedAt` timestamps.*

---

## 25. File Storage

*Storage: Cloudflare R2*

*   **Public Bucket:** Avatars, Public platform assets, Public P2P Terms.
*   **Private Bucket:** KYC Identity Cards, Selfies, Bank Statements, Legal Contracts.
*   *Rule:* Private files are served through an authenticated API endpoint that streams the R2 object to authorized users only. Direct R2 URLs are never exposed.

---

## 26. External Integrations

*   **Cregis:** Core crypto infrastructure (WaaS & Payment Engine).
*   **Binance API:** Used as a highly reliable fallback for live market ticker prices and candlestick data when internal liquidity is low.
*   **Email Provider:** Transactional emails (OTPs, Alerts).

---

## 27. Cregis Integration

**WaaS (Wallet as a Service):**
Used for infrastructure-level asset management.
*   Creating underlying blockchain addresses for users.
*   Executing outbound crypto withdrawals on the blockchain.

**Payment Engine:**
Used for operational payment flows.
*   Generating dynamic deposit URLs/QRs.
*   Receiving webhooks for successful incoming blockchain transfers.
*   Reconciliation of expected vs actual deposit amounts.

---

## 28. Environment Configuration

*   **Environments:** `development`, `staging`, `production`.
*   **Rule:** No hardcoded URLs in the source code.
*   **Variables:** `NEXT_PUBLIC_API_URL`, `DATABASE_URL`, `CREGIS_API_KEY`, `JWT_SECRET`.
*   The web app and API must determine their base domains dynamically or via injected build-time variables.

---

## 29. Cloudflare Deployment

*   **Web App:** Deployed via `@opennextjs/cloudflare` to Cloudflare Pages/Workers.
*   **Backend API:** Deployed via `wrangler` to Cloudflare Workers.
*   **Database Migrations:** Executed via `wrangler d1 execute`.
*   Everything runs at the edge. There are no centralized EC2 instances or traditional VPS servers.

---

## 30. Performance

*   **Edge Execution:** API requests are resolved at the Cloudflare data center closest to the user.
*   **Optimization:** Minimal JavaScript bundles on the frontend.
*   **Database:** High read-throughput optimized with proper indexing on `userId`, `marketSymbol`, and `createdAt`.
*   **Realtime:** WebSockets prevent heavy HTTP polling.

---

## 31. Error Handling

*   **Client Side:** Toast notifications for transient errors. Form field validation errors handled locally.
*   **API Level:** Consistent error formats. Unhandled exceptions are caught by global middleware, returning generic 500s to the user to prevent data leakage, while logging the stack trace internally.
*   **Financial Failures:** If a trade fails mid-execution, database transactions rollback to ensure funds are never "lost in transit".

---

## 32. Logging & Monitoring

*   **Audit Logs:** Stored in the database for admin actions and financial movements.
*   **Error Monitoring:** Integration with tools like Sentry or Cloudflare Tail.
*   **Alerts:** Critical system failures (e.g., Cregis webhook failure) trigger immediate alerts to the DevOps team.

---

## 33. Audit System

Every sensitive action records:
*   `actor_id` (User or Admin)
*   `action_type` (e.g., `WITHDRAWAL_APPROVED`, `KYC_REJECTED`)
*   `resource_id`
*   `ip_address`
*   `timestamp`
*   `details` (JSON payload of state changes)

---

## 34. Testing

*   **Unit Tests:** Business logic, trading math, fee calculations.
*   **Integration Tests:** API endpoints, D1 database queries.
*   **E2E Tests:** Complete user flows (Signup -> Deposit -> Trade -> Withdraw).
*   **Security Tests:** JWT expiration, RBAC enforcement.

---

## 35. Production Readiness Checklist

- [ ] Security audits complete (Auth, Authorization).
- [ ] D1 Database migrated to production instance with backups enabled.
- [ ] Cregis Webhooks configured to point to production domain.
- [ ] Real and Demo environments strictly isolated.
- [ ] KYC/AML policies configured.
- [ ] WAF rules activated.
- [ ] Admin panel access restricted by IP.
- [ ] Monitoring and alerting enabled.
- [ ] Environment variables verified and rotated.

---

## 36. Current Features (Status)

*   `IMPLEMENTED` Web App Scaffolding & UI Design System
*   `IMPLEMENTED` User Authentication (Login, Register)
*   `IMPLEMENTED` Demo & Real Mode Toggle Architecture
*   `IMPLEMENTED` Spot Trading UI (Charts, Orderbook, Order Entry)
*   `IMPLEMENTED` Spot Trading Backend (Orders, Trades, Mock execution)
*   `IMPLEMENTED` Wallet UI & Ledger Structure
*   `IMPLEMENTED` P2P UI Scaffold
*   `PARTIALLY_IMPLEMENTED` Cregis Payment Engine Integration
*   `IN_PROGRESS` Real WebSocket Market Data
*   `PLANNED` Admin Dashboard
*   `PLANNED` KYC Document Upload flow

---

## 37. Future Features

*   **Mobile Apps:** React Native applications for iOS and Android. (High Priority)
*   **Margin Trading:** Borrowing assets for leveraged trading. (Complex)
*   **Staking Vaults:** Earn yield on locked assets. (Medium Priority)
*   **Fiat On/Off Ramps (Cards):** Direct credit card crypto purchases via third-party providers.
*   **AI Trading Assistant:** Automated insights and portfolio management.

---

## 38. Known Issues

*   **Issue:** Cregis Auto-Deposit Returns 403.
    *   **Root Cause:** Cloudflare Workers use dynamic IPs, failing Cregis' static IP whitelist.
    *   **Workaround:** Documented in `cregis-analysis.md`. Requires Cregis support to whitelist Cloudflare ranges or setting up a dedicated proxy.
    *   **Status:** Pending infrastructure decision.

---

## 39. Change Log

| Date | Version | Change | Reason | Developer |
| :--- | :--- | :--- | :--- | :--- |
| 2026-08-15 | 0.1.0 | Fixed TradingChart Logo | Removed TV logo, added Live Price overlay | Antigravity |
| 2026-08-15 | 0.1.0 | Verified Trading Modes | Ensured complete backend isolation of DEMO/REAL | Antigravity |

---

## 40. Project Rules

1.  **NO HARDCODED URLS:** Production code must dynamically resolve domains.
2.  **NO SECRETS IN CODE:** Use Cloudflare Secrets / `.dev.vars`.
3.  **IMMUTABLE LEDGERS:** Never `UPDATE` financial balances directly without logging a transaction.
4.  **DEMO ISOLATION:** Real and demo trading data must never intersect.
5.  **AUDIT EVERYTHING:** Sensitive admin actions must leave a permanent log.
6.  **ZERO TRUST APIs:** Always authenticate and authorize (RBAC) every API endpoint.
7.  **MINIMAL DATA:** Collect and store only the data absolutely necessary for operations and compliance.
8.  **IDEMPOTENT WEBHOOKS:** External webhooks (Cregis) must be safely retriable without duplicating funds.
9.  **NON-DESTRUCTIVE UPDATES:** Add new features without breaking existing functionality.

---

## 41. Documentation Maintenance Rule

This is **Living Documentation**. 
It is **MANDATORY** to update this file immediately when:
*   A new feature is added or heavily modified.
*   Database schemas or technologies change.
*   Third-party integrations (like Cregis) alter their flow.
*   Security rules, roles, or production architecture change.

---

## 42. Final Documentation Goal

This document ensures that any developer, administrator, or auditor can read this single file and instantly understand the "what", "why", "how", "who", and "where" of the entire ETHSLTD platform—from front-end UI down to how real money flows through the database and external integrations.
