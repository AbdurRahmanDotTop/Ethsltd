"use client";

import { useState } from "react";
import { 
  Settings, Shield, Server, Coins, Check, X, 
  Save, AlertCircle, RefreshCw, KeyRound, Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState("platform");
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    maintenanceMode: false,
    tradingEnabled: true,
    userRegistration: true,
    baseCurrency: "USD",
    makerFee: "0.1",
    takerFee: "0.2",
    dailyWithdrawalLimit: "50000",
    minDeposit: "10",
    requireAdmin2FA: true,
    sessionTimeout: "30",
    ipWhitelist: "",
    maxFailedLogins: "5",
    globalApiStatus: true,
    apiRateLimit: "100"
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleSave = () => {
    setIsSaving(true);
    setSaved(false);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 1500);
  };

  // Custom Switch Component
  const CustomSwitch = ({ checked, onChange, label, description }: { checked: boolean, onChange: (c: boolean) => void, label: string, description?: string }) => (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="text-sm font-medium">{label}</p>
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 focus:ring-offset-background ${
          checked ? 'bg-brand-primary' : 'bg-muted'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">System Settings</h1>
          <p className="text-muted-foreground mt-1 text-sm">Manage global platform configurations and rules.</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving} className="w-full sm:w-auto">
          {isSaving ? (
            <><RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Saving...</>
          ) : saved ? (
            <><Check className="w-4 h-4 mr-2 text-green-500" /> Saved</>
          ) : (
            <><Save className="w-4 h-4 mr-2" /> Save Changes</>
          )}
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Navigation Sidebar */}
        <div className="w-full lg:w-64 flex flex-col gap-1 bg-card border border-border p-2 rounded-xl sticky top-24">
          {[
            { id: "platform", label: "Platform", icon: Server },
            { id: "fees", label: "Fees & Limits", icon: Coins },
            { id: "security", label: "Security & Access", icon: Shield },
            { id: "api", label: "API & Webhooks", icon: Globe },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id 
                    ? "bg-brand-primary/10 text-brand-primary" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 w-full space-y-6">
          
          {/* PLATFORM SETTINGS */}
          {activeTab === "platform" && (
            <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2">
              <div className="px-6 py-4 border-b border-border bg-muted/20">
                <h3 className="text-lg font-medium">Platform Controls</h3>
                <p className="text-sm text-muted-foreground">Manage core system availability and behavior.</p>
              </div>
              <div className="p-6 space-y-4 divide-y divide-border">
                <CustomSwitch 
                  label="Maintenance Mode" 
                  description="Disable access for all non-admin users. Displays a maintenance page."
                  checked={formData.maintenanceMode} 
                  onChange={(c) => handleInputChange('maintenanceMode', c)} 
                />
                <CustomSwitch 
                  label="Trading Engine Active" 
                  description="Allow users to place new spot and margin orders."
                  checked={formData.tradingEnabled} 
                  onChange={(c) => handleInputChange('tradingEnabled', c)} 
                />
                <CustomSwitch 
                  label="User Registrations" 
                  description="Allow new users to sign up for accounts."
                  checked={formData.userRegistration} 
                  onChange={(c) => handleInputChange('userRegistration', c)} 
                />
                <div className="py-4">
                  <label className="text-sm font-medium block mb-2">Platform Base Currency</label>
                  <select 
                    value={formData.baseCurrency}
                    onChange={(e) => handleInputChange('baseCurrency', e.target.value)}
                    className="w-full sm:w-64 bg-background border border-border rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-brand-primary outline-none"
                  >
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* FEES & LIMITS */}
          {activeTab === "fees" && (
            <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2">
              <div className="px-6 py-4 border-b border-border bg-muted/20">
                <h3 className="text-lg font-medium">Fees & Limits</h3>
                <p className="text-sm text-muted-foreground">Configure global trading fees and transaction limits.</p>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Default Maker Fee (%)</label>
                  <input 
                    type="number" step="0.01" 
                    value={formData.makerFee}
                    onChange={(e) => handleInputChange('makerFee', e.target.value)}
                    className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-brand-primary outline-none" 
                  />
                  <p className="text-xs text-muted-foreground">Fee charged for limit orders.</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Default Taker Fee (%)</label>
                  <input 
                    type="number" step="0.01" 
                    value={formData.takerFee}
                    onChange={(e) => handleInputChange('takerFee', e.target.value)}
                    className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-brand-primary outline-none" 
                  />
                  <p className="text-xs text-muted-foreground">Fee charged for market orders.</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Daily Withdrawal Limit (USD Eq.)</label>
                  <input 
                    type="number" 
                    value={formData.dailyWithdrawalLimit}
                    onChange={(e) => handleInputChange('dailyWithdrawalLimit', e.target.value)}
                    className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-brand-primary outline-none" 
                  />
                  <p className="text-xs text-muted-foreground">Maximum withdrawal amount per user (KYC Level 1).</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Minimum Deposit Amount (USD Eq.)</label>
                  <input 
                    type="number" 
                    value={formData.minDeposit}
                    onChange={(e) => handleInputChange('minDeposit', e.target.value)}
                    className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-brand-primary outline-none" 
                  />
                </div>
              </div>
            </div>
          )}

          {/* SECURITY & ACCESS */}
          {activeTab === "security" && (
            <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2">
              <div className="px-6 py-4 border-b border-border bg-muted/20">
                <h3 className="text-lg font-medium">Security & Admin Access</h3>
                <p className="text-sm text-muted-foreground">Control authentication requirements and access policies.</p>
              </div>
              <div className="p-6 space-y-4 divide-y divide-border">
                <CustomSwitch 
                  label="Enforce Admin 2FA" 
                  description="Require all administrators to use Two-Factor Authentication."
                  checked={formData.requireAdmin2FA} 
                  onChange={(c) => handleInputChange('requireAdmin2FA', c)} 
                />
                
                <div className="py-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Session Timeout (Minutes)</label>
                    <input 
                      type="number" 
                      value={formData.sessionTimeout}
                      onChange={(e) => handleInputChange('sessionTimeout', e.target.value)}
                      className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-brand-primary outline-none" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Max Failed Login Attempts</label>
                    <input 
                      type="number" 
                      value={formData.maxFailedLogins}
                      onChange={(e) => handleInputChange('maxFailedLogins', e.target.value)}
                      className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-brand-primary outline-none" 
                    />
                  </div>
                </div>

                <div className="py-4 space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <KeyRound className="w-4 h-4 text-muted-foreground" />
                    Admin IP Whitelist
                  </label>
                  <p className="text-xs text-muted-foreground mb-2">Enter one IP address per line. Leave blank to allow access from anywhere.</p>
                  <textarea 
                    rows={4}
                    value={formData.ipWhitelist}
                    onChange={(e) => handleInputChange('ipWhitelist', e.target.value)}
                    placeholder="e.g. 192.168.1.1&#10;10.0.0.5"
                    className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-brand-primary outline-none font-mono"
                  ></textarea>
                </div>
              </div>
            </div>
          )}

          {/* API & WEBHOOKS */}
          {activeTab === "api" && (
            <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2">
              <div className="px-6 py-4 border-b border-border bg-muted/20">
                <h3 className="text-lg font-medium">API & Integrations</h3>
                <p className="text-sm text-muted-foreground">Manage public and partner API endpoints.</p>
              </div>
              <div className="p-6 space-y-4 divide-y divide-border">
                <CustomSwitch 
                  label="Global API Access" 
                  description="Enable or disable external API usage completely."
                  checked={formData.globalApiStatus} 
                  onChange={(c) => handleInputChange('globalApiStatus', c)} 
                />
                
                <div className="py-4 space-y-2">
                  <label className="text-sm font-medium">Default Rate Limit (req/min)</label>
                  <input 
                    type="number" 
                    value={formData.apiRateLimit}
                    onChange={(e) => handleInputChange('apiRateLimit', e.target.value)}
                    className="w-full sm:w-64 bg-background border border-border rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-brand-primary outline-none" 
                  />
                </div>

                <div className="py-4">
                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 flex gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-yellow-500">API Documentation Required</h4>
                      <p className="text-xs text-muted-foreground mt-1">Changes to API limits will affect active algorithmic traders. Ensure clients are notified before reducing limits.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
