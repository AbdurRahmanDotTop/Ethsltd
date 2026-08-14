# ETHSLTD — Complete PRD: Wallet, Portfolio, Deposit & Withdrawal

**Recommended PRD filename:**

`ETHSLTD-WALLET-PORTFOLIO-DEPOSIT-WITHDRAWAL-PRD-USD.md`

This is the logical next step after the currently completed `/`, `/markets`, `/trade`, authentication/account/security, and `/p2p` work.

The implementation should remain **USD-first**, consistent with the existing ETHSLTD platform. No INR-specific UI, balances, labels, examples, defaults, or business logic should be introduced.

---

# 1. Document Information

| Field                  | Specification                                            |
| ---------------------- | -------------------------------------------------------- |
| Product                | ETHSLTD Crypto Trading Platform                          |
| PRD                    | Wallet, Portfolio, Deposit & Withdrawal                  |
| Route                  | `/wallet`                                                |
| Supporting routes      | `/wallet/deposit`, `/wallet/withdraw`, `/wallet/history` |
| Default fiat           | **USD**                                                  |
| Default account        | **Demo Trading**                                        |
| Crypto assets          | BTC, ETH, USDT, USDC, SOL and supported assets           |
| Current backend        | Mock provider                                            |
| Current financial mode | Simulation only                                          |
| Production backend     | REST/WebSocket-ready                                     |
| Framework              | Next.js 15 App Router                                    |
| Language               | TypeScript                                               |
| State                  | Zustand                                                  |
| Validation             | React Hook Form + Zod                                    |
| UI                     | Existing ETHSLTD design system                           |
| Theme                  | Light + Dark                                             |
| Responsive             | Desktop / Tablet / Mobile                                |
| Deployment target      | Cloudflare                                               |
| Status                 | Next implementation                                      |

---

# 2. Purpose

Create the **ETHSLTD Wallet & Portfolio Center** where users can see, manage, and understand all of their crypto balances.

The Wallet system becomes the financial bridge between:

```text
Authentication
      ↓
Account
      ↓
Wallet
      ↓
Portfolio
      ↓
Trading
      ↓
P2P
      ↓
Transactions
```

The feature must integrate consistently with the existing:

* `/trade`
* `/markets`
* `/p2p`
* `/account`
* authentication system
* security system
* USD-first configuration
* demo trading architecture

---

# 3. Important Product Rule

## USD is the default everywhere.

All default monetary values must use:

**USD — United States Dollar**

Examples:

```text
$10,000.00
$2,450.25
$125.00
$0.00
```

Do not introduce:

```text
₹
INR
Indian Rupee
```

as defaults.

The architecture may eventually support multiple fiat currencies, but the initial product must be:

```text
DEFAULT_FIAT = USD
```

---

# 4. Product Objective

The Wallet page should answer five questions immediately:

1. **How much money do I have?**
2. **What assets do I own?**
3. **How much is my portfolio worth in USD?**
4. **Where did my money come from or go?**
5. **Can I deposit, withdraw, or move assets?**

---

# 5. User Types

The Wallet UI should support:

### Guest

Can see public information but cannot access private balances.

### Authenticated User

Can access wallet and portfolio.

### Demo Trading User

Uses simulated balances.

### Future Live User

Uses actual balances.

The architecture must support both:

```text
DEMO
LIVE
```

without duplicating the entire application.

---

# 6. Wallet Architecture

The core concept:

```text
User
 │
 ├── Demo Account
 │      ├── USD
 │      ├── BTC
 │      ├── ETH
 │      ├── USDT
 │      └── USDC
 │
 └── Live Account
        ├── USD
        ├── BTC
        ├── ETH
        ├── USDT
        └── USDC
```

Initially:

```text
LIVE = disabled / unavailable
DEMO = enabled
```

---

# 7. Wallet Routes

Implement:

```text
/wallet
/wallet/deposit
/wallet/withdraw
/wallet/history
```

Optional future route structure:

```text
/wallet/assets/[asset]
```

---

# 8. Global Navigation Integration

Existing header navigation should expose:

```text
Markets
Trade
P2P
Wallet
```

Authenticated users should see:

```text
Wallet
```

Guest users clicking Wallet should be redirected to:

```text
/login?redirect=/wallet
```

After authentication:

```text
/login
   ↓
/wallet
```

---

# 9. Wallet Page

## Route

```text
/wallet
```

The page should have the following structure:

```text
Wallet

┌────────────────────────────────────────────┐
│ Total Portfolio Value                     │
│                                            │
│ $10,000.00                                 │
│ +$125.40 (+1.27%)                          │
│                                            │
│ [Deposit] [Withdraw] [Transfer]            │
└────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│ Asset Allocation                           │
│                                            │
│ BTC       45%                              │
│ ETH       30%                              │
│ USDT      15%                              │
│ USDC      10%                              │
└────────────────────────────────────────────┘

Your Assets

Asset | Price | Balance | USD Value | 24h | Action

BTC
ETH
USDT
USDC
SOL
```

---

# 10. Wallet Header

Display:

### Title

> Your Wallet

### Supporting text

> Manage your assets, track your portfolio, and move funds securely.

---

# 11. Account Mode Indicator

Clearly show:

```text
DEMO TRADING
```

for the current implementation.

Example:

```text
● Demo Trading
```

Do not make users believe simulated funds are real.

---

# 12. Portfolio Summary

Display:

### Total Portfolio Value

Example:

```text
$10,000.00
```

### 24h Change

```text
+$125.40
+1.27%
```

### Available Balance

```text
$8,500.00
```

### Locked Balance

```text
$1,500.00
```

### Total Balance

```text
$10,000.00
```

---

# 13. Balance Model

Each asset must support:

```ts
interface AssetBalance {
  assetId: string
  symbol: string

  available: Decimal
  locked: Decimal
  total: Decimal

  usdPrice: Decimal
  usdValue: Decimal

  change24h: Decimal
  change24hPercent: Decimal
}
```

Formula:

```text
total = available + locked
```

---

# 14. Never Use JavaScript Floating Point

Financial calculations must use exact decimal arithmetic.

Do not use:

```ts
number
```

for financial calculations where precision matters.

Use:

* integer smallest units, or
* decimal arithmetic abstraction.

The UI may receive formatted numeric values, but the domain layer must remain precision-safe.

---

# 15. Asset List

Initial simulated assets:

```text
USD
BTC
ETH
USDT
USDC
SOL
```

The asset architecture must be extensible.

Future:

```text
XRP
ADA
DOGE
AVAX
LINK
etc.
```

Do not hard-code the entire wallet around five assets.

---

# 16. Asset Table

Columns:

| Column    | Purpose                    |
| --------- | -------------------------- |
| Asset     | Logo + name + symbol       |
| Price     | Current USD price          |
| 24h       | 24h percentage change      |
| Balance   | Total asset quantity       |
| Available | Spendable balance          |
| Locked    | Reserved balance           |
| USD Value | Current USD value          |
| Action    | Deposit / Withdraw / Trade |

---

# 17. Example

```text
Bitcoin
BTC

Price
$104,250.00

Balance
0.045 BTC

USD Value
$4,691.25

24h
+2.41%

[Trade] [Deposit] [Withdraw]
```

---

# 18. Search Assets

Wallet must include:

```text
Search assets...
```

Search by:

* asset name
* symbol

Examples:

```text
Bitcoin
BTC
Ethereum
ETH
Tether
USDT
```

---

# 19. Hide Zero Balances

Provide:

```text
☐ Hide assets with zero balance
```

Default:

```text
OFF
```

Users can enable it.

---

# 20. Asset Filters

Optional filter:

```text
All
Crypto
Stablecoins
Fiat
```

Default:

```text
All
```

---

# 21. Portfolio Allocation

Display a visual allocation chart.

Example:

```text
Portfolio Allocation

BTC     46%
ETH     28%
USDT    16%
USDC    10%
```

Use a lightweight chart.

Avoid adding a heavy visualization dependency unnecessarily.

---

# 22. Portfolio Performance

Create:

```text
Portfolio Performance
```

Timeframes:

```text
1D
1W
1M
3M
1Y
ALL
```

Initially based on simulated historical data.

---

# 23. Performance Metrics

Display:

```text
Current Value
Starting Value
Profit/Loss
Profit/Loss %
24h Change
```

Example:

```text
Portfolio Value
$10,245.80

Total P&L
+$245.80

Return
+2.46%
```

---

# 24. Deposit

Route:

```text
/wallet/deposit
```

Purpose:

Allow the user to simulate adding funds.

Because the current product is demo trading, deposit must be explicitly labeled:

> Demo Trading Deposit

---

# 25. Deposit Screen

Structure:

```text
Deposit

Choose Asset

[ USD ]

Amount

$ __________

Available Simulation Limit
$10,000.00

[Deposit Funds]
```

For crypto:

```text
Deposit BTC

Simulated Deposit Address

bc1qxxxxxxxxxxxxx

[Copy]

Network

Bitcoin

Amount

0.00 BTC

[Simulate Deposit]
```

---

# 26. Demo Deposit UX

The current implementation should NOT pretend that blockchain transactions are occurring.

Display:

```text
Simulation Mode

This deposit is simulated and does not transfer real funds.
```

---

# 27. Deposit Confirmation

Before submission:

```text
Confirm Deposit

Asset
USD

Amount
$1,000.00

New Balance
$11,000.00

Simulation
Demo Trading

[Cancel]
[Confirm Deposit]
```

---

# 28. Deposit Validation

Rules:

* amount required
* amount > 0
* maximum simulation limit
* valid decimal precision
* supported asset
* user authenticated

Errors:

```text
Enter a valid amount.

Minimum deposit is $1.00.

Maximum demo deposit is $100,000.00.

This asset is not supported.
```

Exact limits should live in configuration, not UI constants.

---

# 29. Withdrawal

Route:

```text
/wallet/withdraw
```

---

# 30. Withdrawal Screen

Structure:

```text
Withdraw

Asset

BTC

Available
0.045 BTC

Destination

Wallet Address

Amount

________ BTC

Network

Bitcoin

Estimated Fee

0.0001 BTC

You Receive

________ BTC

[Withdraw]
```

---

# 31. Demo Withdrawal

Clearly display:

```text
Simulation Mode

This withdrawal is simulated and does not transfer real funds.
```

---

# 32. Withdrawal Validation

Check:

* authenticated user
* supported asset
* valid destination
* valid network
* sufficient available balance
* minimum withdrawal
* maximum withdrawal
* fee
* decimal precision

---

# 33. Insufficient Balance

Example:

Available:

```text
0.045 BTC
```

User requests:

```text
0.050 BTC
```

Display:

> Insufficient available BTC balance.

Never allow the transaction.

---

# 34. Locked Balance

The wallet must distinguish:

```text
Available
Locked
Total
```

Example:

```text
USDT

Available    7,500
Locked       2,500
Total       10,000
```

Locked funds may come from:

* open trading orders
* P2P escrow
* pending withdrawals
* future financial operations

---

# 35. Integration With Trade

The `/trade` demo account currently has balances.

Those balances must become conceptually connected to the wallet model.

Flow:

```text
Wallet
   ↓
Trading Account
   ↓
Order
   ↓
Locked Balance
```

When a limit order is placed:

```text
Available ↓
Locked ↑
```

When order is cancelled:

```text
Locked ↓
Available ↑
```

When filled:

```text
Locked ↓
Asset balance changes
```

---

# 36. Integration With P2P

P2P must also interact with wallet balances.

Example:

Seller has:

```text
100 USDT available
```

Seller creates P2P advertisement.

When trade begins:

```text
Available
100 USDT

↓

Locked / Escrow
100 USDT
```

When completed:

```text
Seller:
-100 USDT

Buyer:
+100 USDT
```

All of this must remain simulated at this stage.

---

# 37. Wallet Transaction History

Route:

```text
/wallet/history
```

Display:

```text
Transaction History
```

---

# 38. Transaction Types

Support:

```text
DEPOSIT
WITHDRAWAL
TRADE
P2P
TRANSFER
FEE
REWARD
ADJUSTMENT
```

Initial UI can expose:

```text
All
Deposits
Withdrawals
Trading
P2P
Fees
```

---

# 39. Transaction Table

Columns:

| Column    | Example      |
| --------- | ------------ |
| Date      | Aug 13, 2026 |
| Type      | Deposit      |
| Asset     | USD          |
| Amount    | +$1,000.00   |
| Status    | Completed    |
| Reference | TX-000001    |
| Details   | View         |

---

# 40. Transaction Statuses

```text
PENDING
PROCESSING
COMPLETED
FAILED
CANCELLED
REVERSED
```

---

# 41. Transaction Detail Drawer

Clicking a transaction opens:

```text
Transaction Details

Transaction ID
TX-000001

Type
Deposit

Asset
USD

Amount
+$1,000.00

Fee
$0.00

Status
Completed

Created
Aug 13, 2026

Updated
Aug 13, 2026

Mode
Demo Trading
```

---

# 42. Transaction IDs

Every transaction must have:

```text
transactionId
requestId
idempotencyKey
createdAt
updatedAt
```

Example:

```text
TX-20260813-000001
```

---

# 43. Idempotency

Deposit and withdrawal commands must support:

```text
Idempotency-Key
```

A repeated request must not create two deposits/withdrawals.

This prepares the UI and domain layer for real financial infrastructure later.

---

# 44. Wallet State Machine

Withdrawal:

```text
CREATED
   ↓
VALIDATING
   ↓
PENDING
   ↓
PROCESSING
   ↓
COMPLETED
```

Failure:

```text
FAILED
```

Cancellation:

```text
CANCELLED
```

---

# 45. Deposit State Machine

```text
CREATED
   ↓
PENDING
   ↓
PROCESSING
   ↓
COMPLETED
```

Failure:

```text
FAILED
```

---

# 46. Transfer

Add an internal transfer concept even if UI functionality is limited initially.

Future:

```text
Wallet
   ↓
Trading Account
   ↓
P2P Account
```

For example:

```text
Transfer $500 from Wallet to Trading
```

---

# 47. Internal Transfer UI

Route may eventually be:

```text
/wallet/transfer
```

UI:

```text
Transfer

From
Wallet

To
Trading Account

Asset
USD

Amount
$500.00

[Transfer]
```

This should use the same ledger abstraction.

---

# 48. Demo Account Reset

Since this is a simulated environment, provide:

```text
Reset Demo Account
```

inside an appropriate settings/account area rather than prominently on the wallet.

Confirmation:

```text
Reset Demo Trading Account?

Your simulated balances and demo trading history will be reset.

Starting balance:
$10,000.00 USD

[Cancel]
[Reset Account]
```

---

# 49. Default Demo Balance

Maintain consistency with existing `/trade`:

```text
10,000 USD
```

Do not change this default in the Wallet PRD.

Display:

```text
$10,000.00 USD
```

---

# 50. Currency Formatting

Use:

```text
$10,000.00
```

for USD.

Crypto:

```text
0.002500 BTC
1.250000 ETH
500.00 USDT
```

Precision must be asset-specific.

---

# 51. Asset Configuration

Create a centralized asset configuration.

Example conceptual model:

```ts
interface Asset {
  id: string
  symbol: string
  name: string
  type: "FIAT" | "CRYPTO" | "STABLECOIN"
  decimals: number
  enabled: boolean
  depositEnabled: boolean
  withdrawalEnabled: boolean
}
```

---

# 52. Price Provider

Create:

```text
MarketPriceProvider
```

The wallet must not calculate prices itself.

Flow:

```text
Market Provider
      ↓
Asset Price
      ↓
Wallet Valuation
```

Example:

```text
BTC
0.05 BTC

BTC Price
$104,250

Value
$5,212.50
```

---

# 53. Mock Wallet Provider

Create:

```text
MockWalletProvider
```

Responsibilities:

```text
getBalances()
getPortfolio()
getTransactions()
deposit()
withdraw()
transfer()
getTransaction()
```

The interface must be designed so it can later be replaced by:

```text
LiveWalletProvider
```

without rewriting the UI.

---

# 54. Provider Architecture

Recommended:

```text
lib/
  wallet/
    types.ts
    provider.ts
    mock-wallet-provider.ts
    wallet-utils.ts
```

Possible:

```text
lib/
  portfolio/
    types.ts
    portfolio-provider.ts
```

---

# 55. Zustand Store

Create:

```text
wallet-store.ts
```

State:

```ts
balances
portfolio
transactions
selectedAsset
filters
loading
error
```

Actions:

```ts
loadWallet()
deposit()
withdraw()
transfer()
refreshBalances()
loadTransactions()
resetDemoAccount()
```

---

# 56. Do Not Duplicate Trade State

The Wallet should not maintain an independent fake balance that conflicts with `/trade`.

Avoid:

```text
trade balance = $10,000
wallet balance = $10,000
```

as two unrelated systems.

Instead:

```text
Account
   ↓
Balances
   ↓
Wallet
   ↓
Trading
   ↓
P2P
```

The mock implementation can still use shared Zustand/domain state.

---

# 57. Financial Ledger Preparation

This PRD should introduce the conceptual ledger boundary.

Create types such as:

```ts
LedgerAccount
LedgerTransaction
LedgerEntry
```

A transaction should eventually produce:

```text
Debit
Credit
```

rather than simply modifying:

```text
balance += amount
```

---

# 58. Double-Entry Model

Example deposit:

```text
Exchange Simulation Account
DEBIT  $1,000

User USD Account
CREDIT $1,000
```

Trade:

```text
Buyer USD Account
DEBIT

Seller USD Account
CREDIT
```

The current mock system can simulate this while keeping the architecture ready for production.

---

# 59. Wallet Security

The Wallet must inherit existing authentication/security rules.

Require:

```text
authenticated session
```

for all private wallet APIs.

Never trust:

```text
userId
balance
asset
amount
fee
```

from the client.

---

# 60. Future Withdrawal Security

Design the UI architecture to support:

```text
2FA required
Email confirmation
Withdrawal address whitelist
New-address cooldown
Risk review
Manual approval
```

For current demo mode, these may be simulated or disabled.

---

# 61. Address Book

Prepare architecture for:

```text
Saved Withdrawal Addresses
```

Future UI:

```text
BTC Wallet Address

[Saved Address ▼]

+ Add New Address
```

Data:

```text
address
asset
network
label
createdAt
verified
```

---

# 62. Network Selection

For crypto withdrawal, network must be explicit.

Example:

```text
USDT

Network:
Ethereum
Tron
BSC
```

The application must never silently assume a network.

---

# 63. Fee Display

Show:

```text
Network Fee
Platform Fee
Total Fee
You Receive
```

Example:

```text
Amount
100 USDT

Network Fee
1 USDT

You Receive
99 USDT
```

For demo mode, values are simulated.

---

# 64. Confirmation UX

All financial actions need a confirmation step.

Example:

```text
Review Withdrawal

Asset
USDT

Network
Ethereum

Amount
100 USDT

Fee
1 USDT

You Receive
99 USDT

Destination
0x1234...5678

[Back]
[Confirm Withdrawal]
```

---

# 65. Success Screen

Example:

```text
Withdrawal Submitted

100 USDT withdrawal created successfully.

Transaction ID
TX-20260813-000002

Status
Processing

[View Transaction]
[Back to Wallet]
```

---

# 66. Error Handling

Standard errors:

```text
INSUFFICIENT_BALANCE
INVALID_AMOUNT
INVALID_ASSET
INVALID_ADDRESS
INVALID_NETWORK
WITHDRAWAL_DISABLED
DEPOSIT_DISABLED
ACCOUNT_RESTRICTED
SESSION_EXPIRED
RATE_LIMITED
REQUEST_FAILED
UNKNOWN_ERROR
```

Map these into user-friendly messages.

---

# 67. Loading States

Every wallet operation must support:

```text
loading
success
error
empty
```

Use skeletons instead of layout jumps.

---

# 68. Empty State

If there are no transactions:

```text
No transactions yet

Your deposits, withdrawals, trades, and P2P activity
will appear here.

[Explore Markets]
```

---

# 69. Responsive Design

### Desktop

Use a dashboard layout.

### Tablet

Collapse secondary information.

### Mobile

Use cards instead of wide tables.

Example:

```text
BTC

$104,250.00

0.045 BTC
$4,691.25

+2.41%

[Trade]
```

---

# 70. Mobile Bottom Actions

On mobile wallet:

```text
[Deposit]
[Withdraw]
```

may be sticky at the bottom where appropriate.

Ensure it does not overlap browser navigation or content.

---

# 71. Dark Mode

Must use existing semantic tokens.

Do not introduce hardcoded:

```text
bg-black
text-white
```

where semantic tokens already exist.

Maintain compatibility with:

```text
Light
Dark
System
```

---

# 72. Design Consistency

Wallet must reuse:

* existing Header
* Footer
* Button
* Card
* Input
* Dialog
* Tabs
* Badge
* Table
* Dropdown
* Toast
* Skeleton
* typography
* spacing
* semantic color system

Do not create a second design system.

---

# 73. Existing Brand Language

Maintain ETHSLTD tone:

```text
Clear
Professional
Trustworthy
Technical
Minimal
Premium
```

Avoid excessive:

```text
neon
gamification
financial hype
"get rich"
guaranteed returns
```

---

# 74. Financial Disclosures

Demo mode must clearly communicate:

> Demo trading uses simulated funds and does not represent real deposits, withdrawals, or blockchain transactions.

This should appear where users initiate simulated financial operations.

---

# 75. No Fake Production Claims

Do not display:

```text
Bank-grade custody
Guaranteed security
Guaranteed execution
Real deposits
Real withdrawals
```

unless those services actually exist.

The current implementation should be clearly simulation-based.

---

# 76. Portfolio Dashboard Widgets

Recommended cards:

```text
Total Balance
24h P&L
Total P&L
Available
Locked
```

---

# 77. Quick Actions

At the top:

```text
[Deposit]
[Withdraw]
[Transfer]
[Trade]
```

---

# 78. Recent Activity

Wallet dashboard should display the latest 5–10 transactions:

```text
Recent Activity

Deposit       +$1,000.00
Trade          -$250.00
P2P            +$500.00
Withdrawal     -$100.00
```

CTA:

```text
View All
```

---

# 79. Portfolio Allocation Visualization

Use:

```text
Donut / Pie
```

with accessible labels.

Do not depend solely on color.

Each segment should have:

```text
Asset
Percentage
USD Value
```

---

# 80. Portfolio Chart

Use the existing charting approach.

Avoid introducing another charting library.

Possible:

```text
lightweight-charts
```

or a lightweight SVG implementation if sufficient.

---

# 81. Wallet API Contract

The mock API should resemble the future API.

Example:

```text
GET /api/wallet
GET /api/wallet/balances
GET /api/wallet/portfolio
GET /api/wallet/transactions
GET /api/wallet/transactions/:id

POST /api/wallet/deposit
POST /api/wallet/withdraw
POST /api/wallet/transfer
```

The UI can initially call provider abstractions rather than directly depending on HTTP.

---

# 82. WebSocket Preparation

Wallet can eventually receive:

```text
balance.updated
portfolio.updated
transaction.updated
deposit.updated
withdrawal.updated
```

Example:

```text
WebSocket
    ↓
balance.updated
    ↓
wallet-store
    ↓
React UI
```

Do not poll excessively.

---

# 83. Realtime Balance Updates

When a trade completes:

```text
Trade Engine
      ↓
Balance Event
      ↓
Wallet
      ↓
UI
```

The Wallet should update without requiring a full page refresh.

---

# 84. P2P Balance Updates

When P2P escrow changes:

```text
P2P Engine
    ↓
Balance Event
    ↓
Wallet
```

Example:

```text
USDT Available
1000 → 800

USDT Locked
0 → 200
```

---

# 85. Transaction Filtering

Support:

```text
Asset
Type
Status
Date
```

Date filters:

```text
7 Days
30 Days
90 Days
Custom
```

---

# 86. Transaction Search

Search by:

```text
transaction ID
asset
type
```

---

# 87. Pagination

Do not render thousands of transactions.

Use:

```text
pagination
```

or:

```text
cursor-based loading
```

Future API should support cursor pagination.

---

# 88. Export

Add:

```text
Export CSV
```

for transaction history.

CSV columns:

```text
Transaction ID
Date
Type
Asset
Amount
Fee
Status
Reference
```

For current mock mode, client-side export is acceptable.

---

# 89. Accessibility

Must support:

* keyboard navigation
* visible focus
* screen-reader labels
* semantic tables
* proper dialog semantics
* accessible charts
* accessible tooltips
* sufficient contrast
* reduced motion

---

# 90. Performance

Targets:

```text
Fast initial wallet render
Minimal JavaScript
Lazy-load charts
Virtualize long transaction lists if needed
Memoize expensive calculations
Avoid unnecessary Zustand rerenders
```

---

# 91. SEO

Private wallet pages should normally be:

```text
noindex
```

because balances and private account information are not public content.

Set appropriate metadata.

---

# 92. Security Headers

Continue existing application-level security:

```text
CSP
HSTS
X-Content-Type-Options
Referrer-Policy
Frame protections
```

---

# 93. Data Privacy

Never expose:

```text
private wallet information
```

through public server responses.

Ensure:

```text
user A
```

cannot access:

```text
user B
```

wallet data.

---

# 94. Mock Data Requirements

Mock wallet data should be realistic.

Example starting state:

```text
USD      $10,000.00
BTC      0.000000
ETH      0.000000
USDT     0.000000
USDC     0.000000
SOL      0.000000
```

Trading can then change these balances.

---

# 95. Example Trading Integration

User starts with:

```text
USD
$10,000
```

Places:

```text
BUY BTC
$2,000
```

After order reservation:

```text
USD Available
$8,000

USD Locked
$2,000
```

After fill:

```text
USD Locked
$0

BTC Balance
increases
```

Wallet must reflect this.

---

# 96. Example P2P Integration

Seller:

```text
100 USDT
```

P2P trade begins:

```text
Available
0 USDT

Locked
100 USDT
```

Trade completes:

```text
Seller
-100 USDT

Buyer
+100 USDT
```

Both wallet states update.

---

# 97. Core Domain Events

Create event names:

```text
wallet.balance.updated
wallet.deposit.created
wallet.deposit.completed
wallet.withdrawal.created
wallet.withdrawal.completed
wallet.withdrawal.failed
wallet.transfer.completed

trade.balance.reserved
trade.balance.released
trade.balance.settled

p2p.escrow.locked
p2p.escrow.released
```

---

# 98. Audit Events

Sensitive wallet operations should generate audit events:

```text
DEPOSIT_CREATED
WITHDRAWAL_CREATED
WITHDRAWAL_CANCELLED
TRANSFER_CREATED
DEMO_ACCOUNT_RESET
```

---

# 99. Logging

Never log:

```text
private keys
passwords
2FA secrets
full wallet addresses where unnecessary
sensitive personal information
```

Log:

```text
requestId
transactionId
userId
operation
status
timestamp
```

---

# 100. Testing Requirements

## Unit Tests

Test:

* balance calculations
* available + locked
* USD valuation
* portfolio percentages
* fees
* withdrawal amount
* transaction filters
* decimal precision
* transaction states

---

# 101. Integration Tests

Test:

```text
Wallet → Trade
Wallet → P2P
Wallet → Authentication
Wallet → Transaction History
```

---

# 102. Critical Financial Tests

### Test 1

User has:

```text
$100
```

Attempts:

```text
$101 withdrawal
```

Expected:

```text
REJECTED
```

### Test 2

User has:

```text
$100 available
$50 locked
```

Total:

```text
$150
```

Withdrawal of:

```text
$110
```

Expected:

```text
REJECTED
```

because available is only `$100`.

---

# 103. Concurrency Tests

Two simultaneous withdrawals:

```text
$100
$100
```

Available:

```text
$150
```

Only one or a safe combination may succeed.

The system must never produce:

```text
-$50
```

balance.

---

# 104. Idempotency Test

Send:

```text
POST deposit
Idempotency-Key: ABC123
```

twice.

Expected:

```text
one financial effect
one transaction
```

---

# 105. P2P Escrow Test

```text
100 USDT available
```

Lock:

```text
100 USDT
```

Expected:

```text
available = 0
locked = 100
```

Release:

```text
available = 100
locked = 0
```

or settlement to another user.

---

# 106. Trade Settlement Test

Ensure a completed trade produces:

```text
buyer asset increase
buyer quote decrease
seller asset decrease
seller quote increase
```

plus fees where applicable.

---

# 107. UI E2E Tests

Playwright flows:

```text
Login
→ Wallet

Wallet
→ Deposit

Deposit
→ Confirm

Wallet
→ Withdraw

Withdraw
→ Confirm

Wallet
→ History

Wallet
→ Trade

Trade
→ Place Order

Trade
→ Wallet
```

---

# 108. Mobile Testing

Test at minimum:

```text
320px
375px
390px
430px
768px
1024px
1280px+
```

---

# 109. Browser Testing

Test:

```text
Chrome
Firefox
Safari
Edge
```

---

# 110. Error Recovery

If provider fails:

```text
Unable to load wallet data.

[Retry]
```

Never leave the UI showing stale data as if it were current without indicating the state.

---

# 111. Offline / Network Failure

If network disconnects:

```text
Connection lost

Wallet data may be outdated.
```

When connection returns:

```text
refresh wallet
```

---

# 112. Component Architecture

Recommended:

```text
components/
  wallet/
    WalletHeader.tsx
    WalletSummary.tsx
    WalletActions.tsx
    AssetTable.tsx
    AssetRow.tsx
    AssetCard.tsx
    PortfolioAllocation.tsx
    PortfolioPerformance.tsx
    RecentActivity.tsx
    TransactionTable.tsx
    TransactionFilters.tsx
    TransactionDetails.tsx
    DepositForm.tsx
    WithdrawForm.tsx
    TransferForm.tsx
    WalletModeBadge.tsx
```

---

# 113. Route Architecture

Recommended:

```text
app/
  wallet/
    page.tsx
    deposit/
      page.tsx
    withdraw/
      page.tsx
    history/
      page.tsx
```

---

# 114. Domain Architecture

Recommended:

```text
lib/
  wallet/
    types.ts
    provider.ts
    mock-wallet-provider.ts
    wallet-store.ts
    wallet-utils.ts

  portfolio/
    types.ts
    portfolio-provider.ts
    portfolio-utils.ts

  ledger/
    types.ts
    ledger-utils.ts
```

---

# 115. Shared Types

Do not create separate types for:

```text
trade balance
wallet balance
P2P balance
```

Use shared financial primitives.

---

# 116. Data Flow

The intended architecture becomes:

```text
                 ETHSLTD ACCOUNT
                       │
                       ▼
                  ACCOUNT STATE
                       │
                       ▼
                    WALLET
                       │
          ┌────────────┼────────────┐
          ▼            ▼            ▼
        TRADE          P2P        TRANSFERS
          │            │            │
          └────────────┼────────────┘
                       ▼
                    LEDGER
                       │
                       ▼
                  BALANCE STATE
                       │
                       ▼
                  PORTFOLIO
```

---

# 117. Relationship With Existing Pages

After implementation:

```text
/
├── Home
│
├── /markets
│     └── Market discovery
│
├── /trade
│     └── Demo trading
│
├── /p2p
│     └── P2P marketplace
│
├── /wallet
│     └── Portfolio + balances
│
├── /wallet/deposit
├── /wallet/withdraw
├── /wallet/history
│
└── /account
      ├── profile
      ├── security
      ├── sessions
      └── preferences
```

This is consistent with everything already built.

---

# 118. Navigation Relationship

### Markets

User discovers:

```text
BTC/USDT
```

↓

### Trade

User trades:

```text
BTC
```

↓

### Wallet

User sees:

```text
BTC balance
USD value
```

↓

### P2P

User can use:

```text
BTC / USDT / USDC
```

↓

### Wallet

Updated balance appears.

This creates a coherent product loop.

---

# 119. USD-First Product Rules

The following are mandatory:

```text
DEFAULT_FIAT = USD
DEFAULT_CURRENCY_SYMBOL = $
DEFAULT_DEMO_BALANCE = 10000
DEFAULT_LOCALE = en-US
```

Use USD for:

* portfolio valuation
* asset prices
* trade totals
* fees
* wallet values
* deposit examples
* withdrawal examples
* P&L
* charts
* statistics
* transaction examples

---

# 120. Localization Architecture

Although USD is the default, keep:

```ts
currency
locale
```

configurable.

Example:

```ts
currency: "USD"
locale: "en-US"
```

Do not hard-code `$` throughout components.

Use a central formatter:

```text
formatCurrency()
```

---

# 121. Fee Engine Compatibility

Wallet fees must eventually use:

```text
FeeProvider
```

rather than hardcoded values.

Concept:

```text
FeeProvider
   ↓
Deposit Fee
Withdrawal Fee
Trading Fee
P2P Fee
```

---

# 122. Risk Engine Compatibility

Wallet should be ready to receive:

```text
withdrawal risk status
```

such as:

```text
NORMAL
REVIEW
BLOCKED
```

Current demo mode:

```text
NORMAL
```

---

# 123. Account Restrictions

If the account is restricted:

```text
Withdrawals unavailable

Your account currently cannot perform withdrawals.
```

Do not simply hide the button.

Explain the state appropriately.

---

# 124. Security Confirmation

For future live mode:

```text
Withdrawal
   ↓
Password
   ↓
2FA
   ↓
Email confirmation
   ↓
Risk check
   ↓
Processing
```

The provider abstraction should allow these steps later.

---

# 125. Admin Compatibility

The wallet domain should eventually support an Admin view:

```text
User
↓
Wallet
↓
Balances
↓
Transactions
↓
Risk
↓
Audit
```

Do not build the admin wallet page as part of this PRD unless needed for debugging.

---

# 126. Admin Data Requirements

Future admin system needs:

```text
userId
accountId
asset
available
locked
total
transactionCount
lastActivity
riskStatus
```

---

# 127. Reconciliation Preparation

The system should be designed so later we can compare:

```text
Ledger balance
        vs
Wallet balance
        vs
External custody balance
```

This is critical for real-money production.

---

# 128. Backup Compatibility

Wallet data must be persisted through the future database abstraction.

Do not make `localStorage` the permanent financial source of truth.

Current:

```text
localStorage
+
Zustand
+
Mock Provider
```

Future:

```text
D1/Postgres
+
Ledger
+
API
+
WebSocket
```

---

# 129. Critical Rule for localStorage

Never treat localStorage as authoritative financial state in production.

For this simulated version it is acceptable for persistence, but the abstraction must make replacing it straightforward.

---

# 130. Acceptance Criteria

The PRD is complete when all of the following are true.

### Wallet

* [ ] `/wallet` exists.
* [ ] Wallet requires authentication.
* [ ] Demo Trading mode is clearly displayed.
* [ ] Total portfolio value is displayed in USD.
* [ ] Available and locked balances are displayed.
* [ ] Asset table works.
* [ ] Asset search works.
* [ ] Zero-balance filter works.
* [ ] Portfolio allocation works.
* [ ] Portfolio performance works.
* [ ] Recent activity works.

### Deposit

* [ ] `/wallet/deposit` exists.
* [ ] USD is default.
* [ ] Asset selection works.
* [ ] Amount validation works.
* [ ] Confirmation works.
* [ ] Simulated deposit works.
* [ ] Transaction is created.
* [ ] Wallet updates.

### Withdrawal

* [ ] `/wallet/withdraw` exists.
* [ ] Asset selection works.
* [ ] Network selection exists for crypto.
* [ ] Destination validation works.
* [ ] Balance validation works.
* [ ] Fee calculation works.
* [ ] Confirmation works.
* [ ] Transaction is created.
* [ ] Wallet updates.
* [ ] Insufficient balance is rejected.

### History

* [ ] `/wallet/history` exists.
* [ ] Transactions render.
* [ ] Filtering works.
* [ ] Searching works.
* [ ] Pagination works.
* [ ] Transaction details work.
* [ ] CSV export works.

### Integration

* [ ] Trade balances integrate with Wallet.
* [ ] P2P balances integrate with Wallet.
* [ ] Locked balances are represented correctly.
* [ ] Theme system remains consistent.
* [ ] Header/Footer remain consistent.
* [ ] Mobile layout works.
* [ ] Existing `/trade`, `/markets`, `/p2p` functionality is not broken.

---

# 131. Definition of Done

The implementation should **not** be considered complete merely because the screens visually exist.

It is complete only when:

```text
UI
+
State
+
Mock Provider
+
Validation
+
Financial calculations
+
Transaction state
+
Trade integration
+
P2P integration
+
Persistence
+
Responsive design
+
Accessibility
+
Tests
```

all work together.

---

# 132. Important Scope Boundary

This PRD builds the **Wallet & Portfolio experience and its demo/simulation financial domain**.

It must **not falsely implement real-money custody**.

The current architecture should remain:

```text
ETHSLTD
   ↓
Demo Trading
   ↓
Simulated Wallet
   ↓
Simulated Transactions
```

while being structured for:

```text
ETHSLTD
   ↓
Live Trading
   ↓
Real Wallet
   ↓
Real Custody / Payment Infrastructure
```

later.

---

# 133. Final Expected User Journey

After this PRD is implemented, the complete user journey becomes:

```text
Homepage
   ↓
Markets
   ↓
Select BTC/USDT
   ↓
Trade
   ↓
Place Demo Order
   ↓
Order Filled
   ↓
Wallet Balance Updated
   ↓
Portfolio Value Updated
   ↓
Transaction Created
   ↓
P2P
   ↓
P2P Escrow
   ↓
Wallet Balance Updated
   ↓
Transaction History
```

That creates the first coherent **financial account layer** across the ETHSLTD application.

---

# 134. Final Architecture After This PRD

```text
                         ETHSLTD
                            │
             ┌──────────────┼──────────────┐
             │              │              │
             ▼              ▼              ▼
          Markets         Trade           P2P
             │              │              │
             └──────────────┼──────────────┘
                            ▼
                         Wallet
                            │
             ┌──────────────┼──────────────┐
             ▼              ▼              ▼
        Portfolio       Balances       Transactions
             │              │              │
             └──────────────┼──────────────┘
                            ▼
                         Ledger
                            │
                            ▼
                     Future Live Backend
```

## Recommended implementation filename

```text
ETHSLTD-WALLET-PORTFOLIO-DEPOSIT-WITHDRAWAL-PRD-USD.md
```

This is the PRD I would give directly to the developer/AI coding agent as the **next implementation specification**, without changing the existing Next.js 15 + TypeScript + Tailwind v4 + Zustand + Zod + React Hook Form + Lightweight Charts + Mock Provider architecture.
