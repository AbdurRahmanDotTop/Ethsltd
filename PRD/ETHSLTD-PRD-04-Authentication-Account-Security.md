Understood. From this point forward, **ETHSLTD will use USD as the platform default currency**, not INR.

I’m keeping the existing architecture and completed work consistent:

* `/` — Homepage ✅
* `/markets` — Markets Explorer ✅
* `/trade` — Paper Trading Terminal ✅
* Next logical product layer — **Authentication + Account + Security foundation**
* Paper Trading remains available without introducing real-money custody.
* All monetary examples, balances, fees, portfolio values, and UI defaults in this PRD use **USD**.
* No INR-specific UI, copy, balance, payment method, or default currency should be introduced.

# ETHSLTD — Authentication, Account & Security PRD

**Suggested file name:**

`ETHSLTD-PRD-04-Authentication-Account-Security.md`

---

# 1. Document Information

| Field                     | Specification                                                                                |
| ------------------------- | -------------------------------------------------------------------------------------------- |
| Product                   | ETHSLTD Crypto Trading Platform                                                              |
| PRD                       | Authentication, Account & Security                                                           |
| Route group               | `/login`, `/register`, `/forgot-password`, `/verify-email`, `/account`, `/settings/security` |
| Previous completed routes | `/`, `/markets`, `/trade`                                                                    |
| Currency                  | **USD**                                                                                      |
| Default locale            | `en-US`                                                                                      |
| Default theme             | Existing system-supported theme                                                              |
| Frontend                  | Next.js + React + TypeScript                                                                 |
| Styling                   | Existing Tailwind CSS system                                                                 |
| State                     | Existing Zustand architecture                                                                |
| Validation                | Zod                                                                                          |
| Forms                     | React Hook Form                                                                              |
| Current trading mode      | Paper Trading                                                                                |
| Backend                   | Not required for initial UI prototype, but architecture must be backend-ready                |
| Authentication            | Session-based architecture                                                                   |
| Persistence               | Backend-ready; temporary mock/local persistence only where explicitly specified              |
| Responsive                | Desktop, tablet, mobile                                                                      |
| Accessibility             | WCAG-oriented                                                                                |
| Status target             | Production-quality UI and architecture                                                       |

---

# 2. Purpose

The purpose of this step is to build the **complete ETHSLTD identity and account experience**.

This establishes the foundation required for:

* User registration
* Login
* Logout
* Email verification
* Password recovery
* User profile
* Account settings
* Security settings
* 2FA preparation
* Session/device management
* Paper trading account association
* Account preferences
* Currency preferences
* Notification preferences
* Security alerts
* Future KYC readiness

The implementation must feel like the same product as the already completed Homepage, Markets and Trade pages.

It must **not look like a separate application**.

---

# 3. Product Principle

ETHSLTD should feel like:

> **A professional digital-asset platform that makes trading understandable, controlled and secure.**

The account system should therefore avoid:

* unnecessary visual clutter
* excessive forms
* confusing security terminology
* fake security claims
* fake KYC verification
* fake real-money deposits
* fake identity verification
* hardcoded INR
* inconsistent currency formatting

---

# 4. Important Currency Requirement

## Global default

ETHSLTD's default currency is:

**USD — United States Dollar**

Examples:

```text
$10,000.00
$1,250.50
$104,284.32
$0.00
```

Use:

```text
USD
```

as the internal currency code.

Frontend formatting should use:

```ts
Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});
```

---

# 5. Currency Rules

The account system must distinguish:

### Account display currency

```text
USD
```

### Crypto assets

Examples:

```text
BTC
ETH
SOL
USDT
USDC
```

### Fiat currency

```text
USD
```

Do not treat BTC/ETH/USDT as fiat currencies.

---

# 6. No INR

The following must **not** exist in this PRD implementation:

```text
₹
INR
Indian Rupee
UPI
bank transfer INR
INR balance
INR payment
```

unless they are introduced later as an explicitly configured regional feature.

---

# 7. User Journey

Primary journey:

```text
Homepage
   ↓
Sign Up
   ↓
Create Account
   ↓
Verify Email
   ↓
Account Created
   ↓
Security Setup
   ↓
Dashboard / Trade
```

Returning user:

```text
Homepage
   ↓
Log In
   ↓
Authentication
   ↓
Dashboard
```

Forgot password:

```text
Login
 ↓
Forgot Password
 ↓
Email
 ↓
Reset Link
 ↓
New Password
 ↓
Login
```

---

# 8. Routes

Create the following routes.

```text
/login
/register
/verify-email
/forgot-password
/reset-password
/account
/account/profile
/account/preferences
/account/security
/account/sessions
/account/notifications
```

Optional future route:

```text
/account/verification
```

This should be architecturally reserved for future KYC.

---

# 9. Header Integration

Existing Header currently contains:

```text
Markets
Trade
P2P
Assets
Learn
More
Search
Theme
Log In
Sign Up
```

When unauthenticated:

```text
Log In
Sign Up
```

When authenticated:

Replace these with an account control:

```text
[Avatar] User Name ▼
```

Dropdown:

```text
Account
Profile
Security
Preferences
Notifications
Help Center
Log Out
```

---

# 10. Authentication States

The application must support these states:

```text
UNAUTHENTICATED
AUTHENTICATING
AUTHENTICATED
EMAIL_UNVERIFIED
PASSWORD_RESET_REQUIRED
SESSION_EXPIRED
ACCOUNT_LOCKED
ACCOUNT_SUSPENDED
```

Do not rely only on:

```ts
isLoggedIn: boolean
```

The architecture should allow richer authentication state later.

---

# 11. Registration Page

Route:

```text
/register
```

## Page title

```text
Create your ETHSLTD account
```

## Subtitle

```text
Start exploring digital assets, markets, and paper trading with ETHSLTD.
```

---

# 12. Registration Form

Fields:

### Email

```text
Email address
```

Placeholder:

```text
you@example.com
```

### Password

```text
Create password
```

### Confirm Password

```text
Confirm password
```

### Terms checkbox

```text
I agree to the ETHSLTD Terms of Service and Privacy Policy.
```

### Marketing checkbox

Optional:

```text
Send me product updates, educational content, and market insights.
```

Marketing must be unchecked by default.

---

# 13. Registration CTA

Primary button:

```text
Create Account
```

Loading:

```text
Creating account...
```

Success:

```text
Account created
```

---

# 14. Existing Account

Below form:

```text
Already have an account?
Log in
```

---

# 15. Password Requirements

The registration UI should display password requirements.

Example:

```text
Your password should contain:

✓ At least 12 characters
✓ One uppercase letter
✓ One lowercase letter
✓ One number
✓ One special character
```

Do not reveal server-side password rules if the actual backend differs.

The frontend validation must ultimately match backend policy.

---

# 16. Password Strength

Use:

```text
Weak
Fair
Good
Strong
```

Visual indicator.

Never send or store passwords in client-side persistent storage.

---

# 17. Registration Validation

Email:

```text
Required
Valid email format
Normalized
```

Password:

```text
Required
Minimum length
Complexity
```

Confirm password:

```text
Must match password
```

Terms:

```text
Must be accepted
```

---

# 18. Registration Errors

Example:

```text
Please enter a valid email address.
```

```text
Password does not meet the security requirements.
```

```text
Passwords do not match.
```

```text
Please accept the Terms of Service.
```

Generic duplicate-account message:

```text
If an account exists with this email, follow the instructions we sent.
```

Avoid revealing whether an email is registered where account enumeration is a security concern.

---

# 19. Email Verification

After registration:

```text
Check your email
```

Copy:

```text
We've sent a verification link to your email address.
Verify your email to continue using your ETHSLTD account.
```

Actions:

```text
Open Email
Resend Email
Change Email
```

---

# 20. Verification Timer

Resend button initially disabled.

Example:

```text
Resend in 00:45
```

Then:

```text
Resend verification email
```

Rate limiting must exist server-side.

---

# 21. Verification Success

After successful verification:

```text
Email verified
```

CTA:

```text
Continue to ETHSLTD
```

Redirect:

```text
/account
```

or:

```text
/trade
```

depending on the originating flow.

---

# 22. Login Page

Route:

```text
/login
```

Title:

```text
Welcome back
```

Subtitle:

```text
Log in to your ETHSLTD account.
```

---

# 23. Login Fields

```text
Email
Password
```

Password visibility toggle:

```text
Show
Hide
```

Checkbox:

```text
Remember this device
```

Do not use indefinite authentication simply because this checkbox is selected.

---

# 24. Login Actions

Primary:

```text
Log In
```

Secondary:

```text
Forgot password?
```

Registration:

```text
Don't have an account?
Create one
```

---

# 25. Login Error

Do not expose whether the email or password specifically was incorrect.

Use:

```text
Email or password is incorrect.
```

For locked account:

```text
Your account has been temporarily locked for security.
```

---

# 26. Rate Limiting

Repeated failed login attempts should trigger:

```text
Temporary throttling
```

UI:

```text
Too many attempts. Please wait before trying again.
```

This must be implemented server-side when backend authentication exists.

---

# 27. Forgot Password

Route:

```text
/forgot-password
```

Title:

```text
Reset your password
```

Copy:

```text
Enter the email associated with your ETHSLTD account and we'll send you a password reset link.
```

Field:

```text
Email address
```

Button:

```text
Send Reset Link
```

---

# 28. Password Reset Security

Do not disclose whether an account exists.

Success:

```text
If an account is associated with that email, you'll receive a password reset link shortly.
```

Reset tokens should be:

* cryptographically random
* short-lived
* single-use
* server validated

---

# 29. Reset Password Page

Route:

```text
/reset-password
```

Fields:

```text
New password
Confirm new password
```

CTA:

```text
Reset Password
```

Success:

```text
Your password has been updated.
```

CTA:

```text
Log In
```

---

# 30. Password Change

Authenticated user:

```text
Account
→ Security
→ Change Password
```

Fields:

```text
Current password
New password
Confirm new password
```

After success:

```text
Your password has been changed.
```

Security action:

```text
Invalidate other sessions
```

Recommended default:

```text
Yes
```

---

# 31. Account Dashboard

Route:

```text
/account
```

This becomes the authenticated user's central account page.

Header:

```text
My Account
```

---

# 32. Account Overview

Display:

```text
Profile
Security
Trading Account
Preferences
Notifications
Sessions
```

---

# 33. Profile Card

Display:

```text
Avatar
Display Name
Email
Account ID
Account Status
Member Since
```

Example:

```text
Alex Morgan
alex@example.com

Account status
Active

Member since
August 2026
```

Do not display sensitive internal IDs unnecessarily.

---

# 34. Trading Account Card

Because the current `/trade` page is Paper Trading, display:

```text
Paper Trading Account
```

Example:

```text
Paper Balance

$10,000.00
```

This must connect conceptually to the existing `paper-account-store`.

Important:

The account page must not imply that:

```text
$10,000
```

is real money.

Display:

```text
Virtual balance
```

or:

```text
Paper trading balance
```

---

# 35. Paper Trading Integration

The existing paper account:

```text
10,000 USDT/USDC
```

must remain consistent with `/trade`.

The account page may show:

```text
Paper Portfolio
$10,000.00
```

with:

```text
View Paper Trading
```

CTA:

```text
/trade
```

---

# 36. USD Display

Portfolio summary:

```text
Total Portfolio Value
$10,000.00
```

P&L:

```text
+$250.00
+2.56%
```

Never display:

```text
₹
INR
```

---

# 37. Profile Page

Route:

```text
/account/profile
```

Sections:

### Personal Information

```text
Display Name
First Name
Last Name
```

For this stage, avoid requiring legal identity information unless needed.

---

# 38. Email

Display:

```text
Email
alex@example.com
Verified ✓
```

Change email:

```text
Change email
```

Changing email should require reauthentication and verification.

---

# 39. Username / Display Name

Field:

```text
Display name
```

Requirements:

* reasonable length
* no HTML
* no executable content
* sanitized
* reserved names protected

---

# 40. Avatar

Support:

```text
Upload image
Remove image
```

Allowed:

```text
JPG
PNG
WebP
```

Size limit should be enforced.

For production backend:

* private/object storage where appropriate
* content-type validation
* malware scanning pipeline later
* image processing
* size limits

---

# 41. Profile Save

Button:

```text
Save Changes
```

Loading:

```text
Saving...
```

Success toast:

```text
Profile updated successfully.
```

---

# 42. Preferences

Route:

```text
/account/preferences
```

Sections:

### Appearance

```text
Theme
```

Options:

```text
System
Light
Dark
```

This must integrate with existing `next-themes`.

---

# 43. Currency Preference

Default:

```text
USD
```

UI:

```text
Display Currency
USD — US Dollar
```

At this stage, USD should be the only enabled currency if multi-currency conversion isn't implemented.

Do not create a fake currency selector containing unsupported currencies.

Architecture can support:

```ts
type DisplayCurrency = "USD";
```

and later expand.

---

# 44. Language

Default:

```text
English
```

UI:

```text
Language
English
```

Architecture should remain i18n-ready.

---

# 45. Time Zone

Option:

```text
Use device time zone
```

Default:

```text
Automatic
```

All trading timestamps should remain unambiguous.

---

# 46. Number Formatting

USD:

```text
$1,000.00
```

Crypto:

```text
0.25000000 BTC
```

Do not use USD formatting for crypto quantities.

---

# 47. Security Center

Route:

```text
/account/security
```

Title:

```text
Security
```

Subtitle:

```text
Manage your account security and active sessions.
```

---

# 48. Security Score

Optional visual:

```text
Security level
Strong
```

Factors:

```text
Email verified ✓
Strong password ✓
2FA Not enabled
Active sessions 2
```

Do not claim:

```text
100% secure
Bank-grade security
Military-grade encryption
```

unless technically and legally substantiated.

---

# 49. Two-Factor Authentication

Section:

```text
Two-factor authentication
```

Status:

```text
Not enabled
```

CTA:

```text
Enable 2FA
```

---

# 50. 2FA Architecture

Prepare for:

```text
TOTP
Authenticator App
Recovery Codes
```

Future-compatible providers may be supported through an adapter.

---

# 51. 2FA Setup Flow

```text
Enable 2FA
 ↓
Re-authenticate
 ↓
Show secret/QR
 ↓
User scans with authenticator
 ↓
Enter 6-digit code
 ↓
Verify
 ↓
Generate recovery codes
 ↓
2FA enabled
```

Recovery codes must be shown only when appropriate and never stored in plaintext.

---

# 52. 2FA Confirmation

Success:

```text
Two-factor authentication is enabled.
```

Security event:

```text
2FA enabled
```

---

# 53. Disable 2FA

Require:

```text
Current password
+
2FA code
```

Potential additional security checks should be supported later.

Confirmation:

```text
Disable two-factor authentication?
```

Use destructive-action styling.

---

# 54. Recovery Codes

Display:

```text
Save your recovery codes
```

Actions:

```text
Copy
Download
Regenerate
```

Never display them again in plaintext after initial generation.

---

# 55. Active Sessions

Route:

```text
/account/sessions
```

Title:

```text
Active sessions
```

Display:

```text
Current device
Chrome
Windows
Current session

Last active
Now
```

Other sessions:

```text
Chrome
Android
2 hours ago

Safari
macOS
Yesterday
```

---

# 56. Session Information

Each session may contain:

```text
Browser
Operating System
Approximate location
Last active
Created
Current session
```

Avoid exposing exact IP addresses in normal UI unless necessary.

---

# 57. Session Actions

Each non-current session:

```text
Log out
```

Global:

```text
Log out all other devices
```

Confirmation:

```text
Are you sure?
This will sign out all other active sessions.
```

---

# 58. Login Activity

Security page should optionally display:

```text
Recent login activity
```

Example:

```text
Successful login
Chrome on Windows
Today, 10:42 AM

Failed login attempt
Chrome on Windows
Today, 10:40 AM
```

---

# 59. Security Alerts

Examples:

```text
New login detected
Password changed
Email changed
2FA enabled
2FA disabled
New device detected
Session revoked
```

---

# 60. Notification Preferences

Route:

```text
/account/notifications
```

Categories:

### Security

Always enabled:

```text
Security alerts
Password changes
Email changes
2FA changes
New login alerts
```

Critical security notifications should not be casually disabled.

---

# 61. Trading Notifications

Paper trading:

```text
Order filled
Order cancelled
Order partially filled
Price alerts
```

---

# 62. Product Notifications

Optional:

```text
Product updates
Educational content
Market insights
Announcements
```

Marketing consent must remain separate from mandatory security communications.

---

# 63. Account Deletion

Route:

```text
/account
```

Section:

```text
Danger Zone
```

Action:

```text
Delete Account
```

---

# 64. Delete Account UX

Require:

```text
Password
Confirmation
```

Confirmation text:

```text
DELETE
```

Do not implement irreversible backend deletion without a proper data-retention/compliance policy.

For the current UI stage, the action may display:

```text
Account deletion is currently unavailable.
```

if backend functionality is not implemented.

Do not fake deletion.

---

# 65. Account Status

Supported statuses:

```text
ACTIVE
EMAIL_UNVERIFIED
LOCKED
SUSPENDED
CLOSED
```

UI must render different states.

---

# 66. Suspended Account

If suspended:

```text
Account restricted
```

Display:

```text
Your account is currently restricted. Please contact ETHSLTD Support for assistance.
```

Do not reveal internal risk rules.

---

# 67. Logout

Logout should:

```text
Clear authenticated client state
Clear sensitive cached data
Invalidate session where backend exists
Return to homepage
```

Redirect:

```text
/
```

---

# 68. Authentication Persistence

For production architecture:

Prefer:

```text
HttpOnly
Secure
SameSite
```

session cookies.

Avoid storing authentication tokens in:

```text
localStorage
```

where possible.

---

# 69. Zustand Integration

Existing Zustand stores:

```text
paper-account-store
trading-ui-store
```

must remain separate from authentication state.

Create:

```text
auth-store.ts
```

only for client authentication state/UI state.

Do not put the complete server session/security model into Zustand.

---

# 70. Recommended Auth Store

Conceptually:

```ts
type AuthUser = {
  id: string;
  email: string;
  displayName?: string;
  emailVerified: boolean;
};

type AuthState = {
  user: AuthUser | null;
  status:
    | "loading"
    | "authenticated"
    | "unauthenticated";
};
```

---

# 71. Provider Abstraction

Create:

```text
AuthProvider
```

with an interface similar to:

```ts
register()
login()
logout()
getSession()
verifyEmail()
requestPasswordReset()
resetPassword()
changePassword()
```

The UI should not directly depend on a future authentication vendor.

---

# 72. Mock Authentication

Because the backend is not yet implemented, a mock provider can be used.

Example:

```text
MockAuthProvider
```

But it must be clearly separated from production authentication.

Do not build security-sensitive production behavior into mock localStorage logic.

---

# 73. Mock User

For development only:

```text
Alex Morgan
alex@example.com
```

Mock account:

```text
Paper Trading
$10,000.00
```

Clearly structure mock data so it can be removed later.

---

# 74. Data Model

Prepare the following conceptual entities:

```text
User
UserProfile
UserPreferences
UserSecurity
Session
LoginEvent
EmailVerificationToken
PasswordResetToken
NotificationPreference
```

---

# 75. User

Conceptual fields:

```text
id
email
emailVerified
status
createdAt
updatedAt
lastLoginAt
```

---

# 76. User Profile

```text
userId
displayName
firstName
lastName
avatarUrl
timezone
locale
```

---

# 77. User Preferences

```text
userId
theme
displayCurrency
language
timezone
```

Defaults:

```text
theme: system
displayCurrency: USD
language: en
timezone: automatic
```

---

# 78. Security Record

Conceptual:

```text
userId
twoFactorEnabled
passwordChangedAt
lastSecurityReviewAt
```

Never store plaintext passwords.

---

# 79. Session

```text
id
userId
createdAt
lastActiveAt
expiresAt
userAgent
device
platform
revokedAt
```

---

# 80. Login Event

```text
id
userId
timestamp
success
eventType
device
```

Security-sensitive fields should have controlled access.

---

# 81. Account ID

Every user should receive an immutable internal identifier.

Example:

```text
User ID
ETH-8F4A2C...
```

Do not use email as the primary user identifier.

---

# 82. Account Navigation

Authenticated account navigation:

```text
Account Overview
Profile
Security
Sessions
Notifications
Preferences
```

Mobile:

Use stacked cards/list.

Desktop:

Left sidebar:

```text
My Account

Overview
Profile
Security
Sessions
Notifications
Preferences
```

Right content panel.

---

# 83. Account Overview Design

Example:

```text
┌──────────────────────────────────────────┐
│ My Account                               │
│ Manage your ETHSLTD account              │
├──────────────────────────────────────────┤
│                                          │
│ Profile                                  │
│ Alex Morgan                              │
│ alex@example.com ✓                       │
│                                          │
├──────────────────────────────────────────┤
│ Paper Trading                            │
│ $10,000.00                               │
│ Virtual balance                          │
│                                          │
│ [Open Trading Terminal]                  │
├──────────────────────────────────────────┤
│ Security                                 │
│ Email verified ✓                         │
│ 2FA Not enabled                           │
│ 2 active sessions                        │
│                                          │
│ [Manage Security]                        │
└──────────────────────────────────────────┘
```

---

# 84. Design Consistency

Must reuse the existing ETHSLTD design system.

Do not introduce a new visual language.

Use existing:

* Header
* Footer
* typography
* buttons
* cards
* borders
* shadows
* spacing
* theme tokens
* responsive breakpoints
* icons

---

# 85. Dark Mode

Existing dark mode remains the primary visual identity.

Use semantic tokens:

```text
bg-background
text-foreground
border-border
text-muted-foreground
```

Do not hardcode dark-only colors where existing semantic tokens are available.

---

# 86. Light Mode

All account pages must work correctly in Light Mode.

Check:

* form fields
* validation messages
* buttons
* cards
* sidebar
* dropdowns
* modals
* security indicators
* disabled states

---

# 87. Accessibility

All forms must support:

```text
Keyboard navigation
Focus indicators
Screen readers
Labels
Error association
Logical tab order
```

Inputs must have actual labels.

Do not rely only on placeholders.

---

# 88. Responsive Design

Desktop:

```text
≥ 1024px
```

Tablet:

```text
768–1023px
```

Mobile:

```text
<768px
```

Account sidebar collapses into:

```text
Account menu ▼
```

on mobile.

---

# 89. Mobile Login

Login page should:

* fit small screens
* avoid horizontal scrolling
* use full-width inputs
* keep CTA easily reachable
* support password manager autofill

---

# 90. Mobile Security

Security cards become:

```text
full-width stacked cards
```

Sessions become cards instead of wide tables.

---

# 91. Error Handling

Global account errors should support:

```text
Network error
Authentication failure
Validation failure
Session expired
Rate limited
Server error
```

Generic server failure:

```text
Something went wrong. Please try again.
```

---

# 92. Session Expiration

When session expires:

Display:

```text
Your session has expired.
Please log in again.
```

CTA:

```text
Log In
```

Do not silently discard unsaved sensitive actions.

---

# 93. Protected Routes

These routes require authentication:

```text
/account
/account/profile
/account/security
/account/sessions
/account/notifications
/account/preferences
```

Future protected routes:

```text
/wallet
/p2p
/orders
```

---

# 94. Public Routes

Remain public:

```text
/
/markets
/trade
/login
/register
/forgot-password
```

The current `/trade` remains paper trading and may remain publicly accessible according to the existing product behavior.

If authenticated, it should use the user's persisted paper account.

---

# 95. Trade Integration

Current behavior:

```text
Try Paper Trading
```

from homepage should continue to:

```text
/trade
```

No authentication should accidentally break the existing paper trading flow.

---

# 96. Authenticated Trade Experience

If logged in:

```text
Paper Account
$10,000.00
```

should represent the same account state used by `/trade`.

Do not create:

```text
Account page balance = $10,000
Trade page balance = different $10,000
```

The two must share the same account abstraction.

---

# 97. Logout and Paper Account

Logging out should not accidentally delete the paper account.

The conceptual relationship is:

```text
User
 ↓
Paper Trading Account
 ↓
Paper Ledger
```

When authentication becomes backend-backed, paper trading state should move from browser-only persistence into the appropriate user-scoped backend storage.

---

# 98. Security Notifications

Use the existing Tawk.to support widget for support access, but **do not use Tawk.to as the authentication/security system**.

Security events should be controlled by ETHSLTD's own application.

---

# 99. SEO

Authentication pages should generally not be indexed.

Set:

```text
noindex
```

for:

```text
/login
/register
/forgot-password
/reset-password
/account/*
```

---

# 100. Metadata

Login:

```text
ETHSLTD | Log In
```

Register:

```text
ETHSLTD | Create Account
```

Account:

```text
ETHSLTD | My Account
```

Security:

```text
ETHSLTD | Security
```

---

# 101. Security Requirements

Production architecture must support:

```text
HTTPS
Secure cookies
HttpOnly cookies
SameSite cookies
CSRF protection where applicable
Rate limiting
Brute-force protection
Password hashing
Session rotation
Token expiration
Email verification
2FA
Audit logging
Security events
```

---

# 102. Password Storage

Never:

```text
password = plaintext
```

Use a strong password hashing algorithm such as:

```text
Argon2id
```

or an equivalent modern password hashing mechanism supported by the chosen backend.

---

# 103. CSRF

If cookie-based authentication is used, implement appropriate CSRF protection for state-changing requests.

Do not assume SameSite alone solves every CSRF scenario.

---

# 104. XSS Protection

User-generated:

```text
displayName
```

must be treated as untrusted input.

Never render arbitrary HTML from user profile fields.

---

# 105. Rate Limits

Authentication endpoints should have limits for:

```text
Login
Register
Password reset
Email verification
2FA verification
Change email
Change password
```

---

# 106. Audit Events

Prepare event names:

```text
USER_REGISTERED
EMAIL_VERIFIED
LOGIN_SUCCESS
LOGIN_FAILED
LOGOUT
PASSWORD_CHANGED
PASSWORD_RESET_REQUESTED
PASSWORD_RESET_COMPLETED
2FA_ENABLED
2FA_DISABLED
SESSION_CREATED
SESSION_REVOKED
ALL_SESSIONS_REVOKED
PROFILE_UPDATED
EMAIL_CHANGE_REQUESTED
EMAIL_CHANGED
```

---

# 107. Sensitive Actions

Require reauthentication for:

```text
Change password
Change email
Disable 2FA
Delete account
```

Potentially:

```text
Regenerate recovery codes
```

---

# 108. Email Change

Flow:

```text
Change Email
 ↓
Enter new email
 ↓
Confirm password
 ↓
Verification email
 ↓
Verify new email
 ↓
Email updated
```

Security notification should be sent to the previous email where possible.

---

# 109. Account Recovery

Prepare architecture for:

```text
Forgot password
Lost 2FA
Lost device
Recovery codes
Support-assisted recovery
```

Do not implement weak recovery methods such as:

```text
Security question:
What is your mother's name?
```

---

# 110. KYC Preparation

Do not implement full KYC in this step.

But account architecture should allow:

```text
verificationStatus
```

later.

Possible future states:

```text
NOT_STARTED
PENDING
VERIFIED
REJECTED
SUSPENDED
```

---

# 111. Compliance Disclaimer

Do not claim that ETHSLTD is:

```text
regulated
licensed
bank insured
FDIC insured
SEC registered
FCA regulated
```

unless verified and legally approved.

---

# 112. Real Money Boundary

This step must not introduce:

```text
real deposits
real withdrawals
real custody
real banking
real fiat settlement
```

The existing platform remains architecturally prepared for these future systems.

---

# 113. UI Copy Rules

Use professional language.

Prefer:

```text
Create your account
```

instead of:

```text
Join the revolution!!!
```

Prefer:

```text
Secure your account
```

instead of:

```text
Military-grade security!!!
```

Avoid exaggerated financial claims.

---

# 114. Empty States

Example sessions:

```text
No other active sessions
```

Notifications:

```text
You're all caught up.
```

Security:

```text
Enable 2FA to add another layer of protection.
```

---

# 115. Toast System

Success:

```text
Profile updated
```

Error:

```text
Unable to save changes
```

Security:

```text
Password changed successfully
```

Never display sensitive data in toast messages.

---

# 116. Loading States

Every async operation requires:

```text
Loading
Success
Error
```

Examples:

```text
Signing in...
Creating account...
Saving changes...
Updating password...
Loading sessions...
```

---

# 117. Skeletons

Account pages should use skeletons for:

```text
Profile
Security
Sessions
Notifications
```

rather than large blank areas.

---

# 118. Modal Requirements

Use modals for:

```text
Logout all devices
Disable 2FA
Delete account
Change email confirmation
```

Do not use modals for ordinary profile editing.

---

# 119. Form UX

Forms should support:

```text
Inline validation
Clear error messages
Keyboard submit
Password visibility
Disabled state
Loading state
Success state
```

---

# 120. API Boundary

Future API structure:

```text
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/session

POST /api/auth/verify-email
POST /api/auth/resend-verification

POST /api/auth/forgot-password
POST /api/auth/reset-password

POST /api/auth/change-password

GET  /api/account
PATCH /api/account/profile
PATCH /api/account/preferences

GET /api/account/sessions
DELETE /api/account/sessions/:id
DELETE /api/account/sessions

GET /api/account/security
```

---

# 121. Zod Schemas

Create centralized schemas:

```text
registerSchema
loginSchema
forgotPasswordSchema
resetPasswordSchema
changePasswordSchema
profileSchema
preferencesSchema
```

Keep validation shared where possible.

---

# 122. Recommended File Structure

Consistent with the existing Next.js project:

```text
app/
├── login/
│   └── page.tsx
│
├── register/
│   └── page.tsx
│
├── verify-email/
│   └── page.tsx
│
├── forgot-password/
│   └── page.tsx
│
├── reset-password/
│   └── page.tsx
│
└── account/
    ├── page.tsx
    ├── profile/
    │   └── page.tsx
    ├── security/
    │   └── page.tsx
    ├── sessions/
    │   └── page.tsx
    ├── notifications/
    │   └── page.tsx
    └── preferences/
        └── page.tsx
```

---

# 123. Components

Recommended:

```text
components/auth/
├── LoginForm.tsx
├── RegisterForm.tsx
├── PasswordField.tsx
├── PasswordStrength.tsx
├── EmailVerification.tsx
├── ForgotPasswordForm.tsx
├── ResetPasswordForm.tsx
└── AuthCard.tsx
```

Account:

```text
components/account/
├── AccountSidebar.tsx
├── AccountOverview.tsx
├── ProfileForm.tsx
├── SecurityPanel.tsx
├── TwoFactorCard.tsx
├── SessionList.tsx
├── NotificationPreferences.tsx
├── PreferenceForm.tsx
└── DangerZone.tsx
```

---

# 124. Library Structure

Consistent with current architecture:

```text
lib/
├── auth/
│   ├── types.ts
│   ├── provider.ts
│   ├── mock-provider.ts
│   └── auth-utils.ts
│
├── account/
│   ├── types.ts
│   └── preferences.ts
│
└── validation/
    └── auth.ts
```

---

# 125. Types

Create:

```ts
type UserStatus =
  | "ACTIVE"
  | "EMAIL_UNVERIFIED"
  | "LOCKED"
  | "SUSPENDED"
  | "CLOSED";
```

And:

```ts
type DisplayCurrency = "USD";
```

This makes the USD requirement explicit.

---

# 126. Testing

Use existing:

```text
Vitest
Playwright
React Testing Library
```

---

# 127. Unit Tests

Test:

```text
email validation
password validation
password confirmation
currency defaults
profile validation
preferences
session state
authentication state
```

---

# 128. Authentication Tests

Test:

```text
successful registration
invalid email
weak password
password mismatch
login success
login failure
logout
password reset
email verification
session expiration
```

---

# 129. Account Tests

Test:

```text
profile update
theme update
USD preference
notification preferences
session revocation
```

---

# 130. Security Tests

Test:

```text
unauthenticated access
protected route redirect
session expiration
invalid reset token
expired reset token
reused reset token
rate-limit UI
2FA flow
```

---

# 131. E2E User Journey

Playwright scenario:

```text
Open homepage
 ↓
Click Sign Up
 ↓
Create account
 ↓
Verify mock email
 ↓
Open account
 ↓
Open Security
 ↓
Open Preferences
 ↓
Confirm USD
 ↓
Open Trade
 ↓
Verify paper account
```

---

# 132. Existing Feature Regression

This is critical.

After implementation verify:

```text
Homepage works
Markets works
Trade works
Theme toggle works
Tawk chat works
Back-to-top works
Header works
Footer works
```

The new authentication system must not break existing routes.

---

# 133. Trade Regression

Verify:

```text
/trade
```

still supports:

* market selector
* candlestick chart
* order book
* order entry
* buy/sell
* percentage shortcuts
* order history
* trade history
* cancellation
* paper balance

---

# 134. Markets Regression

Verify:

```text
/markets
```

still supports:

* search
* categories
* favorites
* sorting
* market cards
* sparklines
* responsive table

---

# 135. Currency Regression

Search the entire project for:

```text
₹
INR
Indian Rupee
```

and remove unintended occurrences.

Also check:

```text
currency
price formatting
portfolio formatting
balance formatting
fee formatting
mock data
documentation
UI copy
```

Everything should default to:

```text
USD
```

---

# 136. Mock Data

All mock financial values must use USD where fiat values are displayed.

Example:

```text
Paper Portfolio: $10,000.00
Estimated Fee: $1.25
Total: $1,251.25
```

Crypto quantity remains crypto:

```text
0.0125 BTC
```

---

# 137. Do Not Fake Live Authentication

The mock provider is acceptable for development.

But the UI must not state:

```text
Your account is securely connected to production
```

when there is no backend.

Development-only mock behavior must be clearly separated from production architecture.

---

# 138. Performance

Target:

```text
Fast initial render
Minimal JavaScript
No unnecessary client components
Lazy-load security-heavy UI where appropriate
Avoid large authentication libraries unless needed
```

Continue using Next.js server/client boundaries intelligently.

---

# 139. SEO Performance

Authentication pages:

```text
noindex
```

Account pages:

```text
noindex
```

Avoid loading unnecessary marketing assets on authenticated account screens.

---

# 140. Analytics

Do not track sensitive information.

Allowed event concepts:

```text
signup_started
signup_completed
login_completed
password_reset_started
account_preferences_updated
security_page_viewed
```

Do not send:

```text
password
2FA code
recovery code
full session token
```

---

# 141. Privacy

Never expose:

```text
password
auth token
2FA secret
recovery codes
```

to analytics, logs, support tools or frontend error reporting.

---

# 142. Tawk.to

The existing Tawk.to integration remains.

However:

* never send passwords to support
* never expose auth tokens
* never automatically transmit private security information
* do not place sensitive account data into chat metadata

---

# 143. Error Monitoring

Errors may be sent to the existing monitoring solution later, but sensitive fields must be scrubbed.

Example:

```text
email: redacted where necessary
password: NEVER
token: NEVER
2FA: NEVER
```

---

# 144. Definition of Done

This PRD is complete when:

### Authentication

* [ ] Register page exists
* [ ] Login page exists
* [ ] Logout exists
* [ ] Forgot password exists
* [ ] Reset password exists
* [ ] Email verification exists
* [ ] Protected account routes exist

### Account

* [ ] Account dashboard
* [ ] Profile
* [ ] Preferences
* [ ] Security
* [ ] Sessions
* [ ] Notifications
* [ ] Danger Zone

### Security

* [ ] Password requirements
* [ ] Password visibility
* [ ] Session management
* [ ] Security activity
* [ ] 2FA-ready architecture
* [ ] Recovery-code-ready architecture
* [ ] Security event model

### Currency

* [ ] USD is default
* [ ] USD appears in account balances
* [ ] USD appears in paper portfolio
* [ ] USD appears in fees
* [ ] No accidental INR
* [ ] `DisplayCurrency = "USD"`

### Integration

* [ ] Header changes when authenticated
* [ ] Account dropdown works
* [ ] Trade remains functional
* [ ] Markets remains functional
* [ ] Homepage remains functional
* [ ] Theme switching works
* [ ] Tawk chat remains functional

### Quality

* [ ] Desktop responsive
* [ ] Tablet responsive
* [ ] Mobile responsive
* [ ] Light mode
* [ ] Dark mode
* [ ] Keyboard accessible
* [ ] Validation
* [ ] Loading states
* [ ] Error states
* [ ] Empty states
* [ ] E2E tests
* [ ] Regression tests

---

# 145. Final Consistency Map

The project should now conceptually look like:

```text
                    ETHSLTD
                       │
          ┌────────────┼────────────┐
          │            │            │
       Public       Markets       Trade
          │            │            │
          │            │        Paper Trading
          │            │            │
          └────────────┼────────────┘
                       │
                  Authentication
                       │
              ┌────────┴────────┐
              │                 │
           Account           Security
              │                 │
       ┌──────┼──────┐      ┌───┼────┐
       │      │      │      │   │    │
    Profile Prefs Notifications 2FA Sessions
       │
       └──────────────┐
                      │
                Paper Account
                      │
                  USD Display
                      │
                $10,000.00
```

---

# 146. Global ETHSLTD Currency Standard

From this point onward, use this standard across **all future PRDs and implementation**:

```text
Default fiat currency: USD
Currency code: USD
Locale: en-US
Symbol: $
Decimal places: 2 for fiat
Crypto precision: asset-specific
Default paper balance: $10,000.00 equivalent
```

Examples:

```text
BTC/USDT
$104,284.32
24h Volume $2.45B
Portfolio $10,000.00
Fee $1.25
P&L +$250.00
```

The **asset itself** remains:

```text
BTC
ETH
SOL
USDT
USDC
```

and USD is the default fiat/display currency.

---

## Recommended `.md` filename

Use exactly:

```text
ETHSLTD-PRD-04-Authentication-Account-Security.md
```

This is the next logical PRD after the completed:

```text
ETHSLTD-PRD-01-Homepage.md
ETHSLTD-PRD-02-Markets.md
ETHSLTD-PRD-03-Trade.md
```

and keeps the project documentation sequential and consistent.
