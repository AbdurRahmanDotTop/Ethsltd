import Link from 'next/link'
import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-background pt-24 pb-32">
      {/* Background Gradients */}
      <div className="absolute top-[30%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle_at_center,rgba(0,255,194,0.10)_0%,transparent_50%)] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[800px] h-[800px] rounded-full bg-[radial-gradient(circle_at_center,rgba(87,92,255,0.08)_0%,transparent_50%)] pointer-events-none" />

      <div className="max-w-[1280px] mx-auto px-4 md:px-8 relative z-10 flex flex-col items-center text-center">
        <p className="text-[var(--brand-foreground)] font-medium tracking-wide text-sm uppercase mb-6">
          The modern digital asset platform
        </p>
        
        <h1 className="font-display text-5xl md:text-7xl font-bold text-foreground tracking-tight leading-[1.05] max-w-4xl mb-8">
          Trade Crypto With Clarity.
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed">
          Discover markets, practice with demo trading, and access the tools you need to manage your digital-asset journey.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-base" asChild>
            <Link href="/login">Log In</Link>
          </Button>
          <Button variant="outline" size="lg" className="w-full sm:w-auto h-14 px-8 text-base border-border hover:bg-foreground/5" asChild>
            <Link href="/register">Sign Up</Link>
          </Button>
        </div>
        
        <Link href="/markets" className="mt-8 text-sm font-medium text-[var(--brand-foreground)] hover:text-brand-200 flex items-center transition-colors">
          Explore Markets <span className="ml-2">&rarr;</span>
        </Link>

        {/* Hero Visual Mockup */}
        <div className="mt-20 w-full max-w-5xl relative">
          <div className="absolute inset-0 bg-gradient-to-t from-[#05070A] to-transparent z-10 h-full pointer-events-none" />
          <div className="rounded-xl border border-border bg-card/80 backdrop-blur-sm overflow-hidden shadow-2xl">
            <div className="flex items-center border-b border-border p-4 bg-card">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-foreground/10" />
                <div className="w-3 h-3 rounded-full bg-foreground/10" />
                <div className="w-3 h-3 rounded-full bg-foreground/10" />
              </div>
              <div className="mx-auto text-xs font-mono text-muted-foreground bg-muted px-3 py-1 rounded">
                BTC/USDT $104,284.32 (+2.41%)
              </div>
            </div>
            {/* Minimal Chart representation */}
            <div className="h-[300px] md:h-[400px] w-full p-6 flex flex-col justify-end relative">
              <svg viewBox="0 0 1000 300" className="w-full h-full preserve-3d" preserveAspectRatio="none">
                <path d="M0,250 L100,240 L200,260 L300,210 L400,220 L500,180 L600,190 L700,120 L800,140 L900,80 L1000,50" fill="none" stroke="#145B8C" strokeWidth="3" />
                <path d="M0,300 L0,250 L100,240 L200,260 L300,210 L400,220 L500,180 L600,190 L700,120 L800,140 L900,80 L1000,50 L1000,300 Z" fill="url(#gradient)" className="opacity-20" />
                <defs>
                  <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#145B8C" />
                    <stop offset="100%" stopColor="transparent" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
