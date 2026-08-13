import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BookOpen, TrendingUp, Shield, Lightbulb, PieChart } from "lucide-react"

export default function LearnHome() {
  const topics = [
    { href: "/learn/crypto-basics", title: "Crypto Basics", desc: "Start here to understand blockchain, wallets, and the fundamentals of crypto.", icon: <Lightbulb className="w-8 h-8 text-brand-500" /> },
    { href: "/learn/trading", title: "Trading Guide", desc: "Learn about market orders, limit orders, order books, and trading strategies.", icon: <TrendingUp className="w-8 h-8 text-brand-500" /> },
    { href: "/learn/paper-trading", title: "Paper Trading", desc: "Practice trading in a risk-free environment using virtual funds.", icon: <PieChart className="w-8 h-8 text-brand-500" /> },
    { href: "/learn/security", title: "Security Education", desc: "How to keep your account, funds, and personal data secure.", icon: <Shield className="w-8 h-8 text-brand-500" /> },
    { href: "/learn/market-insights", title: "Market Insights", desc: "Read the latest simulated market updates and overviews.", icon: <BookOpen className="w-8 h-8 text-brand-500" /> },
  ]

  return (
    <div className="max-w-4xl">
      <h2 className="text-2xl font-bold text-foreground mb-4">Welcome to the ETHSLTD Learning Hub</h2>
      <p className="text-muted-foreground mb-8">
        Whether you're making your first trade or you're an experienced professional looking to hone your strategy, our educational resources are designed to help you navigate the crypto markets safely and effectively.
      </p>
      
      <div className="grid md:grid-cols-2 gap-4">
        {topics.map(t => (
          <Link key={t.href} href={t.href} className="group block p-6 border border-border rounded-lg bg-card hover:border-brand-500/50 transition-colors">
            <div className="mb-4 bg-muted w-16 h-16 rounded-full flex items-center justify-center group-hover:bg-brand-500/10 transition-colors">
              {t.icon}
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-brand-500 transition-colors">{t.title}</h3>
            <p className="text-sm text-muted-foreground">{t.desc}</p>
          </Link>
        ))}
      </div>
      
      <div className="mt-12 p-6 bg-muted border border-border rounded-lg flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-lg font-bold text-foreground mb-1">Ready to practice?</h3>
          <p className="text-sm text-muted-foreground">Try our simulated trading environment.</p>
        </div>
        <Button asChild>
          <Link href="/trade">Start Paper Trading</Link>
        </Button>
      </div>
    </div>
  )
}
