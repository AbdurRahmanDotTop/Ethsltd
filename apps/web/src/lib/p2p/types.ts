export type P2PSide = "buy" | "sell";

export type P2POrderStatus =
  | "CREATED"
  | "ESCROW_LOCKED"
  | "AWAITING_PAYMENT"
  | "PAYMENT_MARKED"
  | "PAYMENT_CONFIRMED"
  | "RELEASE_PENDING"
  | "COMPLETED"
  | "CANCELLED"
  | "EXPIRED"
  | "DISPUTED";

export interface PaymentMethodConfig {
  id: string;
  type: string; // e.g., 'Bank Transfer', 'UPI', 'PayPal', 'Other'
  details: Record<string, string>; // e.g. { accountName: '...', accountNumber: '...' }
}

export type P2PAdvertisement = {
  id: string;
  merchantId: string;
  side: P2PSide;
  asset: string;
  fiat: string;
  price: number;
  priceType: "fixed" | "floating";
  availableAmount: number;
  minLimit: number;
  maxLimit: number;
  paymentMethods: PaymentMethodConfig[] | string[];
  completionRate: number;
  completedOrders: number;
  responseTimeMinutes: number;
  merchantOnline: boolean;
  merchantVerified: boolean;
  terms: string;
  status: "online" | "offline" | "paused";
  createdAt: string;
};

export type P2PMerchant = {
  id: string;
  username: string;
  displayName: string;
  avatar?: string;
  verified: boolean;
  online: boolean;
  completionRate: number;
  totalOrders: number;
  averageReleaseTime: number; // in minutes
  positiveFeedback: number;
  negativeFeedback: number;
  joinedAt: string;
  supportedPaymentMethods: string[];
  badge?: "verified" | "top_merchant" | "trusted";
};

export type P2POrder = {
  id: string;
  displayId?: string;
  advertisementId: string;
  merchantId: string;
  userId: string;
  side: P2PSide; // the side of the ADVERTISEMENT. If ad is buy, user is selling.
  asset: string;
  fiat: string;
  fiatCurrency: string; // Enriched from ad
  cryptoAmount: number;
  fiatAmount: number;
  price: number;
  role: "BUYER" | "SELLER"; // Enriched by API
  permissions: {
    canMarkPaid: boolean;
    canConfirmPayment: boolean;
    canReleaseCrypto: boolean;
    canCancel: boolean;
    canDispute: boolean;
  };
  paymentMethod: string;
  paymentDetails?: string | null;
  status: P2POrderStatus;
  createdAt: string;
  expiresAt: string;
  paymentMarkedAt?: string;
  completedAt?: string;
  cancelledAt?: string;
  disputeId?: string;
};

export type P2POrderEvent = {
  id: string;
  orderId: string;
  type:
    | "ORDER_CREATED"
    | "ESCROW_LOCKED"
    | "PAYMENT_PENDING"
    | "PAYMENT_MARKED"
    | "PAYMENT_CONFIRMED"
    | "RELEASE_PENDING"
    | "COMPLETED"
    | "CANCELLED"
    | "EXPIRED"
    | "DISPUTED";
  timestamp: string;
  metadata?: Record<string, unknown>;
};

export type P2PMessage = {
  id: string;
  orderId: string;
  sender: "user" | "merchant" | "system";
  message: string;
  createdAt: string;
  read: boolean;
};

export type P2PAdvertisementQuery = {
  side: P2PSide;
  asset?: string;
  fiat?: string;
  paymentMethod?: string;
  amount?: number;
  minPrice?: number;
  maxPrice?: number;
  minLimit?: number;
  maxLimit?: number;
  onlineOnly?: boolean;
  verifiedOnly?: boolean;
  sortBy?: "Best Price" | "Lowest Price" | "Highest Price" | "Fastest Completion" | "Highest Completion Rate" | "Most Trades";
};

export type P2PAsset = {
  symbol: string;
  name: string;
  icon: string;
  decimals: number;
  status: "active" | "inactive";
};

export type PaymentMethodInfo = {
  id: string;
  name: string;
  icon: string;
  currency: string[];
  enabled: boolean;
};

export type P2PExpertProfile = {
  id: string;
  userId: string;
  displayName: string;
  avatar?: string;
  bio: string;
  experienceYears: number;
  languages: string[];
  categories: string[];
  rating: number;
  completedServices: number;
  customersHelped: number;
  verificationStatus: "VERIFIED" | "PENDING" | "UNVERIFIED";
  availabilityStatus: "AVAILABLE" | "BUSY" | "OFFLINE";
  createdAt: string;
};

export type P2PExpertService = {
  id: string;
  expertId: string;
  title: string;
  description: string;
  category: string;
  duration: number; // in minutes
  price: number;
  currency: string; // e.g. "INR", "USD"
  pricingType: "FIXED" | "PER_HOUR" | "CUSTOM";
  status: "ACTIVE" | "PAUSED" | "DELETED";
};

export type P2PExpertBooking = {
  id: string;
  bookingNo: string;
  expertId: string;
  customerId: string;
  serviceId: string;
  scheduledAt: string;
  duration: number;
  amount: number;
  currency: string;
  paymentStatus: "PENDING" | "PAID" | "HELD" | "REFUNDED";
  bookingStatus: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED" | "DISPUTED";
  meetingMethod: string;
  createdAt: string;
};
