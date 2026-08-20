"use client";

import { P2PExpertProfile } from "@/lib/p2p/types";
import { BadgeCheck, Star, Users, Clock, Globe } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface ExpertCardProps {
  expert: P2PExpertProfile;
}

export function ExpertCard({ expert }: ExpertCardProps) {
  return (
    <div className="bg-card border border-border rounded-xl p-5 hover:border-primary/20 transition-colors flex flex-col h-full">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-muted">
              {expert.avatar ? (
                <img src={expert.avatar} alt={expert.displayName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-bold text-lg">
                  {expert.displayName.charAt(0)}
                </div>
              )}
            </div>
            {expert.availabilityStatus === "AVAILABLE" && (
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-card rounded-full" />
            )}
            {expert.availabilityStatus === "BUSY" && (
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-orange-500 border-2 border-card rounded-full" />
            )}
            {expert.availabilityStatus === "OFFLINE" && (
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-muted-foreground border-2 border-card rounded-full" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-semibold text-foreground">{expert.displayName}</h3>
              {expert.verificationStatus === "VERIFIED" && (
                <BadgeCheck className="w-4 h-4 text-primary" />
              )}
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-0.5">
              <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
              <span className="font-medium text-foreground">{expert.rating.toFixed(1)}</span>
              <span>({expert.completedServices} reviews)</span>
            </div>
          </div>
        </div>
      </div>

      <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-1">
        {expert.bio}
      </p>

      <div className="grid grid-cols-2 gap-y-2 gap-x-4 mb-5 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span>{expert.experienceYears} Years Exp.</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Users className="w-4 h-4" />
          <span>{expert.customersHelped} Helped</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground col-span-2">
          <Globe className="w-4 h-4 shrink-0" />
          <span className="truncate">{expert.languages.join(", ")}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-5">
        {expert.categories.slice(0, 3).map(cat => (
          <span key={cat} className="px-2 py-0.5 bg-muted text-muted-foreground text-xs font-medium rounded-full">
            {cat}
          </span>
        ))}
        {expert.categories.length > 3 && (
          <span className="px-2 py-0.5 bg-muted text-muted-foreground text-xs font-medium rounded-full">
            +{expert.categories.length - 3}
          </span>
        )}
      </div>

      <Button asChild className="w-full mt-auto" variant="outline">
        <Link href={`/p2p/experts/${expert.id}`}>
          View Profile & Services
        </Link>
      </Button>
    </div>
  );
}
