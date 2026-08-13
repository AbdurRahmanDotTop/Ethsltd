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

  const onSubmit = async (data: ChangePasswordInput) => {
    try {
      setGlobalError("");
      setSuccess("");
      await apiClient.changePassword(data);
      if (data.revokeSessions) {
        await apiClient.revokeAllSessions();
      }
      setSuccess("Your password has been changed successfully.");
      reset({ currentPassword: "", newPassword: "", confirmNewPassword: "", revokeSessions: true });
    } catch (err: any) {
      setGlobalError(err.message || "An error occurred.");
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
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Password"
              )}
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
          <div className="px-3 py-1 bg-muted text-muted-foreground text-xs font-semibold rounded-full uppercase tracking-wider">
            Not Enabled
          </div>
        </div>

        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900/50 rounded-lg flex gap-3 mb-6">
          <ShieldAlert className="w-5 h-5 text-yellow-600 dark:text-yellow-500 shrink-0" />
          <p className="text-sm text-yellow-800 dark:text-yellow-400">
            We highly recommend enabling 2FA to protect your assets. Once enabled, you'll need both your password and an authentication code to log in.
          </p>
        </div>

        <Button>Enable 2FA</Button>
      </div>
    </div>
  );
}
