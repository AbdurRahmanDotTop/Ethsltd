# Product Requirements Document (PRD): Contract Signing Workflow

## 1. Overview
The goal of this feature is to enhance the digital contract signing experience in the User Portal (`/account/contracts`), aligning it with the security and compliance standards of top-tier cryptocurrency trading platforms. Users must provide an explicit digital signature along with their full name to legally bind themselves to platform agreements (e.g., Margin Trading Facility, OTC Master Agreement).

## 2. Requirements

### 2.1. Dynamic Dates
- The "Issued At" and "Signed At" dates in the Mock User Contracts must be dynamic (relative to the current date) instead of hardcoded strings, ensuring the interface always displays realistic, recent dates during testing.

### 2.2. Enhanced Signature Modal
When a user clicks "Review & Sign" on a pending contract:
- **Legal Terms**: The modal will display the legal terms as before.
- **Name Input**: A required text input field where the user must type their full legal name.
- **Signature Upload**: A file upload dropzone (or file input) specifically for uploading an image of the user's signature (accepting PNG/JPG).
- **Checkbox**: A mandatory acknowledgment checkbox ("I acknowledge and agree to the terms above").
- **Validation**: The "Sign Agreement" button must remain disabled until the user has:
  1. Typed their name.
  2. Uploaded a signature file.
  3. Checked the acknowledgment box.

### 2.3. Submit Behavior
- Upon clicking "Sign Agreement" (and simulating the API call), the state will update:
  - The signature image and typed name will be (mock) processed.
  - The contract status will change to "Under Admin Review" (`pending_approval`).
  - The dynamic `signedAt` timestamp will be generated.
- The UI will reset appropriately after signing.

## 3. Scope of Implementation
- Modifying `apps/web/src/app/account/contracts/page.tsx`.
- Refactoring `MOCK_USER_CONTRACTS` to use JavaScript `Date` objects dynamically.
- Adding new state variables for the signature image and typed name.
- Enhancing the modal UI to include the new input and file dropzone.
