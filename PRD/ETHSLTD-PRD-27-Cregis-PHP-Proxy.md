# PRD: Cregis PHP Outbound Gateway (Static IP Resolution)

## 1. Problem Statement
Cloudflare Workers execute on a global edge network, meaning outbound API requests originate from thousands of dynamic, rotating IP addresses. Cregis Payment Engine strictly requires a Static IP Whitelist for security. Cloudflare Workers do not provide dedicated outbound static IPs, resulting in a persistent `403 Forbidden` WAF block from Cregis.

## 2. Proposed Solution Architecture
To bridge the gap between Cloudflare's dynamic egress and Cregis's static ingress requirement, we will deploy a lightweight PHP proxy on a Premium Shared Web Hosting environment. 

This shared hosting environment possesses a stable public IPv4 address (`145.79.58.207`).

### 2.1 The Request Flow
1. **Frontend (User):** Requests a crypto deposit.
2. **Backend (Cloudflare Worker):** Receives the request, validates the user, and constructs the base order payload (amount, currency).
3. **Internal Hop:** Cloudflare Worker sends the payload to `https://<shared-hosting-domain>/cregis-proxy.php` instead of calling Cregis directly.
4. **Proxy (Shared Hosting):** The PHP script receives the payload, verifies a pre-shared internal secret to prevent unauthorized access, appends the `timestamp`, `nonce`, and calculates the MD5 `sign` using the strictly isolated Cregis API keys.
5. **Cregis:** The PHP script uses cURL to send the signed payload to Cregis. Cregis sees the request coming from `145.79.58.207` (whitelisted) and accepts it.
6. **Return:** The checkout URL is passed back up the chain to the user.

## 3. Security Considerations
- **Isolated Keys:** Cloudflare Workers will NO LONGER hold the Cregis API keys. If the Worker environment variables are compromised, the attacker cannot generate valid Cregis signatures.
- **Proxy Authentication:** The PHP Proxy will be locked behind a custom `X-Proxy-Secret` header. 
- **Cregis Webhooks:** Incoming webhooks from Cregis to our system do not suffer from the outbound IP issue. They will continue to hit our Cloudflare API directly. We will enforce a strict WAF rule `(ip.src eq 18.143.53.174 and http.request.uri.path eq "/api/cregis/webhook")` on Cloudflare.

## 4. Implementation Steps
1. Create `services/cregis-proxy/index.php` in the monorepo for version control.
2. Modify `services/api/src/services/cregis.ts` to route requests to `process.env.CREGIS_PROXY_URL`.
3. The Admin/Devops will manually upload `index.php` to the shared hosting provider and configure the internal variables (`$CREGIS_PE_API_KEY`, `$PROXY_SECRET`).
