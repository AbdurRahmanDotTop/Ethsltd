# Configure ETHSLTD Production Domains Using Cloudflare Workers Custom Domains

## 1. Objective

Configure the existing Cloudflare Workers using **Cloudflare Workers Custom Domains only**. **Do NOT use Worker Routes for this task.**

We have two existing Workers:

### Frontend Worker
- Existing URL: `https://ethsltd-web.ethsltd.workers.dev/`
- Worker name: `ethsltd-web`

### API Worker
- Existing URL: `https://api.ethsltd.workers.dev/`
- Worker name: `api.ethsltd`

The required production domain mapping is:
- `https://ethsltd.com/` → `ethsltd-web` Worker
- `https://www.ethsltd.com/` → `ethsltd-web` Worker
- `https://api.ethsltd.com/` → `api.ethsltd` Worker

## 2. Critical Requirements

- Use Cloudflare Workers **Custom Domains**.
- Do **NOT** use Worker Routes. (No `routes: [{ pattern: ... }]` in configuration).
- Do **NOT** create a separate forwarding/proxy/redirect Worker. The Worker must be attached directly to the custom hostname through Cloudflare Custom Domains.
- Preserve existing worker names, existing deployments, bindings (D1, KV, R2, Durable Objects, Service bindings), environment variables, secrets, databases, etc.
- Make NO changes to unrelated application logic (Trading, Matching engine, Wallet, etc.).

## 3. Preparation & Verification Steps

1. **Inspect Existing Configuration**: Locate and review all `wrangler.json`, `wrangler.jsonc`, `wrangler.toml` files to understand current configuration.
2. **Verify Auth & Access**: Run `npx wrangler whoami`. Ensure the Cloudflare account has access to the active Cloudflare zone `ethsltd.com`. (Run `npx wrangler login` if not authenticated).
3. **Verify Wrangler Version & Commands**: Check `npx wrangler --version` and `npx wrangler domains --help` to use the officially supported Custom Domain mechanism for the installed Wrangler version.

## 4. Implementation Details

### 4.1 Custom Domains Configuration
Configure custom domains using the supported mechanism (e.g. `wrangler.toml` or `wrangler.jsonc` custom domains feature) for both workers:
- **Frontend Worker** (`ethsltd-web`): Add `ethsltd.com` and `www.ethsltd.com`.
- **API Worker** (`api.ethsltd`): Add `api.ethsltd.com`.

### 4.2 Code Modifications (Replacing `workers.dev` URLs)
Search the entire project for `api.ethsltd.workers.dev` and `ethsltd-web.ethsltd.workers.dev`.
Replace production references with:
- `https://api.ethsltd.com` (for API)
- `https://ethsltd.com` (for Frontend)

Areas to check carefully:
- API clients, Axios configurations, fetch wrappers, authentication, websocket connections (`wss://api.ethsltd.com`), trading/P2P/expert services/admin panels.
- Payment gateway callbacks (e.g., Cregis, Auto Deposit).
- CORS configuration in the API worker to allow `https://ethsltd.com` and `https://www.ethsltd.com`.
- Authentication cookies (Secure, HttpOnly, SameSite, Domain, Path).
- `.env` files (avoid changing development URLs unnecessarily, use env vars where appropriate).

## 5. Deployment & Testing

1. **Deploy Workers**: Run `npx wrangler deploy` for both `ethsltd-web` and `api.ethsltd`. Do NOT create new workers.
2. **Verify Custom Domains**: Confirm via Cloudflare dashboard or Wrangler that the custom domains are properly attached.
3. **Test Frontend & API**:
   - `curl -I https://ethsltd.com/` and `https://www.ethsltd.com/`
   - `curl -I https://api.ethsltd.com/` (test real existing endpoints)
   - Test in browser, verify HTML/CSS/JS, Network DevTools, Websockets, and Authentication.
4. **DNS & SSL Verification**: Ensure Cloudflare HTTPS certificates are valid without errors. Run `nslookup` for the domains.
5. **Preserve `workers.dev` (Initial Phase)**: Keep `ethsltd-web.ethsltd.workers.dev` and `api.ethsltd.workers.dev` working initially for testing fallback.

## 6. Final Acceptance Checklist

The task is marked complete only when all the following items are verified:
- [ ] `https://ethsltd.com/` works and points to `ethsltd-web`.
- [ ] `https://www.ethsltd.com/` works and points to `ethsltd-web`.
- [ ] `https://api.ethsltd.com/` works and points to `api.ethsltd`.
- [ ] All three domains are Cloudflare Worker Custom Domains.
- [ ] No Worker Route is used or conflicting with these three domains.
- [ ] SSL certificates are valid and DNS is working.
- [ ] Frontend API calls use `https://api.ethsltd.com`.
- [ ] CORS, Login, Authentication, Cookies work.
- [ ] WebSockets, Trading realtime, P2P realtime functionality work.
- [ ] Payment callbacks have been updated and checked.
- [ ] Existing Worker bindings, databases, secrets remain intact.
- [ ] Existing `workers.dev` URLs still work.
- [ ] No production code unnecessarily depends on `workers.dev` URLs.

## 7. Deliverable Report

Provide a final report containing:
1. Frontend Worker name
2. API Worker name
3. Custom Domains configured
4. Wrangler files changed
5. Exact configuration changes
6. Commands executed
7. DNS & SSL status
8. Test results for Frontend, API, CORS, Authentication, WebSockets, Payment callbacks
9. Any conflicting routes found or remaining manual Cloudflare Dashboard action
