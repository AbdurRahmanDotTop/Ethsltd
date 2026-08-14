हाँ। आपकी अभी तक की requirements, दिए गए screenshots, Cheezeebit के visible P2P/C2C flow, और Binance जैसे mature P2P systems को आधार बनाकर नीचे **ETHSLTD Crypto के लिए केवल P2P/C2C subsystem का complete A–Z Production PRD** दिया जा रहा है।

मैं इसे इस तरह लिख रहा हूँ कि developer इसे देखकर **directly implementation शुरू कर सके**। इसमें Spot/Futures/normal exchange trading शामिल नहीं है—यह document **P2P/C2C + Merchant + Expert Service + Escrow + Orders + Disputes + Chat + Payments + P2P Admin** तक सीमित है।

Cheezeebit के screenshots में दिखने वाले Buy/Sell marketplace, advertiser, price, limits, payment methods, transaction/order dashboard, funding information और Expert Service concepts को scope में शामिल किया गया है। Publicly visible Cheezeebit site भी verified P2P merchants, vendor opportunities और P2P marketplace positioning दिखाती है. ([Cheezeebit][1]) Binance के वर्तमान P2P model में ads, maker/taker, limits, payment window, escrow, KYC, appeals, merchant profiles और ad management जैसे concepts भी मौजूद हैं. ([Binance][2])

# ETHSLTD CRYPTO — COMPLETE P2P / C2C PRD

**Document:** Product Requirements Document
**Product:** ETHSLTD Crypto P2P / C2C Marketplace
**Scope:** P2P/C2C only
**Platform:** Web initially, API-ready for Android/iOS
**Status:** Production-ready specification
**Architecture target:** Next.js + Cloudflare-compatible backend architecture
**Primary markets:** India initially, architecture ready for international fiat/payment methods

---

# 1. Product Definition

ETHSLTD P2P is a peer-to-peer crypto marketplace where verified users can:

* Buy crypto from another user
* Sell crypto to another user
* Publish Buy advertisements
* Publish Sell advertisements
* Search advertisements
* Filter advertisements
* Compare merchants
* Trade using local payment methods
* Trade through escrow
* Communicate through order chat
* Raise disputes/appeals
* Submit evidence
* Receive/release crypto
* Maintain P2P transaction history
* Become a verified P2P Merchant
* Manage merchant advertisements
* View merchant statistics
* Become an approved **Expert**
* Offer Expert Services
* Contact/book/use Expert Services
* Manage expert profile and service information

The system should support the same fundamental P2P marketplace model used by major platforms: a user can browse existing advertisements or create their own, with ads containing asset, fiat currency, price, limits, payment methods, payment window and terms. ([Binance][3])

---

# 2. Important Terminology

| Term           | Meaning                                                      |
| -------------- | ------------------------------------------------------------ |
| P2P            | Peer-to-Peer                                                 |
| C2C            | Customer-to-Customer                                         |
| Advertiser     | User who publishes an advertisement                          |
| Maker          | User creating an advertisement                               |
| Taker          | User accepting an advertisement                              |
| Merchant       | Verified/approved high-trust P2P advertiser                  |
| Expert         | Approved user providing expert services                      |
| Buyer          | User purchasing crypto                                       |
| Seller         | User selling crypto                                          |
| P2P Order      | Actual transaction created from an advertisement             |
| Escrow         | Locked crypto held during P2P transaction                    |
| Payment Window | Time allowed for fiat payment                                |
| Appeal         | Formal dispute process                                       |
| Evidence       | Documents/screenshots/payment proof submitted during dispute |
| Payment Method | UPI, bank transfer, etc.                                     |
| Ad             | P2P Buy/Sell listing                                         |
| Release        | Releasing escrowed crypto to buyer                           |
| Cancel         | Cancelling an eligible P2P order                             |

---

# 3. User Types

The existing ETHSLTD user architecture should **not be replaced**.

Instead, P2P adds capabilities to the existing user system.

## 3.1 Existing Core Roles

The previously defined platform roles remain:

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

## 3.2 New P2P Expert Type

Add:

```text
P2P_EXPERT
```

However, **Expert should also be modelled as a user capability/profile rather than creating a completely separate account system.**

Recommended:

```text
User
 ├── normal user
 ├── merchant
 ├── expert
 ├── merchant + expert
 └── institutional user
```

Therefore a single user can potentially be:

```text
USER
+ P2P_MERCHANT
+ P2P_EXPERT
```

at the same time.

This is important.

A merchant and expert should **not require separate login accounts**.

---

# 4. User Capability Model

Recommended database structure:

```text
users
user_roles
user_capabilities
merchant_profiles
expert_profiles
```

Example:

```text
User:
  id: U123
  email: user@example.com

Capabilities:
  P2P_BUY
  P2P_SELL
  P2P_CREATE_AD
  P2P_MERCHANT
  P2P_EXPERT
```

This makes the system extensible.

---

# 5. P2P Main Navigation

The P2P module should have:

```text
P2P

├── Buy
├── Sell
├── Express
├── P2P Orders
├── My Ads
├── Create Advertisement
├── Merchant Center
├── Expert Services
├── My Expert Profile
├── Payment Methods
├── P2P Wallet/Funding
├── Disputes / Appeals
├── Chat
├── Favorites
├── Blocked Users
├── Reviews
├── P2P History
└── P2P Help Center
```

---

# 6. Public P2P Marketplace

URL:

```text
/p2p
```

Optional:

```text
/p2p/buy
/p2p/sell
```

The marketplace is the primary P2P screen.

---

# 7. P2P Marketplace Header

Header should contain:

### Left

ETHSLTD logo.

### Navigation

```text
P2P
Buy Crypto
Sell Crypto
Express
Merchant
Expert Services
```

### Right

```text
Search
Language
Notifications
Help
User Account
```

If unauthenticated:

```text
Log In
Register
```

---

# 8. Buy / Sell Switch

Top-level control:

```text
BUY     SELL
```

### Buy

User wants:

```text
Fiat → Crypto
```

Example:

```text
INR → USDT
```

### Sell

User wants:

```text
Crypto → Fiat
```

Example:

```text
USDT → INR
```

This exact distinction is also fundamental to mature P2P systems. ([Binance][2])

---

# 9. Supported Assets

P2P must be asset-configurable from Admin.

Initial examples:

```text
USDT
USDC
BTC
ETH
BNB
TRX
DOGE
PEPE
SOL
```

But the frontend must **not hard-code assets**.

Admin should control:

```text
Asset enabled for P2P
Asset disabled
Minimum order
Maximum order
Decimal precision
Network
Status
```

---

# 10. Fiat Currency

Initial:

```text
INR
```

Architecture should support:

```text
USD
EUR
GBP
AED
SGD
AUD
CAD
JPY
CNY
etc.
```

Admin controls available fiat currencies.

---

# 11. P2P Marketplace Filters

The marketplace needs advanced filtering.

## Basic filters

```text
Crypto
Fiat
Buy/Sell
Amount
Payment Method
```

## Advanced filters

```text
Price
Min Order
Max Order
Merchant Only
Verified Only
Online Only
Completion Rate
Number of Trades
Average Release Time
Payment Time
Payment Method
Country
Region
```

---

# 12. Amount Filter

Example:

```text
I want to spend

₹10,000 INR
```

System finds ads capable of fulfilling the amount.

---

# 13. Payment Method Filter

For India:

```text
UPI
Bank Transfer
IMPS
NEFT
RTGS
Paytm
PhonePe
Google Pay
Other
```

Payment methods must be configurable.

Do not hard-code the payment providers into frontend business logic.

---

# 14. Payment Method Architecture

Tables:

```text
payment_methods
user_payment_methods
payment_method_verifications
```

Example:

```text
payment_methods

id
name
code
country
currency
type
status
icon
requires_verification
```

Example:

```text
UPI
BANK_TRANSFER
IMPS
NEFT
RTGS
```

---

# 15. Payment Method User Profile

User can add:

```text
UPI ID
Bank Account
Account Holder Name
Bank Name
IFSC
Account Number
Payment QR
```

Sensitive payment information must be encrypted/protected.

Never expose unnecessary payment information publicly.

---

# 16. Marketplace Table

The main marketplace should resemble the provided Cheezeebit design.

Columns:

```text
Advertiser
Price
Ad Type
Limit / Quantity
Payment Method
Trade
```

Example:

| Advertiser |  Price | Ad Type | Limit / Quantity | Payment       | Action |
| ---------- | -----: | ------- | ---------------- | ------------- | ------ |
| Merchant A | ₹99.99 | P2P Ad  | ₹500–₹4,000      | UPI           | Buy    |
| Merchant B |   ₹100 | P2P Ad  | ₹800–₹40,000     | UPI + PhonePe | Buy    |
| Merchant C |   ₹103 | P2P Ad  | ₹800–₹20,000     | UPI           | Buy    |

---

# 17. Advertiser Card

Each advertiser should display:

```text
Avatar
Display Name
Verified Badge
Merchant Badge
Expert Badge
Total Trades
Completion Rate
Average Release Time
Online Status
```

Example:

```text
ETHSLTD Merchant
✓ Verified Merchant

1,245 Trades
99.2% Completion
Avg Release: 2 min
Online
```

---

# 18. Price Sorting

Buy:

```text
Price: Low → High
```

Sell:

```text
Price: High → Low
```

Also allow:

```text
Recommended
Fastest
Best completion
Best price
Merchant
```

---

# 19. Ad Ranking Algorithm

Recommended ranking:

```text
1. Validity
2. Available quantity
3. Amount compatibility
4. Payment compatibility
5. Merchant status
6. Completion rate
7. Response/release speed
8. Price
9. User reputation
10. Risk score
```

Do not simply rank everything by price.

---

# 20. Advertisement Types

System should support:

```text
ORDINARY_P2P
MERCHANT
PREMIUM_MERCHANT
INSTITUTIONAL
EXPERT_RELATED
```

Admin can add future types.

---

# 21. Create Advertisement

URL:

```text
/p2p/create-ad
```

User chooses:

```text
BUY
SELL
```

---

# 22. Ad Creation Form

Required:

```text
Trade Type
Crypto Asset
Fiat Currency
Price Type
Price
Quantity
Minimum Order
Maximum Order
Payment Methods
Payment Window
Terms
Auto Reply
```

Optional:

```text
Floating Price
Price Margin
Buyer Restrictions
KYC Requirement
Minimum Account Age
Minimum Completed Trades
Completion Rate Requirement
Region
Online/Offline
```

Mature P2P systems expose similar ad parameters including fixed/floating pricing, quantity, limits, payment methods, payment time and buyer restrictions. ([Binance][2])

---

# 23. Fixed Price

Example:

```text
Price:
₹103.50 USDT
```

---

# 24. Floating Price

Example:

```text
Reference Price
+ 0.50%
```

System calculates:

```text
Reference Price × (1 + margin)
```

---

# 25. Quantity

Example:

```text
Total Available:
500 USDT
```

---

# 26. Order Limits

Example:

```text
Minimum:
₹800

Maximum:
₹20,000
```

System must prevent orders outside these limits.

---

# 27. Payment Window

Example:

```text
15 minutes
30 minutes
45 minutes
60 minutes
```

Admin can configure permitted values.

---

# 28. Advertisement Terms

Advertiser can define:

```text
Trading Terms
```

Example:

```text
Please make payment only from your verified bank account.
```

Terms must be subject to moderation and prohibited-content rules.

---

# 29. Auto Reply

When order starts:

```text
Hello, thank you for trading with me.
Please complete payment within the specified time.
```

Automatically sent in order chat.

---

# 30. Buyer Restrictions

Advertiser can optionally require:

```text
KYC verified
Minimum account age
Minimum completed trades
Minimum completion rate
Merchant-only
Country
Payment method
```

---

# 31. Ad Status

```text
DRAFT
PENDING_REVIEW
ONLINE
PAUSED
OFFLINE
SUSPENDED
EXPIRED
SOLD_OUT
CLOSED
```

---

# 32. My Ads

User dashboard:

```text
My Ads
```

Tabs:

```text
All
Online
Offline
Pending
Paused
Sold Out
Suspended
```

Actions:

```text
View
Edit
Pause
Resume
Close
Duplicate
Delete
```

---

# 33. Advertisement Statistics

For every ad:

```text
Views
Orders
Completed Orders
Cancelled Orders
Completion Rate
Total Volume
Remaining Quantity
Average Response
Average Release Time
```

---

# 34. P2P Order Creation

When user clicks:

```text
BUY
```

or:

```text
SELL
```

system creates:

```text
P2P_ORDER
```

with:

```text
order_id
ad_id
buyer_id
seller_id
asset
fiat
price
crypto_amount
fiat_amount
payment_method
created_at
expires_at
```

---

# 35. Buy Order Flow

```text
Buyer selects SELL advertisement
        ↓
Review ad
        ↓
Enter amount
        ↓
System validates limits
        ↓
Create P2P Order
        ↓
Seller's crypto locked
        ↓
Escrow created
        ↓
Payment window starts
        ↓
Buyer pays seller
        ↓
Buyer clicks "Payment Completed"
        ↓
Seller verifies payment
        ↓
Seller releases crypto
        ↓
Crypto transferred to buyer
        ↓
Order completed
        ↓
Review
```

This corresponds to the standard escrow-based P2P model where crypto is held while the buyer completes payment and then released after seller confirmation. ([Binance][3])

---

# 36. Sell Order Flow

```text
Seller selects BUY advertisement
        ↓
Enter amount
        ↓
Order created
        ↓
Seller crypto locked
        ↓
Buyer receives payment instructions
        ↓
Buyer pays seller
        ↓
Buyer marks payment complete
        ↓
Seller verifies payment
        ↓
Seller releases crypto
        ↓
Buyer receives crypto
        ↓
Completed
```

---

# 37. Escrow

Escrow is a **core security component**.

Never represent escrow as only a UI state.

It must exist in the financial ledger.

Example:

```text
Seller Available Balance
        ↓
Escrow Locked
        ↓
P2P Order
        ↓
Buyer
```

Ledger entries:

```text
ESCROW_LOCK
ESCROW_RELEASE
ESCROW_REFUND
ESCROW_FREEZE
```

---

# 38. Escrow State

```text
NOT_LOCKED
LOCK_PENDING
LOCKED
RELEASE_PENDING
RELEASED
REFUND_PENDING
REFUNDED
FROZEN
DISPUTED
```

---

# 39. Escrow Safety Rules

System must prevent:

* Double release
* Release without locked balance
* Negative balance
* Duplicate transaction
* Double refund
* Unauthorized admin release
* Race conditions
* Cancel after successful release
* Release after timeout without policy validation

All money movements require:

```text
transaction_id
idempotency_key
ledger_id
order_id
```

---

# 40. Order Status Machine

Recommended:

```text
CREATED
PAYMENT_PENDING
PAYMENT_IN_PROGRESS
PAYMENT_MARKED
PAYMENT_CONFIRMED
CRYPTO_RELEASE_PENDING
COMPLETED
CANCEL_REQUESTED
CANCELLED
EXPIRED
DISPUTED
FROZEN
REFUNDED
FAILED
```

---

# 41. Order Timer

Order screen displays:

```text
Payment time remaining

14:32
```

Timer must be server-authoritative.

Do not trust browser time.

---

# 42. Order Detail Page

URL:

```text
/p2p/order/[orderId]
```

Display:

```text
Order ID
Status
Buyer
Seller
Asset
Amount
Price
Fiat Amount
Payment Method
Created Time
Payment Deadline
Escrow Status
```

---

# 43. Order Progress

Visual timeline:

```text
Order Created
      ✓
Crypto Secured
      ✓
Payment Pending
      ●
Payment Submitted
      ○
Payment Verified
      ○
Crypto Released
      ○
Completed
```

---

# 44. Payment Instructions

Seller's payment details shown securely.

Example:

```text
UPI
xxxxx@upi

Account Holder:
XXXXXX
```

Sensitive data should be partially masked where appropriate.

---

# 45. Buyer Payment Confirmation

Button:

```text
I Have Paid
```

Before confirmation:

```text
Warning:
Only click after completing the actual payment.
```

System records:

```text
payment_marked_at
IP
device
user_id
```

---

# 46. Seller Release

Button:

```text
Release Crypto
```

Before release:

```text
Have you received the payment?
```

Require confirmation.

For higher-risk transactions:

```text
2FA
```

may be required.

---

# 47. Payment Proof

Buyer can upload:

```text
Payment Screenshot
Bank Receipt
Transaction Reference
UPI Reference
Other Evidence
```

Storage:

```text
Private R2
```

Never expose permanent public URLs.

---

# 48. Order Chat

Every P2P order gets a private chat.

Features:

```text
Text
Emoji
System messages
Payment instructions
Payment proof
Images
Documents
Read status
Typing indicator
Online status
Message timestamps
```

---

# 49. Chat Security

Chat participants:

```text
Buyer
Seller
Authorized Support
Authorized Dispute Agent
```

No other user can access it.

---

# 50. Chat Moderation

System should detect/flag:

```text
Phone numbers
External wallet addresses
Suspicious links
Fraud language
Off-platform payment requests
Threats
Spam
Scam patterns
```

Do not automatically delete legitimate messages without a moderation policy.

---

# 51. System Messages

Examples:

```text
Order created.

Seller's crypto has been secured in escrow.

Buyer marked payment as completed.

Seller released the crypto.

Order completed.
```

---

# 52. Cancel Order

Cancellation rules depend on order state.

Allowed examples:

```text
Payment not completed
Payment window expired
Mutual cancellation
System cancellation
Admin cancellation
```

Once payment is marked, cancellation should be restricted and potentially require dispute handling.

---

# 53. Auto Cancellation

If payment is not completed within allowed window:

```text
Order → EXPIRED
```

But cancellation must check whether payment was already marked.

---

# 54. Appeal / Dispute System

URL:

```text
/p2p/disputes
```

Either party can open a dispute when allowed.

---

# 55. Dispute Reasons

Examples:

```text
Payment not received
Seller did not release crypto
Buyer claims payment made
Wrong payment amount
Payment from third-party account
Payment reversed
Fraud suspected
Wrong bank details
Technical issue
Counterparty unresponsive
Other
```

Admin-configurable.

---

# 56. Appeal Flow

```text
User opens appeal
       ↓
Select reason
       ↓
Describe problem
       ↓
Upload evidence
       ↓
Submit
       ↓
Escrow frozen
       ↓
Support/Dispute agent assigned
       ↓
Both parties notified
       ↓
Evidence reviewed
       ↓
Decision
       ↓
Release / Refund / Other action
       ↓
Case closed
```

Appeal-based dispute resolution is a standard component of mature P2P marketplaces. ([Binance][3])

---

# 57. Evidence System

Evidence types:

```text
Payment receipt
Bank statement
UPI screenshot
Chat screenshot
Transaction reference
Identity document
Other document
```

Metadata:

```text
uploaded_by
uploaded_at
file_hash
mime_type
file_size
order_id
appeal_id
```

---

# 58. Dispute Admin

P2P admin must see:

```text
Order
Buyer
Seller
Escrow
Payment status
Chat
Evidence
User history
Merchant status
Risk score
Previous disputes
```

---

# 59. Admin Dispute Actions

```text
Freeze escrow
Request evidence
Message user
Extend deadline
Cancel order
Release crypto
Refund crypto
Partial resolution
Suspend user
Suspend advertisement
Escalate
Close dispute
```

High-risk financial actions should require authorization and audit logging.

---

# 60. Dispute Resolution Types

```text
RELEASE_TO_BUYER
REFUND_TO_SELLER
PARTIAL_RESOLUTION
CANCEL_ORDER
ESCALATE
```

---

# 61. P2P Reviews

After completed transaction:

```text
Rate Counterparty
```

Rating:

```text
★★★★★
```

Optional:

```text
Good communication
Fast payment
Fast release
Professional
```

Negative:

```text
Slow response
Payment issue
Unprofessional
Other
```

---

# 62. Review Rules

Only completed orders can generate reviews.

One review per party per order.

Reviews cannot be edited after a defined period.

Admin can moderate abusive reviews.

---

# 63. Merchant System

A normal user can apply for:

```text
Become P2P Merchant
```

Merchant is not a separate login.

---

# 64. Merchant Application

Fields:

```text
User ID
KYC Status
Experience
Trading Volume
Preferred Assets
Preferred Fiat
Payment Methods
Business Information
Source of Funds/Business information where legally required
Additional Documents
```

---

# 65. Merchant Status

```text
NOT_MERCHANT
APPLICATION_SUBMITTED
UNDER_REVIEW
APPROVED
ACTIVE
SUSPENDED
REJECTED
REVOKED
```

---

# 66. Merchant Profile

Public profile:

```text
Merchant Name
Verified Badge
Merchant Badge
Total Trades
30-Day Trades
Completion Rate
Average Release Time
Average Payment Time
Registration Age
Online Status
Supported Payment Methods
Active Ads
```

Mature P2P platforms expose merchant-level trading statistics and active ads. ([Binance][2])

---

# 67. Merchant Center

URL:

```text
/p2p/merchant
```

Dashboard:

```text
Today's Sales
Today's Purchases
Completed Sales
Completed Purchases
Average Processing Time
Active Ads
Orders Awaiting Processing
Available Balance
Escrow Balance
```

This maps closely to the Cheezeebit "Transaction for the day", "C2C Orders Awaiting Process", "Current Advertises" and "Funding Information" concepts visible in the provided screenshots.

---

# 68. Merchant Transaction Dashboard

Cards:

```text
Sale Amount
Sale Completed
Purchase Amount
Purchase Completed
Average Processing Time
```

Example:

```text
Sale Amount
₹125,000

Sale Completed
₹118,000

Purchase Amount
₹82,000

Purchase Completed
₹80,000

Average Processing
02:14
```

---

# 69. Merchant Orders

Filters:

```text
Order ID
Direction
Order Status
Payment Status
Buyer
Seller
Date
Asset
Fiat
```

---

# 70. Merchant Funding Information

Right-side or dedicated section:

```text
USDT
BTC
ETH
BNB
USDC
TRX
DOGE
```

For each:

```text
Total
Available
In Order
Escrow
```

Example:

```text
USDT

Total       35.8118
Available    3.8969
In Order    31.9148
```

This directly reflects the funding information pattern shown in the screenshots.

---

# 71. Merchant Advertisements

Merchant dashboard:

```text
Current Advertisements
```

Actions:

```text
Create
Edit
Pause
Resume
Close
Duplicate
View
```

---

# 72. Merchant Performance

Show:

```text
7-day
30-day
90-day
Lifetime
```

Metrics:

```text
Orders
Volume
Completion Rate
Cancellation Rate
Average Response
Average Release
Average Payment
Disputes
Rating
```

---

# 73. Merchant Risk Score

Internal only:

```text
LOW
MEDIUM
HIGH
CRITICAL
```

Inputs:

```text
Dispute rate
Cancellation rate
Chargeback
Fraud reports
Payment reversals
Account age
KYC
Transaction velocity
Behavior anomalies
```

---

# 74. Expert Service

This is a separate but connected P2P service.

URL:

```text
/p2p/experts
```

The screenshots show an "Expert Service" concept where an expert profile displays experience, customer count, profit-related statistics and contact information. ETHSLTD should implement this as a structured platform feature rather than simply displaying personal contact details.

---

# 75. Expert User Type

A normal existing user can become:

```text
P2P_EXPERT
```

No separate account.

Example:

```text
User A
   ↓
Expert Application
   ↓
Admin Review
   ↓
P2P_EXPERT
```

---

# 76. Expert Application

Fields:

```text
Name
Display Name
Profile Photo
Bio
Experience
Trading Experience
Areas of Expertise
Supported Assets
Supported Fiat
Languages
Availability
Service Description
Pricing
Documents
KYC
```

---

# 77. Expert Categories

Admin configurable:

```text
P2P Trading Guidance
Merchant Guidance
Crypto Basics
Trading Education
Risk Management
P2P Strategy
Payment Method Guidance
Account Setup Assistance
Merchant Setup Assistance
Market Education
Portfolio Guidance
```

Avoid presenting unlicensed financial advice as regulated investment advice unless legally permitted.

---

# 78. Expert Profile

Public page:

```text
Profile Photo
Expert Name
Verified Expert
Experience
Customers Helped
Completed Sessions
Rating
Reviews
Languages
Specializations
Availability
Service Pricing
```

---

# 79. Expert Statistics

Inspired by the provided Cheezeebit Expert Service screen:

```text
Years of Experience
Customers Helped
Completed Services
Customer Rating
Response Time
Experience Level
```

Do **not** display fabricated metrics.

All statistics must come from actual database records.

---

# 80. Expert Badge

Profile:

```text
✓ Verified Expert
```

Badge should mean that ETHSLTD has actually approved the expert.

---

# 81. Expert Services

Each expert can create services.

Example:

```text
P2P Beginner Guidance
30 minutes
₹499
```

Another:

```text
Merchant Setup Consultation
60 minutes
₹999
```

---

# 82. Expert Service Fields

```text
Service ID
Expert ID
Title
Description
Category
Duration
Price
Currency
Availability
Status
Maximum bookings
Cancellation policy
```

---

# 83. Expert Booking

User:

```text
Select Expert
      ↓
Select Service
      ↓
Select Date
      ↓
Select Time
      ↓
Pay
      ↓
Booking Created
      ↓
Expert Session
      ↓
Completed
      ↓
Review
```

If initially you do not want online scheduling, support:

```text
Request Service
```

instead.

---

# 84. Expert Contact

Do not expose an expert's raw personal phone/email/WhatsApp publicly by default.

Use:

```text
Contact Expert
Message
Request Consultation
Book Service
```

If external contact is allowed by policy, it should be controlled and auditable.

---

# 85. Expert Chat

Separate from P2P order chat.

```text
Expert Conversation
```

Features:

```text
Messages
Attachments
Read Status
Notifications
Conversation History
```

---

# 86. Expert Payment

Use ETHSLTD internal payment/ledger.

Possible statuses:

```text
PAYMENT_PENDING
PAID
HELD
SERVICE_STARTED
SERVICE_COMPLETED
REFUNDED
DISPUTED
```

---

# 87. Expert Earnings

Expert dashboard:

```text
Today's Earnings
This Week
This Month
Lifetime
Pending
Available
Withdrawn
```

---

# 88. Expert Reviews

Only customers who completed a service can review.

Fields:

```text
Rating
Comment
Service
Date
Verified Customer
```

---

# 89. Expert Disputes

User can dispute:

```text
Service not delivered
Expert unavailable
Service materially different from description
Payment issue
Other
```

Admin resolves.

---

# 90. Expert + Merchant Combination

Very important.

A user may be both:

```text
P2P Merchant
+
P2P Expert
```

Profile badges:

```text
✓ Verified Merchant
✓ Verified Expert
```

Profile can show:

```text
Trade
View Ads
Contact Expert
Book Service
```

---

# 91. P2P User Profile

Every P2P user should have:

```text
Avatar
Nickname
Verified status
Merchant status
Expert status
Registration date
Total trades
Completion rate
Rating
Reviews
```

---

# 92. Public User Profile Privacy

Never expose:

```text
Email
Phone
Bank account
UPI ID
Address
KYC documents
Internal user ID
Risk score
```

unless specifically required by the transaction and legally/policy permitted.

---

# 93. Online Status

Show:

```text
Online
Offline
Recently Active
```

Merchant users can control:

```text
Available
Away
Offline
```

---

# 94. Favorites

User can favorite:

```text
Merchant
Advertiser
Expert
Advertisement
```

---

# 95. Block User

User can block another P2P user.

Blocked user should not appear in:

```text
Marketplace
Recommendations
Chat initiation
Expert recommendations
```

subject to transaction/legal exceptions.

---

# 96. Report User

Report reasons:

```text
Fraud
Scam
Abusive behavior
Fake payment
Off-platform solicitation
Suspicious account
Fake merchant
Fake expert
Other
```

---

# 97. P2P Notifications

Events:

```text
New order
Payment received
Payment marked
Order expiring
Order expired
Crypto released
Order completed
New chat
New message
Appeal opened
Appeal update
Merchant approval
Merchant suspension
Expert approval
Expert booking
Expert payment
Expert review
Ad paused
Ad sold out
```

Channels:

```text
In-app
Email
Push
SMS/OTP where configured
```

---

# 98. P2P Notification Center

Filters:

```text
All
Orders
Payments
Chat
Disputes
Merchant
Expert
Security
System
```

---

# 99. P2P Wallet Integration

P2P should use the existing ETHSLTD wallet/ledger architecture.

Recommended account:

```text
User
 ↓
Funding Account
 ↓
P2P Balance
 ↓
Available
Locked
Escrow
```

Do not create a completely independent financial ledger for P2P.

---

# 100. Balance States

For each asset:

```text
TOTAL
AVAILABLE
LOCKED
ESCROW
PENDING
```

---

# 101. Ledger

Every P2P transaction must create immutable ledger records.

Examples:

```text
P2P_ESCROW_LOCK
P2P_ESCROW_RELEASE
P2P_ESCROW_REFUND
P2P_FEE
P2P_ADJUSTMENT
P2P_TRANSFER
EXPERT_PAYMENT
EXPERT_REFUND
EXPERT_PAYOUT
```

---

# 102. Transaction IDs

Every transaction needs:

```text
order_id
transaction_id
ledger_id
user_id
ad_id
appeal_id
request_id
idempotency_key
```

---

# 103. P2P Fees

Fees must be configurable.

Support:

```text
Buyer fee
Seller fee
Merchant fee
Ad fee
Withdrawal/network fee
Expert platform fee
Expert payout fee
Dispute fee
```

Initially:

```text
P2P taker fee = configurable
Merchant fee = configurable
```

Do not hard-code "0%".

---

# 104. Fee Engine

Admin can configure:

```text
asset
fiat
country
user type
merchant tier
expert
volume tier
fee percentage
fixed fee
effective date
```

---

# 105. Merchant Tiers

Optional but architecture-ready:

```text
STANDARD
VERIFIED
PRO
PREMIUM
INSTITUTIONAL
```

Benefits can include:

```text
Badge
Higher limits
Priority ranking
Lower fees
More advertisements
Merchant support
Analytics
```

---

# 106. P2P Limits

System-level limits:

```text
Minimum order
Maximum order
Daily volume
Monthly volume
User limit
Merchant limit
Country limit
Asset limit
Risk limit
```

---

# 107. User Risk Controls

Before P2P transaction:

```text
KYC status
Account status
Risk status
Sanctions status
Velocity
Previous disputes
Payment risk
Fraud flags
```

High-risk user can be:

```text
Restricted
Frozen
Blocked from P2P
```

---

# 108. KYC Requirements

P2P eligibility should depend on platform policy and applicable law.

Possible states:

```text
NOT_STARTED
PENDING
VERIFIED
REJECTED
EXPIRED
REQUIRES_REVIEW
```

A mature P2P implementation commonly requires identity verification before P2P trading. ([Binance][3])

---

# 109. AML / Compliance

P2P must integrate with the existing compliance architecture.

Checks:

```text
KYC
AML
Sanctions
PEP
Transaction monitoring
Velocity
Suspicious behavior
Source-of-funds where required
```

---

# 110. P2P Fraud Detection

Detect:

```text
Multiple accounts
Rapid account cycling
Unusual payment patterns
Repeated cancellations
Repeated disputes
Payment reversal patterns
Suspicious IP
Device anomalies
High velocity
Chargeback patterns
Third-party payment behavior
```

---

# 111. Third-Party Payment Protection

For each order, display:

```text
Payment must be made using an account/payment method belonging to the authorized party, where required by platform policy.
```

Rules must be configurable based on jurisdiction/payment method.

---

# 112. Anti-Scam Warning System

Before payment:

```text
ETHSLTD SECURITY WARNING

Never send money outside the order instructions.
Never trust screenshots alone.
Never share your password or OTP.
Never release crypto until payment is verified.
```

---

# 113. Release Security

Before crypto release:

```text
Payment verification
+
Order state validation
+
Escrow validation
+
Risk check
+
2FA if required
```

---

# 114. P2P Search

Search by:

```text
Merchant name
Advertiser name
Ad ID
Asset
Fiat
Payment method
```

---

# 115. Recommended Ads

Algorithm can recommend based on:

```text
Amount
Payment method
User country
Price
Merchant reputation
Completion
Speed
Availability
Risk
```

---

# 116. Express P2P

Optional simplified P2P interface:

```text
I want to

BUY / SELL

Asset:
USDT

Amount:
₹10,000

Payment:
UPI
```

System finds suitable advertisement.

---

# 117. Express Quote

Show:

```text
You Pay
₹10,000

You Receive
96.62 USDT

Estimated Rate
₹103.50

Payment:
UPI
```

Final amount must be calculated server-side.

---

# 118. P2P Market Statistics

Marketplace may display:

```text
24h P2P Volume
Active Advertisements
Active Merchants
Supported Assets
Supported Fiat
```

Only display actual data.

---

# 119. Current Advertisements Widget

Merchant Center:

```text
Current Advertisements
```

with:

```text
+
Create Advertisement
```

---

# 120. Funding Information Widget

Merchant dashboard:

```text
USDT
BTC
ETH
BNB
USDC
TRX
DOGE
```

with:

```text
All
Available
In Order
```

---

# 121. P2P Dashboard

User dashboard:

```text
P2P Overview

Active Orders
Pending Payments
Completed Today
Total Volume
Favorites
My Ads
Merchant Status
Expert Status
```

---

# 122. P2P Order History

Filters:

```text
Buy
Sell
Asset
Fiat
Completed
Cancelled
Disputed
Date
Merchant
```

Export:

```text
CSV
PDF
```

---

# 123. Merchant Order History

More detailed:

```text
Buyer
Seller
Order ID
Asset
Price
Quantity
Fiat
Payment Method
Status
Created
Completed
Duration
```

---

# 124. Expert Dashboard

```text
Expert Overview

Active Services
Pending Requests
Today's Bookings
Upcoming Sessions
Completed Sessions
Revenue
Rating
Reviews
```

---

# 125. Expert Service Management

Actions:

```text
Create
Edit
Pause
Resume
Delete
Duplicate
```

---

# 126. Expert Availability

Support:

```text
Available
Busy
Offline
```

Schedule:

```text
Monday
Tuesday
Wednesday
...
```

Time slots:

```text
09:00
10:00
11:00
...
```

Timezone-aware.

---

# 127. Expert Booking Calendar

Expert can see:

```text
Today
Week
Month
```

Bookings:

```text
Pending
Confirmed
Completed
Cancelled
No-show
Disputed
```

---

# 128. Expert Service Pricing

Support:

```text
Fixed price
Per session
Per hour
Custom quote
```

---

# 129. Expert Custom Quote

User:

```text
Request Custom Consultation
```

Expert responds:

```text
Service
Price
Duration
Description
Expiry
```

User accepts/rejects.

---

# 130. P2P Merchant Communication

Merchant can communicate with counterparties only through:

```text
Order Chat
```

Avoid unnecessary off-platform communication.

---

# 131. Admin P2P Dashboard

URL:

```text
/admin/p2p
```

Sections:

```text
Overview
Orders
Advertisements
Merchants
Experts
Users
Escrow
Disputes
Payments
Payment Methods
Reviews
Risk
Fraud
Reports
Audit Logs
Configuration
```

---

# 132. Admin P2P Overview

Metrics:

```text
Active Orders
Completed Orders
Disputed Orders
Cancelled Orders
Active Ads
Online Merchants
Experts
24h Volume
Escrow Balance
Fees
Fraud Alerts
```

---

# 133. Admin Order Management

Search:

```text
Order ID
User
Email
Merchant
Asset
Payment reference
Transaction ID
```

Actions according to permissions:

```text
View
Freeze
Escalate
Cancel
Resolve
```

Financial release/refund actions must be heavily permissioned.

---

# 134. Admin Advertisement Management

Admin can:

```text
View
Search
Suspend
Resume
Close
Flag
Edit where authorized
```

---

# 135. Advertisement Moderation

Automatically flag:

```text
Phone numbers
External URLs
Telegram
WhatsApp solicitation
Scam keywords
Illegal services
Investment guarantees
Fake claims
```

---

# 136. Merchant Admin

Admin can:

```text
Review application
Approve
Reject
Suspend
Reactivate
Revoke
Change tier
View performance
View disputes
```

---

# 137. Expert Admin

Admin can:

```text
Review expert application
Approve
Reject
Suspend
Reactivate
Verify
Change categories
Review services
Review complaints
```

---

# 138. Expert Verification

Verification may require:

```text
KYC
Experience verification
Documents
Profile review
Background checks where applicable
Compliance approval
```

---

# 139. Expert Service Moderation

Admin can review:

```text
Service title
Description
Pricing
Category
Claims
External links
Contact information
```

---

# 140. P2P Payment Method Admin

Admin can:

```text
Create payment method
Disable payment method
Set country
Set currency
Set limits
Require verification
Add icon
Change display name
```

---

# 141. Country Configuration

Each country can have:

```text
Supported fiat
Payment methods
P2P availability
KYC requirement
Limits
Fees
Merchant rules
Risk rules
```

---

# 142. P2P Configuration

Admin settings:

```text
Minimum order
Maximum order
Payment window
Maximum ads per user
Maximum merchant ads
Escrow timeout
Appeal timeout
Auto-cancel rules
Fee rules
Review rules
```

---

# 143. Audit Logs

Every sensitive action:

```text
User
Admin
Action
Resource
Before
After
Timestamp
IP
Device
Request ID
Reason
```

Examples:

```text
ADMIN_RELEASE_ESCROW
ADMIN_FREEZE_ESCROW
MERCHANT_APPROVED
EXPERT_APPROVED
AD_SUSPENDED
ORDER_CANCELLED
```

---

# 144. P2P API

REST APIs:

```text
GET    /api/p2p/ads
GET    /api/p2p/ads/:id
POST   /api/p2p/ads
PATCH  /api/p2p/ads/:id
POST   /api/p2p/ads/:id/pause
POST   /api/p2p/ads/:id/resume

POST   /api/p2p/orders
GET    /api/p2p/orders
GET    /api/p2p/orders/:id
POST   /api/p2p/orders/:id/pay
POST   /api/p2p/orders/:id/payment-marked
POST   /api/p2p/orders/:id/release
POST   /api/p2p/orders/:id/cancel

POST   /api/p2p/orders/:id/appeal
GET    /api/p2p/appeals
GET    /api/p2p/appeals/:id

GET    /api/p2p/merchants
GET    /api/p2p/merchants/:id
POST   /api/p2p/merchant/apply

GET    /api/p2p/experts
GET    /api/p2p/experts/:id
POST   /api/p2p/expert/apply

GET    /api/p2p/payment-methods
POST   /api/p2p/payment-methods
DELETE /api/p2p/payment-methods/:id
```

---

# 145. WebSocket

Realtime events:

```text
P2P_ORDER_UPDATED
P2P_PAYMENT_UPDATED
P2P_ESCROW_UPDATED
P2P_CHAT_MESSAGE
P2P_ORDER_TIMER
P2P_APPEAL_UPDATED
P2P_AD_STATUS_UPDATED
MERCHANT_STATUS_UPDATED
EXPERT_BOOKING_UPDATED
NOTIFICATION_CREATED
```

---

# 146. Durable Object Usage

Recommended:

```text
P2POrderRoom
P2PChatRoom
P2PDisputeRoom
MerchantRealtimeRoom
```

Each active order can have a realtime room.

---

# 147. Realtime Order State

Architecture:

```text
Browser
   ↓
WebSocket
   ↓
Cloudflare Durable Object
   ↓
Order State
   ↓
Ledger / D1
```

But **financial truth remains the ledger/database**, not the WebSocket state.

---

# 148. Database Tables

Core:

```text
p2p_ads
p2p_orders
p2p_order_events
p2p_escrows
p2p_payment_methods
p2p_user_payment_methods
p2p_payments
p2p_chats
p2p_chat_messages
p2p_appeals
p2p_appeal_evidence
p2p_reviews
p2p_favorites
p2p_blocks
p2p_reports
```

Merchant:

```text
p2p_merchant_profiles
p2p_merchant_applications
p2p_merchant_stats
p2p_merchant_tiers
```

Expert:

```text
p2p_expert_profiles
p2p_expert_applications
p2p_expert_services
p2p_expert_availability
p2p_expert_bookings
p2p_expert_reviews
p2p_expert_payouts
```

Configuration:

```text
p2p_assets
p2p_fiat_currencies
p2p_payment_methods
p2p_fee_rules
p2p_limits
p2p_country_rules
```

---

# 149. `p2p_ads`

Recommended fields:

```text
id
ad_no
user_id
merchant_id
trade_type
asset
fiat_currency
price_type
price
floating_ratio
total_amount
available_amount
min_order
max_order
payment_window
terms
auto_reply
status
visibility
buyer_kyc_required
min_account_age
min_completed_orders
country
created_at
updated_at
expires_at
```

---

# 150. `p2p_orders`

```text
id
order_no
ad_id
buyer_id
seller_id
asset
fiat_currency
price
crypto_amount
fiat_amount
payment_method_id
status
payment_status
escrow_status
expires_at
created_at
paid_at
completed_at
cancelled_at
```

---

# 151. `p2p_escrows`

```text
id
order_id
asset
amount
owner_user_id
status
locked_at
released_at
refunded_at
ledger_transaction_id
```

---

# 152. `p2p_appeals`

```text
id
appeal_no
order_id
opened_by
respondent
reason
description
status
priority
assigned_admin
resolution
resolution_reason
created_at
resolved_at
```

---

# 153. `p2p_expert_profiles`

```text
id
user_id
display_name
bio
avatar
experience_years
languages
categories
rating
completed_services
customers_helped
verification_status
availability_status
created_at
updated_at
```

---

# 154. `p2p_expert_services`

```text
id
expert_id
title
description
category
duration
price
currency
pricing_type
status
created_at
updated_at
```

---

# 155. `p2p_expert_bookings`

```text
id
booking_no
expert_id
customer_id
service_id
scheduled_at
duration
amount
payment_status
booking_status
meeting_method
created_at
completed_at
```

---

# 156. P2P State Integrity

Critical rule:

> **Frontend must never determine financial state.**

For example, frontend cannot decide:

```text
"Payment received"
```

as final truth.

Backend must validate and persist it.

Likewise:

```text
release
refund
cancel
freeze
```

must be server-authoritative.

---

# 157. Idempotency

All financial endpoints require:

```text
Idempotency-Key
```

Example:

```http
POST /api/p2p/orders/:id/release
Idempotency-Key: abc123
```

Duplicate request must not cause duplicate release.

---

# 158. Concurrency Protection

Must prevent:

```text
Two simultaneous releases
Two simultaneous cancellations
Two simultaneous refunds
Two simultaneous orders consuming same ad quantity
```

Use atomic DB operations / transactional locking / Durable Objects where appropriate.

---

# 159. Ad Inventory Protection

Suppose:

```text
Ad available:
100 USDT
```

Two users simultaneously request:

```text
70 USDT
50 USDT
```

System must allow only valid available quantity.

Never trust frontend available quantity.

---

# 160. Merchant Ad Quantity

When order is created:

```text
Available quantity decreases
Locked/order quantity increases
```

When order completes:

```text
Locked → transferred
```

When order cancels:

```text
Locked → available
```

---

# 161. Security

P2P requires:

```text
HTTPS
Secure cookies
CSRF protection
Rate limiting
Authentication
Authorization
2FA
Session security
Device management
Audit logging
Encryption
Input validation
File validation
Malware scanning where available
```

---

# 162. Authentication

Use existing ETHSLTD authentication:

```text
Email/password
OTP
Session
Refresh token
2FA
Recovery codes
Logout all devices
```

P2P should not implement a second authentication system.

---

# 163. Sensitive Operations

Require additional verification for:

```text
Release
Payment method modification
Adding bank account
Changing security settings
Large transactions
Expert payout changes
Merchant security changes
```

---

# 164. Rate Limiting

Rate-limit:

```text
Login
Order creation
Payment confirmation
Release
Chat
Appeal creation
File uploads
Ad creation
Expert application
```

---

# 165. File Upload Security

Allowed:

```text
JPG
PNG
PDF
WEBP
```

Limit:

```text
File size
Number of files
Total upload size
```

Validate:

```text
MIME
Extension
Magic bytes
Virus/malware where supported
```

---

# 166. R2 Storage

Use private Cloudflare R2 for:

```text
Payment proofs
Dispute evidence
Expert documents
Merchant documents
```

Access only via authorized temporary URLs.

---

# 167. P2P Analytics

Track:

```text
P2P volume
orders
completion rate
cancel rate
appeal rate
average order value
average release time
payment time
merchant performance
expert performance
```

---

# 168. Event Tracking

Events:

```text
P2P_MARKET_VIEW
AD_VIEW
AD_CLICK
ORDER_STARTED
ORDER_CREATED
PAYMENT_MARKED
RELEASE_CLICKED
ORDER_COMPLETED
ORDER_CANCELLED
APPEAL_CREATED
MERCHANT_APPLICATION
EXPERT_APPLICATION
EXPERT_BOOKING
```

---

# 169. SEO

Public pages:

```text
/p2p
/p2p/buy
/p2p/sell
/p2p/merchants
/p2p/experts
```

SEO metadata:

```text
title
description
canonical
OpenGraph
structured data where appropriate
```

Private pages should not be indexed.

---

# 170. Responsive Design

Desktop:

```text
Full marketplace table
Side filters
Order panel
Chat panel
```

Tablet:

```text
Responsive table/cards
```

Mobile:

```text
Card-based P2P listings
Bottom navigation
Sticky Buy/Sell action
```

---

# 171. Marketplace Mobile Card

Instead of desktop columns:

```text
✓ Merchant
99.99 INR

Limit
₹500 – ₹4,000

UPI

99.2% completion
~2 min release

[BUY]
```

---

# 172. Accessibility

Must support:

```text
Keyboard navigation
ARIA
Screen readers
Focus states
Readable contrast
Error messages
Form labels
```

---

# 173. Internationalization

Architecture:

```text
en-IN
hi-IN
en-US
```

Future:

```text
Arabic
Spanish
French
etc.
```

---

# 174. Currency Formatting

INR:

```text
₹1,00,000.00
```

Crypto:

```text
100.123456 USDT
```

Precision must be asset-configurable.

Never use JavaScript floating point for financial calculations.

Use decimal/integer smallest units.

---

# 175. P2P Error Handling

Examples:

```text
Insufficient balance
Advertisement unavailable
Advertisement sold out
Order limit exceeded
Payment window expired
User restricted
KYC required
Payment method unavailable
Risk restriction
Duplicate request
Order already completed
Order already cancelled
```

---

# 176. Empty States

Marketplace:

```text
No advertisements found.

Try changing:
• Amount
• Payment method
• Currency
• Asset
```

Orders:

```text
No P2P orders yet.
```

Ads:

```text
You don't have any advertisements.
[Create Advertisement]
```

Experts:

```text
No experts found for your filters.
```

---

# 177. Loading States

Use:

```text
Skeleton loaders
```

not large blocking spinners.

---

# 178. P2P Help Center

Sections:

```text
How to Buy
How to Sell
How to Create Ad
How Escrow Works
Payment Rules
Cancellation
Appeals
Merchant Program
Expert Program
Security
Fees
```

---

# 179. Security Education

Every important screen should have contextual safety information.

Especially:

```text
Payment
Release
Chat
Appeal
```

---

# 180. P2P Terms

Before first trade:

```text
P2P Terms & Conditions
Risk Disclosure
Escrow Rules
Payment Rules
Privacy Policy
```

User acceptance should be recorded.

---

# 181. Terms Versioning

Store:

```text
terms_version
accepted_at
user_id
ip
```

If terms change, require re-acceptance where appropriate.

---

# 182. P2P Admin Permissions

Recommended:

```text
P2P_ADMIN
```

Permissions:

```text
P2P_VIEW
P2P_ORDER_VIEW
P2P_ORDER_MANAGE
P2P_ESCROW_VIEW
P2P_ESCROW_FREEZE
P2P_ESCROW_RELEASE
P2P_ESCROW_REFUND
P2P_AD_MANAGE
P2P_MERCHANT_MANAGE
P2P_EXPERT_MANAGE
P2P_DISPUTE_MANAGE
P2P_CONFIG_MANAGE
```

Financial permissions should be separated from ordinary support permissions.

---

# 183. Support Admin

Support should be able to:

```text
View order
View chat
View dispute
Request evidence
Communicate
Escalate
```

But should **not automatically have unrestricted financial release permissions**.

---

# 184. Compliance Admin

Can:

```text
View KYC
Review suspicious activity
Restrict user
Review merchant
Review expert
Review transactions
```

---

# 185. Risk Manager

Can:

```text
View risk
Freeze P2P
Set risk rules
Review suspicious orders
```

---

# 186. Auditor

Read-only:

```text
Orders
Ledger
Escrow
Admin actions
Disputes
Merchant changes
Expert changes
```

---

# 187. User Lifecycle in P2P

```text
REGISTERED
   ↓
KYC
   ↓
P2P_ENABLED
   ↓
BUY/SELL
   ↓
TRADE HISTORY
   ↓
MERCHANT APPLICATION
   ↓
MERCHANT
```

Separately:

```text
P2P_ENABLED
   ↓
EXPERT APPLICATION
   ↓
EXPERT
```

Potentially:

```text
MERCHANT + EXPERT
```

---

# 188. Merchant + Expert Profile

Example:

```text
Rahul Trading

✓ Verified Merchant
✓ Verified Expert

2,431 P2P Trades
99.4% Completion
4.9 ★

[View Ads]
[Buy]
[Sell]
[Book Expert Service]
[Message]
```

---

# 189. Expert Service Landing Page

Hero:

```text
Learn from Verified P2P Experts

Get practical guidance from experienced
ETHSLTD community experts.
```

CTA:

```text
Find an Expert
Become an Expert
```

---

# 190. Expert Marketplace Filters

```text
Category
Language
Price
Experience
Rating
Availability
Asset
Fiat
Verified only
```

---

# 191. Expert Card

```text
[Avatar]

Verified Expert
Rakesh Kumar

8 Years Experience

P2P Trading
Merchant Guidance

4.9 ★
324 Customers

From ₹499

[View Profile]
[Book]
```

Again, numbers must be actual data, not placeholder claims in production.

---

# 192. P2P Merchant Card

```text
[Avatar]

✓ Verified Merchant

Merchant Name

1,250 Trades
99.2% Completion

Avg Release: 2m

₹103.20

UPI • Bank Transfer

₹800–₹20,000

[BUY]
```

---

# 193. Order Chat UI

Layout:

```text
--------------------------------
Order #P2P123456
USDT / INR

Seller: Merchant ABC
Status: Payment Pending
Timer: 12:45
--------------------------------

Chat

Seller:
Please make payment...

Buyer:
Payment completed.

[Upload Proof]

--------------------------------
[Message...]

[I've Paid]
[Release Crypto]
[Appeal]
--------------------------------
```

Buttons should change according to role/state.

---

# 194. Seller View

Seller sees:

```text
Buyer
Amount
Payment method
Payment status
Escrow status
Timer
Chat
Release Crypto
Appeal
```

---

# 195. Buyer View

Buyer sees:

```text
Seller
Amount
Payment instructions
Timer
Payment status
Chat
I've Paid
Appeal
```

---

# 196. P2P Order Security Timeline

Record:

```text
Order created
Escrow locked
Payment instructions viewed
Payment marked
Proof uploaded
Seller notified
Release initiated
Release completed
Order completed
```

This is extremely useful for dispute resolution.

---

# 197. Fraud Investigation Timeline

Admin should see:

```text
IP changes
Device changes
Login events
Payment events
Chat events
Order events
Balance events
Admin events
```

---

# 198. P2P Auditability

Every state transition should produce:

```text
P2P_ORDER_EVENT
```

Example:

```text
ORDER_CREATED
ESCROW_LOCKED
PAYMENT_MARKED
PROOF_UPLOADED
RELEASE_REQUESTED
ESCROW_RELEASED
ORDER_COMPLETED
```

Never overwrite history.

---

# 199. Database Architecture

Use existing ETHSLTD architecture:

```text
Cloudflare Workers
       ↓
API
       ↓
D1
       ↓
Durable Objects
       ↓
R2
       ↓
Queues
```

Recommended responsibilities:

### D1

Permanent relational data:

```text
Users
Ads
Orders
Merchant
Expert
Reviews
Disputes
Configuration
```

### Durable Objects

Realtime state:

```text
Order rooms
Chat
Realtime timers
Locks
```

### R2

Files:

```text
Payment proofs
Dispute evidence
Expert documents
Merchant documents
```

### Queues

Background:

```text
Notifications
Analytics
Risk processing
Audit processing
Reports
```

---

# 200. P2P Background Jobs

Jobs:

```text
Expire orders
Expire ads
Update merchant stats
Update expert stats
Process notifications
Risk analysis
Generate reports
Clean temporary uploads
Reconciliation
```

---

# 201. Reconciliation

Critical scheduled process:

```text
Ledger balances
vs
Escrow balances
vs
P2P orders
vs
Wallet balances
```

Must detect:

```text
Mismatch
Missing ledger
Duplicate ledger
Negative balance
Orphan escrow
```

---

# 202. P2P Health Monitoring

Monitor:

```text
Order creation latency
Escrow latency
Release latency
WebSocket connections
Chat latency
API errors
Database errors
Queue failures
Payment events
```

---

# 203. P2P SLA Targets

Recommended engineering targets:

```text
Marketplace page:
< 2 sec perceived load

API:
p95 < 300ms for normal reads

Realtime:
< 500ms target event propagation

Order creation:
< 1 sec target

Chat:
near realtime
```

Financial operations prioritize correctness over raw speed.

---

# 204. Availability

P2P marketplace should be designed for:

```text
24/7
```

with graceful degradation.

If realtime WebSocket fails:

```text
Fallback polling
```

If analytics fails:

```text
Trading should continue
```

If notifications fail:

```text
Core order state must continue safely
```

---

# 205. Critical Principle

The following systems must **never depend solely on third-party APIs** for financial truth:

```text
Order
Escrow
Balance
Ledger
Release
Refund
```

External payment/market data can supplement the system, but ETHSLTD's internal ledger must remain authoritative for its own P2P transactions.

---

# 206. P2P UX Principle

The entire user experience should make three things obvious:

```text
WHO am I trading with?
HOW MUCH am I paying/receiving?
WHAT happens to my crypto while payment is pending?
```

---

# 207. P2P Main User Journey

### Buyer

```text
P2P
 ↓
Buy
 ↓
USDT
 ↓
INR
 ↓
₹10,000
 ↓
UPI
 ↓
Compare sellers
 ↓
Select seller
 ↓
Review
 ↓
Create order
 ↓
Escrow
 ↓
Pay
 ↓
Mark paid
 ↓
Seller releases
 ↓
Receive USDT
 ↓
Review
```

### Seller

```text
P2P
 ↓
Sell
 ↓
USDT
 ↓
INR
 ↓
Select advertisement
 ↓
Buyer order
 ↓
Escrow
 ↓
Receive payment
 ↓
Verify
 ↓
Release
 ↓
Completed
 ↓
Review
```

---

# 208. Merchant Journey

```text
User
 ↓
KYC
 ↓
Merchant Application
 ↓
Approval
 ↓
Merchant Center
 ↓
Create Ad
 ↓
Receive Orders
 ↓
Trade
 ↓
Build Reputation
 ↓
Merchant Tier
```

---

# 209. Expert Journey

```text
User
 ↓
KYC
 ↓
Expert Application
 ↓
Admin Approval
 ↓
Create Expert Profile
 ↓
Create Service
 ↓
Customer Booking
 ↓
Service
 ↓
Completion
 ↓
Review
 ↓
Earnings
```

---

# 210. Merchant + Expert Journey

```text
User
   ├── P2P Merchant
   │     ├── Buy/Sell Ads
   │     └── P2P Orders
   │
   └── P2P Expert
         ├── Expert Profile
         ├── Services
         └── Bookings
```

This is the recommended architecture for your requirement that the **expert should be an existing user type/capability rather than a completely separate user database**.

---

# 211. Final P2P Feature Inventory

ETHSLTD P2P should ultimately contain:

### Marketplace

* Buy
* Sell
* Express
* Search
* Filters
* Sorting
* Price comparison
* Amount filtering
* Payment filtering
* Merchant filtering
* Online filtering
* Favorites

### Advertisements

* Create
* Edit
* Pause
* Resume
* Close
* Duplicate
* Fixed price
* Floating price
* Quantity
* Limits
* Payment methods
* Payment window
* Terms
* Auto reply
* Buyer restrictions

### Trading

* Buy order
* Sell order
* Escrow
* Payment instructions
* Payment confirmation
* Payment proof
* Crypto release
* Cancellation
* Expiration
* Refund

### Order

* Order detail
* Order timer
* Order history
* Status tracking
* Event timeline
* Chat
* Notifications
* Reviews

### Security

* KYC
* AML
* Risk
* Fraud detection
* Rate limits
* 2FA
* Device tracking
* Audit logs
* Transaction monitoring

### Disputes

* Appeals
* Evidence
* Chat history
* Escrow freeze
* Admin review
* Resolution
* Refund
* Release
* Escalation

### Merchant

* Merchant application
* Merchant verification
* Merchant profile
* Merchant badge
* Merchant dashboard
* Merchant ads
* Merchant orders
* Merchant statistics
* Merchant tiers
* Merchant risk
* Merchant suspension

### Expert

* Expert application
* Expert verification
* Expert profile
* Expert badge
* Expert categories
* Expert services
* Service pricing
* Booking
* Availability
* Expert chat
* Expert earnings
* Expert reviews
* Expert disputes
* Expert dashboard

### User

* P2P profile
* Payment methods
* Favorites
* Block
* Report
* Reviews
* Order history

### Admin

* P2P dashboard
* Orders
* Ads
* Users
* Merchants
* Experts
* Escrow
* Disputes
* Payment methods
* Fees
* Limits
* Risk
* Fraud
* Reports
* Audit logs
* Configuration

---

# 212. Definition of Done

The P2P module should **not** be considered production-ready merely because the marketplace UI works.

It is complete only when:

* User can discover P2P ads.
* User can filter ads.
* User can create valid P2P orders.
* Seller crypto is securely locked.
* Escrow is represented in the ledger.
* Payment state is server authoritative.
* Buyer can submit payment confirmation.
* Seller can securely release crypto.
* Orders cannot double-release.
* Orders cannot consume unavailable inventory.
* Expired orders are handled safely.
* Users can communicate through order chat.
* Users can submit evidence.
* Users can create appeals.
* Admin can resolve disputes.
* Merchant application works.
* Merchant can publish/manage ads.
* Merchant dashboard works.
* Expert application works.
* Expert can create services.
* Customer can book expert services.
* Expert payments are ledger-backed.
* Reviews work.
* Notifications work.
* Audit logs work.
* Risk controls work.
* KYC restrictions work.
* Admin permissions work.
* Mobile responsive UI works.
* API is documented.
* WebSocket events work.
* Database indexes are implemented.
* Financial calculations use exact decimal/smallest-unit representation.
* Idempotency is implemented.
* Reconciliation is implemented.
* No critical financial operation relies on client-side state.

---

## 213. Most Important Architecture Decision for ETHSLTD

आपके case में मैं **Cheezeebit का सिर्फ UI clone नहीं बनाऊँगा**।

उसका बेहतर production architecture होगा:

```text
                         ETHSLTD USER
                              │
                ┌─────────────┴─────────────┐
                │                           │
          P2P TRADER                  USER CAPABILITIES
                │                           │
        ┌───────┴───────┐          ┌────────┴────────┐
        │               │          │                 │
       BUY             SELL     MERCHANT          EXPERT
        │               │          │                 │
        └───────┬───────┘          │                 │
                │                  │                 │
             P2P AD              ADS             SERVICES
                │                  │                 │
                └──────────┬───────┴─────────────────┘
                           │
                       P2P ORDER
                           │
                      ┌────┴────┐
                      │ ESCROW  │
                      └────┬────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
           PAYMENT       CHAT        EVIDENCE
              │            │            │
              └────────────┼────────────┘
                           │
                       COMPLETION
                           │
                       LEDGER
                           │
                ┌──────────┴──────────┐
                │                     │
             REVIEW               ANALYTICS
```

यही structure ETHSLTD को **एक साधारण P2P listing page से proper production-grade P2P marketplace** में बदलता है।

और सबसे महत्वपूर्ण बात: **Expert को अलग isolated user system मत बनाइए।** Existing `USER` को approved `P2P_EXPERT` capability दीजिए; उसी तरह approved user `P2P_MERCHANT + P2P_EXPERT` दोनों हो सकता है। इससे आपके existing user/admin architecture के साथ यह cleanly integrate होगा।

Binance के वर्तमान P2P model में भी merchant profiles, ad management, order/appeal workflows और payment-method based marketplace जैसे concepts हैं, इसलिए ऊपर का design उन mature patterns को ETHSLTD के existing architecture के साथ combine करता है. ([Binance][2])

**यह PRD केवल P2P/C2C subsystem का है।** इसमें Spot Exchange, Futures, Wallet general module, Staking, DEX आदि को जानबूझकर नहीं मिलाया गया है।

[1]: https://cheezeebit.com/?utm_source=chatgpt.com "Cheezeebit"
[2]: https://www.binance.com/en-BH/skills/detail/binance/p2p?utm_source=chatgpt.com "p2p · Binance Skills Hub"
[3]: https://academy.binance.com/ky-KG/articles/what-is-binance-p2p-and-how-to-use-it?utm_source=chatgpt.com "What Is Binance P2P and How to Use It?"
