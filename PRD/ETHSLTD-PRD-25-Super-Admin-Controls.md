# ETHSLTD PRD 25: Super Admin Controls & Full Access Management

## 1. Objective
To provide the `SUPER_ADMIN` role with absolute control over the ETHSLTD platform. The Super Admin must be able to view, edit, and manage every aspect of the system, with a primary focus on comprehensive user management (activation, disablement, role assignment, and manual overrides).

## 2. Scope of Super Admin Controls
1. **Complete User Management:**
   - View all registered users.
   - Edit user profiles (Name, Email).
   - Change User Status (`ACTIVE`, `FROZEN`, `BANNED`).
   - Change User Role (`USER`, `SUPPORT_ADMIN`, `COMPLIANCE_ADMIN`, `SUPER_ADMIN`).
   - Hard Delete or Wipe User Data (if necessary for compliance).
2. **Wallet & Balance Overrides:**
   - View full wallet balances (Real & Paper) for any user.
   - Adjust balances manually (e.g., in case of severe system bugs or manual P2P dispute resolutions).
3. **Platform Global Settings:**
   - Toggle Platform Maintenance Mode.
   - Adjust global trading fees or withdrawal limits.

## 3. Technical Implementation Plan

### 3.1 Database Schema Updates (`database/schema/auth.ts`)
- Update the `role` enum in the `users` table to officially support `SUPER_ADMIN`, `COMPLIANCE_ADMIN`, `SUPPORT_ADMIN`, `USER`.
- Add global settings table (optional, or use env variables/KV for maintenance mode).

### 3.2 Backend API (`services/api/src/routes/admin.ts`)
- Enhance JWT middleware to strictly enforce `SUPER_ADMIN` requirements for destructive routes.
- **`PUT /api/v1/admin/users/:id`**: Full update endpoint for user profile and role.
- **`POST /api/v1/admin/users/:id/status`**: Update user status.
- **`POST /api/v1/admin/wallets/adjust`**: Endpoint to manually adjust user balances (strictly logged).

### 3.3 Frontend Admin Console (`apps/web/src/app/admin`)
- **Users Page (`/admin/users`)**: 
  - Enhance the data table with a "Super Admin Actions" menu.
  - Implement Modals: "Edit User", "Change Role", "Change Status".
- **User Detail Page (`/admin/users/[id]`)**: 
  - Create a deep-dive page for a specific user to view all their trades, P2P orders, wallets, and KYC documents, with inline edit capabilities.
- **Platform Settings Page (`/admin/settings`)**:
  - Global toggles for system operations.

## 4. Security & Audit
- Every action taken by a Super Admin MUST be logged in an admin audit log for accountability.
- Users cannot elevate their own privileges unless another Super Admin authorizes it.

## 5. Next Steps
1. Approve the Implementation Plan.
2. Execute the Database schema updates.
3. Build the Backend API endpoints for full user control.
4. Develop the Frontend UI modals and deep-dive user pages.
