"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@ethsltd/api-client";
import { Loader2, Calendar, CheckCircle2, Clock, XCircle, Star, MessageSquare, MessageCircle } from "lucide-react";
import Link from "next/link";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";

export default function UserBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Review Modal State
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);

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

      <Dialog open={reviewModalOpen} onOpenChange={setReviewModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Review your Session</DialogTitle>
            <DialogDescription>
              How was your session for {selectedBooking?.serviceTitle}? Your feedback helps the community.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="transition-transform hover:scale-110 focus:outline-none"
                >
                  <Star className={`w-10 h-10 ${star <= rating ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground/30 stroke-[1.5]"}`} />
                </button>
              ))}
            </div>
            <div className="space-y-2 mt-4">
              <label className="text-sm font-semibold text-foreground">Comment (Optional)</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience..."
                rows={4}
                className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary resize-y"
              />
            </div>
            {reviewError && (
              <p className="text-sm text-red-500 font-medium">{reviewError}</p>
            )}
          </div>
          <DialogFooter>
            <button 
              type="button" 
              onClick={() => setReviewModalOpen(false)}
              className="px-4 py-2 text-sm font-semibold text-muted-foreground hover:bg-muted rounded-lg"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              type="button" 
              onClick={async () => {
                if (!selectedBooking) return;
                setIsSubmitting(true);
                setReviewError(null);
                try {
                  const res = await apiClient.submitExpertReview(selectedBooking.id, rating, comment);
                  if (res.success) {
                    alert("Review submitted successfully!");
                    setReviewModalOpen(false);
                    // Update local state to hide button
                    setBookings(prev => prev.map(b => b.id === selectedBooking.id ? { ...b, hasReviewed: true } : b));
                  } else {
                    setReviewError(res.error || "Failed to submit review");
                  }
                } catch(e) {
                  setReviewError("An unexpected error occurred");
                } finally {
                  setIsSubmitting(false);
                }
              }}
              className="px-4 py-2 text-sm font-semibold bg-brand-primary text-primary-foreground hover:bg-brand-primary/90 rounded-lg flex items-center gap-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Submit Review'}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
                  <th className="px-4 py-3 text-right">Actions</th>
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
                    <td className="px-4 py-3 text-right">
                      {b.status === 'COMPLETED' && !b.hasReviewed && (
                        <button
                          onClick={() => {
                            setSelectedBooking(b);
                            setRating(5);
                            setComment("");
                            setReviewError(null);
                            setReviewModalOpen(true);
                          }}
                          className="text-xs font-semibold text-brand-primary bg-brand-primary/10 hover:bg-brand-primary/20 px-3 py-1.5 rounded-md inline-flex items-center gap-1 transition-colors"
                        >
                          <MessageSquare className="w-3 h-3" />
                          Leave Review
                        </button>
                      )}
                      {b.hasReviewed && (
                        <span className="text-xs font-medium text-muted-foreground flex items-center justify-end gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Reviewed
                        </span>
                      )}
                      
                      {!['CANCELLED', 'REFUNDED', 'PENDING_PAYMENT'].includes(b.status) && (
                        <Link 
                          href={`/account/bookings/${b.id}/chat`}
                          className="mt-2 text-xs font-semibold text-brand-500 bg-brand-500/10 hover:bg-brand-500/20 px-3 py-1.5 rounded-md inline-flex items-center gap-1 transition-colors"
                        >
                          <MessageCircle className="w-3 h-3" />
                          Chat
                        </Link>
                      )}
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
