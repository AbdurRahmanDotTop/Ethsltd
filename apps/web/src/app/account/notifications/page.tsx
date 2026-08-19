"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function NotificationsPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState("");

  const handleSave = () => {
    setIsSaving(true);
    setSuccess("");
    setTimeout(() => {
      setIsSaving(false);
      setSuccess("Notification preferences saved successfully.");
    }, 600);
  };

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight mb-2">Notifications</h1>
        <p className="text-muted-foreground">Manage how and when ETHSLTD contacts you.</p>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-8">
        
        {/* Security Alerts */}
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold">Security Alerts</h3>
              <p className="text-sm text-muted-foreground mt-1">We will always notify you of critical security events to protect your account.</p>
            </div>
          </div>
          
          <div className="space-y-4 pt-4 border-t border-border">
            <div className="flex items-center justify-between flex-wrap gap-y-4">
              <div>
                <p className="font-medium">New login alerts</p>
                <p className="text-sm text-muted-foreground">When your account is accessed from a new device or location.</p>
              </div>
              <input type="checkbox" checked disabled className="rounded border-input text-brand-foreground h-5 w-5 opacity-50" />
            </div>
            
            <div className="flex items-center justify-between flex-wrap gap-y-4">
              <div>
                <p className="font-medium">Account changes</p>
                <p className="text-sm text-muted-foreground">When your password, email, or 2FA settings are changed.</p>
              </div>
              <input type="checkbox" checked disabled className="rounded border-input text-brand-foreground h-5 w-5 opacity-50" />
            </div>
          </div>
        </div>

        <div className="w-full h-px bg-border" />

        {/* Trading Notifications */}
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold">Trading Activity</h3>
              <p className="text-sm text-muted-foreground mt-1">Updates regarding your orders and portfolio.</p>
            </div>
          </div>
          
          <div className="space-y-4 pt-4 border-t border-border">
            <div className="flex items-center justify-between flex-wrap gap-y-4">
              <div>
                <p className="font-medium">Order filled</p>
                <p className="text-sm text-muted-foreground">When your limit or stop orders are executed.</p>
              </div>
              <input type="checkbox" defaultChecked className="rounded border-input text-brand-foreground focus:ring-brand-foreground h-5 w-5" />
            </div>
            
            <div className="flex items-center justify-between flex-wrap gap-y-4">
              <div>
                <p className="font-medium">Price alerts</p>
                <p className="text-sm text-muted-foreground">When assets on your watchlist experience significant volatility.</p>
              </div>
              <input type="checkbox" className="rounded border-input text-brand-foreground focus:ring-brand-foreground h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="w-full h-px bg-border" />

        {/* Marketing Notifications */}
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold">Product & News</h3>
              <p className="text-sm text-muted-foreground mt-1">Stay updated with ETHSLTD announcements.</p>
            </div>
          </div>
          
          <div className="space-y-4 pt-4 border-t border-border">
            <div className="flex items-center justify-between flex-wrap gap-y-4">
              <div>
                <p className="font-medium">Product updates</p>
                <p className="text-sm text-muted-foreground">New features, pairs, and platform improvements.</p>
              </div>
              <input type="checkbox" className="rounded border-input text-brand-foreground focus:ring-brand-foreground h-5 w-5" />
            </div>
            
            <div className="flex items-center justify-between flex-wrap gap-y-4">
              <div>
                <p className="font-medium">Market insights</p>
                <p className="text-sm text-muted-foreground">Weekly market recaps and educational content.</p>
              </div>
              <input type="checkbox" className="rounded border-input text-brand-foreground focus:ring-brand-foreground h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="pt-6 flex items-center justify-between border-t border-border flex-wrap gap-y-4">
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
  );
}
