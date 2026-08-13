"use client";

import Link from "next/link";
import { useAuthStore } from "@/stores/auth-store";
import { usePaperAccountStore } from "@/stores/paper-account-store";
import { Button } from "@/components/ui/button";
import { ArrowRight, User, ShieldCheck, Wallet } from "lucide-react";

export default function AccountOverviewPage() {
  const { user } = useAuthStore();
  const { balances } = usePaperAccountStore();
  
  // Combine USDT and USDC for display
  const usdtBal = balances.find(b => b.asset === 'USDT')?.total || 0;
  const usdcBal = balances.find(b => b.asset === 'USDC')?.total || 0;
  const paperBalance = usdtBal + usdcBal;

  // Format to USD as per PRD
  const formattedBalance = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(paperBalance);

  if (!user) return null;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight mb-2">Account Overview</h1>
        <p className="text-muted-foreground">Manage your ETHSLTD account and security settings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 flex items-center justify-center">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{user.displayName || user.email.split('@')[0]}</h3>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <div className="space-y-3 pt-4 border-t border-border">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Status</span>
              <span className="font-medium text-green-600 dark:text-green-500 capitalize">{user.status.toLowerCase()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Account ID</span>
              <span className="font-mono text-xs">{user.id}</span>
            </div>
          </div>
          <Button variant="outline" className="w-full mt-6" asChild>
            <Link href="/account/profile">Manage Profile</Link>
          </Button>
        </div>

        {/* Paper Trading Card */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Paper Trading</h3>
              <p className="text-sm text-muted-foreground">Virtual Balance</p>
            </div>
          </div>
          <div className="pt-4 pb-2">
            <div className="text-3xl font-bold font-mono tracking-tight">{formattedBalance}</div>
          </div>
          <div className="mt-auto pt-6">
            <Button className="w-full" asChild>
              <Link href="/trade">
                Open Trading Terminal <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Security Card */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-500 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Security</h3>
              <p className="text-sm text-muted-foreground">Good</p>
            </div>
          </div>
          <div className="space-y-3 pt-4 border-t border-border">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Email</span>
              <span className="text-green-600 dark:text-green-500 flex items-center gap-1">
                Verified ✓
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">2FA</span>
              <span className="text-muted-foreground">Not enabled</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Active Sessions</span>
              <span className="font-medium">1</span>
            </div>
          </div>
          <Button variant="outline" className="w-full mt-auto pt-6" asChild>
            <Link href="/account/security">Security Settings</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
