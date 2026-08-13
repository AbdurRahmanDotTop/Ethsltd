export const metadata = {
  title: "Privacy Policy | ETHSLTD Legal",
  description: "How we collect, use, and protect your data.",
}

export default function PrivacyPolicy() {
  return (
    <article className="max-w-3xl prose prose-invert">
      <h2 className="text-3xl font-bold text-foreground mb-2">Privacy Policy</h2>
      <p className="text-sm text-muted-foreground mb-8">Last Updated: October 24, 2026</p>
      
      <div className="space-y-6 text-muted-foreground">
        <section>
          <h3 className="text-xl font-semibold text-foreground mb-3">1. Information We Collect</h3>
          <p>
            We collect information you provide directly to us, such as when you create or modify your account, request on-demand services, contact customer support, or otherwise communicate with us. This includes Account Data (email, password), Security Data (2FA configurations), and Device Information.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-foreground mb-3">2. How We Use Information</h3>
          <p>
            We use the information we collect to provide, maintain, and improve our services. This includes processing transactions (simulated or real), sending you technical notices, updates, security alerts, and providing customer support.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-foreground mb-3">3. Data Retention</h3>
          <p>
            We retain personal data for as long as necessary to provide our services and for our legitimate and essential business purposes, such as maintaining the performance of the service, making data-driven business decisions, complying with our legal obligations, and resolving disputes.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-foreground mb-3">4. Security Practices</h3>
          <p>
            We employ industry-standard security measures designed to protect the security of all information submitted through the services. However, the security of information transmitted through the internet can never be guaranteed.
          </p>
        </section>
      </div>
    </article>
  )
}
