"use client";

import { useEffect } from "react";
import { Loader2, Activity, Zap, XCircle, AlertTriangle, ShieldCheck } from "lucide-react";
import { useApiStore } from "@/stores/api-store";
import { useAuthStore } from "@/stores/auth-store";

export default function ApiUsagePage() {
  const { user } = useAuthStore();
  const { usage, isLoadingUsage, fetchUsage } = useApiStore();

  useEffect(() => {
    if (user?.id) {
      fetchUsage(user.id);
    }
  }, [user, fetchUsage]);

  // Generate mock usage data for the last 24 hours
  const mockData = Array.from({ length: 24 }).map((_, i) => Math.floor(Math.random() * 100) + 20);
  const maxVal = Math.max(...mockData);

  return (
    <div className="max-w-5xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight mb-2">API Usage</h1>
        <p className="text-muted-foreground">Monitor your API consumption, rate limits, and errors.</p>
      </div>

      {isLoadingUsage || !usage ? (
        <div className="flex items-center justify-center p-12 bg-card border border-border rounded-xl">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          {/* Metrics Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-card border border-border p-5 rounded-xl shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-muted-foreground">Requests (Today)</span>
                <Activity className="w-4 h-4 text-brand-primary" />
              </div>
              <div className="text-2xl font-bold">{usage.requestsToday.toLocaleString()}</div>
            </div>

            <div className="bg-card border border-border p-5 rounded-xl shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-muted-foreground">Successful</span>
                <ShieldCheck className="w-4 h-4 text-green-500" />
              </div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-500">{usage.successfulRequests.toLocaleString()}</div>
            </div>

            <div className="bg-card border border-border p-5 rounded-xl shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-muted-foreground">Failed</span>
                <XCircle className="w-4 h-4 text-red-500" />
              </div>
              <div className="text-2xl font-bold text-red-600 dark:text-red-500">{usage.failedRequests.toLocaleString()}</div>
            </div>

            <div className="bg-card border border-border p-5 rounded-xl shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-muted-foreground">Rate Limited</span>
                <AlertTriangle className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-2xl font-bold text-amber-600 dark:text-amber-500">{usage.rateLimitedRequests.toLocaleString()}</div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5 shadow-sm">
              <h3 className="font-semibold mb-6">API Requests (Last 24h)</h3>
              <div className="w-full h-[300px] flex items-end gap-1 px-2 border-b border-l border-border relative">
                {mockData.map((val, i) => (
                  <div key={i} className="flex-1 bg-brand-primary/80 hover:bg-brand-primary transition-colors rounded-t-sm" style={{ height: `${(val / maxVal) * 100}%` }} title={`${val} requests`} />
                ))}
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-2 px-2">
                <span>24h ago</span>
                <span>Now</span>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-6">
              <h3 className="font-semibold">Current Rate Limits</h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Public REST</span>
                    <span className="font-mono">60/min</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-brand-primary/50 w-[15%]"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Authenticated REST</span>
                    <span className="font-mono">120/min</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-brand-primary/50 w-[5%]"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Trading</span>
                    <span className="font-mono">30/min</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-brand-primary w-0"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">WebSocket</span>
                    <span className="font-mono">{usage.activeWebsockets}/10 conn</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 w-[20%]"></div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border mt-6">
                <p className="text-xs text-muted-foreground text-center">
                  These are simulation values only until the real backend defines official limits.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
