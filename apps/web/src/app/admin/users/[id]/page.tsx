import { Metadata } from "next";
import { MockAdminProvider } from "@/lib/admin/providers/mock-admin-provider";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, ShieldAlert, Ban, Unlock, Activity, Wallet, Info, Handshake } from "lucide-react";

export const metadata: Metadata = {
  title: "User Detail | ETHSLTD Admin",
};

export default async function AdminUserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await MockAdminProvider.getUser(id);

  if (!user) {
    notFound();
  }

  const formatUSD = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
  };

  const statusColors = {
    ACTIVE: "bg-green-500/10 text-green-500 border-green-500/20",
    FROZEN: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    SUSPENDED: "bg-red-500/10 text-red-500 border-red-500/20",
    PENDING: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header & Breadcrumbs */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/admin/users" className="hover:text-foreground transition-colors flex items-center gap-1">
            <ChevronLeft className="w-4 h-4" /> Users
          </Link>
          <span>/</span>
          <span className="font-mono text-brand-primary">{user.id}</span>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-brand-primary/10 flex items-center justify-center text-xl font-bold text-brand-primary">
              {user.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <p className="text-muted-foreground font-mono text-sm">{user.email}</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2">
            {user.status === "ACTIVE" ? (
              <button className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-md transition-colors text-sm font-medium">
                <Ban className="w-4 h-4" /> Freeze Account
              </button>
            ) : (
              <button className="flex items-center gap-2 px-4 py-2 bg-green-500/10 hover:bg-green-500/20 text-green-500 border border-green-500/20 rounded-md transition-colors text-sm font-medium">
                <Unlock className="w-4 h-4" /> Unfreeze Account
              </button>
            )}
            <button className="flex items-center gap-2 px-4 py-2 bg-muted hover:bg-muted/80 text-foreground border border-border rounded-md transition-colors text-sm font-medium">
              Reset Security
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
        {/* Left Column: Overview & Security */}
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-lg p-5 space-y-4">
            <h3 className="font-semibold border-b border-border pb-2">Overview</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Account Status</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${statusColors[user.status]}`}>
                  {user.status}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Role</span>
                <span className="text-sm font-medium">{user.role}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">KYC Status</span>
                <span className="text-sm font-medium">{user.kycStatus}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Registration Date</span>
                <span className="text-sm font-medium">{new Date(user.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Last Login</span>
                <span className="text-sm font-medium">{new Date(user.lastLoginAt).toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-5 space-y-4">
            <div className="flex justify-between items-center border-b border-border pb-2">
              <h3 className="font-semibold">Risk Profile</h3>
              <ShieldAlert className={`w-4 h-4 ${user.riskLevel === 'CRITICAL' ? 'text-red-500' : 'text-muted-foreground'}`} />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Risk Level</span>
                <span className={`text-sm font-bold ${
                  user.riskLevel === 'LOW' ? 'text-green-500' : 
                  user.riskLevel === 'MEDIUM' ? 'text-yellow-500' : 
                  user.riskLevel === 'HIGH' ? 'text-orange-500' : 'text-red-500'
                }`}>{user.riskLevel}</span>
              </div>
              <p className="text-xs text-muted-foreground bg-muted p-2 rounded">
                This user has triggered 0 velocity alerts in the last 30 days. No unusual withdrawal patterns detected.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Financials & Activity */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Wallet className="w-4 h-4" />
                <span className="text-sm font-medium">Total Balance</span>
              </div>
              <div className="text-2xl font-bold">{formatUSD(user.balanceUsd)}</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Activity className="w-4 h-4" />
                <span className="text-sm font-medium">Trading Vol (30d)</span>
              </div>
              <div className="text-2xl font-bold">{formatUSD(user.tradingVolumeUsd)}</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Handshake className="w-4 h-4" />
                <span className="text-sm font-medium">P2P Vol (30d)</span>
              </div>
              <div className="text-2xl font-bold">{formatUSD(user.p2pVolumeUsd)}</div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="border-b border-border bg-muted/30 px-4 py-3 flex gap-6">
              <button className="text-sm font-medium text-brand-primary border-b-2 border-brand-primary pb-1">Activity</button>
              <button className="text-sm font-medium text-muted-foreground hover:text-foreground pb-1">Balances</button>
              <button className="text-sm font-medium text-muted-foreground hover:text-foreground pb-1">Orders</button>
              <button className="text-sm font-medium text-muted-foreground hover:text-foreground pb-1">Transfers</button>
            </div>
            <div className="p-8 text-center text-muted-foreground flex flex-col items-center">
              <Info className="w-8 h-8 mb-3 opacity-50" />
              <p>Activity timeline module will be connected to the Ledger Service in Phase 3.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
