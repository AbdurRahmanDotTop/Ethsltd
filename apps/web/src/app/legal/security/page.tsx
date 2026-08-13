export const metadata = {
  title: "Security Policy | ETHSLTD Legal",
  description: "Our approach to platform and user security.",
}

export default function SecurityPolicy() {
  return (
    <article className="max-w-3xl prose prose-invert">
      <h2 className="text-3xl font-bold text-foreground mb-2">Security Policy</h2>
      <p className="text-sm text-muted-foreground mb-8">Last Updated: October 24, 2026</p>
      
      <div className="space-y-6 text-muted-foreground">
        <section>
          <h3 className="text-xl font-semibold text-foreground mb-3">1. Account Security</h3>
          <p>
            We enforce strict password requirements and strongly encourage the use of Two-Factor Authentication (2FA) for all accounts. We actively monitor for suspicious login attempts and new device access, sending email alerts when necessary.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-foreground mb-3">2. Infrastructure Security</h3>
          <p>
            All communication with our servers is encrypted using industry-standard TLS. Our databases and internal APIs are isolated within virtual private clouds (VPCs) with strict firewall rules and access management.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-foreground mb-3">3. Vulnerability Disclosure</h3>
          <p>
            We encourage security researchers to responsibly disclose any vulnerabilities they find in our systems. If you believe you have discovered a security issue, please contact our security team through our support channels.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-foreground mb-3">4. Incident Response</h3>
          <p>
            In the event of a security breach, we have an incident response plan to quickly mitigate the threat, secure our systems, and notify affected users in accordance with applicable data protection laws.
          </p>
        </section>
      </div>
    </article>
  )
}
