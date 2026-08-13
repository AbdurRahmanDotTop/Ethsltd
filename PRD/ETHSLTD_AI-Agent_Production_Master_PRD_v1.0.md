हाँ। मैंने आपके पहले के ETHSLTD documents/PRD material को भी आधार बनाया है, जिसमें trading, wallet, double-entry ledger, P2P escrow, KYC/AML, RBAC, realtime, Cloudflare stack, security, testing और ₹0 development strategy शामिल हैं।  

मेरी recommendation है कि अब आप **एक single “Master PRD + AI Agent Operating Specification”** बनाकर Gemini को दें। इसमें agent को सिर्फ coding instructions नहीं मिलेंगी, बल्कि यह भी होगा कि:

* पहले existing project audit करे
* जहाँ कमी हो खुद identify करे
* जहाँ requirement missing हो वहाँ आपसे question पूछे
* आपकी approval के बिना important assumptions न बनाए
* हर phase के बाद verification करे
* production-readiness audit बार-बार चलाए
* और अंत तक project को A→Z harden करे

नीचे वही master document है।

---

# ETHSLTD — MASTER PRODUCTION PRD & AI AGENT EXECUTION SPECIFICATION

**Document Type:** Master Product Requirements Document + Technical Architecture + AI Agent Operating Contract
**Project:** ETHSLTD
**Target:** Production-grade Trading Platform
**Platforms:** Web + Android + iOS-ready architecture
**Development Model:** AI-assisted / Agent-driven development
**Primary Agent:** Gemini Pro coding agent
**Infrastructure Target:** Cloudflare ecosystem
**Repository:** GitHub + pnpm + Turborepo
**Initial Development Goal:** ₹0 / free-tier-first where technically and operationally possible
**Final Goal:** Secure, scalable, auditable production platform
**Document Status:** Master baseline — agent must continuously refine through approved decisions

---

# 1. MASTER OBJECTIVE

ETHSLTD एक complete digital trading platform होगा जिसमें users:

* account बना सकें
* authentication कर सकें
* KYC workflow complete कर सकें
* assets hold कर सकें
* wallet देख सकें
* spot trading कर सकें
* buy/sell orders place कर सकें
* realtime order book देख सकें
* positions/orders/history देख सकें
* P2P marketplace use कर सकें
* escrow-based P2P trades कर सकें
* disputes raise कर सकें
* contracts create/sign कर सकें
* notifications प्राप्त कर सकें
* security settings manage कर सकें
* support प्राप्त कर सकें

और administrators:

* users manage करें
* KYC review करें
* P2P disputes handle करें
* trading markets configure करें
* risk controls manage करें
* finance/ledger operations monitor करें
* audit logs देखें
* suspicious activity investigate करें
* system health monitor करें

पूरी architecture इस तरह बनाई जाएगी कि future में simulated/paper environment से compliant real-money production environment तक evolve किया जा सके।

---

# 2. सबसे महत्वपूर्ण PRODUCT PRINCIPLE

## Production-ready ≠ feature-complete

केवल:

```text
BUY
SELL
P2P
KYC
LOGIN
```

बन जाने से project production-ready नहीं माना जाएगा।

Production readiness में कम-से-कम:

```text
Financial correctness
+
Security
+
Concurrency safety
+
Auditability
+
Data integrity
+
Reconciliation
+
Fraud prevention
+
Disaster recovery
+
Observability
+
Operational controls
+
Compliance readiness
+
Performance
+
Testing
```

शामिल होंगे। यह principle आपके existing architecture documents में भी explicitly defined है। 

---

# 3. AI AGENT की भूमिका

Gemini को सिर्फ "developer" नहीं माना जाएगा।

उसे निम्न roles निभाने होंगे:

### Senior Software Engineer

Code लिखना।

### Solution Architect

Architecture decisions evaluate करना।

### QA Engineer

Tests और regression करना।

### Security Engineer

Security weaknesses ढूँढना।

### DevOps Engineer

CI/CD, Cloudflare, environments manage करना।

### Database Engineer

Schema, indexes, migrations, consistency manage करना।

### Performance Engineer

Latency, rendering, WebSocket performance optimize करना।

### Reliability Engineer

Failure recovery, retries, idempotency, reconciliation design करना।

### Code Auditor

Existing implementation में production gaps ढूँढना।

### Documentation Engineer

Architecture/runbooks/documentation maintain करना।

**लेकिन:** Gemini legal, regulatory, financial-policy या business-owner decisions खुद invent नहीं करेगा।

---

# 4. HUMAN OWNER की भूमिका

आप:

```text
Product Owner
+
Business Owner
+
Infrastructure Owner
+
Final Approval Authority
```

होंगे।

आपको agent को हर छोटी coding detail approve करने की जरूरत नहीं होगी।

लेकिन निम्न चीजें human approval के बिना नहीं होंगी:

* business rules
* trading rules
* fee model
* custody model
* KYC/AML policy
* legal policy
* regulatory assumptions
* real-money activation
* production secrets
* destructive database changes
* production deployment
* irreversible financial actions

---

# 5. AGENT का CORE OPERATING RULE

Gemini को यह rule दिया जाए:

> **"When information is missing, do not silently invent a production-critical requirement. Ask the human owner, explain why the answer matters, provide recommended options, and wait for approval."**

लेकिन हर missing detail पर agent project को रोक भी नहीं देगा।

वह तीन categories बनाएगा:

### A — Safe to decide autonomously

उदाहरण:

* naming
* folder structure
* internal helper
* test framework
* refactoring
* lint configuration

### B — Recommendation + approval

उदाहरण:

* authentication architecture
* database indexing strategy
* caching strategy
* WebSocket topology
* API versioning

### C — Mandatory human decision

उदाहरण:

* real-money trading rules
* fees
* withdrawal limits
* KYC policy
* legal contracts
* regulatory jurisdiction
* production activation

---

# 6. AGENT APPROVAL PROTOCOL

हर major phase में agent यह report देगा:

```text
PHASE
OBJECTIVE

WHAT I FOUND

WHAT I CHANGED

FILES CHANGED

DATABASE CHANGES

SECURITY IMPACT

PERFORMANCE IMPACT

TESTS RUN

TEST RESULTS

KNOWN LIMITATIONS

OPEN QUESTIONS

RECOMMENDATIONS

REQUIRES HUMAN APPROVAL:
YES / NO
```

यदि approval जरूरी है:

```text
STOP HERE
```

और user से प्रश्न पूछे।

---

# 7. NO-GUESS POLICY

Agent कभी भी silently assume नहीं करेगा:

```text
fee = 0.1%

KYC = optional

withdrawal = instant

market order = IOC

P2P timeout = 15 minutes

admin can release escrow

BTC precision = 8

USDT precision = 6
```

जब तक ये approved configuration/business rules न हों।

---

# 8. EXISTING REPOSITORY FIRST

Agent को सबसे पहले code लिखने की अनुमति नहीं होगी।

पहला task:

> **Audit the complete existing ETHSLTD repository before modifying anything.**

उसे inspect करना होगा:

```text
package.json
pnpm-lock.yaml
pnpm-workspace.yaml
turbo.json

apps/
packages/

Next.js configuration
Tailwind configuration
TypeScript configuration

existing stores
existing mock APIs
existing components
existing routes
existing authentication
existing data models
existing deployment files
```

आपके previous workflow में भी यही पहला recommended step है। 

---

# 9. REQUIRED INITIAL AUDIT

Agent को report करनी होगी:

### Architecture

* current architecture
* target architecture
* gaps

### Code quality

* duplicate code
* dead code
* bad abstractions
* technical debt

### Security

* secrets
* unsafe APIs
* insecure auth
* XSS
* CSRF
* authorization gaps
* insecure storage

### Database

* schema problems
* missing indexes
* missing constraints
* transaction problems

### Trading

* mock logic
* race conditions
* incorrect calculations

### Frontend

* hydration issues
* excessive JS
* unnecessary rerenders
* accessibility issues
* mobile problems

### Deployment

* Cloudflare compatibility
* OpenNext compatibility
* Wrangler configuration
* environment problems

### Testing

* coverage
* missing tests
* missing E2E

---

# 10. TARGET ARCHITECTURE

Final architecture:

```text
                         GitHub
                            │
                      Turborepo
                            │
              ┌─────────────┼─────────────┐
              │             │             │
           apps/web     apps/admin    apps/mobile
              │             │             │
          Next.js        Next.js       Expo/RN
              │
           OpenNext
              │
      Cloudflare Workers
              │
              │
        ┌─────┴──────────┐
        │                │
      Hono API       Realtime layer
        │                │
        │          Durable Objects
        │                │
        ├──── D1         ├── WebSocket
        ├──── R2         ├── Orderbook
        ├──── KV         ├── Market state
        └──── Queues     └── P2P rooms
```

Cloudflare की current documentation Next.js को Workers पर OpenNext adapter के जरिए deploy करने की recommendation देती है; App Router, SSR, Route Handlers, RSC, Server Actions आदि supported हैं। ([Cloudflare Docs][1])

---

# 11. FRONTEND ARCHITECTURE

## Web

Use:

```text
Next.js
React
TypeScript
Tailwind CSS
shadcn/ui
TanStack Query
Zustand
React Hook Form
Zod
Lightweight Charts
```

लेकिन agent हर dependency को justify करेगा।

**Dependency minimization mandatory है।**

---

# 12. WEB APPLICATION MODULES

Required areas:

```text
/
 /markets
 /trade
 /trade/[market]
 /orders
 /positions
 /wallet
 /wallet/deposit
 /wallet/withdraw
 /p2p
 /p2p/[trade]
 /contracts
 /notifications
 /profile
 /security
 /support
```

Admin:

```text
/admin
/admin/users
/admin/kyc
/admin/trading
/admin/markets
/admin/orders
/admin/trades
/admin/ledger
/admin/p2p
/admin/p2p/disputes
/admin/contracts
/admin/risk
/admin/audit
/admin/settings
/admin/system
```

---

# 13. MOBILE ARCHITECTURE

Mobile architecture:

```text
apps/mobile
```

React Native + Expo + TypeScript architecture आपके existing project direction के अनुरूप है। 

लेकिन mobile app को web का copy नहीं बनाना है।

Mobile-specific:

* biometric authentication
* push notifications
* secure storage
* deep links
* device management
* mobile trading UI
* network recovery
* offline-safe UI state

---

# 14. BACKEND

Backend:

```text
Cloudflare Worker
+
Hono
```

Responsibilities:

```text
Authentication
Users
Wallet
Orders
Trading APIs
P2P
Contracts
Notifications
Admin
Risk
Audit
```

API domain:

```text
api.ethsltd.com
```

---

# 15. DATABASE

Primary database:

```text
Cloudflare D1
```

ORM:

```text
Drizzle ORM
```

लेकिन agent को हर query के लिए:

* indexes
* constraints
* transactions
* consistency
* pagination

define करने होंगे।

---

# 16. DATABASE DOMAIN MODEL

Minimum entities:

```text
users
user_profiles
user_sessions
user_devices

roles
permissions
role_permissions
user_roles

kyc_profiles
kyc_documents
kyc_reviews

assets
markets

accounts
wallets
wallet_balances

ledger_accounts
ledger_transactions
ledger_entries

orders
order_events
trades
trade_events

p2p_ads
p2p_trades
p2p_escrow
p2p_messages
p2p_disputes
p2p_evidence

contracts
contract_versions
contract_participants
contract_signatures

notifications

risk_profiles
risk_events

audit_logs

system_settings
feature_flags
```

Agent existing project audit के बाद exact schema refine करेगा।

---

# 17. FINANCIAL LEDGER — CRITICAL

यह project का सबसे important subsystem होगा।

Architecture:

```text
User
 ↓
Account
 ↓
Ledger
 ↓
Wallet balance projection
```

हर asset movement:

```text
Debit
+
Credit
```

double-entry ledger में होना चाहिए।

---

# 18. IMMUTABLE LEDGER

Ledger entries:

**DELETE नहीं होंगी।**

Correction के लिए:

```text
reversal
+
new correcting entry
```

use होगा।

---

# 19. MONEY CALCULATION

JavaScript floating-point financial calculation forbidden है।

Existing specification भी exact/integer smallest-unit model की मांग करती है। 

Agent को asset configuration maintain करनी होगी:

```text
BTC → 8 decimals
USDT → configurable
INR → 2 decimals
```

लेकिन exact values human/business configuration से आएँगी।

---

# 20. IDEMPOTENCY

हर financial mutation में:

```text
idempotency_key
request_id
transaction_id
```

होना चाहिए।

Duplicate request:

```text
same request
↓
same result
```

देनी चाहिए।

---

# 21. WALLET

Wallet state:

```text
available
locked
total
```

लेकिन financial source of truth ledger रहेगा।

---

# 22. TRADING ENGINE

Initial supported:

```text
Market
Limit
```

फिर configurable:

```text
Stop
Stop Limit
IOC
FOK
GTC
GTD
Post Only
Reduce Only
OCO
Trailing Stop
Bracket
```

Agent हर order type के लिए:

* validation
* state machine
* matching behavior
* cancellation
* expiration
* fees
* tests

define करेगा।

---

# 23. ORDER STATE MACHINE

Baseline:

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

Failure:

```text
REJECTED
EXPIRED
CANCELLED
FAILED
```

Existing project material में इसी प्रकार state machine defined है।

---

# 24. ORDER BOOK

Price-time priority:

```text
Best Price
   ↓
Earliest Time
```

Agent को concurrency tests लिखने होंगे:

```text
100 simultaneous orders
same price
different timestamps
```

और verify करना होगा कि matching deterministic है।

---

# 25. DURABLE OBJECTS

Durable Objects का उपयोग:

```text
MarketRoom
OrderBook
RealtimeState
Trading coordination
P2P room
WebSocket connections
```

के लिए किया जा सकता है।

Cloudflare Durable Objects strongly consistent stateful coordination के लिए designed हैं। ([Cloudflare Docs][2])

---

# 26. WEBSOCKET

Flow:

```text
Client
 ↓
Worker authentication
 ↓
Durable Object
 ↓
WebSocket
 ↓
Market events
```

Cloudflare वर्तमान guidance में Durable Object WebSocket servers के लिए **WebSocket Hibernation API** को recommended approach बताता है। ([Cloudflare Docs][3])

Agent इसे use करने की feasibility evaluate करेगा।

---

# 27. REALTIME DATA MODEL

Initial snapshot:

```text
REST
 ↓
orderbook snapshot
```

फिर:

```text
WebSocket
 ↓
incremental updates
```

यदि connection टूटे:

```text
reconnect
 ↓
fresh snapshot
 ↓
resume updates
```

---

# 28. P2P MARKETPLACE

Features:

```text
Create advertisement
Buy
Sell
Price
Limits
Payment methods
Terms
Availability
Trade creation
Escrow
Payment confirmation
Release
Dispute
```

---

# 29. P2P STATE MACHINE

```text
CREATED
 ↓
ESCROW_LOCKED
 ↓
PAYMENT_PENDING
 ↓
PAID
 ↓
RELEASED
```

Alternative:

```text
DISPUTED
 ↓
UNDER_REVIEW
 ↓
RESOLVED
```

Timeout:

```text
EXPIRED
CANCELLED
```

---

# 30. ESCROW

Escrow केवल:

```text
seller.locked_balance += amount
```

नहीं होगा।

Proper ledger movement:

```text
Seller Available
       ↓
Escrow Account
       ↓
Release
       ↓
Buyer
```

हर step auditable होगा।

---

# 31. P2P CHAT

Features:

* realtime
* message IDs
* timestamps
* read state
* moderation
* attachments
* evidence preservation
* dispute locking
* admin visibility according to policy

---

# 32. DISPUTE SYSTEM

Admin:

```text
Open dispute
Review chat
Review evidence
Review payment reference
Freeze escrow
Request evidence
Make resolution
Record reason
```

हर admin action audit होगा।

---

# 33. AUTHENTICATION

Minimum:

```text
Registration
Login
Logout
Session management
Device management
Password reset
Email verification
2FA
Recovery codes
Session revocation
```

Security baseline:

```text
Argon2id
Secure cookies
HttpOnly
SameSite
CSRF protection where applicable
Rate limiting
Login throttling
Suspicious login detection
```

Existing architecture में भी Argon2id, secure cookies, throttling, device monitoring और TOTP जैसे controls defined हैं। 

---

# 34. RBAC

Roles configurable होंगे।

Baseline:

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

लेकिन agent को permissions matrix बनानी होगी।

---

# 35. SECURITY

Minimum:

```text
HTTPS
HSTS
CSP
WAF
Rate limiting
Bot protection
DDoS protection
RBAC
2FA
Audit logs
Encryption
Secret management
Dependency scanning
SAST
DAST
```

यह baseline existing project requirements में भी specified है। 

---

# 36. SECRET MANAGEMENT

Never:

```text
API_KEY="..."
```

in Git.

Use:

```text
Cloudflare Secrets
GitHub Secrets
environment-specific configuration
```

और:

```text
LOCAL
STAGING
PRODUCTION
```

अलग रखें। 

---

# 37. R2

Private R2:

```text
KYC documents
Contracts
Invoices
Reports
Statements
Support attachments
```

Public exposure forbidden by default.

Architecture:

```text
Private R2
 ↓
Authorized Worker
 ↓
temporary signed access
```

यह existing specification के अनुरूप है। 

---

# 38. KYC

Technical workflow:

```text
User
 ↓
KYC submission
 ↓
Document upload
 ↓
Review queue
 ↓
Admin/provider
 ↓
Approved / Rejected / Pending
```

लेकिन:

**कौन-सी KYC requirement लागू होगी, agent खुद decide नहीं करेगा।**

Human/legal/compliance input required.

---

# 39. AML / RISK

Architecture:

```text
Transaction
 ↓
Risk engine
 ↓
Risk score
 ↓
LOW
MEDIUM
HIGH
CRITICAL
```

Possible actions:

```text
ALLOW
REVIEW
LIMIT
FREEZE
ESCALATE
```

Actual thresholds human approval से आएँगे।

---

# 40. CONTRACTS

Features:

```text
Create
Template
Version
Participants
Review
OTP/signature
Hash
Timestamp
Audit trail
PDF
Storage
```

लेकिन legal enforceability human legal review के अधीन होगी।

---

# 41. NOTIFICATIONS

Channels:

```text
In-app
Email
Push
Realtime
```

Events:

```text
Login
Security alert
Order filled
Order cancelled
P2P created
Payment received
Dispute
KYC update
Contract signature
Withdrawal status
```

---

# 42. ADMIN PANEL

Admin को अलग application/package रखना preferred होगा।

Admin modules:

```text
Dashboard
Users
KYC
Risk
Trading
Markets
Orders
Trades
Ledger
P2P
Disputes
Contracts
Notifications
Audit
System
Feature flags
```

---

# 43. AUDIT LOG

हर privileged action:

```text
actor
action
resource
resource_id
timestamp
IP
device/session reference
before
after
reason
request_id
```

जहाँ legally/operationally appropriate हो।

---

# 44. OBSERVABILITY

Agent implement करेगा:

```text
structured logs
request IDs
correlation IDs
error tracking hooks
metrics
health endpoints
audit events
performance timing
```

Production secrets logs में नहीं आने चाहिए।

---

# 45. PERFORMANCE

Targets agent define/test करेगा, लेकिन initial engineering targets:

```text
fast initial render
minimal JS
code splitting
lazy loading
virtualized tables
efficient charts
indexed database queries
WebSocket incremental updates
compressed payloads
pagination
caching where safe
```

Trading page को unnecessary rerender नहीं करना चाहिए।

---

# 46. ACCESSIBILITY

Target:

```text
WCAG-oriented
keyboard navigation
ARIA
focus management
screen reader support
contrast
reduced motion
form error accessibility
```

---

# 47. INTERNATIONALIZATION

Day one architecture:

```text
English
Hindi
```

और future-ready:

```text
Arabic
Bengali
Spanish
...
```

UI strings hard-code नहीं होंगे। यह existing requirements में explicitly शामिल है। 

---

# 48. CURRENCY / ASSET FORMATTING

Hard-code नहीं:

```text
₹
$
BTC
USDT
```

Asset configuration:

```text
symbol
name
type
precision
display precision
locale
network
status
```

---

# 49. CI/CD

Branches:

```text
main
develop
feature/*
hotfix/*
```

Pipeline:

```text
push
 ↓
install
 ↓
lint
 ↓
typecheck
 ↓
unit tests
 ↓
integration tests
 ↓
build
 ↓
security scan
 ↓
staging
 ↓
approval
 ↓
production
```

यह existing Git strategy के अनुरूप है। 

Cloudflare current documentation Workers Builds तथा GitHub Actions दोनों CI/CD approaches support करती है। ([Cloudflare Docs][4])

---

# 50. ENVIRONMENTS

Mandatory:

```text
LOCAL
STAGING
PRODUCTION
```

Never develop against production database. 

---

# 51. CLOUDFLARE DEPLOYMENT

Target:

```text
Next.js
 ↓
OpenNext
 ↓
Cloudflare Workers
```

Current Cloudflare docs manual setup में:

```text
@opennextjs/cloudflare
wrangler
wrangler.jsonc
open-next.config.ts
```

और `.open-next/worker.js` deployment output का उपयोग दिखाती हैं। ([Cloudflare Docs][1])

Agent को outdated `next-on-pages` architecture introduce नहीं करना है।

---

# 52. DOMAIN

Production target:

```text
ethsltd.com
api.ethsltd.com
```

Realtime:

```text
ws.ethsltd.com
```

केवल आवश्यकता proven होने पर।

---

# 53. TESTING STRATEGY

Agent को minimum:

### Unit

* calculations
* validation
* order matching
* fee calculation
* ledger

### Integration

* API + D1
* Auth
* wallet
* order lifecycle
* P2P

### E2E

* registration
* login
* trading
* P2P
* dispute
* admin
* contract

### Security

* auth bypass
* privilege escalation
* injection
* CSRF
* XSS
* rate limiting
* session abuse

### Concurrency

* simultaneous orders
* duplicate requests
* concurrent withdrawals
* simultaneous P2P actions
* double release

---

# 54. FAILURE TESTING

Agent deliberately test करेगा:

```text
database timeout
network failure
duplicate request
worker restart
DO restart
WebSocket disconnect
partial response
retry
timeout
race condition
```

और verify करेगा कि system:

**double-spend नहीं करता।**

---

# 55. RECONCILIATION

Periodic reconciliation:

```text
Ledger
   ↕
Wallet projection
   ↕
Trade records
   ↕
Escrow records
```

Mismatch:

```text
ALERT
```

automatic silent correction नहीं।

---

# 56. BACKUP / RECOVERY

Agent को define करना होगा:

* migration recovery
* data export
* audit retention
* R2 backup strategy
* configuration backup
* disaster recovery procedure
* rollback strategy

---

# 57. FEATURE FLAGS

Use:

```text
feature_flags
```

ताकि:

```text
P2P
Trading
Withdrawals
New order type
New market
```

independently enable/disable हो सकें।

---

# 58. REAL MONEY SAFETY

जब तक explicitly approved नहीं:

```text
REAL_WITHDRAWALS = OFF
REAL_DEPOSITS = OFF
REAL_SETTLEMENT = OFF
```

Initial system:

```text
PAPER_TRADING = ON
P2P_SIMULATION = ON
VIRTUAL_WALLET = ON
```

आपकी existing ₹0 strategy भी इसी staged approach को recommend करती है। 

---

# 59. FREE-FIRST STRATEGY

Initial:

```text
GitHub
Cloudflare
D1
Durable Objects
R2
Workers
```

का free-tier-first उपयोग किया जाएगा।

लेकिन agent को **"free forever" assume नहीं करना है**।

Free limits capacity constrain कर सकती हैं; आपके existing planning documents भी ₹0 को development/testing/demo/paper-trading phase तक सीमित मानते हैं। 

---

# 60. AGENT MUST TRACK LIMITS

Agent एक document maintain करेगा:

```text
docs/infrastructure/limits.md
```

जिसमें:

```text
Cloudflare limits
D1 limits
DO limits
R2 limits
Worker limits
GitHub limits
```

और current usage/estimated usage होगा।

---

# 61. PRODUCTION READINESS SCORECARD

हर milestone पर:

```text
Architecture       PASS/FAIL
Security           PASS/FAIL
Database           PASS/FAIL
Ledger             PASS/FAIL
Trading            PASS/FAIL
P2P                PASS/FAIL
Auth               PASS/FAIL
RBAC               PASS/FAIL
Realtime           PASS/FAIL
Testing            PASS/FAIL
Performance        PASS/FAIL
Observability      PASS/FAIL
Backup             PASS/FAIL
Deployment         PASS/FAIL
Compliance         HUMAN REVIEW
Legal              HUMAN REVIEW
```

जब तक critical item fail है:

**production = NO-GO**

---

# 62. AGENT AUTOMATIC GAP ANALYSIS

यह इस PRD का बहुत important हिस्सा है।

Agent को केवल PRD implement नहीं करना है।

उसे continuously पूछना होगा:

> "What is missing for production?"

उदाहरण:

अगर PRD में withdrawal है और agent notice करता है:

```text
withdrawal
but no withdrawal risk engine
```

तो उसे issue report करना है।

अगर:

```text
P2P escrow
but no double-release protection
```

तो fix करना है।

अगर:

```text
admin
but no audit log
```

तो implement करना है।

अगर:

```text
login
but no session revocation
```

तो fix करना है।

---

# 63. NO PARTIAL FEATURE RULE

Agent यह नहीं कहेगा:

> "P2P UI complete है."

जब backend mocked हो।

Feature status:

```text
UI_ONLY
MOCKED
PARTIAL
INTEGRATED
TESTED
STAGING_READY
PRODUCTION_READY
```

हर feature के साथ status maintain होगा।

---

# 64. MOCK DATA POLICY

Mocks केवल:

```text
development
testing
demo
```

के लिए।

Production build में:

```text
mock API
setTimeout simulation
fake balances
fake trades
fake KYC approval
```

नहीं होना चाहिए।

---

# 65. CODE QUALITY

Mandatory:

```text
strict TypeScript
no unnecessary any
no ignored errors
no silent catch
no dead code
no secrets
no debug logs
no TODO for critical logic
```

Critical TODO होने पर production readiness fail।

---

# 66. DATABASE MIGRATION RULE

Agent:

```text
schema change
 ↓
migration
 ↓
migration test
 ↓
rollback consideration
 ↓
apply
```

direct production DB modification नहीं करेगा।

---

# 67. DESTRUCTIVE ACTION RULE

Agent को human approval चाहिए:

```text
DROP DATABASE
DROP TABLE
DELETE production data
RESET production DB
rotate critical production credentials
disable security controls
enable real withdrawals
enable real settlement
```

---

# 68. PRODUCTION DEPLOYMENT RULE

Agent:

```text
build
test
scan
preview
report
```

तक automatically जा सकता है।

लेकिन:

```text
PRODUCTION DEPLOY
```

से पहले:

**HUMAN APPROVAL REQUIRED**

---

# 69. AGENT MEMORY / DECISION LOG

Repository में:

```text
docs/
 ├── architecture/
 ├── decisions/
 ├── security/
 ├── operations/
 ├── api/
 ├── database/
 ├── trading/
 ├── p2p/
 ├── compliance/
 └── deployment/
```

Agent प्रत्येक important decision को ADR में record करेगा:

```text
ADR-001
Title
Problem
Options
Decision
Reason
Consequences
Approved by
Date
```

---

# 70. HUMAN QUESTION SYSTEM

Agent हर phase में questions को priority देगा:

### P0 — blocks development

तुरंत पूछो।

### P1 — affects architecture

current phase से पहले पूछो।

### P2 — business configuration

reasonable default propose करके approval लो।

### P3 — cosmetic

agent खुद decide कर सकता है।

---

# 71. HUMAN INPUT REGISTER

Agent maintain करेगा:

```text
docs/product/human-decisions.md
```

Example:

```text
DEC-001
Question:
What is the initial supported base currency?

Status:
PENDING

Options:
A
B
C

Recommendation:
A

Reason:
...

Owner:
Human

Approval:
PENDING
```

आप जवाब देंगे:

```text
DEC-001 = A
```

Agent आगे बढ़ेगा।

---

# 72. IMPORTANT: AGENT को प्रश्न कैसे पूछना है

Bad:

> "What should I do?"

Good:

> "Withdrawal architecture requires a maximum daily limit. This affects risk controls and database fields. I recommend ₹X-equivalent for staging only, but I will not assume a production value. Choose A/B/C or provide your own."

इससे आपको technical details समझे बिना भी decision लेने में सुविधा होगी।

---

# 73. PROJECT EXECUTION PHASES

## PHASE 0

Repository audit.

## PHASE 1

Architecture stabilization.

## PHASE 2

Monorepo cleanup.

## PHASE 3

OpenNext + Cloudflare Workers.

## PHASE 4

Hono API.

## PHASE 5

D1 + Drizzle.

## PHASE 6

Domain model.

## PHASE 7

Ledger.

## PHASE 8

Authentication.

## PHASE 9

RBAC.

## PHASE 10

Wallet.

## PHASE 11

Trading engine.

## PHASE 12

Order book.

## PHASE 13

Durable Objects.

## PHASE 14

WebSocket.

## PHASE 15

P2P.

## PHASE 16

Escrow.

## PHASE 17

Contracts.

## PHASE 18

KYC.

## PHASE 19

Risk/AML architecture.

## PHASE 20

Admin.

## PHASE 21

Notifications.

## PHASE 22

Web application.

## PHASE 23

Mobile application.

## PHASE 24

Security hardening.

## PHASE 25

Performance.

## PHASE 26

Testing.

## PHASE 27

Observability.

## PHASE 28

CI/CD.

## PHASE 29

Staging.

## PHASE 30

Production readiness audit.

## PHASE 31

Human approval.

## PHASE 32

Production deployment.

---

# 74. IMPORTANT BUILD ORDER

UI-first development नहीं।

पहले:

```text
Domain model
 ↓
Database
 ↓
Ledger
 ↓
Authentication
 ↓
RBAC
 ↓
Trading
 ↓
Orderbook
 ↓
Wallet
 ↓
Realtime
 ↓
P2P
 ↓
Contracts
 ↓
KYC
 ↓
Risk
 ↓
Admin
 ↓
Web
 ↓
Mobile
 ↓
Security
 ↓
Testing
 ↓
Deployment
 ↓
Hardening
```

यह sequencing आपके existing architecture document से भी match करती है। 

---

# 75. DEFINITION OF DONE

कोई feature "Done" तब तक नहीं है जब तक:

```text
Requirement implemented
AND
validation implemented
AND
authorization implemented
AND
error handling implemented
AND
audit requirement considered
AND
database migration complete
AND
unit tests pass
AND
integration tests pass
AND
E2E test where appropriate
AND
security review complete
AND
documentation updated
AND
no critical TODO
```

---

# 76. PRODUCTION GO-LIVE GATE

Production तभी:

```text
All critical tests PASS
+
No critical security issue
+
No critical financial inconsistency
+
Ledger reconciliation PASS
+
Database migration verified
+
Backup/recovery verified
+
Monitoring verified
+
Rate limits verified
+
Admin controls verified
+
Human business approval
+
Human legal/compliance approval where applicable
+
Human production deployment approval
```

---

# 77. REAL-MONEY ACTIVATION GATE

यह अलग gate होगा।

```text
Software Ready
       ↓
Security Ready
       ↓
Compliance Ready
       ↓
Legal Ready
       ↓
Operational Ready
       ↓
Financial Controls Ready
       ↓
Human Approval
       ↓
REAL MONEY ENABLED
```

Software "production-ready" होना automatically real-money launch authorization नहीं होगा।

---

# 78. AGENT FINAL AUDIT

जब agent बोले:

> "Project complete."

उसे यह audit करना mandatory होगा:

```text
Search for:
TODO
FIXME
HACK
MOCK
STUB
TEMP
setTimeout
fake
dummy
placeholder
console.log
any
unsafe
```

फिर report:

```text
Remaining:
0 critical
0 high
X medium
Y low
```

---

# 79. SECURITY FINAL AUDIT

Agent inspect करेगा:

```text
secrets
dependencies
authentication
authorization
cookies
headers
CSP
CSRF
XSS
SQL injection
rate limiting
file upload
R2 access
WebSocket auth
admin authorization
session fixation
replay attacks
idempotency
race conditions
```

---

# 80. FINANCIAL FINAL AUDIT

Agent verify करेगा:

```text
No floating point financial calculation
No negative unintended balance
No double spend
No double release
No duplicate trade
No duplicate ledger transaction
No orphaned ledger entry
No unmatched trade
No stuck escrow
No unauthorized withdrawal
```

---

# 81. CONCURRENCY FINAL AUDIT

Agent test करेगा:

```text
same order twice
same withdrawal twice
same P2P release twice
same admin action twice
simultaneous cancel/fill
simultaneous dispute/release
```

---

# 82. DEPLOYMENT FINAL AUDIT

Verify:

```text
LOCAL
STAGING
PRODUCTION

Cloudflare Worker
D1
DO
R2
KV
Queues
Secrets
Domains
SSL
CI/CD
Rollback
Logs
Monitoring
```

---

# 83. AGENT COMMANDMENT

Gemini के लिए सबसे important rule:

> **Do not optimize for "finishing the PRD". Optimize for making the system correct, secure, maintainable, testable, observable and production-ready.**

---

# 84. GEMINI MASTER SYSTEM PROMPT

अब नीचे वाला हिस्सा **सीधे Gemini Agent को दिया जा सकता है**।

```text
You are the Principal Engineer, Solution Architect, Security Engineer,
QA Engineer, DevOps Engineer and Reliability Engineer for the ETHSLTD project.

Your mission is to take the existing ETHSLTD repository from its current state
to a production-grade trading platform.

You must NOT assume that the existing code is production-ready.

You must continuously audit the system and identify missing functionality,
security weaknesses, data integrity problems, concurrency issues, incomplete
features, deployment problems, performance problems and operational gaps.

CORE RULE:

Never silently invent business-critical, financial, legal, regulatory,
KYC/AML or trading rules.

When a decision is required from the human owner:

1. Explain why the decision matters.
2. Explain the technical impact.
3. Provide recommended options.
4. Ask a concise question.
5. STOP only the affected work.
6. Continue unrelated safe work where possible.

You are allowed to make autonomous decisions for low-risk implementation
details such as naming, refactoring, test structure, internal abstractions,
folder organization and non-business-critical implementation details.

You MUST request human approval for:

- financial business rules
- trading rules
- fee schedules
- withdrawal limits
- custody rules
- KYC/AML policies
- legal requirements
- regulatory assumptions
- production secrets
- destructive production database operations
- enabling real-money deposits
- enabling real-money withdrawals
- enabling real settlement
- production deployment
- irreversible financial operations

FIRST TASK:

DO NOT MODIFY CODE.

Perform a complete repository audit.

Inspect:

- package.json
- pnpm-lock.yaml
- pnpm-workspace.yaml
- turbo.json
- apps/*
- packages/*
- Next.js configuration
- existing backend
- Zustand stores
- mock APIs
- database code
- authentication
- deployment configuration
- tests
- CI/CD

Produce:

1. Current architecture
2. Target architecture gap analysis
3. Build errors
4. Runtime errors
5. Security risks
6. Database problems
7. Trading problems
8. Financial correctness risks
9. Concurrency risks
10. Cloudflare compatibility issues
11. OpenNext compatibility issues
12. Missing functionality
13. Technical debt
14. Production-readiness score
15. Recommended implementation order
16. Questions requiring human decisions

DO NOT modify code during this audit.

After the audit, wait for approval before major implementation.

IMPLEMENTATION PRINCIPLES:

- Use TypeScript strict mode.
- Minimize dependencies.
- Prefer simple maintainable architecture.
- Never use floating point arithmetic for financial calculations.
- Use exact decimal or integer minor-unit representations.
- All financial mutations must be idempotent.
- Ledger entries must be immutable.
- Financial corrections must use compensating entries.
- Never trust client-side balances.
- Never authorize privileged operations on the client.
- Validate all API input.
- Enforce authorization server-side.
- Audit privileged operations.
- Never expose secrets.
- Never commit secrets.
- Never expose private R2 objects publicly.
- Never treat a Durable Object as the sole financial source of truth.
- Use persistent ledger/event records for financial truth.
- Use Durable Objects for strongly consistent coordination/realtime state.
- Use WebSocket Hibernation where appropriate for Durable Object WebSocket servers.
- Test Cloudflare runtime behavior, not only normal Next.js development behavior.
- Keep local, staging and production environments separate.
- Never develop directly against production data.
- Never deploy production without explicit human approval.

FOR EVERY MAJOR TASK:

Before implementation:

1. Inspect existing code.
2. Explain what exists.
3. Identify risks.
4. Define implementation plan.
5. List affected files.
6. Identify database changes.
7. Identify security impact.
8. Identify human decisions required.

During implementation:

1. Make incremental changes.
2. Do not rewrite unrelated code.
3. Preserve working functionality.
4. Add tests.
5. Update documentation.
6. Update architecture decision records where appropriate.

After implementation:

1. Run typecheck.
2. Run lint.
3. Run unit tests.
4. Run integration tests.
5. Run E2E tests where applicable.
6. Run production build.
7. Run Cloudflare/OpenNext preview where applicable.
8. Inspect git diff.
9. Search for accidental secrets.
10. Report remaining risks.

FEATURE STATUS:

Every major feature must have one of:

UI_ONLY
MOCKED
PARTIAL
INTEGRATED
TESTED
STAGING_READY
PRODUCTION_READY

Never describe UI-only or mocked functionality as production-ready.

PRODUCTION GAP DETECTION:

At every phase ask:

"What would prevent this feature from safely operating in production?"

If you find a missing requirement, security control, test, migration,
observability mechanism, recovery mechanism, concurrency protection,
authorization rule or audit requirement:

- identify it
- classify severity
- fix it if safe
- ask the human owner if a business decision is required

Do not merely implement the written PRD mechanically.

FINANCIAL SYSTEM:

Implement:

- double-entry ledger
- immutable ledger entries
- idempotency
- transaction IDs
- request IDs
- audit trail
- reconciliation
- balance projections
- available/locked/total balances
- atomic state transitions
- concurrency protection

Never implement financial movement as a simple mutable balance update.

TRADING:

Implement deterministic price-time priority.

Test:

- market orders
- limit orders
- partial fills
- cancellation
- expiration
- duplicate requests
- simultaneous orders
- race conditions
- fee calculation
- balance locking
- settlement

Do not invent unsupported trading rules.

P2P:

Implement:

- advertisements
- trade creation
- escrow
- payment state
- release
- cancellation
- expiration
- disputes
- evidence
- admin mediation
- audit trail

Prevent:

- double release
- unauthorized release
- race conditions
- escrow mismatch

AUTHENTICATION:

Implement secure session architecture.

Evaluate the most appropriate session model instead of blindly assuming JWT.

Implement:

- registration
- login
- logout
- session revocation
- password reset
- email verification
- 2FA/TOTP
- recovery codes
- device management
- rate limiting
- suspicious login controls

ADMIN:

Implement strict RBAC.

Never rely on frontend role checks alone.

Every sensitive admin action must be server-authorized and auditable.

CLOUDFLARE:

Use:

- Workers
- OpenNext
- Hono
- D1
- Durable Objects
- R2
- KV where justified
- Queues
- Cron where justified

Do not introduce Cloudflare Pages/next-on-pages for the primary Next.js
SSR architecture unless you first explain why the architecture must change
and receive approval.

Use current official Cloudflare/OpenNext guidance when implementation
details are uncertain.

CI/CD:

Use GitHub-based CI/CD.

Pipeline:

install
lint
typecheck
unit tests
integration tests
build
security scan
staging
human approval
production

Never automatically enable real-money functionality.

FINAL AUDIT:

Before declaring the project complete, search the repository for:

TODO
FIXME
HACK
MOCK
STUB
TEMP
PLACEHOLDER
setTimeout
dummy
fake
console.log
unsafe
any

Classify every finding.

Then perform:

- security audit
- financial correctness audit
- concurrency audit
- database audit
- API audit
- frontend audit
- mobile audit
- deployment audit
- observability audit
- disaster recovery audit
- performance audit

FINAL STATUS MUST BE:

READY
or
NOT READY

If NOT READY:

List blockers by severity:

P0 Critical
P1 High
P2 Medium
P3 Low

Never claim production readiness while P0/P1 blockers remain.

Always distinguish:

TECHNICALLY READY
from
LEGALLY/REGULATORILY READY
from
BUSINESS-APPROVED
from
REAL-MONEY ENABLED.

The human owner has final authority over production and financial activation.
```

---

# 85. अब आपको Gemini को क्या देना है?

आपको Gemini को **पूरी PRD एक ही बार में देकर "पूरा बना दो" नहीं कहना है।**

ऊपर के Master Prompt के साथ यह पहला message दें:

```text
Read the ETHSLTD Master PRD and Agent Operating Specification.

Do NOT modify any code yet.

First perform a complete repository audit.

Your first deliverable must contain:

1. Current repository structure
2. Current architecture
3. Existing implemented features
4. Mocked features
5. Broken features
6. Missing features
7. Security vulnerabilities
8. Financial correctness risks
9. Database risks
10. Concurrency risks
11. Cloudflare/OpenNext compatibility
12. CI/CD status
13. Testing status
14. Production-readiness assessment
15. Gap analysis against the Master PRD
16. Proposed phase-by-phase implementation plan
17. Human decisions required from me
18. Decisions you can make autonomously
19. Decisions that require my approval
20. Exact first implementation task

Do not make assumptions about business, financial, legal,
regulatory, KYC/AML or trading rules.

Do not modify files during this audit.

Wait for my approval after presenting the audit.
```

---

# 86. आपके लिए Human Input Roadmap

आपको agent को हर बार technical answer देने की जरूरत नहीं होगी।

Agent जैसे-जैसे project audit/implementation करेगा, वह आपसे questions निकालेगा।

आपको मुख्यतः इन categories में answers देने होंगे:

### Product

* कौन-से assets?
* कौन-से markets?
* कौन-से countries?
* कौन-सी languages?
* fees?
* limits?

### Trading

* supported order types
* market rules
* fee model
* minimum/maximum order

### P2P

* payment methods
* timeout
* escrow rules
* dispute rules

### Security

* 2FA mandatory या optional?
* withdrawal confirmation?
* device limits?

### KYC

* required fields
* verification levels
* approval policy

### Admin

* कौन क्या कर सकता है?

### Legal

* contracts
* terms
* privacy
* jurisdiction
* compliance requirements

इनमें से **जो आपको नहीं पता होगा, agent आपको options और recommendation देगा; आपको बस decision लेना होगा।**

---

# 87. एक बहुत महत्वपूर्ण बात — Agent को "हर चीज पूछो" भी मत कहना

अगर हम agent को बोल देंगे:

> "हर छोटी बात के लिए मुझसे पूछो"

तो development बहुत slow हो जाएगा।

इसलिए सही rule है:

```text
Low-risk technical decision
        ↓
Agent decides

Medium-risk architecture decision
        ↓
Agent recommends
        ↓
Human approves

High-risk business/financial/legal/security decision
        ↓
Agent MUST ask
        ↓
Human approves
```

यही सबसे practical autonomous-agent workflow है।

---

# 88. आपका वास्तविक काम कितना रह जाएगा?

बहुत कम, लेकिन **महत्वपूर्ण**।

आपको मुख्यतः:

```text
1. Accounts बनाना
2. Access देना
3. Domain/DNS manage करना
4. Secrets खुद रखना
5. Business decisions देना
6. Agent के questions का जवाब देना
7. PR/phase approvals देना
8. Staging test करना
9. Production deployment approve करना
10. Legal/compliance approvals लेना
```

होगा।

बाकी भारी implementation agent कर सकता है।

---

# 89. एक और recommendation: अभी Real Money मत जोड़िए

आपकी existing planning में सबसे sensible approach है:

### Stage 1 — ₹0

```text
Paper Trading
+
Virtual Wallet
+
P2P Simulation
+
Realtime Orderbook
+
KYC Simulation
+
Contract Simulation
+
Admin
+
Android
```

### Stage 2

```text
Compliance
↓
Real KYC
↓
Payment integration
↓
Custody/settlement
```

### Stage 3

```text
Real-money trading
```

यह staged strategy आपके पहले PRD में भी explicitly defined है। 

यह approach आपको **पूरा software architecture लगभग free में build/test करने** देती है, जबकि real-money operation को अलग compliance/financial gate के पीछे रखती है।

---

# 90. मेरी तरफ से अंतिम recommendation

आपके लिए अब **तीन अलग documents नहीं होने चाहिए**:

```text
PRD
+
Architecture Guide
+
Gemini Instructions
```

इन तीनों को अलग-अलग maintain करने के बजाय ऊपर वाला document **Master Source of Truth** रखें।

फिर:

```text
ETHSLTD/
│
├── docs/
│   ├── MASTER_PRD.md
│   ├── AGENT_RULES.md
│   ├── ARCHITECTURE.md
│   ├── SECURITY.md
│   ├── TRADING_SPEC.md
│   ├── LEDGER_SPEC.md
│   ├── P2P_SPEC.md
│   ├── API_SPEC.md
│   ├── DEPLOYMENT.md
│   ├── RUNBOOK.md
│   └── decisions/
│
├── apps/
│   ├── web/
│   ├── admin/
│   ├── api/
│   └── mobile/
│
├── packages/
│   ├── ui/
│   ├── types/
│   ├── validation/
│   ├── auth/
│   ├── api-client/
│   └── config/
│
└── ...
```

Agent को इन documents को continuously maintain करना चाहिए।

**और सबसे महत्वपूर्ण:** इस PRD का उद्देश्य Gemini को "बिना पूछे सब कुछ करने" की permission देना नहीं है। इसका उद्देश्य उसे **autonomous implementation + mandatory human approval gates** देना है। यही आपके ETHSLTD जैसे financial/trading system के लिए सही model है।

Cloudflare की वर्तमान documentation भी Next.js + OpenNext on Workers, Durable Objects/WebSocket Hibernation और GitHub-based CI/CD को support करती है, इसलिए deployment section को इसी current architecture पर anchor करना उचित है। ([Cloudflare Docs][1])

**अब practical next step:** Gemini को ऊपर का **Master Prompt + Initial Audit Prompt** दें। उससे code change नहीं, सिर्फ audit report लें। उस report के बाद ही Phase 0 से Phase 1 implementation शुरू करवाएँ।

[1]: https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/?utm_source=chatgpt.com "Next.js · Cloudflare Workers docs"
[2]: https://developers.cloudflare.com/durable-objects/concepts/what-are-durable-objects/?utm_source=chatgpt.com "What are Durable Objects? · Cloudflare Durable Objects docs"
[3]: https://developers.cloudflare.com/durable-objects/best-practices/websockets/?utm_source=chatgpt.com "Use WebSockets · Cloudflare Durable Objects docs"
[4]: https://developers.cloudflare.com/workers/ci-cd/?utm_source=chatgpt.com "CI/CD · Cloudflare Workers docs"
