Yes. I’ve treated the current state as the source of truth:

- `/` — Homepage complete
- `/markets` — Markets complete
- `/trade` — Demo Trading Terminal complete
- Next logical product surface — **`/p2p`**
- Existing global Header/Footer, theme system, Tailwind design system, Zustand approach, TypeScript types, provider abstraction, mock-data architecture, and responsive behavior must remain intact.
- This PRD does **not** introduce a real-money P2P payment/escrow system. The implementation at this stage is a **fully interactive P2P simulation**, architected so the mock provider can later be replaced by a live backend.

Below is the complete implementation-ready PRD.

# ETHSLTD P2P Marketplace — Product Requirements Document

**Document:** P2P Marketplace Web Application
**Route:** `/p2p`
**Product:** ETHSLTD Crypto Trading Platform
**Current Platform State:** Homepage + Markets + Trade complete
**Next Development Surface:** P2P Marketplace
**Implementation Mode:** Interactive P2P simulation with mock provider
**Frontend:** Next.js + React + TypeScript
**Styling:** Tailwind CSS + existing ETHSLTD design tokens
**State:** Zustand
**Validation:** React Hook Form + Zod
**Data:** Mock P2P provider abstraction
**Persistence:** LocalStorage for simulation state where appropriate
**Theme:** Existing Light/Dark theme system
**Responsive:** Desktop, tablet and mobile
**Status:** Development-ready specification

---

# 1. Product Objective

The ETHSLTD P2P Marketplace allows users to discover simulated peer-to-peer cryptocurrency advertisements, compare offers, choose a buyer/seller, configure an order, and complete a simulated P2P transaction.

The experience should feel like a professional crypto P2P marketplace while remaining completely safe for the current development environment.

The page must provide:

- P2P advertisement discovery
- Buy Crypto
- Sell Crypto
- Fiat currency selection
- Crypto asset selection
- Payment method filtering
- Price comparison
- Available amount
- Order limits
- Merchant information
- Merchant reputation
- Advertisement details
- P2P order creation
- Simulated escrow state
- Simulated payment workflow
- Countdown/expiry behavior
- Buyer/seller confirmation
- P2P chat simulation
- Dispute simulation
- Order history
- Active order tracking
- Responsive mobile experience
- Strong security/safety messaging

The implementation must feel like a natural continuation of the already completed `/markets` and `/trade` experiences.

---

# 2. Product Positioning

ETHSLTD P2P should communicate:

> Buy and sell digital assets directly with other users, with clear pricing, flexible payment methods, and a guided transaction experience.

The P2P page should not look like a generic marketplace.

It should visually belong to the same ETHSLTD ecosystem:

- Premium
- Minimal
- Professional
- Trading-oriented
- Data-dense where useful
- Spacious where conversion matters
- Dark-mode-first
- Fully functional
- Mobile friendly

---

# 3. Relationship With Existing ETHSLTD Product

The current navigation is:

```
ETHSLTD

Markets
Trade
P2P
Assets
Learn
More

```

P2P becomes the active navigation item when the user is at:

```
/p2p

```

Existing routes must continue working:

```
/
/markets
/trade
/p2p

```

Do not redesign or break:

- Homepage
- Markets page
- Trade page
- Header
- Footer
- Theme switcher
- Search
- Tawk.to chat
- Back-to-top behavior

---

# 4. Important Product Boundary

This implementation is a **simulation**.

The application must NOT:

- connect to a real bank
- initiate real UPI payments
- initiate real wire transfers
- custody real cryptocurrency
- send real crypto
- create real escrow
- claim regulatory approval
- claim real KYC verification
- process real disputes
- process real financial settlements

All transaction states are simulated.

UI copy must make this clear where appropriate.

Example:

> P2P Demo Mode
> This marketplace currently uses simulated transactions. No real funds are transferred.

Do not repeatedly place this disclaimer in every component.

A compact, professional notice near the P2P marketplace controls is sufficient.

---

# 5. Primary User Personas

## 5.1 Buyer

User wants to:

- buy BTC
- buy USDT
- compare sellers
- select a payment method
- enter fiat amount
- review seller
- create an order
- simulate payment
- receive simulated crypto

---

## 5.2 Seller

User wants to:

- sell crypto
- compare buyer advertisements
- specify amount
- select payment method
- create an advertisement
- receive simulated payment
- release simulated crypto

---

## 5.3 Merchant

Merchant requires:

- advertisement management
- pricing
- limits
- payment methods
- transaction statistics
- reputation
- order management

For the current frontend implementation, merchant tools can be represented through simulated local state.

---

# 6. Primary P2P Modes

The main marketplace must provide two primary modes:

```
BUY
SELL

```

Default:

```
BUY

```

Users should be able to switch instantly.

Example:

```
[ Buy ] [ Sell ]

```

Selected state should use the existing ETHSLTD primary brand treatment.

---

# 7. Supported Simulated Assets

Initial mock data should support:

```
BTC
ETH
USDT
USDC
SOL

```

The architecture must allow additional assets without changing the UI components.

Asset configuration should contain:

```
type P2PAsset = {
  symbol: string
  name: string
  icon: string
  decimals: number
  status: "active" | "inactive"
}

```

---

# 8. Supported Fiat Currencies

Initial UI should support:

```
USD
USD
EUR
GBP
AED

```

Default:

```
USD

```

Architecture must support adding more currencies.

---

# 9. Payment Methods

Mock payment methods should include:

```
UPI
Bank Transfer
IMPS
NEFT
SEPA
PayPal
Wise
Cash Deposit

```

However, payment methods must be treated as **simulation metadata**, not real integrations.

Each payment method should contain:

```
type PaymentMethod = {
  id: string
  name: string
  icon: string
  currency: string[]
  enabled: boolean
}

```

---

# 10. P2P Page Information Architecture

The complete `/p2p` page should contain:

```
Global Header

P2P Hero

Demo Mode Notice

Buy / Sell Switcher

Asset Selector

Fiat Selector

Search / Filters

P2P Advertisement Table

Advertisement Cards

Merchant Reputation

P2P Safety Information

How P2P Works

FAQ

CTA

Global Footer

```

When a P2P order is active:

```
P2P Order Workspace

```

must become available.

---

# 11. Page Layout

Desktop:

```
┌────────────────────────────────────────────────────────────┐
│ Global Header                                               │
├────────────────────────────────────────────────────────────┤
│                                                            │
│ P2P Marketplace                                            │
│ Buy and sell crypto directly with other users.             │
│                                                            │
├────────────────────────────────────────────────────────────┤
│ Demo Mode Notice                                            │
├────────────────────────────────────────────────────────────┤
│                                                            │
│ [ Buy ] [ Sell ]                                            │
│                                                            │
│ Crypto   Fiat   Payment Method   Amount   Filters            │
│                                                            │
├────────────────────────────────────────────────────────────┤
│                                                            │
│ Advertisements                                              │
│                                                            │
│ Merchant | Price | Limits | Payment | Available | Action     │
│                                                            │
├────────────────────────────────────────────────────────────┤
│ Safety / How It Works                                       │
├────────────────────────────────────────────────────────────┤
│ Footer                                                      │
└────────────────────────────────────────────────────────────┘

```

---

# 12. P2P Hero

## Eyebrow

```
ETHSLTD P2P MARKETPLACE

```

## Heading

```
Trade Crypto Directly With People.

```

## Description

```
Find competitive offers, choose your preferred payment method,
and complete your P2P transaction through a simple guided experience.

```

## Primary CTA

```
Buy Crypto

```

## Secondary CTA

```
Sell Crypto

```

The hero should be significantly shorter than the homepage hero.

The user should reach advertisements quickly.

---

# 13. Demo Mode Banner

Display a compact banner:

```
P2P Demo Mode

Transactions on ETHSLTD are currently simulated.
No real money or cryptocurrency is transferred.

```

Optional action:

```
Learn More

```

Do not make this visually alarming.

---

# 14. Marketplace Control Bar

The primary marketplace controls should appear immediately after the hero.

Controls:

```
Buy / Sell

Asset

Fiat

Payment Method

Amount

Sort

Filters

```

Example:

```
Buy

BTC

USD

All payment methods

₹10,000

Best price

Filters

```

---

# 15. Asset Selector

Dropdown:

```
BTC
ETH
USDT
USDC
SOL

```

Each option:

```
Icon
Symbol
Full name

```

Example:

```
₿ BTC
Bitcoin

```

---

# 16. Fiat Selector

Dropdown:

```
USD — Indian Rupee
USD — US Dollar
EUR — Euro
GBP — British Pound
AED — UAE Dirham

```

---

# 17. Payment Method Selector

Options:

```
All methods

UPI

Bank Transfer

IMPS

NEFT

SEPA

PayPal

Wise

```

---

# 18. Amount Filter

Input:

```
I want to spend

```

Example:

```
₹25,000

```

The marketplace should filter advertisements whose:

```
minLimit <= requestedAmount <= maxLimit

```

If no advertisements match:

```
No offers match your amount.

Try increasing or decreasing your amount.

```

---

# 19. Advanced Filters

Filter drawer/popover:

```
Price Range

Minimum order

Maximum order

Payment methods

Merchant status

Completion rate

Minimum trades

Online only

```

Buttons:

```
Reset
Apply Filters

```

On mobile, filters should open as a bottom sheet.

---

# 20. Sort Options

Supported:

```
Best Price
Lowest Price
Highest Price
Fastest Completion
Highest Completion Rate
Most Trades

```

Default:

```
Best Price

```

For Buy:

Best price = lowest seller price.

For Sell:

Best price = highest buyer price.

---

# 21. Advertisement Data Model

Create:

```
lib/p2p/types.ts

```

with a strongly typed model.

Recommended structure:

```
type P2PAdvertisement = {
  id: string
  merchantId: string

  side: "buy" | "sell"

  asset: string
  fiat: string

  price: number
  priceType: "fixed" | "floating"

  availableAmount: number

  minLimit: number
  maxLimit: number

  paymentMethods: string[]

  completionRate: number
  completedOrders: number

  responseTimeMinutes: number

  merchantOnline: boolean
  merchantVerified: boolean

  terms: string

  status: "online" | "offline" | "paused"

  createdAt: string
}

```

---

# 22. Merchant Data Model

```
type P2PMerchant = {
  id: string

  username: string
  displayName: string

  avatar?: string

  verified: boolean
  online: boolean

  completionRate: number
  totalOrders: number

  averageReleaseTime: number

  positiveFeedback: number
  negativeFeedback: number

  joinedAt: string

  supportedPaymentMethods: string[]

  badge?: "verified" | "top_merchant" | "trusted"
}

```

---

# 23. Mock Advertisement Dataset

Create at least:

```
20–30 advertisements

```

across:

```
BTC
ETH
USDT
USDC
SOL

```

and:

```
USD
USD
EUR
GBP
AED

```

Each advertisement should have realistic:

- price
- limits
- available quantity
- payment methods
- completion rate
- order count
- response time

Avoid random unrealistic values.

---

# 24. Provider Architecture

Create:

```
lib/p2p/provider.ts

```

Interface:

```
interface P2PDataProvider {
  getAdvertisements(
    params: P2PAdvertisementQuery
  ): Promise<P2PAdvertisement[]>

  getMerchant(
    merchantId: string
  ): Promise<P2PMerchant | null>

  getAdvertisement(
    advertisementId: string
  ): Promise<P2PAdvertisement | null>
}

```

Implement:

```
MockP2PDataProvider

```

The UI must communicate through the provider.

Do not import mock data directly into page components.

---

# 25. Query Model

```
type P2PAdvertisementQuery = {
  side: "buy" | "sell"
  asset?: string
  fiat?: string
  paymentMethod?: string
  amount?: number

  minPrice?: number
  maxPrice?: number

  minLimit?: number
  maxLimit?: number

  onlineOnly?: boolean
  verifiedOnly?: boolean

  sortBy?: P2PSortOption
}

```

---

# 26. Advertisement Table

Desktop columns:

```
Merchant
Price
Available
Limits
Payment
Completion
Action

```

Example:

```
Merchant

CryptoKing ✓
98.7% completion
1,245 orders

Price

₹8,920,000

Available

0.85 BTC

Limits

₹5,000 – ₹500,000

Payment

UPI
Bank Transfer

[Buy BTC]

```

---

# 27. Merchant Display

Merchant row should contain:

```
Avatar

Username

Verified badge

Online indicator

Completion rate

Order count

```

Example:

```
CryptoKing ✓

98.7% completed
1,245 orders

```

Do not use fake "government verified" or similar claims.

Use:

```
Verified Merchant

```

only as a simulated marketplace badge.

---

# 28. Price Display

Price must show:

```
₹8,920,000 / BTC

```

For other assets:

```
₹xxx / ETH
₹xxx / USDT

```

Use exact formatting based on fiat currency.

Never use JavaScript floating-point arithmetic for financial business logic.

For the current frontend simulation, values should be represented as numbers only where display-only calculations are involved, and production architecture should migrate to exact decimal/integer arithmetic.

---

# 29. Available Amount

Show:

```
Available
0.85 BTC

```

Optionally:

```
≈ ₹7,582,000

```

---

# 30. Limits

Show:

```
₹5,000 – ₹500,000

```

This determines the amount the user can request.

---

# 31. Payment Badges

Use compact badges:

```
UPI
Bank
IMPS

```

Maximum visible on desktop:

```
3

```

If more:

```
+2

```

Hover/click reveals all methods.

---

# 32. Advertisement Action

For Buy:

```
Buy BTC

```

For Sell:

```
Sell BTC

```

Primary action should open the P2P order flow.

---

# 33. Advertisement Details Drawer

Clicking the advertisement itself should open:

```
Advertisement Details

```

Display:

- merchant
- price
- available amount
- order limits
- payment methods
- completion rate
- completed orders
- average release time
- merchant status
- terms
- order form

This avoids navigating away unnecessarily.

---

# 34. P2P Order Form

Order form should support:

```
I want to pay

```

or:

```
I want to receive

```

Depending on mode.

For Buy:

```
Pay
₹25,000 USD

Receive
≈ 0.0028 BTC

```

For Sell:

```
Sell
0.0028 BTC

Receive
≈ ₹25,000 USD

```

---

# 35. Order Calculation

For fixed-price advertisements:

```
cryptoAmount = fiatAmount / price

```

or:

```
fiatAmount = cryptoAmount * price

```

All calculations must respect configured asset precision.

Example:

```
BTC precision: 8
USDT precision: 6

```

---

# 36. Order Limits Validation

The form must reject:

```
amount < minLimit

```

and:

```
amount > maxLimit

```

Error:

```
Minimum order amount is ₹5,000.

```

or:

```
Maximum order amount is ₹500,000.

```

---

# 37. Available Liquidity Validation

If requested crypto exceeds advertisement availability:

```
This advertisement does not have enough available crypto.

```

The order cannot be created.

---

# 38. Payment Method Selection

If an advertisement supports multiple methods:

```
Choose payment method

○ UPI
○ Bank Transfer
○ IMPS

```

One must be selected before order creation.

---

# 39. Order Review

Before creating the order, display:

```
Review P2P Order

You Pay
₹25,000 USD

You Receive
0.0028 BTC

Price
₹8,920,000 / BTC

Payment Method
UPI

Merchant
CryptoKing

Order Limits
₹5,000 – ₹500,000

```

CTA:

```
Create P2P Order

```

Secondary:

```
Back

```

---

# 40. P2P Order Creation

Upon confirmation:

```
P2P Order Created

```

Generate:

```
P2P-XXXXXXXX

```

The order should be stored in the local simulation state.

---

# 41. P2P Order State Machine

Implement explicit state transitions.

```
CREATED
   ↓
ESCROW_LOCKED
   ↓
AWAITING_PAYMENT
   ↓
PAYMENT_MARKED
   ↓
PAYMENT_CONFIRMED
   ↓
RELEASE_PENDING
   ↓
COMPLETED

```

Alternative:

```
CREATED
   ↓
CANCELLED

```

or:

```
AWAITING_PAYMENT
   ↓
EXPIRED

```

or:

```
PAYMENT_MARKED
   ↓
DISPUTED

```

---

# 42. Important State Rule

Do not represent the order as a collection of unrelated boolean values.

Avoid:

```
isPaid
isEscrowed
isCompleted
isDisputed

```

Use one canonical state:

```
status

```

with an event history.

---

# 43. P2P Order Model

Create:

```
type P2POrder = {
  id: string

  advertisementId: string
  merchantId: string

  side: "buy" | "sell"

  asset: string
  fiat: string

  cryptoAmount: number
  fiatAmount: number
  price: number

  paymentMethod: string

  status: P2POrderStatus

  createdAt: string
  expiresAt: string

  paymentMarkedAt?: string
  completedAt?: string
  cancelledAt?: string

  disputeId?: string
}

```

---

# 44. Order Event Model

```
type P2POrderEvent = {
  id: string
  orderId: string

  type:
    | "ORDER_CREATED"
    | "ESCROW_LOCKED"
    | "PAYMENT_PENDING"
    | "PAYMENT_MARKED"
    | "PAYMENT_CONFIRMED"
    | "RELEASE_PENDING"
    | "COMPLETED"
    | "CANCELLED"
    | "EXPIRED"
    | "DISPUTED"

  timestamp: string

  metadata?: Record<string, unknown>
}

```

This prepares the frontend architecture for the eventual backend event model.

---

# 45. Simulated Escrow

The current implementation should simulate escrow.

Example:

```
Seller's simulated balance
        ↓
Simulated escrow
        ↓
Buyer

```

The UI should show:

```
Escrow Protected

```

but clearly remain inside Demo Mode.

Do not claim that real funds are protected.

Preferred wording:

```
Simulated escrow

```

where necessary.

---

# 46. Order Workspace

After order creation, route to:

```
/p2p/order/[id]

```

or use a dedicated full-screen order workspace.

Recommended architecture:

```
/p2p
/p2p/order/[id]

```

---

# 47. P2P Order Workspace Layout

Desktop:

```
┌──────────────────────────────────────────────────────────┐
│ P2P Order #P2P-123456                                    │
├──────────────────────────────┬───────────────────────────┤
│                              │                           │
│ Transaction Status           │ Order Summary             │
│                              │                           │
│ 1 Order Created              │ BTC                       │
│ 2 Escrow Locked              │ 0.0028 BTC                │
│ 3 Make Payment               │                           │
│ 4 Confirm Payment             │ ₹25,000 USD               │
│ 5 Release                     │                           │
│                              │ UPI                       │
│                              │                           │
├──────────────────────────────┴───────────────────────────┤
│ Chat                                                     │
├──────────────────────────────────────────────────────────┤
│ Actions                                                  │
└──────────────────────────────────────────────────────────┘

```

---

# 48. Countdown Timer

For simulated P2P orders:

```
Payment window

14:32

```

The timer must be derived from:

```
expiresAt - currentTime

```

not by decrementing an arbitrary state value.

When it reaches zero:

```
EXPIRED

```

unless payment was already marked.

---

# 49. Payment Instructions

For simulation, show generated instructions such as:

```
Payment Method
UPI

Recipient
Demo Merchant

UPI ID
merchant-demo@ethsltd

Amount
₹25,000

```

Clearly label:

```
SIMULATED PAYMENT DETAILS

```

Do not use real personal payment details.

---

# 50. Mark Payment Action

Buyer CTA:

```
I Have Paid

```

Before allowing the action, display confirmation:

```
Confirm that you have completed the simulated payment.

```

Buttons:

```
Cancel
Confirm Payment

```

---

# 51. Seller Confirmation

Seller-side simulation should expose:

```
Confirm Payment Received

```

Then:

```
Release Crypto

```

For the current single-user frontend, this can be simulated through a controlled "merchant simulation" action.

Do not pretend that an actual second user has confirmed payment.

---

# 52. Completion

On completion:

```
P2P Trade Complete

```

Display:

```
Order ID
Asset
Amount
Price
Fiat
Payment method
Merchant
Completed time

```

CTA:

```
View Order History

```

and:

```
Back to P2P

```

---

# 53. Cancellation

Cancellation should be available only when allowed by the state machine.

Example:

```
AWAITING_PAYMENT

```

allows:

```
Cancel Order

```

After:

```
PAYMENT_MARKED

```

cancellation should be disabled.

---

# 54. Cancellation Confirmation

Dialog:

```
Cancel P2P Order?

This will cancel the simulated transaction.

```

Buttons:

```
Keep Order
Cancel Order

```

---

# 55. Dispute System

The frontend must support a simulated dispute workflow.

CTA:

```
Open Dispute

```

Available when appropriate.

---

# 56. Dispute Form

Fields:

```
Reason

Payment issue
Merchant issue
Incorrect amount
Order issue
Other

Description

```

Optional simulated evidence:

```
Upload Evidence

```

For the current frontend-only implementation, uploaded files should not be treated as real evidence or sent anywhere.

---

# 57. Dispute Statuses

```
OPEN
UNDER_REVIEW
RESOLVED
CANCELLED

```

Resolution:

```
BUYER
SELLER
PARTIAL
CANCELLED

```

Current implementation may simulate:

```
OPEN → UNDER_REVIEW → RESOLVED

```

through controlled UI actions.

---

# 58. P2P Chat

Create a dedicated P2P chat component.

Features:

- message list
- timestamp
- sender indicator
- system messages
- text input
- send button
- unread count
- scroll-to-bottom
- disabled state after completion/cancellation

Example system message:

```
P2P order created.

```

Another:

```
Simulated escrow has been locked.

```

---

# 59. Chat Data Model

```
type P2PMessage = {
  id: string
  orderId: string

  sender:
    | "user"
    | "merchant"
    | "system"

  message: string

  createdAt: string

  read: boolean
}

```

---

# 60. Chat Restrictions

Prevent:

- empty messages
- excessively long messages
- HTML injection
- script content
- unsupported files

Maximum message length:

```
1000 characters

```

---

# 61. Merchant Profile Drawer

Clicking a merchant opens:

```
Merchant Profile

```

Display:

```
Username
Verification badge
Online status
Completion rate
Completed orders
Average response time
Average release time
Joined date
Payment methods

```

Example:

```
CryptoKing ✓

98.7% completion
1,245 orders
Average release: 4 min
Response: < 2 min

```

---

# 62. Merchant Reputation

Use:

```
Completion Rate
Completed Orders
Response Time
Release Time

```

Avoid misleading proprietary scores until a real scoring model exists.

---

# 63. Merchant Badges

Supported:

```
Verified
Top Merchant
Trusted

```

Badges are visual simulation metadata only.

---

# 64. Online Status

Use:

```
Online
Offline
Recently Active

```

Do not claim real presence unless backed by realtime infrastructure.

Mock data can simulate status.

---

# 65. My P2P Orders

Create an order history section accessible from:

```
My Orders

```

Recommended route:

```
/p2p/orders

```

The P2P landing page can expose:

```
My Orders

```

in a secondary navigation/action.

---

# 66. Order History Tabs

```
All

Active

Completed

Cancelled

Disputed

```

---

# 67. Order History Table

Columns:

```
Order
Type
Asset
Amount
Fiat
Price
Merchant
Status
Date
Action

```

Mobile becomes cards.

---

# 68. Active Orders

Display active orders prominently.

Example:

```
BTC / USD

Buy

₹25,000

Awaiting Payment

12:42 remaining

[Continue]

```

---

# 69. Empty States

Marketplace empty state:

```
No P2P offers found.

Try another payment method or adjust your filters.

```

Orders empty state:

```
No P2P orders yet.

Find an offer and start your first simulated P2P trade.

```

---

# 70. P2P Safety Section

Section title:

```
Trade With Confidence

```

Cards:

### Verified Merchants

```
Review merchant reputation before placing an order.

```

### Clear Limits

```
Know the minimum and maximum order amount before trading.

```

### Guided Process

```
Follow each transaction step from order creation to completion.

```

### Dispute Support

```
Simulated dispute workflows are available for supported order states.

```

Avoid claims such as:

```
100% safe
guaranteed protection
bank-grade escrow
zero fraud

```

unless these are genuinely implemented and legally substantiated.

---

# 71. How P2P Works

Three/four steps:

```
01
Choose an Offer

Compare prices, limits and payment methods.

02
Create an Order

Enter the amount and review the merchant.

03
Complete Payment

Follow the simulated payment instructions.

04
Complete the Trade

Confirm the transaction and receive the simulated asset.

```

---

# 72. FAQ

Include:

### What is P2P trading?

Answer:

```
P2P trading allows users to buy or sell digital assets directly through marketplace offers.

```

### Are these real transactions?

```
The current ETHSLTD P2P experience is a simulated environment. No real funds are transferred.

```

### How do I choose an offer?

```
Compare price, limits, payment method, completion rate and merchant history.

```

### What happens if an order expires?

```
The simulated order moves to an expired state and cannot continue.

```

### Can I cancel an order?

```
Cancellation depends on the current order state.

```

---

# 73. P2P Search

Search should support:

```
Merchant name
Asset
Payment method
Fiat

```

Example:

```
Search merchant or payment method

```

Search must be:

- case insensitive
- instant
- debounced if implemented asynchronously

---

# 74. P2P Favorites

Users should be able to favorite merchants or advertisements.

Use:

```
Star

```

Persist in:

```
localStorage

```

as currently done for Markets favorites.

Key:

```
ethsltd:p2p:favorites

```

Do not conflict with:

```
ethsltd:markets:favorites

```

---

# 75. Zustand Store Architecture

Create:

```
lib/p2p/stores/

```

Recommended:

```
p2p-market-store.ts
p2p-order-store.ts
p2p-ui-store.ts

```

---

# 76. P2P Market Store

Responsible for:

- advertisements
- selected asset
- selected fiat
- selected side
- filters
- sorting
- search
- loading state
- error state

---

# 77. P2P Order Store

Responsible for:

- active orders
- order history
- order creation
- order transitions
- order cancellation
- simulated escrow
- payment state
- dispute state
- chat messages

Persist simulation state locally.

Recommended localStorage key:

```
ethsltd:p2p:orders

```

---

# 78. P2P UI Store

Transient state:

```
selected ad
open drawer
open filters
open merchant profile
order modal
chat panel
active tab

```

Do not persist transient UI state unless there is a clear UX reason.

---

# 79. Component Architecture

Recommended:

```
components/p2p/

P2PHero.tsx

P2PDemoBanner.tsx

P2PSideSwitcher.tsx

P2PMarketControls.tsx

P2PAssetSelector.tsx

P2PFiatSelector.tsx

P2PPaymentSelector.tsx

P2PFilterPanel.tsx

P2PSortSelector.tsx

P2PAdvertisementList.tsx

P2PAdvertisementRow.tsx

P2PAdvertisementCard.tsx

P2PMerchantBadge.tsx

P2PMerchantProfile.tsx

P2POrderForm.tsx

P2POrderReview.tsx

P2POrderWorkspace.tsx

P2POrderTimeline.tsx

P2POrderSummary.tsx

P2PPaymentInstructions.tsx

P2PCountdown.tsx

P2PChat.tsx

P2PDisputeDialog.tsx

P2POrderHistory.tsx

P2PSafetySection.tsx

P2PHowItWorks.tsx

P2PFAQ.tsx

```

---

# 80. Route Structure

Recommended:

```
app/
├── p2p/
│   ├── page.tsx
│   ├── orders/
│   │   └── page.tsx
│   └── order/
│       └── [id]/
│           └── page.tsx

```

This keeps P2P logically isolated.

---

# 81. Existing Architecture Consistency

Use the same conventions already established in:

```
/markets
/trade

```

Do not create a separate styling system.

Reuse:

- existing buttons
- cards
- typography
- spacing
- colors
- borders
- shadows
- dialogs
- dropdowns
- responsive breakpoints
- theme tokens
- Header
- Footer

---

# 82. Theme Requirements

Everything must work in:

```
Dark Mode
Light Mode

```

Do not introduce hardcoded:

```
bg-black
text-white

```

where semantic tokens already exist.

Use the project's existing semantic system.

Important states:

```
background
foreground
muted
muted-foreground
border
card
primary
primary-foreground
destructive

```

---

# 83. Color Semantics

Positive:

```
green

```

Negative/destructive:

```
red

```

Informational:

```
blue

```

Warning:

```
amber

```

Primary ETHSLTD brand color should remain consistent with existing pages.

Do not invent another primary accent.

---

# 84. Responsive Requirements

Desktop:

```
≥ 1280px

```

Tablet:

```
768px – 1279px

```

Mobile:

```
< 768px

```

---

# 85. Mobile Marketplace

Mobile advertisement should become a card:

```
┌───────────────────────────┐
│ CryptoKing ✓       Online │
│ 98.7% · 1,245 orders      │
│                           │
│ ₹8,920,000 / BTC          │
│                           │
│ Available: 0.85 BTC       │
│ Limits: ₹5K–₹500K         │
│                           │
│ UPI · Bank Transfer       │
│                           │
│ [ Buy BTC ]               │
└───────────────────────────┘

```

Avoid horizontal scrolling wherever possible.

---

# 86. Mobile Filters

Use bottom sheet:

```
Filters

Asset
Fiat
Payment
Price
Limits
Merchant
Online Only

[Reset] [Apply]

```

---

# 87. Mobile Order Workspace

Stack:

```
Order Status

Order Summary

Payment Instructions

Action Buttons

Chat

```

The primary action should remain accessible.

---

# 88. Accessibility

Required:

- semantic HTML
- keyboard navigation
- visible focus states
- accessible buttons
- accessible dialogs
- aria labels for icon buttons
- screen-reader-friendly status messages
- sufficient contrast
- no color-only status indicators

For example:

```
Online

```

must have both:

- status dot
- text label

---

# 89. Loading States

Use skeletons.

Marketplace:

```
Merchant skeleton
Price skeleton
Limits skeleton
Payment skeleton
Button skeleton

```

Do not show a blank page.

---

# 90. Error States

Provider failure:

```
Unable to load P2P offers.

Please try again.

```

Button:

```
Retry

```

Order creation failure:

```
We couldn't create the simulated P2P order.
Please try again.

```

---

# 91. Toast Notifications

Use existing toast infrastructure if present.

Examples:

```
Advertisement added to favorites.

P2P order created.

Order cancelled.

Payment marked successfully.

Message sent.

Dispute opened.

```

Avoid excessive notifications.

---

# 92. Form Validation

Use:

```
React Hook Form
+
Zod

```

Validation:

- amount required
- amount > 0
- amount within limits
- valid crypto quantity
- valid payment method
- message length
- dispute description
- required confirmation

---

# 93. Security Requirements

Even though this is frontend simulation:

Do not trust client-side values conceptually.

Never assume:

```
price
available amount
merchant status
order state
balance

```

would be trustworthy in production.

Structure code so these will eventually be server-authoritative.

---

# 94. No Client-Side Financial Authority

The current simulation can calculate and persist state locally.

However, code should clearly separate:

```
UI calculation

```

from:

```
business state transition

```

This will make backend replacement easier.

---

# 95. Future Backend Compatibility

The provider interface must allow:

```
MockP2PDataProvider

```

to eventually become:

```
ApiP2PDataProvider

```

without rewriting:

- marketplace components
- order form
- merchant UI
- order workspace
- chat UI

---

# 96. Future API Mapping

The frontend provider should eventually map to:

```
GET /p2p/ads
GET /p2p/ads/:id
GET /p2p/merchants/:id

POST /p2p/orders
GET /p2p/orders
GET /p2p/orders/:id

POST /p2p/orders/:id/payment
POST /p2p/orders/:id/cancel
POST /p2p/orders/:id/dispute

GET /p2p/orders/:id/messages
POST /p2p/orders/:id/messages

```

Do not implement these real endpoints now.

---

# 97. Future WebSocket Compatibility

The P2P architecture should eventually support:

```
/ws/p2p/:orderId

```

for:

- order state
- merchant status
- chat
- countdown synchronization
- system events

Current implementation can use local state.

---

# 98. Mock Realtime Simulation

Optional frontend simulation:

When an order is created:

```
ORDER_CREATED

```

then after controlled user action:

```
ESCROW_LOCKED

```

then:

```
AWAITING_PAYMENT

```

Do not automatically complete the whole order.

The user should experience the workflow interactively.

---

# 99. Demo Merchant Simulation

Because only one browser user exists in the current application, the system should provide simulation controls where necessary.

Example:

```
Demo Merchant Actions

```

Only in development/demo context.

Actions:

```
Simulate Payment Confirmation
Simulate Merchant Confirmation
Simulate Crypto Release

```

These controls should not appear as normal user functionality in production UI.

Prefer a development-only flag:

```
NEXT_PUBLIC_P2P_DEMO_CONTROLS=true

```

---

# 100. Demo Data Labeling

Mock merchant data must never accidentally appear as a real business/person.

Use clearly fictional identities.

Examples:

```
CryptoKing
DemoTrader
ETHSLTD_Merchant
PrimeCrypto
MarketDesk

```

Do not use actual people's names.

---

# 101. P2P Analytics Cards

Optional top marketplace metrics:

```
Active Offers
Supported Assets
Payment Methods

```

Example:

```
124 Active Offers
5 Assets
8 Payment Methods

```

These numbers must come from mock provider data, not hardcoded UI strings.

---

# 102. Avoid Fake Platform Claims

Do not show:

```
$1B volume
10M users
99.99% uptime
500K merchants

```

unless the numbers are genuinely backed by the platform.

The current implementation should use data-derived demo values.

---

# 103. P2P SEO

Metadata:

Title:

```
P2P Crypto Trading | ETHSLTD

```

Description:

```
Explore ETHSLTD's P2P marketplace, compare crypto offers,
payment methods and merchant terms in a guided trading experience.

```

Do not make claims about real-money trading if the current page is simulated.

---

# 104. OpenGraph

Use:

```
ETHSLTD P2P Marketplace

```

with the existing ETHSLTD brand styling.

Do not introduce a separate visual identity.

---

# 105. URL State

Important filters should optionally synchronize to URL query parameters.

Example:

```
/p2p?side=buy&asset=BTC&fiat=USD

```

This allows:

- sharing
- browser refresh
- back/forward navigation
- predictable state

Use only meaningful marketplace state.

Do not place every transient UI state in the URL.

---

# 106. Browser Persistence

Persist:

```
favorite advertisements
favorite merchants
P2P orders
P2P messages
selected preferences

```

Do not persist:

```
open dialogs
temporary hover state
passwords
sensitive credentials

```

---

# 107. LocalStorage Keys

Use a namespace:

```
ethsltd:p2p:favorites
ethsltd:p2p:merchant-favorites
ethsltd:p2p:orders
ethsltd:p2p:messages
ethsltd:p2p:preferences

```

Avoid generic keys.

---

# 108. Data Reset

Because this is simulation, provide a development-friendly reset mechanism.

Example:

```
Reset Demo P2P Data

```

This should:

- remove simulated orders
- clear messages
- clear simulated disputes
- reset preferences
- restore initial demo state

Development-only.

---

# 109. Component Performance

Avoid unnecessary re-renders.

Marketplace:

- memoize advertisement rows where useful
- avoid recalculating all offers on every keystroke
- use derived selectors for Zustand
- paginate/limit mock data
- virtualize only if dataset becomes large

For the initial 20–30 ads, normal rendering is sufficient.

---

# 110. Performance Target

Target:

```
Fast first render
Minimal JavaScript
No blocking marketplace interaction
Smooth filtering
Smooth drawers/dialogs

```

P2P filtering should feel instantaneous.

---

# 111. Testing Strategy

Use existing:

```
Vitest
Playwright
React Testing Library

```

---

# 112. Unit Tests

Test:

```
price calculation

crypto/fiat conversion

order-limit validation

available-liquidity validation

filtering

sorting

favorite handling

order state transitions

order expiry

cancellation rules

dispute transitions

```

---

# 113. P2P State Machine Tests

Required scenarios:

```
CREATED → ESCROW_LOCKED

ESCROW_LOCKED → AWAITING_PAYMENT

AWAITING_PAYMENT → PAYMENT_MARKED

PAYMENT_MARKED → PAYMENT_CONFIRMED

PAYMENT_CONFIRMED → RELEASE_PENDING

RELEASE_PENDING → COMPLETED

```

Invalid transitions must fail.

Example:

```
COMPLETED → CANCELLED

```

must be rejected.

---

# 114. Order Calculation Tests

Example:

```
Price = ₹10,000,000/BTC

Fiat = ₹25,000

BTC = 0.0025

```

Test:

- rounding
- minimum order
- maximum order
- available balance
- available liquidity

---

# 115. E2E Test — Buyer

Playwright:

```
Open /p2p

Select Buy

Select BTC

Select USD

Select UPI

Enter ₹25,000

Select advertisement

Review order

Create order

Verify order workspace

Verify countdown

Mark simulated payment

Verify state change

Complete simulated transaction

Verify completed state

```

---

# 116. E2E Test — Filtering

```
Open /p2p

Select BTC

Select USD

Select UPI

Apply amount

Verify matching advertisements

Change sorting

Verify order changes

Reset filters

Verify full list

```

---

# 117. E2E Test — Cancellation

```
Create P2P order

Open active order

Cancel

Confirm

Verify CANCELLED

```

---

# 118. E2E Test — Dispute

```
Create order

Move to supported dispute state

Open dispute

Select reason

Enter description

Submit

Verify DISPUTED

```

---

# 119. E2E Test — Mobile

Verify:

```
mobile header

buy/sell switcher

filters

advertisement cards

order form

order workspace

chat

dialogs

footer

```

No horizontal overflow.

---

# 120. Visual Consistency

The following must remain identical to existing pages:

```
Header height
Navigation spacing
Logo treatment
Button radius
Card radius
Typography hierarchy
Page max-width
Section spacing
Border opacity
Theme behavior
Footer

```

Do not introduce new global styles.

---

# 121. Header Active State

Header must show:

```
P2P

```

as active when:

```
pathname === "/p2p"

```

and:

```
pathname.startsWith("/p2p/")

```

for P2P subroutes.

Use the same active-state implementation already used by Markets.

---

# 122. Footer

Use the existing Footer unchanged wherever possible.

P2P-specific links may include:

```
P2P Trading
P2P Orders
P2P Safety

```

Only add links if the existing footer architecture supports them.

Do not duplicate the footer implementation.

---

# 123. Global Search

Existing header search must remain functional.

P2P should be compatible with global search but does not need a separate search system unless the existing global search architecture requires it.

---

# 124. Tawk.to

The existing Tawk.to integration remains global.

Do not add another chat provider.

Important distinction:

```
Tawk.to
=
Platform support

P2P Chat
=
Buyer/merchant transaction chat simulation

```

They must remain separate.

---

# 125. Back-to-Top

Reuse the existing global Back-to-Top implementation.

Do not build another P2P-specific button.

---

# 126. Theme Toggle

Reuse the existing theme toggle.

Do not create another P2P theme setting.

---

# 127. Navigation Flow

Recommended user journey:

```
Homepage
   ↓
P2P
   ↓
Buy/Sell
   ↓
Select Asset
   ↓
Select Fiat
   ↓
Filter Offers
   ↓
Choose Merchant
   ↓
Enter Amount
   ↓
Review
   ↓
Create Order
   ↓
P2P Order Workspace
   ↓
Payment Simulation
   ↓
Confirmation
   ↓
Completed

```

---

# 128. Cross-Page Integration

From `/markets`:

Market row:

```
Trade

```

can continue to:

```
/trade?symbol=BTCUSDT

```

P2P should not hijack normal trading.

From `/trade`:

Potential link:

```
Buy via P2P

```

can navigate to:

```
/p2p?side=buy&asset=BTC

```

This should be implemented only where it fits naturally.

---

# 129. P2P → Trade Integration

After simulated P2P completion:

```
Trade BTC

```

may navigate to:

```
/trade?symbol=BTCUSDT

```

This creates a coherent ecosystem:

```
Markets
 ↓
Trade

P2P
 ↓
Acquire asset
 ↓
Trade

```

---

# 130. Assets Integration Preparation

Future Assets page should eventually read the same account/ledger model.

For now:

P2P simulation must not silently alter the real trading account.

If integration is desired in the current demo:

```
P2P simulated balance

```

must remain logically separated from:

```
Demo trading account

```

Do not mix the two stores.

---

# 131. Critical Account Separation

Current platform has a Demo Trading account.

Do not modify:

```
demo-account-store.ts

```

from P2P components.

P2P must have its own simulation state.

This prevents:

```
P2P order

```

from accidentally changing:

```
Trade balance

```

---

# 132. Error Prevention

Never allow:

```
negative amount

negative price

negative available amount

zero-price advertisement

order above max limit

order below min limit

order above available liquidity

completed order cancellation

expired order payment

duplicate order submission

```

---

# 133. Idempotency Preparation

Even in the frontend simulation, disable the submit action while an order is being created.

State:

```
creatingOrder

```

Button:

```
Creating Order...

```

This prevents accidental duplicate simulated orders.

---

# 134. Double Submission Protection

The order creation flow must:

```
validate
→ disable submit
→ create order
→ persist order
→ navigate
→ re-enable if failed

```

Never create two orders from one click.

---

# 135. Confirmation Dialogs

Use confirmation dialogs for:

```
Cancel order
Open dispute
Mark payment
Release simulated crypto
Reset demo data

```

Do not require confirmation for:

```
Filter
Sort
Favorite
Open merchant
Open advertisement

```

---

# 136. Notifications

Examples:

```
P2P order created
Payment marked
Order cancelled
Order expired
Trade completed
Dispute opened
Message received

```

Notifications should be concise.

---

# 137. P2P Status Badge System

Statuses should have consistent visual treatment.

```
Created
Escrow Locked
Awaiting Payment
Payment Marked
Payment Confirmed
Release Pending
Completed
Cancelled
Expired
Disputed

```

Use semantic colors but also display text.

---

# 138. Order Timeline

Timeline:

```
✓ Order Created
✓ Simulated Escrow Locked
● Awaiting Payment
○ Payment Confirmed
○ Crypto Released

```

The active step should be visually obvious.

---

# 139. Order Summary

Always display:

```
Order ID
Side
Asset
Crypto amount
Fiat amount
Price
Payment method
Merchant
Created time
Expiry
Status

```

---

# 140. Merchant Terms

Each advertisement may contain:

```
Terms of Trade

```

Example:

```
Please complete the simulated payment within the order window.

```

Limit length to avoid massive cards.

---

# 141. Terms Display

Collapsed:

```
View merchant terms

```

Expanded:

```
Merchant terms...

```

---

# 142. Trust Indicators

Allowed:

```
Verified merchant
High completion rate
Fast response
Fast release

```

Avoid:

```
Guaranteed
Risk-free
Fraud-proof
100% protected

```

---

# 143. Empty Marketplace

When no offers exist:

```
No offers available

Try:
• another asset
• another payment method
• a different amount
• removing filters

```

CTA:

```
Reset Filters

```

---

# 144. Initial Default State

When visiting:

```
/p2p

```

default:

```
Side = Buy
Asset = USDT
Fiat = USD
Payment = All
Amount = empty
Sort = Best Price

```

USDT is recommended as the initial default because it is a common P2P asset.

---

# 145. Default Advertisement Ordering

For Buy:

```
lowest price

```

For Sell:

```
highest price

```

Tie-breakers:

```
higher completion rate
then
higher completed orders
then
faster response time

```

---

# 146. Data Pagination

Initial mock provider should support pagination even if only 20–30 records exist.

Interface:

```
{
  items,
  page,
  pageSize,
  total
}

```

Recommended default:

```
10 advertisements per page

```

---

# 147. Pagination UI

Desktop:

```
Previous
1
2
3
Next

```

Mobile:

```
Previous
1 / 3
Next

```

If fewer than one page of results exists, pagination is hidden.

---

# 148. URL Pagination

Optional:

```
/p2p?page=2

```

Must preserve filters.

---

# 149. P2P Architecture Directory

Recommended final structure:

```
lib/
├── p2p/
│   ├── types.ts
│   ├── constants.ts
│   ├── calculations.ts
│   ├── validation.ts
│   ├── provider.ts
│   ├── mock-provider.ts
│   ├── state-machine.ts
│   ├── mock-data.ts
│   └── stores/
│       ├── p2p-market-store.ts
│       ├── p2p-order-store.ts
│       └── p2p-ui-store.ts

```

Components:

```
components/
└── p2p/
    ├── P2PHero.tsx
    ├── P2PDemoBanner.tsx
    ├── P2PSideSwitcher.tsx
    ├── P2PMarketControls.tsx
    ├── P2PFilterPanel.tsx
    ├── P2PAdvertisementList.tsx
    ├── P2PAdvertisementRow.tsx
    ├── P2PAdvertisementCard.tsx
    ├── P2PMerchantProfile.tsx
    ├── P2POrderForm.tsx
    ├── P2POrderReview.tsx
    ├── P2POrderWorkspace.tsx
    ├── P2POrderTimeline.tsx
    ├── P2PPaymentInstructions.tsx
    ├── P2PChat.tsx
    ├── P2PDisputeDialog.tsx
    ├── P2POrderHistory.tsx
    ├── P2PSafetySection.tsx
    ├── P2PHowItWorks.tsx
    └── P2PFAQ.tsx

```

Routes:

```
app/
└── p2p/
    ├── page.tsx
    ├── orders/
    │   └── page.tsx
    └── order/
        └── [id]/
            └── page.tsx

```

---

# 150. TypeScript Requirements

Strict typing must be maintained.

Avoid:

```
any

```

for P2P domain objects.

Use discriminated unions for:

```
order status
side
payment method
dispute status
merchant status

```

---

# 151. Business Logic Separation

Do not put calculations inside JSX.

Bad:

```
{amount / ad.price}

```

Preferred:

```
calculateCryptoAmount(amount, ad.price)

```

This improves:

- testing
- correctness
- readability
- backend migration

---

# 152. Calculation Utilities

Create:

```
calculateCryptoAmount()
calculateFiatAmount()
calculateAvailableFiat()
isWithinOrderLimits()
isWithinAvailableLiquidity()
formatP2PPrice()

```

---

# 153. Validation Utilities

Create:

```
validateP2PAmount()
validateCryptoAmount()
validateAdvertisement()
validateOrderTransition()
validatePaymentMethod()

```

---

# 154. State Machine

Create:

```
p2p/state-machine.ts

```

Expose:

```
canTransition(
  from,
  to
): boolean

```

and:

```
transitionOrder(
  order,
  event
)

```

No component should manually mutate:

```
order.status

```

without going through the state logic.

---

# 155. Audit-Like Simulation

Each order event must be retained locally.

Example:

```
Order Created
13:21:03

Escrow Locked
13:21:05

Payment Marked
13:22:17

```

This makes the frontend architecture compatible with the eventual backend ledger/audit model.

---

# 156. Logging

Development logs should use:

```
P2P_ORDER_CREATED
P2P_ORDER_CANCELLED
P2P_PAYMENT_MARKED
P2P_DISPUTE_OPENED

```

Do not log sensitive information.

---

# 157. No Sensitive Data

Never store:

- real bank credentials
- real payment passwords
- real API keys
- private keys
- seed phrases
- real identity documents

The P2P demo must never ask for them.

---

# 158. File Upload

If evidence upload is visually required:

```
Upload Evidence

```

accept:

```
PNG
JPG
PDF

```

For current frontend implementation:

```
local preview only

```

or a simulated upload state.

No real KYC/payment document storage should be implemented here.

---

# 159. Drag and Drop

Optional evidence UX:

```
Drag file here
or
Browse files

```

Keep it lightweight.

---

# 160. File Constraints

Maximum:

```
10 MB

```

Maximum:

```
5 files

```

Validate extension and MIME type.

---

# 161. P2P Order Notifications

The order workspace should show contextual notification banners:

```
Payment window is running out.

```

when under a configured threshold.

For example:

```
< 5 minutes

```

Use the existing design system.

---

# 162. Countdown Warning

States:

```
Normal
Warning
Expired

```

Warning should appear without relying only on color.

Example:

```
Payment window: 04:21 remaining

```

---

# 163. Completed State

Once completed:

Disable:

```
Payment
Cancel
Dispute

```

Enable:

```
View Receipt
Trade Asset
Back to P2P

```

---

# 164. Simulated Receipt

Provide:

```
P2P Trade Receipt

```

Display:

```
ETHSLTD
P2P Transaction

Order ID
P2P-123456

Asset
BTC

Amount
0.0028 BTC

Fiat
₹25,000 USD

Price
₹8,920,000

Payment
UPI

Status
Completed

Date
13 Aug 2026

```

Date should be dynamically generated, not hardcoded.

---

# 165. Receipt Actions

```
Close
Print

```

Optional:

```
Download

```

If implemented, generate client-side output only.

---

# 166. P2P Orders Navigation

The P2P section should expose:

```
P2P
My Orders

```

Potential secondary navigation:

```
Buy Crypto
Sell Crypto
My Orders

```

---

# 167. User Flow — Buy

Complete flow:

```
User enters /p2p

Buy selected

USDT selected

USD selected

Payment method selected

Amount entered

Ads filtered

User selects merchant

Order form opens

User enters amount

Validation executes

Review opens

User confirms

P2P order created

Simulated escrow locked

Payment instructions shown

Countdown begins

User marks payment

State becomes PAYMENT_MARKED

Merchant simulation confirms

Release occurs

Order becomes COMPLETED

Receipt shown

```

---

# 168. User Flow — Sell

```
User selects Sell

Select asset

Select fiat

Filter advertisements

Select buyer

Enter crypto amount

Review fiat amount

Create order

Simulated escrow

Payment pending

Simulated buyer payment

Confirm payment

Release simulated crypto

Completed

```

---

# 169. User Flow — Cancel

```
Open active order

Cancel

Confirmation dialog

Confirm

State transition validated

Order becomes CANCELLED

Simulation state persisted

User returns to order history

```

---

# 170. User Flow — Dispute

```
Open active eligible order

Open Dispute

Select reason

Enter description

Optional evidence

Submit

Order → DISPUTED

Dispute record created

Timeline updated

```

---

# 171. User Flow — Chat

```
Open active order

Chat visible

Enter message

Validate

Send

Persist locally

Render message

Scroll to latest

```

---

# 172. User Experience Principles

P2P should feel:

```
Simple
Transparent
Fast
Professional
Controlled
Trustworthy

```

The interface should not feel overloaded even though it contains significant data.

---

# 173. Visual Hierarchy

Highest priority:

```
Price
Merchant
Limits
Payment method
Primary action

```

Secondary:

```
Completion
Orders
Response time

```

Tertiary:

```
Joined date
Additional metadata

```

---

# 174. Typography

Continue existing ETHSLTD typography.

Do not introduce another font.

Use established hierarchy:

```
Hero
h1
h2
h3
body
caption
metadata

```

---

# 175. Cards

P2P cards should use the existing card system.

Avoid excessive:

```
gradients
glows
animations

```

The P2P marketplace is data-oriented.

---

# 176. Animation

Allowed:

- fade
- slide
- dropdown
- drawer
- subtle hover
- progress transition
- skeleton shimmer

Avoid:

- excessive bouncing
- large continuous animations
- distracting backgrounds

---

# 177. Reduced Motion

Respect:

```
prefers-reduced-motion

```

Disable nonessential animations.

---

# 178. Performance Budget

Avoid importing heavy libraries solely for:

- dropdowns
- tabs
- filters
- cards
- simple icons

Reuse existing libraries already installed.

---

# 179. Iconography

Reuse existing icon library.

Likely:

```
Lucide

```

if already present.

Do not introduce another icon library.

---

# 180. No Duplicate Components

Before creating:

```
Button
Card
Dialog
Badge
Dropdown
Tabs

```

check existing project components.

P2P must reuse shared UI.

---

# 181. Documentation

Create:

```
docs/p2p-architecture.md

```

Document:

- data models
- provider
- state machine
- localStorage
- routes
- mock limitations
- backend migration strategy

---

# 182. Environment Variables

No secrets are required for P2P simulation.

Do not add unnecessary environment variables.

Development-only optional:

```
NEXT_PUBLIC_P2P_DEMO_CONTROLS

```

---

# 183. Cloudflare Compatibility

The P2P page must remain compatible with the existing Next.js/Cloudflare deployment architecture.

Avoid Node-only APIs inside client components.

Avoid filesystem access.

Avoid server-only modules inside browser code.

Use browser-safe APIs only where necessary.

---

# 184. Client/Server Boundaries

Prefer:

```
page.tsx

```

as server-compatible where possible.

Interactive components:

```
"use client"

```

only when needed.

Examples:

```
filters
forms
Zustand
countdown
chat
dialogs
favorites

```

must be client components.

---

# 185. Hydration Safety

Because localStorage is used:

Do not access:

```
window.localStorage

```

during server rendering.

Use client-side hydration safely.

Prevent:

```
hydration mismatch

```

for favorites/order state.

---

# 186. Loading/Hydration State

If local data is not yet hydrated:

```
Loading P2P data...

```

or skeleton.

Avoid flashing incorrect values.

---

# 187. SEO vs Interactive Application

The marketplace shell and informational sections can remain server-renderable.

Interactive market controls can hydrate client-side.

This maintains performance.

---

# 188. Acceptance Criteria — Marketplace

The P2P page is complete only when:

- `/p2p` loads correctly
- Header and Footer are present
- P2P is active in navigation
- Buy/Sell works
- Asset selection works
- Fiat selection works
- Payment filtering works
- Amount filtering works
- Search works
- Sorting works
- Advertisement list works
- Merchant details work
- Favorites persist
- Order form works
- Validation works
- Order review works
- Order creation works
- Order state persists
- Order workspace works
- Countdown works
- Cancellation works
- Chat works
- Dispute flow works
- Completion works
- Order history works
- Light mode works
- Dark mode works
- Mobile works
- Desktop works
- No console errors
- No TypeScript errors

---

# 189. Acceptance Criteria — State

The system must prevent:

```
invalid transitions

duplicate orders

expired payment

cancelled order payment

completed order cancellation

invalid amount

invalid liquidity

unsupported payment method

```

---

# 190. Acceptance Criteria — Responsive

At:

```
375px
768px
1024px
1280px
1440px

```

verify:

- no horizontal overflow
- no clipped dialogs
- no broken tables
- controls remain usable
- buttons remain accessible
- order workspace remains readable

---

# 191. Acceptance Criteria — Theme

Both:

```
Light
Dark

```

must have:

- readable text
- readable borders
- readable badges
- readable table rows
- accessible buttons
- accessible dialogs
- correct chart-independent styling

---

# 192. Acceptance Criteria — Existing Platform

After implementation:

```
/

```

must still work.

```
/markets

```

must still work.

```
/trade

```

must still work.

Existing:

```
theme toggle
Tawk.to
Back-to-top
Header
Footer

```

must not regress.

---

# 193. Regression Testing

Before considering P2P complete:

### Homepage

- Header
- Hero
- Markets
- CTA
- Footer

### Markets

- Search
- Filters
- Sorting
- Favorites
- Market cards

### Trade

- Market selector
- Chart
- Order form
- Order book
- Demo balance
- Cancel order

All must continue functioning.

---

# 194. Definition of Done

P2P is considered complete when:

```
UI complete
+
Responsive
+
Theme compatible
+
Mock provider complete
+
Zustand stores complete
+
State machine complete
+
Validation complete
+
Order flow complete
+
Chat complete
+
Dispute simulation complete
+
Order history complete
+
Tests complete
+
No regression
+
Cloudflare-compatible
+
Backend migration-ready

```

---

# 195. Final Expected Product

When a user opens:

```
/p2p

```

they should immediately understand:

```
ETHSLTD P2P Marketplace

```

and be able to:

```
BUY
or
SELL

```

Then:

```
choose asset
choose fiat
choose payment method
enter amount
compare offers
select merchant
review order
create simulated order
follow transaction timeline
chat
mark payment
complete/cancel/dispute
view history

```

without leaving the ETHSLTD ecosystem.

---

# 196. Final Technical Contract

The implementation must follow this architecture:

```
Next.js
   │
   ├── /p2p
   │
   ├── /p2p/orders
   │
   └── /p2p/order/[id]
   │
   ▼
P2P Components
   │
   ▼
Zustand Stores
   │
   ▼
Domain Logic
   │
   ├── calculations
   ├── validation
   └── state machine
   │
   ▼
P2P Provider Interface
   │
   ▼
Mock P2P Provider
   │
   ▼
Mock Data

```

The eventual production architecture can replace:

```
Mock P2P Provider

```

with:

```
Live API Provider
        +
WebSocket Provider
        +
Backend P2P Engine
        +
Real Escrow/Ledger

```

without redesigning the frontend.

---

# 197. Non-Goals for This Implementation

Do NOT implement:

- real payment processing
- real bank integration
- real UPI integration
- real crypto transfers
- real custody
- real escrow
- real KYC
- real AML
- real dispute arbitration
- real merchant verification
- real fiat settlement
- real blockchain settlement

Those require backend, security, compliance, legal and financial infrastructure.

The current P2P implementation must remain a sophisticated, realistic **simulation**.

---

# 198. Final Consistency Rule

The most important architectural rule for this step:

> **Do not build P2P as an isolated demo page. Build it as the frontend contract for the future ETHSLTD P2P engine.**

The existing platform already follows:

```
Markets
→ Provider abstraction

Trade
→ Mock provider
→ Zustand
→ Domain state

P2P
→ Mock provider
→ Zustand
→ Domain state machine
→ Future API/WebSocket replacement

```

This keeps ETHSLTD consistent across all three completed product surfaces.

---

# 199. Expected Files After Implementation

At minimum, the implementation should result in:

```
app/
├── p2p/
│   ├── page.tsx
│   ├── orders/
│   │   └── page.tsx
│   └── order/
│       └── [id]/
│           └── page.tsx

components/
└── p2p/
    ├── P2PHero.tsx
    ├── P2PDemoBanner.tsx
    ├── P2PSideSwitcher.tsx
    ├── P2PMarketControls.tsx
    ├── P2PFilterPanel.tsx
    ├── P2PAdvertisementList.tsx
    ├── P2PAdvertisementRow.tsx
    ├── P2PAdvertisementCard.tsx
    ├── P2PMerchantProfile.tsx
    ├── P2POrderForm.tsx
    ├── P2POrderReview.tsx
    ├── P2POrderWorkspace.tsx
    ├── P2POrderTimeline.tsx
    ├── P2PPaymentInstructions.tsx
    ├── P2PCountdown.tsx
    ├── P2PChat.tsx
    ├── P2PDisputeDialog.tsx
    ├── P2POrderHistory.tsx
    ├── P2PSafetySection.tsx
    ├── P2PHowItWorks.tsx
    └── P2PFAQ.tsx

lib/
└── p2p/
    ├── types.ts
    ├── constants.ts
    ├── calculations.ts
    ├── validation.ts
    ├── provider.ts
    ├── mock-provider.ts
    ├── mock-data.ts
    ├── state-machine.ts
    └── stores/
        ├── p2p-market-store.ts
        ├── p2p-order-store.ts
        └── p2p-ui-store.ts

docs/
└── p2p-architecture.md

```

---

# 200. Final Implementation Principle

ETHSLTD currently has:

```
Homepage
      ↓
Market Discovery
      ↓
Trading Terminal
      ↓
P2P Marketplace

```

The P2P page should therefore be the next natural product surface—not a separate visual experiment.

It must reuse the existing ETHSLTD:

```
Brand
Design system
Header
Footer
Theme
Typography
Buttons
Cards
Dialogs
State patterns
Provider abstraction
TypeScript conventions
Testing strategy
Cloudflare compatibility

```

The finished result should look and behave as though `/`, `/markets`, `/trade`, and `/p2p` were designed as one unified professional crypto platform from the beginning.

**Primary implementation target:** `/p2p`

**Primary mode:** Simulated P2P

**Primary architecture:** Mock Provider → Domain Logic → Zustand → React UI

**Primary future migration path:** Mock Provider → Live REST/WebSocket P2P Backend