# PRD 16: Admin Operations Console API Integration

## 1. Overview
This PRD defines the backend API integration for the Admin & Operations Console. The frontend currently relies on a `MockAdminProvider`. This phase will build the secure D1 backend routes and update the API Client so that the admin dashboard pulls real data from the database.

## 2. Objectives
- Implement secured `/api/v1/admin/*` routes in the Hono.js backend.
- Enforce Role-Based Access Control (RBAC) to ensure only users with `role === 'ADMIN'` or `role === 'SUPER_ADMIN'` can access these endpoints.
- Provide real data for Users, KYC, Deposits, Withdrawals, Trades, Orders, and P2P disputes.
- Refactor the frontend admin pages to utilize `apiClient` instead of `MockAdminProvider`.

## 3. Scope of Work

### Phase 1: Security & Middleware
- Implement `adminMiddleware` in `services/api/src/middleware/auth.ts` to check `user.role` from the JWT payload.

### Phase 2: Backend Admin Endpoints
Create `services/api/src/routes/admin.ts` with the following:
- **Users**: 
  - `GET /admin/users` (Paginated list)
  - `GET /admin/users/:id`
  - `PATCH /admin/users/:id/status` (Ban/Freeze/Activate)
- **KYC**:
  - `GET /admin/kyc`
  - `PATCH /admin/kyc/:id/status` (Approve/Reject)
- **Financial Ops**:
  - `GET /admin/deposits`
  - `GET /admin/withdrawals`
  - `PATCH /admin/withdrawals/:id/status` (Approve/Reject)
- **Trading & P2P**:
  - `GET /admin/orders`
  - `GET /admin/trades`
  - `GET /admin/p2p-disputes`
- **Dashboard Stats**:
  - `GET /admin/stats` (Total users, 24h volume, active P2P ads, pending KYC)

### Phase 3: API Client SDK
- Add all the above admin methods to `@ethsltd/api-client`.

### Phase 4: Frontend Refactoring
- Replace `MockAdminProvider` calls with `apiClient` calls across all pages in `apps/web/src/app/admin/*`.
- Ensure loading states, pagination, and error handling remain functional.
- Delete `MockAdminProvider` if fully migrated.

## 4. Acceptance Criteria
- [ ] Only authorized admin users can access the endpoints.
- [ ] The Admin UI accurately reflects live database data (users, transactions, P2P).
- [ ] Admin actions (e.g., banning a user, approving KYC) persist correctly in the database.
- [ ] Frontend compiles with no type errors.

## 5. Security & Constraints
- Extreme care must be taken with the `adminMiddleware`. It must absolutely reject unauthorized access.
- Audit logs should be considered for any mutative admin actions (e.g., approving a withdrawal).
