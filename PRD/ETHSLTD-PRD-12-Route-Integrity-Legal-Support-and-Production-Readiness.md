Yes. Based on the complete project record and the latest master architecture, the next work should **not** be another feature PRD in isolation. The immediate objective should be to make the existing application **internally complete and navigationally production-grade**: every visible CTA must resolve to a meaningful destination, missing destination pages must be created, legal/support destinations must not be incorrectly routed to `/support`, and the entire route graph must be validated.

The existing project already has the major functional surfaces—Home, Markets, Trade, Authentication/Account, P2P, Wallet, Admin, Support/Notifications, and the developer platform—and the architecture is now a Turborepo + Next.js + Hono + D1/Drizzle structure.  

## Recommended next PRD

**Filename: `ETHSLTD-PRD-12-Route-Integrity-Legal-Support-and-Production-Readiness.md`**

I would make this the next PRD rather than simply a "fix 28 links" task.

Why: routing those links to `/support` would technically remove `href="#"`, but it would create semantically incorrect navigation. The project already defines `/support`, `/support/tickets`, and ticket workspaces as customer-support functionality, while the developer record also identifies legal/compliance-related functionality separately. 

# ETHSLTD PRD-12 — Route Integrity, Legal, Support & Production Readiness

### 1. PRD objective

Create a complete, internally consistent navigation and public-information layer for ETHSLTD so that:

* No production UI contains `href="#"`.
* No button that appears actionable is non-functional.
* Every global navigation item has a valid destination.
* Every homepage CTA has a valid destination.
* Footer links have semantically correct destinations.
* Legal links have dedicated legal pages.
* Educational links have a dedicated learning area or valid article destination.
* Support links lead to actual support functionality.
* Authenticated destinations enforce authentication.
* Admin destinations enforce RBAC.
* External links are explicitly marked and safely opened.
* Invalid routes display a proper 404 experience.
* Redirects are intentional and documented.
* All routes work in both light and dark themes.
* All routes preserve the existing USD-first product convention.
* Automated navigation testing reports **0 broken internal links**.

The project already uses a shared global header/footer and has a substantial route ecosystem, so this PRD should extend that architecture rather than introduce a parallel navigation system. 

---

# 2. Current problem

The current automated inspection has identified **28 links/buttons using `href="#"`**.

These are not acceptable in the finished application because they produce one or more of:

* no navigation,
* URL mutation without destination,
* poor accessibility,
* misleading CTA behavior,
* failed automated navigation testing,
* incomplete footer navigation,
* incomplete legal navigation.

### Critical rule

Do **not** solve this by blindly replacing every `#` with `/support`.

Instead:

> Every CTA must lead to the page that fulfills the user's expectation created by its label.

Examples:

| Current label   | Correct destination      |
| --------------- | ------------------------ |
| Assets          | `/markets`               |
| Explore Markets | `/markets`               |
| View Markets    | `/markets`               |
| Explore Trading | `/trade`                 |
| Demo Trading   | `/trade`                 |
| P2P Marketplace | `/p2p`                   |
| Buy Crypto      | `/p2p?side=buy`          |
| Sell Crypto     | `/p2p?side=sell`         |
| Wallet          | `/wallet`                |
| Deposit         | `/wallet/deposit`        |
| Withdraw        | `/wallet/withdraw`       |
| Notifications   | `/notifications`         |
| Support         | `/support`               |
| Contact Support | `/support/tickets/new`   |
| Security        | `/account/security`      |
| Learn           | `/learn`                 |
| Trading Guide   | `/learn/trading`         |
| Crypto Basics   | `/learn/crypto-basics`   |
| Market Insights | `/learn/market-insights` |
| Fees            | `/fees`                  |
| Privacy         | `/legal/privacy`         |
| Terms           | `/legal/terms`           |
| Risk Disclosure | `/legal/risk-disclosure` |
| Cookies         | `/legal/cookies`         |

The exact routes should become the canonical route map for the application.

---

# 3. Canonical public route architecture

The application should use this structure.

```text
/
├── markets
├── trade
├── p2p
├── p2p/orders
│
├── learn
│   ├── crypto-basics
│   ├── trading
│   ├── security
│   └── market-insights
│
├── fees
│
├── support
│   ├── tickets
│   ├── tickets/new
│   └── tickets/[id]
│
├── legal
│   ├── terms
│   ├── privacy
│   ├── risk-disclosure
│   ├── cookies
│   └── security
│
├── account
│   ├── profile
│   ├── security
│   ├── sessions
│   └── preferences
│
├── wallet
│   ├── deposit
│   ├── withdraw
│   └── history
│
├── notifications
│
├── developer
│   ├── docs
│   ├── playground
│   ├── api-keys
│   └── usage
│
└── admin
    ├── users
    ├── kyc
    ├── deposits
    ├── withdrawals
    ├── orders
    ├── trades
    ├── p2p
    └── support
```

This aligns with the already-defined product areas instead of creating conflicting navigation. Wallet, admin, support, notifications and developer functionality are already documented in the master project record.  

---

# 4. Header PRD

## 4.1 Header navigation

The global header must become the authoritative navigation source.

### Primary navigation

**Markets**

```text
/markets
```

**Trade**

```text
/trade
```

**P2P**

```text
/p2p
```

**Learn**

```text
/learn
```

**More**

Open a controlled dropdown.

### More dropdown

```text
Fees
Security
Support
Developer API
About ETHSLTD
```

Destinations:

```text
/fees
/account/security
/support
/developer
/about
```

If `/about` is not currently required by the product, either create it under this PRD or remove the menu item. Never leave a placeholder.

---

# 5. Header authentication actions

### Logged-out state

Display:

```text
Log In
Sign Up
```

Routes:

```text
/login
/register
```

### Logged-in state

Display:

```text
Wallet
Notifications
Profile
```

Routes:

```text
/wallet
/notifications
/account/profile
```

### Mobile

The mobile menu must contain exactly the same navigational destinations as desktop.

No mobile-only placeholder links.

---

# 6. Header active state

The existing implementation already detects pathname state for the Markets route.

Extend that logic to all top-level navigation.

Examples:

```text
/markets/*
    → Markets active

/trade/*
    → Trade active

/p2p/*
    → P2P active

/learn/*
    → Learn active
```

The active indicator must remain consistent with the current ETHSLTD design system.

---

# 7. Footer PRD

The footer should be reorganized into meaningful groups.

## Product

```text
Markets
Trade
Demo Trading
P2P Marketplace
Wallet
```

## Markets

```text
Markets
Supported Assets
Top Gainers
Top Losers
```

## P2P

```text
P2P Marketplace
Buy Crypto
Sell Crypto
P2P Orders
Disputes
```

## Learn

```text
Crypto Basics
Trading Guide
Security
Market Insights
```

## Company / Support

```text
About
Support
Contact
Fees
```

## Legal

```text
Terms
Privacy
Risk Disclosure
Cookies
```

## Developers

```text
API
Documentation
API Keys
```

Every item must have an actual route.

---

# 8. Homepage CTA mapping

The homepage is already complete visually and contains the main conversion sections. 

Now every CTA must be audited.

### Hero

**Explore Markets**

```text
/markets
```

**Start Trading**

```text
/trade
```

If "Start Trading" is intended to be account-first:

```text
/register?redirect=/trade
```

The latter is preferable once authentication is live.

---

# 9. Trading Experience section

### Explore Trading

```text
/trade
```

### View Markets

```text
/markets
```

### Learn More

Use the specific feature destination rather than `/support`.

---

# 10. Demo Trading section

### Start Demo Trading

```text
/trade
```

### Learn About Demo Trading

Create:

```text
/learn/demo-trading
```

This is better than routing educational intent into support.

---

# 11. P2P section

The existing P2P implementation already has a marketplace, order workspace, chat and order history. 

### Explore P2P

```text
/p2p
```

### Buy Crypto

```text
/p2p?side=buy
```

### Sell Crypto

```text
/p2p?side=sell
```

The P2P page must read these query parameters and initialize the appropriate side.

---

# 12. Security section

Current CTA:

```text
Learn About Security
```

Should **not** point to generic support.

Use:

```text
/learn/security
```

The account security page remains:

```text
/account/security
```

These serve different purposes.

### `/learn/security`

Public educational/security information.

### `/account/security`

User-specific account security controls.

This distinction is important because the existing account security area already contains password, 2FA and anti-phishing functionality. 

---

# 13. Educational / Learn system

A real Learn section should be created.

## `/learn`

Landing page.

Contents:

* Crypto basics
* Trading fundamentals
* Demo trading
* Technical analysis
* Risk management
* Security
* P2P safety
* Market insights
* Glossary

---

# 14. `/learn/crypto-basics`

Content:

* What is cryptocurrency?
* Bitcoin
* Ethereum
* Blockchain
* Wallets
* Tokens
* Stablecoins
* Market orders
* Limit orders
* Fees
* Network fees
* Custody

---

# 15. `/learn/trading`

Content:

* Market orders
* Limit orders
* Stop orders
* Order book
* Bid/ask
* Spread
* Liquidity
* Candlestick charts
* Trading fees
* Demo trading
* Risk management

The content should explain the same terminology used by `/trade`.

---

# 16. `/learn/security`

Public security education.

Content:

* Account protection
* Password security
* 2FA
* Anti-phishing
* Device security
* Withdrawal safety
* P2P safety
* Scam awareness

---

# 17. `/learn/market-insights`

This can initially use static/mock articles.

Cards:

```text
Market Update
Bitcoin Overview
Ethereum Overview
Crypto Market Basics
Trading Concepts
```

Do not represent mock articles as real market research.

Use an explicit content status if the information is simulated.

---

# 18. Fees page

Create:

```text
/fees
```

This is necessary because "Fees" should not redirect to support.

## Required sections

### Trading fees

Maker / Taker.

### P2P fees

Explain applicable simulated/current policy.

### Withdrawal fees

Explain network-dependent nature.

### Deposit fees

Explain supported funding method policies.

### Important

Never hard-code marketing claims such as:

> 0% fees

unless they are actually accurate for the specific operation.

The homepage currently advertises "0% Hidden Fees"; that wording should remain semantically consistent with a fee schedule. 

---

# 19. Legal architecture

This is the most important missing routing correction.

Do **not** route:

```text
Privacy
Terms
Risk Disclosure
Cookies
```

to `/support`.

Create:

```text
/legal
```

with dedicated documents.

---

# 20. `/legal/terms`

Include:

* Platform usage terms
* Account responsibilities
* Trading rules
* P2P rules
* Prohibited activities
* Fees
* Account suspension
* Termination
* Intellectual property
* Disclaimers
* Limitation of liability
* Governing law placeholder
* Contact information
* Effective date
* Version

Because this is a financial/crypto product, the production version must undergo jurisdiction-specific legal review.

---

# 21. `/legal/privacy`

Include:

* Data collected
* Account data
* Device information
* Security data
* KYC information
* Transaction data
* Cookies
* Analytics
* Support data
* Third-party processors
* Data retention
* User rights
* Security practices
* Contact
* Effective date

Do not claim compliance with a specific privacy law unless legally verified.

---

# 22. `/legal/risk-disclosure`

This is particularly important for ETHSLTD.

Include risks around:

* Cryptocurrency volatility
* Market loss
* Liquidity
* Trading execution
* Network congestion
* Blockchain transactions
* Stablecoin risk
* Custody risk
* P2P counterparty risk
* Cybersecurity risk
* Regulatory risk
* Tax responsibility
* Technology failure
* Force majeure

The page must make clear whether the current application is **demo/simulation trading** or real-money trading.

---

# 23. `/legal/cookies`

Include:

* Essential cookies
* Authentication cookies
* Preference cookies
* Analytics cookies
* Support/chat cookies
* Cookie duration
* Third-party cookies
* Cookie management

Tawk.to is already globally integrated, so the legal/privacy treatment of that third-party service needs to be accounted for. 

---

# 24. `/legal/security`

Public security information.

Include:

* Account security
* Encryption
* Authentication
* 2FA
* Infrastructure
* Monitoring
* Incident response
* Responsible disclosure
* Security contact

Do not make unsupported claims such as "bank-grade" or "cold storage" unless those controls actually exist in the production backend.

---

# 25. Support architecture

The existing support architecture already defines:

```text
/support
/support/tickets
/support/tickets/[id]
/admin/support
```

with notification and ticket functionality. 

Therefore do **not** create a second support architecture.

Extend the existing one.

---

# 26. Support homepage

`/support`

Required:

### Search

Search help content.

### Popular topics

```text
Account
Trading
Wallet
P2P
Security
Fees
```

### Quick actions

```text
Open Support Ticket
View My Tickets
Live Chat
```

### Existing Tawk.to

Keep the existing integration.

---

# 27. Create-ticket route

Add:

```text
/support/tickets/new
```

Fields:

```text
Category
Subject
Description
Related order
Related transaction
Attachment
Priority
```

Categories:

```text
Account
Trading
Wallet
P2P
Security
Technical
Other
```

---

# 28. Existing ticket workspace

Keep:

```text
/support/tickets/[id]
```

Add:

* Ticket status
* Created timestamp
* Last response
* Agent identity
* User replies
* Attachments
* Security warnings
* Close ticket
* Reopen ticket

---

# 29. Admin support consistency

Existing:

```text
/admin/support
```

must remain separate from:

```text
/support/tickets
```

Admin can:

* Search tickets
* Assign agent
* Change status
* Add internal note
* Respond
* Escalate
* Close
* Reopen

Internal notes must never be rendered to users.

---

# 30. Wallet link integrity

The project already defines:

```text
/wallet
/wallet/deposit
/wallet/withdraw
/wallet/history
```

and simulated USD balances. 

Therefore footer links should use these exact destinations.

No placeholder wallet links.

---

# 31. Authentication-aware navigation

A critical production requirement.

If a logged-out user clicks:

```text
/wallet
```

redirect to:

```text
/login?redirect=/wallet
```

After authentication:

```text
→ /wallet
```

Likewise:

```text
/account/profile
/account/security
/account/sessions
/notifications
/p2p/orders
/wallet/deposit
/wallet/withdraw
```

must require appropriate authentication.

---

# 32. Admin-aware navigation

Admin links should never appear for normal users.

The project already specifies an `AdminPermissionGuard` for `/admin`. 

Implement:

```text
ADMIN
SUPER_ADMIN
COMPLIANCE_ADMIN
FINANCE_ADMIN
SUPPORT_ADMIN
TRADING_ADMIN
```

according to the existing permission architecture.

---

# 33. Developer navigation

The developer platform already includes:

* Developer portal
* REST/WebSocket documentation
* Playground
* API keys
* Usage metrics. 

Canonical routes:

```text
/developer
/developer/docs
/developer/playground
/developer/api-keys
/developer/usage
```

If the current implementation uses another route naming convention, standardize it rather than duplicating pages.

---

# 34. 404 page

Create a proper:

```text
/not-found
```

experience.

Design:

```text
404

This page doesn't exist.

Explore Markets
Return Home
Contact Support
```

Buttons:

```text
/markets
/
/support
```

---

# 35. Error page

Create:

```text
/error
```

with:

```text
Something went wrong.

Try Again
Return Home
Contact Support
```

Must preserve theme.

---

# 36. Loading states

Every major route needs a meaningful loading state.

Examples:

```text
markets/loading
trade/loading
wallet/loading
p2p/loading
support/loading
account/loading
```

Use skeleton UI consistent with the design system.

Do not display blank screens.

---

# 37. Route metadata

Every public page must have:

```text
title
description
canonical URL
Open Graph metadata
Twitter metadata
robots policy
```

Examples:

### Markets

```text
ETHSLTD Markets | Explore Crypto Markets
```

### Trade

```text
ETHSLTD Trading | Demo Trading
```

### P2P

```text
ETHSLTD P2P | Buy & Sell Crypto
```

### Support

```text
ETHSLTD Support
```

---

# 38. SEO

Public pages should be indexable where appropriate:

```text
/
 /markets
 /learn
 /learn/*
 /fees
 /support
 /legal/*
```

Authenticated/private routes:

```text
/account/*
/wallet/*
/notifications
/admin/*
/developer/api-keys
```

should not be indexed.

---

# 39. Internal-link component

Introduce a shared abstraction.

For example:

```text
<AppLink />
```

Responsibilities:

* Internal navigation
* External URL handling
* analytics hooks
* accessibility
* consistent prefetch behavior
* disabled state
* route validation during development

This reduces the chance of future `href="#"` links.

---

# 40. CTA component

Create a standard CTA abstraction.

Example:

```text
<CTA
  href="/markets"
  label="Explore Markets"
/>
```

No CTA should accept:

```text
"#"
```

in production.

Development linting should reject it.

---

# 41. Button-vs-link rule

This needs to be standardized.

### Use `<Link>` when:

The action navigates somewhere.

### Use `<button>` when:

The action performs an interaction.

Examples:

Correct:

```text
Explore Markets → Link
Theme Toggle → Button
Open Menu → Button
Sort Table → Button
Cancel Order → Button
```

Incorrect:

```text
<button>Explore Markets</button>
```

if the only purpose is navigation.

---

# 42. External links

External links must:

* use full HTTPS URL,
* include `rel="noopener noreferrer"` when opening a new tab,
* have an external-link icon where appropriate,
* have accessible labels.

Examples may include:

* official social profiles,
* app stores,
* external documentation,
* third-party support provider.

---

# 43. URL query consistency

P2P should support:

```text
/p2p?side=buy
/p2p?side=sell
```

Markets can support:

```text
/markets?search=BTC
/markets?category=USDT
```

Trade can support:

```text
/trade?symbol=BTC-USDT
```

The existing market/trading provider architecture should remain the source of truth rather than introducing duplicated state.

---

# 44. Cross-page consistency

All pages must retain:

* Header
* Footer where appropriate
* Theme toggle
* Brand tokens
* Typography
* Responsive breakpoints
* USD defaults
* Button styles
* Cards
* Borders
* Radius
* Motion
* Loading behavior
* Error behavior

The project already uses Tailwind v4 semantic tokens and Light/Dark mode, so the new pages must use those existing tokens rather than hardcoded colors. 

---

# 45. USD-first requirement

This PRD must preserve the project's established USD convention.

Default fiat:

```text
USD
```

Not INR.

All new pages should use:

```text
$
USD
```

where applicable.

Examples:

```text
Trading fee: 0.10%
Minimum order: $10
P2P amount: $100
Portfolio value: $10,000
```

No INR should be introduced into this route-integrity work.

---

# 46. Accessibility

Every route must satisfy:

* keyboard navigation
* visible focus
* semantic HTML
* accessible labels
* correct heading hierarchy
* form labels
* ARIA only when necessary
* screen-reader-compatible navigation
* sufficient contrast
* reduced-motion support

---

# 47. Mobile requirements

Test:

```text
320px
375px
390px
430px
768px
1024px
1280px
1440px+
```

Navigation must not overflow.

Footer must collapse correctly.

Legal content must remain readable.

Tables should scroll horizontally where required.

---

# 48. Browser compatibility

At minimum test:

* Chrome
* Edge
* Firefox
* Safari
* iOS Safari
* Android Chrome

---

# 49. Broken-link scanner

The existing Puppeteer test should be upgraded.

Do not only test:

```text
href="#"
```

Test every internal route.

### Detect

```text
href="#"
href=""
href="javascript:"
undefined href
malformed internal URL
404 response
500 response
redirect loop
```

---

# 50. Navigation crawler

The test should:

1. Open homepage.
2. Collect all visible anchors.
3. Collect buttons that are expected to navigate.
4. Click/open each route.
5. Verify HTTP/Next.js response.
6. Verify no 404.
7. Verify no uncaught browser errors.
8. Verify destination URL.
9. Return to source.
10. Continue recursively.

---

# 51. Link inventory

Generate an automated report:

```text
Source
Element
Label
Current href
Expected href
Status
HTTP status
```

Example:

```text
Hero.tsx
Explore Markets
#
/markets
PASS
```

This report becomes part of CI.

---

# 52. Zero-placeholder rule

Production build must fail if:

```text
href="#"
```

exists in application navigation code.

Also flag:

```text
TODO
Coming Soon
Under Construction
```

when used as a substitute for a required product destination.

---

# 53. Dead-end detection

The test must identify pages that have no useful next action.

Every public page should provide at least one logical path onward.

Examples:

`/learn/crypto-basics`

must link to:

```text
/trade
/markets
/learn/*
```

`/legal/privacy`

must provide:

```text
Back to ETHSLTD
Support
```

---

# 54. Redirect policy

Define canonical redirects.

Examples:

```text
/trading → /trade
/assets → /markets
/demo-trading → /trade
```

Only create redirects when an old URL is known to exist.

Don't create speculative redirects unnecessarily.

---

# 55. Production configuration audit

Before declaring the route system production-ready, inspect:

### Environment variables

No secrets committed.

### API URLs

No localhost references in production.

### Mock providers

Clearly isolated.

### Console logs

Remove debugging logs.

### Error messages

Never expose stack traces.

### Tawk.to

Ensure production configuration is correct.

### Analytics

Only use configured production IDs.

---

# 56. Mock-data warning

The current architecture intentionally uses mock providers that can later be replaced by live APIs. 

Therefore this PRD must **not** falsely claim that the platform is already a real-money production exchange.

Public pages should clearly distinguish:

```text
Demo Trading
```

from:

```text
Live Trading
```

until the real backend, custody, payment, compliance and settlement infrastructure is actually connected.

---

# 57. Legal content warning

Do not publish invented legal claims.

The implementation can create the page structure and placeholders, but production legal text must be reviewed and approved for the actual jurisdictions in which ETHSLTD operates.

Especially:

```text
Terms
Privacy
Risk Disclosure
P2P
KYC
AML
Electronic signatures
```

---

# 58. Security claims audit

Search the entire application for phrases such as:

```text
bank-grade
military-grade
100% secure
fully regulated
licensed
insured
cold storage
zero risk
guaranteed
```

Every claim must be backed by an actual implemented control or approved business/legal statement.

---

# 59. Footer legal disclaimer

The footer should include a concise disclaimer appropriate to the application's current state.

For the demo-trading environment, clearly communicate that simulated trading does not represent actual execution or guaranteed real-world results.

Exact legal language should be finalized by counsel.

---

# 60. Sitemap

Create/update:

```text
/sitemap.xml
```

Include public routes only.

Exclude:

```text
/account/*
/wallet/*
/admin/*
/notifications
```

unless there is a deliberate reason otherwise.

---

# 61. Robots

Create:

```text
/robots.txt
```

with appropriate public/private route rules.

---

# 62. Breadcrumbs

Add breadcrumbs to deep public content pages.

Example:

```text
Home
/
Learn
/learn
Crypto Basics
/learn/crypto-basics
```

Useful for:

* Learn
* Legal
* Support articles
* Developer documentation

Do not add unnecessary breadcrumbs to the trading terminal.

---

# 63. Search

The support search should search:

```text
articles
FAQs
guides
```

It should not pretend to search tickets unless explicitly implemented.

---

# 64. Global search

If the existing header contains a search icon/input, it must have an actual behavior.

Possible scope:

```text
Markets
Learn
Support
```

If not implementing global search yet, convert it into a proper button that opens a search modal rather than a dead link.

---

# 65. Notification navigation

Existing notifications support deep linking. 

Every notification must have:

```text
title
message
timestamp
category
read state
destination
```

A notification without a valid destination should fall back to:

```text
/notifications
```

rather than `#`.

---

# 66. Account navigation

Existing account routes should be treated as canonical.

```text
/account/profile
/account/security
/account/sessions
/account/preferences
```

No footer should link to an obsolete account route.

---

# 67. Wallet navigation

Canonical:

```text
/wallet
/wallet/deposit
/wallet/withdraw
/wallet/history
```

The existing wallet implementation already uses simulated transactions and shared balance state. 

---

# 68. P2P navigation

Canonical:

```text
/p2p
/p2p/orders
/p2p/order/[id]
```

Public marketplace:

```text
/p2p
```

Authenticated order history:

```text
/p2p/orders
```

Individual order:

```text
/p2p/order/[id]
```

---

# 69. Admin navigation

Canonical routes based on the existing implementation:

```text
/admin
/admin/users
/admin/users/[id]
/admin/kyc
/admin/deposits
/admin/withdrawals
/admin/orders
/admin/trades
/admin/p2p/disputes
/admin/support
```

These should never appear in public footer navigation.

---

# 70. Developer navigation

Canonical:

```text
/developer
/developer/docs
/developer/playground
/developer/api-keys
/developer/usage
```

Authentication should be required for API-key management and usage data.

The project already specifies granular API-key permissions such as Read, Trade and Withdraw. 

---

# 71. Production readiness matrix

At the end of this work, classify every route as:

| Status           | Meaning                                                               |
| ---------------- | --------------------------------------------------------------------- |
| READY            | Fully implemented and tested                                          |
| MOCK             | UI works but uses simulated data                                      |
| AUTH_REQUIRED    | Requires authentication                                               |
| ADMIN_ONLY       | Requires admin permission                                             |
| LEGAL_REVIEW     | Technical page exists but legal content requires approval             |
| BACKEND_REQUIRED | Cannot become real production functionality until backend integration |
| BLOCKED          | Missing implementation                                                |

This is more honest and useful than declaring the entire application "production-ready."

---

# 72. Important distinction

The current master record says the platform is structurally implemented and being wired toward a live production backend.  

Therefore:

### UI production readiness

Can be achieved.

### Real-money exchange production readiness

**Cannot be declared yet** merely by fixing routes.

It additionally requires verified:

* live backend
* financial ledger
* custody
* settlement
* KYC
* AML
* risk controls
* withdrawal controls
* reconciliation
* security testing
* legal approval
* regulatory requirements
* monitoring
* disaster recovery

---

# 73. Definition of Done

This PRD is complete only when all of the following are true.

### Navigation

* [ ] Zero `href="#"`.
* [ ] Zero empty hrefs.
* [ ] Zero dead navigation buttons.
* [ ] All Header links work.
* [ ] All Footer links work.
* [ ] All Homepage CTAs work.
* [ ] All account links work.
* [ ] All wallet links work.
* [ ] All P2P links work.
* [ ] All support links work.
* [ ] All developer links work.
* [ ] Admin links are permission-protected.

### Pages

* [ ] `/learn`
* [ ] `/learn/crypto-basics`
* [ ] `/learn/trading`
* [ ] `/learn/demo-trading`
* [ ] `/learn/security`
* [ ] `/learn/market-insights`
* [ ] `/fees`
* [ ] `/legal/terms`
* [ ] `/legal/privacy`
* [ ] `/legal/risk-disclosure`
* [ ] `/legal/cookies`
* [ ] `/legal/security`
* [ ] `/support/tickets/new`
* [ ] `/404` / Next.js not-found experience
* [ ] Error experience

### SEO

* [ ] Metadata implemented.
* [ ] Sitemap implemented.
* [ ] Robots implemented.
* [ ] Canonicals configured.
* [ ] Private routes excluded.

### UX

* [ ] Light mode works.
* [ ] Dark mode works.
* [ ] Mobile works.
* [ ] Keyboard navigation works.
* [ ] Focus states work.
* [ ] Loading states work.
* [ ] Error states work.

### Security

* [ ] Auth guards verified.
* [ ] Admin guards verified.
* [ ] No secrets in client code.
* [ ] No localhost production endpoints.
* [ ] No unsupported security claims.
* [ ] External links secured.

### Testing

* [ ] Puppeteer link test passes.
* [ ] Route crawler passes.
* [ ] No 404 internal routes.
* [ ] No console errors.
* [ ] No failed navigation.
* [ ] Build succeeds.
* [ ] TypeScript passes.
* [ ] ESLint passes.
* [ ] Existing tests pass.
* [ ] Mobile tests pass.

---

# 74. Exact implementation order

Since you asked for a plan rather than another development phase structure, the implementation sequence inside this PRD should be:

```text
1. Create canonical route registry
2. Inventory every existing href/button
3. Remove all href="#"
4. Fix Header
5. Fix Footer
6. Fix Homepage CTAs
7. Fix account/wallet/P2P links
8. Create Learn routes
9. Create Fees route
10. Create Legal routes
11. Complete Support ticket creation
12. Add 404
13. Add error/loading states
14. Standardize auth redirects
15. Standardize admin guards
16. Standardize query parameters
17. Add metadata
18. Add sitemap
19. Add robots
20. Add shared AppLink/CTA abstractions
21. Add automated dead-link detection
22. Run full route crawler
23. Run build/typecheck/lint
24. Run responsive tests
25. Run accessibility tests
26. Perform security-claim/content audit
27. Perform final production-readiness audit
```

---

# 75. Final canonical link mapping

This should be treated as the implementation source of truth:

```text
HOME
/

MARKETS
/markets

TRADE
/trade

P2P
/p2p

P2P BUY
/p2p?side=buy

P2P SELL
/p2p?side=sell

P2P ORDERS
/p2p/orders

WALLET
/wallet

DEPOSIT
/wallet/deposit

WITHDRAW
/wallet/withdraw

WALLET HISTORY
/wallet/history

ACCOUNT
/account/profile

SECURITY
/account/security

SESSIONS
/account/sessions

NOTIFICATIONS
/notifications

LEARN
/learn

CRYPTO BASICS
/learn/crypto-basics

TRADING GUIDE
/learn/trading

DEMO TRADING
/learn/demo-trading

SECURITY EDUCATION
/learn/security

MARKET INSIGHTS
/learn/market-insights

FEES
/fees

SUPPORT
/support

NEW TICKET
/support/tickets/new

MY TICKETS
/support/tickets

TERMS
/legal/terms

PRIVACY
/legal/privacy

RISK DISCLOSURE
/legal/risk-disclosure

COOKIES
/legal/cookies

SECURITY POLICY
/legal/security

DEVELOPER
/developer

DEVELOPER DOCS
/developer/docs

API PLAYGROUND
/developer/playground

API KEYS
/developer/api-keys

API USAGE
/developer/usage

ADMIN
/admin
```

---

## Bottom line

**Do not implement the proposed `/support` mapping for everything.** That would hide missing product surfaces instead of fixing them.

The correct next step is to make the application's **route architecture authoritative and complete**, then create the missing **Learn, Fees and Legal** surfaces, complete the Support entry point, and finally run a full automated route/CTA audit.

That is consistent with the application's existing architecture and implemented feature set: Markets, Trade, P2P, Wallet, Account, Admin, Support/Notifications and Developer Platform are already defined, while the backend is still being wired toward production. 

**Recommended file:** `ETHSLTD-PRD-12-Route-Integrity-Legal-Support-and-Production-Readiness.md`
