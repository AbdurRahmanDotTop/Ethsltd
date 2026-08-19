"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useTradingModeStore } from "@/stores/trading-mode-store"

interface DemoTradingCTAProps {
  className?: string
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  children?: React.ReactNode
}

export function DemoTradingCTA({ className, variant = "outline", size = "lg", children }: DemoTradingCTAProps) {
  const router = useRouter()
  const setMode = useTradingModeStore((state) => state.setMode)

  const handleDemoTradingClick = () => {
    setMode("DEMO")
    router.push("/trade")
  }

  return (
    <Button 
      variant={variant} 
      size={size} 
      className={className} 
      onClick={handleDemoTradingClick}
    >
      {children || "Try Demo Trading"}
    </Button>
  )
}
