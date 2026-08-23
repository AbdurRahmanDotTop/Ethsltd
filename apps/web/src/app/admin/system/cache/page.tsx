"use client";

import { useState } from "react";
import { Server, Database, Globe, RefreshCw, Trash2, ShieldAlert, CloudLightning, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { clearNextjsCache } from "./actions";
import { apiClient } from "@ethsltd/api-client";
import Link from "next/link";

export default function AdminCachePage() {
  const [isClearingApp, setIsClearingApp] = useState(false);
  const [isClearingApi, setIsClearingApi] = useState(false);
  const [isClearingDb, setIsClearingDb] = useState(false);
  const [isClearingCdn, setIsClearingCdn] = useState(false);
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

  const handleClearCacheType = async (type: 'api' | 'db' | 'cdn', setLoader: (val: boolean) => void, successMsg: string) => {
    if (!window.confirm(`Are you sure you want to purge the ${type.toUpperCase()} cache?`)) return;
    setLoader(true);
    try {
      const res = await apiClient.adminClearCache(type);
      if (res.success) {
        toast.success(successMsg);
      } else {
        toast.error(res.error || `Failed to clear ${type.toUpperCase()} cache`);
      }
    } catch (e: any) {
      toast.error(e.message || "An error occurred");
    } finally {
      setLoader(false);
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm("WARNING: Are you sure you want to purge ALL managed caches globally? This may temporarily increase server load.")) return;
    setIsClearingAll(true);
    try {
      await clearNextjsCache();
      await apiClient.adminClearCache('api');
      await apiClient.adminClearCache('db');
      await apiClient.adminClearCache('cdn');
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
          <h1 className="text-2xl font-bold tracking-tight">System Maintenance</h1>
          <p className="text-muted-foreground mt-1 text-sm">Manage and purge cache layers across the application stack.</p>
        </div>
      </div>

      <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-xl flex gap-3 text-yellow-600 dark:text-yellow-500">
        <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="font-semibold">Notice regarding Cache Invalidation</p>
          <p className="mt-1">
            Clearing caches will temporarily increase database and server load as pages, queries, and static assets are freshly regenerated. 
            Note that client-side browser caches cannot be forcefully deleted, but clearing these infrastructure caches ensures users receive the latest assets on their next navigation.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        
        {/* CDN Cache */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 bg-orange-500/10 text-orange-500 rounded-lg flex items-center justify-center mb-4">
              <CloudLightning className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold">CDN / Edge Cache (Cloudflare)</h3>
            <p className="text-sm text-muted-foreground mt-2 mb-4">
              Purges all static assets and cached API responses stored across the Cloudflare global edge network. Uses the Cloudflare API to trigger a zone-wide purge.
            </p>
            <Link href="https://dash.cloudflare.com/" target="_blank" className="text-xs text-brand-primary hover:underline flex items-center gap-1 mb-6">
              Manage in Cloudflare Dashboard <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
          <Button 
            onClick={() => handleClearCacheType('cdn', setIsClearingCdn, "CDN Edge Cache purged successfully.")} 
            disabled={isClearingAll}
            isLoading={isClearingCdn}
            loadingText="Purging..."
            variant="outline"
            className="w-full justify-center"
          >
            {!isClearingCdn && <Trash2 className="w-4 h-4 mr-2" />}
            Purge CDN Cache
          </Button>
        </div>

        {/* Application Cache */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 bg-blue-500/10 text-blue-500 rounded-lg flex items-center justify-center mb-4">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold">Frontend Application Cache</h3>
            <p className="text-sm text-muted-foreground mt-2 mb-6">
              Clears the Next.js Data Cache and Full Route Cache. Use this when UI elements, translations, or layouts are not updating.
            </p>
          </div>
          <Button 
            onClick={handleClearAppCache} 
            disabled={isClearingAll}
            isLoading={isClearingApp}
            loadingText="Purging..."
            variant="outline"
            className="w-full justify-center"
          >
            {!isClearingApp && <Trash2 className="w-4 h-4 mr-2" />}
            Purge Next.js Cache
          </Button>
        </div>

        {/* API Cache */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 bg-purple-500/10 text-purple-500 rounded-lg flex items-center justify-center mb-4">
              <Server className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold">API Cache</h3>
            <p className="text-sm text-muted-foreground mt-2 mb-6">
              Clears the backend API caching layers (KV/Memory) for settings, global rates, and temporary responses.
            </p>
          </div>
          <Button 
            onClick={() => handleClearCacheType('api', setIsClearingApi, "API Cache cleared successfully.")} 
            disabled={isClearingAll}
            isLoading={isClearingApi}
            loadingText="Purging..."
            variant="outline"
            className="w-full justify-center"
          >
            {!isClearingApi && <Trash2 className="w-4 h-4 mr-2" />}
            Purge API Cache
          </Button>
        </div>

        {/* DB Cache */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 bg-green-500/10 text-green-500 rounded-lg flex items-center justify-center mb-4">
              <Database className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold">Database Query Cache</h3>
            <p className="text-sm text-muted-foreground mt-2 mb-6">
              Clears application-level query caching (like DataLoaders or KV cached D1 queries). Forces all subsequent requests to read directly from the primary database.
            </p>
          </div>
          <Button 
            onClick={() => handleClearCacheType('db', setIsClearingDb, "Database Query Cache cleared successfully.")} 
            disabled={isClearingAll}
            isLoading={isClearingDb}
            loadingText="Purging..."
            variant="outline"
            className="w-full justify-center"
          >
            {!isClearingDb && <Trash2 className="w-4 h-4 mr-2" />}
            Purge Database Cache
          </Button>
        </div>
      </div>

      {/* Global Purge */}
      <div className="mt-8 bg-card border-red-500/20 bg-red-500/5 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h3 className="text-lg font-bold text-red-600 dark:text-red-500">Global Purge</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Force clears <strong>ALL</strong> managed caches (CDN + Next.js + API + DB). This is a destructive action that will cause a temporary traffic spike to the database.
            </p>
          </div>
          <Button 
            onClick={handleClearAll} 
            disabled={isClearingApp || isClearingApi || isClearingDb || isClearingCdn}
            isLoading={isClearingAll}
            loadingText="Clearing All..."
            variant="destructive"
            className="w-full md:w-auto justify-center bg-red-600 hover:bg-red-700 text-white shrink-0"
          >
            {!isClearingAll && <Trash2 className="w-4 h-4 mr-2" />}
            Clear All Caches
          </Button>
        </div>
      </div>

    </div>
  );
}
