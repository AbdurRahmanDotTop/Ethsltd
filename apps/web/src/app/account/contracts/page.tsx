"use client";

import { useState } from "react";
import { FileSignature, CheckCircle, Clock, ShieldCheck, FileText, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

// Mock User Contracts
const MOCK_USER_CONTRACTS = [
  { id: "CNT-8902", type: "OTC Master Agreement", status: "pending_approval", issuedAt: "2026-08-12T10:00:00Z", signedAt: "2026-08-14T09:15:22Z" },
  { id: "CNT-8903", type: "Margin Trading Facility", status: "pending_signature", issuedAt: "2026-08-13T14:30:00Z" },
  { id: "CNT-7100", type: "API Trading Access Terms", status: "approved", issuedAt: "2026-05-01T10:00:00Z", signedAt: "2026-05-02T11:11:00Z" }
];

export default function UserContractsPage() {
  const [contracts, setContracts] = useState(MOCK_USER_CONTRACTS);
  const [selectedContract, setSelectedContract] = useState<any>(null);
  const [isSigning, setIsSigning] = useState(false);
  const [hasAgreed, setHasAgreed] = useState(false);

  const handleSign = (id: string) => {
    setIsSigning(true);
    setTimeout(() => {
      setContracts(prev => prev.map(c => 
        c.id === id ? { ...c, status: "pending_approval", signedAt: new Date().toISOString() } : c
      ));
      setIsSigning(false);
      setSelectedContract(null);
      setHasAgreed(false);
    }, 1500);
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'approved': return <span className="flex items-center gap-1 text-xs font-medium text-green-500 bg-green-500/10 px-2 py-1 rounded-full border border-green-500/20"><CheckCircle className="w-3 h-3"/> Active</span>;
      case 'pending_approval': return <span className="flex items-center gap-1 text-xs font-medium text-blue-500 bg-blue-500/10 px-2 py-1 rounded-full border border-blue-500/20"><ShieldCheck className="w-3 h-3"/> Under Admin Review</span>;
      case 'pending_signature': return <span className="flex items-center gap-1 text-xs font-medium text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded-full border border-yellow-500/20"><Clock className="w-3 h-3"/> Action Required</span>;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Agreements & Contracts</h1>
        <p className="text-muted-foreground mt-1 text-sm">Manage and sign your platform agreements for advanced trading features.</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {contracts.map((contract) => (
          <div key={contract.id} className="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all hover:border-brand-primary/30">
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                contract.status === 'pending_signature' ? 'bg-yellow-500/10' :
                contract.status === 'approved' ? 'bg-green-500/10' : 'bg-blue-500/10'
              }`}>
                <FileSignature className={`w-6 h-6 ${
                  contract.status === 'pending_signature' ? 'text-yellow-500' :
                  contract.status === 'approved' ? 'text-green-500' : 'text-blue-500'
                }`} />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{contract.type}</h3>
                <p className="text-sm text-muted-foreground mt-1">Contract ID: <span className="font-mono">{contract.id}</span></p>
                <div className="mt-2">
                  {getStatusBadge(contract.status)}
                </div>
              </div>
            </div>

            <div className="flex flex-col items-start md:items-end gap-2 text-sm text-muted-foreground">
              <p>Issued: {new Date(contract.issuedAt).toLocaleDateString()}</p>
              {contract.signedAt && <p>Signed: {new Date(contract.signedAt).toLocaleDateString()}</p>}
              
              <div className="mt-2 w-full md:w-auto">
                {contract.status === 'pending_signature' ? (
                  <Button 
                    className="w-full" 
                    onClick={() => setSelectedContract(contract)}
                  >
                    Review & Sign
                  </Button>
                ) : (
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setSelectedContract(contract)}
                  >
                    View Document
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Signing Modal */}
      {selectedContract && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col animate-in zoom-in-95">
            
            <div className="px-6 py-4 border-b border-border flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold">{selectedContract.type}</h2>
                <p className="text-xs text-muted-foreground font-mono mt-1">{selectedContract.id}</p>
              </div>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              
              <div className="bg-brand-primary/10 text-brand-primary p-4 rounded-lg flex gap-3 text-sm">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p>Please read the terms carefully. By signing this digital agreement, you accept the obligations and risks associated with this facility.</p>
              </div>

              <div className="border border-border rounded-lg overflow-hidden">
                <div className="bg-muted px-4 py-2 border-b border-border">
                  <h3 className="text-sm font-semibold flex items-center gap-2">
                    <FileText className="w-4 h-4" /> Legal Terms
                  </h3>
                </div>
                <div className="p-6 bg-background h-64 overflow-y-auto custom-scrollbar">
                  <div className="space-y-4 text-sm text-muted-foreground text-justify leading-relaxed">
                    <p>This Agreement is entered into by and between ETHSLTD (the "Platform") and the User, effective as of {new Date(selectedContract.issuedAt).toLocaleDateString()}.</p>
                    <p>1. <strong>Trading Obligations:</strong> The User agrees to abide by all platform rules and margin requirements as stipulated in the General Terms of Service. Trades executed under this agreement are final and binding.</p>
                    <p>2. <strong>Risk Disclosure:</strong> The User acknowledges the high risks associated with cryptocurrency trading. The Platform is not liable for market volatility losses.</p>
                    <p>3. <strong>Compliance & AML:</strong> The User warrants that all funds utilized on the Platform are obtained legally. The Platform reserves the right to suspend accounts pending investigation of suspicious activities.</p>
                    <p>4. <strong>Electronic Signature:</strong> The User agrees that clicking "Sign Agreement" constitutes a legally binding electronic signature, carrying the same weight as a physical signature.</p>
                  </div>
                </div>
              </div>

              {selectedContract.status === 'pending_signature' && (
                <label className="flex items-start gap-3 cursor-pointer p-4 bg-muted/50 rounded-lg border border-border hover:bg-muted transition-colors">
                  <input 
                    type="checkbox" 
                    className="mt-1 w-4 h-4 rounded border-border text-brand-primary focus:ring-brand-primary"
                    checked={hasAgreed}
                    onChange={(e) => setHasAgreed(e.target.checked)}
                  />
                  <div className="text-sm">
                    <p className="font-semibold">I acknowledge and agree to the terms above.</p>
                    <p className="text-muted-foreground text-xs mt-1">My IP address and a cryptographic timestamp will be recorded.</p>
                  </div>
                </label>
              )}

              {selectedContract.signedAt && (
                <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4 flex gap-4 text-sm">
                  <ShieldCheck className="w-6 h-6 text-green-500 shrink-0" />
                  <div>
                    <h3 className="font-bold text-green-500">Electronically Signed</h3>
                    <p className="text-muted-foreground mt-1">You signed this agreement on {new Date(selectedContract.signedAt).toLocaleString()}.</p>
                  </div>
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-border bg-muted/20 flex justify-end gap-3">
              <Button 
                variant="outline" 
                onClick={() => {
                  setSelectedContract(null);
                  setHasAgreed(false);
                }}
                disabled={isSigning}
              >
                Close
              </Button>
              
              {selectedContract.status === 'pending_signature' && (
                <Button 
                  onClick={() => handleSign(selectedContract.id)}
                  disabled={!hasAgreed || isSigning}
                >
                  {isSigning ? (
                    <span className="flex items-center"><Clock className="w-4 h-4 mr-2 animate-spin" /> Processing...</span>
                  ) : (
                    <span className="flex items-center"><FileSignature className="w-4 h-4 mr-2" /> Sign Agreement</span>
                  )}
                </Button>
              )}
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
}
