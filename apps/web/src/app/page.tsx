import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { Hero } from "@/components/home/Hero"
import { LiveMarketTicker } from "@/components/home/LiveMarketTicker"
import { PlatformMetrics } from "@/components/home/PlatformMetrics"
import { TradingExperience } from "@/components/home/TradingExperience"
import { MarketsTable } from "@/components/home/MarketsTable"
import { DemoTrading } from "@/components/home/DemoTrading"
import { P2PSection } from "@/components/home/P2PSection"
import { SecuritySection } from "@/components/home/SecuritySection"
import { MobileAppSection } from "@/components/home/MobileAppSection"
import { HowItWorks } from "@/components/home/HowItWorks"
import { EducationalSection } from "@/components/home/EducationalSection"
import { FinalCTA } from "@/components/home/FinalCTA"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden">
      <Header />
      <main className="flex-1">
        <Hero />
        <LiveMarketTicker />
        <PlatformMetrics />
        <TradingExperience />
        <MarketsTable />
        <DemoTrading />
        <P2PSection />
        <SecuritySection />
        <MobileAppSection />
        <HowItWorks />
        <EducationalSection />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  )
}
