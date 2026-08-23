"use client";

import { useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { AuthUser } from "@/lib/auth/types";
import { apiClient } from "@ethsltd/api-client";

interface AuthProviderProps {
  initialUser: AuthUser | null;
  children: React.ReactNode;
}

export function AuthProvider({ initialUser, children }: AuthProviderProps) {
  const initialized = useRef(false);

  // Initialize store synchronously before children render
  if (!initialized.current) {
    // We don't rely strictly on localStorage anymore since the true source is the httpOnly cookie.
    // If initialUser is missing (e.g. SSR fetch failed), we assume "loading" until proven otherwise.
    useAuthStore.setState({
      user: initialUser,
      status: initialUser ? "authenticated" : "loading",
      hasHydrated: true,
    });
    initialized.current = true;
  }

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Client-side hydration fallback
    const checkAuth = async () => {
      const store = useAuthStore.getState();
      if (!store.user) {
        try {
          const res = await apiClient.getMe();
          if (res.success && res.data) {
            store.setUser(res.data);
          } else if (res.error?.includes('401') || res.error?.includes('Session expired')) {
            store.logout();
          } else {
            // Network error or 500, keep the user in unauthenticated state
            store.logout();
          }
        } catch (e) {
          // Do not aggressively log out on network catch errors, just fallback to unauthenticated
          store.setStatus("unauthenticated");
        }
      }
    };
    checkAuth();
    
    // Listen for global auth required events (e.g. from apiClient interceptors)
    const handleAuthRequired = async (e: Event) => {
      useAuthStore.getState().logout();
      if (!pathname.startsWith('/login')) {
        router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      }
    };

    window.addEventListener("auth:required", handleAuthRequired);
    return () => window.removeEventListener("auth:required", handleAuthRequired);
  }, [pathname, router]);

  return <>{children}</>;
}
