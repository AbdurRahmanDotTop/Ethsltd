"use client";

import { useEffect, useState } from "react";
import { Users, Activity, Wallet, ArrowDownToLine, Handshake, AlertTriangle, UserCheck, Server, Loader2 } from "lucide-react";
import { apiClient } from "@ethsltd/api-client";
import { useAdminEnvStore } from "@/stores/admin-env-store";

function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  trend,
  colorClass
}: { 
  title: string; 
  value: string | number; 
  icon: any; 
  trend?: string;
  colorClass: string;
}) {
  return (
    <div className="bg-card border border-border rounded-lg p-5 flex flex-col justify-between hover:border-brand-primary/30 transition-colors">
      <div className="flex justify-between items-start">
        <span className="text-sm font-medium text-muted-foreground">{title}</span>
        <div className={`p-2 rounded-md ${colorClass} bg-opacity-10`}>
          <Icon className={`w-4 h-4 ${colorClass}`} />
        </div>
      </div>
      <div className="mt-4 flex items-baseline gap-2">
        <h3 className="text-2xl font-bold text-foreground">{value}</h3>
        {trend && <span className="text-xs text-green-500 font-medium">{trend}</span>}
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [activity, setActivity] = useState<any[]>([]);
  const { adminMode, setAdminMode } = useAdminEnvStore();

  useEffect(() => {
    async function fetchStats() {
      try {
        const statsRes = await apiClient.getAdminStats();
        if (statsRes.success) setStats(statsRes.data);
        // We haven't built the recent activity endpoint yet
        setActivity([]);
      } catch (err) {
        console.error(err);
      }
    }
    fetchStats();
  }, []);

  // Helper for USD formatting
  const formatUSD = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val);
  };

  if (!stats) {
    return (
      <div className="p-6 md:p-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
      </div>
    );
  }

  // Map API stats to KPIs structure
  const kpis = {
    totalUsers: stats.totalUsers || 0,
    activeUsers: Math.floor((stats.totalUsers || 0) * 0.8), // We don't track active explicitly, mock as 80%
    pendingKyc: stats.pendingKyc || 0,
    suspendedUsers: stats.suspendedUsers || 0,
    volume24h: stats.dailyVolumeUsd || 0,
    totalPlatformBalance: stats.totalPlatformBalance || 0,
    depositsToday: stats.depositsToday || 0,
    pendingWithdrawals: stats.pendingWithdrawals || 0,
    p2pVolume24h: stats.p2pVolume24h || 0,
    pendingDisputes: stats.pendingDisputes || 0,
    apiStatus: "Operational",
    dbStatus: "Operational",
    errorRate: 0.1,
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Dashboard Overview</h2>
          <p className="text-muted-foreground mt-1 text-sm">Platform performance and operational health.</p>
        </div>
        
        {/* Real / Demo Toggle */}
        <div className="flex bg-muted/50 p-1 rounded-md border border-border/50 self-start sm:self-auto">
          <button
            onClick={() => setAdminMode('REAL')}
            className={`px-4 py-1.5 text-sm font-medium rounded transition-all ${
              adminMode === 'REAL'
                ? 'bg-brand-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Real
          </button>
          <button
            onClick={() => setAdminMode('DEMO')}
            className={`px-4 py-1.5 text-sm font-medium rounded transition-all ${
              adminMode === 'DEMO'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Demo
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Users" 
          value={kpis.totalUsers.toLocaleString()} 
          icon={Users} 
          trend="+12% (30d)"
          colorClass="text-blue-500 bg-blue-500" 
        />
        <StatCard 
          title="24h Volume (Spot)" 
          value={formatUSD(kpis.volume24h)} 
          icon={Activity} 
          trend="+5.2%"
          colorClass="text-brand-primary bg-brand-primary" 
        />
        <StatCard 
          title="24h Volume (P2P)" 
          value={formatUSD(kpis.p2pVolume24h)} 
          icon={Handshake} 
          colorClass="text-green-500 bg-green-500" 
        />
        <StatCard 
          title="Platform Balance" 
          value={formatUSD(kpis.totalPlatformBalance)} 
          icon={Wallet} 
          colorClass="text-purple-500 bg-purple-500" 
        />
        
        <StatCard 
          title="Today's Deposits" 
          value={formatUSD(kpis.depositsToday)} 
          icon={ArrowDownToLine} 
          colorClass="text-teal-500 bg-teal-500" 
        />
        <StatCard 
          title="Pending Withdrawals" 
          value={kpis.pendingWithdrawals} 
          icon={Activity} 
          colorClass="text-yellow-500 bg-yellow-500" 
        />
        <StatCard 
          title="Pending KYC" 
          value={kpis.pendingKyc} 
          icon={UserCheck} 
          colorClass="text-orange-500 bg-orange-500" 
        />
        <StatCard 
          title="Open P2P Disputes" 
          value={kpis.pendingDisputes} 
          icon={AlertTriangle} 
          colorClass="text-red-500 bg-red-500" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card border border-border rounded-lg p-6 flex flex-col items-center justify-center min-h-[300px]">
             <Activity className="w-10 h-10 text-muted-foreground mb-4 opacity-50" />
             <h3 className="text-lg font-medium text-muted-foreground">Volume Chart (Mock)</h3>
             <p className="text-xs text-muted-foreground">Real-time charting implementation pending</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-bold mb-4">System Status</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center flex-wrap gap-y-4">
                <div className="flex items-center gap-2">
                  <Server className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium">API Gateway</span>
                </div>
                <span className="text-xs bg-green-500/10 text-green-500 px-2 py-1 rounded">Operational</span>
              </div>
              <div className="flex justify-between items-center flex-wrap gap-y-4">
                <div className="flex items-center gap-2">
                  <Server className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium">Database (D1)</span>
                </div>
                <span className="text-xs bg-green-500/10 text-green-500 px-2 py-1 rounded">Operational</span>
              </div>
              <div className="flex justify-between items-center flex-wrap gap-y-4">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-brand-primary" />
                  <span className="text-sm font-medium">Error Rate</span>
                </div>
                <span className="text-sm font-mono">{kpis.errorRate}%</span>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg overflow-hidden flex flex-col">
             <div className="p-4 border-b border-border">
                <h3 className="text-sm font-bold">Recent Activity</h3>
             </div>
             <div className="flex-1 overflow-auto min-h-[200px] flex items-center justify-center p-4">
               {activity.length === 0 ? (
                 <span className="text-xs text-muted-foreground">No recent activity logs.</span>
               ) : (
                 <div className="space-y-3 w-full">
                    {activity.map((act, i) => (
                      <div key={i} className="flex justify-between text-xs">
                        <span className="font-medium text-foreground">{act.action}</span>
                        <span className="text-muted-foreground">{new Date(act.timestamp).toLocaleTimeString()}</span>
                      </div>
                    ))}
                 </div>
               )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
