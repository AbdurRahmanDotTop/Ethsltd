I checked the current official Cregis documentation first. One important finding is that **WaaS and Payment Engine are different Cregis products**: Cregis describes WaaS as the wallet infrastructure for deposits/payouts/collection, while Payment Engine is for payment-order and crypto-payment collection flows. The integration must therefore first establish exactly which of your existing projects is being used for **Auto Deposit**, rather than mixing WaaS and Payment Engine endpoints. ([Cregis Developer Center][1])

Cregis also explicitly requires server-side credentials, project-specific Base URL/API credentials, IP allowlisting, callback signature verification, and idempotent deposit processing. ([Cregis Developer Center][2])

I would structure the fix around **three separate REAL-money deposit methods**:

1. **Auto Deposit — Cregis**
2. **Manual Deposit — user submits payment/deposit details + proof → Admin/Finance verification**
3. **Direct Bank Transfer — configured bank details + UTR/reference + verification**

And **DEMO will have none of these payment systems**. Demo will use only virtual balance.

One limitation: you have not provided the URL/source of the "other website where Cregis is working correctly." So this PRD defines a **production-grade parity/integration audit** against Cregis and a comparison checklist for that reference site. If you provide that website URL later, its exact payment flow can be compared screen-by-screen/API-by-API.

Also, the credentials in your message are sensitive. I have intentionally **not reproduced them** in the PRD. The supplied API keys/passwords should be rotated if they are real, and the new values must be stored as server-side secrets.

# ETHSLTD REAL MONEY PAYMENT SYSTEM

## Cregis Auto Deposit + Manual Deposit + Direct Bank Transfer

### Complete Production-Ready Integration, Audit, Debugging & Fix PRD

**Product:** ETHSLTD Trading Platform
**Document Type:** Production PRD + Payment Integration Specification + Fix/Remediation Specification
**Scope:** REAL MONEY ONLY
**Demo Environment:** Completely isolated and excluded from all real-money payment operations
**Primary Payment Provider:** Cregis Technology Limited
**Payment Methods:** Auto Deposit, Manual Deposit, Direct Bank Transfer
**Platforms:** Web + Android + iOS + Admin
**Backend:** Cloudflare Workers / TypeScript
**Database:** Cloudflare D1
**Realtime:** Durable Objects / WebSocket where required
**Object Storage:** R2 for payment proofs/documents
**Security:** Server-side secrets + signature verification + idempotency + audit logging

---

# 1. PURPOSE

The current ETHSLTD project has a Cregis payment integration that is not functioning correctly, while another website reportedly has a working Cregis payment implementation.

The objective of this project is to:

1. Completely audit the existing ETHSLTD payment implementation.
2. Identify why Cregis Auto Deposit is not working correctly.
3. Compare the existing implementation against the official Cregis integration requirements.
4. Correct authentication/signature/request construction problems.
5. Correct callback/webhook processing.
6. Correct transaction-to-user mapping.
7. Correct wallet-credit logic.
8. Implement proper idempotency.
9. Implement automatic deposit confirmation.
10. Implement Manual Deposit.
11. Implement Direct Bank Transfer.
12. Give Admin complete control over payment-mode configuration.
13. Ensure all payment transactions are properly audited.
14. Ensure Real and Demo are completely separated.
15. Ensure Demo never touches Cregis or real financial infrastructure.

---

# 2. MOST IMPORTANT ARCHITECTURAL RULE

## REAL AND DEMO MUST NEVER MIX

This requirement has the highest priority.

### REAL

REAL handles:

* Real customer funds
* Cregis
* Auto Deposit
* Manual Deposit
* Direct Bank Transfer
* Real wallet
* Real ledger
* Real trading
* Real withdrawal
* Real transaction history
* Real financial reconciliation

### DEMO

DEMO handles:

* Virtual demo balance
* Demo wallet
* Demo ledger
* Demo orders
* Demo trades
* Demo P&L
* Demo fees
* Demo transaction history

DEMO must NOT use:

* Cregis
* Payment Engine
* WaaS
* Bank transfer
* Real bank account
* Real deposits
* Real withdrawals
* Real ledger
* Real payment webhooks

---

# 3. REQUIRED FINAL PAYMENT ARCHITECTURE

The Real Wallet should display:

```text
REAL WALLET

Deposit Funds

├── Auto Deposit
│      └── Cregis
│
├── Manual Deposit
│      └── Submit payment/deposit proof
│
└── Direct Bank Transfer
       └── Bank details + UTR/reference
```

Demo Wallet:

```text
DEMO WALLET

Add Demo Balance

└── Virtual Balance
```

No payment method should appear in Demo.

---

# 4. CREGIS PRODUCT IDENTIFICATION

Before changing the code, the engineering team MUST identify which Cregis product/project is responsible for the current Auto Deposit implementation.

Cregis documentation currently distinguishes:

### Cregis WaaS

WaaS provides wallet infrastructure and supports deposit, payout, collection, transaction queries and notifications.

### Cregis Payment Engine

Payment Engine provides payment-order and crypto-payment collection functionality.

Cregis explicitly recommends using WaaS for project-level on-chain fund actions such as deposits/payouts/collection, while Payment Engine is intended for payment-order and crypto-payment collection flows. ([Cregis Developer Center][1])

Therefore:

```text
DO NOT MIX:

WaaS credentials
        +
Payment Engine endpoints
        +
wrong project ID
        +
wrong Base URL
```

The implementation must use the correct Cregis product/project consistently.

---

# 5. CREDENTIAL SECURITY

The project specification contains:

* Cregis API credentials
* Cregis project identifiers
* Cregis account credentials
* Gmail credentials

These MUST NOT be committed to source code.

They MUST NOT appear in:

* Frontend JavaScript
* Next.js client bundle
* Android APK
* iOS application
* Git repository
* GitHub/GitLab
* Logs
* Database
* API responses
* Screenshots
* PRD
* Public environment variables

The Cregis documentation explicitly states that the API credentials must be stored securely and never exposed in frontend code. ([Cregis Developer Center][3])

---

# 6. REQUIRED SECRET CONFIGURATION

Use server-side secrets:

```text
CREGIS_ENV
CREGIS_BASE_URL
CREGIS_PROJECT_ID
CREGIS_API_KEY

CREGIS_PAYMENT_ENGINE_PROJECT_ID
CREGIS_PAYMENT_ENGINE_API_KEY

CREGIS_WEBHOOK_SECRET
CREGIS_CALLBACK_SECRET
```

Only configure the variables applicable to the selected Cregis product.

Never hardcode:

```text
const API_KEY = "...";
```

---

# 7. CREGIS BASE URL / PROJECT CONSISTENCY

The Cregis documentation states that the Base URL is project-specific and must be used together with the corresponding Project ID and API Key. ([Cregis Developer Center][3])

Therefore the system must validate:

```text
CREGIS_BASE_URL
        ↓
CREGIS_PROJECT_ID
        ↓
CREGIS_API_KEY
```

all belong to the same Cregis project.

The application must fail safely if:

```text
Base URL != Project Project
```

or:

```text
Project ID != API Key project
```

---

# 8. CREGIS IP ALLOWLIST

Cregis documentation requires configuring the server's public IP in the project's IP Allowlist. ([Cregis Developer Center][3])

The deployment checklist must therefore verify:

```text
Production server outbound IP
        ↓
Cregis Project IP Allowlist
        ↓
API request accepted
```

If the application is running on infrastructure with changing outbound IPs, the deployment architecture must account for that rather than assuming a fixed IP.

---

# 9. CURRENT IMPLEMENTATION AUDIT

Before rewriting the payment system, inspect the existing project.

Audit:

```text
Frontend deposit page
Deposit API
Payment service
Cregis client
Authentication/signature code
Webhook endpoint
Webhook parser
Database schema
Wallet service
Ledger service
Transaction service
Admin payment settings
Bank transfer module
Manual deposit module
Notification service
Environment variables
Cloudflare Worker configuration
Cloudflare routes
D1 migrations
Queues
Cron jobs
R2
Logs
```

---

# 10. AUTO DEPOSIT AUDIT

Auto Deposit is the highest-priority payment method.

The complete flow must be tested:

```text
User
 ↓
Real Wallet
 ↓
Deposit
 ↓
Auto Deposit
 ↓
Cregis
 ↓
Payment/Deposit Created
 ↓
User Payment
 ↓
Cregis Processing
 ↓
Cregis Callback/Webhook
 ↓
ETHSLTD Webhook
 ↓
Signature Verification
 ↓
Idempotency
 ↓
Transaction Validation
 ↓
Ledger
 ↓
Real Wallet Credit
 ↓
Notification
```

---

# 11. AUTO DEPOSIT — FRONTEND REQUIREMENTS

Real Wallet must show:

```text
Deposit Funds
```

Then:

```text
Auto Deposit
```

The screen should show:

* Supported asset/currency
* Minimum amount
* Maximum amount
* Network
* Deposit instructions
* Current transaction status
* Payment/deposit reference
* Expiration if applicable
* Refresh status
* Transaction history

---

# 12. AUTO DEPOSIT — REQUEST CREATION

When the user clicks:

```text
Continue
```

the backend must:

1. Authenticate the user.
2. Confirm Real account.
3. Confirm KYC/compliance status where required.
4. Validate asset.
5. Validate network.
6. Validate amount.
7. Generate internal deposit ID.
8. Generate unique merchant/business reference.
9. Create Cregis transaction.
10. Store Cregis identifiers.
11. Return only safe client-facing information.

Never create the transaction only in frontend state.

---

# 13. AUTO DEPOSIT INTERNAL RECORD

Required:

```text
deposit_id
user_id
wallet_id
environment
method
provider
provider_project
provider_transaction_id
provider_reference
asset
network
requested_amount
expected_amount
received_amount
fee
status
expires_at
created_at
updated_at
```

Required:

```text
environment = REAL
method = CREGIS_AUTO
```

---

# 14. CREGIS TRANSACTION IDENTIFICATION

The implementation must persist the provider identifiers returned by Cregis.

Cregis documentation specifically highlights `cid`/`txid` for idempotent processing and `third_party_id` for payout idempotency. ([Cregis Developer Center][2])

Therefore:

```text
ETHSLTD deposit_id
        +
Cregis cid
        +
Cregis txid
        +
ETHSLTD request_id
        +
idempotency_key
```

must be tracked wherever applicable.

---

# 15. AUTO DEPOSIT CALLBACK

The callback endpoint must be publicly reachable over HTTPS.

Example:

```text
POST /api/webhooks/cregis/deposit
```

or the exact endpoint required by the configured Cregis product.

Cregis provides dedicated deposit webhook functionality in its WaaS API. ([Cregis Developer Center][4])

---

# 16. WEBHOOK PROCESSING

Webhook flow:

```text
Cregis
 ↓
HTTPS Webhook
 ↓
Request validation
 ↓
Signature verification
 ↓
Replay protection
 ↓
Parse event
 ↓
Find transaction
 ↓
Validate provider ID
 ↓
Validate user mapping
 ↓
Validate asset
 ↓
Validate network
 ↓
Validate amount
 ↓
Idempotency check
 ↓
Financial ledger
 ↓
Real wallet
 ↓
Audit
 ↓
Notification
 ↓
HTTP 200 success
```

Cregis explicitly requires callback signature verification before crediting balances and recommends idempotent processing. ([Cregis Developer Center][2])

---

# 17. WEBHOOK SIGNATURE VERIFICATION

Never do:

```text
if (webhook.status === "success") {
    creditWallet();
}
```

This is unsafe.

The implementation must:

```text
Receive callback
 ↓
Verify signature
 ↓
Verify callback authenticity
 ↓
Verify event
 ↓
Verify transaction
 ↓
Verify amount
 ↓
Verify destination
 ↓
Then credit
```

---

# 18. WEBHOOK IDEMPOTENCY

The same Cregis callback may potentially be received more than once.

Example:

```text
Callback #1
 ↓
Deposit credited

Callback #2
 ↓
Same txid/cid
 ↓
Already processed
 ↓
DO NOTHING
```

Never create:

```text
+100 USDT
+100 USDT
```

from one real payment.

It must remain:

```text
+100 USDT
```

---

# 19. WEBHOOK RESPONSE

After successful processing, return the response expected by Cregis.

Cregis documentation states that after successful callback processing, the integration should return HTTP 200 with plain-text `success`. ([Cregis Developer Center][2])

The implementation must follow the exact callback contract for the specific Cregis product/version being used.

---

# 20. AUTO DEPOSIT STATUS MACHINE

Internal state:

```text
CREATED
 ↓
PENDING
 ↓
PROCESSING
 ↓
CONFIRMED
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

Only a verified terminal-success condition may credit the Real Wallet.

---

# 21. AUTO DEPOSIT WALLET CREDIT

The wallet must NEVER be credited directly by the frontend.

Correct:

```text
Cregis callback
 ↓
Verified
 ↓
Ledger transaction
 ↓
Wallet update
```

Incorrect:

```text
Frontend:
Payment successful
 ↓
Frontend:
credit wallet
```

---

# 22. DOUBLE-ENTRY LEDGER

When the Auto Deposit is confirmed:

```text
Create financial transaction
        ↓
Create ledger entries
        ↓
Update Real Wallet
```

Ledger must be immutable.

No direct:

```text
UPDATE wallets SET balance = balance + X
```

without corresponding ledger/accounting records.

---

# 23. AUTO DEPOSIT RECONCILIATION

Create a reconciliation process.

Periodically:

```text
Cregis Transactions
        ↓
ETHSLTD Deposits
        ↓
ETHSLTD Ledger
        ↓
ETHSLTD Wallet
```

Compare:

```text
provider amount
internal amount
ledger amount
wallet amount
status
```

Any mismatch creates:

```text
RECONCILIATION_EXCEPTION
```

---

# 24. LOST CALLBACK RECOVERY

If:

```text
Cregis = SUCCESS
ETHSLTD webhook = not received
```

the system must recover.

Use:

```text
Scheduled reconciliation
+
Cregis transaction query
+
Retry/reconciliation queue
```

Cregis provides historical transaction query capabilities in its WaaS API. ([Cregis Developer Center][4])

---

# 25. MANUAL DEPOSIT

Manual Deposit is separate from Auto Deposit.

It must not call Cregis automatically.

Flow:

```text
User
 ↓
Real Wallet
 ↓
Deposit
 ↓
Manual Deposit
 ↓
Show configured instructions
 ↓
User makes payment/deposit
 ↓
User submits details
 ↓
Upload proof
 ↓
Pending
 ↓
Finance/Admin Review
 ↓
Approve
 ↓
Real Ledger
 ↓
Real Wallet
```

---

# 26. MANUAL DEPOSIT FIELDS

```text
deposit_id
user_id
environment
method
asset
amount
payment_reference
sender_name
sender_account
transaction_hash
proof_file
remarks
submitted_at
status
reviewed_by
reviewed_at
rejection_reason
```

---

# 27. MANUAL DEPOSIT STATUS

```text
DRAFT
SUBMITTED
PENDING
UNDER_REVIEW
APPROVED
REJECTED
CANCELLED
```

Only:

```text
APPROVED
```

can create a Real ledger credit.

---

# 28. MANUAL DEPOSIT ADMIN REVIEW

Admin sees:

```text
Deposit ID
User
Amount
Asset
Payment Reference
Proof
Submitted Date
User KYC Status
Risk Status
```

Actions:

```text
Approve
Reject
Request More Information
Put on Hold
```

---

# 29. MANUAL DEPOSIT APPROVAL

Admin clicks:

```text
Approve Deposit
```

System must:

1. Verify permission.
2. Require confirmation.
3. Verify deposit isn't already approved.
4. Create ledger transaction.
5. Credit Real Wallet.
6. Update deposit status.
7. Create audit log.
8. Notify user.

---

# 30. DUPLICATE MANUAL DEPOSIT PROTECTION

If admin clicks Approve twice:

```text
First:
APPROVED + ledger credit

Second:
Already approved
NO SECOND CREDIT
```

This must be enforced server-side.

---

# 31. DIRECT BANK TRANSFER

Direct Bank Transfer is its own payment method.

It must not be implemented as a disguised Manual Deposit.

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
Show Bank Details
 ↓
User transfers funds
 ↓
User submits UTR/reference
 ↓
Optional proof upload
 ↓
Pending
 ↓
Finance verifies bank transaction
 ↓
Approve
 ↓
Real Ledger
 ↓
Real Wallet
```

---

# 32. BANK ACCOUNT CONFIGURATION

Admin must be able to configure:

```text
Bank Name
Account Holder
Account Number
IFSC/SWIFT
Branch
Bank Address
Supported Currency
Supported Country
Payment Reference Instructions
Minimum Deposit
Maximum Deposit
Deposit Notes
```

Sensitive bank details must be protected by Admin RBAC.

---

# 33. MULTIPLE BANK ACCOUNTS

Admin should be able to create multiple bank accounts.

Example:

```text
Bank Account #1
USD

Bank Account #2
EUR

Bank Account #3
INR

Bank Account #4
USDT/Other instructions where applicable
```

Each account can have:

```text
active
inactive
default
priority
currency
country
```

---

# 34. DIRECT BANK TRANSFER USER SCREEN

Display:

```text
Bank Transfer

Bank Name:
XXXXXXXX

Account Name:
XXXXXXXX

Account Number:
XXXXXXXX

IFSC/SWIFT:
XXXXXXXX

Reference:
ETHSLTD-123456
```

User then enters:

```text
Amount
UTR/Reference
Payment Date
Sender Name
```

and uploads proof if required.

---

# 35. UNIQUE PAYMENT REFERENCE

Every bank transfer deposit should receive a unique internal reference.

Example:

```text
ETHSLTD-DEP-20260814-ABC123
```

The reference should help Finance identify the deposit.

---

# 36. BANK TRANSFER VERIFICATION

Admin/Finance must verify:

```text
Amount
UTR
Sender
Bank statement
Date
Currency
Beneficiary
```

before approving.

---

# 37. BANK TRANSFER DUPLICATE DETECTION

System should detect:

```text
Same UTR
Same transaction reference
Same amount
Same sender
Same date
```

and flag potential duplicates.

Status:

```text
DUPLICATE_REVIEW
```

---

# 38. PAYMENT MODE ADMIN PANEL

Admin must have:

```text
Admin
 ↓
Payments
 ↓
Payment Modes
```

Tabs:

```text
Auto Deposit
Manual Deposit
Direct Bank Transfer
```

---

# 39. AUTO DEPOSIT ADMIN SETTINGS

Admin can configure:

```text
Enabled / Disabled
Provider
Cregis Product
Cregis Project
Supported Assets
Supported Networks
Minimum Amount
Maximum Amount
Deposit Fee
Display Order
User Visibility
Maintenance Mode
```

Cregis secrets should NOT be displayed back to normal admins.

---

# 40. CREGIS ADMIN CONFIGURATION

The admin interface should display configuration status:

```text
Cregis Connection
CONNECTED
```

or:

```text
NOT CONFIGURED
```

or:

```text
CONNECTION ERROR
```

Do not expose:

```text
Full API Key
Full Secret
Passwords
```

Show masked values:

```text
************810d
```

---

# 41. CREGIS CONNECTION TEST

Admin should have:

```text
[Test Cregis Connection]
```

The backend performs a safe authenticated test.

Result:

```text
CONNECTED
```

or:

```text
FAILED
```

With safe diagnostic:

```text
Authentication failed
Invalid project
IP not allowed
Invalid Base URL
Provider unavailable
```

Never display secret values.

---

# 42. WEBHOOK HEALTH

Admin should see:

```text
Webhook Status
Last Received
Last Successful
Last Failed
Signature Failures
Duplicate Callbacks
Processing Errors
```

Example:

```text
Cregis Webhook

Status: HEALTHY
Last Event: 30 seconds ago
Failed Events: 0
```

---

# 43. PAYMENT MODE ENABLE/DISABLE

Admin can enable/disable each method.

Example:

```text
Auto Deposit      ON
Manual Deposit    ON
Bank Transfer     ON
```

If disabled:

```text
Auto Deposit temporarily unavailable.
```

The backend must also enforce this.

Frontend hiding alone is insufficient.

---

# 44. MAINTENANCE MODE

Admin can enable:

```text
Auto Deposit Maintenance
```

User sees:

```text
Auto Deposit is temporarily unavailable.

Please use Manual Deposit or Bank Transfer.
```

No new Auto Deposit transactions should be created while disabled.

Existing transactions must continue to be processed.

---

# 45. PAYMENT METHOD ORDER

Admin can configure:

```text
1. Auto Deposit
2. Direct Bank Transfer
3. Manual Deposit
```

or:

```text
1. Direct Bank Transfer
2. Auto Deposit
3. Manual Deposit
```

The frontend follows this configuration.

---

# 46. PAYMENT CURRENCY CONFIGURATION

Admin can configure supported assets/currencies separately.

Example:

```text
USDT
USDC
BTC
ETH
USD
EUR
INR
```

Only provider-supported assets should be enabled for Cregis Auto Deposit.

Cregis provides supported-project-coin querying through its WaaS API. ([Cregis Developer Center][4])

The application should not assume an asset/network is supported.

---

# 47. NETWORK CONFIGURATION

For crypto Auto Deposit:

```text
Asset
Network
Deposit Address
Memo/Tag where applicable
```

must be handled correctly.

Example:

```text
USDT
TRON
```

must not accidentally be treated as:

```text
USDT
BSC
```

Network mismatches can cause permanent asset loss.

---

# 48. ADDRESS MANAGEMENT

If using Cregis WaaS sub-addresses:

```text
User
 ↓
Create/bind deposit address
 ↓
Cregis sub-address
 ↓
User deposits
 ↓
Webhook
 ↓
Map address → User
 ↓
Credit Real Wallet
```

Cregis provides sub-address creation, batch creation, update and verification APIs. ([Cregis Developer Center][4])

---

# 49. USER-ADDRESS MAPPING

Database:

```text
deposit_addresses
-----------------
id
user_id
environment
provider
asset
network
address
memo
provider_address_id
status
created_at
```

Critical constraint:

```text
environment = REAL
```

Cregis addresses must never be assigned to Demo accounts.

---

# 50. AUTO DEPOSIT ADDRESS SAFETY

Before crediting:

```text
Webhook address
        ↓
Find address
        ↓
Verify provider
        ↓
Verify asset
        ↓
Verify network
        ↓
Verify user
        ↓
Credit Real wallet
```

Unknown address:

```text
MANUAL_REVIEW
```

Never automatically credit an unknown address.

---

# 51. PAYMENT ENGINE FLOW

If the existing project is using Cregis Payment Engine rather than WaaS, the implementation must follow the Payment Engine order lifecycle.

Cregis describes Payment Engine as an order lifecycle involving order creation, countdown/payment locking, customer payment and settlement outcomes. ([Cregis Developer Center][5])

The engineering team must not copy WaaS request formats into Payment Engine endpoints.

---

# 52. AUTO DEPOSIT PRODUCT DECISION

Before implementation, document:

```text
ETHSLTD Auto Deposit Provider:
Cregis

Cregis Product:
WaaS / Payment Engine

Project:
Configured project

Base URL:
Configured project Base URL

Supported Assets:
Configured list

Supported Networks:
Configured list
```

This becomes the source of truth.

---

# 53. PAYMENT ENGINE / WAAS SEPARATION

Do not use:

```text
Payment Engine API Key
```

against:

```text
WaaS endpoint
```

or:

```text
WaaS API Key
```

against:

```text
Payment Engine endpoint
```

unless Cregis explicitly documents that exact usage.

---

# 54. REFERENCE WEBSITE COMPARISON

Because another website is reportedly working correctly, once its URL is provided, compare:

### Frontend

```text
Deposit page
Auto Deposit button
Payment screen
QR/address
Payment status
Success screen
Failure screen
Pending screen
```

### Backend

```text
Request endpoint
Request payload
Authentication
Signature
Headers
Project ID
Base URL
Callback URL
Webhook
Transaction mapping
```

### Database

```text
Deposit record
Provider ID
User mapping
Status
Amount
Asset
Network
Ledger
```

### Admin

```text
Payment configuration
Transaction monitoring
Webhook status
Provider settings
```

The reference site's secrets must never be copied.

Only its observable integration behavior and publicly documented API flow should be used as comparison evidence.

---

# 55. PAYMENT TRANSACTION PAGE

User should have:

```text
Wallet
 ↓
Transactions
```

Filters:

```text
All
Deposit
Withdrawal
Trade
Fee
Manual Deposit
Bank Transfer
Auto Deposit
```

Environment filter:

```text
REAL
```

Demo has a completely separate history.

---

# 56. REAL TRANSACTION DETAILS

Show:

```text
Transaction ID
Deposit ID
Payment Method
Provider
Asset
Network
Amount
Fee
Net Amount
Status
Created At
Completed At
Provider Reference
```

Sensitive internal fields should be hidden from users.

---

# 57. ADMIN TRANSACTION DETAILS

Admin can see:

```text
Internal ID
User
KYC status
Method
Provider
Cregis ID
Cregis TXID
Asset
Network
Amount
Fee
Wallet
Ledger ID
Status
Webhook status
Reconciliation status
```

---

# 58. ADMIN MANUAL CREDIT

Manual wallet adjustments should be extremely restricted.

If allowed:

```text
FINANCE_ADMIN
```

must have explicit permission.

Every manual adjustment requires:

```text
Reason
Amount
Asset
User
Before Balance
After Balance
Admin
Timestamp
Approval
Audit ID
```

Never allow:

```text
set balance = X
```

without ledger accounting.

---

# 59. REAL LEDGER

The ledger must be the authoritative internal accounting record.

Example:

```text
Deposit
 ↓
Financial Transaction
 ↓
Double-entry ledger
 ↓
Wallet balance
```

Required:

```text
transaction_id
ledger_id
account_id
environment
asset
amount
direction
reference_type
reference_id
timestamp
```

---

# 60. DEMO LEDGER

Demo has its own ledger:

```text
demo_ledger
```

Demo top-up:

```text
Demo Top-up
 ↓
Demo Ledger
 ↓
Demo Wallet
```

Never:

```text
Demo Top-up
 ↓
Real Ledger
```

---

# 61. API SEPARATION

Recommended:

```text
/api/v1/real/deposits/auto
/api/v1/real/deposits/manual
/api/v1/real/deposits/bank
```

Demo:

```text
/api/v1/demo/balance/topup
```

There should be no:

```text
/api/v1/demo/deposits/cregis
```

---

# 62. CREGIS WEBHOOK SEPARATION

Cregis webhook:

```text
/api/webhooks/cregis/real/deposit
```

must always resolve to:

```text
environment = REAL
```

Never accept:

```text
environment = DEMO
```

from the webhook payload as authority.

The endpoint itself must be Real-only.

---

# 63. DEMO PAYMENT API PROTECTION

The backend should reject:

```text
POST /demo/deposit/cregis
```

with:

```text
FEATURE_NOT_AVAILABLE_IN_DEMO
```

Likewise:

```text
POST /demo/bank-transfer
```

must be rejected.

---

# 64. REAL MODE PROTECTION

A user in Demo mode cannot simply manipulate:

```text
environment=REAL
```

in the request.

Backend must verify:

```text
authenticated user
+
account authorization
+
environment
+
permissions
```

---

# 65. DATABASE SEPARATION

All payment records must include:

```text
environment
```

Recommended:

```text
REAL
DEMO
```

However, for critical financial tables, logical/service separation should also be used where practical.

Example:

```text
real_wallets
real_ledger_entries
real_deposits

demo_wallets
demo_ledger_entries
demo_balance_events
```

This gives additional protection against accidental cross-domain queries.

---

# 66. REAL DEPOSIT TABLE

```text
real_deposits
-------------
id
user_id
wallet_id
method
provider
provider_project_id
provider_transaction_id
provider_reference
asset
network
amount
fee
net_amount
status
idempotency_key
created_at
updated_at
completed_at
```

---

# 67. MANUAL DEPOSIT TABLE

```text
real_manual_deposits
--------------------
id
deposit_id
user_id
amount
asset
payment_reference
transaction_hash
proof_file_id
remarks
status
reviewed_by
reviewed_at
rejection_reason
```

---

# 68. BANK TRANSFER TABLE

```text
real_bank_deposits
------------------
id
deposit_id
bank_account_id
user_id
amount
currency
utr
sender_name
sender_account
payment_date
proof_file_id
status
reviewed_by
reviewed_at
```

---

# 69. CREGIS TRANSACTION TABLE

```text
cregis_transactions
-------------------
id
environment
ethsltd_transaction_id
cregis_project_id
cid
txid
third_party_id
asset
network
amount
status
raw_status
request_hash
response_hash
created_at
updated_at
```

Do not store sensitive credentials in this table.

---

# 70. WEBHOOK EVENT TABLE

```text
payment_webhook_events
----------------------
id
provider
event_type
provider_event_id
cid
txid
signature_valid
payload_hash
processing_status
processed_at
error_code
created_at
```

Raw payload storage should follow security/privacy and retention requirements.

---

# 71. WEBHOOK IDEMPOTENCY TABLE

```text
payment_idempotency
-------------------
idempotency_key
provider
provider_event_id
transaction_id
status
created_at
processed_at
```

Unique constraint:

```text
UNIQUE(provider, provider_event_id)
```

where appropriate.

---

# 72. PAYMENT ADMIN CONFIGURATION TABLE

```text
payment_methods
---------------
id
environment
method
enabled
maintenance_mode
display_order
min_amount
max_amount
fee_type
fee_value
supported_assets
supported_networks
instructions
created_at
updated_at
updated_by
```

Important:

```text
environment = REAL
```

for these payment methods.

---

# 73. BANK ACCOUNT CONFIGURATION

```text
bank_accounts
-------------
id
environment
bank_name
account_holder
account_number_encrypted
ifsc
swift
branch
currency
country
instructions
active
default_account
created_at
updated_at
```

Bank accounts used for Real payments must never be exposed to Demo.

---

# 74. ADMIN PAYMENT UI

```text
Admin
 └── Finance
      └── Payment Settings
```

Sections:

```text
Auto Deposit
Manual Deposit
Direct Bank Transfer
```

---

# 75. AUTO DEPOSIT SETTINGS UI

```text
Auto Deposit
-----------------------

Status: ON/OFF

Provider: Cregis

Project:
************

Supported Assets:
USDT
USDC
...

Supported Networks:
TRON
BSC
...

Minimum:
...

Maximum:
...

Fee:
...

[Save]

[Test Connection]

[Test Webhook]
```

---

# 76. MANUAL DEPOSIT SETTINGS UI

```text
Manual Deposit
-----------------------

Enabled: ON

Instructions:
[Text Editor]

Required Fields:
[x] Amount
[x] Reference
[x] Proof
[x] Transaction Hash

Minimum:
Maximum:

[Save]
```

---

# 77. BANK TRANSFER SETTINGS UI

```text
Direct Bank Transfer
-----------------------

Enabled: ON

Bank Accounts

[Add Bank Account]

Account #1
Status: Active

[Edit]
[Disable]
```

---

# 78. PAYMENT METHOD AUDIT

Every Admin configuration change:

```text
Admin
 ↓
Change payment configuration
 ↓
Audit Log
```

Audit:

```text
admin_id
action
environment
payment_method
old_value
new_value
timestamp
ip
request_id
```

---

# 79. PAYMENT CONFIGURATION VERSIONING

Payment configuration should be versioned.

Example:

```text
Version 12
Auto Deposit enabled
Minimum = 10

Version 13
Auto Deposit enabled
Minimum = 20
```

This helps investigate historical deposits.

---

# 80. EXISTING TRANSACTIONS MUST NOT CHANGE

If Admin changes:

```text
minimum amount
fee
bank account
network
instructions
```

existing transactions must retain their original transaction configuration.

Never retroactively rewrite historical financial records.

---

# 81. PAYMENT FEE HANDLING

Support:

```text
percentage
fixed
percentage + fixed
zero
```

Example:

```text
Deposit:
1000 USDT

Fee:
10 USDT

Net:
990 USDT
```

The displayed and ledger amounts must be unambiguous.

---

# 82. AMOUNT VALIDATION

Backend must validate:

```text
amount > 0
amount >= minimum
amount <= maximum
asset supported
network supported
precision valid
```

Never trust frontend validation.

---

# 83. DECIMAL PRECISION

Never use JavaScript floating point for money.

Use:

```text
Decimal
```

or integer smallest units.

Example:

```text
100.10
```

must remain:

```text
100.10
```

and not become:

```text
100.099999999
```

---

# 84. AUTO DEPOSIT TIMEOUT

Auto Deposit transactions may have expiration where applicable.

Support:

```text
expires_at
```

After expiration:

```text
EXPIRED
```

The system must not credit an expired transaction unless the provider confirms a valid settlement and the reconciliation rules explicitly permit recovery.

---

# 85. PAYMENT SUCCESS PAGE

After successful confirmation:

```text
Deposit Successful

Amount:
500 USDT

Method:
Auto Deposit

Transaction:
ETH-DEP-XXXX

Status:
Completed
```

---

# 86. PAYMENT PENDING PAGE

```text
Deposit Pending

Your payment has been received or is being processed.

Transaction:
XXXX

Status:
Processing

We will update your wallet automatically.
```

No manual refresh should be required if WebSocket/polling is available.

---

# 87. PAYMENT FAILED PAGE

```text
Deposit Failed

Your deposit could not be completed.

Reason:
Payment provider rejected the transaction.

Transaction:
XXXX

[Try Again]
```

Never expose internal Cregis secrets/errors.

---

# 88. USER NOTIFICATIONS

Auto Deposit:

```text
Deposit Created
Deposit Processing
Deposit Confirmed
Deposit Failed
```

Manual:

```text
Deposit Submitted
Deposit Under Review
Deposit Approved
Deposit Rejected
```

Bank:

```text
Bank Transfer Submitted
Bank Transfer Under Review
Bank Transfer Approved
Bank Transfer Rejected
```

---

# 89. ADMIN NOTIFICATIONS

Admin should receive alerts for:

```text
New Manual Deposit
New Bank Transfer
Failed Cregis Transaction
Cregis Webhook Failure
Signature Failure
Reconciliation Mismatch
Duplicate Transaction
Suspicious Deposit
```

---

# 90. AUTOMATED RETRY

Retry only safe operations.

Examples:

```text
Cregis query
Webhook processing
Notification
Reconciliation
```

Never blindly retry:

```text
Wallet credit
Ledger transaction
Withdrawal creation
```

without idempotency protection.

---

# 91. CREGIS API ERROR LOGGING

Store safe diagnostics:

```text
HTTP status
Provider error code
Request ID
Internal transaction ID
Endpoint name
Latency
Timestamp
```

Do NOT store:

```text
API Key
Secret
Password
Authentication token
```

---

# 92. PAYMENT OBSERVABILITY

Admin dashboard:

```text
Payment Health
----------------

Cregis:
CONNECTED

Auto Deposits Today:
125

Successful:
119

Pending:
4

Failed:
2

Webhook:
HEALTHY

Reconciliation:
HEALTHY
```

---

# 93. CREGIS WEBHOOK MONITOR

Display:

```text
Last webhook
Last successful webhook
Last failed webhook
Signature failures
Duplicate callbacks
Unmatched transactions
Processing latency
```

---

# 94. RECONCILIATION DASHBOARD

```text
Provider Transactions
Internal Deposits
Ledger Transactions
Wallet Balances
```

Status:

```text
MATCHED
MISSING_INTERNAL
MISSING_PROVIDER
AMOUNT_MISMATCH
STATUS_MISMATCH
DUPLICATE
MANUAL_REVIEW
```

---

# 95. MANUAL RECONCILIATION

Admin can open:

```text
Reconciliation Exception
```

and see:

```text
Provider Transaction
Internal Transaction
Amounts
Status
User
Asset
Network
Timeline
```

Actions:

```text
Mark Reviewed
Create Corrective Ledger Entry
Escalate
```

Any correction must create an immutable audit trail.

---

# 96. REAL MONEY SAFETY

The system must enforce:

```text
No provider confirmation
        =
No automatic Real wallet credit
```

except for an explicitly approved manual Finance workflow.

---

# 97. DEMO SEPARATION

Demo must have:

```text
demo_wallet
demo_ledger
demo_balance_events
demo_orders
demo_trades
demo_positions
```

Demo has:

```text
POST /api/v1/demo/balance/topup
```

and nothing related to Cregis.

---

# 98. DEMO MUST NEVER CALL CREGIS

Automated test:

```text
Start Demo
 ↓
Add Demo Balance
 ↓
Monitor outbound requests
```

Expected:

```text
Cregis requests = 0
Bank APIs = 0
Real ledger = 0
Real wallet changes = 0
```

---

# 99. REAL MUST NEVER USE DEMO BALANCE

Automated test:

```text
Real trading
```

must use:

```text
Real wallet
Real ledger
```

Never:

```text
Demo wallet
```

---

# 100. MODE SEPARATION IN DATABASE

Every financial request must include/derive:

```text
environment = REAL
```

for Real.

Demo requests:

```text
environment = DEMO
```

But the backend must not trust a client-provided environment blindly.

---

# 101. SECURITY TEST

Attempt:

```text
POST /api/v1/demo/balance/topup
environment=REAL
```

Expected:

```text
Rejected
```

Attempt:

```text
POST /api/v1/real/deposits
environment=DEMO
```

Expected:

```text
Rejected
```

---

# 102. CREGIS SECRET TEST

Search the built frontend bundle for:

```text
CREGIS_API_KEY
```

Expected:

```text
NOT FOUND
```

Search mobile application bundle:

```text
CREGIS_API_KEY
```

Expected:

```text
NOT FOUND
```

---

# 103. WEBHOOK SECURITY TEST

Send:

```text
Invalid signature
```

Expected:

```text
Rejected
No wallet credit
No ledger credit
Audit event
```

---

# 104. DUPLICATE WEBHOOK TEST

Send same verified callback twice.

Expected:

```text
First:
Wallet credited

Second:
No wallet credit
No duplicate ledger
Transaction remains completed
```

---

# 105. AMOUNT MANIPULATION TEST

Provider callback:

```text
Expected:
100 USDT

Fake callback:
1000 USDT
```

Expected:

```text
REJECT / MANUAL REVIEW
```

No automatic 1000 USDT credit.

---

# 106. USER MAPPING TEST

Webhook for:

```text
Address A
```

must credit only the user assigned to:

```text
Address A
```

Never use only frontend-supplied:

```text
user_id
```

to decide who gets a deposit.

---

# 107. NETWORK MISMATCH TEST

Deposit:

```text
USDT/TRON
```

mapped to:

```text
USDT/BSC
```

must not be automatically credited.

---

# 108. CURRENCY MISMATCH TEST

Expected:

```text
USDT
```

Provider event:

```text
USDC
```

Expected:

```text
MANUAL_REVIEW
```

---

# 109. PAYMENT AMOUNT TESTS

Test:

```text
Minimum - 0.01
Minimum
Minimum + 0.01

Maximum - 0.01
Maximum
Maximum + 0.01
```

Correct error messages must be returned.

---

# 110. BANK TRANSFER TESTS

Test:

```text
Valid UTR
Duplicate UTR
Invalid UTR
Missing proof
Wrong amount
Wrong currency
Already approved
Already rejected
```

---

# 111. ADMIN PAYMENT SETTINGS TESTS

Test:

```text
Enable Auto Deposit
Disable Auto Deposit
Enable Manual
Disable Manual
Enable Bank Transfer
Disable Bank Transfer
Change minimum
Change maximum
Change bank account
Change instructions
Change supported network
```

All changes must immediately affect new transactions while preserving historical records.

---

# 112. PAYMENT MODE MAINTENANCE

If Auto Deposit is disabled:

```text
Auto Deposit
```

must disappear or show maintenance state.

But:

```text
Manual Deposit
Direct Bank Transfer
```

can remain available.

---

# 113. FAILOVER

If Cregis is temporarily unavailable:

```text
Auto Deposit
```

should show:

```text
Temporarily unavailable
```

while:

```text
Manual Deposit
Direct Bank Transfer
```

remain available if enabled.

---

# 114. PAYMENT METHOD PRIORITY

Admin can configure:

```text
Auto Deposit
```

as the primary method.

If unavailable:

```text
Manual Deposit
Direct Bank Transfer
```

remain alternatives.

---

# 115. FRONTEND UX REQUIREMENT

The Real Wallet should make it immediately obvious:

```text
REAL FUNDS
```

The Demo Wallet:

```text
DEMO FUNDS
```

No shared balance display should combine them.

Bad:

```text
Total Balance:
$105,000
```

Good:

```text
REAL BALANCE
$5,000

DEMO BALANCE
$100,000
```

---

# 116. REAL DASHBOARD

Show:

```text
Real Wallet Balance
Available
Locked
Deposits
Withdrawals
Real P&L
Real Positions
```

Demo dashboard:

```text
Demo Balance
Demo P&L
Demo Positions
Demo Orders
```

---

# 117. ADMIN USER SEARCH

Admin search must allow:

```text
User
 ↓
Real Financial Activity
```

and separately:

```text
User
 ↓
Demo Activity
```

Never accidentally merge the two.

---

# 118. REAL ACCOUNT STATEMENT

Statement must include:

```text
Opening balance
Deposits
Withdrawals
Trades
Fees
Adjustments
Closing balance
```

Only Real transactions.

---

# 119. DEMO ACCOUNT STATEMENT

Separate:

```text
Demo Top-ups
Demo Trades
Demo Fees
Demo Adjustments
```

No Real transaction.

---

# 120. API RATE LIMITING

Apply rate limits to:

```text
Deposit creation
Manual deposit submission
Bank transfer submission
Cregis webhook
Admin approval
Demo top-up
```

Webhook rate limiting must not accidentally block legitimate provider bursts.

---

# 121. AUTHORIZATION

Real payment operations require:

```text
Authenticated user
+
Active Real account
+
Required KYC status
+
Risk/compliance checks
```

Admin approval requires:

```text
Authorized Finance/Admin role
```

---

# 122. 2FA

For sensitive Real operations:

```text
Withdrawal
Bank beneficiary changes
Payment configuration changes
Manual wallet adjustments
Cregis configuration
```

require appropriate 2FA/step-up authentication.

---

# 123. ADMIN PAYMENT CONFIGURATION SECURITY

Changing:

```text
Cregis project
Cregis API configuration
bank account
withdrawal configuration
payment mode
```

must require:

```text
Admin authentication
2FA
Audit
```

Potentially:

```text
Dual approval
```

for production.

---

# 124. CREGIS CONFIGURATION TEST ENVIRONMENT

Use the Cregis environment intended for testing before production activation.

Cregis also documents testnet token resources for validating integrations. ([Cregis Developer Center][6])

Testing must not use real customer funds.

---

# 125. PRODUCTION ACTIVATION CHECKLIST

Before enabling Real Auto Deposit:

```text
[ ] Correct Cregis product selected
[ ] Correct project selected
[ ] Correct Base URL
[ ] Correct API credentials
[ ] IP allowlist configured
[ ] Webhook configured
[ ] Signature verification implemented
[ ] Idempotency implemented
[ ] Transaction mapping verified
[ ] Supported assets verified
[ ] Supported networks verified
[ ] Minimum/maximum configured
[ ] Reconciliation operational
[ ] Error monitoring operational
[ ] Admin payment settings operational
[ ] Test deposit successful
[ ] Duplicate callback test passed
[ ] Invalid signature test passed
[ ] Amount mismatch test passed
[ ] User mapping test passed
[ ] Demo isolation test passed
```

---

# 126. PAYMENT SYSTEM FIX STRATEGY

The existing system should NOT simply receive random patches.

Perform:

```text
Phase 1
Audit

Phase 2
Identify Cregis product

Phase 3
Verify credentials/project/Base URL

Phase 4
Verify API authentication/signature

Phase 5
Verify deposit creation

Phase 6
Verify payment/deposit callback

Phase 7
Verify idempotency

Phase 8
Verify ledger

Phase 9
Verify wallet

Phase 10
Verify reconciliation

Phase 11
Implement Manual Deposit

Phase 12
Implement Bank Transfer

Phase 13
Implement Admin Configuration

Phase 14
Implement monitoring

Phase 15
Run full financial test suite
```

---

# 127. DO NOT PATCH ONLY THE FRONTEND

If the Auto Deposit button currently fails, do NOT solve the problem by only changing:

```text
Button
```

Inspect the entire chain:

```text
UI
 ↓
API
 ↓
Worker
 ↓
Cregis Authentication
 ↓
Cregis API
 ↓
Callback
 ↓
Database
 ↓
Ledger
 ↓
Wallet
 ↓
Notification
```

---

# 128. CREGIS REQUEST LOGGING

For debugging, log:

```text
Internal transaction ID
Endpoint
HTTP method
Request timestamp
Cregis project identifier masked
Response status
Provider request ID
Latency
Error code
```

Do NOT log:

```text
API key
password
secret
authorization header
```

---

# 129. DEBUG MODE

Development/staging may expose detailed diagnostics to authorized developers.

Production users must never see:

```text
Cregis API error body
Signature details
Authentication details
Internal stack trace
Database query
Secret configuration
```

---

# 130. ERROR RESPONSE MODEL

User-facing:

```json
{
  "success": false,
  "code": "PAYMENT_PROVIDER_UNAVAILABLE",
  "message": "Auto Deposit is temporarily unavailable."
}
```

Internal log:

```text
CREGIS_TIMEOUT
request_id
transaction_id
provider_code
stack trace
```

---

# 131. PAYMENT SUCCESS GUARANTEE

The system must guarantee the following accounting rule:

```text
ONE REAL PAYMENT
        ↓
ONE REAL FINANCIAL TRANSACTION
        ↓
ONE REAL LEDGER POSTING
        ↓
ONE REAL WALLET CREDIT
```

Not:

```text
ONE PAYMENT
 ↓
2 credits
```

---

# 132. PAYMENT FAILURE GUARANTEE

If Cregis fails:

```text
No Real wallet credit
No ledger credit
```

If callback signature fails:

```text
No Real wallet credit
No ledger credit
```

If transaction mapping fails:

```text
No automatic credit
Manual review
```

---

# 133. BANK TRANSFER GUARANTEE

Bank transfer is not automatically successful merely because the user uploads a screenshot.

Correct:

```text
Proof uploaded
 ↓
Pending
 ↓
Finance verification
 ↓
Approved
 ↓
Ledger
 ↓
Wallet
```

---

# 134. MANUAL DEPOSIT GUARANTEE

Manual proof submission also does not automatically credit the wallet.

Correct:

```text
Submission
 ↓
Pending
 ↓
Review
 ↓
Approval
 ↓
Real Ledger
 ↓
Real Wallet
```

---

# 135. ADMIN APPROVAL GUARANTEE

Admin approval must be atomic:

```text
Approve
 ↓
Ledger transaction
 ↓
Wallet update
 ↓
Deposit status
 ↓
Audit
```

If any atomic operation fails:

```text
No partial financial state
```

---

# 136. REAL WALLET INVARIANTS

Always:

```text
total = available + locked
```

and:

```text
wallet balance = ledger-derived balance
```

Reconciliation must detect deviations.

---

# 137. DEMO WALLET INVARIANTS

Demo uses the same technical accounting discipline:

```text
demo_total =
demo_available + demo_locked
```

But it has no real-world monetary value.

---

# 138. CREGIS COLLECTION

If the architecture uses individual/sub-address deposit addresses, collection may be required.

Cregis documents collection as a mechanism to sweep funds from scattered deposit addresses into a treasury wallet. ([Cregis Developer Center][2])

The system should support:

```text
User Deposit Address
 ↓
Cregis
 ↓
Confirmed Deposit
 ↓
Collection
 ↓
Treasury
```

only where this matches the selected Cregis architecture and business requirements.

---

# 139. CREGIS PAYOUT

If Real withdrawals use Cregis WaaS payout:

```text
Real Wallet
 ↓
Withdrawal Request
 ↓
Risk/Compliance
 ↓
Ledger Lock
 ↓
Cregis Payout
 ↓
Cregis Callback
 ↓
Settlement
```

Cregis currently documents wallet payout APIs and payout notifications. ([Cregis Developer Center][4])

This PRD's immediate priority is deposits, but the same security/idempotency model must be applied to withdrawals.

---

# 140. REAL MONEY DATABASE RULE

Never allow Demo code to import:

```text
RealWalletService
RealLedgerService
CregisService
RealDepositService
RealWithdrawalService
```

where practical.

Likewise, Real financial code should never depend on:

```text
DemoBalanceService
```

---

# 141. CODE-LEVEL BOUNDARY

Recommended:

```text
services/
  real/
    wallet/
    ledger/
    deposits/
    bank-transfer/
    manual-deposit/
    cregis/

  demo/
    wallet/
    ledger/
    balance/
    trading/
```

This provides architectural protection in addition to database filtering.

---

# 142. PAYMENT SERVICE INTERFACE

Common UI interface may be shared:

```text
PaymentMethod
DepositStatus
TransactionStatus
```

but implementation must differ:

```text
RealCregisDepositService
RealManualDepositService
RealBankTransferService

DemoBalanceService
```

---

# 143. TEST MATRIX

## REAL

| Test                      | Expected                        |
| ------------------------- | ------------------------------- |
| Cregis Auto Deposit       | Real wallet credited            |
| Cregis duplicate callback | One credit                      |
| Invalid signature         | Rejected                        |
| Wrong amount              | Rejected/review                 |
| Wrong network             | Rejected/review                 |
| Manual Deposit            | Pending → Admin → Real wallet   |
| Bank Transfer             | Pending → Finance → Real wallet |
| Demo top-up               | No Real change                  |
| Demo trade                | No Real change                  |

## DEMO

| Test           | Expected             |
| -------------- | -------------------- |
| Demo Top-up    | Demo wallet credited |
| Cregis         | Not available        |
| Bank Transfer  | Not available        |
| Manual Deposit | Not available        |
| Demo Trade     | Demo only            |
| Demo P&L       | Demo only            |
| Demo Ledger    | Demo only            |
| Real Deposit   | Not visible          |

---

# 144. SECURITY TEST MATRIX

```text
[ ] Invalid Cregis signature
[ ] Replay callback
[ ] Duplicate callback
[ ] Wrong amount
[ ] Wrong asset
[ ] Wrong network
[ ] Unknown address
[ ] Unknown provider transaction
[ ] Wrong user
[ ] Expired transaction
[ ] Provider timeout
[ ] Database timeout
[ ] Queue retry
[ ] Concurrent approval
[ ] Concurrent webhook
[ ] Admin privilege escalation
[ ] Demo → Real injection
[ ] Real → Demo injection
[ ] Frontend secret exposure
[ ] Mobile secret exposure
```

---

# 145. PERFORMANCE

Auto Deposit creation should respond quickly.

The initial API should not wait unnecessarily for asynchronous settlement.

Preferred:

```text
Create Deposit
 ↓
Return Pending
 ↓
Cregis processes
 ↓
Webhook
 ↓
Wallet update
```

rather than blocking the user's HTTP request until settlement.

---

# 146. REALTIME STATUS

Use WebSocket or polling:

```text
PENDING
 ↓
PROCESSING
 ↓
COMPLETED
```

User should see status automatically update.

---

# 147. ADMIN REALTIME

Admin Finance dashboard should receive:

```text
New Deposit
Payment Completed
Payment Failed
Manual Deposit Submitted
Bank Transfer Submitted
Reconciliation Exception
```

in realtime where practical.

---

# 148. AUDIT LOG

Every financial action:

```text
User
Admin
System
Cregis
```

must be auditable.

Example:

```text
2026-08-14 20:30
REAL
Cregis Deposit
User: XXXXX
Amount: 500 USDT
Provider TX: XXXXX
Status: COMPLETED
Ledger: XXXXX
```

---

# 149. NO CREDENTIALS IN PRD

The credentials supplied separately for ETHSLTD should be referenced operationally as:

```text
CREGIS_WAAS_CREDENTIALS
CREGIS_PAYMENT_ENGINE_CREDENTIALS
ETHSLTD_CREGIS_ACCOUNT
ETHSLTD_ADMIN_EMAIL
```

Actual values belong only in the secure secret store.

Because these credentials were pasted into a chat/project specification, production deployment should use **newly rotated credentials**, not reuse exposed credentials.

---

# 150. PRODUCTION ACCEPTANCE TEST

A real-money Auto Deposit is considered working only when:

```text
User creates Real Auto Deposit
        ↓
Cregis request succeeds
        ↓
User completes payment/deposit
        ↓
Cregis confirms
        ↓
ETHSLTD receives callback
        ↓
Signature verifies
        ↓
Transaction maps to correct user
        ↓
Idempotency passes
        ↓
Amount validates
        ↓
Ledger posts exactly once
        ↓
Real wallet credits exactly once
        ↓
User receives notification
        ↓
Admin sees transaction
        ↓
Reconciliation shows MATCHED
```

---

# 151. MANUAL DEPOSIT ACCEPTANCE TEST

```text
User
 ↓
Manual Deposit
 ↓
Submit amount + proof
 ↓
Pending
 ↓
Admin sees request
 ↓
Admin approves
 ↓
Real ledger updated
 ↓
Real wallet updated
 ↓
User notified
 ↓
Audit complete
```

---

# 152. BANK TRANSFER ACCEPTANCE TEST

```text
Admin configures bank account
 ↓
User selects Direct Bank Transfer
 ↓
User sees correct bank details
 ↓
User transfers money
 ↓
User enters UTR
 ↓
User submits proof
 ↓
Finance reviews
 ↓
Finance approves
 ↓
Real ledger credited
 ↓
Real wallet credited
 ↓
User notified
```

---

# 153. DEMO ACCEPTANCE TEST

```text
User selects DEMO
 ↓
Demo Wallet
 ↓
Add Demo Balance
 ↓
Instant virtual credit
 ↓
Demo trade
 ↓
Demo P&L
```

At every step:

```text
Cregis calls = 0
Real ledger changes = 0
Real wallet changes = 0
Real transactions = 0
```

---

# 154. ADMIN ACCEPTANCE TEST

Admin must be able to:

```text
Enable Auto Deposit
Disable Auto Deposit
Configure Cregis settings
Test Cregis connection
View Cregis status
View Auto Deposits
View webhook health
Configure Manual Deposit
Configure Bank Transfer
Add bank account
Edit bank account
Disable bank account
Set limits
Configure fees
Change payment order
Enable maintenance mode
View reconciliation
Review manual deposits
Review bank transfers
```

---

# 155. FINAL PRODUCTION ARCHITECTURE

```text
                         ETHSLTD
                            |
             +--------------+--------------+
             |                             |
          REAL MODE                     DEMO MODE
             |                             |
      REAL WALLET                    DEMO WALLET
             |                             |
       REAL DEPOSIT                   DEMO TOP-UP
             |                             |
     +-------+--------+              Virtual Ledger
     |       |        |                     |
 CREGIS   MANUAL   BANK TRANSFER       Demo Trading
 AUTO       |          |
 DEPOSIT    |          |
     |      |          |
     +------+------+---+
            |
       REAL LEDGER
            |
       REAL WALLET
            |
       REAL TRADING
```

---

# 156. ABSOLUTE NO-MIX RULE

The following combinations are forbidden:

```text
DEMO → Cregis
DEMO → Bank Transfer
DEMO → Manual Deposit
DEMO → Real Ledger
DEMO → Real Wallet
DEMO → Real Withdrawal

REAL → Demo Ledger
REAL → Demo Wallet
REAL → Demo Balance
REAL Deposit → Demo Credit
Demo Top-up → Real Credit
```

Any such request must be rejected server-side.

---

# 157. FINAL DEFINITION OF DONE

## Cregis Auto Deposit

* [ ] Correct Cregis product identified.
* [ ] Correct project identified.
* [ ] Correct Base URL configured.
* [ ] Correct project ID configured.
* [ ] Correct API credentials configured securely.
* [ ] Cregis IP allowlist configured.
* [ ] API authentication working.
* [ ] Request signature/authentication verified.
* [ ] Deposit creation working.
* [ ] Correct asset selection.
* [ ] Correct network selection.
* [ ] Correct address generation/mapping.
* [ ] Correct payment/deposit status.
* [ ] Webhook configured.
* [ ] Webhook signature verification working.
* [ ] Idempotency working.
* [ ] Duplicate callbacks safe.
* [ ] User mapping secure.
* [ ] Amount verification working.
* [ ] Ledger credit working.
* [ ] Real wallet credit working.
* [ ] Notifications working.
* [ ] Reconciliation working.
* [ ] Failure recovery working.
* [ ] Admin monitoring working.

## Manual Deposit

* [ ] Enabled/disabled by Admin.
* [ ] Instructions configurable.
* [ ] User submission working.
* [ ] Proof upload working.
* [ ] Transaction reference working.
* [ ] Admin review working.
* [ ] Approve working.
* [ ] Reject working.
* [ ] Duplicate approval prevented.
* [ ] Ledger posting working.
* [ ] Real wallet credit working.
* [ ] Audit logging working.

## Direct Bank Transfer

* [ ] Admin can create bank accounts.
* [ ] Admin can edit bank accounts.
* [ ] Admin can enable/disable bank accounts.
* [ ] Currency supported.
* [ ] Bank details displayed correctly.
* [ ] Unique payment reference generated.
* [ ] UTR submission working.
* [ ] Proof upload working.
* [ ] Finance review working.
* [ ] Duplicate UTR detection working.
* [ ] Approval working.
* [ ] Rejection working.
* [ ] Ledger posting working.
* [ ] Real wallet credit working.
* [ ] Audit logging working.

## Demo

* [ ] Demo wallet separate.
* [ ] Demo ledger separate.
* [ ] Demo top-up separate.
* [ ] Demo trading separate.
* [ ] Demo P&L separate.
* [ ] Demo transaction history separate.
* [ ] Cregis unavailable in Demo.
* [ ] Bank transfer unavailable in Demo.
* [ ] Manual Deposit unavailable in Demo.
* [ ] Demo cannot create real financial transactions.
* [ ] Real cannot receive Demo balance.

---

# 158. FINAL ENGINEERING PRINCIPLE

The implementation must not be considered complete merely because the **Cregis button opens a payment page**.

A correct production implementation means:

```text
Cregis Request
        ↓
Correct Authentication
        ↓
Correct Project
        ↓
Correct Asset/Network
        ↓
Correct Payment/Deposit
        ↓
Correct Callback
        ↓
Verified Signature
        ↓
Idempotent Processing
        ↓
Correct User Mapping
        ↓
Correct Amount
        ↓
Correct Ledger
        ↓
Correct Real Wallet
        ↓
Correct Notification
        ↓
Correct Reconciliation
```

Every stage must be verified.

The objective is to make ETHSLTD's Auto Deposit behave as a **complete production financial integration**, not merely a frontend payment widget.

Cregis's current official documentation should remain the authoritative technical reference for endpoint parameters, authentication, callback contracts, supported assets, and product-specific behavior. ([Cregis Developer Center][1])

[1]: https://developers.cregis.com/en/introduction "Cregis Developer Center | API Docs & Quickstart Guide | Cregis Developer Docs"
[2]: https://developers.cregis.com/en/waas-business-flow "WaaS Business Flow | Cregis Developer Docs"
[3]: https://developers.cregis.com/en/waas-setup "WaaS Integration Setup | Cregis Developer Docs"
[4]: https://developers.cregis.com/en/reference/waas-api "WaaS API | Cregis Developer Docs"
[5]: https://developers.cregis.com/en/payment-engine-business-flow "Payment Engine Business Flow | Cregis Developer Docs"
[6]: https://developers.cregis.com/en/waas-sdk-overview "SDKs & Developer Tools | Cregis Developer Docs"
