export const metadata = {
  title: "Cookie Policy | ETHSLTD Legal",
  description: "Information about how we use cookies and tracking technologies.",
}

export default function CookiePolicy() {
  return (
    <article className="max-w-3xl prose prose-invert">
      <h2 className="text-3xl font-bold text-foreground mb-2">Cookie Policy</h2>
      <p className="text-sm text-muted-foreground mb-8">Last Updated: October 24, 2026</p>
      
      <div className="space-y-6 text-muted-foreground">
        <section>
          <h3 className="text-xl font-semibold text-foreground mb-3">1. What Are Cookies?</h3>
          <p>
            Cookies are small text files that are stored on your device when you visit our website. They help us remember your preferences, keep you logged securely, and understand how you interact with our platform.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-foreground mb-3">2. Types of Cookies We Use</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Essential Cookies:</strong> Necessary for the platform to function (e.g., authentication tokens, theme preferences).</li>
            <li><strong>Preference Cookies:</strong> Remember your settings like your preferred trading pairs or fiat currency.</li>
            <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with the website to improve our services.</li>
            <li><strong>Support Cookies:</strong> Used by our third-party chat provider (Tawk.to) to maintain chat sessions across pages.</li>
          </ul>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-foreground mb-3">3. Managing Your Cookies</h3>
          <p>
            You can control and/or delete cookies as you wish through your browser settings. However, please note that disabling essential cookies will prevent you from logging into your ETHSLTD account and trading.
          </p>
        </section>
      </div>
    </article>
  )
}
