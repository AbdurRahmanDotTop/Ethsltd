# ETHSLTD Production Architecture & Deployment Guide

This document outlines the **official, long-term production architecture** for ETHSLTD. It reflects the latest best practices (as of 2026) for deploying full-stack Next.js applications on the Cloudflare ecosystem.

---

## 1. Core Architecture Strategy (The OpenNext Paradigm)

ETHSLTD is a complex platform requiring real-time trading data, P2P escrow, secure wallets, and low-latency API interactions. Therefore, deploying the entire Next.js app to Cloudflare Pages via `next-on-pages` is **not recommended** for this architecture.

Instead, we utilize the **Workers-first approach** using OpenNext.

### Why Next.js → OpenNext → Cloudflare Workers?
*   **Full-Stack SSR Support**: OpenNext (`@opennextjs/cloudflare`) natively adapts Next.js 16's server-rendered logic to run directly on Cloudflare Workers, ensuring maximum performance at the edge.
*   **Isolation & Monorepo Support**: Deploying via Workers allows us to control the dependency resolution from the workspace root (Turborepo), preventing the unnecessary build complexities found in Pages deployments.

### The ETHSLTD Infrastructure Map

```text
                         GitHub
                           │
                    ┌──────┴──────┐
                    │   Turborepo │
                    └──────┬──────┘
                           │
              ┌────────────┴────────────┐
              │                         │
         apps/web                  apps/admin
              │
         Next.js 16
              │
          OpenNext
              │
      Cloudflare Workers (Frontend)
              │
       ┌──────┴─────────┐
       │                │
     D1             Durable Objects
       │                │
       │          realtime/orderbook
       │          websocket/locking
       │
       ├──────── R2 (KYC/Contracts)
       │
       ├──────── KV (Cache/Config)
       │
       └──────── Queues (Background Jobs)
       
                    API (api.ethsltd.com)
                     │
              Cloudflare Worker (Backend)
                     │
                   Hono
                     │
          ┌──────────┼──────────┐
          │          │          │
         D1         R2         DO
```

---

## 2. Decoupled Backend Architecture (Hono + WebSockets)

The Frontend (Next.js) will strictly handle UI and rendering. All business logic, databases, and real-time operations will be decoupled into separate Workers.

### REST API (Hono)
*   **Domain**: `api.ethsltd.com` (Professional custom domain, not `*.workers.dev`).
*   **Framework**: Hono (running on a dedicated Cloudflare Worker).
*   **Responsibilities**: Authentication, Wallet management, User CRUD, Admin logic, Order validation.

### Real-time Engine (Durable Objects)
*   **Domain**: `ws.ethsltd.com`
*   **Technology**: Cloudflare Durable Objects + WebSockets.
*   **Responsibilities**: Orderbook matching engine, real-time market state, live Trading Room updates, P2P Escrow locks.

---

## 3. CI/CD Workflow & GitHub Integration

While we are shifting the runtime to Workers, the **GitHub-driven CI/CD workflow** remains critical for a professional development lifecycle.

### The Workflow Pipeline
```text
feature branch  →  GitHub  →  Preview Deployment  →  Testing  →  Pull Request  →  main  →  Production
```

1. **Preview Environments**: 
   When a developer pushes to a `feature/*` branch, a preview URL is automatically generated. This allows the team to test UI and logic changes in isolation.
2. **Production Releases**: 
   Merging a Pull Request into the `main` branch triggers the production deployment pipeline.
3. **Workspace Control**: 
   Since this is a Turborepo, the deployment pipeline will run from the root, resolving all shared packages (`packages/ui`, `packages/types`, `packages/api-client`) correctly before deploying `apps/web`.

---

## 4. Deployment Execution Steps

To deploy the Next.js application using OpenNext and Cloudflare Workers, follow these steps:

### Step 4.1: Install OpenNext
Ensure you are using the Cloudflare-specific adapter for OpenNext within the `apps/web` package.
```bash
pnpm add -D @opennextjs/cloudflare
```

### Step 4.2: Configure Wrangler
You will use `wrangler.toml` instead of the Cloudflare Pages UI to define your Worker. Create a `wrangler.toml` in `apps/web`:
```toml
name = "ethsltd-web"
main = ".open-next/worker.js"
compatibility_date = "2024-09-23"
compatibility_flags = ["nodejs_compat"]

[assets]
directory = ".open-next/assets"
binding = "ASSETS"
```

### Step 4.3: Build & Deploy
1. **Build via OpenNext**: 
   Run the build script from the workspace root or inside `apps/web`:
   ```bash
   npx opn-next build
   ```
2. **Deploy via Wrangler**:
   Deploy the generated Worker to Cloudflare:
   ```bash
   npx wrangler deploy
   ```

*(Note: In a production CI/CD setup, these commands will be automated via GitHub Actions (`wrangler-action`) whenever code is pushed to `main`.)*

---

## 5. Environment Variables & Secrets

Never hardcode sensitive information (e.g., JWT secrets, Database credentials).
*   **Local Development**: Store in `.dev.vars`.
*   **Production**: Store securely in Cloudflare using the CLI:
    ```bash
    npx wrangler secret put JWT_SECRET
    ```

**Frontend-to-Backend Connection:**
In production, your Next.js application should point to your custom API domain:
```env
NEXT_PUBLIC_API_URL=https://api.ethsltd.com
```

---

## 6. Summary of Technologies

*   **Frontend**: Next.js 16, React, TypeScript, Tailwind CSS v4, Zustand, Lightweight Charts.
*   **Monorepo**: pnpm + Turborepo.
*   **Frontend Runtime**: Cloudflare Workers (via OpenNext).
*   **Backend Runtime**: Cloudflare Workers (Hono).
*   **Database**: Cloudflare D1.
*   **Real-time / Locks**: Durable Objects + WebSockets.
*   **Storage**: Cloudflare R2 (KYC Docs, Contracts).
*   **Cache**: Cloudflare KV.
*   **Jobs**: Cloudflare Queues & Cron Triggers.
*   **Domains**: `ethsltd.com`, `api.ethsltd.com`, `ws.ethsltd.com`.

By standardizing on **Workers + OpenNext**, ETHSLTD guarantees maximum control over monorepo dependencies, superior Server-Side Rendering performance, and a hyper-scalable architecture ready for high-frequency trading loads.

---

## 7. Next Steps: Roadmap to Full Production

Now that the Frontend UI and Deployment Architecture are solidly defined, here is the detailed, step-by-step roadmap to migrate from the "Mocked" state to a fully functional production application.

### Step 1: Initialize the Hono Backend Worker
The Next.js frontend is currently using Zustand stores with `setTimeout` to simulate data. We must replace this with a real backend.
1. **Create the Backend App**: Inside the monorepo, scaffold a new Cloudflare Worker running Hono (e.g., `apps/api`).
2. **Define Routes**: Create RESTful endpoints for `/auth`, `/wallet`, `/orders`, and `/p2p`.
3. **Connect API Client**: Update the `@ethsltd/api-client` package to use Axios/Fetch to call `https://api.ethsltd.com` instead of returning mock data.

### Step 2: Implement the D1 Database (SQL)
The platform needs persistent storage for users, balances, and orders.
1. **Initialize Drizzle ORM**: Set up Drizzle inside `apps/api`.
2. **Define Schemas**: Map out tables for `users` (with KYC status), `wallets` (balances per asset), `orders` (Spot), and `p2p_ads`.
3. **Bind D1 to Worker**: Add the D1 binding in the Hono worker's `wrangler.toml`.
4. **Write Migrations**: Generate and execute the initial SQL schema migrations (`drizzle-kit generate` & `wrangler d1 migrations apply`).

### Step 3: Implement Real Authentication (JWT + Cookies)
We must replace the insecure, client-side-only `MockAuthProvider`.
1. **Backend Auth**: Build the login/register logic in Hono using `bcrypt`/`Argon2` for password hashing.
2. **JWT Generation**: Issue a secure JWT upon successful login.
3. **HttpOnly Cookies**: Send the JWT back to Next.js in a secure, `HttpOnly`, `SameSite=Lax` cookie.
4. **Next.js Middleware**: Update `middleware.ts` in `apps/web` to read the cookie and protect routes (like `/wallet` and `/admin`) natively at the edge.

### Step 4: Build the Real-Time Orderbook (Durable Objects)
For a trading terminal, REST APIs are too slow for order book updates.
1. **Create a Durable Object**: Define a `TradingRoom` DO in Cloudflare to manage state for a specific market (e.g., `BTC-USDT`).
2. **WebSocket Integration**: Establish a WebSocket connection from the Next.js `apps/web` client to the Durable Object.
3. **Matching Engine**: Implement the logic inside the DO to match Bids and Asks in memory, broadcasting the updated order book and trade history instantly to all connected clients.

### Step 5: Implement Secure Escrow for P2P
The P2P marketplace requires transactional guarantees.
1. **Locking Mechanism**: When a buyer initiates a P2P trade, use D1 transactions to instantly move the seller's crypto from `available_balance` to `locked_balance`.
2. **State Machine**: Implement the strict state flow: `PENDING` -> `PAID` -> `RELEASED` / `DISPUTED`.
3. **Admin Mediation UI**: Connect the `/admin/p2p/disputes` dashboard to real backend endpoints allowing admins to forcibly unlock or transfer the escrowed funds.
