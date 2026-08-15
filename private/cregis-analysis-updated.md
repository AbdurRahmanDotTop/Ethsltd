# Cregis Auto Deposit Analysis & Resolution Guide

## Executive Summary

### Current failure

The current Cregis Payment Engine Auto Deposit flow is failing with **HTTP 403 Forbidden** when the backend calls Cregis:

`POST /api/v1/payment/create`

The available evidence strongly points to **Cregis-side IP allowlisting**, not a frontend redirect problem.

Cregis's current Payment Engine documentation explicitly recommends maintaining an IP allowlist so that only trusted server public IPs can call the API. citeturn2search1

The important architectural fact is:

> **Cloudflare Workers Free does not give this application a dedicated/static outbound IPv4 address that can simply be entered into Cregis's IP allowlist.**

Therefore, repeatedly changing Cloudflare WAF rules, whitelisting Cloudflare's public IP ranges, or using `0.0.0.0` will not solve the Cregis outbound API restriction.

---

# 1. Root Cause

## 1.1 `0.0.0.0` must not be treated as a wildcard

The current analysis correctly identifies that `0.0.0.0` is not an internet-wide wildcard for Cregis's IP allowlist.

If Cregis expects a source IP and the configured value is `0.0.0.0`, the request from the real backend source IP will not match that entry.

**Action:**

- Remove `0.0.0.0` from the Cregis IP allowlist.
- Never use `0.0.0.0` as a production "allow everyone" value.
- Do not expose the Cregis API key to the browser as a workaround.

---

# 2. Important Correction to the Previous Analysis

The previous version suggested **Replit Free** as a possible static-IP proxy.

That recommendation should be removed.

Current Replit pricing/documentation shows **Static outbound IPs are an Enterprise feature**, so Replit Free should **not** be treated as a reliable free static-egress solution for Cregis. citeturn0search9

Therefore:

> **Do NOT build the production Cregis gateway around a Replit Free instance.**

A free platform having a public URL does not mean that it gives the application a permanent outbound IP.

---

# 3. What Cregis Actually Requires

Cregis Payment Engine authentication uses:

- `pid`
- `nonce`
- `timestamp`
- `sign`
- Project API Key

The API signature is calculated server-side, and Cregis recommends keeping the API key only on the server. Cregis also explicitly recommends an IP allowlist for trusted server public IPs. citeturn2search1

Therefore the correct architecture is:

```text
Browser
   |
   v
Cloudflare Worker
   |
   |  authenticated internal request
   v
Cregis Gateway with known outbound IP
   |
   |  HTTPS + Cregis signature
   v
Cregis Payment Engine
```

The browser must **never** call Cregis directly with the API key.

---

# 4. Best Completely-Free / No-New-Credit-Card Solution

## OPTION A — Use Existing Shared Hosting as the Cregis Egress Gateway

### Recommended first choice

Because this project already has shared hosting, this is the first solution that should be tested.

The shared hosting server already has an internet-facing server environment and normally provides PHP + cURL/HTTPS.

The architecture becomes:

```text
User Browser
     |
     v
Cloudflare / Next.js / Worker
     |
     | HTTPS
     v
Existing Shared Hosting
     |
     | PHP cURL
     | Source IP = Shared Hosting's outbound public IP
     v
Cregis Payment Engine
```

### Why this can solve the problem

Cregis sees the **shared hosting server's outbound public IP**, rather than a Cloudflare Worker edge IP.

If the hosting provider gives a stable outbound public IPv4 address, that IP can be added to the Cregis Payment Engine allowlist.

### Additional cost

**$0 additional cost** if the shared hosting is already available.

No new VPS is required.

No new credit card is required.

### Step-by-step test

Create a temporary PHP endpoint on the existing hosting:

```php
<?php

header('Content-Type: text/plain');

echo file_get_contents('https://api.ipify.org');
```

Open the endpoint once and record the returned IP.

Then verify it independently if possible:

```text
https://api.ipify.org
```

from the hosting server, not from your personal computer.

### Important

The IP shown by:

```text
Google: "What is my IP"
```

is **your personal/office internet IP**.

It is NOT necessarily the IP that Cregis will see when your PHP server calls Cregis.

The IP must be obtained **from the server that actually performs the outbound Cregis request**.

### Then

1. Obtain the shared hosting outbound public IP.
2. Add that exact IP to Cregis Payment Engine IP allowlist.
3. Deploy a minimal Cregis gateway on the shared host.
4. Move Cregis server-to-server API calls from the Worker to that gateway.
5. Keep the Cregis API key only on the shared hosting server.
6. Keep the frontend and normal application APIs on Cloudflare Workers.

### Important hosting-provider test

Before using this in production, confirm that the hosting provider's outbound IP is stable.

Ask hosting support:

> "What public IPv4 address is used for outbound HTTPS connections from my PHP/cURL application, and is that outbound IP dedicated/stable or shared/changeable?"

If they say it can change, treat the solution as **operationally free but not guaranteed permanently stable**.

---

# 5. OPTION B — Existing Home/Office Computer + Cloudflare Tunnel

This is another **$0 / no-credit-card** architecture if the existing computer can remain online.

Architecture:

```text
Cloudflare Worker
      |
      | HTTPS
      v
Cloudflare Tunnel
      |
      v
Home/Office Computer
      |
      | HTTPS/cURL
      v
Cregis
```

The important difference from a normal reverse proxy is:

> The final outbound connection to Cregis is made by the home/office computer.

Therefore Cregis sees the home's public IP.

Cloudflare Tunnel avoids exposing the local server through a normal inbound port-forwarding setup.

### Advantages

- No VPS.
- No paid static IP.
- No new credit card.
- Can use existing computer.
- Cloudflare Tunnel itself can be used without requiring a paid static-IP product.

### Disadvantages

- Computer must remain online.
- Internet connection must remain available.
- ISP public IP can change.
- If the IP changes, Cregis allowlist must be updated.
- This is not ideal for a serious financial production environment.

### Production assessment

**Good for development/testing.**

**Possible for a very small controlled deployment.**

**Not the preferred long-term production architecture for a crypto payment system.**

---

# 6. OPTION C — Existing Hosting + Cloudflare Worker Hybrid

This is the architecture I recommend for the current project if the shared hosting passes the outbound-IP test.

## Main application

Continue using:

```text
Cloudflare Workers
Cloudflare D1
Cloudflare R2
Cloudflare KV
Cloudflare Durable Objects
```

Cloudflare Workers Free is still suitable for the application/API layer within its free limits. Cloudflare currently documents a Workers Free plan and says Cloudflare can be used to start for free without a credit card. citeturn0search0turn0search13

## Cregis-only gateway

Use existing shared hosting:

```text
/shared-hosting/
    cregis/
        create-payment.php
        query-payment.php
        webhook.php
        health.php
```

The Worker communicates with the gateway using a strong internal authentication mechanism.

### Example flow

```text
POST /api/deposit/create
        |
        v
Cloudflare Worker
        |
        | authenticated request
        v
https://your-existing-hosting-domain/cregis/create-payment.php
        |
        | Cregis API signature
        | shared-host outbound IP
        v
Cregis
```

The user never sees the Cregis API credentials.

---

# 7. Auto Deposit Must Be Implemented as a Real Payment Order

Do not generate a fake:

```text
https://pay.cregis.io/?cid=<random-id>
```

The `cid` must come from a successful Cregis order-creation response.

Cregis's current documentation confirms that Payment Engine is intended for crypto payment/order collection, while WaaS is used for project-level wallet/deposit/payout operations. citeturn2search0

The correct sequence is:

```text
User clicks Deposit
        |
        v
Application creates internal deposit record
        |
        v
Gateway creates REAL Cregis Payment Engine order
        |
        v
Cregis returns real order/cid/payment data
        |
        v
Application stores Cregis order identifiers
        |
        v
User is redirected to the REAL Cregis checkout/payment URL
        |
        v
User pays
        |
        v
Cregis sends webhook
        |
        v
Application verifies Cregis signature
        |
        v
Application validates order/user/amount/currency
        |
        v
Ledger credits user
```

---

# 8. Cregis Webhook Is a Separate Direction

This distinction is extremely important.

There are two different network directions:

## Direction A — Your server → Cregis

```text
Your backend
     |
     v
Cregis API
```

This is where the **Cregis IP allowlist** can block your request.

For this direction, the source IP must be an IP accepted by Cregis.

## Direction B — Cregis → Your webhook

```text
Cregis
   |
   v
Your webhook
```

This is where your Cloudflare WAF configuration matters.

Do not confuse the two.

---

# 9. Cloudflare WAF Is Not the Solution to the Outbound 403

A Cloudflare WAF rule controls traffic **coming to your Cloudflare-proxied application**.

It does not change the source IP used when a Cloudflare Worker makes an outbound HTTPS request to Cregis.

Therefore:

```text
Cloudflare WAF
```

cannot make:

```text
Worker -> Cregis
```

appear to Cregis as a whitelisted static IP.

Cloudflare documents its public IP ranges as the IP space used for proxied traffic and separately documents dedicated egress IPs as an Enterprise feature. citeturn0search2turn0search11

---

# 10. Do NOT Whitelist All Cloudflare IP Ranges in Cregis

Cloudflare has many public IP ranges.

For example, Cloudflare publishes ranges including:

```text
103.21.244.0/22
104.16.0.0/13
162.158.0.0/15
172.64.0.0/13
...
```

However, these are Cloudflare network ranges and should not be assumed to be the exact source IP(s) used by this Worker request. citeturn0search5

Even if a provider allowed CIDR ranges, blindly adding Cloudflare's entire IP space would be a poor security design.

---

# 11. Cloudflare Dedicated Egress Is Not a Free Solution

Cloudflare documents dedicated egress IPs for third-party allowlisting, but this is an Enterprise Zero Trust add-on. citeturn0search11

Likewise, Cloudflare's static IP offering is an Enterprise add-on. citeturn0search4

Therefore:

```text
Cloudflare Free
        +
Dedicated static egress IP
```

is **not** a valid $0 solution.

Do not redesign the application around this unless the budget constraint changes.

---

# 12. Free VPS / Free Cloud Server Assessment

A "free VPS" should not automatically be considered a valid solution.

The requirements are:

1. No credit card.
2. Permanent free usage.
3. Stable outbound public IP.
4. HTTPS.
5. Reliable uptime.
6. No unexpected billing.
7. Suitable for a crypto payment gateway.
8. No forced sleep.
9. No arbitrary IP changes.

Finding a provider satisfying **all** of these simultaneously is unreliable.

Therefore this project should **not depend on an unknown free VPS provider** just to solve the Cregis allowlist problem.

The existing shared hosting is a better first test because it is already part of the project's infrastructure.

---

# 13. Free Proxy Services Are NOT Recommended

Do not use random public proxy APIs or free proxy services for Cregis.

Reasons:

- IP can change.
- Traffic may be shared.
- Reliability is poor.
- API credentials could be exposed.
- Request bodies may be logged.
- TLS/security assumptions become unclear.
- Financial API traffic should not depend on an unknown third party.
- Cregis may block the proxy anyway.

A payment gateway should never depend on a random public proxy.

---

# 14. Browser-Side Cregis API Calls Are NOT a Workaround

Do not change the architecture to:

```text
Browser -> Cregis
```

to bypass the server IP restriction.

This would expose:

- API key
- Project ID
- signing capability
- payment creation logic

to the client.

Cregis explicitly says the API key should be kept on the server and not put into frontend code or mobile apps. citeturn2search1

The Cregis call must remain server-side.

---

# 15. Webhook Implementation Requirements

Cregis documents an order-payment callback mechanism.

Cregis sends webhook notifications for events including:

- `paid`
- `paid_partial`
- `paid_over`
- `expired`
- `refunded`
- `paid_remain`

The callback handler must return HTTP 200 with the exact plain-text response:

```text
success
```

Cregis also documents retrying failed callbacks from the Cregis portal. citeturn2search2

### Required webhook flow

```text
Receive webhook
      |
      v
Parse JSON
      |
      v
Verify Cregis signature
      |
      v
Check timestamp/replay protection
      |
      v
Find internal deposit by merchant order ID
      |
      v
Check idempotency
      |
      v
Validate expected currency
      |
      v
Validate expected amount
      |
      v
Validate Cregis order ID
      |
      v
Validate status
      |
      v
Create immutable ledger entry
      |
      v
Update deposit status
      |
      v
Return "success"
```

Never credit a user merely because a webhook says `paid`.

The webhook must be cryptographically verified and matched to the application's internal order.

---

# 16. Signature Verification Is Mandatory

Cregis documents its Payment Engine signature algorithm:

1. Remove `sign`.
2. Remove empty values.
3. Sort parameters lexicographically.
4. Concatenate `key + value`.
5. Prefix the API key.
6. MD5 hash.
7. Convert to lowercase.

This must be implemented exactly as documented. citeturn2search1

The same principle must be applied to incoming callbacks.

Never trust:

```text
status = paid
```

until the callback signature is verified.

---

# 17. Idempotency Is Mandatory

The application must be able to receive the same callback more than once without crediting the user twice.

Use a unique database key based on the appropriate Cregis/order/transaction identifiers.

For example:

```text
provider = CREGIS
cregis_order_id
event_type
tx_id
```

Then:

```text
first callback
    -> process
    -> credit ledger
    -> mark processed

duplicate callback
    -> detect existing record
    -> do not credit again
    -> return success
```

Cregis's current webhook documentation and quickstart both emphasize idempotent callback handling. citeturn2search2turn2search3

---

# 18. Internal Ledger Must Remain the Source of Truth

Do not directly change:

```text
users.balance
```

when a Cregis payment arrives.

Instead:

```text
Cregis webhook
      |
      v
Deposit transaction
      |
      v
Immutable ledger entry
      |
      v
Available balance
```

At minimum store:

```text
deposit_id
user_id
internal_order_id
cregis_order_id
merchant_order_id
currency
expected_amount
received_amount
payment_address
tx_id
event_type
status
created_at
paid_at
raw_callback_hash
```

Sensitive raw callback data should be stored carefully and only as needed for audit/reconciliation.

---

# 19. Recommended Final Architecture

## If existing shared hosting supports PHP outbound HTTPS

Use:

```text
                 ┌─────────────────────┐
                 │      Browser        │
                 └──────────┬──────────┘
                            │
                            v
                 ┌─────────────────────┐
                 │ Cloudflare Worker   │
                 │ Main API / App      │
                 └──────────┬──────────┘
                            │
                            │ authenticated
                            v
                 ┌─────────────────────┐
                 │ Existing Shared     │
                 │ Hosting             │
                 │ PHP Cregis Gateway  │
                 └──────────┬──────────┘
                            │
                            │ stable outbound IP
                            v
                 ┌─────────────────────┐
                 │ Cregis Payment      │
                 │ Engine              │
                 └──────────┬──────────┘
                            │
                            │ webhook
                            v
                 ┌─────────────────────┐
                 │ Cloudflare Worker   │
                 │ /api/cregis/webhook │
                 └─────────────────────┘
```

This is the best candidate for the project's:

- $0 additional cost
- no new credit card
- existing infrastructure
- server-side API key
- Cregis IP allowlist
- Cloudflare-based application

---

# 20. Gateway Security

The shared-hosting Cregis gateway must NOT be an open proxy.

Bad:

```text
POST /proxy?url=https://anything.com
```

Good:

```text
POST /cregis/create-payment
POST /cregis/query-payment
```

The gateway must:

- Accept only the required Cregis operations.
- Authenticate the Worker.
- Validate request schema.
- Never accept arbitrary destination URLs.
- Keep Cregis API key server-side.
- Never return the Cregis API key.
- Log request IDs, not secrets.
- Use HTTPS.
- Rate-limit requests where possible.
- Validate amount/currency/order fields.
- Reject malformed requests.
- Verify Cregis responses before passing them upstream.

---

# 21. Worker-to-Gateway Authentication

Do not rely only on a hidden URL.

Use an application-level secret:

```text
WORKER_GATEWAY_SECRET
```

The Worker sends:

```http
Authorization: Bearer <gateway-secret>
```

The PHP gateway validates the secret.

For stronger security, use HMAC request signing:

```text
timestamp
nonce
request_body_hash
signature
```

The gateway verifies the signature before making a Cregis request.

This prevents an attacker who discovers the gateway URL from freely creating payment orders.

---

# 22. Auto Deposit Database State Machine

Recommended internal state:

```text
CREATED
   |
   v
CREGIS_CREATE_REQUESTED
   |
   v
CREGIS_CREATED
   |
   v
AWAITING_PAYMENT
   |
   +------> EXPIRED
   |
   +------> PAID_PARTIAL
   |
   +------> PAID
   |
   +------> PAID_OVER
   |
   +------> REFUNDED
```

Do not use the browser redirect as proof of payment.

Only a verified Cregis event and/or authoritative Cregis status should cause the financial state transition.

---

# 23. Testing Procedure

## Phase 1 — Find actual gateway outbound IP

On shared hosting:

```text
PHP cURL -> https://api.ipify.org
```

Record the IP.

## Phase 2 — Whitelist it in Cregis

Remove:

```text
0.0.0.0
```

Add:

```text
<actual-shared-hosting-outbound-ip>
```

## Phase 3 — Test a minimal Cregis API call

Do not involve the frontend yet.

Call Cregis directly from the PHP gateway.

Record:

```text
HTTP status
Cregis code
Cregis message
request ID
timestamp
```

## Phase 4 — Test payment creation

Create one real test payment order.

Verify that Cregis returns the actual order/cid/payment information.

## Phase 5 — Test checkout

Redirect the browser only to the actual Cregis checkout/payment URL returned by Cregis.

Never manufacture the URL.

## Phase 6 — Test webhook

Complete the payment and confirm:

```text
Cregis
  -> webhook
  -> signature verification
  -> order lookup
  -> idempotency
  -> ledger credit
```

## Phase 7 — Test duplicate webhook

Send/process the same callback twice.

Expected result:

```text
1 financial credit
2 successful webhook responses
```

## Phase 8 — Test partial/over payment

Verify the application does not incorrectly treat:

```text
paid_partial
paid_over
```

as the same state as a normal exact payment.

---

# 24. Diagnostics to Add

Every Cregis request should have an internal correlation ID:

```text
request_id
```

Log:

```text
request_id
internal_order_id
cregis_order_id
endpoint
HTTP status
Cregis code
Cregis message
created_at
duration_ms
```

Never log:

```text
API key
Authorization header
full secrets
private keys
```

This will make future 403/401/5xx troubleshooting much easier.

---

# 25. Decision Matrix

| Solution | New Cost | New Credit Card | Static/Stable Egress | Suitable for Test | Production Recommendation |
|---|---:|---:|---|---|---|
| Existing shared hosting PHP gateway | $0 additional | No | **Potentially yes** | Yes | **Best free candidate** |
| Home/office + Cloudflare Tunnel | $0 additional | No | Public IP can change | Yes | Limited/controlled use |
| Replit Free | $0 | No | **No guaranteed static outbound IP** | Maybe | **Do not use** |
| Cloudflare Workers Free direct | $0 | No | **No dedicated static egress** | Yes | **Blocked by Cregis allowlist requirement** |
| Cloudflare Dedicated Egress | Paid | Usually account/billing setup | Yes | Yes | Reliable, but violates $0 requirement |
| Cloudflare Static IP/BYOIP | Paid/Enterprise | Billing | Yes | Yes | Reliable, but violates $0 requirement |
| Random free proxy | $0 | No | Unreliable | No | **Do not use** |
| Free VPS with unknown policy | Varies | Varies | Varies | Maybe | **Do not depend on it** |

---

# 26. What Should Be Changed in the Project

## Remove

```text
mockCid
fake Cregis checkout URL
0.0.0.0 as a Cregis allowlist value
Replit Free as a static-IP production solution
browser-side Cregis API calls
```

## Add

```text
Cregis Gateway
actual outbound-IP detection
Worker -> Gateway authentication
Cregis server-side signing
Cregis order persistence
Cregis webhook signature verification
idempotency
immutable deposit ledger
Cregis reconciliation
request correlation IDs
```

---

# 27. Most Important Finding

There is **no code-only trick** that can make Cregis accept an arbitrary Cloudflare Worker source IP when Cregis's IP allowlist is enabled.

The solution must change one of these:

### A. Cregis security policy

Ask Cregis to:

- disable the IP allowlist for the project, or
- provide another authentication/allowlisting mechanism compatible with serverless dynamic egress, or
- provide approved Cregis-side guidance for Cloudflare Workers.

This is the cleanest architecture if Cregis permits it.

### B. Outbound network location

Move only the Cregis server-to-server calls to infrastructure with a known allowlisted public IP.

For this project, the first $0/no-new-credit-card candidate is:

> **Existing shared hosting PHP gateway.**

---

# 28. Cregis Support Request

Ask Cregis specifically:

> We are integrating Cregis Payment Engine from a Cloudflare Workers backend. Cregis requires an IP allowlist, but Cloudflare Workers Free does not provide us with a dedicated static outbound IPv4 address. We need to keep the integration server-side and cannot expose our API key to clients.  
>
> Please confirm whether you can:
>
> 1. Disable the IP allowlist for this project, or
> 2. Provide an approved way to allow Cloudflare Workers/serverless traffic, or
> 3. Provide official Cregis IP ranges that should be allowlisted for outbound API requests, or
> 4. Recommend an officially supported gateway architecture for serverless deployments.
>
> We are specifically trying to keep the deployment on a $0/no-new-credit-card architecture during development.

Do not assume Cregis will accept Cloudflare's generic IP ranges. Obtain confirmation from Cregis first.

---

# 29. Final Recommendation

## Recommended order of implementation

### Priority 1 — Test existing shared hosting

```text
Shared Hosting PHP
        |
        v
api.ipify.org
        |
        v
Get outbound IP
        |
        v
Cregis IP Allowlist
        |
        v
Test /api/v1/payment/create
```

If this works:

> **Use the shared hosting as the dedicated Cregis API gateway.**

Keep the main application on Cloudflare Workers.

### Priority 2 — Ask Cregis Support

At the same time, ask Cregis whether they can remove/relax the IP allowlist or support Cloudflare Workers directly.

### Priority 3 — Home/Office + Cloudflare Tunnel

Use this only if the existing shared host cannot make outbound HTTPS requests or its outbound IP cannot be allowlisted.

### Do not use

- Replit Free as a static-IP solution.
- Random proxy services.
- Fake Cregis URLs.
- Browser-side API calls.
- `0.0.0.0` in the Cregis allowlist.
- Cloudflare WAF rules as a solution to the outbound Cregis 403.

---

# 30. Final Conclusion

The original conclusion that **"the only reliable free solution is Cregis Support"** is too restrictive.

There is another practical $0/no-new-credit-card architecture:

> **Keep Cloudflare Workers for the application, but move only Cregis Payment Engine outbound API calls to the project's existing shared hosting server, provided its outbound public IP is allowlistable and its PHP/cURL environment can reach Cregis over HTTPS.**

This does not bypass Cregis security.

Instead, it gives Cregis exactly what its documented security model expects:

```text
Known server
     |
     v
Known public IP
     |
     v
Cregis IP allowlist
     |
     v
Authenticated + signed API request
```

The webhook can remain on the Cloudflare Worker because webhook traffic is the opposite direction:

```text
Cregis
   |
   v
Cloudflare Worker webhook
```

Cregis's current documentation confirms that Payment Engine supports server-side order/payment workflows and callbacks, while its authentication documentation explicitly recommends server-side API-key handling and IP allowlisting. citeturn2search0turn2search1turn2search2

### Current implementation decision

**Primary free architecture:**

```text
Cloudflare Worker
      |
      | authenticated gateway request
      v
Existing Shared Hosting PHP Gateway
      |
      | allowlisted outbound public IP
      v
Cregis Payment Engine
```

**Fallback free architecture:**

```text
Cloudflare Worker
      |
      v
Cloudflare Tunnel
      |
      v
Always-on Home/Office Server
      |
      v
Cregis
```

**Preferred long-term architecture if budget becomes available:**

```text
Application
    |
    v
Dedicated/static-egress backend
    |
    v
Cregis
```

The next concrete step is therefore **not another Cloudflare WAF change**. It is to test the outbound IP of the existing shared hosting and determine whether that IP can be permanently/stably allowlisted by Cregis.
