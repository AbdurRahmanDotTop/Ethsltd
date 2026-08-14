# Crypto Trading Platform - Legal Contracts Flow

Yeh document is baat ki wazahat (explanation) karta hai ke **ETHSLTD** platform par Contracts aur Legal Agreements real-time mein kaise work karenge jab backend aur database live hoga.

## 1. Concept: Contract System Kyun Zaroori Hai?
Bade Crypto exchanges (jaise Binance Institutional, Kraken OTC, ya Margin Trading) par jab koi user aam limits se aage barhta hai (e.g. VIP limits chahiye, ya OTC Desk par large trades karni hain, ya Margin par udhaar trading karni hai), toh unko specifically legal terms accept karni padti hain. 

Aam "Terms of Service" yahan kafi nahi hote. Unko legally binding **Digital Contracts** sign karne padte hain taake kal ko koi bara financial dispute ho toh platform legally safe rahay.

---

## 2. Real World Scenario: Database & Backend Logic

Real tareeke se yeh system 4 parts mein divide hoga:

### Part A: Contract Generation (Admin Side)
1. **Trigger:** Super Admin ya Risk Management team kisi user ko platform par analyze karti hai. Agar user "Margin Trading" enable karne ki request karta hai, toh backend system automatically ek `Contract` record create kar deta hai jiski status `pending_signature` hoti hai.
2. **Database:** `contracts` table mein ek nayi row banegi jisme `user_id`, `contract_type` (e.g., Margin Trading), `document_hash` (contract text ka ek security fingerprint), aur `status` save hogi.

### Part B: User Signing Flow (User Side)
1. **Notification:** User ko apne dashboard aur email par notification aati hai ke: *"Action Required: Sign the Margin Trading Agreement to proceed."*
2. **Reviewing:** User `/account/contracts` page par jata hai. Jab user "Review & Sign" par click karta hai, toh frontend backend se poora legal text fetch karta hai.
3. **Digital Signature (Real Implementation):** 
   - User jab "I Agree" checkbox par click karta hai aur "Sign Agreement" ka button dabata hai, toh frontend API ko call bhejta hai.
   - **Backend Capture:** API exactly us waqt user ka **IP Address** (e.g., 198.51.100.42), **Timestamp** (kis waqt click kiya), aur user ke session / Auth token ko mila kar ek **Cryptographic Hash (SHA-256)** generate karti hai.
   - Yeh hash is baat ka pakka legal proof ban jata hai ke exactly is IP se, is user ne, is second par in terms ko Qabool (Accept) kiya tha.
   - Database mein status `pending_approval` ho jata hai.

### Part C: Admin Approval Flow (Super Admin Side)
1. **Review:** Super Admin `/admin/contracts` page par jata hai. Wahan usey filter karke woh sabhi contracts dikhte hain jo "Pending Admin Review" mein hain.
2. **Verification:** Admin jab "Review Now" par click karta hai, woh dekhta hai ke:
   - User kaun hai? (KYC complete hai ya nahi).
   - Sign kis IP se hua hai? (Agar account US ka hai aur IP North Korea ka hai, toh Admin reject kar dega).
   - Timestamp kya hai.
3. **Action:** Admin "Approve" button par click karta hai. Backend API check karti hai ke ye action sirf Super Admin role ke paas ho. Database mein contract status `approved` me badal jata hai.

### Part D: Enforcing Limits (System Logic)
1. Jaise hi contract `approved` hota hai, platform ka Trading Engine sun raha hota hai (via webhooks ya database triggers).
2. Engine automatically us user ke account mein Margin Trading ka feature unlock kar deta hai, ya uski withdrawal limit 50,000$ se badha kar 1,000,000$ kar deta hai.

---

## 3. Security & Legal Audit (Real World)
Agar koi user case kar de ke "Maine toh yeh agree nahi kiya tha", toh platform ke paas yeh details mojood hoti hain:
- **Contract Version:** (E.g., Margin Terms v1.4)
- **Signature IP:** (198.51.100.42)
- **Hash:** (0x7f83b9a...)
Yeh poori history `Audit Logs` (`/admin/audit`) mein bhi as a "critical" or "info" event save rehti hai, jise PDF ya CSV me nikal kar easily legal authorities ko diya ja sakta hai.

## 4. Conclusion
Mocks aur UI jo humne banayi hai wo exactly isi flow par design ki gayi hai. Jab hum API banayenge, hum sirf buttons ke `onClick` par database ko API calls bhejenge jo inhi statuses (`pending_signature` -> `pending_approval` -> `approved`) ko manage karegi.
