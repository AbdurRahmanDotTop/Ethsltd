"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Search, Loader2, Code, ShieldAlert, Activity, AlertTriangle, KeyRound } from "lucide-react";
import { MockApiKeyProvider } from "@/lib/providers/mock-api-key-provider";
import { ApiKey } from "@/lib/api/types";
import { Button } from "@/components/ui/button";

export default function AdminApiDashboard() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [revokingId, setRevokingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchKeys = async () => {
      try {
        // We use 'ADMIN' to fetch all keys across the platform in the mock provider
        const data = await MockApiKeyProvider.getKeys("ADMIN");
        setKeys(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchKeys();
  }, []);

  const handleRevoke = async (id: string) => {
    setRevokingId(id);
    try {
      await MockApiKeyProvider.revokeKey(id);
      setKeys(keys.map(k => k.id === id ? { ...k, status: "REVOKED" } : k));
    } finally {
      setRevokingId(null);
    }
  };

  const filteredKeys = keys.filter(k => 
    k.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    k.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    k.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeKeysCount = keys.filter(k => k.status === "ACTIVE").length;
  const liveKeysCount = keys.filter(k => k.environment === "LIVE" && k.status === "ACTIVE").length;
  const withdrawalKeysCount = keys.filter(k => k.permissions.includes("WITHDRAW") && k.status === "ACTIVE").length;

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">API Platform Management</h1>
        <p className="text-muted-foreground mt-1">Monitor API usage, manage global keys, and revoke compromised credentials.</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div className="bg-card border border-border p-5 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-y-4">
            <span className="text-sm font-medium text-muted-foreground">Active Keys</span>
            <KeyRound className="w-4 h-4 text-brand-primary" />
          </div>
          <div className="text-2xl font-bold">{activeKeysCount}</div>
        </div>
        <div className="bg-card border border-border p-5 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-y-4">
            <span className="text-sm font-medium text-muted-foreground">Live Keys</span>
            <Activity className="w-4 h-4 text-green-500" />
          </div>
          <div className="text-2xl font-bold text-green-600 dark:text-green-500">{liveKeysCount}</div>
        </div>
        <div className="bg-card border border-border p-5 rounded-xl shadow-sm border-red-500/20">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-y-4">
            <span className="text-sm font-medium text-red-600 dark:text-red-500">Withdrawal Keys</span>
            <AlertTriangle className="w-4 h-4 text-red-500" />
          </div>
          <div className="text-2xl font-bold text-red-600 dark:text-red-500">{withdrawalKeysCount}</div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search by API Key, Name, or User ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-6 py-4 font-semibold">API Key ID</th>
                  <th className="px-6 py-4 font-semibold">User ID</th>
                  <th className="px-6 py-4 font-semibold">Name</th>
                  <th className="px-6 py-4 font-semibold">Env</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Permissions</th>
                  <th className="px-6 py-4 font-semibold">Created</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredKeys.map((k) => (
                  <tr key={k.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs">{k.id}</td>
                    <td className="px-6 py-4 font-mono text-xs text-muted-foreground">{k.userId}</td>
                    <td className="px-6 py-4 font-medium">{k.name}</td>
                    <td className="px-6 py-4">
                      {k.environment === "LIVE" ? (
                        <span className="text-[10px] px-1.5 py-0.5 rounded font-medium bg-green-500/10 text-green-600">LIVE</span>
                      ) : (
                        <span className="text-[10px] px-1.5 py-0.5 rounded font-medium bg-amber-500/10 text-amber-600">TEST</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {k.status === "ACTIVE" ? (
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-green-500/10 text-green-600">ACTIVE</span>
                      ) : (
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-red-500/10 text-red-600">REVOKED</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1 max-w-[150px]">
                        {k.permissions.map(p => (
                          <span key={p} className={`text-[9px] px-1.5 py-0.5 rounded ${
                            p === 'WITHDRAW' ? 'bg-red-500/10 text-red-600' : 'bg-muted'
                          }`}>
                            {p}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground text-xs">{format(new Date(k.createdAt), "MMM d, yyyy")}</td>
                    <td className="px-6 py-4 text-right">
                      {k.status === "ACTIVE" && (
                        <Button 
                          variant="destructive" 
                          size="sm"
                          disabled={revokingId === k.id}
                          onClick={() => {
                            if (window.confirm("WARNING: Revoking this API key will instantly break any connected external integrations. Proceed?")) {
                              handleRevoke(k.id);
                            }
                          }}
                        >
                          {revokingId === k.id ? <Loader2 className="w-4 h-4 animate-spin" /> : "Revoke"}
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
