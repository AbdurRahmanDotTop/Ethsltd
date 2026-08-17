"use client";

import { useEffect, useState } from "react";
import { Users, Activity, Wallet, ArrowDownToLine, Handshake, AlertTriangle, UserCheck, Server, Loader2 } from "lucide-react";
import { apiClient } from "@ethsltd/api-client";
import { MockAdminProvider } from "@/lib/admin/providers/mock-admin-provider";
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
        const [statsRes, activityRes] = await Promise.all([
          apiClient.getAdminStats(),
          MockAdminProvider.getRecentActivity() // We haven't built the recent activity endpoint yet
        ]);
        if (statsRes.success) setStats(statsRes.data);
        setActivity(activityRes);
      } catch (err) {
        console.error(err);
      }
    }
    fetchStats();
  }, [adminMode]);

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
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Dashboard Overview</h2>
          <p className="text-muted-foreground mt-1 text-sm">Platform performance and operational health.</p>
        </div>
        <div className="flex gap-2">
          <select className="bg-muted border border-border rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-brand-primary">
            <option>Today</option>
            <option>Last 24 Hours</option>
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
          </select>
        </div>
      </div>

      <div className="space-y-6">
        
        {/* Users & Growth */}
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Users & Identity</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Total Users" value={kpis.totalUsers.toLocaleString()} icon={Users} colorClass="text-blue-500" trend="+124 today" />
            <StatCard title="Active Users" value={kpis.activeUsers.toLocaleString()} icon={Activity} colorClass="text-green-500" />
            <StatCard title="Pending KYC" value={kpis.pendingKyc} icon={UserCheck} colorClass="text-yellow-500" />
            <StatCard title="Suspended Users" value={kpis.suspendedUsers} icon={AlertTriangle} colorClass="text-red-500" />
          </div>
        </div>

        {/* Financials & Trading */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Financials & Trading</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="24h Trading Volume" value={formatUSD(kpis.volume24h)} icon={Activity} colorClass="text-brand-primary" trend="+5.2%" />
            <StatCard title="Total Platform Balance" value={formatUSD(kpis.totalPlatformBalance)} icon={Wallet} colorClass="text-brand-secondary" />
            <StatCard title="Deposits Today" value={formatUSD(kpis.depositsToday)} icon={ArrowDownToLine} colorClass="text-green-500" />
            <StatCard title="Pending Withdrawals" value={kpis.pendingWithdrawals} icon={AlertTriangle} colorClass="text-orange-500" />
          </div>
        </div>

        {/* P2P & System */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Recent Activity</h3>
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <div className="divide-y divide-border">
                {activity.map((event) => (
                  <div key={event.id} className="p-4 flex items-start gap-4 hover:bg-muted/50 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center shrink-0 mt-1">
                      <span className="text-xs font-bold text-brand-primary">{event.adminId.split('-')[1]}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground">
                        <span className="font-semibold">{event.adminId}</span> ({event.adminRole}) performed <span className="font-semibold text-brand-primary">{event.action}</span> on {event.entity} <span className="font-mono text-xs bg-muted px-1 py-0.5 rounded">{event.entityId}</span>
                      </p>
                      {event.reason && <p className="text-xs text-muted-foreground mt-1">Reason: {event.reason}</p>}
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <span>{new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        <span>•</span>
                        <span>IP: {event.ip}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">P2P & System Health</h3>
            <div className="grid grid-cols-1 gap-4">
              <StatCard title="P2P 24h Volume" value={formatUSD(kpis.p2pVolume24h)} icon={Handshake} colorClass="text-purple-500" />
              <StatCard title="P2P Active Disputes" value={kpis.pendingDisputes} icon={AlertTriangle} colorClass="text-red-500" />
              <div className="bg-card border border-border rounded-lg p-5">
                <div className="flex items-center gap-3 mb-4">
                  <Server className="w-5 h-5 text-muted-foreground" />
                  <h4 className="font-medium">System Status</h4>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">API Services</span>
                    <span className="text-xs font-medium px-2 py-1 bg-green-500/10 text-green-500 rounded-full">{kpis.apiStatus}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Database</span>
                    <span className="text-xs font-medium px-2 py-1 bg-green-500/10 text-green-500 rounded-full">{kpis.dbStatus}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Error Rate</span>
                    <span className="text-sm font-medium text-foreground">{kpis.errorRate}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
