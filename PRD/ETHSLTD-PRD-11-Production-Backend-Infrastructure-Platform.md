# ETHSLTD — Next Step PRD

Based on the complete project history you provided, the implemented PRDs **01–10**, the existing architecture, and the requirement that ETHSLTD now move toward a **production-ready platform**, the next PRD should not be another customer-facing page.

The logical next step is to replace the mock-provider foundation with a **real production backend, database, ledger, authentication infrastructure, realtime infrastructure, security controls, observability, and deployment system** while preserving all existing UI/UX.

The existing architecture explicitly anticipates this transition: the platform currently uses mock providers so they can later be replaced by production REST/WebSocket services without redesigning the UI. 

The technology specification also already defines the intended production architecture around **Cloudflare Workers/Hono, Durable Objects/WebSockets, D1, R2, KV, Queues/Cron, pnpm/Turborepo, Vitest, Playwright, GitHub Actions and Cloudflare**. 

---

# Recommended PRD Filename

```text
ETHSLTD-PRD-11-Production-Backend-Infrastructure-Platform.md
```

# PRD Title

# ETHSLTD Crypto — Production Backend, Infrastructure & Platform Readiness

**Document Version:** 1.0
**Product:** ETHSLTD Crypto
**Module:** Production Backend & Infrastructure
**Primary Scope:** Full platform production foundation
**Currency Standard:** USD
**Architecture:** Next.js 15 + TypeScript + Cloudflare + D1 + R2 + KV + Durable Objects + Queues + WebSockets
**Status:** Ready for Development

---

# 1. Document Purpose

This PRD defines the complete production infrastructure required to transition ETHSLTD from its current **frontend + mock-provider architecture** into a real production-capable cryptocurrency trading platform.

The purpose is to establish the infrastructure underneath the already-developed:

* Homepage
* Markets
* Trading Terminal
* Authentication
* Account & Security
* P2P Marketplace
* Wallet
* Admin Console
* Notifications & Support
* API & Developer Platform

The existing customer-facing interfaces must remain visually and behaviorally consistent.

The major architectural transition is:

```text
CURRENT

Next.js UI
   ↓
Zustand
   ↓
Mock Providers
   ↓
Mock Data
```

to:

```text
PRODUCTION

Next.js Web
      ↓
API Client
      ↓
Cloudflare Workers / Hono
      ↓
┌───────────────────────────────────────┐
│ Authentication                         │
│ Users                                  │
│ Wallet                                 │
│ Ledger                                 │
│ Markets                                │
│ Orders                                 │
│ Trading                               │
│ P2P                                   │
│ Notifications                         │
│ Support                               │
│ Risk                                  │
│ API Keys                              │
└───────────────────────────────────────┘
      ↓
┌───────────────────────────────────────┐
│ Cloudflare D1                         │
│ Cloudflare R2                         │
│ Cloudflare KV                         │
│ Durable Objects                       │
│ Queues                                │
│ Cron                                  │
└───────────────────────────────────────┘
      ↓
External Providers
      ↓
Blockchain / KYC / Email / Payments /
Market Data / Custody / Monitoring
```

---

# 2. Existing Product Baseline

The production backend must support the existing ETHSLTD application rather than creating a new product.

The existing system already contains:

| Product            | Route                       | Status   |
| ------------------ | --------------------------- | -------- |
| Homepage           | `/`                         | Complete |
| Markets            | `/markets`                  | Complete |
| Trading            | `/trade`                    | Complete |
| Authentication     | `/login`, `/register`, etc. | Complete |
| Account            | `/account/*`                | Complete |
| P2P                | `/p2p`                      | Complete |
| P2P Orders         | `/p2p/orders`               | Complete |
| Wallet             | `/wallet`                   | Complete |
| Deposit            | `/wallet/deposit`           | Complete |
| Withdraw           | `/wallet/withdraw`          | Complete |
| Wallet History     | `/wallet/history`           | Complete |
| Admin              | `/admin/*`                  | Complete |
| Notifications      | `/notifications`            | Complete |
| Support            | `/support/*`                | Complete |
| Developer Platform | API/developer routes        | Complete |

The production infrastructure must therefore be designed as the underlying platform for all of these systems.

---

# 3. Core Objective

The completed implementation must make ETHSLTD capable of operating against **real backend services instead of simulated providers**.

The platform must establish:

1. Real user persistence
2. Real authentication
3. Real authorization
4. Real database persistence
5. Real financial ledger
6. Real wallet accounting
7. Real order persistence
8. Real trading-service interfaces
9. Real market-data interfaces
10. Real P2P persistence
11. Real notification persistence
12. Real support persistence
13. Real API authentication
14. Real API rate limiting
15. Real realtime infrastructure
16. Real audit logging
17. Real security monitoring
18. Real background jobs
19. Real observability
20. Production deployment
21. Automated testing
22. Automated CI/CD
23. Disaster recovery mechanisms
24. Environment separation
25. Production-safe configuration

---

# 4. Non-Negotiable Production Rule

## Mock providers must never be used as production data sources.

Existing providers such as:

```text
MockMarketDataProvider
MockTradingProvider
MockAuthProvider
MockP2PDataProvider
MockWalletProvider
MockAdminProvider
MockNotificationProvider
MockSupportProvider
```

must remain available for:

* local development
* UI development
* automated tests
* demos
* preview environments

but production must use:

```text
ProductionMarketProvider
ProductionTradingProvider
ProductionAuthProvider
ProductionP2PProvider
ProductionWalletProvider
ProductionNotificationProvider
ProductionSupportProvider
ProductionAdminProvider
```

or equivalent interfaces.

The design system already explicitly requires mock data to remain separated from production service logic. 

---

# 5. Production Architecture

## 5.1 Web Application

Existing:

```text
apps/web
```

Responsibilities:

* customer-facing UI
* authentication screens
* trading UI
* markets UI
* wallet UI
* P2P UI
* account UI
* notifications
* support
* API developer portal

The web application must not contain:

* database credentials
* private API secrets
* signing keys
* custody secrets
* server credentials

This follows the established security rule that secrets must never enter React components, client bundles, or public assets. 

---

# 6. Backend API

Create:

```text
services/api
```

Technology:

* TypeScript
* Cloudflare Workers
* Hono
* Zod
* shared types
* shared validation

The API must become the central business interface between frontend applications and backend services.

---

# 7. API Architecture

The API must use:

```text
/api/v1
```

Example:

```text
/api/v1/auth/*
/api/v1/users/*
/api/v1/account/*
/api/v1/markets/*
/api/v1/orders/*
/api/v1/trades/*
/api/v1/wallet/*
/api/v1/p2p/*
/api/v1/notifications/*
/api/v1/support/*
/api/v1/developer/*
/api/v1/admin/*
```

---

# 8. API Response Standard

All APIs should follow a predictable format.

### Success

```json
{
  "success": true,
  "data": {},
  "requestId": "req_xxx"
}
```

### Error

```json
{
  "success": false,
  "error": {
    "code": "INSUFFICIENT_BALANCE",
    "message": "Insufficient available balance."
  },
  "requestId": "req_xxx"
}
```

Never expose:

* stack traces
* database errors
* internal infrastructure details
* secret values
* provider credentials

to users.

---

# 9. Request ID

Every API request must receive:

```text
requestId
```

Example:

```text
req_01JXYZ...
```

The same request ID must be attached to:

* application logs
* errors
* audit events
* support diagnostics
* admin investigations

---

# 10. Database

Use:

```text
Cloudflare D1
```

as the primary relational database.

Database structure must be migration-driven.

Create:

```text
database/
├── migrations/
├── schema/
└── seeds/
```

This is consistent with the existing architecture specification. 

---

# 11. Database Principles

All production database changes must use migrations.

Never manually modify production schema.

Required:

```text
migration version
migration checksum
migration execution tracking
rollback strategy
development seed
test seed
production-safe seed
```

---

# 12. Core Database Domains

The database must support the following domains.

## Users

```text
users
user_profiles
user_preferences
user_security
user_sessions
user_roles
user_permissions
```

---

# 13. Authentication Database

Store:

* user ID
* email
* password hash
* account status
* email verification status
* MFA status
* created timestamp
* updated timestamp
* last login
* security state

Never store plaintext passwords.

---

# 14. Session Management

Sessions must support:

* session creation
* session expiry
* device identification
* IP metadata
* user-agent metadata
* last activity
* revocation
* forced logout

Existing `/account/sessions` functionality must connect to this production system.

---

# 15. Authentication

Production authentication must support:

### Registration

```text
POST /api/v1/auth/register
```

### Login

```text
POST /api/v1/auth/login
```

### Logout

```text
POST /api/v1/auth/logout
```

### Refresh

```text
POST /api/v1/auth/refresh
```

### Email verification

```text
POST /api/v1/auth/verify-email
```

### Password reset

```text
POST /api/v1/auth/forgot-password
POST /api/v1/auth/reset-password
```

---

# 16. Authentication Security

Implement:

* secure session cookies
* HttpOnly
* Secure
* SameSite
* CSRF protection where applicable
* login throttling
* brute-force protection
* suspicious login detection
* session revocation
* password hashing
* MFA support
* recovery mechanisms

Do not place long-lived authentication secrets into browser localStorage.

---

# 17. Role-Based Access Control

RBAC must become production-backed.

Roles should include at minimum:

```text
USER
SUPPORT
FINANCE
COMPLIANCE
RISK
TRADING_OPERATOR
ADMIN
SUPER_ADMIN
DEVELOPER
```

Permissions should be granular.

Example:

```text
users.read
users.freeze
users.unfreeze

kyc.read
kyc.review

withdrawals.read
withdrawals.approve
withdrawals.reject

orders.read
orders.cancel

p2p.disputes.read
p2p.disputes.resolve

support.read
support.respond

notifications.broadcast

audit.read
settings.manage
```

---

# 18. Authorization Rule

Authorization must be enforced on the server.

Frontend hiding a button is **not security**.

Every sensitive endpoint must independently verify:

```text
authentication
+
role
+
permission
+
resource ownership
+
risk restrictions
```

---

# 19. Wallet Production Architecture

Existing wallet functionality must migrate from:

```text
wallet-store.ts
+
paper-account-store.ts
```

to a production financial backend.

The frontend store should become primarily a UI/cache layer.

It must never become the authoritative source of financial balances.

---

# 20. Financial Ledger

Create:

```text
services/ledger
```

The ledger is one of the most important production components.

Every financial state change must produce a ledger event.

Examples:

```text
DEPOSIT
WITHDRAWAL
TRADE_BUY
TRADE_SELL
P2P_BUY
P2P_SELL
FEE
REFUND
ADJUSTMENT
LOCK
UNLOCK
```

---

# 21. Double-Entry Ledger

The financial system must use a double-entry accounting model.

Example:

```text
Deposit $1,000

Debit:
Customer Asset Account +$1,000

Credit:
Platform Settlement Account +$1,000
```

A financial transaction must never simply mutate:

```text
balance = balance + amount
```

without an associated ledger transaction.

---

# 22. Ledger Immutability

Historical ledger entries must not be edited or deleted.

Corrections must create compensating entries.

Example:

```text
Original:
+$100

Correction:
-$100

Corrected:
+$50
```

The original transaction remains intact.

---

# 23. Balance Model

Each asset must support:

```text
available
locked
total
```

Formula:

```text
total = available + locked
```

This must be consistent across:

* wallet
* trading
* P2P
* admin
* API
* notifications

---

# 24. USD Standard

USD remains the platform's default monetary display currency.

Examples:

```text
$10,000.00
$125,450.32
$2.45M
$8.73B
```

No INR should become the default.

The existing project explicitly establishes USD as the monetary standard and rejects INR as the default. 

---

# 25. Financial Precision

Never use JavaScript floating-point arithmetic for authoritative financial calculations.

Use:

* integer minor units where appropriate
* decimal arithmetic
* asset-specific precision
* deterministic rounding rules

Centralize:

```text
formatPrice()
formatQuantity()
formatCurrency()
formatPercentage()
```

The design specification already requires centralized financial formatting. 

---

# 26. Wallet API

Required:

```text
GET  /api/v1/wallet
GET  /api/v1/wallet/assets
GET  /api/v1/wallet/transactions
POST /api/v1/wallet/deposit
POST /api/v1/wallet/withdraw
GET  /api/v1/wallet/deposit/:id
GET  /api/v1/wallet/withdraw/:id
```

---

# 27. Deposit Architecture

The production system must support a provider abstraction.

```text
DepositService
      ↓
DepositProvider
      ↓
Blockchain / Payment Provider
```

The exact external provider may be added later.

The frontend must not need to change when the provider changes.

---

# 28. Withdrawal Architecture

Withdrawal flow:

```text
User Request
     ↓
Authentication
     ↓
2FA / Security Check
     ↓
Risk Evaluation
     ↓
Balance Verification
     ↓
Funds Lock
     ↓
Withdrawal Review
     ↓
Provider Submission
     ↓
Blockchain / Payment Confirmation
     ↓
Ledger Finalization
     ↓
Notification
```

---

# 29. Withdrawal Protection

Implement:

* minimum withdrawal amount
* maximum withdrawal amount
* daily limits
* asset limits
* address validation
* address format validation
* risk scoring
* 2FA
* withdrawal confirmation
* cooldown policy where configured
* admin review
* audit logging

---

# 30. Trading Backend

Create:

```text
services/trading
```

The existing `/trade` interface must remain unchanged from the user's perspective.

The backend must expose production abstractions for:

* order creation
* order cancellation
* order lookup
* order history
* trade history
* market status
* order book
* execution reports

---

# 31. Order Lifecycle

Required states:

```text
NEW
OPEN
PARTIALLY_FILLED
FILLED
CANCEL_PENDING
CANCELLED
REJECTED
EXPIRED
```

State transitions must be validated server-side.

---

# 32. Order Types

Initially support the existing UI's order model:

```text
MARKET
LIMIT
```

Architecture must allow future:

```text
STOP
STOP_LIMIT
TAKE_PROFIT
TAKE_PROFIT_LIMIT
```

without redesigning the API.

---

# 33. Order Idempotency

Order creation must support an idempotency key.

Example:

```http
Idempotency-Key: ord_req_xxx
```

If the same request is submitted twice, the platform must not create two orders.

This is mandatory for unreliable networks and production trading.

---

# 34. Order Validation

Backend validation must verify:

* authenticated user
* market exists
* market is active
* side is valid
* quantity precision
* price precision
* minimum order size
* maximum order size
* available balance
* locked balance
* trading restrictions
* account restrictions

Frontend validation is supplementary only.

---

# 35. Matching Engine Boundary

The PRD must not couple the web application directly to a matching engine.

Use:

```text
Trading API
     ↓
Trading Service
     ↓
Matching Engine Adapter
```

This allows ETHSLTD to integrate a real matching engine later.

---

# 36. Market Data

Create:

```text
services/realtime
```

The production market-data system must support:

```text
ticker
trades
order book
candles
market statistics
```

---

# 37. WebSocket Architecture

Use:

```text
Durable Objects
+
WebSockets
```

for realtime connection management.

Potential channels:

```text
ticker
orderbook
trades
candles
user.orders
user.trades
user.wallet
notifications
```

---

# 38. WebSocket Authentication

Private channels must require authenticated sessions.

A user must never be able to subscribe to another user's:

```text
orders
trades
wallet
notifications
```

---

# 39. Realtime Reliability

Implement:

* reconnect
* exponential backoff
* heartbeat
* ping/pong
* stale connection detection
* subscription recovery
* sequence numbers
* missed-message recovery
* graceful disconnect

---

# 40. Market Data Provider

Production market data must be abstracted:

```text
MarketDataProvider
```

with implementations such as:

```text
MockMarketDataProvider
ExternalMarketDataProvider
InternalMarketDataProvider
```

Production configuration selects the real provider.

---

# 41. P2P Production Architecture

Create:

```text
services/p2p
```

Existing:

```text
/p2p
/p2p/order/[id]
/p2p/orders
```

must become backed by persistent P2P records.

---

# 42. P2P Entities

Required:

```text
p2p_ads
p2p_orders
p2p_messages
p2p_disputes
p2p_payment_methods
p2p_escrow
p2p_events
```

---

# 43. P2P State Machine

Existing states must be retained:

```text
CREATED
PAYMENT_MARKED
COMPLETED
```

Production should additionally support:

```text
CANCELLED
EXPIRED
DISPUTED
RESOLVED
REFUNDED
```

Every transition must be server-authorized.

---

# 44. P2P Escrow

Escrow state must be represented independently from frontend state.

Example:

```text
AVAILABLE
LOCKED
RELEASED_TO_BUYER
RELEASED_TO_SELLER
REFUNDED
```

---

# 45. P2P Chat

Messages must be persisted.

Required:

```text
message ID
order ID
sender ID
message body
timestamp
message type
read status
system/user flag
```

---

# 46. Notifications

Existing notification infrastructure must move from:

```text
notification-store
+
MockNotificationProvider
```

to persistent production services.

Required categories:

```text
SECURITY
TRADING
WALLET
P2P
SYSTEM
SUPPORT
```

Critical security notifications cannot be disabled.

---

# 47. Notification Delivery

Architecture:

```text
Business Event
      ↓
Notification Service
      ↓
Queue
      ↓
Delivery Workers
      ↓
Email / Push / In-App
```

Use Cloudflare Queues for asynchronous delivery.

---

# 48. Email Infrastructure

Create an email provider abstraction:

```text
EmailProvider
```

Required transactional emails:

* registration
* email verification
* password reset
* login alert
* security change
* withdrawal request
* withdrawal completion
* deposit confirmation
* trade execution
* P2P order updates
* support ticket updates

The actual provider must be configurable.

---

# 49. Support Backend

Existing support pages must become database-backed.

Entities:

```text
support_tickets
support_messages
support_categories
support_attachments
support_assignments
support_events
```

---

# 50. Ticket Lifecycle

Required:

```text
OPEN
WAITING_FOR_USER
WAITING_FOR_SUPPORT
RESOLVED
CLOSED
```

Every transition must create an audit event.

---

# 51. Admin Support

The existing:

```text
/admin/support
/admin/support/tickets/[id]
```

must connect to the same production support system used by users.

Internal notes must never be exposed through customer APIs.

---

# 52. API Developer Platform

The existing API Developer Platform must move from mock playground responses to real API contracts.

Required:

```text
API Keys
Permissions
IP restrictions
Test keys
Live keys
Usage
Rate limits
WebSocket access
Key revocation
Audit trail
```

---

# 53. API Key Security

API secrets must:

* be generated server-side
* be shown only once
* never be stored plaintext
* be hashed/encrypted appropriately
* support revocation
* support rotation
* support expiration

---

# 54. API Permissions

At minimum:

```text
READ
TRADE
WITHDRAW
```

Withdrawal permission must receive additional security controls.

---

# 55. API Rate Limiting

Rate limiting must exist at:

```text
IP level
user level
API key level
endpoint level
WebSocket connection level
```

Use Cloudflare KV or another appropriate distributed mechanism for rate-limit state where suitable.

---

# 56. Audit System

Create a central:

```text
audit_logs
```

service.

Every sensitive action must generate an audit event.

Examples:

```text
LOGIN
LOGOUT
PASSWORD_CHANGED
MFA_ENABLED
MFA_DISABLED
API_KEY_CREATED
API_KEY_REVOKED
WITHDRAWAL_CREATED
WITHDRAWAL_APPROVED
WITHDRAWAL_REJECTED
ORDER_CREATED
ORDER_CANCELLED
P2P_DISPUTE_RESOLVED
USER_FROZEN
USER_UNFROZEN
ADMIN_ACTION
SETTINGS_CHANGED
```

---

# 57. Audit Event Structure

Each event should include:

```text
eventId
actorId
actorType
action
resourceType
resourceId
timestamp
IP
userAgent
requestId
metadata
result
```

Audit records must be append-only.

---

# 58. Risk Engine Boundary

Create:

```text
services/risk
```

The initial system should provide a risk-service abstraction.

It must evaluate:

* account restrictions
* withdrawal risk
* suspicious login
* abnormal trading
* P2P risk
* API key activity
* transaction risk

---

# 59. Risk Decision Model

Use:

```text
ALLOW
REVIEW
BLOCK
```

Example:

```text
Withdrawal
    ↓
Risk Engine
    ↓
ALLOW → Continue
REVIEW → Admin Queue
BLOCK → Reject
```

---

# 60. KYC Integration Boundary

The existing KYC interface should connect to:

```text
KYCProvider
```

rather than embedding vendor-specific logic into the UI.

Required states:

```text
NOT_STARTED
PENDING
UNDER_REVIEW
VERIFIED
REJECTED
EXPIRED
```

The current Admin Console already includes a KYC review queue. 

---

# 61. Object Storage

Use:

```text
Cloudflare R2
```

for appropriate objects such as:

* KYC documents
* support attachments
* user-uploaded profile assets
* generated reports

Sensitive files must not be publicly accessible.

---

# 62. R2 Security

Use:

* private buckets
* signed URLs
* expiration
* authorization checks
* MIME validation
* file-size limits
* malware scanning/integration boundary
* metadata restrictions

---

# 63. Cache & Configuration

Use:

```text
Cloudflare KV
```

for suitable:

* configuration
* cached market metadata
* rate-limit state
* feature flags
* temporary non-authoritative data

Do not use KV as the authoritative financial ledger.

---

# 64. Background Jobs

Use:

```text
Cloudflare Queues
Cloudflare Cron
```

for:

* notification delivery
* expired P2P orders
* expired sessions
* reconciliation
* market-data maintenance
* report generation
* cleanup jobs
* scheduled risk checks
* health checks

---

# 65. Queue Requirements

Every asynchronous job must support:

```text
job ID
attempt count
created timestamp
status
retry
dead-letter handling
error information
```

Jobs must be idempotent.

---

# 66. Reconciliation

Production financial systems require reconciliation.

Create reconciliation processes for:

```text
wallet ↔ ledger
ledger ↔ provider
deposits ↔ blockchain
withdrawals ↔ blockchain
trades ↔ executions
P2P ↔ escrow
```

Any mismatch must generate an operational alert.

---

# 67. Financial Invariants

The system must continuously validate:

```text
available + locked = total
```

and ledger totals against account balances.

Impossible states must be rejected.

Examples:

```text
negative available balance
negative locked balance
locked > total
duplicate ledger entry
duplicate withdrawal
duplicate trade
```

---

# 68. Database Transactions

Financial operations must be atomic wherever the database supports the required transaction semantics.

Example:

```text
Create withdrawal
+
Lock funds
+
Create ledger entry
+
Create audit event
```

must not leave the system half-completed.

---

# 69. Idempotency

Idempotency must exist for:

```text
deposit processing
withdrawal creation
order creation
P2P order creation
notification delivery
webhook handling
ledger operations
external provider callbacks
```

---

# 70. Webhook Security

External providers must be able to call secure webhooks.

Each webhook must support:

* signature verification
* timestamp validation
* replay protection
* idempotency
* event ID tracking
* audit logging

---

# 71. Environment Architecture

Define:

```text
local
development
preview
staging
production
```

Each environment must have separate:

* database
* secrets
* API keys
* storage
* queues
* KV namespaces
* Durable Objects
* external provider credentials

---

# 72. Production Configuration

Never hardcode:

```text
API URLs
database IDs
tokens
provider keys
secret keys
JWT secrets
email credentials
webhook secrets
```

Use environment bindings/secrets.

---

# 73. Secret Management

Secrets must be:

* server-side
* environment-specific
* rotated
* excluded from Git
* excluded from client bundles
* excluded from logs

Add secret scanning to CI.

---

# 74. Repository Architecture

The target architecture should align with the existing design-system specification:

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
└── .github/
    └── workflows/
```

This structure is already established in the project's design/technology specification. 

---

# 75. Shared Packages

Production migration must maximize shared contracts.

## `packages/types`

Contains:

```text
User
Market
Order
Trade
Wallet
LedgerEntry
P2POrder
Notification
SupportTicket
ApiKey
AuditEvent
```

---

# 76. Validation

Create shared Zod schemas for:

```text
authentication
orders
wallet operations
P2P
API keys
support
admin actions
```

Frontend and backend must use the same validation definitions where appropriate.

---

# 77. API Client

Create:

```text
packages/api-client
```

Responsibilities:

* typed requests
* typed responses
* error normalization
* authentication
* request IDs
* retries where appropriate
* WebSocket helpers

---

# 78. TanStack Query

Use TanStack Query for server state where appropriate.

Zustand should remain focused on:

* UI state
* local state
* session-independent interaction state

It should not become the authoritative server-state database.

---

# 79. Existing Stores

Existing stores must be reviewed.

For example:

```text
paper-account-store.ts
trading-ui-store.ts
wallet-store.ts
notification-store.ts
support-store.ts
useAuthStore
```

Production stores should become thin client-side representations of server state.

---

# 80. Production Provider Pattern

Maintain the current provider abstraction.

Example:

```ts
interface TradingProvider {
  createOrder(...)
  cancelOrder(...)
  getOrders(...)
  getTrades(...)
}
```

Implement:

```text
MockTradingProvider
ProductionTradingProvider
```

This preserves the existing UI architecture.

---

# 81. Feature Flags

Production infrastructure should support controlled feature activation.

Example:

```text
ENABLE_LIVE_TRADING
ENABLE_P2P
ENABLE_WITHDRAWALS
ENABLE_DEPOSITS
ENABLE_API_TRADING
ENABLE_LIVE_MARKET_DATA
ENABLE_EXTERNAL_KYC
```

Critical financial functionality should default to disabled until configured correctly.

---

# 82. Kill Switches

Administrators must be able to disable:

```text
trading
withdrawals
deposits
P2P
API trading
specific markets
specific assets
```

without deploying new frontend code.

Every kill-switch action must be audited.

---

# 83. System Status

The existing platform should expose system health to authorized administrators.

Status categories:

```text
Operational
Degraded
Partial Outage
Major Outage
Maintenance
```

Components:

```text
API
Database
Realtime
Trading
Wallet
P2P
Notifications
External Providers
```

---

# 84. Health Endpoints

Provide:

```text
/health
/health/live
/health/ready
```

Separate:

```text
liveness
readiness
dependency health
```

Do not expose sensitive infrastructure information publicly.

---

# 85. Observability

Production must include:

### Logs

Structured JSON logs.

### Metrics

Track:

```text
request count
latency
error rate
database latency
WebSocket connections
queue failures
authentication failures
withdrawal failures
order failures
P2P failures
```

### Tracing

Where supported, connect:

```text
request
→ API
→ service
→ database/provider
```

using the same request/correlation ID.

---

# 86. Error Monitoring

Production exceptions must be captured.

Required metadata:

```text
requestId
environment
route
user ID where appropriate
service
timestamp
error code
```

Never send:

* passwords
* API secrets
* private keys
* full authentication tokens
* sensitive financial credentials

to error monitoring systems.

---

# 87. Security Monitoring

Monitor:

* brute force
* abnormal login patterns
* repeated failed MFA
* API abuse
* suspicious withdrawal activity
* unusual trading activity
* privilege escalation attempts
* unauthorized admin access
* excessive support activity

---

# 88. Rate Limiting

Apply rate limits to:

```text
login
register
password reset
email verification
withdrawal
order creation
API endpoints
support messaging
webhooks
```

Different limits should exist for different risk levels.

---

# 89. CORS

CORS must be explicitly configured.

Do not use:

```text
Access-Control-Allow-Origin: *
```

for authenticated financial APIs.

Allow only configured trusted origins.

---

# 90. Security Headers

Production web/API responses should include appropriate headers such as:

```text
Content-Security-Policy
Strict-Transport-Security
X-Content-Type-Options
Referrer-Policy
Permissions-Policy
```

Configure carefully so the trading application continues functioning.

---

# 91. Content Security Policy

CSP must account for existing integrations such as:

* Tawk.to
* charting
* API endpoints
* WebSockets

but should remain as restrictive as practical.

---

# 92. Tawk.to

The existing Tawk.to integration must remain functional.

However:

* third-party script loading must be controlled
* CSP must explicitly allow required origins
* no sensitive user information should be passed to Tawk.to unnecessarily

---

# 93. Data Privacy

Production APIs must follow data minimization.

Only expose fields required by each screen.

For example, customer API must never return:

```text
internal risk score
internal admin notes
private KYC review notes
internal audit metadata
staff-only information
```

---

# 94. Admin Data Isolation

Customer and admin APIs must be separated.

Example:

```text
/api/v1/users/me
```

versus:

```text
/api/v1/admin/users/:id
```

Admin endpoints require explicit administrative permission.

---

# 95. File Upload Security

All uploads must validate:

```text
file size
MIME type
extension
filename
content
authorization
ownership
```

Never trust browser-provided MIME type alone.

---

# 96. Database Backup & Recovery

Production database strategy must include:

* automated backups where supported
* migration history
* recovery procedure
* restoration testing
* backup retention policy
* disaster recovery documentation

A backup that has never been restored/tested must not be considered reliable.

---

# 97. Disaster Recovery

Document:

```text
RPO
RTO
backup procedure
restore procedure
database recovery
storage recovery
secret recovery
DNS recovery
deployment recovery
```

The actual values must be established before production launch.

---

# 98. CI/CD

GitHub Actions must validate every pull request.

Pipeline:

```text
Install
 ↓
Typecheck
 ↓
Lint
 ↓
Unit Tests
 ↓
Build
 ↓
Integration Tests
 ↓
E2E Tests
 ↓
Security Checks
 ↓
Deploy Preview
```

Production deployment requires successful checks.

---

# 99. Testing Requirements

The platform must use:

```text
Vitest
Playwright
```

as already established in the technology stack. 

---

# 100. Unit Tests

Test:

* financial calculations
* fee calculations
* precision
* order validation
* wallet calculations
* ledger rules
* P2P state transitions
* risk decisions
* notification rules
* authorization
* API validation

---

# 101. Integration Tests

Test:

```text
API → database
API → ledger
API → wallet
API → trading
API → P2P
API → notifications
API → support
API → audit
```

---

# 102. E2E Tests

Critical user flows:

### Registration

```text
Register
→ Verify
→ Login
→ Account
```

### Trading

```text
Login
→ Markets
→ Trade
→ Create Order
→ View Order
→ Cancel
```

### Wallet

```text
Login
→ Wallet
→ Deposit
→ View Balance
→ Withdraw
```

### P2P

```text
Login
→ P2P
→ Select Offer
→ Create Order
→ Mark Payment
→ Complete
```

### Support

```text
Login
→ Support
→ Create Ticket
→ Reply
→ Resolve
```

---

# 103. Admin E2E Tests

Test:

```text
Admin Login
→ Permission Check
→ User Search
→ User Inspection
→ KYC Review
→ Withdrawal Review
→ P2P Dispute
→ Audit Log
```

---

# 104. Security Testing

Automated checks should include:

* dependency vulnerabilities
* secret scanning
* authorization tests
* authentication tests
* rate-limit tests
* malformed input
* SQL injection resistance
* XSS resistance
* CSRF resistance
* IDOR protection
* privilege escalation protection

---

# 105. Accessibility

All production screens must preserve the existing accessibility standard.

Required:

* keyboard navigation
* focus indicators
* screen-reader labels
* semantic HTML
* accessible dialogs
* accessible tables
* accessible forms
* sufficient contrast

The existing design system specifically requires keyboard accessibility, focus states, loading states, error states and responsive testing. 

---

# 106. Responsive Requirements

Every production-backed screen must continue supporting:

```text
Mobile
Tablet
Desktop
Large Desktop
```

No backend migration should cause layout regressions.

---

# 107. Theme Requirements

Continue supporting:

```text
Light
Dark
System
```

Theme switching must not affect:

* financial calculations
* data state
* charts
* realtime connections
* authentication

The existing design system requires Light/Dark/System support and prevention of theme-related layout or chart problems. 

---

# 108. Design Consistency

The production backend work must not create a new design language.

Continue using:

```text
Marine
Midnight
Frost
Slate
Selective Brass
Inter
Space Grotesk
JetBrains Mono
8px grid
```

The established design formula is explicitly defined this way. 

---

# 109. Financial UI States

All financial components must support:

```text
Price Up
Price Down
Partial
Locked
Pending
Restricted
```

alongside:

```text
Loading
Success
Error
Empty
```

This is already part of the ETHSLTD design-system contract. 

---

# 110. Production Data States

Every API-backed screen must handle:

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

No screen may display a blank state when an API fails. 

---

# 111. Offline / Connection Handling

The application should clearly distinguish:

```text
No Internet
API unavailable
WebSocket disconnected
Session expired
Server maintenance
```

Trading screens must never imply that an order was submitted if the client cannot confirm submission.

---

# 112. Transaction Confirmation

Financial actions require explicit confirmation.

For example:

```text
Withdraw
```

must show:

```text
Asset
Amount
Network
Destination
Fee
Total
Estimated arrival
```

before final confirmation.

---

# 113. Production Logging Rules

Never log:

```text
password
OTP
2FA secret
API secret
private key
wallet private key
authentication token
full payment credentials
```

Financial logs must be appropriately redacted.

---

# 114. Data Retention

Define retention policies for:

```text
audit logs
authentication logs
support messages
notifications
financial ledger
API usage
system logs
```

Financial records must not be deleted merely because UI records expire.

---

# 115. Production Admin Enhancements

The existing Admin Console must become the operational control plane.

It should be able to inspect:

```text
users
KYC
deposits
withdrawals
orders
trades
P2P
disputes
risk
support
notifications
API usage
audit logs
system health
```

The existing Admin PRD specifically defines the console as the operational layer above the customer-facing systems. 

---

# 116. Admin Financial Actions

Sensitive actions must require:

```text
permission
+
confirmation
+
reason
+
audit event
```

For highly sensitive actions:

```text
dual approval
```

should be architecturally supported.

---

# 117. Audit Confirmation

Example:

```text
Admin freezes User #123
        ↓
Confirmation dialog
        ↓
Reason required
        ↓
Permission verified
        ↓
Backend mutation
        ↓
Audit event created
        ↓
Notification
        ↓
UI updated
```

This preserves the existing Admin flow principle of:

```text
authorized action
→ confirmation
→ business logic
→ state update
→ audit event
→ feedback
```

which is already defined in the Admin architecture. 

---

# 118. Production API Documentation

The Developer Platform must expose:

```text
REST API documentation
WebSocket documentation
authentication
rate limits
errors
pagination
filters
examples
SDK examples
webhooks
```

API contracts should be versioned.

---

# 119. API Versioning

Current:

```text
/api/v1
```

Future breaking changes:

```text
/api/v2
```

Do not silently break existing API consumers.

---

# 120. Pagination

All potentially large endpoints must support cursor-based pagination where appropriate.

Examples:

```text
transactions
orders
trades
notifications
support messages
audit logs
admin users
API usage
```

---

# 121. Search

Search must be server-side for large datasets.

Examples:

```text
users
transactions
orders
trades
tickets
audit events
```

Never download thousands of records to the browser just to filter them.

---

# 122. Performance Targets

Production application should target:

```text
Fast initial page rendering
Low API latency
Low WebSocket latency
No unnecessary client re-renders
Efficient database queries
Efficient pagination
```

Financial screens must prioritize correctness over cosmetic animation.

---

# 123. Bundle Performance

Avoid unnecessary dependencies.

The existing design system explicitly prohibits unnecessary dependencies and requires performance-conscious trading UI. 

---

# 124. Caching

Cache only data that is safe to cache.

Suitable examples:

```text
market metadata
public market configuration
static documentation
public educational content
```

Do not blindly cache:

```text
wallet balances
withdrawal status
private orders
private trades
admin permissions
```

---

# 125. Database Query Standards

Queries must:

* use indexes
* avoid N+1 queries
* use pagination
* avoid unnecessary columns
* use transactions for financial operations
* enforce authorization at service level

---

# 126. Database Indexes

Indexes must exist for high-frequency lookups such as:

```text
user_id
email
order_id
market_id
transaction_id
wallet_id
ticket_id
created_at
status
```

Composite indexes should be introduced based on actual query patterns.

---

# 127. Data Integrity

Use database constraints for:

* unique emails
* unique IDs
* valid relationships
* non-null financial fields
* valid statuses where practical

Application validation must not be the only integrity layer.

---

# 128. Production Seed Data

Production must not be populated with fake:

```text
users
balances
trades
withdrawals
deposits
```

unless explicitly created as test/sandbox data.

Mock fixtures must remain isolated.

---

# 129. Testnet / Sandbox

The architecture should support a clearly separated:

```text
TEST
```

environment for:

* fake balances
* fake trading
* mock blockchain
* mock payments
* API testing

Test assets must never be confused with production assets.

---

# 130. Production UI Labeling

When an environment is not production, clearly indicate:

```text
TESTNET
SANDBOX
DEMO
```

so users cannot mistake simulated balances or trades for real funds.

---

# 131. External Provider Architecture

External integrations must use adapters.

Example:

```text
KYCProvider
PaymentProvider
BlockchainProvider
MarketDataProvider
EmailProvider
PushProvider
RiskProvider
CustodyProvider
```

Never spread vendor-specific code throughout UI components.

---

# 132. Provider Failure

Every provider integration must support:

```text
timeout
retry
failure
partial failure
maintenance
fallback where safe
```

Financial operations must never silently retry unsafe mutations.

---

# 133. External Provider Reconciliation

Provider responses must be stored with:

```text
provider
providerTransactionId
status
requestId
createdAt
updatedAt
raw event reference
```

Sensitive raw payloads must be appropriately protected.

---

# 134. Production Deployment

Cloudflare remains the target infrastructure.

Existing technology specification identifies:

```text
Cloudflare Workers
Cloudflare D1
Cloudflare R2
Cloudflare KV
Cloudflare Durable Objects
Cloudflare Queues
Cloudflare Cron
```

as the intended infrastructure stack. 

The deployment configuration must be standardized rather than maintaining ad-hoc hosting configurations.

---

# 135. Cloudflare Infrastructure

Create:

```text
infrastructure/cloudflare/
```

with infrastructure/configuration definitions for:

```text
Workers
D1
R2
KV
Durable Objects
Queues
Cron
environment bindings
routes
domains
```

---

# 136. Domain Architecture

Recommended logical separation:

```text
www.ethsltd.com
api.ethsltd.com
ws.ethsltd.com
admin.ethsltd.com
```

Exact domain names should remain configurable.

---

# 137. TLS

All production traffic must use HTTPS/WSS.

No production financial API should accept insecure HTTP communication.

---

# 138. Production Release Protection

Production deployment should require:

```text
CI success
typecheck success
lint success
tests success
build success
security checks
migration validation
approval
```

---

# 139. Database Migration Safety

Before production deployment:

```text
Validate migration
 ↓
Backup
 ↓
Apply migration
 ↓
Verify schema
 ↓
Deploy application
```

Application changes must remain compatible with the deployed schema during migration transitions.

---

# 140. Rollback

Deployment must support application rollback.

Database rollback must be handled through safe forward migrations where destructive rollback is unsafe.

Never assume database rollback is equivalent to application rollback.

---

# 141. Incident Management

Create operational documentation for:

```text
API outage
Database outage
Realtime outage
Trading outage
Withdrawal outage
Deposit outage
P2P outage
Email outage
External provider outage
Security incident
Data inconsistency
```

---

# 142. Incident Severity

At minimum:

```text
SEV-1 Critical
SEV-2 High
SEV-3 Medium
SEV-4 Low
```

Examples:

### SEV-1

```text
incorrect balances
unauthorized withdrawals
database corruption
trading execution failure
major security breach
```

---

# 143. Emergency Controls

Authorized administrators must have emergency controls for:

```text
disable trading
disable withdrawals
disable deposits
disable P2P
disable API trading
freeze individual account
freeze asset
freeze market
```

Every emergency action must be audited.

---

# 144. Security Review

Before production activation, review:

```text
authentication
authorization
RBAC
API keys
secrets
database
ledger
withdrawals
wallet
P2P
webhooks
uploads
admin controls
rate limits
CORS
CSP
logging
audit
```

---

# 145. Financial Safety Principle

The most important rule:

> **The browser is never the source of truth for money.**

The authoritative sources must be:

```text
Database
+
Ledger
+
Backend business logic
+
Verified external provider state
```

---

# 146. Frontend Responsibility After Migration

The frontend should be responsible for:

* presentation
* interaction
* optimistic UI only where safe
* local UI state
* caching
* validation for UX
* realtime rendering

It must not be responsible for authoritative:

* balances
* order execution
* ledger calculations
* withdrawal approval
* permissions

---

# 147. Backend Responsibility

Backend owns:

```text
authentication
authorization
financial calculations
ledger
balance mutations
orders
trades
withdrawals
deposits
P2P state
risk
audit
notifications
support permissions
API keys
rate limits
```

---

# 148. Production Definition of Done

This PRD is complete only when:

### Infrastructure

* [ ] Production Cloudflare environments exist
* [ ] D1 configured
* [ ] R2 configured
* [ ] KV configured
* [ ] Durable Objects configured
* [ ] Queues configured
* [ ] Cron configured
* [ ] Secrets configured

### Backend

* [ ] API service operational
* [ ] Database migrations operational
* [ ] Authentication operational
* [ ] RBAC operational
* [ ] Ledger operational
* [ ] Wallet API operational
* [ ] Trading API operational
* [ ] P2P API operational
* [ ] Notifications operational
* [ ] Support API operational
* [ ] Admin API operational
* [ ] Developer API operational

### Realtime

* [ ] WebSocket infrastructure operational
* [ ] Authentication implemented
* [ ] Reconnection implemented
* [ ] Order updates implemented
* [ ] Market updates implemented
* [ ] Private user channels secured

### Security

* [ ] Secrets removed from frontend
* [ ] Rate limiting active
* [ ] CORS configured
* [ ] CSP configured
* [ ] RBAC verified
* [ ] Audit logging active
* [ ] Webhook verification active
* [ ] Sensitive logging removed
* [ ] Security tests passing

### Financial

* [ ] Double-entry ledger operational
* [ ] Balance invariants implemented
* [ ] Idempotency implemented
* [ ] Transaction consistency verified
* [ ] USD formatting standardized
* [ ] Decimal precision standardized
* [ ] Withdrawal controls implemented
* [ ] Reconciliation framework implemented

### Quality

* [ ] Unit tests passing
* [ ] Integration tests passing
* [ ] E2E tests passing
* [ ] TypeScript passing
* [ ] Lint passing
* [ ] Build passing
* [ ] Accessibility checked
* [ ] Mobile checked
* [ ] Dark mode checked
* [ ] Light mode checked
* [ ] No console errors
* [ ] No mock data in production

### Operations

* [ ] Monitoring operational
* [ ] Logging operational
* [ ] Error tracking operational
* [ ] Health checks operational
* [ ] Incident documentation created
* [ ] Backup strategy documented
* [ ] Recovery process documented
* [ ] Deployment rollback documented

---

# 149. Explicit Non-Goals

This PRD establishes the **production platform foundation**.

It does not by itself certify ETHSLTD for regulated financial operation.

It does not automatically provide:

* legal authorization
* financial licensing
* AML certification
* regulatory approval
* banking relationships
* custody licensing
* payment processor approval
* blockchain-node operation
* KYC vendor approval
* real-money settlement approval

Those require external legal, regulatory, financial and infrastructure decisions.

The existing Admin PRD likewise distinguishes production UI architecture from external regulatory/compliance certification and real-money infrastructure. 

---

# 150. Final Production Architecture

The target ETHSLTD architecture should ultimately look like:

```text
                         USERS
                           │
                           ▼
                 ┌─────────────────┐
                 │   Next.js Web   │
                 │   apps/web      │
                 └────────┬────────┘
                          │
                    API Client
                          │
                          ▼
                ┌────────────────────┐
                │ Cloudflare Workers │
                │       Hono         │
                └─────────┬──────────┘
                          │
          ┌───────────────┼────────────────┐
          │               │                │
          ▼               ▼                ▼
     Auth Service     Trading Service   Wallet
          │               │                │
          │               ▼                ▼
          │          Matching Adapter    Ledger
          │                                │
          ├──────────────┬─────────────────┤
          │              │                 │
          ▼              ▼                 ▼
        P2P          Notifications       Risk
          │              │                 │
          └──────────────┼─────────────────┘
                         │
                         ▼
                 ┌───────────────┐
                 │ Cloudflare D1 │
                 └───────────────┘

                         │
          ┌──────────────┼────────────────┐
          ▼              ▼                ▼
       Cloudflare       R2            Cloudflare
          KV                            Queues
          │                               │
          ▼                               ▼
     Configuration                  Background Jobs


                  REALTIME LAYER
                         │
                         ▼
                Durable Objects
                         │
                         ▼
                    WebSockets
                         │
          ┌──────────────┼──────────────┐
          ▼              ▼              ▼
       Markets         Orders        User Events


                  EXTERNAL PROVIDERS
                         │
        ┌────────────────┼─────────────────┐
        ▼                ▼                 ▼
     Blockchain         KYC             Payments
        │                │                 │
        ▼                ▼                 ▼
      Custody         Email/Push       Market Data
```

---

# 151. Final Product Principle

The completed ETHSLTD platform must evolve from:

> **A highly complete simulated crypto platform**

into:

> **A production-grade financial technology platform whose existing UI is backed by authoritative, secure, auditable backend services.**

The current project already has the important customer-facing foundation: Markets, Trade, Authentication, Account, P2P, Wallet, Admin, Notifications/Support and API/Developer functionality. The existing architecture was deliberately designed around provider abstraction so those interfaces can now be connected to real services without rebuilding the product UI. 

The most important architectural rule going forward is:

```text
UI
 ↓
Typed API
 ↓
Business Services
 ↓
Ledger / Database / Realtime
 ↓
External Providers
```

**Never:**

```text
UI
 ↓
Direct financial mutation
```

And never allow:

```text
Mock Provider
 ↓
Production
```

The ETHSLTD design system also explicitly states that production must not use fake live data and that financial calculations should not live inside presentation components. 

### Recommended file

```text
ETHSLTD-PRD-11-Production-Backend-Infrastructure-Platform.md
```

This is the PRD I would treat as the **next master implementation contract** before adding another major user-facing feature.
