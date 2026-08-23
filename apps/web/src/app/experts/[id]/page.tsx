"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiClient } from "@ethsltd/api-client";
import { Loader2, Star, MessageSquare, Briefcase, Calendar, CheckCircle2, ChevronLeft, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { useAuthStore } from "@/stores/auth-store";

export default function ExpertProfilePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  
  const [expert, setExpert] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Booking Modal State
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [scheduledAt, setScheduledAt] = useState("");
  const [isBooking, setIsBooking] = useState(false);
  
  // Wallet checking
  const [checkingWallet, setCheckingWallet] = useState(false);
  const [walletError, setWalletError] = useState<string | null>(null);
  const [requiredAmount, setRequiredAmount] = useState(0);
  const [availableAmount, setAvailableAmount] = useState(0);
  const [currency, setCurrency] = useState("");

  useEffect(() => {
    const fetchExpertAndServices = async () => {
      try {
        const [expertRes, servicesRes] = await Promise.all([
          apiClient.getExpert(id),
          apiClient.getExpertServices(id)
        ]);
        
        if (expertRes.success) setExpert(expertRes.data);
        if (servicesRes.success) setServices(servicesRes.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchExpertAndServices();
  }, [id]);

  const handleBookClick = (service: any) => {
    const userStr = useAuthStore.getState().user;
    if (!userStr) {
      alert("Please log in to book a session.");
      router.push('/login?redirect=' + encodeURIComponent(`/experts/${id}`));
      return;
    }
    
    setSelectedService(service);
    setWalletError(null);
    setIsBookingModalOpen(true);
    
    // Default to tomorrow 10 AM
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(10, 0, 0, 0);
    // Format to yyyy-MM-ddThh:mm
    const pad = (n: number) => n.toString().padStart(2, '0');
    setScheduledAt(`${tomorrow.getFullYear()}-${pad(tomorrow.getMonth()+1)}-${pad(tomorrow.getDate())}T${pad(tomorrow.getHours())}:${pad(tomorrow.getMinutes())}`);
  };

  const confirmBooking = async () => {
    if (!scheduledAt) {
      alert("Please select a date and time");
      return;
    }
    
    setIsBooking(true);
    setWalletError(null);
    try {
      const res: any = await apiClient.bookExpertService({
        serviceId: selectedService.id,
        scheduledAt: new Date(scheduledAt).toISOString()
      });
      
      if (res.success) {
        alert("Session booked successfully! Escrow payment processed.");
        setIsBookingModalOpen(false);
        router.push('/account/bookings'); // User dashboard bookings page
      } else {
        if (res.error === 'INSUFFICIENT_BALANCE') {
          setWalletError(`Insufficient balance. You need ${res.required} ${res.currency}, but only have ${res.available} ${res.currency} available in your Real wallet.`);
          setRequiredAmount(res.required);
          setAvailableAmount(res.available);
          setCurrency(res.currency);
        } else {
          setWalletError(res.error || "Failed to book service");
        }
      }
    } catch (err) {
      setWalletError("An unexpected error occurred");
    } finally {
      setIsBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center text-brand-primary">
          <Loader2 className="w-10 h-10 animate-spin mb-4" />
          <p className="text-muted-foreground">Loading expert profile...</p>
        </div>
      </div>
    );
  }

  if (!expert) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
          <h2 className="text-2xl font-bold mb-2">Expert Not Found</h2>
          <p className="text-muted-foreground mb-6">This expert profile might have been removed or deactivated.</p>
          <Link href="/experts" className="text-brand-primary hover:underline flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Experts Directory
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 py-12">
        <div className="max-w-4xl mx-auto px-6 md:px-8 space-y-8">
          
          <Link href="/experts" className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-sm font-medium transition-colors">
            <ChevronLeft className="w-4 h-4" /> Back to Directory
          </Link>
          
          {/* Profile Header */}
          <div className="bg-card border border-border rounded-2xl p-6 md:p-10 shadow-sm flex flex-col md:flex-row gap-8 items-start md:items-center">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-muted border-4 border-background shadow-md flex items-center justify-center flex-shrink-0 overflow-hidden">
              {expert.avatarUrl ? (
                <img src={expert.avatarUrl} alt={expert.displayName} className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl font-bold text-muted-foreground">
                  {(expert.displayName || 'E').charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-display font-bold text-foreground">
                  {expert.displayName || 'Verified Expert'}
                </h1>
                <span className="flex items-center gap-1 bg-green-500/10 text-green-600 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                </span>
              </div>
              
              <div className="flex flex-wrap gap-x-6 gap-y-3 mt-4 text-sm text-muted-foreground font-medium">
                <div className="flex items-center gap-1.5 bg-muted/50 px-3 py-1.5 rounded-md">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-foreground">{expert.rating || 'New'}</span> Rating
                </div>
                <div className="flex items-center gap-1.5 bg-muted/50 px-3 py-1.5 rounded-md">
                  <Briefcase className="w-4 h-4" />
                  <span className="text-foreground">{expert.experienceYears || 0}y</span> Experience
                </div>
                <div className="flex items-center gap-1.5 bg-muted/50 px-3 py-1.5 rounded-md">
                  <MessageSquare className="w-4 h-4" />
                  <span className="text-foreground">{expert.customersHelped || 0}</span> Clients
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
              {/* About */}
              <div>
                <h2 className="text-xl font-bold text-foreground mb-4">About</h2>
                <div className="bg-card border border-border rounded-xl p-6 text-muted-foreground whitespace-pre-wrap leading-relaxed shadow-sm">
                  {expert.bio || 'No bio provided.'}
                </div>
              </div>
              
              {/* Services List */}
              <div>
                <h2 className="text-xl font-bold text-foreground mb-4">Available Services</h2>
                {services.length === 0 ? (
                  <div className="bg-card border border-border border-dashed rounded-xl p-8 text-center text-muted-foreground">
                    This expert currently has no active services.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {services.map(service => (
                      <div key={service.id} className="bg-card border border-border rounded-xl p-6 shadow-sm hover:border-brand-primary/50 transition-colors flex flex-col sm:flex-row gap-6 justify-between items-center group">
                        <div className="flex-1 w-full text-center sm:text-left">
                          <h3 className="text-lg font-bold text-foreground mb-1 group-hover:text-brand-primary transition-colors">{service.title}</h3>
                          <div className="flex items-center justify-center sm:justify-start gap-3 text-xs text-muted-foreground font-medium mb-3">
                            <span className="uppercase tracking-wide">{service.category}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {service.durationMinutes} mins</span>
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {service.description}
                          </p>
                        </div>
                        <div className="flex flex-col items-center gap-3 w-full sm:w-auto mt-4 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-border">
                          <div className="text-xl font-display font-bold text-foreground">
                            {service.price} {service.currency}
                          </div>
                          <button 
                            onClick={() => handleBookClick(service)}
                            className="w-full sm:w-auto px-6 py-2.5 bg-brand-primary text-primary-foreground hover:bg-brand-primary/90 font-medium rounded-lg shadow-sm transition-all hover:shadow-md"
                          >
                            Book Session
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* Reviews Section */}
            <div className="md:col-span-2 space-y-6 mt-4">
              <h2 className="text-xl font-bold text-foreground mb-4">Client Reviews</h2>
              {(!expert.reviews || expert.reviews.length === 0) ? (
                <div className="bg-card border border-border border-dashed rounded-xl p-8 text-center text-muted-foreground">
                  No reviews yet. Be the first to review after a session!
                </div>
              ) : (
                <div className="space-y-4">
                  {expert.reviews.map((review: any) => (
                    <div key={review.id} className="bg-card border border-border rounded-xl p-6 shadow-sm">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-muted overflow-hidden flex items-center justify-center">
                            {review.userAvatar ? (
                              <img src={review.userAvatar} alt="User avatar" className="w-full h-full object-cover" />
                            ) : (
                              <span className="font-bold text-muted-foreground">
                                {(review.userDisplayName || 'U').charAt(0).toUpperCase()}
                              </span>
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-sm text-foreground">{review.userDisplayName || 'User'}</div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map(star => (
                            <Star 
                              key={star} 
                              className={`w-4 h-4 ${star <= review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-muted stroke-muted-foreground/30'}`} 
                            />
                          ))}
                        </div>
                      </div>
                      {review.comment && (
                        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                          "{review.comment}"
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="space-y-6">
              {/* Categories & Skills */}
              <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                <h3 className="font-bold text-foreground mb-4">Expertise</h3>
                <div className="flex flex-wrap gap-2">
                  {(expert.categories || []).map((cat: string) => (
                    <span key={cat} className="bg-primary/10 text-primary px-3 py-1.5 rounded-md text-xs font-semibold tracking-wide uppercase border border-primary/20">
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Languages */}
              <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                <h3 className="font-bold text-foreground mb-4">Languages Spoken</h3>
                <div className="flex flex-wrap gap-2">
                  {(expert.languages || []).map((lang: string) => (
                    <span key={lang} className="bg-muted text-muted-foreground px-3 py-1.5 rounded-md text-sm font-medium border border-border">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Booking Modal */}
      <Dialog open={isBookingModalOpen} onOpenChange={setIsBookingModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Book Session</DialogTitle>
            <DialogDescription>
              Schedule a 1-on-1 session with {expert?.displayName}. The amount will be held in escrow until the session is completed.
            </DialogDescription>
          </DialogHeader>
          
          {selectedService && (
            <div className="py-4 space-y-6">
              <div className="bg-muted/30 p-4 rounded-xl border border-border">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-foreground">{selectedService.title}</h4>
                  <span className="font-display font-bold text-primary">
                    {selectedService.price} {selectedService.currency}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                  <Calendar className="w-3.5 h-3.5" /> {selectedService.durationMinutes} minutes
                </div>
              </div>
              
              <div className="space-y-3">
                <label className="text-sm font-semibold text-foreground">Select Date & Time</label>
                <input 
                  type="datetime-local" 
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  min={new Date().toISOString().slice(0, 16)}
                />
              </div>

              {walletError && (
                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl">
                  <p className="text-sm text-red-600 font-medium mb-3">{walletError}</p>
                  {requiredAmount > 0 && (
                    <Link 
                      href="/account/wallets" 
                      className="inline-block px-4 py-2 bg-red-600 text-white hover:bg-red-700 text-xs font-bold rounded-lg uppercase tracking-wide shadow-sm"
                    >
                      Deposit Funds
                    </Link>
                  )}
                </div>
              )}
            </div>
          )}

          <DialogFooter className="pt-2">
            <button 
              type="button" 
              onClick={() => setIsBookingModalOpen(false)}
              className="px-5 py-2.5 text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
              disabled={isBooking}
            >
              Cancel
            </button>
            <button 
              type="button"
              onClick={confirmBooking}
              disabled={isBooking || !!walletError}
              className="px-5 py-2.5 text-sm font-semibold text-primary-foreground bg-brand-primary hover:bg-brand-primary/90 rounded-lg shadow-md transition-all hover:shadow-lg disabled:opacity-50 disabled:shadow-none flex items-center gap-2"
            >
              {isBooking ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
              ) : (
                'Confirm & Pay'
              )}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
