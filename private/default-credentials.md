# ETHSLTD Default Credentials

The following default accounts have been securely created and seeded into the live production database (`ethsltd_db` on Cloudflare D1). These accounts possess the respective roles required to test the entire application, including the Admin Panel, P2P Dispute management, and Support Tickets.

> **Important:** Since these are real database accounts, their passwords are securely hashed using WebCrypto SHA-256.

### 1. Super Administrator
Has full access to all features, including the `/admin` console, user management, and system settings.
* **Email:** `admin@ethsltd.com`
* **Password:** `Password123!`
* **Role:** `SUPER_ADMIN`

### 2. Regular User
Standard trading account with access to Spot Trading, P2P, Wallet, and Support Tickets. Cannot access the Admin Console.
* **Email:** `user@ethsltd.com`
* **Password:** `Password123!`
* **Role:** `USER`

### 3. Compliance Admin
Has access to the Admin Console specifically for reviewing KYC applications and mediating P2P Disputes.
* **Email:** `compliance@ethsltd.com`
* **Password:** `Password123!`
* **Role:** `COMPLIANCE_ADMIN`

### 4. Support Admin
Has access to the Admin Console to view, manage, and respond to user support tickets.
* **Email:** `support@ethsltd.com`
* **Password:** `Password123!`
* **Role:** `SUPPORT_ADMIN`

---

### Special Note on Database Authentication
Unlike the old mocked authentication, the current backend validates JWT tokens and fetches directly from the live database. The accounts above will be able to perform live database mutations.
