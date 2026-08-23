"use client";

import { useState, useEffect } from "react";
import { Coins, Check, Save, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiClient } from "@ethsltd/api-client";

export default function FeesAndLimitsPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  const [formData, setFormData] = useState({
    makerFee: "0.1",
    takerFee: "0.2",
    dailyWithdrawalLimit: "50000",
    minDeposit: "10",
    minWithdrawal: "10",
    withdrawalFeeType: "FIXED",
    withdrawalFeeAmount: "0",
    withdrawalFeePercentage: "0",
    depositFeeType: "PERCENTAGE",
    depositFeeAmount: "0",
    depositFeePercentage: "0",
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const res = await apiClient.adminGetPlatformSettings();
      if (res.success && res.data) {
        const newForm = { ...formData };
        res.data.forEach((s: any) => {
          if (s.key === 'MIN_WITHDRAWAL' || s.key === 'DAILY_WITHDRAWAL_LIMIT' || s.key === 'MIN_DEPOSIT') {
            const parsed = parseJsonSafely(s.value);
            if (parsed && typeof parsed.amount !== 'undefined') newForm[s.key === 'MIN_WITHDRAWAL' ? 'minWithdrawal' : s.key === 'DAILY_WITHDRAWAL_LIMIT' ? 'dailyWithdrawalLimit' : 'minDeposit'] = parsed.amount.toString();
            else newForm[s.key === 'MIN_WITHDRAWAL' ? 'minWithdrawal' : s.key === 'DAILY_WITHDRAWAL_LIMIT' ? 'dailyWithdrawalLimit' : 'minDeposit'] = s.value;
          }
          if (s.key === 'WITHDRAWAL_FEE' || s.key === 'DEPOSIT_FEE') {
            const parsed = parseJsonSafely(s.value);
            const prefix = s.key === 'WITHDRAWAL_FEE' ? 'withdrawalFee' : 'depositFee';
            if (parsed) {
              (newForm as any)[`${prefix}Type`] = parsed.type || 'FIXED';
              (newForm as any)[`${prefix}Amount`] = parsed.amount?.toString() || '0';
              (newForm as any)[`${prefix}Percentage`] = parsed.percentage?.toString() || '0';
            }
          }
          if (s.key === 'TRADING_FEE_MAKER') newForm.makerFee = parseJsonSafely(s.value)?.percentage?.toString() || s.value;
          if (s.key === 'TRADING_FEE_TAKER') newForm.takerFee = parseJsonSafely(s.value)?.percentage?.toString() || s.value;
        });
        setFormData(newForm);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const parseJsonSafely = (str: string) => {
    try { return JSON.parse(str); } catch { return null; }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaved(false);
    try {
      const updates = [
        apiClient.adminUpdatePlatformSetting('MIN_WITHDRAWAL', { value: JSON.stringify({ amount: parseFloat(formData.minWithdrawal) }) }),
        apiClient.adminUpdatePlatformSetting('DAILY_WITHDRAWAL_LIMIT', { value: JSON.stringify({ amount: parseFloat(formData.dailyWithdrawalLimit) }) }),
        apiClient.adminUpdatePlatformSetting('MIN_DEPOSIT', { value: JSON.stringify({ amount: parseFloat(formData.minDeposit) }) }),
        apiClient.adminUpdatePlatformSetting('WITHDRAWAL_FEE', { value: JSON.stringify({ 
          type: formData.withdrawalFeeType, 
          amount: parseFloat(formData.withdrawalFeeAmount),
          percentage: parseFloat(formData.withdrawalFeePercentage)
        }) }),
        apiClient.adminUpdatePlatformSetting('DEPOSIT_FEE', { value: JSON.stringify({ 
          type: formData.depositFeeType, 
          amount: parseFloat(formData.depositFeeAmount),
          percentage: parseFloat(formData.depositFeePercentage)
        }) }),
        apiClient.adminUpdatePlatformSetting('TRADING_FEE_MAKER', { value: JSON.stringify({ type: 'PERCENTAGE', percentage: parseFloat(formData.makerFee) }) }),
        apiClient.adminUpdatePlatformSetting('TRADING_FEE_TAKER', { value: JSON.stringify({ type: 'PERCENTAGE', percentage: parseFloat(formData.takerFee) }) }),
      ];
      await Promise.all(updates);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      alert("Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Fees & Limits</h1>
          <p className="text-muted-foreground mt-1 text-sm">Configure global platform fees, trading fees, and transaction limits.</p>
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

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Withdrawal Fee */}
          <div className="space-y-4 p-4 border border-border rounded-lg bg-background/50">
            <h4 className="font-semibold border-b border-border pb-2">Withdrawal Fee</h4>
            <div>
              <label className="text-sm font-medium mb-1 block">Fee Type</label>
              <select 
                value={formData.withdrawalFeeType}
                onChange={(e) => handleInputChange('withdrawalFeeType', e.target.value)}
                className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-brand-primary outline-none"
              >
                <option value="FIXED">Fixed Amount</option>
                <option value="PERCENTAGE">Percentage (%)</option>
                <option value="BOTH">Fixed + Percentage</option>
              </select>
            </div>
            {(formData.withdrawalFeeType === 'FIXED' || formData.withdrawalFeeType === 'BOTH') && (
              <div>
                <label className="text-sm font-medium mb-1 block">Fixed Amount (USDT Eq.)</label>
                <input type="number" step="0.01" value={formData.withdrawalFeeAmount} onChange={(e) => handleInputChange('withdrawalFeeAmount', e.target.value)} className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-brand-primary outline-none" />
              </div>
            )}
            {(formData.withdrawalFeeType === 'PERCENTAGE' || formData.withdrawalFeeType === 'BOTH') && (
              <div>
                <label className="text-sm font-medium mb-1 block">Percentage (%)</label>
                <input type="number" step="0.01" value={formData.withdrawalFeePercentage} onChange={(e) => handleInputChange('withdrawalFeePercentage', e.target.value)} className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-brand-primary outline-none" />
              </div>
            )}
          </div>

          {/* Deposit Fee */}
          <div className="space-y-4 p-4 border border-border rounded-lg bg-background/50">
            <h4 className="font-semibold border-b border-border pb-2">Deposit Fee</h4>
            <div>
              <label className="text-sm font-medium mb-1 block">Fee Type</label>
              <select 
                value={formData.depositFeeType}
                onChange={(e) => handleInputChange('depositFeeType', e.target.value)}
                className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-brand-primary outline-none"
              >
                <option value="FIXED">Fixed Amount</option>
                <option value="PERCENTAGE">Percentage (%)</option>
                <option value="BOTH">Fixed + Percentage</option>
              </select>
            </div>
            {(formData.depositFeeType === 'FIXED' || formData.depositFeeType === 'BOTH') && (
              <div>
                <label className="text-sm font-medium mb-1 block">Fixed Amount (USDT Eq.)</label>
                <input type="number" step="0.01" value={formData.depositFeeAmount} onChange={(e) => handleInputChange('depositFeeAmount', e.target.value)} className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-brand-primary outline-none" />
              </div>
            )}
            {(formData.depositFeeType === 'PERCENTAGE' || formData.depositFeeType === 'BOTH') && (
              <div>
                <label className="text-sm font-medium mb-1 block">Percentage (%)</label>
                <input type="number" step="0.01" value={formData.depositFeePercentage} onChange={(e) => handleInputChange('depositFeePercentage', e.target.value)} className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-brand-primary outline-none" />
              </div>
            )}
          </div>

          {/* Trading Fees */}
          <div className="space-y-4 p-4 border border-border rounded-lg bg-background/50">
            <h4 className="font-semibold border-b border-border pb-2">Trading Fees</h4>
            <div>
              <label className="text-sm font-medium mb-1 block">Maker Fee (%)</label>
              <input type="number" step="0.01" value={formData.makerFee} onChange={(e) => handleInputChange('makerFee', e.target.value)} className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-brand-primary outline-none" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Taker Fee (%)</label>
              <input type="number" step="0.01" value={formData.takerFee} onChange={(e) => handleInputChange('takerFee', e.target.value)} className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-brand-primary outline-none" />
            </div>
          </div>

          {/* Transaction Limits */}
          <div className="space-y-4 p-4 border border-border rounded-lg bg-background/50">
            <h4 className="font-semibold border-b border-border pb-2">Limits</h4>
            <div>
              <label className="text-sm font-medium mb-1 block">Min Withdrawal (USDT Eq.)</label>
              <input type="number" value={formData.minWithdrawal} onChange={(e) => handleInputChange('minWithdrawal', e.target.value)} className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-brand-primary outline-none" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Daily Withdrawal Limit (USDT Eq.)</label>
              <input type="number" value={formData.dailyWithdrawalLimit} onChange={(e) => handleInputChange('dailyWithdrawalLimit', e.target.value)} className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-brand-primary outline-none" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Min Deposit Amount (USDT Eq.)</label>
              <input type="number" value={formData.minDeposit} onChange={(e) => handleInputChange('minDeposit', e.target.value)} className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-brand-primary outline-none" />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
