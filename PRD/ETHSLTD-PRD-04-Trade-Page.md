Yes. I’ve treated the **Homepage + `/markets` as completed and frozen as the current baseline**. The next logical product step is the **Trading Terminal** because the Markets page already provides the entry point into a specific market.

# Next Step PRD

**Recommended file name:**

`ETHSLTD_TRADE_PAGE_PRD.md`

**Route covered by this PRD:**

* `/trade`
* `/trade/[symbol]`
* Example: `/trade/BTC-USDT`

This PRD covers the **complete web trading terminal only**—UI, paper trading behavior, mock data architecture, order entry, order book, charts, trades, orders, balances, responsive/mobile behavior, validation, accessibility, performance, testing, and future live-trading compatibility.

> **Important:** This implementation must initially operate in **Paper Trading mode**. It must not imply that real-money trading, deposits, withdrawals, custody, or real execution are available until the backend/compliance infrastructure actually exists.

---

# ETHSLTD — TRADE PAGE PRODUCT REQUIREMENTS DOCUMENT

**Document:** `ETHSLTD_TRADE_PAGE_PRD.md`
**Product:** ETHSLTD Crypto Trading Platform
**Next Product Surface:** Trading Terminal
**Routes:** `/trade`, `/trade/[symbol]`
**Status:** Implementation-ready
**Previous completed surfaces:** Homepage, Markets
**Primary mode:** Paper Trading
**Secondary future mode:** Live Trading
**Frontend:** Next.js + React + TypeScript
**Styling:** Tailwind CSS
**Components:** shadcn/ui-compatible architecture
**State:** Zustand + TanStack Query
**Validation:** Zod
**Charts:** Lightweight Charts or existing lightweight chart implementation
**Current data:** Mock provider
**Deployment target:** Cloudflare-compatible Next.js architecture

---

# 1. Product Objective

Build ETHSLTD's primary **professional crypto trading terminal**.

The Trade page should allow a user to:

* Select a market.
* View current market information.
* View candlestick charts.
* View order book depth.
* View recent trades.
* Switch between Buy and Sell.
* Select an order type.
* Enter price and quantity.
* See estimated total.
* See estimated fees.
* Submit paper orders.
* Receive simulated fills.
* Cancel open paper orders.
* View open orders.
* View order history.
* View trade history.
* View simulated balances.
* Switch between markets.
* Add/remove markets from favorites.
* Understand clearly whether they are in Paper Trading or Live Trading.

The architecture must be designed so the mock trading engine can later be replaced by a real trading backend without redesigning the UI.

---

# 2. Product Principle

The Trade page must feel like a serious exchange terminal rather than a marketing page.

Primary principles:

1. **Clarity**
2. **Speed**
3. **Low visual noise**
4. **Financial precision**
5. **Responsive behavior**
6. **Strong state handling**
7. **Paper/live separation**
8. **No misleading financial claims**
9. **Backend-ready architecture**
10. **Consistent ETHSLTD design language**

---

# 3. Relationship With Existing ETHSLTD Pages

Current structure:

```text
/
└── Homepage

/markets
└── Market Explorer

/trade
└── Trading Terminal

/trade/BTC-USDT
└── BTC/USDT Trading Terminal
```

The existing Markets page should navigate into the Trade page.

Example:

```text
Markets
   ↓
BTC/USDT
   ↓
Trade BTC/USDT
   ↓
/trade/BTC-USDT
```

Do not duplicate the market discovery experience inside the Trade page unnecessarily.

---

# 4. Existing Architecture Must Remain Consistent

Do not replace the current architecture.

Continue using:

```text
Next.js
React
TypeScript
Tailwind CSS
shadcn/ui
Zustand
TanStack Query
Zod
Lightweight chart technology
pnpm
Cloudflare-compatible deployment
```

Existing global components must remain:

```text
Header
Footer
Theme Provider
Tawk.to Chat
Back to Top
```

However, the Trade terminal should use a **specialized trading layout** rather than forcing the normal marketing-page layout around the terminal.

---

# 5. Route Requirements

## `/trade`

If no market is specified:

* Load a sensible default market.
* Recommended default:

```text
BTC/USDT
```

The page should redirect internally or render the selected default market.

Preferred canonical route:

```text
/trade/BTC-USDT
```

---

# 6. Dynamic Market Route

Format:

```text
/trade/[symbol]
```

Examples:

```text
/trade/BTC-USDT
/trade/ETH-USDT
/trade/SOL-USDT
/trade/XRP-USDT
```

Symbol must be validated.

Invalid:

```text
/trade/INVALID
```

should show a proper:

```text
Market Not Found
```

state rather than crashing.

---

# 7. Trading Terminal Layout

Desktop target:

```text
┌──────────────────────────────────────────────────────────────┐
│ ETHSLTD Header                                               │
├──────────────────────────────────────────────────────────────┤
│ Paper Trading Mode / Market Selector                         │
├──────────────────────────────────────────────────────────────┤
│ BTC/USDT     Price      24h Change      High Low Volume      │
├─────────────────────────────────────┬────────────────────────┤
│                                     │                        │
│                                     │      ORDER BOOK         │
│                                     │                        │
│              CHART                  │       Asks             │
│                                     │                        │
│                                     │       Spread            │
│                                     │                        │
│                                     │       Bids             │
│                                     │                        │
├─────────────────────────────────────┤                        │
│ Buy / Sell Order Form               │                        │
│                                     │                        │
├─────────────────────────────────────┴────────────────────────┤
│ Open Orders | Order History | Trade History                  │
└──────────────────────────────────────────────────────────────┘
```

---

# 8. Trading Page Sections

The page must contain:

1. Trading mode indicator
2. Market selector
3. Market summary
4. Chart
5. Chart controls
6. Order book
7. Recent trades
8. Buy/Sell order form
9. Balance information
10. Open orders
11. Order history
12. Trade history
13. Mobile trading controls
14. Error/loading/empty states

---

# 9. Trading Mode

This is mandatory.

Display:

```text
PAPER TRADING
```

clearly.

Example:

```text
● PAPER TRADING
```

Use a visually distinct badge.

Supporting copy:

```text
Simulated trading — no real funds are used.
```

Do not say:

```text
Your money is safe
```

because paper trading contains no real money.

---

# 10. Future Live Trading Mode

Architecture must support:

```typescript
type TradingMode =
  | "paper"
  | "live";
```

For the current implementation:

```text
paper = enabled
live = unavailable
```

If a Live Trading control exists, it must display:

```text
Live Trading
Coming Soon
```

or:

```text
Live trading isn't available yet.
```

Do not allow fake live execution.

---

# 11. Market Selector

At the top of the terminal:

```text
BTC/USDT
```

Clicking it opens market search.

Search:

```text
Search markets
```

Example results:

```text
BTC/USDT
ETH/USDT
SOL/USDT
XRP/USDT
BNB/USDT
ADA/USDT
```

Each result should display:

* Symbol
* Last price
* 24h percentage

---

# 12. Market Selector Behavior

Selecting:

```text
ETH/USDT
```

changes:

```text
/trade/ETH-USDT
```

The following must update:

* Chart
* Order book
* Recent trades
* Market price
* Order form
* Market metadata
* Base asset
* Quote asset
* Balance
* Open orders
* Trade history

---

# 13. Market Summary

Display:

```text
BTC/USDT

$104,284.32

+2.41%

24h High
$105,100

24h Low
$101,420

24h Volume
$1.24B
```

Also support:

```text
24h Change
24h High
24h Low
24h Volume
```

---

# 14. Market Price

Price formatting must be asset-specific.

Do not hard-code decimal precision.

Example:

```text
BTC
104,284.32

ETH
3,842.17

XRP
2.3845
```

Precision comes from market configuration.

---

# 15. Chart

Primary chart:

**Candlestick chart**

Required features:

* Candles
* Zoom
* Pan
* Crosshair
* Time axis
* Price axis
* Volume
* Responsive resizing

---

# 16. Timeframes

Provide:

```text
1m
5m
15m
30m
1H
4H
1D
1W
```

Optional:

```text
1M
```

Selecting timeframe reloads/updates chart data.

---

# 17. Chart Controls

Example:

```text
1m  5m  15m  30m  1H  4H  1D  1W
```

Additional controls:

```text
Candles
Indicators
Fullscreen
```

Indicators can initially be limited to:

```text
Volume
MA
EMA
RSI
```

If indicator functionality is not yet implemented, don't display non-functional controls.

---

# 18. Chart Data Provider

Do not put chart data directly inside the component.

Use:

```text
MarketDataProvider
```

Interface:

```typescript
interface MarketDataProvider {
  getTicker(symbol: string): Promise<Ticker>;
  getCandles(
    symbol: string,
    interval: CandleInterval
  ): Promise<Candle[]>;
  getOrderBook(symbol: string): Promise<OrderBook>;
  getRecentTrades(symbol: string): Promise<Trade[]>;
}
```

Current implementation:

```text
MockMarketDataProvider
```

Future:

```text
LiveMarketDataProvider
```

---

# 19. Chart Mock Data

Mock candles should look realistic.

Do not use:

```text
100
101
102
103
104
```

with an obvious straight-line pattern.

Generate:

* Open
* High
* Low
* Close
* Volume
* Timestamp

with natural variations.

---

# 20. Order Book

Right-side order book.

Structure:

```text
Price        Amount       Total

105,210.22   0.52         54,709
105,205.10   1.20        126,246
105,200.00   0.38         39,976

-------------------------
Spread: 0.12%
-------------------------

104,980.12   0.45         47,241
104,975.00   1.10        115,472
104,970.00   0.75         78,727
```

---

# 21. Order Book Requirements

Display:

* Price
* Amount
* Total
* Bid/Ask distinction
* Spread

Optional:

* Depth visualization
* Cumulative volume

---

# 22. Order Book Interaction

Clicking an ask price:

```text
105,200
```

should populate:

```text
Price
105,200
```

in the Buy/Sell order form where appropriate.

Clicking a bid price should similarly populate the order price.

This is a core trading-terminal interaction.

---

# 23. Order Book Updates

Current paper implementation can simulate updates.

Example:

```text
105,200.00
105,199.80
105,200.40
```

Do not recreate the entire UI unnecessarily on every tick.

Use efficient state updates.

---

# 24. Recent Trades

Display:

```text
Time       Price       Amount

19:42:11   104,284     0.034 BTC
19:42:09   104,281     0.012 BTC
19:42:08   104,279     0.091 BTC
```

Use directional styling:

```text
Buy
Sell
```

---

# 25. Order Form

Central or lower section.

Tabs:

```text
BUY
SELL
```

Default:

```text
BUY
```

---

# 26. Order Types

Current UI should support:

### Market

```text
Market
```

### Limit

```text
Limit
```

Architecture should allow:

```text
Stop Limit
Stop Market
```

later without redesigning the order form.

For the initial paper terminal, **Limit + Market** are required.

---

# 27. Limit Order Form

Example:

```text
Buy BTC

Price
[ 104,284.32 USDT ]

Amount
[ 0.0100 BTC ]

Total
[ 1,042.84 USDT ]

Available
1,250.00 USDT

Estimated Fee
1.04 USDT

[ Buy BTC ]
```

---

# 28. Sell Form

```text
Sell BTC

Price
[ 104,284.32 USDT ]

Amount
[ 0.0100 BTC ]

Total
[ 1,042.84 USDT ]

Available
0.245 BTC

Estimated Fee
1.04 USDT

[ Sell BTC ]
```

---

# 29. Percentage Shortcuts

Provide:

```text
25%
50%
75%
100%
```

For Buy:

Calculate based on quote balance.

For Sell:

Calculate based on base-asset balance.

---

# 30. Market Order

Market order should not require price input.

Display:

```text
Amount
[ 0.010 BTC ]

Estimated Price
$104,284

Total
$1,042.84

Estimated Fee
$1.04

[ Buy BTC ]
```

Use:

```text
estimated
```

because simulated execution price may change.

---

# 31. Order Validation

Use Zod.

Validate:

* Symbol
* Side
* Order type
* Price
* Quantity
* Minimum quantity
* Maximum quantity
* Precision
* Balance
* Required fields

Example:

```text
Quantity must be greater than 0.
```

---

# 32. Financial Precision

Never use normal JavaScript floating-point arithmetic for financial calculations.

Use:

* integer smallest units where appropriate
* decimal/exact arithmetic library
* market-specific precision

Example:

```text
BTC precision = 8
USDT precision = 2
```

must come from asset configuration.

---

# 33. Order State Machine

Orders must use explicit states.

```text
CREATED
   ↓
VALIDATING
   ↓
ACCEPTED
   ↓
OPEN
   ↓
PARTIALLY_FILLED
   ↓
FILLED
```

Alternative:

```text
OPEN
 ↓
CANCELLED
```

Other states:

```text
REJECTED
EXPIRED
```

---

# 34. Paper Trading Engine

The mock trading engine should behave like an actual trading engine.

It should:

1. Validate order.
2. Check simulated balance.
3. Reserve balance.
4. Add order to order book.
5. Match eligible orders.
6. Generate trades.
7. Update balances.
8. Unlock reserved funds.
9. Update order status.
10. Record order event.
11. Update trade history.

Do not implement paper trading as:

```typescript
setBalance(balance - amount)
```

only.

The architecture should reflect the eventual financial domain.

---

# 35. Paper Wallet

Default paper account:

```text
USDT
10,000.00
```

Other assets can have zero or configurable simulated balances.

Example:

```text
USDT       10,000.00
BTC             0.00
ETH             0.00
SOL             0.00
```

---

# 36. Paper Balance Display

Trading terminal should show:

```text
Available
Locked
Total
```

Example:

```text
USDT

Available: 8,500
Locked:    1,500
Total:    10,000
```

---

# 37. Balance Reservation

When a Buy Limit order is placed:

```text
Available USDT
       ↓
Locked USDT
```

When cancelled:

```text
Locked USDT
       ↓
Available USDT
```

When filled:

```text
USDT decreases
BTC increases
```

The same principle applies to Sell orders.

---

# 38. Fee Engine

Create a fee abstraction.

Example:

```typescript
interface FeeEngine {
  calculateFee(params): Money;
}
```

Initial paper fee:

```text
0.10%
```

But this must be configuration-driven.

Do not hard-code `0.1` across components.

---

# 39. Fee Display

Always make the fee transparent.

Example:

```text
Estimated fee
1.04 USDT
```

Do not display:

```text
0% fees
```

unless the actual configured fee is zero.

---

# 40. Order Submission

When user clicks:

```text
Buy BTC
```

button must:

1. Validate form.
2. Prevent duplicate submissions.
3. Create client request ID.
4. Create idempotency key.
5. Send order to trading provider.
6. Display loading state.
7. Receive result.
8. Update order state.
9. Update balances.
10. Show confirmation.

---

# 41. Duplicate Submission Protection

Button must be disabled while submitting.

Example:

```text
Placing order...
```

Prevent:

```text
BUY
BUY
BUY
```

from accidental double clicks.

---

# 42. Idempotency

Order submission architecture should support:

```text
Idempotency-Key
```

Even in mock mode.

Example:

```typescript
submitOrder({
  ...order,
  idempotencyKey
});
```

This makes the eventual live backend migration safer.

---

# 43. Order Confirmation

After successful paper order:

```text
Order placed

Buy 0.01 BTC
@ 104,284.32 USDT

Order ID
PAPER-...
```

For a market order:

```text
Market order executed
```

Only claim execution when the simulator actually executes it.

---

# 44. Error Handling

Examples:

```text
Insufficient USDT balance.
```

```text
Minimum order size is 0.0001 BTC.
```

```text
Price precision is limited to 2 decimals.
```

```text
Unable to place order. Please try again.
```

Never expose internal errors such as:

```text
SQLITE_ERROR
```

to users.

---

# 45. Open Orders

Bottom panel:

```text
Open Orders
```

Columns:

```text
Time
Pair
Type
Side
Price
Amount
Filled
Total
Status
Action
```

Example:

```text
19:41
BTC/USDT
Limit
Buy
104,000
0.02
0%
2,080 USDT
Open
Cancel
```

---

# 46. Cancel Order

User can cancel open paper orders.

Confirmation should be lightweight.

After cancellation:

```text
Order cancelled
```

and locked funds become available.

---

# 47. Order History

Display completed/cancelled/rejected orders.

Columns:

```text
Date
Pair
Type
Side
Price
Amount
Filled
Fee
Status
```

---

# 48. Trade History

Display actual fills.

Columns:

```text
Time
Pair
Side
Price
Amount
Fee
Total
```

Example:

```text
19:42:10
BTC/USDT
Buy
104,284
0.01
1.04 USDT
1,042.84 USDT
```

---

# 49. Tabs

Bottom section:

```text
Open Orders
Order History
Trade History
```

On mobile:

```text
Orders
History
Trades
```

---

# 50. Empty States

Open Orders:

```text
No open orders

Your active orders will appear here.
```

Trade History:

```text
No trades yet

Your completed trades will appear here.
```

---

# 51. Market Switching

Switching market must not accidentally carry stale form values.

Example:

User is on:

```text
BTC/USDT
Price: 104,000
Amount: 0.01
```

switches to:

```text
ETH/USDT
```

The form must reset or safely adapt.

Never retain:

```text
BTC quantity
```

as an ETH quantity without explicit recalculation.

---

# 52. Unsaved Order Form State

If user changes tabs:

```text
Buy → Sell
```

handle state intentionally.

Preferred:

* Preserve entered values where logically valid.
* Clear incompatible values where required.

---

# 53. Favorite Market

Reuse the existing Markets page favorite/watchlist system.

The star state must remain consistent between:

```text
/markets
```

and:

```text
/trade/BTC-USDT
```

Use the existing centralized/local persistence approach rather than creating a second unrelated favorites system.

---

# 54. Watchlist Shortcut

Allow:

```text
☆ BTC/USDT
```

or:

```text
★ BTC/USDT
```

near the market title.

Clicking toggles favorite.

---

# 55. URL State

Important trading state should be URL-compatible where appropriate.

Example:

```text
/trade/BTC-USDT
```

The market must be represented in the URL.

Do not rely only on Zustand/localStorage for the selected market.

---

# 56. Browser Refresh

Refresh:

```text
/trade/BTC-USDT
```

must return to:

```text
BTC/USDT
```

without losing the market context.

Paper orders/history should remain available through the configured paper-trading persistence mechanism.

---

# 57. Paper Trading Persistence

For the current frontend-only implementation, paper trading state may use:

```text
localStorage
```

or a dedicated client-side persistence layer.

Store:

```text
paper account
balances
orders
trades
favorites
preferences
```

Do not store sensitive authentication credentials in localStorage.

---

# 58. Paper Reset

Provide a safe reset mechanism in the user-facing paper trading experience.

Example:

```text
Reset Paper Account
```

Confirmation:

```text
Reset your paper trading account?

This will remove your simulated orders, trades and balances.
```

Then:

```text
Reset
Cancel
```

Default balance returns to configured starting balance.

---

# 59. Do Not Mix Paper Data With Future Live Data

Architecture:

```text
TradingAccount
   │
   ├── PAPER
   │
   └── LIVE
```

Never create a single ambiguous balance object.

---

# 60. Data Models

Create centralized types.

Recommended:

```text
lib/trading/types.ts
```

Core types:

```typescript
Market
Ticker
Candle
OrderBook
OrderBookLevel
RecentTrade
Order
OrderEvent
Trade
Balance
TradingAccount
Fee
```

---

# 61. Order Type

Example:

```typescript
type OrderType =
  | "market"
  | "limit";
```

Architecture-ready:

```typescript
type OrderType =
  | "market"
  | "limit"
  | "stop_market"
  | "stop_limit";
```

But don't expose unsupported types in UI.

---

# 62. Order Side

```typescript
type OrderSide =
  | "buy"
  | "sell";
```

---

# 63. Order Status

```typescript
type OrderStatus =
  | "created"
  | "validating"
  | "accepted"
  | "open"
  | "partially_filled"
  | "filled"
  | "cancelled"
  | "rejected"
  | "expired";
```

---

# 64. Trade Model

Minimum:

```typescript
interface Trade {
  id: string;
  orderId: string;
  market: string;
  side: OrderSide;
  price: string;
  quantity: string;
  quoteAmount: string;
  fee: string;
  feeAsset: string;
  timestamp: number;
}
```

Use strings/decimal-safe values for financial numbers rather than JavaScript floating-point values.

---

# 65. Market Model Compatibility

Reuse the existing:

```text
lib/market-data/types.ts
```

Do not create a second incompatible `Market` interface.

The Trade page should consume the same market definition used by `/markets`.

---

# 66. Provider Architecture

Existing:

```text
MockMarketDataProvider
```

should remain.

Add trading abstraction:

```text
TradingProvider
```

Example:

```typescript
interface TradingProvider {
  getBalances(): Promise<Balance[]>;
  getOpenOrders(symbol?: string): Promise<Order[]>;
  getOrderHistory(symbol?: string): Promise<Order[]>;
  getTradeHistory(symbol?: string): Promise<Trade[]>;
  placeOrder(order: PlaceOrderRequest): Promise<Order>;
  cancelOrder(orderId: string): Promise<Order>;
}
```

Current implementation:

```text
MockTradingProvider
```

Future:

```text
LiveTradingProvider
```

---

# 67. Realtime Architecture Preparation

Current frontend can simulate updates.

Architecture should eventually support:

```text
REST
+
WebSocket
```

Future:

```text
Initial market snapshot
        ↓
WebSocket connection
        ↓
Incremental updates
```

Do not build polling into every individual component.

---

# 68. WebSocket Channels — Future Compatible

Design around:

```text
/ws/market/BTC-USDT
/ws/orderbook/BTC-USDT
/ws/trades/BTC-USDT
/ws/account
/ws/orders
```

Not required to connect to a real WebSocket in this step unless a backend exists.

---

# 69. Order Book Performance

The order book may update frequently.

Requirements:

* Avoid unnecessary React tree rerenders.
* Keep order-book rows lightweight.
* Limit visible levels.
* Use memoized rows.
* Avoid expensive animations.
* Do not render thousands of rows.

Recommended visible levels:

```text
10–20 asks
10–20 bids
```

---

# 70. Responsive Desktop Layout

Desktop:

```text
Market Header
       ↓
Chart + Order Book
       ↓
Order Form
       ↓
Orders
```

Minimum target:

```text
1280px
```

Preferred terminal experience:

```text
1440px+
```

---

# 71. Tablet Layout

Tablet should transition to:

```text
Chart
↓
Order Book
↓
Buy/Sell
↓
Orders
```

Do not force desktop's three-column layout into a narrow screen.

---

# 72. Mobile Layout

Mobile must be a purpose-built trading experience.

Suggested:

```text
Market
Price
Change

Chart

Buy | Sell

Order Form

Order Book

Recent Trades

Open Orders
```

Avoid placing tiny desktop tables into horizontal overflow wherever possible.

---

# 73. Mobile Sticky Trade Bar

Provide a mobile bottom action bar:

```text
[ BUY ]      [ SELL ]
```

or:

```text
[ Buy BTC ] [ Sell BTC ]
```

This should open/focus the order form.

---

# 74. Mobile Order Book

Use tabs:

```text
Order Book
Recent Trades
```

instead of showing both simultaneously.

---

# 75. Mobile Chart

Chart must:

* resize correctly
* support horizontal interaction
* remain touch-friendly
* avoid overflow
* preserve readable price labels

---

# 76. Desktop Keyboard Support

Useful shortcuts:

```text
B → Buy
S → Sell
```

Optional:

```text
Esc → Close modal
```

Do not introduce shortcuts that interfere with typing inside form fields.

---

# 77. Accessibility

Required:

* keyboard navigation
* visible focus states
* semantic buttons
* proper labels
* accessible tabs
* screen-reader labels
* sufficient contrast
* no color-only information
* accessible modal/dialog behavior

Buy/sell direction should not rely solely on green/red.

---

# 78. Theme Support

The existing light/dark system must continue working.

Do not introduce hardcoded:

```text
bg-black
text-white
```

where semantic tokens already exist.

Use existing:

```text
bg-background
text-foreground
text-muted-foreground
border-border
```

and existing brand tokens.

---

# 79. Trading Terminal Dark Mode

Dark mode should be the primary trading experience.

Characteristics:

* high contrast
* compact controls
* subdued borders
* clear data hierarchy
* limited decorative gradients

The trading terminal should be more functional than promotional.

---

# 80. Light Mode

Light mode must remain fully supported.

Check:

* chart
* order book
* tables
* inputs
* tooltips
* badges
* dialogs
* errors
* selected states

for readability.

---

# 81. Header

Existing global header should remain consistent.

However, on the Trade page:

* avoid excessive vertical header height
* preserve access to navigation
* maintain active Trade state
* preserve theme toggle
* preserve login/signup behavior
* preserve mobile menu

The Trade navigation item should show active state.

---

# 82. Footer

A full marketing footer is not required to consume substantial trading-terminal space.

Preferred:

* normal footer after terminal on desktop
* compact footer on mobile

The trading interface itself should remain the dominant content.

---

# 83. Search

Global header search can navigate users to markets.

Inside the trading terminal, the Market Selector should provide trading-specific search.

Do not duplicate a huge global search system.

---

# 84. Loading States

Every data-dependent area needs loading states.

Examples:

```text
Loading market...
```

Chart:

Skeleton.

Order book:

Skeleton rows.

Recent trades:

Skeleton rows.

Orders:

Skeleton table.

---

# 85. Error States

Market unavailable:

```text
Market unavailable

We couldn't load this market right now.
[Try again]
```

Order book failure:

```text
Order book unavailable
[Retry]
```

Chart failure:

```text
Chart data unavailable
```

---

# 86. Offline/Connection State

If realtime functionality is later enabled, show:

```text
Connected
```

or:

```text
Reconnecting...
```

Current mock implementation may simulate:

```text
Market data: Simulated
```

---

# 87. Paper Trading Disclosure

Near the terminal:

```text
Paper Trading

All orders, balances and trades on this page are simulated and do not represent real transactions or real funds.
```

This is important.

---

# 88. Risk Disclosure

Include a concise link/notice:

```text
Crypto assets can be volatile and may involve significant risk.
```

For paper trading, avoid making investment recommendations.

---

# 89. No Fake Real-Time Claims

Do not label generated mock data:

```text
LIVE
```

Instead:

```text
SIMULATED
```

or:

```text
PAPER DATA
```

unless actual live data is connected.

---

# 90. Market Data Label

Recommended:

```text
Market Data: Simulated
```

This avoids misleading users.

---

# 91. Order Entry UX

Order form must show:

```text
Available
Price
Amount
Total
Fee
```

before submission.

The primary CTA should always clearly identify:

```text
Buy BTC
```

or:

```text
Sell BTC
```

rather than simply:

```text
Submit
```

---

# 92. Input Components

Price:

```text
inputmode="decimal"
```

Quantity:

```text
inputmode="decimal"
```

Mobile numeric keyboard should be appropriate.

---

# 93. Input Sanitization

Reject:

```text
letters
negative values
NaN
Infinity
invalid decimal formats
```

Do not trust frontend validation alone.

The provider layer must validate again.

---

# 94. Order Size Limits

Market configuration should contain:

```text
minQuantity
maxQuantity
quantityPrecision
pricePrecision
minNotional
```

Example:

```typescript
interface MarketRules {
  minQuantity: string;
  maxQuantity: string;
  minNotional: string;
  pricePrecision: number;
  quantityPrecision: number;
}
```

---

# 95. Order Form Calculation

For Limit:

```text
Total = Price × Quantity
```

Then:

```text
Fee = Total × FeeRate
```

The exact calculation must use decimal-safe arithmetic.

---

# 96. Buy Balance Validation

Required:

```text
Total + Fee <= Available Quote Balance
```

If not:

```text
Insufficient USDT balance.
```

---

# 97. Sell Balance Validation

Required:

```text
Quantity <= Available Base Balance
```

If not:

```text
Insufficient BTC balance.
```

---

# 98. Partial Fills

Paper engine should support partial fills.

Example:

```text
Order:
1 BTC @ 100,000

Matched:
0.4 BTC

Remaining:
0.6 BTC
```

Status:

```text
PARTIALLY_FILLED
```

---

# 99. Full Fill

When:

```text
remaining quantity = 0
```

status becomes:

```text
FILLED
```

---

# 100. Order Events

Record:

```text
ORDER_CREATED
ORDER_ACCEPTED
ORDER_OPEN
ORDER_PARTIALLY_FILLED
ORDER_FILLED
ORDER_CANCELLED
ORDER_REJECTED
```

This prepares the platform for future auditability.

---

# 101. Order ID

Generate unique IDs.

Example:

```text
PAPER-ORD-01H...
```

Never rely on array index.

---

# 102. Trade ID

Example:

```text
PAPER-TRD-01H...
```

---

# 103. Request ID

Every order operation should have:

```text
requestId
```

This makes debugging easier.

---

# 104. Idempotency Key

Every order submission:

```text
idempotencyKey
```

must be unique for a business action.

---

# 105. Toast Notifications

Use the existing UI notification system.

Success:

```text
Order placed successfully.
```

Cancel:

```text
Order cancelled.
```

Error:

```text
Unable to place order.
```

Do not spam notifications on every simulated market tick.

---

# 106. Confirmation Modal

For important actions:

```text
Cancel Order?
```

Show:

```text
Buy BTC
0.01 BTC
104,000 USDT
```

Actions:

```text
Keep Order
Cancel Order
```

For paper trading, a simple confirmation may be used.

---

# 107. Order Details

Clicking an order can open a detail panel.

Display:

```text
Order ID
Market
Side
Type
Price
Amount
Filled
Remaining
Fee
Created
Updated
Status
```

---

# 108. Trade Details

Clicking a trade:

```text
Trade ID
Order ID
Market
Side
Price
Amount
Fee
Total
Timestamp
```

---

# 109. Market Stats Consistency

The Trade page must use the same market data conventions as `/markets`.

Do not show:

```text
BTC price = 104,284
```

on Markets and:

```text
BTC price = 99,000
```

on Trade unless mock-provider behavior explicitly represents different timestamps.

Prefer one centralized mock data source/state.

---

# 110. Shared Market Provider

Recommended structure:

```text
lib/
├── market-data/
│   ├── types.ts
│   ├── mock-provider.ts
│   └── index.ts
│
└── trading/
    ├── types.ts
    ├── mock-provider.ts
    ├── engine.ts
    ├── calculations.ts
    └── validation.ts
```

---

# 111. Component Structure

Recommended:

```text
components/trading/

├── TradingTerminal.tsx
├── TradingModeBadge.tsx
├── MarketSelector.tsx
├── MarketSummary.tsx
├── TradingChart.tsx
├── ChartToolbar.tsx
├── OrderBook.tsx
├── OrderBookRow.tsx
├── RecentTrades.tsx
├── OrderEntry.tsx
├── OrderTypeTabs.tsx
├── BuySellTabs.tsx
├── PercentageButtons.tsx
├── BalanceSummary.tsx
├── OpenOrders.tsx
├── OrderHistory.tsx
├── TradeHistory.tsx
├── OrderDetails.tsx
├── CancelOrderDialog.tsx
├── PaperTradingNotice.tsx
└── MobileTradingBar.tsx
```

---

# 112. State Architecture

Do not put everything into one giant Zustand store.

Separate concerns.

Example:

```text
market state
trading form state
paper account state
UI state
```

---

# 113. Suggested Zustand Stores

```text
useTradingUIStore
usePaperAccountStore
```

Market server state:

```text
TanStack Query
```

Form:

```text
React Hook Form
```

Validation:

```text
Zod
```

---

# 114. TanStack Query

Use for:

* market metadata
* ticker
* candles
* order book snapshot
* recent trades
* order history
* trade history

Do not use it as a replacement for all local interaction state.

---

# 115. React Hook Form

Use for:

```text
Buy/Sell order form
```

with:

```text
Zod resolver
```

---

# 116. No Backend Requirement for This Step

The Trade page must work without the production backend.

Use:

```text
MockMarketDataProvider
+
MockTradingProvider
```

This is acceptable because the architecture is provider-based.

---

# 117. Mock Provider Requirements

Mock provider must support:

```text
getTicker
getCandles
getOrderBook
getRecentTrades
getBalances
getOpenOrders
getOrderHistory
getTradeHistory
placeOrder
cancelOrder
```

---

# 118. Mock Engine Behavior

At minimum:

### Limit Buy

```text
Validate
Reserve USDT
Place order
Attempt matching
Update order
```

### Limit Sell

```text
Validate
Reserve BTC
Place order
Attempt matching
Update order
```

### Market Buy

```text
Use simulated ask liquidity
Fill order
Update balances
```

### Market Sell

```text
Use simulated bid liquidity
Fill order
Update balances
```

---

# 119. Simulated Matching

Use price-time priority conceptually:

```text
Best price
    ↓
Earliest order
```

Even though this is paper trading, this creates a realistic foundation.

---

# 120. Paper Order Book

There are two possible sources:

```text
Simulated market liquidity
```

and:

```text
User-generated paper orders
```

The architecture should permit both.

For this step, simulated liquidity can be the primary source.

---

# 121. Security Requirements

Even though there is no real financial backend yet:

* never expose secrets
* validate all inputs
* sanitize user-controlled values
* prevent XSS
* use CSP-compatible code
* do not store passwords
* do not store API keys
* do not store payment credentials
* do not imply custody
* do not expose admin functionality

---

# 122. Authentication Compatibility

The Trade page should work for:

```text
Guest
Authenticated User
```

Recommended guest experience:

```text
View market data
View chart
View order book
```

When attempting to place a paper trade:

```text
Create a free account to start paper trading.
```

If the project already implements authentication later, this should become an authentication gate.

---

# 123. Guest Order Form

The form may be visible to demonstrate the product.

Clicking Buy/Sell:

```text
Sign up to start paper trading.
```

Do not create anonymous persistent financial accounts unless intentionally designed.

---

# 124. Authentication Integration Point

Use an abstraction:

```typescript
getCurrentUser()
```

rather than directly coupling trading components to a future auth vendor.

---

# 125. Analytics Events

Add architecture-ready events:

```text
trade_page_view
market_selected
chart_timeframe_changed
order_form_opened
order_type_changed
buy_selected
sell_selected
order_submitted
order_placed
order_rejected
order_cancelled
paper_account_reset
```

Do not capture sensitive financial information unnecessarily.

---

# 126. SEO

Trade pages are application pages, so SEO is secondary.

Still provide:

```text
title
description
canonical URL
```

Example:

```text
BTC/USDT Trading | ETHSLTD
```

Do not index thousands of meaningless duplicate routes if not useful.

---

# 127. Metadata

Dynamic:

```text
BTC/USDT
ETH/USDT
SOL/USDT
```

Title should use market symbol.

---

# 128. Accessibility SEO/UX

Use meaningful:

```text
h1
h2
button labels
aria-label
```

Example:

```text
BTC/USDT trading terminal
```

---

# 129. Performance Requirements

Target:

* fast initial render
* minimal client JavaScript
* lazy-load chart library if appropriate
* memoize order book rows
* avoid unnecessary providers
* avoid expensive animations
* avoid giant SVG/DOM trees
* keep market table/trading data virtualized where necessary

---

# 130. Chart Bundle Optimization

The chart library should not unnecessarily block initial page rendering.

Prefer dynamic loading if compatible with the chosen chart implementation.

---

# 131. Mobile Performance

Avoid:

* huge chart bundles
* heavy animation
* unnecessary polling
* large order-book datasets
* excessive shadow/blur effects

Trading functionality has priority over visual decoration.

---

# 132. Error Boundary

Trading page must have a route-level error boundary.

If chart fails:

```text
Chart unavailable
```

The entire trading terminal must not disappear.

If order book fails:

```text
Order book unavailable
```

The order form should still be usable if safe.

---

# 133. Suspense

Use appropriate loading boundaries for:

```text
market data
chart
order book
history
```

---

# 134. Browser Compatibility

Support modern:

* Chrome
* Edge
* Firefox
* Safari
* Android Chrome
* iOS Safari

---

# 135. Data Refresh

Current mock implementation can use a lightweight timer.

Do not use many independent timers.

Preferred:

```text
centralized mock market update loop
```

that feeds subscribed components.

---

# 136. Time Handling

Store timestamps in:

```text
UTC
```

Display according to user locale where appropriate.

Trade history should provide a clear date/time.

---

# 137. Number Formatting

Centralized formatter:

```text
formatPrice()
formatQuantity()
formatCurrency()
formatPercent()
formatVolume()
```

Do not duplicate formatting logic across components.

---

# 138. Currency Formatting

Use market/asset configuration.

Example:

```text
BTC/USDT
```

Quote asset:

```text
USDT
```

Base asset:

```text
BTC
```

---

# 139. Asset Icons

Reuse existing asset icon strategy from `/markets`.

Do not create duplicate asset metadata.

---

# 140. Consistent Market IDs

Use:

```text
BTC-USDT
```

for route-safe symbol.

Convert to:

```text
BTC/USDT
```

for display.

Centralize conversion:

```text
normalizeMarketSymbol()
formatMarketSymbol()
```

---

# 141. Form Reset

After successful Market/Limit order:

Optionally:

```text
reset amount
```

while keeping:

```text
price
```

for Limit orders if that improves trader workflow.

For initial implementation, reset the order amount after successful submission and preserve market context.

---

# 142. Order Form Accessibility

Every input must have:

```text
label
placeholder
helper text
error message
```

Avoid relying solely on placeholders.

---

# 143. Order Button States

States:

```text
Buy BTC
```

```text
Placing...
```

```text
Buy BTC
```

Disabled state:

```text
Insufficient balance
```

where appropriate.

---

# 144. Trading Form Visual Hierarchy

Primary:

```text
Buy / Sell
```

Secondary:

```text
Price
Amount
Total
```

Tertiary:

```text
Available
Fee
```

Avoid excessive cards.

---

# 145. Professional Terminal Style

Compared with the Homepage:

Homepage:

```text
marketing
large typography
gradients
storytelling
```

Trade page:

```text
compact
dense
data-focused
functional
```

This distinction is intentional.

---

# 146. No Marketing Hero

Do not reuse the Homepage hero on the Trade page.

No:

```text
Trade Crypto With Clarity
```

large marketing headline.

Instead:

```text
BTC/USDT
```

should immediately appear.

---

# 147. No Large Footer Gap

Trading terminal should maximize usable viewport.

Avoid excessive:

```text
padding-top
padding-bottom
```

from marketing components.

---

# 148. Fullscreen Trading

Optional but recommended:

```text
Fullscreen
```

button.

Fullscreen mode should hide unnecessary marketing navigation while preserving:

* market
* chart
* order book
* order form
* orders

---

# 149. Browser Fullscreen

Use browser fullscreen API only after user interaction.

Fallback:

```text
expanded terminal layout
```

if fullscreen API is unavailable.

---

# 150. Trading Terminal Keyboard Focus

When user selects:

```text
Buy
```

focus Amount/Price intelligently.

Do not steal focus unexpectedly.

---

# 151. Order Book Price Click

This interaction is mandatory.

Example:

```text
click ask → price field
click bid → price field
```

Use a callback:

```typescript
onPriceSelect(price)
```

---

# 152. Chart Price Interaction

Optional:

Clicking chart price should not automatically submit an order.

It may populate the price field only if clearly designed.

Avoid accidental order placement.

---

# 153. Recent Trade Updates

Mock recent trades should update periodically.

Example:

```text
19:42:11
19:42:10
19:42:08
```

Newest at top.

---

# 154. Order Book Sorting

Asks:

```text
lowest ask → highest ask
```

Bids:

```text
highest bid → lowest bid
```

Do not accidentally reverse these.

---

# 155. Spread

Calculate:

```text
bestAsk - bestBid
```

Display both:

```text
Spread
0.12 USDT
```

and optionally:

```text
0.0001%
```

---

# 156. Depth Visualization

Order-book background depth bars are recommended.

Example:

```text
████████ 104,284
██████   104,283
████     104,281
```

Keep subtle.

---

# 157. Market Summary Updates

Ticker values should update from the same provider.

Avoid separate random values in every component.

---

# 158. Mock Data Consistency

All market data must originate from one source/state.

Bad:

```text
Market card random price
Chart random price
Order book random price
Ticker random price
```

Good:

```text
Mock Market Engine
       ↓
Ticker
Chart
Order Book
Recent Trades
```

---

# 159. Architecture Diagram

```text
                    /markets
                       │
                       │ Select Market
                       ▼
               /trade/BTC-USDT
                       │
             ┌─────────┴─────────┐
             │ Trading Terminal  │
             └─────────┬─────────┘
                       │
          ┌────────────┼────────────┐
          │            │            │
          ▼            ▼            ▼
     Market Data   Trading Data   UI State
       Provider      Provider      Zustand
          │            │
          │            │
          ▼            ▼
      Mock Market   Mock Trading
       Provider       Provider
          │            │
          └──────┬─────┘
                 ▼
          Paper Trading Engine
                 │
          ┌──────┼──────┐
          ▼      ▼      ▼
       Orders  Trades  Balances
```

---

# 160. Recommended File Structure

```text
app/
├── trade/
│   ├── page.tsx
│   └── [symbol]/
│       └── page.tsx

components/
└── trading/
    ├── TradingTerminal.tsx
    ├── TradingModeBadge.tsx
    ├── MarketSelector.tsx
    ├── MarketSummary.tsx
    ├── TradingChart.tsx
    ├── ChartToolbar.tsx
    ├── OrderBook.tsx
    ├── OrderBookRow.tsx
    ├── RecentTrades.tsx
    ├── OrderEntry.tsx
    ├── OrderTypeTabs.tsx
    ├── BuySellTabs.tsx
    ├── PercentageButtons.tsx
    ├── BalanceSummary.tsx
    ├── OpenOrders.tsx
    ├── OrderHistory.tsx
    ├── TradeHistory.tsx
    ├── OrderDetails.tsx
    ├── CancelOrderDialog.tsx
    ├── PaperTradingNotice.tsx
    └── MobileTradingBar.tsx

lib/
├── market-data/
│   ├── types.ts
│   ├── mock-provider.ts
│   └── index.ts
│
└── trading/
    ├── types.ts
    ├── calculations.ts
    ├── validation.ts
    ├── engine.ts
    ├── mock-provider.ts
    └── index.ts

stores/
├── trading-ui-store.ts
└── paper-account-store.ts

hooks/
├── use-market-data.ts
├── use-order-book.ts
├── use-trading.ts
└── use-paper-account.ts

schemas/
└── trading.ts
```

Adjust these paths to the existing project's actual conventions rather than duplicating files that already exist.

---

# 161. Do Not Duplicate Existing Files

Before implementation, inspect the existing project.

If already present:

```text
Market
MarketSparkline
MarketProvider
AssetIcon
ThemeProvider
Header
Footer
Button
Dialog
Tabs
Toast
```

reuse them.

Do not create:

```text
Market2
Button2
ThemeProvider2
```

---

# 162. Integration With Existing Markets Page

Every market row/card should have a route to:

```text
/trade/[symbol]
```

Example:

```text
BTC/USDT
```

→

```text
/trade/BTC-USDT
```

The Trade page should provide a clear path back to:

```text
Markets
```

---

# 163. Navigation Consistency

Existing header:

```text
Markets
Trade
P2P
Assets
Learn
More
```

On Trade:

```text
Trade
```

must have the same active styling already implemented for Markets.

---

# 164. P2P Compatibility

Do not implement P2P functionality in this step.

But the navigation must remain available.

Trade page may later connect to:

```text
P2P
```

but there should be no fake P2P controls inside the trading terminal.

---

# 165. Assets Compatibility

The Assets page does not need to be implemented here.

But balances should use the same future asset model.

Example:

```text
BTC
USDT
ETH
```

must not have conflicting definitions between Trading and future Assets.

---

# 166. Login/Signup Compatibility

Existing:

```text
Log In
Sign Up
```

must remain accessible.

Paper trading can be:

```text
guest preview
```

with authentication required for persistent user trading, depending on the existing auth implementation.

---

# 167. Tawk.to

Existing Tawk.to integration remains globally available.

Do not add a second chat integration inside the Trade page.

Avoid allowing the chat widget to cover:

```text
Buy
Sell
```

controls on mobile if positioning can be adjusted.

---

# 168. Back-to-Top

Existing Back-to-Top behavior may be inappropriate for a compact trading terminal.

Do not let it obscure trading controls.

If the existing global component automatically appears, ensure it does not overlap the mobile trading bar.

---

# 169. Legal/Compliance Links

The Trade page should retain access to existing:

```text
Terms
Privacy
Risk Disclosure
```

through the existing footer or relevant UI.

Do not invent legal claims.

---

# 170. Content Requirements

Use consistent ETHSLTD terminology.

### Preferred:

```text
Paper Trading
Market
Order
Trade
Balance
Available
Locked
Estimated Fee
```

### Avoid:

```text
Guaranteed profit
Safe returns
Risk-free investment
Guaranteed gains
```

Paper trading is risk-free only in the narrow sense that it does not use real funds; crypto markets themselves are not risk-free.

---

# 171. Microcopy

### Empty open orders

```text
No open orders

Orders you place will appear here.
```

### Empty trade history

```text
No trades yet

Completed trades will appear here.
```

### Paper mode

```text
You're using simulated funds. No real transactions are taking place.
```

### Login gate

```text
Sign in to save your paper trading activity.
```

---

# 172. Primary CTA Rules

Buy:

```text
Buy BTC
```

Sell:

```text
Sell BTC
```

Never:

```text
Trade Now
```

inside the actual order form.

The CTA must communicate the exact action.

---

# 173. Visual States

Inputs:

```text
default
focus
error
disabled
```

Buttons:

```text
default
hover
pressed
loading
disabled
```

Orders:

```text
open
partial
filled
cancelled
rejected
```

---

# 174. Color Semantics

Existing theme tokens must be used.

Trading direction can use semantic colors:

```text
buy
sell
warning
error
success
```

Do not hardcode colors throughout components.

---

# 175. Animation

Use minimal animation.

Acceptable:

* order-book row update highlight
* tab transitions
* modal transitions
* button loading

Avoid:

* excessive gradients
* constant chart animations
* distracting price effects
* large entrance animations

---

# 176. Testing Requirements

## Unit Tests

Test:

```text
price calculation
quantity calculation
total calculation
fee calculation
balance validation
precision validation
minimum order validation
order state transitions
```

---

# 177. Trading Engine Tests

Must test:

```text
valid limit buy
valid limit sell
market buy
market sell
insufficient balance
partial fill
full fill
cancel order
duplicate order request
invalid quantity
invalid price
minimum notional
```

---

# 178. Component Tests

Test:

```text
market selector
buy/sell switch
order type switch
order form
percentage buttons
order book
open orders
cancel order
```

---

# 179. E2E Tests

Using Playwright.

Flow:

```text
Open Markets
   ↓
Select BTC/USDT
   ↓
Navigate to Trade
   ↓
Verify BTC/USDT
   ↓
Select Buy
   ↓
Select Limit
   ↓
Enter Price
   ↓
Enter Amount
   ↓
Submit
   ↓
Order appears in Open Orders
   ↓
Cancel Order
   ↓
Order becomes Cancelled
```

---

# 180. E2E Market Switch

Test:

```text
BTC/USDT
↓
ETH/USDT
↓
Chart updates
↓
Order book updates
↓
Form resets appropriately
```

---

# 181. E2E Mobile

Test viewport:

```text
390 × 844
```

Verify:

* chart
* Buy/Sell
* order form
* order book
* history
* mobile bottom controls
* no horizontal page overflow

---

# 182. Accessibility Testing

Check:

* keyboard navigation
* focus order
* form labels
* ARIA
* contrast
* tab states
* dialog accessibility

---

# 183. Build Requirements

Must pass:

```text
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Use the project's actual existing commands if different.

No TypeScript errors.

No ESLint errors.

No console errors in production.

---

# 184. Browser Console

Remove:

```text
console.log()
```

from production trading code unless intentional structured logging exists.

---

# 185. Mock Data Debugging

If debugging is required:

```text
development-only logging
```

must be guarded.

Never expose internal trading state in production console logs.

---

# 186. Error Monitoring Compatibility

The Trade page should be compatible with the existing/future monitoring system.

Capture:

```text
market load failure
order placement failure
order cancellation failure
provider failure
unexpected state errors
```

Do not capture:

```text
passwords
tokens
secrets
private keys
```

---

# 187. No Secrets

The frontend must not contain:

```text
private API keys
exchange credentials
database credentials
Cloudflare secrets
admin tokens
wallet private keys
```

---

# 188. Cloudflare Compatibility

The implementation must remain compatible with the planned Cloudflare architecture.

Avoid browser/server assumptions that prevent eventual deployment.

The UI should remain deployable through the existing Next.js/Cloudflare setup.

---

# 189. No Backend Coupling

Do not write:

```text
component → database
```

Instead:

```text
component
   ↓
hook
   ↓
provider
   ↓
backend
```

Current:

```text
provider
   ↓
mock implementation
```

Future:

```text
provider
   ↓
Workers API
   ↓
Trading Engine
```

---

# 190. Future Production Architecture

The current Trade page should eventually connect to:

```text
Browser
   ↓
Workers API
   ↓
Authentication
   ↓
Risk Engine
   ↓
Balance Reservation
   ↓
Matching Engine
   ↓
Ledger
   ↓
D1 / Durable Objects
```

The frontend must not attempt to implement production custody or financial settlement itself.

---

# 191. Important Production Boundary

The current paper engine is a simulation.

It is **not** a production exchange matching engine.

It must never be promoted to live-money processing simply by changing:

```text
paper = false
```

Real trading requires backend-side:

* authorization
* risk checks
* atomic balance reservation
* matching
* ledger
* idempotency
* audit
* reconciliation
* compliance

---

# 192. Acceptance Criteria — Page

The Trade page is complete when:

* `/trade` works.
* `/trade/BTC-USDT` works.
* Dynamic symbols work.
* Invalid symbols show proper errors.
* Existing Header works.
* Existing theme switch works.
* Paper Trading indicator is visible.
* Market selector works.
* Market summary works.
* Chart works.
* Timeframes work.
* Order book works.
* Recent trades work.
* Buy/Sell switch works.
* Limit order works.
* Market order works.
* Validation works.
* Fee calculation works.
* Balance calculation works.
* Percentage buttons work.
* Paper orders are created.
* Orders can be cancelled.
* Partial fills are supported.
* Filled orders appear in history.
* Trade history works.
* Market switching works.
* Mobile layout works.
* Light mode works.
* Dark mode works.
* No fake live trading is presented.
* No console errors remain.

---

# 193. Acceptance Criteria — Architecture

The implementation is complete only if:

```text
Market types
```

are shared with `/markets`.

```text
Market provider
```

is not duplicated.

```text
Trading provider
```

is abstracted.

```text
Trading engine
```

is separated from UI.

```text
Validation
```

is separated from components.

```text
Financial calculations
```

are centralized.

```text
Paper account
```

is isolated from future Live account.

---

# 194. Acceptance Criteria — UX

A first-time user should understand within seconds:

```text
What market am I viewing?
What is the current price?
What can I buy/sell?
What is my balance?
What type of order am I placing?
How much will it cost?
Is this real or simulated?
Where are my orders?
```

No critical information should require guessing.

---

# 195. Acceptance Criteria — Consistency With Existing Product

The new Trade page must:

* use existing ETHSLTD branding
* use existing Header
* use existing Footer where appropriate
* use existing theme system
* use existing semantic colors
* use existing asset metadata
* use existing market data types
* use existing favorite/watchlist behavior
* use existing responsive breakpoints where possible
* use existing UI components where available
* preserve Tawk.to
* preserve existing navigation

---

# 196. Definition of Done

The next implementation should be considered complete only when:

```text
ETHSLTD Homepage
       ✓

ETHSLTD Markets
       ✓

ETHSLTD Trade
       ✓
```

and the user journey works:

```text
Homepage
   ↓
Markets
   ↓
BTC/USDT
   ↓
Trade BTC/USDT
   ↓
Paper Trading
   ↓
Place Order
   ↓
Open Orders
   ↓
Cancel / Fill
   ↓
Trade History
```

---

# 197. Final User Journey

### Guest

```text
Homepage
   ↓
Markets
   ↓
Select BTC/USDT
   ↓
Trade Terminal
   ↓
View Chart
   ↓
View Order Book
   ↓
View Paper Trading Interface
   ↓
Sign Up / Log In
```

### Authenticated Paper Trader

```text
Login
   ↓
Trade
   ↓
BTC/USDT
   ↓
Buy
   ↓
Limit
   ↓
Price + Amount
   ↓
Place Paper Order
   ↓
Open Orders
   ↓
Fill / Cancel
   ↓
Trade History
```

---

# 198. Final Technical Contract

The developer implementing this PRD should **not**:

* rebuild the Homepage
* rebuild `/markets`
* introduce a new framework
* introduce another state library unnecessarily
* create a second market-data model
* create fake backend APIs pretending to be production
* claim mock data is live
* implement real-money trading
* implement deposits
* implement withdrawals
* implement custody
* implement KYC
* implement P2P
* implement contracts
* modify unrelated completed pages unless required for integration

The developer **should**:

* extend the current architecture
* reuse existing components
* create the trading domain layer
* build the terminal
* implement paper trading
* keep the provider abstraction
* make the UI production-backend-ready
* maintain light/dark mode
* maintain responsive behavior
* maintain TypeScript strictness
* test all trading interactions

---

# 199. Expected Result

After implementing this PRD, ETHSLTD should have:

```text
┌─────────────────────────────────────────────────────────────┐
│                         ETHSLTD                              │
├─────────────────────────────────────────────────────────────┤
│                    PAPER TRADING                             │
│                                                             │
│ BTC/USDT    $104,284.32    +2.41%    24h Vol $1.24B         │
├───────────────────────────────────────┬─────────────────────┤
│                                       │                     │
│                                       │    ORDER BOOK        │
│                                       │                     │
│               CANDLE                  │    ASKS             │
│                CHART                  │                     │
│                                       │    SPREAD            │
│                                       │                     │
│                                       │    BIDS             │
├───────────────────────────────────────┤                     │
│ BUY | SELL                            │                     │
│                                       │                     │
│ Limit | Market                        │                     │
│                                       │                     │
│ Price                                 │                     │
│ Amount                                │                     │
│ Total                                 │                     │
│ Fee                                   │                     │
│                                       │                     │
│ [ BUY BTC ]                           │                     │
├───────────────────────────────────────┴─────────────────────┤
│ Open Orders | Order History | Trade History                  │
└─────────────────────────────────────────────────────────────┘
```

That gives ETHSLTD its **first actual trading-product surface**, while keeping everything consistent with the Homepage and completed `/markets` implementation and, importantly, without prematurely pretending that the platform already has real-money trading infrastructure.

