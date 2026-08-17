"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@ethsltd/api-client";
import { Loader2, Check, X, CheckCircle2 } from "lucide-react";

export default function ExpertBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchBookings = async () => {
    try {
      const res = await apiClient.expertGetBookings();
      if (res.success) {
        setBookings(res.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleAction = async (bookingId: string, action: 'ACCEPT' | 'REJECT' | 'COMPLETE') => {
    if (action === 'COMPLETE') {
      if (!confirm("Are you sure this service is fully completed? This will process payment.")) return;
    }
    
    setProcessingId(bookingId);
    try {
      const res = await apiClient.expertActionBooking(bookingId, action);
      if (res.success) {
        alert(`Booking ${action.toLowerCase()}ed successfully`);
        fetchBookings();
      } else {
        alert(res.error || "Failed to process action");
      }
    } catch (err) {
      alert("Error processing action");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">Bookings</h1>
        <p className="text-muted-foreground mt-1">Manage your service requests and active sessions.</p>
      </div>

      <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-brand-primary" /></div>
        ) : bookings.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">No bookings found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 border-b border-border text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Client</th>
                  <th className="px-4 py-3">Service</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {bookings.map(b => (
                  <tr key={b.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3 font-medium text-foreground">{b.userDisplayName || b.userId}</td>
                    <td className="px-4 py-3">
                      <div>{b.serviceTitle}</div>
                      <div className="text-xs text-muted-foreground">{new Date(b.scheduledAt).toLocaleString()}</div>
                    </td>
                    <td className="px-4 py-3 font-medium">{b.price} {b.currency}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${
                        b.status === 'COMPLETED' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                        b.status === 'ACCEPTED' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                        b.status === 'PENDING_EXPERT' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' :
                        'bg-muted text-muted-foreground border-border'
                      }`}>
                        {b.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex gap-2 justify-end">
                        {b.status === 'PENDING_EXPERT' && (
                          <>
                            <button disabled={processingId === b.id} onClick={() => handleAction(b.id, 'ACCEPT')} className="p-1.5 bg-green-500/10 text-green-500 hover:bg-green-500/20 rounded disabled:opacity-50" title="Accept">
                              <Check className="w-4 h-4" />
                            </button>
                            <button disabled={processingId === b.id} onClick={() => handleAction(b.id, 'REJECT')} className="p-1.5 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded disabled:opacity-50" title="Reject">
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        {b.status === 'ACCEPTED' && (
                          <button disabled={processingId === b.id} onClick={() => handleAction(b.id, 'COMPLETE')} className="px-3 py-1.5 text-xs font-medium bg-brand-primary text-primary-foreground rounded hover:bg-brand-primary/90 disabled:opacity-50 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Complete
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
