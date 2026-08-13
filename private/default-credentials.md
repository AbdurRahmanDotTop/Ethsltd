# ETHSLTD Default Credentials

Currently, the ETHSLTD platform operates using a simulated `MockAuthProvider`. This provider allows testing of various system roles and permissions without requiring a live database connection.

You can log in at `http://localhost:3000/login` using the following credentials.

> **Note on Passwords:** Because the current authentication is simulated, **any password** (minimum 8 characters) will be accepted for these accounts.

### 1. Super Administrator
Has full access to all features, including the `/admin` console, user management, and system settings.
* **Email:** `admin@ethsltd.com`
* **Password:** `AnyPassword123!`
* **Role:** `SUPER_ADMIN`

### 2. Regular User
Standard trading account with access to Spot Trading, P2P, Wallet, and Support Tickets. Cannot access the Admin Console.
* **Email:** `user@ethsltd.com`
* **Password:** `AnyPassword123!`
* **Role:** `USER`

### 3. Compliance Admin
Has access to the Admin Console specifically for reviewing KYC applications and mediating P2P Disputes.
* **Email:** `compliance@ethsltd.com`
* **Password:** `AnyPassword123!`
* **Role:** `COMPLIANCE_ADMIN`

### 4. Support Admin
Has access to the Admin Console to view, manage, and respond to user support tickets.
* **Email:** `support@ethsltd.com`
* **Password:** `AnyPassword123!`
* **Role:** `SUPPORT_ADMIN`

---

### Special Testing Accounts

The mock provider is designed to simulate authentication failures. Use the following emails to test error handling:

* **Trigger "Invalid Credentials" Error:**
  * **Email:** `wrong@example.com`
* **Trigger "Account Locked" Error:**
  * **Email:** `locked@example.com`

---
*These credentials are strictly for the current frontend simulation and should be replaced with securely hashed database accounts when the Hono API goes live.*
