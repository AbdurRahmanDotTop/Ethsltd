"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@ethsltd/api-client";
import { AdminDataTable, Column } from "@/components/admin/AdminDataTable";

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const res = await apiClient.getAdminTransactions();
        if (isMounted && res.success) {
          setTransactions(res.data || []);
        }
      } catch (e) {
        console.error("Failed to fetch transactions:", e);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchTransactions();
    return () => { isMounted = false; };
  }, []);

  const columns: Column<Record<string, unknown>>[] = [
    {
      header: "Tx ID",
      accessor: (row: any) => row.displayId || row.id,
      className: "font-mono text-xs text-muted-foreground"
    },
    {
      header: "User",
      accessor: (row) => (
        <div className="flex flex-col">
          <span className="font-medium">{(row.userName as string) || "Unknown"}</span>
          <span className="text-xs text-muted-foreground font-mono">{row.userId as string}</span>
        </div>
      )
    },
    {
      header: "Type",
      accessor: (row) => (
        <span className="px-2 py-1 rounded text-xs bg-muted">
          {row.type as string}
        </span>
      )
    },
    {
      header: "Asset",
      accessor: (row) => (
        <span className="font-bold">
          {row.asset as string}
        </span>
      )
    },
    {
      header: "Amount",
      accessor: "amount"
    },
    {
      header: "Mode",
      accessor: (row) => (
        <span className={`px-2 py-1 rounded text-xs ${row.mode === 'REAL' ? 'bg-green-500/10 text-green-500' : 'bg-orange-500/10 text-orange-500'}`}>
          {row.mode as string}
        </span>
      )
    },
    {
      header: "Status",
      accessor: (row) => {
        const status = row.status as string;
        const color = 
          status === 'COMPLETED' || status === 'APPROVED' ? 'bg-green-500/10 text-green-500' :
          status === 'REJECTED' || status === 'FAILED' ? 'bg-red-500/10 text-red-500' :
          'bg-yellow-500/10 text-yellow-500';
          
        return <span className={`px-2 py-1 rounded text-xs ${color}`}>{status}</span>;
      }
    },
    {
      header: "Date",
      accessor: (row) => new Date(row.createdAt as string).toLocaleString(),
      className: "text-xs text-muted-foreground"
    }
  ];

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Global Transactions</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            View all user wallet transactions across the platform.
          </p>
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
          data={transactions} 
          page={1}
          totalPages={1}
          onPageChange={() => {}}
        />
      </div>
    </div>
  );
}
