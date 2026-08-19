"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@ethsltd/api-client";
import { Loader2, DollarSign, ArrowUpRight, ArrowDownRight, Wallet } from "lucide-react";
import Link from "next/link";

export default function ExpertEarningsPage() {
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<any[]>([]);
  const [walletBalance, setWalletBalance] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookingsRes, userRes] = await Promise.all([
          apiClient.expertGetBookings(),
          apiClient.getMe()
        ]);
        
        if (bookingsRes.success) {
          setBookings(bookingsRes.data || []);
        }

        if (userRes.success && userRes.data) {
          // Fetch real wallet to see actual withdrawable balance
          const walletsRes = await apiClient.getWalletBalances('REAL');
          if (walletsRes.success) {
            setWalletBalance(walletsRes.data || []);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const completedBookings = bookings.filter(b => b.status === 'COMPLETED');
  
  // Calculate total earnings across all currencies
  const totalEarningsByCurrency = completedBookings.reduce((acc, curr) => {
    const amt = parseFloat(curr.expertEarnings || curr.price || 0);
    if (!acc[curr.currency]) acc[curr.currency] = 0;
    acc[curr.currency] += amt;
    return acc;
  }, {} as Record<string, number>);

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">Earnings & Wallet</h1>
        <p className="text-muted-foreground mt-2">Track your session earnings and withdrawable balances.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Available Wallet Balances */}
        {walletBalance.length > 0 ? walletBalance.map((wallet: any) => (
           <div key={wallet.assetSymbol} className="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-brand-500/10 flex items-center justify-center text-brand-600">
                  <Wallet className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">{wallet.assetSymbol} Balance</h3>
                  <p className="text-xs text-muted-foreground">Available to withdraw</p>
                </div>
              </div>
              <div className="text-3xl font-display font-bold text-foreground mb-6">
                {parseFloat(wallet.available || wallet.balance || 0).toFixed(2)}
              </div>
              <Link 
                href="/account/wallets" 
                className="mt-auto block text-center w-full py-2.5 bg-muted text-foreground hover:bg-muted/80 rounded-lg text-sm font-semibold transition-colors"
              >
                Go to Wallet
              </Link>
           </div>
        )) : (
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col items-center justify-center text-center col-span-1 md:col-span-2 lg:col-span-3">
             <Wallet className="w-10 h-10 text-muted-foreground/50 mb-3" />
             <p className="text-muted-foreground">No wallet balances found.</p>
          </div>
        )}
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border flex justify-between items-center flex-wrap gap-y-4">
          <h2 className="text-xl font-bold text-foreground">Completed Sessions History</h2>
        </div>
        
        {completedBookings.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            No completed sessions yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/30 border-b border-border">
                  <th className="p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Date</th>
                  <th className="p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Client</th>
                  <th className="p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Service</th>
                  <th className="p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Price</th>
                  <th className="p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Your Earnings</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {completedBookings.map((booking: any) => (
                  <tr key={booking.id} className="hover:bg-muted/20 transition-colors">
                    <td className="p-4 text-sm whitespace-nowrap">
                      {new Date(booking.scheduledAt || booking.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-sm font-medium text-foreground">
                      {booking.userDisplayName || 'User'}
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {booking.serviceTitle}
                    </td>
                    <td className="p-4 text-sm text-foreground">
                      {booking.price} {booking.currency}
                    </td>
                    <td className="p-4 font-bold text-green-600 flex items-center gap-1">
                      <ArrowUpRight className="w-4 h-4" />
                      +{booking.expertEarnings || booking.price} {booking.currency}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
