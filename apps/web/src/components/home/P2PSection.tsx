import { Button } from "@/components/ui/button"

export function P2PSection() {
  const p2pAds = [
    { type: 'Buy', price: '₹91.20', payment: 'UPI', available: '₹50,000' },
    { type: 'Sell', price: '₹90.85', payment: 'Bank Transfer', available: '₹75,000' },
  ]

  return (
    <section className="bg-muted py-24">
      <div className="max-w-[1280px] mx-auto px-4 md:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-6">
              Buy & Sell Crypto Through P2P
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-lg">
              Discover peer-to-peer trading with structured trade workflows, escrow controls, messaging, and dispute support.
            </p>
            
            <ul className="space-y-4 mb-10">
              {[
                'Verified counterparties',
                'Structured trade workflow',
                'Escrow-based transaction flow',
                'P2P chat',
                'Dispute management'
              ].map((item, i) => (
                <li key={i} className="flex items-center text-muted-foreground">
                  <div className="w-5 h-5 rounded-full bg-brand-500/20 text-[var(--brand-foreground)] flex items-center justify-center mr-3 text-xs">✓</div>
                  {item}
                </li>
              ))}
            </ul>
            
            <Button size="lg" className="px-8">Explore P2P</Button>
          </div>
          
          <div className="space-y-4">
            {p2pAds.map((ad, i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-6 hover:border-border transition-colors">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#26A17B] text-white flex items-center justify-center font-bold">
                      ₮
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">USDT</h4>
                      <p className="text-xs text-muted-foreground">Tether US</p>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded text-xs font-bold uppercase ${ad.type === 'Buy' ? 'bg-success/20 text-success' : 'bg-danger/20 text-danger'}`}>
                    {ad.type}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Price</p>
                    <p className="font-mono text-lg font-medium text-foreground">{ad.price}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Available</p>
                    <p className="font-mono text-sm text-muted-foreground mt-1">{ad.available}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Payment Method</p>
                    <p className="text-sm text-muted-foreground">{ad.payment}</p>
                  </div>
                </div>
                
                <Button className="w-full" variant={ad.type === 'Buy' ? 'success' : 'destructive'}>
                  {ad.type} USDT
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
