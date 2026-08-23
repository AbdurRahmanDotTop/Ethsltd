"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { loginSchema, LoginInput } from "@/lib/validation/auth";
import { apiClient } from "@ethsltd/api-client";
import { useAuthStore } from "@/stores/auth-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm({ onSuccess }: { onSuccess?: () => void } = {}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchRedirect = searchParams.get("redirect");
  const setUser = useAuthStore((state) => state.setUser);
  const user = useAuthStore((state) => state.user);
  const [showPassword, setShowPassword] = useState(false);
  const [globalError, setGlobalError] = useState("");

  const pathname = usePathname();

  useEffect(() => {
    if (user && pathname === '/login') {
      const defaultRedirect = user.role === 'SUPER_ADMIN' || user.role === 'ADMIN' ? '/admin' : '/account';
      const finalRedirect = searchRedirect || defaultRedirect;
      router.push(finalRedirect);
      router.refresh();
    }
  }, [user, router, searchRedirect, pathname]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    try {
      setGlobalError("");
      const response = await apiClient.login(data.email, data.password);
      if (!response.success) {
        setGlobalError(response.error || "Invalid credentials.");
        return;
      }
      setUser(response.data?.user || null);
      if (onSuccess) {
        onSuccess();
      } else {
        const defaultRedirect = response.data?.user?.role === 'SUPER_ADMIN' || response.data?.user?.role === 'ADMIN' ? '/admin' : '/account';
        router.push(searchRedirect || defaultRedirect);
        router.refresh();
      }
    } catch (err: any) {
      setGlobalError(err.message || "An error occurred during login.");
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
        <div className="flex items-center justify-between flex-wrap gap-y-4">
          <Label htmlFor="password">Password</Label>
          <Link
            href="/forgot-password"
            className="text-xs text-brand-foreground hover:text-brand-foreground/80"
          >
            Forgot password?
          </Link>
        </div>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
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
        {errors.password && (
          <p className="text-xs text-destructive">{errors.password.message}</p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="rememberMe"
          className="rounded border-input bg-background text-brand-foreground focus:ring-brand-foreground h-4 w-4"
          {...register("rememberMe")}
        />
        <Label htmlFor="rememberMe" className="font-normal text-muted-foreground">
          Remember this device
        </Label>
      </div>

      <Button type="submit" className="w-full" isLoading={isSubmitting} loadingText="Signing in...">
        Log In
      </Button>
    </form>
  );
}
