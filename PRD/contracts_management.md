# Product Requirements Document (PRD): User & OTC Trading Contracts

## 1. Overview
In a top-tier cryptocurrency trading platform, high-net-worth individuals, institutional clients, and OTC (Over-The-Counter) traders often require formal, legally binding contracts before they are granted access to specific liquidity pools, high withdrawal limits, or margin lending facilities. 

This feature introduces a **Contract Management System** where the platform can issue contracts to users, users can digitally sign them, and the Super Admin (or Legal Admin) can review and approve them.

## 2. Objectives
- Ensure legal compliance and risk mitigation for high-volume traders.
- Provide a seamless digital contract signing experience for end-users.
- Provide a robust Admin interface (`/admin/contracts`) for administrators to track, review, and approve these contracts.

## 3. User Roles & Permissions
- **End-User (Trader/Institution)**: Can view pending contracts on their dashboard, read the terms, and provide a digital signature.
- **Super Admin / Legal Admin**: Can view all contracts, filter by status (Pending Signature, Pending Approval, Approved, Rejected), review user signatures, and approve/reject them.

## 4. Contract Lifecycle & Statuses
1. **Draft**: Contract created but not sent.
2. **Pending Signature**: Contract sent to the user, waiting for their digital signature.
3. **Pending Approval**: User has signed; waiting for Admin review.
4. **Approved**: Admin has approved; contract is legally active.
5. **Rejected**: Admin rejected the signature or terms.

## 5. Implementation Scope (Admin Side)
### UI Component: `/admin/contracts`
- **Dashboard View**: A table listing all active and historical contracts.
- **Columns**: Contract ID, User Info, Contract Type (e.g., Margin Trading Agreement, OTC Master Agreement), Status, Date Issued, Actions.
- **Actions**:
  - **View/Review**: Opens a modal showing the full contract text, the user's digital signature timestamp, IP address, and an "Approve" or "Reject" button.
- **Mock Data**: For the initial implementation, we will use mock data representing various institutional users and their contract statuses.

## 6. Future Scope (User Side)
- A dedicated section in the User Dashboard where users are prompted to sign mandatory agreements via a secure e-signature component.
