"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@ethsltd/api-client";
import { CheckCircle, XCircle, Clock, Plus, Search } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";

export default function AdminExpertsPage() {
  const [experts, setExperts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // Add Expert Form State
  const [addForm, setAddForm] = useState({
    email: '',
    bio: '',
    experienceYears: 0,
    categories: '',
    languages: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleAddExpert = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        ...addForm,
        categories: addForm.categories.split(',').map(c => c.trim()).filter(Boolean),
        languages: addForm.languages.split(',').map(l => l.trim()).filter(Boolean)
      };
      const res = await apiClient.adminCreateExpert(payload);
      if (res.success) {
        alert("Expert created successfully!");
        setIsAddModalOpen(false);
        setAddForm({ email: '', bio: '', experienceYears: 0, categories: '', languages: '' });
        fetchExperts();
      } else {
        alert(res.error || "Failed to create expert");
      }
    } catch(err) {
      alert("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Expert Management</h2>
          <p className="text-muted-foreground mt-1 text-sm">Review, approve, and add expert profiles.</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-brand-primary text-primary-foreground hover:bg-brand-primary/90 px-4 py-2 rounded-md font-medium text-sm flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Expert
        </button>
      </div>

      <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center">
            <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : experts.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground flex flex-col items-center">
            <Search className="w-12 h-12 mb-4 opacity-20" />
            <p>No expert profiles found.</p>
            <p className="text-sm mt-1">Users need to apply first, or you can add one manually.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 text-muted-foreground border-b border-border">
                <tr>
                  <th className="px-4 py-3 font-medium">Expert Info</th>
                  <th className="px-4 py-3 font-medium hidden md:table-cell">Details</th>
                  <th className="px-4 py-3 font-medium">Joined</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
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
                    <td className="px-4 py-3 hidden md:table-cell max-w-[200px] truncate">
                      <div className="text-xs text-muted-foreground">
                        {/* We are fetching this from adminGetExperts, let's make sure backend sends bio and categories if needed */}
                        <span className="font-medium text-foreground block truncate">Bio: {expert.bio || 'No bio'}</span>
                        <span>Exp: {expert.experienceYears}y</span>
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
                    <td className="px-4 py-3 text-right">
                      <div className="flex gap-2 justify-end">
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

      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="bg-card border-border sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Expert</DialogTitle>
            <DialogDescription>
              Assign the EXPERT role to an existing user and create their verified profile instantly.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleAddExpert} className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">User Email <span className="text-red-500">*</span></label>
              <input 
                type="email" 
                required
                placeholder="user@example.com"
                value={addForm.email}
                onChange={(e) => setAddForm({...addForm, email: e.target.value})}
                className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-primary"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Bio</label>
              <textarea 
                placeholder="Brief description about the expert..."
                value={addForm.bio}
                onChange={(e) => setAddForm({...addForm, bio: e.target.value})}
                className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm min-h-[80px] focus:outline-none focus:ring-1 focus:ring-brand-primary"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Experience (Years)</label>
              <input 
                type="number" 
                min="0"
                value={addForm.experienceYears}
                onChange={(e) => setAddForm({...addForm, experienceYears: parseInt(e.target.value) || 0})}
                className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-primary"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Categories (comma-separated)</label>
              <input 
                type="text" 
                placeholder="Trading, Defi, Security"
                value={addForm.categories}
                onChange={(e) => setAddForm({...addForm, categories: e.target.value})}
                className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-primary"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Languages (comma-separated)</label>
              <input 
                type="text" 
                placeholder="English, Spanish, Hindi"
                value={addForm.languages}
                onChange={(e) => setAddForm({...addForm, languages: e.target.value})}
                className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-primary"
              />
            </div>

            <DialogFooter className="pt-4">
              <button 
                type="button" 
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-foreground hover:bg-muted rounded-md transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-medium text-primary-foreground bg-brand-primary hover:bg-brand-primary/90 rounded-md transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Creating...' : 'Create Expert'}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
