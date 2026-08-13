"use client";

import { useState } from "react";
import { P2PAdvertisement, P2PMerchant } from "@/lib/p2p/types";
import { P2PHero } from "@/components/p2p/P2PHero";
import { P2PControls } from "@/components/p2p/P2PControls";
import { P2PTable } from "@/components/p2p/P2PTable";
import { P2POrderDrawer } from "@/components/p2p/P2POrderDrawer";

export default function P2PPage() {
  const [selectedAd, setSelectedAd] = useState<P2PAdvertisement | null>(null);
  const [selectedMerchant, setSelectedMerchant] = useState<P2PMerchant | null>(null);

  const handleSelectAd = (ad: P2PAdvertisement, merchant: P2PMerchant) => {
    setSelectedAd(ad);
    setSelectedMerchant(merchant);
  };

  const handleCloseDrawer = () => {
    setSelectedAd(null);
    setSelectedMerchant(null);
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <P2PHero />
      
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 pb-24">
        <P2PControls />
        
        <div className="mt-2">
          <P2PTable onSelectAd={handleSelectAd} />
        </div>
      </div>

      {selectedAd && selectedMerchant && (
        <P2POrderDrawer 
          ad={selectedAd} 
          merchant={selectedMerchant} 
          onClose={handleCloseDrawer} 
        />
      )}
    </div>
  );
}
