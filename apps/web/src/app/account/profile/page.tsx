"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, User } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { apiClient } from "@ethsltd/api-client";
import { profileSchema, ProfileInput } from "@/lib/validation/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore();
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [otpSuccess, setOtpSuccess] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: user?.displayName || "",
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        displayName: user.displayName || "",
        firstName: user.firstName || "",
        lastName: user.lastName || "",
      });
    }
  }, [user, reset]);

  if (!user) return null;

  const onSubmit = async (data: ProfileInput) => {
    try {
      setError("");
      setSuccess("");
      const updated = await apiClient.updateProfile(data);
      if (updated.success && updated.data) {
        updateUser(updated.data);
        setSuccess("Profile updated successfully.");
      } else {
        setError(updated.error || "Failed to update profile.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to update profile.");
    }
  };

  const handleRequestOTP = async () => {
    try {
      setOtpError("");
      setOtpSuccess("");
      setOtpLoading(true);
      const res = await apiClient.requestEmailVerificationOTP();
      if (res.success) {
        setOtpSuccess(res.message || "OTP sent to your email!");
        setIsVerifyModalOpen(true);
      } else {
        if (isVerifyModalOpen) {
          setOtpError(res.error || "Failed to send OTP.");
        } else {
          setError(res.error || "Failed to send OTP.");
        }
      }
    } catch (err: any) {
      if (isVerifyModalOpen) {
        setOtpError(err.message || "Error requesting OTP.");
      } else {
        setError(err.message || "Error requesting OTP.");
      }
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp) {
      setOtpError("Please enter the 6-digit OTP.");
      return;
    }
    try {
      setOtpError("");
      setOtpLoading(true);
      const res = await apiClient.confirmEmailVerificationOTP(otp);
      if (res.success) {
        updateUser({ ...user, emailVerified: true });
        setIsVerifyModalOpen(false);
        setSuccess("Email successfully verified!");
        setOtp("");
      } else {
        setOtpError(res.error || "Invalid OTP.");
      }
    } catch (err: any) {
      setOtpError(err.message || "Error verifying OTP.");
    } finally {
      setOtpLoading(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight mb-2">Profile</h1>
        <p className="text-muted-foreground">Manage your personal information and public display name.</p>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-8">
          <div className="w-20 h-20 rounded-full bg-muted border border-border flex items-center justify-center overflow-hidden">
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <User className="w-8 h-8 text-muted-foreground" />
            )}
          </div>
          <div className="space-y-2">
            <h3 className="font-medium">Profile Photo</h3>
            <div className="flex gap-2">
              <Button type="button" variant="outline" size="sm">Upload new</Button>
              <Button type="button" variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10">Remove</Button>
            </div>
            <p className="text-xs text-muted-foreground">JPG, PNG or WebP. Max size 2MB.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {success && (
            <div className="p-3 rounded-md bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-sm font-medium">
              {success}
            </div>
          )}
          {error && (
            <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm font-medium">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label>Email Address</Label>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-md border border-border bg-muted/50 gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 overflow-hidden">
                <span className="text-sm font-medium truncate" title={user.email}>{user.email}</span>
                {user.emailVerified ? (
                  <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2.5 py-0.5 rounded-full font-semibold border border-green-200 dark:border-green-800 w-fit shrink-0">
                    Verified
                  </span>
                ) : (
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-2.5 py-0.5 rounded-full font-semibold border border-red-200 dark:border-red-800">
                      Unverified
                    </span>
                    <Button type="button" size="sm" variant="secondary" className="h-6 text-xs px-2" onClick={handleRequestOTP} disabled={otpLoading}>
                      Verify Now
                    </Button>
                  </div>
                )}
              </div>
              <Button type="button" variant="link" className="h-auto p-0 text-sm text-muted-foreground hover:text-foreground shrink-0 self-start sm:self-center">Change email</Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="displayName">Display Name</Label>
            <Input id="displayName" {...register("displayName")} className={errors.displayName ? "border-destructive" : ""} />
            <p className="text-xs text-muted-foreground">This is how you will appear to other users on the platform.</p>
            {errors.displayName && <p className="text-xs text-destructive">{errors.displayName.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" {...register("firstName")} className={errors.firstName ? "border-destructive" : ""} />
              {errors.firstName && <p className="text-xs text-destructive">{errors.firstName.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" {...register("lastName")} className={errors.lastName ? "border-destructive" : ""} />
              {errors.lastName && <p className="text-xs text-destructive">{errors.lastName.message}</p>}
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </div>

      <Dialog open={isVerifyModalOpen} onOpenChange={(open) => {
        setIsVerifyModalOpen(open);
        if (!open) {
          setOtp("");
          setOtpError("");
          setOtpSuccess("");
        }
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Verify your email</DialogTitle>
            <DialogDescription>
              We've sent a 6-digit code to <strong>{user.email}</strong>. The code expires in 15 minutes.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {otpSuccess && <p className="text-sm text-green-600 dark:text-green-400 font-medium">{otpSuccess}</p>}
            {otpError && <p className="text-sm text-destructive font-medium">{otpError}</p>}
            <div className="space-y-2">
              <Label htmlFor="otp">Verification Code</Label>
              <Input
                id="otp"
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                className="text-center text-lg tracking-widest font-mono"
                maxLength={6}
              />
            </div>
          </div>
          <DialogFooter className="sm:justify-between">
            <Button type="button" variant="ghost" onClick={() => handleRequestOTP()} disabled={otpLoading}>
              Resend Code
            </Button>
            <Button type="button" onClick={handleVerifyOTP} disabled={otpLoading || otp.length !== 6}>
              {otpLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Verify Email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
