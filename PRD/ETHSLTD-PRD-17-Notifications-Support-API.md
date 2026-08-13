# PRD 17: Notifications & Support API Integration

## 1. Overview
This PRD defines the backend API integration for the Notifications and Support modules. The frontend currently relies on `notification-store.ts` and `support-store.ts` which use mock data. This phase will build the D1 database schemas, backend routes, and API client methods to make these features fully dynamic and persistent.

## 2. Objectives
- Create database schemas for Notifications and Support Tickets.
- Implement `/api/v1/notifications` for fetching and marking notifications as read.
- Implement `/api/v1/support` for creating tickets, fetching user tickets, and adding messages to tickets.
- Update `@ethsltd/api-client` to support these new methods.
- Refactor frontend stores and UI to connect to the real APIs.

## 3. Database Schema Updates

### Notifications (`database/schema/notifications.ts`)
- **Table `notifications`**:
  - `id`: string (PK)
  - `userId`: string (FK to users)
  - `title`: string
  - `message`: string
  - `type`: 'SYSTEM' | 'TRADE' | 'DEPOSIT' | 'WITHDRAWAL' | 'SECURITY'
  - `isRead`: boolean (default: false)
  - `createdAt`: timestamp

### Support (`database/schema/support.ts`)
- **Table `tickets`**:
  - `id`: string (PK)
  - `userId`: string (FK to users)
  - `subject`: string
  - `category`: string
  - `status`: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED'
  - `priority`: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  - `createdAt`: timestamp
  - `updatedAt`: timestamp
- **Table `ticketMessages`**:
  - `id`: string (PK)
  - `ticketId`: string (FK to tickets)
  - `senderId`: string (FK to users)
  - `isAdmin`: boolean
  - `content`: string
  - `createdAt`: timestamp

## 4. API Endpoints

### Notifications Router (`/api/v1/notifications`)
- `GET /` - Fetch all notifications for the authenticated user.
- `PATCH /:id/read` - Mark a specific notification as read.
- `POST /read-all` - Mark all notifications as read.

### Support Router (`/api/v1/support`)
- `GET /tickets` - Fetch all support tickets for the authenticated user.
- `POST /tickets` - Create a new support ticket.
- `GET /tickets/:id/messages` - Fetch messages for a specific ticket.
- `POST /tickets/:id/messages` - Send a new message to a ticket.

## 5. Frontend Refactoring
- Modify `notification-store.ts` to call `apiClient.getNotifications()`, etc.
- Modify `support-store.ts` and support UI (`/support`) to query tickets directly from the DB via API.

## 6. Acceptance Criteria
- [ ] Users can see their persistent notifications across browser refreshes.
- [ ] Users can open a support ticket and have it saved in D1.
- [ ] Users can reply to support tickets.
- [ ] TypeScript compilation passes with no errors across all workspaces.
