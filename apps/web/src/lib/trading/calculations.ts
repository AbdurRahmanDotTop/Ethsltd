// Format utilities for trading
export const formatPrice = (price: number, market?: string) => {
  // If we had a market config we could pull precision, for now default
  if (price < 0.1) return price.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 8 });
  return price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

export const formatQuantity = (quantity: number) => {
  return quantity.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 8 });
};

export const parseNumber = (val: string) => {
  const parsed = parseFloat(val);
  return isNaN(parsed) ? 0 : parsed;
};

// Safe calculation helpers (simulating decimal safety)
export const calculateTotal = (price: number, quantity: number) => {
  return price * quantity;
};

export const calculateFee = (total: number, feeRate: number = 0.001) => {
  return total * feeRate; // 0.1% fee
};

export const parseMarketSymbol = (symbol: string) => {
  const parts = symbol.split('-');
  if (parts.length === 2) {
    return { base: parts[0], quote: parts[1] };
  }
  // Fallback for BTC/USDT format
  const slashParts = symbol.split('/');
  if (slashParts.length === 2) {
    return { base: slashParts[0], quote: slashParts[1] };
  }
  return { base: '', quote: '' };
};
