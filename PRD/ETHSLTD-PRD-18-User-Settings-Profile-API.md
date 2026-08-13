# PRD 18: User Profile & Settings API Integration

## 1. Overview
This PRD outlines the backend API integration for the User Profile and Settings module. Currently, the user settings (like security 2FA, session management, and profile info) rely heavily on frontend dummy logic. We will connect these directly to the D1 database to ensure persistence, secure session management, and robust MFA configurations.

## 2. Objectives
- Expose endpoints to update the user's basic profile (display name, first/last name).
- Provide a secure mechanism to fetch and revoke active user sessions.
- Implement API routes to enable, verify, and disable 2FA (MFA) using the `mfaSecret` in the database.
- Update `@ethsltd/api-client` to include these methods.
- Refactor the User Settings page components to communicate with the real backend.

## 3. Database Schema Re-Use
We will utilize the existing schemas defined in `database/schema/auth.ts`:
- **Table `users`**: Will update `firstName`, `lastName`, `mfaEnabled`, `mfaSecret`.
- **Table `sessions`**: Will query active sessions (`expiresAt > now`) and allow revoking specific sessions by deleting rows.

## 4. API Endpoints

### Settings Router (`/api/v1/settings`)
- **Profile**
  - `GET /api/v1/settings/profile` - Fetch current user profile.
  - `PATCH /api/v1/settings/profile` - Update display name, first name, last name.
- **Security & MFA**
  - `POST /api/v1/settings/mfa/generate` - Generate a new MFA secret (returns QR code URI).
  - `POST /api/v1/settings/mfa/enable` - Verifies the TOTP token and sets `mfaEnabled=true`.
  - `POST /api/v1/settings/mfa/disable` - Verifies TOTP token and sets `mfaEnabled=false`.
- **Sessions**
  - `GET /api/v1/settings/sessions` - List all active sessions for the user.
  - `DELETE /api/v1/settings/sessions/:id` - Revoke a specific session.
  - `DELETE /api/v1/settings/sessions/all-except-current` - Revoke all other sessions.

## 5. Frontend Refactoring
- Replace `auth-store.ts` mock session logic if any is remaining.
- Connect `apps/web/src/app/(dashboard)/settings` pages (Profile, Security, Sessions) to the API client.
- Connect the 2FA activation flow to generate an actual OTP secret via the API (optional: install `otplib` and `qrcode` in the backend for TOTP generation).

## 6. Acceptance Criteria
- [ ] User can update their profile information and see it persist across reloads.
- [ ] User can enable 2FA securely.
- [ ] User can view active sessions and terminate remote sessions.
- [ ] Full TypeScript type safety across the stack.
