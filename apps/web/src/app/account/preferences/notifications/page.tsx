"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useNotificationStore } from "@/stores/notification-store";

export default function NotificationPreferencesPage() {
  const { settings, updateSettings } = useNotificationStore();
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState("");

  const handleSave = () => {
    setIsSaving(true);
    setSuccess("");
    setTimeout(() => {
      setIsSaving(false);
      setSuccess("Notification preferences updated successfully.");
    }, 600);
  };

  const handleToggle = (category: keyof typeof settings, channel: "inApp" | "email" | "push") => {
    if (category === "security") return; // Security cannot be toggled
    if (category === "quietHours") return; // Handled separately

    updateSettings({
      [category]: {
        ...(settings[category] as any),
        [channel]: !(settings[category] as any)[channel],
      }
    });
  };

  const categories = [
    { id: "security", label: "Security alerts", desc: "Logins, password changes, and critical security events." },
    { id: "trading", label: "Trade updates", desc: "Order fills, partial fills, and cancellations." },
    { id: "wallet", label: "Wallet activity", desc: "Deposits, withdrawals, and balance changes." },
    { id: "p2p", label: "P2P marketplace", desc: "Order updates, payments, and disputes." },
    { id: "system", label: "System announcements", desc: "Maintenance windows and system status." },
    { id: "marketing", label: "Marketing & Promos", desc: "News, offers, and fee discounts." },
  ] as const;

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight mb-2">Notification Preferences</h1>
        <p className="text-muted-foreground">Control how and when you receive alerts from ETHSLTD.</p>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-semibold text-foreground">Notification</th>
                <th className="px-6 py-4 font-semibold text-foreground text-center">In-App</th>
                <th className="px-6 py-4 font-semibold text-foreground text-center">Email</th>
                <th className="px-6 py-4 font-semibold text-foreground text-center">Push</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {categories.map((cat) => {
                const prefs = settings[cat.id] as any;
                const isSecurity = cat.id === "security";

                return (
                  <tr key={cat.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-foreground">{cat.label}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{cat.desc}</div>
                      {isSecurity && (
                        <div className="text-[10px] text-brand-primary mt-1 font-medium bg-brand-primary/10 inline-block px-1.5 py-0.5 rounded">Always On</div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <input 
                        type="checkbox" 
                        checked={prefs.inApp}
                        onChange={() => handleToggle(cat.id, "inApp")}
                        disabled={isSecurity}
                        className="w-4 h-4 rounded border-input text-brand-primary focus:ring-brand-primary disabled:opacity-50"
                      />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <input 
                        type="checkbox" 
                        checked={prefs.email}
                        onChange={() => handleToggle(cat.id, "email")}
                        disabled={isSecurity}
                        className="w-4 h-4 rounded border-input text-brand-primary focus:ring-brand-primary disabled:opacity-50"
                      />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <input 
                        type="checkbox" 
                        checked={prefs.push}
                        onChange={() => handleToggle(cat.id, "push")}
                        disabled={isSecurity}
                        className="w-4 h-4 rounded border-input text-brand-primary focus:ring-brand-primary disabled:opacity-50"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="p-6 border-t border-border bg-muted/10 space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Quiet Hours</h3>
            <p className="text-xs text-muted-foreground">Silence non-critical push notifications during specific hours.</p>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={settings.quietHours.enabled}
                  onChange={(e) => updateSettings({ quietHours: { ...settings.quietHours, enabled: e.target.checked } })}
                  className="w-4 h-4 rounded border-input text-brand-primary focus:ring-brand-primary"
                />
                <span className="text-sm font-medium">Enable Quiet Hours</span>
              </label>
            </div>
            {settings.quietHours.enabled && (
              <div className="flex items-center gap-4 mt-2">
                <div className="space-y-1">
                  <Label className="text-xs">From</Label>
                  <input 
                    type="time" 
                    value={settings.quietHours.start}
                    onChange={(e) => updateSettings({ quietHours: { ...settings.quietHours, start: e.target.value } })}
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-primary"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">To</Label>
                  <input 
                    type="time" 
                    value={settings.quietHours.end}
                    onChange={(e) => updateSettings({ quietHours: { ...settings.quietHours, end: e.target.value } })}
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-primary"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="pt-6 flex items-center justify-between border-t border-border">
            <div className="text-sm font-medium text-green-600 dark:text-green-500">
              {success && success}
            </div>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Preferences"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
