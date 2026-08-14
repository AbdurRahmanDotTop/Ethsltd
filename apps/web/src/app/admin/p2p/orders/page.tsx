"use client";

import { useState } from "react";
import { 
  Handshake, Search, Filter, AlertTriangle, 
  CheckCircle, XCircle, Clock, Eye, AlertCircle,
  ArrowRightLeft, User, DollarSign, Ban
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Types
type OrderStatus = 'pending' | 'paid' | 'completed' | 'disputed' | 'cancelled';

interface P2POrder {
  id: string;
  type: 'buy' | 'sell';
  asset: string;
  fiat: string;
  amount: number;
  fiatAmount: number;
  price: number;
  buyer: string;
  seller: string;
  status: OrderStatus;
  createdAt: string;
  paymentMethod: string;
}

// Mock Data
const MOCK_ORDERS: P2POrder[] = [
  { id: "P2P-10045", type: "buy", asset: "USDT", fiat: "USD", amount: 1500, fiatAmount: 1500, price: 1.00, buyer: "USR-882", seller: "MM-09", status: "disputed", createdAt: "2026-08-14T10:15:00Z", paymentMethod: "Bank Transfer" },
  { id: "P2P-10046", type: "sell", asset: "BTC", fiat: "EUR", amount: 0.5, fiatAmount: 32500, price: 65000, buyer: "USR-412", seller: "USR-771", status: "completed", createdAt: "2026-08-14T09:30:00Z", paymentMethod: "SEPA" },
  { id: "P2P-10047", type: "buy", asset: "ETH", fiat: "GBP", amount: 2.0, fiatAmount: 5600, price: 2800, buyer: "USR-115", seller: "MM-12", status: "pending", createdAt: "2026-08-14T11:05:00Z", paymentMethod: "PayPal" },
  { id: "P2P-10048", type: "sell", asset: "USDT", fiat: "USD", amount: 5000, fiatAmount: 5000, price: 1.00, buyer: "USR-999", seller: "USR-333", status: "paid", createdAt: "2026-08-14T10:45:00Z", paymentMethod: "Zelle" },
  { id: "P2P-10049", type: "buy", asset: "BTC", fiat: "USD", amount: 0.1, fiatAmount: 6600, price: 66000, buyer: "USR-201", seller: "MM-02", status: "cancelled", createdAt: "2026-08-13T16:20:00Z", paymentMethod: "Cash App" },
];

export default function AdminP2POrdersPage() {
  const [orders, setOrders] = useState<P2POrder[]>(MOCK_ORDERS);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  
  const [selectedOrder, setSelectedOrder] = useState<P2POrder | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const filteredOrders = orders.filter(o => {
    const matchesSearch = 
      o.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
      o.buyer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.seller.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || o.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleCancelOrder = (orderId: string) => {
    setIsProcessing(true);
    setTimeout(() => {
      setOrders(prev => prev.map(o => 
        o.id === orderId ? { ...o, status: 'cancelled' } : o
      ));
      setIsProcessing(false);
      setSelectedOrder(null);
    }, 1500);
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch(status) {
      case 'completed': return <span className="flex items-center gap-1 text-xs font-medium text-green-500 bg-green-500/10 px-2 py-1 rounded-full border border-green-500/20"><CheckCircle className="w-3 h-3"/> Completed</span>;
      case 'paid': return <span className="flex items-center gap-1 text-xs font-medium text-blue-500 bg-blue-500/10 px-2 py-1 rounded-full border border-blue-500/20"><DollarSign className="w-3 h-3"/> Paid (Awaiting Release)</span>;
      case 'pending': return <span className="flex items-center gap-1 text-xs font-medium text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded-full border border-yellow-500/20"><Clock className="w-3 h-3"/> Pending Payment</span>;
      case 'disputed': return <span className="flex items-center gap-1 text-xs font-medium text-red-500 bg-red-500/10 px-2 py-1 rounded-full border border-red-500/20"><AlertTriangle className="w-3 h-3"/> Disputed</span>;
      case 'cancelled': return <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-full border border-border"><XCircle className="w-3 h-3"/> Cancelled</span>;
      default: return null;
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Handshake className="w-6 h-6 text-brand-primary" /> P2P Orders
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">Monitor all peer-to-peer trades across the platform.</p>
        </div>
      </div>

      {/* High-Level Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <p className="text-sm font-medium text-muted-foreground">24h P2P Volume</p>
          <h3 className="text-2xl font-bold mt-2">$1.24M</h3>
          <p className="text-xs text-green-500 font-medium mt-1">+14% from yesterday</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <p className="text-sm font-medium text-muted-foreground">Active Trades</p>
          <h3 className="text-2xl font-bold mt-2">142</h3>
          <p className="text-xs text-blue-500 font-medium mt-1">Pending & Paid</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <p className="text-sm font-medium text-muted-foreground">Disputed Trades</p>
          <h3 className="text-2xl font-bold mt-2">12</h3>
          <p className="text-xs text-red-500 font-medium mt-1">Require mediation</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <p className="text-sm font-medium text-muted-foreground">Success Rate</p>
          <h3 className="text-2xl font-bold mt-2">98.4%</h3>
          <p className="text-xs text-green-500 font-medium mt-1">Completed / Total</p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-card border border-border rounded-xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search by Order ID, Buyer, or Seller..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-background border border-border rounded-md pl-10 pr-4 py-2 text-sm focus:ring-1 focus:ring-brand-primary outline-none transition-shadow"
          />
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Filter className="w-4 h-4" />
            <span>Status:</span>
          </div>
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-background border border-border rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-brand-primary outline-none"
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending Payment</option>
            <option value="paid">Paid (Awaiting Release)</option>
            <option value="completed">Completed</option>
            <option value="disputed">Disputed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium">Order ID & Date</th>
                <th className="px-6 py-4 font-medium">Buyer / Seller</th>
                <th className="px-6 py-4 font-medium">Type & Asset</th>
                <th className="px-6 py-4 font-medium">Amount & Price</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-foreground font-mono">{order.id}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{new Date(order.createdAt).toLocaleString()}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <User className="w-3 h-3 text-muted-foreground" /> 
                        <span className="font-medium">B: {order.buyer}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <User className="w-3 h-3 text-muted-foreground" /> 
                        <span className="font-medium text-muted-foreground">S: {order.seller}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${order.type === 'buy' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                          {order.type}
                        </span>
                        <span className="font-bold">{order.asset}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Fiat: {order.fiat}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-foreground">{order.amount} {order.asset}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{order.fiatAmount} {order.fiat} @ {order.price}</p>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button 
                        variant="secondary" 
                        size="sm"
                        onClick={() => setSelectedOrder(order)}
                        className={order.status === 'disputed' ? "bg-red-500/10 text-red-500 hover:bg-red-500/20" : ""}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        {order.status === 'disputed' ? 'Resolve Dispute' : 'View Details'}
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Search className="w-8 h-8 text-muted-foreground/50" />
                      <p>No P2P orders found matching your filters.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-in zoom-in-95">
            
            <div className="px-6 py-4 border-b border-border flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold flex items-center gap-2">
                  Trade Details <span className="text-xs font-mono font-normal text-muted-foreground ml-2">({selectedOrder.id})</span>
                </h2>
              </div>
              <button 
                onClick={() => !isProcessing && setSelectedOrder(null)}
                className="p-2 hover:bg-muted rounded-full transition-colors"
                disabled={isProcessing}
              >
                <XCircle className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              
              {selectedOrder.status === 'disputed' && (
                <div className="bg-red-500/10 text-red-500 p-4 rounded-lg flex gap-3 text-sm border border-red-500/20">
                  <AlertTriangle className="w-5 h-5 shrink-0" />
                  <div>
                    <p className="font-bold">This trade is under dispute.</p>
                    <p className="mt-1">The buyer claims payment was made, but the seller has not received funds. Review chat logs and payment proofs in the Mediation Center.</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 bg-muted/30 p-4 rounded-lg border border-border">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Asset Amount</p>
                  <p className="font-bold text-lg text-brand-primary">{selectedOrder.amount} {selectedOrder.asset}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Fiat Amount</p>
                  <p className="font-bold text-lg">{selectedOrder.fiatAmount} {selectedOrder.fiat}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Exchange Rate</p>
                  <p className="font-medium text-sm">1 {selectedOrder.asset} = {selectedOrder.price} {selectedOrder.fiat}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Payment Method</p>
                  <p className="font-medium text-sm">{selectedOrder.paymentMethod}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Buyer Info</h3>
                  <div className="bg-muted/50 p-3 rounded-lg border border-border space-y-1 text-sm">
                    <p><span className="text-muted-foreground">User ID:</span> {selectedOrder.buyer}</p>
                    <p><span className="text-muted-foreground">KYC:</span> <span className="text-green-500 font-medium">Verified</span></p>
                    <p><span className="text-muted-foreground">Trades:</span> 45 (98% completion)</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Seller Info</h3>
                  <div className="bg-muted/50 p-3 rounded-lg border border-border space-y-1 text-sm">
                    <p><span className="text-muted-foreground">User ID:</span> {selectedOrder.seller}</p>
                    <p><span className="text-muted-foreground">KYC:</span> <span className="text-green-500 font-medium">Merchant</span></p>
                    <p><span className="text-muted-foreground">Trades:</span> 1,204 (99% completion)</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Trade Timeline</h3>
                <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-brand-primary bg-background shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2"></div>
                    <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.25rem)] p-3 rounded-lg border border-border bg-card shadow-sm">
                      <p className="font-semibold text-sm">Order Created</p>
                      <p className="text-xs text-muted-foreground mt-1">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                  
                  {(selectedOrder.status === 'paid' || selectedOrder.status === 'completed' || selectedOrder.status === 'disputed') && (
                    <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-brand-primary bg-background shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2"></div>
                      <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.25rem)] p-3 rounded-lg border border-border bg-card shadow-sm">
                        <p className="font-semibold text-sm">Buyer marked as Paid</p>
                        <p className="text-xs text-muted-foreground mt-1">15 mins after creation</p>
                      </div>
                    </div>
                  )}

                  {selectedOrder.status === 'completed' && (
                    <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-green-500 bg-background shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2"></div>
                      <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.25rem)] p-3 rounded-lg border border-border bg-card shadow-sm">
                        <p className="font-semibold text-sm text-green-500">Asset Released by Seller</p>
                        <p className="text-xs text-muted-foreground mt-1">Trade successfully completed</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

            </div>

            <div className="px-6 py-4 border-t border-border bg-muted/20 flex justify-between items-center">
              <div>
                {(selectedOrder.status === 'pending' || selectedOrder.status === 'paid' || selectedOrder.status === 'disputed') && (
                  <Button 
                    variant="destructive"
                    onClick={() => handleCancelOrder(selectedOrder.id)}
                    disabled={isProcessing}
                    className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                  >
                    {isProcessing ? (
                      <span className="flex items-center"><Clock className="w-4 h-4 mr-2 animate-spin" /> Processing...</span>
                    ) : (
                      <span className="flex items-center"><Ban className="w-4 h-4 mr-2" /> Force Cancel Order</span>
                    )}
                  </Button>
                )}
              </div>
              <Button 
                variant="outline" 
                onClick={() => setSelectedOrder(null)}
                disabled={isProcessing}
              >
                Close Details
              </Button>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
}
