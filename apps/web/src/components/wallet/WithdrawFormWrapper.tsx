"use client";

import { useTradingModeStore } from "@/stores/trading-mode-store";
import { DemoWithdrawForm } from "./DemoWithdrawForm";
import { RealWithdrawForm } from "./RealWithdrawForm";

export function WithdrawFormWrapper({ defaultAsset }: { defaultAsset?: string }) {
  const { mode } = useTradingModeStore();
  
  if (mode === 'REAL') {
    return <RealWithdrawForm defaultAsset={defaultAsset} />;
  }
  return <DemoWithdrawForm defaultAsset={defaultAsset} />;
}
