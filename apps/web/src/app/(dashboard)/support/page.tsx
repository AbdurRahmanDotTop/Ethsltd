"use client";

import Link from "next/link";
import { Search, MessageSquare, Ticket, FileText, ChevronRight, HelpCircle, Shield, Wallet, ArrowRightLeft } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const categories = [
  { id: "account", name: "Account & Security", icon: Shield, desc: "2FA, passwords, KYC, and account recovery." },
  { id: "trading", name: "Trading", icon: ArrowRightLeft, desc: "Order execution, fees, and market data." },
  { id: "wallet", name: "Wallet & Transfers", icon: Wallet, desc: "Deposits, withdrawals, and crypto networks." },
  { id: "p2p", name: "P2P Marketplace", icon: Users, desc: "Buying/selling, payments, and disputes." },
];

function Users(props: any) {
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
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

const popularArticles = [
  "How do I secure my ETHSLTD account?",
  "How do I withdraw crypto?",
  "Why is my withdrawal pending?",
  "How do I contact support?",
];

export default function SupportPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 max-w-[1280px] w-full mx-auto px-4 md:px-8 py-8 md:py-12">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Support Center</h1>
        <p className="text-lg text-muted-foreground mb-8">
          How can we help you today?
        </p>
        
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search Help Center (e.g., 'withdrawal pending')"
            className="w-full h-14 pl-12 pr-4 rounded-xl border border-border bg-card shadow-sm text-lg focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-16">
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary mb-4">
            <Ticket className="w-6 h-6" />
          </div>
          <h3 className="font-semibold text-lg mb-2">My Tickets</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Check the status of your existing support requests.
          </p>
          <Link 
            href="/support/tickets" 
            className="mt-auto text-brand-primary font-medium hover:underline inline-flex items-center gap-1"
          >
            View Tickets <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary mb-4">
            <MessageSquare className="w-6 h-6" />
          </div>
          <h3 className="font-semibold text-lg mb-2">Create Ticket</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Need help? Submit a request to our support team.
          </p>
          <Link 
            href="/support/tickets" 
            className="mt-auto text-brand-primary font-medium hover:underline inline-flex items-center gap-1"
          >
            Submit Request <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 mb-4">
            <HelpCircle className="w-6 h-6" />
          </div>
          <h3 className="font-semibold text-lg mb-2">Live Chat</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Get instant help from our automated assistant or live agents.
          </p>
          <button 
            onClick={() => {
              // Integrate with Tawk.to via window.Tawk_API if present
              if (typeof window !== "undefined" && (window as any).Tawk_API) {
                (window as any).Tawk_API.toggle();
              } else {
                alert("Live chat is initializing. Please try again in a moment.");
              }
            }}
            className="mt-auto text-blue-500 font-medium hover:underline inline-flex items-center gap-1"
          >
            Start Chat <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold">Popular Topics</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {categories.map((cat) => (
              <div key={cat.id} className="group border border-border rounded-xl p-5 hover:border-brand-primary/50 hover:shadow-md transition-all cursor-pointer bg-card">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-foreground group-hover:bg-brand-primary/10 group-hover:text-brand-primary transition-colors">
                    <cat.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{cat.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{cat.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-6">Frequently Asked</h2>
          <div className="space-y-3">
            {popularArticles.map((title, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer group transition-colors">
                <FileText className="w-5 h-5 text-muted-foreground group-hover:text-brand-primary transition-colors" />
                <span className="text-sm font-medium text-foreground/80 group-hover:text-foreground transition-colors">{title}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
