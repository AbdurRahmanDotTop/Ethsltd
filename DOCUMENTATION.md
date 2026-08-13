# ETHSLTD Crypto Platform Documentation

## 1. Project Overview
ETHSLTD is a modern digital asset platform and cryptocurrency exchange built with cutting-edge web technologies. It provides a seamless experience for trading, P2P marketplaces, wallet management, and customer support. 

### Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Monorepo**: Turborepo
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4, Lucide React (Icons)
- **State Management**: Zustand (Client-side stores)
- **Forms & Validation**: React Hook Form, Zod
- **Charting**: Lightweight Charts (TradingView)

---

## 2. Architecture & Folder Structure

The project is structured as a monorepo using **Turborepo** to allow for easy scaling (e.g., adding a mobile app or backend package in the future).

```text
Ethsltd/
├── apps/
│   └── web/                   # Main Next.js Web Application
│       ├── next.config.ts     # Next.js configuration
│       ├── package.json       # App dependencies
│       └── src/
│           ├── app/           # Next.js App Router Pages
│           │   ├── (dashboard)/ # Protected dashboard layout (Wallet, Account, Support)
│           │   ├── trade/     # Advanced Trading Terminal
│           │   ├── p2p/       # Peer-to-Peer Marketplace
│           │   ├── markets/   # Market Overview
│           │   └── ...        # Other pages (Home, Auth, Legal, Learn)
│           ├── components/    # Reusable UI Components (Headers, Buttons, Tables)
│           ├── lib/           # Utility functions and types
│           └── stores/        # Zustand State Management (Global State)
├── packages/                  # Shared Turborepo packages (optional future use)
├── package.json               # Root monorepo dependencies and scripts
└── turbo.json                 # Turborepo build pipeline configuration
```

---

## 3. Key Modules & Features

### A. Authentication (`/login`, `/register`)
- Mock authentication flows handling JWT tokens.
- Protected routes using Next.js middleware and Zustand state (`useAuthStore`).

### B. Trading Terminal (`/trade/[symbol]`)
- Real-time trading interface.
- Integrated **Lightweight Charts** for dynamic candlestick charts.
- Order Book, Recent Trades, and Order Entry forms (Buy/Sell).

### C. P2P Marketplace (`/p2p`)
- Buy and Sell crypto directly with other users using fiat currencies.
- Filter by asset, fiat currency, and payment methods.
- Store logic in `p2p-store.ts` handles complex state synchronization with URL parameters.

### D. User Dashboard (`/wallet`, `/account`)
- **Wallet**: View balances, deposit, and withdraw funds across various networks (ERC20, TRC20, etc).
- **Account**: Manage security settings like 2FA, KYC verification, and passwords.

### E. Support Hub (`/support`)
- Comprehensive help center with FAQs and Popular Topics.
- **Ticketing System**: Users can create, track, and reply to support tickets.
- Live Chat widget integration.

---

## 4. State Management
We use **Zustand** for lightweight, fast, and scalable client-side state management. All stores are located in `apps/web/src/stores/`.
- `auth-store.ts`: Manages user login state and user data.
- `market-store.ts`: Manages real-time crypto prices and 24h stats.
- `order-store.ts`: Manages open orders and order history.
- `p2p-store.ts`: Manages the active P2P marketplace state.
- `support-store.ts`: Manages support tickets and live chat logic.
- `wallet-store.ts`: Manages asset balances and transaction history.

---

## 5. Deployment Guide: Publishing to Cloudflare Pages (Free)

Cloudflare Pages is the best platform for hosting Next.js applications for free. Since ETHSLTD uses the Next.js App Router with dynamic routes (SSR), we will use Cloudflare's **`@cloudflare/next-on-pages`** adapter which automatically optimizes your Next.js app for the edge.

### Step 1: Prepare the Repository
Ensure all your latest changes are committed and pushed to your GitHub repository.
```bash
git add .
git commit -m "Ready for production"
git push
```

### Step 2: Connect to Cloudflare
1. Log into your [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. On the left sidebar, click on **Workers & Pages**.
3. Click the **Create application** button, then go to the **Pages** tab.
4. Click **Connect to Git** and authorize your GitHub account.
5. Select your `Ethsltd` repository from the list and click **Begin setup**.

### Step 3: Configure Build Settings
Since this is a Turborepo monorepo, you must configure the build settings carefully so Cloudflare knows where your Next.js app is located.

- **Project name**: `ethsltd` (or whatever you prefer)
- **Production branch**: `main`
- **Framework preset**: Select **Next.js**
- **Build command**: `npx @cloudflare/next-on-pages`
- **Build output directory**: `.vercel/output/static`
- **Root directory**: `/apps/web` *(Important: You must specify the root directory as apps/web since it's a monorepo)*

### Step 4: Add Node.js Compatibility Flag
Cloudflare Edge runtime requires you to enable Node.js compatibility for Next.js to work seamlessly.
1. Scroll down and click on **Environment variables (advanced)**.
2. Add a new variable:
   - **Variable name**: `NODE_VERSION`
   - **Value**: `20`
3. Add another variable:
   - **Variable name**: `PNPM_VERSION`
   - **Value**: `9.0.0` (Matches the packageManager version in your package.json)

### Step 5: Save and Deploy
Click the **Save and Deploy** button. 
Cloudflare will now clone your repo, install dependencies using pnpm, build the Next.js app for the Edge using `next-on-pages`, and deploy it globally across their CDN.

### Step 6: Custom Domain (Optional)
Once deployed, Cloudflare gives you a free `*.pages.dev` subdomain (e.g., `ethsltd.pages.dev`). 
If you want to use your own domain (e.g., `ethsltd.com`):
1. Go to your project settings in Cloudflare Pages.
2. Click on the **Custom Domains** tab.
3. Enter your custom domain and follow the prompts to update your DNS records. SSL certificates are generated automatically for free!

### Post-Deployment Checklist
- [ ] Test Authentication login/logout across tabs.
- [ ] Ensure real-time charts load correctly in the Trading Terminal.
- [ ] Check if dynamic routes like `/trade/BTC-USDT` and `/support/tickets/[id]` load instantly without 404 errors.
- [ ] Verify that P2P filters persist using the URL state.
