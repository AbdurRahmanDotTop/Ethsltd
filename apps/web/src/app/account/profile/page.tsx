"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, User } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { MockAuthProvider } from "@/lib/auth/mock-provider";
import { profileSchema, ProfileInput } from "@/lib/validation/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore();
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: user?.displayName || "",
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
    },
  });

  if (!user) return null;

  const onSubmit = async (data: ProfileInput) => {
    try {
      setError("");
      setSuccess("");
      const updated = await MockAuthProvider.updateProfile(data);
      updateUser(updated);
      setSuccess("Profile updated successfully.");
    } catch (err: any) {
      setError(err.message || "Failed to update profile.");
    }
  };

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight mb-2">Profile</h1>
        <p className="text-muted-foreground">Manage your personal information and public display name.</p>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-6 mb-8">
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
              <Button variant="outline" size="sm">Upload new</Button>
              <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10">Remove</Button>
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
            <div className="flex items-center justify-between p-3 rounded-md border border-border bg-muted/50">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{user.email}</span>
                {user.emailVerified && (
                  <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full font-medium">
                    Verified
                  </span>
                )}
              </div>
              <Button type="button" variant="link" className="h-auto p-0 text-sm">Change email</Button>
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
              <Input id="firstName" {...register("firstName")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" {...register("lastName")} />
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
    </div>
  );
}
