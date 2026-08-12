# ETHSLTD Crypto — Web Home Page PRD

**Document Type:** Product Requirements Document
**Product:** ETHSLTD Crypto Trading Platform
**Scope:** Public Web Homepage only
**Status:** Development-ready
**Primary Objective:** Design and build the complete ETHSLTD Crypto homepage before implementing any internal trading, wallet, P2P, KYC, admin, or account pages.

---

## 1. Homepage Purpose

The ETHSLTD homepage is the primary public-facing entry point of the platform.

It must communicate, within the first few seconds:

* What ETHSLTD Crypto is.
* That users can discover and trade digital assets.
* That the platform supports spot/crypto trading.
* That users can access markets and real-time market information.
* That ETHSLTD provides a secure, professional trading environment.
* That users can start with either **Paper Trading** or **Live Trading**, subject to account eligibility and availability.
* That the platform has supporting products such as P2P, wallet services, contracts, and mobile access.
* That ETHSLTD is designed for both new and experienced traders.

The homepage should feel like a **professional global financial/trading platform**, not a generic crypto landing page.

---

# 2. Homepage Experience Direction

### Design personality

The homepage must be:

* Premium
* Financial
* Modern
* Technical
* Trustworthy
* Minimal
* Data-driven
* Fast
* Dark-first
* High contrast
* Responsive
* Conversion-focused

### Avoid

Do not make the homepage:

* Meme-coin styled
* Overly colorful
* Gaming-like
* Excessively animated
* Cluttered
* Full of meaningless statistics
* Full of stock-photo people
* Visually similar to a casino
* A direct copy of Binance, Coinbase, Uniswap, FOREX.com, or Exodus

Competitor references should be used only for **UX benchmarking and information architecture inspiration**.

---

# 3. Primary Homepage Goals

The homepage must accomplish five things.

### Goal 1 — Brand discovery

Clearly establish:

> ETHSLTD Crypto

as a serious digital-asset trading platform.

### Goal 2 — Trading conversion

Drive users toward:

**Start Trading**

### Goal 3 — Market discovery

Allow users to immediately see:

* BTC
* ETH
* USDT
* Other supported assets
* Prices
* 24h changes
* Market activity

### Goal 4 — Trust

Communicate:

* Security
* Account protection
* Risk controls
* Transparent information
* Compliance-oriented architecture
* Reliable infrastructure

Do not make unsupported claims such as:

> "100% secure"

> "Guaranteed profits"

> "Zero risk"

> "Fully regulated"

unless those claims are actually verified and legally approved.

### Goal 5 — Product discovery

Introduce:

* Spot Trading
* Paper Trading
* P2P
* Wallet
* Market Data
* Contracts
* Mobile App
* Security

without turning the homepage into a complete product documentation page.

---

# 4. Target Users

Homepage must serve four major visitor types.

### A. New crypto user

Needs:

* Simple explanation
* Easy entry
* Confidence
* Educational guidance
* Paper trading option

Primary CTA:

**Start Trading**

Secondary:

**Try Paper Trading**

---

### B. Experienced trader

Needs:

* Markets
* Liquidity/market information where available
* Trading terminal access
* Fast execution positioning
* Advanced trading positioning

Primary CTA:

**Trade Markets**

---

### C. P2P user

Needs:

* Discover P2P marketplace
* Buy/sell crypto through available P2P mechanisms
* Understand escrow/dispute protection concept

CTA:

**Explore P2P**

---

### D. Institutional/professional user

Needs:

* Professional platform positioning
* Security
* Infrastructure
* Market access
* Support/contact pathway

CTA:

**Explore Platform**

---

# 5. Global Homepage Structure

The complete homepage should follow this order:

```text
┌───────────────────────────────────────────────┐
│ Announcement / Status Bar                     │
├───────────────────────────────────────────────┤
│ Header / Navigation                            │
├───────────────────────────────────────────────┤
│ Hero                                           │
├───────────────────────────────────────────────┤
│ Live Market Ticker                             │
├───────────────────────────────────────────────┤
│ Trust / Platform Metrics                       │
├───────────────────────────────────────────────┤
│ Trading Experience Showcase                    │
├───────────────────────────────────────────────┤
│ Markets                                        │
├───────────────────────────────────────────────┤
│ Paper Trading                                  │
├───────────────────────────────────────────────┤
│ P2P Marketplace                                │
├───────────────────────────────────────────────┤
│ Security / Trust                               │
├───────────────────────────────────────────────┤
│ Platform / Mobile                              │
├───────────────────────────────────────────────┤
│ How ETHSLTD Works                               │
├───────────────────────────────────────────────┤
│ Educational / Insights                         │
├───────────────────────────────────────────────┤
│ Final CTA                                      │
├───────────────────────────────────────────────┤
│ Footer                                         │
└───────────────────────────────────────────────┘
```

---

# 6. Announcement Bar

A very thin announcement/status bar appears above the main navigation.

### Purpose

Use it for:

* Platform announcements
* New market announcements
* Maintenance notices
* Important product updates
* Security notices

### Example

```text
ETHSLTD Markets are live — Explore the latest digital assets →
```

Alternative:

```text
Paper Trading is available — Practice without using real funds →
```

### Requirements

* CMS/API driven
* Dismissible where appropriate
* Do not hard-code temporary announcements
* Support priority levels
* Support active/inactive state
* Support scheduling
* Mobile responsive

---

# 7. Header / Navigation

The header is the primary navigation system.

### Desktop structure

```text
[ETHSLTD LOGO]

Markets
Trade
P2P
Assets
Learn

More ▾

                         Search
                         Log In
                         [Sign Up]
```

### Suggested navigation

#### Markets

Dropdown:

* Spot Markets
* Market Overview
* Trending
* New Listings

#### Trade

Dropdown:

* Spot Trading
* Paper Trading
* Advanced Trading

#### P2P

* P2P Marketplace
* Buy Crypto
* Sell Crypto

#### Assets

* Assets
* Wallet
* Supported Assets

#### Learn

* Crypto Basics
* Trading Guide
* Market Insights
* Risk & Security

#### More

* Contracts
* Mobile App
* Fees
* API
* Help Center
* About ETHSLTD

Only expose links to pages that actually exist.

---

# 8. Header CTA

Primary:

**Sign Up**

Secondary:

**Log In**

### Logged-in state

If the user is authenticated, homepage header can change to:

```text
Markets
Trade
P2P
Assets
Learn

[Portfolio]

[Open App]
```

---

# 9. Header Behavior

### Desktop

Sticky header.

### Scroll behavior

At page top:

* Transparent/subtle background.

After scrolling:

* Solid dark background
* Slight blur
* Thin bottom border
* Small shadow

### Mobile

Use:

```text
[Logo]          [Menu]
```

Menu opens a full-height mobile navigation drawer.

---

# 10. Hero Section

The hero is the most important homepage component.

### Objective

Immediately explain the product and drive users toward trading.

### Recommended headline

> **Trade Crypto With Clarity.**

Alternative supporting headline:

> Access digital asset markets, real-time data, and powerful trading tools from one professional platform.

### Supporting copy

> Discover markets, practice with paper trading, and access the tools you need to manage your digital-asset journey.

Avoid financial promises.

---

# 11. Hero CTA

Primary:

**Start Trading**

Secondary:

**Try Paper Trading**

Optional tertiary text link:

**Explore Markets →**

### CTA behavior

`Start Trading`

→ account/authentication flow.

`Try Paper Trading`

→ paper-trading onboarding.

`Explore Markets`

→ markets page.

No CTA should dead-end.

---

# 12. Hero Visual

Hero visual should represent the trading platform.

Do not use a generic crypto illustration.

Preferred visual:

```text
                 BTC/USDT
                 $104,xxx
                 +2.41%

       ┌─────────────────────────────┐
       │                             │
       │       Trading Chart         │
       │                             │
       │    ╱╲      ╱╲              │
       │   ╱  ╲____╱  ╲__           │
       │  ╱              ╲          │
       │                             │
       └─────────────────────────────┘

        BUY                SELL

       Order Book       Recent Trades
```

The visual should look like a real product interface.

---

# 13. Hero Market Data

Hero market information can be dynamic.

Example:

```text
BTC/USDT
$104,284.32
+2.41%
```

Additional:

```text
ETH/USDT
$4,028.14
+1.82%
```

Data must come from the market-data layer.

Never hard-code prices in production.

---

# 14. Hero Background

Use a dark premium background.

Suggested:

```text
#05070A
```

with subtle radial gradients:

```css
radial-gradient(
  circle at 75% 30%,
  rgba(0, 255, 194, 0.10),
  transparent 35%
)
```

and:

```css
radial-gradient(
  circle at 25% 80%,
  rgba(87, 92, 255, 0.08),
  transparent 40%
)
```

Gradients must remain subtle.

---

# 15. Hero Animation

Use restrained motion:

* Chart line animation
* Number transitions
* Subtle glowing data points
* Background gradient movement

Avoid:

* Large particle explosions
* Constant spinning
* Excessive parallax
* Heavy WebGL
* Distracting crypto coin animations

### Accessibility

Respect:

```text
prefers-reduced-motion
```

---

# 16. Live Market Ticker

Immediately below hero.

Horizontal market ticker:

```text
BTC/USDT   $104,284   +2.41%
ETH/USDT   $4,028     +1.82%
SOL/USDT   $188.32    +4.20%
BNB/USDT   $701.42    -0.31%
XRP/USDT   $2.91      +1.14%
```

### Interaction

Clicking a market:

→ market details/trading page.

### Mobile

Horizontal scroll.

Do not force wrapping into multiple rows.

---

# 17. Market Ticker States

### Loading

Use skeleton placeholders.

### Live

Display real-time values.

### Delayed

Display:

```text
Market data delayed
```

when applicable.

### Offline

Display:

```text
Market data temporarily unavailable
```

Never display fake numbers.

---

# 18. Platform Metrics Section

Use a compact trust/scale section.

Possible metrics:

```text
Markets
100+

Assets
50+

Trading Tools
Advanced

Availability
24/7
```

Only display verified numbers.

If actual metrics are unavailable, use qualitative values:

```text
Real-Time Markets
24/7 Access
Advanced Trading
Multi-Asset Platform
```

Do not fabricate volume, users, liquidity, or security statistics.

---

# 19. Trading Experience Section

Headline:

> **Everything You Need to Trade With Confidence**

Supporting text:

> A professional trading environment designed around real-time market data, intuitive controls, and disciplined execution.

### Feature cards

#### Advanced Trading

Real-time charts, order books, order types and market information.

CTA:

**Explore Trading**

---

#### Real-Time Markets

Monitor digital assets and market movements in one place.

CTA:

**View Markets**

---

#### Portfolio & Wallet

Manage supported assets and monitor balances.

CTA:

**Explore Assets**

---

#### Risk Controls

Account security, transaction controls and configurable protection mechanisms.

CTA:

**Learn About Security**

---

# 20. Trading Terminal Showcase

This section should visually demonstrate the actual product.

### Layout

Two-column desktop.

```text
LEFT

Headline
Description
Feature list
CTA


RIGHT

Interactive/static trading terminal preview
```

### Feature list

```text
✓ Real-time order book
✓ Professional charts
✓ Multiple order types
✓ Portfolio visibility
✓ Live market updates
```

### Visual

Use a high-fidelity UI mockup.

It should resemble the actual future trading terminal so the homepage creates a consistent product identity.

---

# 21. Markets Section

Headline:

> **Explore the Markets**

Supporting copy:

> Track the digital assets and trading pairs available through ETHSLTD.

### Tabs

```text
All
Popular
Gainers
Losers
New
```

### Market table

Columns:

```text
Asset
Price
24h Change
24h High
24h Low
24h Volume
Action
```

Example:

```text
BTC/USDT
$104,284
+2.41%
$105,120
$101,940
$2.4B
[Trade]
```

Again, values must be live or explicitly labeled as sample/demo data.

---

# 22. Market Table Mobile

Desktop table should transform on mobile.

Mobile card:

```text
BTC
Bitcoin

$104,284
+2.41%

24h Volume
$2.4B

[Trade]
```

---

# 23. Markets CTA

Below table:

**View All Markets →**

Do not display hundreds of markets on the homepage.

Recommended:

* 5–10 markets desktop
* 4–6 markets mobile

---

# 24. Paper Trading Section

This is a major ETHSLTD differentiator for the initial product positioning.

### Headline

> **Practice Before You Trade**

Supporting copy:

> Experience the ETHSLTD trading environment with virtual funds before moving into live trading.

### Visual

Show:

```text
Paper Trading

Virtual Balance
₹10,00,000

BTC/USDT
BUY

ETH/USDT
SELL

P&L
+₹12,450
```

Clearly label:

```text
SIMULATED
```

### CTA

**Try Paper Trading**

Secondary:

**How Paper Trading Works →**

Never imply paper-trading balances are withdrawable or real.

---

# 25. P2P Section

Headline:

> **Buy & Sell Crypto Through P2P**

Supporting copy:

> Discover peer-to-peer trading with structured trade workflows, escrow controls, messaging, and dispute support.

### Feature points

```text
Verified counterparties
Structured trade workflow
Escrow-based transaction flow
P2P chat
Dispute management
```

Claims should reflect actual implemented functionality.

### CTA

**Explore P2P**

---

# 26. P2P Marketplace Preview

Show 3–4 example advertisements.

Example:

```text
USDT

Buy

₹91.20

Payment:
UPI

Available:
₹50,000

[Buy USDT]
```

Second:

```text
USDT

Sell

₹90.85

Payment:
Bank Transfer

Available:
₹75,000

[Sell USDT]
```

All data must be clearly marked as live, demo, or sample depending on actual implementation.

---

# 27. Security Section

Security must be a prominent homepage section.

### Headline

> **Security Built Into Every Layer**

Supporting copy:

> ETHSLTD is designed with account protection, authorization controls, transaction safeguards, and auditable workflows at its core.

### Visual

Use a layered security diagram:

```text
          ETHSLTD
             │
    ┌────────┴────────┐
    │                 │
Authentication     Authorization
    │                 │
    ├───────┬─────────┤
            │
       Transaction
         Controls
            │
       Audit Trail
            │
      Risk Monitoring
```

---

# 28. Security Feature Cards

### Account Protection

* Secure authentication
* Session management
* Device management
* 2FA

### Transaction Protection

* Transaction validation
* Balance controls
* Withdrawal controls
* Idempotent financial operations

### Operational Controls

* Risk monitoring
* Audit trails
* Access controls
* Activity monitoring

Do not expose sensitive implementation details publicly.

---

# 29. Mobile App Section

Headline:

> **Trade From Anywhere**

Supporting:

> Stay connected to markets, portfolio activity, orders, and notifications from your mobile device.

### Visual

Show two phone mockups:

```text
        ┌──────────────┐
        │ ETHSLTD      │
        │              │
        │ BTC $104K    │
        │ +2.41%       │
        │              │
        │ Chart        │
        │              │
        │ [Trade]      │
        └──────────────┘
```

### CTA

**Get the ETHSLTD App**

If the application is not yet published:

Use:

**Mobile Experience Coming Soon**

Do not show fake App Store/Google Play availability.

---

# 30. How ETHSLTD Works

Simple 4-step section.

### Step 1

**Create Your Account**

Register and complete required verification.

### Step 2

**Explore Markets**

Discover available assets and trading pairs.

### Step 3

**Practice or Trade**

Use paper trading or eligible live trading functionality.

### Step 4

**Manage Your Portfolio**

Monitor assets, orders and account activity.

---

# 31. New User Education Section

Headline:

> **New to Crypto? Start Here.**

Cards:

### What is Crypto Trading?

Introductory explanation.

### How Spot Trading Works

Explain buy/sell orders.

### What is Paper Trading?

Explain simulated trading.

### Understanding Market Risk

Explain volatility and risk.

CTA:

**Explore Learning Center**

---

# 32. Educational Content Cards

Each card:

```text
[Category]

Article Title

Short 1–2 line description

5 min read →

```

Categories:

* Crypto Basics
* Trading
* Security
* P2P
* Market Insights

Content should be CMS-driven.

---

# 33. Risk Disclaimer

Near the lower part of homepage.

Example:

> **Risk Disclosure:** Digital assets are volatile and involve significant risk. Prices may change rapidly and you may lose some or all of your invested capital. Nothing on this website constitutes investment, financial, legal, or tax advice. Products and services may vary by jurisdiction and eligibility.

This copy must ultimately be reviewed by legal/compliance professionals for the actual operating jurisdictions.

---

# 34. Final CTA Section

Large full-width CTA.

### Headline

> **Your Markets. Your Tools. Your Strategy.**

Supporting:

> Explore ETHSLTD and discover a modern environment for digital-asset trading.

Primary:

**Create Account**

Secondary:

**Explore Markets**

Optional:

**Try Paper Trading**

---

# 35. Final CTA Visual

Use:

```text
Dark background
+
large ETHSLTD wordmark
+
subtle green/blue radial glow
+
minimal market-data lines
```

No excessive graphics.

---

# 36. Footer

Footer must be comprehensive.

```text
ETHSLTD

Trade
    Markets
    Spot Trading
    Paper Trading
    Fees

P2P
    P2P Marketplace
    Buy Crypto
    Sell Crypto
    Disputes

Assets
    Supported Assets
    Wallet
    Deposits
    Withdrawals

Learn
    Crypto Basics
    Trading Guide
    Security
    Market Insights

Company
    About
    Careers
    Contact
    News

Support
    Help Center
    Contact Support
    System Status

Legal
    Terms
    Privacy
    Risk Disclosure
    Cookies
    AML/KYC
```

---

# 37. Footer Bottom

```text
© 2026 ETHSLTD. All rights reserved.

Risk Disclosure | Privacy | Terms | Cookies
```

Also show:

```text
Country / Region
Language
Currency
```

where applicable.

---

# 38. Homepage Navigation Map

```text
HOME
│
├── Markets
│
├── Trade
│   ├── Spot
│   ├── Paper Trading
│   └── Advanced
│
├── P2P
│
├── Assets
│
├── Learn
│
├── Mobile
│
├── About
│
├── Support
│
└── Legal
```

Homepage itself should remain the primary marketing surface.

---

# 39. Responsive Layout

## Desktop

Target:

```text
1440px
1280px
1024px
```

Maximum content width:

```text
1200–1280px
```

Use centered containers.

---

## Tablet

Target:

```text
768px–1023px
```

Adapt:

* Navigation
* Hero
* Cards
* Market table
* Trading preview
* P2P cards

---

## Mobile

Target:

```text
320px+
```

All components must remain usable at 320px width.

---

# 40. Mobile Homepage Order

Mobile should prioritize conversion.

```text
Announcement
Header
Hero
CTA
Market Ticker
Markets
Trading Experience
Paper Trading
P2P
Security
Mobile App
How It Works
Learn
Final CTA
Footer
```

---

# 41. Homepage Design System

### Primary background

```text
#05070A
```

### Secondary background

```text
#0A0E13
```

### Card

```text
#0E141B
```

### Elevated card

```text
#121922
```

### Border

```text
#202A35
```

### Primary text

```text
#F5F7FA
```

### Secondary text

```text
#A7B0BC
```

### Muted text

```text
#6F7A87
```

### Primary accent

```text
#00E6A7
```

### Secondary accent

```text
#5965FF
```

### Positive

```text
#00D68F
```

### Negative

```text
#FF5C67
```

### Warning

```text
#F5B94C
```

---

# 42. Homepage Gradients

Primary:

```css
linear-gradient(
  135deg,
  #00E6A7 0%,
  #5965FF 100%
)
```

Hero:

```css
radial-gradient(
  circle at 75% 25%,
  rgba(0, 230, 167, 0.12),
  transparent 36%
)
```

Secondary:

```css
radial-gradient(
  circle at 20% 70%,
  rgba(89, 101, 255, 0.10),
  transparent 38%
)
```

Gradients should support hierarchy, not become the dominant visual.

---

# 43. Typography

Primary:

```text
Inter
```

Fallback:

```text
system-ui
-apple-system
BlinkMacSystemFont
"Segoe UI"
sans-serif
```

### Hero

Desktop:

```text
56–72px
font-weight: 700–800
```

Mobile:

```text
38–46px
```

### H2

```text
36–48px
```

### H3

```text
20–28px
```

### Body

```text
16–18px
```

### Small

```text
12–14px
```

Financial numbers can use tabular numerals.

---

# 44. UI Shape

Use:

```text
Border Radius:
8px
12px
16px
20px
```

Avoid excessive pill-shaped UI except for:

* status badges
* tags
* filters
* compact CTAs

---

# 45. Cards

Cards should use:

```text
background
+
1px border
+
subtle shadow
+
12–16px radius
```

Hover:

```text
border-color → accent
transform → translateY(-2px)
```

Motion must remain subtle.

---

# 46. Buttons

### Primary

```text
Background: #00E6A7
Text: #05070A
```

### Secondary

```text
Transparent
Border: #2A3542
Text: #F5F7FA
```

### Hover

Primary:

```text
#18F0B3
```

Secondary:

```text
#141B23
```

---

# 47. Icons

Use one icon system consistently.

Recommended:

```text
Lucide
```

Icon rules:

* 16px
* 18px
* 20px
* 24px

Avoid mixing multiple icon libraries.

---

# 48. Charts

Homepage charts should use:

```text
TradingView Lightweight Charts
```

or a lightweight equivalent.

Chart visuals must match ETHSLTD's design system.

Do not expose unnecessary technical chart controls on the homepage.

---

# 49. Images

Homepage should primarily use:

* Product UI
* Trading terminal mockups
* Device mockups
* Abstract data visuals
* ETHSLTD brand graphics

Avoid generic cryptocurrency stock imagery.

---

# 50. Loading States

Every dynamic homepage component requires a loading state.

Example:

```text
████████████
████████
████████████████
```

Use skeleton loading rather than spinners wherever possible.

---

# 51. Error States

Market API failure:

```text
Market data unavailable

We're having trouble loading live market information.

[Retry]
```

Do not render zero values.

---

# 52. Empty States

Example:

```text
No markets available

Market information will appear here when available.
```

---

# 53. API/Data Requirements

Homepage should consume backend APIs rather than hard-coded production data.

Required conceptual endpoints:

```text
GET /api/markets
GET /api/markets/ticker
GET /api/markets/trending
GET /api/announcements
GET /api/platform/stats
GET /api/content/articles
GET /api/p2p/featured
GET /api/system/status
```

Exact endpoint naming may be adapted to the backend architecture.

---

# 54. Realtime Market Data

Use:

```text
REST
+
WebSocket
```

Initial page load:

```text
REST snapshot
```

Then:

```text
WebSocket updates
```

for live market values.

---

# 55. SEO Requirements

Homepage must include:

### Title

> ETHSLTD Crypto — Trade Digital Assets With Confidence

### Meta description

> Explore digital asset markets, real-time market data, paper trading, P2P trading and modern crypto trading tools with ETHSLTD.

Final SEO copy must be reviewed against actual products and jurisdictional claims.

---

# 56. Structured Data

Implement appropriate:

```text
Organization
WebSite
WebPage
BreadcrumbList
```

where valid.

Do not add fake ratings, reviews, financial claims or unsupported structured data.

---

# 57. Open Graph

Homepage requires:

```text
og:title
og:description
og:image
og:url
twitter:card
twitter:title
twitter:description
twitter:image
```

Use an ETHSLTD branded social preview.

---

# 58. Accessibility

Homepage must meet approximately:

```text
WCAG 2.2 AA
```

Requirements:

* Keyboard navigation
* Visible focus states
* Semantic HTML
* ARIA only where required
* Proper heading hierarchy
* Color contrast
* Alt text
* Reduced motion
* Screen-reader compatible navigation
* Accessible mobile menu

---

# 59. Performance Requirements

Target:

```text
LCP < 2.5s
CLS < 0.1
INP < 200ms
```

under appropriate real-world test conditions.

Homepage should:

* Minimize JavaScript
* Lazy-load below-fold media
* Optimize fonts
* Optimize images
* Avoid unnecessary third-party scripts
* Avoid heavy animation libraries
* Stream/server-render where appropriate
* Cache static content

---

# 60. Technology Requirements

### Web

```text
TypeScript
React
Next.js
Tailwind CSS
shadcn/ui
```

### State

```text
TanStack Query
Zustand
```

### Validation

```text
Zod
```

### Charts

```text
Lightweight Charts
```

### Icons

```text
Lucide
```

### Backend integration

```text
REST
WebSocket
```

### Hosting

```text
Cloudflare
```

### Analytics

Privacy-conscious analytics solution.

### Error monitoring

Sentry-type error monitoring or equivalent.

---

# 61. Homepage Component Architecture

Recommended structure:

```text
HomePage
│
├── AnnouncementBar
│
├── Header
│
├── HeroSection
│   ├── HeroCopy
│   ├── HeroCTA
│   └── TradingPreview
│
├── MarketTicker
│
├── PlatformStats
│
├── TradingExperience
│
├── TradingTerminalPreview
│
├── MarketsSection
│   ├── MarketTabs
│   ├── MarketTable
│   └── MarketsCTA
│
├── PaperTradingSection
│
├── P2PSection
│
├── SecuritySection
│
├── MobileAppSection
│
├── HowItWorksSection
│
├── EducationSection
│
├── RiskDisclosure
│
├── FinalCTA
│
└── Footer
```

---

# 62. Suggested File Structure

```text
apps/web/

app/
├── page.tsx
├── layout.tsx
├── globals.css
└── ...

components/
└── home/
    ├── announcement-bar.tsx
    ├── header.tsx
    ├── hero.tsx
    ├── hero-terminal.tsx
    ├── market-ticker.tsx
    ├── platform-stats.tsx
    ├── trading-experience.tsx
    ├── trading-terminal-preview.tsx
    ├── markets-section.tsx
    ├── market-table.tsx
    ├── paper-trading-section.tsx
    ├── p2p-section.tsx
    ├── security-section.tsx
    ├── mobile-app-section.tsx
    ├── how-it-works.tsx
    ├── education-section.tsx
    ├── risk-disclosure.tsx
    ├── final-cta.tsx
    └── footer.tsx
```

---

# 63. Content Management

Marketing content should not require code deployment for routine changes.

CMS/configurable content:

* Announcement
* Hero copy
* Featured markets
* Educational articles
* P2P highlights
* Platform statistics
* Mobile-app messaging
* Footer links

Critical financial/legal content should have controlled publishing permissions.

---

# 64. Homepage Authentication Behavior

Anonymous user:

```text
Start Trading → Sign Up
Try Paper Trading → Paper Trading onboarding
Explore Markets → Public markets
```

Authenticated user:

```text
Start Trading → Trading terminal
Try Paper Trading → Paper Trading
Portfolio → Account
```

Do not expose private balances or account information on the public homepage.

---

# 65. Paper vs Live Trading

The homepage must clearly distinguish:

```text
PAPER TRADING
SIMULATED
```

from:

```text
LIVE TRADING
REAL FUNDS
```

Never use identical visual treatment that could cause users to confuse the two environments.

---

# 66. Trust Language Rules

Allowed:

> Built with security and account protection in mind.

> Designed for transparent trading workflows.

> Real-time market information.

> Risk controls and auditable transaction workflows.

Avoid unsupported:

> World's safest exchange.

> Guaranteed returns.

> Risk-free trading.

> 100% secure.

> Guaranteed profits.

> Government approved.

> Fully regulated.

unless independently verified and legally approved.

---

# 67. Homepage Analytics Events

Track meaningful interactions:

```text
homepage_view
hero_start_trading_click
hero_paper_trading_click
markets_view
market_click
market_trade_click
p2p_click
paper_trading_click
security_section_view
mobile_app_click
education_article_click
signup_click
login_click
```

Do not collect unnecessary sensitive financial information through marketing analytics.

---

# 68. Conversion Funnel

Homepage should naturally guide:

```text
Visitor
   ↓
Understand ETHSLTD
   ↓
Explore Markets
   ↓
See Trading Experience
   ↓
Build Trust
   ↓
Choose Entry
   ├── Paper Trading
   └── Live Account
```

---

# 69. Homepage Acceptance Criteria

The homepage is considered complete only when:

### Visual

* [ ] Premium dark trading design implemented.
* [ ] ETHSLTD branding consistently applied.
* [ ] Desktop design complete.
* [ ] Tablet design complete.
* [ ] Mobile design complete.
* [ ] Typography implemented.
* [ ] Color system implemented.
* [ ] Responsive spacing implemented.
* [ ] Animations are restrained and accessible.

### Navigation

* [ ] Header works.
* [ ] Mobile navigation works.
* [ ] All links point to valid destinations.
* [ ] CTA states work.
* [ ] Sticky navigation works.

### Market Data

* [ ] Market ticker works.
* [ ] Market table works.
* [ ] Loading state works.
* [ ] Error state works.
* [ ] Live data is clearly distinguished from demo data.
* [ ] Market links work.

### Marketing

* [ ] Hero communicates product clearly.
* [ ] Paper Trading is explained.
* [ ] P2P is introduced.
* [ ] Security positioning is included.
* [ ] Mobile experience is included.
* [ ] Learning section is included.
* [ ] Final CTA exists.

### Accessibility

* [ ] Keyboard navigation works.
* [ ] Focus states work.
* [ ] Screen-reader semantics are correct.
* [ ] Color contrast is acceptable.
* [ ] Reduced motion works.
* [ ] Images have appropriate alt text.

### Performance

* [ ] Images optimized.
* [ ] Fonts optimized.
* [ ] Below-fold sections lazy-load where appropriate.
* [ ] No unnecessary third-party scripts.
* [ ] Core Web Vitals targets are monitored.

### SEO

* [ ] Title implemented.
* [ ] Meta description implemented.
* [ ] Canonical URL implemented.
* [ ] Open Graph implemented.
* [ ] Sitemap integration exists.
* [ ] Robots configuration exists.
* [ ] Structured data is valid.

### Compliance

* [ ] Risk disclosure present.
* [ ] No unsupported financial claims.
* [ ] No fabricated platform metrics.
* [ ] No fabricated regulatory claims.
* [ ] Paper/live trading distinction is explicit.

---

# 70. AI Development Agent Rules

The AI coding/design agent must treat this PRD as the **single source of truth for the homepage**.

### Agent must

1. Build the homepage only.
2. Follow the defined component architecture.
3. Use reusable components.
4. Use TypeScript strictly.
5. Use semantic HTML.
6. Implement responsive behavior from the beginning.
7. Keep the design premium and minimal.
8. Use real API integration points for dynamic data.
9. Never fabricate live market data.
10. Never fabricate user counts, volume, liquidity, licenses or regulatory claims.
11. Never create fake security guarantees.
12. Clearly label simulated/paper-trading content.
13. Keep animations subtle.
14. Respect reduced-motion preferences.
15. Optimize for performance.
16. Maintain accessibility.
17. Keep financial calculations out of frontend marketing components.
18. Keep secrets out of frontend code.
19. Avoid unnecessary dependencies.
20. Avoid copying competitor branding or exact layouts.

### Agent must NOT

* Build the trading terminal as a full product yet.
* Build wallet pages yet.
* Build the admin panel yet.
* Build KYC screens yet.
* Build P2P transaction flows yet.
* Build contract workflows yet.
* Build authentication pages yet.
* Invent backend behavior.
* Invent market values.
* Invent compliance certifications.
* Invent company statistics.
* Add unrelated homepage sections.

---

# 71. Final Homepage Experience

The finished homepage should communicate this journey:

```text
                    ETHSLTD
                       │
                       ▼
              ┌─────────────────┐
              │  Trade Crypto   │
              │  With Clarity   │
              └────────┬────────┘
                       │
             ┌─────────┴─────────┐
             ▼                   ▼
       Start Trading       Paper Trading
             │                   │
             └─────────┬─────────┘
                       ▼
                 Explore Markets
                       │
                       ▼
              Professional Tools
                       │
             ┌─────────┴─────────┐
             ▼                   ▼
            P2P                Assets
             │                   │
             └─────────┬─────────┘
                       ▼
                    Security
                       │
                       ▼
                  ETHSLTD App
                       │
                       ▼
                 Create Account
```

**The homepage should feel like the front door to a serious trading platform: market-first, product-led, security-conscious, conversion-focused, fast, and visually restrained.**
