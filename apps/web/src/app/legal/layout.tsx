import Link from "next/link"
import { FileText, Shield, AlertTriangle, Cookie, Lock } from "lucide-react"

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const sidebarLinks = [
    { href: "/legal/terms", label: "Terms of Service", icon: <FileText className="w-4 h-4" /> },
    { href: "/legal/privacy", label: "Privacy Policy", icon: <Shield className="w-4 h-4" /> },
    { href: "/legal/risk-disclosure", label: "Risk Disclosure", icon: <AlertTriangle className="w-4 h-4" /> },
    { href: "/legal/cookies", label: "Cookie Policy", icon: <Cookie className="w-4 h-4" /> },
    { href: "/legal/security", label: "Security Policy", icon: <Lock className="w-4 h-4" /> },
  ]

  return (
    <div className="flex-1 flex flex-col min-h-[calc(100vh-64px)] bg-background">
      <div className="border-b border-border bg-card/50">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-8">
          <h1 className="text-3xl font-display font-bold text-foreground">Legal & Compliance</h1>
          <p className="text-muted-foreground mt-2">Important information regarding your use of ETHSLTD.</p>
        </div>
      </div>
      
      <div className="max-w-[1280px] w-full mx-auto px-4 md:px-8 py-8 flex-1 flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 shrink-0">
          <nav className="flex flex-col gap-1 sticky top-24">
            {sidebarLinks.map((link) => (
              <Link 
                key={link.href}
                href={link.href}
                className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
          </nav>
        </aside>
        
        <main className="flex-1 min-w-0">
          <div className="bg-card border border-border rounded-xl p-6 md:p-8 min-h-[500px]">
            <div className="bg-brand-500/10 border border-brand-500/20 p-4 rounded-lg mb-8">
              <p className="text-sm text-brand-200">
                <strong>Disclaimer:</strong> This content is for demonstrative purposes within the simulated trading environment. These documents should not be construed as legally binding agreements for a real-world financial institution until approved by appropriate legal counsel.
              </p>
            </div>
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
