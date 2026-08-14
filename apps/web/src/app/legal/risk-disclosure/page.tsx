export const metadata = {
  title: "Risk Disclosure | ETHSLTD Legal",
  description: "Important information regarding the risks of cryptocurrency trading.",
}

export default function RiskDisclosure() {
  return (
    <article className="max-w-3xl prose prose-invert">
      <h2 className="text-3xl font-bold text-foreground mb-2">Risk Disclosure</h2>
      <p className="text-sm text-muted-foreground mb-8">Last Updated: October 24, 2026</p>
      
      <div className="space-y-6 text-muted-foreground">
        <div className="bg-destructive/10 border border-destructive/20 p-4 rounded-lg mb-8">
          <p className="text-sm text-destructive-foreground font-semibold">
            CRITICAL NOTICE: ETHSLTD is currently operating in a simulated "Demo Trading" mode. The risks below apply to real-world cryptocurrency trading but your funds on this platform are currently virtual.
          </p>
        </div>

        <section>
          <h3 className="text-xl font-semibold text-foreground mb-3">1. Volatility Risk</h3>
          <p>
            Cryptocurrency prices are highly volatile. The value of your investments can go down as well as up, and you may lose the entire amount you invested. Past performance is not a reliable indicator of future performance.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-foreground mb-3">2. Liquidity and Execution</h3>
          <p>
            Under certain market conditions, you may find it difficult or impossible to liquidate a position. This can occur, for example, when the market reaches a daily price fluctuation limit or there is insufficient liquidity in the market.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-foreground mb-3">3. P2P Counterparty Risk</h3>
          <p>
            When utilizing the P2P marketplace, there is a risk that the counterparty may default on their obligations. Always use the built-in escrow services and verify funds before releasing assets.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-foreground mb-3">4. Cybersecurity Risk</h3>
          <p>
            While we employ robust security measures, blockchains and crypto exchanges are targets for malicious actors. There is a risk of cyber attacks, hacks, and technological failures that could result in the loss of digital assets.
          </p>
        </section>
      </div>
    </article>
  )
}
