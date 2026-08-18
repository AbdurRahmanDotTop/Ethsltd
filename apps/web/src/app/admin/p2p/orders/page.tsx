"use client";

import { useState, useEffect } from "react";
import { 
  Handshake, Search, Filter, AlertTriangle, 
  CheckCircle, XCircle, Clock, Eye,
  User, DollarSign, Ban, RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiClient } from "@ethsltd/api-client";
import { toast } from "sonner";

export default function AdminP2POrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res = await apiClient.adminGetP2POrders();
      if (res.success) {
        setOrders(res.data);
      } else {
        toast.error(res.error || "Failed to fetch orders");
      }
    } catch (err) {
      toast.error("Network error fetching orders");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(o => {
    const oId = o.displayId || o.id;
    const matchesSearch = 
      oId.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (o.buyerEmail || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (o.sellerEmail || "").toLowerCase().includes(searchTerm.toLowerCase());
    
    // Status mapping to common names if needed, or exact match
    // Real statuses: CREATED, PAYMENT_PENDING, BUYER_MARKED_PAID, SELLER_PAYMENT_REVIEW, DISPUTED, COMPLETED, CANCELLED, EXPIRED
    let mappedStatus = o.status.toLowerCase();
    
    // Standardize for filter
    let fStatus = filterStatus;
    
    const matchesStatus = fStatus === "all" || mappedStatus === fStatus.toLowerCase() || (fStatus === "paid" && mappedStatus.includes("paid")) || (fStatus === "pending" && mappedStatus.includes("pending"));
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'COMPLETED': return <span className="flex items-center gap-1 text-xs font-medium text-green-500 bg-green-500/10 px-2 py-1 rounded-full border border-green-500/20"><CheckCircle className="w-3 h-3"/> Completed</span>;
      case 'BUYER_MARKED_PAID': 
      case 'SELLER_PAYMENT_REVIEW': return <span className="flex items-center gap-1 text-xs font-medium text-blue-500 bg-blue-500/10 px-2 py-1 rounded-full border border-blue-500/20"><DollarSign className="w-3 h-3"/> Paid (Awaiting Release)</span>;
      case 'CREATED':
      case 'PAYMENT_PENDING': return <span className="flex items-center gap-1 text-xs font-medium text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded-full border border-yellow-500/20"><Clock className="w-3 h-3"/> Pending Payment</span>;
      case 'DISPUTED': return <span className="flex items-center gap-1 text-xs font-medium text-red-500 bg-red-500/10 px-2 py-1 rounded-full border border-red-500/20"><AlertTriangle className="w-3 h-3"/> Disputed</span>;
      case 'CANCELLED': 
      case 'EXPIRED': return <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-full border border-border"><XCircle className="w-3 h-3"/> {status === 'EXPIRED' ? 'Expired' : 'Cancelled'}</span>;
      default: return <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-full border border-border">{status}</span>;
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
        <Button onClick={fetchOrders} disabled={isLoading} variant="outline">
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
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
                <th className="px-6 py-4 font-medium">Asset</th>
                <th className="px-6 py-4 font-medium">Amount & Price</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
                    Loading orders...
                  </td>
                </tr>
              ) : filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-foreground font-mono">{order.displayId || order.id}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{new Date(order.createdAt).toLocaleString()}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <User className="w-3 h-3 text-muted-foreground" /> 
                        <span className="font-medium text-xs truncate max-w-[120px]">B: {order.buyerEmail?.split('@')[0]}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <User className="w-3 h-3 text-muted-foreground" /> 
                        <span className="font-medium text-muted-foreground text-xs truncate max-w-[120px]">S: {order.sellerEmail?.split('@')[0]}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{order.asset}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Fiat: {order.fiatCurrency}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-foreground">{order.cryptoAmount} {order.asset}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{order.fiatAmount} {order.fiatCurrency} @ {order.price}</p>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button 
                        variant="secondary" 
                        size="sm"
                        onClick={() => setSelectedOrder(order)}
                        className={order.status === 'DISPUTED' ? "bg-red-500/10 text-red-500 hover:bg-red-500/20" : ""}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Details
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
                  Trade Details <span className="text-xs font-mono font-normal text-muted-foreground ml-2">({selectedOrder.displayId || selectedOrder.id})</span>
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
              
              {selectedOrder.status === 'DISPUTED' && (
                <div className="bg-red-500/10 text-red-500 p-4 rounded-lg flex gap-3 text-sm border border-red-500/20">
                  <AlertTriangle className="w-5 h-5 shrink-0" />
                  <div>
                    <p className="font-bold">This trade is under dispute.</p>
                    <p className="mt-1">Review this trade from the Disputes panel to take action.</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 bg-muted/30 p-4 rounded-lg border border-border">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Asset Amount</p>
                  <p className="font-bold text-lg text-brand-primary">{selectedOrder.cryptoAmount} {selectedOrder.asset}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Fiat Amount</p>
                  <p className="font-bold text-lg">{selectedOrder.fiatAmount} {selectedOrder.fiatCurrency}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Exchange Rate</p>
                  <p className="font-medium text-sm">1 {selectedOrder.asset} = {selectedOrder.price} {selectedOrder.fiatCurrency}</p>
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
                    <p className="truncate"><span className="text-muted-foreground">User:</span> {selectedOrder.buyerEmail}</p>
                    <p><span className="text-muted-foreground">Internal ID:</span> <span className="text-xs text-muted-foreground">{selectedOrder.buyerId.substring(0,8)}...</span></p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Seller Info</h3>
                  <div className="bg-muted/50 p-3 rounded-lg border border-border space-y-1 text-sm">
                    <p className="truncate"><span className="text-muted-foreground">User:</span> {selectedOrder.sellerEmail}</p>
                    <p><span className="text-muted-foreground">Internal ID:</span> <span className="text-xs text-muted-foreground">{selectedOrder.sellerId.substring(0,8)}...</span></p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Internal Timeline</h3>
                <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-brand-primary bg-background shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2"></div>
                    <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.25rem)] p-3 rounded-lg border border-border bg-card shadow-sm">
                      <p className="font-semibold text-sm">Order Created</p>
                      <p className="text-xs text-muted-foreground mt-1">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                  
                  {['BUYER_MARKED_PAID', 'SELLER_PAYMENT_REVIEW', 'COMPLETED', 'DISPUTED'].includes(selectedOrder.status) && (
                    <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-brand-primary bg-background shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2"></div>
                      <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.25rem)] p-3 rounded-lg border border-border bg-card shadow-sm">
                        <p className="font-semibold text-sm">Action Taken</p>
                        <p className="text-xs text-muted-foreground mt-1">Status transitioned to {selectedOrder.status}</p>
                      </div>
                    </div>
                  )}

                  {selectedOrder.status === 'COMPLETED' && (
                    <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-green-500 bg-background shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2"></div>
                      <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.25rem)] p-3 rounded-lg border border-border bg-card shadow-sm">
                        <p className="font-semibold text-sm text-green-500">Completed</p>
                        <p className="text-xs text-muted-foreground mt-1">{new Date(selectedOrder.updatedAt).toLocaleString()}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

            </div>

            <div className="px-6 py-4 border-t border-border bg-muted/20 flex justify-between items-center">
              <div>
                
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
