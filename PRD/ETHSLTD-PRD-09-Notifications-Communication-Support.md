Yes — the previous `ETHSLTD-PRD-08-Notifications-Communication-Support.md` content was incorrect because it duplicated the Admin & Operations Console PRD. The file search confirms that the duplicated document is the Admin Console specification, including `/admin`, RBAC, users, KYC, withdrawals, orders, P2P disputes, and audit logs. 

The **correct PRD-08** should be for **Notifications, Communication & Customer Support**, while integrating with the already-completed Authentication, Account, Wallet, Trading, P2P and Admin systems.

# Correct PRD

**Recommended filename:**

`ETHSLTD-PRD-08-Notifications-Communication-Support.md`

**Document Version:** 1.0
**Product:** ETHSLTD Crypto
**Module:** Notifications, Communication & Customer Support
**Primary Routes:** `/notifications`, `/support`, `/support/tickets`, `/support/tickets/[id]`
**Admin Routes:** `/admin/notifications`, `/admin/support`, `/admin/support/tickets/[id]`
**Currency Standard:** **USD**
**Status:** Ready for Development
**Architecture:** Consistent with the existing ETHSLTD Next.js 15 + TypeScript + Tailwind CSS + Zustand + Mock Provider architecture.

---

# ETHSLTD Crypto — Notifications, Communication & Customer Support

## 1. Document Purpose

This PRD defines the complete **ETHSLTD Notifications, Communication & Customer Support system**.

The module provides a centralized communication layer between ETHSLTD and its users.

It must support:

* transactional notifications
* trading notifications
* wallet notifications
* P2P notifications
* security alerts
* account notifications
* system announcements
* promotional communications
* in-app notification center
* email communication architecture
* push notification architecture
* notification preferences
* notification history
* customer support
* support tickets
* ticket conversations
* support categories
* FAQ/help-center entry points
* live chat integration
* support escalation
* admin/operator communication tools
* notification templates
* notification delivery states
* notification audit history

The system must be designed so the current mock providers can later be replaced by production notification, email, push, and support services without redesigning the frontend.

---

# 2. Existing ETHSLTD Context

The following systems already exist and must remain compatible.

| Module         | Route                       | Status       |
| -------------- | --------------------------- | ------------ |
| Homepage       | `/`                         | Complete     |
| Markets        | `/markets`                  | Complete     |
| Trading        | `/trade`                    | Complete     |
| Authentication | `/login`, `/register`, etc. | Complete     |
| Account        | `/account/*`                | Complete     |
| P2P            | `/p2p`                      | Complete     |
| P2P Orders     | `/p2p/orders`               | Complete     |
| Wallet         | `/wallet`                   | Complete     |
| Deposits       | `/wallet/deposit`           | Complete     |
| Withdrawals    | `/wallet/withdraw`          | Complete     |
| Wallet History | `/wallet/history`           | Complete     |
| Admin Console  | `/admin/*`                  | Complete     |
| Notifications  | `/notifications`            | **This PRD** |
| Support        | `/support/*`                | **This PRD** |

The existing design system requires reuse of the established ETHSLTD components, tokens, typography, spacing, themes and responsive behavior rather than creating a separate design language. 

---

# 3. Product Objective

The system should answer:

> **"What does the user need to know, and how can ETHSLTD help them resolve an issue?"**

The experience should allow a user to:

```text
Receive notification
       ↓
Understand event
       ↓
Open relevant context
       ↓
Take action
       ↓
Resolve issue / continue activity
```

Examples:

```text
Withdrawal completed
        ↓
Open withdrawal details
        ↓
View transaction information
```

```text
P2P payment received
        ↓
Open P2P order
        ↓
Continue trade
```

```text
Suspicious login detected
        ↓
Open security alert
        ↓
Review session
        ↓
Secure account
```

```text
Trading issue
        ↓
Open Support
        ↓
Create ticket
        ↓
Communicate with support
        ↓
Resolve ticket
```

---

# 4. Design Principles

The module must feel:

* trustworthy
* financial-grade
* responsive
* fast
* clear
* non-intrusive
* secure
* actionable
* organized
* professional

It must **not** feel like:

* a generic social notification system
* a spam-heavy marketing system
* a basic contact form
* an unrelated customer-service SaaS product

The design should communicate:

> **"ETHSLTD keeps me informed and gives me a clear path to assistance."**

---

# 5. Existing Design System Rules

Reuse:

* Tailwind CSS v4
* semantic design tokens
* existing light/dark mode
* Radix UI
* Lucide React
* existing Button
* existing Card
* existing Input
* existing Dialog
* existing Dropdown
* existing Tabs
* existing Badge
* existing Table
* existing Toast
* existing Skeleton
* existing EmptyState
* existing ErrorState

The existing visual formula remains:

```text
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
```

The existing design system specifically requires semantic colors instead of arbitrary colors and requires Light/Dark/System theme support. 

---

# 6. Currency Standard

**USD is the default currency everywhere.**

Examples:

```text
$10,000.00
$250.50
$1,245.75
```

Do not introduce INR as a default.

USD must be used for:

* support transaction context
* deposit context
* withdrawal context
* P2P order amounts
* trading values
* notification previews
* account alerts
* financial support tickets
* admin communication
* transaction references

The architecture may support additional fiat currencies later, but USD is the initial/default display currency.

---

# 7. Notification Types

Notifications are divided into six major categories.

## 7.1 Security

Examples:

* New login detected
* New device login
* Password changed
* Email changed
* 2FA enabled
* 2FA disabled
* Anti-phishing code changed
* Session revoked
* Suspicious activity detected
* Account security restriction
* Withdrawal security hold

Security notifications are high priority.

---

## 7.2 Trading

Examples:

* Order placed
* Order partially filled
* Order fully filled
* Order cancelled
* Stop/limit order triggered
* Trade executed
* Trading restriction
* Insufficient balance
* Market unavailable

Example:

> **BTC/USDT order filled**

```text
Buy
0.025 BTC
Execution Price: $104,250.00
Total: $2,606.25
```

---

# 8. Wallet Notifications

Examples:

* Deposit initiated
* Deposit detected
* Deposit confirmed
* Deposit completed
* Deposit failed
* Withdrawal requested
* Withdrawal processing
* Withdrawal completed
* Withdrawal rejected
* Withdrawal cancelled
* Withdrawal delayed
* Network confirmation update

Example:

> **Withdrawal completed**

```text
Amount: $1,250.00
Asset: USDT
Status: Completed
```

CTA:

**View Withdrawal**

---

# 9. P2P Notifications

Examples:

* P2P order created
* Seller accepted
* Buyer payment instructions available
* Payment marked
* Merchant notified
* Trade completed
* Order cancelled
* Payment deadline approaching
* P2P dispute opened
* Dispute response required
* Dispute resolved

Example:

> **Payment marked**

```text
P2P Order: #P2P-20481
Amount: $750.00
Asset: USDT
```

CTA:

**Open Order**

---

# 10. Account Notifications

Examples:

* Profile updated
* Email verification required
* Identity verification requested
* KYC approved
* KYC rejected
* KYC additional information required
* Account limitation
* Account restored
* Preference changed

---

# 11. System Notifications

Examples:

* Scheduled maintenance
* Market maintenance
* Wallet maintenance
* Temporary service interruption
* System recovery
* New feature announcement
* Supported asset changes

System notifications may be:

* informational
* warning
* critical

---

# 12. Promotional Notifications

Promotional communications may include:

* new product
* educational campaign
* platform announcement
* feature launch
* trading competition
* promotional campaign

Marketing notifications must be separated from transactional/security notifications.

Users must be able to disable eligible marketing communications.

Security and essential transactional notifications cannot be disabled.

---

# 13. Notification Priority

Every notification must have a priority.

```text
LOW
NORMAL
HIGH
CRITICAL
```

### LOW

Examples:

* educational article
* general announcement

### NORMAL

Examples:

* completed trade
* portfolio update

### HIGH

Examples:

* withdrawal completed
* P2P payment deadline
* KYC action required

### CRITICAL

Examples:

* suspicious login
* security restriction
* account compromise warning

---

# 14. Notification Channels

The architecture must support:

```text
IN_APP
EMAIL
PUSH
```

Optional future channel:

```text
SMS
```

SMS should **not** be required for the initial implementation.

---

# 15. In-App Notification Center

Primary route:

`/notifications`

The page must provide a complete notification inbox.

## Header

```text
Notifications

[Mark all as read]
[Notification Settings]
```

---

# 16. Notification Summary

Display:

```text
All
Unread
Security
Trading
Wallet
P2P
Account
System
```

Each tab displays a count where applicable.

Example:

```text
All       12
Unread     4
Security   1
Trading    2
Wallet     1
P2P        0
```

---

# 17. Notification List

Each notification contains:

* icon
* category
* title
* short message
* timestamp
* unread state
* priority
* CTA where applicable

Example:

```text
[Shield]

New login detected

A new device signed into your ETHSLTD account.

Chrome • Windows
New York, US

5 minutes ago

[Review Session]
```

---

# 18. Notification States

Every notification supports:

```text
Unread
Read
Archived
Deleted
```

Unread notifications must have stronger visual hierarchy.

Do not rely exclusively on color to identify unread notifications.

---

# 19. Notification Actions

Users can:

* open notification
* mark as read
* mark as unread
* archive
* delete
* mark all as read
* filter
* search
* navigate to related resource

Contextual CTAs must be supported.

Examples:

```text
View Trade
View Withdrawal
Open P2P Order
Review Security
Complete KYC
Open Ticket
```

---

# 20. Notification Deep Linking

Notifications must support contextual navigation.

Examples:

```text
TRADE_FILLED
→ /trade?market=BTC-USDT
```

```text
WITHDRAWAL_COMPLETED
→ /wallet/history
```

```text
P2P_ORDER_UPDATED
→ /p2p/order/[id]
```

```text
SECURITY_LOGIN
→ /account/sessions
```

```text
KYC_REQUIRED
→ /account/verification
```

The exact existing route should be reused where available.

---

# 21. Notification Bell

The global header must include a notification indicator.

Example:

```text
Search
Theme
Notifications 4
Account
```

The notification icon should display:

* no badge when zero unread
* numeric badge for unread count
* `99+` for large counts

---

# 22. Notification Preview Dropdown

Clicking the header bell opens a compact preview.

Display:

```text
Notifications

New login detected
5 min ago

BTC/USDT order filled
18 min ago

Withdrawal completed
1 hour ago

View all notifications →
```

Maximum preview items:

**5**

---

# 23. Notification Empty State

When no notifications exist:

```text
You're all caught up

New account, trading, wallet and security
updates will appear here.
```

CTA:

**Notification Settings**

---

# 24. Notification Search

Users must be able to search notification history.

Search fields:

* title
* message
* category
* reference ID

Example:

```text
Search notifications...
```

---

# 25. Notification Filters

Support:

```text
Category
Status
Priority
Date
Channel
```

Date options:

```text
Today
7 days
30 days
90 days
Custom
```

---

# 26. Notification Preferences

Existing account preferences must be expanded rather than creating a separate disconnected settings system.

Recommended route:

`/account/preferences/notifications`

Sections:

```text
Security
Trading
Wallet
P2P
Account
System
Marketing
```

---

# 27. Channel Preferences

Each eligible category may expose:

```text
In-App
Email
Push
```

Example:

| Notification      | In-App |  Email |   Push |
| ----------------- | -----: | -----: | -----: |
| Security alerts   | Always | Always | Always |
| Trade filled      |     ON |     ON |     ON |
| Deposit completed |     ON |     ON |    OFF |
| P2P updates       |     ON |     ON |     ON |
| Marketing         |     ON |    OFF |    OFF |

Security controls must not allow users to disable mandatory security notifications.

---

# 28. Quiet Hours

Users may optionally configure quiet hours for non-critical notifications.

Example:

```text
Quiet Hours

Enabled

From: 10:00 PM
To: 07:00 AM
```

Critical security notifications bypass quiet hours.

---

# 29. Email Verification

Communication preferences must integrate with the existing authentication system.

Display:

```text
Email
user@example.com

Verified ✓
```

If unverified:

```text
Email not verified

[Verify Email]
```

---

# 30. Push Notification Permission

The UI must distinguish:

```text
Browser permission
Application preference
Notification eligibility
```

Example:

```text
Push Notifications

Enabled

Your browser allows ETHSLTD to send notifications.
```

If browser permission is denied:

```text
Push notifications are blocked by your browser.

Review your browser notification settings.
```

---

# 31. Email Notification Architecture

The frontend must not directly send emails.

Use:

```text
EmailNotificationProvider
```

with a mock implementation:

```text
MockEmailProvider
```

Future production providers can replace it.

Possible future providers include:

* Cloudflare-compatible email infrastructure
* transactional email provider
* dedicated email service

The frontend must remain provider-agnostic.

---

# 32. Push Notification Architecture

Use an abstraction:

```text
PushNotificationProvider
```

with:

```text
MockPushNotificationProvider
```

The interface should support:

```text
registerDevice()
removeDevice()
sendNotification()
getPermissionState()
```

---

# 33. Notification Provider Architecture

Create a unified interface:

```text
NotificationProvider
```

Responsibilities:

```text
getNotifications()
getUnreadCount()
markAsRead()
markAsUnread()
markAllAsRead()
archiveNotification()
deleteNotification()
createNotification()
```

Additional delivery interfaces:

```text
EmailProvider
PushProvider
```

---

# 34. Notification Data Model

Recommended model:

```ts
Notification {
  id: string
  userId: string

  type: NotificationType
  category: NotificationCategory
  priority: NotificationPriority

  title: string
  message: string

  status: NotificationStatus

  channels: NotificationChannel[]

  referenceType?: string
  referenceId?: string

  actionUrl?: string

  createdAt: string
  readAt?: string
  archivedAt?: string
}
```

---

# 35. Notification Types

Define a centralized enum:

```text
SECURITY_LOGIN
SECURITY_PASSWORD_CHANGED
SECURITY_2FA_CHANGED
SECURITY_SESSION_REVOKED

TRADE_ORDER_PLACED
TRADE_ORDER_FILLED
TRADE_ORDER_PARTIAL
TRADE_ORDER_CANCELLED

WALLET_DEPOSIT
WALLET_DEPOSIT_CONFIRMED
WALLET_WITHDRAWAL
WALLET_WITHDRAWAL_COMPLETED
WALLET_WITHDRAWAL_REJECTED

P2P_ORDER_CREATED
P2P_PAYMENT_MARKED
P2P_ORDER_COMPLETED
P2P_DISPUTE_OPENED
P2P_DISPUTE_RESOLVED

ACCOUNT_KYC_REQUIRED
ACCOUNT_KYC_APPROVED
ACCOUNT_KYC_REJECTED

SYSTEM_MAINTENANCE
SYSTEM_ANNOUNCEMENT

MARKETING_CAMPAIGN
```

---

# 36. Delivery Status

Each channel should track:

```text
QUEUED
SENDING
SENT
DELIVERED
READ
FAILED
CANCELLED
```

For email:

```text
QUEUED
SENT
DELIVERED
BOUNCED
FAILED
```

For push:

```text
QUEUED
SENT
DELIVERED
OPENED
FAILED
```

---

# 37. Notification Templates

Notification content should be template-driven.

Example:

```text
Template:
TRADE_ORDER_FILLED
```

Variables:

```text
userName
asset
market
side
quantity
price
total
orderId
timestamp
```

Template:

```text
Your {{side}} order for {{quantity}} {{asset}}
has been filled at {{price}}.

Total: {{total}}
```

---

# 38. Template Safety

Template rendering must:

* escape user-generated content
* prevent HTML injection
* prevent unsafe links
* validate variables
* provide fallback values
* never expose secrets

---

# 39. Notification Deduplication

The system must prevent accidental duplicate notifications.

Example:

A withdrawal completion event should not generate:

```text
5 identical notifications
```

within the same event window.

Use:

```text
eventId
notificationType
userId
```

as part of deduplication logic.

---

# 40. Notification Grouping

Related notifications may be grouped.

Example:

```text
3 trading updates

BTC/USDT order filled
ETH/USDT order filled
SOL/USDT order cancelled
```

Grouping should not hide security-critical events.

---

# 41. Notification Retention

Mock implementation should maintain realistic notification history.

Recommended:

```text
Unread:
retained

Read:
90 days

Archived:
90 days
```

The architecture must make retention configurable.

---

# 42. Support System

Primary route:

`/support`

The support center should become the central help destination for ETHSLTD users.

---

# 43. Support Homepage

Structure:

```text
Support Center

How can we help?

[Search Help Center...]

Popular Topics
```

Categories:

```text
Account & Security
Trading
Wallet
Deposits
Withdrawals
P2P
Payments
Verification
Technical Issues
General Questions
```

---

# 44. Support Search

Search should support:

* article title
* article content
* keywords
* category

Example:

```text
How do I withdraw USDT?
```

Results:

```text
How to Withdraw Crypto
Withdrawal Fees
Withdrawal Pending
Withdrawal Failed
```

---

# 45. FAQ

Support should contain FAQs.

Examples:

### How do I secure my ETHSLTD account?

Explain:

* strong password
* 2FA
* session monitoring
* anti-phishing code

### How do I withdraw crypto?

Link:

**Go to Withdraw**

### Why is my withdrawal pending?

Explain potential processing and network states.

### How do I contact support?

Link:

**Create Support Ticket**

---

# 46. Support Articles

Article structure:

```text
Title
Category
Last Updated
Reading Time

Article content

Related Articles

Was this helpful?
[Yes] [No]

Still need help?
[Create Ticket]
```

---

# 47. Support Ticket System

Primary route:

`/support/tickets`

Users can see:

```text
Open
Pending
Resolved
Closed
```

---

# 48. Ticket List

Display:

| Ticket    | Subject            | Category | Status  | Updated   |
| --------- | ------------------ | -------- | ------- | --------- |
| #SUP-1024 | Withdrawal pending | Wallet   | Open    | 5 min ago |
| #SUP-1019 | P2P payment issue  | P2P      | Pending | 1 hr ago  |

---

# 49. Create Ticket

CTA:

**Create Support Ticket**

Form:

```text
Category
Subject
Description
Related Product
Related Transaction
Attachments
```

---

# 50. Ticket Categories

```text
Account
Security
Trading
Wallet
Deposit
Withdrawal
P2P
KYC
Payment
Technical
Other
```

---

# 51. Related Transaction

Users should be able to associate a support ticket with an existing transaction.

Example:

```text
Related Withdrawal

Withdrawal #WD-10482
Amount: $1,250.00
Asset: USDT
Status: Pending
```

This allows support staff to understand the financial context immediately.

---

# 52. Ticket Conversation

Route:

`/support/tickets/[id]`

Display:

```text
Ticket #SUP-1024

Withdrawal pending
Wallet

Status: Open
Priority: Normal
```

Conversation:

```text
User
Why is my withdrawal still pending?

Support
We're reviewing the transaction.
```

---

# 53. Ticket Message Composer

Features:

* multiline input
* attachment button
* send button
* character count
* loading state
* error state

Example:

```text
Write a reply...

[Attach] [Send]
```

---

# 54. Ticket Attachments

Allowed initially:

```text
PNG
JPG
WEBP
PDF
TXT
```

Restrictions:

* configurable file size
* MIME validation
* filename sanitization
* malware scanning architecture
* no executable files

---

# 55. Ticket Status State Machine

```text
OPEN
 ↓
IN_PROGRESS
 ↓
WAITING_FOR_USER
 ↓
WAITING_INTERNAL
 ↓
RESOLVED
 ↓
CLOSED
```

Users may reopen a resolved ticket within the configured reopening window.

---

# 56. Ticket Priority

```text
LOW
NORMAL
HIGH
URGENT
```

Security-related cases may automatically receive elevated priority.

---

# 57. Ticket SLA Display

The frontend should support:

```text
Expected response
Last response
Waiting time
```

Example:

```text
Expected response:
Within 4 hours
```

This is informational in the mock environment.

---

# 58. Live Chat

The existing project already integrates Tawk.to globally.

The Support Center should provide a clear entry point:

**Chat with Support**

The existing Tawk integration should be reused rather than creating a second chat implementation.

---

# 59. Chat Fallback

If live chat is unavailable:

```text
Live chat is currently unavailable.

You can create a support ticket instead.
```

CTA:

**Create Ticket**

---

# 60. Support Contact Options

Support page may expose:

```text
Help Center
Live Chat
Support Ticket
Security Center
System Status
```

Avoid exposing unsupported contact channels.

---

# 61. Security Support Flow

If a user reports account compromise:

```text
Account Security Issue
        ↓
Security warning
        ↓
Freeze / secure account guidance
        ↓
Review active sessions
        ↓
Reset password
        ↓
Review 2FA
        ↓
Support escalation
```

The UI must never request:

* password
* private key
* seed phrase
* recovery phrase
* authentication code

---

# 62. Anti-Phishing Warning

Support pages should display an appropriate security reminder:

> ETHSLTD will never ask for your password, private key, recovery phrase or authentication code through unsolicited communication.

This is consistent with the established ETHSLTD security requirements. 

---

# 63. Admin Notification Management

The existing Admin Console must gain notification management capabilities.

Route:

`/admin/notifications`

Admin users can:

* view notification templates
* inspect delivery status
* search notifications
* filter by channel
* inspect failures
* view delivery history
* create system announcements
* manage notification settings

---

# 64. Admin Support Management

Route:

`/admin/support`

Display:

```text
Open Tickets
Urgent Tickets
Waiting for User
Waiting Internal
Resolved Today
Average Response Time
```

---

# 65. Admin Ticket Detail

Route:

`/admin/support/tickets/[id]`

Support staff should see:

```text
User
Account status
Risk status
KYC status
Ticket
Conversation
Related transactions
Related P2P order
Related withdrawal
Related security events
```

---

# 66. Admin Ticket Actions

Authorized staff can:

* assign ticket
* change status
* change priority
* reply
* add internal note
* link transaction
* escalate
* resolve
* close
* reopen

Every consequential action must be auditable.

---

# 67. Internal Notes

Internal notes must never be visible to users.

Example:

```text
INTERNAL NOTE

User has an open withdrawal review.
Escalate to finance operations.
```

Visual distinction must be obvious.

---

# 68. Admin RBAC

Support permissions should follow the existing Admin RBAC architecture.

Example roles:

```text
SUPER_ADMIN
ADMIN
SUPPORT_AGENT
FINANCE_OPERATOR
COMPLIANCE_OPERATOR
RISK_OPERATOR
VIEWER
```

Support Agent should not automatically receive financial administration privileges.

---

# 69. Audit Logging

Actions requiring audit events include:

```text
NOTIFICATION_SENT
NOTIFICATION_FAILED
TICKET_CREATED
TICKET_ASSIGNED
TICKET_PRIORITY_CHANGED
TICKET_STATUS_CHANGED
TICKET_REPLIED
TICKET_ESCALATED
TICKET_RESOLVED
TICKET_CLOSED
ADMIN_ANNOUNCEMENT_CREATED
ADMIN_ANNOUNCEMENT_PUBLISHED
```

This is consistent with the Admin Console requirement that important operational actions remain auditable. 

---

# 70. System Announcements

Admins should be able to publish announcements.

Example:

```text
Scheduled Maintenance

ETHSLTD wallet withdrawals will be temporarily
unavailable from 02:00–03:00 UTC.

[View Details]
```

Announcement states:

```text
DRAFT
SCHEDULED
PUBLISHED
EXPIRED
ARCHIVED
```

---

# 71. Announcement Channels

Announcements may appear through:

```text
In-App
Notification Center
Homepage Banner
Email
Push
```

Channel selection must be configurable.

---

# 72. Announcement Targeting

Admins may target:

```text
All Users
Verified Users
Specific User
Specific Account Segment
Specific Product Users
```

Future architecture may support jurisdiction targeting.

---

# 73. System Status Integration

Notifications should link to the existing/future system status experience.

Example:

```text
Wallet maintenance detected.

[View System Status]
```

---

# 74. Notification-to-Product Integration

The notification system must integrate with:

### Authentication

```text
Login
Register
Email verification
Password reset
2FA
Sessions
```

### Trading

```text
Orders
Trades
Markets
```

### Wallet

```text
Deposit
Withdrawal
History
Balances
```

### P2P

```text
Offers
Orders
Payment
Disputes
```

### Account

```text
Profile
Security
Preferences
```

### Admin

```text
Announcements
Support
Notifications
Audit
```

---

# 75. Global Toast System

The application should distinguish between:

### Toast

Short-lived immediate feedback.

Example:

```text
✓ Notification marked as read
```

### Notification

Persistent user-facing event.

Example:

```text
Your withdrawal has completed.
```

Do not use notifications for every minor UI action.

---

# 76. Error Handling

Every notification/support component requires:

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

The existing ETHSLTD design rules explicitly require these states rather than blank failure screens. 

---

# 77. Responsive Requirements

## Desktop

Use:

```text
Sidebar / Main content
```

or:

```text
Wide centered notification/support content
```

## Tablet

Collapse secondary controls.

## Mobile

Notification rows become cards.

Support tickets become:

```text
Subject
Status
Updated
Priority
```

Ticket conversations become a full-width mobile messaging interface.

---

# 78. Accessibility

Must support:

* keyboard navigation
* visible focus
* semantic buttons
* screen-reader labels
* sufficient contrast
* accessible dialogs
* accessible dropdowns
* accessible tabs
* accessible notification badges

Do not communicate state through color alone.

---

# 79. Motion

Use subtle motion only.

Allowed:

* notification dropdown
* unread indicator
* toast entrance
* ticket status transition
* loading skeleton

Avoid excessive animations.

---

# 80. Mock Data Provider

Create:

```text
MockNotificationProvider
MockSupportProvider
MockEmailProvider
MockPushProvider
```

All providers should be asynchronous.

Example:

```ts
await notificationProvider.getNotifications()
```

not direct synchronous mock imports.

This maintains the existing mock-provider architecture already used for markets, trading, P2P, wallet and admin functionality. 

---

# 81. Suggested File Structure

```text
app/
├── notifications/
│   └── page.tsx
│
├── support/
│   ├── page.tsx
│   ├── tickets/
│   │   ├── page.tsx
│   │   └── [id]/
│   │       └── page.tsx
│   └── articles/
│       └── [slug]/
│           └── page.tsx
│
└── admin/
    ├── notifications/
    │   └── page.tsx
    └── support/
        ├── page.tsx
        └── tickets/
            └── [id]/
                └── page.tsx
```

Supporting architecture:

```text
lib/
├── notifications/
│   ├── types.ts
│   ├── provider.ts
│   ├── mock-provider.ts
│   ├── templates.ts
│   └── utils.ts
│
├── support/
│   ├── types.ts
│   ├── provider.ts
│   ├── mock-provider.ts
│   └── utils.ts
│
└── communication/
    ├── email-provider.ts
    ├── push-provider.ts
    └── delivery.ts
```

---

# 82. Reusable Components

Recommended:

```text
NotificationBell
NotificationBadge
NotificationPreview
NotificationItem
NotificationList
NotificationFilters
NotificationTabs
NotificationSettings
NotificationPreferenceRow
NotificationEmptyState
NotificationSkeleton

SupportHero
SupportSearch
SupportCategoryCard
SupportArticleCard
SupportArticle
SupportTicketTable
SupportTicketCard
SupportTicketHeader
SupportTicketConversation
SupportMessage
SupportComposer
SupportAttachment
SupportStatusBadge
SupportEmptyState
```

Admin:

```text
AdminNotificationTable
AdminNotificationFilters
AdminNotificationDetail
AdminSupportDashboard
AdminTicketTable
AdminTicketDetail
AdminInternalNote
AdminTicketActions
```

---

# 83. State Management

Use Zustand only where state needs persistence/global coordination.

Recommended:

```text
notification-store.ts
support-store.ts
```

Notification store:

```text
notifications
unreadCount
filters
activeCategory
```

Actions:

```text
markRead()
markUnread()
markAllRead()
archive()
delete()
refresh()
```

Support store:

```text
tickets
activeTicket
messages
filters
```

---

# 84. Persistence

For the mock environment:

```text
localStorage
```

may be used for:

* read/unread notification state
* notification preferences
* support mock state where appropriate

Do not persist secrets or authentication credentials in client state.

The established project security rules explicitly prohibit exposing secrets, private keys, database credentials or server-only tokens in client bundles. 

---

# 85. Mock Notification Dataset

Create realistic deterministic examples:

```text
Security
Trading
Wallet
P2P
KYC
System
Marketing
```

Include:

* unread
* read
* archived
* high priority
* critical
* failed delivery
* old notifications
* linked transactions

Mock data must remain isolated from production service logic, consistent with the established project rules. 

---

# 86. Notification Demo Scenarios

The UI must demonstrate:

### Scenario 1

```text
User places BTC/USDT order
↓
Order notification
↓
Order fills
↓
Trade notification
```

### Scenario 2

```text
User requests $1,250 withdrawal
↓
Withdrawal processing
↓
Withdrawal completed
↓
Notification
```

### Scenario 3

```text
P2P order
↓
Payment marked
↓
Merchant notified
↓
Trade completed
```

### Scenario 4

```text
New login
↓
Security notification
↓
User opens Sessions
↓
Reviews device
```

---

# 87. Support Demo Scenarios

### Scenario 1 — Withdrawal

```text
Support
↓
Create Ticket
↓
Wallet
↓
Withdrawal
↓
Select transaction
↓
Submit
```

### Scenario 2 — P2P

```text
Support
↓
P2P
↓
Select order
↓
Explain problem
↓
Ticket created
```

### Scenario 3 — Security

```text
Security issue
↓
Security guidance
↓
Review sessions
↓
Create urgent ticket
```

---

# 88. Security Requirements

Never expose:

* passwords
* private keys
* recovery phrases
* seed phrases
* 2FA secrets
* authentication codes
* server credentials

Support agents must not be able to request these through the UI.

The support composer should optionally display:

> **Never share your password, private key, recovery phrase or authentication code with support.**

---

# 89. Anti-Spam Controls

The mock system should support architecture for:

* notification rate limiting
* email rate limiting
* push rate limiting
* ticket creation limits
* duplicate ticket detection
* repeated-message throttling

---

# 90. Notification Rate Limits

Example configurable limits:

```text
Marketing:
5/day

System:
configurable

Security:
no artificial suppression of critical alerts

Support:
configurable
```

Security notifications must prioritize delivery reliability over aggressive rate limiting.

---

# 91. Data Privacy

Communication data may contain sensitive information.

The architecture must support:

* access control
* secure storage
* audit logs
* data retention
* deletion policies
* user data export architecture

Support staff should only access information required to resolve a ticket.

---

# 92. SEO

Transactional pages:

```text
/noindex
```

where appropriate.

Public help articles may be SEO-enabled:

```text
/support/articles/[slug]
```

Use:

* metadata
* canonical URL
* semantic headings
* structured data where appropriate

The existing design system specifically separates SEO requirements for marketing content from application screens. 

---

# 93. Performance

Requirements:

* notification list virtualization if required
* pagination
* lazy loading
* debounced search
* minimal client-side state
* optimized icons
* no unnecessary notification polling

Initial mock implementation may use simulated polling.

Future production architecture should support WebSocket/SSE/push-based updates.

---

# 94. Real-Time Architecture

The provider abstraction should eventually support:

```text
REST
+
WebSocket
+
Push
+
Email
```

Example:

```text
Trading Service
      ↓
Notification Event
      ↓
Notification Service
      ↓
 ┌────┼────┐
 ↓    ↓    ↓
In-App Email Push
```

---

# 95. Event Architecture

Define normalized events:

```text
UserRegistered
UserLoggedIn
PasswordChanged
TwoFactorChanged

OrderPlaced
OrderFilled
OrderCancelled

DepositCreated
DepositConfirmed

WithdrawalRequested
WithdrawalCompleted
WithdrawalRejected

P2POrderCreated
P2PPaymentMarked
P2POrderCompleted
P2PDisputeOpened

KYCSubmitted
KYCApproved
KYCRejected
```

The notification service maps these events to notification templates.

---

# 96. Support Event Integration

Support events can trigger notifications:

```text
TicketCreated
TicketAssigned
AgentReplied
TicketWaitingForUser
TicketResolved
TicketClosed
```

Example:

> **Support replied to your ticket**

CTA:

**Open Ticket**

---

# 97. User Experience Rule

Every notification should answer:

```text
What happened?
Why does it matter?
What can I do?
```

Avoid vague messages.

Bad:

> Something happened.

Good:

> Your $1,250 USDT withdrawal has been completed.

---

# 98. Financial Formatting

All financial formatting must use centralized utilities.

Use:

```text
formatCurrency()
formatPrice()
formatQuantity()
formatPercentage()
```

Do not repeatedly implement custom `toFixed()` logic inside components. This follows the established ETHSLTD formatting rules. 

Default:

```text
USD
```

Example:

```text
$1,250.00
```

---

# 99. Testing Requirements

## Unit Tests

Test:

* notification filtering
* unread count
* mark read
* archive
* delete
* preferences
* template rendering
* notification deduplication
* ticket state transitions
* ticket validation

## Component Tests

Test:

* NotificationBell
* NotificationList
* NotificationItem
* SupportTicket
* SupportComposer
* NotificationSettings

## Integration Tests

Test:

```text
Trade → Notification
Wallet → Notification
P2P → Notification
Security → Notification
Support → Notification
```

---

# 100. Accessibility Testing

Test:

* keyboard navigation
* screen reader labels
* focus management
* modal accessibility
* tab accessibility
* color contrast
* mobile touch targets

---

# 101. Responsive Testing

Test:

```text
Mobile
375px
390px
430px

Tablet
768px
1024px

Desktop
1280px
1440px
1920px
```

---

# 102. Theme Testing

Everything must work in:

```text
Light
Dark
System
```

Test:

* notification badges
* priority states
* support chat
* ticket messages
* tables
* dialogs
* dropdowns
* empty states
* error states

No layout shift should occur when switching themes.

---

# 103. Error Scenarios

Test:

```text
Notification provider unavailable
Email provider unavailable
Push provider unavailable
Support provider unavailable
Network timeout
Unauthorized
Forbidden
Rate limited
Empty notifications
Deleted ticket
Closed ticket
Invalid attachment
Oversized attachment
```

Each must have a user-readable recovery path.

---

# 104. Definition of Done

The PRD is complete when:

### Notifications

* [ ] Notification Bell works
* [ ] Notification preview works
* [ ] `/notifications` works
* [ ] Search works
* [ ] Filters work
* [ ] Categories work
* [ ] Read/unread works
* [ ] Archive works
* [ ] Delete works
* [ ] Mark all as read works
* [ ] Deep links work
* [ ] Notification preferences work
* [ ] USD formatting is consistent
* [ ] Mock provider is isolated

### Communication

* [ ] Email provider abstraction exists
* [ ] Push provider abstraction exists
* [ ] Delivery states exist
* [ ] Notification templates exist
* [ ] Event mapping exists
* [ ] Deduplication exists

### Support

* [ ] `/support` works
* [ ] Search works
* [ ] Categories work
* [ ] FAQs work
* [ ] Articles work
* [ ] `/support/tickets` works
* [ ] Create ticket works
* [ ] Ticket detail works
* [ ] Conversation works
* [ ] Attachments work
* [ ] Ticket status works
* [ ] Ticket priority works
* [ ] Live chat entry works
* [ ] Tawk integration is reused

### Admin

* [ ] Notification administration works
* [ ] Support dashboard works
* [ ] Ticket assignment works
* [ ] Internal notes work
* [ ] Ticket actions work
* [ ] RBAC is enforced
* [ ] Audit events are recorded

### Quality

* [ ] Light mode
* [ ] Dark mode
* [ ] Mobile
* [ ] Tablet
* [ ] Desktop
* [ ] Keyboard accessibility
* [ ] Loading states
* [ ] Empty states
* [ ] Error states
* [ ] No console errors
* [ ] No arbitrary colors
* [ ] No unnecessary dependencies
* [ ] No duplicated components
* [ ] No layout overflow

These checks align with the existing ETHSLTD UI review requirements. 

---

# 105. Final Navigation

After implementing this PRD, the customer-facing navigation should conceptually include:

```text
ETHSLTD

Markets
Trade
P2P
Wallet

────────────

Notifications 🔔

Account
  Profile
  Security
  Sessions
  Preferences
  Notifications

────────────

Support
  Help Center
  My Tickets
  Contact Support
```

Admin navigation extends separately:

```text
ETHSLTD ADMIN

Overview
Customers
Finance
Trading
P2P
Risk

Communication
  Notifications
  Announcements
  Support

System
  Audit Logs
  Settings
```

The Admin Console remains an operational control layer rather than becoming part of the normal customer application. This separation is consistent with the existing Admin Console specification. 

---

# 106. Final Architecture

The complete communication architecture should ultimately look like:

```text
                         ETHSLTD PLATFORM
                                │
        ┌───────────────────────┼───────────────────────┐
        │                       │                       │
     Trading                  Wallet                    P2P
        │                       │                       │
        └───────────────────────┼───────────────────────┘
                                ↓
                         EVENT / EVENT BUS
                                ↓
                    NOTIFICATION SERVICE
                                │
          ┌─────────────────────┼─────────────────────┐
          │                     │                     │
       IN-APP                  EMAIL                 PUSH
          │                     │                     │
          ↓                     ↓                     ↓
 /notifications          Email Provider        Push Provider
          │
          ↓
     User Actions
          │
          ├──────────────→ /trade
          ├──────────────→ /wallet
          ├──────────────→ /p2p
          ├──────────────→ /account
          └──────────────→ /support
                                      │
                                      ↓
                              SUPPORT SYSTEM
                                      │
                         ┌────────────┼────────────┐
                         │            │            │
                       FAQ         Tickets       Live Chat
                         │            │            │
                         └────────────┼────────────┘
                                      ↓
                              ADMIN CONSOLE
                                      │
                                      ↓
                               AUDIT LOG
```

---

# 107. Final Product Objective

The completed ETHSLTD Notifications, Communication & Customer Support system must make the platform feel like a complete financial product rather than a collection of isolated pages.

A user should be able to move seamlessly from:

**event → notification → relevant product → action → support → resolution**

while administrators can move from:

**notification → user → transaction → ticket → action → audit trail**

without leaving the ETHSLTD ecosystem.

Most importantly, this PRD **does not replace or duplicate the Admin & Operations Console**. It adds the missing communication and support layer that the Admin Console can operate and supervise.

### Correct PRD filename

```text
ETHSLTD-PRD-08-Notifications-Communication-Support.md
```

This is the content that should replace the incorrectly duplicated Admin Console content in that file.
