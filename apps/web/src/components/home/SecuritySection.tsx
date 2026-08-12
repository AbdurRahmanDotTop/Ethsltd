import { ShieldAlert, KeyRound, Activity } from "lucide-react"

export function SecuritySection() {
  return (
    <section className="bg-background py-24">
      <div className="max-w-[1280px] mx-auto px-4 md:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-6">
            Security Built Into Every Layer
          </h2>
          <p className="text-muted-foreground text-lg">
            ETHSLTD is designed with account protection, authorization controls, transaction safeguards, and auditable workflows at its core.
          </p>
        </div>

        {/* Security Diagram/Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-card border border-border rounded-2xl p-8 relative overflow-hidden group hover:border-brand-500/50 transition-colors">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 rounded-full blur-2xl group-hover:bg-brand-500/20 transition-all" />
            <div className="w-12 h-12 rounded-xl bg-muted border border-border flex items-center justify-center mb-6 relative z-10">
              <KeyRound className="w-6 h-6 text-[var(--brand-foreground)]" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-4 relative z-10">Account Protection</h3>
            <ul className="space-y-3 text-muted-foreground text-sm relative z-10">
              <li>• Secure authentication</li>
              <li>• Session management</li>
              <li>• Device management</li>
              <li>• 2FA</li>
            </ul>
          </div>

          <div className="bg-card border border-border rounded-2xl p-8 relative overflow-hidden group hover:border-brand-500/50 transition-colors">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 rounded-full blur-2xl group-hover:bg-brand-500/20 transition-all" />
            <div className="w-12 h-12 rounded-xl bg-muted border border-border flex items-center justify-center mb-6 relative z-10">
              <ShieldAlert className="w-6 h-6 text-[var(--brand-foreground)]" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-4 relative z-10">Transaction Protection</h3>
            <ul className="space-y-3 text-muted-foreground text-sm relative z-10">
              <li>• Transaction validation</li>
              <li>• Balance controls</li>
              <li>• Withdrawal controls</li>
              <li>• Idempotent financial operations</li>
            </ul>
          </div>

          <div className="bg-card border border-border rounded-2xl p-8 relative overflow-hidden group hover:border-brand-500/50 transition-colors">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 rounded-full blur-2xl group-hover:bg-brand-500/20 transition-all" />
            <div className="w-12 h-12 rounded-xl bg-muted border border-border flex items-center justify-center mb-6 relative z-10">
              <Activity className="w-6 h-6 text-[var(--brand-foreground)]" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-4 relative z-10">Operational Controls</h3>
            <ul className="space-y-3 text-muted-foreground text-sm relative z-10">
              <li>• Risk monitoring</li>
              <li>• Audit trails</li>
              <li>• Access controls</li>
              <li>• Activity monitoring</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
