"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@ethsltd/api-client";
import { Plus, Edit2, Archive, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

export default function ExpertServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [form, setForm] = useState({
    id: '',
    title: '',
    description: '',
    category: '',
    durationMinutes: 60,
    price: '',
    currency: 'INR',
    pricingType: 'FIXED',
    status: 'ACTIVE'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchServices = async () => {
    try {
      const res = await apiClient.expertGetServices();
      if (res.success) {
        setServices(res.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const openAddModal = () => {
    setForm({ id: '', title: '', description: '', category: '', durationMinutes: 60, price: '', currency: 'INR', pricingType: 'FIXED', status: 'ACTIVE' });
    setIsModalOpen(true);
  };

  const openEditModal = (s: any) => {
    setForm({
      id: s.id,
      title: s.title,
      description: s.description,
      category: s.category,
      durationMinutes: s.durationMinutes,
      price: s.price,
      currency: s.currency,
      pricingType: s.pricingType || 'FIXED',
      status: s.status
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let res;
      if (form.id) {
        res = await apiClient.expertUpdateService(form.id, form);
      } else {
        res = await apiClient.expertCreateService(form);
      }
      
      if (res.success) {
        alert("Service saved successfully!");
        setIsModalOpen(false);
        fetchServices();
      } else {
        alert(res.error || "Failed to save service");
      }
    } catch(err) {
      alert("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleStatus = async (s: any) => {
    const newStatus = s.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
    try {
      const res = await apiClient.expertUpdateService(s.id, { status: newStatus });
      if (res.success) {
        fetchServices();
      } else {
        alert(res.error || "Failed to update status");
      }
    } catch(err) {
      alert("Error updating status");
    }
  };

  const deleteService = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    try {
      const res = await apiClient.expertDeleteService(id);
      if (res.success) {
        fetchServices();
      } else {
        alert(res.error || "Failed to delete service");
      }
    } catch (err) {
      alert("Error deleting service");
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-y-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">My Services</h1>
          <p className="text-muted-foreground mt-1">Manage the services you offer to clients.</p>
        </div>
        <button onClick={openAddModal} className="bg-brand-primary text-primary-foreground px-4 py-2 rounded-md font-medium text-sm flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Service
        </button>
      </div>

      <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-brand-primary" /></div>
        ) : services.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">No services found. Add one to get started.</div>
        ) : (
          <div className="w-full overflow-x-auto">
<table className="w-full text-sm text-left">
            <thead className="bg-muted/50 border-b border-border text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Service</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Duration</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {services.map(s => (
                <tr key={s.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <div className="font-medium text-foreground">{s.title}</div>
                    <div className="text-xs text-muted-foreground">{s.category}</div>
                  </td>
                  <td className="px-4 py-3 font-medium">{s.price} {s.currency}</td>
                  <td className="px-4 py-3 text-xs">{s.pricingType || 'FIXED'}</td>
                  <td className="px-4 py-3">{s.durationMinutes} mins</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${
                      s.status === 'ACTIVE' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                      s.status === 'PENDING_APPROVAL' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' :
                      'bg-muted text-muted-foreground border-border'
                    }`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => toggleStatus(s)} className="text-xs font-medium text-muted-foreground hover:text-foreground">
                        {s.status === 'ACTIVE' ? 'Pause' : 'Activate'}
                      </button>
                      <button onClick={() => openEditModal(s)} className="text-brand-primary hover:text-brand-primary/80" title="Edit Service">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => deleteService(s.id)} className="text-red-500 hover:text-red-600" title="Delete Service">
                        <Archive className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
</div>
        )}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{form.id ? 'Edit Service' : 'Add Service'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <input required type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full border rounded-md px-3 py-2 text-sm bg-background" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <textarea required value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full border rounded-md px-3 py-2 text-sm bg-background min-h-[80px]" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <input required type="text" value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full border rounded-md px-3 py-2 text-sm bg-background" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Duration (mins)</label>
                <input required type="number" value={form.durationMinutes} onChange={e => setForm({...form, durationMinutes: parseInt(e.target.value)})} className="w-full border rounded-md px-3 py-2 text-sm bg-background" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Price</label>
                <input required type="number" step="0.01" value={form.price} onChange={e => setForm({...form, price: e.target.value})} className="w-full border rounded-md px-3 py-2 text-sm bg-background" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Currency</label>
                <select value={form.currency} onChange={e => setForm({...form, currency: e.target.value})} className="w-full border rounded-md px-3 py-2 text-sm bg-background">
                  <option value="INR">INR</option>
                  <option value="USD">USD</option>
                  <option value="USDT">USDT</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Pricing Type</label>
              <select value={form.pricingType} onChange={e => setForm({...form, pricingType: e.target.value})} className="w-full border rounded-md px-3 py-2 text-sm bg-background">
                <option value="FIXED">Fixed (One-time)</option>
                <option value="HOURLY">Hourly (Meeting)</option>
                <option value="MONTHLY">Monthly Subscription</option>
              </select>
            </div>
            <DialogFooter className="pt-4">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium hover:bg-muted rounded-md" disabled={isSubmitting}>Cancel</button>
              <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-sm font-medium bg-brand-primary text-primary-foreground hover:bg-brand-primary/90 rounded-md">
                {isSubmitting ? 'Saving...' : 'Save Service'}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
