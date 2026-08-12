# ETHSLTD Crypto — Design System, Color Palette, Typography & Technology Specification

> **Document scope:** This document defines only the visual design system, color system, typography, gradients, UI layout principles, technology stack, project structure, and AI-agent implementation behavior for the ETHSLTD Crypto platform.
>
> **Out of scope:** Detailed business requirements, trading rules, KYC/AML workflows, financial compliance specifications, individual page PRDs, database schema, API contracts, and release phases.

---

## 1. Product Design Direction

### Brand personality

ETHSLTD Crypto should feel:

- Premium
- Trustworthy
- Financial-grade
- Modern
- Secure
- Technical
- Fast
- Minimal
- Institutional
- Global
- Data-driven
- Confident without being aggressive

### Visual references

The design language may take inspiration from established crypto/trading products such as Binance, Coinbase, Uniswap, FOREX.com and Exodus, but ETHSLTD Crypto must have its own visual identity.

### Core design principle

**Finance-first clarity + premium fintech aesthetics + crypto-native data density.**

Do not make the interface look like:

- A gaming dashboard
- A meme-coin website
- A neon cyberpunk template
- A generic SaaS admin panel
- A conventional banking website

---

# 2. Color System

## 2.1 Primary Brand Palette

| Token | Name | HEX | Usage |
|---|---|---:|---|
| `brand-50` | Ice | `#F4F8FB` | Subtle backgrounds |
| `brand-100` | Mist | `#E8F1F7` | Hover backgrounds |
| `brand-200` | Sky Tint | `#C9DDEB` | Borders/highlights |
| `brand-300` | Slate Blue | `#89AEC8` | Secondary brand UI |
| `brand-400` | Ocean Blue | `#3E789F` | Interactive secondary |
| `brand-500` | ETHSLTD Blue | `#145B8C` | Primary brand |
| `brand-600` | Deep Ocean | `#0C4772` | Hover/active |
| `brand-700` | Marine | `#002C55` | Strong brand surfaces |
| `brand-800` | Deep Marine | `#001F3D` | Dark surfaces |
| `brand-900` | Midnight Marine | `#00152B` | Deep dark background |

### Primary recommendation

Use:

- `#145B8C` as the primary interactive brand color.
- `#002C55` as the strong brand/deep-blue color.
- `#89AEC8` for restrained secondary accents.
- `#0B0E29` for premium dark-mode depth.

---

## 2.2 Existing ETHSLTD Brand Palette

The previously selected brand direction is retained as the foundation:

| Name | HEX | Role |
|---|---:|---|
| Frost | `#F0F6F7` | Light background |
| Slate | `#89AEC8` | Secondary accent |
| Brass | `#7B6727` | Premium/financial accent |
| Timber | `#4E452A` | Warm neutral |
| Marine | `#002C55` | Primary deep brand |
| Midnight | `#0B0E29` | Premium dark background |

### Usage ratio

Recommended visual balance:

- 60% Neutral/background
- 20% Marine/Midnight
- 10% Slate
- 5% Brass
- 5% Semantic colors

Do not use all colors equally.

---

# 3. Neutral Palette

## Light mode

| Token | HEX | Usage |
|---|---:|---|
| `white` | `#FFFFFF` | Cards/surfaces |
| `neutral-50` | `#F8FAFC` | Page background |
| `neutral-100` | `#F1F5F9` | Secondary background |
| `neutral-200` | `#E2E8F0` | Borders |
| `neutral-300` | `#CBD5E1` | Disabled borders |
| `neutral-400` | `#94A3B8` | Placeholder |
| `neutral-500` | `#64748B` | Secondary text |
| `neutral-600` | `#475569` | Supporting text |
| `neutral-700` | `#334155` | Body text |
| `neutral-800` | `#1E293B` | Strong text |
| `neutral-900` | `#0F172A` | Headings |

## Dark mode

| Token | HEX | Usage |
|---|---:|---|
| `dark-950` | `#070A12` | Application background |
| `dark-900` | `#0B0E29` | Main background |
| `dark-850` | `#10152F` | Elevated background |
| `dark-800` | `#141A38` | Cards |
| `dark-750` | `#1A2144` | Elevated cards |
| `dark-700` | `#222A4D` | Borders/inputs |
| `dark-600` | `#344064` | Secondary borders |
| `dark-500` | `#64748B` | Muted text |
| `dark-300` | `#CBD5E1` | Secondary text |
| `dark-100` | `#F1F5F9` | Primary text |
| `white` | `#FFFFFF` | Highest emphasis |

---

# 4. Semantic Colors

Semantic colors must remain visually distinct from brand colors.

| Token | Name | HEX | Usage |
|---|---|---:|---|
| `success-500` | Profit Green | `#16A34A` | Positive price/PnL |
| `success-400` | Bright Green | `#22C55E` | Success state |
| `success-bg` | Green Tint | `#DCFCE7` | Success background |
| `danger-500` | Loss Red | `#DC2626` | Negative price/PnL |
| `danger-400` | Bright Red | `#EF4444` | Error/danger |
| `danger-bg` | Red Tint | `#FEE2E2` | Error background |
| `warning-500` | Amber | `#D97706` | Warning |
| `warning-400` | Gold | `#F59E0B` | Attention |
| `warning-bg` | Amber Tint | `#FEF3C7` | Warning background |
| `info-500` | Information Blue | `#2563EB` | Informational state |
| `info-bg` | Blue Tint | `#DBEAFE` | Information background |

### Trading convention

- Buy / positive: `#16A34A`
- Sell / negative: `#DC2626`
- Neutral: `#64748B`

Never use green or red merely for decoration.

---

# 5. Premium Brass Accent

Brass should be used sparingly.

### Core

`#7B6727`

### Supporting shades

- Brass 100: `#F4EED4`
- Brass 200: `#DCCF9B`
- Brass 300: `#B7A45D`
- Brass 400: `#947F35`
- Brass 500: `#7B6727`
- Brass 600: `#5F4E1D`
- Brass 700: `#473A16`

### Use for

- VIP
- Institutional
- Premium features
- Brand details
- Selected achievements
- High-value metrics
- Subtle separators
- Premium CTA accents

### Do not use for

- Every button
- Buy/sell indicators
- Large page backgrounds
- Normal body text
- Alerts

---

# 6. Gradients

Gradients should be subtle and sophisticated.

## 6.1 Primary brand gradient

```css
linear-gradient(135deg, #002C55 0%, #145B8C 55%, #3E789F 100%)
```

Use for:

- Hero backgrounds
- Primary promotional surfaces
- Premium CTA areas

## 6.2 Midnight gradient

```css
linear-gradient(135deg, #0B0E29 0%, #002C55 100%)
```

Use for:

- Dark hero
- Trading-focused sections
- High-impact navigation surfaces

## 6.3 Ocean glow

```css
radial-gradient(circle at 50% 0%, rgba(20, 91, 140, 0.28) 0%, rgba(11, 14, 41, 0) 65%)
```

Use behind:

- Hero content
- Market overview
- Authentication surfaces

## 6.4 Premium brass glow

```css
radial-gradient(circle at 80% 20%, rgba(123, 103, 39, 0.18) 0%, rgba(123, 103, 39, 0) 60%)
```

Use only as a background accent.

## 6.5 Success gradient

```css
linear-gradient(135deg, #15803D 0%, #22C55E 100%)
```

Only for special positive visualizations.

## 6.6 Danger gradient

```css
linear-gradient(135deg, #B91C1C 0%, #EF4444 100%)
```

Only for special negative visualizations.

---

# 7. Gradient Rules

- Never place long paragraphs over complex gradients.
- Maintain text contrast.
- Use gradients behind content, not inside every component.
- Avoid rainbow gradients.
- Avoid excessive glow.
- Avoid animated gradients on financial data.
- Keep motion subtle.
- Prefer radial ambient lighting over aggressive linear gradients.

---

# 8. Typography

## Primary font

### Inter

Use for:

- Body
- Navigation
- Buttons
- Forms
- Tables
- Trading interface
- Dashboard
- Numbers where appropriate

Recommended weights:

- 400 — Regular
- 500 — Medium
- 600 — Semibold
- 700 — Bold

## Display font

### Space Grotesk

Use for:

- Hero headings
- Major marketing headlines
- Large statistics
- Brand statements
- Selected section headings

Weights:

- 500
- 600
- 700

## Monospace font

### JetBrains Mono

Use for:

- Prices
- Quantities
- Wallet addresses
- Transaction IDs
- Order IDs
- API keys shown in masked UI
- Technical values
- Timestamp-heavy data

Do not use JetBrains Mono for normal paragraphs.

---

# 9. Typography Scale

| Token | Size | Line Height | Usage |
|---|---:|---:|---|
| `display-2xl` | 72px | 1.05 | Large desktop hero |
| `display-xl` | 60px | 1.05 | Hero |
| `display-lg` | 48px | 1.10 | Major heading |
| `display-md` | 40px | 1.10 | Section heading |
| `heading-xl` | 32px | 1.20 | Page heading |
| `heading-lg` | 28px | 1.20 | Major card heading |
| `heading-md` | 24px | 1.25 | Component heading |
| `heading-sm` | 20px | 1.30 | Small heading |
| `body-lg` | 18px | 1.60 | Intro |
| `body-md` | 16px | 1.55 | Default |
| `body-sm` | 14px | 1.45 | Supporting |
| `caption` | 12px | 1.40 | Metadata |
| `micro` | 11px | 1.30 | Dense UI |

### Responsive hero

Desktop:

`56–72px`

Tablet:

`44–56px`

Mobile:

`34–42px`

Do not force 72px typography onto mobile screens.

---

# 10. Numeric Typography

Trading numbers should be:

- Tabular
- Aligned
- Easy to scan
- Consistent in decimal precision

Recommended CSS:

```css
font-variant-numeric: tabular-nums;
font-feature-settings: "tnum";
```

For dense market data:

```css
font-family: "JetBrains Mono", monospace;
font-variant-numeric: tabular-nums;
```

---

# 11. Layout System

## Base grid

Use an 8px spacing system.

Core spacing:

- 4px
- 8px
- 12px
- 16px
- 20px
- 24px
- 32px
- 40px
- 48px
- 64px
- 80px
- 96px
- 120px

Avoid arbitrary values unless necessary.

---

# 12. Container System

### Desktop

Maximum content width:

`1440px`

Preferred reading/content width:

`1200–1280px`

### Wide trading interface

Allow:

`1600–1920px`

### Mobile

Full width with:

`16px` horizontal padding.

### Tablet

`24px` horizontal padding.

### Desktop

`32–48px` depending on layout.

---

# 13. Border Radius

Recommended:

| Token | Radius | Usage |
|---|---:|---|
| `radius-xs` | 4px | Small controls |
| `radius-sm` | 6px | Inputs |
| `radius-md` | 8px | Standard cards |
| `radius-lg` | 12px | Major cards |
| `radius-xl` | 16px | Hero/premium cards |
| `radius-2xl` | 24px | Large marketing blocks |
| `radius-full` | 9999px | Pills/badges |

Trading terminals should generally use smaller radii than marketing cards.

---

# 14. Shadows

Avoid heavy shadows.

## Light

```css
0 1px 2px rgba(15, 23, 42, 0.06)
```

## Medium

```css
0 8px 24px rgba(15, 23, 42, 0.08)
```

## Dark

```css
0 12px 32px rgba(0, 0, 0, 0.28)
```

## Premium glow

```css
0 0 40px rgba(20, 91, 140, 0.14)
```

Use glow only for selected hero/premium elements.

---

# 15. Border System

## Light

```css
border: 1px solid #E2E8F0;
```

## Dark

```css
border: 1px solid rgba(255, 255, 255, 0.08);
```

## Premium

```css
border: 1px solid rgba(123, 103, 39, 0.35);
```

Borders should establish hierarchy rather than decorate every element.

---

# 16. Dark Mode

Dark mode is the primary trading experience.

### Recommended background hierarchy

```text
#070A12
  ↓
#0B0E29
  ↓
#10152F
  ↓
#141A38
  ↓
#1A2144
```

### Rules

- Never use pure black as the entire interface.
- Never use pure white for all dark-mode text.
- Use `#F1F5F9` for primary text.
- Use `#94A3B8` for secondary text.
- Use blue accents selectively.
- Keep green/red trading colors bright enough for rapid recognition.

---

# 17. Light Mode

Light mode should feel premium rather than generic.

Preferred page background:

`#F8FAFC`

Cards:

`#FFFFFF`

Primary text:

`#0F172A`

Secondary text:

`#475569`

Borders:

`#E2E8F0`

Brand:

`#145B8C`

---

# 18. Component Design Language

## Buttons

### Primary

Background:

`#145B8C`

Hover:

`#0C4772`

Text:

`#FFFFFF`

### Secondary

Background:

transparent

Border:

`#CBD5E1`

### Premium

Background:

`#7B6727`

Use only where premium context exists.

### Destructive

Background:

`#DC2626`

### Success

Background:

`#16A34A`

---

# 19. Cards

Cards should use:

- Clear hierarchy
- Minimal borders
- Subtle elevation
- 12–16px radius
- 20–24px internal padding
- Strong heading/metric hierarchy

Avoid:

- Excessive glassmorphism
- Huge shadows
- Multiple gradients
- Decorative icons everywhere

---

# 20. Glass / Blur

Glassmorphism is allowed only as an accent.

Recommended:

```css
background: rgba(15, 23, 42, 0.55);
backdrop-filter: blur(16px);
border: 1px solid rgba(255, 255, 255, 0.08);
```

Use for:

- Floating navigation
- Hero overlays
- Modal surfaces
- Selected premium panels

Do not use glass for every card.

---

# 21. Navigation Layout

## Marketing navigation

```text
[ETHSLTD Logo]

Markets
Trade
P2P
Assets
Learn
More

                         Search
                         Log In
                         Sign Up
                         Theme
```

Navigation should remain visually calm.

## Trading navigation

```text
Logo
Markets
Trade
Derivatives
P2P
Assets
Portfolio

                         Search
                         Notifications
                         Wallet
                         Profile
```

---

# 22. Hero Layout

Recommended structure:

```text
┌──────────────────────────────────────────────────────────┐
│                    NAVIGATION                            │
├──────────────────────────────────────────────────────────┤
│                                                          │
│     Eyebrow                                              │
│     The modern digital asset platform                   │
│                                                          │
│     Trade crypto with                                    │
│     clarity and confidence.                              │
│                                                          │
│     Supporting statement                                 │
│                                                          │
│     [ Start Trading ] [ Explore Markets ]                │
│                                                          │
│     Trust / security / market metrics                    │
│                                                          │
│                           ┌────────────────────────────┐  │
│                           │ Market / Trading visual    │  │
│                           │ Chart / asset preview     │  │
│                           └────────────────────────────┘  │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### Hero visual

Prefer:

- Live market cards
- Simplified chart visualization
- Order-book fragments
- Asset price movements
- Abstract data geometry

Avoid generic crypto coin illustrations.

---

# 23. Marketing Page Layout

General section sequence should visually follow:

```text
Navigation
↓
Hero
↓
Live Markets / Market Snapshot
↓
Product Value Proposition
↓
Trading Experience
↓
P2P / Asset Access
↓
Security & Trust
↓
Platform Statistics
↓
Mobile / Multi-device Experience
↓
Learning / Insights
↓
Final CTA
↓
Footer
```

This is a layout direction, not a detailed page PRD.

---

# 24. Trading Dashboard Layout

```text
┌─────────────────────────────────────────────────────────┐
│ Header                                                  │
├───────────────┬─────────────────────────┬───────────────┤
│ Markets       │ Chart                   │ Order Book    │
│ Watchlist     │                         │               │
│               │                         │               │
├───────────────┤                         ├───────────────┤
│               │                         │ Trades        │
├───────────────┴─────────────────────────┴───────────────┤
│ Order Entry / Buy / Sell                                │
├─────────────────────────────────────────────────────────┤
│ Open Orders | Positions | Order History | Trade History │
└─────────────────────────────────────────────────────────┘
```

Desktop trading UI should prioritize information density.

---

# 25. Mobile Layout

Mobile is not a scaled-down desktop.

Use:

```text
Header
↓
Asset / Market Summary
↓
Chart
↓
Buy / Sell
↓
Order Book
↓
Open Orders
↓
Trade History
```

Use bottom navigation where appropriate:

```text
Home | Markets | Trade | P2P | Assets
```

---

# 26. Responsive Breakpoints

Recommended Tailwind-style breakpoints:

| Name | Width |
|---|---:|
| `xs` | 480px |
| `sm` | 640px |
| `md` | 768px |
| `lg` | 1024px |
| `xl` | 1280px |
| `2xl` | 1536px |
| `3xl` | 1920px |

---

# 27. Motion Design

Motion must communicate state.

### Duration

- Micro: 100–150ms
- Standard: 180–250ms
- Complex: 300–450ms

### Easing

Preferred:

```css
cubic-bezier(0.22, 1, 0.36, 1)
```

### Use animation for

- Navigation
- Modal entry
- Dropdowns
- Hover states
- Price changes
- Toasts
- Loading transitions
- Chart transitions

Avoid continuous decorative animations around financial data.

---

# 28. Accessibility

Target:

**WCAG 2.2 AA**

Requirements:

- Keyboard navigation
- Visible focus
- Accessible labels
- Proper contrast
- Reduced-motion support
- Semantic HTML
- Screen-reader support
- No color-only meaning

Trading states must not rely only on red/green.

Use:

- icons
- labels
- arrows
- percentage signs
- textual status

---

# 29. Iconography

Recommended:

### Lucide React

Style:

- 1.5–2px stroke
- Rounded
- Minimal
- Consistent size

Common sizes:

- 16px
- 18px
- 20px
- 24px

Avoid mixing multiple icon libraries.

---

# 30. Illustration Style

Use:

- Abstract financial geometry
- Market data visualizations
- Clean 3D asset motifs where appropriate
- Dark blue ambient lighting
- Subtle metallic/brass details

Avoid:

- Cartoon coins
- Excessive rockets
- Generic blockchain illustrations
- Overused neon circuit backgrounds
- Meme aesthetics

---

# 31. Charts

Technology:

**TradingView Lightweight Charts**

Visual principles:

- Dark chart background should blend with the terminal.
- Gridlines should be extremely subtle.
- Green candles: `#16A34A`
- Red candles: `#DC2626`
- Crosshair: neutral/slate.
- Volume should be visually subordinate to price.
- Do not overload charts with indicators by default.

---

# 32. Data Tables

Tables should support:

- Numeric alignment
- Tabular numbers
- Sticky headers where useful
- Responsive horizontal scrolling
- Row hover
- Loading skeletons
- Empty states
- Pagination/virtualization for large datasets

Use JetBrains Mono selectively for financial values.

---

# 33. Status Badges

Recommended states:

```text
ACTIVE
PENDING
COMPLETED
CANCELLED
FAILED
REJECTED
PROCESSING
VERIFIED
SUSPENDED
```

Design:

- Small
- Rounded
- Low-saturation background
- High-contrast text

Never use saturated full-color badges everywhere.

---

# 34. Skeleton Loading

Use skeletons instead of unnecessary spinners.

Example:

```text
██████████████
████████
████████████████████
```

Skeleton color should adapt to theme.

Dark:

`#1A2144`

Light:

`#E2E8F0`

---

# 35. Empty States

Every major data-driven component should have a designed empty state.

Structure:

```text
Icon
Title
Short explanation
Primary action
Optional secondary action
```

Avoid large decorative illustrations.

---

# 36. Error States

Error UI should be:

- Clear
- Actionable
- Non-technical by default
- Traceable internally

Example:

```text
Something went wrong

We couldn't load your market data.
Please try again.

[ Retry ]
```

Technical request IDs can be available under an expandable details section.

---

# 37. Toasts

Use for:

- Order submitted
- Order cancelled
- Wallet action completed
- Settings saved
- Security events

Do not use toasts for critical irreversible financial information that requires explicit user confirmation.

---

# 38. Design Tokens

Recommended token architecture:

```text
colors/
  brand
  neutral
  dark
  semantic
  brass

typography/
  font-family
  font-size
  font-weight
  line-height
  letter-spacing

spacing/
  1–30

radius/
  xs–full

shadow/
  sm–xl

motion/
  duration
  easing

z-index/
  base
  dropdown
  sticky
  modal
  toast
```

Expose tokens through CSS variables.

---

# 39. CSS Variable Foundation

```css
:root {
  --color-brand-500: #145B8C;
  --color-brand-700: #002C55;
  --color-slate: #89AEC8;
  --color-brass: #7B6727;
  --color-midnight: #0B0E29;
  --color-frost: #F0F6F7;

  --color-success: #16A34A;
  --color-danger: #DC2626;
  --color-warning: #D97706;
  --color-info: #2563EB;

  --font-sans: "Inter", sans-serif;
  --font-display: "Space Grotesk", sans-serif;
  --font-mono: "JetBrains Mono", monospace;

  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
}
```

Dark-mode variables should override only what changes.

---

# 40. Technology Stack

## Web

- TypeScript
- React
- Next.js
- Tailwind CSS
- shadcn/ui
- Radix UI primitives where required
- TanStack Query
- Zustand
- React Hook Form
- Zod
- Lightweight Charts
- Lucide React

## Mobile

- React Native
- Expo
- TypeScript

## Backend

- Cloudflare Workers
- TypeScript
- Hono
- Durable Objects
- D1
- R2
- KV
- Cloudflare Queues
- Cron Triggers

## Testing

- Vitest
- React Testing Library
- Playwright
- Expo testing tools

## Repository

- Git
- GitHub
- pnpm
- Turborepo

## Code quality

- ESLint
- Prettier
- TypeScript strict mode
- Husky
- lint-staged

---

# 41. Recommended Web Architecture

```text
Next.js
│
├── App Router
├── Server Components
├── Client Components
├── Tailwind
├── shadcn/ui
├── TanStack Query
├── Zustand
├── Zod
└── WebSocket Client
```

### Rule

Use Server Components for static/server-renderable content.

Use Client Components only when required for:

- Interaction
- Browser APIs
- Real-time updates
- Charts
- Trading controls
- Local state

Do not make the entire application client-rendered without a reason.

---

# 42. Backend Architecture

```text
Cloudflare
│
├── Workers
│   ├── API
│   ├── Authentication
│   ├── Business logic
│   └── WebSocket gateway
│
├── Durable Objects
│   ├── Market rooms
│   ├── Realtime state
│   ├── Connection coordination
│   └── Serialized state
│
├── D1
│   └── Persistent relational data
│
├── R2
│   └── Private files
│
├── KV
│   └── Cache/config where appropriate
│
└── Queues/Cron
    └── Background work
```

---

# 43. Monorepo Structure

```text
ethsltd-crypto/
│
├── apps/
│   ├── web/
│   ├── admin/
│   └── mobile/
│
├── services/
│   ├── api/
│   ├── realtime/
│   ├── trading/
│   ├── ledger/
│   ├── p2p/
│   ├── risk/
│   ├── notifications/
│   └── contracts/
│
├── packages/
│   ├── ui/
│   ├── design-tokens/
│   ├── types/
│   ├── validation/
│   ├── api-client/
│   ├── auth/
│   ├── config/
│   └── utils/
│
├── database/
│   ├── migrations/
│   ├── schema/
│   └── seeds/
│
├── infrastructure/
│   └── cloudflare/
│
├── docs/
│
├── .github/
│   └── workflows/
│
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
└── README.md
```

---

# 44. Design System Package

Create:

```text
packages/design-tokens/
```

Contents:

```text
colors.css
typography.css
spacing.css
radius.css
shadows.css
motion.css
themes.css
index.css
```

And:

```text
packages/ui/
```

Contents:

```text
Button
Input
Select
Modal
Dialog
Dropdown
Tabs
Card
Badge
Tooltip
Toast
Table
Skeleton
Avatar
ChartContainer
Price
Stat
EmptyState
ErrorState
```

---

# 45. Tailwind Configuration

Tailwind should consume the ETHSLTD design tokens instead of inventing colors per component.

Do not write:

```text
bg-blue-500
```

randomly throughout the application.

Prefer semantic classes/tokens such as:

```text
bg-brand
text-primary
text-secondary
bg-surface
border-default
text-success
text-danger
```

This makes global theme changes safe.

---

# 46. Theme Architecture

Support:

```text
Light
Dark
System
```

Persist user preference locally/server-side where appropriate.

Theme switching must not cause:

- Layout shifts
- Flash of incorrect theme
- Broken chart colors
- Broken modal colors
- Incorrect contrast

---

# 47. Component State Rules

Every interactive component should define:

```text
Default
Hover
Focus
Active
Disabled
Loading
Success
Error
Empty
```

Financial components additionally need:

```text
Price Up
Price Down
Partial
Locked
Pending
Restricted
```

---

# 48. AI Agent Behavior

The AI coding agent must treat this document as the **visual source of truth**.

## AI agent priorities

1. Preserve design tokens.
2. Preserve accessibility.
3. Preserve responsive behavior.
4. Reuse existing components.
5. Avoid duplicate components.
6. Avoid arbitrary colors.
7. Avoid arbitrary typography.
8. Avoid unnecessary dependencies.
9. Keep trading UI performant.
10. Never sacrifice financial data readability for decoration.

---

# 49. AI Agent — Color Rules

The AI agent MUST:

- Use ETHSLTD tokens.
- Use semantic colors for financial states.
- Use Brass only for premium context.
- Use Marine/Midnight for brand depth.
- Check contrast.
- Avoid arbitrary hex codes.

If a new color is required:

1. Check whether an existing token can satisfy the requirement.
2. If not, create a semantic token.
3. Document its purpose.
4. Do not scatter a raw HEX value through components.

---

# 50. AI Agent — Typography Rules

The AI agent MUST:

- Use Inter for functional UI.
- Use Space Grotesk for display/marketing headings.
- Use JetBrains Mono for technical/numeric data.
- Use consistent font weights.
- Use tabular numbers for financial values.
- Never introduce another font without explicit design-system approval.

---

# 51. AI Agent — Layout Rules

The AI agent MUST:

- Follow the 8px spacing system.
- Respect max-width containers.
- Design mobile independently.
- Avoid excessive nesting.
- Maintain visual hierarchy.
- Use responsive grids.
- Avoid fixed widths that break mobile.
- Avoid horizontal overflow except intentional data tables/trading layouts.

---

# 52. AI Agent — Component Rules

Before creating a component:

```text
1. Search existing UI package.
2. Reuse if available.
3. Extend if appropriate.
4. Create new only if genuinely different.
```

Never create:

```text
PrimaryButton
MainButton
BlueButton
TradingButton
SubmitButton
```

when a shared `Button` component can handle variants.

---

# 53. AI Agent — Dependency Rules

Before adding a dependency:

```text
1. Check whether the project already has a solution.
2. Check whether a native/browser solution is sufficient.
3. Check bundle size and maintenance.
4. Check compatibility with Cloudflare/Next.js/Expo.
5. Add only when justified.
```

Avoid dependency bloat.

---

# 54. AI Agent — Financial UI Rules

For trading/financial screens:

- Never visually obscure prices.
- Never animate balances unnecessarily.
- Never use decorative gradients behind critical numbers.
- Never use low-contrast text for financial values.
- Never rely on color alone.
- Never round financial numbers incorrectly.
- Never display fake live data as real data.
- Never create mock trading activity in production UI.

---

# 55. AI Agent — Realtime Rules

Realtime components should:

```text
Initial snapshot
        ↓
WebSocket connection
        ↓
Incremental updates
        ↓
Local state update
        ↓
Render only affected data
```

Do not implement high-frequency market updates using repeated REST polling unless there is a specific fallback requirement.

---

# 56. AI Agent — Performance Rules

The agent must prioritize:

- Minimal JavaScript
- Code splitting
- Lazy loading
- Virtualized lists
- Memoization where justified
- Stable component boundaries
- Efficient WebSocket updates
- Image optimization
- Font optimization
- Server rendering where appropriate

Never optimize prematurely by making code unreadable.

---

# 57. AI Agent — Accessibility Rules

Every new component must consider:

```text
Keyboard
Focus
Screen reader
Contrast
Reduced motion
Touch target
ARIA
Semantic HTML
```

Minimum touch target:

`44 × 44px`

where practical.

---

# 58. AI Agent — Responsive Rules

Test mentally and, when tooling is available, visually at:

```text
360px
390px
430px
768px
1024px
1280px
1440px
1536px
1920px
```

No major component is considered complete until it behaves correctly across mobile, tablet and desktop.

---

# 59. AI Agent — Dark/Light Rules

Every new UI element must work in:

```text
Light
Dark
```

Do not hard-code white or black backgrounds into reusable components.

Use semantic tokens.

---

# 60. AI Agent — Code Organization Rules

Keep:

```text
UI
Domain
Data fetching
State
Validation
Infrastructure
```

separated.

Do not put business logic directly into presentational components.

Example:

```text
Button.tsx
```

should not know anything about:

```text
wallet
order
ledger
KYC
P2P
```

---

# 61. AI Agent — Naming

Use predictable names.

Components:

```text
MarketCard
PriceDisplay
OrderBook
TradeForm
WalletCard
AssetRow
StatusBadge
```

Hooks:

```text
useMarket
useOrderBook
useWallet
useTheme
useRealtime
```

Utilities:

```text
formatPrice
formatQuantity
formatCurrency
formatPercentage
```

---

# 62. AI Agent — Formatting

All financial formatting must be centralized.

Never repeatedly write custom:

```text
toFixed()
```

logic throughout components.

Use centralized formatting utilities that respect:

- Asset precision
- Currency
- Locale
- Rounding rules
- Display context

---

# 63. AI Agent — Mock Data Rules

Mock data must be clearly separated:

```text
mocks/
fixtures/
seed/
```

Never mix mock data into production service logic.

Visual demos may use realistic-looking sample data, but must be explicitly marked where user could mistake it for live financial information.

---

# 64. AI Agent — Error Handling

The agent should implement:

```text
Loading
Success
Empty
Error
Retry
Offline
Unauthorized
Forbidden
Rate Limited
```

Do not leave blank screens when an API fails.

---

# 65. AI Agent — Security Rules

Never place:

- API secrets
- private keys
- signing keys
- database credentials
- server-only tokens

inside:

```text
React components
Next.js client bundles
Expo client code
public/
```

Use server-side secrets.

---

# 66. AI Agent — SEO Rules

Marketing pages should use:

- Semantic headings
- Metadata
- Open Graph
- Twitter/X card metadata
- Canonical URLs
- Structured data where appropriate
- Descriptive image alt text
- Clean URLs

Trading application screens do not need to be SEO-heavy.

---

# 67. AI Agent — UI Review Checklist

Before marking a UI task complete:

```text
[ ] Correct colors
[ ] Correct typography
[ ] Correct spacing
[ ] Light mode
[ ] Dark mode
[ ] Mobile
[ ] Tablet
[ ] Desktop
[ ] Keyboard accessibility
[ ] Loading state
[ ] Empty state
[ ] Error state
[ ] Hover state
[ ] Focus state
[ ] Disabled state
[ ] No arbitrary colors
[ ] No unnecessary dependencies
[ ] No duplicated component
[ ] No console errors
[ ] No layout overflow
[ ] No obvious performance issue
```

---

# 68. Visual Quality Standard

ETHSLTD Crypto should look:

```text
Premium
        +
Trustworthy
        +
Institutional
        +
Modern
        +
Crypto-native
        +
Data-rich
        +
Minimal
```

The interface should communicate:

> **"This is a serious financial technology platform."**

Not:

> "This is a cryptocurrency-themed website."

---

# 69. Final Design Formula

```text
ETHSLTD

Marine
+
Midnight
+
Frost
+
Slate
+
Selective Brass
+
Inter
+
Space Grotesk
+
JetBrains Mono
+
8px Grid
+
Subtle Motion
+
Strong Data Hierarchy
+
Dark-first Trading UI
+
Clean Light Mode
+
Accessible Components
+
Responsive Layouts
```

---

# 70. Non-Negotiable Design Rules

1. No random colors.
2. No random fonts.
3. No excessive gradients.
4. No excessive glassmorphism.
5. No neon cyberpunk aesthetic.
6. No decorative clutter around trading data.
7. No color-only financial indicators.
8. No inaccessible low-contrast text.
9. No desktop-only layouts.
10. No duplicated UI primitives.
11. No unnecessary dependencies.
12. No fake live data in production.
13. No financial calculations in presentation components.
14. No secrets in frontend code.
15. No direct raw HEX values when a design token exists.
16. No component should bypass the design system without a documented reason.

---

# 71. Technology Decision Summary

| Layer | Standard |
|---|---|
| Language | TypeScript |
| Web | React + Next.js |
| Styling | Tailwind CSS |
| Components | shadcn/ui + Radix |
| State | Zustand |
| Server state | TanStack Query |
| Forms | React Hook Form |
| Validation | Zod |
| Charts | Lightweight Charts |
| Icons | Lucide React |
| Mobile | React Native + Expo |
| API | Cloudflare Workers + Hono |
| Realtime | Durable Objects + WebSocket |
| Database | Cloudflare D1 |
| Object storage | Cloudflare R2 |
| Cache/config | Cloudflare KV |
| Jobs | Cloudflare Queues + Cron |
| Monorepo | pnpm + Turborepo |
| Testing | Vitest + Playwright |
| Repository | GitHub |
| CI/CD | GitHub Actions + Cloudflare |
| Fonts | Inter + Space Grotesk + JetBrains Mono |
| Design tokens | CSS variables + Tailwind theme |
| Primary brand | `#145B8C` |
| Deep brand | `#002C55` |
| Dark background | `#0B0E29` |
| Secondary | `#89AEC8` |
| Premium | `#7B6727` |
| Light background | `#F0F6F7` |
| Positive | `#16A34A` |
| Negative | `#DC2626` |

---

# 72. Source-of-Truth Instruction for AI Coding Agents

When an AI coding agent works on ETHSLTD Crypto, it should interpret this document in the following order:

```text
1. Design tokens
        ↓
2. Accessibility
        ↓
3. Responsive behavior
        ↓
4. Shared components
        ↓
5. Performance
        ↓
6. Visual polish
        ↓
7. Decorative enhancement
```

If visual decoration conflicts with usability, **usability wins**.

If brand styling conflicts with accessibility, **accessibility wins**.

If a new feature conflicts with the design system, **extend the design system instead of bypassing it**.

If an implementation choice is uncertain, prefer the **simplest reusable solution consistent with the existing architecture**.

---

## End of Design System Specification
