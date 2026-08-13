import { Button } from "@/components/ui/button"
import Link from "next/link"

export const metadata = {
  title: "Security Education | ETHSLTD Learn",
  description: "Learn how to secure your account and protect your assets from scams.",
}

export default function SecurityEducation() {
  return (
    <article className="max-w-3xl prose prose-invert">
      <div className="mb-6 flex gap-2 text-sm text-muted-foreground">
        <Link href="/learn" className="hover:text-foreground">Learn</Link>
        <span>/</span>
        <span className="text-foreground">Security Education</span>
      </div>
      
      <h2 className="text-3xl font-bold text-foreground mb-6">Security Education</h2>
      
      <div className="space-y-6 text-muted-foreground">
        <section>
          <h3 className="text-xl font-semibold text-foreground mb-3">Protecting Your Account</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Strong Passwords:</strong> Use a unique, complex password for your ETHSLTD account. Never reuse passwords from other sites.</li>
            <li><strong>Two-Factor Authentication (2FA):</strong> Always enable 2FA (like Google Authenticator). This adds a crucial second layer of security beyond just your password.</li>
            <li><strong>Phishing Awareness:</strong> Always verify that you are on the official ETHSLTD domain before logging in. We will never ask for your password or 2FA code via email or chat.</li>
          </ul>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-foreground mb-3">P2P Trading Safety</h3>
          <p>
            When using our Peer-to-Peer (P2P) marketplace, always communicate with the buyer/seller exclusively through our built-in chat system. Never release crypto before you have independently verified that fiat funds have arrived in your bank account. Avoid off-platform deals, as they are not protected by our escrow system.
          </p>
        </section>
      </div>

      <div className="mt-12 pt-8 border-t border-border flex justify-between items-center">
        <Button variant="outline" asChild>
          <Link href="/learn/paper-trading">&larr; Previous: Paper Trading</Link>
        </Button>
        <Button asChild>
          <Link href="/learn/market-insights">Next: Market Insights &rarr;</Link>
        </Button>
      </div>
    </article>
  )
}
