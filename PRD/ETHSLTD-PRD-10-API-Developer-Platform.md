Yes. I reviewed the project context available in this conversation and the relevant project documents, including the existing Admin & Operations Console requirements, the Notifications/Support implementation record, and the ETHSLTD design/architecture specification.

The important consistency point is that **Admin & Operations** and **Notifications, Communication & Support** are already represented as implemented modules. The Admin Console already provides the operational control layer, while Notifications/Support already provides user alerts, tickets, conversations, and admin support controls. 

Therefore, I would **not** create another PRD for either of those modules.

# Next PRD

## `ETHSLTD-PRD-09-API-DEVELOPER-PLATFORM-USD.md`

**Product:** ETHSLTD Crypto
**Module:** API & Developer Platform
**Primary public route:** `/developers`
**Primary API namespace:** `/api/v1/*`
**Currency standard:** **USD**
**Document version:** 1.0
**Status:** Ready for Development
**Scope:** Developer/API platform only
**Architecture:** Must remain compatible with the existing ETHSLTD Next.js + TypeScript + Zustand + Zod + mock-provider architecture.

This is the logical next product module because ETHSLTD already has the customer-facing exchange, markets, trading, wallet, P2P, authentication, account/security, admin and support layers. The existing design specification also explicitly identifies **API, developer platform, institutional and advanced trading** as part of the ETHSLTD ecosystem. 

---

# ETHSLTD Crypto — API & Developer Platform

## Complete Product Requirements Document

---

## 1. Document Purpose

This PRD defines the complete **ETHSLTD API & Developer Platform**.

The objective is to provide developers, algorithmic traders, professional users, institutions and internal engineering teams with a structured way to:

* discover ETHSLTD APIs
* create API credentials
* manage API keys
* view API permissions
* access market data
* access account data
* access wallet data
* access trading functionality
* access order information
* access trade history
* access P2P information where permitted
* receive real-time market updates
* receive account/order events
* test integrations safely
* inspect API usage
* manage API security
* read technical documentation
* test endpoints
* understand request/response schemas
* generate code examples
* monitor API errors
* manage rate limits
* revoke credentials
* transition from mock API behavior to production REST/WebSocket infrastructure later.

This is **not** a production exchange backend implementation.

The current implementation must provide a complete frontend developer experience and mock API architecture that can later connect to real Cloudflare Workers/API services.

---

# 2. Existing ETHSLTD Product Context

The following systems already exist and must remain unchanged unless an API integration requires a reusable shared contract:

| Module           | Route                       | Status   |
| ---------------- | --------------------------- | -------- |
| Homepage         | `/`                         | Complete |
| Markets          | `/markets`                  | Complete |
| Trading Terminal | `/trade`                    | Complete |
| Authentication   | `/login`, `/register`, etc. | Complete |
| Account          | `/account/*`                | Complete |
| P2P              | `/p2p`                      | Complete |
| P2P Orders       | `/p2p/orders`               | Complete |
| Wallet           | `/wallet`                   | Complete |
| Deposit          | `/wallet/deposit`           | Complete |
| Withdrawal       | `/wallet/withdraw`          | Complete |
| Wallet History   | `/wallet/history`           | Complete |
| Admin            | `/admin/*`                  | Complete |
| Notifications    | `/notifications`            | Complete |
| Support          | `/support/*`                | Complete |

The existing mock-provider architecture is specifically designed so that simulated functionality can later be replaced by production services without rebuilding the UI. The API platform must follow exactly the same principle. 

---

# 3. Product Objective

The Developer Platform should answer:

> **How can a developer safely connect an application or trading system to ETHSLTD?**

A developer should be able to move through:

```text
Developer Portal
      ↓
Read Documentation
      ↓
Create API Key
      ↓
Select Permissions
      ↓
Configure Security
      ↓
Test API
      ↓
Inspect Response
      ↓
Review Usage
      ↓
Build Integration
      ↓
Connect WebSocket
      ↓
Monitor Application
```

---

# 4. Target Users

## 4.1 Individual Developers

Developers building:

* portfolio trackers
* market dashboards
* personal trading tools
* trading bots
* analytics tools
* notification systems.

## 4.2 Algorithmic Traders

Users building:

* automated strategies
* order execution systems
* market-making tools
* quantitative systems.

## 4.3 Professional Traders

Users requiring:

* programmatic trading
* automated portfolio management
* real-time market data.

## 4.4 Institutional Developers

Future users integrating:

* treasury systems
* trading systems
* financial platforms
* institutional reporting systems.

## 4.5 Internal ETHSLTD Engineers

The same contracts should become the foundation for future:

* web frontend
* mobile applications
* admin tools
* trading services
* internal services.

---

# 5. Scope

## Included

### Developer Portal

* `/developers`
* `/developers/docs`
* `/developers/api`
* `/developers/websocket`
* `/developers/sdks`
* `/developers/changelog`
* `/developers/status`

### API Key Management

* create key
* rename key
* view key metadata
* permissions
* IP restrictions
* revoke key
* regenerate secret
* last-used information
* created date
* expiration
* status.

### REST API Documentation

Document:

* authentication
* market endpoints
* account endpoints
* wallet endpoints
* trading endpoints
* orders
* trades
* P2P endpoints where applicable
* errors
* rate limits.

### WebSocket Documentation

Document:

* connection
* authentication
* subscriptions
* market channels
* order-book channels
* ticker channels
* candle channels
* account channels
* order updates
* trade updates
* reconnect behavior.

### API Playground

Allow developers to:

* select endpoint
* configure parameters
* configure headers
* send mock request
* inspect response
* view generated request
* copy code.

### Usage Dashboard

Display:

* request count
* successful requests
* failed requests
* rate-limit events
* WebSocket connections
* last API activity
* endpoint usage.

---

# 6. Developer Portal Information Architecture

Navigation:

```text
ETHSLTD DEVELOPERS

GET STARTED
  Overview
  Quick Start
  Authentication

API
  Market Data
  Trading
  Orders
  Account
  Wallet
  P2P

REALTIME
  WebSocket
  Channels
  Events

TOOLS
  API Playground
  Code Examples
  SDKs

ACCOUNT
  API Keys
  Usage
  Security

RESOURCES
  Changelog
  Status
  Error Codes
  FAQ
```

---

# 7. Developer Homepage `/developers`

## Hero

### Heading

> **Build with ETHSLTD**

### Supporting copy

> Connect applications, trading systems and market-data tools to ETHSLTD through secure APIs and real-time data infrastructure.

Primary CTA:

**Read the API Docs**

Secondary:

**Create API Key**

Third:

**Try API Playground**

---

# 8. Developer Homepage Sections

## 8.1 API Overview

Cards:

* REST API
* WebSocket API
* Market Data
* Trading API
* Account API
* Wallet API.

---

## 8.2 Why ETHSLTD API

Display:

* secure authentication
* structured JSON responses
* predictable schemas
* real-time WebSocket data
* trading endpoints
* account endpoints
* developer tooling
* rate-limit transparency.

---

# 9. Quick Start

Display a four-step integration:

```text
1. Create Account
        ↓
2. Create API Key
        ↓
3. Authenticate Request
        ↓
4. Make Your First API Call
```

CTA:

**Start Building**

---

# 10. API Key Management

Primary route:

```text
/account/api-keys
```

Optional developer-specific route:

```text
/developers/api-keys
```

Prefer reusing the existing account architecture rather than creating a second credential-management system.

---

# 11. API Key Dashboard

Display:

| Field          | Example         |
| -------------- | --------------- |
| Name           | Trading Bot     |
| Key ID         | `eth_live_xxxx` |
| Status         | Active          |
| Permissions    | Read / Trade    |
| Created        | Aug 13, 2026    |
| Last Used      | 2 min ago       |
| IP Restriction | Enabled         |
| Expiration     | Never           |

Never display the complete secret after creation.

---

# 12. Create API Key

Form fields:

### Name

Required.

Example:

```text
My Trading Bot
```

### Environment

```text
Test
Live
```

For current implementation, these remain simulated.

### Permissions

#### Read

* market data
* account balances
* orders
* trades
* transaction history.

#### Trade

* create orders
* cancel orders
* modify supported orders.

#### Withdraw

Must be a separate high-risk permission.

Default:

**Disabled**

Never enable automatically.

---

# 13. Security Restrictions

Support:

### IP Allowlist

```text
192.168.1.1
203.0.113.0/24
```

### Expiration

Options:

* never
* 30 days
* 90 days
* 180 days
* 1 year.

### Withdrawal Lock

Display a prominent warning:

> Withdrawal API access should only be enabled when absolutely necessary.

---

# 14. API Key Creation Confirmation

After creation:

```text
API Key Created

API Key:
eth_live_****************

Secret:
***********************

You will only be able to view the secret once.
Store it securely.
```

Buttons:

* Copy API Key
* Copy Secret
* Download Credentials
* Done.

Never store plaintext secrets in frontend localStorage.

---

# 15. API Key Revocation

Clicking:

**Revoke**

opens confirmation:

> Are you sure you want to revoke this API key?

Display:

* key name
* permissions
* last used
* creation date.

Confirmation:

**Revoke API Key**

After revocation:

```text
Status: Revoked
```

All simulated API requests using that key must fail.

---

# 16. REST API

Base URL should be abstracted:

```text
https://api.ethsltd.com/api/v1
```

For development/mock mode, do not hardcode production endpoints throughout components.

Use environment configuration.

---

# 17. REST API Categories

## 17.1 Public Market API

Endpoints:

```text
GET /markets
GET /markets/{symbol}
GET /ticker
GET /tickers
GET /orderbook/{symbol}
GET /candles/{symbol}
GET /trades/{symbol}
```

---

# 18. Market Endpoint

Example:

```http
GET /api/v1/markets
```

Response:

```json
{
  "success": true,
  "data": [
    {
      "symbol": "BTC/USD",
      "baseAsset": "BTC",
      "quoteAsset": "USD",
      "price": "104250.00",
      "change24h": "2.14",
      "volume24h": "1250000000"
    }
  ]
}
```

All monetary values displayed in the developer portal must use **USD**.

---

# 19. Ticker API

```text
GET /ticker
GET /ticker/{symbol}
```

Response fields:

* symbol
* price
* bid
* ask
* high24h
* low24h
* volume24h
* change24h
* timestamp.

---

# 20. Order Book API

```text
GET /orderbook/{symbol}
```

Response:

```json
{
  "symbol": "BTC/USD",
  "bids": [],
  "asks": [],
  "timestamp": 0
}
```

Support:

* depth
* price
* quantity
* timestamp.

---

# 21. Candle API

```text
GET /candles/{symbol}
```

Parameters:

```text
interval
startTime
endTime
limit
```

Intervals:

```text
1m
5m
15m
30m
1h
4h
1d
1w
```

---

# 22. Authenticated Account API

Endpoints:

```text
GET /account
GET /account/balances
GET /account/orders
GET /account/trades
GET /account/transactions
```

Responses must never expose:

* passwords
* secrets
* private keys
* authentication tokens.

---

# 23. Trading API

Support:

```text
POST /orders
GET /orders
GET /orders/{id}
DELETE /orders/{id}
```

Order types:

```text
MARKET
LIMIT
```

Sides:

```text
BUY
SELL
```

---

# 24. Create Order

Request:

```json
{
  "symbol": "BTC/USD",
  "side": "BUY",
  "type": "LIMIT",
  "quantity": "0.01",
  "price": "100000"
}
```

Response:

```json
{
  "success": true,
  "data": {
    "orderId": "ORD-000001",
    "status": "OPEN"
  }
}
```

The mock API must use the same trading domain concepts already implemented in `/trade`.

---

# 25. Order Lifecycle

```text
NEW
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

Error:

```text
REJECTED
```

---

# 26. Trade History API

```text
GET /trades
GET /trades/{id}
```

Fields:

* trade ID
* order ID
* symbol
* side
* price
* quantity
* fee
* fee currency
* timestamp.

---

# 27. Wallet API

Endpoints:

```text
GET /wallet/balances
GET /wallet/deposits
GET /wallet/withdrawals
GET /wallet/transactions
```

These must align with the already implemented wallet model.

The existing wallet system already tracks deposits, withdrawals, trades and P2P transactions in a shared ledger. 

---

# 28. P2P API

Only expose P2P capabilities actually supported by the platform.

Potential endpoints:

```text
GET /p2p/offers
GET /p2p/orders
GET /p2p/orders/{id}
```

Do not expose administrative P2P controls through the public API.

Admin dispute controls remain restricted to `/admin`.

---

# 29. API Authentication

The PRD must define a future-compatible authentication model.

Recommended structure:

```text
API Key
+
API Secret
+
Timestamp
+
Request Signature
```

The frontend should document the signing process but must **not expose real secrets**.

---

# 30. Request Signing

Documentation should explain:

```text
timestamp
method
path
query/body
secret
signature
```

The implementation should provide a deterministic mock signer.

Example:

```text
signature = HMAC-SHA256(...)
```

The actual production cryptographic implementation must remain server-side.

---

# 31. WebSocket API

Primary endpoint:

```text
wss://ws.ethsltd.com
```

Architecture must remain abstract so the production endpoint can be configured later.

---

# 32. Public WebSocket Channels

Support:

```text
ticker
orderbook
trades
candles
```

Example:

```json
{
  "op": "subscribe",
  "channel": "ticker",
  "symbol": "BTC/USD"
}
```

---

# 33. Private WebSocket Channels

Authenticated users may subscribe to:

```text
orders
trades
balances
account
```

---

# 34. WebSocket Events

Example:

```json
{
  "event": "order.update",
  "data": {
    "orderId": "ORD-001",
    "status": "FILLED"
  }
}
```

Other events:

```text
order.created
order.updated
order.cancelled
order.filled
trade.executed
balance.updated
```

---

# 35. WebSocket Reconnection

Client behavior must support:

* connection failure
* automatic reconnect
* exponential backoff
* subscription restoration
* authentication failure
* server disconnect
* heartbeat timeout.

---

# 36. API Playground

Route:

```text
/developers/playground
```

Layout:

```text
┌─────────────────────────────────────┐
│ Endpoint Selector                   │
├─────────────────────────────────────┤
│ Method | URL                        │
├─────────────────────────────────────┤
│ Parameters                          │
├─────────────────────────────────────┤
│ Headers                             │
├─────────────────────────────────────┤
│                                     │
│ [ Send Request ]                    │
├─────────────────────────────────────┤
│ Response                            │
│                                     │
│ JSON                                │
└─────────────────────────────────────┘
```

---

# 37. Playground Features

Support:

* endpoint selection
* HTTP method
* parameters
* request body
* authentication simulation
* response viewer
* status code
* response time
* copy request
* copy response
* reset.

---

# 38. Code Generation

Allow users to generate examples for:

```text
cURL
JavaScript
TypeScript
Python
PHP
Go
```

Example:

```bash
curl https://api.ethsltd.com/api/v1/ticker/BTC-USD
```

The code generator must use the same API schema as the documentation.

---

# 39. SDK Section

Route:

```text
/developers/sdks
```

Display SDK availability.

For the initial implementation, if no official SDK exists:

```text
Official SDKs
Coming soon
```

Do **not** pretend SDKs exist.

Provide generated examples instead.

---

# 40. API Documentation

Documentation structure:

```text
Introduction
Quick Start
Authentication
Rate Limits
Errors

Market Data
  Markets
  Ticker
  Order Book
  Candles
  Trades

Trading
  Create Order
  Get Orders
  Cancel Order
  Trade History

Account
  Account
  Balances

Wallet
  Deposits
  Withdrawals
  Transactions

P2P
  Offers
  Orders

WebSocket
  Connection
  Authentication
  Channels
  Events
  Reconnection
```

---

# 41. Documentation Page Layout

Desktop:

```text
┌─────────────┬──────────────────────┬──────────────┐
│ Navigation  │ Documentation        │ Code Example │
│             │                      │              │
│ Categories  │ Endpoint             │ Request      │
│             │ Description          │ Response     │
│             │ Parameters           │              │
│             │ Response             │              │
└─────────────┴──────────────────────┴──────────────┘
```

Mobile:

```text
Documentation
↓
Endpoint
↓
Parameters
↓
Example
↓
Response
```

---

# 42. API Status

Route:

```text
/developers/status
```

Display simulated service status:

```text
REST API             Operational
WebSocket API        Operational
Market Data           Operational
Trading API           Operational
Account API           Operational
Wallet API            Operational
P2P API               Operational
```

Use neutral mock data.

Do not claim actual production uptime.

---

# 43. API Usage Dashboard

Route:

```text
/account/api-usage
```

Metrics:

* Requests today
* Requests this month
* Successful requests
* Failed requests
* Rate-limited requests
* WebSocket connections
* Last activity.

---

# 44. Usage Chart

Display:

```text
API Requests
│
│       ╭──╮
│   ╭───╯  ╰──╮
│───╯         ╰──
└────────────────
```

Use lightweight SVG where possible.

Avoid unnecessary chart dependencies.

---

# 45. Rate Limits

Display clear limits.

Example mock values:

```text
Public REST:
60 requests/minute

Authenticated REST:
120 requests/minute

Trading:
30 requests/minute

WebSocket:
10 connections/account
```

These are **simulation values only** until the real backend defines official limits.

Clearly label them:

> Example/Test Limits

---

# 46. Rate Limit Response

Example:

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests"
  }
}
```

HTTP status:

```text
429
```

---

# 47. Error System

Standard error format:

```json
{
  "success": false,
  "error": {
    "code": "INVALID_PARAMETER",
    "message": "Invalid symbol",
    "details": {}
  }
}
```

Error categories:

```text
AUTHENTICATION_ERROR
AUTHORIZATION_ERROR
INVALID_PARAMETER
INVALID_REQUEST
NOT_FOUND
RATE_LIMIT_EXCEEDED
INSUFFICIENT_BALANCE
ORDER_REJECTED
MARKET_UNAVAILABLE
INTERNAL_ERROR
```

---

# 48. Developer Changelog

Route:

```text
/developers/changelog
```

Each entry:

```text
Version
Date
Category
Summary
Breaking Change
```

Example:

```text
v1.2.0

Added:
- WebSocket ticker subscriptions
- New candle intervals

Changed:
- Order response schema

Breaking:
- No
```

---

# 49. API Versioning

Initial API:

```text
/v1
```

Future:

```text
/v2
```

Never silently break existing `/v1` contracts.

---

# 50. Deprecation System

Deprecated endpoints must show:

```text
DEPRECATED
```

Display:

* deprecation date
* replacement endpoint
* migration instructions
* planned removal date.

---

# 51. Security Requirements

Never expose:

* API secrets
* private keys
* database credentials
* server tokens
* Cloudflare secrets
* signing keys.

The existing ETHSLTD design specification explicitly prohibits secrets from client bundles, React components and public assets. 

---

# 52. API Key Security

Required:

* masked key display
* one-time secret display
* revocation
* permission separation
* IP restrictions
* expiration
* audit logging.

---

# 53. Admin API Management

Extend the existing Admin Console with:

```text
/admin/api
/admin/api/keys
/admin/api/usage
```

Admin users can:

* view API keys
* view key metadata
* revoke compromised keys
* inspect usage
* investigate abuse
* inspect rate-limit events.

Admins must **never** see plaintext API secrets.

---

# 54. Audit Events

API actions should generate events such as:

```text
API_KEY_CREATED
API_KEY_REVOKED
API_PERMISSION_CHANGED
API_IP_UPDATED
API_REQUEST_REJECTED
API_RATE_LIMITED
API_SECURITY_EVENT
```

This aligns with the existing Admin architecture, which already emphasizes operational history and auditability. 

---

# 55. Mock Architecture

Create:

```text
lib/api/
├── types.ts
├── constants.ts
├── errors.ts
├── auth.ts
├── signing.ts
├── rate-limit.ts
├── endpoints.ts
└── client.ts
```

Providers:

```text
lib/providers/
├── mock-api-provider.ts
├── mock-websocket-provider.ts
└── mock-api-key-provider.ts
```

Stores:

```text
lib/stores/
├── api-key-store.ts
├── api-usage-store.ts
└── developer-store.ts
```

---

# 56. Shared Domain Types

Do not duplicate existing market/order/wallet types.

Reuse or extend:

```text
Market
Order
Trade
Balance
Transaction
P2POrder
```

The existing design system explicitly requires reusable predictable component and utility naming. 

---

# 57. State Management

Use Zustand for:

### API Key State

```text
api-key-store.ts
```

### Developer Preferences

```text
developer-store.ts
```

### Usage

```text
api-usage-store.ts
```

Do not place server-side secrets in Zustand persistence.

---

# 58. Validation

Use Zod for:

* API key forms
* permission forms
* IP addresses
* endpoint parameters
* request bodies
* generated configuration
* mock API responses.

---

# 59. API Contract Validation

Every endpoint must have:

```text
Request schema
Response schema
Error schema
```

Example:

```text
CreateOrderRequest
CreateOrderResponse
CreateOrderError
```

---

# 60. Responsive Design

The developer portal must work on:

* mobile
* tablet
* desktop
* large desktop.

Documentation tables must horizontally scroll where necessary.

Code blocks must never cause page-level horizontal overflow.

---

# 61. Theme Support

Must support:

```text
Light
Dark
System
```

The existing ETHSLTD design system explicitly requires all three modes and requires theme switching without layout shifts or broken chart colors. 

---

# 62. Design Consistency

Do not introduce a separate developer-brand aesthetic.

Reuse:

* ETHSLTD Marine
* Midnight
* Frost
* Slate
* selective Brass
* Inter
* Space Grotesk
* JetBrains Mono
* existing cards
* existing buttons
* existing badges
* existing dialogs
* existing tables.

The established design formula is already defined as Marine + Midnight + Frost + Slate + selective Brass + the existing typography system + 8px grid + subtle motion. 

---

# 63. Developer-Specific Visual Language

Use:

### JetBrains Mono

For:

* API URLs
* JSON
* code
* request IDs
* API key IDs
* error codes.

### Space Grotesk

For:

* major headings.

### Inter

For:

* body
* controls
* documentation.

---

# 64. Accessibility

Required:

* keyboard navigation
* visible focus
* semantic headings
* ARIA labels
* accessible code blocks
* accessible tabs
* accessible dialogs
* screen-reader-friendly API tables
* sufficient contrast.

---

# 65. Loading States

Every async developer interface needs:

```text
Loading
Success
Empty
Error
Retry
Unauthorized
Forbidden
Rate Limited
Offline
```

The global design specification explicitly requires these states. 

---

# 66. Empty States

Example:

> **No API keys yet**

Copy:

> Create your first API key to start connecting applications to ETHSLTD.

CTA:

**Create API Key**

---

# 67. Error States

Example:

> **Unable to load API usage**

Copy:

> We couldn't retrieve your API usage data.

Buttons:

* Retry
* Contact Support.

---

# 68. Security Warning States

Example:

> **Never share your API secret**

Use a security callout whenever credentials are displayed.

---

# 69. Developer FAQ

Include:

### General

* What is the ETHSLTD API?
* Which APIs are available?
* Is the API free?
* How do I create an API key?

### Security

* How should I store my API secret?
* Can I restrict an API key by IP?
* How do I revoke a key?

### Trading

* Can I place orders through the API?
* Which order types are supported?
* How are fees represented?

### WebSocket

* How do I reconnect?
* How do I subscribe?
* How do I authenticate?

---

# 70. Support Integration

Developer pages should link to:

```text
/support
/support/tickets
```

Do not build another support system.

The existing Support Center already provides ticketing and support conversations. 

---

# 71. Notification Integration

API security events should integrate with the existing notification system.

Examples:

```text
New API Key Created
API Key Revoked
API Key Used From New IP
API Rate Limit Triggered
API Security Alert
```

Critical security notifications cannot be disabled through normal notification preferences.

This remains consistent with the existing notification architecture. 

---

# 72. Account Integration

Add to existing account navigation:

```text
Developer
  API Keys
  API Usage
```

Do not create a duplicate account dashboard.

---

# 73. Admin Integration

Admin navigation becomes:

```text
ETHSLTD ADMIN

OVERVIEW
  Dashboard

CUSTOMERS
  Users
  KYC / Compliance

FINANCE
  Deposits
  Withdrawals

TRADING
  Orders
  Trades

P2P
  Marketplace
  Disputes

RISK
  Risk Center

DEVELOPER
  API Keys
  API Usage

SYSTEM
  Notifications
  Support
  Audit Logs
  Settings
```

The existing Admin navigation already establishes this centralized operational pattern. 

---

# 74. Mock API Behavior

Mock provider must simulate:

* network latency
* successful responses
* invalid requests
* authentication failures
* permission failures
* rate limiting
* expired keys
* revoked keys
* insufficient balance
* rejected orders
* unavailable markets.

Example latency:

```text
100–500ms
```

Randomized latency should be deterministic enough for tests.

---

# 75. Mock WebSocket Behavior

Simulate:

* ticker updates
* order book updates
* trades
* candle updates
* order changes
* balance changes.

The existing trading terminal already uses asynchronous mock providers to emulate future real-time services. The API layer should reuse the same architectural approach.

---

# 76. Demo API Credentials

Provide development-only mock credentials.

Example:

```text
Demo Read Key
Demo Trading Key
```

These must be clearly marked:

> **Demo credentials — not real production credentials**

---

# 77. No Fake Production Claims

The portal must never say:

* "99.99% uptime"
* "institutional-grade API uptime"
* "live production liquidity"
* "real-time production data"

unless backed by an actual production service.

The existing ETHSLTD homepage principle is that the product must accurately represent what is actually implemented. 

---

# 78. SEO

Public developer documentation should support:

* title
* description
* Open Graph
* canonical URL
* structured metadata where appropriate.

Marketing/documentation pages should follow the existing SEO rules. 

---

# 79. Performance

Requirements:

* documentation should load quickly
* code examples should not block rendering
* API playground should lazy-load where practical
* WebSocket demos should not run automatically on page load
* charts should use lightweight implementations
* avoid unnecessary dependencies.

---

# 80. Security Boundaries

The frontend may:

```text
Display API documentation
Display mock credentials
Generate mock requests
Display mock responses
Manage simulated API key state
```

The frontend must never:

```text
Generate real server-side secrets
Store real API secrets
Sign production withdrawals
Store private keys
Execute privileged server operations
```

---

# 81. File/Folder Expectations

A consistent implementation can use:

```text
app/
├── developers/
│   ├── page.tsx
│   ├── docs/
│   ├── api/
│   ├── websocket/
│   ├── playground/
│   ├── sdks/
│   ├── changelog/
│   └── status/
│
├── account/
│   ├── api-keys/
│   └── api-usage/
│
└── admin/
    └── api/
```

Components:

```text
components/developer/
├── DeveloperHero
├── ApiFeatureCard
├── ApiEndpoint
├── ApiCodeBlock
├── ApiPlayground
├── ApiResponseViewer
├── ApiKeyTable
├── ApiKeyCreateDialog
├── ApiUsageChart
├── WebSocketConsole
├── DeveloperSidebar
└── DeveloperStatus
```

---

# 82. Reusable Components

Do not create developer-specific versions of:

```text
Button
Dialog
Input
Select
Tabs
Table
Badge
Card
Toast
Tooltip
Skeleton
```

Reuse existing ETHSLTD UI primitives.

The design system explicitly requires reusable shared UI components rather than duplicated domain-specific versions. 

---

# 83. Testing Requirements

## Unit Tests

Test:

* signing
* validation
* permissions
* rate limiting
* formatting
* endpoint schemas.

## Component Tests

Test:

* API key creation
* revoke flow
* playground
* documentation tabs
* code generation.

## Integration Tests

Test:

```text
Create API key
↓
Assign permission
↓
Call endpoint
↓
Receive response
↓
Revoke key
↓
Request fails
```

---

# 84. Security Tests

Test:

* unauthorized API access
* revoked key
* expired key
* insufficient permissions
* malformed signature
* replayed timestamp
* rate limit
* withdrawal permission restriction.

---

# 85. Accessibility Tests

Use:

```text
axe
React Testing Library
Playwright
```

These are already consistent with the project's established testing stack. 

---

# 86. E2E Test Scenarios

### Scenario 1

Developer visits:

```text
/developers
```

Expected:

Developer landing page loads.

### Scenario 2

Developer opens documentation.

Expected:

Endpoint documentation loads.

### Scenario 3

Developer creates API key.

Expected:

Credential appears once and metadata is saved.

### Scenario 4

Developer revokes API key.

Expected:

Key becomes revoked.

### Scenario 5

Developer uses playground.

Expected:

Mock request returns response.

### Scenario 6

Developer exceeds rate limit.

Expected:

429-style response.

### Scenario 7

Developer switches theme.

Expected:

No layout break.

### Scenario 8

Developer opens on mobile.

Expected:

Documentation remains usable.

---

# 87. Definition of Done

The PRD is complete when:

### Developer Portal

* `/developers` works
* documentation works
* API playground works
* WebSocket documentation works
* changelog works
* status page works.

### API Keys

* create
* permissions
* restrictions
* revoke
* expiration
* audit.

### API

* market
* account
* trading
* wallet
* P2P contracts documented.

### WebSocket

* channels documented
* mock connection works
* subscription works
* events work
* reconnect behavior works.

### Security

* secrets never exposed
* permissions enforced
* revoked keys fail
* audit events generated.

### UI

* responsive
* light mode
* dark mode
* accessible
* consistent with ETHSLTD.

### Architecture

* mock provider abstraction
* reusable domain types
* Zod validation
* Zustand state
* no unnecessary dependencies.

---

# 88. Explicit Non-Goals

This PRD does **not** implement:

* production exchange matching engine
* real blockchain infrastructure
* real custody
* real banking rails
* production payment processing
* real-money settlement
* real institutional execution
* production API infrastructure
* production secret management
* actual production API uptime guarantees
* mobile SDKs unless they actually exist
* legal/compliance certification.

The Admin PRD follows the same boundary: UI/provider architecture should be ready for future production systems without pretending those systems already exist. 

---

# 89. Technology Consistency

Use the existing stack:

```text
Next.js 15
TypeScript
Tailwind CSS v4
Zustand
React Hook Form
Zod
Radix UI
Lucide React
Lightweight Charts
Cloudflare Pages / Workers
GitHub
GitHub Actions
```

The broader ETHSLTD architecture also identifies Cloudflare Workers, D1, R2, KV and Durable Objects as the future backend/infrastructure direction, with WebSocket + Durable Objects for realtime coordination. 

Do not introduce a new framework for the Developer Platform.

---

# 90. Currency Standard

**USD is the single default financial display currency.**

Examples:

```text
BTC/USD
ETH/USD
SOL/USD
```

Not:

```text
BTC/INR
ETH/INR
USD/INR
```

All examples, API playground data, balances, trading examples, P2P examples and documentation should default to **USD** unless an explicitly supported alternative currency is later introduced.

---

# 91. Final Product Flow

```text
ETHSLTD Account
      ↓
Developer Portal
      ↓
Documentation
      ↓
Quick Start
      ↓
Create API Key
      ↓
Choose Permissions
      ↓
Configure Security
      ↓
API Playground
      ↓
REST API
      ↓
WebSocket API
      ↓
Application Integration
      ↓
API Usage
      ↓
Security Monitoring
      ↓
Admin Operations
      ↓
Audit Trail
```

---

# 92. Final Product Objective

The completed ETHSLTD Developer Platform should allow a developer to move from:

> **"I want to integrate with ETHSLTD"**

to:

> **"I have securely created credentials, tested the API, subscribed to real-time data, understood the contracts, and can build my application."**

It must become the technical bridge between ETHSLTD's existing customer-facing products and future external applications.

Most importantly:

> **The Developer Platform must be built as an extension of the existing ETHSLTD ecosystem—not as a separate product.**

The existing architecture already emphasizes reusable providers, centralized formatting, shared design tokens, predictable component naming, and clear separation between mock and production service logic. 

---

## Recommended file name

```text
ETHSLTD-PRD-09-API-DEVELOPER-PLATFORM-USD.md
```

This numbering keeps the sequence clean after the previously established modules and, importantly, avoids repeating the **Admin & Operations** or **Notifications, Communication & Support** PRDs that are already implemented.
