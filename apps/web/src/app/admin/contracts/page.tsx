"use client";

import { useState } from "react";
import { 
  FileSignature, Search, Filter, CheckCircle, 
  XCircle, Clock, Eye, AlertCircle, FileText, Check, ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Types
type ContractStatus = 'draft' | 'pending_signature' | 'pending_approval' | 'approved' | 'rejected';

interface Contract {
  id: string;
  userId: string;
  userEmail: string;
  type: string;
  status: ContractStatus;
  issuedAt: string;
  signedAt?: string;
  signatureIp?: string;
}

// Mock Data
const MOCK_CONTRACTS: Contract[] = [
  { id: "CNT-8902", userId: "USR-102", userEmail: "institutions@whale.io", type: "OTC Master Agreement", status: "pending_approval", issuedAt: "2026-08-12T10:00:00Z", signedAt: "2026-08-14T09:15:22Z", signatureIp: "198.51.100.42" },
  { id: "CNT-8903", userId: "USR-441", userEmail: "margin_trader@example.com", type: "Margin Trading Facility", status: "pending_signature", issuedAt: "2026-08-13T14:30:00Z" },
  { id: "CNT-8901", userId: "USR-089", userEmail: "alpha_fund@hedge.net", type: "OTC Master Agreement", status: "approved", issuedAt: "2026-08-01T09:00:00Z", signedAt: "2026-08-05T11:20:00Z", signatureIp: "203.0.113.88" },
  { id: "CNT-8904", userId: "USR-992", userEmail: "retail_pro@mail.com", type: "High Withdrawal Limit Addendum", status: "rejected", issuedAt: "2026-08-10T11:00:00Z", signedAt: "2026-08-11T16:45:00Z", signatureIp: "192.0.2.14" },
  { id: "CNT-8905", userId: "USR-115", userEmail: "market_maker@mm.org", type: "Liquidity Provider Agreement", status: "pending_approval", issuedAt: "2026-08-13T08:00:00Z", signedAt: "2026-08-14T11:05:10Z", signatureIp: "45.22.19.88" },
];

export default function AdminContractsPage() {
  const [contracts, setContracts] = useState<Contract[]>(MOCK_CONTRACTS);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  
  // Modal State
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Filter Logic
  const filteredContracts = contracts.filter(c => {
    const matchesSearch = 
      c.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
      c.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.userEmail.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || c.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const handleAction = (contractId: string, newStatus: ContractStatus) => {
    setIsProcessing(true);
    setTimeout(() => {
      setContracts(prev => prev.map(c => 
        c.id === contractId ? { ...c, status: newStatus } : c
      ));
      setIsProcessing(false);
      setSelectedContract(null);
    }, 1000);
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'approved': return <span className="flex items-center gap-1 text-xs font-medium text-green-500 bg-green-500/10 px-2 py-1 rounded-full border border-green-500/20"><CheckCircle className="w-3 h-3"/> Approved</span>;
      case 'pending_approval': return <span className="flex items-center gap-1 text-xs font-medium text-blue-500 bg-blue-500/10 px-2 py-1 rounded-full border border-blue-500/20"><ShieldCheck className="w-3 h-3"/> Pending Admin Review</span>;
      case 'pending_signature': return <span className="flex items-center gap-1 text-xs font-medium text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded-full border border-yellow-500/20"><Clock className="w-3 h-3"/> Awaiting User Signature</span>;
      case 'rejected': return <span className="flex items-center gap-1 text-xs font-medium text-red-500 bg-red-500/10 px-2 py-1 rounded-full border border-red-500/20"><XCircle className="w-3 h-3"/> Rejected</span>;
      default: return <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-full border border-border"><FileText className="w-3 h-3"/> Draft</span>;
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Contract Management</h1>
          <p className="text-muted-foreground mt-1 text-sm">Issue, review, and approve legal agreements and OTC contracts.</p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-card border border-border rounded-xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search by Contract ID, User ID or Email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-background border border-border rounded-md pl-10 pr-4 py-2 text-sm focus:ring-1 focus:ring-brand-primary outline-none transition-shadow"
          />
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Filter className="w-4 h-4" />
            <span>Status:</span>
          </div>
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-background border border-border rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-brand-primary outline-none"
          >
            <option value="all">All Contracts</option>
            <option value="pending_approval">Pending Admin Review</option>
            <option value="pending_signature">Awaiting Signature</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Contracts Table */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium">Contract Info</th>
                <th className="px-6 py-4 font-medium">User Details</th>
                <th className="px-6 py-4 font-medium">Issue Date</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredContracts.length > 0 ? (
                filteredContracts.map((contract) => (
                  <tr key={contract.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-foreground">{contract.type}</p>
                      <p className="text-xs text-muted-foreground font-mono mt-0.5">{contract.id}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-foreground">{contract.userId}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{contract.userEmail}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-muted-foreground text-xs">
                      {new Date(contract.issuedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(contract.status)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button 
                        variant="secondary" 
                        size="sm"
                        onClick={() => setSelectedContract(contract)}
                        className={contract.status === 'pending_approval' ? "bg-brand-primary text-primary-foreground hover:bg-brand-primary/90" : ""}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        {contract.status === 'pending_approval' ? 'Review Now' : 'View Details'}
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <FileSignature className="w-8 h-8 text-muted-foreground/50" />
                      <p>No contracts found matching your filters.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review / View Modal */}
      {selectedContract && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col animate-in zoom-in-95">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-border flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold">Contract Review</h2>
                <p className="text-xs text-muted-foreground font-mono mt-1">{selectedContract.id} • {selectedContract.type}</p>
              </div>
              <button 
                onClick={() => !isProcessing && setSelectedContract(null)}
                className="p-2 hover:bg-muted rounded-full transition-colors"
                disabled={isProcessing}
              >
                <XCircle className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              
              <div className="grid grid-cols-2 gap-4 bg-muted/30 p-4 rounded-lg border border-border">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">User ID</p>
                  <p className="font-medium text-sm">{selectedContract.userId}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">User Email</p>
                  <p className="font-medium text-sm">{selectedContract.userEmail}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Date Issued</p>
                  <p className="font-medium text-sm">{new Date(selectedContract.issuedAt).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Current Status</p>
                  <div>{getStatusBadge(selectedContract.status)}</div>
                </div>
              </div>

              <div className="border border-border rounded-lg overflow-hidden">
                <div className="bg-muted px-4 py-2 border-b border-border">
                  <h3 className="text-sm font-semibold flex items-center gap-2">
                    <FileText className="w-4 h-4" /> Legal Document Content
                  </h3>
                </div>
                <div className="p-6 bg-background h-64 overflow-y-auto custom-scrollbar">
                  <h4 className="font-bold text-center mb-4">{selectedContract.type.toUpperCase()}</h4>
                  <div className="space-y-4 text-sm text-muted-foreground text-justify leading-relaxed">
                    <p>This Agreement is entered into by and between ETHSLTD (the "Platform") and the User ({selectedContract.userId}), effective as of the Date Issued.</p>
                    <p>1. <strong>Trading Obligations:</strong> The User agrees to abide by all platform rules and margin requirements as stipulated in the General Terms of Service. Over-The-Counter (OTC) trades executed under this agreement are final and binding.</p>
                    <p>2. <strong>Risk Disclosure:</strong> The User acknowledges the high risks associated with cryptocurrency trading, margin utilization, and liquidity provisions. The Platform is not liable for market volatility losses.</p>
                    <p>3. <strong>Compliance & AML:</strong> The User warrants that all funds utilized on the Platform are obtained legally. The Platform reserves the right to suspend accounts pending investigation of suspicious activities.</p>
                    <p>4. <strong>Termination:</strong> Either party may terminate this agreement with a 30-day written notice, provided all outstanding margin debts are settled in full.</p>
                    <p><em>[End of Document. This is a placeholder for the full legal text.]</em></p>
                  </div>
                </div>
              </div>

              {selectedContract.signedAt && (
                <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4 flex gap-4">
                  <ShieldCheck className="w-6 h-6 text-green-500 shrink-0" />
                  <div>
                    <h3 className="text-sm font-bold text-green-500">Digital Signature Verified</h3>
                    <div className="mt-2 grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                      <p><span className="text-muted-foreground text-xs block">Signed By:</span> {selectedContract.userEmail}</p>
                      <p><span className="text-muted-foreground text-xs block">Timestamp:</span> {new Date(selectedContract.signedAt).toLocaleString()}</p>
                      <p><span className="text-muted-foreground text-xs block">IP Address:</span> <span className="font-mono">{selectedContract.signatureIp}</span></p>
                      <p><span className="text-muted-foreground text-xs block">Crypto Hash:</span> <span className="font-mono text-xs text-muted-foreground truncate w-32 inline-block">0x7f8...3b9a</span></p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-border bg-muted/20 flex justify-end gap-3">
              <Button 
                variant="outline" 
                onClick={() => setSelectedContract(null)}
                disabled={isProcessing}
              >
                Close
              </Button>
              
              {selectedContract.status === 'pending_approval' && (
                <>
                  <Button 
                    variant="destructive"
                    onClick={() => handleAction(selectedContract.id, 'rejected')}
                    disabled={isProcessing}
                  >
                    Reject Signature
                  </Button>
                  <Button 
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => handleAction(selectedContract.id, 'approved')}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <span className="flex items-center"><Clock className="w-4 h-4 mr-2 animate-spin" /> Processing...</span>
                    ) : (
                      <span className="flex items-center"><Check className="w-4 h-4 mr-2" /> Approve Contract</span>
                    )}
                  </Button>
                </>
              )}
            </div>
            
          </div>
        </div>
      )}

    </div>
  );
}
