"use client";

import { Users, DollarSign, Calendar as CalendarIcon, Star } from "lucide-react";

export default function ExpertDashboardOverview() {
  const stats = [
    { name: "Total Earnings", value: "$4,250", icon: DollarSign, trend: "+12%" },
    { name: "Active Bookings", value: "8", icon: CalendarIcon, trend: "Stable" },
    { name: "Total Customers", value: "142", icon: Users, trend: "+5" },
    { name: "Average Rating", value: "4.9", icon: Star, trend: "+0.1" },
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
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  stat.trend.startsWith("+") ? "bg-green-500/10 text-green-600" : "bg-muted text-muted-foreground"
                }`}>
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
          <h3 className="font-semibold text-lg mb-4">Recent Bookings</h3>
          <div className="text-center py-12 text-muted-foreground bg-muted/30 rounded-lg border border-dashed border-border">
            You don't have any recent bookings.
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-semibold text-lg mb-4">Upcoming Schedule</h3>
          <div className="text-center py-12 text-muted-foreground bg-muted/30 rounded-lg border border-dashed border-border">
            No upcoming sessions.
          </div>
        </div>
      </div>
    </div>
  );
}
