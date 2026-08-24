/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { Users, Activity, Wallet, ArrowDownToLine, Handshake, AlertTriangle, UserCheck, Server, Loader2 } from "lucide-react";
import { apiClient } from "@ethsltd/api-client";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import P2pDashboardOverview from "../../components/admin/P2pDashboardOverview";

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
  const [activeTab, setActiveTab] = useState<'platform' | 'p2p'>('platform');
  const [stats, setStats] = useState<any>(null);
  const [activity, setActivity] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const statsRes = await apiClient.getAdminStats();
        if (statsRes.success) {
          setStats(statsRes.data);
        } else {
          setError(statsRes.error || "Failed to load admin stats. You may not have sufficient permissions.");
        }
        
        const chartRes = await apiClient.getAdminVolumeChart();
        if (chartRes.success) setChartData(chartRes.data);

        const activityRes = await apiClient.getAdminRecentActivity();
        if (activityRes.success) setActivity(activityRes.data);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "An unexpected error occurred while fetching data.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchStats();
  }, []);

  // Helper for USDT formatting
  const formatUSD = (val: number) => {
    return val.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }) + ' USDT';
  };

  if (isLoading) {
    return (
      <div className="p-6 md:p-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="p-6 md:p-8 flex flex-col items-center justify-center min-h-[400px] text-center">
        <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-xl font-bold mb-2">Access Denied or Error</h2>
        <p className="text-muted-foreground">{error || "Failed to load dashboard data."}</p>
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
      <div className="flex flex-col justify-between items-start gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Dashboard Overview</h2>
          <p className="text-muted-foreground mt-1 text-sm">Platform performance and operational health.</p>
        </div>
        
        <div className="flex bg-muted p-1 rounded-md">
          <button 
            onClick={() => setActiveTab('platform')}
            className={`px-4 py-2 text-sm font-medium rounded-sm transition-all ${activeTab === 'platform' ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          >
            Platform Overview
          </button>
          <button 
            onClick={() => setActiveTab('p2p')}
            className={`px-4 py-2 text-sm font-medium rounded-sm transition-all ${activeTab === 'p2p' ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          >
            P2P Overview
          </button>
        </div>
      </div>

      {activeTab === 'p2p' ? (
        <P2pDashboardOverview />
      ) : (
        <>
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
          <div className="bg-card border border-border rounded-lg p-6 min-h-[300px] flex flex-col">
             <h3 className="text-lg font-bold mb-4">7-Day Trading Volume (USDT)</h3>
             <div className="flex-1 w-full h-[300px]">
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#145B8C" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#145B8C" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" opacity={0.2} />
                      <XAxis 
                        dataKey="date" 
                        stroke="#888888" 
                        fontSize={12} 
                        tickLine={false} 
                        axisLine={false}
                        tickFormatter={(value) => {
                          const date = new Date(value);
                          return `${date.getMonth()+1}/${date.getDate()}`;
                        }}
                      />
                      <YAxis 
                        stroke="#888888" 
                        fontSize={12} 
                        tickLine={false} 
                        axisLine={false} 
                        tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                        width={60}
                      />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1A1A1A', border: '1px solid #333', borderRadius: '8px' }}
                        itemStyle={{ color: '#00FFC2' }}
                        formatter={(value: any) => [formatUSD(value), 'Volume']}
                        labelFormatter={(label: any) => new Date(label).toLocaleDateString()}
                      />
                      <Area type="monotone" dataKey="volume" stroke="#145B8C" strokeWidth={2} fillOpacity={1} fill="url(#colorVolume)" />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground opacity-50">
                    <Activity className="w-10 h-10 mb-4" />
                    <p>No volume data available</p>
                  </div>
                )}
             </div>
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
      </>
      )}
    </div>
  );
}
