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
