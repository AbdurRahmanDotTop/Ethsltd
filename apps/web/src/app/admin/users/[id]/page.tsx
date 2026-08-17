"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@ethsltd/api-client";
import { AdminUser } from "@/lib/admin/types";
import Link from "next/link";
import { ChevronLeft, ShieldAlert, Ban, Unlock, Activity, Wallet, Info, Handshake, Loader2 } from "lucide-react";

export default function AdminUserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Activity");

  // Wallet Adjust State
  const [assetSymbol, setAssetSymbol] = useState("USDT");
  const [walletType, setWalletType] = useState<"REAL"|"DEMO">("REAL");
  const [adjustAction, setAdjustAction] = useState<"CREDIT"|"DEBIT">("CREDIT");
  const [targetField, setTargetField] = useState<"balance"|"lockedBalance"|"escrowBalance">("balance");
  const [adjustAmount, setAdjustAmount] = useState("");
  const [adjustNotes, setAdjustNotes] = useState("");
  const [isAdjusting, setIsAdjusting] = useState(false);

  // Security State
  const [newPassword, setNewPassword] = useState("");
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await apiClient.getAdminUsers({ search: id, limit: 1 });
        if (res.success && res.data && res.data.length > 0) {
          setUser(res.data[0]);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="p-6 md:p-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6 md:p-8 flex flex-col items-center justify-center min-h-[400px] gap-4">
        <ShieldAlert className="w-12 h-12 text-muted-foreground" />
        <h2 className="text-xl font-bold">User Not Found</h2>
        <Link href="/admin/users" className="text-brand-primary hover:underline">Return to Users</Link>
      </div>
    );
  }

  const formatUSD = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
  };

  const statusColors: Record<string, string> = {
    ACTIVE: "bg-green-500/10 text-green-500 border-green-500/20",
    FROZEN: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    SUSPENDED: "bg-red-500/10 text-red-500 border-red-500/20",
    BANNED: "bg-red-500/10 text-red-500 border-red-500/20",
    PENDING: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  };

  const toggleStatus = async () => {
    const newStatus = user.status === "ACTIVE" ? "FROZEN" : "ACTIVE";
    try {
      const res = await apiClient.updateAdminUserStatus(user.id, newStatus);
      if (res.success) {
        setUser({ ...user, status: newStatus });
      }
    } catch (e) {
      console.error(e);
    }
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
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{user.displayName || 'Unknown User'}</h2>
              <p className="text-muted-foreground font-mono text-sm">{user.email}</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2">
            {user.status === "ACTIVE" ? (
              <button onClick={toggleStatus} className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-md transition-colors text-sm font-medium cursor-pointer">
                <Ban className="w-4 h-4" /> Freeze Account
              </button>
            ) : (
              <button onClick={toggleStatus} className="flex items-center gap-2 px-4 py-2 bg-green-500/10 hover:bg-green-500/20 text-green-500 border border-green-500/20 rounded-md transition-colors text-sm font-medium cursor-pointer">
                <Unlock className="w-4 h-4" /> Unfreeze Account
              </button>
            )}
            <select 
              className="text-sm bg-muted border border-border rounded px-3 py-2 font-medium"
              value={user.role}
              onChange={async (e) => {
                try {
                  await apiClient.updateAdminUserRole(user.id, e.target.value);
                  setUser({ ...user, role: e.target.value });
                } catch(err) {
                  alert("Failed to update role");
                }
              }}
            >
              <option value="USER">USER</option>
              <option value="SUPPORT_ADMIN">SUPPORT_ADMIN</option>
              <option value="COMPLIANCE_ADMIN">COMPLIANCE_ADMIN</option>
              <option value="SUPER_ADMIN">SUPER_ADMIN</option>
            </select>
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
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${statusColors[user.status] || "bg-muted text-foreground border-border"}`}>
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
              {["Activity", "Balances", "Orders", "Security"].map(tab => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`text-sm font-medium pb-1 ${activeTab === tab ? 'text-brand-primary border-b-2 border-brand-primary' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
            
            <div className="p-6">
              {activeTab === "Balances" ? (
                <div className="space-y-4 max-w-md">
                  <h3 className="font-semibold text-lg">Super Admin: Manual Balance Adjustment</h3>
                  <p className="text-sm text-muted-foreground">Force-update user balances for dispute resolution or correction.</p>
                  
                  <div className="space-y-3 p-4 bg-muted/20 border border-border rounded-lg">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Asset Symbol</label>
                        <input type="text" value={assetSymbol} onChange={e => setAssetSymbol(e.target.value.toUpperCase())} className="w-full bg-background border border-border rounded px-3 py-2 text-sm" placeholder="USDT" />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Wallet Type</label>
                        <select value={walletType} onChange={e => setWalletType(e.target.value as any)} className="w-full bg-background border border-border rounded px-3 py-2 text-sm">
                          <option value="REAL">REAL</option>
                          <option value="DEMO">DEMO</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-3">
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Target Field</label>
                        <select value={targetField} onChange={e => setTargetField(e.target.value as any)} className="w-full bg-background border border-border rounded px-3 py-2 text-sm">
                          <option value="balance">Available Balance</option>
                          <option value="lockedBalance">Locked (Spot)</option>
                          <option value="escrowBalance">Escrow (P2P)</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Action</label>
                        <select value={adjustAction} onChange={e => setAdjustAction(e.target.value as any)} className="w-full bg-background border border-border rounded px-3 py-2 text-sm">
                          <option value="CREDIT">CREDIT (+)</option>
                          <option value="DEBIT">DEBIT (-)</option>
                        </select>
                      </div>
                    </div>
                    <div className="mt-3">
                      <label className="text-xs text-muted-foreground mb-1 block">Amount</label>
                      <input type="number" min="0" step="0.000001" value={adjustAmount} onChange={e => setAdjustAmount(e.target.value)} className="w-full bg-background border border-border rounded px-3 py-2 text-sm" placeholder="100.00" />
                    </div>
                    <div className="mt-3">
                      <label className="text-xs text-muted-foreground mb-1 block">Notes / Reason (Visible to user)</label>
                      <input type="text" value={adjustNotes} onChange={e => setAdjustNotes(e.target.value)} className="w-full bg-background border border-border rounded px-3 py-2 text-sm" placeholder="e.g. Dispute #123 resolution, Correction" required />
                    </div>
                    <button 
                      disabled={isAdjusting || !adjustAmount || parseFloat(adjustAmount) <= 0}
                      onClick={async () => {
                        setIsAdjusting(true);
                        try {
                          const res = await apiClient.adjustAdminUserWallet(user.id, assetSymbol, adjustAmount, walletType, adjustAction, targetField, adjustNotes);
                          if (res.success) {
                            alert("Balance adjusted successfully!");
                            setAdjustAmount("");
                            setAdjustNotes("");
                          } else {
                            alert("Error: " + res.error);
                          }
                        } catch (err: any) {
                          alert("Failed: " + err.message);
                        } finally {
                          setIsAdjusting(false);
                        }
                      }}
                      className="w-full mt-4 bg-brand-primary text-primary-foreground py-2 rounded-md font-medium text-sm hover:opacity-90 disabled:opacity-50"
                    >
                      {isAdjusting ? 'Processing...' : 'Confirm Adjustment'}
                    </button>
                  </div>
                </div>
              ) : activeTab === "Security" ? (
                <div className="space-y-8 max-w-md">
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold border-b border-border pb-2">Password Reset</h3>
                    <p className="text-sm text-muted-foreground -mt-4">
                      As a Super Admin, you can forcefully reset this user's password without requiring their current password.
                    </p>
                    <div className="flex gap-3 items-end max-w-sm">
                      <div className="flex-1 space-y-1.5">
                        <label className="text-sm font-medium">New Password</label>
                        <input 
                          type="password"
                          value={newPassword}
                          onChange={e => setNewPassword(e.target.value)}
                          placeholder="Enter new password"
                          className="w-full px-3 py-2 bg-muted/50 border border-border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-brand-primary"
                        />
                      </div>
                      <button
                        onClick={async () => {
                          if (!confirm("Are you sure you want to forcibly reset this user's password?")) return;
                          setIsResetting(true);
                          try {
                            const res = await apiClient.adminResetUserPassword(user.id, newPassword);
                            if (res.success) {
                              alert("Password reset successfully!");
                              setNewPassword("");
                            } else {
                              alert("Error: " + res.error);
                            }
                          } catch (err: any) {
                            alert("Failed: " + err.message);
                          } finally {
                            setIsResetting(false);
                          }
                        }}
                        className="mt-4 bg-brand-primary text-primary-foreground hover:bg-brand-primary/90 px-4 py-2 rounded-md font-medium text-sm disabled:opacity-50"
                      >
                        {isResetting ? 'Resetting...' : 'Reset'}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-6 mt-8 pt-8 border-t border-border">
                    <h3 className="text-lg font-semibold text-red-500 border-b border-red-500/20 pb-2 flex items-center gap-2">
                      <ShieldAlert className="w-5 h-5" /> Danger Zone
                    </h3>
                    <p className="text-sm text-muted-foreground -mt-4">
                      Completely delete this user account. This action is irreversible and will permanently wipe out all associated data (balances, orders, P2P history, tickets).
                    </p>
                    <button
                      onClick={async () => {
                        if (confirm("WARNING: Are you absolutely sure you want to COMPLETELY DELETE this user? All their data across the platform will be wiped.")) {
                          try {
                            const res = await apiClient.adminDeleteUser(user.id);
                            if (res.success) {
                              alert("User deleted successfully.");
                              router.push('/admin/users');
                            } else {
                              alert("Error deleting user: " + res.error);
                            }
                          } catch (err) {
                            alert("Failed to delete user.");
                          }
                        }
                      }}
                      className="w-full bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white py-2 rounded-md font-medium text-sm transition-colors"
                    >
                      Completely Delete User
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center text-muted-foreground flex flex-col items-center py-8">
                  <Info className="w-8 h-8 mb-3 opacity-50" />
                  <p>Module will be connected in the next phase.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
