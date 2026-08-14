Based on the complete project history you provided, the next step should be the **Admin & Operations Console**.

This is the most consistent next module because ETHSLTD already has the public website, Markets, Demo Trading, Authentication/Security, P2P, and Wallet/Portfolio flows. The next missing platform-level capability is the internal control center that can manage users, wallets, trading activity, P2P, risk, support, audit logs, system configuration, and eventually connect cleanly to the production backend.

I would **not** move to real-money trading yet. The Admin/Operations layer should exist before production financial integrations.

Below is the complete PRD, designed to fit the existing Next.js 15 + TypeScript + Zustand + Zod + Tailwind v4 architecture and the existing USD-first convention.

# ETHSLTD ADMIN & OPERATIONS CONSOLE

## Complete Product Requirements Document

**Product:** ETHSLTD Crypto Trading Platform
**Module:** Admin & Operations Console
**Route:** `/admin`
**Document:** Product Requirements Document
**Currency Standard:** USD
**Framework:** Next.js 15 App Router
**Language:** TypeScript
**Architecture:** Existing ETHSLTD application architecture
**Status:** Next Development Step
**Data Mode:** Mock/Simulated initially, production-backend-ready
**Primary Audience:** ETHSLTD internal administrators, compliance staff, finance operators, support staff, trading operators, risk managers, auditors

---

# 1. PURPOSE

The ETHSLTD Admin & Operations Console is the internal control center for managing the entire ETHSLTD platform.

The console must provide authorized internal users with a secure, structured and auditable interface for:

* User management
* Account management
* Authentication/security operations
* KYC operations
* Trading monitoring
* Orders and trades
* Wallet and balances
* Deposits
* Withdrawals
* P2P marketplace
* P2P disputes
* Risk management
* Fraud monitoring
* Support operations
* Notifications
* Contracts
* Audit logs
* Platform settings
* Market configuration
* Operational monitoring
* Reporting
* System health

The Admin Console must be designed so that the current mock providers can later be replaced by production APIs without requiring a major frontend rewrite.

---

# 2. IMPORTANT PRODUCT PRINCIPLE

The Admin Console is **not another version of the public ETHSLTD website**.

It is an internal operations application.

The interface must therefore prioritize:

1. Accuracy
2. Security
3. Auditability
4. Information density
5. Clear operational states
6. Fast navigation
7. Search
8. Filtering
9. Traceability
10. Role-based access

Visual design should remain consistent with ETHSLTD but may be more operational and information-dense than the public website.

---

# 3. CURRENCY STANDARD

ETHSLTD uses **USD as the default currency everywhere**.

Admin screens must therefore use:

* USD
* $
* USD equivalent
* USD volume
* USD balance
* USD value
* USD fees
* USD limits

Examples:

`$10,000.00`

`$125.50`

`$1,250,000.00`

Do not use INR as the default.

If multi-fiat functionality is eventually introduced, USD remains the default platform display currency unless an administrator explicitly changes the display preference.

---

# 4. EXISTING PLATFORM CONTEXT

The Admin Console must integrate conceptually with the modules already implemented.

Existing modules:

```text
/
├── Homepage
│
├── /markets
│
├── /trade
│
├── /p2p
│   ├── /p2p/order/[id]
│   └── /p2p/orders
│
├── /wallet
│   ├── /wallet/deposit
│   ├── /wallet/withdraw
│   └── /wallet/history
│
└── /account
    ├── /account/profile
    ├── /account/security
    ├── /account/sessions
    └── /account/preferences
```

The Admin Console will add:

```text
/admin
/admin/users
/admin/users/[id]
/admin/kyc
/admin/trading
/admin/orders
/admin/trades
/admin/wallets
/admin/deposits
/admin/withdrawals
/admin/p2p
/admin/p2p/orders
/admin/p2p/disputes
/admin/risk
/admin/support
/admin/contracts
/admin/notifications
/admin/audit
/admin/markets
/admin/settings
/admin/system
```

---

# 5. ADMIN APPLICATION STRUCTURE

The Admin Console should use the existing application rather than creating an unrelated visual system.

Recommended structure:

```text
app/
├── admin/
│   ├── layout.tsx
│   ├── page.tsx
│   │
│   ├── users/
│   ├── kyc/
│   ├── trading/
│   ├── orders/
│   ├── trades/
│   ├── wallets/
│   ├── deposits/
│   ├── withdrawals/
│   ├── p2p/
│   ├── risk/
│   ├── support/
│   ├── contracts/
│   ├── notifications/
│   ├── audit/
│   ├── markets/
│   ├── settings/
│   └── system/
```

---

# 6. ADMIN AUTHENTICATION

The Admin Console must never rely only on the normal user authentication state.

There must be an explicit administrator authorization layer.

Required concepts:

```text
User Authentication
        ↓
Admin Authorization
        ↓
Role
        ↓
Permission
        ↓
Admin Action
        ↓
Audit Log
```

A normal `USER` must never gain access simply by navigating to:

```text
/admin
```

---

# 7. ADMIN ROLES

Support the existing role model.

Primary roles:

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

Only appropriate roles may access corresponding modules.

---

# 8. PERMISSION MODEL

Permissions should be granular.

Examples:

```text
admin.dashboard.read

users.read
users.write
users.freeze
users.unfreeze

kyc.read
kyc.review
kyc.approve
kyc.reject

orders.read
orders.cancel

trades.read

wallets.read
wallets.freeze
wallets.unfreeze

deposits.read
deposits.review

withdrawals.read
withdrawals.review
withdrawals.approve
withdrawals.reject

p2p.read
p2p.manage

p2p.dispute.read
p2p.dispute.resolve

risk.read
risk.review
risk.freeze

support.read
support.manage

contracts.read
contracts.manage

notifications.read
notifications.send

markets.read
markets.manage

audit.read

settings.read
settings.write

system.read
```

The UI must hide unavailable actions based on permissions.

The backend must independently enforce the permissions.

Frontend-only permission protection is insufficient.

---

# 9. ADMIN LOGIN

Admin login should support:

* Email
* Password
* 2FA
* Session validation
* Device information
* Login timestamp
* IP metadata
* Security notification
* Session expiration
* Logout

Optional future support:

* Passkeys
* Hardware security keys
* SSO

---

# 10. ADMIN DASHBOARD

Route:

```text
/admin
```

This is the primary operational dashboard.

The dashboard should immediately communicate platform health.

---

# 11. DASHBOARD LAYOUT

Top-level layout:

```text
┌───────────────────────────────────────────────────────────────┐
│ ETHSLTD ADMIN                         Search   Admin   Alerts │
├───────────────┬───────────────────────────────────────────────┤
│               │                                               │
│ Dashboard     │ Overview                                      │
│ Users         │                                               │
│ KYC           │ KPI Cards                                     │
│ Trading       │                                               │
│ Orders        │ Charts                                        │
│ Trades        │                                               │
│ Wallets       │ Operational Queues                            │
│ Deposits      │                                               │
│ Withdrawals   │                                               │
│ P2P           │ Recent Activity                               │
│ Risk          │                                               │
│ Support       │                                               │
│ Contracts     │                                               │
│ Notifications │                                               │
│ Audit         │                                               │
│ Markets       │                                               │
│ Settings      │                                               │
│ System        │                                               │
└───────────────┴───────────────────────────────────────────────┘
```

---

# 12. DASHBOARD KPI CARDS

Display:

### Users

```text
Total Users
Active Users
New Users
Suspended Users
```

### Trading

```text
24h Trading Volume
24h Trades
Open Orders
Active Markets
```

### Wallet

```text
Total Platform Balance
Deposits Today
Withdrawals Today
Pending Withdrawals
```

### P2P

```text
Active P2P Orders
24h P2P Volume
Pending Disputes
Active Merchants
```

### Compliance

```text
Pending KYC
Rejected KYC
High Risk Accounts
Pending Reviews
```

### System

```text
API Status
Database Status
WebSocket Status
Queue Status
Error Rate
```

---

# 13. USD DISPLAY

Examples:

```text
24h Trading Volume
$4,820,500.25

Total Platform Balance
$18,425,902.42

Deposits Today
$245,820.00

Withdrawals Today
$128,450.75

P2P Volume
$94,820.50
```

All financial numbers must use consistent USD formatting.

---

# 14. TIME RANGE FILTER

Dashboard should support:

```text
Today
24H
7D
30D
90D
Custom
```

Default:

```text
24H
```

---

# 15. ACTIVITY FEED

Show recent important platform events.

Examples:

```text
Withdrawal submitted
KYC approved
User account frozen
P2P dispute opened
Large trade executed
Admin permission changed
Market disabled
Security alert triggered
```

Each activity should display:

* Event
* Entity
* Actor
* Timestamp
* Severity
* Status

---

# 16. GLOBAL ADMIN SEARCH

Admin should have global search.

Search entities:

```text
User ID
Email
Username
Order ID
Trade ID
Transaction ID
Wallet address
P2P Order ID
Dispute ID
Ticket ID
Contract ID
```

Search should return grouped results:

```text
Users
Orders
Trades
Wallets
P2P
Support
Contracts
Audit
```

---

# 17. USER MANAGEMENT

Route:

```text
/admin/users
```

Display:

```text
User ID
Name
Email
Status
KYC Status
Risk Level
Balance
Trading Volume
P2P Status
Created
Last Login
```

---

# 18. USER FILTERS

Support:

```text
Status
KYC
Risk
Role
Country
Registration Date
Last Login
Trading Activity
P2P Activity
Balance Range
```

---

# 19. USER SEARCH

Search:

```text
User ID
Email
Name
Phone
Wallet
```

Search must be debounced.

---

# 20. USER DETAILS

Route:

```text
/admin/users/[id]
```

Sections:

```text
Overview
Profile
Security
KYC
Wallets
Orders
Trades
P2P
Deposits
Withdrawals
Contracts
Support
Risk
Sessions
Audit
```

---

# 21. USER OVERVIEW

Show:

```text
User ID
Name
Email
Account Status
KYC Status
Risk Level
Registration Date
Last Login
2FA Status
```

Financial summary:

```text
Total Portfolio
Available Balance
Locked Balance
Trading Volume
P2P Volume
```

---

# 22. USER ACCOUNT ACTIONS

Depending on permission:

```text
Freeze Account
Unfreeze Account
Suspend Account
Reactivate Account
Force Logout
Reset Security
Require 2FA
Disable Trading
Disable Withdrawals
Disable P2P
```

Destructive actions require confirmation.

---

# 23. ACCOUNT FREEZE

Freezing an account must require:

```text
Reason
Confirmation
Admin identity
Timestamp
```

Example:

```text
Action:
Freeze Account

Reason:
Suspicious withdrawal activity

Confirmation:
FREEZE
```

The action must create an audit event.

---

# 24. KYC MANAGEMENT

Route:

```text
/admin/kyc
```

Dashboard:

```text
Pending
Under Review
Verified
Rejected
Expired
Suspended
```

---

# 25. KYC QUEUE

Table:

```text
Application ID
User
Country
Document Type
Risk
Submitted
Status
Assigned Admin
```

Filters:

```text
Status
Country
Risk
Date
Assigned Reviewer
```

---

# 26. KYC DETAIL

Display:

```text
Identity Information
Document Information
Verification Status
Review History
Risk Indicators
Submitted Documents
Reviewer Notes
```

Documents must be treated as private.

The admin UI should not expose permanent public document URLs.

---

# 27. KYC ACTIONS

Authorized KYC administrators can:

```text
Approve
Reject
Request More Information
Escalate
Suspend
Assign Reviewer
Add Internal Note
```

Rejecting requires a reason.

---

# 28. TRADING MONITOR

Route:

```text
/admin/trading
```

Display:

```text
Markets
Price
24h Change
24h Volume
Trades
Open Orders
Best Bid
Best Ask
Spread
Status
```

---

# 29. MARKET OPERATIONS

Admins can view:

```text
Market status
Trading status
Price
Volume
Order count
Trade count
```

Authorized trading administrators can:

```text
Enable Market
Disable Market
Pause Trading
Resume Trading
```

Any trading interruption must be audited.

---

# 30. ORDER MANAGEMENT

Route:

```text
/admin/orders
```

Columns:

```text
Order ID
User
Market
Side
Type
Price
Quantity
Filled
Remaining
Status
Created
```

---

# 31. ORDER FILTERS

```text
Market
User
Side
Order Type
Status
Date
Price Range
Quantity Range
```

---

# 32. ORDER DETAILS

Show:

```text
Order ID
User
Market
Side
Type
Price
Original Quantity
Executed Quantity
Remaining Quantity
Fee
Status
Created At
Updated At
```

Order event timeline:

```text
CREATED
VALIDATING
ACCEPTED
OPEN
PARTIALLY_FILLED
FILLED
CANCELLED
REJECTED
EXPIRED
```

---

# 33. ADMIN ORDER ACTIONS

Depending on role:

```text
Cancel Order
```

Admin cancellation must require:

```text
Reason
Confirmation
```

Admin cancellation must never silently modify historical events.

---

# 34. TRADE MONITOR

Route:

```text
/admin/trades
```

Columns:

```text
Trade ID
Market
Buy Order
Sell Order
Buyer
Seller
Price
Quantity
USD Value
Fee
Timestamp
```

---

# 35. TRADE DETAIL

Show complete execution chain:

```text
Trade
    ↓
Buy Order
    ↓
Sell Order
    ↓
Users
    ↓
Balances
    ↓
Ledger Entries
    ↓
Fees
```

This is critical for financial investigation.

---

# 36. WALLET MANAGEMENT

Route:

```text
/admin/wallets
```

Display:

```text
User
Asset
Available
Locked
Total
USD Value
Status
```

---

# 37. WALLET DETAIL

Show:

```text
Asset
Available Balance
Locked Balance
Total Balance
USD Value
Wallet Status
```

Transactions:

```text
Deposit
Withdrawal
Trade
P2P
Adjustment
Fee
```

---

# 38. BALANCE INTEGRITY

The Admin Console must distinguish:

```text
Available
Locked
Total
```

Never display:

```text
Total = Available
```

unless that is actually true.

---

# 39. MANUAL BALANCE ADJUSTMENTS

Manual financial adjustments must be highly restricted.

Required:

```text
Permission
Reason
Amount
Asset
Direction
Reference
Confirmation
```

Example:

```text
Asset: USDT

Amount: 100.00

Direction: Credit

Reason:
Approved customer compensation

Reference:
CASE-10042
```

The adjustment must create immutable ledger records.

---

# 40. DEPOSIT MANAGEMENT

Route:

```text
/admin/deposits
```

Statuses:

```text
PENDING
PROCESSING
COMPLETED
FAILED
REJECTED
CANCELLED
```

Display:

```text
Deposit ID
User
Asset
Amount
USD Value
Network
Reference
Status
Created
Completed
```

---

# 41. WITHDRAWAL MANAGEMENT

Route:

```text
/admin/withdrawals
```

This is a high-security area.

Display:

```text
Withdrawal ID
User
Asset
Amount
USD Value
Destination
Network
Fee
Risk
Status
Created
```

---

# 42. WITHDRAWAL STATES

```text
REQUESTED
RISK_REVIEW
PENDING_APPROVAL
APPROVED
PROCESSING
COMPLETED
FAILED
REJECTED
CANCELLED
```

---

# 43. WITHDRAWAL REVIEW

Admin should see:

```text
User
KYC
Risk Score
Recent Login
Recent Device
Recent Withdrawals
Withdrawal History
Balance
Destination
Amount
Network
```

The purpose is to allow operational review without hiding relevant risk context.

---

# 44. WITHDRAWAL ACTIONS

Authorized finance/risk users may:

```text
Approve
Reject
Hold
Release
Cancel
```

High-risk actions should support dual authorization in the future.

---

# 45. P2P ADMINISTRATION

Route:

```text
/admin/p2p
```

Dashboard:

```text
Active Orders
Completed Orders
Cancelled Orders
Disputed Orders
24h Volume
Active Merchants
```

---

# 46. P2P ORDER MANAGEMENT

Route:

```text
/admin/p2p/orders
```

Columns:

```text
Order ID
Buyer
Seller
Asset
Fiat
Amount
USD Value
Payment Method
Status
Created
Expires
```

---

# 47. P2P ORDER DETAIL

Show:

```text
Buyer
Seller
Advertisement
Asset
Amount
USD Value
Payment Method
Escrow Status
Payment Status
Chat
Timeline
Evidence
Risk
```

---

# 48. P2P DISPUTES

Route:

```text
/admin/p2p/disputes
```

Statuses:

```text
OPEN
UNDER_REVIEW
WAITING_FOR_BUYER
WAITING_FOR_SELLER
RESOLVED
CANCELLED
```

---

# 49. DISPUTE DETAIL

Show:

```text
Buyer
Seller
Order
Escrow
Payment information
Chat history
Evidence
System timeline
Admin notes
Previous actions
```

---

# 50. DISPUTE RESOLUTION

Authorized P2P administrators can resolve:

```text
BUYER
SELLER
PARTIAL
CANCEL
```

Every resolution requires:

```text
Resolution
Reason
Admin
Timestamp
```

---

# 51. RISK MANAGEMENT

Route:

```text
/admin/risk
```

Dashboard:

```text
Low
Medium
High
Critical
```

---

# 52. RISK PROFILE

Each user may have:

```text
Risk Score
Risk Level
Risk Events
Velocity Alerts
Login Alerts
Withdrawal Alerts
Trading Alerts
P2P Alerts
```

---

# 53. RISK EVENTS

Examples:

```text
Multiple login locations
Unusual withdrawal
Rapid balance movement
High-volume trading
Repeated failed authentication
New device
Suspicious P2P activity
Multiple disputes
```

---

# 54. RISK ACTIONS

Depending on permission:

```text
Monitor
Request Review
Restrict Withdrawal
Restrict Trading
Freeze Account
Escalate
Close Alert
```

All actions are audited.

---

# 55. SUPPORT CENTER

Route:

```text
/admin/support
```

Support agents should manage:

```text
Tickets
Users
Messages
Priority
Status
Assignments
Internal Notes
```

---

# 56. SUPPORT TICKET STATES

```text
OPEN
IN_PROGRESS
WAITING_FOR_USER
WAITING_INTERNAL
RESOLVED
CLOSED
```

---

# 57. SUPPORT TICKET PRIORITY

```text
LOW
NORMAL
HIGH
URGENT
CRITICAL
```

---

# 58. SUPPORT TICKET DETAIL

Show:

```text
Ticket ID
User
Category
Priority
Status
Assigned Agent
Messages
Attachments
Internal Notes
Related Order
Related Trade
Related Withdrawal
Related P2P Order
```

---

# 59. CONTRACT MANAGEMENT

Route:

```text
/admin/contracts
```

Admin should manage:

```text
Contract Templates
Versions
Published Status
Signed Contracts
Signature Records
```

---

# 60. CONTRACT TEMPLATE

Fields:

```text
Template ID
Name
Version
Content
Status
Created
Updated
Published
```

Statuses:

```text
DRAFT
REVIEW
PUBLISHED
ARCHIVED
```

---

# 61. CONTRACT AUDIT

Each signed contract should show:

```text
Contract ID
User
Template Version
Document Hash
Signed At
Signature Method
Consent Text
IP Metadata
User Agent
```

---

# 62. NOTIFICATION MANAGEMENT

Route:

```text
/admin/notifications
```

Admin can view:

```text
System notifications
Security alerts
User notifications
Email events
Push events
```

---

# 63. NOTIFICATION TYPES

```text
ORDER_FILLED
ORDER_CANCELLED
DEPOSIT
WITHDRAWAL
P2P_MESSAGE
P2P_PAYMENT
P2P_DISPUTE
KYC_RESULT
SECURITY_ALERT
CONTRACT
LOGIN
PASSWORD_CHANGE
2FA
SYSTEM
```

---

# 64. ADMIN BROADCAST

Authorized administrators may create platform announcements.

Fields:

```text
Title
Message
Severity
Audience
Start
End
Status
```

Audience examples:

```text
All Users
Verified Users
P2P Merchants
Traders
Specific Segment
```

---

# 65. AUDIT LOG

Route:

```text
/admin/audit
```

This is one of the most important sections.

Every sensitive administrative operation must be logged.

---

# 66. AUDIT LOG FIELDS

```text
Audit ID
Admin ID
Admin Role
Action
Entity
Entity ID
Before
After
Reason
IP
User Agent
Timestamp
Request ID
```

---

# 67. AUDIT EXAMPLES

```text
ADMIN_LOGIN

USER_FROZEN

USER_UNFROZEN

WITHDRAWAL_APPROVED

WITHDRAWAL_REJECTED

ORDER_CANCELLED

P2P_DISPUTE_RESOLVED

KYC_APPROVED

KYC_REJECTED

BALANCE_ADJUSTED

MARKET_DISABLED

ROLE_CHANGED

PERMISSION_CHANGED

SETTING_CHANGED
```

---

# 68. AUDIT IMMUTABILITY

Audit records should be append-only.

The admin UI must not provide:

```text
Edit Audit Log
Delete Audit Log
```

---

# 69. MARKET MANAGEMENT

Route:

```text
/admin/markets
```

Display:

```text
Symbol
Base Asset
Quote Asset
Price
24h Change
Volume
Status
Trading Enabled
P2P Enabled
```

---

# 70. MARKET CONFIGURATION

Authorized trading admins can configure:

```text
Market Status
Minimum Order
Maximum Order
Price Precision
Quantity Precision
Maker Fee
Taker Fee
```

All financial configuration changes must be audited.

---

# 71. FEE MANAGEMENT

Admin should have a fee configuration interface.

Example:

```text
BTC/USDT

Maker:
0.10%

Taker:
0.10%
```

P2P fees:

```text
Buyer Fee
Seller Fee
```

Withdrawal fees:

```text
Asset
Network
Fee
```

Do not hard-code financial fees throughout the UI.

---

# 72. SYSTEM SETTINGS

Route:

```text
/admin/settings
```

Settings should be grouped.

### General

```text
Platform Name
Default Currency
Timezone
Support Email
```

Default currency:

```text
USD
```

### Trading

```text
Trading Enabled
Demo Trading Enabled
Maintenance Mode
```

### P2P

```text
P2P Enabled
Merchant Registration
Dispute System
```

### Security

```text
Admin 2FA Required
Session Duration
Login Protection
```

---

# 73. MAINTENANCE MODE

Admins may enable:

```text
Platform Maintenance
Trading Maintenance
P2P Maintenance
Wallet Maintenance
```

The UI must clearly indicate maintenance status.

---

# 74. SYSTEM HEALTH

Route:

```text
/admin/system
```

Display:

```text
Application
API
Database
Authentication
Market Data
Trading Engine
WebSocket
Queue
Storage
Notifications
```

Statuses:

```text
OPERATIONAL
DEGRADED
DOWN
UNKNOWN
```

---

# 75. SYSTEM METRICS

Show:

```text
Request Count
Error Rate
Average Latency
WebSocket Connections
Active Users
Queue Depth
Failed Jobs
Database Health
```

---

# 76. ADMIN RESPONSIVE DESIGN

Desktop is the primary target.

However, tablet and mobile must remain usable.

Desktop:

```text
Sidebar + Dense Content
```

Tablet:

```text
Collapsible Sidebar
```

Mobile:

```text
Top Navigation
Drawer Navigation
Stacked Cards
Horizontal Tables
```

Critical financial tables must support horizontal scrolling rather than breaking columns.

---

# 77. ADMIN DESIGN LANGUAGE

Use existing ETHSLTD design tokens.

Existing characteristics:

* Premium
* Modern
* Dark-first
* Light-mode compatible
* High contrast
* Semantic colors
* Subtle borders
* Rounded cards
* Compact operational tables

Do not introduce a completely separate visual identity.

---

# 78. STATUS COLORS

Semantic status tokens:

```text
Success
Warning
Danger
Info
Neutral
```

Do not rely exclusively on color.

Always combine:

```text
Icon + Label + Color
```

for important states.

---

# 79. TABLE SYSTEM

Admin tables must support:

```text
Sorting
Filtering
Search
Pagination
Column visibility
Responsive behavior
Empty states
Loading states
Error states
```

---

# 80. PAGINATION

Default:

```text
25 rows
```

Options:

```text
25
50
100
```

For very large datasets, use server-side pagination in the future.

---

# 81. FILTER SYSTEM

Filters should be:

```text
Composable
Clearable
Shareable
URL-state compatible
```

Example:

```text
/admin/withdrawals?status=pending&risk=high
```

---

# 82. EXPORT

Admin should support CSV export where appropriate.

Exportable datasets:

```text
Users
Orders
Trades
Wallet Transactions
Deposits
Withdrawals
P2P Orders
Disputes
Audit Logs
Support Tickets
```

Exports must respect admin permissions.

---

# 83. EXPORT SECURITY

Exports may contain sensitive information.

Therefore:

* Permission required
* Audit export action
* No public URLs
* Expiring download links in production
* Avoid exposing unnecessary PII

---

# 84. DATA PROVIDER ARCHITECTURE

Follow the existing mock provider architecture.

Example:

```text
MockAdminProvider
```

Interface:

```text
AdminProvider
```

The UI should depend on the interface rather than mock implementation.

---

# 85. PROVIDER MODULES

Recommended:

```text
AdminProvider

UserAdminProvider

KycAdminProvider

TradingAdminProvider

WalletAdminProvider

P2PAdminProvider

RiskAdminProvider

SupportAdminProvider

ContractAdminProvider

NotificationAdminProvider

AuditAdminProvider

MarketAdminProvider

SystemAdminProvider
```

---

# 86. MOCK DATA

Initially generate realistic data for:

```text
Users
KYC
Orders
Trades
Wallets
Deposits
Withdrawals
P2P Orders
Disputes
Risk Events
Tickets
Contracts
Audit Events
```

The data must be deterministic enough for development/testing.

---

# 87. STATE MANAGEMENT

Use Zustand only where client state is required.

Recommended stores:

```text
admin-ui-store.ts

admin-filter-store.ts

admin-session-store.ts
```

Do not put the entire admin database into Zustand.

Server/data state should remain provider-driven and later API-driven.

---

# 88. FORM VALIDATION

Use:

```text
React Hook Form
+
Zod
```

for:

* Admin actions
* KYC decisions
* User restrictions
* Withdrawal decisions
* P2P resolution
* Market configuration
* Fee configuration
* Settings
* Support
* Broadcast notifications

---

# 89. CONFIRMATION DIALOGS

High-risk actions must require explicit confirmation.

Examples:

```text
Freeze Account
Approve Withdrawal
Reject Withdrawal
Cancel Order
Resolve Dispute
Adjust Balance
Disable Market
Change Fee
Change Permission
```

---

# 90. TWO-STEP CONFIRMATION

For extremely sensitive actions:

```text
Action
↓
Review
↓
Confirmation
↓
2FA
↓
Execute
↓
Audit
```

This should be architecturally supported even if mock 2FA is initially used.

---

# 91. ERROR HANDLING

Every admin operation needs:

```text
Loading
Success
Failure
Retry
```

Never silently fail.

Example:

```text
Withdrawal approval failed.

Reason:
Provider unavailable.

Request ID:
REQ-123456
```

---

# 92. REQUEST IDs

Every administrative mutation should generate or propagate:

```text
request_id
```

This allows support and engineering teams to trace operations.

---

# 93. IDEMPOTENCY

Sensitive mutations should support idempotency.

Examples:

```text
Approve Withdrawal
Reject Withdrawal
Balance Adjustment
P2P Resolution
Admin Broadcast
```

Repeated requests must not produce duplicate financial effects.

---

# 94. FINANCIAL SAFETY

Admin must never directly manipulate:

```text
available_balance
locked_balance
total_balance
```

through arbitrary UI updates.

Instead:

```text
Admin Action
↓
Domain Command
↓
Ledger Operation
↓
Balance Projection
```

This keeps the financial model consistent with the existing Wallet/Portfolio architecture.

---

# 95. LEDGER INVESTIGATION

Admin should be able to trace:

```text
User
↓
Wallet
↓
Transaction
↓
Ledger Transaction
↓
Ledger Entries
↓
Order/Trade/P2P
```

This is essential for future reconciliation.

---

# 96. USER FINANCIAL TIMELINE

User detail should provide:

```text
Deposits
Withdrawals
Trades
P2P
Fees
Adjustments
```

in chronological order.

Example:

```text
09:30
Deposit +$1,000

10:05
BUY BTC -$500

10:05
Trading Fee -$0.50

12:20
Withdrawal -$250
```

---

# 97. SECURITY EVENTS

Admin should see:

```text
Login
Logout
Failed Login
Password Change
2FA Change
New Device
Session Revoked
Withdrawal Address Change
```

---

# 98. SESSION MANAGEMENT

Admins should be able to see user sessions:

```text
Device
Browser
OS
IP
Location approximation
Last Active
Created
```

Allowed action:

```text
Revoke Session
```

This integrates with the existing `/account/sessions` feature.

---

# 99. ADMIN SESSION SECURITY

Admin sessions must have stricter controls than normal users.

Recommended:

```text
Shorter session lifetime
2FA
Idle timeout
Secure cookies
Device tracking
Session revocation
```

---

# 100. ROUTE PROTECTION

Every `/admin/*` route must pass:

```text
Authenticated?
      ↓
Admin?
      ↓
Required Permission?
      ↓
Allow
```

Otherwise:

```text
401 → Not authenticated

403 → Not authorized
```

---

# 101. URL STRUCTURE

Final structure:

```text
/admin
/admin/users
/admin/users/[id]

/admin/kyc

/admin/trading
/admin/orders
/admin/orders/[id]
/admin/trades
/admin/trades/[id]

/admin/wallets
/admin/wallets/[id]

/admin/deposits
/admin/deposits/[id]

/admin/withdrawals
/admin/withdrawals/[id]

/admin/p2p
/admin/p2p/orders
/admin/p2p/orders/[id]
/admin/p2p/disputes
/admin/p2p/disputes/[id]

/admin/risk
/admin/risk/[id]

/admin/support
/admin/support/[id]

/admin/contracts
/admin/contracts/[id]

/admin/notifications

/admin/audit

/admin/markets
/admin/markets/[id]

/admin/settings
/admin/system
```

---

# 102. NAVIGATION

Sidebar:

```text
Overview

Users
KYC

Trading
Orders
Trades
Markets

Wallets
Deposits
Withdrawals

P2P
Disputes

Risk

Support

Contracts
Notifications

Audit Logs

Settings
System
```

Navigation must dynamically hide modules unavailable to the current role.

---

# 103. BREADCRUMBS

Use breadcrumbs on deep routes.

Example:

```text
Admin
/
Users
/
USR-10024
```

---

# 104. ADMIN HEADER

Header should contain:

```text
ETHSLTD Admin

Global Search

Notifications

System Status

Admin Profile
```

Admin profile dropdown:

```text
Profile
Security
Active Sessions
Logout
```

---

# 105. ADMIN NOTIFICATIONS

Admin notification center should support:

```text
Critical
High
Normal
Info
```

Examples:

```text
Critical withdrawal risk alert
New KYC escalation
P2P dispute opened
System degradation
High error rate
```

---

# 106. EMPTY STATES

Every table must have a meaningful empty state.

Example:

```text
No pending withdrawals

There are currently no withdrawals waiting for review.
```

---

# 107. LOADING STATES

Use skeletons rather than full-screen spinners wherever possible.

---

# 108. ERROR STATES

Example:

```text
Unable to load withdrawals.

Try again
```

Do not expose internal stack traces.

---

# 109. ACCESS-DENIED STATES

Example:

```text
Access Restricted

You do not have permission to access this area.
```

---

# 110. DATA CONSISTENCY

Admin data must use the same domain terminology as the existing platform.

Examples:

```text
Available
Locked
Total

Order
Trade
Transaction

Buyer
Seller

Demo
Live
```

Do not introduce alternate terminology such as:

```text
Free Balance
Reserved Balance
Execution
Deal
```

unless required by a specific context.

---

# 111. DEMO VS LIVE

The platform already uses Demo Trading.

The Admin Console must distinguish:

```text
DEMO
LIVE
```

Demo data must never be confused with live financial data.

Display badges:

```text
DEMO
```

and later:

```text
LIVE
```

---

# 112. MOCK ENVIRONMENT

Current implementation should default to:

```text
DEMO / MOCK
```

No real financial transaction should occur.

The Admin UI should nevertheless behave as if connected to a real operational backend.

---

# 113. LIVE BACKEND COMPATIBILITY

Do not write UI logic like:

```text
if mock then ...
else ...
```

throughout components.

Instead:

```text
AdminProvider
```

should abstract the implementation.

Future:

```text
MockAdminProvider
```

can become:

```text
ApiAdminProvider
```

without redesigning the UI.

---

# 114. TYPES

Create centralized admin types.

Recommended:

```text
lib/admin/types.ts
```

Potential types:

```text
AdminRole
AdminPermission
AdminUser
AdminUserStatus
KycApplication
AdminOrder
AdminTrade
AdminWallet
AdminDeposit
AdminWithdrawal
AdminP2POrder
AdminDispute
RiskEvent
SupportTicket
ContractRecord
AuditEvent
SystemHealth
AdminNotification
```

---

# 115. ENUM CONSISTENCY

Do not duplicate status strings throughout components.

Create centralized enums/constants.

Example:

```text
ORDER_STATUS
WITHDRAWAL_STATUS
KYC_STATUS
P2P_STATUS
DISPUTE_STATUS
RISK_LEVEL
TICKET_STATUS
```

---

# 116. ADMIN COMPONENT LIBRARY

Create reusable components:

```text
AdminSidebar
AdminHeader
AdminBreadcrumbs
AdminPageHeader
AdminStatCard
AdminDataTable
AdminFilterBar
AdminSearch
AdminStatusBadge
AdminUserAvatar
AdminEmptyState
AdminLoadingState
AdminErrorState
AdminConfirmDialog
AdminDrawer
AdminDetailPanel
AdminTimeline
AdminActivityFeed
AdminPermissionGuard
```

---

# 117. DETAIL PAGE COMPONENTS

Reusable:

```text
DetailSection
DetailRow
FinancialSummary
EntityTimeline
AuditTimeline
RelatedRecords
```

---

# 118. DATA TABLE COMPONENT

The reusable table must support:

```text
columns
sorting
filtering
pagination
row actions
selection
loading
empty
error
responsive
```

---

# 119. PERFORMANCE

Admin tables may eventually contain millions of records.

Therefore architecture must support:

```text
Server-side pagination
Server-side filtering
Server-side sorting
Cursor pagination
```

The initial mock implementation may use local data.

---

# 120. FRONTEND PERFORMANCE

Avoid:

```text
Rendering thousands of rows
Large global Zustand state
Repeated expensive calculations
Unnecessary re-renders
```

Use virtualization when necessary.

---

# 121. ACCESSIBILITY

Admin Console must support:

* Keyboard navigation
* Focus states
* Screen readers
* Accessible dialogs
* Accessible tables
* Accessible forms
* Sufficient contrast
* Reduced motion

---

# 122. RESPONSIVE BREAKPOINTS

Follow the existing ETHSLTD responsive system.

Desktop:

```text
≥ 1280px
```

Tablet:

```text
768px–1279px
```

Mobile:

```text
< 768px
```

---

# 123. DARK/LIGHT MODE

The Admin Console must support the existing theme system.

Use:

```text
next-themes
```

and existing semantic design tokens.

Do not hard-code dark-only colors.

---

# 124. USD FORMATTING

Use a centralized formatter.

Example:

```text
formatUSD(1000)
→ $1,000.00
```

Large values:

```text
$1.24M
$18.42M
```

where appropriate.

Full precision should remain accessible in detail views.

---

# 125. DATE/TIME

Use a centralized date formatter.

Admin detail pages should show:

```text
Local display
+
exact timestamp on hover/detail
```

Timezone should be configurable.

---

# 126. SECURITY REQUIREMENTS

Admin Console must follow:

```text
RBAC
2FA
Secure Sessions
CSRF protection where applicable
XSS protection
CSP
Secure Cookies
Input Validation
Rate Limiting
Audit Logging
Least Privilege
```

---

# 127. SENSITIVE DATA

Avoid displaying unnecessary:

```text
Passwords
Authentication secrets
Private keys
Recovery codes
Full payment credentials
```

Sensitive information must be masked.

---

# 128. WALLET ADDRESSES

Wallet addresses may be displayed when operationally necessary.

Provide:

```text
Copy
Truncated display
Full value in detail
```

---

# 129. ADMIN ACTION AUDITING

Every mutation must create an audit event.

Required pattern:

```text
Admin
+
Action
+
Entity
+
Before
+
After
+
Reason
+
Timestamp
+
Request ID
```

---

# 130. ANALYTICS

Dashboard should support charts for:

```text
User Growth
Trading Volume
P2P Volume
Deposits
Withdrawals
KYC Applications
Support Tickets
```

---

# 131. TRADING VOLUME CHART

Example:

```text
24H Trading Volume

$5M ┤
$4M ┤       ╭──╮
$3M ┤   ╭───╯  ╰──╮
$2M ┤───╯         ╰──
$1M ┤
     └────────────────
```

Use lightweight charting where appropriate.

---

# 132. USER GROWTH CHART

Display:

```text
New Users
Active Users
Verified Users
```

with selectable time range.

---

# 133. P2P ANALYTICS

Display:

```text
P2P Volume
Completed Orders
Disputes
Completion Rate
Average Completion Time
```

---

# 134. WITHDRAWAL ANALYTICS

Display:

```text
Total Withdrawals
Pending
Approved
Rejected
Failed
Average Processing Time
```

---

# 135. KYC ANALYTICS

Display:

```text
Applications
Approved
Rejected
Pending
Average Review Time
```

---

# 136. SUPPORT ANALYTICS

Display:

```text
Open Tickets
Resolved
Average Response Time
Average Resolution Time
Critical Tickets
```

---

# 137. SYSTEM ALERTS

Critical system conditions should appear prominently.

Examples:

```text
Trading Engine Degraded
High Withdrawal Failure Rate
Database Error Rate Increased
Queue Backlog
WebSocket Failure
```

---

# 138. CRITICAL ALERT BEHAVIOR

Critical alerts must:

* Remain visible until acknowledged
* Show timestamp
* Show affected service
* Show severity
* Provide details
* Be auditable

---

# 139. ADMIN SEARCH SHORTCUT

Keyboard shortcut:

```text
/
```

or:

```text
Cmd/Ctrl + K
```

opens global admin search.

---

# 140. KEYBOARD ACCESS

Useful shortcuts:

```text
Cmd/Ctrl + K
/
Esc
Enter
Arrow keys
```

Do not make shortcuts interfere with text inputs.

---

# 141. CONFIRMATION LANGUAGE

Use explicit language.

Bad:

```text
Are you sure?
```

Good:

```text
Freeze this account?

The user will be unable to trade, withdraw or use P2P until the account is unfrozen.

Reason:
[................]

[Cancel] [Freeze Account]
```

---

# 142. NO SILENT FINANCIAL ACTIONS

Never:

```text
Click
→
balance changes
```

without a visible operation/result.

Every financial action must show:

```text
What happened
Amount
Asset
Reference
Status
```

---

# 143. OPERATION RESULT

After successful action:

```text
Withdrawal approved.

Withdrawal:
WD-10284

Amount:
$2,500.00

Request ID:
REQ-928381
```

---

# 144. ADMIN DASHBOARD QUICK ACTIONS

Depending on role:

```text
Review KYC
Review Withdrawals
Review P2P Disputes
Review Risk Alerts
Open Support Queue
View System Health
```

---

# 145. RECENT OPERATIONS

Dashboard should show last admin actions performed by the current administrator.

Example:

```text
09:42
Approved withdrawal WD-1004

09:31
Rejected KYC KYC-882

09:20
Resolved P2P dispute DSP-102
```

---

# 146. ADMIN PROFILE

Route:

```text
/admin/profile
```

Although not required in the first dashboard implementation, the architecture should support:

```text
Name
Email
Role
Permissions
2FA
Sessions
Activity
```

---

# 147. ADMIN SECURITY

Route:

```text
/admin/security
```

Support:

```text
Change Password
2FA
Sessions
Security Events
```

---

# 148. ADMIN SESSION REVOCATION

A SUPER_ADMIN should eventually be able to revoke administrator sessions.

All revocations must be audited.

---

# 149. ROLE MANAGEMENT

Only SUPER_ADMIN should manage roles.

Interface:

```text
Role
Permissions
Members
```

Actions:

```text
Create Role
Edit Role
Assign Permission
Remove Permission
Assign User
Remove User
```

---

# 150. PERMISSION MATRIX

The UI should eventually provide a matrix:

| Permission Area | Read |      Write | Approve | Reject | Freeze |
| --------------- | ---: | ---------: | ------: | -----: | -----: |
| Users           |    ✓ |          ✓ |       — |      — |      ✓ |
| KYC             |    ✓ |          ✓ |       ✓ |      ✓ |      ✓ |
| Trading         |    ✓ |          ✓ |       — |      — |      — |
| Wallet          |    ✓ | Restricted |       — |      — |      ✓ |
| Withdrawals     |    ✓ |          — |       ✓ |      ✓ |      ✓ |
| P2P             |    ✓ |          ✓ |       — |      — |      ✓ |
| Risk            |    ✓ |          ✓ |       — |      — |      ✓ |
| Support         |    ✓ |          ✓ |       — |      — |      — |
| Audit           |    ✓ |          — |       — |      — |      — |
| Settings        |    ✓ |          ✓ |       — |      — |      — |

The actual permission model should remain granular rather than relying only on this display.

---

# 151. TEST DATA

Development should include realistic scenarios:

### User

```text
USR-10001
Verified
Low Risk
$10,000.00
```

### High Risk User

```text
USR-10042
Verified
High Risk
$25,500.00
```

### Pending KYC

```text
USR-10075
Pending
```

### Pending Withdrawal

```text
WD-10023
$2,500.00
Pending Review
```

### P2P Dispute

```text
DSP-10012
$750.00
Under Review
```

---

# 152. TEST SCENARIOS

The mock admin environment must support:

```text
Normal User
Frozen User
Pending KYC
Rejected KYC
High Risk User
Pending Deposit
Pending Withdrawal
Failed Withdrawal
Open P2P Order
Disputed P2P Order
Completed P2P Order
Open Support Ticket
Critical System Alert
```

---

# 153. UNIT TESTING

Test:

```text
Permission checks
Role checks
Currency formatting
Status mapping
Filter logic
Sort logic
Pagination
Risk severity
Audit event creation
```

---

# 154. INTEGRATION TESTING

Test:

```text
Admin login
Role authorization
User freeze
KYC approval
Order cancellation
Withdrawal approval
P2P dispute resolution
Audit generation
```

---

# 155. E2E TESTING

Use Playwright.

Critical flows:

```text
Admin Login
→ Dashboard

Dashboard
→ Users
→ User Detail
→ Freeze User

KYC
→ Open Application
→ Approve
→ Audit

Withdrawals
→ Open Withdrawal
→ Review
→ Approve
→ Audit

P2P
→ Open Dispute
→ Resolve
→ Audit
```

---

# 156. SECURITY TESTING

Test:

```text
Unauthenticated /admin
→ 401/redirect

USER /admin
→ 403

SUPPORT_ADMIN /admin/withdrawals
→ 403

FINANCE_ADMIN /admin/withdrawals
→ allowed

AUDITOR /admin/audit
→ allowed

AUDITOR /admin/users/[id]/freeze
→ denied
```

---

# 157. FINANCIAL TESTING

Verify:

```text
No duplicate balance adjustments
No duplicate withdrawal approvals
No duplicate P2P resolution
No negative available balance
Locked funds remain locked correctly
Audit entries match operations
```

---

# 158. MOCK PROVIDER TESTING

Mock providers must expose realistic asynchronous behavior:

```text
Loading
Success
Failure
Timeout
Empty
```

This ensures the frontend handles real-world API behavior.

---

# 159. ERROR SIMULATION

Development mode should allow simulated:

```text
API Failure
Timeout
Unauthorized
Forbidden
Validation Error
Server Error
```

---

# 160. FILE STRUCTURE

Recommended implementation:

```text
app/
└── admin/
    ├── layout.tsx
    ├── page.tsx
    ├── users/
    ├── kyc/
    ├── trading/
    ├── orders/
    ├── trades/
    ├── wallets/
    ├── deposits/
    ├── withdrawals/
    ├── p2p/
    ├── risk/
    ├── support/
    ├── contracts/
    ├── notifications/
    ├── audit/
    ├── markets/
    ├── settings/
    ├── system/
    ├── profile/
    └── security/

components/
└── admin/
    ├── AdminSidebar.tsx
    ├── AdminHeader.tsx
    ├── AdminDataTable.tsx
    ├── AdminFilterBar.tsx
    ├── AdminStatusBadge.tsx
    ├── AdminStatCard.tsx
    ├── AdminTimeline.tsx
    ├── AdminConfirmDialog.tsx
    ├── AdminPermissionGuard.tsx
    └── ...

lib/
└── admin/
    ├── types.ts
    ├── permissions.ts
    ├── constants.ts
    ├── formatters.ts
    ├── providers/
    │   ├── admin-provider.ts
    │   ├── mock-admin-provider.ts
    │   ├── user-provider.ts
    │   ├── kyc-provider.ts
    │   ├── wallet-provider.ts
    │   ├── trading-provider.ts
    │   ├── p2p-provider.ts
    │   ├── risk-provider.ts
    │   ├── support-provider.ts
    │   ├── contract-provider.ts
    │   ├── audit-provider.ts
    │   └── system-provider.ts
    └── stores/
        ├── admin-ui-store.ts
        ├── admin-filter-store.ts
        └── admin-session-store.ts
```

---

# 161. INTEGRATION WITH EXISTING CODE

Do not duplicate existing domain logic.

Reuse:

```text
Market types
Demo account concepts
Wallet types
P2P types
Auth types
Security types
USD formatting
Theme tokens
Design system
```

The Admin Console should consume these domain concepts rather than creating incompatible alternatives.

---

# 162. EXISTING ROUTES MUST NOT BREAK

After implementation, verify:

```text
/
 /markets
 /trade
 /login
 /register
 /forgot-password
 /reset-password
 /verify-email
 /account/*
 /p2p
 /p2p/order/[id]
 /p2p/orders
 /wallet
 /wallet/deposit
 /wallet/withdraw
 /wallet/history
```

continue functioning.

---

# 163. GLOBAL HEADER

The public header must not accidentally expose admin navigation to normal users.

Admin navigation should only appear for authorized administrators.

---

# 164. ADMIN ENTRY POINT

For authorized administrators:

```text
Admin Console
```

may appear in the account menu.

For normal users:

```text
Admin Console
```

must not be visible.

---

# 165. FOOTER

The Admin Console should not use the same marketing footer as the public website.

Use a compact operational footer:

```text
ETHSLTD Admin
Environment
Version
System Status
© 2026 ETHSLTD
```

---

# 166. ENVIRONMENT INDICATOR

Always display:

```text
DEMO / MOCK
```

during development.

Later:

```text
STAGING
```

or:

```text
PRODUCTION
```

must be visually obvious.

This prevents accidental production operations.

---

# 167. PRODUCTION SAFETY

Before production, the interface must make it impossible to confuse:

```text
DEMO
STAGING
PRODUCTION
```

with each other.

---

# 168. NO REAL FINANCIAL CLAIMS

The mock Admin Console must not imply that simulated balances represent real customer funds.

Use:

```text
Simulated
Demo
Mock
```

where appropriate in development.

---

# 169. ADMIN DATA PRIVACY

Admin users should only see information necessary for their role.

Example:

A support administrator should not automatically see:

```text
full KYC documents
risk rules
financial configuration
```

unless specifically authorized.

---

# 170. LEAST PRIVILEGE

Default permissions should be minimal.

New administrators should receive no permissions until assigned.

---

# 171. AUDITOR ROLE

AUDITOR should be primarily read-only.

Allowed:

```text
View
Search
Filter
Export where authorized
```

Not allowed:

```text
Freeze
Approve
Reject
Modify
Delete
```

---

# 172. SUPPORT ADMIN ROLE

SUPPORT_ADMIN should primarily access:

```text
Users
Support
Basic Orders
Basic P2P
Basic Account Information
```

It should not automatically have access to:

```text
Withdraw approval
Balance adjustment
Risk controls
Fee configuration
```

---

# 173. FINANCE ADMIN ROLE

FINANCE_ADMIN should access:

```text
Wallets
Deposits
Withdrawals
Transactions
Ledger investigations
Financial reports
```

but should not automatically have:

```text
Role management
System settings
Security configuration
```

---

# 174. TRADING ADMIN ROLE

TRADING_ADMIN should access:

```text
Markets
Orders
Trades
Trading metrics
Trading configuration
```

---

# 175. P2P ADMIN ROLE

P2P_ADMIN should access:

```text
P2P
Orders
Merchants
Disputes
Escrow state
```

---

# 176. KYC ADMIN ROLE

KYC_ADMIN should access:

```text
KYC
User identity information
Verification workflow
KYC documents
Review notes
```

---

# 177. RISK MANAGER ROLE

RISK_MANAGER should access:

```text
Risk
Users
Withdrawals
Trading activity
P2P activity
Security events
```

---

# 178. SUPER ADMIN

SUPER_ADMIN has complete administrative authority.

However, even SUPER_ADMIN actions must be audited.

---

# 179. ADMIN DATA MODEL

Conceptual model:

```text
AdminUser
    ↓
AdminRole
    ↓
AdminPermission
    ↓
AdminAction
    ↓
AuditEvent
```

---

# 180. AUDIT DATA MODEL

Conceptual:

```text
AuditEvent {
    id
    actorId
    actorRole
    action
    entityType
    entityId
    before
    after
    reason
    requestId
    ip
    userAgent
    createdAt
}
```

---

# 181. USER DATA MODEL

Admin-facing user model:

```text
AdminUserSummary {
    id
    email
    name
    status
    kycStatus
    riskLevel
    role
    balanceUSD
    tradingVolumeUSD
    p2pVolumeUSD
    createdAt
    lastLoginAt
}
```

---

# 182. WITHDRAWAL DATA MODEL

```text
AdminWithdrawal {
    id
    userId
    asset
    amount
    usdValue
    destination
    network
    fee
    status
    riskLevel
    createdAt
    updatedAt
}
```

---

# 183. P2P DISPUTE DATA MODEL

```text
AdminDispute {
    id
    orderId
    buyerId
    sellerId
    asset
    amount
    usdValue
    status
    reason
    openedAt
    resolvedAt
    resolvedBy
}
```

---

# 184. SYSTEM HEALTH MODEL

```text
SystemService {
    name
    status
    latency
    errorRate
    lastChecked
}
```

---

# 185. ADMIN API CONTRACT

The future backend should expose operations conceptually similar to:

```text
GET /admin/dashboard

GET /admin/users
GET /admin/users/:id

POST /admin/users/:id/freeze
POST /admin/users/:id/unfreeze

GET /admin/kyc
GET /admin/kyc/:id
POST /admin/kyc/:id/approve
POST /admin/kyc/:id/reject

GET /admin/orders
POST /admin/orders/:id/cancel

GET /admin/trades

GET /admin/wallets
GET /admin/deposits
GET /admin/withdrawals
POST /admin/withdrawals/:id/approve
POST /admin/withdrawals/:id/reject

GET /admin/p2p/orders
GET /admin/p2p/disputes
POST /admin/p2p/disputes/:id/resolve

GET /admin/risk
GET /admin/support
GET /admin/contracts
GET /admin/audit
GET /admin/markets
GET /admin/settings
GET /admin/system
```

These are conceptual contracts for the provider abstraction, not a requirement to build the backend now.

---

# 186. WEBSOCKET REQUIREMENTS

The Admin Console should be architecturally ready for realtime events.

Future channels:

```text
admin.system
admin.withdrawals
admin.kyc
admin.p2p
admin.risk
admin.trading
admin.notifications
```

---

# 187. REALTIME DASHBOARD

When realtime backend is available:

```text
New Withdrawal
→ Dashboard updates

New KYC
→ Queue updates

New Dispute
→ P2P counter updates

System Incident
→ Alert appears
```

The current mock provider may simulate these events.

---

# 188. NOTIFICATION BADGES

Sidebar should show counters:

```text
KYC        12
Withdrawals 7
Disputes    3
Risk        5
Support    18
```

Counts must represent actionable records.

---

# 189. BREADCRUMB + BACK NAVIGATION

Detail pages should provide:

```text
← Back to Users
```

and breadcrumbs.

Browser back navigation must remain functional.

---

# 190. MOBILE ADMIN

Mobile must support operational tasks such as:

```text
View user
Review KYC
Review withdrawal
Review dispute
View alert
```

However, highly destructive or configuration-heavy actions may require stronger confirmation.

---

# 191. ADMIN UX PRINCIPLE

The administrator should be able to answer:

```text
What is happening?
Who is affected?
How much money is involved?
What is the current status?
What happened previously?
What action can I take?
Who performed the previous action?
```

without navigating through unrelated pages.

---

# 192. FINAL ACCEPTANCE CRITERIA

The Admin Console is considered complete when:

### Authentication

* Admin login works.
* Unauthorized users cannot access `/admin`.
* Permissions are enforced.
* Admin logout works.
* Admin sessions work.

### Dashboard

* KPI cards work.
* USD values display correctly.
* Activity feed works.
* System status works.
* Quick actions work.

### Users

* Search works.
* Filters work.
* User detail works.
* Freeze/unfreeze works in mock mode.
* Actions are audited.

### KYC

* Queue works.
* Detail works.
* Approve works.
* Reject works.
* Reviewer information works.
* Actions are audited.

### Trading

* Markets work.
* Orders work.
* Trades work.
* Order detail works.
* Admin cancellation works.

### Wallet

* Wallets work.
* Deposits work.
* Withdrawals work.
* Financial details are consistent with existing Wallet architecture.

### P2P

* Orders work.
* Disputes work.
* Resolution works.
* Escrow state is visible.
* Actions are audited.

### Risk

* Risk queue works.
* Risk events work.
* User risk detail works.
* Restrictions work in mock mode.

### Support

* Ticket queue works.
* Ticket detail works.
* Assignment works.
* Status works.

### Contracts

* Templates work.
* Versions work.
* Signed records are visible.

### Notifications

* Admin notifications work.
* Broadcast interface works according to permission.

### Audit

* Audit events are visible.
* Filters work.
* No editing/deleting audit records.

### Settings

* Settings are grouped.
* USD is default.
* Changes are permission controlled.
* Changes are audited.

### System

* System health dashboard works.
* Services have status indicators.
* Errors are represented correctly.

---

# 193. PERFORMANCE ACCEPTANCE CRITERIA

Target:

```text
Fast initial Admin Dashboard render
No unnecessary full-page reloads
Smooth table interaction
Debounced search
Responsive filters
No visible layout shift
```

Admin tables should remain responsive with large mock datasets.

---

# 194. QUALITY ACCEPTANCE CRITERIA

Must pass:

```text
TypeScript
ESLint
Build
Unit Tests
Integration Tests
Playwright E2E
Responsive Testing
Dark Mode
Light Mode
Accessibility checks
```

---

# 195. EXISTING FEATURE REGRESSION TEST

After Admin implementation verify:

```text
Homepage
Markets
Trade
Authentication
Account
P2P
Wallet
```

No existing feature should regress.

---

# 196. TECHNOLOGY CONSISTENCY

Do not introduce unnecessary new frameworks.

Use the existing stack:

```text
Next.js 15
App Router
TypeScript
Tailwind CSS v4
Zustand
React Hook Form
Zod
Radix UI
Lucide React
Lightweight Charts
Mock Providers
Cloudflare-compatible architecture
```

---

# 197. NO UNNECESSARY DEPENDENCIES

Before installing any new package, determine whether the existing stack can accomplish the requirement.

Prefer:

```text
Existing components
Existing utilities
Existing providers
Existing design tokens
```

---

# 198. CODE QUALITY

Requirements:

```text
Strict TypeScript
No any unless unavoidable
Reusable components
Centralized constants
Centralized types
Small components
Clear provider interfaces
No duplicated domain logic
No hard-coded financial calculations
```

---

# 199. DOCUMENTATION

Add:

```text
docs/admin/
```

with:

```text
README.md
permissions.md
architecture.md
provider-contracts.md
testing.md
security.md
```

---

# 200. PRIMARY DEVELOPMENT OBJECTIVE

The developer should be able to open the repository and implement this PRD without needing to redesign the Admin Console architecture.

The result should feel like a natural extension of the existing ETHSLTD platform.

---

# 201. FINAL PRODUCT STRUCTURE

After this module, the ETHSLTD web application should conceptually contain:

```text
ETHSLTD
│
├── Public Platform
│   ├── Home
│   ├── Markets
│   ├── Demo Trading
│   └── Education
│
├── Authentication
│   ├── Login
│   ├── Registration
│   ├── Password Recovery
│   └── Verification
│
├── User Account
│   ├── Profile
│   ├── Security
│   ├── Sessions
│   └── Preferences
│
├── Wallet
│   ├── Portfolio
│   ├── Deposit
│   ├── Withdraw
│   └── History
│
├── P2P
│   ├── Marketplace
│   ├── Orders
│   ├── Chat
│   └── Disputes
│
└── Admin
    ├── Dashboard
    ├── Users
    ├── KYC
    ├── Trading
    ├── Orders
    ├── Trades
    ├── Wallets
    ├── Deposits
    ├── Withdrawals
    ├── P2P
    ├── Risk
    ├── Support
    ├── Contracts
    ├── Notifications
    ├── Audit
    ├── Markets
    ├── Settings
    └── System
```

---

# 202. DEFINITION OF DONE

This PRD is complete when the ETHSLTD Admin & Operations Console provides a coherent internal operational experience across the existing platform.

The implementation must be:

* USD-first
* Responsive
* Light/dark compatible
* Type-safe
* Permission-aware
* Audit-aware
* Provider-driven
* Mock-backend compatible
* Cloudflare-compatible
* Production-backend-ready
* Consistent with existing ETHSLTD modules
* Consistent with existing design system
* Safe for future financial integrations

Most importantly, the Admin Console must **not introduce a second architecture**.

It must extend the architecture already established by:

```text
Homepage
+
Markets
+
Demo Trading
+
Authentication
+
Account Security
+
P2P
+
Wallet
```

into a unified operational platform.

**Default financial display: USD.**

**Default development environment: Mock/Demo.**

**Real-money financial operations: not enabled by this PRD.**
