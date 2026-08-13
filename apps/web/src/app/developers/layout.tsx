"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Code, BookOpen, Terminal, Activity, ChevronRight, Menu } from "lucide-react";
import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const navigation = [
  { name: "Overview", href: "/developers", icon: Code },
  { name: "Documentation", href: "/developers/docs", icon: BookOpen },
  { name: "API Playground", href: "/developers/playground", icon: Terminal },
];

const accountNav = [
  { name: "My API Keys", href: "/account/api-keys", icon: KeyRound },
  { name: "My API Usage", href: "/account/api-usage", icon: Activity },
];

function KeyRound(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 18v3c0 .6.4 1 1 1h4v-3h3v-3h2l1.4-1.4a6.5 6.5 0 1 0-4-4Z" />
      <circle cx="16.5" cy="7.5" r=".5" fill="currentColor" />
    </svg>
  );
}

export default function DevelopersLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <div className="flex-1 flex flex-col">
      {/* Mobile Toggle */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-border bg-card">
        <span className="font-semibold text-lg">Developer Portal</span>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 -mr-2 text-muted-foreground hover:text-foreground"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      <div className="flex max-w-[1440px] mx-auto w-full">
        {/* Sidebar */}
        <div className={`
          fixed inset-y-0 left-0 z-40 w-64 bg-card border-r border-border transform transition-transform duration-200 ease-in-out md:static md:translate-x-0
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          flex flex-col h-[calc(100vh-64px)] top-16 md:top-0 md:h-[calc(100vh-64px)]
        `}>
          <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8">
            <div>
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-3">
                Developer Portal
              </div>
              <nav className="space-y-1">
                {navigation.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsSidebarOpen(false)}
                      className={`
                        flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors
                        ${isActive 
                          ? "bg-brand-primary/10 text-brand-primary" 
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        }
                      `}
                    >
                      <item.icon className={`w-5 h-5 mr-3 shrink-0 ${isActive ? "text-brand-primary" : "text-muted-foreground"}`} />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div>
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-3">
                Account Access
              </div>
              <nav className="space-y-1">
                {accountNav.map((item) => {
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="flex items-center px-3 py-2 text-sm font-medium rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    >
                      <item.icon className="w-5 h-5 mr-3 shrink-0 text-muted-foreground" />
                      {item.name}
                      <ChevronRight className="w-4 h-4 ml-auto opacity-50" />
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>

        {/* Backdrop */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 min-w-0 overflow-y-auto">
          {children}
        </main>
      </div>
      </div>
      <Footer />
    </div>
  );
}
