"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@ethsltd/api-client";
import { AdminDataTable, Column } from "@/components/admin/AdminDataTable";
import { Filter, XCircle } from "lucide-react";
import { useAdminEnvStore } from "@/stores/admin-env-store";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("ALL");
  const [market, setMarket] = useState("ALL");
  const { adminMode, setAdminMode } = useAdminEnvStore();
  const limit = 20;

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    apiClient.adminGetOrders({ page, limit, status, market, mode: adminMode }).then((res) => {
      if (res.success && isMounted) {
        setOrders(res.data?.data || []);
        setTotal(res.data?.total || 0);
      }
      if (isMounted) setLoading(false);
    }).catch(() => {
      if (isMounted) {
        setOrders([]);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [page, status, market, adminMode]);

  const handleCancel = async (id: string) => {
    // Currently no real backend force-cancel API, but we simulate optimism if we had one
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'CANCELED' } : o));
  };

  const columns: Column<any>[] = [
    {
      header: "Order ID",
      accessor: "id",
      className: "font-mono text-xs text-muted-foreground"
    },
    {
      header: "User",
      accessor: (row) => (
        <div className="flex flex-col">
          <span className="font-medium">{row.userName}</span>
          <span className="text-xs text-muted-foreground font-mono">{row.userId}</span>
        </div>
      )
    },
    {
      header: "Market",
      accessor: (row) => (
        <span className="font-bold">{row.market}</span>
      )
    },
    {
      header: "Side & Type",
      accessor: (row) => (
        <div className="flex items-center gap-2">
          <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${row.side === 'BUY' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
            {row.side}
          </span>
          <span className="text-xs text-muted-foreground">{row.type}</span>
        </div>
      )
    },
    {
      header: "Price",
      accessor: (row) => (
        <span className="font-medium">
          {row.type === 'MARKET' ? 'Market' : `$${parseFloat(row.price || '0').toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}`}
        </span>
      )
    },
    {
      header: "Amount / Filled",
      accessor: (row) => {
        const amt = parseFloat(row.amount || '0');
        const filled = parseFloat(row.filledAmount || '0');
        const percent = amt > 0 ? (filled / amt) * 100 : 0;
        return (
          <div className="flex flex-col gap-1 w-32">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">{filled.toLocaleString(undefined, { maximumFractionDigits: 4 })}</span>
              <span className="font-medium">{amt.toLocaleString(undefined, { maximumFractionDigits: 4 })}</span>
            </div>
            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
              <div 
                className={`h-full ${percent === 100 ? 'bg-green-500' : 'bg-brand-primary'}`} 
                style={{ width: `${percent}%` }} 
              />
            </div>
          </div>
        );
      }
    },
    {
      header: "Status",
      accessor: (row) => {
        const colors: Record<string, string> = {
          OPEN: "text-blue-500",
          PARTIAL: "text-yellow-500",
          FILLED: "text-green-500",
          CANCELED: "text-muted-foreground",
          REJECTED: "text-red-500",
        };
        return <span className={`text-xs font-bold ${colors[row.status] || ""}`}>{row.status}</span>;
      }
    },
    {
      header: "Date",
      accessor: (row) => <span className="text-xs text-muted-foreground">{new Date(row.createdAt).toLocaleString()}</span>
    },
    {
      header: "Actions",
      accessor: (row) => {
        if (row.status !== "OPEN" && row.status !== "PARTIAL") return <span className="text-muted-foreground text-xs">-</span>;
        return (
          <button 
            onClick={() => handleCancel(row.id)}
            className="flex items-center gap-1 px-2 py-1 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded text-xs transition-colors" 
            title="Force Cancel Order"
          >
            <XCircle className="w-3 h-3" /> Cancel
          </button>
        );
      }
    }
  ];

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Active Orders</h2>
          <p className="text-muted-foreground mt-1 text-sm">Monitor and manage open limit and stop orders globally.</p>
        </div>
        
        {/* Real / Demo Toggle */}
        <div className="flex bg-muted/50 p-1 rounded-md border border-border/50 self-start sm:self-auto">
          <button
            onClick={() => setAdminMode('REAL')}
            className={`px-4 py-1.5 text-sm font-medium rounded transition-all ${
              adminMode === 'REAL'
                ? 'bg-brand-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Real
          </button>
          <button
            onClick={() => setAdminMode('DEMO')}
            className={`px-4 py-1.5 text-sm font-medium rounded transition-all ${
              adminMode === 'DEMO'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Demo
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <select 
            value={market}
            onChange={(e) => { setMarket(e.target.value); setPage(1); }}
            className="pl-9 pr-8 py-2 bg-card border border-border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-brand-primary appearance-none cursor-pointer"
          >
            <option value="ALL">All Markets</option>
            <option value="BTC-USDT">BTC-USDT</option>
            <option value="ETH-USDT">ETH-USDT</option>
            <option value="SOL-USDT">SOL-USDT</option>
          </select>
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <select 
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
            className="pl-9 pr-8 py-2 bg-card border border-border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-brand-primary appearance-none cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="OPEN">Open</option>
            <option value="PARTIAL">Partial</option>
            <option value="FILLED">Filled</option>
            <option value="CANCELED">Canceled</option>
          </select>
        </div>
      </div>

      <div className="relative bg-card border border-border/50 rounded-lg overflow-hidden shadow-sm min-h-[400px]">
        {loading && (
          <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10 rounded-lg">
            <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        <AdminDataTable 
          columns={columns} 
          data={orders} 
        />
        
        {total > limit && (
          <div className="p-4 border-t border-border/50 bg-muted/20 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-medium text-foreground">{((page - 1) * limit) + 1}</span> to <span className="font-medium text-foreground">{Math.min(page * limit, total)}</span> of <span className="font-medium text-foreground">{total}</span> orders
            </p>
            <div className="flex gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                className="px-3 py-1 text-sm bg-background border border-border/50 rounded hover:bg-muted disabled:opacity-50"
              >
                Previous
              </button>
              <button
                disabled={page * limit >= total}
                onClick={() => setPage(p => p + 1)}
                className="px-3 py-1 text-sm bg-background border border-border/50 rounded hover:bg-muted disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
