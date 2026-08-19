"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export default function DocsPage() {
  const [activeTab, setActiveTab] = useState("market");
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sections = [
    { id: "intro", title: "Introduction" },
    { id: "auth", title: "Authentication" },
    { id: "market", title: "Market Data" },
    { id: "trading", title: "Trading" },
    { id: "account", title: "Account & Wallet" },
    { id: "ws", title: "WebSocket" },
  ];

  return (
    <div className="flex h-full">
      {/* Table of Contents - Hidden on small screens, can be improved with a mobile drawer later */}
      <div className="hidden lg:block w-64 shrink-0 border-r border-border bg-muted/10 p-6 overflow-y-auto">
        <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-4">API Reference</h3>
        <nav className="space-y-1">
          {sections.map(s => (
            <button
              key={s.id}
              onClick={() => setActiveTab(s.id)}
              className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                activeTab === s.id ? "bg-brand-primary/10 text-brand-primary font-medium" : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {s.title}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Documentation Content */}
      <div className="flex-1 flex flex-col xl:flex-row min-w-0">
        <div className="flex-1 p-6 md:p-10 lg:p-12 overflow-y-auto">
          {activeTab === "market" && (
            <div className="max-w-3xl">
              <h1 className="text-3xl font-bold tracking-tight mb-4">Market Data API</h1>
              <p className="text-lg text-muted-foreground mb-10">Access real-time price data, order books, and candlestick (k-line) charts for all supported trading pairs.</p>

              <div className="space-y-12">
                <section>
                  <h2 className="text-2xl font-bold mb-4">Get Ticker</h2>
                  <p className="text-muted-foreground mb-6">Retrieve the latest price and 24-hour statistics for a specific trading pair.</p>
                  
                  <div className="bg-card border border-border rounded-xl overflow-hidden mb-6">
                    <div className="bg-muted px-4 py-3 border-b border-border flex items-center gap-3">
                      <span className="font-mono text-xs font-bold text-blue-500 bg-blue-500/10 px-2 py-1 rounded">GET</span>
                      <span className="font-mono text-sm">/api/v1/ticker/&#123;symbol&#125;</span>
                    </div>
                    <div className="p-4">
                      <h4 className="text-sm font-semibold mb-3">Path Parameters</h4>
                      <table className="w-full text-sm text-left">
                        <thead className="bg-muted/50">
                          <tr>
                            <th className="px-3 py-2 font-medium">Name</th>
                            <th className="px-3 py-2 font-medium">Type</th>
                            <th className="px-3 py-2 font-medium">Description</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          <tr>
                            <td className="px-3 py-3 font-mono text-xs">symbol</td>
                            <td className="px-3 py-3 text-muted-foreground">string</td>
                            <td className="px-3 py-3">Trading pair symbol, e.g., <code className="bg-muted px-1 py-0.5 rounded text-brand-primary">BTC-USD</code></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </section>
                
                {/* Other endpoints can be added here */}
              </div>
            </div>
          )}

          {activeTab === "intro" && (
            <div className="max-w-3xl">
              <h1 className="text-3xl font-bold tracking-tight mb-4">ETHSLTD API Documentation</h1>
              <p className="text-lg text-muted-foreground mb-6">Welcome to the official developer documentation for the ETHSLTD Crypto platform.</p>
              
              <h2 className="text-2xl font-bold mt-10 mb-4">Base URL</h2>
              <div className="bg-card border border-border rounded-xl p-4 font-mono text-sm mb-6">
                https://api.ethsltd.com/api/v1
              </div>
              
              <h2 className="text-2xl font-bold mt-10 mb-4">Rate Limits</h2>
              <p className="text-muted-foreground mb-4">To ensure platform stability, we enforce the following rate limits:</p>
              <ul className="list-disc pl-5 space-y-2 text-muted-foreground mb-6">
                <li><strong className="text-foreground">Public REST:</strong> 60 requests/minute</li>
                <li><strong className="text-foreground">Authenticated REST:</strong> 120 requests/minute</li>
                <li><strong className="text-foreground">Trading endpoints:</strong> 30 requests/minute</li>
              </ul>
              
              <div className="bg-amber-500/10 text-amber-800 dark:text-amber-400 p-4 rounded-lg text-sm mt-8">
                <strong>Note:</strong> These are example/test limits for the mock environment.
              </div>
            </div>
          )}
          
          {/* Default fallback for other tabs */}
          {activeTab !== "market" && activeTab !== "intro" && (
            <div className="max-w-3xl">
              <h1 className="text-3xl font-bold tracking-tight mb-4 capitalize">{activeTab} API</h1>
              <p className="text-muted-foreground">Detailed documentation for this section is available in the full API reference manual.</p>
            </div>
          )}
        </div>

        {/* Code Example Pane (Desktop Only) */}
        {activeTab === "market" && (
          <div className="hidden xl:block w-[450px] shrink-0 bg-[#0d1117] text-[#c9d1d9] overflow-y-auto border-l border-border">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4 flex-wrap gap-y-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Example Request</span>
                <div className="flex gap-2">
                  <button className="text-xs font-mono bg-white/10 px-2 py-1 rounded">cURL</button>
                  <button className="text-xs font-mono bg-transparent hover:bg-white/5 px-2 py-1 rounded text-muted-foreground">JS</button>
                  <button className="text-xs font-mono bg-transparent hover:bg-white/5 px-2 py-1 rounded text-muted-foreground">Python</button>
                </div>
              </div>
              
              <div className="relative group">
                <pre className="p-4 rounded-xl bg-[#161b22] text-sm font-mono overflow-x-auto">
                  <code className="text-[#a5d6ff]">curl</code> -X GET \<br/>
                  &nbsp;&nbsp;<span className="text-[#7ee787]">"https://api.ethsltd.com/api/v1/ticker/BTC-USD"</span>
                </pre>
                <button 
                  onClick={() => copyToClipboard('curl -X GET "https://api.ethsltd.com/api/v1/ticker/BTC-USD"')}
                  className="absolute top-2 right-2 p-1.5 rounded-md bg-[#21262d] text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#30363d]"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <div className="mt-8 mb-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Example Response</span>
              </div>
              
              <pre className="p-4 rounded-xl bg-[#161b22] text-sm font-mono overflow-x-auto text-[#79c0ff]">
&#123;
  <span className="text-[#a5d6ff]">"success"</span>: <span className="text-[#79c0ff]">true</span>,
  <span className="text-[#a5d6ff]">"data"</span>: &#123;
    <span className="text-[#a5d6ff]">"symbol"</span>: <span className="text-[#a5d6ff]">"BTC/USD"</span>,
    <span className="text-[#a5d6ff]">"price"</span>: <span className="text-[#a5d6ff]">"104250.00"</span>,
    <span className="text-[#a5d6ff]">"bid"</span>: <span className="text-[#a5d6ff]">"104245.00"</span>,
    <span className="text-[#a5d6ff]">"ask"</span>: <span className="text-[#a5d6ff]">"104255.00"</span>,
    <span className="text-[#a5d6ff]">"change24h"</span>: <span className="text-[#a5d6ff]">"2.14"</span>,
    <span className="text-[#a5d6ff]">"volume24h"</span>: <span className="text-[#a5d6ff]">"1250000000"</span>
  &#125;
&#125;
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
