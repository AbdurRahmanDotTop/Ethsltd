"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@ethsltd/api-client";
import { CheckCircle, XCircle, Clock, Plus, Search, Settings } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";

export default function AdminExpertsPage() {
  const [experts, setExperts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // Platform Fee State
  const [commissionFee, setCommissionFee] = useState("10");
  const [isFeeModalOpen, setIsFeeModalOpen] = useState(false);
  const [isSavingFee, setIsSavingFee] = useState(false);

  // Add Expert Form State
  const [mode, setMode] = useState<'convert' | 'create'>('convert');
  const [addForm, setAddForm] = useState({
    email: '',
    firstName: '',
    lastName: '',
    displayName: '',
    password: '',
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

  const fetchPlatformSettings = async () => {
    try {
      const res = await apiClient.adminGetPlatformSettings();
      if (res.success && res.data) {
        const feeSetting = res.data.find((s: any) => s.key === 'EXPERT_COMMISSION_PERCENTAGE');
        if (feeSetting) setCommissionFee(feeSetting.value);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchExperts();
    fetchPlatformSettings();
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
        mode,
        categories: addForm.categories.split(',').map(c => c.trim()).filter(Boolean),
        languages: addForm.languages.split(',').map(l => l.trim()).filter(Boolean)
      };
      const res = await apiClient.adminCreateExpert(payload);
      if (res.success) {
        alert("Expert profile created successfully!");
        setIsAddModalOpen(false);
        setAddForm({ email: '', firstName: '', lastName: '', displayName: '', password: '', bio: '', experienceYears: 0, categories: '', languages: '' });
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

  const handleSaveFee = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingFee(true);
    try {
      const res = await apiClient.adminUpdatePlatformSetting('EXPERT_COMMISSION_PERCENTAGE', {
        value: commissionFee,
        description: "Global platform fee percentage for expert services"
      });
      if (res.success) {
        alert("Platform fee updated successfully!");
        setIsFeeModalOpen(false);
      } else {
        alert(res.error || "Failed to update fee");
      }
    } catch (err) {
      alert("Error saving fee");
    } finally {
      setIsSavingFee(false);
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Expert Management</h2>
          <p className="text-muted-foreground mt-1 text-sm">Review, approve, and add expert profiles.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsFeeModalOpen(true)}
            className="bg-muted text-foreground hover:bg-muted/80 px-4 py-2 rounded-md font-medium text-sm flex items-center gap-2 border border-border"
          >
            <Settings className="w-4 h-4" />
            Platform Fee ({commissionFee}%)
          </button>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-brand-primary text-primary-foreground hover:bg-brand-primary/90 px-4 py-2 rounded-md font-medium text-sm flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Expert
          </button>
        </div>
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

      <Dialog open={isFeeModalOpen} onOpenChange={setIsFeeModalOpen}>
        <DialogContent className="bg-card border-border sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Global Expert Commission</DialogTitle>
            <DialogDescription>
              Set the platform fee percentage deducted from all expert service bookings upon completion.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSaveFee} className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Commission Percentage (%)</label>
              <input 
                type="number" 
                min="0"
                max="100"
                step="0.01"
                required
                value={commissionFee}
                onChange={(e) => setCommissionFee(e.target.value)}
                className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-primary"
              />
            </div>
            <DialogFooter className="pt-4">
              <button 
                type="button" 
                onClick={() => setIsFeeModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-foreground hover:bg-muted rounded-md transition-colors"
                disabled={isSavingFee}
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={isSavingFee}
                className="px-4 py-2 text-sm font-medium text-primary-foreground bg-brand-primary hover:bg-brand-primary/90 rounded-md transition-colors disabled:opacity-50"
              >
                {isSavingFee ? 'Saving...' : 'Save Settings'}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="bg-card border-border sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Expert</DialogTitle>
            <DialogDescription>
              Create a new expert account or convert an existing user into an expert.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex gap-2 bg-muted/50 p-1 rounded-md mb-4">
            <button
              type="button"
              className={`flex-1 py-1.5 text-sm rounded-sm transition-colors ${mode === 'convert' ? 'bg-background shadow-sm font-medium' : 'text-muted-foreground hover:text-foreground'}`}
              onClick={() => setMode('convert')}
            >
              Convert Existing User
            </button>
            <button
              type="button"
              className={`flex-1 py-1.5 text-sm rounded-sm transition-colors ${mode === 'create' ? 'bg-background shadow-sm font-medium' : 'text-muted-foreground hover:text-foreground'}`}
              onClick={() => setMode('create')}
            >
              Create New User
            </button>
          </div>

          <form onSubmit={handleAddExpert} className="space-y-4">
            {mode === 'create' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">First Name</label>
                    <input 
                      type="text" 
                      value={addForm.firstName}
                      onChange={(e) => setAddForm({...addForm, firstName: e.target.value})}
                      className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Last Name</label>
                    <input 
                      type="text" 
                      value={addForm.lastName}
                      onChange={(e) => setAddForm({...addForm, lastName: e.target.value})}
                      className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-primary"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Display Name</label>
                  <input 
                    type="text" 
                    value={addForm.displayName}
                    onChange={(e) => setAddForm({...addForm, displayName: e.target.value})}
                    className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-primary"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Password <span className="text-red-500">*</span></label>
                  <input 
                    type="password" 
                    required={mode === 'create'}
                    placeholder="Temporary password"
                    value={addForm.password}
                    onChange={(e) => setAddForm({...addForm, password: e.target.value})}
                    className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-primary"
                  />
                </div>
              </>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">User Email <span className="text-red-500">*</span></label>
              <input 
                type="email" 
                required
                placeholder={mode === 'convert' ? "user@example.com" : "expert@example.com"}
                value={addForm.email}
                onChange={(e) => setAddForm({...addForm, email: e.target.value})}
                className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-primary"
              />
              {mode === 'convert' && (
                <p className="text-xs text-muted-foreground">The user must already exist in the system.</p>
              )}
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
                {isSubmitting ? 'Processing...' : 'Submit'}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

