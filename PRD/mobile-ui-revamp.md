# Product Requirements Document (PRD): Mobile UI Screenshot Parity

## 1. Objective
Achieve 1:1 mobile UI parity with the provided target reference screenshots (MexcCrypto) while preserving all existing `ETHSLTD` backend integrations, data models, and functional workflows. This PRD details the exact feature gaps, layout structures, and required implementation steps for the Home and Assets pages.

---

## 2. Screenshot Analysis

### Screenshot 1: Home Page (Mobile)
**Overall Page Structure:** A dense, app-like trading dashboard focused on immediate market access.
- **Top Bar:** 
  - Left: Profile icon (rounded, green tint).
  - Center: App logo text ("MexcCrypto" -> We will use "ETHSLTD").
  - Right: Notification bell icon with a green tint.
- **Hero Banner:** Blue promotional banner ("Brand New Rates 0 Trading Fees") with a 3D graphic. Contains pagination dots below it.
- **Top Markets Grid:** 3 horizontal metric cards for BTC/USDT, ETH/USDT, XRP/USDT displaying price and 24H change.
- **Quick Action Navigation (Middle Grid):** 
  - 5 icons in a single row: Finance, Option, Publication, Share, Chat.
- **Section Title:** "Gainers" with horizontal lines extending outward.
- **Market Table (Gainers):**
  - **Header:** Pill-shaped dark gray container with columns: "Pair", "Latest Price", "24H Change".
  - **List Items:** Rows for NEO/USDT, ETC/USDT, DOT/USDT, LINK/USDT.
  - **Values:** Left-aligned pair, center-aligned price, right-aligned percentage box (solid green background with text inside).
- **Bottom Navigation Bar:** Fixed at the bottom of the screen.
  - Items: Home (active, green house), Trade, Option, Trust, Assets.

### Screenshot 2: Assets Page (Mobile)
**Overall Page Structure:** Wallet overview with sub-account segmentation.
- **Top Bar:** 
  - Full width input-like box with a star icon on the left, App name in the center, and a refresh icon on the right.
- **Header Section:** Centered text "Assets".
- **Sub-navigation Tabs:** 
  - "Currency Account" (Active, distinct green background), "Contract Account", "Options Account".
- **Total Assets Block:**
  - Label: "Total Assets(USDT)" with an Eye icon (toggle visibility) on the right.
  - Values: Large "0.0000", secondary "≈0.0000 USD".
  - Footer: UID text (e.g., "UID: 621154").
- **Currency Account Card (Main Wallet Box):**
  - Dark gray elevated card.
  - Label: "Asset valuations (USDT)".
  - Green Tag on top right corner: "Currency Account".
  - Values: Large green text "0.0000", secondary "≈0.0000 USD".
  - Action Buttons (Horizontal Row): Deposit, Withdraw, Transfer (each with a specific green-tinted icon).
- **Assets List Header:**
  - Search icon + "Search" placeholder on the left.
  - "Hide small assets" text + circular toggle on the right.
- **Asset List Items (BTC, ETH):**
  - Left: Coin Logo + Ticker (e.g., BTC).
  - Right: Total balance (e.g., "0.00000000") and fiat equivalent ("≈0.0000 USD").
  - Bottom: "Available 0.00000000" and "On orders 0.00000000".
- **Bottom Navigation Bar:** Same as the Home page, but "Assets" is the active tab.

---

## 3. Existing Project Analysis

### Frontend Architecture
- The application uses **Next.js (App Router)** with a `src/app` directory.
- Current styling relies heavily on **Tailwind CSS** and **shadcn/ui**.
- The existing Home page (`/page.tsx`) consists of numerous large landing-page sections (Hero, PlatformMetrics, TradingExperience, etc.) designed for a traditional website layout, *not* an app-like dashboard layout.
- The existing Wallet page (`/wallet/page.tsx`) uses a standard dashboard layout with a sidebar (on desktop) and standard data tables.
- **Missing Architecture:** The project currently lacks a global **Bottom Navigation Bar** for mobile devices. The current mobile navigation relies on a hamburger menu inside the top `Header`.

### Functional Status
- **Authentication/UID:** Handled via `authStore` and Cloudflare backend. User IDs exist and can be mapped to the UID display.
- **Wallet Balances:** Handled via `apiClient.getWalletBalance()` and `AssetTable.tsx`. Real data exists.
- **Market Data:** WebSocket connections provide live ticker data.
- **Actions:** Deposit, Withdraw, and Transfer flows already exist as modals/forms in the system.

---

## 4. Feature Gap Analysis & Implementation Requirements

### Missing Feature 1: Global Mobile Bottom Navigation
- **Gap:** No fixed bottom tab bar for mobile users.
- **Requirement:** Create a `<BottomNavigation />` component that appears only on `md:hidden` screens. It must include icons mapping to Home (`/`), Trade (`/trade`), Options/P2P (`/p2p`), Trust/Support (`/support`), and Assets (`/wallet`). It must be fixed to the bottom and persist across main pages.

### Missing Feature 2: App-like Mobile Home Page Layout
- **Gap:** The current mobile home page is a long scrolling landing page. The screenshot shows a highly dense, app-like dashboard.
- **Requirement:** We must implement a responsive conditional render on the Home page. On mobile (`md:hidden`), we will display a new `<MobileHomeDashboard />` component that exactly mimics the screenshot:
  1. Custom Top Bar (Profile, Logo, Bell).
  2. Hero Banner Slider.
  3. 3-Column Top Markets Grid.
  4. 5-Column Quick Actions Grid.
  5. Gainers Table with pill-shaped headers and colored percentage boxes.

### Missing Feature 3: App-like Mobile Assets Page Layout
- **Gap:** The current `/wallet` page uses a standard table (`AssetTable.tsx`) and a basic header. The screenshot demands a card-based layout with a specific sub-account tab system.
- **Requirement:** We must implement a `<MobileWalletDashboard />` component that triggers on `md:hidden` on the `/wallet` page:
  1. Custom Top Bar (Search/Refresh style).
  2. Tab system (Currency, Contract, Options - even if Contract/Options are "Coming Soon" or mapped to specific internal portfolios).
  3. Total Assets Overview block with UID.
  4. Elevated Currency Account Card with Deposit/Withdraw/Transfer action buttons.
  5. Search and "Hide small assets" toggle.
  6. Card-based list for individual assets (BTC, ETH) showing Available and On Orders balances.

---

## 5. Implementation Strategy (Do NOT Remove Existing Functionality)

**Golden Rule:** We will NOT delete the desktop components (`Hero`, `AssetTable`, `WalletHeader`, etc.). We will use Tailwind CSS responsive classes (`hidden md:block` and `block md:hidden`) to serve the new App-like mobile experience alongside the existing Desktop experience.

### Phase 1: Core Layout Components
- Create `BottomNavigation.tsx`.
- Update `app/layout.tsx` or main wrapping layouts to include the `BottomNavigation` safely above the bottom of the viewport on mobile devices.

### Phase 2: Mobile Home Dashboard (`/app/page.tsx`)
- Create `MobileHomeDashboard.tsx`.
- Implement all sub-sections (Banner, Markets Grid, Quick Actions, Gainers Table).
- Connect Gainers table to existing live ticker WebSocket data.
- Wrap existing `Home` sections in `hidden md:flex`.

### Phase 3: Mobile Assets Dashboard (`/app/wallet/page.tsx`)
- Create `MobileWalletDashboard.tsx`.
- Connect to existing `useWalletStore` or `apiClient.getWalletBalance()`.
- Implement the Total Assets Block, Action Buttons (triggering existing Deposit/Withdraw modals), and the individual Coin Cards.

### Phase 4: Styling and Spacing Parity
- Use precise Tailwind utility classes to match the dark theme (`bg-[#121212]` or similar), text sizing, border radii, and specific green accent colors (`text-[#00C087]`, `bg-[#00C087]`) shown in the screenshots.

---

## 6. Testing & Validation Plan
1. **Visual Parity:** Verify on mobile simulation (375px / 390px) that the exact element ordering, padding, and font weights match the screenshots.
2. **Functional Data:** Verify that wallet balances and UID are real data fetched from the backend.
3. **Regression Testing:** Verify that Desktop mode is entirely untouched and functions perfectly as it did before.
4. **Interaction Testing:** Verify that Deposit/Withdraw buttons on the new mobile UI successfully open the existing forms/modals.
