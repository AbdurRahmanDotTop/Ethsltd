"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@ethsltd/api-client";
import { CheckCircle, XCircle, Clock } from "lucide-react";

export default function AdminExpertsPage() {
  const [experts, setExperts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchExperts = async () => {
    try {
      const res = await apiClient.adminGetExperts();
      if (res.success) {
        setExperts(res.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperts();
  }, []);

  const handleUpdateStatus = async (expertId: string, status: string) => {
    try {
      const res = await apiClient.adminUpdateExpertStatus(expertId, status);
      if (res.success) {
        fetchExperts();
      } else {
        alert(res.error || "Failed to update status");
      }
    } catch (err) {
      alert("Error updating status");
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Expert Management</h2>
        <p className="text-muted-foreground mt-1 text-sm">Review and approve expert profiles.</p>
      </div>

      <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center">
            <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : experts.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            No expert profiles found. Users need to apply first.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 text-muted-foreground border-b border-border">
                <tr>
                  <th className="px-4 py-3 font-medium">Expert Info</th>
                  <th className="px-4 py-3 font-medium">Joined</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {experts.map((expert) => (
                  <tr key={expert.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <div className="flex flex-col">
                        <span className="font-medium text-foreground">{expert.displayName || 'N/A'}</span>
                        <span className="text-xs text-muted-foreground">{expert.email}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {new Date(expert.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${
                        expert.verificationStatus === 'VERIFIED' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                        expert.verificationStatus === 'PENDING' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' :
                        'bg-red-500/10 text-red-500 border-red-500/20'
                      }`}>
                        {expert.verificationStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        {expert.verificationStatus !== 'VERIFIED' && (
                          <button 
                            onClick={() => handleUpdateStatus(expert.id, 'VERIFIED')}
                            className="p-1.5 rounded bg-green-500/10 text-green-500 hover:bg-green-500/20"
                            title="Verify"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        {expert.verificationStatus !== 'REJECTED' && (
                          <button 
                            onClick={() => handleUpdateStatus(expert.id, 'REJECTED')}
                            className="p-1.5 rounded bg-red-500/10 text-red-500 hover:bg-red-500/20"
                            title="Reject"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                        {expert.verificationStatus !== 'PENDING' && (
                          <button 
                            onClick={() => handleUpdateStatus(expert.id, 'PENDING')}
                            className="p-1.5 rounded bg-orange-500/10 text-orange-500 hover:bg-orange-500/20"
                            title="Mark Pending"
                          >
                            <Clock className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
