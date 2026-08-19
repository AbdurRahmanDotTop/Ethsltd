"use client";

import { useState } from "react";
import { Play, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PlaygroundPage() {
  const [method, setMethod] = useState("GET");
  const [endpoint, setEndpoint] = useState("/api/v1/ticker/BTC-USD");
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [status, setStatus] = useState<number | null>(null);
  const [time, setTime] = useState<number | null>(null);

  const handleSend = async () => {
    setIsLoading(true);
    setResponse(null);
    setStatus(null);
    setTime(null);
    
    const start = Date.now();
    
    // Simulate API request latency
    await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 400));
    
    // Mock responses based on endpoint
    if (endpoint.includes("ticker")) {
      setStatus(200);
      setResponse(JSON.stringify({
        success: true,
        data: {
          symbol: "BTC/USD",
          price: "104250.00",
          change24h: "2.14",
          volume24h: "1250000000"
        }
      }, null, 2));
    } else if (endpoint.includes("orderbook")) {
      setStatus(200);
      setResponse(JSON.stringify({
        symbol: "BTC/USD",
        bids: [[104245, 0.5], [104240, 1.2]],
        asks: [[104255, 0.3], [104260, 2.1]],
        timestamp: Date.now()
      }, null, 2));
    } else {
      setStatus(404);
      setResponse(JSON.stringify({
        success: false,
        error: {
          code: "NOT_FOUND",
          message: "Endpoint not found"
        }
      }, null, 2));
    }
    
    setTime(Date.now() - start);
    setIsLoading(false);
  };

  return (
    <div className="p-6 md:p-10 lg:p-12 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">API Playground</h1>
        <p className="text-muted-foreground">Test endpoints interactively with mock data.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Request Panel */}
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-border font-semibold">Request Configuration</div>
            <div className="p-6 space-y-6">
              
              <div className="flex gap-2">
                <select 
                  value={method}
                  onChange={e => setMethod(e.target.value)}
                  className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm font-mono font-bold text-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
                >
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="DELETE">DELETE</option>
                </select>
                <input 
                  value={endpoint}
                  onChange={e => setEndpoint(e.target.value)}
                  placeholder="/api/v1/..."
                  className="flex-1 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Headers</label>
                <div className="bg-muted/50 rounded-lg p-3 text-sm font-mono text-muted-foreground">
                  <div>Content-Type: application/json</div>
                  <div>X-API-KEY: {"<your_api_key>"}</div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Parameters (Query)</label>
                <div className="text-sm text-muted-foreground mb-2">No parameters for this endpoint.</div>
              </div>
            </div>
            <div className="p-4 border-t border-border bg-muted/10 flex justify-end">
              <Button onClick={handleSend} disabled={isLoading} className="gap-2">
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                Send Request
              </Button>
            </div>
          </div>
        </div>

        {/* Response Panel */}
        <div>
          <div className="bg-[#0d1117] rounded-xl overflow-hidden shadow-sm h-full min-h-[400px] flex flex-col">
            <div className="p-4 border-b border-[#30363d] flex items-center justify-between flex-wrap gap-y-4">
              <span className="font-semibold text-white">Response</span>
              
              <div className="flex items-center gap-4 text-xs font-mono">
                {status && (
                  <span className={status === 200 ? "text-green-400" : "text-red-400"}>
                    Status: {status}
                  </span>
                )}
                {time && <span className="text-gray-400">Time: {time}ms</span>}
                <button 
                  onClick={() => { setResponse(null); setStatus(null); setTime(null); }}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
              ) : response ? (
                <pre className="text-sm font-mono text-[#79c0ff]">
                  {response}
                </pre>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-500 text-sm">
                  <p>Hit "Send Request" to see the simulated response.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
