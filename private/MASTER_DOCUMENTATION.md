# ETHSLTD: Master Project Documentation

**Status:** ACTIVE | **Version:** 1.0.0 | **Last Updated:** August 2026
**Confidentiality:** PRIVATE (Internal Use Only)

This document serves as the master record and ultimate single source of truth for the ETHSLTD Cryptocurrency Exchange platform. It combines all previous documentation into a unified, comprehensive blueprint for developers, administrators, business owners, designers, and operational staff.

---

## 1. Project Overview

*   **Project Purpose:** A modern, high-performance digital asset platform and cryptocurrency exchange simulator/platform.
*   **Objectives:** Provide a highly responsive, visually stunning trading terminal with robust simulated backend logic that can be seamlessly hot-swapped for live production infrastructure.
*   **Core Concept:** Facilitate spot trading, peer-to-peer (P2P) fiat-to-crypto exchange, and secure wallet management while capturing revenue through trading and operational fees.
*   **Target Users:** Cryptocurrency traders, investors, learners seeking a professional, dark-mode-first environment, and platform administrators.
*   **Major Modules:** Core Trading Terminal, P2P Marketplace, Wallet & Portfolio Management, Authentication & Security, Admin Operations Console, Support & Notification System, Developer API Portal.

---

## 2. Complete Technology Stack

*   **Frontend Technologies:**
    *   **Framework:** Next.js 15 (App Router, Turbopack) for server-side rendering, routing, and SEO.
    *   **Library:** React 19.
*   **Backend Technologies:**
    *   **API Framework:** Hono - Ultra-fast, edge-compatible web framework used for the REST API.
    *   **Database:** Cloudflare D1 - Serverless SQLite database at the edge.
*   **Programming Languages:** Strict TypeScript end-to-end.
*   **Styling & UI:**
    *   Tailwind CSS v4 (Semantic design system, no `tailwind.config.js` required).
    *   Radix UI for accessible headless primitives (Dialogs, Dropdowns, Tabs).
    *   `class-variance-authority` (cva) for component variants.
    *   `lucide-react` for iconography.
*   **State Management & Forms:**
    *   Zustand (Global state: Auth, Notifications, transient state, persisted state).
    *   React Hook Form + Zod (Strict client-side input validation).
*   **Libraries and Dependencies:**
    *   `lightweight-charts` (v5 API by TradingView) for high-performance candlestick rendering.
    *   `date-fns` for date manipulation.
*   **Database ORM:** Drizzle ORM (Type-safe SQL ORM).
*   **Authentication:** Simulated JWT verification flow with `useAuthStore` (Transitioning to HttpOnly cookies and SSR protection).
*   **Third-Party Services:** Tawk.to (Embedded live chat widget for customer support).
*   **Hosting/Server Technologies:** Cloudflare ecosystem (Pages for Frontend, Workers for Hono API, D1 for Database).
*   **Development/Build Tools:**
    *   Turborepo (v2) for monorepo orchestration.
    *   PNPM for efficient workspace dependency management.

---

## 3. Project Architecture

*   **Overall Architecture:** Decoupled Monorepo. The `web` app handles rendering and UI logic, while the `api` app handles business logic and database mutations.
*   **Frontend/Backend Relationship:** Connected via shared packages (`packages/types`, `packages/api-client`). This guarantees contract synchronization between the Next.js frontend and the Hono backend.
*   **Database Architecture:** Relational SQLite via Cloudflare D1 at the edge, managed by Drizzle ORM.
*   **API/Data Flow:**
    *   *Current (Simulated):* Frontend routes data fetching through "Mock Providers" (e.g., `MockAuthProvider`) utilizing `setTimeout` to simulate latency and resolve with deterministic/randomized data.
    *   *Future (Production):* Mock Providers will be swapped with the `@ethsltd/api-client` package to make HTTP requests to the Hono API, querying D1.
*   **Folder/File Structure:** Clean separation of concerns between `apps/web` (Next.js frontend), `apps/api` (Hono backend), and `packages` (Shared types/clients).
*   **Important Modules:**
    *   `services/api`: Cloudflare Worker running Hono for standardized routing.
    *   `database`: D1 schemas and Drizzle migrations.
    *   `apps/web/src/lib`: Houses the simulated mock providers that power the frontend logic.

---

## 4. UI/UX & Design System

*   **Overall Design Approach:** Premium, institutional, dark-mode-first aesthetic with a highly responsive, data-dense interface.
*   **Layouts:** Flexible flexbox and CSS grid structures that adapt smoothly from multi-column desktop command centers to stacked mobile views.
*   **Color Palette:**
    *   Backgrounds: Deep grays/blacks (`#09090b`).
    *   Brand Primary: Indigo/Violet gradients (`--brand-500`).
    *   Accents: Emerald (`success`) for Buy/Up, Rose (`danger`) for Sell/Down.
*   **Typography/Fonts:**
    *   `Inter`: Default sans-serif for UI.
    *   `Space Grotesk`: Display and main headers.
    *   `JetBrains Mono`: Monospace for financial data, tickers, prices, and orderbooks.
*   **Components:**
    *   **Cards:** Glassmorphism borders (`border-border bg-card/50`).
    *   **Buttons:** Subtle hover scales and brightness transitions.
    *   **Forms/Inputs:** Clean borders with dynamic validation feedback.
    *   **Tables:** Horizontally scrollable data tables with sortable headers.
*   **Responsive Behavior:** Built mobile-first using Tailwind breakpoints (`sm: 640px`, `md: 768px`, `lg: 1024px`, `xl: 1280px`).
*   **Mobile/Tablet/Desktop Behavior:**
    *   Trade Terminal multi-column grid seamlessly stacks on mobile.
    *   Global Header converts to an overlay hamburger menu on smaller screens.
*   **Accessibility:** Radix UI ensures proper ARIA attributes, keyboard navigation, and screen reader support.

---

## 5. Complete Features & Functionalities

*   **User-Side Features:**
    *   **Homepage:** Landing page with real-time tickers, platform highlights, and conversion-optimized copy.
    *   **Markets Explorer:** Live text filtering, Category Tabs (USDT, USDC, BTC), interactive sorting, customizable Watchlist (starred items persisted locally), and custom SVG sparklines.
    *   **Advanced Trading Terminal:** Zoomable Candlestick charts, real-time Orderbook with depth bars, Order Entry form with dynamic validation (balance, fees, % shortcuts), and history tabs.
    *   **P2P Marketplace:** Filterable buy/sell boards, slide-out advertisement drawer, real-time escrow order workspace with countdowns, state-machine flows, and simulated chat.
    *   **Wallet & Portfolio:** Dashboard with custom donut charts, deposit/withdrawal flows with mock network delays, and a chronological ledger history with CSV export.
    *   **Support & Education:** Ticketing system, live chat fallback (Tawk.to), and educational hubs (`/learn`).
    *   **Developer API Platform:** Interactive API playgrounds and documentation.
*   **Admin Features:**
    *   **Dashboard:** High-level KPIs and chronological System Audit Log.
    *   **User Management:** Searchable directory, deep-dive profiles, account freeze controls, and KYC document review queues.
    *   **Financial Operations:** Manual approval/rejection queues for incoming/outgoing deposits and withdrawals.
    *   **Market Activity:** Global view of active orders and trades with forced cancellation abilities.
    *   **P2P Operations:** Dispute resolution queue for locked trades.
    *   **Support & Notifications:** Agent inbox for user tickets, ability to send Internal Notes, and platform-wide announcement system.
*   **Authentication and Account Management:** Registration, Login, Forgot/Reset Password, Email Verification, Session Management, 2FA setup mocks, Anti-Phishing configuration.
*   **Global Enhancements:** Center-screen professional loading states on navigation ("Loading data...", "Fetching details..."), disabling distracting development indicators.

---

## 6. User Roles & Permissions

| Feature / Action | GUEST | USER (Authenticated) | ADMIN (Super User) |
| :--- | :---: | :---: | :---: |
| View Markets & Public Pages | ✅ | ✅ | ✅ |
| Read Learn/Legal Hubs | ✅ | ✅ | ✅ |
| Access Wallet & Transfer Funds | ❌ | ✅ | ✅ |
| Place Spot Trades | ❌ | ✅ | ✅ |
| Access P2P Escrow Workspaces | ❌ | ✅ | ✅ |
| Manage Support Tickets | ❌ | ✅ (Own Only) | ✅ (All) |
| Access Admin Console (`/admin`) | ❌ | ❌ | ✅ |

*   **Workflows:** Unauthenticated users attempting to access protected routes (`/wallet`, `/account`, `/admin`) are redirected to `/login` via route guards.

---

## 7. Database Documentation

*   **Database Architecture:** Cloudflare D1 (Serverless SQLite) configured via Drizzle ORM.
*   **Important Tables & Columns:**
    *   `users`: `id` (PK), `email`, `password_hash`, `role` (USER/ADMIN), `kyc_status`, `created_at`.
    *   `wallets`: `id` (PK), `user_id` (FK), `asset_symbol`, `balance`, `locked_balance`.
    *   `orders`: `id` (PK), `user_id` (FK), `market`, `side` (BUY/SELL), `type` (MARKET/LIMIT), `price`, `amount`, `status` (OPEN/FILLED/CANCELED).
    *   `p2p_ads`: `id` (PK), `user_id` (FK), `asset`, `fiat`, `price`, `available_amount`, `limits`.
    *   `p2p_orders`: `id` (PK), `ad_id` (FK), `buyer_id`, `seller_id`, `amount`, `fiat_amount`, `status` (PENDING/PAID/RELEASED/DISPUTED).
*   **Data Flow:** Handled strictly through Drizzle ORM query builders to prevent SQL injection and ensure type safety.

---

## 8. API & Integration Documentation

*   **Current State:** The frontend relies on robust Mock Providers (e.g., `MockMarketProvider`, `MockP2PDataProvider`) simulating asynchronous REST API responses.
*   **Future Production State:** Hono Edge API backend will provide standardized REST endpoints.
*   **API Management (Developer Portal):** Users can generate `LIVE` or `TEST` keys with granular permissions (Read, Trade, Withdraw), view them once securely, and monitor usage metrics.
*   **Third-Party Integrations:** Tawk.to live chat embedded via `<Script>` tag for customer support.

---

## 9. Security

*   **Authentication/Security Mechanisms:** Simulated client-side JWT flow utilizing Zustand. Future transition to HttpOnly cookies and Next.js Edge Middleware for true SSR protection.
*   **Authorization:** Route guards implement Role-Based Access Control (RBAC). Admin routes are completely blocked from normal users.
*   **Input Validation:** Strict client-side validation using Zod schemas with React Hook Form.
*   **SQL Injection Protection:** Inherently prevented by using Drizzle ORM parameterized queries.
*   **XSS Protection:** Benefitting from React's automatic data escaping.
*   **Sensitive Data:** Passwords will be hashed using Argon2/bcrypt in the Hono backend. API keys display their secret only once upon creation.

---

## 10. Performance & Optimization

*   **Rendering:** Next.js Server-Side Rendering (SSR) and Static Generation where applicable.
*   **Asset Optimization:** Tailwind CSS v4 is highly optimized. SVG charting and icons (`lucide-react`) are lightweight. Custom SVG sparklines are built from scratch to avoid heavy chart libraries in overview grids.
*   **Data Simulation:** High-performance Zustand stores handle transient state (like active orderbooks) without forcing expensive full-page re-renders.
*   **Loading States:** Global `loading.tsx` implementations ensure the user sees professional skeleton/spinner states during heavy route transitions, improving perceived performance.

---

## 11. Project Configuration

*   **Environment Variables:** Currently operating in mock mode, but future requirements include `DATABASE_URL`, `JWT_SECRET`, and `CLOUDFLARE_API_TOKEN`.
*   **Workspace Configuration:** `turbo.json` manages the monorepo build pipeline and task caching; `pnpm-workspace.yaml` handles topological dependency resolution.
*   **Next.js Configuration:** `next.config.ts` disables distracting development indicators (`devIndicators`) and ignores type/eslint errors during builds for rapid iteration.

---

## 12. Installation & Setup

*   **Prerequisites:** Node.js (v18+), PNPM installed globally.
*   **Installation Steps:**
    1. Clone repository.
    2. Run `pnpm install` in the monorepo root.
*   **Local Development:**
    1. Run `pnpm run dev`.
    2. Turborepo will start the Next.js frontend application on `http://localhost:3000`.

---

## 13. Deployment

*   **Hosting/Server Setup:** Optimized for the Cloudflare ecosystem.
*   **Deployment Targets:**
    *   Frontend: Cloudflare Pages (via `@cloudflare/next-on-pages` or standard Vercel deployment).
    *   Backend: Cloudflare Workers.
    *   Database: Cloudflare D1.
*   **Deployment Process:** Running `pnpm run build` in the monorepo root utilizes Turborepo to build dependencies in the correct topological order.

---

## 14. File & Folder Structure

```text
/
├── apps/
│   ├── web/                  # Next.js 15 Frontend Application
│   │   ├── src/
│   │   │   ├── app/          # App Router (Pages, Layouts, API routes, loading.tsx)
│   │   │   ├── components/   # Reusable UI components (Hero, Charts, Admin Data Tables)
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
├── private/                  # Internal business documentation (MASTER_DOCUMENTATION.md)
├── turbo.json                # Turborepo task pipeline configuration
└── pnpm-workspace.yaml       # Monorepo workspace definitions
```

---

## 15. Workflows

*   **Standard Spot Trading Workflow:**
    1.  **Funding:** User navigates to `/wallet/deposit`, selects USD, and initiates a mock transfer.
    2.  **Trading:** User goes to `/trade`, places a Limit Buy order for BTC.
    3.  **Execution & Settlement:** Mock engine fills the order when price conditions meet. USD decreases (plus fee), BTC increases.
*   **P2P Trade Workflow:**
    1.  User selects an ad and initiates a trade. Crypto is locked in Escrow (`PENDING`).
    2.  Buyer sends fiat and marks `PAID`.
    3.  Seller verifies and releases crypto (`RELEASED`), or initiates a `DISPUTED` state for Admin mediation.
*   **Admin Financial Workflow:**
    1. User requests a fiat withdrawal. Status is Pending.
    2. Admin navigates to `/admin/withdrawals`.
    3. Admin approves or rejects the transaction, triggering a balance update or refund.

---

## 16. Error Handling & Troubleshooting

*   **Global Error Boundaries:** `error.tsx` catches catastrophic React render failures. `not-found.tsx` provides a designed 404 UI.
*   **Hydration Errors:** Ensuring no random data (like `Math.random()`) is generated during SSR. Use `useEffect` for client-side data mocking.
*   **Known Limitations (Current):** The data layer is entirely mocked. Refreshing protected pages may cause a momentary unauthenticated flash because Zustand state initializes client-side.

---

## 17. Development Guidelines

*   **Coding Conventions:** Strict TypeScript end-to-end. Avoid `any` where possible.
*   **Component Organization:** Reusable UI elements go in `apps/web/src/components/ui`. Feature-specific components belong in `components/[feature]`.
*   **UI/UX Consistency:** Always use standard Tailwind design system classes (e.g., `bg-background`, `text-muted-foreground`, `p-6 md:p-8 max-w-7xl mx-auto` for page wrappers).

---

## 18. Testing

*   **Routing Tests:** A `test-buttons.js` script utilizing Puppeteer exists in `apps/web` to crawl and verify all internal UI routes, ensuring no broken links.
*   **Validation:** Relying heavily on TypeScript compilation (`pnpm tsc --noEmit`) to verify interface alignment between frontend and backend.

---

## 19. Maintenance & Future Development

*   **Immediate Milestone:** Replace Mock Providers with real `fetch()` calls to the Hono API.
*   **Database Integration:** Fully execute the SQLite/D1 database schema and connect the Hono API to real persistence.
*   **Real-time Data:** Integrate WebSocket providers (e.g., Binance API or CoinCap) for live crypto prices and orderbook updates, replacing the current `setInterval` polling mock.
*   **Security:** Implement true SSR authentication via HttpOnly cookies and Next.js Edge Middleware.

---

## 20. Change History / Version Information

*   **Version 1.0.0 (Current):** 
    *   Frontend UI/UX, routing architecture, design system, and mock state management 100% complete.
    *   Admin dashboard independent scrolling and global professional loading states implemented.
    *   Project successfully transitioned to a Turborepo Monorepo structure.
    *   Backend Hono API and Drizzle/D1 schemas initialized for Phase 2 integration.
