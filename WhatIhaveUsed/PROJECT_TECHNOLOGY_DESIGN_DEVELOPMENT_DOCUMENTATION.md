# ETHSLTD Crypto - Comprehensive Project Technology & Architecture Documentation

## 1. Project Overview

**Web Application Name**: ETHSLTD Crypto
**Purpose**: A modern, full-stack digital asset platform designed for cryptocurrency trading, P2P exchange, wallet management, and expert-led financial operations. It acts as a comprehensive financial dashboard where users can store crypto assets, trade them, interact with escrow-based P2P systems, and manage fiat/crypto deposits and withdrawals securely.
**Target Users**: Cryptocurrency traders, investors, expert financial advisors, and standard users looking for a secure platform to manage and exchange digital assets.
**Workflow**: Users register/login → Verify identity (KYC) → Deposit funds (via crypto wallets, manual deposits, or bank transfers) → Trade on the market or engage in P2P exchanges (protected by escrow) → Manage portfolio or subscribe to "Experts" → Withdraw assets securely.
**Practical Use**: In production, it serves as an enterprise-grade digital exchange built on edge-computing (Cloudflare Workers) to ensure low-latency global access, integrated with external crypto payment gateways (Cregis) for automated Web3 transactions.

## 2. User Perspective

From an end-user standpoint, the application provides a seamless, "Vercel-like" sleek dashboard experience:
- **Registration/Login**: Users sign up via standard email/password, with session-based authentication and OTP/2FA support.
- **Wallet & Assets**: A unified dashboard displaying available, locked, and total balances across various crypto and fiat currencies. Includes real-time global currency conversion rates.
- **Trading**: An intuitive market interface displaying charts (via Lightweight Charts/Recharts) to execute buy/sell orders.
- **P2P & Escrow**: Users can browse or post P2P advertisements. When a trade is initiated, funds are locked in an escrow ledger. A chat interface allows communication, and funds are only released upon payment confirmation. Dispute flows are built-in.
- **Expert System**: Users can view and interact with "Experts" (potentially for copy-trading or advisory services).
- **Deposits/Withdrawals**: Automated crypto deposits via Cregis, alongside manual fiat bank transfers.
- **Security**: Granular session management, risk alerts, and audit logs visible to the user.
- **Support**: Integrated Tawk.to live chat and an internal support ticketing system.

## 3. Developer Perspective

**Project Architecture**: Turborepo-based Monorepo pattern.
- **Frontend (`apps/web`)**: Next.js 15+ App Router application deployed on Cloudflare Pages via `@opennextjs/cloudflare`.
- **Backend API (`services/api`)**: A serverless REST API built with Hono.js running on Cloudflare Workers, ensuring edge-deployed low latency.
- **Proxy Service (`services/cregis-proxy`)**: A PHP-based secure proxy bridging the internal network with the Cregis Payment Engine and WaaS. It handles MD5 signature generation and TLS cipher spoofing to bypass external WAFs.
- **Database (`database` / `services/database`)**: LibSQL (Turso) managed via Drizzle ORM. Highly modular schema separating auth, ledger, p2p, trading, and system settings.
- **Data Flow**: Next.js Server Components / Client Components → fetch API → Cloudflare Worker (Hono) → Drizzle ORM → LibSQL Edge Database.
- **State Management**: Client-side state is handled by Zustand with domain-specific stores (`auth-store.ts`, `p2p-store.ts`, `wallet-store.ts`, etc.).
- **Security Implementation**: Session-based auth via secure cookies, strict CORS configurations in Hono, proxy secret validation for external hooks, and comprehensive audit/risk logging at the DB level.

## 4. Complete Technology Stack

### Frontend
- **Framework**: Next.js (App Router)
- **Programming Language**: TypeScript / React 19
- **CSS Framework**: Tailwind CSS v4 (using `@tailwindcss/postcss`)
- **Component Library**: Radix UI (Primitives) + Custom built components
- **State Management**: Zustand
- **Form Management & Validation**: React Hook Form + Zod + `@hookform/resolvers`
- **Charts**: `lightweight-charts` (TradingView-style) and `recharts` (Analytics)
- **Icons**: `lucide-react`
- **Styling Utilities**: `clsx`, `tailwind-merge`, `class-variance-authority` (CVA)
- **Theming**: `next-themes` (Dark/Light mode via CSS variables)
- **Notifications**: `sonner` (Toast system)

### Backend
- **Backend Framework**: Hono.js
- **Runtime**: Cloudflare Workers (`@cloudflare/workers-types`)
- **Programming Language**: TypeScript
- **Database Technology**: LibSQL (SQLite edge-compatible)
- **Database Driver/ORM**: Drizzle ORM (`drizzle-orm`, `drizzle-kit`)
- **Math/Precision**: `decimal.js` (crucial for financial calculations and preventing floating-point errors)
- **Security/Auth**: `otplib` (for 2FA/OTP), `qrcode`
- **Proxy Backend**: PHP 8+ (cURL, MD5 signature generation)

### Infrastructure / Cloud
- **Hosting**: Cloudflare Pages (Frontend) & Cloudflare Workers (Backend)
- **Database Hosting**: Turso (LibSQL) or Cloudflare D1
- **Package Manager**: pnpm (`pnpm-workspace.yaml`)
- **Build System**: Turborepo (`turbo.json`)
- **Deploy Tooling**: Wrangler (`wrangler deploy`), OpenNext (`@opennextjs/cloudflare`)

## 5. Complete Packages, Libraries & Dependencies

**Frontend Core**:
- `next` (React Framework)
- `react`, `react-dom` (UI Library)
- `zustand` (Global state management, modularized into specific feature stores)

**Frontend UI/UX**:
- `tailwindcss@4` (Utility-first CSS, v4 engine)
- `@radix-ui/react-dialog`, `@radix-ui/react-slot` (Accessible unstyled UI primitives)
- `lucide-react` (SVG icon system)
- `sonner` (Toast notification stack)
- `next-themes` (Handles system/dark/light theme switching via `.dark` classes)

**Data & Forms**:
- `react-hook-form` (Performant form state)
- `zod` (TypeScript-first schema validation)
- `@hookform/resolvers` (Connects Zod to RHF)
- `date-fns` (Date formatting and manipulation)
- `xlsx`, `puppeteer` (Data export and report generation utilities)

**Backend Core**:
- `hono` (Ultrafast web framework for the Edge)
- `drizzle-orm` (TypeScript ORM for SQL databases)
- `@libsql/client` (Driver connecting to LibSQL/Turso)
- `decimal.js` (Arbitrary-precision decimal arithmetic for ledger safety)
- `otplib`, `qrcode` (MFA generation and validation)

## 6. Tools & Services Used

- **Cloudflare**: Hosts the frontend via Pages and backend via Workers. Handles global CDN, DNS, and Edge caching.
- **Turborepo**: Manages the monorepo build pipeline, caching node_modules and build artifacts efficiently.
- **Cregis (t-tkqzeuxf.cregis.io)**: External Wallet-as-a-Service (WaaS) and Payment Engine (PE) used for automated crypto deposits and payouts. Interacted with via the PHP proxy to maintain stealth and IP whitelisting.
- **Tawk.to**: Integrated live chat support system injected via Next.js `Script` tag.
- **Drizzle Kit**: CLI tool used for database schema migrations and prototyping.

## 7. Design System & UI/UX

Based on the `DESIGN.md` and `globals.css`, the project employs a highly sophisticated, Vercel-inspired developer-platform aesthetic:
- **Design Philosophy**: A stark black-and-ink duet on a near-white/dark canvas, using deep contrasts, hairline borders, and selective mesh gradients for decoration.
- **Typography**: 
  - Sans-serif: `Inter` and `Space Grotesk` (geometric sans for display).
  - Monospace: `JetBrains Mono` for technical data, addresses, and code blocks.
  - Aggressive negative letter-spacing for headlines to create a tight, modern look.
- **Color System** (from `globals.css`):
  - Primary Theme: Emerald/Teal tint (`--primary: #00A070`).
  - Dark Mode: `#121212` background with `#1A1C24` card surfaces.
  - Light Mode: `#F8FAFC` background with `#FFFFFF` cards.
  - Semantic: `success` (Green), `danger` (Red), `warning` (Amber), `info` (Blue).
- **Elevation**: Stacked, subtle shadows. Cards sit on the page held by 1px hairline borders (`border-border` initialized at `rgba(255,255,255,0.05)` in dark mode).
- **Border Radius**: Modular scale from `--radius-xs` (4px) to `--radius-full` (9999px for pill buttons).

## 8. Frontend Structure

Directory: `apps/web/src`
- **`app/`**: Next.js App Router directories.
  - `(dashboard)/`: Grouped routes for authenticated views.
  - `admin/`, `p2p/`, `trade/`, `wallet/`, `experts/`, `account/`: Feature-based routing.
  - `layout.tsx`: Root layout injecting fonts, `ThemeProvider`, `AuthProvider`, and third-party scripts (Tawk.to).
  - `globals.css`: Tailwind v4 configuration, custom variants, and CSS variables.
- **`components/`**: Reusable UI components (auth, layout, chat).
- **`stores/`**: Zustand state modules (`auth-store.ts`, `wallet-store.ts`, `p2p-store.ts`, etc.).
- **`lib/`**: Utilities, formatting, and auth types.
- **`hooks/`**: Custom React hooks.

## 9. Backend Structure

Directory: `services/api/src`
- **`index.ts`**: Hono application entry point, CORS configuration, and router mounting.
- **`routes/`**: Feature-based controllers grouping API endpoints.
  - Contains standard routes: `auth`, `wallets`, `p2p`, `trading`, `settings`, `experts`.
  - Dedicated admin sub-routes: `admin/payments`, `admin/system`, `admin-audit`, etc.
- **`db.ts`**: Database connection initialization mapping Cloudflare ENV vars to Drizzle client.
- **`middleware/`**: Request interceptors (Auth, Role validation).
- **`services/`**: Core business logic abstraction.
- **`utils/`**: Helpers, crypto functions, and formatting.

## 10. Database & Data Model

Directory: `database/schema/`
The DB is highly normalized using Drizzle ORM defining exact SQLite/LibSQL schemas.
- **Core Entities**: `users` (Auth), `kyc` (Identity), `platform_settings`.
- **Financial Core**: `wallets` (User balances), `ledger` (Immutable double-entry accounting records preventing double spends).
- **Transactions**: `bank_transfers`, `manual_deposits`, `cregis` (Crypto webhook logs).
- **P2P & Trading**: `p2p_ads`, `p2p_orders`, `trading_orders`.
- **Operations & Security**: `audit_logs`, `risk_alerts`, `api_keys`, `email_logs`, `system_backups`, `smart_contracts`.

## 11. Trading / P2P / Escrow Architecture

- **Trading**: Supports standard buy/sell order flows mapped to the `trading_orders` schema and handled via the `/api/v1/trading` Hono routes. UI uses Lightweight charts.
- **P2P Ecosystem**: 
  - `p2p_ads`: Users define terms, margins, and limits.
  - `p2p_orders`: Maps buyer to seller.
  - **Escrow**: Upon order creation, seller assets are locked in the database via the ledger system. Funds sit in a "locked" state.
  - Settlement: Only upon confirmed fiat payment does the backend release the crypto asset from escrow to the buyer's wallet.
  - Disputes: Managed via `support_tickets` and resolved by admins with ledger intervention access.

## 12. Wallet, Currency & Asset Architecture

- **Wallets System**: Users have specific ledger accounts for varying assets (e.g., BTC, ETH, USDT, USD).
- **Balances**: Separated into `available` and `locked` (for open orders/P2P escrows).
- **Currency Rates**: Handled via `currency_rates` schema and APIs, updating global fiat-to-crypto and fiat-to-fiat conversions dynamically.
- **Asset Conversions**: Internal mechanism (`asset_conversions.ts` schema) to log swaps and enforce fee deductions safely using `decimal.js` for zero precision loss.

## 13. Authentication & Security

- **Auth Flow**: Hono routes `/api/v1/auth/me` using strict Cookie-based sessions (`ethsltd_session`). No localStorage JWT vulnerabilities.
- **Middleware**: SSR Layout in Next.js checks cookies before rendering protected trees. Backend Hono checks signatures and session tokens.
- **Security Mechanisms**:
  - `otplib` implemented for Two-Factor Authentication.
  - Cregis Webhooks validated via strict MD5 signatures to prevent spoofed deposit alerts.
  - PHP Proxy utilizes TLS Cipher list spoofing and forced IPv4 to evade overly aggressive Cloudflare bot protections on external APIs.
  - Extensive internal auditing via `audit_logs.ts` and `risk_alerts.ts`.

## 14. API Documentation Overview

Base URL: `/api/v1/`
Framework: Hono.js
- **Auth**: `/auth/login`, `/auth/register`, `/auth/me`
- **Wallets**: `/wallets/balance`, `/wallets/deposit`, `/wallets/withdraw`
- **P2P**: `/p2p/ads`, `/p2p/orders`
- **Admin**: Deep administrative endpoints under `/admin/*` for managing system variables, resolving disputes, auditing risks, and triggering backups.
- **Webhooks**: `/webhooks` - Listens to external payment processors (Cregis) and updates ledger states idempotently.

## 15. Realtime & Communication

- **Client State Polling/Sync**: Zustand stores fetch and sync data.
- **Live Support**: Integration with Tawk.to via asynchronous script injection for real-time customer support without blocking the main render thread.

## 16. Performance & Optimization Techniques

- **Edge Computing**: API deployed entirely on Cloudflare Workers, ensuring ~0ms cold starts and routing requests to the nearest edge node.
- **Database Architecture**: LibSQL allows for edge-replica reads, making DB queries incredibly fast globally.
- **Bundle Optimization**: Turborepo caches builds. CSS is optimized via Tailwind v4's new Rust-based engine.
- **Script Loading**: Third-party scripts (Tawk.to) are injected via Next.js `<Script strategy="afterInteractive">` and custom hydration suppression to prevent layout shifts and performance degradation.

## 17. Error Handling, Logging & Monitoring

- **Frontend**: Custom `error.tsx` and `not-found.tsx` Next.js boundaries. Sonner used for graceful UI error toasts.
- **Backend**: Hono middleware catches exceptions. `decimal.js` prevents silent arithmetic errors.
- **System**: Deep `audit_logs` and `email_logs` schemas track systemic actions.

## 18. Deployment & Production Architecture

- **Monorepo Management**: `pnpm` workspaces + Turborepo.
- **Frontend Deploy**: Cloudflare Pages using OpenNext (`opennextjs-cloudflare`) mapping Next.js App Router to Cloudflare's edge network.
- **Backend Deploy**: Wrangler CLI (`wrangler deploy`) pushing Hono to Cloudflare Workers.
- **Proxy Deploy**: Standard PHP server (Nginx/Apache) hosting `index.php` to securely route Cregis requests outside of standard worker constraints if needed.

## 19. Development Techniques & Engineering Practices

- **Strict Monorepo Separation**: `apps/web` knows nothing of the database driver; it only knows `@ethsltd/api-client` and `@ethsltd/types`.
- **Immutable Ledger Principle**: Financial transactions do not just "update a balance column"; they rely on a double-entry ledger architecture ensuring tracking of every satoshi/cent.
- **Precision Mathematics**: Use of `decimal.js` string-based math to prevent JavaScript floating-point errors (e.g., `0.1 + 0.2`).
- **Idempotency**: Webhook routes for Cregis deposits process transaction IDs ensuring a deposit is never credited twice.

## 20. File & Folder-by-Folder Audit

- `apps/web/`: The Next.js UI layer. Contains all pages, components, CSS (`globals.css`), stores, and Next.js config.
- `services/api/`: The Cloudflare Worker Hono backend. Contains all REST routes, middleware, and business logic.
- `services/cregis-proxy/`: A single `index.php` file acting as a cryptographic bridge to Cregis API.
- `services/database/`: Shared internal module wrapping Drizzle ORM.
- `database/schema/`: The heart of the application's data structure, broken down into 20+ distinct TypeScript files representing SQL tables.
- `packages/types/`: Shared TypeScript interfaces between frontend and backend.
- `packages/api-client/`: Typed fetch wrappers for the frontend to consume the API safely.
- `turbo.json` / `pnpm-workspace.yaml`: Orchestration files mapping the monorepo architecture.

## 21. Feature-to-Technology Mapping

| Feature | Frontend Tech | Backend Tech | Database Table | External Service |
| :--- | :--- | :--- | :--- | :--- |
| **Authentication** | Next.js / Zustand | Hono / otplib | `users`, `kyc` | N/A |
| **Wallets/Ledger** | React / Tailwind | Hono / decimal.js | `wallets`, `ledger` | N/A |
| **Crypto Deposits** | Zustand Wallet Store | Webhooks / PHP Proxy | `cregis`, `ledger` | Cregis (WaaS/PE) |
| **P2P Trading** | RHF / Zod | Hono / Escrow Logic | `p2p_ads`, `p2p_orders`| N/A |
| **Market Trading** | Lightweight Charts | Hono / Matching Logic| `trading_orders` | N/A |
| **Customer Support** | React | Custom Chat Widget | N/A | Tawk.to |

## 22. User Flow Documentation

**Deposit Flow**:
1. User navigates to Wallet -> Deposit -> Selects Crypto.
2. Frontend requests a dynamic deposit address from API.
3. API hits `cregis-proxy` (PHP) -> Generates MD5 signature -> Calls Cregis WaaS.
4. User sends crypto to the address.
5. Cregis fires webhook to API `/webhooks`.
6. API validates signature -> Updates `ledger` -> Credits `wallets`.

**P2P Trade Flow**:
1. Buyer clicks a P2P Ad.
2. API locks the specific crypto amount from Seller's wallet into an escrow ledger state.
3. Buyer transfers fiat via Bank Transfer and clicks "Paid".
4. Seller verifies receipt of bank transfer and clicks "Release".
5. API transfers the locked crypto from escrow to Buyer's wallet.

## 23. Admin / Management Features

Deeply integrated Admin panels accessible via `apps/web/src/app/(dashboard)/admin`.
- **System Control**: Modify platform variables, fees, and operational status (`platform_settings.ts`).
- **Financial Audit**: Review `audit_logs` and `ledger` anomalies.
- **Risk Management**: Review `risk_alerts` triggered by automated backend systems (e.g., unusually large withdrawals).
- **Dispute Resolution**: Admins can intervene in P2P orders to manually release escrow based on provided evidence.
- **Backups**: Trigger system state exports/backups (`system_backups.ts`).

## 24. Third-Party Integrations

1. **Cregis**: Payment Engine and Wallet-as-a-Service. Integrated via REST + Proxy. Used for generating wallet addresses, monitoring on-chain deposits, and automating outgoing withdrawals.
2. **Tawk.to**: Customer support widget. Integrated via raw JavaScript injection in `layout.tsx`.
3. **Cloudflare**: Hosting for Pages, Workers, and potentially D1 database, alongside DDoS protection.

## 25. Important Business Logic

- **Escrow Settlement**: Crypto is moved from `available` to `locked` during open P2P trades or Limit Orders. It cannot be withdrawn or spent while locked.
- **Decimal Precision**: All balances and order sizes are processed using high-precision decimal math.
- **Proxy Security**: The PHP proxy bypasses IP restrictions and WAF blocking by standardizing requests from a single static IP server, using forced HTTP/2 and custom TLS handshakes.

## 26. Production Readiness

- **Implemented**: Edge-deployed API for global low-latency, modular database schema, rigorous numeric precision, robust proxy for payment provider stealth, extensive admin control panel.
- **Configured**: Turborepo build pipeline, Cloudflare deployment hooks, strict CORS and Cookie domains.
- **Notable Security**: MD5 payload signing for external APIs, internal proxy secrets, session-cookie only auth (No LocalStorage keys).

## 27. Final Technology Inventory

| Category | Technology/Tool | Version | Purpose | Actual Usage |
| :--- | :--- | :--- | :--- | :--- |
| Frontend | Next.js | 15/16.x | UI Framework | Main app routing, SSR/CSR rendering |
| Styling | Tailwind CSS | v4 | CSS Framework | Theming, layout, responsive design |
| State | Zustand | 5.x | Client State | Managing auth, wallet, p2p state in UI |
| API Layer | Hono.js | 4.x | Backend Framework | REST API server on Cloudflare Workers |
| ORM | Drizzle ORM | 0.45.x | Database Layer | Type-safe SQL querying and schema |
| Database | LibSQL / Turso | - | Database Engine | Edge-compatible SQLite database |
| Calculations| Decimal.js | 10.x | Math Library | Financial precision for ledger balances |
| Forms | React Hook Form | 7.x | Form State | Handling user inputs, login, trade forms |
| Hosting | Cloudflare | - | Infrastructure | Workers (API) & Pages (Next.js) |
| Payments | Cregis / PHP | 8+ | Proxy Gateway | Secure bridging for crypto deposits |
| Monorepo | Turborepo / pnpm| - | Build System | Caching and workspace orchestration |

## 28. Final Project Summary

**ETHSLTD Crypto** is an enterprise-ready, edge-native digital asset exchange and P2P platform. It solves the problem of high-latency crypto trading by utilizing Cloudflare's Edge network via Next.js and Hono.js. Designed for a sleek, dark-mode developer aesthetic, it allows users to manage wallets, trade securely via an escrow-backed P2P system, and track assets with pinpoint accuracy. 

The architecture is a highly modular Turborepo monorepo, cleanly separating the frontend (React/Tailwind), the serverless backend (Hono), the database schema (Drizzle/LibSQL), and external payment gateways (via a stealth PHP proxy). Through rigorous engineering practices—such as using `decimal.js` for financial logic, immutable ledger structures, and strict cookie-based auth—the platform is built to handle production-scale financial operations securely and swiftly.
