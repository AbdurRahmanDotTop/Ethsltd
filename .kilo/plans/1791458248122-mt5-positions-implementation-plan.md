# Positions Functionality — Root-Cause Analysis & MT5 Flow Implementation Plan

## 1. Root-Cause Analysis

### Status Summary
The backend `services/api/src/routes/trading.ts` already contains a largely correct real-data implementation:
- `POST /orders` creates orders + positions (for MARKET) + trades inside a DB transaction
- `GET /positions` fetches real positions from DB by `userId`
- `POST /positions/:id/close` closes positions, calculates PnL, updates wallet

However, critical gaps break the MT5 flow end-to-end. Below are the root causes.

---

### RC-1: Matching Engine Never Called (CRITICAL)
- **Location:** `services/api/src/routes/trading.ts:20` — `import { processOrderMatching } from '../services/matching-engine'`
- **Problem:** The import exists but `processOrderMatching` is **never invoked** anywhere in the order placement handler (lines 426-709). The function in `services/api/src/services/matching-engine.ts` is dead code.
- **Impact:** LIMIT orders are accepted (`ACCEPTED` status), wallet funds are locked, but orders are **never matched** against existing limit orders. They sit forever unfilled. No position is ever created for LIMIT orders.

### RC-2: LIMIT Orders Never Create Positions (CRITICAL)
- **Location:** `services/api/src/routes/trading.ts:609` — `if (type === 'MARKET') { ... create position ... }`
- **Problem:** Position creation is gated behind `if (type === 'MARKET')`. LIMIT orders only get `ACCEPTED` status. Since the matching engine is never called, LIMIT orders never transition to `FILLED` and never create a position.
- **Impact:** User places a LIMIT Buy → no position appears in Positions tab. MT5 flow breaks at "Order Confirmation → Position Created".

### RC-3: No Order→Position Traceability (CRITICAL)
- **Location:** `database/schema/trading.ts` — `orders` table (lines 28-46) and `positions` table (lines 48-68)
- **Problem:** Neither table has a foreign key linking orders to positions:
  - `orders` has no `positionId` column
  - `positions` has no `orderId` column
- **API Response:** `POST /orders` returns `{ success, orderId, order }` (line 704) — **no `positionId`**
- **Frontend:** `OrderSuccessModal.tsx` displays the `order` object (order data only, not position data)
- **Impact:** Cannot trace which order created which position. Frontend can't link the success modal to the actual position.

### RC-4: OneClickTrading Bypasses API Client (MODERATE)
- **Location:** `apps/web/src/components/trading/OneClickTrading.tsx:22-27`
- **Problem:** Uses raw `fetch()` with `localStorage.getItem('token')` for auth instead of `apiClient`. Since auth uses HTTP-only cookies (see `api-client/src/index.ts:17-18`), `localStorage` has no token. OneClickTrading will fail with 401.
- **Impact:** One-click trading from MarketWatch/MobileMT5Chart won't work.

### RC-5: Hardcoded 100× Leverage (MODERATE)
- **Location:** `services/api/src/routes/trading.ts:521` — `let spendAmount = totalValue.div(100); // hardcoded leverage 100`
- **Location:** `services/api/src/routes/trading.ts:612` — `const marginRequired = totalValue.div(100)`
- **Problem:** Leverage is always 100× with no user configuration. The `markets` table has a `max_leverage` column (added in `0007_dark_swarm.sql:59`, never subsequently dropped) but it's not in the Drizzle schema (`database/schema/trading.ts`) and not used in the order handler.
- **Impact:** All trades use 100× regardless of market or user preference.

### RC-6: Mock/Demo Data in SQL Dumps (MODERATE)
- **Locations:** `services/api/merge_data_only.sql:3304`, `services/api/merge.sql:3624`, `services/api/backup_current_sept26_state.sql:3614`, `services/api/backup_pre_restore_2026_10_03.sql:3624`
- **Problem:** All SQL dump files contain a hardcoded DEMO position INSERT that references a `mode` column:
  ```sql
  INSERT OR IGNORE INTO "positions" (...,"mode","side","status",...)
  VALUES('POS-1786896509616',...,'DEMO','LONG','OPEN',...)
  ```
  Migration `0021_wise_risque.sql:8` explicitly drops the `mode` column from the `positions` table, so these INSERTs reference a nonexistent column and would FAIL on restore. Additionally, the demo position uses a hardcoded user_id (`4c3b7525-accc-42cc-b218-8d877542f9ad`), mock price (`104250`), static timestamp (`1786896509`), and fake trades reference `'mock-taker-order'`.
- **Impact:** Attempting to restore these SQL dumps will fail (column mismatch), or if they were restored against an older schema, they inject fake position data visible to the demo user.

### RC-7: Schema Drift — Drizzle vs DB Migrations (MODERATE)
- **Drizzle schema** (`database/schema/trading.ts`) lacks columns present in migrations:
  - `markets` table: missing `maxLeverage` string column (added in `0007_dark_swarm.sql:59` as text)
  - `markets` table: missing `tickValue` is present in Drizzle but verify
  - `orders` table: missing `stopLoss`, `takeProfit` columns (added in `0023_add_mt5.sql:24-26`)
  - `positions` table: missing `stopLoss`, `takeProfit` columns (added in `0023_add_mt5.sql:28-30`)
  - `positions` table: missing `closedAt` timestamp column (needed for close time tracking)
  - `wallets` table: `database/schema/wallets.ts` missing `escrowBalance` column (added `0007`, dropped `0022` — actually final state has NO escrow_balance)
  - `wallets` table: missing `type` column was added then dropped — final state has neither
- **Note:** Migration `0021_wise_risque.sql` drops `mode` columns from all trading tables. Migration `0022_futuristic_doctor_spectrum.sql` drops P2P tables and `escrow_balance` from wallets. **These columns should NOT be re-added.**
- **Admin trading route** (`services/api/src/routes/admin/trading.ts:344`): uses `require('../../utils/mt5-client')` — wrong path; the file is at `services/api/src/services/mt5-client.ts`. Line 371 references `closedAt` column that doesn't exist in Drizzle schema.

### RC-8: No Real-Time Position Updates (MODERATE)
- **Location:** `services/api/src/routes/ws.ts` — WebSocket only streams ticker (`type: 'ticker'`) and orderbook data from Binance/MEXC.
- **Problem:** No WebSocket messages are sent when:
  - A position is created (after order execution)
  - A position is closed
  - Position unrealized PnL updates
- **Frontend:** `positions/page.tsx` polls every 3s. `TradingHistoryTabs.tsx` polls every 5s. No server push.
- **Impact:** Stale data between polls. No live position updates like MT5.

### RC-9: Risk Engine PnL Calculation Mismatch (MODERATE)
- **Risk engine** (`services/api/src/services/risk-engine.ts:42`): `pnl = currentPrice.minus(entry).times(amount);` — **no `contractSize`**
- **Trading route** (`services/api/src/routes/trading.ts:831`): `(currentPrice - entry) * amount * contractSize` — includes `contractSize`
- **Impact:** Risk engine closes positions at different PnL values than what the trading API reports. Can cause wallet equity mismatches.

### RC-10: OrderSuccessModal Uses Temporary Store State (LOW-MODERATE)
- **Location:** `apps/web/src/components/trading/OrderSuccessModal.tsx` — reads `successOrder` from `useTradingUIStore`
- **`trading-ui-store.ts:14`** — `successOrder: any | null`
- **Problem:** This is temporary in-memory state. On refresh/navigation, it's lost. The modal shows order data (not position data). For LIMIT orders, showing "Done" is misleading since no position was created.
- **Impact:** After placing a MARKET order, the modal shows order info, then navigates to positions page which fetches real data. The modal is disconnected from the actual position.

### RC-11: OrderBook Status Filter Mismatch (MODERATE)
- **Location:** `services/api/src/routes/trading.ts:208-209`
- **Problem:** Orderbook endpoint filters for `o.status === 'OPEN' || o.status === 'PARTIALLY_FILLED'` but order creation sets LIMIT orders to `'ACCEPTED'` (line 598). So LIMIT orders never appear in the orderbook.
- **Impact:** Orderbook depth is incomplete. Users can't see existing LIMIT orders, so the matching engine will never find liquidity even if called.

### RC-12: Risk Engine Does NOT Use Transaction Wrapper (MODERATE)
- **Location:** `services/api/src/services/risk-engine.ts:130` — uses `db.transaction(async (tx) => { ... })` directly
- **Problem:** Does NOT use the `runTx` wrapper from `trading.ts` that handles D1 fallback. If D1 transactions fail, the risk engine close will fail without the fallback.
- **Impact:** Risk engine position closure may fail during D1 transaction issues.

---

## 2. Demo/Mock Data Sources & Removal Plan

| Source | Type | Action |
|--------|------|--------|
| `services/api/merge_data_only.sql:3304` | Hardcoded DEMO position INSERT | Delete INSERT line + related trade INSERTs |
| `services/api/merge.sql:3624` | Same hardcoded DEMO position | Delete INSERT line + related trades |
| `services/api/backup_current_sept26_state.sql:3614` | Same DEMO position | Delete INSERT line + related trades |
| `services/api/backup_pre_restore_2026_10_03.sql:3624` | Same DEMO position | Delete INSERT line + related trades |
| `services/api/merge_data_only.sql:3305-3306` | Mock DEMO trades | Delete both INSERT lines |
| `services/api/merge.sql:3628-3629` | Same mock trades | Delete both INSERT lines |
| `services/api/backup_current_sept26_state.sql:3628-3629` | Same mock trades | Delete both INSERT lines |
| `services/api/backup_pre_restore_2026_10_03.sql:3628-3629` | Same mock trades | Delete both INSERT lines |
| `services/api/merge_data_only.sql:3302-3303` | Mock payment methods | Delete (demo-only, not related to trading) |
| `services/api/merge.sql:173-208` | Demo wallets with `'DEMO'` type | Update to remove type column references |
| `services/api/merge_data_only.sql:173-208` | Same demo wallets | Same fix |
| `services/api/backup_current_sept26_state.sql:173-179` | Demo wallets | Same fix |
| `services/api/backup_pre_restore_2026_10_03.sql:173-180` | Demo wallets | Same fix |
| `services/api/merge_data_only.sql:2300-2301` | Demo wallet_transactions with `mode` | Delete or fix |
| `services/api/merge.sql:2300-2301` | Same demo transactions | Delete or fix |
| `services/api/merge.sql:1870` | Demo order with `status:'OPEN'` | Fix to `'ACCEPTED'` if retained |
| `services/api/merge.sql:1871` | Demo order with `status:'CANCELED'` | Delete if demo |
| `services/api/backup_current_sept26_state.sql:1862-1863` | Demo orders with `mode` | Fix or delete |
| `services/api/backup_pre_restore_2026_10_03.sql:1862-1863` | Same demo orders | Fix or delete |
| `services/api/merge_data_only.sql:1870-1871` | Same demo orders | Fix or delete |
| `services/api/merge_data_only.sql:1894-1895` | Demo P2P ads (dropped tables) | Delete entirely (P2P tables dropped in 0022) |

**Note:** The `MarketWatch.tsx:24` fake bid/ask spread (`m.price * 0.0001`) is for UI display only and is acceptable — it derives from real market prices, not mock data. Same for `EconomicCalendar.tsx` mock events which are informational. These are not trading data.

---

## 3. Complete MT5 Data Flow (Expected vs Current)

### MT5 Expected Flow
```
Quotes (MEXC/Binance) → Symbol Page → Buy/Sell Click → 
  Order Validation → Wallet Balance Check → 
  Order Creation (ACCEPTED) → Matching Engine → 
  Order Filled → Position Created (OPEN) → 
  Wallet Debited (Margin) → Position Visible in UI → 
  Real-time PnL Updates → Close Position → 
  Wallet Credited (Margin + PnL) → Position CLOSED → 
  Trade History Updated
```

### Current Flow (MARKET orders only)
```
Quotes → Symbol Page → Buy/Sell Click → 
  Order Validation → Wallet Balance Check → 
  Order Creation (OPEN→ROUTING→FILLED) → 
  Position Created (OPEN) → Wallet Debited → 
  Position Visible (via polling) → 
  Close Position → Wallet Credited
```

### Current Flow (LIMIT orders — BROKEN)
```
Quotes → Symbol Page → Buy/Sell Click → 
  Order Validation → Wallet Balance Check → 
  Order Creation (ACCEPTED) → 
  ⛔ Matching Engine Never Called → 
  ⛔ Order Never Fills → 
  ⛔ No Position Created → 
  ✗ Position NOT Visible → 
  ⛔ Funds Stuck in Locked Balance
```

### Gap Analysis

| MT5 Step | Current Status | Gap |
|----------|---------------|-----|
| Order Validation | ✅ Real price fetch + validation | Leverage hardcoded |
| Wallet Balance Check | ✅ Inside transaction | — |
| Order Creation | ✅ Order record persisted | Missing `orderId←→positionId` linkage |
| Matching Engine | ⛔ Never called | Dead code; LIMIT orders never match |
| Orderbook Display | ⛔ Filters 'OPEN' but orders are 'ACCEPTED' | LIMIT orders invisible in orderbook depth |
| Position Created | ✅ (MARKET only) | LIMIT orders never create positions |
| Wallet Debited | ✅ (MARKET only) | Matching engine wallet settlement not wired |
| Position Visible | ✅ (via polling) | No real-time WS push |
| Real-time PnL | ✅ (on poll) | No WS live updates |
| Close Position | ✅ Works | PnL calc mismatch with risk engine; no closedAt |
| Trade History | ✅ Works | No closePrice/closedAt tracking |

---

## 4. Required Changes (Backend)

### 4.1 New Migration (`database/migrations/0025_positions_enhancements.sql`)
```sql
-- Add order↔position linkage
ALTER TABLE `orders` ADD `position_id` text REFERENCES `positions`(`id`);
ALTER TABLE `positions` ADD `order_id` text REFERENCES `orders`(`id`);

-- Add close tracking
ALTER TABLE `positions` ADD `closed_at` integer;
ALTER TABLE `positions` ADD `close_price` text;

-- Add mode column (re-add since 0021 dropped it, but we need it for REAL/DEMO isolation)
-- NOTE: Migration 0021 dropped mode columns intentionally. If we need REAL/DEMO isolation,
-- we should re-add mode. Confirm with team if mode separation is needed.
-- Recommendation: Skip mode column; the codebase has moved away from DEMO/REAL separation
-- in the DB layer. Mock data is handled at SQL dump level only.

-- Fix markets schema drift
-- max_leverage already exists in DB from migration 0007 but missing from Drizzle

-- Add idempotency key support to prevent duplicate processing
ALTER TABLE `orders` ADD `idempotency_key` text;
```

### 4.2 Update Drizzle Schema (`database/schema/trading.ts`)

**Add to `markets` table:**
```typescript
maxLeverage: text('max_leverage').notNull().default('100'),  // from migration 0007
```

**Add to `orders` table:**
```typescript
positionId: text('position_id').references(() => positions.id),
idempotencyKey: text('idempotency_key'),
```
Also add `stopLoss` and `takeProfit` (these exist in DB from migration 0023 but missing from Drizzle):
```typescript
stopLoss: text('stop_loss'),
takeProfit: text('take_profit'),
```

**Add to `positions` table:**
```typescript
orderId: text('order_id').references(() => orders.id),
closedAt: integer('closed_at', { mode: 'timestamp' }),
closePrice: text('close_price'),
stopLoss: text('stop_loss'),  // from migration 0023
takeProfit: text('take_profit'),  // from migration 0023
```

### 4.3 API Route Changes (`services/api/src/routes/trading.ts`)

**POST /orders — Unified Flow with Matching Engine:**

Refactor the `POST /orders` handler to:

1. **Validate** market, amount, price bounds (existing logic, lines 434-513)
2. **Fetch real-time price** via `getRealPrice` (existing, lines 466-491)
3. **Calculate margin** using configurable leverage from `max_leverage`:
   ```typescript
   const marketMaxLeverage = new Decimal(marketInfo.maxLeverage || '100');
   const requestedLeverage = new Decimal(String(body.leverage || '100'));
   const leverage = Decimal.min(requestedLeverage, marketMaxLeverage);
   const marginRequired = totalValue.div(leverage);
   ```
4. **Idempotency key**: Accept `idempotencyKey` from request body, check for existing order with same key+userId before creation.
5. **Inside single transaction** (runTx):
   a. Check wallet balance (has funds for margin + commission)
   b. Debit wallet: `balance -= (margin + commission)`, `lockedBalance += margin`
   c. Create order record with `status: 'ACCEPTED'` for LIMIT, `'ROUTING'` for MARKET
   d. **Call matching engine** for ALL order types:
      ```typescript
      const matchResult = await processOrderMatching(tx, newOrder, marketInfo, user.id);
      ```
   e. Update taker order status based on matchResult:
      - If fully filled → `FILLED`
      - If partially filled → `PARTIALLY_FILLED`
      - If not filled → keep `ACCEPTED` (for LIMIT)
   f. **If order has fills** (matched or B-Book):
      - Create position record linked via `orderId` and `positionId`
      - Update order with `positionId`
   g. **If LIMIT order with no match**: refund locked margin, order stays `ACCEPTED`
6. **Return response** including `positionId` if position was created:
   ```typescript
   return c.json({ success: true, orderId, positionId, order: finalOrder, position: finalPosition });
   ```

**Position creation after matching (shared logic for MARKET + matched LIMIT):**
```typescript
// After processOrderMatching, if matchResult.remainingToFill is 0 or matched:
if (new Decimal(matchResult.totalFilledAmount).gt(0)) {
  const positionId = crypto.randomUUID();
  await tx.update(orders).set({ positionId }).where(eq(orders.id, orderId));
  
  await tx.insert(positions).values({
    id: positionId,
    orderId,
    displayId: positionDisplayId,
    userId: user.id,
    marketSymbol: market,
    side: side === 'BUY' ? 'LONG' : 'SHORT',
    status: 'OPEN',
    leverage: leverage.toString(),
    marginType: 'ISOLATED',
    marginAmount: marginRequired.toString(),
    entryPrice: matchResult.averagePrice,
    stopLoss: stopLoss || null,
    takeProfit: takeProfit || null,
    liquidationPrice: side === 'BUY' 
      ? new Decimal(matchResult.averagePrice).times(0.99).toString()
      : new Decimal(matchResult.averagePrice).times(1.01).toString(),
    amount: matchResult.totalFilledAmount,
    commission: commissionFee.toString(),
    createdAt: new Date(),
    updatedAt: new Date(),
  });
}
```

**Order status fix for LIMIT order lifecycle:**
- Change LIMIT order initial status from `ACCEPTED` to `OPEN` (to match orderbook filter) OR change orderbook filter to match `ACCEPTED`
- Recommendation: Change orderbook filter to include `ACCEPTED` status. This avoids changing the status semantics that the matching engine already relies on.

**Orderbook endpoint fix (line 208-209):**
```typescript
const openOrders = activeOrders.filter((o: any) => 
  (o.status === 'OPEN' || o.status === 'ACCEPTED' || o.status === 'PARTIALLY_FILLED')
);
```

**GET /positions — Enhanced:**
- Already mostly correct. Add `orderId` to response for traceability.
- Add `closePrice` and `closedAt` to response for closed positions.
- Return `leverage` field.

**POST /positions/:id/close — Enhanced:**
- Use shared `closePositionAtomic` service (extracted from risk-engine.ts `internalClosePosition`)
- Add `closedAt` and `closePrice` to position update.
- Record a closing trade history entry.
- Use `runTx` wrapper for D1 fallback support.

### 4.4 Shared Position Close Service

Create `services/api/src/services/position-service.ts`:
```typescript
import { positions, orders, markets, wallets, walletTransactions, trades } from 'database';
import { eq, and } from 'drizzle-orm';
import Decimal from 'decimal.js';

export async function closePositionAtomic(
  tx: any,
  positionId: string,
  userId: string,
  closeAmount: Decimal | null,
  userEmail: string | null
) {
  // 1. Fetch position
  // 2. Calculate PnL using contractSize
  // 3. Update position (CLOSED, set closedAt, closePrice, realizedPnl)
  // 4. Update wallet (unlock margin + PnL)
  // 5. Create wallet transaction record
  // 6. Create closing trade record
  // Return: { pnl, releasedMargin, totalReturn }
}
```

Both `POST /positions/:id/close` and `risk-engine.ts:internalClosePosition` call this.

### 4.5 PnL Calculation Consistency Fix

Update `services/api/src/services/risk-engine.ts:42`:
```typescript
// Current (wrong):
pnl = currentPrice.minus(entry).times(amount);

// Fixed (matching trading route):
const contractSize = new Decimal(marketInfo?.contractSize || '1');
pnl = currentPrice.minus(entry).times(amount).times(contractSize);
```

Need to fetch marketInfo for each position in the risk engine loop (line 32-34 area).

### 4.6 API Response Including Position Data

**POST /orders response** must include position info:
```typescript
return c.json({ 
  success: true, 
  orderId, 
  positionId,
  order: finalOrder, 
  position: finalPosition  // NEW: position object for frontend display
});
```

### 4.7 Remove Mock/Demo SQL Data

Delete or update the hardcoded INSERT statements from:
- `merge_data_only.sql` (lines 173-208 wallets, 1870-1871 orders, 3304 positions, 3305-3306 trades)
- `merge.sql` (lines 173-208 wallets, 1870-1871 orders, 3624 positions, 3628-3629 trades)
- `backup_current_sept26_state.sql` (lines 165-172 wallets, 1862-1863 orders, 3614 positions, 3628-3629 trades)
- `backup_pre_restore_2026_10_03.sql` (lines 173-179 wallets, 1862-1863 orders, 3624 positions, 3628-3629 trades)

The wallet INSERTs reference a `type` column that was dropped in migration 0021 — remove the `type` column from all INSERT statements. The position and order INSERTs reference `mode` column — remove it from INSERT column lists.

### 4.8 WebSocket Position Updates

**File:** `services/api/src/routes/ws.ts`
- Extend WebSocket handler to accept `subscribePositions` message
- When authenticated user subscribes, store their session in a Map
- On position creation/close (in trading routes), broadcast to subscribed sessions:
  ```typescript
  server.send(JSON.stringify({ type: 'position_update', userId, positionId, action: 'CREATED'|'CLOSED' }));
  ```
- On frontend, listen for `position_update` messages and refresh position data

---

## 5. Required Changes (Frontend)

### 5.1 Trading UI Store (`apps/web/src/stores/trading-ui-store.ts`)
Add `successPosition` field alongside `successOrder`:
```typescript
successPosition: any | null;
setSuccessPosition: (position: any | null) => void;
```

### 5.2 OrderEntry (`apps/web/src/components/trading/OrderEntry.tsx`)
- Update `onSubmit` to handle `positionId` and `position` from response
- Store both `successOrder` and `successPosition`
- Differentiate messaging: LIMIT = "Order Accepted", MARKET = "Position Opened"
- Add leverage input field (default 100, capped by market's max_leverage)

### 5.3 OrderSuccessModal (`apps/web/src/components/trading/OrderSuccessModal.tsx`)
- Display position data (symbol, side, volume, entry price, leverage) when `successPosition` is available
- Show order status: FILLED for filled orders, ACCEPTED for pending LIMIT orders
- On "DONE", navigate to `/positions` (already does this)

### 5.4 OneClickTrading (`apps/web/src/components/trading/OneClickTrading.tsx`)
- Replace raw `fetch()` with `apiClient.createOrder()`
- Remove `localStorage.getItem('token')`
- Use `apiClient` which automatically includes the session cookie

### 5.5 Positions Page (`apps/web/src/app/positions/page.tsx`)
- Already fetches from real API. Remove the "fallback to zero" portfolio block (line 27-36) — show error instead of fake zeros
- Add position close price/closedAt display for recently closed positions

### 5.6 TradingHistoryTabs (`apps/web/src/components/trading/TradingHistoryTabs.tsx`)
- Already fetches from real API via `apiClient.getPositions()`, `apiClient.getOrders()`, `apiClient.getTrades()`
- Add `closePrice` column to closed positions table
- Ensure positions table includes `orderId` for traceability

---

## 6. Position Creation, Persistence, Retrieval & Synchronization Strategy

### 6.1 Creation (Order → Position)
```
User clicks BUY/SELL
  → OrderEntry.onSubmit()
  → apiClient.createOrder({ market, side, type, amount, price, leverage, stopLoss, takeProfit })
  → POST /api/v1/trading/orders
  → Backend: validate → price fetch → wallet lock → order insert → matching engine
  → If matched/filled: create position (linked via orderId/positionId)
  → Response: { orderId, positionId, order, position }
  → Frontend: store position → show success modal → navigate to /positions
```

### 6.2 Persistence
- Position persisted in `positions` table within same DB transaction as order + wallet debit
- `orderId` FK links back to creating order
- `positionId` FK on order links forward

### 6.3 Retrieval
- `GET /positions` queries `positions WHERE userId = ?` from DB
- Returns all statuses (OPEN + CLOSED), frontend filters
- Price updated in real-time via:
  - Poll every 3s (current approach)
  - WebSocket push (new enhancement)

### 6.4 Synchronization
- WebSocket `/ws/stream` extended to send `position_update` events
- Frontend subscribes to position updates after order creation
- On `position_update`, refresh position data from API
- Polling as fallback (3s interval in positions page)

---

## 7. Real-Time Update Strategy

### Current
- WebSocket streams ticker + orderbook from Binance/MEXC only
- Positions page polls every 3s

### Proposed
1. **Extend WebSocket handler** (`ws.ts`):
   - Accept `subscribePositions` message from authenticated clients
   - Store subscriber session IDs in a Map keyed by userId
2. **Backend broadcast**: In `POST /orders` and `POST /positions/:id/close`, after DB commit, emit WebSocket message:
   ```typescript
   { type: 'position_update', userId, positionId, action: 'CREATED'|'CLOSED' }
   ```
3. **Frontend subscription**: `positions/page.tsx` connects to WS, subscribes to own positions, refreshes on message

---

## 8. Expected Behavior: Buy/Sell

### Buy (LONG) Market Order
1. User clicks BUY → OrderEntry submits MARKET/BUY order
2. Backend: fetch real price → calculate margin (default 100x) → check wallet → lock margin → create order
3. Matching engine called → B-Book auto-fill (or match against asks) → position created (linked to order)
4. Wallet: balance -= (margin + commission), lockedBalance += margin
5. Response: `{ orderId, positionId, order, position }`
6. Frontend: show "Position Opened" modal with position details
7. Navigate to /positions → fetch from API → show real position with live PnL

### Sell (SHORT) Market Order
Same flow but side=SHORT, wallet locked in quote asset, PnL = (entry - current) * amount * contractSize

### Buy/Sell Limit Order
1. User clicks BUY/SELL LIMIT → OrderEntry submits LIMIT order
2. Backend: create order with status=`ACCEPTED` → call matching engine
3. If matched immediately: same as market flow (position created)
4. If no match: order stays `ACCEPTED`, funds stay locked, no position yet
5. When a matching order triggers (via new order entering), matching engine matches and creates position

### Close Position
1. User clicks "Close Position" → `apiClient.closePosition(positionId, { amount })`
2. Backend: fetch position → calculate PnL at current market price (with contractSize) → unlock margin + pay PnL → update wallet → mark position CLOSED with `closedAt` and `closePrice`
3. WebSocket broadcast position_update → frontend refreshes

---

## 9. Edge Cases, Validation, Failure/Retry, Consistency

| Edge Case | Handling |
|-----------|----------|
| Insufficient wallet balance | Return 400 error before creating order. No position/wallet changes. |
| Price unavailable (MEXC/Binance down) | Try MEXC, Binance, KuCoin (existing fallbacks). If all fail, reject order. |
| D1 transaction rollback | `runTx` fallback to sequential execution (existing in `db.ts:33-43`). Risk engine should also use `runTx`. |
| Duplicate order submission | Idempotency check: `idempotencyKey` field on orders. Prevent duplicate positions. |
| Matching engine fails | Transaction rolls back. No partial state. |
| WebSocket disconnects | Frontend falls back to 3s polling. Auto-reconnect. |
| Risk engine closes position | Uses shared `closePositionAtomic` service. Wallet + position updated atomically. |
| Partial close | `closeAmount < totalAmount` → update position amount/margin proportionally, keep OPEN. |
| Multiple open positions same symbol | Each position has unique ID. No aggregation. MT5 style. |
| Closed position PnL mismatch | Use same `contractSize` calculation in both trading route and risk engine. |
| Refresh/re-login | Positions fetched fresh from DB by userId. No store-only state for positions. |
| LIMIT order not matched but funds locked | Funds unlocked only when order is CANCELED or FILLED. If not matched, stays locked (by design — user can cancel). |
| Idempotent order with existing positionId | Return existing order + positionId from lookup, don't create new. |

---

## 10. DRY Implementation Strategy (Reuse Existing Code)

### Reuse Existing Components:
| Component | Reuse |
|-----------|-------|
| `apiClient.createOrder()` | Already exists; add `leverage` + `idempotencyKey` to payload |
| `apiClient.getPositions()` | Already correct; frontend just needs positionId orderId display |
| `apiClient.closePosition()` | Already correct; signature accepts `{ amount }` |
| `getRealPrice()` | Already fetches real data from MEXC/Binance/KuCoin |
| `runTx()` | Already in trading.ts; reuse for transactions |
| `generateBusinessId()` | Already used for display IDs |
| `processOrderMatching()` | Enable existing; call it from order handler |
| `settleTradeWallets()` | Already handles wallet settlement in matching engine |
| `internalClosePosition()` in risk-engine.ts | Extract to shared `position-service.ts`, add contractSize |
| `OrderSuccessModal` | Extend to show position data |
| `TradingHistoryTabs` | Already fetches real data, minor formatting |

### Do NOT Duplicate:
- No new API endpoints for positions (existing `/positions`, `/positions/:id/close` are correct)
- No new database tables (extend existing `positions` table)
- No new frontend stores (extend `trading-ui-store.ts`)
- No separate position fetch logic (apiClient already has `getPositions()`)

---

## 11. Testing Plan

| # | Scenario | Expected Result |
|---|----------|-----------------|
| T1 | Place MARKET BUY order with sufficient balance | Position created with status=OPEN, wallet debited, position visible in /positions |
| T2 | Place MARKET SELL order (SHORT) | Position created with side=SHORT, wallet locked in quote asset |
| T3 | Place LIMIT BUY order (no matching asks) | Order stays ACCEPTED, no position, funds locked |
| T4 | Place LIMIT BUY that matches existing SELL limit | Order fills via matching engine, position created |
| T5 | Refresh positions page after placing order | Position persists in DB, visible after reload |
| T6 | Logout and login, then check positions | All positions still visible (DB-persisted) |
| T7 | Place multiple BUY orders for same symbol | Multiple independent positions created |
| T8 | Place BUY then SELL for same symbol | Two positions: one LONG, one SHORT |
| T9 | Close position fully | Status=CLOSED, wallet credited (margin + PnL), closedAt set, position in history |
| T10 | Partial close position | Position amount/margin reduced, remaining stays OPEN |
| T11 | Close position at profit | Wallet credited with margin + profit |
| T12 | Close position at loss | Wallet credited with margin (reduced by loss) |
| T13 | Insufficient wallet balance | Order rejected, no position created, wallet unchanged |
| T14 | Duplicate order (idempotency key) | Same order returned, no duplicate position |
| T15 | OneClickTrading BUY/SELL | Uses apiClient, position created, works with cookie auth |
| T16 | WebSocket position update | Real-time position data refreshed without polling |
| T17 | Risk engine SL/TP trigger | Position auto-closed with correct PnL (matching trading route) |
| T18 | PnL consistency (risk vs trading) | Same PnL values in both risk engine and trading API (both use contractSize) |
| T19 | Orderbook shows LIMIT orders | After order status fix, LIMIT orders visible in orderbook depth |
| T20 | No mock DEMO data visible | After SQL dump cleanup, no demo positions/orders appear for real users |
| T21 | Order→Position traceability | POST /orders response includes positionId; GET /positions returns orderId |
| T22 | Configurability leverage | User can specify leverage up to market.max_leverage (default 100) |

---

## 12. Implementation Order (Task List)

1. **Schema & Migration**
   - Create migration `0025_positions_enhancements.sql` (add positionId, orderId, closedAt, closePrice, idempotencyKey to orders)
   - Update Drizzle schema (`database/schema/trading.ts`) with new columns + `maxLeverage` on markets + `stopLoss`/`takeProfit` on orders/positions
   - Run `db push` / migration on D1

2. **Backend — Matching Engine Integration**
   - Call `processOrderMatching()` in `POST /orders` for both MARKET and LIMIT orders
   - Update order status based on matchResult (FILLED / PARTIALLY_FILLED / ACCEPTED)
   - Create position for any order that has fills (both MARKET auto-fill and LIMIT matches)
   - Update order with `positionId`, position with `orderId`
   - Return `positionId` and position data in response
   - Use configurable leverage from `marketInfo.maxLeverage`

3. **Backend — Orderbook Status Fix**
   - Update orderbook endpoint filter to include `ACCEPTED` status orders
   - This ensures the matching engine can find liquidity from LIMIT orders

4. **Backend — Position Close Shared Service**
   - Extract `internalClosePosition` from `risk-engine.ts` into `services/api/src/services/position-service.ts`
   - Add `contractSize` to PnL calculation (fixing RC-9)
   - Add `closedAt` and `closePrice` tracking
   - Use `runTx` wrapper for D1 fallback support
   - Make both `POST /positions/:id/close` and `risk-engine.ts` call the shared service

5. **Backend — Risk Engine Fix**
   - Update risk engine to use shared `closePositionAtomic` service
   - Add `contractSize` to PnL calculation
   - Use `runTx` for D1 transaction fallback

6. **Backend — WebSocket Enhancement**
   - Extend WebSocket handler to accept position subscription
   - Broadcast position updates on create/close events

7. **Frontend — API Client & Store Updates**
   - Extend `trading-ui-store.ts` with `successPosition`
   - Update `apiClient.createOrder()` to return position data (already returns it from backend)

8. **Frontend — OrderEntry Fix**
   - Handle `positionId` and `position` from API response
   - Add leverage input field
   - Forward both order + position data to success modal

9. **Frontend — OrderSuccessModal Enhancement**
   - Display position data alongside order data
   - Show position-specific messaging

10. **Frontend — OneClickTrading Fix**
    - Replace raw `fetch` with `apiClient.createOrder()`
    - Remove localStorage token dependency

11. **Frontend — Positions Page + TradingHistoryTabs**
    - Show `orderId` for traceability
    - Display `closePrice`/`closedAt` for closed positions
    - Remove fake zero-balance fallback portfolio block

12. **Data Cleanup**
    - Remove demo/trade INSERTs from `merge_data_only.sql`, `merge.sql`, `backup_current_sept26_state.sql`, `backup_pre_restore_2026_10_03.sql`
    - Fix column references (remove `type`/`mode`/`escrow_balance` from all INSERTs in these dumps)

13. **Admin Route Fix**
    - Fix broken `require('../../utils/mt5-client')` path in `admin/trading.ts`
    - Or remove the dynamic import if not needed

---

## 13. Production-Readiness Checklist

- [ ] Order→position linkage: `orderId` FK on positions, `positionId` FK on orders
- [ ] Matching engine invoked for ALL order types (MARKET auto-fills via B-Book, LIMIT matches against book)
- [ ] Position created within same transaction as order + wallet debit
- [ ] API response includes `positionId` and position data
- [ ] No localStorage token dependency (cookie-based auth only)
- [ ] No hardcoded DEMO positions/orders/trades/wallet_transactions in SQL dumps
- [ ] Risk engine PnL matches trading route PnL (both include `contractSize`)
- [ ] Shared position close service (no duplicate logic between API route and risk engine)
- [ ] Risk engine uses `runTx` for D1 transaction fallback
- [ ] WebSocket broadcasts position updates on create/close
- [ ] Admin route MT5 client import path fixed
- [ ] Orderbook includes `ACCEPTED` orders (so matching engine finds liquidity)
- [ ] Configurable leverage (uses `marketInfo.maxLeverage`)
- [ ] Idempotency key support to prevent duplicate positions
- [ ] `closedAt` and `closePrice` populated on position close
- [ ] All wallet mutations in transactions with rollback on failure
- [ ] Positions page shows actual data or error (no fake zero fallback)