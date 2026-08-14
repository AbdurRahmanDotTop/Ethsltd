# PRD 23: Admin Dashboard

## Overview
The Admin Dashboard allows platform administrators to manage users, monitor platform activity, and approve/reject KYC requests. It is a critical component for maintaining compliance and security on the ETHSLTD platform.

## Scope
1. **Admin Middleware & Backend Routes (`services/api/src/routes/admin.ts`)**:
   - `adminMiddleware`: Ensure the user's role is `ADMIN` before granting access to `/api/v1/admin/*`.
   - `GET /admin/users`: Fetch a list of all users with their current status and role.
   - `POST /admin/users/:id/status`: Update a user's status (e.g., Ban, Freeze, Activate).
   - `GET /admin/stats`: Get high-level platform stats (Total Users, Total Volume, Active Markets).
   - `GET /admin/kyc`: List pending KYC applications.
   - `POST /admin/kyc/:id/status`: Approve or reject a KYC application.
2. **Frontend Admin Interface (`apps/web/src/app/admin/...`)**:
   - Create a dedicated `/admin` layout and page that is visually distinct from the main application.
   - **Users Tab**: Data table of users with a dropdown to update their status.
   - **KYC Tab**: List of pending KYC documents with 'Approve' and 'Reject' actions.
   - **Overview Dashboard**: Display cards for the platform stats.
3. **Frontend SDK (`packages/api-client/src/index.ts`)**:
   - Add admin-specific methods: `getUsers()`, `updateUserStatus()`, `getAdminStats()`, `getPendingKYC()`, `updateKYCStatus()`.

## Security
- All admin routes must enforce strict Role-Based Access Control (RBAC). Only users with `role === 'ADMIN'` are authorized.
