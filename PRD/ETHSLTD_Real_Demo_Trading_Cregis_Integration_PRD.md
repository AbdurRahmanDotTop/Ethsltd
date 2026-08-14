Yes. I reviewed the current Cregis developer documentation you provided. Cregis separates **WaaS** wallet infrastructure from **Payment Engine** payment collection; the WaaS documentation specifically describes deposit/payout flows, callbacks, idempotency, and signature verification. ([Cregis Developer Center][1])

**Important security point:** the message contains live-looking API keys and account passwords. I will **not reproduce those credentials in the PRD**. They should be treated as compromised, rotated/revoked, and stored only in encrypted server-side secrets. In the PRD below they are represented as environment-secret placeholders.

[Cregis Developer Documentation](https://developers.cregis.com/en/introduction/?utm_source=chatgpt.com)
[Cregis WaaS Business Flow](https://developers.cregis.com/en/waas-business-flow/?utm_source=chatgpt.com)
[Cregis WaaS API Reference](https://developers.cregis.com/en/reference/waas-api/?utm_source=chatgpt.com)
[Cregis Payment Engine Business Flow](https://developers.cregis.com/en/payment-engine-business-flow/?utm_source=chatgpt.com)

# ETHSLTD Production Trading Platform

## Complete Real-Money & Demo-Money Separated Trading System

**Document Type:** Production-Ready Product Requirements Document
**Product:** ETHSLTD Trading Platform
**Platforms:** Web + Android + iOS + Admin Portal
**Architecture:** Modular Monorepo + Event-Driven Trading Architecture
**Primary Infrastructure:** Cloudflare
**Payment Infrastructure:** Cregis + Direct Bank Transfer
**Trading Modes:** REAL + DEMO
**Critical Requirement:** REAL and DEMO must be completely isolated.

---

# 1. Executive Summary

ETHSLTD will provide a production-ready trading platform where users can trade through two completely separate environments:

### REAL MODE

REAL mode handles actual customer funds and actual financial transactions.

REAL mode must use:

* Real wallet
* Real ledger
* Real deposits
* Cregis integration
* Direct bank transfer
* Real withdrawals
* Real trading
* Real orders
* Real trades
* Real P&L
* Real fees
* Real transaction history
* Real compliance controls
* Real audit logs

### DEMO MODE

DEMO mode is a completely virtual trading environment.

DEMO mode must use:

* Demo wallet
* Demo balance
* Demo ledger
* Demo orders
* Demo trades
* Demo P&L
* Demo fees
* Demo transaction history
* Demo positions
* Demo order book/trading simulation where applicable

Demo users can generate/add virtual demo funds according to the configured demo-balance policy.

### Absolute Separation Rule

There must be **no financial or database mixing between REAL and DEMO**.

A Demo balance must never become real money.

A Real balance must never be used as Demo balance.

A Demo trade must never affect a Real position.

A Real deposit must never credit Demo balance.

A Demo withdrawal must never send real funds.

---

# 2. Core Product Principle

The user experience should be almost identical between REAL and DEMO so that a user can learn and practice using Demo and later switch to Real without learning a different trading interface.

The internal financial systems, however, must be completely different.

### User Experience

```text
                 ETHSLTD
                    |
          +---------+---------+
          |                   |
       REAL MODE          DEMO MODE
          |                   |
    Real Trading         Demo Trading
          |                   |
    Real Wallet          Demo Wallet
          |                   |
   Real Ledger           Demo Ledger
          |                   |
 Real Money Movement   Virtual Money
```

---

# 3. Non-Negotiable Separation Requirements

The application must treat `REAL` and `DEMO` as separate financial domains.

Every relevant entity must contain a mode/environment identifier.

Example:

```text
environment = REAL
environment = DEMO
```

or preferably separate domain/account identifiers that make accidental cross-mode operations impossible.

Required entities include:

* Trading Account
* Wallet
* Balance
* Ledger
* Order
* Trade
* Position
* Transaction
* Deposit
* Withdrawal
* Fee
* P&L
* Funding
* P2P transaction
* Contract
* Notification
* Audit event

---

# 4. REAL MODE

## 4.1 Real Trading Account

Each verified user can have a Real Trading Account.

Example:

```text
User
  └── Real Trading Account
        ├── Real Wallet
        ├── Real Ledger
        ├── Real Orders
        ├── Real Trades
        ├── Real Positions
        ├── Real Transactions
        └── Real P&L
```

Real accounts must be subject to:

* KYC requirements
* AML/risk checks
* Deposit controls
* Withdrawal controls
* Trading risk controls
* Account restrictions
* Compliance review
* Audit logging

---

# 5. REAL WALLET

The Real Wallet represents actual customer funds.

Wallet balance:

```text
available_balance
locked_balance
total_balance
```

Formula:

```text
total_balance =
available_balance + locked_balance
```

Real wallet balances may only be changed by authorized financial events.

Examples:

```text
Cregis Deposit
Bank Transfer Deposit
Approved Internal Transfer
Trade Settlement
Trading Fee
Withdrawal
Refund
Admin-approved Adjustment
```

No frontend API may directly modify the Real balance.

---

# 6. REAL DEPOSIT METHODS

Real deposits must support at minimum:

## 6.1 Cregis

Cregis integration should be implemented server-side.

Cregis documentation currently describes WaaS capabilities including deposits, payouts, transaction queries and webhook callbacks. The documentation also specifically requires callback signature verification and idempotent processing using identifiers such as `cid`/`txid`. ([Cregis Developer Center][2])

The application must therefore implement:

```text
User
 ↓
Real Wallet
 ↓
Deposit
 ↓
Cregis
 ↓
Cregis Processing
 ↓
Webhook
 ↓
Signature Verification
 ↓
Idempotency Check
 ↓
Deposit Confirmation
 ↓
Real Ledger
 ↓
Real Wallet Credit
```

### Cregis Requirements

The backend must:

1. Create a unique internal deposit record.
2. Generate a unique merchant/reference identifier.
3. Create the appropriate Cregis request.
4. Never expose Cregis secrets to the browser.
5. Validate Cregis responses.
6. Validate webhook signatures.
7. Verify transaction status.
8. Check idempotency.
9. Persist the Cregis transaction identifiers.
10. Credit the Real ledger only after successful verification.
11. Reconcile Cregis transactions periodically.
12. Record every state transition.

### Cregis Statuses

Internal status model:

```text
CREATED
PENDING
PROCESSING
CONFIRMED
FAILED
CANCELLED
EXPIRED
REVERSED
MANUAL_REVIEW
```

Only an authorized successful state may credit the Real wallet.

---

# 7. CREGIS SECRET MANAGEMENT

Credentials must NEVER be:

* Hardcoded in frontend code
* Committed to Git
* Stored in `.env` committed to source control
* Sent to mobile applications
* Included in API responses
* Included in logs
* Included in PRDs
* Included in screenshots
* Stored in client-side localStorage

Recommended production configuration:

```text
CREGIS_BASE_URL
CREGIS_WAAS_API_KEY
CREGIS_WAAS_PROJECT_ID
CREGIS_PAYMENT_ENGINE_PROJECT_ID
CREGIS_PAYMENT_ENGINE_API_KEY
CREGIS_WEBHOOK_SECRET
```

All secrets must be stored in a server-side encrypted secret manager.

The credentials supplied in the project specification should be **rotated before production deployment**.

---

# 8. CREGIS WEBHOOK PROCESSING

Webhook processing is a critical financial operation.

Flow:

```text
Cregis
   ↓
POST /webhooks/cregis/*
   ↓
Validate HTTPS
   ↓
Validate Signature
   ↓
Validate Timestamp/Replay Protection
   ↓
Parse Event
   ↓
Check Event ID / cid / txid
   ↓
Idempotency Check
   ↓
Validate Amount
   ↓
Validate Asset
   ↓
Validate Destination/User Mapping
   ↓
Create Ledger Entry
   ↓
Update Real Wallet
   ↓
Create Audit Event
   ↓
Return success
```

The Cregis documentation explicitly emphasizes signature verification and idempotent processing for deposit callbacks. ([Cregis Developer Center][2])

The webhook endpoint must be safe against duplicate callbacks.

Example:

```text
Webhook received twice
        ↓
Same event identifier
        ↓
Second event detected as duplicate
        ↓
No second wallet credit
```

---

# 9. DIRECT BANK TRANSFER

Real users must also be able to fund their Real Wallet through Direct Bank Transfer.

Flow:

```text
User
 ↓
Real Wallet
 ↓
Deposit
 ↓
Direct Bank Transfer
 ↓
Display Company Bank Details
 ↓
User Transfers Money
 ↓
User Enters Reference/UTR
 ↓
Upload Proof if Required
 ↓
Deposit = PENDING
 ↓
Finance/Admin Review
 ↓
Approved
 ↓
Real Ledger Credit
 ↓
Real Wallet Updated
```

## Bank Transfer Fields

```text
deposit_id
user_id
amount
currency
bank_reference
UTR/reference_number
proof_document
submitted_at
reviewed_at
reviewed_by
status
rejection_reason
```

## Status

```text
PENDING
UNDER_REVIEW
APPROVED
REJECTED
CANCELLED
```

Only `APPROVED` transactions may credit the Real wallet.

---

# 10. REAL WITHDRAWALS

Real withdrawals must never use the Demo system.

Potential flow:

```text
User
 ↓
Real Wallet
 ↓
Withdraw
 ↓
Security Verification
 ↓
Risk Check
 ↓
Compliance Check
 ↓
Withdrawal Review
 ↓
Ledger Lock
 ↓
Cregis / Approved Payout Rail
 ↓
Provider Confirmation
 ↓
Real Wallet Settlement
```

Cregis WaaS currently exposes payout-related APIs and payout notification mechanisms. ([Cregis Developer Center][3])

Withdrawal must support:

* Withdrawal address/account
* Asset
* Amount
* Network where applicable
* Fee
* Risk check
* 2FA
* OTP where configured
* Address validation
* Velocity limits
* Daily limits
* Manual review
* Transaction tracking
* Audit trail

---

# 11. REAL TRADING

Real mode must use the production trading engine.

Supported functionality should include:

* Market orders
* Limit orders
* Stop orders
* Stop-limit orders
* IOC
* FOK
* GTC
* GTD
* Post Only
* Reduce Only
* OCO
* Trailing Stop
* Bracket Orders where supported

Order lifecycle:

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

Failure states:

```text
REJECTED
EXPIRED
CANCELLED
FAILED
```

---

# 12. REAL LEDGER

The Real financial ledger must be immutable and double-entry.

Example:

```text
Deposit:
Debit  = Customer Asset Account
Credit = Customer Real Wallet Account
```

Trading settlement:

```text
Asset A Account
Asset B Account
Fee Account
```

Every financial event requires:

```text
ledger_id
transaction_id
request_id
idempotency_key
timestamp
amount
asset
debit_account
credit_account
reference_type
reference_id
```

Ledger records must never be deleted.

Corrections must be represented by reversal/adjustment entries.

---

# 13. DEMO MODE

Demo mode is an entirely virtual financial environment.

Example:

```text
User
  └── Demo Trading Account
        ├── Demo Wallet
        ├── Demo Ledger
        ├── Demo Orders
        ├── Demo Trades
        ├── Demo Positions
        └── Demo P&L
```

Demo mode does not use:

* Cregis
* Bank transfer
* Real withdrawal
* Real wallet
* Real ledger
* Real financial settlement

---

# 14. DEMO BALANCE

The user must be able to add Demo Balance directly.

Example:

```text
Demo Wallet
     ↓
Add Demo Balance
     ↓
Enter Amount
     ↓
Confirm
     ↓
Demo Balance Immediately Credited
```

Example:

```text
Current Demo Balance:
$10,000

User selects:
Add Demo Balance

Amount:
$100,000

Result:
Demo Balance = $110,000
```

The amount should be controlled by configurable business rules.

Possible settings:

```text
minimum_demo_topup
maximum_demo_topup
daily_demo_topup_limit
unlimited_demo_topup
allowed_demo_assets
```

If the business chooses unlimited Demo Balance, the backend may permit arbitrary configured amounts subject to safe numeric limits.

---

# 15. DEMO WALLET

Demo Wallet fields:

```text
available_balance
locked_balance
total_balance
```

But all values are virtual.

Demo wallet must have a separate ledger namespace/table/account.

Example:

```text
REAL:
wallet_environment = REAL

DEMO:
wallet_environment = DEMO
```

---

# 16. DEMO LEDGER

Demo ledger should still behave like a real accounting ledger from a software perspective.

This allows the Demo environment to accurately simulate:

* Deposits
* Trades
* Fees
* Locked balances
* Releases
* P&L
* Transfers between demo accounts where supported

But the Demo ledger has no monetary value.

Example:

```text
DEMO_TOPUP
DEMO_TRADE
DEMO_FEE
DEMO_REFUND
DEMO_ADJUSTMENT
```

---

# 17. DEMO TRADING ENGINE

Demo trading should provide the same trading experience as Real.

The user should see:

* Markets
* Charts
* Order book
* Buy
* Sell
* Open orders
* Order history
* Positions
* Trade history
* P&L
* Fees
* Balance
* Market depth

The order API should be structurally similar to Real, but the execution domain must be Demo.

Example:

```text
POST /api/demo/orders
```

must never route to:

```text
POST /api/real/orders
```

---

# 18. REAL/DEMO API SEPARATION

Recommended API design:

```text
/api/v1/real/*
/api/v1/demo/*
```

Examples:

```text
/api/v1/real/wallet
/api/v1/real/deposits
/api/v1/real/withdrawals
/api/v1/real/orders
/api/v1/real/trades
/api/v1/real/positions

/api/v1/demo/wallet
/api/v1/demo/balance
/api/v1/demo/orders
/api/v1/demo/trades
/api/v1/demo/positions
```

This makes accidental cross-environment calls much harder.

---

# 19. REAL/DEMO DATABASE DESIGN

Every financial table must contain a strict environment/domain identifier.

Recommended:

```text
environment
```

Values:

```text
REAL
DEMO
```

Example:

```text
wallets
---------
id
user_id
environment
asset
available
locked
total
created_at
updated_at
```

Recommended unique constraint:

```text
UNIQUE(user_id, environment, asset)
```

Orders:

```text
orders
---------
id
user_id
environment
market
side
type
price
quantity
status
```

Trades:

```text
trades
---------
id
environment
order_id
buyer_user_id
seller_user_id
price
quantity
fee
timestamp
```

Ledger:

```text
ledger_entries
---------
id
environment
transaction_id
account_id
asset
amount
direction
reference_type
reference_id
created_at
```

---

# 20. DATABASE SAFETY

Application-level filtering is not sufficient.

Bad:

```sql
SELECT * FROM wallets
WHERE user_id = ?
```

Better:

```sql
SELECT * FROM wallets
WHERE user_id = ?
AND environment = ?
```

Every financial query must explicitly identify its environment.

The service layer should also prevent:

```text
REAL → DEMO
DEMO → REAL
```

transfers.

---

# 21. SERVICE SEPARATION

Recommended services:

```text
Authentication Service
User Service
KYC Service
Real Wallet Service
Demo Wallet Service
Real Ledger Service
Demo Ledger Service
Real Trading Service
Demo Trading Service
Order Service
Matching Engine
Market Data Service
Cregis Service
Bank Transfer Service
Withdrawal Service
Risk Service
Compliance Service
Notification Service
Audit Service
Admin Service
```

Cregis must only be accessible from the Real financial domain.

---

# 22. CREGIS SERVICE BOUNDARY

Cregis integration should be isolated:

```text
services/
  cregis/
    client.ts
    auth.ts
    signatures.ts
    deposits.ts
    payouts.ts
    webhooks.ts
    reconciliation.ts
```

Demo services must have **no dependency on the Cregis service**.

This is important.

Do not implement:

```text
DemoDepositService → CregisService
```

Implement:

```text
RealDepositService → CregisService

DemoBalanceService → DemoLedgerService
```

---

# 23. DEMO BALANCE SERVICE

Demo top-up should be:

```text
POST /api/v1/demo/balance/topup
```

Request:

```json
{
  "asset": "USDT",
  "amount": "100000"
}
```

Backend:

```text
Authenticate user
 ↓
Verify Demo account
 ↓
Validate amount
 ↓
Check Demo limits
 ↓
Create Demo transaction
 ↓
Create Demo ledger entry
 ↓
Update Demo wallet
 ↓
Return updated Demo balance
```

No payment gateway is involved.

---

# 24. REAL DEPOSIT SERVICE

Real deposit:

```text
POST /api/v1/real/deposits
```

Flow:

```text
Authenticate
 ↓
Verify account status
 ↓
Check KYC/compliance requirements
 ↓
Create deposit
 ↓
Create Cregis payment/deposit request
 ↓
Return payment/deposit instructions
 ↓
Wait for verified provider callback
 ↓
Verify callback
 ↓
Idempotency check
 ↓
Ledger transaction
 ↓
Credit Real wallet
```

---

# 25. MODE SWITCHING

Users should have an obvious mode selector.

Example:

```text
[ REAL ] [ DEMO ]
```

When user switches:

```text
REAL
```

the entire financial context becomes Real.

When user switches:

```text
DEMO
```

the entire financial context becomes Demo.

The mode must be sent to backend APIs and validated server-side.

Never trust only a frontend variable.

Bad:

```javascript
localStorage.mode = "REAL"
```

The backend must independently determine whether the requested account/environment is authorized.

---

# 26. UI REQUIREMENTS

The interface should be almost identical.

### REAL

```text
REAL TRADING

Wallet:
$12,450.00

Deposit
Withdraw
Trade
```

### DEMO

```text
DEMO TRADING

Demo Balance:
$100,000.00

Add Demo Balance
Reset Demo Account
Trade
```

The UI must clearly show:

```text
REAL
```

or

```text
DEMO
```

at all times.

---

# 27. REAL WALLET UI

Real Wallet:

```text
Total Balance
Available Balance
Locked Balance

Deposit
Withdraw
Transfer
Transaction History
```

Deposit options:

```text
Cregis
Direct Bank Transfer
```

Only available Real funding methods should be shown.

---

# 28. DEMO WALLET UI

Demo Wallet:

```text
Demo Balance
Available
Locked

Add Demo Balance
Reset Demo Account
Demo Transaction History
```

There must be no:

```text
Cregis
Bank Transfer
Real Withdrawal
```

inside Demo Wallet.

---

# 29. DEMO RESET

Optional Demo feature:

```text
Reset Demo Account
```

Example:

```text
Reset Demo Account
        ↓
Confirmation
        ↓
Cancel all Demo orders
Close Demo positions
Reset Demo wallet
Reset Demo ledger
        ↓
Create configured starting balance
```

This operation must never touch Real data.

---

# 30. MARKET DATA

Both environments can display the same market data where appropriate.

For example:

```text
BTC/USDT
ETH/USDT
```

The market price may be shared.

However:

```text
REAL execution
```

and

```text
DEMO execution
```

must remain separate.

If external market data is used:

```text
Market Data
     ↓
REAL Trading Engine
     ↓
Real Orders
```

and independently:

```text
Market Data
     ↓
DEMO Trading Engine
     ↓
Demo Orders
```

---

# 31. DEMO EXECUTION MODES

The platform should support configurable Demo execution.

### Mode A — Simulated Internal Matching

Demo orders are matched using the platform's simulated order book.

### Mode B — Market Price Simulation

Demo orders execute against configured market prices.

### Mode C — Real Market Data + Virtual Execution

Market prices come from the same market-data stream, but no real funds are involved.

Recommended architecture:

```text
Real Market Data
       |
       +----------> Real Engine
       |
       +----------> Demo Engine
```

Both engines remain independent.

---

# 32. REAL FEES

Real trading fees must use the actual production fee configuration.

Example:

```text
maker_fee
taker_fee
withdrawal_fee
deposit_fee
network_fee
```

Fees must be recorded in the Real ledger.

---

# 33. DEMO FEES

Demo fees should simulate the Real fee schedule where appropriate.

Example:

```text
Demo trade:
100 USDT

Simulated fee:
0.1 USDT

Demo ledger:
-0.1 USDT
```

The fee is virtual.

Changing Demo fee configuration must not modify Real fee configuration.

---

# 34. REAL P&L

Real P&L is based on actual trading activity.

Must support:

```text
Realized P&L
Unrealized P&L
Trading fees
Funding costs where applicable
Position value
Average entry
Mark price
```

---

# 35. DEMO P&L

Demo P&L uses exactly the same calculation methodology wherever possible.

But all values remain virtual.

This is important because Demo should realistically teach users how the Real platform behaves.

---

# 36. ORDERS

Real:

```text
environment = REAL
```

Demo:

```text
environment = DEMO
```

Every order query must filter by environment.

A Demo user viewing orders must never receive Real orders.

A Real user viewing orders must never receive Demo orders.

---

# 37. POSITIONS

Positions must also be separated.

Example:

```text
real_positions
demo_positions
```

or:

```text
positions.environment
```

Recommended logical separation:

```text
REAL:
BTC Position = +0.5 BTC

DEMO:
BTC Position = +10 BTC
```

These must be completely independent.

---

# 38. P2P TRADING

If P2P trading is included, it must also be separated.

### Real P2P

```text
Real Wallet
 ↓
Real Escrow
 ↓
Real P2P Trade
 ↓
Real Settlement
```

### Demo P2P

```text
Demo Wallet
 ↓
Demo Escrow
 ↓
Demo P2P Trade
 ↓
Demo Settlement
```

Demo P2P must never lock Real funds.

Real P2P must never use Demo balances.

---

# 39. ESCROW

Real escrow must use real ledger entries.

Demo escrow must use demo ledger entries.

Example:

```text
REAL_ESCROW_ACCOUNT
DEMO_ESCROW_ACCOUNT
```

These accounts must be impossible to cross-reference during normal application execution.

---

# 40. CONTRACTS

If contracts are included:

### Real

```text
Real Contract
Real Transaction
Real Financial Obligation
Real Audit Trail
```

### Demo

```text
Demo Contract
Demo Transaction
Demo Financial Simulation
Demo Audit Trail
```

Demo contracts must be clearly marked:

```text
DEMO / SIMULATION
```

and must not create real financial obligations.

---

# 41. NOTIFICATIONS

Notifications must carry environment context.

Example:

```text
REAL:
Your Real Wallet was credited with 500 USDT.

DEMO:
Your Demo Wallet was credited with 100,000 USDT.
```

Never send a Demo notification saying:

```text
Your account received real funds.
```

---

# 42. EMAIL/SMS/PUSH

Real:

```text
Real deposit successful
Real withdrawal requested
Real trade executed
Real security alert
```

Demo:

```text
Demo balance added
Demo trade executed
Demo order filled
```

Templates should have separate identifiers:

```text
REAL_DEPOSIT_SUCCESS
DEMO_BALANCE_ADDED
REAL_WITHDRAWAL_REQUESTED
DEMO_ORDER_FILLED
```

---

# 43. ADMIN PANEL

Admin must have separate dashboards.

## Real Finance

```text
Real Deposits
Real Withdrawals
Cregis Transactions
Bank Transfers
Real Ledger
Real Reconciliation
Real Suspicious Transactions
```

## Demo Management

```text
Demo Users
Demo Balances
Demo Topups
Demo Orders
Demo Trades
Demo Positions
Demo Resets
Demo Statistics
```

Admin actions must clearly display:

```text
REAL
```

or

```text
DEMO
```

before every financial operation.

---

# 44. ADMIN SAFETY

High-risk Real operations require:

* RBAC
* 2FA
* Permission checks
* Confirmation
* Audit log
* Optional dual approval
* Reason/comment
* Idempotency
* Before/after values

Demo administrative operations may have simpler controls but must still be audited.

---

# 45. REAL FINANCIAL RECONCILIATION

A scheduled reconciliation process should compare:

```text
ETHSLTD Real Ledger
       ↕
Cregis Records
       ↕
Bank Records
```

Differences must create:

```text
RECONCILIATION_EXCEPTION
```

Admin/Finance must be able to investigate.

---

# 46. CREGIS TRANSACTION RECONCILIATION

Store provider identifiers such as applicable:

```text
cid
txid
third_party_id
provider_reference
```

Cregis documentation specifically recommends persisting identifiers such as `cid` for tracking/reconciliation and using a unique business idempotency identifier for payout requests. ([Cregis Developer Center][2])

Never use only:

```text
user_id
```

as a financial transaction identifier.

---

# 47. IDEMPOTENCY

Every financial request should support:

```text
idempotency_key
```

Example:

```text
POST /real/deposits
Idempotency-Key: abc123
```

If the same request is received twice:

```text
First request:
Create transaction

Second request:
Return original transaction
Do NOT create another transaction
```

This is especially important for:

* Deposits
* Withdrawals
* Cregis callbacks
* Bank approvals
* Ledger operations
* Trade settlement

---

# 48. SECURITY

Required:

* HTTPS
* Secure cookies
* CSRF protection
* Rate limiting
* Brute-force protection
* Password hashing with Argon2id
* 2FA/TOTP
* Device management
* Session management
* Refresh-token rotation
* Suspicious-login detection
* IP/device audit
* API authentication
* RBAC
* Server-side authorization
* Secret management
* Webhook signature verification
* Replay protection
* Idempotency
* Audit logging

---

# 49. KYC / AML

Real mode must support the required compliance workflows.

Potential components:

```text
KYC
AML Screening
Sanctions Screening
PEP Screening
Transaction Monitoring
Risk Scoring
Suspicious Activity Review
Account Freeze
Withdrawal Review
Velocity Limits
```

Demo users should not accidentally enter Real compliance workflows unless they are attempting to access Real functionality.

---

# 50. ACCOUNT STATUS

Real account statuses:

```text
PENDING_KYC
ACTIVE
RESTRICTED
FROZEN
SUSPENDED
CLOSED
```

Demo account can have:

```text
ACTIVE
DISABLED
```

Real restrictions must not automatically corrupt Demo trading.

Example:

```text
Real account frozen
        ↓
Real trading disabled
        ↓
Demo remains available
```

This should be configurable according to compliance/business policy.

---

# 51. AUDIT LOGGING

Every Real financial event must be audited.

Example:

```text
actor
user_id
admin_id
environment
action
entity_type
entity_id
amount
asset
old_value
new_value
ip
device
timestamp
request_id
```

Demo operations should also be audited, but clearly marked:

```text
environment = DEMO
```

---

# 52. MOBILE APPLICATIONS

Android and iOS must use the same backend separation.

The mobile app must never store Cregis private credentials.

The mobile application only receives a safe payment/deposit session/instruction generated by the backend.

Example:

```text
Mobile App
   ↓
ETHSLTD API
   ↓
Cregis
```

Not:

```text
Mobile App
   ↓
Cregis Secret API Key
```

---

# 53. WEB APPLICATION

Recommended stack:

```text
TypeScript
React
Next.js
Tailwind CSS
shadcn/ui
TanStack Query
Zustand
React Hook Form
Zod
Lightweight Charts
WebSocket
```

The UI should load only the currently selected environment's data.

---

# 54. BACKEND

Recommended:

```text
Cloudflare Workers
Cloudflare Durable Objects
Cloudflare D1
Cloudflare R2
Cloudflare KV
Cloudflare Queues
Cloudflare Cron
```

Architecture:

```text
Browser
   ↓
Cloudflare Worker API
   ↓
Domain Services
   ↓
D1 / Durable Objects / R2 / Queues
```

---

# 55. REALTIME

WebSocket channels should include environment.

Example:

```text
/ws/real/market
/ws/real/orders
/ws/real/positions

/ws/demo/market
/ws/demo/orders
/ws/demo/positions
```

The backend must validate the user's authorization before joining a channel.

---

# 56. DURABLE OBJECTS

Recommended Durable Objects:

```text
RealMarketRoom
DemoMarketRoom
RealTradingRoom
DemoTradingRoom
RealP2PRoom
DemoP2PRoom
```

Alternatively, environment can be part of the Durable Object key.

The critical requirement is that state cannot accidentally cross environments.

---

# 57. QUEUES

Queues can process:

```text
Cregis webhook
Real ledger events
Real notifications
Real reconciliation
Demo events
Demo notifications
Audit events
```

Use separate queues or explicit environment routing.

Example:

```text
real-financial-events
demo-trading-events
```

---

# 58. FILE STORAGE

R2 can store:

### Real

```text
KYC documents
Bank transfer proofs
Real contracts
Real statements
Real reports
```

### Demo

```text
Demo reports
Demo contracts
Demo exports
```

Real sensitive files must be private and protected with authorization.

---

# 59. API EXAMPLES

### Real Wallet

```text
GET /api/v1/real/wallet
```

### Demo Wallet

```text
GET /api/v1/demo/wallet
```

### Real Deposit

```text
POST /api/v1/real/deposits
```

### Demo Top-up

```text
POST /api/v1/demo/balance/topup
```

### Real Orders

```text
POST /api/v1/real/orders
```

### Demo Orders

```text
POST /api/v1/demo/orders
```

### Real Trades

```text
GET /api/v1/real/trades
```

### Demo Trades

```text
GET /api/v1/demo/trades
```

---

# 60. CROSS-ENVIRONMENT PROTECTION

The backend should reject requests such as:

```text
REAL wallet → DEMO withdrawal
DEMO wallet → REAL withdrawal
REAL balance → DEMO balance
DEMO balance → REAL balance
DEMO escrow → REAL escrow
REAL escrow → DEMO escrow
```

Return:

```text
403 ENVIRONMENT_MISMATCH
```

or an equivalent domain error.

---

# 61. TRANSACTION IDENTIFIERS

Every transaction must have multiple identifiers where applicable:

```text
transaction_id
ledger_id
order_id
trade_id
deposit_id
withdrawal_id
request_id
idempotency_key
provider_transaction_id
```

Cregis-specific identifiers should be stored separately from internal ETHSLTD IDs.

---

# 62. FINANCIAL PRECISION

Never use JavaScript floating-point arithmetic for financial ledger calculations.

Use:

```text
Decimal
```

or integer smallest units.

Example:

```text
USDT:
100.25
```

must not be calculated using unsafe floating-point arithmetic.

All money calculations must be deterministic.

---

# 63. DATABASE TRANSACTIONS

Real financial operations must be atomic.

Example:

```text
Ledger Entry
+
Wallet Update
+
Transaction Status
+
Audit Event
```

must be committed consistently.

If a financial operation fails:

```text
NO partial wallet credit
```

---

# 64. REAL DEPOSIT STATE MACHINE

```text
CREATED
   ↓
PAYMENT_PENDING
   ↓
PROVIDER_PROCESSING
   ↓
PROVIDER_CONFIRMED
   ↓
LEDGER_POSTED
   ↓
WALLET_CREDITED
   ↓
COMPLETED
```

Failure:

```text
FAILED
CANCELLED
EXPIRED
REVERSED
MANUAL_REVIEW
```

---

# 65. DEMO TOP-UP STATE MACHINE

```text
REQUESTED
   ↓
VALIDATING
   ↓
LEDGER_POSTED
   ↓
WALLET_CREDITED
   ↓
COMPLETED
```

There is no payment-provider state.

---

# 66. REAL/DEMO REPORTS

Real reports:

* Account statement
* Deposit statement
* Withdrawal statement
* Trading statement
* Fee report
* P&L report
* Ledger report
* Tax/export report where applicable

Demo reports:

* Demo account statement
* Demo trading report
* Demo P&L
* Demo fee simulation
* Demo transaction history

Reports must clearly identify their environment.

---

# 67. DASHBOARD

### Real Dashboard

```text
Real Total Balance
Real Available Balance
Real P&L
Real Open Orders
Real Positions
Real Deposits
Real Withdrawals
```

### Demo Dashboard

```text
Demo Balance
Demo P&L
Demo Open Orders
Demo Positions
Demo Top-ups
Demo Trades
```

Never mix the numbers.

---

# 68. GLOBAL UI SAFETY

Every page involving financial data should show an environment indicator.

Example:

```text
● REAL
```

or

```text
● DEMO
```

The color/design should be visually distinct enough to prevent accidental confusion.

Before a high-risk Real operation:

```text
You are performing this action using REAL FUNDS.
```

Before Demo:

```text
This is a DEMO transaction. No real funds will be used.
```

---

# 69. REAL WITHDRAWAL CONFIRMATION

Example:

```text
WARNING

You are about to withdraw REAL funds.

Asset: USDT
Amount: 500
Network: XXXXX
Destination: XXXXX

This transaction may be irreversible.

[Cancel] [Confirm Withdrawal]
```

This confirmation must never appear for Demo.

---

# 70. DEMO TOP-UP CONFIRMATION

```text
DEMO BALANCE

You are adding virtual Demo funds.

Amount:
100,000 USDT

No real money will be charged.

[Cancel] [Add Demo Balance]
```

---

# 71. ADMIN FINANCE SCREEN

The Admin Finance module should have tabs:

```text
REAL
DEMO
```

Real:

```text
Cregis
Bank Transfers
Deposits
Withdrawals
Ledger
Reconciliation
```

Demo:

```text
Top-ups
Demo Wallets
Demo Ledger
Demo Orders
Demo Trades
Demo Resets
```

Never place Real and Demo transactions into the same operational table without an explicit environment indicator and filtering.

---

# 72. CREGIS CONFIGURATION

Production configuration should use environment-specific secrets.

Example:

```text
CREGIS_ENV=sandbox
```

for testing, where supported.

Production:

```text
CREGIS_ENV=production
```

The actual Cregis base URL, API keys, project identifiers and webhook secrets must be injected at deployment time.

The provided test/sandbox endpoint must not automatically be assumed to be production.

The integration must first be validated against the appropriate Cregis environment and project configuration.

---

# 73. CREGIS INTEGRATION MODULES

Implement:

```text
CregisClient
CregisAuth
CregisSignature
CregisDeposit
CregisPayout
CregisTransactionQuery
CregisWebhook
CregisReconciliation
CregisErrorMapper
```

The current WaaS API reference includes sub-address management, payouts, collection, transaction queries and webhook endpoints. ([Cregis Developer Center][3])

Use only the APIs actually enabled for the ETHSLTD Cregis account/project.

---

# 74. CREGIS ERROR HANDLING

Map provider errors into internal errors.

Example:

```text
CREGIS_TIMEOUT
CREGIS_AUTH_FAILED
CREGIS_SIGNATURE_INVALID
CREGIS_INVALID_REQUEST
CREGIS_TRANSACTION_PENDING
CREGIS_TRANSACTION_FAILED
CREGIS_PROVIDER_UNAVAILABLE
CREGIS_DUPLICATE_TRANSACTION
CREGIS_UNKNOWN_STATUS
```

Never expose raw provider secrets or sensitive provider response data to users.

---

# 75. BANK TRANSFER SECURITY

Bank transfer proof files must:

* Be private
* Be scanned/validated
* Have size/type restrictions
* Be access-controlled
* Be audit logged
* Have retention rules
* Never be publicly accessible

---

# 76. FRAUD PREVENTION

Real financial transactions should support:

```text
Velocity Checks
Amount Limits
Device Risk
IP Risk
Transaction Risk
Account Age
KYC Status
Sanctions Status
Suspicious Pattern Detection
Manual Review
```

Demo transactions should not create real financial risk.

---

# 77. TEST ENVIRONMENT

The development/staging environment must have:

```text
DEMO
REAL-SANDBOX
```

where supported.

Never test real-money workflows against production funds.

Automated tests should verify:

```text
Demo cannot access Real wallet
Real cannot access Demo wallet
Demo cannot call Cregis
Demo cannot create real withdrawal
Real deposit cannot create Demo balance
Demo top-up cannot create Real balance
```

---

# 78. CRITICAL AUTOMATED TESTS

### Test 1

```text
Demo top-up
Expected:
Demo wallet increases
Real wallet unchanged
```

### Test 2

```text
Real Cregis deposit
Expected:
Real wallet increases after verified callback
Demo wallet unchanged
```

### Test 3

```text
Duplicate Cregis callback
Expected:
Only one ledger credit
```

### Test 4

```text
Demo withdrawal attempt
Expected:
Rejected
```

### Test 5

```text
Real withdrawal
Expected:
Real withdrawal workflow
```

### Test 6

```text
Demo order
Expected:
Demo position changes
Real position unchanged
```

### Test 7

```text
Real order
Expected:
Real position changes
Demo position unchanged
```

### Test 8

```text
Demo ledger query
Expected:
Only Demo entries
```

### Test 9

```text
Real ledger query
Expected:
Only Real entries
```

---

# 79. DATABASE TEST

For every financial table, automated tests must verify that:

```text
environment = REAL
```

cannot accidentally retrieve:

```text
environment = DEMO
```

and vice versa.

---

# 80. FRONTEND TEST

The following must be tested:

```text
Switch Real → Demo
Switch Demo → Real
Refresh page
Open direct URL
Open multiple tabs
Open mobile app
Reconnect WebSocket
Expire session
Logout/login
```

The selected environment must remain correctly authorized.

---

# 81. CONCURRENCY TESTS

Test:

```text
Two simultaneous deposits
Two identical webhooks
Two simultaneous withdrawals
Two simultaneous orders
Repeated Demo top-ups
Repeated Demo reset
```

The system must remain financially consistent.

---

# 82. FAILURE RECOVERY

If:

```text
Cregis succeeds
but ETHSLTD database temporarily fails
```

the system must not permanently lose the transaction.

Use:

```text
Webhook persistence
Retry
Idempotency
Reconciliation
Dead-letter queue
Manual recovery
```

The reconciliation process must eventually detect unmatched provider transactions.

---

# 83. OBSERVABILITY

Production monitoring should track:

```text
Cregis API latency
Cregis API errors
Webhook failures
Webhook duplicates
Deposit failures
Withdrawal failures
Bank transfer backlog
Ledger failures
Trading engine latency
Order rejection rate
WebSocket connections
Queue backlog
Database errors
```

---

# 84. ALERTS

Critical alerts:

```text
Cregis unavailable
Webhook signature failures spike
Deposit reconciliation mismatch
Withdrawal failure spike
Ledger mismatch
Negative wallet balance
Unexpected environment mismatch
Duplicate transaction detection spike
```

---

# 85. NEGATIVE BALANCE PROTECTION

Real wallet must never become negative unless a specifically designed financial product legitimately requires it.

Before debit:

```text
available_balance >= required_amount
```

If not:

```text
INSUFFICIENT_BALANCE
```

Demo can follow the same trading rules unless the Demo configuration intentionally permits special behavior.

---

# 86. REAL WALLET INVARIANTS

For every Real wallet:

```text
total =
available + locked
```

and:

```text
ledger_balance =
wallet_balance
```

must reconcile.

---

# 87. DEMO WALLET INVARIANTS

Same software invariants:

```text
total =
available + locked
```

and:

```text
demo_ledger_balance =
demo_wallet_balance
```

But these values have no monetary value.

---

# 88. SOURCE OF TRUTH

For Real funds:

```text
ETHSLTD immutable ledger
```

is the application's internal accounting source of truth, reconciled against external providers/bank records.

For Demo:

```text
Demo ledger
```

is the source of truth.

Frontend balance is never the source of truth.

---

# 89. FRONTEND SECURITY

Never allow:

```text
POST /wallet/set-balance
```

from a user frontend.

Never allow:

```text
POST /real/wallet/credit
```

for normal users.

Real balance changes must occur through authorized financial services.

Demo top-up is the only intentional user-facing balance creation flow, and it must explicitly target Demo.

---

# 90. ROLE SYSTEM

Recommended roles:

```text
SUPER_ADMIN
ADMIN
COMPLIANCE_ADMIN
KYC_ADMIN
FINANCE_ADMIN
TRADING_ADMIN
P2P_ADMIN
SUPPORT_ADMIN
RISK_MANAGER
AUDITOR
MODERATOR
USER
P2P_MERCHANT
INSTITUTIONAL_USER
```

Finance roles should have access to Real financial operations only when explicitly authorized.

---

# 91. ADMIN PERMISSION EXAMPLE

```text
real.deposit.review
real.withdrawal.review
real.ledger.view
real.ledger.adjust
real.reconciliation.view

demo.balance.adjust
demo.account.reset
demo.trades.view
demo.ledger.view
```

A Demo permission must never automatically imply Real permission.

---

# 92. PROJECT STRUCTURE

Recommended monorepo:

```text
apps/
  web/
  mobile/
  admin/

services/
  api/
  auth/
  trading/
  demo-trading/
  real-wallet/
  demo-wallet/
  real-ledger/
  demo-ledger/
  matching-engine/
  market-data/
  cregis/
  bank-transfer/
  p2p/
  risk/
  compliance/
  notifications/
  contracts/

packages/
  types/
  validation/
  auth/
  database/
  ui/
  api-client/
  config/
  security/

database/
  migrations/
  seeds/

infrastructure/
  cloudflare/

docs/
  api/
  architecture/
  compliance/
  runbooks/
```

---

# 93. RECOMMENDED SERVICE DEPENDENCY

### Real

```text
Real Wallet
    ↓
Real Ledger
    ↓
Real Trading
    ↓
Real Settlement
```

Cregis:

```text
Real Deposit
    ↓
Cregis Service
```

### Demo

```text
Demo Wallet
    ↓
Demo Ledger
    ↓
Demo Trading
    ↓
Demo Settlement
```

No Cregis dependency.

---

# 94. SHARED COMPONENTS VS SEPARATE COMPONENTS

Can be shared:

```text
UI components
Validation library
Chart component
Market-data display
Order form
Authentication
Localization
Design system
API client framework
```

Must be logically separated:

```text
Real Wallet
Demo Wallet
Real Ledger
Demo Ledger
Real Deposit
Demo Top-up
Real Withdrawal
Demo Withdrawal
Real Trading Account
Demo Trading Account
Real P2P Escrow
Demo P2P Escrow
```

---

# 95. SHARED UI, SEPARATE DATA

The same Order Form component can be reused:

```text
<OrderForm environment="REAL" />
<OrderForm environment="DEMO" />
```

But the backend endpoint must be different:

```text
REAL → /api/v1/real/orders
DEMO → /api/v1/demo/orders
```

This provides a consistent UX without mixing financial state.

---

# 96. REAL MODE FEATURE MATRIX

| Feature         | Real |
| --------------- | ---- |
| Real Wallet     | YES  |
| Cregis          | YES  |
| Bank Transfer   | YES  |
| Real Deposit    | YES  |
| Real Withdrawal | YES  |
| Real Ledger     | YES  |
| Real Trading    | YES  |
| Real P&L        | YES  |
| Real Fees       | YES  |
| Real P2P        | YES  |
| Real Escrow     | YES  |
| Real Compliance | YES  |
| Demo Top-up     | NO   |
| Demo Withdrawal | NO   |

---

# 97. DEMO MODE FEATURE MATRIX

| Feature                     | Demo     |
| --------------------------- | -------- |
| Demo Wallet                 | YES      |
| Demo Balance Top-up         | YES      |
| Cregis                      | NO       |
| Bank Transfer               | NO       |
| Real Deposit                | NO       |
| Real Withdrawal             | NO       |
| Demo Ledger                 | YES      |
| Demo Trading                | YES      |
| Demo P&L                    | YES      |
| Demo Fees                   | YES      |
| Demo P2P                    | Optional |
| Demo Escrow                 | Optional |
| Real Compliance Transaction | NO       |
| Real Financial Settlement   | NO       |

---

# 98. USER JOURNEY — REAL

```text
Register
 ↓
Verify Email/Phone
 ↓
Complete KYC
 ↓
Account Approved
 ↓
Select REAL
 ↓
Open Real Wallet
 ↓
Deposit
 ├── Cregis
 └── Bank Transfer
 ↓
Deposit Verified
 ↓
Real Wallet Credited
 ↓
Open Trading
 ↓
Place Real Order
 ↓
Trade Executed
 ↓
Real Ledger Updated
 ↓
Real P&L Updated
 ↓
Withdraw / Continue Trading
```

---

# 99. USER JOURNEY — DEMO

```text
Register/Login
 ↓
Select DEMO
 ↓
Open Demo Wallet
 ↓
Add Demo Balance
 ↓
Demo Wallet Credited Instantly
 ↓
Open Trading
 ↓
Place Demo Order
 ↓
Demo Trade Executed
 ↓
Demo Ledger Updated
 ↓
Demo P&L Updated
 ↓
Practice
```

No payment provider appears in this flow.

---

# 100. HARD SEPARATION RULE

The following statement should be treated as a core engineering requirement:

> **REAL is a financial production environment. DEMO is a virtual simulation environment. They may share presentation and trading logic where safe, but they must never share financial balances, ledgers, deposits, withdrawals, settlements, escrow, or transaction ownership.**

---

# 101. DEFINITION OF DONE

The system is not production-ready until all of the following are true:

* [ ] Real and Demo accounts are separately represented.
* [ ] Real and Demo wallets are separated.
* [ ] Real and Demo ledgers are separated.
* [ ] Real and Demo orders are separated.
* [ ] Real and Demo trades are separated.
* [ ] Real and Demo positions are separated.
* [ ] Real and Demo P&L are separated.
* [ ] Real and Demo fees are separated.
* [ ] Cregis exists only in Real funding flows.
* [ ] Direct Bank Transfer exists only in Real funding flows.
* [ ] Demo top-up requires no payment provider.
* [ ] Demo funds cannot be withdrawn as real funds.
* [ ] Real funds cannot be generated through Demo.
* [ ] Cregis secrets never reach frontend/mobile.
* [ ] Cregis webhook signatures are verified.
* [ ] Cregis callbacks are idempotent.
* [ ] Provider transaction IDs are stored.
* [ ] Real deposits reconcile with provider records.
* [ ] Bank transfers require configured verification.
* [ ] Real withdrawals have security/risk controls.
* [ ] All Real financial actions are audited.
* [ ] Demo actions are clearly marked as Demo.
* [ ] Real/Demo APIs are separated.
* [ ] Real/Demo WebSocket channels are separated.
* [ ] Environment mismatch requests are rejected.
* [ ] Automated cross-environment tests pass.
* [ ] Concurrency tests pass.
* [ ] Failure/recovery tests pass.
* [ ] No production secrets are committed to Git.
* [ ] All credentials supplied during development are rotated before production.
* [ ] Cregis sandbox/test integration is verified before production activation.
* [ ] Production Cregis credentials are stored securely.
* [ ] Bank account details are configurable through authorized Admin/Finance controls.
* [ ] Financial reconciliation is operational.
* [ ] Monitoring and alerts are operational.
* [ ] Backup/recovery procedures are tested.
* [ ] Security review is completed.
* [ ] Legal/compliance review is completed before accepting real customer funds.

---

# 102. FINAL ARCHITECTURE

The final system should conceptually operate as:

```text
                         ETHSLTD PLATFORM
                               |
                +--------------+--------------+
                |                             |
             REAL MODE                     DEMO MODE
                |                             |
        +-------+-------+             +-------+-------+
        |               |             |               |
    Real Wallet     Real Trading   Demo Wallet    Demo Trading
        |               |             |               |
    Real Ledger     Real Engine    Demo Ledger    Demo Engine
        |               |             |               |
   +----+----+          |             |               |
   |         |           |             |               |
 Cregis   Bank Transfer |             |          Virtual Top-up
   |         |           |             |               |
   +----+----+           |             +-------+-------+
        |                |                     |
        +---------> Real Settlement      Demo Settlement
                         |
                    Real Money
```

## Absolute Boundary

```text
                    ❌ NO CROSSOVER ❌

REAL WALLET  X  DEMO WALLET
REAL LEDGER  X  DEMO LEDGER
REAL FUNDS   X  DEMO FUNDS
REAL DEPOSIT X  DEMO TOPUP
REAL TRADE   X  DEMO TRADE
REAL ESCROW  X  DEMO ESCROW
REAL WITHDRAWAL X DEMO WITHDRAWAL
```

The platform can therefore deliver **the same trading experience in both environments while maintaining a strict accounting and infrastructure boundary between actual customer money and virtual Demo funds**.

# 103. CREGIS DOCUMENTATION REFERENCE

The implementation team should use the official Cregis documentation as the authoritative integration reference. Cregis currently documents separate WaaS and Payment Engine products, with WaaS intended for wallet/deposit/payout infrastructure and Payment Engine intended for payment-order/payment-collection flows. ([Cregis Developer Center][1])

Relevant official references:

* [Cregis Platform Introduction](https://developers.cregis.com/en/introduction/?utm_source=chatgpt.com)
* [Cregis WaaS Business Flow](https://developers.cregis.com/en/waas-business-flow/?utm_source=chatgpt.com)
* [Cregis WaaS API Reference](https://developers.cregis.com/en/reference/waas-api/?utm_source=chatgpt.com)
* [Cregis Payment Engine Business Flow](https://developers.cregis.com/en/payment-engine-business-flow/?utm_source=chatgpt.com)
* [Cregis WaaS Setup](https://developers.cregis.com/en/waas-setup/?utm_source=chatgpt.com)
* [Cregis WaaS SDK Overview](https://developers.cregis.com/en/waas-sdk-overview/?utm_source=chatgpt.com)

**Security requirement:** the credentials supplied in the project specification must be rotated/revoked before they are used in a production deployment. The PRD intentionally does not store or reproduce those credentials.

[1]: https://developers.cregis.com/en/introduction "Cregis Developer Center | API Docs & Quickstart Guide | Cregis Developer Docs"
[2]: https://developers.cregis.com/en/waas-business-flow "WaaS Business Flow | Cregis Developer Docs"
[3]: https://developers.cregis.com/en/reference/waas-api "WaaS API | Cregis Developer Docs"
