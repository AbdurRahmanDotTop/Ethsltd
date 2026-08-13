# ETHSLTD: Master Project Documentation

**Status:** ACTIVE | **Version:** 1.0.0 | **Last Updated:** August 2026
**Confidentiality:** PRIVATE (Internal Use Only)

This document serves as the single source of truth for the ETHSLTD platform. It is designed to be utilized by developers, administrators, business owners, designers, and operational staff. It reflects the *actual* state of the codebase, distinguishing clearly between fully implemented UI/UX functionality, simulated backend architectures, and production-ready APIs.

---

## 1. Project Overview

* **Project Name:** ETHSLTD
* **Project Purpose:** A modern, high-performance digital asset platform and cryptocurrency exchange simulator/platform.
* **Business Concept:** Facilitate spot trading, peer-to-peer (P2P) fiat-to-crypto exchange, and secure wallet management while capturing revenue through trading fees and withdrawal fees.
* **Target Audience:** Cryptocurrency traders, investors, and learners seeking a professional, dark-mode-first trading environment.
* **Main Objectives:** Provide a highly responsive, visually stunning trading terminal with robust simulated backend logic that can be seamlessly hot-swapped for live production infrastructure.
* **Core Problems Solved:** Reduces friction in crypto trading via intuitive UI, provides risk-free paper trading for education, and offers a secure escrow-based P2P marketplace.
* **Overall System Overview:** A monorepo architecture separating the Next.js frontend application from a serverless Hono backend API, connected via shared TypeScript schemas.
* **Project Status:** The frontend UI/UX, routing architecture, design system, and mock state management are **100% complete**. The backend Hono API and Drizzle/D1 database schema are initialized but the frontend is currently running in a robust "Simulated/Mock" mode.

---

## 2. Technology Stack

### Frontend Technologies
* **Framework:** Next.js 15 (App Router) - Used for server-side rendering, routing, and SEO.
* **Library:** React 19 - Core UI library.
* **Language:** TypeScript - Enforces strict type safety across the monorepo.
* **Styling:** Tailwind CSS v4 - Utility-first CSS framework using modern v4 semantic variables (no `tailwind.config.js` required).
* **State Management:** Zustand - Lightweight, fast state management used for `useAuthStore` and user session handling.
* **Icons:** `lucide-react` - Consistent, clean SVG iconography.

### Backend & Infrastructure (Architecture)
* **API Framework:** Hono - Ultra-fast, edge-compatible web framework used for the REST API.
* **Database ORM:** Drizzle ORM - Type-safe SQL ORM.
* **Database:** Cloudflare D1 - Serverless SQLite database at the edge.
* **Monorepo Manager:** Turborepo (v2) - Manages workspaces, caching, and task execution (`pnpm run dev`).
* **Package Manager:** PNPM - Efficient, symlinked dependency management via `pnpm-workspace.yaml`.

### Third-Party Integrations
* **Customer Support:** Tawk.to - Embedded live chat widget injected via Next.js `<Script>` in the root layout.

---

## 3. Complete Project Structure

The project utilizes a standard Turborepo Monorepo structure:

```text
/
├── apps/
│   ├── web/                  # Next.js 15 Frontend Application
│   │   ├── src/
│   │   │   ├── app/          # App Router (Pages, Layouts, API routes)
│   │   │   ├── components/   # Reusable UI components (Hero, Charts, Cards)
│   │   │   ├── lib/          # Utilities and Mock Providers (Data simulation)
│   │   │   └── stores/       # Zustand state stores
│   │   └── public/           # Static assets (images, fonts)
│   │
│   └── api/                  # Hono Serverless Backend
│       ├── src/              # API Routes and Controllers
│       └── db/               # Drizzle schema and migrations
│
├── packages/
│   ├── types/                # Shared TypeScript interfaces (User, Order, Trade)
│   └── api-client/           # Axios/Fetch wrappers for frontend-to-backend comms
│
├── private/                  # Internal business documentation (PRDs, Plans)
├── turbo.json                # Turborepo task pipeline configuration
└── pnpm-workspace.yaml       # Monorepo workspace definitions
```

---

## 4. System Architecture

* **Overall Architecture:** Decoupled Monorepo. The `web` app handles all rendering and UI logic, while the `api` app handles business logic and database mutations.
* **Current Data Flow (Simulated):** The frontend currently bypasses network requests and routes data fetching through "Mock Providers" (e.g., `MockAuthProvider`, `MockP2PDataProvider`). These providers use `setTimeout` to simulate network latency and resolve with static/randomized data.
* **Future Data Flow (Production):** The Mock Providers will be swapped with the `@ethsltd/api-client` package, which will make HTTP requests to the Hono API, which in turn queries Cloudflare D1 via Drizzle.
* **Authentication Flow:** User submits credentials -> Provider validates -> Returns JWT/Session -> Zustand `useAuthStore` updates state -> UI reacts (shows User Dropdown instead of Login button).
* **Security Layers:** Next.js Middleware/Guards redirect unauthenticated users away from private routes (`/wallet`, `/account`).

---

## 5. User-Side Documentation

* **Authentication:** Users can Register, Login, and access an Account Profile.
* **Markets (`/markets`):** Displays real-time (simulated) tickers, 24h volume, and price changes.
* **Trade Terminal (`/trade`):** 
  * **Orderbook:** Displays bids and asks.
  * **Charts:** Candlestick chart visualization.
  * **Order Entry:** Users can place simulated Market and Limit orders to buy/sell crypto using their virtual USD balance.
* **Wallet (`/wallet`):** 
  * **Balances:** View fiat and crypto holdings.
  * **Deposit/Withdraw:** Forms to request funding or withdraw assets to external addresses.
* **P2P Marketplace (`/p2p`):** Browse advertisements to buy or sell crypto directly with other users via Fiat (Bank Transfer, UPI).
* **Learn & Legal (`/learn`, `/legal`):** Comprehensive educational hubs and legal policies.

---

## 6. Owner/Business Documentation

* **Business Model:** The platform generates revenue strictly through operational fees.
* **Spot Trading Fees:** 
  * Maker Fee: 0.10% (Adding liquidity to the order book).
  * Taker Fee: 0.10% (Removing liquidity from the order book).
* **P2P Fees:**
  * Maker (Ad Creator): 0.15% deduction upon successful order completion.
  * Taker (Ad Responder): 0.00% (Free).
* **Withdrawal Fees:** Dynamic flat fees based on network conditions (e.g., 0.0005 BTC, 1 USDT).
* **Operational Workflow:** Owners monitor system health, adjust fee structures dynamically, and oversee compliance (KYC/AML) via the Admin Console.

---

## 7. Admin Documentation

The Admin Console (`/admin`) is a protected route suite restricted to users with `ADMIN` privileges.
* **Dashboard:** High-level metrics (Total Users, Trading Volume, Revenue).
* **User Management (`/admin/users`):** View user details, suspend accounts, and review KYC document submissions.
* **Financial Management (`/admin/deposits`, `/admin/withdrawals`):** Manually approve or reject pending fiat/crypto transfer requests.
* **P2P Disputes (`/admin/p2p/disputes`):** Mediate conflicts where a buyer claims payment was sent but a seller refuses to release crypto escrow.
* **Support (`/admin/support`):** Review and respond to user-submitted help tickets.

---

## 8. Customer/User Workflow

**Standard Spot Trading Workflow:**
1. **Registration:** User signs up and logs in.
2. **Funding:** User navigates to `/wallet/deposit`, selects USD, and initiates a mock transfer. Wallet balance updates.
3. **Trading:** User navigates to `/trade`, selects `BTC-USDT`, and places a Limit Buy order for 0.5 BTC at $60,000.
4. **Execution:** Once market price hits $60,000, the mock order engine fills the order.
5. **Settlement:** User's USD balance decreases by $30,000 + 0.10% fee; BTC balance increases by 0.5 BTC.

---

## 9. Database Documentation

*Note: Database schema is defined via Drizzle ORM in the `apps/api` workspace.*
* **`users` table:** `id` (PK), `email`, `password_hash`, `role` (USER/ADMIN), `kyc_status`, `created_at`.
* **`wallets` table:** `id` (PK), `user_id` (FK), `asset_symbol`, `balance`, `locked_balance`.
* **`orders` table:** `id` (PK), `user_id` (FK), `market`, `side` (BUY/SELL), `type` (MARKET/LIMIT), `price`, `amount`, `status` (OPEN/FILLED/CANCELED).
* **`p2p_ads` table:** `id` (PK), `user_id` (FK), `asset`, `fiat`, `price`, `available_amount`, `limits`.
* **`p2p_orders` table:** `id` (PK), `ad_id` (FK), `buyer_id`, `seller_id`, `amount`, `fiat_amount`, `status` (PENDING/PAID/RELEASED/DISPUTED).

---

## 10. Authentication & Authorization

* **Current Implementation:** Handled entirely client-side via `MockAuthProvider` and Zustand `useAuthStore`.
* **Flow:** `MockAuthProvider.login(email, pass)` returns a mock user object. Zustand stores this in memory.
* **Route Protection:** Components check `status === "authenticated"` and conditionally render login prompts or redirect using Next.js `useRouter`.
* **Future State:** JWT tokens stored in HttpOnly cookies, verified by Next.js Edge Middleware for true SSR protection.

---

## 11. Service & Category System

* **Markets:** Markets are categorized dynamically (e.g., Top Gainers, DeFi, Layer 1).
* **URLs:** Standardized as `/trade?symbol=BTC-USDT`.
* **Data Simulation:** `MockMarketProvider` generates localized volatility using `setInterval` to update prices dynamically in the UI.

---

## 12. Order & Checkout System

* **Spot Trading Logic:**
  * **Default Quantity:** Empty, requires explicit user input.
  * **Total Cost Calculation:** `Price * Amount = Total`.
  * **Fee Deduction:** Fees are deducted from the receiving asset (e.g., buying BTC with USDT deducts the fee from the received BTC).
  * **Insufficient Balance:** UI disables the "Buy/Sell" button and highlights the required balance.

---

## 13. Wallet & Payment System

* **Wallet Architecture:** Users have multiple virtual sub-wallets (USD, BTC, ETH).
* **Fiat Payments:** Currently simulated. UI allows users to select Bank Transfer or Card, input an amount, and instantly receive virtual funds.
* **Withdrawals:** Withdrawals check `balance - locked_balance`. If sufficient, the request is flagged as "Pending Admin Approval".

---

## 14. Coupon & Discount System

* **Not Found / Not Confirmed:** The current architecture of the cryptocurrency exchange does not utilize standard e-commerce coupons or discount codes. Fee reduction is historically handled via VIP Volume Tiers, which are not currently implemented.

---

## 15. Financial System

* **Revenue Calculation:** Total Revenue = Sum(Spot Fees) + Sum(P2P Maker Fees) + Sum(Withdrawal Fees).
* **Portfolio Value:** Calculated dynamically on the frontend: `Sum(WalletAssetBalance * CurrentMarketPriceInUSD)`.

---

## 16. UI/UX & Design System

* **Design Ethos:** Premium, institutional, dark-mode-first aesthetic.
* **Color Palette:**
  * Backgrounds: Deep grays/blacks (`#09090b`).
  * Brand Primary: Indigo/Violet gradients (`--brand-500`).
  * Accents: Emerald (`success`) for Buy/Up, Rose (`danger`) for Sell/Down.
* **Typography:** `Inter` (UI/Sans), `Space Grotesk` (Display/Headers), `JetBrains Mono` (Tickers, Prices, Orderbooks).
* **Components:** Cards utilize glassmorphism borders (`border-border bg-card/50`). Buttons have subtle hover scales and brightness transitions.

---

## 17. Responsive Design

* **Breakpoints:** Uses standard Tailwind breakpoints (`sm: 640px`, `md: 768px`, `lg: 1024px`, `xl: 1280px`).
* **Mobile Behavior:** 
  * Global Header converts to a Hamburger menu with a sliding overlay.
  * Trade Terminal stacks vertically (Chart -> Order Entry -> Orderbook) instead of the desktop 3-column layout.
  * Tables (Markets, Wallet History) allow horizontal scrolling to prevent layout breakage.

---

## 18. SEO & URLs

* **URLs:** Clean, readable paths (`/learn/crypto-basics`, `/legal/privacy`).
* **Dynamic Routing:** Utilizes Next.js `[id]` patterns (e.g., `/support/tickets/[id]`).
* **Metadata:** Root `layout.tsx` injects global OpenGraph and Twitter cards.
* **Sitemap/Robots:** `sitemap.ts` and `robots.ts` auto-generate SEO files, explicitly blocking crawlers from `/admin`, `/wallet`, and `/account`.

---

## 19. Security

* **Implemented (UI Level):** Client-side route guarding, strict Typescript typing preventing undefined object crashes, React automatic XSS escaping.
* **Production Requirements (Future):**
  * Password Hashing: Argon2 or bcrypt in the Hono backend.
  * CSRF Protection: Required for session-based cookie authentication.
  * SQL Injection: Prevented inherently by using Drizzle ORM query builders.
  * Rate Limiting: Must be implemented on the Cloudflare Edge to prevent API spam.

---

## 20. APIs & Third-Party Integrations

* **Tawk.to (Support Chat):**
  * **Purpose:** Live customer support.
  * **Integration:** Snippet injected via Next.js `<Script strategy="afterInteractive">` in `layout.tsx`.
  * **Status:** Active.

---

## 21. Hosting & Deployment

* **Hosting Environment:** Optimized for the Cloudflare ecosystem.
* **Frontend:** Cloudflare Pages (via `@cloudflare/next-on-pages` or standard Vercel deployment).
* **Backend:** Cloudflare Workers (Hono framework).
* **Database:** Cloudflare D1 (SQLite at the edge).
* **Deployment Steps:** Run `pnpm run build` in the monorepo root. Turborepo handles building dependencies in the correct topological order.

---

## 22. Configuration

* **`turbo.json`:** Defines the build pipeline and task caching.
* **`.npmrc`:** Configures PNPM hoisting and behavior.
* **Environment Variables:** Currently absent as the project is in Mock Mode. Future `.env` will require `DATABASE_URL`, `JWT_SECRET`, and `CLOUDFLARE_API_TOKEN`.

---

## 23. Error Handling & Troubleshooting

* **Global Boundaries:** `error.tsx` catches catastrophic React render failures and presents a clean "Something went wrong" UI.
* **Route Missing:** `not-found.tsx` catches 404s with a designed "Page doesn't exist" UI and links back to Home/Support.
* **Troubleshooting 'Hydration Errors':** Ensure no random data (like `Math.random()`) is generated during the initial SSR render. Use `useEffect` for client-side data mocking.
* **Troubleshooting 'Broken Links':** Run `node test-buttons.js` in the `apps/web` directory to trigger the Puppeteer crawler which verifies all UI routes.

---

## 24. Developer Guide

1. **Initial Setup:** Install `pnpm`. Run `pnpm install` in the monorepo root.
2. **Local Development:** Run `pnpm run dev`. Turborepo will start the Next.js app on `localhost:3000`.
3. **Adding a New Page:** Create a folder in `apps/web/src/app/[route-name]` and add a `page.tsx`. Ensure you export standard Next.js `metadata`.
4. **Adding Categories/Links:** When adding new internal links, ensure you add them to `apps/web/src/app/sitemap.ts` to maintain SEO integrity.

---

## 25. Maintenance & Future Development

* **Technical Debt:** The entire data layer is currently mocked. The immediate next phase of development requires replacing `MockAuthProvider` and `MockMarketProvider` with real `fetch()` calls to the Hono backend.
* **Scalability:** The Cloudflare D1/Worker architecture is highly scalable and will automatically distribute globally to the edge.
* **Future Feature:** WebSocket integration for true real-time orderbook and ticker updates (replacing the current `setInterval` polling mock).

---

## 26. Complete Feature Inventory

* **Account Management:** Registration, Login, Security Profile.
* **Admin Console:** User, Order, Transfer, and Dispute management.
* **Developer Platform:** API Key generation, REST documentation, API usage metrics.
* **Educational Hub (`/learn`):** Guides on trading, crypto basics, and security.
* **Legal Hub (`/legal`):** Terms, Privacy, Risk Disclosures.
* **Markets Explorer:** Asset filtering, sorting by volume/gainers.
* **P2P Marketplace:** Buy/Sell boards, active order chat/escrow workspaces.
* **Spot Trading Terminal:** Candlestick charts, Orderbook, Market/Limit order entry.
* **Support System:** Ticket creation, ticket management, live chat.
* **Wallet Management:** Portfolio tracking, simulated deposit/withdrawals, transaction history.

---

## 27. Business Rules

* **Order Matching:** A Limit Buy order can only be filled if the market price drops to or below the limit price.
* **P2P Escrow:** Crypto is locked in the seller's wallet the moment a P2P order is accepted. It cannot be withdrawn or traded on the spot market until the P2P order is canceled or disputed.
* **Withdrawal Minimums:** Hardcoded limits (e.g., 0.001 BTC minimum) exist to prevent network dust transactions.

---

## 28. Roles & Permissions Matrix

| Feature | GUEST | USER (Authenticated) | ADMIN |
| :--- | :---: | :---: | :---: |
| View Markets | ✅ | ✅ | ✅ |
| Read Learn/Legal | ✅ | ✅ | ✅ |
| Access Wallet | ❌ | ✅ | ✅ |
| Place Trades | ❌ | ✅ | ✅ |
| Access P2P Escrow | ❌ | ✅ | ✅ |
| Manage Support Tickets| ❌ | ✅ (Own Only) | ✅ (All) |
| Access Admin Console | ❌ | ❌ | ✅ |

---

## 29. Status & Workflow Reference

* **Order Statuses:**
  * `OPEN`: Order is on the book, waiting for price matching.
  * `FILLED`: Order was fully executed.
  * `CANCELED`: User manually aborted the order before it filled.
* **P2P Statuses:**
  * `PENDING`: Buyer has not yet sent fiat.
  * `PAID`: Buyer clicked "I have paid". Seller must verify.
  * `RELEASED`: Seller verified payment and released crypto escrow. Complete.
  * `DISPUTED`: Conflict raised, awaiting Admin mediation.

---

## 30. Glossary

* **Maker:** A trader who places an order that goes on the order book, *making* market liquidity.
* **Taker:** A trader who places an order that immediately executes against the order book, *taking* liquidity.
* **Escrow:** A temporary vault holding crypto during a P2P transaction to ensure neither party is scammed.
* **Paper Trading:** Simulated trading using virtual funds to practice strategies without financial risk.

---

## 31. Known Issues & Technical Debt

* **Fully Simulated Data:** The application currently runs flawlessly but entirely on client-side state and mock providers.
* **Hardcoded Charting:** The TradingView/Candlestick chart currently renders static visual components rather than mapping real OHLC arrays.
* **Missing SSR Auth:** Because authentication relies on Zustand (Client-side), refreshing protected pages causes a momentary flash of unauthenticated state before hydration.

---

## 32. Final Project Reference

* **Critical Files:** 
  * `apps/web/src/app/layout.tsx` (Global layout, fonts, SEO, Tawk.to)
  * `apps/web/src/lib/auth/mock-provider.ts` (Core logic for simulated auth)
  * `apps/web/src/app/trade/page.tsx` (Complex trading terminal UI)
* **Developer Checklist:** 
  1. Have you run `pnpm install`? 
  2. Have you checked UI changes against Dark/Light mode? 
  3. Have you verified new links with `node test-buttons.js`?
* **Future Roadmap:** 
  1. Connect Next.js to Hono API. 
  2. Implement SQLite/D1 database schema. 
  3. Integrate real WebSocket provider for live crypto prices (e.g., Binance API or CoinCap).
