"use client";

import { useState, use, useEffect } from "react";
import { apiClient } from "@ethsltd/api-client";
import { P2PExpertService, P2PExpertProfile } from "@/lib/p2p/types";
import { ExpertServiceCard } from "@/components/p2p/ExpertServiceCard";
import { BookingModal } from "@/components/p2p/BookingModal";
import { BadgeCheck, Star, Users, Clock, Globe, ArrowLeft, MessageSquare, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ExpertProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const expertId = resolvedParams.id;
  
  const [selectedService, setSelectedService] = useState<any | null>(null);
  const [expert, setExpert] = useState<any | null>(null);
  const [services, setServices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchExpertData = async () => {
      try {
        const [expertsRes, servicesRes] = await Promise.all([
          apiClient.getExperts(),
          apiClient.getExpertServices(expertId)
        ]);
        
        if (expertsRes.success) {
          const found = expertsRes.data?.find((e: any) => e.id === expertId);
          setExpert(found || null);
        }
        
        if (servicesRes.success) {
          setServices(servicesRes.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch expert details:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchExpertData();
  }, [expertId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-muted/30 pb-24">
        <Loader2 className="w-8 h-8 animate-spin mb-4 text-brand-500" />
        <p className="text-muted-foreground">Loading expert profile...</p>
      </div>
    );
  }

  if (!expert) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-4">
        <h2 className="text-2xl font-bold mb-2">Expert Not Found</h2>
        <p className="text-muted-foreground mb-6">The expert you are looking for does not exist or has been removed.</p>
        <Button asChild>
          <Link href="/p2p/experts">Back to Experts</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-muted/30 pb-24 min-h-screen">
      {/* Top Banner / Breadcrumb */}
      <div className="bg-background border-b border-border py-4">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8">
          <Link href="/p2p/experts" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Experts
          </Link>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-4 md:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Profile Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-card border border-border rounded-xl p-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-brand-600/20 to-brand-900/10 border-b border-border" />
              
              <div className="relative pt-10 text-center">
                <div className="w-24 h-24 rounded-full border-4 border-card bg-muted mx-auto mb-4 overflow-hidden shadow-sm">
                  {expert.avatar ? (
                    <img src={expert.avatar} alt={expert.displayName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-brand-900/30 text-brand-500 font-bold text-3xl">
                      {expert.displayName.charAt(0)}
                    </div>
                  )}
                </div>
                
                <h1 className="text-2xl font-bold text-foreground flex items-center justify-center gap-2">
                  {expert.displayName}
                  {expert.verificationStatus === "VERIFIED" && (
                    <BadgeCheck className="w-5 h-5 text-brand-500" />
                  )}
                </h1>
                
                <div className="flex items-center justify-center gap-1.5 text-muted-foreground mt-2">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="font-medium text-foreground">{expert.rating.toFixed(1)}</span>
                  <span>({expert.completedServices} reviews)</span>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-border grid grid-cols-2 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-muted-foreground mb-1">Experience</div>
                  <div className="font-medium text-foreground">{expert.experienceYears} Years</div>
                </div>
                <div className="text-center">
                  <div className="text-muted-foreground mb-1">Customers</div>
                  <div className="font-medium text-foreground">{expert.customersHelped}</div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-border space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <Globe className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <div className="text-muted-foreground">Languages</div>
                    <div className="font-medium text-foreground">{expert.languages.join(", ")}</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className={`w-3 h-3 rounded-full mt-1 shrink-0 ${
                    expert.availabilityStatus === "AVAILABLE" ? "bg-green-500" :
                    expert.availabilityStatus === "BUSY" ? "bg-orange-500" : "bg-muted-foreground"
                  }`} />
                  <div>
                    <div className="text-muted-foreground">Status</div>
                    <div className="font-medium text-foreground">
                      {expert.availabilityStatus === "AVAILABLE" ? "Available for Bookings" :
                       expert.availabilityStatus === "BUSY" ? "Busy / Limited Slots" : "Offline"}
                    </div>
                  </div>
                </div>
              </div>

              <Button className="w-full mt-6" variant="outline" disabled>
                <MessageSquare className="w-4 h-4 mr-2" />
                Message Expert
              </Button>
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="font-semibold text-foreground mb-4">Specialties</h3>
              <div className="flex flex-wrap gap-2">
                {expert.categories.map((cat: string) => (
                  <span key={cat} className="px-3 py-1 bg-muted text-muted-foreground text-sm font-medium rounded-full">
                    {cat}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Services */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="text-xl font-bold text-foreground mb-4">About Me</h2>
              <p className="text-muted-foreground whitespace-pre-wrap">{expert.bio}</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-foreground mb-6">Services Offered ({services.length})</h2>
              
              {services.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {services.map(service => (
                    <ExpertServiceCard 
                      key={service.id} 
                      service={service} 
                      onBook={setSelectedService}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-card border border-border rounded-xl text-muted-foreground">
                  This expert currently has no active services.
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {selectedService && (
        <BookingModal 
          expert={expert} 
          service={selectedService} 
          onClose={() => setSelectedService(null)} 
        />
      )}
    </div>
  );
}
