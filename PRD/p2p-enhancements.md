# P2P Trading Enhancements & Admin Deletion PRD

## 1. Overview
This PRD outlines the requirements to make the P2P trading module fully functional and production-ready by introducing robust real-time notifications, expanding P2P chat capabilities, and resolving a critical database transaction error affecting user deletion in the admin panel.

## 2. Problem Statement
1. **User Deletion Failure**: Super admins are unable to delete users due to a Cloudflare D1 compatibility issue with standard SQL `BEGIN TRANSACTION` commands (D1_ERROR).
2. **Missing P2P Notifications**: Users do not receive system notifications when a P2P order is created, marked as paid, released, disputed, or cancelled, leaving them blind to order lifecycle events.
3. **P2P Chat Visibility**: While a chat component exists in the code, users are not notified when the counterparty sends a new chat message, leading to missed communication during active trades.

## 3. Scope & Requirements

### 3.1 Admin User Deletion (D1 Fix)
- **Requirement**: Replace the standard `db.transaction()` wrapper in `DELETE /api/v1/admin/users/:id` with Cloudflare D1 compatible `db.batch()` execution.
- **Behavior**: Gather all dependent queries (cascading deletes for P2P, Ledgers, Wallets, etc.) into an array and execute them atomically via `db.batch(queries)` to bypass D1 transaction limitations.

### 3.2 P2P Lifecycle Notifications
- **Requirement**: Integrate the `notifications` table into all state-changing P2P API routes (`services/api/src/routes/p2p.ts`).
- **Events to Notify**:
  - `Order Created`: Notify the Ad owner that a new order has been initiated.
  - `Mark Paid`: Notify the Seller that the Buyer has completed the fiat transfer.
  - `Release Crypto`: Notify the Buyer that the Seller has released the escrowed crypto.
  - `Cancel Order`: Notify the counterparty that the order has been aborted.
  - `Dispute`: Notify the counterparty that a dispute has been raised.
- **Delivery**: Notifications should appear in the user's global notification bell dropdown immediately.

### 3.3 P2P Chat Enhancements
- **Requirement**: When a user sends a chat message (`POST /orders/:id/messages`), generate a notification for the counterparty (Buyer or Seller).
- **Behavior**: The notification will alert the user to check the specific P2P order page for new messages.

## 4. Technical Implementation Details
- **API File**: `services/api/src/routes/p2p.ts`
  - Import `notifications` from `database`.
  - Inject `db.insert(notifications).values({...})` after every successful order state mutation.
- **Admin File**: `services/api/src/routes/admin.ts`
  - Refactor `tx.delete()` to `queries.push(db.delete(...))` and execute with `await db.batch(queries as any)`.

## 5. Success Criteria
- Super admin can delete a user (and all related cascading records) without encountering a `D1_ERROR`.
- P2P buyers and sellers receive UI notifications for all major trade lifecycle events, including new chat messages.
- The platform's P2P module feels responsive, secure, and production-ready for users.
