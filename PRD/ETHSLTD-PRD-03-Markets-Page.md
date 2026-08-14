Yes. I have treated the **Homepage as completed and frozen as the baseline**, including its current navigation, theme system, mock-market architecture, responsive behavior, Tawk.to, Cloudflare/GitHub setup, and current visual language.

For the **next development step**, I recommend building the **ETHSLTD Markets page**.

This is the most consistent next step because the homepage already contains:

* `Markets` navigation
* `Explore Markets`
* live market ticker
* markets table
* mock market data
* trading CTA
* dark/light theme
* reusable market components

So we can extend what already exists instead of introducing an unrelated subsystem.

# ETHSLTD — Markets Page

## Complete Production-Ready PRD

**Document Type:** Product Requirements Document
**Product:** ETHSLTD Crypto Trading Platform
**Module:** Public Markets
**Route:** `/markets`
**Current Development Stack:** Next.js + TypeScript + Tailwind CSS + shadcn/ui
**Deployment Target:** Cloudflare Workers/OpenNext
**Current Data Source:** Mock market provider
**Future Data Source:** ETHSLTD Market Data API
**Authentication:** Not required to browse markets
**Trading Execution:** Not implemented in this step
**Status:** Ready for development

---

# 1. Purpose

The ETHSLTD Markets page will be the primary public market-discovery interface of the platform.

It should allow users to:

* discover available crypto assets
* view current market prices
* compare 24h performance
* search markets
* filter markets
* sort markets
* view trading pairs
* view market statistics
* open an individual market
* navigate to trading
* add markets to a watchlist
* understand market trends
* discover popular/top-performing assets

The page must be designed so that the current mock data can later be replaced with real-time backend market data **without redesigning the frontend**.

---

# 2. Relationship With Existing Homepage

The Markets page must be a direct continuation of the existing ETHSLTD homepage.

The homepage currently uses:

> **Trade Crypto With Clarity.**

The Markets page should continue that visual and product philosophy:

> **Explore Markets With Clarity.**

Do not create a completely different design language.

It must reuse:

* existing header
* announcement bar
* footer
* theme system
* typography
* buttons
* cards
* spacing
* borders
* semantic colors
* responsive breakpoints
* existing market data structures where possible
* existing logo/branding

---

# 3. Existing Navigation

The current homepage header contains:

```text
ETHSLTD

Markets
Trade
P2P
Assets
Learn
More ▼

Search
Theme Toggle
Log In
Sign Up
```

The Markets navigation item must point to:

```text
/markets
```

It should visually indicate the active page.

Example:

```text
Markets
^^^^^^^
Active
```

Do not introduce a second header design.

---

# 4. URL Structure

Primary route:

```text
/markets
```

Future market detail route:

```text
/markets/[symbol]
```

Examples:

```text
/markets/BTC-USDT
/markets/ETH-USDT
/SOL-USDT
```

Recommended canonical structure:

```text
/markets/BTC-USDT
```

not:

```text
/markets/btc/usdt
```

This keeps routing simple and future API integration cleaner.

---

# 5. Page Structure

The complete page should follow this structure:

```text
Announcement Bar
        ↓
Global Header
        ↓
Markets Hero
        ↓
Market Overview Statistics
        ↓
Market Search & Filters
        ↓
Market Category Tabs
        ↓
Markets Table
        ↓
Trending Markets
        ↓
Top Gainers / Top Losers
        ↓
Market Information
        ↓
CTA
        ↓
Footer
```

---

# 6. Announcement Bar

Reuse the homepage announcement bar.

Current style:

> **ETHSLTD Markets are live — Explore the latest digital assets →**

The announcement bar should remain consistent across public pages.

Allow closing it.

When closed:

* hide it
* remember the preference locally
* do not show it again during the same browser session

---

# 7. Header

Reuse the exact existing header component.

Required:

* ETHSLTD logo
* Markets
* Trade
* P2P
* Assets
* Learn
* More
* Search icon
* theme toggle
* Log In
* Sign Up
* mobile menu

### Active state

Markets must receive an active visual state.

Example:

```text
Markets
```

with:

* brighter foreground
* subtle brand accent
* optional bottom indicator

Do not over-design the active state.

---

# 8. Markets Hero

Hero heading:

# Explore Crypto Markets

Supporting copy:

> Discover digital assets, compare market performance, and find the markets that match your trading strategy.

Alternative shorter version:

> Track prices, trends, volume, and performance across the ETHSLTD digital-asset markets.

Primary CTA:

**Start Trading**

Secondary CTA:

**Try Demo Trading**

---

# 9. Hero Market Snapshot

The hero should contain a compact market overview.

Example:

```text
Global Crypto Market

Total Markets
100+

24h Volume
$2.84T

BTC Dominance
58.4%

Market Sentiment
Neutral
```

These are currently mock values.

Do not present fabricated information as genuine live data.

During mock-data development, the implementation should support a subtle:

```text
Demo Data
```

indicator where appropriate.

---

# 10. Market Statistics

Create a responsive statistics row.

Cards:

### Total Markets

```text
100+
Markets
```

### 24h Volume

```text
$2.84T
24h Volume
```

### BTC Dominance

```text
58.4%
BTC Dominance
```

### Active Assets

```text
50+
Assets
```

### Market Status

```text
24/7
Markets Open
```

The exact numerical values should come from the market-data provider.

Do not hard-code values inside UI components.

---

# 11. Market Search

A prominent search field must be provided.

Placeholder:

> Search markets or assets

Users should be able to search:

```text
BTC
Bitcoin
BTC/USDT
ETH
Ethereum
SOL
Solana
```

Search should match:

* symbol
* base asset
* quote asset
* asset name

Example:

Searching:

```text
bitcoin
```

returns:

```text
BTC/USDT
BTC/USD
BTC/USDC
```

---

# 12. Search Behavior

Search should:

* update instantly
* be case-insensitive
* trim whitespace
* support partial matches
* display a clear button
* show no-result state
* preserve accessibility
* work on mobile

Keyboard shortcut:

```text
/
```

should focus the market search field when the page is not inside another text input.

Optional future shortcut:

```text
Ctrl/Cmd + K
```

for global search.

Do not implement a complex global search system in this step unless it already exists.

---

# 13. Market Categories

Provide tabs:

```text
All
Favorites
USDT
USDC
USD
BTC
ETH
New
```

Depending on supported quote currencies, additional categories can be added later.

### Default

```text
All
```

must be selected.

---

# 14. Favorites

Users should be able to favorite a market.

Unauthenticated users:

* store favorites locally
* use `localStorage`

Authenticated users later:

* synchronize favorites with their account

This is important because we do not yet have the authentication/backend system.

Do not create fake server-side favorites.

---

# 15. Favorite Icon

Each market row should have:

```text
☆ 
```

Unselected.

Selected:

```text
★
```

Use an accessible button.

Tooltip:

> Add to favorites

or:

> Remove from favorites

---

# 16. Markets Table

The main component of the page is the Markets Table.

Desktop columns:

| Column     | Purpose                           |
| ---------- | --------------------------------- |
| Favorite   | Watchlist                         |
| Market     | Trading pair                      |
| Price      | Current price                     |
| 24h Change | Percentage change                 |
| 24h High   | Highest price                     |
| 24h Low    | Lowest price                      |
| 24h Volume | Trading volume                    |
| Market Cap | Asset market cap where applicable |
| Chart      | Mini price chart                  |
| Action     | Trade/View                        |

Example:

```text
★  BTC/USDT
   Bitcoin

$104,284.32

+2.41%

$105,920.10

$101,842.12

$48.2B

$2.08T

╱╲╱╲╱╲

Trade
```

---

# 17. Market Row Interaction

Clicking the market name should open:

```text
/markets/BTC-USDT
```

Clicking:

**Trade**

should navigate to:

```text
/trade/BTC-USDT
```

However, because the Trade module is not yet implemented, the application should not navigate to a broken page.

During this development step:

* either route to a controlled placeholder
* or use a clearly defined future route handler

Preferred:

```text
/trade/BTC-USDT
```

with a proper:

> Trading terminal coming soon.

placeholder only if the Trade page does not yet exist.

---

# 18. Price Formatting

Prices must use asset-specific precision.

Examples:

```text
BTC
$104,284.32

ETH
$3,842.15

DOGE
$0.1824

SHIB
$0.00001234
```

Never assume every asset uses two decimal places.

Future configuration:

```text
pricePrecision
quantityPrecision
quotePrecision
```

---

# 19. Percentage Formatting

Positive:

```text
+2.41%
```

Negative:

```text
-3.18%
```

Zero:

```text
0.00%
```

Use semantic success/danger styling, but ensure the values remain readable in both themes.

Do not rely on color alone.

---

# 20. 24h High / Low

Show:

```text
24h High
$105,920.10

24h Low
$101,842.12
```

For mobile, these columns may be hidden or moved into an expandable row.

---

# 21. Volume

Display:

```text
$48.2B
```

instead of:

```text
$48,200,000,000
```

Use a reusable formatter.

Examples:

```text
1.2K
5.4M
8.7B
2.1T
```

The exact precision should be consistent across the application.

---

# 22. Mini Chart / Sparkline

Each market row should include a small sparkline.

Requirements:

* lightweight
* no unnecessary axis labels
* no heavy chart library for every row
* responsive
* visually clean
* positive/negative trend indication
* accessible alternative text

The homepage already contains sparkline logic, so **reuse that implementation rather than creating a second incompatible chart system**.

---

# 23. Sorting

Users must be able to sort by:

* Market
* Price
* 24h Change
* 24h High
* 24h Low
* 24h Volume
* Market Cap

Clicking once:

```text
Ascending
```

Clicking again:

```text
Descending
```

Clicking again:

```text
Default
```

Use clear sorting indicators.

---

# 24. Default Sorting

Default:

```text
24h Volume
Descending
```

This puts the most active markets first.

Alternative acceptable default:

```text
Market popularity
```

if the future API provides a ranking.

---

# 25. Trending Markets

Below the primary market table, show:

# Trending Markets

Cards:

```text
BTC/USDT
$104,284
+2.41%

ETH/USDT
$3,842
+1.83%

SOL/USDT
$182
+5.27%
```

Each card should include:

* asset icon
* pair
* price
* 24h change
* mini chart
* View Market
* Trade

---

# 26. Top Gainers

Section:

# Top Gainers

Display the strongest positive 24h performers.

Example:

```text
SOL/USDT    +8.42%
AVAX/USDT   +7.18%
LINK/USDT   +6.94%
```

Use mock data now.

Future:

```text
MarketDataProvider.getTopGainers()
```

---

# 27. Top Losers

Section:

# Top Losers

Example:

```text
XYZ/USDT    -8.21%
ABC/USDT    -6.92%
DEF/USDT    -5.84%
```

Use the same reusable market-card component.

---

# 28. New Listings

Add a section:

# New on ETHSLTD

Each item can display:

```text
NEW

Asset
Pair
Launch date
Price
24h change
```

This prepares the UI for future listing announcements.

Do not claim an asset is actually newly listed unless backend data confirms it.

---

# 29. Empty States

Every filter/search state needs an empty state.

Example:

> No markets found

Supporting text:

> Try searching for another asset or trading pair.

Button:

> Clear Search

Favorites empty state:

> Your favorite markets will appear here.

CTA:

> Explore All Markets

---

# 30. Loading State

Use skeleton loaders.

Do not display a blank page while data loads.

Skeletons required for:

* market statistics
* table rows
* charts
* trending cards
* gainers
* losers

Example:

```text
████████
████
██████████
```

Use the existing ETHSLTD skeleton style if one exists.

---

# 31. Error State

If market data fails:

```text
Unable to load market data
```

Supporting text:

> We couldn't retrieve the latest market information. Please try again.

Button:

**Retry**

Do not display stale/mock values as if they are live data after a production API failure.

---

# 32. Demo Data Mode

Because backend market infrastructure is not yet implemented, the application should support:

```text
DATA_MODE = mock
```

The architecture should allow:

```text
DATA_MODE = live
```

later.

Recommended abstraction:

```text
MarketDataProvider
```

Implement:

```text
MockMarketDataProvider
```

Now.

Later:

```text
LiveMarketDataProvider
```

---

# 33. Market Data Model

Create a shared TypeScript type.

Conceptually:

```text
Market
├── id
├── symbol
├── baseAsset
├── quoteAsset
├── name
├── icon
├── price
├── priceChange24h
├── high24h
├── low24h
├── volume24h
├── quoteVolume24h
├── marketCap
├── sparkline
├── status
├── isNew
└── updatedAt
```

Do not place market objects directly inside JSX.

---

# 34. Data Provider Architecture

Recommended:

```text
lib/
└── market-data/
    ├── types.ts
    ├── provider.ts
    ├── mock-provider.ts
    └── index.ts
```

Later:

```text
lib/
└── market-data/
    ├── types.ts
    ├── provider.ts
    ├── mock-provider.ts
    ├── live-provider.ts
    └── index.ts
```

This is critical for future compatibility with the trading engine.

---

# 35. URL Query State

Filters should be reflected in the URL where appropriate.

Example:

```text
/markets?category=USDT
```

Search:

```text
/markets?search=btc
```

Sorting:

```text
/markets?sort=volume&direction=desc
```

This allows:

* browser refresh
* shareable filtered views
* back/forward navigation
* SEO-friendly public URLs

Avoid putting unnecessary UI state into the URL.

---

# 36. Pagination

For the initial mock dataset:

```text
20 markets/page
```

Desktop:

```text
20
```

Mobile:

```text
10–20
```

Future backend should support server-side pagination.

API-ready model:

```text
items
page
pageSize
total
hasNext
```

---

# 37. Responsive Design

### Desktop

Full table:

```text
Market
Price
24h
High
Low
Volume
Market Cap
Chart
Trade
```

### Tablet

Reduce:

```text
High
Low
Market Cap
```

### Mobile

Use compact cards or expandable rows:

```text
BTC/USDT

$104,284.32
+2.41%

24h Volume
$48.2B

[View]
```

Do not force a 10-column table onto a mobile screen.

---

# 38. Mobile Filters

On mobile:

```text
[ Search markets ]

[ All ▼ ] [ Sort ▼ ] [ Filter ]
```

Opening Filter:

```text
Categories

○ All
○ Favorites
○ USDT
○ USDC
○ USD
○ BTC
○ ETH
○ New
```

Use a bottom sheet or modal consistent with existing UI components.

---

# 39. Global Search Integration

The header search icon already exists.

Do not create an unrelated second search system.

If global search functionality is not yet implemented, clicking the header search can eventually open:

```text
Search ETHSLTD
```

with:

```text
Markets
Assets
Pages
Learn
```

For this step, the Markets page search is sufficient.

---

# 40. Theme Support

The Markets page must support:

### Dark Mode

Primary platform experience.

### Light Mode

Already implemented globally.

Never introduce:

```text
bg-black
text-white
```

where semantic tokens are available.

Use the project's existing tokens:

```text
background
foreground
card
muted
border
primary
brand
```

The light/dark implementation already completed on the homepage must remain untouched.

---

# 41. Accessibility

Target:

**WCAG 2.2 AA**

Requirements:

* keyboard navigation
* visible focus states
* semantic buttons
* semantic tables
* screen-reader labels
* sufficient contrast
* no color-only status indicators
* accessible sorting controls
* accessible favorite controls
* accessible search
* accessible dialogs
* reduced-motion support

---

# 42. Performance

The Markets page should be lightweight.

Requirements:

* no unnecessary client components
* server-render static content where possible
* lazy-load heavy chart functionality
* virtualize only when market count requires it
* avoid rendering unnecessary charts
* minimize JavaScript
* optimize asset icons
* avoid large image files

For the initial 20–100 markets, standard rendering is acceptable.

---

# 43. SEO

Page title:

> Crypto Markets | ETHSLTD

Meta description:

> Explore crypto markets on ETHSLTD. Track digital asset prices, 24h performance, volume, market trends, and trading opportunities.

Canonical:

```text
/markets
```

Open Graph:

```text
ETHSLTD Crypto Markets
```

Twitter/X card:

```text
summary_large_image
```

Structured data should only be added where appropriate and factually supported.

---

# 44. Security

Even though this is currently a public page:

Never trust:

* URL parameters
* market symbols
* sort values
* category values
* search values

Validate them.

For example:

```text
category
```

must only accept known categories.

Do not allow arbitrary query parameters to reach database queries later.

---

# 45. No Financial Claims

The Markets page must not make unsupported claims such as:

> Guaranteed profits

> Best returns

> Risk-free investment

> Guaranteed execution

> Zero-risk trading

The existing homepage wording should also remain consistent with this principle.

Demo trading can be described as:

> Risk-free simulation

because no real money is involved.

---

# 46. Market Risk Disclaimer

A small informational disclaimer should appear near the market data/footer area:

> Crypto markets are volatile. Prices and market data can change rapidly. Market information is provided for informational purposes and does not constitute financial advice.

The exact legal language should eventually be reviewed for the jurisdictions in which ETHSLTD operates.

---

# 47. Market Detail Navigation

Each market should have:

```text
View Market
```

which will eventually open:

```text
/markets/BTC-USDT
```

The detail page is **not part of this PRD**.

The route should nevertheless be designed now so that the architecture does not need restructuring later.

---

# 48. Trading CTA

Every market row should have:

```text
Trade
```

Behavior:

If Trade module exists:

```text
/trade/BTC-USDT
```

If it does not:

show the controlled placeholder rather than a 404.

Do not implement trading execution inside the Markets page.

---

# 49. Demo Trading CTA

Include:

```text
Try Demo Trading
```

It should eventually navigate to:

```text
/trade/BTC-USDT?mode=demo
```

or:

```text
/demo-trading
```

The exact final route should be standardized when the trading module is implemented.

For now, do not implement virtual balance logic in the Markets module.

---

# 50. Components

Recommended structure:

```text
components/
└── markets/
    ├── markets-hero.tsx
    ├── market-stats.tsx
    ├── market-search.tsx
    ├── market-tabs.tsx
    ├── markets-table.tsx
    ├── market-row.tsx
    ├── market-sparkline.tsx
    ├── market-card.tsx
    ├── trending-markets.tsx
    ├── top-gainers.tsx
    ├── top-losers.tsx
    ├── new-listings.tsx
    ├── market-empty-state.tsx
    ├── market-error-state.tsx
    └── market-skeleton.tsx
```

Reuse existing generic components rather than duplicating them.

---

# 51. Suggested Page Structure

```text
app/
└── markets/
    └── page.tsx
```

The page should compose:

```text
<AnnouncementBar />

<Header />

<main>

  <MarketsHero />

  <MarketStats />

  <MarketExplorer>
      <MarketSearch />
      <MarketTabs />
      <MarketsTable />
  </MarketExplorer>

  <TrendingMarkets />

  <TopGainers />

  <TopLosers />

  <NewListings />

  <MarketInformation />

  <MarketsCTA />

</main>

<Footer />

<TawkChat />
```

The actual project may already render announcement/header/footer through the root layout. If so, **do not duplicate them**.

---

# 52. State Management

Do not introduce Zustand for simple local table state if React state is sufficient.

Use:

```text
React state
```

for:

* search
* current tab
* sort
* mobile filter modal

Use existing Zustand infrastructure only where genuinely shared state is required.

TanStack Query should eventually manage live server market data.

For mock data:

```text
MockMarketDataProvider
```

is sufficient.

---

# 53. Live Data Readiness

The architecture must eventually support:

```text
Initial REST snapshot
        ↓
WebSocket market updates
        ↓
UI state
```

Not:

```text
GET /markets
GET /markets
GET /markets
GET /markets
```

every 500 ms.

The Markets page should therefore not be designed around polling.

---

# 54. Future WebSocket Data

Eventually the page can subscribe to:

```text
/ws/markets
```

or:

```text
/ws/market-ticker
```

Events could include:

```text
ticker.update
market.updated
market.listed
market.status_changed
```

This is future infrastructure, not part of the current mock implementation.

---

# 55. Market Status

Support:

```text
TRADING
HALTED
MAINTENANCE
COMING_SOON
```

For example:

```text
BTC/USDT
Trading
```

If halted:

```text
Trading Halted
```

The Trade button should become disabled.

---

# 56. Favorite Persistence

For current unauthenticated implementation:

```text
localStorage
```

Example conceptual key:

```text
ethsltd:market-favorites
```

Do not store sensitive information there.

Future authenticated architecture:

```text
User
 ↓
Watchlist
 ↓
Market IDs
```

---

# 57. Market Icons

Use consistent asset icons.

Do not download huge random PNG files.

Preferred hierarchy:

1. Existing ETHSLTD asset icon system
2. Optimized SVG
3. WebP/AVIF where appropriate
4. Remote provider only if legally/licensing appropriate

Fallback:

```text
BTC
```

inside a simple generated avatar.

---

# 58. Market Table Accessibility

Use actual semantic table markup where practical:

```text
<table>
<thead>
<tbody>
<tr>
<th>
<td>
```

Do not construct the entire desktop table from arbitrary `<div>` elements.

On mobile, a separate responsive representation is acceptable.

---

# 59. Animation

Use subtle motion only.

Allowed:

* row price update
* hover
* chart transition
* tab transition
* skeleton shimmer
* modal transition

Avoid:

* excessive particles
* flashing prices
* aggressive gradients
* continuous background animation

Respect:

```text
prefers-reduced-motion
```

---

# 60. Price Update Animation

When a price changes:

```text
$104,284.32
```

→

```text
$104,291.08
```

the number may briefly animate.

But don't make the entire row flash.

This is particularly important when live WebSocket data is later introduced.

---

# 61. Mock Data Requirements

Create at least:

```text
BTC/USDT
ETH/USDT
SOL/USDT
BNB/USDT
XRP/USDT
ADA/USDT
DOGE/USDT
AVAX/USDT
LINK/USDT
DOT/USDT
MATIC/USDT
LTC/USDT
TRX/USDT
SHIB/USDT
UNI/USDT
ATOM/USDT
```

At least 20 markets should be available to test:

* scrolling
* sorting
* pagination
* searching
* filtering
* favorites

All values must clearly be treated as mock/demo data until a live provider is connected.

---

# 62. Test Scenarios

### Search

```text
BTC
```

Expected:

```text
BTC/USDT
BTC/USD
...
```

### Search by name

```text
Bitcoin
```

Expected BTC markets.

### Search no result

```text
ABCDEFG
```

Expected:

> No markets found.

### Sort

Click:

```text
24h Change
```

Expected highest/lowest ordering.

### Favorite

Click star.

Expected:

```text
★
```

Refresh page.

Expected favorite persists locally.

### Category

Select:

```text
USDT
```

Expected only USDT pairs.

### Theme

Switch dark → light.

Expected no broken contrast.

### Mobile

Expected:

* no horizontal page overflow
* filters usable
* table/card readable
* buttons accessible

---

# 63. Browser Compatibility

Support current:

* Chrome
* Edge
* Firefox
* Safari

Mobile:

* Chrome Android
* Safari iOS

Do not target obsolete browsers.

---

# 64. Analytics Events

Prepare event names without exposing sensitive information.

Suggested:

```text
markets_page_view
market_search
market_filter
market_sort
market_favorite_added
market_favorite_removed
market_view
market_trade_click
demo_trading_click
```

Do not send:

* passwords
* private keys
* authentication tokens
* KYC information
* wallet balances unless explicitly required and privacy-reviewed

---

# 65. Error Logging

Errors should eventually integrate with the project's monitoring system.

Log:

```text
market_data_error
market_render_error
market_route_error
```

Do not log sensitive user information.

---

# 66. Footer

Reuse the existing homepage footer exactly.

No new footer design.

Relevant links:

```text
Markets
Trade
P2P
Assets
Learn
About
Security
Fees
Support
Terms
Privacy
Risk Disclosure
```

Only show links whose pages actually exist.

Do not create dead links unnecessarily.

---

# 67. Tawk.to

Keep the already implemented global Tawk.to integration.

The Markets page must inherit it from the global layout.

Do **not** add another Tawk script to the Markets page.

---

# 68. Back-to-Top

Reuse the existing Back-to-Top component if it is globally implemented.

Do not create a second one.

---

# 69. Theme Toggle

Reuse the existing `next-themes` implementation.

No separate page-specific theme state.

---

# 70. Code Quality

Requirements:

* TypeScript strict mode
* no unnecessary `any`
* reusable components
* no duplicated market logic
* no hard-coded production API URLs
* no secrets in source
* no inline financial calculations using unsafe floating-point arithmetic
* clean naming
* ESLint
* formatting
* type checking

---

# 71. Important Financial Calculation Rule

Although this page does not execute trades, future financial logic must never be implemented with ordinary JavaScript floating-point arithmetic.

For example, do not build financial logic around:

```text
0.1 + 0.2
```

The future trading/ledger system must use exact decimal or integer smallest-unit representations.

The Markets page only displays provider values.

---

# 72. Cloudflare Compatibility

The implementation must remain compatible with the planned architecture:

```text
GitHub
   ↓
Next.js
   ↓
OpenNext
   ↓
Cloudflare Workers
```

Do not introduce:

* Node-only APIs that cannot run in the target runtime
* filesystem-dependent runtime logic
* unsupported server dependencies
* long-running processes
* local-only services

Static assets should remain optimized for Cloudflare deployment.

---

# 73. No Database Required Yet

For this Markets-page step:

```text
D1 = NOT REQUIRED
R2 = NOT REQUIRED
Durable Objects = NOT REQUIRED
Queues = NOT REQUIRED
```

Use:

```text
MockMarketDataProvider
```

This keeps development fast and free.

The architecture remains ready for the future backend.

---

# 74. Recommended Directory Structure

Because the current project is already using:

```text
apps/web
```

continue with it.

Recommended:

```text
apps/web/

├── app/
│   └── markets/
│       └── page.tsx
│
├── components/
│   └── markets/
│       ├── markets-hero.tsx
│       ├── market-stats.tsx
│       ├── market-search.tsx
│       ├── market-tabs.tsx
│       ├── markets-table.tsx
│       ├── market-row.tsx
│       ├── market-card.tsx
│       ├── market-sparkline.tsx
│       ├── trending-markets.tsx
│       ├── top-gainers.tsx
│       ├── top-losers.tsx
│       ├── new-listings.tsx
│       ├── market-skeleton.tsx
│       └── market-empty-state.tsx
│
├── lib/
│   └── market-data/
│       ├── types.ts
│       ├── provider.ts
│       ├── mock-provider.ts
│       └── index.ts
│
├── public/
│   └── assets/
│
└── types/
```

Do not restructure the entire repository for this page.

---

# 75. Acceptance Criteria

The Markets page is considered complete only when:

### UI

* [ ] `/markets` works
* [ ] Existing ETHSLTD header is reused
* [ ] Existing footer is reused
* [ ] Existing announcement bar is reused
* [ ] Active Markets navigation works
* [ ] Dark mode works
* [ ] Light mode works
* [ ] Mobile navigation works
* [ ] Responsive layout works

### Market functionality

* [ ] Market search works
* [ ] Category filters work
* [ ] Favorites work
* [ ] Sorting works
* [ ] Pagination works
* [ ] Market rows are clickable
* [ ] Market charts display
* [ ] Top gainers display
* [ ] Top losers display
* [ ] Trending markets display
* [ ] New listings section displays
* [ ] Empty state works
* [ ] Error state works
* [ ] Loading state works

### Architecture

* [ ] Mock provider is isolated
* [ ] Market type is centralized
* [ ] No market data duplicated across components
* [ ] Live provider can replace mock provider later
* [ ] No database required
* [ ] Cloudflare-compatible
* [ ] TypeScript passes
* [ ] ESLint passes
* [ ] Production build passes

### Accessibility

* [ ] Keyboard navigation
* [ ] Focus states
* [ ] Screen-reader labels
* [ ] Table semantics
* [ ] Accessible search
* [ ] Accessible favorite button
* [ ] Accessible sorting
* [ ] Reduced-motion support

### Performance

* [ ] No unnecessary heavy dependencies
* [ ] No excessive client-side rendering
* [ ] No unnecessary polling
* [ ] Charts optimized
* [ ] No layout shift caused by market cards
* [ ] Mobile performance tested

---

# 76. Definition of Done

The developer should not mark the task complete merely because the page visually exists.

It is complete when:

```text
Homepage
    ↓
Markets
    ↓
Search
    ↓
Filter
    ↓
Sort
    ↓
Favorite
    ↓
Market View
    ↓
Trade CTA
```

works coherently and the Markets page feels like a **native part of ETHSLTD**, not a separate template.

---

# 77. What Must NOT Be Built in This PRD

To keep the project consistent, do **not** implement these in the Markets task:

```text
❌ User registration
❌ Login
❌ KYC
❌ Wallet
❌ Deposits
❌ Withdrawals
❌ Real-money trading
❌ Matching engine
❌ Order book execution
❌ Ledger
❌ P2P escrow
❌ P2P chat
❌ Contract signing
❌ Admin trading management
❌ Real custody
```

Those belong to later modules.

The Markets page should only provide **market discovery and navigation**.

---

# 78. Final UX Flow

The final user experience should be:

```text
ETHSLTD Homepage
       │
       │ Click "Markets"
       ▼
┌──────────────────────────┐
│      Explore Markets     │
│                          │
│ Search markets           │
│                          │
│ All | Favorites | USDT   │
└────────────┬─────────────┘
             │
             ▼
       Markets Table
             │
     ┌───────┼────────┐
     │       │        │
     ▼       ▼        ▼
   Search   Sort    Favorite
     │
     ▼
  BTC/USDT
     │
     ├── View Market
     │
     └── Trade
            │
            ▼
       Future Trade Page
```

---

# 79. Important Consistency Rule

**Do not modify the completed homepage just to build Markets.**

Only make a homepage change if it is technically required to connect:

```text
Markets → /markets
```

or to share an existing reusable component.

The following should remain unchanged unless a genuine bug is discovered:

* Hero
* homepage copy
* homepage layout
* dark/light system
* header design
* footer design
* Tawk.to
* Back-to-Top
* existing market ticker
* existing brand styling

The homepage is now the **visual source of truth** for all subsequent public pages.

---

# 80. Final Technical Direction

The project should remain:

```text
ETHSLTD
│
├── Next.js
├── TypeScript
├── Tailwind CSS
├── shadcn/ui
├── next-themes
├── Zustand where required
├── TanStack Query when API data begins
├── Lightweight Charts
│
└── Cloudflare-compatible
```

Current market data:

```text
MockMarketDataProvider
```

Future:

```text
                    MarketDataProvider
                           │
             ┌─────────────┴─────────────┐
             │                           │
       Mock Provider                Live Provider
             │                           │
        Development                Production
```

This is the key architectural decision that will prevent the Markets page from becoming disposable work.

---

## Recommended development instruction to give your developer

You can give the developer this exact instruction:

> **Build the complete ETHSLTD `/markets` page according to the attached Markets Page PRD. The existing homepage is completed and must be treated as the visual and architectural source of truth. Reuse the existing header, announcement bar, footer, theme system, Tawk.to integration, Back-to-Top component, design tokens, typography, buttons, market/sparkline components and existing project conventions wherever applicable. Do not redesign or break the homepage. Implement the Markets page using a clean `MarketDataProvider` abstraction with mock data for now. Do not implement authentication, wallet, trading execution, P2P, KYC, ledger, or other backend systems in this task. The implementation must remain compatible with the planned Next.js + Cloudflare Workers/OpenNext architecture and must be ready for a future live market-data provider without requiring a frontend rewrite. Test desktop, tablet, mobile, dark mode, light mode, search, filters, favorites, sorting, pagination, loading, empty and error states before considering the task complete.**

### Final sequence from here

The public application can now naturally grow as:

```text
✅ Homepage
      ↓
➡️ Markets        ← NEXT
      ↓
Market Detail
      ↓
Authentication
      ↓
User Dashboard
      ↓
Trading Terminal
      ↓
Wallet
      ↓
P2P
      ↓
Contracts / KYC / Risk / Admin
```

But for **this immediate development task**, only `/markets` should be implemented. This keeps the codebase lightweight while preserving the architecture we already established for ETHSLTD.
