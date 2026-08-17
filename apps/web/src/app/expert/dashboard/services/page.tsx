"use client";

import { useState } from "react";
import { Plus, MoreVertical, Edit2, Pause, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ExpertServicesPage() {
  const [services, setServices] = useState<any[]>([]); // Will be fetched from API

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">My Services</h1>
          <p className="text-muted-foreground mt-1">Manage your service offerings and pricing.</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create Service
        </Button>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {services.length > 0 ? (
          <div className="divide-y divide-border">
            {services.map((service) => (
              <div key={service.id} className="p-6 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">{service.title}</h3>
                  <div className="text-sm text-muted-foreground mt-1 flex gap-4">
                    <span>{service.durationMinutes} mins</span>
                    <span>{service.price} {service.currency}</span>
                    <span>{service.category}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    service.status === 'ACTIVE' ? 'bg-green-500/10 text-green-600' : 'bg-muted text-muted-foreground'
                  }`}>
                    {service.status}
                  </span>
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
              <Plus className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1">No services yet</h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              Create your first service offering to start getting booked by customers.
            </p>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Service
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
