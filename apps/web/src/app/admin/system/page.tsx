"use client";

import { useState, useEffect } from "react";
import { 
  Server, Activity, Cpu, HardDrive, Database, 
  Globe, Mail, ShieldCheck, AlertCircle, RefreshCw, Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";

import { apiClient } from "@ethsltd/api-client";

const RECENT_ALERTS = [
  { id: 1, type: "warning", message: "WebSocket server latency spiked above 100ms.", time: "10 mins ago" },
  { id: 2, type: "info", message: "Daily automated database backup completed successfully.", time: "2 hours ago" },
  { id: 3, type: "error", message: "Failed login attempt threshold reached for IP 192.168.1.55", time: "4 hours ago" },
];

export default function AdminSystemPage() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [metrics, setMetrics] = useState({
    cpu: 42,
    ram: 68,
    disk: 35,
    uptime: "99.99%",
    activeConnections: 1245,
    serverLoad: "1.24"
  });
  
  const [services, setServices] = useState<any[]>([]);

  const fetchStatus = async () => {
    try {
      const res = await apiClient.getAdminSystemStatus();
      if (res.success && res.data) {
        setServices(res.data.services || []);
        if (res.data.metrics) {
          setMetrics({
            cpu: res.data.metrics.cpuUsage || 0,
            ram: res.data.metrics.memoryUsage || 0,
            disk: 35, // mocked backend disk usage for now
            uptime: "99.9%",
            activeConnections: res.data.metrics.activeConnections || 0,
            serverLoad: (res.data.metrics.requestsPerSecond / 100).toFixed(2)
          });
        }
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-sm font-medium text-muted-foreground">System Uptime</span>
            <div className="p-2 rounded-md bg-green-500/10">
              <ShieldCheck className="w-4 h-4 text-green-500" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold">{metrics.uptime}</h3>
            <span className="text-xs text-green-500 font-medium">All systems normal</span>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-sm font-medium text-muted-foreground">Server Load (Avg)</span>
            <div className="p-2 rounded-md bg-brand-primary/10">
              <Activity className="w-4 h-4 text-brand-primary" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold">{metrics.serverLoad}</h3>
            <span className="text-xs text-muted-foreground">Past 15 minutes</span>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-sm font-medium text-muted-foreground">Active Connections</span>
            <div className="p-2 rounded-md bg-blue-500/10">
              <Globe className="w-4 h-4 text-blue-500" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold">{metrics.activeConnections.toLocaleString()}</h3>
            <span className="text-xs text-muted-foreground">WebSocket & HTTP</span>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-sm font-medium text-muted-foreground">Avg API Latency</span>
            <div className="p-2 rounded-md bg-purple-500/10">
              <Clock className="w-4 h-4 text-purple-500" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold">45ms</h3>
            <span className="text-xs text-green-500 font-medium">-2ms from yesterday</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Services List */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Core Services Health</h3>
          <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
            <div className="divide-y divide-border">
              {services.map((service, idx) => {
                let Icon = Server;
                if (service.name.includes("API")) Icon = Globe;
                if (service.name.includes("Trading") || service.name.includes("Engine")) Icon = Activity;
                if (service.name.includes("Database") || service.name.includes("D1")) Icon = Database;
                if (service.name.includes("WebSocket")) Icon = Server;
                if (service.name.includes("Email")) Icon = Mail;
                
                return (
                  <div key={idx} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors flex-wrap gap-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5 text-foreground" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-foreground">{service.name}</h4>
                        <p className="text-xs text-muted-foreground mt-0.5">Latency: {service.latency || service.ping}</p>
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

        {/* Sidebar Metrics & Alerts */}
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Resource Usage</h3>
            <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-6">
              
              {/* CPU */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="flex items-center gap-2 font-medium"><Cpu className="w-4 h-4" /> CPU Usage</span>
                  <span className="font-mono">{metrics.cpu}%</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${metrics.cpu > 80 ? 'bg-red-500' : 'bg-brand-primary'}`} 
                    style={{ width: `${metrics.cpu}%` }}
                  />
                </div>
              </div>

              {/* RAM */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="flex items-center gap-2 font-medium"><HardDrive className="w-4 h-4" /> Memory (RAM)</span>
                  <span className="font-mono">{metrics.ram}%</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${metrics.ram > 85 ? 'bg-red-500' : 'bg-brand-secondary'}`} 
                    style={{ width: `${metrics.ram}%` }}
                  />
                </div>
              </div>

              {/* Disk */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="flex items-center gap-2 font-medium"><Database className="w-4 h-4" /> Disk Space</span>
                  <span className="font-mono">{metrics.disk}%</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-blue-500 transition-all duration-1000" 
                    style={{ width: `${metrics.disk}%` }}
                  />
                </div>
              </div>

            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Recent Alerts</h3>
            <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden divide-y divide-border">
              {RECENT_ALERTS.map((alert) => (
                <div key={alert.id} className="p-4 flex gap-3">
                  <AlertCircle className={`w-5 h-5 shrink-0 mt-0.5 ${
                    alert.type === 'error' ? 'text-red-500' :
                    alert.type === 'warning' ? 'text-yellow-500' : 'text-blue-500'
                  }`} />
                  <div>
                    <p className="text-sm text-foreground">{alert.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
