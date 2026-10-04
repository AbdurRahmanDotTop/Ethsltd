Trading-Focused Production-Ready Platform — Complete Development & Audit Prompt

Iss project ko strictly trading-focused platform ke roop mein develop aur maintain kijiye. Project mein jo bhi existing working functionality hai usko unnecessarily remove ya break na karein. Sabse pehle complete codebase, frontend, backend/API, database, authentication, wallet, trading engine, order-management logic, assets, transactions, fees, validation, security aur deployment configuration ko deeply inspect kijiye.

Koi mock, demo, simulated, paper-trading ya fake transaction flow use nahi karna hai. Sabhi trading aur wallet operations real production database aur real application logic ke saath properly work karne chahiye.

1. Complete Existing Project Audit

Sabse pehle poore project ka deep audit kijiye:

Frontend architecture
Backend/API architecture
Database schema aur existing data
Authentication/session system
User account system
Wallet system
Asset/currency system
Trading/order system
Order matching/execution logic
Deposit system
Withdrawal system
Transaction history
Fees
Balance calculations
Admin functionality
API endpoints
Validation
Error handling
Security
Existing Cloudflare configuration
Existing deployment configuration
Environment variables/secrets
Existing integrations

Pehle ye identify kijiye ki currently kya working hai, kya partially working hai aur kya broken hai.

Existing functionality ko duplicate mat kijiye. Jo system already available hai usko fix/extend kijiye aur DRY architecture maintain kijiye.

2. Platform Completely Trading-Focused Ho

Is project ka primary purpose crypto/asset trading hona chahiye.

Trading ke alawa unnecessary modules/features ko project ke core experience mein include na karein.

Trading experience professional exchange/trading platform ke standard ke according hona chahiye.

User ko:

Market dekhna
Asset select karna
Buy/Sell karna
Order place karna
Open orders dekhna
Order modify/cancel karna
Order execute/complete hona
Order history dekhna
Trade history dekhna
Wallet balance dekhna
Deposit karna
Withdrawal request karna
Fees dekhna
Transaction history dekhna

properly available hona chahiye.

3. Current Order Completion Problem — Deeply Fix

Currently order place ho raha hai, lekin order ko complete/execute/close karne ka proper option aur lifecycle available nahi hai.

Isko sirf UI button add karke fix mat kijiye.

Complete order lifecycle implement/audit kijiye:

Order States

At minimum appropriate states properly handle hon:

Pending
Open
Partially Filled
Filled / Completed
Cancelled
Rejected
Expired
Failed

Har state ka frontend aur backend behavior clearly defined hona chahiye.

Order Flow

Example:

Available Wallet Balance → Order Placement → Balance Reservation/Lock → Order Matching/Execution → Fill → Fee Calculation → Final Balance Update → Order Completed → Trade Record → Transaction Record

Agar order execute nahi hota hai to balance incorrectly deduct nahi hona chahiye.

Agar order cancel hota hai to reserved funds properly wallet mein release hone chahiye.

Agar order partially filled hota hai to sirf executed quantity settle honi chahiye aur remaining quantity appropriately open/reserved rehni chahiye.

Agar order fully filled ho jata hai to order status Completed/Filled hona chahiye.

4. Proper Trading Engine

Trading system ko production-grade architecture ke according implement kijiye.

System mein appropriate order types support kijiye, jaise:

Market Order
Limit Order
Stop Order / Stop-Limit, where supported by the existing architecture
Buy Orders
Sell Orders

Har order type ke liye proper:

Validation
Balance check
Price validation
Quantity validation
Minimum order validation
Maximum order validation
Fee calculation
Execution
Settlement
Error handling
Order status
Transaction records

hona chahiye.

Jo order types technically supported nahi hain unko fake UI ke through show mat karein.

5. Buy/Sell System
Buy

User jab Buy order place kare:

Wallet mein required quote currency available check ho.
Required balance reserve/lock ho.
Order create ho.
Matching/execution ho.
Executed asset user ke wallet mein credit ho.
Spent quote currency properly debit ho.
Trading fee calculate/deduct ho.
Trade record create ho.
Transaction history update ho.
Order status correct state mein update ho.
Sell

User jab Sell order place kare:

Wallet mein required asset available check ho.
Asset reserve/lock ho.
Order create ho.
Matching/execution ho.
Sold asset properly debit ho.
Received quote currency wallet mein credit ho.
Trading fee calculate/deduct ho.
Trade record create ho.
Transaction history update ho.
Order status correctly update ho.

Frontend balance aur backend balance kabhi mismatch nahi hona chahiye.

6. Wallet Must Be the Core Settlement System

Wallet ko properly production-ready banaiye.

Trading wallet se hi execute hogi aur trading ke baad resulting assets/currencies wallet mein hi settle hongi.

Wallet ko sirf display system na banayein. Wallet actual source of truth/ledger-based balance system ke according work kare.

Wallet mein:

Available Balance
Locked/Reserved Balance
Total Balance
Deposit Balance
Trading Balance, if architecture requires separate accounting
Asset Balance
Fiat/Currency Balance, if supported

properly calculate/display hon.

Important

Trading ke time:

Available Balance → Reserved Balance

Order execute hone par:

Reserved Balance → Trade Settlement

Order cancel hone par:

Reserved Balance → Available Balance

Ye accounting atomic aur reliable honi chahiye.

7. Assets / Coins System

Trading mein jitne assets/coins supported hain unko proper dynamic asset system ke through manage kijiye.

Coins/assets ko code mein unnecessarily hardcode mat kijiye.

Asset configuration database/admin configuration se dynamically manage honi chahiye.

Har supported asset ke liye appropriate:

Symbol
Name
Network
Decimals
Deposit status
Withdrawal status
Trading status
Minimum deposit
Minimum withdrawal
Withdrawal fee
Deposit availability
Trading pairs

manage kiye ja sakein.

Example assets architecture ko scalable rakhein:

BTC
ETH
USDT
USDC
SOL
BNB
aur future mein add hone wale supported assets

Example list ko hardcoded final list na samjhein. System future assets add karne ke liye scalable hona chahiye.

8. Deposit System

User ko supported assets/currencies ke liye proper deposit functionality provide kijiye.

User:

Wallet → Deposit → Asset Select → Network Select → Deposit Address/Instructions → Deposit Request/Transaction → Confirmation → Wallet Credit

kar sake.

Deposit system mein:

Asset selection
Network selection
Deposit address
Memo/tag where required
Deposit amount
Transaction hash/reference
Deposit status
Confirmation status
Fees where applicable
Timestamp
Transaction history

properly handle hon.

Deposit hone ke baad wallet balance accurately update hona chahiye.

Duplicate deposit credit prevent kijiye.

Same transaction/reference ko multiple times process karke user ko duplicate balance nahi milna chahiye.

9. Withdrawal System

User wallet se supported assets ka withdrawal request submit kar sake.

Flow:

Wallet → Withdraw → Asset Select → Network Select → Address → Amount → Fee → Net Amount → Security Validation → Withdrawal Request → Processing → Completed/Rejected

Withdrawal mein:

Available balance check
Locked balance check
Minimum withdrawal
Maximum withdrawal
Daily limits where configured
Withdrawal fee
Net amount calculation
Address validation
Network validation
Security checks
Transaction/reference ID
Withdrawal status
Failure handling
Admin review where required
Transaction history

properly implement kijiye.

Withdrawal ke waqt balance incorrectly deduct nahi hona chahiye.

Failed/rejected withdrawal ke case mein appropriate balance reversal hona chahiye.

10. Wallet Transaction Ledger

Wallet ke liye reliable transaction/ledger system maintain kijiye.

Har balance movement traceable hona chahiye.

Examples:

Deposit
Withdrawal
Trade Buy
Trade Sell
Trading Fee
Deposit Fee
Withdrawal Fee
Balance Adjustment, only when authorized
Refund
Order Reservation
Order Release

Har transaction mein appropriate:

User
Asset
Amount
Direction
Before balance
After balance
Reference
Related order/trade
Status
Timestamp

available hona chahiye.

Balance ko direct arbitrary update karne ke bajaye proper ledger/accounting logic use kijiye wherever appropriate.

11. Trading Pairs

Trading pair architecture dynamic rakhein.

Example:

BTC/USDT
ETH/USDT
SOL/USDT
BTC/USD
ETH/USD

etc.

Admin/system configuration ke through trading pairs enable/disable kiye ja sakein.

Har pair ke liye:

Base asset
Quote asset
Minimum quantity
Maximum quantity
Tick size
Step size
Price precision
Quantity precision
Trading status
Fees/fee configuration

properly manage hon.

12. Trading UI

Trading interface professional trading platform ke standard ke according banaiye.

UI mein appropriate components include kijiye:

Trading pair selector
Live price
Price change
Chart
Timeframes
Buy/Sell panel
Order type
Price
Quantity
Total
Available balance
Estimated fee
Order confirmation
Open Orders
Order History
Trade History
Order Book
Recent Trades
Wallet/balance information

Mobile aur desktop dono par properly responsive hona chahiye.

Kisi important trading field ko mobile par hide karke functionality break mat kijiye.

13. Order Book & Trade Execution

Agar project architecture order-book trading support karta hai, to proper order-book behavior implement kijiye:

Buy orders
Sell orders
Price priority
Time priority
Matching
Partial fills
Full fills
Order cancellation
Locked balance
Settlement

Execution ke baad order book aur user balances immediately consistent state mein hone chahiye.

Race conditions aur duplicate execution ko prevent kijiye.

14. Real-Time Updates

Trading UI mein possible/appropriate areas par real-time updates implement kijiye:

Market price
Order book
Recent trades
Order status
Fill status
Wallet balance
Open orders
Notifications

Real-time implementation existing project architecture ke compatible honi chahiye.

Unnecessary polling ya duplicate requests avoid kijiye.

15. Fees

Trading fees ko proper configurable system banaiye.

Fee types:

Trading fee
Withdrawal fee
Deposit fee, if applicable
Other configured platform fees

Trading fee calculation:

Trade Amount → Applicable Fee → Net Settlement

properly calculate ho.

Fee frontend par estimated form mein show ho aur backend par final authoritative calculation ho.

Frontend calculation ko security/accounting source of truth mat banaiye.

16. Security & Financial Integrity

Ye financial/trading application hai, isliye security ko high priority par rakhein.

Deeply check:

Authentication
Authorization
Session security
CSRF protection where applicable
Input validation
API authorization
Rate limiting
Duplicate requests
Replay attacks
Race conditions
Double spending
Duplicate transaction processing
Integer/decimal precision
Balance manipulation
Unauthorized withdrawal
Unauthorized order actions
Privilege escalation
Admin authorization
Sensitive data exposure

Client-side balance ya price ko trusted source na maana jaye.

Final validation aur accounting backend par honi chahiye.

17. Decimal & Precision Handling

Financial calculations mein floating-point errors avoid kijiye.

Assets ke configured decimal precision ke according proper decimal/numeric handling use kijiye.

Examples:

BTC
ETH
USDT
USDC
SOL
Fiat currencies

ke liye correct precision maintain honi chahiye.

Display rounding aur actual accounting precision alag properly handle kijiye.

18. Database Integrity

Existing database ko deeply inspect kijiye.

Check:

Users
Wallets
Assets
Balances
Orders
Trades
Trading pairs
Transactions
Deposits
Withdrawals
Fees
Audit logs
Related foreign keys
Indexes
Constraints

Existing production data ko accidentally delete/overwrite nahi karna hai.

Database migration karni ho to:

Existing schema inspect karein.
Existing production data protect karein.
Migration create karein.
Local/test validation karein.
Production/remote database compatibility verify karein.
Migration safely apply karein.

Duplicate records aur inconsistent financial records ko carefully identify/fix kijiye.

19. Admin Trading Management

Admin side par appropriate management available hona chahiye:

Users
Wallets
Assets
Trading pairs
Orders
Trades
Deposits
Withdrawals
Transactions
Fees
Limits
Trading status
Asset status
Deposit status
Withdrawal status

Admin ko financial data modify karne ki permission strictly controlled honi chahiye.

Har sensitive action ka audit log maintain kijiye.

20. Error Handling

Har critical operation mein proper error handling honi chahiye.

Examples:

Insufficient balance
Invalid quantity
Invalid price
Invalid asset
Invalid trading pair
Market unavailable
Order execution failure
Network failure
Deposit failure
Withdrawal failure
Duplicate transaction
Expired session
Unauthorized request

User ko clear message mile aur backend logs mein technical details properly record hon.

21. No Fake Success

Kisi bhi operation ko frontend par successful mat dikhaiye jab tak backend/database operation actually successful na ho.

For example:

Order Placed tabhi show ho jab order successfully database mein create/reserve ho.

Trade Completed tabhi show ho jab actual execution + settlement complete ho.

Deposit Completed tabhi show ho jab actual deposit processing/confirmation complete ho.

Withdrawal Completed tabhi show ho jab actual withdrawal completion confirm ho.

22. Authentication & Session

Existing authentication system ko deeply audit kijiye.

Ensure:

Login
Logout
Session persistence
Token/session expiry
Page refresh
Mobile browser
Desktop browser
Protected trading pages
Protected wallet pages
Admin pages

properly work karein.

Trading ya wallet operation ke beech unnecessary logout/reload/flicker nahi hona chahiye.

23. Frontend ↔ Backend ↔ Database

Sabhi data flows ko end-to-end verify kijiye:

Database → Backend/API → Frontend

aur

Frontend → Backend/API → Database

har important trading/wallet operation ke liye correctly linked hona chahiye.

Agar database mein data already available hai lekin frontend par show nahi ho raha, to root cause identify karke proper API/data binding fix kijiye.

Fake/static placeholder data use mat kijiye jab real database data available ho.

24. Testing

Implementation ke baad complete end-to-end testing kijiye.

Minimum test scenarios:

Trading
Buy market order
Sell market order
Buy limit order
Sell limit order
Partial fill
Full fill
Cancel open order
Failed order
Insufficient balance
Invalid quantity
Invalid price
Fee calculation
Wallet
Deposit
Deposit confirmation
Duplicate deposit protection
Withdrawal request
Withdrawal fee
Insufficient balance
Withdrawal rejection
Withdrawal completion
Balance reversal
Transaction history
Accounting

Verify:

Before Balance + Credits - Debits = After Balance

Har applicable transaction ke liye.

25. Production Readiness

Final system ko production-ready banaiye.

Check:

Build
Deployment
Environment variables
Database
API
Frontend
Authentication
Wallet
Trading
Error handling
Logging
Security
Performance
Mobile responsiveness
Desktop responsiveness
Cloudflare configuration

Koi development-only URL, localhost URL, mock endpoint, fake API, placeholder data ya temporary workaround production mein nahi rehna chahiye.

26. Important Development Rules
Existing working features ko break mat kijiye.
Duplicate functionality create mat kijiye.
DRY architecture maintain kijiye.
Existing API ko unnecessarily duplicate mat kijiye.
Existing database data protect kijiye.
Financial calculations backend authoritative rakhiye.
Client-side values par trust mat kijiye.
Mock/demo/paper trading remove/avoid kijiye.
Fake balances create mat kijiye.
Fake transaction success mat dikhaiye.
Hardcoded asset/rate/balance data avoid kijiye where database configuration is intended.
Production database ko bina verification ke modify/delete mat kijiye.
Existing deployment ko replace karne ke bajaye current project ko properly update kijiye.
Security ko bypass karne wala shortcut mat use kijiye.
27. Final Acceptance Criteria

Project tabhi complete maana jayega jab:

User wallet mein funds/assets rakh sake.
Wallet balance accurately display ho.
User supported assets deposit kar sake.
User withdrawal request submit kar sake.
Trading wallet balance se order place ho.
Order properly execute/match ho.
Order partial/full fill support kare where applicable.
User open orders dekh sake.
User order cancel kar sake.
Completed trades properly record hon.
Trading fees correctly calculate hon.
Executed trade ke baad wallet balances correctly settle hon.
Failed/cancelled orders ke funds correctly release hon.
Deposit/withdrawal/trade transactions history mein accurately appear hon.
Duplicate financial transactions prevent hon.
Frontend/backend/database balances consistent hon.
Mobile aur desktop trading UI properly work kare.
Authentication/session stable ho.
Admin ko required trading/wallet controls available hon.
Security and authorization properly enforced ho.
Production database/data safe rahe.
Koi mock/demo/paper/fake trading flow na ho.
Complete system real production usage ke liye ready ho.
Final Instruction

Sirf currently visible bug ko patch mat kijiye. Poore project ko ek production-grade trading platform ke roop mein deeply audit karke end-to-end correct kijiye.

Agar kisi feature ka frontend bana hua hai lekin backend incomplete hai, backend complete kijiye.

Agar backend bana hua hai lekin frontend connected nahi hai, proper API integration kijiye.

Agar database mein required data/schema already available hai, usko reuse kijiye.

Agar existing implementation logically incorrect hai, root cause fix kijiye.

Har trading aur wallet operation ko Frontend → API → Business Logic → Database → Settlement → Frontend complete lifecycle ke through verify kijiye.

Goal: ek fully functional, secure, scalable, production-ready trading platform jahan wallet actual financial source of funds ho aur order placement se lekar execution, settlement, deposit, withdrawal aur transaction history tak poora lifecycle correctly work kare.