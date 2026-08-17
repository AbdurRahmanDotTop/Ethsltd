"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@ethsltd/api-client";
import { Users, DollarSign, Calendar as CalendarIcon, Star, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function ExpertDashboardOverview() {
  const [profile, setProfile] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, bookingsRes] = await Promise.all([
          apiClient.expertGetMe(),
          apiClient.expertGetBookings()
        ]);
        
        if (profileRes.success) setProfile(profileRes.data);
        if (bookingsRes.success) setBookings(bookingsRes.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
      </div>
    );
  }

  const activeBookings = bookings.filter(b => b.status === 'PENDING_EXPERT' || b.status === 'ACCEPTED');
  const recentBookings = bookings.slice(0, 5);

  const stats = [
    { name: "Completed Services", value: profile?.completedServices?.toString() || "0", icon: CalendarIcon, trend: "Stable" },
    { name: "Active Bookings", value: activeBookings.length.toString(), icon: CalendarIcon, trend: "Current" },
    { name: "Customers Helped", value: profile?.customersHelped?.toString() || "0", icon: Users, trend: "Total" },
    { name: "Average Rating", value: profile?.rating?.toString() || "New", icon: Star, trend: "Score" },
  ];

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">Dashboard Overview</h1>
        <p className="text-muted-foreground mt-1">Welcome back. Here's what's happening with your services.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-brand-500/10 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-brand-600" />
                </div>
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-muted text-muted-foreground">
                  {stat.trend}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-foreground">{stat.value}</h3>
              <p className="text-sm text-muted-foreground mt-1">{stat.name}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg">Recent Bookings</h3>
            <Link href="/expert/dashboard/bookings" className="text-sm text-brand-primary flex items-center gap-1 hover:underline">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          {recentBookings.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground bg-muted/30 rounded-lg border border-dashed border-border">
              You don't have any recent bookings.
            </div>
          ) : (
            <div className="space-y-3">
              {recentBookings.map((b) => (
                <div key={b.id} className="flex justify-between items-center p-3 rounded-lg hover:bg-muted/30 border border-transparent hover:border-border transition-colors">
                  <div>
                    <div className="font-medium text-sm text-foreground">{b.serviceTitle}</div>
                    <div className="text-xs text-muted-foreground">{new Date(b.scheduledAt).toLocaleString()} • Client: {b.userDisplayName || b.userId}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-sm">{b.price} {b.currency}</div>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                      b.status === 'COMPLETED' ? 'bg-green-500/10 text-green-500' :
                      b.status === 'ACCEPTED' ? 'bg-blue-500/10 text-blue-500' :
                      b.status === 'PENDING_EXPERT' ? 'bg-orange-500/10 text-orange-500' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {b.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-semibold text-lg mb-4">Profile Status</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
              <span className="text-sm text-muted-foreground">Verification</span>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${profile?.verificationStatus === 'VERIFIED' ? 'bg-green-500/10 text-green-500' : 'bg-orange-500/10 text-orange-500'}`}>
                {profile?.verificationStatus || 'PENDING'}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
              <span className="text-sm text-muted-foreground">Availability</span>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${profile?.availabilityStatus === 'ONLINE' ? 'bg-green-500/10 text-green-500' : 'bg-muted text-muted-foreground'}`}>
                {profile?.availabilityStatus || 'OFFLINE'}
              </span>
            </div>
            
            <Link href="/expert/dashboard/settings" className="block w-full text-center py-2 text-sm font-medium border border-border rounded-md hover:bg-muted transition-colors mt-4">
              Edit Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
