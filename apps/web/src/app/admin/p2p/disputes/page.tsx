"use client";

import { useEffect, useState } from "react";
import { MockAdminProvider } from "@/lib/admin/providers/mock-admin-provider";
import { AdminP2PDispute } from "@/lib/admin/types";
import { AdminDataTable, Column } from "@/components/admin/AdminDataTable";
import { Filter, Scale, CheckCircle2, UserX } from "lucide-react";

export default function AdminP2PDisputesPage() {
  const [disputes, setDisputes] = useState<AdminP2PDispute[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("OPEN");
  const limit = 20;

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    MockAdminProvider.getP2PDisputes({ page, limit, status }).then((res) => {
      if (isMounted) {
        setDisputes(res.items);
        setTotal(res.total);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [page, status]);

  const columns: Column<AdminP2PDispute>[] = [
    {
      header: "Dispute ID",
      accessor: "id",
      className: "font-mono text-xs text-brand-primary font-medium"
    },
    {
      header: "Order / Asset",
      accessor: (row) => (
        <div className="flex flex-col">
          <span className="font-mono text-xs text-muted-foreground">{row.orderId}</span>
          <span className="font-bold text-sm">{row.fiatAmount} {row.fiatCurrency} / {row.asset}</span>
        </div>
      )
    },
    {
      header: "Participants",
      accessor: (row) => (
        <div className="flex flex-col gap-1 text-xs font-mono">
          <div className="flex justify-between w-40">
            <span className="text-muted-foreground">Buyer:</span>
            <span className={row.raisedBy === "BUYER" ? "text-red-500 font-bold" : ""}>{row.buyerId}</span>
          </div>
          <div className="flex justify-between w-40">
            <span className="text-muted-foreground">Seller:</span>
            <span className={row.raisedBy === "SELLER" ? "text-red-500 font-bold" : ""}>{row.sellerId}</span>
          </div>
        </div>
      )
    },
    {
      header: "Reason",
      accessor: (row) => (
        <span className="text-xs font-medium text-foreground max-w-[200px] truncate block">
          {row.reason}
        </span>
      )
    },
    {
      header: "Status",
      accessor: (row) => {
        const colors: Record<string, string> = {
          OPEN: "bg-red-500/10 text-red-500 border-red-500/20",
          UNDER_REVIEW: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
          RESOLVED_BUYER: "bg-green-500/10 text-green-500 border-green-500/20",
          RESOLVED_SELLER: "bg-blue-500/10 text-blue-500 border-blue-500/20",
          CANCELED: "bg-muted text-muted-foreground border-border",
        };
        const color = colors[row.status] || "bg-muted text-foreground border-border";
        return (
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${color}`}>
            {row.status.replace('_', ' ')}
          </span>
        );
      }
    },
    {
      header: "Date Raised",
      accessor: (row) => <span className="text-xs text-muted-foreground">{new Date(row.createdAt).toLocaleString()}</span>
    },
    {
      header: "Actions",
      accessor: (row) => {
        if (row.status !== "OPEN" && row.status !== "UNDER_REVIEW") return <span className="text-muted-foreground text-xs">-</span>;
        return (
          <div className="flex gap-2">
            <button className="flex items-center gap-1 px-2 py-1 bg-green-500/10 text-green-500 hover:bg-green-500/20 rounded text-xs transition-colors" title="Resolve in favor of Buyer">
              <CheckCircle2 className="w-3 h-3" /> Buyer
            </button>
            <button className="flex items-center gap-1 px-2 py-1 bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 rounded text-xs transition-colors" title="Resolve in favor of Seller">
              <CheckCircle2 className="w-3 h-3" /> Seller
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
          <div className="flex items-center gap-2 mb-1">
            <Scale className="w-5 h-5 text-brand-primary" />
            <h2 className="text-2xl font-bold tracking-tight">P2P Dispute Resolution</h2>
          </div>
          <p className="text-muted-foreground text-sm">Review chat logs and payment proofs to resolve locked P2P trades.</p>
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
              <option value="OPEN">Open (Requires Action)</option>
              <option value="UNDER_REVIEW">Under Review</option>
              <option value="RESOLVED_BUYER">Resolved (Buyer Win)</option>
              <option value="RESOLVED_SELLER">Resolved (Seller Win)</option>
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
          data={disputes} 
          page={page}
          totalPages={Math.ceil(total / limit)}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}
