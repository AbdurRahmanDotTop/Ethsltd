"use client";

import { useState } from "react";
import { CheckCircle2, XCircle, Clock, MoreVertical, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ExpertBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]); // Will be fetched from API

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING_EXPERT':
        return <span className="bg-orange-500/10 text-orange-600 px-2 py-1 rounded-full text-xs font-medium">Pending Action</span>;
      case 'SCHEDULED':
        return <span className="bg-blue-500/10 text-blue-600 px-2 py-1 rounded-full text-xs font-medium">Scheduled</span>;
      case 'COMPLETED':
        return <span className="bg-green-500/10 text-green-600 px-2 py-1 rounded-full text-xs font-medium">Completed</span>;
      case 'CANCELLED':
        return <span className="bg-red-500/10 text-red-600 px-2 py-1 rounded-full text-xs font-medium">Cancelled</span>;
      default:
        return <span className="bg-muted text-muted-foreground px-2 py-1 rounded-full text-xs font-medium">{status}</span>;
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">Bookings</h1>
        <p className="text-muted-foreground mt-1">Manage your customer bookings and sessions.</p>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {bookings.length > 0 ? (
          <div className="divide-y divide-border">
            {bookings.map((booking) => (
              <div key={booking.id} className="p-6 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-semibold text-lg">{booking.serviceTitle}</h3>
                    {getStatusBadge(booking.status)}
                  </div>
                  <div className="text-sm text-muted-foreground flex items-center gap-4">
                    <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {new Date(booking.scheduledAt).toLocaleString()}</span>
                    <span>{booking.price} {booking.currency}</span>
                    <span>Customer: {booking.userId}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Chat
                  </Button>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 px-4">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1">No bookings yet</h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              When customers book your services, they will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
