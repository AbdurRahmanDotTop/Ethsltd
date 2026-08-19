# Product Requirements Document (PRD): Dynamic Email Notification System

## 1. Overview
The goal is to implement a fully dynamic, production-ready email notification system for the ETHSLTD platform, utilizing the existing Cloudflare + Hostinger Mail infrastructure. This system will centralize email configuration, provide granular control over notification settings, and ensure real-time communication for critical account and financial events.

## 2. Default System Emails & Configuration
*   **Initial Defaults:**
    *   Admin Email: `admin@ethsltd.com`
    *   Support Email: `support@ethsltd.com`
*   **Requirement:** These addresses must not be hardcoded anywhere in the application logic. They must be stored in the database (`platform_settings`) and be fully updatable by the Super Admin via the UI without requiring code deployments.

## 3. Super Admin Email Configuration UI
*   **Location:** Super Admin Panel → System Settings.
*   **Features:**
    *   View current Admin and Support emails.
    *   Update email addresses with front-end and back-end validation.
    *   Save changes dynamically to the database.
*   **Impact:** All system notifications will instantly route to the updated email addresses.

## 4. Email Infrastructure & Architecture
*   **Provider:** Hostinger Mail via SMTP (`smtp.hostinger.com`) handled securely.
*   **Architecture Requirements:**
    *   **Secrets Management:** SMTP credentials (Host, Port, User, Password) must use secure environment variables/secrets.
    *   **Worker Compatibility:** Since the API runs on Cloudflare Workers, the SMTP client must be compatible with Cloudflare's runtime (e.g., using `cloudflare:sockets` or an appropriate Edge-compatible SMTP package).
    *   **Email Capabilities:** Support HTML and plain-text fallback, proper sender names, and professional branding.
    *   **Asynchronous Delivery:** Use background processes (e.g., Cloudflare Queues or `ctx.waitUntil`) to prevent email dispatch from blocking main HTTP request latency.
    *   **Resiliency:** Implement retry handling for temporary failures and structured failure logging. Deduplication and idempotency checks to prevent redundant emails.

## 5. User Registration & Verification Flow
*   **Admin Notification:** Send an alert containing non-sensitive new user details.
*   **User Notification:** Send an email containing a secure, time-limited verification token/link.
*   **Verification Status:** Persist verification status in the database. Update profile UI to show a "Verified" badge post-verification. Expired links must fail gracefully.

## 6. Financial Transaction Notifications
*   **Deposits (Real Only):**
    *   Admin: Detailed alert (Amount, Asset, TXID, User ID, Timestamp).
    *   User: User-friendly confirmation template.
*   **Withdrawals (Real Only):**
    *   Admin: Comprehensive review/approval notification.
    *   User: Status updates (Pending, Completed, Rejected, Failed).
*   **Simulated/Demo:** Never trigger financial or admin emails for demo trading or virtual balance updates.

## 7. Event Coverage Matrix
*   **Authentication & Security:** New registration, Email Verification, Password Reset, Password Changed.
*   **Trading (Critical Only):** Order filled/partially filled (if appropriate, without spamming).
*   **P2P Trading:** Order created, Order accepted, Payment status changes, Dispute opened/resolved.
*   **KYC / Compliance:** KYC submitted, approved, rejected, or additional info needed.
*   **System/Admin:** Account suspension, critical security alerts.

## 8. Dynamic Notification Controls
*   **UI Integration:** Super Admin Panel must feature a "Notification Management" settings page.
*   **Toggles:** Independent ON/OFF toggles for Admin and User emails across all identified event types (e.g., "New User Admin Email", "Deposit User Email").
*   **Enforcement:** The backend Notification Service must read these dynamic toggles before dispatching any email.

## 9. Templates & Branding
*   **Admin Templates:** Data-dense, operational tone, suitable for fast review.
*   **User Templates:** Branded, trustworthy, user-friendly, clear action buttons, and contextual security guidance.

## 10. Database Schema Additions
*   **Platform Settings:** Store `ADMIN_EMAIL`, `SUPPORT_EMAIL`, and dynamic notification toggles as key-value pairs.
*   **Email Delivery Logs:** Track recipient, subject, event type, timestamp, status (Success/Failed), and error messages for admin debugging.

## 11. Security Requirements
*   No hardcoded URLs; origins must be dynamic based on the environment.
*   Zero sensitive keys or passwords included in emails.
*   Proper validation on all configuration updates.

## 12. End-to-End Testing Scope
*   Verify dynamic setting overrides.
*   Verify queue dispatch and asynchronous delivery.
*   Verify demo separation.
*   Verify HTML rendering and template accuracy.
