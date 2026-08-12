import { Button } from "@/components/ui/button"

export function PaperTrading() {
  return (
    <section className="bg-background py-24 border-b border-border relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle_at_center,rgba(87,92,255,0.08)_0%,transparent_60%)] pointer-events-none rounded-full" />
      
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1">
            <div className="bg-card rounded-2xl border border-border p-8 shadow-2xl relative">
              <div className="absolute -top-3 -right-3 bg-brand-500 text-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Simulated
              </div>
              <h4 className="text-xl font-medium text-foreground mb-2">Paper Trading</h4>
              <p className="text-muted-foreground text-sm mb-8">Virtual Balance</p>
              
              <div className="font-display text-4xl md:text-5xl font-bold text-foreground mb-8 tracking-tight">
                ₹10,00,000
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="bg-muted rounded-lg p-4 flex justify-between items-center border border-border">
                  <div className="flex flex-col">
                    <span className="font-medium text-foreground">BTC/USDT</span>
                    <span className="text-xs text-success bg-success/10 w-fit px-2 py-0.5 rounded mt-1">BUY</span>
                  </div>
                  <div className="text-right">
                    <span className="block font-mono text-foreground">0.5</span>
                    <span className="text-xs text-success">+₹24,500</span>
                  </div>
                </div>
                
                <div className="bg-muted rounded-lg p-4 flex justify-between items-center border border-border">
                  <div className="flex flex-col">
                    <span className="font-medium text-foreground">ETH/USDT</span>
                    <span className="text-xs text-danger bg-danger/10 w-fit px-2 py-0.5 rounded mt-1">SELL</span>
                  </div>
                  <div className="text-right">
                    <span className="block font-mono text-foreground">2.0</span>
                    <span className="text-xs text-danger">-₹12,050</span>
                  </div>
                </div>
              </div>
              
              <div className="pt-6 border-t border-border flex justify-between items-center">
                <span className="text-muted-foreground font-medium">P&L</span>
                <span className="text-success font-display text-xl font-bold">+₹12,450</span>
              </div>
            </div>
          </div>
          
          <div className="order-1 lg:order-2">
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-6">
              Practice Before You Trade
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-lg">
              Experience the ETHSLTD trading environment with virtual funds before moving into live trading.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="px-8">Try Paper Trading</Button>
              <Button variant="outline" size="lg" className="border-border">How Paper Trading Works &rarr;</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
