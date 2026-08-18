# ETHSLTD Global Currency Rates & Transparent Payments PRD

## 1. Overview
This document defines the requirements for making **Global Currency Rates** fully dynamic and integrating them deeply into the **Deposit** and **Withdrawal** systems. The primary goal is to ensure 100% transparency for the user regarding conversion rates, fees, and final net amounts, while enforcing strict, centralized backend calculations.

## 2. Global Currency Rates

### 2.1 Configuration
- Super Admin can define, edit, activate, or deactivate fiat currency rates (e.g., `1 USDT = 98.80 INR`).
- Only **ACTIVE** rates are used across the platform.
- Zero or negative rates are strictly prohibited.
- Hardcoded exchange rates must be completely removed from the codebase.

## 3. Transparent Deposit System

### 3.1 Real-Time Calculation & UI Breakdown
When a user enters a deposit amount in a selected fiat currency, the UI must immediately display a real-time breakdown:
- **Deposit Amount:** Gross fiat amount entered by user.
- **Exchange Rate:** Active Global Currency Rate (e.g., `1 USDT = 98.80 INR`).
- **Gross USDT:** Conversion result.
- **Deposit Fee:** Computed applicable fee (Fixed or Percentage).
- **Other Fees:** Any other configured platform fees.
- **Net USDT / Expected Credit:** The final amount to be credited after Admin approval.

A clear message must state: *"After admin approval, {Net USDT} will be credited to your USDT wallet."*

### 3.2 Submission & State Management
- **Pending State:** When submitted, the deposit is marked as `PENDING`. **No wallet credit occurs.**
- **Deposit Record Snapshots:** The deposit record must store: Original amount, Original currency, Applicable Rate, Gross USDT, Applied Fees, Net USDT, and Expected Credit. This prevents historical recalculations if the rate later changes.

### 3.3 Admin Approval & Atomic Credit
- Admin views the pending deposit along with its exact breakdown.
- Upon clicking **Approve**, the system performs an atomic, server-side ledger transaction:
  - Updates the wallet balance.
  - Creates necessary ledger/transaction entries.
  - Updates deposit status to `APPROVED`.
- **Idempotency:** Strict duplicate prevention; a deposit cannot be credited twice.
- If rejected, the deposit moves to `REJECTED` and no funds are credited.

## 4. Transparent Withdrawal System

### 4.1 Real-Time Calculation & UI Breakdown
Similar to deposits, withdrawal calculations must be perfectly transparent before confirmation:
- **Withdrawal Amount:** Amount requested.
- **Fees:** Applicable withdrawal, platform, service, and network fees (Fixed/Percentage).
- **Final Receive Amount:** Net payout to the user.
- **Currency Conversion (if applicable):** Conversion from USDT to the withdrawal fiat using the active Global Currency Rate.

A clear confirmation screen must summarize these details before submission.

### 4.2 Balances & Fund Locking
- The system must validate that `Available Balance >= (Withdrawal Amount + Applicable Fees)`.
- Upon successful submission, the required amount is **locked/reserved**, preventing double-spending.

### 4.3 Admin Processing & Payout
- Withdrawals proceed through `PENDING` → `PROCESSING` → `COMPLETED`.
- Upon completion, the locked funds are permanently deducted.
- If rejected/cancelled, locked funds are returned to the available balance.

## 5. Centralized Calculation Service
- A single, authoritative backend service must handle all Math: `Currency Conversion + Fee Calculation + Net Amount Calculation`.
- This service must be consumed by both the frontend (for live previews) and the backend (for final transactional processing).
- Discrepancies between frontend previews and backend executions are unacceptable.

## 6. Implementation Scope
- Extend existing `manual_deposits` schema or augment `walletTransactions` to store the detailed breakdown fields.
- Refactor `currency_rates` usage across the frontend (`apps/web`) and backend (`services/api`).
- Refactor deposit and withdrawal endpoints to utilize the new centralized calculation service.
- Implement strict idempotent ledger checks for balance changes.
