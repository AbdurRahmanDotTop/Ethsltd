import Link from "next/link"
import { BookOpen, TrendingUp, Shield, Lightbulb, PieChart } from "lucide-react"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"

export default function LearnLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const sidebarLinks = [
    { href: "/learn", label: "Learn Hub", icon: <BookOpen className="w-4 h-4" /> },
    { href: "/learn/crypto-basics", label: "Crypto Basics", icon: <Lightbulb className="w-4 h-4" /> },
    { href: "/learn/trading", label: "Trading Guide", icon: <TrendingUp className="w-4 h-4" /> },
    { href: "/learn/paper-trading", label: "Paper Trading", icon: <PieChart className="w-4 h-4" /> },
    { href: "/learn/security", label: "Security Education", icon: <Shield className="w-4 h-4" /> },
    { href: "/learn/market-insights", label: "Market Insights", icon: <TrendingUp className="w-4 h-4" /> },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <div className="flex-1 flex flex-col">
      <div className="border-b border-border bg-card/50">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-8">
          <h1 className="text-3xl font-display font-bold text-foreground">Learn & Educate</h1>
          <p className="text-muted-foreground mt-2">Master the crypto markets with our comprehensive guides.</p>
        </div>
      </div>
      
      <div className="max-w-[1280px] w-full mx-auto px-4 md:px-8 py-8 flex-1 flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 shrink-0">
          <nav className="flex flex-col gap-1 sticky top-24">
            {sidebarLinks.map((link) => (
              <Link 
                key={link.href}
                href={link.href}
                className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
          </nav>
        </aside>
        
        <main className="flex-1 min-w-0">
          <div className="bg-card border border-border rounded-xl p-6 md:p-8 min-h-[500px]">
            {children}
          </div>
        </main>
      </div>
      </div>
      <Footer />
    </div>
  )
}
