# PRD 21: Trading Order Execution

## Background
We are ready to implement Order Execution in the Trading Engine. Users should be able to submit Buy/Sell Market and Limit orders from the Spot Trading interface.

## Scope
1. **API Endpoints**: 
   - `POST /api/v1/trading/orders`
   - `DELETE /api/v1/trading/orders/:id`
2. **Mock Matching Engine**: 
   - Market orders will instantly fill against mock current price, transferring correct wallet balances.
   - Limit orders will open, lock balances in the wallet, and stay open indefinitely (unless cancelled) due to lack of a real matching engine in the MVP.
3. **Frontend SDK Integration**: Wire the API client.
4. **UI Updates**: `OrderEntry.tsx` for placing orders. `TradingHistoryTabs.tsx` to display real open orders and order history from DB.
