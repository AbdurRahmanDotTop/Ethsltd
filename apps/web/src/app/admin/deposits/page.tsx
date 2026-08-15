"use client";

import { useEffect, useState } from "react";
import { AdminDataTable, Column } from "@/components/admin/AdminDataTable";
import { Filter, ExternalLink, CheckCircle, XCircle } from "lucide-react";
import { apiClient } from "@ethsltd/api-client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function AdminDepositsPage() {
  const [manualDeposits, setManualDeposits] = useState<any[]>([]);
  const [bankDeposits, setBankDeposits] = useState<any[]>([]);
  const [cregisDeposits, setCregisDeposits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"MANUAL" | "BANK" | "AUTO">("MANUAL");

  const fetchPending = async () => {
    setLoading(true);
    try {
      const res = await apiClient.adminGetPendingDeposits();
      
      if (res.success) {
        const data = res as any;
        setManualDeposits(data.manualDeposits || []);
        setBankDeposits(data.bankDeposits || []);
        setCregisDeposits(data.cregisDeposits || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleApprove = async (id: string, type: "MANUAL" | "BANK") => {
    try {
      const res = type === "MANUAL" 
        ? await apiClient.adminApproveManualDeposit(id)
        : await apiClient.adminApproveBankDeposit(id);

      if (res.success) {
        toast.success(`${type} deposit approved successfully! Ledger & Wallet updated.`);
        fetchPending();
      } else {
        toast.error(res.error || "Failed to approve deposit");
      }
    } catch (e) {
      toast.error("An error occurred");
    }
  };

  const manualColumns: Column<any>[] = [
    { header: "ID", accessor: "id", className: "font-mono text-xs" },
    { header: "User", accessor: "user_id", className: "font-mono text-xs" },
    { header: "Amount", accessor: (row) => <span className="font-bold text-green-500">+{row.amount} {row.asset}</span> },
    { header: "Tx Hash", accessor: "transaction_hash", className: "font-mono text-xs max-w-[100px] truncate" },
    { header: "Proof", accessor: (row) => row.proof_file_url ? <a href={row.proof_file_url} target="_blank" className="text-brand-500 underline text-xs">View Proof</a> : "No Proof" },
    { header: "Status", accessor: (row) => <span className="px-2 py-1 rounded bg-yellow-500/10 text-yellow-500 text-xs">{row.status}</span> },
    { 
      header: "Action", 
      accessor: (row) => (
        <Button size="sm" onClick={() => handleApprove(row.id, "MANUAL")} className="h-8">Approve</Button>
      ) 
    }
  ];

  const bankColumns: Column<any>[] = [
    { header: "ID", accessor: "id", className: "font-mono text-xs" },
    { header: "User", accessor: "userId", className: "font-mono text-xs" },
    { header: "Amount", accessor: (row) => <span className="font-bold text-green-500">+{row.amount} {row.currency}</span> },
    { header: "Bank Ref", accessor: "bankReference", className: "font-mono text-xs" },
    { header: "Proof", accessor: (row) => row.proofDocumentUrl ? <a href={row.proofDocumentUrl} target="_blank" className="text-brand-500 underline text-xs">View Proof</a> : "No Proof" },
    { header: "Status", accessor: (row) => <span className="px-2 py-1 rounded bg-yellow-500/10 text-yellow-500 text-xs">{row.status}</span> },
    { 
      header: "Action", 
      accessor: (row) => (
        <Button size="sm" onClick={() => handleApprove(row.id, "BANK")} className="h-8">Approve</Button>
      ) 
    }
  ];

  const cregisColumns: Column<any>[] = [
    { header: "ID (CID)", accessor: "cid", className: "font-mono text-xs max-w-[150px] truncate" },
    { header: "User", accessor: "userId", className: "font-mono text-xs max-w-[150px] truncate" },
    { header: "Asset", accessor: (row) => <span className="font-bold text-green-500">{row.assetSymbol}</span> },
    { header: "Amount", accessor: "amount" },
    { header: "Tx Hash", accessor: "txid", className: "font-mono text-xs max-w-[150px] truncate" },
    { 
      header: "Status", 
      accessor: (row) => (
        <span className={`px-2 py-1 rounded text-xs ${
          row.status === 'CONFIRMED' ? 'bg-green-500/10 text-green-500' :
          row.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-500' :
          'bg-red-500/10 text-red-500'
        }`}>
          {row.status}
        </span>
      ) 
    }
  ];

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Deposit Approvals</h2>
          <p className="text-muted-foreground mt-1 text-sm">Review and approve manual and bank transfer deposits.</p>
        </div>
      </div>

      <div className="flex space-x-2 border-b border-border overflow-x-auto">
        <button 
          onClick={() => setActiveTab("MANUAL")} 
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === "MANUAL" ? "border-brand-500 text-brand-500" : "border-transparent text-muted-foreground"}`}
        >
          Manual Crypto Deposits ({manualDeposits.length})
        </button>
        <button 
          onClick={() => setActiveTab("BANK")} 
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === "BANK" ? "border-brand-500 text-brand-500" : "border-transparent text-muted-foreground"}`}
        >
          Bank Transfers ({bankDeposits.length})
        </button>
        <button 
          onClick={() => setActiveTab("AUTO")} 
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === "AUTO" ? "border-brand-500 text-brand-500" : "border-transparent text-muted-foreground"}`}
        >
          Auto Deposits (Cregis) ({cregisDeposits.length})
        </button>
      </div>

      <div className="relative min-h-[400px]">
        {loading && (
          <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10 rounded-lg">
            <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        
        {activeTab === "MANUAL" && (
          <AdminDataTable 
            columns={manualColumns} 
            data={manualDeposits} 
            page={1}
            totalPages={1}
            onPageChange={() => {}}
          />
        )}
        {activeTab === "BANK" && (
          <AdminDataTable 
            columns={bankColumns} 
            data={bankDeposits} 
            page={1}
            totalPages={1}
            onPageChange={() => {}}
          />
        )}
        {activeTab === "AUTO" && (
          <AdminDataTable 
            columns={cregisColumns} 
            data={cregisDeposits} 
            page={1}
            totalPages={1}
            onPageChange={() => {}}
          />
        )}
      </div>
    </div>
  );
}
