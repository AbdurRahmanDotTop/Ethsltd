"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@ethsltd/api-client";
import { Loader2, Calendar, CheckCircle2, Clock, XCircle } from "lucide-react";
import Link from "next/link";

export default function UserBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await apiClient.getMyExpertBookings();
        if (res.success) {
          setBookings(res.data || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Bookings</h1>
        <p className="text-muted-foreground mt-1 text-sm">View and manage your expert sessions.</p>
      </div>

      <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-brand-primary" /></div>
        ) : bookings.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground flex flex-col items-center">
            <Calendar className="w-12 h-12 mb-4 opacity-20" />
            <p>You haven't booked any expert sessions yet.</p>
            <Link href="/experts" className="text-brand-primary font-medium hover:underline mt-4">
              Browse Experts
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 border-b border-border text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Service</th>
                  <th className="px-4 py-3">Scheduled For</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {bookings.map(b => (
                  <tr key={b.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3 font-medium text-foreground">{b.serviceTitle}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(b.scheduledAt).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium">{b.price} {b.currency}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium border flex w-fit items-center gap-1 ${
                        b.status === 'COMPLETED' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                        b.status === 'ACCEPTED' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                        b.status === 'REJECTED' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                        'bg-orange-500/10 text-orange-500 border-orange-500/20'
                      }`}>
                        {b.status === 'COMPLETED' && <CheckCircle2 className="w-3 h-3" />}
                        {b.status === 'REJECTED' && <XCircle className="w-3 h-3" />}
                        {b.status.replace('_', ' ')}
                      </span>
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
