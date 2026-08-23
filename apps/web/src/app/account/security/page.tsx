"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2, ShieldAlert } from "lucide-react";
import { apiClient } from "@ethsltd/api-client";
import { changePasswordSchema, ChangePasswordInput } from "@/lib/validation/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordStrength } from "@/components/auth/PasswordStrength";
import { useAuthStore } from "@/stores/auth-store";

export default function SecurityPage() {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [globalError, setGlobalError] = useState("");
  const [success, setSuccess] = useState("");

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      revokeSessions: true,
    },
  });

  const passwordValue = useWatch({ control, name: "newPassword" });

  const [isMfaLoading, setIsMfaLoading] = useState(false);
  const [mfaToken, setMfaToken] = useState("");
  const [mfaData, setMfaData] = useState<{ secret: string; qrCodeUrl: string } | null>(null);
  const [mfaError, setMfaError] = useState("");
  const { user, updateUser } = useAuthStore();

  const onSubmit = async (data: ChangePasswordInput) => {
    try {
      setGlobalError("");
      setSuccess("");
      await apiClient.changePassword(data);
      if (data.revokeSessions) {
        await apiClient.revokeAllOtherSessions();
      }
      setSuccess("Your password has been changed successfully.");
      reset({ currentPassword: "", newPassword: "", confirmNewPassword: "", revokeSessions: true });
    } catch (err: any) {
      setGlobalError(err.message || "An error occurred.");
    }
  };

  const handleGenerateMfa = async () => {
    setIsMfaLoading(true);
    setMfaError("");
    try {
      const res = await apiClient.generateMfa();
      if (res.success && res.data) {
        setMfaData(res.data);
      } else {
        setMfaError("Failed to generate MFA secret");
      }
    } catch (err: any) {
      setMfaError(err.message || "Failed to generate MFA secret");
    } finally {
      setIsMfaLoading(false);
    }
  };

  const handleEnableMfa = async () => {
    setIsMfaLoading(true);
    setMfaError("");
    try {
      const res = await apiClient.enableMfa(mfaToken);
      if (res.success) {
        setSuccess("Two-factor authentication enabled successfully.");
        setMfaData(null);
        setMfaToken("");
        if (user) updateUser({ ...user, mfaEnabled: true });
      } else {
        setMfaError(res.error || "Invalid 2FA code");
      }
    } catch (err: any) {
      setMfaError(err.message || "Invalid 2FA code");
    } finally {
      setIsMfaLoading(false);
    }
  };

  const handleDisableMfa = async () => {
    setIsMfaLoading(true);
    setMfaError("");
    try {
      const res = await apiClient.disableMfa(mfaToken);
      if (res.success) {
        setSuccess("Two-factor authentication disabled successfully.");
        setMfaToken("");
        if (user) updateUser({ ...user, mfaEnabled: false });
      } else {
        setMfaError(res.error || "Invalid 2FA code");
      }
    } catch (err: any) {
      setMfaError(err.message || "Invalid 2FA code");
    } finally {
      setIsMfaLoading(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight mb-2">Security</h1>
        <p className="text-muted-foreground">Manage your account security and authentication methods.</p>
      </div>

      {/* Change Password */}
      <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-6">Change Password</h3>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {success && (
            <div className="p-3 rounded-md bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-sm font-medium">
              {success}
            </div>
          )}
          {globalError && (
            <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm font-medium">
              {globalError}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current password</Label>
            <div className="relative">
              <Input
                id="currentPassword"
                type={showCurrent ? "text" : "password"}
                {...register("currentPassword")}
                className={errors.currentPassword ? "border-destructive pr-10" : "pr-10"}
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.currentPassword && <p className="text-xs text-destructive">{errors.currentPassword.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">New password</Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showNew ? "text" : "password"}
                {...register("newPassword")}
                className={errors.newPassword ? "border-destructive pr-10" : "pr-10"}
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <PasswordStrength password={passwordValue} />
            {errors.newPassword && <p className="text-xs text-destructive">{errors.newPassword.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmNewPassword">Confirm new password</Label>
            <div className="relative">
              <Input
                id="confirmNewPassword"
                type={showConfirm ? "text" : "password"}
                {...register("confirmNewPassword")}
                className={errors.confirmNewPassword ? "border-destructive pr-10" : "pr-10"}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.confirmNewPassword && <p className="text-xs text-destructive">{errors.confirmNewPassword.message}</p>}
          </div>

          <div className="flex items-start gap-2 pt-2">
            <input
              type="checkbox"
              id="revokeSessions"
              className="mt-1 rounded border-input bg-background text-brand-foreground focus:ring-brand-foreground h-4 w-4 shrink-0"
              {...register("revokeSessions")}
            />
            <div className="space-y-1">
              <Label htmlFor="revokeSessions" className="font-normal text-muted-foreground text-sm">
                Log out of all other devices
              </Label>
              <p className="text-xs text-muted-foreground">Checking this will invalidate all other active sessions for security.</p>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <Button type="submit" isLoading={isSubmitting} loadingText="Updating...">
              Update Password
            </Button>
          </div>
        </form>
      </div>

        {/* Two-Factor Authentication */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-lg font-semibold mb-1">Two-factor authentication (2FA)</h3>
            <p className="text-sm text-muted-foreground">Add an extra layer of security to your account.</p>
          </div>
          <div className={`px-3 py-1 text-xs font-semibold rounded-full uppercase tracking-wider ${
            user?.mfaEnabled 
              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" 
              : "bg-muted text-muted-foreground"
          }`}>
            {user?.mfaEnabled ? "Enabled" : "Not Enabled"}
          </div>
        </div>

        {user?.mfaEnabled ? (
          <div>
            <p className="text-sm text-muted-foreground mb-4">Your account is currently protected by two-factor authentication.</p>
            <div className="flex gap-2 items-center">
              <Input 
                placeholder="Enter 6-digit code to disable" 
                value={mfaToken} 
                onChange={(e) => setMfaToken(e.target.value)} 
                className="max-w-[250px]"
              />
              <Button variant="destructive" onClick={handleDisableMfa} disabled={!mfaToken} isLoading={isMfaLoading} loadingText="Disabling...">
                Disable 2FA
              </Button>
            </div>
            {mfaError && <p className="text-destructive text-sm mt-2">{mfaError}</p>}
          </div>
        ) : (
          <>
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900/50 rounded-lg flex gap-3 mb-6">
              <ShieldAlert className="w-5 h-5 text-yellow-600 dark:text-yellow-500 shrink-0" />
              <p className="text-sm text-yellow-800 dark:text-yellow-400">
                We highly recommend enabling 2FA to protect your assets. Once enabled, you'll need both your password and an authentication code to log in.
              </p>
            </div>

            {!mfaData ? (
              <Button onClick={handleGenerateMfa} isLoading={isMfaLoading} loadingText="Generating...">
                Enable 2FA
              </Button>
            ) : (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                <div>
                  <h4 className="font-semibold mb-2">1. Scan QR Code</h4>
                  <p className="text-sm text-muted-foreground mb-4">Scan this QR code with your authenticator app (like Google Authenticator or Authy).</p>
                  <div className="bg-white p-4 inline-block rounded-xl border">
                    <img src={mfaData.qrCodeUrl} alt="2FA QR Code" className="w-40 h-40" />
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Or enter this code manually: <strong className="select-all">{mfaData.secret}</strong>
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">2. Verify Code</h4>
                  <p className="text-sm text-muted-foreground mb-4">Enter the 6-digit code from your app to verify setup.</p>
                  <div className="flex gap-2 items-center">
                    <Input 
                      placeholder="000000" 
                      value={mfaToken} 
                      onChange={(e) => setMfaToken(e.target.value)} 
                      maxLength={6}
                      className="max-w-[200px]"
                    />
                    <Button onClick={handleEnableMfa} disabled={!mfaToken || mfaToken.length < 6} isLoading={isMfaLoading} loadingText="Verifying...">
                      Verify & Enable
                    </Button>
                    <Button variant="ghost" onClick={() => setMfaData(null)}>Cancel</Button>
                  </div>
                  {mfaError && <p className="text-destructive text-sm mt-2">{mfaError}</p>}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
