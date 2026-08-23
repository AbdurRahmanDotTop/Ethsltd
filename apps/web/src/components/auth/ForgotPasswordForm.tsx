"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { forgotPasswordSchema, ForgotPasswordInput } from "@/lib/validation/auth";
import { apiClient } from "@ethsltd/api-client";
import { useAuthStore } from "@/stores/auth-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ForgotPasswordForm() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [globalError, setGlobalError] = useState("");
  const [success, setSuccess] = useState(false);

  const pathname = usePathname();

  useEffect(() => {
    if (user && pathname === '/forgot-password') {
      const finalRedirect = user.role === 'SUPER_ADMIN' || user.role === 'ADMIN' ? '/admin' : '/account';
      window.location.href = finalRedirect;
    }
  }, [user, router, pathname]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    try {
      setGlobalError("");
      await apiClient.requestPasswordReset(data.email);
      setSuccess(true);
    } catch (err: any) {
      setGlobalError(err.message || "An error occurred.");
    }
  };

  if (success) {
    return (
      <div className="text-center space-y-4">
        <div className="p-4 rounded-md bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-sm font-medium">
          If an account is associated with that email, you'll receive a password reset link shortly.
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {globalError && (
        <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm font-medium">
          {globalError}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">Email address</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          {...register("email")}
          className={errors.email ? "border-destructive" : ""}
        />
        {errors.email && (
          <p className="text-xs text-destructive">{errors.email.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" isLoading={isSubmitting} loadingText="Sending...">
        Send Reset Link
      </Button>
    </form>
  );
}
