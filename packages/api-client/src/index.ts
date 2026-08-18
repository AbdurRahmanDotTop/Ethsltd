import { User } from '@ethsltd/types';

export class EthsltdClient {
  private baseUrl: string;
  private token: string | null = null;
  private mode: 'REAL' | 'DEMO' = 'REAL';

  constructor(baseUrl: string = process.env.NEXT_PUBLIC_API_URL || '') {
    this.baseUrl = baseUrl;
    // Attempt to load token from localStorage if in browser environment
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('ethsltd_auth_token');
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('ethsltd_auth_token', token);
      } else {
        localStorage.removeItem('ethsltd_auth_token');
      }
    }
  }

  setMode(mode: 'REAL' | 'DEMO') {
    this.mode = mode;
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<{ success: boolean; data?: T; error?: any }> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...((options?.headers as Record<string, string>) || {}),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    
    headers['X-Trading-Mode'] = this.mode;

    try {
      const res = await fetch(`${this.baseUrl}${endpoint}`, {
        cache: 'no-store',
        ...options,
        headers,
      });
      
      const contentType = res.headers.get('content-type');
      let data: any;
      
      try {
        if (contentType && contentType.includes('application/json')) {
          data = await res.json();
        } else {
          const text = await res.text();
          try {
            data = JSON.parse(text);
          } catch(e) {
            data = { success: false, error: `Server returned non-JSON (${res.status}): ${text.substring(0, 200)}` };
          }
        }
      } catch (err: any) {
        return { success: false, error: `Failed to parse response: ${err.message}` };
      }

      if (!res.ok && !data?.error) {
        return { success: false, data, error: `HTTP Error ${res.status}` };
      }
      
      // Handle 401 globally
      if (res.status === 401) {
        this.setToken(null);
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('auth:required', { detail: { message: data?.error || 'Session expired or invalid' } }));
        }
      }

      return data;
    } catch (e: any) {
      return { success: false, error: e.message || 'Network Error' };
    }
  }

  async getMe() {
    return this.request<User>('/api/v1/auth/me');
  }

  async login(email: string, password: string) {
    const res = await this.request<{ token: string; user: User }>('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (res.success && (res as any).token) {
      this.setToken((res as any).token);
    }
    return res;
  }

  async register(email: string, password: string) {
    const res = await this.request<{ token: string; user: User }>('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (res.success && (res as any).token) {
      this.setToken((res as any).token);
    }
    return res;
  }

  async logout() {
    this.setToken(null);
    return { success: true };
  }

  async resendVerification() {
    // Placeholder until endpoint exists
    return { success: true };
  }

  async requestPasswordReset(email: string) {
    // Placeholder until endpoint exists
    return { success: true };
  }

  async resetPassword(password: string, token: string) {
    // Placeholder until endpoint exists
    return { success: true };
  }



  async changePassword(data: any) {
    return this.request<any>('/api/v1/settings/change-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getKYC() {
    return this.request<any>('/api/v1/settings/kyc');
  }

  async submitKYC(data: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    country: string;
    documentType: string;
    documentNumber: string;
    documentFrontBase64?: string;
    documentBackBase64?: string;
    selfieBase64?: string;
  }) {
    return this.request<any>('/api/v1/settings/kyc', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }


  async getWallets(userId: string) {
    return this.request<any[]>(`/api/v1/wallets?userId=${userId}`);
  }

  async getWalletBalances(mode: string = 'REAL') {
    return this.request<any[]>(`/api/v1/wallets/balances?mode=${mode}`);
  }

  async getWalletPortfolio(mode: string = 'REAL') {
    return this.request<any>(`/api/v1/wallets/portfolio?mode=${mode}`);
  }

  async getWalletTransactions(mode: string = 'REAL') {
    return this.request<any[]>(`/api/v1/wallets/transactions?mode=${mode}`);
  }

  async getDepositSettings() {
    return this.request<any>('/api/v1/wallets/deposit-settings');
  }

  async deposit(data: { 
    assetSymbol: string; 
    amount: number; 
    network?: string; 
    destination?: string; 
    mode?: string;
    depositMethod?: string;
    transactionHash?: string;
    paymentReference?: string;
    proofFileUrl?: string;
  }): Promise<any> {
    return this.request<any>('/api/v1/wallets/deposit', {
      method: 'POST',
      body: JSON.stringify(data),
    }) as Promise<any>;
  }

  async withdraw(data: { assetSymbol: string; amount: number; network?: string; destination?: string; mode?: string }) {
    return this.request<any>('/api/v1/wallets/withdraw', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async topUpDemoWallet() {
    return this.request<any>('/api/v1/wallets/top-up-demo', {
      method: 'POST',
    });
  }

  // Trading Data API Methods
  async getMarkets(params?: any) {
    return this.request<any[]>('/api/v1/trading/markets');
  }

  async getMarketCandles(symbol: string, interval: string = '15m') {
    return this.request<any[]>(`/api/v1/trading/markets/${symbol}/candles?interval=${interval}`);
  }

  async getMarketOrderBook(symbol: string) {
    return this.request<any>(`/api/v1/trading/markets/${symbol}/orderbook`);
  }

  async getMarketTrades(symbol: string) {
    return this.request<any[]>(`/api/v1/trading/markets/${symbol}/trades`);
  }

  // Fiat Exchange Rates
  async getExchangeRate(base: string = 'USDT', quote: string = 'INR') {
    return this.request<any>(`/api/v1/trading/exchange-rate?base=${base}&quote=${quote}`);
  }

  // Trading Execution API Methods
  async getOrders(mode: string = 'REAL') {
    return this.request<any[]>(`/api/v1/trading/orders?mode=${mode}`);
  }

  async getTrades(mode: string = 'REAL') {
    return this.request<any[]>(`/api/v1/trading/trades?mode=${mode}`);
  }

  async createOrder(data: any) {
    return this.request<any>('/api/v1/trading/orders', {
      method: 'POST',
      body: JSON.stringify({ ...data, mode: data.mode || 'REAL' }),
    });
  }

  async cancelOrder(orderId: string) {
    return this.request<any>(`/api/v1/trading/orders/${orderId}`, {
      method: 'DELETE',
    });
  }
  
  // Futures API Methods
  async getFuturesPositions(mode: string = 'REAL') {
    return this.request<any[]>(`/api/v1/trading/futures/positions?mode=${mode}`);
  }

  async createFuturesOrder(data: any) {
    return this.request<any>('/api/v1/trading/futures/order', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async closeFuturesPosition(positionId: string) {
    return this.request<any>('/api/v1/trading/futures/close', {
      method: 'POST',
      body: JSON.stringify({ positionId }),
    });
  }

  // Options API Methods
  async getOptionsPositions(mode: string = 'REAL') {
    return this.request<any[]>(`/api/v1/trading/options/positions?mode=${mode}`);
  }

  async createOptionsOrder(data: any) {
    return this.request<any>('/api/v1/trading/options/order', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // P2P API Methods
  async getP2pAds(params?: any) {
    return this.request<any[]>('/api/v1/p2p/ads');
  }

  async createP2pAd(data: any) {
    return this.request<any>('/api/v1/p2p/ads', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateP2pAd(adId: string, data: any) {
    return this.request<any>(`/api/v1/p2p/ads/${adId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async closeP2pAd(adId: string) {
    return this.request<any>(`/api/v1/p2p/ads/${adId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status: 'CLOSED' }),
    });
  }

  async getP2pOrders(params?: any) {
    return this.request<any[]>('/api/v1/p2p/orders');
  }

  async createP2pOrder(data: any) {
    return this.request<any>('/api/v1/p2p/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateP2pOrderStatus(orderId: string, action: 'pay' | 'release' | 'cancel' | 'dispute') {
    let endpointAction: string = action;
    if (action === 'pay') endpointAction = 'mark-paid';
    return this.request<any>(`/api/v1/p2p/orders/${orderId}/${endpointAction}`, {
      method: 'POST',
    });
  }

  async getP2pOrder(orderId: string): Promise<{ success: boolean; data?: any; merchant?: any; error?: any }> {
    return this.request<any>(`/api/v1/p2p/orders/${orderId}`);
  }

  async getP2pMessages(orderId: string) {
    return this.request<any[]>(`/api/v1/p2p/orders/${orderId}/messages`);
  }

  async sendP2pMessage(orderId: string, content: string) {
    return this.request<any>(`/api/v1/p2p/orders/${orderId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  }

  // Admin API Methods
  async getAdminStats() {
    return this.request<any>('/api/v1/admin/stats');
  }

  async adminGetExperts() {
    return this.request<any[]>('/api/v1/admin/experts');
  }

  async adminUpdateExpertStatus(expertId: string, status: string) {
    return this.request<any>(`/api/v1/admin/experts/${expertId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  async adminCreateExpert(data: { email: string; bio: string; experienceYears: number; categories: string[]; languages: string[] }) {
    return this.request<any>('/api/v1/admin/experts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getAdminUsers(params: { page?: number; limit?: number; search?: string; status?: string }) {
    const query = new URLSearchParams();
    if (params.page) query.append('page', params.page.toString());
    if (params.limit) query.append('limit', params.limit.toString());
    if (params.search) query.append('search', params.search);
    if (params.status) query.append('status', params.status);
    
    return this.request<any>(`/api/v1/admin/users?${query.toString()}`);
  }

  async getAdminUserDetails(userId: string) {
    return this.request<any>(`/api/v1/admin/users/${userId}`);
  }

  async updateAdminUserStatus(userId: string, status: string) {
    return this.request<any>(`/api/v1/admin/users/${userId}/status`, {
      method: 'POST',
      body: JSON.stringify({ status }),
    });
  }

  async updateAdminUserRole(userId: string, role: string) {
    return this.request<any>(`/api/v1/admin/users/${userId}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role }),
    });
  }

  async adjustAdminUserWallet(userId: string, assetSymbol: string, amount: string, type: 'REAL' | 'DEMO', action: 'CREDIT' | 'DEBIT', targetField: 'balance' | 'lockedBalance' | 'escrowBalance' = 'balance', notes?: string) {
    return this.request<any>(`/api/v1/admin/users/${userId}/wallets/adjust`, {
      method: 'POST',
      body: JSON.stringify({ assetSymbol, amount, type, action, targetField, notes }),
    });
  }

  async adminResetUserPassword(userId: string, newPassword: string) {
    return this.request<any>(`/api/v1/admin/users/${userId}/password`, {
      method: 'POST',
      body: JSON.stringify({ newPassword }),
    });
  }

  async adminDeleteUser(userId: string) {
    return this.request<any>(`/api/v1/admin/users/${userId}`, {
      method: 'DELETE',
    });
  }

  async getAdminPendingKYC() {
    return this.request<any[]>('/api/v1/admin/kyc');
  }

  async updateAdminKYCStatus(kycId: string, status: string, rejectionReason?: string) {
    return this.request<any>(`/api/v1/admin/kyc/${kycId}/status`, {
      method: 'POST',
      body: JSON.stringify({ status, rejectionReason }),
    });
  }

  async getAdminTransactions() {
    return this.request<any[]>('/api/v1/admin/transactions');
  }

  async getAdminWalletsOverview() {
    return this.request<any>('/api/v1/admin/wallets/overview');
  }

  async getAdminUserWalletsList(search?: string) {
    const query = search ? `?search=${encodeURIComponent(search)}` : '';
    return this.request<any>(`/api/v1/admin/wallets/users${query}`);
  }

  // Admin Deposits & Payments Methods
  async adminGetPendingDeposits() {
    return this.request<any>('/api/v1/admin/payments/pending-deposits');
  }

  async adminApproveManualDeposit(id: string) {
    return this.request<any>(`/api/v1/admin/payments/manual-deposits/${id}/approve`, {
      method: 'POST'
    });
  }

  async adminRejectManualDeposit(id: string, notes?: string) {
    return this.request<any>(`/api/v1/admin/payments/manual-deposits/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify({ notes }),
    });
  }

  async adminDeleteManualDeposit(id: string) {
    return this.request<any>(`/api/v1/admin/payments/manual-deposits/${id}`, {
      method: 'DELETE'
    });
  }

  async adminApproveBankDeposit(id: string) {
    return this.request<any>(`/api/v1/admin/payments/bank-deposits/${id}/approve`, {
      method: 'POST'
    });
  }

  async adminRejectBankDeposit(id: string, notes?: string) {
    return this.request<any>(`/api/v1/admin/payments/bank-deposits/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify({ notes }),
    });
  }

  async adminDeleteBankDeposit(id: string) {
    return this.request<any>(`/api/v1/admin/payments/bank-deposits/${id}`, {
      method: 'DELETE'
    });
  }

  // Admin Withdrawals Methods
  async adminGetWithdrawals(status: string = 'ALL', mode: string = 'REAL') {
    return this.request<any[]>(`/api/v1/admin/withdrawals?status=${status}&mode=${mode}`);
  }

  async adminApproveWithdrawal(id: string) {
    return this.request<any>(`/api/v1/admin/withdrawals/${id}/approve`, {
      method: 'POST'
    });
  }

  async adminRejectWithdrawal(id: string, notes?: string) {
    return this.request<any>(`/api/v1/admin/withdrawals/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify({ notes }),
    });
  }

  async adminUpdateWithdrawalNotes(id: string, notes: string) {
    return this.request<any>(`/api/v1/admin/withdrawals/${id}/notes`, {
      method: 'PUT',
      body: JSON.stringify({ notes }),
    });
  }

  async adminDeleteWithdrawal(id: string) {
    return this.request<any>(`/api/v1/admin/withdrawals/${id}`, {
      method: 'DELETE'
    });
  }

  // Notifications API Methods
  async getNotifications() {
    return this.request<any[]>('/api/v1/notifications');
  }

  async markNotificationRead(id: string) {
    return this.request<any>(`/api/v1/notifications/${id}/read`, {
      method: 'PATCH',
    });
  }

  async markAllNotificationsRead() {
    return this.request<any>('/api/v1/notifications/read-all', {
      method: 'POST',
    });
  }

  // Support API Methods
  async getTickets() {
    return this.request<any[]>('/api/v1/support/tickets');
  }

  async createTicket(data: { subject: string; category: string; message: string; priority?: string }) {
    return this.request<any>('/api/v1/support/tickets', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getTicketMessages(ticketId: string) {
    return this.request<any[]>(`/api/v1/support/tickets/${ticketId}/messages`);
  }

  async sendTicketMessage(ticketId: string, content: string) {
    return this.request<any>(`/api/v1/support/tickets/${ticketId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  }

  // Admin Platform Settings
  async adminGetPlatformSettings() {
    return this.request<any[]>('/api/v1/admin/platform-settings');
  }

  async adminUpdatePlatformSetting(key: string, data: { value: string; description?: string }) {
    return this.request<any>(`/api/v1/admin/platform-settings/${key}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // ==========================
  // SETTINGS (Profile, MFA, Sessions)
  // ==========================

  // Profile
  async getProfile() {
    return this.request<any>('/api/v1/settings/profile');
  }

  async updateProfile(data: { displayName?: string; firstName?: string; lastName?: string; avatarUrl?: string }) {
    return this.request<any>('/api/v1/settings/profile', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // MFA
  async generateMfa() {
    return this.request<{ secret: string; qrCodeUrl: string }>('/api/v1/settings/mfa/generate', {
      method: 'POST',
    });
  }

  async enableMfa(token: string) {
    return this.request<any>('/api/v1/settings/mfa/enable', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  }

  async disableMfa(token: string) {
    return this.request<any>('/api/v1/settings/mfa/disable', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  }

  // Sessions
  async getSessions() {
    return this.request<any[]>('/api/v1/settings/sessions');
  }

  async revokeSession(sessionId: string) {
    return this.request<any>(`/api/v1/settings/sessions/${sessionId}`, {
      method: 'DELETE',
    });
  }

  async revokeAllOtherSessions() {
    return this.request<any>('/api/v1/settings/sessions/all-except-current', {
      method: 'DELETE',
    });
  }

  // Admin Deposit Settings
  async adminGetDepositSettings() {
    return this.request<any>('/api/v1/admin/deposit-settings');
  }

  async adminUpdateDepositSettings(id: string, data: { enabled?: boolean; instructions?: string }) {
    return this.request<any>(`/api/v1/admin/deposit-settings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Admin Support Tickets
  async adminGetSupportTickets() {
    return this.request<any[]>('/api/v1/admin/support/tickets');
  }

  async adminGetSupportTicketDetails(ticketId: string) {
    return this.request<any>(`/api/v1/admin/support/tickets/${ticketId}`);
  }

  async adminSendSupportMessage(ticketId: string, content: string) {
    return this.request<any>(`/api/v1/admin/support/tickets/${ticketId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  }

  async adminUpdateSupportTicketStatus(ticketId: string, status: string) {
    return this.request<any>(`/api/v1/admin/support/tickets/${ticketId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  // ==========================
  // EXPERTS
  // ==========================

  async getExperts() {
    return this.request<any[]>('/api/v1/experts');
  }

  async getExpert(id: string) {
    return this.request<any>(`/api/v1/experts/${id}`);
  }

  async getExpertServices(expertId: string) {
    return this.request<any[]>(`/api/v1/experts/${expertId}/services`);
  }

  async applyForExpert(data: { bio: string; experienceYears: number; languages: string[]; categories: string[] }) {
    return this.request<any>('/api/v1/experts/apply', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async bookExpertService(data: { serviceId: string; scheduledAt?: string }) {
    return this.request<any>('/api/v1/experts/bookings', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getMyExpertBookings() {
    return this.request<any[]>('/api/v1/experts/bookings/me');
  }

  async submitExpertReview(bookingId: string, rating: number, comment: string) {
    return this.request<any>(`/api/v1/experts/bookings/${bookingId}/review`, {
      method: 'POST',
      body: JSON.stringify({ rating, comment }),
    });
  }

  // EXPERT DASHBOARD
  async expertGetMe() {
    return this.request<any>('/api/v1/experts/dashboard/me');
  }

  async expertUpdateMe(data: any) {
    return this.request<any>('/api/v1/experts/dashboard/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async expertGetServices() {
    return this.request<any[]>('/api/v1/experts/dashboard/services');
  }

  async expertCreateService(data: any) {
    return this.request<any>('/api/v1/experts/dashboard/services', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async expertUpdateService(serviceId: string, data: any) {
    return this.request<any>(`/api/v1/experts/dashboard/services/${serviceId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async expertDeleteService(serviceId: string) {
    return this.request<any>(`/api/v1/experts/dashboard/services/${serviceId}`, {
      method: 'DELETE',
    });
  }

  async expertGetBookings() {
    return this.request<any[]>('/api/v1/experts/dashboard/bookings');
  }

  async expertActionBooking(bookingId: string, action: 'ACCEPT' | 'REJECT' | 'COMPLETE') {
    return this.request<any>(`/api/v1/experts/dashboard/bookings/${bookingId}/action`, {
      method: 'POST',
      body: JSON.stringify({ action }),
    });
  }

  // EXPERT MESSAGING
  async getExpertMessages(bookingId: string) {
    return this.request<any>(`/api/v1/experts/bookings/${bookingId}/messages`);
  }

  async sendExpertMessage(bookingId: string, content: string) {
    return this.request<any>(`/api/v1/experts/bookings/${bookingId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  }

  async expertToggleChat(bookingId: string, chatEnabled: boolean) {
    return this.request<any>(`/api/v1/experts/dashboard/bookings/${bookingId}/chat-toggle`, {
      method: 'PUT',
      body: JSON.stringify({ chatEnabled }),
    });
  }

  // Notifications
  async getNotifications() {
    return this.request<any[]>('/api/v1/notifications');
  }

  async readNotification(id: string) {
    return this.request<any>(`/api/v1/notifications/${id}/read`, {
      method: 'PATCH'
    });
  }

  async readAllNotifications() {
    return this.request<any>('/api/v1/notifications/read-all', {
      method: 'POST'
    });
  }

  // Admin Currency Rates
  async adminGetCurrencyRates() {
    return this.request<any[]>('/api/v1/admin/currency-rates');
  }

  async adminCreateCurrencyRate(data: any) {
    return this.request<any>('/api/v1/admin/currency-rates', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async adminUpdateCurrencyRate(code: string, data: any) {
    return this.request<any>(`/api/v1/admin/currency-rates/${code}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async adminUpdateCurrencyRateStatus(code: string, status: string) {
    return this.request<any>(`/api/v1/admin/currency-rates/${code}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  async adminGetCurrencyRateHistory(code: string) {
    return this.request<any[]>(`/api/v1/admin/currency-rates/${code}/history`);
  }
}

export const apiClient = new EthsltdClient();
