"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@ethsltd/api-client";
import { AdminDataTable, Column } from "@/components/admin/AdminDataTable";
import { Filter, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminPositionsPage() {
  const [positions, setPositions] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  
  const [page, setPage] = useState(1);
  const [market, setMarket] = useState("ALL");
  const limit = 20;

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    apiClient.adminGetPositions({ page, limit, market }).then((res) => {
      if (res.success && isMounted) {
        setPositions(res.data?.data || []);
        setTotal(res.data?.total || 0);
      }
      if (isMounted) setLoading(false);
    }).catch(() => {
      if (isMounted) {
        setPositions([]);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [page, market]);

  const handleClose = async (id: string) => {
    if (!confirm("Are you sure you want to emergency close this position?")) return;
    try {
      const res = await apiClient.adminClosePosition(id);
      if (res.success) {
        setPositions(prev => prev.map(p => p.id === id ? { ...p, status: 'CLOSED' } : p));
        alert(res.message || 'Position closed successfully');
      } else {
        alert(res.error || 'Failed to close position');
      }
    } catch (e: any) {
      alert(e.message || 'An error occurred');
    }
  };

  const columns: Column<any>[] = [
    {
      header: "Position ID",
      accessor: (row: any) => row.displayId || row.id,
      className: "font-mono text-xs text-muted-foreground"
    },
    {
      header: "User",
      accessor: (row) => (
        <div className="flex flex-col">
          <span className="font-medium">{row.userEmail}</span>
        </div>
      )
    },
    {
      header: "Market",
      accessor: (row) => (
        <span className="font-bold">{row.marketSymbol}</span>
      )
    },
    {
      header: "Side & Status",
      accessor: (row) => (
        <div className="flex items-center gap-2">
          <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${row.side === 'LONG' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
            {row.side}
          </span>
          <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${row.status === 'OPEN' ? 'bg-blue-500/10 text-blue-500' : 'bg-gray-500/10 text-gray-500'}`}>
            {row.status}
          </span>
        </div>
      )
    },
    {
      header: "Entry Price",
      accessor: (row) => (
        <span className="font-medium">
          ${parseFloat(row.entryPrice || '0').toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
        </span>
      )
    },
    {
      header: "Margin / Lev",
      accessor: (row) => (
        <div className="flex flex-col">
          <span className="font-medium">${parseFloat(row.marginAmount || '0').toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
          <span className="text-xs text-muted-foreground">{row.leverage}x</span>
        </div>
      )
    },
    {
      header: "Time",
      accessor: (row) => <span className="text-xs text-muted-foreground">{new Date(row.createdAt).toLocaleString()}</span>
    },
    {
      header: "Actions",
      accessor: (row) => (
        <div className="flex items-center gap-2">
          {row.status === 'OPEN' && (
            <Button variant="outline" size="sm" onClick={() => handleClose(row.id)} className="text-red-500 hover:text-red-600 hover:bg-red-500/10 border-red-500/20">
              <XCircle className="w-4 h-4 mr-1" /> Close
            </Button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Positions</h1>
          <p className="text-muted-foreground mt-1 text-sm">Monitor and manage open positions.</p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-card border border-border rounded-md px-3 py-1.5">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <select 
              className="bg-transparent border-none outline-none text-sm font-medium"
              value={market}
              onChange={(e) => setMarket(e.target.value)}
            >
              <option value="ALL">All Markets</option>
              <option value="BTC-USDT">BTC-USDT</option>
              <option value="ETH-USDT">ETH-USDT</option>
              <option value="SOL-USDT">SOL-USDT</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <AdminDataTable 
          columns={columns}
          data={positions}
          page={page}
          totalPages={Math.ceil(total / limit)}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}
