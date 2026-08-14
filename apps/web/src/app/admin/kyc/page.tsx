"use client";

import { useEffect, useState } from "react";
import { MockAdminProvider } from "@/lib/admin/providers/mock-admin-provider";
import { KycApplication } from "@/lib/admin/types";
import { AdminDataTable, Column } from "@/components/admin/AdminDataTable";
import { apiClient } from "@ethsltd/api-client";
import { Filter } from "lucide-react";

export default function AdminKycPage() {
  const [kycApps, setKycApps] = useState<KycApplication[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("PENDING");
  const limit = 20;

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    apiClient.getAdminPendingKYC().then((res: any) => {
      if (isMounted) {
        setKycApps(res.data || []);
        setTotal(res.data?.length || 0);
        setLoading(false);
      }
    }).catch(console.error);

    return () => {
      isMounted = false;
    };
  }, []);

  const columns: Column<any>[] = [
    {
      header: "Application ID",
      accessor: "id",
      className: "font-mono text-xs text-brand-primary font-medium"
    },
    {
      header: "User",
      accessor: (row) => (
        <div className="flex flex-col">
          <span className="font-medium">{row.firstName} {row.lastName}</span>
          <span className="text-xs text-muted-foreground font-mono">{row.userId}</span>
        </div>
      )
    },
    {
      header: "Document",
      accessor: (row) => row.documentType.replace('_', ' ')
    },
    {
      header: "Country",
      accessor: "country"
    },
    {
      header: "Status",
      accessor: (row) => {
        const colors: Record<string, string> = {
          APPROVED: "bg-green-500/10 text-green-500 border-green-500/20",
          PENDING: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
          REJECTED: "bg-red-500/10 text-red-500 border-red-500/20",
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
      header: "Submitted",
      accessor: (row) => new Date(row.createdAt).toLocaleDateString()
    },
    {
      header: "Actions",
      accessor: (row) => (
        <div className="flex gap-2">
          <button 
            className="text-xs font-medium text-green-600 hover:underline"
            onClick={async () => {
              if (confirm('Approve KYC?')) {
                await apiClient.updateAdminKYCStatus(row.id, 'APPROVED');
                window.location.reload();
              }
            }}
          >
            Approve
          </button>
          <button 
            className="text-xs font-medium text-red-600 hover:underline"
            onClick={async () => {
              const reason = prompt('Rejection reason:');
              if (reason !== null) {
                await apiClient.updateAdminKYCStatus(row.id, 'REJECTED', reason);
                window.location.reload();
              }
            }}
          >
            Reject
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">KYC Queue</h2>
          <p className="text-muted-foreground mt-1 text-sm">Review identity verification applications.</p>
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
              <option value="PENDING">Pending</option>
              <option value="UNDER_REVIEW">Under Review</option>
              <option value="VERIFIED">Verified</option>
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
          data={kycApps} 
          page={page}
          totalPages={Math.ceil(total / limit)}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}
