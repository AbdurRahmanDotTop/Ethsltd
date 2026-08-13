import Link from "next/link";
import { BookOpen, Terminal, KeyRound, ArrowRight, ShieldCheck, Zap, Code2, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DevelopersPage() {
  return (
    <div className="py-12 md:py-20 px-4 md:px-12 max-w-6xl mx-auto">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto mb-20">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-sm font-medium mb-6">
          <Code2 className="w-4 h-4" /> ETHSLTD API v1
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Build with ETHSLTD</h1>
        <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
          Connect applications, trading systems and market-data tools to ETHSLTD through secure REST APIs and real-time WebSocket infrastructure.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/developers/docs">Read the API Docs</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
            <Link href="/account/api-keys">Create API Key</Link>
          </Button>
          <Button asChild variant="ghost" size="lg" className="w-full sm:w-auto gap-2">
            <Link href="/developers/playground"><Terminal className="w-4 h-4" /> Try Playground</Link>
          </Button>
        </div>
      </div>

      {/* Why ETHSLTD API */}
      <div className="grid md:grid-cols-3 gap-6 mb-20">
        <div className="bg-card border border-border p-6 rounded-2xl shadow-sm">
          <div className="w-12 h-12 bg-blue-500/10 text-blue-500 rounded-xl flex items-center justify-center mb-6">
            <Zap className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold mb-3">Real-time WebSocket</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Subscribe to live order books, trades, and ticker updates with millisecond latency using our robust WebSocket channels.
          </p>
        </div>

        <div className="bg-card border border-border p-6 rounded-2xl shadow-sm">
          <div className="w-12 h-12 bg-brand-primary/10 text-brand-primary rounded-xl flex items-center justify-center mb-6">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold mb-3">Secure Authentication</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Granular API permissions, IP restriction support, and cryptographic request signing ensure your funds and data stay secure.
          </p>
        </div>

        <div className="bg-card border border-border p-6 rounded-2xl shadow-sm">
          <div className="w-12 h-12 bg-amber-500/10 text-amber-500 rounded-xl flex items-center justify-center mb-6">
            <Layers className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold mb-3">Comprehensive Tooling</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Predictable JSON schemas, interactive API playgrounds, and detailed code examples in multiple languages speed up integration.
          </p>
        </div>
      </div>

      {/* Quick Start */}
      <div className="bg-muted/30 border border-border rounded-3xl p-8 md:p-12 mb-20">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">Quick Start</h2>
          <p className="text-muted-foreground">Get your trading bot or application connected in four simple steps.</p>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          <div className="hidden lg:block absolute top-6 left-[12%] right-[12%] h-[2px] bg-border z-0" />
          
          <div className="relative z-10 bg-card border border-border rounded-xl p-6 text-center shadow-sm">
            <div className="w-10 h-10 mx-auto bg-brand-primary text-brand-foreground rounded-full flex items-center justify-center font-bold mb-4">1</div>
            <h4 className="font-semibold mb-2">Create Account</h4>
            <p className="text-xs text-muted-foreground">Sign up and verify your identity.</p>
          </div>
          
          <div className="relative z-10 bg-card border border-border rounded-xl p-6 text-center shadow-sm">
            <div className="w-10 h-10 mx-auto bg-brand-primary text-brand-foreground rounded-full flex items-center justify-center font-bold mb-4">2</div>
            <h4 className="font-semibold mb-2">Create API Key</h4>
            <p className="text-xs text-muted-foreground">Generate keys from your dashboard.</p>
          </div>
          
          <div className="relative z-10 bg-card border border-border rounded-xl p-6 text-center shadow-sm">
            <div className="w-10 h-10 mx-auto bg-brand-primary text-brand-foreground rounded-full flex items-center justify-center font-bold mb-4">3</div>
            <h4 className="font-semibold mb-2">Sign Requests</h4>
            <p className="text-xs text-muted-foreground">Authenticate your API calls.</p>
          </div>
          
          <div className="relative z-10 bg-card border border-border rounded-xl p-6 text-center shadow-sm">
            <div className="w-10 h-10 mx-auto bg-brand-primary text-brand-foreground rounded-full flex items-center justify-center font-bold mb-4">4</div>
            <h4 className="font-semibold mb-2">Start Building</h4>
            <p className="text-xs text-muted-foreground">Execute trades and pull data.</p>
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <Button asChild>
            <Link href="/developers/docs" className="gap-2">
              Explore Documentation <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
