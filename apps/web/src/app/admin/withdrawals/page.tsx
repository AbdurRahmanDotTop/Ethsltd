"use client";

import { useEffect, useState } from "react";
import { MockAdminProvider } from "@/lib/admin/providers/mock-admin-provider";
import { FinancialTransaction } from "@/lib/admin/types";
import { AdminDataTable, Column } from "@/components/admin/AdminDataTable";
import { Filter, Check, X, ShieldAlert } from "lucide-react";

export default function AdminWithdrawalsPage() {
  const [withdrawals, setWithdrawals] = useState<FinancialTransaction[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("PENDING");
  const limit = 20;

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    MockAdminProvider.getWithdrawals({ page, limit, status }).then((res) => {
      if (isMounted) {
        setWithdrawals(res.items);
        setTotal(res.total);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [page, status]);

  const columns: Column<FinancialTransaction>[] = [
    {
      header: "Tx ID",
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
      header: "Amount",
      accessor: (row) => (
        <span className="font-bold">
          {row.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })} {row.asset}
        </span>
      )
    },
    {
      header: "Destination",
      accessor: (row) => (
        <div className="flex flex-col">
          <span className="text-xs font-medium text-muted-foreground">{row.network}</span>
          <span className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded truncate max-w-[150px]">
            {row.address}
          </span>
        </div>
      )
    },
    {
      header: "Risk",
      accessor: (row) => {
        const isHigh = row.riskScore === "HIGH";
        return (
          <div className={`flex items-center gap-1 text-xs font-medium ${isHigh ? 'text-red-500' : 'text-green-500'}`}>
            {isHigh && <ShieldAlert className="w-3 h-3" />}
            {row.riskScore}
          </div>
        );
      }
    },
    {
      header: "Status",
      accessor: (row) => {
        const colors: Record<string, string> = {
          COMPLETED: "bg-green-500/10 text-green-500 border-green-500/20",
          PENDING: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
          PROCESSING: "bg-blue-500/10 text-blue-500 border-blue-500/20",
          REJECTED: "bg-red-500/10 text-red-500 border-red-500/20",
        };
        const color = colors[row.status] || "bg-muted text-foreground border-border";
        return (
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${color}`}>
            {row.status}
          </span>
        );
      }
    },
    {
      header: "Date",
      accessor: (row) => <span className="text-xs text-muted-foreground">{new Date(row.createdAt).toLocaleString()}</span>
    },
    {
      header: "Actions",
      accessor: (row) => {
        if (row.status !== "PENDING" && row.status !== "PROCESSING") return <span className="text-muted-foreground text-xs">None</span>;
        return (
          <div className="flex gap-2">
            <button className="p-1 rounded bg-green-500/10 text-green-500 hover:bg-green-500/20 transition-colors" title="Approve">
              <Check className="w-4 h-4" />
            </button>
            <button className="p-1 rounded bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors" title="Reject">
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      }
    }
  ];

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Withdrawal Approvals</h2>
          <p className="text-muted-foreground mt-1 text-sm">Review, approve, or reject user withdrawal requests.</p>
        </div>
        
        <div className="flex gap-3">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <select 
              value={status}
              onChange={(e) => { setStatus(e.target.value); setPage(1); }}
              className="pl-9 pr-8 py-2 bg-card border border-border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-brand-primary appearance-none cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending Approval</option>
              <option value="PROCESSING">Processing</option>
              <option value="COMPLETED">Completed</option>
              <option value="REJECTED">Rejected</option>
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
          data={withdrawals} 
          page={page}
          totalPages={Math.ceil(total / limit)}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}
