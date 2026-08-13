import { Button } from "@/components/ui/button"
import Link from "next/link"

export const metadata = {
  title: "Crypto Basics | ETHSLTD Learn",
  description: "Learn the fundamentals of cryptocurrency, blockchain, wallets, and digital assets.",
}

export default function CryptoBasics() {
  return (
    <article className="max-w-3xl prose prose-invert">
      <div className="mb-6 flex gap-2 text-sm text-muted-foreground">
        <Link href="/learn" className="hover:text-foreground">Learn</Link>
        <span>/</span>
        <span className="text-foreground">Crypto Basics</span>
      </div>
      
      <h2 className="text-3xl font-bold text-foreground mb-6">Crypto Basics</h2>
      
      <div className="space-y-6 text-muted-foreground">
        <section>
          <h3 className="text-xl font-semibold text-foreground mb-3">What is Cryptocurrency?</h3>
          <p>
            Cryptocurrency is digital money that isn't managed by a central system like a government. Instead, it's based on blockchain technology, with Bitcoin being the most popular one. As digital money continues to gain traction, more people are finding ways to invest, trade, and use crypto in their daily lives.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-foreground mb-3">Understanding Blockchain</h3>
          <p>
            At its core, a blockchain is a distributed digital ledger. Imagine a database that is shared across a network of computers. Once a record has been added to the chain it is very difficult to change. To ensure all the copies of the database are the same, the network makes constant checks.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-foreground mb-3">Wallets and Custody</h3>
          <p>
            A crypto wallet doesn't actually store your crypto. Instead, it holds the cryptographic keys that allow you to access your crypto on the blockchain. When trading on ETHSLTD, we provide a secure custodial wallet to hold your funds while you trade, ensuring high liquidity and instant execution.
          </p>
        </section>
      </div>

      <div className="mt-12 pt-8 border-t border-border flex justify-between items-center">
        <Button variant="outline" asChild>
          <Link href="/learn">&larr; Back to Learn</Link>
        </Button>
        <Button asChild>
          <Link href="/learn/trading">Next: Trading Guide &rarr;</Link>
        </Button>
      </div>
    </article>
  )
}
