"use client";

import { useAdminEnvStore } from "@/stores/admin-env-store";
import { AlertTriangle } from "lucide-react";

export function DemoBanner() {
  const { adminMode } = useAdminEnvStore();

  if (adminMode !== "DEMO") return null;

  return (
    <div className="bg-orange-500/20 text-orange-500 text-xs font-bold uppercase tracking-widest px-4 py-1.5 flex items-center justify-center gap-2 border-b border-orange-500/30">
      <AlertTriangle className="w-3.5 h-3.5" />
      Demo Data Mode Active
      <AlertTriangle className="w-3.5 h-3.5" />
    </div>
  );
}
