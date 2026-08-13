import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"

export const metadata = {
  title: "Fees | ETHSLTD",
  description: "Trading, deposit, and withdrawal fees on ETHSLTD.",
}

export default function FeesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="max-w-[1280px] w-full mx-auto px-4 md:px-8 py-16 flex-1">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl font-display font-bold text-foreground mb-4">Transparent Fee Structure</h1>
        <p className="text-lg text-muted-foreground">
          We believe in straightforward pricing. No hidden charges, just competitive rates for all your trading needs.
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
        <div className="bg-card border border-border rounded-xl p-8">
          <h3 className="text-xl font-semibold text-foreground mb-4">Spot Trading Fees</h3>
          <div className="flex justify-between items-center py-4 border-b border-border">
            <span className="text-muted-foreground">Maker Fee</span>
            <span className="font-mono text-lg text-foreground">0.10%</span>
          </div>
          <div className="flex justify-between items-center py-4">
            <span className="text-muted-foreground">Taker Fee</span>
            <span className="font-mono text-lg text-foreground">0.10%</span>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            * Maker fees are paid when you add liquidity to the order book. Taker fees are paid when you remove liquidity.
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-8">
          <h3 className="text-xl font-semibold text-foreground mb-4">P2P Trading Fees</h3>
          <div className="flex justify-between items-center py-4 border-b border-border">
            <span className="text-muted-foreground">Buyer Fee</span>
            <span className="font-mono text-lg text-success">0.00%</span>
          </div>
          <div className="flex justify-between items-center py-4">
            <span className="text-muted-foreground">Seller (Maker) Fee</span>
            <span className="font-mono text-lg text-foreground">0.15%</span>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            * Creating an ad on the P2P marketplace incurs a small fee upon successful execution. Taking an ad is always free.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <h3 className="text-2xl font-bold text-foreground mb-6">Withdrawal Fees</h3>
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium text-foreground">Asset</th>
                <th className="px-6 py-4 font-medium text-foreground">Network</th>
                <th className="px-6 py-4 font-medium text-foreground">Minimum Withdrawal</th>
                <th className="px-6 py-4 font-medium text-foreground">Fee</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <td className="px-6 py-4 text-foreground">Bitcoin (BTC)</td>
                <td className="px-6 py-4 text-muted-foreground">BTC</td>
                <td className="px-6 py-4 font-mono">0.001 BTC</td>
                <td className="px-6 py-4 font-mono">0.0005 BTC</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-foreground">Ethereum (ETH)</td>
                <td className="px-6 py-4 text-muted-foreground">ERC20</td>
                <td className="px-6 py-4 font-mono">0.01 ETH</td>
                <td className="px-6 py-4 font-mono">0.005 ETH</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-foreground">Tether (USDT)</td>
                <td className="px-6 py-4 text-muted-foreground">TRC20</td>
                <td className="px-6 py-4 font-mono">10 USDT</td>
                <td className="px-6 py-4 font-mono">1 USDT</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-sm text-muted-foreground mt-4">
          Withdrawal fees are dynamic and adjust based on current blockchain network conditions. The fees shown above are estimates.
        </p>
      </div>
      
      <div className="mt-16 text-center">
        <Button size="lg" asChild>
          <Link href="/trade">Start Trading Now</Link>
        </Button>
      </div>
      </main>
      <Footer />
    </div>
  )
}
