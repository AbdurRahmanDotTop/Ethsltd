import { P2PAdvertisement, P2PMerchant, P2PAsset, PaymentMethodInfo, P2PExpertProfile, P2PExpertService } from "./types";

export const ASSETS: P2PAsset[] = [
  { symbol: "USDT", name: "Tether", icon: "₮", decimals: 6, status: "active" },
  { symbol: "BTC", name: "Bitcoin", icon: "₿", decimals: 8, status: "active" },
  { symbol: "ETH", name: "Ethereum", icon: "Ξ", decimals: 18, status: "active" },
  { symbol: "USDC", name: "USD Coin", icon: "$", decimals: 6, status: "active" },
  { symbol: "SOL", name: "Solana", icon: "◎", decimals: 9, status: "active" },
];

export const FIAT_CURRENCIES = [
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "AED", name: "UAE Dirham", symbol: "د.إ" },
];

export const PAYMENT_METHODS: PaymentMethodInfo[] = [
  { id: "bank_transfer", name: "Bank Transfer", icon: "🏦", currency: ["USD", "EUR", "GBP"], enabled: true },
  { id: "zelle", name: "Zelle", icon: "💸", currency: ["USD"], enabled: true },
  { id: "paypal", name: "PayPal", icon: "🅿️", currency: ["USD", "EUR", "GBP"], enabled: true },
  { id: "wise", name: "Wise", icon: "🦉", currency: ["USD", "EUR", "GBP", "AED"], enabled: true },
  { id: "revolut", name: "Revolut", icon: "💳", currency: ["USD", "EUR", "GBP"], enabled: true },
  { id: "cash_app", name: "Cash App", icon: "💵", currency: ["USD", "GBP"], enabled: true },
  { id: "sepa", name: "SEPA", icon: "🇪🇺", currency: ["EUR"], enabled: true },
];

export const MOCK_MERCHANTS: P2PMerchant[] = [
  {
    id: "m_101",
    username: "CryptoKing",
    displayName: "CryptoKing",
    verified: true,
    online: true,
    completionRate: 98.7,
    totalOrders: 1245,
    averageReleaseTime: 4.2,
    positiveFeedback: 1230,
    negativeFeedback: 15,
    joinedAt: "2023-01-15T00:00:00Z",
    supportedPaymentMethods: ["bank_transfer", "zelle", "wise"],
    badge: "verified"
  },
  {
    id: "m_102",
    username: "FastTraderUS",
    displayName: "FastTraderUS",
    verified: true,
    online: true,
    completionRate: 99.5,
    totalOrders: 8930,
    averageReleaseTime: 2.1,
    positiveFeedback: 8890,
    negativeFeedback: 40,
    joinedAt: "2022-05-10T00:00:00Z",
    supportedPaymentMethods: ["zelle", "cash_app"],
    badge: "top_merchant"
  },
  {
    id: "m_103",
    username: "GlobalExchange",
    displayName: "GlobalExchange",
    verified: false,
    online: false,
    completionRate: 94.2,
    totalOrders: 412,
    averageReleaseTime: 12.5,
    positiveFeedback: 388,
    negativeFeedback: 24,
    joinedAt: "2023-11-20T00:00:00Z",
    supportedPaymentMethods: ["paypal", "wise", "revolut"],
    badge: "trusted"
  },
  {
    id: "m_104",
    username: "SatoshiStacker",
    displayName: "SatoshiStacker",
    verified: true,
    online: true,
    completionRate: 97.8,
    totalOrders: 2156,
    averageReleaseTime: 5.5,
    positiveFeedback: 2100,
    negativeFeedback: 56,
    joinedAt: "2021-08-01T00:00:00Z",
    supportedPaymentMethods: ["bank_transfer", "sepa"],
    badge: "verified"
  }
];

// Generate robust mock advertisements
export const MOCK_ADVERTISEMENTS: P2PAdvertisement[] = [
  // USDT - SELL (User buys from merchant)
  {
    id: "ad_1",
    merchantId: "m_102",
    side: "sell", // Merchant is selling, User is buying
    asset: "USDT",
    fiat: "USD",
    price: 1.005,
    priceType: "fixed",
    availableAmount: 15000,
    minLimit: 50,
    maxLimit: 2000,
    paymentMethods: ["zelle", "cash_app"],
    completionRate: 99.5,
    completedOrders: 8930,
    responseTimeMinutes: 1,
    merchantOnline: true,
    merchantVerified: true,
    terms: "Fast release. No third party payments. Must include order number in memo.",
    status: "online",
    createdAt: "2024-03-01T10:00:00Z"
  },
  {
    id: "ad_2",
    merchantId: "m_101",
    side: "sell",
    asset: "USDT",
    fiat: "USD",
    price: 1.01,
    priceType: "fixed",
    availableAmount: 50000,
    minLimit: 500,
    maxLimit: 10000,
    paymentMethods: ["bank_transfer", "wise"],
    completionRate: 98.7,
    completedOrders: 1245,
    responseTimeMinutes: 5,
    merchantOnline: true,
    merchantVerified: true,
    terms: "Verified users only. Bank transfer must match KYC name.",
    status: "online",
    createdAt: "2024-03-05T12:00:00Z"
  },
  {
    id: "ad_3",
    merchantId: "m_103",
    side: "sell",
    asset: "USDT",
    fiat: "USD",
    price: 1.03,
    priceType: "fixed",
    availableAmount: 500,
    minLimit: 10,
    maxLimit: 500,
    paymentMethods: ["paypal"],
    completionRate: 94.2,
    completedOrders: 412,
    responseTimeMinutes: 15,
    merchantOnline: false,
    merchantVerified: false,
    terms: "PayPal Friends and Family only.",
    status: "online",
    createdAt: "2024-03-10T14:00:00Z"
  },
  
  // USDT - BUY (User sells to merchant)
  {
    id: "ad_4",
    merchantId: "m_102",
    side: "buy", // Merchant is buying, User is selling
    asset: "USDT",
    fiat: "USD",
    price: 0.995,
    priceType: "fixed",
    availableAmount: 25000,
    minLimit: 100,
    maxLimit: 5000,
    paymentMethods: ["zelle", "bank_transfer"],
    completionRate: 99.5,
    completedOrders: 8930,
    responseTimeMinutes: 2,
    merchantOnline: true,
    merchantVerified: true,
    terms: "Will send funds immediately. Honest trader.",
    status: "online",
    createdAt: "2024-03-02T10:00:00Z"
  },
  {
    id: "ad_5",
    merchantId: "m_101",
    side: "buy",
    asset: "USDT",
    fiat: "USD",
    price: 0.99,
    priceType: "fixed",
    availableAmount: 100000,
    minLimit: 1000,
    maxLimit: 50000,
    paymentMethods: ["bank_transfer", "wise"],
    completionRate: 98.7,
    completedOrders: 1245,
    responseTimeMinutes: 10,
    merchantOnline: true,
    merchantVerified: true,
    terms: "Large blocks only. Reliable liquidity provider.",
    status: "online",
    createdAt: "2024-03-04T12:00:00Z"
  },

  // BTC - SELL (User buys from merchant)
  {
    id: "ad_6",
    merchantId: "m_104",
    side: "sell",
    asset: "BTC",
    fiat: "USD",
    price: 68500,
    priceType: "floating",
    availableAmount: 2.5,
    minLimit: 100,
    maxLimit: 10000,
    paymentMethods: ["bank_transfer"],
    completionRate: 97.8,
    completedOrders: 2156,
    responseTimeMinutes: 8,
    merchantOnline: true,
    merchantVerified: true,
    terms: "Standard verification required. Release upon clearing.",
    status: "online",
    createdAt: "2024-03-01T08:00:00Z"
  },
  {
    id: "ad_7",
    merchantId: "m_102",
    side: "sell",
    asset: "BTC",
    fiat: "USD",
    price: 69000,
    priceType: "fixed",
    availableAmount: 0.5,
    minLimit: 50,
    maxLimit: 2000,
    paymentMethods: ["zelle", "cash_app"],
    completionRate: 99.5,
    completedOrders: 8930,
    responseTimeMinutes: 1,
    merchantOnline: true,
    merchantVerified: true,
    terms: "Instant release with Zelle.",
    status: "online",
    createdAt: "2024-03-02T09:00:00Z"
  },

  // BTC - BUY (User sells to merchant)
  {
    id: "ad_8",
    merchantId: "m_104",
    side: "buy",
    asset: "BTC",
    fiat: "USD",
    price: 67800,
    priceType: "floating",
    availableAmount: 5.0,
    minLimit: 500,
    maxLimit: 25000,
    paymentMethods: ["bank_transfer"],
    completionRate: 97.8,
    completedOrders: 2156,
    responseTimeMinutes: 12,
    merchantOnline: true,
    merchantVerified: true,
    terms: "Send BTC, get USD wire same day.",
    status: "online",
    createdAt: "2024-03-03T10:00:00Z"
  },

  // ETH - SELL (User buys from merchant)
  {
    id: "ad_9",
    merchantId: "m_101",
    side: "sell",
    asset: "ETH",
    fiat: "USD",
    price: 3600,
    priceType: "fixed",
    availableAmount: 15.0,
    minLimit: 100,
    maxLimit: 5000,
    paymentMethods: ["bank_transfer", "wise"],
    completionRate: 98.7,
    completedOrders: 1245,
    responseTimeMinutes: 4,
    merchantOnline: true,
    merchantVerified: true,
    terms: "Fast and secure.",
    status: "online",
    createdAt: "2024-03-06T11:00:00Z"
  },
  
  // SOL - SELL (User buys from merchant)
  {
    id: "ad_10",
    merchantId: "m_102",
    side: "sell",
    asset: "SOL",
    fiat: "USD",
    price: 150,
    priceType: "fixed",
    availableAmount: 200.0,
    minLimit: 20,
    maxLimit: 1000,
    paymentMethods: ["zelle", "cash_app"],
    completionRate: 99.5,
    completedOrders: 8930,
    responseTimeMinutes: 1,
    merchantOnline: true,
    merchantVerified: true,
    terms: "Instant SOL release.",
    status: "online",
    createdAt: "2024-03-07T12:00:00Z"
  }
];

export const MOCK_EXPERTS: P2PExpertProfile[] = [
  {
    id: "exp_001",
    userId: "u_101",
    displayName: "CryptoKing Expert",
    avatar: "https://i.pravatar.cc/150?u=exp_001",
    bio: "I have been trading P2P for over 5 years. I specialize in helping new merchants setup their flow securely.",
    experienceYears: 5,
    languages: ["English", "Hindi"],
    categories: ["P2P Trading Guidance", "Merchant Setup Assistance", "Risk Management"],
    rating: 4.9,
    completedServices: 120,
    customersHelped: 105,
    verificationStatus: "VERIFIED",
    availabilityStatus: "AVAILABLE",
    createdAt: "2024-01-15T00:00:00Z"
  },
  {
    id: "exp_002",
    userId: "u_102",
    displayName: "Jane P2P Pro",
    avatar: "https://i.pravatar.cc/150?u=exp_002",
    bio: "Ex-institutional trader and currently a Top P2P merchant. I teach you how to maximize profits and minimize chargebacks.",
    experienceYears: 7,
    languages: ["English", "Spanish"],
    categories: ["P2P Strategy", "Risk Management", "Trading Education"],
    rating: 4.8,
    completedServices: 85,
    customersHelped: 70,
    verificationStatus: "VERIFIED",
    availabilityStatus: "AVAILABLE",
    createdAt: "2024-02-10T00:00:00Z"
  },
  {
    id: "exp_003",
    userId: "u_103",
    displayName: "Satoshi Sensei",
    avatar: "https://i.pravatar.cc/150?u=exp_003",
    bio: "Learn everything about crypto basics and how to safely buy your first crypto.",
    experienceYears: 3,
    languages: ["English", "Japanese"],
    categories: ["Crypto Basics", "Payment Method Guidance"],
    rating: 4.6,
    completedServices: 40,
    customersHelped: 40,
    verificationStatus: "VERIFIED",
    availabilityStatus: "BUSY",
    createdAt: "2024-03-20T00:00:00Z"
  }
];

export const MOCK_SERVICES: P2PExpertService[] = [
  {
    id: "srv_001",
    expertId: "exp_001",
    title: "Merchant Setup Consultation",
    description: "A 60-minute call to help you set up your merchant account, configure payment methods safely, and establish a process to avoid fraud.",
    category: "Merchant Setup Assistance",
    duration: 60,
    price: 999,
    currency: "INR",
    pricingType: "FIXED",
    status: "ACTIVE"
  },
  {
    id: "srv_002",
    expertId: "exp_001",
    title: "P2P Beginner Guidance",
    description: "Learn how to buy and sell on P2P without getting scammed.",
    category: "P2P Trading Guidance",
    duration: 30,
    price: 499,
    currency: "INR",
    pricingType: "FIXED",
    status: "ACTIVE"
  },
  {
    id: "srv_003",
    expertId: "exp_002",
    title: "Advanced P2P Strategy & Risk Management",
    description: "Deep dive into chargeback defense and identifying scam patterns before releasing escrow.",
    category: "Risk Management",
    duration: 45,
    price: 75,
    currency: "USD",
    pricingType: "FIXED",
    status: "ACTIVE"
  },
  {
    id: "srv_004",
    expertId: "exp_003",
    title: "Crypto Wallet Setup & Basics",
    description: "A secure session where I help you understand seed phrases and set up your self-custody wallet.",
    category: "Crypto Basics",
    duration: 30,
    price: 500,
    currency: "INR",
    pricingType: "FIXED",
    status: "ACTIVE"
  }
];

export const getMockExperts = (mode: "REAL" | "DEMO"): P2PExpertProfile[] => {
  if (mode === "DEMO") {
    return MOCK_EXPERTS.map(e => ({
      ...e,
      id: `demo_${e.id}`,
      displayName: `[Demo] ${e.displayName}`
    }));
  }
  return MOCK_EXPERTS;
};

export const getMockServices = (mode: "REAL" | "DEMO"): P2PExpertService[] => {
  if (mode === "DEMO") {
    return MOCK_SERVICES.map(s => ({
      ...s,
      id: `demo_${s.id}`,
      expertId: `demo_${s.expertId}`,
      title: `[Demo] ${s.title}`
    }));
  }
  return MOCK_SERVICES;
};
