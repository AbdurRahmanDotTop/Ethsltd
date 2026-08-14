"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { registerSchema, RegisterInput } from "@/lib/validation/auth";
import { apiClient } from "@ethsltd/api-client";
import { useAuthStore } from "@/stores/auth-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordStrength } from "./PasswordStrength";

export function RegisterForm() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [globalError, setGlobalError] = useState("");

  useEffect(() => {
    if (user) {
      router.push(user.role === 'SUPER_ADMIN' || user.role === 'ADMIN' ? '/admin' : '/account');
    }
  }, [user, router]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      marketing: false,
    },
  });

  const passwordValue = useWatch({ control, name: "password" });

  const onSubmit = async (data: RegisterInput) => {
    try {
      setGlobalError("");
      const response = await apiClient.register(data.email, data.password);
      if (!response.success) {
        setGlobalError(response.error || "An error occurred during registration.");
        return;
      }
      // Redirect to verification flow
      router.push("/verify-email");
    } catch (err: any) {
      setGlobalError(err.message || "An error occurred during registration.");
    }
  };

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

      <div className="space-y-2">
        <Label htmlFor="password">Create password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            {...register("password")}
            className={errors.password ? "border-destructive pr-10" : "pr-10"}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        <PasswordStrength password={passwordValue} />
        {errors.password && (
          <p className="text-xs text-destructive">{errors.password.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm password</Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            autoComplete="new-password"
            {...register("confirmPassword")}
            className={errors.confirmPassword ? "border-destructive pr-10" : "pr-10"}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
        )}
      </div>

      <div className="space-y-4 pt-2">
        <div className="flex items-start gap-2">
          <input
            type="checkbox"
            id="acceptTerms"
            className="mt-1 rounded border-input bg-background text-brand-foreground focus:ring-brand-foreground h-4 w-4 shrink-0"
            {...register("acceptTerms")}
          />
          <div className="space-y-1">
            <Label htmlFor="acceptTerms" className="font-normal text-muted-foreground text-sm leading-snug">
              I agree to the ETHSLTD{" "}
              <Link href="/legal/terms" className="text-blue-500 hover:text-blue-400 hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/legal/privacy" className="text-blue-500 hover:text-blue-400 hover:underline">
                Privacy Policy
              </Link>
              .
            </Label>
            {errors.acceptTerms && (
              <p className="text-xs text-destructive">{errors.acceptTerms.message}</p>
            )}
          </div>
        </div>

        <div className="flex items-start gap-2">
          <input
            type="checkbox"
            id="marketing"
            className="mt-1 rounded border-input bg-background text-brand-foreground focus:ring-brand-foreground h-4 w-4 shrink-0"
            {...register("marketing")}
          />
          <Label htmlFor="marketing" className="font-normal text-muted-foreground text-sm leading-snug">
            Send me product updates, educational content, and market insights.
          </Label>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating account...
          </>
        ) : (
          "Create Account"
        )}
      </Button>
    </form>
  );
}
