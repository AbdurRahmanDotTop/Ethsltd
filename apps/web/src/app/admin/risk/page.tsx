"use client";

import { useState } from "react";
import { 
  ShieldAlert, AlertTriangle, Activity, Lock, 
  Unlock, RefreshCw, AlertCircle, Ban, ArrowUpRight,
  UserX, Wallet
} from "lucide-react";
import { Button } from "@/components/ui/button";

import { useEffect } from "react";
import { apiClient } from "@ethsltd/api-client";
import { Loader2 } from "lucide-react";

export default function AdminRiskPage() {
  const [summary, setSummary] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await apiClient.getAdminRiskSummary();
        if (res.success) {
          setSummary(res.data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchSummary();
  }, []);

  if (!summary) {
    return (
      <div className="p-6 md:p-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
      </div>
    );
  }

  const kpis = summary.kpis || {};
  const users = summary.flaggedUsers || [];
  const alerts = summary.alerts || [];

  const handleAction = async (userId: string, action: 'freeze' | 'unfreeze' | 'reset') => {
    setIsProcessing(userId);
    try {
      if (action === 'freeze' || action === 'unfreeze') {
        const newStatus = action === 'freeze' ? 'FROZEN' : 'ACTIVE';
        const res = await apiClient.adminUpdateUserStatus(userId, newStatus);
        
        if (res.success) {
          setSummary((prev: any) => ({
            ...prev,
            flaggedUsers: prev.flaggedUsers.map((u: any) => 
              u.id === userId ? { ...u, status: newStatus.toLowerCase() } : u
            )
          }));
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(null);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-red-500 bg-red-500/10 border-red-500/20";
    if (score >= 70) return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
    return "text-blue-500 bg-blue-500/10 border-blue-500/20";
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-red-500 flex items-center gap-2">
            <ShieldAlert className="w-6 h-6" /> Risk Management
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">Monitor platform exposure, AML flags, and suspicious activities.</p>
        </div>
        <Button variant="outline" className="border-red-500/30 text-red-500 hover:bg-red-500/10">
          <Ban className="w-4 h-4 mr-2" /> Global Trading Halt
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-sm font-medium text-muted-foreground">Active Liquidations</span>
            <div className="p-2 rounded-md bg-yellow-500/10">
              <Activity className="w-4 h-4 text-yellow-500" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <h3 className="text-2xl font-bold">{kpis.activeLiquidations || 0}</h3>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 shadow-sm border-l-4 border-l-red-500">
          <div className="flex justify-between items-start">
            <span className="text-sm font-medium text-muted-foreground">Flagged Withdrawals</span>
            <div className="p-2 rounded-md bg-red-500/10">
              <Wallet className="w-4 h-4 text-red-500" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <h3 className="text-2xl font-bold">${(kpis.flaggedWithdrawals || 0).toLocaleString()}</h3>
            <span className="text-xs text-red-500 font-medium">Pending Review</span>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-sm font-medium text-muted-foreground">Suspicious Logins</span>
            <div className="p-2 rounded-md bg-blue-500/10">
              <UserX className="w-4 h-4 text-blue-500" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold">{kpis.suspiciousLogins || 0}</h3>
            <span className="text-xs text-muted-foreground">Past 24 hours</span>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-sm font-medium text-muted-foreground">Platform Exposure</span>
            <div className="p-2 rounded-md bg-purple-500/10">
              <ShieldAlert className="w-4 h-4 text-purple-500" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <h3 className="text-2xl font-bold">{kpis.platformExposure || 'Safe'}</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Flagged Users Table */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">AML & Fraud Flags</h3>
          <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
                  <tr>
                    <th className="px-4 py-3 font-medium">User</th>
                    <th className="px-4 py-3 font-medium text-center">Risk Score</th>
                    <th className="px-4 py-3 font-medium">Flag Reason</th>
                    <th className="px-4 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {users.length > 0 ? users.map((user: any) => (
                    <tr key={user.id} className={`transition-colors ${user.status === 'frozen' ? 'bg-red-500/5 opacity-75' : 'hover:bg-muted/30'}`}>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          {user.status === 'frozen' && <Lock className="w-3 h-3 text-red-500" />}
                          <div>
                            <p className="font-semibold text-foreground">{user.id.split('-').pop()?.slice(0, 8)}</p>
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold border ${getScoreColor(user.score)}`}>
                          {user.score} / 100
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-foreground">{user.reason}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Exposure: {user.exposure}</p>
                      </td>
                      <td className="px-4 py-4 text-right space-x-2">
                        {user.status === 'active' ? (
                          <Button 
                            variant="destructive" 
                            size="sm"
                            disabled={isProcessing === user.id}
                            onClick={() => handleAction(user.id, 'freeze')}
                          >
                            {isProcessing === user.id ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Lock className="w-3 h-3 mr-1" />}
                            Freeze
                          </Button>
                        ) : (
                          <Button 
                            variant="outline" 
                            size="sm"
                            disabled={isProcessing === user.id}
                            onClick={() => handleAction(user.id, 'unfreeze')}
                            className="text-green-500 hover:text-green-600 hover:bg-green-500/10 border-green-500/20"
                          >
                            {isProcessing === user.id ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Unlock className="w-3 h-3 mr-1" />}
                            Unfreeze
                          </Button>
                        )}
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                        No flagged users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Live Alerts Feed */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center justify-between flex-wrap gap-y-4">
            Live Risk Feed
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
          </h3>
          <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden divide-y divide-border">
            {alerts.length > 0 ? alerts.map((alert: any) => (
              <div key={alert.id} className="p-4 flex gap-3 hover:bg-muted/30 transition-colors">
                <AlertCircle className={`w-5 h-5 shrink-0 mt-0.5 ${
                  alert.severity === 'critical' ? 'text-red-500' :
                  alert.severity === 'warning' ? 'text-yellow-500' : 'text-blue-500'
                }`} />
                <div>
                  <p className={`text-sm ${alert.severity === 'critical' ? 'font-semibold text-red-500' : 'text-foreground'}`}>
                    {alert.message}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(alert.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            )) : (
              <div className="p-8 text-center text-muted-foreground">
                <p>No active risk alerts.</p>
              </div>
            )}
            
            <div className="p-3 text-center bg-muted/20">
              <Button variant="link" size="sm" className="text-xs text-muted-foreground">
                View All Historical Alerts
              </Button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
