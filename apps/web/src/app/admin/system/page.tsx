"use client";

import { useState, useEffect } from "react";
import { 
  Server, Activity, Cpu, HardDrive, Database, 
  Globe, Mail, ShieldCheck, AlertCircle, RefreshCw, Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";

import { apiClient } from "@ethsltd/api-client";

export default function AdminSystemPage() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [apiLatency, setApiLatency] = useState<number | null>(null);
  const [services, setServices] = useState<any[]>([]);

  const fetchStatus = async () => {
    try {
      const startTime = performance.now();
      const res = await apiClient.getAdminSystemStatus();
      const endTime = performance.now();
      const latency = Math.round(endTime - startTime);
      setApiLatency(latency);
      
      if (res.success && res.data) {
        const updatedServices = (res.data.services || []).map((s: any) => {
          if (s.name.includes("API Edge")) {
            return { ...s, latency: `${latency}ms` };
          }
          return s;
        });
        setServices(updatedServices);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchStatus();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'text-green-500 bg-green-500/10 border-green-500/20';
      case 'degraded': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'down': return 'text-red-500 bg-red-500/10 border-red-500/20';
      default: return 'text-muted-foreground bg-muted border-border';
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">System Status</h1>
          <p className="text-muted-foreground mt-1 text-sm">Monitor platform infrastructure and service health in real-time.</p>
        </div>
        <Button onClick={handleRefresh} disabled={isRefreshing} className="w-full sm:w-auto" variant="outline">
          <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh Metrics
        </Button>
      </div>

      {/* Top KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-sm font-medium text-muted-foreground">Environment</span>
            <div className="p-2 rounded-md bg-green-500/10">
              <ShieldCheck className="w-4 h-4 text-green-500" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold">Production</h3>
            <span className="text-xs text-green-500 font-medium">Cloudflare Edge Network</span>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-sm font-medium text-muted-foreground">Edge API Latency</span>
            <div className="p-2 rounded-md bg-purple-500/10">
              <Clock className="w-4 h-4 text-purple-500" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold">{apiLatency !== null ? `${apiLatency}ms` : '...'}</h3>
            <span className="text-xs text-muted-foreground font-medium">Real-time measurement</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Main Services List */}
        <div className="col-span-1 space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Core Services Health</h3>
          <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
            <div className="divide-y divide-border">
              {services.map((service, idx) => {
                let Icon = Server;
                if (service.name.includes("API")) Icon = Globe;
                if (service.name.includes("Database") || service.name.includes("D1")) Icon = Database;
                
                return (
                  <div key={idx} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors flex-wrap gap-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5 text-foreground" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-foreground">{service.name}</h4>
                        <p className="text-xs text-muted-foreground mt-0.5">Latency: {service.latency || service.ping || 'Measuring...'}</p>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold capitalize border ${getStatusColor(service.status)}`}>
                      {service.status}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
