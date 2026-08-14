import { Button } from "@/components/ui/button"
import Link from "next/link"

export function FinalCTA() {
  return (
    <section className="bg-background py-32 relative overflow-hidden border-t border-border">
      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle_at_center,rgba(0,255,194,0.05)_0%,transparent_50%)] pointer-events-none rounded-full" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle_at_center,rgba(20,91,140,0.1)_0%,transparent_50%)] pointer-events-none rounded-full" />
      
      {/* Background Graphic Lines */}
      <div className="absolute inset-0 opacity-10 pointer-events-none flex justify-center items-center">
        <svg viewBox="0 0 1000 400" className="w-full h-full preserve-3d" preserveAspectRatio="none">
          <path d="M0,200 L200,180 L400,220 L600,150 L800,190 L1000,100" fill="none" stroke="#FFFFFF" strokeWidth="1" />
          <path d="M0,250 L300,240 L500,280 L700,220 L900,260 L1000,200" fill="none" stroke="#FFFFFF" strokeWidth="0.5" />
        </svg>
      </div>

      <div className="max-w-[1280px] mx-auto px-4 md:px-8 relative z-10 text-center">
        <div className="font-display font-black text-6xl md:text-9xl text-foreground/5 tracking-tighter absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none pointer-events-none">
          ETHSLTD
        </div>
        
        <div className="relative z-20">
          <h2 className="font-display text-4xl md:text-6xl font-bold text-foreground mb-6 tracking-tight">
            Your Markets. Your Tools. Your Strategy.
          </h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Explore ETHSLTD and discover a modern environment for digital-asset trading.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Button size="lg" className="w-full sm:w-auto px-10 h-14 text-base" asChild>
              <Link href="/register">Create Account</Link>
            </Button>
            <Button variant="outline" size="lg" className="w-full sm:w-auto px-10 h-14 text-base border-border" asChild>
              <Link href="/markets">Explore Markets</Link>
            </Button>
          </div>
          
          <div className="mt-8">
            <Button variant="ghost" className="text-[var(--brand-foreground)] hover:text-foreground" asChild>
              <Link href="/learn/demo-trading">Try Demo Trading &rarr;</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
