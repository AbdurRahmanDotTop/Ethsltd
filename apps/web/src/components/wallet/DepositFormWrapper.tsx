"use client";

import { RealDepositForm } from "./RealDepositForm";

export function DepositFormWrapper({ defaultAsset }: { defaultAsset?: string }) {
  return <RealDepositForm defaultAsset={defaultAsset} />;
}
