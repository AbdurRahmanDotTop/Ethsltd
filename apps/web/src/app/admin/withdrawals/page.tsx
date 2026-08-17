"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@ethsltd/api-client";
import { AdminDataTable, Column } from "@/components/admin/AdminDataTable";
import { Filter, Check, X, Trash2, Edit3 } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";

export default function AdminWithdrawalsPage() {
  const { user } = useAuthStore();
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("ALL");
  const [mode, setMode] = useState<"REAL" | "DEMO">("REAL");
  const limit = 50;

  const fetchWithdrawals = async () => {
    setLoading(true);
    try {
      const res = await apiClient.adminGetWithdrawals(status, mode);
      if (res.success) {
        setWithdrawals(res.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdrawals();
  }, [status, mode]);

  const handleApprove = async (id: string) => {
    if (!confirm("Are you sure you want to approve this withdrawal?")) return;
    try {
      const res = await apiClient.adminApproveWithdrawal(id);
      if (res.success) fetchWithdrawals();
      else alert(res.error);
    } catch (e) {}
  };

  const handleReject = async (id: string) => {
    const notes = prompt("Enter rejection reason (optional):");
    if (notes === null) return;
    try {
      const res = await apiClient.adminRejectWithdrawal(id, notes);
      if (res.success) fetchWithdrawals();
      else alert(res.error);
    } catch (e) {}
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to completely delete this withdrawal record? This cannot be undone.")) return;
    try {
      const res = await apiClient.adminDeleteWithdrawal(id);
      if (res.success) fetchWithdrawals();
      else alert(res.error);
    } catch (e) {}
  };

  const handleEditNotes = async (id: string, currentNotes: string) => {
    const notes = prompt("Update admin notes:", currentNotes || "");
    if (notes === null) return;
    try {
      const res = await apiClient.adminUpdateWithdrawalNotes(id, notes);
      if (res.success) fetchWithdrawals();
      else alert(res.error);
    } catch (e) {}
  };

  const columns: Column<any>[] = [
    {
      header: "Tx ID",
      accessor: "id",
      className: "font-mono text-xs text-muted-foreground"
    },
    {
      header: "User",
      accessor: (row) => (
        <div className="flex flex-col">
          <span className="font-medium">{row.userName || "Unknown"}</span>
          <span className="text-xs text-muted-foreground font-mono">{row.userId}</span>
        </div>
      )
    },
    {
      header: "Amount",
      accessor: (row) => (
        <span className="font-bold text-red-500">
          -{parseFloat(row.amount).toLocaleString(undefined, { maximumFractionDigits: 6 })} {row.asset}
        </span>
      )
    },
    {
      header: "Destination",
      accessor: (row) => (
        <div className="flex flex-col">
          <span className="text-xs font-medium text-muted-foreground">{row.network || 'Internal'}</span>
          <span className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded truncate max-w-[150px]" title={row.address}>
            {row.address}
          </span>
        </div>
      )
    },
    {
      header: "Notes",
      accessor: (row) => (
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground truncate max-w-[150px]" title={row.reference}>
            {row.reference || "-"}
          </span>
          <button onClick={() => handleEditNotes(row.id, row.reference)} className="text-muted-foreground hover:text-foreground">
            <Edit3 className="w-3 h-3" />
          </button>
        </div>
      )
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
        return (
          <div className="flex gap-2">
            {row.status === "PENDING" && (
              <>
                <button onClick={() => handleApprove(row.id)} className="p-1 rounded bg-green-500/10 text-green-500 hover:bg-green-500/20 transition-colors" title="Approve">
                  <Check className="w-4 h-4" />
                </button>
                <button onClick={() => handleReject(row.id)} className="p-1 rounded bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors" title="Reject">
                  <X className="w-4 h-4" />
                </button>
              </>
            )}
            {user?.role === 'SUPER_ADMIN' && (
              <button onClick={() => handleDelete(row.id)} className="p-1 rounded bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors" title="Delete completely">
                <Trash2 className="w-4 h-4" />
              </button>
            )}
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
              onChange={(e) => setStatus(e.target.value)}
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

      <div className="flex space-x-2 border-b border-border overflow-x-auto">
        <button 
          onClick={() => setMode("REAL")} 
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${mode === "REAL" ? "border-brand-500 text-brand-500" : "border-transparent text-muted-foreground"}`}
        >
          REAL Withdrawals
        </button>
        <button 
          onClick={() => setMode("DEMO")} 
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${mode === "DEMO" ? "border-brand-500 text-brand-500" : "border-transparent text-muted-foreground"}`}
        >
          DEMO Withdrawals
        </button>
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
          totalPages={1}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}
