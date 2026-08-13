import { 
  Notification, 
  NotificationCategory, 
  NotificationPriority,
  NotificationStatus,
  NotificationType,
  GetNotificationsParams,
  GetNotificationsResponse
} from "./types";

// Generate realistic mock notifications
const generateMockNotifications = (): Notification[] => {
  const now = new Date();
  const generateDate = (minutesAgo: number) => new Date(now.getTime() - minutesAgo * 60000).toISOString();

  return [
    {
      id: "NOTIF-1001",
      userId: "USR-000123",
      type: "SECURITY_LOGIN",
      category: "SECURITY",
      priority: "CRITICAL",
      title: "New login detected",
      message: "A new device signed into your ETHSLTD account. Chrome • Windows. New York, US.",
      status: "UNREAD",
      channels: ["IN_APP", "EMAIL", "PUSH"],
      referenceType: "SESSION",
      actionUrl: "/account/sessions",
      createdAt: generateDate(5),
    },
    {
      id: "NOTIF-1002",
      userId: "USR-000123",
      type: "TRADE_ORDER_FILLED",
      category: "TRADING",
      priority: "NORMAL",
      title: "BTC/USDT order filled",
      message: "Buy 0.025 BTC at $104,250.00. Total: $2,606.25",
      status: "UNREAD",
      channels: ["IN_APP", "PUSH"],
      referenceType: "TRADE",
      actionUrl: "/trade/BTC-USDT",
      createdAt: generateDate(18),
    },
    {
      id: "NOTIF-1003",
      userId: "USR-000123",
      type: "WALLET_WITHDRAWAL_COMPLETED",
      category: "WALLET",
      priority: "HIGH",
      title: "Withdrawal completed",
      message: "Amount: $1,250.00 USDT. Status: Completed.",
      status: "UNREAD",
      channels: ["IN_APP", "EMAIL", "PUSH"],
      referenceType: "WITHDRAWAL",
      referenceId: "WD-10482",
      actionUrl: "/wallet/history",
      createdAt: generateDate(60),
    },
    {
      id: "NOTIF-1004",
      userId: "USR-000123",
      type: "P2P_PAYMENT_MARKED",
      category: "P2P",
      priority: "HIGH",
      title: "Payment marked as paid",
      message: "P2P Order: #P2P-20481. Amount: $750.00 USDT. The buyer has marked the order as paid.",
      status: "UNREAD",
      channels: ["IN_APP", "EMAIL", "PUSH"],
      referenceType: "P2P_ORDER",
      referenceId: "P2P-20481",
      actionUrl: "/p2p/order/P2P-20481",
      createdAt: generateDate(120),
    },
    {
      id: "NOTIF-1005",
      userId: "USR-000123",
      type: "ACCOUNT_KYC_APPROVED",
      category: "ACCOUNT",
      priority: "NORMAL",
      title: "Identity Verification Approved",
      message: "Your KYC application has been approved. You now have full access to ETHSLTD features.",
      status: "READ",
      channels: ["IN_APP", "EMAIL"],
      referenceType: "KYC",
      createdAt: generateDate(1440), // 1 day ago
      readAt: generateDate(1430),
    },
    {
      id: "NOTIF-1006",
      userId: "USR-000123",
      type: "SYSTEM_MAINTENANCE",
      category: "SYSTEM",
      priority: "NORMAL",
      title: "Scheduled Wallet Maintenance",
      message: "ETHSLTD wallet withdrawals will be temporarily unavailable on Sunday, 02:00–03:00 UTC.",
      status: "READ",
      channels: ["IN_APP"],
      createdAt: generateDate(2880), // 2 days ago
      readAt: generateDate(2800),
    },
    {
      id: "NOTIF-1007",
      userId: "USR-000123",
      type: "MARKETING_CAMPAIGN",
      category: "MARKETING",
      priority: "LOW",
      title: "0% Fees on SOL/USDT",
      message: "Trade SOL with zero maker fees for the next 7 days!",
      status: "READ",
      channels: ["IN_APP"],
      createdAt: generateDate(4320), // 3 days ago
      readAt: generateDate(4000),
    },
  ];
};

let notificationsStore = generateMockNotifications();

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const MockNotificationProvider = {
  async getNotifications(params: GetNotificationsParams): Promise<GetNotificationsResponse> {
    await delay(600); // Simulate network latency

    let filtered = [...notificationsStore].filter(n => n.status !== "DELETED");

    if (params.category && params.category !== "ALL") {
      if (params.category === "UNREAD") {
        filtered = filtered.filter(n => n.status === "UNREAD");
      } else {
        filtered = filtered.filter(n => n.category === params.category);
      }
    }

    // Sort by created date descending
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const total = filtered.length;
    const unreadCount = notificationsStore.filter(n => n.status === "UNREAD").length;

    const page = params.page || 1;
    const limit = params.limit || 20;
    const start = (page - 1) * limit;
    const items = filtered.slice(start, start + limit);

    return {
      items,
      total,
      unreadCount
    };
  },

  async markAsRead(id: string): Promise<void> {
    await delay(300);
    const n = notificationsStore.find(x => x.id === id);
    if (n && n.status === "UNREAD") {
      n.status = "READ";
      n.readAt = new Date().toISOString();
    }
  },

  async markAsUnread(id: string): Promise<void> {
    await delay(300);
    const n = notificationsStore.find(x => x.id === id);
    if (n && n.status === "READ") {
      n.status = "UNREAD";
      n.readAt = undefined;
    }
  },

  async markAllAsRead(): Promise<void> {
    await delay(500);
    notificationsStore.forEach(n => {
      if (n.status === "UNREAD") {
        n.status = "READ";
        n.readAt = new Date().toISOString();
      }
    });
  },

  async archiveNotification(id: string): Promise<void> {
    await delay(300);
    const n = notificationsStore.find(x => x.id === id);
    if (n) {
      n.status = "ARCHIVED";
      n.archivedAt = new Date().toISOString();
    }
  },

  async deleteNotification(id: string): Promise<void> {
    await delay(300);
    const n = notificationsStore.find(x => x.id === id);
    if (n) {
      n.status = "DELETED";
    }
  },

  // Admin capabilities
  async getAllSystemNotifications(): Promise<Notification[]> {
    await delay(800);
    return [...notificationsStore];
  }
};
