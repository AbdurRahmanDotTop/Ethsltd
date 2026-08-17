export const metadata = {
  title: "Terms of Service | ETHSLTD Legal",
  description: "Terms and conditions for using the ETHSLTD platform.",
}

export default function TermsOfService() {
  return (
    <article className="max-w-3xl prose prose-invert">
      <h2 className="text-3xl font-bold text-foreground mb-2">Terms of Service</h2>
      <p className="text-sm text-muted-foreground mb-8">Last Updated: October 24, 2026</p>
      
      <div className="space-y-6 text-muted-foreground">
        <section>
          <h3 className="text-xl font-semibold text-foreground mb-3">1. Acceptance of Terms</h3>
          <p>
            By accessing or using the ETHSLTD platform, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, then you may not access the service. Currently, the platform operates in a simulated environment for educational purposes.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-foreground mb-3">2. Account Responsibilities & Termination</h3>
          <p className="mb-4">
            You are responsible for safeguarding the password that you use to access the service and for any activities or actions under your password. We strongly recommend enabling Two-Factor Authentication (2FA) for your account.
          </p>
          <p>
            <strong className="text-foreground">Account Deletion:</strong> The platform administrators (Super Admins) reserve the right to completely and permanently delete any user account and all associated data (including but not limited to transaction history, active and past orders, P2P records, and wallets) at their sole discretion, without prior notice. Once an account is deleted, the data cannot be recovered.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-foreground mb-3">3. Trading Rules & P2P</h3>
          <p>
            Any trading activities conducted on the platform must comply with applicable local regulations. Users utilizing the P2P marketplace must communicate exclusively through the platform's chat system and must not attempt to circumvent the escrow mechanism.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-foreground mb-3">4. Limitation of Liability</h3>
          <p>
            ETHSLTD and its affiliates shall not be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the service.
          </p>
        </section>
      </div>
    </article>
  )
}
