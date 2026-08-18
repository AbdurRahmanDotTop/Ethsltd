"use client";

import { useEffect, useState } from "react";
import { AdminP2PDispute } from "@/lib/admin/types";
import { AdminDataTable, Column } from "@/components/admin/AdminDataTable";
import { Filter, Scale, CheckCircle2, UserX, RefreshCw } from "lucide-react";
import { apiClient } from "@ethsltd/api-client";
import { toast } from "sonner";

export default function AdminP2PDisputesPage() {
  const [disputes, setDisputes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("ALL");
  const limit = 20;

  const fetchDisputes = async () => {
    setLoading(true);
    try {
      const res = await apiClient.adminGetP2PDisputes();
      if (res.success) {
        setDisputes(res.data);
      } else {
        toast.error(res.error || "Failed to fetch disputes");
      }
    } catch (err) {
      toast.error("Network error fetching disputes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDisputes();
  }, []);

  const handleResolve = async (disputeId: string, resolution: 'RELEASE_TO_BUYER' | 'REFUND_TO_SELLER') => {
    const confirmMsg = resolution === 'RELEASE_TO_BUYER' 
      ? 'Are you sure you want to resolve in favor of the BUYER? Crypto will be released to the buyer.' 
      : 'Are you sure you want to resolve in favor of the SELLER? Crypto will be returned to the seller.';
      
    if (!window.confirm(confirmMsg)) return;

    try {
      const res = await apiClient.request(`/api/v1/admin/p2p/disputes/${disputeId}/resolve`, {
        method: 'POST',
        body: JSON.stringify({ resolution, notes: 'Resolved by Admin' })
      });
      
      if (res.success) {
        toast.success("Dispute resolved successfully");
        fetchDisputes();
      } else {
        toast.error(res.error || "Failed to resolve dispute");
      }
    } catch (e) {
      toast.error("An error occurred");
    }
  };

  const filteredDisputes = disputes.filter(d => {
    if (status === "ALL") return true;
    return d.status === status;
  });

  const columns: Column<any>[] = [
    {
      header: "Dispute ID",
      accessor: (row) => (
        <div className="flex flex-col">
          <span className="font-mono text-xs text-brand-primary font-medium">{row.displayId || row.id}</span>
        </div>
      )
    },
    {
      header: "Order / Asset",
      accessor: (row) => (
        <div className="flex flex-col">
          <span className="font-mono text-[10px] text-muted-foreground">{row.orderDisplayId}</span>
          <span className="font-bold text-sm">{row.fiatAmount} {row.fiatCurrency} / {row.cryptoAmount} {row.asset}</span>
        </div>
      )
    },
    {
      header: "Participants",
      accessor: (row) => (
        <div className="flex flex-col gap-1 text-xs font-mono">
          <div className="flex justify-between w-48">
            <span className="text-muted-foreground">B:</span>
            <span className={`truncate max-w-[140px] ${row.openerId === row.buyerId ? "text-red-500 font-bold" : ""}`} title={row.buyerEmail}>{row.buyerEmail?.split('@')[0]}</span>
          </div>
          <div className="flex justify-between w-48">
            <span className="text-muted-foreground">S:</span>
            <span className={`truncate max-w-[140px] ${row.openerId === row.sellerId ? "text-red-500 font-bold" : ""}`} title={row.sellerEmail}>{row.sellerEmail?.split('@')[0]}</span>
          </div>
        </div>
      )
    },
    {
      header: "Reason",
      accessor: (row) => (
        <span className="text-xs font-medium text-foreground max-w-[150px] truncate block" title={row.reason}>
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
            <button 
              onClick={() => handleResolve(row.id, 'RELEASE_TO_BUYER')}
              className="flex items-center gap-1 px-2 py-1 bg-green-500/10 text-green-500 hover:bg-green-500/20 rounded text-xs transition-colors" title="Resolve in favor of Buyer">
              <CheckCircle2 className="w-3 h-3" /> Buyer
            </button>
            <button 
              onClick={() => handleResolve(row.id, 'REFUND_TO_SELLER')}
              className="flex items-center gap-1 px-2 py-1 bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 rounded text-xs transition-colors" title="Resolve in favor of Seller">
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
          <Button onClick={fetchDisputes} disabled={loading} variant="outline" size="sm">
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
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
          data={filteredDisputes} 
          page={page}
          totalPages={Math.ceil(filteredDisputes.length / limit) || 1}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}
