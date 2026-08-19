"use client";

import { useState } from "react";
import { 
  ShieldAlert, AlertTriangle, Activity, Lock, 
  Unlock, RefreshCw, AlertCircle, Ban, ArrowUpRight,
  UserX, Wallet
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Mock Data
const ALERTS = [
  { id: 1, type: "critical", message: "Whale Withdrawal Detected: 500 BTC by USR-089", time: "2 mins ago" },
  { id: 2, type: "warning", message: "High latency in Liquidation Engine (120ms)", time: "15 mins ago" },
  { id: 3, type: "critical", message: "Multiple failed 2FA attempts for ADMIN-02", time: "45 mins ago" },
  { id: 4, type: "info", message: "System auto-balanced cold wallet thresholds", time: "2 hours ago" },
];

const FLAGGED_USERS = [
  { id: "USR-882", email: "suspicious@mail.com", score: 92, reason: "Multiple IPs, High Volume", status: "active", exposure: "$150,000" },
  { id: "USR-105", email: "trader_x@example.com", score: 75, reason: "Margin Call Risk - High Leverage", status: "active", exposure: "$45,200" },
  { id: "USR-999", email: "unknown_proxy@web.net", score: 98, reason: "AML Flag: Sanctioned Region IP", status: "frozen", exposure: "$0" },
  { id: "USR-412", email: "retail_bot@api.com", score: 65, reason: "API Rate Limit Abuse", status: "active", exposure: "$1,200" },
];

export default function AdminRiskPage() {
  const [users, setUsers] = useState(FLAGGED_USERS);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  const handleAction = (userId: string, action: 'freeze' | 'unfreeze' | 'reset') => {
    setIsProcessing(userId);
    setTimeout(() => {
      if (action === 'freeze' || action === 'unfreeze') {
        setUsers(prev => prev.map(u => 
          u.id === userId ? { ...u, status: action === 'freeze' ? 'frozen' : 'active' } : u
        ));
      }
      setIsProcessing(null);
    }, 1500);
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
            <h3 className="text-2xl font-bold">12</h3>
            <span className="text-xs text-yellow-500 font-medium flex items-center"><ArrowUpRight className="w-3 h-3"/> +3 in last hour</span>
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
            <h3 className="text-2xl font-bold">$2.4M</h3>
            <span className="text-xs text-red-500 font-medium">Pending Manual Review</span>
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
            <h3 className="text-2xl font-bold">45</h3>
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
            <h3 className="text-2xl font-bold">Safe</h3>
            <span className="text-xs text-green-500 font-medium">Margin Ratio: 145%</span>
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
                  {users.map((user) => (
                    <tr key={user.id} className={`transition-colors ${user.status === 'frozen' ? 'bg-red-500/5 opacity-75' : 'hover:bg-muted/30'}`}>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          {user.status === 'frozen' && <Lock className="w-3 h-3 text-red-500" />}
                          <div>
                            <p className="font-semibold text-foreground">{user.id}</p>
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
                  ))}
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
            {ALERTS.map((alert) => (
              <div key={alert.id} className="p-4 flex gap-3 hover:bg-muted/30 transition-colors">
                <AlertCircle className={`w-5 h-5 shrink-0 mt-0.5 ${
                  alert.type === 'critical' ? 'text-red-500' :
                  alert.type === 'warning' ? 'text-yellow-500' : 'text-blue-500'
                }`} />
                <div>
                  <p className={`text-sm ${alert.type === 'critical' ? 'font-semibold text-red-500' : 'text-foreground'}`}>
                    {alert.message}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                </div>
              </div>
            ))}
            
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
