"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function PreferencesPage() {
  const { theme, setTheme } = useTheme();
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState("");

  const handleSave = () => {
    setIsSaving(true);
    setSuccess("");
    // Simulate API call to save preferences
    setTimeout(() => {
      setIsSaving(false);
      setSuccess("Preferences updated successfully.");
    }, 600);
  };

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight mb-2">Preferences</h1>
        <p className="text-muted-foreground">Customize your ETHSLTD experience.</p>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-8">
        
        {/* Appearance */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Appearance</h3>
          <div className="space-y-2">
            <Label>Theme</Label>
            <div className="grid grid-cols-3 gap-2 mt-2">
              <button
                onClick={() => setTheme("light")}
                className={`flex flex-col items-center justify-center p-4 rounded-md border-2 transition-all ${
                  theme === "light" ? "border-primary bg-primary dark:bg-transparent" : "border-border hover:border-muted-foreground"
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-white border border-gray-200 shadow-sm mb-2" />
                <span className="text-sm font-medium">Light</span>
              </button>
              <button
                onClick={() => setTheme("dark")}
                className={`flex flex-col items-center justify-center p-4 rounded-md border-2 transition-all ${
                  theme === "dark" ? "border-primary bg-primary/10" : "border-border hover:border-muted-foreground"
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-700 shadow-sm mb-2" />
                <span className="text-sm font-medium">Dark</span>
              </button>
              <button
                onClick={() => setTheme("system")}
                className={`flex flex-col items-center justify-center p-4 rounded-md border-2 transition-all ${
                  theme === "system" ? "border-primary bg-primary dark:bg-primary/10" : "border-border hover:border-muted-foreground"
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-zinc-900 to-white border border-gray-300 dark:border-zinc-700 shadow-sm mb-2" />
                <span className="text-sm font-medium">System</span>
              </button>
            </div>
          </div>
        </div>

        <div className="w-full h-px bg-border" />

        {/* Currency & Region */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Regional Settings</h3>
          
          <div className="space-y-2">
            <Label>Display Currency</Label>
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              disabled
              defaultValue="USD"
            >
              <option value="USD">USD — US Dollar</option>
            </select>
            <p className="text-xs text-muted-foreground">ETHSLTD currently only supports USD as the primary display currency.</p>
          </div>

          <div className="space-y-2 mt-4">
            <Label>Language</Label>
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              defaultValue="en"
            >
              <option value="en">English</option>
            </select>
          </div>
          
          <div className="space-y-2 mt-4">
            <Label>Time Zone</Label>
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              defaultValue="auto"
            >
              <option value="auto">Automatic (Use device time zone)</option>
            </select>
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
