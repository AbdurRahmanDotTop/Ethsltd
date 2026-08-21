"use client";

import { useState } from "react";
import { Server, Database, Globe, RefreshCw, Trash2, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { clearNextjsCache } from "./actions";
import { apiClient } from "@ethsltd/api-client";

export default function AdminCachePage() {
  const [isClearingApp, setIsClearingApp] = useState(false);
  const [isClearingApi, setIsClearingApi] = useState(false);
  const [isClearingAll, setIsClearingAll] = useState(false);

  const handleClearAppCache = async () => {
    if (!window.confirm("Are you sure you want to clear the Application Cache? This will force Next.js to re-render all pages from fresh data.")) return;
    setIsClearingApp(true);
    try {
      const res = await clearNextjsCache();
      if (res.success) {
        toast.success("Application Cache (Next.js) cleared successfully.");
      } else {
        toast.error(res.error || "Failed to clear app cache");
      }
    } catch (e: any) {
      toast.error(e.message || "An error occurred");
    } finally {
      setIsClearingApp(false);
    }
  };

  const handleClearApiCache = async () => {
    if (!window.confirm("Are you sure you want to clear the API/Backend Cache? This will purge D1 queries and KV store caches.")) return;
    setIsClearingApi(true);
    try {
      // Assuming you have an admin endpoint in apiClient, or direct fetch
      const res = await apiClient.adminClearSystemCache();
      if (res.success) {
        toast.success("API Cache cleared successfully.");
      } else {
        toast.error(res.error || "Failed to clear API cache");
      }
    } catch (e: any) {
      toast.error(e.message || "An error occurred");
    } finally {
      setIsClearingApi(false);
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm("WARNING: Are you sure you want to purge ALL managed caches globally? This may temporarily increase server load.")) return;
    setIsClearingAll(true);
    try {
      await clearNextjsCache();
      await apiClient.adminClearSystemCache();
      toast.success("All global caches purged successfully.");
    } catch (e: any) {
      toast.error(e.message || "An error occurred while clearing caches");
    } finally {
      setIsClearingAll(false);
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Global Cache Management</h1>
          <p className="text-muted-foreground mt-1 text-sm">Purge application, backend, and edge caches securely to force content updates.</p>
        </div>
      </div>

      <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-xl flex gap-3 text-yellow-600 dark:text-yellow-500">
        <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="font-semibold">Notice regarding Cache Invalidation</p>
          <p className="mt-1">
            Clearing caches will temporarily increase database load as pages and queries are freshly regenerated. 
            Note that browser caches (client-side) cannot be forcefully deleted, but clearing these server-side layers ensures users receive the latest versioned assets on their next navigation.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Application Cache */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 bg-blue-500/10 text-blue-500 rounded-lg flex items-center justify-center mb-4">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold">Application Cache</h3>
            <p className="text-sm text-muted-foreground mt-2 mb-6">
              Clears the Next.js Data Cache and Full Route Cache. Use this when UI elements, translations, or layouts are not updating.
            </p>
          </div>
          <Button 
            onClick={handleClearAppCache} 
            disabled={isClearingApp || isClearingAll}
            variant="outline"
            className="w-full justify-center"
          >
            {isClearingApp ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Trash2 className="w-4 h-4 mr-2" />}
            Purge App Cache
          </Button>
        </div>

        {/* API Cache */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 bg-purple-500/10 text-purple-500 rounded-lg flex items-center justify-center mb-4">
              <Database className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold">API / Database Cache</h3>
            <p className="text-sm text-muted-foreground mt-2 mb-6">
              Clears the backend Cloudflare Worker caches, KV store caches, and temporary query stores for settings and global rates.
            </p>
          </div>
          <Button 
            onClick={handleClearApiCache} 
            disabled={isClearingApi || isClearingAll}
            variant="outline"
            className="w-full justify-center"
          >
            {isClearingApi ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Trash2 className="w-4 h-4 mr-2" />}
            Purge API Cache
          </Button>
        </div>

        {/* Global Purge */}
        <div className="bg-card border-red-500/20 bg-red-500/5 rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 bg-red-500/10 text-red-500 rounded-lg flex items-center justify-center mb-4">
              <Server className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-red-600 dark:text-red-500">Global Purge</h3>
            <p className="text-sm text-muted-foreground mt-2 mb-6">
              Force clears <strong>ALL</strong> managed caches (App + API + Edge rules). This is a destructive action that will cause a temporary traffic spike to the database.
            </p>
          </div>
          <Button 
            onClick={handleClearAll} 
            disabled={isClearingAll || isClearingApp || isClearingApi}
            variant="destructive"
            className="w-full justify-center bg-red-600 hover:bg-red-700 text-white"
          >
            {isClearingAll ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Trash2 className="w-4 h-4 mr-2" />}
            Clear All Caches
          </Button>
        </div>
      </div>
    </div>
  );
}
