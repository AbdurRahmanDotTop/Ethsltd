"use client";

import { useEffect, useState } from "react";
import { MockAdminProvider } from "@/lib/admin/providers/mock-admin-provider";
import { KycApplication } from "@/lib/admin/types";
import { AdminDataTable, Column } from "@/components/admin/AdminDataTable";
import { apiClient } from "@ethsltd/api-client";
import { Filter, Eye, X, CheckCircle, XCircle, FileText } from "lucide-react";

export default function AdminKycPage() {
  const [kycApps, setKycApps] = useState<KycApplication[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<KycApplication | null>(null);

  const renderDocumentPreview = (url: string | undefined | null, altText: string) => {
    if (!url) {
      return <span className="text-muted-foreground text-xs italic">No document provided</span>;
    }
    
    if (url.startsWith('data:application/pdf')) {
      return (
        <div className="flex flex-col items-center gap-2 w-full h-full justify-center">
          <FileText className="w-10 h-10 text-muted-foreground" />
          <span className="text-xs font-medium">PDF Document</span>
          <a 
            href={url} 
            download={`${altText.replace(' ', '_')}.pdf`}
            className="mt-2 px-3 py-1 bg-brand-primary text-brand-primary-foreground text-xs rounded-md hover:bg-brand-primary/90"
          >
            Download PDF
          </a>
        </div>
      );
    }

    return <img src={url} alt={altText} className="max-h-48 object-contain" />;
  };
  
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
            className="text-xs font-medium text-brand-primary hover:underline flex items-center gap-1"
            onClick={() => setSelectedApp(row)}
          >
            <Eye className="w-3 h-3" /> View Details
          </button>
        </div>
      )
    }
  ];

  const handleApprove = async (id: string) => {
    if (confirm('Approve this KYC application?')) {
      await apiClient.updateAdminKYCStatus(id, 'APPROVED');
      setSelectedApp(null);
      setLoading(true);
      const res = await apiClient.getAdminPendingKYC();
      setKycApps(res.data || []);
      setTotal(res.data?.length || 0);
      setLoading(false);
    }
  };

  const handleReject = async (id: string) => {
    const reason = prompt('Please enter the reason for rejection:');
    if (reason !== null) {
      await apiClient.updateAdminKYCStatus(id, 'REJECTED', reason);
      setSelectedApp(null);
      setLoading(true);
      const res = await apiClient.getAdminPendingKYC();
      setKycApps(res.data || []);
      setTotal(res.data?.length || 0);
      setLoading(false);
    }
  };

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

      {/* KYC Details Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-card z-10">
              <h3 className="text-xl font-bold">KYC Application Details</h3>
              <button 
                onClick={() => setSelectedApp(null)}
                className="p-2 hover:bg-muted rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-4">Personal Information</h4>
                  <div className="space-y-3">
                    <div>
                      <span className="text-xs text-muted-foreground block">Full Name</span>
                      <span className="font-medium">{selectedApp.firstName} {selectedApp.lastName}</span>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground block">Date of Birth</span>
                      <span className="font-medium">{selectedApp.dateOfBirth}</span>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground block">Country</span>
                      <span className="font-medium">{selectedApp.country}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-4">Document Details</h4>
                  <div className="space-y-3">
                    <div>
                      <span className="text-xs text-muted-foreground block">Document Type</span>
                      <span className="font-medium capitalize">{selectedApp.documentType.replace('_', ' ').toLowerCase()}</span>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground block">Document Number</span>
                      <span className="font-mono">{selectedApp.documentNumber}</span>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground block">User ID</span>
                      <span className="font-mono text-xs">{selectedApp.userId}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-4">Submitted Documents</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="border border-border rounded-lg overflow-hidden flex flex-col">
                    <div className="bg-muted/30 px-3 py-2 text-xs font-medium border-b border-border">Document Front</div>
                    <div className="p-2 flex-1 flex items-center justify-center bg-black/5 min-h-[12rem]">
                      {renderDocumentPreview(selectedApp.documentFrontUrl, "Document Front")}
                    </div>
                  </div>
                  <div className="border border-border rounded-lg overflow-hidden flex flex-col">
                    <div className="bg-muted/30 px-3 py-2 text-xs font-medium border-b border-border">Document Back</div>
                    <div className="p-2 flex-1 flex items-center justify-center bg-black/5 min-h-[12rem]">
                      {renderDocumentPreview(selectedApp.documentBackUrl, "Document Back")}
                    </div>
                  </div>
                  <div className="border border-border rounded-lg overflow-hidden flex flex-col">
                    <div className="bg-muted/30 px-3 py-2 text-xs font-medium border-b border-border">Selfie</div>
                    <div className="p-2 flex-1 flex items-center justify-center bg-black/5 min-h-[12rem]">
                      {renderDocumentPreview(selectedApp.selfieUrl, "Selfie")}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-border flex justify-end gap-3 sticky bottom-0 bg-card z-10">
              <button 
                onClick={() => setSelectedApp(null)}
                className="px-4 py-2 border border-border rounded-md text-sm font-medium hover:bg-muted"
              >
                Close
              </button>
              {selectedApp.status === 'PENDING' && (
                <>
                  <button 
                    onClick={() => handleReject(selectedApp.id)}
                    className="px-4 py-2 bg-destructive/10 text-destructive border border-destructive/20 rounded-md text-sm font-medium hover:bg-destructive hover:text-white flex items-center gap-2 transition-colors"
                  >
                    <XCircle className="w-4 h-4" /> Reject
                  </button>
                  <button 
                    onClick={() => handleApprove(selectedApp.id)}
                    className="px-4 py-2 bg-green-500/10 text-green-600 border border-green-500/20 rounded-md text-sm font-medium hover:bg-green-600 hover:text-white flex items-center gap-2 transition-colors"
                  >
                    <CheckCircle className="w-4 h-4" /> Approve
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
