/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { Loader2, Activity, ShoppingCart, AlertCircle, ShieldAlert, MessageSquare, Handshake, Users, ArrowDownToLine, Calendar as CalendarIcon } from "lucide-react";
import { apiClient } from "@ethsltd/api-client";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, Cell, PieChart, Pie } from 'recharts';

function StatCard({ title, value, icon: Icon, colorClass, subtitle }: { title: string; value: string | number; icon: any; colorClass: string; subtitle?: string }) {
  return (
    <div className="bg-card border border-border rounded-lg p-5 flex flex-col justify-between hover:border-brand-primary/30 transition-colors">
      <div className="flex justify-between items-start">
        <span className="text-sm font-medium text-muted-foreground">{title}</span>
        <div className={`p-2 rounded-md ${colorClass} bg-opacity-10`}>
          <Icon className={`w-4 h-4 ${colorClass}`} />
        </div>
      </div>
      <div className="mt-4 flex flex-col items-start gap-1">
        <h3 className="text-2xl font-bold text-foreground">{value}</h3>
        {subtitle && <span className="text-xs text-muted-foreground">{subtitle}</span>}
      </div>
    </div>
  );
}

export default function P2pDashboardOverview() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('7d');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');

  const fetchStats = async () => {
    setLoading(true);
    try {
      const params: any = {};
      
      const now = new Date();
      if (dateRange !== 'custom') {
        const start = new Date();
        if (dateRange === '1d') start.setDate(now.getDate() - 1);
        if (dateRange === '7d') start.setDate(now.getDate() - 7);
        if (dateRange === '1m') start.setMonth(now.getMonth() - 1);
        if (dateRange === '3m') start.setMonth(now.getMonth() - 3);
        if (dateRange === '6m') start.setMonth(now.getMonth() - 6);
        if (dateRange === '1y') start.setFullYear(now.getFullYear() - 1);
        params.startDate = start.toISOString();
      } else {
        if (customStart) params.startDate = new Date(customStart).toISOString();
        if (customEnd) {
          const end = new Date(customEnd);
          end.setHours(23, 59, 59, 999);
          params.endDate = end.toISOString();
        }
      }

      const res = await apiClient.getAdminP2pStats(params);
      if (res.success) {
        setStats(res.data);
      }
    } catch (err) {
      console.error("Failed to load P2P stats", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [dateRange, customStart, customEnd]);

  const formatUSD = (val: number) => {
    return val.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }) + ' USDT';
  };

  if (loading && !stats) {
    return (
      <div className="p-6 md:p-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
      </div>
    );
  }

  const COLORS = {
    COMPLETED: '#10B981',
    CANCELLED: '#EF4444',
    CREATED: '#3B82F6',
    PAYMENT_PENDING: '#F59E0B',
    DISPUTED: '#8B5CF6'
  };

  const statusData = Object.entries(stats?.orderStats?.byStatus || {}).map(([name, data]: any) => ({
    name,
    count: data.count,
    volume: data.volume
  }));

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card border border-border p-4 rounded-lg">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-muted-foreground" />
          <span className="text-sm font-medium">Filter Period:</span>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <select 
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="bg-background border border-border rounded-md px-3 py-1.5 text-sm"
          >
            <option value="1d">Daily (Last 24h)</option>
            <option value="7d">Last 7 Days</option>
            <option value="1m">Monthly (Last 30d)</option>
            <option value="3m">Quarterly (Last 90d)</option>
            <option value="6m">Half-Yearly</option>
            <option value="1y">Yearly</option>
            <option value="custom">Custom Range</option>
          </select>
          
          {dateRange === 'custom' && (
            <div className="flex items-center gap-2">
              <input 
                type="date" 
                value={customStart}
                onChange={(e) => setCustomStart(e.target.value)}
                className="bg-background border border-border rounded-md px-2 py-1 text-sm" 
              />
              <span className="text-muted-foreground">to</span>
              <input 
                type="date" 
                value={customEnd}
                onChange={(e) => setCustomEnd(e.target.value)}
                className="bg-background border border-border rounded-md px-2 py-1 text-sm" 
              />
            </div>
          )}
        </div>
      </div>

      {loading && stats && (
        <div className="h-1 w-full bg-border overflow-hidden rounded-full relative">
          <div className="absolute top-0 left-0 h-full bg-brand-primary animate-pulse w-full"></div>
        </div>
      )}

      {/* Primary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total P2P Volume" 
          value={formatUSD(stats?.orderStats?.totalVolume || 0)} 
          icon={Activity} 
          colorClass="text-brand-primary bg-brand-primary" 
          subtitle={`${stats?.orderStats?.totalOrders || 0} Total Orders`}
        />
        <StatCard 
          title="Escrow Locked Funds" 
          value={formatUSD(stats?.totalEscrow || 0)} 
          icon={ArrowDownToLine} 
          colorClass="text-blue-500 bg-blue-500" 
          subtitle="Currently active in escrow"
        />
        <StatCard 
          title="Active Advertisements" 
          value={stats?.activeAds || 0} 
          icon={ShoppingCart} 
          colorClass="text-green-500 bg-green-500" 
        />
        <StatCard 
          title="Active P2P Merchants" 
          value={stats?.activeMerchants || 0} 
          icon={Users} 
          colorClass="text-purple-500 bg-purple-500" 
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Buy Activity Volume" 
          value={formatUSD(stats?.buySellVolume?.BUY || 0)} 
          icon={ArrowDownToLine} 
          colorClass="text-green-500 bg-green-500" 
        />
        <StatCard 
          title="Sell Activity Volume" 
          value={formatUSD(stats?.buySellVolume?.SELL || 0)} 
          icon={ArrowDownToLine} 
          colorClass="text-red-500 bg-red-500" 
        />
        <StatCard 
          title="Ongoing Disputes" 
          value={stats?.disputeStats?.OPEN || 0} 
          icon={ShieldAlert} 
          colorClass="text-orange-500 bg-orange-500" 
          subtitle={`${stats?.disputeStats?.RESOLVED || 0} Resolved`}
        />
        <StatCard 
          title="P2P Chat Messages" 
          value={stats?.chatStats?.total || 0} 
          icon={MessageSquare} 
          colorClass="text-blue-400 bg-blue-400" 
          subtitle={`${stats?.chatStats?.unread || 0} Unread`}
        />
      </div>

      {/* Charts & Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Order Status Breakdown */}
        <div className="lg:col-span-1 bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-bold mb-6">Order Status Breakdown</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="count"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={(COLORS as any)[entry.name] || '#888888'} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1A1A1A', border: '1px solid #333', borderRadius: '8px' }}
                  itemStyle={{ color: '#00FFC2' }}
                  formatter={(value: any, name: any) => [value + ' Orders', name]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {statusData.map((s, i) => (
              <div key={i} className="flex justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: (COLORS as any)[s.name] || '#888888' }}></div>
                  <span className="text-muted-foreground">{s.name}</span>
                </div>
                <div className="font-medium">{s.count} <span className="text-xs text-muted-foreground ml-2">({formatUSD(s.volume || 0)})</span></div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="lg:col-span-2 bg-card border border-border rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold">Recent P2P Transactions</h3>
            <span className="text-xs text-muted-foreground">Real-time</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase border-b border-border">
                <tr>
                  <th className="px-4 py-3">Order ID</th>
                  <th className="px-4 py-3">Asset</th>
                  <th className="px-4 py-3">Fiat Amount</th>
                  <th className="px-4 py-3">Crypto Amount</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Time</th>
                </tr>
              </thead>
              <tbody>
                {(stats?.recentOrders || []).map((order: any, i: number) => (
                  <tr key={i} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs">{order.id}</td>
                    <td className="px-4 py-3 font-bold text-brand-primary">{order.asset}</td>
                    <td className="px-4 py-3">{Number(order.fiatAmount).toLocaleString()} {order.fiat || 'USD'}</td>
                    <td className="px-4 py-3">{Number(order.cryptoAmount).toFixed(4)}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold ${
                        order.status === 'COMPLETED' ? 'bg-green-500/10 text-green-500' :
                        order.status === 'CANCELLED' ? 'bg-red-500/10 text-red-500' :
                        order.status === 'DISPUTED' ? 'bg-orange-500/10 text-orange-500' :
                        'bg-blue-500/10 text-blue-500'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-xs text-muted-foreground">
                      {new Date(order.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
                {(!stats?.recentOrders || stats.recentOrders.length === 0) && (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-muted-foreground">
                      No recent transactions found in this period.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
