"use client";

import { P2PExpertService } from "@/lib/p2p/types";
import { Clock, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ExpertServiceCardProps {
  service: P2PExpertService;
  onBook: (service: P2PExpertService) => void;
}

export function ExpertServiceCard({ service, onBook }: ExpertServiceCardProps) {
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="bg-card border border-border rounded-xl p-5 hover:border-brand-500/50 transition-colors flex flex-col h-full">
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold text-lg text-foreground line-clamp-2">{service.title}</h3>
      </div>
      
      <span className="inline-block px-2 py-0.5 bg-muted text-muted-foreground text-xs font-medium rounded-full mb-3 w-fit">
        {service.category}
      </span>
      
      <p className="text-sm text-muted-foreground mb-6 flex-1">
        {service.description}
      </p>
      
      <div className="flex items-center justify-between mt-auto pt-4 border-t border-border flex-wrap gap-y-4">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-foreground font-semibold">
            <span>{formatCurrency(service.price, service.currency)}</span>
            <span className="text-xs font-normal text-muted-foreground">
              {service.pricingType === "PER_HOUR" ? "/ hr" : ""}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Clock className="w-3.5 h-3.5" />
            <span>{service.duration} mins</span>
          </div>
        </div>
        
        <Button onClick={() => onBook(service)}>
          Book Now
        </Button>
      </div>
    </div>
  );
}
