# Admin Roles, Control & KYC Guide

This document explains how the Admin privileges are structured, how user roles are managed, and how to access and approve KYC applications.

## 1. KYC Approval URL

To view, approve, or reject user KYC applications, the Admin needs to navigate to the **KYC Queue** page in the Admin Dashboard.

- **URL:** `/admin/kyc` (e.g. `http://localhost:3000/admin/kyc` in development, or `https://ethsltd.com/admin/kyc` in production)
- **How to Approve:** 
  1. Go to the KYC Queue table.
  2. Click on **"View Details" (👁️)** for any `PENDING` application.
  3. A popup modal will appear showing the user's Name, DOB, Document Images (Front, Back, Selfie).
  4. At the bottom of the modal, click the **Approve (✅)** or **Reject (❌)** buttons.
  5. Upon approval, the user's KYC status is immediately updated in the database and they unlock full platform features.

## 2. User Roles and Control Structure

The platform uses a Role-Based Access Control (RBAC) system. The roles are defined in the database schema (`users` table) and enforced in the backend API using middleware.

### Available Roles:
- `SUPER_ADMIN`: Has absolute full control over every feature. Can change user roles, modify balances, and view everything.
- `ADMIN`: General admin for managing most platform features.
- `COMPLIANCE_ADMIN` / `KYC_ADMIN`: Specialized roles focused on reviewing KYC, AML, and user verification.
- `SUPPORT_ADMIN`: Focused on handling tickets, disputes, and user support.
- `USER`: A standard customer/trader on the platform.

### How Control is Decided (The Flow):

1. **Database Level**:
   Every user in the `users` table has a `role` column (default is `USER`).

2. **Authentication (JWT)**:
   When a user logs in, the backend generates a JSON Web Token (JWT). The user's `role` is embedded securely inside this token.

3. **Backend Middleware (`services/api/src/routes/admin.ts`)**:
   Whenever an API request is made to an `/api/v1/admin/*` endpoint, the `jwtMiddleware` decrypts the token and checks the user's role.
   - Example check:
     ```typescript
     if (!['SUPER_ADMIN', 'COMPLIANCE_ADMIN', 'SUPPORT_ADMIN', 'ADMIN'].includes(user.role)) {
       return c.json({ error: 'Unauthorized' }, 403);
     }
     ```
   - Only users with the matching roles are allowed to proceed. Regular `USER`s are blocked with a `403 Forbidden` error.

4. **Super Admin Exclusive Powers**:
   Certain destructive or highly sensitive actions are restricted *only* to the `SUPER_ADMIN`.
   For example, changing another user's role, banning a user, or manually adjusting wallet balances.
   - Example check:
     ```typescript
     if (admin.role !== 'SUPER_ADMIN') {
       return c.json({ error: 'Unauthorized: Only Super Admins can change user roles' }, 403);
     }
     ```

## 3. How to Upgrade a User to Super Admin

By default, users sign up as regular `USER`. To make someone a `SUPER_ADMIN` (or any other admin):

### Method A: Direct Database Query (Cloudflare D1)
You can manually update a user's role directly in the D1 database using Wrangler:
```bash
pnpm wrangler d1 execute ethsltd_db --remote --command="UPDATE users SET role = 'SUPER_ADMIN' WHERE email = 'admin@ethsltd.com'"
```

### Method B: From the Admin Panel (If you are already a Super Admin)
1. Go to the Users management page: `/admin/users`.
2. Find the user you want to upgrade.
3. Click "Edit Role" and change it to `SUPER_ADMIN`. 
*(Note: Only an existing `SUPER_ADMIN` can perform this action via the dashboard).*

---
**Summary**: The entire control system is secured at the Backend API level using JWT tokens. Even if a regular user somehow navigates to `/admin/kyc`, the backend will reject their requests to load or approve KYC data.
