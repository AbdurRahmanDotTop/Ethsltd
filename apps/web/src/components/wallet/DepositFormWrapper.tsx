"use client";

import { useTradingModeStore } from "@/stores/trading-mode-store";
import { DemoDepositForm } from "./DemoDepositForm";
import { RealDepositForm } from "./RealDepositForm";

export function DepositFormWrapper({ defaultAsset }: { defaultAsset?: string }) {
  const { mode } = useTradingModeStore();
  
  if (mode === 'REAL') {
    return <RealDepositForm defaultAsset={defaultAsset} />;
  }
  return <DemoDepositForm defaultAsset={defaultAsset} />;
}
