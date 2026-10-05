ETHSLTD — MetaTrader 5 Level Trading Platform
Complete Production-Ready Product Requirements Document

Project: ETHSLTD Trading Platform
Primary Objective: Existing ETHSLTD project ko MetaTrader 5-level professional trading platform mein transform karna, with fully integrated wallet, deposit, withdrawal, risk management, order execution, market data, charts, history, portfolio and administration.

Reference Platform: MetaTrader 5
Reference: https://www.metatrader5.com/en/

1. CORE OBJECTIVE

Current project ko superficial MT5-style UI mein convert nahi karna hai.

Existing project ke:

frontend
backend
database
authentication
wallet
financial system
trading engine
market-data system
admin panel
APIs
existing business logic
Cloudflare deployment
existing production functionality

sabko deeply inspect karke existing functionality ko preserve karte hue ek real production trading platform build karna hai.

Non-Negotiable Requirement

Platform ka primary purpose TRADING hona chahiye.

Har screen, API, database table, workflow aur user journey ko trading-centric architecture ke according design kiya jaye.

Mock trading, fake execution, simulated success, fake balances, hardcoded market prices ya frontend-only order execution acceptable nahi hai.

2. IMPORTANT MT5 SCOPE

MetaTrader 5 ko reference ke roop mein use karna hai, lekin proprietary MetaTrader 5 software ko copy/clone nahi karna hai.

Implement:

equivalent trading functionality
equivalent professional UX patterns
equivalent order-management capabilities
equivalent charting capabilities
equivalent portfolio/account functionality
equivalent risk controls
equivalent market-analysis functionality

Do NOT copy:

MetaQuotes proprietary source code
proprietary assets
proprietary branding
copyrighted UI assets
proprietary backend infrastructure

ETHSLTD ka independent implementation hona chahiye.

3. EXISTING PROJECT AUDIT — FIRST STEP

Development se pehle complete repository audit mandatory hai.

Agent ko automatically:

Frontend audit

Inspect:

all pages
routes
layouts
components
forms
modals
charts
tables
navigation
responsive layouts
loading states
error states
authentication state
wallet UI
trade UI
admin UI
Backend audit

Inspect:

all APIs
controllers
services
repositories
middleware
authentication
authorization
order logic
wallet logic
transaction logic
payment logic
notification logic
admin logic
validation
error handling
Database audit

Inspect:

all tables
columns
indexes
constraints
foreign keys
existing data
transactions
wallets
orders
trades
deposits
withdrawals
users
admin data
audit logs
risk records
Infrastructure audit

Inspect:

Cloudflare Workers
D1
R2
KV
Queues
Durable Objects
environment variables
secrets
deployment configuration
API domains
frontend domains
database bindings
Dependency audit

Identify:

chart libraries
websocket libraries
market-data providers
authentication packages
database packages
payment packages
wallet/blockchain packages
UI libraries
4. DO NOT BREAK EXISTING FUNCTIONALITY

Before modifying anything:

identify working functionality
identify broken functionality
identify duplicated functionality
identify obsolete functionality
identify incomplete trading functionality
identify database/API mismatches

Then:

Fix → Extend → Integrate

Do NOT:

create duplicate APIs
create duplicate tables unnecessarily
create duplicate wallet systems
create duplicate authentication systems
create parallel trading engines
replace working functionality without reason

Use DRY architecture.

5. TRADING TERMINAL ARCHITECTURE

Create a professional trading terminal with:

Main sections
Market Watch
Chart
Order Entry
Trade
Positions
Pending Orders
Market Depth
Account Information
History
Alerts
News
Economic Calendar
Wallet
Transactions
Reports
Settings

Desktop layout should support professional multi-panel trading.

Mobile layout must transform these into touch-friendly screens without removing core trading functionality.

6. MARKET WATCH

Market Watch must display real-time instruments.

Each instrument should support:

Symbol
Bid
Ask
Spread
Last Price
Change
Change %
High
Low
Open
Previous Close
Volume
Tick Volume
Trading Status
Market Status

Users must be able to:

search symbol
favorite symbol
remove favorite
reorder symbols
group symbols
open chart
open trade ticket
open Market Depth
inspect specification

No hardcoded prices.

7. INSTRUMENT SYSTEM

Every tradable asset must have a complete instrument specification.

Fields should include:

symbol
name
asset class
base asset
quote asset
contract size
tick size
tick value
minimum volume
maximum volume
volume step
price precision
trading hours
market status
margin requirement
leverage
commission
swap/financing
spread model
execution model
order types supported
minimum stop distance
maximum position size
risk limits
8. TRADING ACCOUNT

Account dashboard should display:

Balance
Equity
Used Margin
Free Margin
Margin Level
Unrealized P&L
Realized P&L
Credit
Available Withdrawal Balance
Total Deposits
Total Withdrawals
Total Fees

Account states:

Active
Restricted
Suspended
Closed
Under Review
9. NETTING + HEDGING

Support both accounting models.

Netting

One net position per instrument.

Additional trades increase/reduce the existing position.

Hedging

Multiple positions for the same instrument.

Users can have:

multiple long positions
multiple short positions
simultaneous long and short positions

Each position can have independent:

volume
entry price
Stop Loss
Take Profit
P&L
ticket
timestamp

MT5 officially supports both netting and hedging account systems.

10. ORDER SYSTEM

Implement complete professional order architecture.

Market Orders
Buy Market
Sell Market
Pending Orders
Buy Limit
Sell Limit
Buy Stop
Sell Stop
Stop Orders

Where supported by instrument/execution model.

Stop-Limit

Where supported by market.

Position protection
Stop Loss
Take Profit
Trailing Stop

MT5 supports market, pending and stop orders and trailing stop functionality.

11. ORDER LIFECYCLE

Every order must have a deterministic state machine.

Example:

CREATED

→ VALIDATING

→ ACCEPTED

→ ROUTING

→ PARTIALLY_FILLED

→ FILLED

or:

REJECTED

CANCELLED

EXPIRED

MODIFIED

No ambiguous order states.

Every state transition must be stored.

12. ORDER TICKET

Order ticket must show:

Symbol
Side
Order Type
Volume
Price
Stop Loss
Take Profit
Time in Force
Estimated Margin
Estimated Fee
Estimated Spread
Estimated Risk
Current Bid
Current Ask
Current Spread

Actions:

Buy
Sell
Place Order
Modify
Cancel
Close
13. TIME IN FORCE

Implement where applicable:

GTC
Day
IOC
FOK
GTD

Validate availability per instrument.

14. EXECUTION ENGINE

Trading execution must be backend-authoritative.

Frontend must NEVER decide whether an order succeeded.

Execution pipeline:

Client

→ API

→ Authentication

→ Risk Validation

→ Balance/Margin Validation

→ Order Validation

→ Execution Router

→ Liquidity/Market Data

→ Fill

→ Position Update

→ Wallet/Balance Update

→ Transaction Ledger

→ Notification

→ WebSocket Update

15. EXECUTION MODES

Architecture must support:

Instant Execution
Request Execution
Market Execution
Exchange Execution

MT5 documents these four execution modes.

The actual modes available must depend on the instrument/broker configuration.

16. PARTIAL FILLS

Orders must support partial execution.

Example:

Requested:

10 BTC

Executed:

4 BTC

Remaining:

6 BTC

System must correctly update:

order
execution
position
margin
fees
P&L
history

No double accounting.

17. POSITION MANAGEMENT

Each position must provide:

ticket
symbol
direction
volume
average entry
current price
stop loss
take profit
swap
commission
unrealized P&L
realized P&L
margin
opened at
updated at

Actions:

close
partial close
modify SL
modify TP
modify volume where supported
reverse position where supported
18. CLOSE POSITION

User must have an explicit way to complete/close an active trade.

This directly addresses the existing problem where an order can be placed but there is no proper completion/close workflow.

Implement:

Close Position
Close Partial
Close All
Close All Profitable
Close All Losing
Close Opposite
Close by Symbol

Confirmation must show:

current price
expected execution
volume
estimated P&L
fee
final execution result
19. CHARTING ENGINE

Create professional interactive charts.

Support:

Candlestick
Bar
Line

Support:

zoom
pan
crosshair
auto-scale
price scale
time scale
fullscreen
multiple charts
chart templates
layouts
symbol switching
timeframe switching

MT5 provides multiple chart types and extensive timeframe support.

20. TIMEFRAMES

Architecture should support:

M1
M2
M3
M4
M5
M6
M10
M12
M15
M20
M30
H1
H2
H3
H4
H6
H8
H12
D1
W1
MN1

MT5's current technical-analysis documentation lists 21 timeframes.

21. HISTORICAL DATA

Store and serve:

tick data where available
OHLC
volume
timestamp
bid
ask
trades

Charts must load historical data progressively.

Do not load enormous datasets in one browser request.

Use:

pagination
aggregation
caching
streaming
range queries
22. TECHNICAL INDICATORS

Build an extensible indicator engine.

At minimum support MT5-class indicators including:

Trend
Moving Average
Exponential Moving Average
Bollinger Bands
Envelopes
Ichimoku
Parabolic SAR
ADX
ADX Wilder
Oscillators
RSI
MACD
Stochastic
CCI
Momentum
Williams %R
DeMarker
Volume
OBV
Money Flow Index
Force Index
Volumes
Volatility
ATR
Standard Deviation

MT5 documentation currently describes 38 technical indicators and 44 analytical objects on its technical-analysis page.

23. DRAWING / ANALYTICAL TOOLS

Implement:

Trend Line
Horizontal Line
Vertical Line
Ray
Channel
Rectangle
Triangle
Ellipse
Fibonacci Retracement
Fibonacci Expansion
Fibonacci Arcs
Fibonacci Fan
Gann tools
Elliott tools
Pitchfork
Text
Labels
Arrow markers

Objects must be:

movable
editable
removable
persistable
per-chart
per-user
24. CHART TRADING

Users must be able to trade directly from charts.

Actions:

Buy
Sell
Place Limit
Place Stop
Modify SL
Modify TP
Close Position

Display:

entry lines
SL lines
TP lines
pending order lines
position labels
P&L
volume

MT5 Web supports one-click trading directly from charts and Market Depth.

25. ONE-CLICK TRADING

Optional setting:

Enable One-Click Trading

When enabled:

Buy executes immediately
Sell executes immediately

Show a strong warning before activation.

Store user's preference securely.

26. MARKET DEPTH / ORDER BOOK

Implement Level 2 / Market Depth where real market data supports it.

Display:

bid levels
ask levels
quantities
spread
cumulative volume
last trade
depth updates

Actions:

market buy
market sell
pending order
modify
cancel

MT5 Market Depth provides buy/sell offers and supports trading and stop-level management from the depth view.

27. SPREAD

Display:

Spread = Ask - Bid

Show:

points
quote currency value
percentage where meaningful

Spread must be calculated from actual market data.

28. P&L ENGINE

Implement:

Unrealized P&L

Based on current market price.

Realized P&L

Based on completed executions.

Net P&L

After:

commission
spread
swap/financing
other applicable fees

Precision must be asset-specific.

29. MARGIN ENGINE

Support:

Initial Margin
Maintenance Margin
Used Margin
Free Margin
Margin Level

Formula examples must be implemented according to configured instrument rules.

System must prevent orders that violate margin requirements.

30. LEVERAGE

Support configurable leverage.

Examples:

1x
2x
5x
10x
20x
50x
100x

Maximum leverage must be configurable by:

account
user
instrument
asset class
jurisdiction/risk policy

Never hardcode leverage.

31. STOP OUT / LIQUIDATION

Implement configurable:

warning level
margin call level
stop-out level

Process:

Margin Level falls

→ warning

→ restricted new orders

→ liquidation engine

→ close positions according to liquidation policy

→ update balance

→ record liquidation event

→ notify user

32. RISK MANAGEMENT

Implement:

max position size
max order size
max daily loss
max exposure
max leverage
max open positions
symbol exposure
account exposure
concentration limits
liquidation thresholds

Admin must be able to configure risk policies.

33. TRAILING STOP

Support:

fixed distance
percentage-based where applicable
activation threshold
step size

Trailing stop must be server-side and continue working even if the browser is closed.

34. ALERT SYSTEM

Users can create alerts based on:

price
percentage change
indicator value
position P&L
margin level
order status
execution
liquidation
deposit
withdrawal

Channels:

in-app
email
push
browser notification
35. FINANCIAL NEWS

Architecture should support market news.

News:

timestamp
source
title
summary
affected symbols
importance
36. ECONOMIC CALENDAR

Implement:

event
country
currency
time
impact
previous
forecast
actual

Filters:

date
country
currency
impact
37. FUNDAMENTAL ANALYSIS

Where data providers are available, support:

company information
earnings
financial ratios
dividends
corporate actions
economic data
macroeconomic events
38. TRADING HISTORY

Complete history must contain:

order history
execution/deal history
position history
deposits
withdrawals
fees
transfers
conversions
adjustments
liquidations

Filters:

date range
symbol
side
type
status
ticket

Export:

CSV
PDF where supported
39. ACCOUNT STATEMENT

Generate complete trading statement:

opening balance
deposits
withdrawals
trades
commissions
swaps
realized P&L
adjustments
closing balance
equity
performance
40. WALLET SYSTEM

Trading and wallet must be tightly integrated but logically separated.

Wallet supports:

Asset Account

For crypto/trading assets.

Example:

USDT
BTC
ETH
USDC
SOL
Currency Account

For supported fiat currencies.

Example:

USD
INR
EUR
GBP
41. WALLET LEDGER

Every wallet movement must create an immutable ledger entry.

Types:

Deposit
Withdrawal
Trading Credit
Trading Debit
Fee
Commission
Conversion
Transfer
Refund
Adjustment
Liquidation
Reward where applicable

Never update balance without ledger entry.

42. DEPOSIT

Support:

crypto deposit
bank deposit
payment gateway
supported external payment methods

Deposit flow:

Deposit Request

→ validation

→ payment/address generation

→ pending

→ confirmation

→ conversion if required

→ fee deduction

→ wallet credit

→ transaction ledger

→ notification

43. CRYPTO DEPOSIT

For supported blockchain assets:

Display:

asset
network
deposit address
QR
minimum deposit
confirmations required
memo/tag if applicable

Track:

tx hash
block
confirmations
amount
network
status

Statuses:

Pending
Confirming
Confirmed
Failed
Rejected
44. FIAT DEPOSIT

Support configurable:

bank transfer
payment gateway
manual deposit

Admin can configure:

account details
payment method
limits
fees
enabled/disabled status
45. DEPOSIT CONVERSION

If user deposits another asset/currency but trading account is USDT-based:

Example:

1 BTC

→ current configured BTC/USDT rate

→ gross USDT

→ deposit fee

→ net USDT

→ wallet credit

Every conversion must be visible in transaction history.

No duplicated transactions.

46. WITHDRAWAL

Support:

crypto withdrawal
fiat withdrawal

Flow:

Withdrawal Request

→ authentication

→ KYC/risk checks

→ balance check

→ available balance check

→ fee calculation

→ risk screening

→ approval

→ blockchain/bank execution

→ confirmation

→ ledger completion

47. WITHDRAWAL SECURITY

Require configurable:

password
OTP
2FA
email confirmation
withdrawal whitelist
cooldown
risk review

High-risk withdrawals can require admin approval.

48. WITHDRAWAL FEE

Support:

Fixed fee

Example:

10 USDT

Percentage

Example:

0.5%

Dynamic/network fee

Where applicable.

Show:

Requested Amount

Fee

Net Amount

before confirmation.

49. WALLET ↔ TRADING INTEGRATION

Trading must never directly mutate wallet balances without the accounting layer.

Architecture:

Wallet Ledger

→ Trading Account Balance

→ Margin Engine

→ Trading Engine

All balance changes must be atomic.

50. INTERNAL TRANSFERS

Support:

Wallet → Trading Account
Trading Account → Wallet
Asset → Asset where permitted
Currency → Currency where permitted

Every transfer requires ledger entries on both sides.

51. CURRENCY CONVERSION

Implement:

Source Asset

→ Exchange Rate

→ Fee

→ Destination Asset

Rates must be dynamically sourced/configured.

No hardcoded production rates.

52. FEES

Centralized fee engine.

Support:

trading fee
maker fee
taker fee
withdrawal fee
deposit fee
conversion fee
service fee
network fee
liquidation fee

Admin can configure fees without code changes.

53. MAKER / TAKER

Where applicable:

Maker fee
Taker fee

Fee tiers may depend on:

volume
account level
asset
instrument
54. REAL-TIME SYSTEM

Use WebSocket/SSE/realtime infrastructure for:

prices
order updates
fills
positions
P&L
wallet balance
market depth
alerts
notifications

Polling should not be the primary solution for high-frequency updates.

55. DATA CONSISTENCY

Frontend must never show stale fake state as confirmed state.

Example:

Order submitted:

Submitting

Then:

Accepted

Then:

Filled

Only after backend confirmation should UI show final execution.

56. IDEMPOTENCY

Every critical financial/trading request must support idempotency.

Especially:

order placement
order cancellation
close position
deposit credit
withdrawal
internal transfer
conversion

Duplicate requests must not duplicate money or trades.

57. DATABASE TRANSACTION SAFETY

Financial operations must be atomic.

Example:

Trade execution:

validate order
validate margin
create execution
update position
update balance
calculate fee
ledger entry
audit entry

Either all required operations succeed or the transaction is rolled back.

58. ORDER / DEAL / POSITION SEPARATION

Use separate concepts:

Order

User's instruction.

Deal / Execution

Actual fill.

Position

Current exposure.

Do not merge all three into one database object.

59. AUDIT LOG

Log:

login
logout
order creation
order modification
order cancellation
execution
position modification
deposit
withdrawal
wallet transfer
admin adjustment
fee change
risk-rule change

Include:

user
IP
device
timestamp
action
old value
new value
request ID
result
60. ADMIN TRADING CONSOLE

Admin must have:

live orders
live positions
executions
users
accounts
balances
deposits
withdrawals
risk
liquidations
fees
instruments
market data
trading configuration
audit logs
61. ADMIN ORDER MANAGEMENT

Admin can:

inspect order
inspect execution
inspect position
cancel pending order where permitted
restrict account
suspend trading
close positions under controlled emergency procedures
inspect audit trail

All privileged operations require audit logging.

62. INSTRUMENT ADMIN

Admin can configure:

symbol
status
trading hours
price precision
volume precision
min volume
max volume
leverage
margin
fees
swap
execution mode
supported order types
63. MARKET DATA ADMIN

Admin can configure market-data providers.

System should support provider abstraction:

Provider A

Provider B

Provider C

Do not tightly couple the trading engine to one provider.

64. FAILOVER

If primary market-data provider fails:

→ detect outage

→ switch to backup provider if configured

→ mark degraded state

→ prevent unsafe execution if reliable price cannot be established

Never trade using stale or invalid prices silently.

65. MARKET STATUS

Support:

Open
Closed
Pre-open
Post-market
Halted
Suspended
Maintenance
Data unavailable
66. TRADING RESTRICTIONS

Orders must be blocked when:

market closed
account suspended
insufficient balance
insufficient margin
symbol disabled
risk limit exceeded
withdrawal/account restriction relevant to risk
stale market data
maintenance mode
invalid order parameters

Return human-readable error messages.

67. MOBILE TRADING

Mobile experience must support:

Market Watch
Charts
Buy/Sell
Positions
Pending orders
History
Wallet
Deposits
Withdrawals
Alerts
Account information

MT5 mobile supports realtime quotes, full order functionality, charts, indicators, history, news and notifications.

68. RESPONSIVE DESIGN

Desktop:

Professional multi-column terminal.

Tablet:

Adaptive panels.

Mobile:

Bottom navigation / tabs with:

Markets
Trade
Positions
Wallet
More

No critical field should disappear merely because viewport is small.

69. AUTHENTICATION

Use one unified authentication system.

Support:

Login
Registration
Email verification
OTP
2FA
Password reset
Session management
Device management

No multiple competing session systems.

70. SESSION PERSISTENCE

After:

refresh
navigation
temporary network failure
reopening browser

authenticated state should remain valid according to configured session policy.

If user opens a trade ticket, authentication interruptions should return the user to the intended page where safe.

71. SECURITY

Implement:

CSRF protection
XSS protection
SQL injection protection
rate limiting
request signing where appropriate
secure cookies
token rotation
2FA
RBAC
audit logging
encrypted secrets
secure WebSocket authentication
72. RBAC

Roles:

User
Trader
Support
Expert
Admin
Super Admin

Permissions must be granular.

73. NOTIFICATIONS

Events:

order accepted
order rejected
order filled
partial fill
order cancelled
position closed
SL triggered
TP triggered
margin warning
liquidation
deposit received
withdrawal requested
withdrawal approved
withdrawal rejected
security event
74. PERFORMANCE

Trading terminal should remain responsive during:

high tick volume
multiple charts
multiple indicators
multiple open positions
Market Depth updates
large history datasets

Use:

Web Workers where appropriate
efficient chart rendering
incremental updates
memoization
caching
pagination
server-side aggregation
75. OBSERVABILITY

Implement:

structured logs
request IDs
execution IDs
error tracking
latency tracking
order rejection metrics
market-data latency
WebSocket health
queue health
database health
76. ERROR HANDLING

Never show generic:

Something went wrong

for financial operations.

Show useful errors:

Order rejected: insufficient free margin.

Withdrawal rejected: amount exceeds available balance.

Order rejected: market is currently closed.

77. NO FAKE SUCCESS

Never display:

Order Filled

until backend confirms an execution.

Never display:

Deposit Completed

until payment/blockchain/admin confirmation actually exists.

Never display:

Withdrawal Completed

until withdrawal execution is confirmed.

78. DEMO VS REAL

If demo functionality exists, it must be completely isolated from production funds.

Real account:

real wallet
real market data
real execution
real deposits
real withdrawals

Demo:

isolated balance
isolated trades
isolated database/account
no real financial movement

Never silently fallback from real to demo.

79. WALLET BALANCE PRECISION

Support asset-specific decimal precision.

Example:

BTC
ETH
USDT
USDC
SOL
fiat currencies

Do not round internally to 2 decimals.

UI may format values, but accounting must retain appropriate precision.

80. TRANSACTION LEDGER REQUIREMENT

The ledger is the source of truth.

Example deposit:

Step 1

Source Asset/Currency:

+1000 INR

Step 2

Conversion:

-1000 INR

Step 3

USDT conversion:

+USDT equivalent

Step 4

Fee:

-fee

Step 5

Final wallet credit:

+net USDT

Do not create duplicate balance credits.

81. WALLET RECONCILIATION

Admin must have reconciliation tools.

Compare:

ledger balance
wallet balance
trading balance
blockchain balance
payment-provider balance

Flag mismatches.

82. WITHDRAWAL RECONCILIATION

Every withdrawal must have:

internal withdrawal ID
external transaction ID
blockchain hash / bank reference
requested amount
fee
net amount
status
timestamp
83. CHART PERFORMANCE

Do not recreate chart component on every tick.

Use:

incremental candle updates
throttled rendering
data windowing
cached history
WebSocket delta updates
84. USER TRADING WORKSPACE

Users should be able to customize:

watchlist
chart layout
timeframe
indicators
drawings
order settings
one-click trading
dark/light theme
panels

Workspace preferences must persist.

85. MULTI-CHART

Support multiple charts on desktop.

Example:

BTC/USDT — 5m

BTC/USDT — 1h

ETH/USDT — 15m

ETH/USDT — 4h

Each chart has independent:

timeframe
indicators
drawings
layout
86. CHART TEMPLATES

Users can save:

indicators
drawings
timeframe
visual settings

as reusable templates.

87. TRADING JOURNAL

Provide optional trading journal:

trade
entry reason
exit reason
notes
screenshots
tags
strategy
result
88. PERFORMANCE ANALYTICS

Dashboard:

total trades
winning trades
losing trades
win rate
average win
average loss
profit factor
max drawdown
ROI
realized P&L
unrealized P&L
89. COPY TRADING ARCHITECTURE

If enabled later, architecture should support:

strategy providers
followers
allocation
proportional execution
risk limits
performance
fees

Do not implement fake copy trading.

90. ALGORITHMIC TRADING

Create an extensible strategy API.

Support:

automated order generation
market-data subscription
strategy execution
risk checks
order management

MT5's ecosystem includes Expert Advisors, algorithmic trading, MQL5 development, Market applications, Code Base, Signals and VPS functionality.

ETHSLTD should implement its own secure strategy/API architecture rather than copying MQL5.

91. STRATEGY API

Potential architecture:

Market Data

→ Strategy

→ Risk Engine

→ Order Engine

→ Execution

Strategies must NEVER bypass risk validation.

92. API DESIGN

Use versioned APIs:

/api/v1/...

Examples:

/api/v1/markets
/api/v1/symbols
/api/v1/quotes
/api/v1/orders
/api/v1/positions
/api/v1/executions
/api/v1/history
/api/v1/wallet
/api/v1/deposits
/api/v1/withdrawals
/api/v1/transfers
/api/v1/alerts
93. WEBSOCKET CHANNELS

Separate channels:

market quotes
candles
depth
orders
positions
account
wallet
notifications

Authorization must be enforced server-side.

94. DATABASE MODEL

At minimum evaluate/create normalized entities for:

users
accounts
sessions
instruments
market_data
candles
orders
order_events
executions
positions
position_events
balances
wallet_accounts
wallet_ledger
deposits
withdrawals
transfers
conversions
fees
risk_rules
margin_records
liquidation_events
alerts
notifications
audit_logs
admin_actions

Use existing tables where they already correctly represent the concept.

95. DATABASE MIGRATIONS

Every schema change requires:

migration
local validation
production/remote validation
rollback consideration
data-preservation check

Never delete production data casually.

96. EXISTING DATA

All existing valid production data must remain accessible.

Existing:

users
wallets
balances
transactions
orders
trades
deposits
withdrawals

must be migrated/linked safely.

Do not reset production database merely to implement the new trading engine.

97. ADMIN DASHBOARD

Create professional trading operations dashboard.

Cards:

Active Traders
Open Positions
Open Orders
Trading Volume
Deposits
Withdrawals
Exposure
Margin Risk
Liquidations
System Health
98. REAL-TIME ADMIN MONITORING

Admin should see live:

orders
fills
positions
risk events
deposits
withdrawals
failed transactions
market-data issues
99. SYSTEM MAINTENANCE

Admin controls:

trading enabled/disabled
deposits enabled/disabled
withdrawals enabled/disabled
specific symbol enabled/disabled
market-data provider
maintenance mode

Maintenance must not corrupt financial state.

100. BACKUP / RECOVERY

Critical data backup strategy:

database backups
wallet ledger backups
configuration backups
audit logs
R2 backups where applicable

Test restore procedure.

101. DISASTER RECOVERY

Define:

RPO
RTO
backup frequency
recovery process
provider failover
database recovery
market-data recovery
102. TESTING

Mandatory testing layers:

Unit
fee calculation
P&L
margin
order validation
conversion
wallet ledger
Integration
order → execution → position
deposit → wallet
withdrawal → execution
transfer → ledger
End-to-end
login
market selection
chart
order placement
order completion
close position
deposit
withdrawal
transaction history
103. FINANCIAL TEST CASES

Test:

exact balance
insufficient balance
insufficient margin
partial fill
full fill
order rejection
duplicate request
network retry
concurrent orders
concurrent withdrawals
liquidation
fee rounding
precision
currency conversion
rollback
104. CONCURRENCY TESTING

Test simultaneous:

orders
position modifications
closes
deposits
withdrawals

Prevent:

double spending
duplicate execution
duplicate wallet credit
negative balance caused by race condition
double withdrawal
105. SECURITY TESTING

Test:

authentication bypass
authorization bypass
IDOR
SQL injection
XSS
CSRF
WebSocket authorization
replay attacks
duplicate requests
rate limiting
privilege escalation
106. MOBILE QA

Test:

Android
iOS
Chrome mobile
Safari mobile
tablet
desktop

Special attention:

touch targets
chart gestures
order confirmation
keyboard behaviour
orientation
connection recovery
107. CONNECTION RECOVERY

When network disconnects:

Connected

→ Reconnecting

→ Connected

After reconnect:

resubscribe
reload account state
reload open orders
reload positions
reconcile wallet
reconcile market data

Do not assume missed events did not happen.

108. ORDER RECONCILIATION

After reconnect or uncertain execution:

Client must query authoritative backend state.

Never blindly resubmit an order.

109. LOGGING

Every trading request must have:

request ID
user ID
account ID
order ID
execution ID
timestamp
latency
result
110. PERFORMANCE TARGETS

Target:

fast initial terminal load
low quote-to-screen latency
low order submission latency
efficient WebSocket processing
no visible UI freezing
no unnecessary full-page reloads

Exact SLA must be finalized according to selected market-data/execution providers.

111. ACCESSIBILITY

Support:

keyboard navigation
focus states
readable contrast
screen reader labels
accessible dialogs
accessible tables
accessible order forms
112. LOCALIZATION

Architecture should support:

English
Hindi
future languages

Numbers, dates, currencies and trading terminology must be localization-aware.

113. MOBILE NOTIFICATIONS

Push notifications for:

order filled
SL
TP
margin warning
liquidation
deposit
withdrawal
security
114. EMAIL NOTIFICATIONS

Configurable templates for:

registration
login
security
order
deposit
withdrawal
risk
liquidation
115. USER SETTINGS

Settings:

trading confirmation
one-click trading
default order size
default SL
default TP
notification preferences
chart preferences
timezone
language
currency display
116. TRADING SHORTCUTS

Desktop keyboard shortcuts may include:

Buy
Sell
Close position
Cancel order
Change timeframe
Search symbol
Chart fullscreen

Shortcuts must never bypass required safety confirmations unless explicitly enabled.

117. MARKET SEARCH

Search should support:

symbol
name
asset
category

Example:

BTC

returns relevant BTC instruments.

118. FAVORITES

Users can create multiple watchlists:

Crypto
Forex
Stocks
Futures
Custom
119. PORTFOLIO

Portfolio screen:

total equity
allocation
unrealized P&L
realized P&L
exposure
available margin
wallet balance
trading balance
120. COMPLETE USER FLOW
Deposit

Login

→ Wallet

→ Deposit

→ Asset

→ Network/Payment Method

→ Amount

→ Fee

→ Confirmation

→ Processing

→ Confirmed

→ Wallet credited

Trading

Login

→ Market Watch

→ Select Symbol

→ Chart

→ Analyze

→ Buy/Sell

→ Order Ticket

→ Risk Validation

→ Execution

→ Position

→ Monitor P&L

→ Modify SL/TP

→ Close Position

→ Realized P&L

→ History

Withdrawal

Login

→ Wallet

→ Withdraw

→ Asset

→ Network/Bank

→ Address/Account

→ Amount

→ Fee

→ 2FA/OTP

→ Risk Check

→ Processing

→ Completed

→ Ledger

→ Notification

121. UX REQUIREMENT

The user should always understand:

what asset they are trading
what price they are getting
what volume they are trading
how much margin is required
what fee applies
whether the order is pending
whether it is filled
what position exists
how to close it
how much P&L they have
what wallet balance is available
122. CRITICAL FIX FOR CURRENT PROJECT

The current issue:

Order place ho raha hai but trade complete/close karne ka proper option nahi hai.

must be treated as a core trading-engine defect.

Required:

Place Order

→ Execution

→ Open Position

→ Position Management

→ Close Position

→ Execution

→ Realized P&L

→ History

This entire lifecycle must be tested end-to-end.

123. DO NOT CONFUSE ORDER WITH POSITION

Example:

User places:

BUY BTC/USDT 0.1

Order is not automatically the same thing as a position.

After execution:

Order:

FILLED

Execution:

BUY 0.1 @ price

Position:

LONG 0.1

When closed:

Execution:

SELL 0.1 @ exit price

Position:

CLOSED

History:

realized P&L.

124. PRODUCTION DATA RULE

All production values must come from backend/database/provider.

Never hardcode:

balances
prices
wallet values
fees
rates
leverage
order status
transaction status

unless they are explicit configurable defaults.

125. MT5 FEATURE COVERAGE MATRIX

Before completion, create a checklist with:

MT5 Capability	ETHSLTD Equivalent	Status
Market Watch	Market Watch	Required
Real-time Quotes	Streaming Market Data	Required
Charts	Trading Charts	Required
Multiple Timeframes	Timeframe Engine	Required
Indicators	Indicator Engine	Required
Analytical Objects	Drawing Engine	Required
Market Orders	Market Orders	Required
Pending Orders	Pending Orders	Required
Stop Orders	Stop Orders	Required
Trailing Stop	Trailing Stop	Required
Market Depth	Order Book	Required
One Click Trading	One Click Trading	Required
Netting	Netting	Required
Hedging	Hedging	Required
Trade History	Trade History	Required
Account History	Account History	Required
Alerts	Alert Engine	Required
News	Market News	Required
Economic Calendar	Economic Calendar	Required
Algorithmic Trading	Strategy API	Required/Phased
Copy Trading	Copy Trading	Architecture Ready
Mobile Trading	Responsive Mobile Terminal	Required
Web Trading	Web Terminal	Required
Wallet	Wallet	Required
Deposit	Deposit Engine	Required
Withdrawal	Withdrawal Engine	Required
Risk Management	Risk Engine	Required
Margin	Margin Engine	Required
Liquidation	Liquidation Engine	Required
Audit	Audit System	Required
126. MT5 FEATURE PARITY CHECK

The official MT5 documentation currently identifies capabilities including:

multi-asset trading
netting
hedging
full order types
multiple execution modes
Market Depth
technical analysis
algorithmic trading
Expert Advisors
copy trading/signals
alerts
VPS
mobile
web trading
fundamental analysis
economic/news functionality

These should be mapped individually rather than treating “MT5 support” as a single feature.

127. PHASED IMPLEMENTATION
Phase 1 — Audit

Complete project audit.

Deliver:

architecture report
database report
API report
trading-flow report
bug report
dependency report
Phase 2 — Trading Core

Implement:

instruments
market data
order engine
execution
positions
P&L
margin
risk
Phase 3 — Terminal

Implement:

Market Watch
charts
indicators
drawings
order ticket
trade panel
history
Market Depth
Phase 4 — Wallet

Implement:

wallet
ledger
deposit
withdrawal
conversion
fees
reconciliation
Phase 5 — Advanced

Implement:

alerts
news
economic calendar
strategy API
algorithmic trading
advanced analytics
Phase 6 — Admin

Implement:

instruments
market data
risk
fees
users
accounts
orders
positions
deposits
withdrawals
reconciliation
audit
Phase 7 — QA

Perform:

unit testing
integration testing
E2E
security testing
concurrency testing
mobile testing
production smoke testing
128. DEFINITION OF DONE

The project is NOT complete merely because:

pages exist
buttons exist
charts render
orders appear in UI

It is complete only when:

Trading
real market data works
order validation works
orders execute correctly
positions open
positions modify
positions close
P&L calculates correctly
fees calculate correctly
margin works
liquidation works
Wallet
deposits work
withdrawals work
conversions work
fees work
ledger works
balances reconcile
Data
database is authoritative
no duplicate financial records
no stale fake balances
no inconsistent order state
Security
authorization works
financial operations are protected
audit trail exists
duplicate requests are prevented
UX
desktop works
mobile works
connection recovery works
errors are understandable
trading workflow is complete
129. FINAL AGENT INSTRUCTION

Before writing or modifying code:

STOP and inspect the entire existing project.

Do not immediately start creating new components.

First understand:

existing architecture
existing database
existing APIs
existing trading implementation
existing wallet
existing authentication
existing deployment
existing Cloudflare resources
existing data

Then produce an internal implementation map.

After that:

Fix existing trading architecture.
Extend existing systems wherever possible.
Remove duplicate/obsolete logic.
Implement missing MT5-class functionality.
Integrate wallet and trading correctly.
Preserve existing production data.
Validate local database.
Validate remote/production database.
Run automated tests.
Run complete E2E trading workflow.
Test deposit.
Test withdrawal.
Test position close.
Test P&L.
Test concurrent requests.
Test mobile.
Test reconnect.
Deploy only after all critical checks pass.
130. FINAL ACCEPTANCE TEST

A fresh user must be able to perform this complete journey:

Register

→ Login

→ Open Trading Terminal

→ Select Instrument

→ View Live Price

→ Open Chart

→ Apply Indicator

→ Analyze

→ Place Market Buy

→ Order Accepted

→ Order Filled

→ Position Opened

→ View Unrealized P&L

→ Set Stop Loss

→ Set Take Profit

→ Modify Position

→ Partial Close

→ Final Close

→ Realized P&L

→ Trade History

→ Wallet

→ Deposit

→ Balance Updated

→ Trade Using Balance

→ Withdraw

→ Security Verification

→ Withdrawal Processing

→ Withdrawal Completed

→ Wallet Ledger

→ Account Statement

Every step must work with real backend state and must survive page refresh/reconnection.

131. MOST IMPORTANT PRINCIPLE

ETHSLTD should become a complete trading platform, not an MT5-looking website.

The target is:

Professional Trading Terminal + Real Trading Engine + Risk Engine + Wallet + Deposit + Withdrawal + Market Data + Advanced Analysis + Administration + Audit + Production Reliability.

Every feature must be:

functional
backend-connected
database-backed
secure
auditable
responsive
production-ready
tested

No mock implementation.

No fake data.

No fake order completion.

No fake wallet balance.

No duplicate financial records.

No hidden broken workflows.

No “coming soon” replacement for required core trading functionality.