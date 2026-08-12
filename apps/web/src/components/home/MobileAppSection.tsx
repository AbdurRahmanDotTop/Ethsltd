import { Button } from "@/components/ui/button"

export function MobileAppSection() {
  return (
    <section className="bg-background py-24 overflow-hidden border-b border-border">
      <div className="max-w-[1280px] mx-auto px-4 md:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1 relative h-[500px] flex justify-center items-center">
            {/* Ambient Background Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(20,91,140,0.15)_0%,transparent_60%)] pointer-events-none" />
            
            {/* Phone Mockup Placeholder */}
            <div className="w-[280px] h-[580px] rounded-[40px] border-8 border-dark-800 bg-background shadow-2xl relative overflow-hidden z-10 transform -rotate-6 translate-y-10">
              <div className="absolute top-0 inset-x-0 h-6 bg-card rounded-b-3xl mx-auto w-1/3" />
              <div className="p-6 h-full flex flex-col">
                <div className="font-display font-bold text-xl text-foreground mb-8 mt-4">ETHSLTD</div>
                <div className="bg-card rounded-xl p-4 mb-4 border border-border">
                  <div className="text-muted-foreground text-xs mb-1">BTC/USDT</div>
                  <div className="text-foreground font-mono text-xl mb-1">$104,284.32</div>
                  <div className="text-success text-xs font-mono">+2.41%</div>
                </div>
                {/* Mini Chart */}
                <div className="flex-1 flex items-end mb-4 border-b border-border">
                   <svg viewBox="0 0 100 50" className="w-full h-24 preserve-3d" preserveAspectRatio="none">
                    <path d="M0,40 L20,35 L40,45 L60,20 L80,25 L100,5" fill="none" stroke="#145B8C" strokeWidth="2" />
                  </svg>
                </div>
                <Button className="w-full mt-auto mb-2">Trade</Button>
              </div>
            </div>
            
             <div className="absolute w-[260px] h-[540px] rounded-[36px] border border-border bg-muted shadow-xl z-0 transform rotate-6 translate-x-20 -translate-y-4 opacity-50" />
          </div>

          <div className="order-1 lg:order-2">
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-6">
              Trade From Anywhere
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-lg">
              Stay connected to markets, portfolio activity, orders, and notifications from your mobile device.
            </p>
            <Button size="lg" className="px-8">Mobile Experience Coming Soon</Button>
          </div>
        </div>
      </div>
    </section>
  )
}
