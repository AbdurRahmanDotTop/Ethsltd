"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Copy, Plus, AlertCircle, Loader2, KeyRound, ShieldAlert, ArrowLeft } from "lucide-react";
import { useApiStore } from "@/stores/api-store";
import { useAuthStore } from "@/stores/auth-store";
import { Button } from "@/components/ui/button";
import { ApiPermission, ApiEnvironment, CreateApiKeyResponse } from "@/lib/api/types";

export default function ApiKeysPage() {
  const { user } = useAuthStore();
  const { keys, isLoadingKeys, fetchKeys, createKey, revokeKey } = useApiStore();
  
  const [isCreating, setIsCreating] = useState(false);
  const [newKeyResult, setNewKeyResult] = useState<CreateApiKeyResponse | null>(null);
  
  const [name, setName] = useState("");
  const [env, setEnv] = useState<ApiEnvironment>("LIVE");
  const [permissions, setPermissions] = useState<ApiPermission[]>(["READ"]);
  const [ipRestrictions, setIpRestrictions] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [revokingId, setRevokingId] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      fetchKeys(user.id);
    }
  }, [user, fetchKeys]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id || !name.trim()) return;

    setIsSubmitting(true);
    try {
      const ips = ipRestrictions.split(",").map(ip => ip.trim()).filter(Boolean);
      const result = await createKey(user.id, {
        name,
        environment: env,
        permissions,
        ipRestrictions: ips,
      });
      setNewKeyResult(result);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRevoke = async (id: string) => {
    setRevokingId(id);
    try {
      await revokeKey(id);
    } finally {
      setRevokingId(null);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (newKeyResult) {
    return (
      <div className="max-w-3xl space-y-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-2">API Key Created</h1>
          <p className="text-muted-foreground">Store your secret securely. It will not be shown again.</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-8 shadow-sm">
          <div className="bg-amber-500/10 text-amber-800 dark:text-amber-400 p-4 rounded-lg flex gap-3 items-start mb-6">
            <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-sm">Security Warning</h4>
              <p className="text-sm mt-1">Never share your API secret. ETHSLTD staff will never ask for it. Do not embed it in frontend applications.</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium text-muted-foreground">API Key</label>
              <div className="flex mt-1">
                <div className="flex-1 px-4 py-2.5 bg-muted rounded-l-lg font-mono text-sm border border-r-0 border-border truncate">
                  {newKeyResult.key.id}
                </div>
                <button 
                  onClick={() => copyToClipboard(newKeyResult.key.id)}
                  className="px-4 py-2.5 bg-background border border-border rounded-r-lg hover:bg-muted transition-colors"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">API Secret</label>
              <div className="flex mt-1">
                <div className="flex-1 px-4 py-2.5 bg-muted rounded-l-lg font-mono text-sm border border-r-0 border-border truncate text-brand-primary font-bold">
                  {newKeyResult.secret}
                </div>
                <button 
                  onClick={() => copyToClipboard(newKeyResult.secret)}
                  className="px-4 py-2.5 bg-background border border-border rounded-r-lg hover:bg-muted transition-colors"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-border flex justify-end">
              <Button onClick={() => {
                setNewKeyResult(null);
                setIsCreating(false);
                setName("");
              }}>Done</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isCreating) {
    return (
      <div className="max-w-3xl space-y-8">
        <button 
          onClick={() => setIsCreating(false)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to API Keys
        </button>

        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-2">Create API Key</h1>
          <p className="text-muted-foreground">Generate a new set of credentials for programmatic access.</p>
        </div>

        <form onSubmit={handleCreate} className="bg-card border border-border rounded-xl p-6 md:p-8 shadow-sm space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Key Name</label>
            <input 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Trading Bot Alpha"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Environment</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  checked={env === "LIVE"} 
                  onChange={() => setEnv("LIVE")} 
                  className="text-brand-primary focus:ring-brand-primary border-input"
                />
                <span className="text-sm">Live (Production)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  checked={env === "TEST"} 
                  onChange={() => setEnv("TEST")} 
                  className="text-brand-primary focus:ring-brand-primary border-input"
                />
                <span className="text-sm">Test (Sandbox)</span>
              </label>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium">Permissions</label>
            <div className="space-y-2 border border-border p-4 rounded-lg bg-muted/10">
              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={permissions.includes("READ")}
                  disabled
                  className="rounded border-input text-brand-primary opacity-50"
                />
                <div>
                  <div className="text-sm font-medium">Read Data (Required)</div>
                  <div className="text-xs text-muted-foreground">Access market data, balances, and history.</div>
                </div>
              </label>
              
              <label className="flex items-center gap-3 cursor-pointer mt-4">
                <input 
                  type="checkbox" 
                  checked={permissions.includes("TRADE")}
                  onChange={(e) => setPermissions(e.target.checked ? [...permissions, "TRADE"] : permissions.filter(p => p !== "TRADE"))}
                  className="rounded border-input text-brand-primary"
                />
                <div>
                  <div className="text-sm font-medium">Enable Trading</div>
                  <div className="text-xs text-muted-foreground">Place and cancel orders.</div>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer mt-4">
                <input 
                  type="checkbox" 
                  checked={permissions.includes("WITHDRAW")}
                  onChange={(e) => setPermissions(e.target.checked ? [...permissions, "WITHDRAW"] : permissions.filter(p => p !== "WITHDRAW"))}
                  className="rounded border-input text-red-500 focus:ring-red-500"
                />
                <div>
                  <div className="text-sm font-medium text-red-600 dark:text-red-500">Enable Withdrawals</div>
                  <div className="text-xs text-muted-foreground">Move funds out of the account. High risk!</div>
                </div>
              </label>
            </div>
            {permissions.includes("WITHDRAW") && (
              <div className="text-xs text-red-600 bg-red-500/10 p-2 rounded flex gap-2 items-start">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Withdrawal API access should only be enabled when absolutely necessary.</span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">IP Restrictions (Optional)</label>
            <input 
              value={ipRestrictions}
              onChange={(e) => setIpRestrictions(e.target.value)}
              placeholder="e.g. 192.168.1.1, 203.0.113.0/24"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
            />
            <p className="text-xs text-muted-foreground">Comma-separated list of allowed IP addresses.</p>
          </div>

          <div className="pt-4 border-t border-border flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setIsCreating(false)}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Create API Key
            </Button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-5xl space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-2">API Keys</h1>
          <p className="text-muted-foreground">Manage credentials for API access.</p>
        </div>
        <Button onClick={() => setIsCreating(true)} className="gap-2">
          <Plus className="w-4 h-4" /> Create API Key
        </Button>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        {isLoadingKeys ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : keys.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <KeyRound className="w-8 h-8 text-muted-foreground/50" />
            </div>
            <h3 className="text-lg font-semibold">No API keys yet</h3>
            <p className="text-muted-foreground mt-1 mb-6">Create your first API key to start connecting applications to ETHSLTD.</p>
            <Button onClick={() => setIsCreating(true)} variant="outline">Create API Key</Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-6 py-4 font-semibold">Name / ID</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Permissions</th>
                  <th className="px-6 py-4 font-semibold">Last Used</th>
                  <th className="px-6 py-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {keys.map((k) => (
                  <tr key={k.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium">{k.name}</div>
                      <div className="text-xs text-muted-foreground font-mono mt-1">{k.id.substring(0, 15)}...</div>
                    </td>
                    <td className="px-6 py-4">
                      {k.status === "ACTIVE" ? (
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-green-500/10 text-green-600">Active</span>
                      ) : (
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-red-500/10 text-red-600">Revoked</span>
                      )}
                      {k.environment === "TEST" && (
                        <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full font-medium bg-amber-500/10 text-amber-600">Test</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {k.permissions.map(p => (
                          <span key={p} className="text-[10px] bg-muted px-1.5 py-0.5 rounded">{p}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground text-xs">
                      {k.lastUsedAt ? format(new Date(k.lastUsedAt), "MMM d, HH:mm") : "Never"}
                    </td>
                    <td className="px-6 py-4">
                      {k.status === "ACTIVE" && (
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          className="h-8"
                          disabled={revokingId === k.id}
                          onClick={() => {
                            if (window.confirm("Are you sure you want to revoke this API key? All simulated API requests using that key must fail.")) {
                              handleRevoke(k.id);
                            }
                          }}
                        >
                          {revokingId === k.id ? <Loader2 className="w-3 h-3 animate-spin" /> : "Revoke"}
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
