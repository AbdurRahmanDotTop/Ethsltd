"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@ethsltd/api-client";
import { AdminDataTable, Column } from "@/components/admin/AdminDataTable";
import { Filter } from "lucide-react";
import { useAdminEnvStore } from "@/stores/admin-env-store";

export default function AdminTradesPage() {
  const [trades, setTrades] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  
  const [page, setPage] = useState(1);
  const [market, setMarket] = useState("ALL");
  const limit = 20;

  const { adminMode, setAdminMode } = useAdminEnvStore();

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    apiClient.adminGetTrades({ page, limit, market, mode: adminMode }).then((res) => {
      if (res.success && isMounted) {
        setTrades(res.data?.data || []);
        setTotal(res.data?.total || 0);
      }
      if (isMounted) setLoading(false);
    }).catch(() => {
      if (isMounted) {
        setTrades([]);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [page, market, adminMode]);

  const columns: Column<any>[] = [
    {
      header: "Trade ID",
      accessor: (row: any) => row.displayId || row.id,
      className: "font-mono text-xs text-muted-foreground"
    },
    {
      header: "Market",
      accessor: (row) => (
        <span className="font-bold">{row.market}</span>
      )
    },
    {
      header: "Taker Side",
      accessor: (row) => (
        <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${row.takerSide === 'BUY' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
          {row.takerSide}
        </span>
      )
    },
    {
      header: "Price",
      accessor: (row) => (
        <span className="font-medium">
          ${parseFloat(row.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
        </span>
      )
    },
    {
      header: "Amount",
      accessor: (row) => (
        <span className="font-medium">
          {parseFloat(row.amount).toLocaleString(undefined, { maximumFractionDigits: 6 })}
        </span>
      )
    },
    {
      header: "Total Vol",
      accessor: (row) => (
        <span className="font-medium text-brand-primary">
          ${(parseFloat(row.price) * parseFloat(row.amount)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      )
    },
    {
      header: "Fees (Maker/Taker)",
      accessor: (row) => (
        <div className="flex items-center gap-1 text-xs font-mono text-muted-foreground">
          <span>{row.makerFee}</span> / <span>{row.takerFee}</span>
        </div>
      )
    },
    {
      header: "Time",
      accessor: (row) => <span className="text-xs text-muted-foreground">{new Date(row.createdAt).toLocaleString()}</span>
    }
  ];

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Trade History</h2>
          <p className="text-muted-foreground mt-1 text-sm">Global chronological log of all executed trades.</p>
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

      <div className="relative bg-card border border-border/50 rounded-lg overflow-hidden flex flex-col shadow-sm min-h-[400px]">
        {loading && (
          <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10 rounded-lg">
            <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        <div className="p-4 border-b border-border/50 bg-muted/20 flex flex-wrap gap-4 justify-end">
          <div className="flex items-center gap-2 text-sm bg-background border border-border/50 px-3 py-1.5 rounded-md">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <select 
              value={market}
              onChange={(e) => setMarket(e.target.value)}
              className="bg-transparent border-none focus:ring-0 cursor-pointer font-medium"
            >
              <option value="ALL">All Markets</option>
              <option value="BTC/USD">BTC/USD</option>
              <option value="ETH/USD">ETH/USD</option>
              <option value="SOL/USD">SOL/USD</option>
            </select>
          </div>
        </div>

        <AdminDataTable 
          columns={columns} 
          data={trades} 
        />
        
        {total > limit && (
          <div className="p-4 border-t border-border/50 bg-muted/20 flex items-center justify-between flex-wrap gap-y-4">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-medium text-foreground">{((page - 1) * limit) + 1}</span> to <span className="font-medium text-foreground">{Math.min(page * limit, total)}</span> of <span className="font-medium text-foreground">{total}</span> trades
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
