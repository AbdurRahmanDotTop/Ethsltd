"use client";

import { useEffect, useState } from "react";
import { MockAdminProvider } from "@/lib/admin/providers/mock-admin-provider";
import { AdminTrade } from "@/lib/admin/types";
import { AdminDataTable, Column } from "@/components/admin/AdminDataTable";
import { Filter, ArrowRight } from "lucide-react";

export default function AdminTradesPage() {
  const [trades, setTrades] = useState<AdminTrade[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  
  const [page, setPage] = useState(1);
  const [market, setMarket] = useState("ALL");
  const limit = 20;

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    MockAdminProvider.getTrades({ page, limit, market }).then((res) => {
      if (isMounted) {
        setTrades(res.items);
        setTotal(res.total);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [page, market]);

  const columns: Column<AdminTrade>[] = [
    {
      header: "Trade ID",
      accessor: "id",
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
        <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${row.side === 'BUY' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
          {row.side}
        </span>
      )
    },
    {
      header: "Price",
      accessor: (row) => (
        <span className="font-medium">
          ${row.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
        </span>
      )
    },
    {
      header: "Amount",
      accessor: (row) => (
        <span className="font-medium">
          {row.amount.toLocaleString(undefined, { maximumFractionDigits: 6 })}
        </span>
      )
    },
    {
      header: "Total Vol",
      accessor: (row) => (
        <span className="font-medium text-brand-primary">
          ${row.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      )
    },
    {
      header: "Participants",
      accessor: (row) => (
        <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
          <span title="Maker" className="border-b border-dashed border-muted-foreground">{row.makerId.split('-').pop()}</span>
          <ArrowRight className="w-3 h-3" />
          <span title="Taker" className="border-b border-dashed border-muted-foreground">{row.takerId.split('-').pop()}</span>
        </div>
      )
    },
    {
      header: "Time",
      accessor: (row) => <span className="text-xs text-muted-foreground">{new Date(row.timestamp).toLocaleString()}</span>
    }
  ];

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Trade History</h2>
          <p className="text-muted-foreground mt-1 text-sm">Global chronological log of all executed trades.</p>
        </div>
        
        <div className="flex gap-3">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <select 
              value={market}
              onChange={(e) => { setMarket(e.target.value); setPage(1); }}
              className="pl-9 pr-8 py-2 bg-card border border-border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-brand-primary appearance-none cursor-pointer"
            >
              <option value="ALL">All Markets</option>
              <option value="BTC/USD">BTC/USD</option>
              <option value="ETH/USD">ETH/USD</option>
              <option value="SOL/USD">SOL/USD</option>
            </select>
          </div>
        </div>
      </div>

      <div className="relative min-h-[400px]">
        {loading && (
          <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10 rounded-lg">
            <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        
        <AdminDataTable 
          columns={columns} 
          data={trades} 
          page={page}
          totalPages={Math.ceil(total / limit)}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}
