# Cloudflare Deployment & CI/CD Mastery Guide

This guide is the definitive, step-by-step masterclass on deploying the **ETHSLTD Next.js web application** to Cloudflare. It is designed to take you from local development to a globally distributed, production-ready application.

---

## 1. Core Architecture Strategy: Pages vs. Workers

Since ETHSLTD is a **production-ready, fully dynamic Next.js 16 application** using the App Router, understanding how Cloudflare handles it is critical.

### Why not deploy the entire Next.js app to a standard Cloudflare Worker?
Standard Cloudflare Workers are designed for lightweight API endpoints and microservices (e.g., routing, caching, database queries). A full Next.js application contains static HTML, CSS, client-side JavaScript chunks, and dynamic server-side logic (SSR/API routes). Deploying *all* of this directly to a raw Worker is complex and inefficient.

### The Solution: Cloudflare Pages + `@cloudflare/next-on-pages`
**Cloudflare Pages** is purpose-built for full-stack frameworks like Next.js. Here is exactly what happens when you deploy to Pages:
1. **Static Assets**: Your images, fonts, CSS, and static HTML are deployed directly to Cloudflare's ultra-fast CDN.
2. **Dynamic Routes & SSR**: Behind the scenes, Cloudflare automatically provisions a **Cloudflare Worker** to execute all your Next.js Server Components, API routes, and Server-Side Rendering (SSR).
3. **The Bridge**: This magic is powered by the `@cloudflare/next-on-pages` adapter.

**Conclusion**: You will deploy the Next.js app to **Cloudflare Pages**. It will utilize **Cloudflare Workers** automatically for all dynamic functionality.

---

## 2. Step-by-Step Production Deployment Guide

Follow these exact steps to ensure a flawless deployment of the Turborepo monorepo.

### Step 2.1: Prepare GitHub Repository
Ensure your repository is clean and all code is pushed. Cloudflare requires GitHub (or GitLab) integration for Continuous Deployment (CI/CD).
1. Open your terminal in the `Ethsltd` root directory.
2. Run: 
   ```bash
   git add .
   git commit -m "chore: prepare for production deployment"
   git push origin main
   ```

### Step 2.2: Create the Cloudflare Pages Project
1. Log into your [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. On the left sidebar menu, click on **Workers & Pages**.
3. Click the blue **Create application** button.
4. Select the **Pages** tab at the top.
5. Click **Connect to Git**.
6. Authorize your GitHub account (if you haven't already).
7. Select the `Ethsltd` repository from the list and click **Begin setup**.

### Step 2.3: Configure the Monorepo Build Settings
This is the most critical step. Because ETHSLTD uses **Turborepo** (`apps/web`), the default settings will fail. Configure them exactly as follows:

*   **Project name**: `ethsltd-web` (This will be your initial URL: `ethsltd-web.pages.dev`).
*   **Production branch**: `main`
*   **Framework preset**: Select **Next.js**. *(Cloudflare will automatically insert default build commands, but we must override them for the monorepo).*
*   **Root directory**: `/apps/web` *(WARNING: If you leave this blank, the build will fail because it cannot find the Next.js app).*
*   **Build command**: `npx @cloudflare/next-on-pages`
*   **Build output directory**: `.vercel/output/static`

### Step 2.4: Configure Environment Variables (CRITICAL)
Cloudflare's build environment uses older Node.js versions by default. Since ETHSLTD uses Next.js 16 and Tailwind v4, it requires a modern Node version.
1. Scroll down and expand **Environment variables (advanced)**.
2. Click **Add variable** and input:
    *   **Variable name**: `NODE_VERSION`
    *   **Value**: `20`
3. Click **Add variable** again and input:
    *   **Variable name**: `PNPM_VERSION`
    *   **Value**: `9.0.0` *(This forces Cloudflare to use the exact package manager version specified in your `package.json`)*.

### Step 2.5: Deploy
1. Click **Save and Deploy**.
2. Cloudflare will now clone your repository, install dependencies using pnpm, build the application using Turborepo and Next.js, and finally bundle the dynamic routes into a Worker via `next-on-pages`.
3. Wait for the build log to show `Success: Your site was deployed!`.

---

## 3. Post-Deployment: Custom Domain & SSL Setup

Your app is now live on a `*.pages.dev` subdomain. To make it production-ready, you must attach your custom domain (e.g., `ethsltd.com`).

### If your domain is registered/managed by Cloudflare:
1. In your Cloudflare Dashboard, go to **Workers & Pages** -> **ethsltd-web**.
2. Click the **Custom Domains** tab.
3. Click **Set up a custom domain**.
4. Type in your domain (`ethsltd.com`) and click **Continue**.
5. Cloudflare will automatically add the required CNAME records to your DNS zone.
6. Click **Activate domain**. Free SSL certificates are provisioned automatically.

### If your domain is managed elsewhere (GoDaddy, Namecheap, etc.):
1. Follow the steps above to type in your domain.
2. Cloudflare will provide you with a **CNAME record** (e.g., `Name: www`, `Target: ethsltd-web.pages.dev`).
3. Log into your external domain registrar.
4. Go to the DNS settings and add the CNAME record exactly as Cloudflare provided.
5. Wait for DNS propagation (can take 5 mins to 24 hours). Return to Cloudflare to verify.

---

## 4. Continuous Integration / Continuous Deployment (CI/CD) Workflow

Now that the GitHub connection is established, your team has a professional, automated CI/CD pipeline.

### The "Preview" Environment Workflow (For Development)
Never push experimental code directly to the `main` branch.
1. Create a new branch locally: `git checkout -b feature/new-wallet-ui`
2. Write your code and push the branch to GitHub: `git push origin feature/new-wallet-ui`
3. Cloudflare will automatically detect the new branch and create a **Preview Deployment**.
4. You will get a unique URL (e.g., `https://feature-new-wallet-ui.ethsltd-web.pages.dev`).
5. Share this URL with your team to test the new feature safely without affecting live users.

### The "Production" Workflow (Going Live)
1. Once the preview is tested and approved, merge the branch into `main` via a GitHub Pull Request.
2. Cloudflare will detect the merge, run the build process, and instantly update the live website at `ethsltd.com` with zero downtime.

---

## 5. Advanced Production Considerations

### Edge Caching and Performance
Because dynamic routes are executed on Cloudflare Workers (at the Edge), latency is minimized globally.
*   **Static Assets**: Images, CSS, and JS chunks are cached at all Cloudflare edge nodes.
*   **Dynamic Routes**: For API routes or SSR pages, ensure you leverage Next.js caching (`export const revalidate = 60`) where appropriate to minimize Worker execution time and save costs.

### Connecting to the D1 Database (Future)
When you transition the mock backend to the live Hono + D1 database:
1. You will deploy the Hono backend as a separate, standalone **Cloudflare Worker**.
2. Inside your Cloudflare Pages project (Frontend), go to **Settings -> Environment Variables**.
3. Add a new variable `NEXT_PUBLIC_API_URL` pointing to your new Hono Worker URL (e.g., `https://api.ethsltd.workers.dev`).
4. This ensures total decoupling: The Frontend scales on Pages, the Backend scales on Workers, and the Database scales on D1.
