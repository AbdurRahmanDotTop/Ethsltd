"use client";

import { useEffect, useRef } from "react";
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
    const hasLocalToken = typeof window !== 'undefined' && !!localStorage.getItem('ethsltd_auth_token');
    useAuthStore.setState({
      user: initialUser,
      status: initialUser ? "authenticated" : (hasLocalToken ? "loading" : "unauthenticated"),
      hasHydrated: true,
    });
    initialized.current = true;
  }

  useEffect(() => {
    // Client-side hydration fallback
    const checkAuth = async () => {
      const store = useAuthStore.getState();
      if (!store.user) {
        const token = localStorage.getItem('ethsltd_auth_token');
        if (token) {
          try {
            const res = await apiClient.getMe();
            if (res.success && res.data) {
              store.setUser(res.data);
            } else if (res.error?.includes('401') || res.error?.includes('Session expired')) {
              store.logout();
            } else {
              // Network error or 500, keep the user in loading or authenticated state
              // if they already have a token, assume they are still valid until a 401 occurs.
              store.setStatus("authenticated");
            }
          } catch (e) {
            // Do not aggressively log out on network catch errors
          }
        }
      }
    };
    checkAuth();
    // Listen for global auth required events (e.g. from apiClient interceptors)
    const handleAuthRequired = (e: Event) => {
      const customEvent = e as CustomEvent;
      const message = customEvent.detail?.message || "Your session has expired. Please log in again.";
      useAuthStore.getState().logout();
      useAuthStore.getState().openAuthModal(message);
    };

    window.addEventListener("auth:required", handleAuthRequired);
    return () => window.removeEventListener("auth:required", handleAuthRequired);
  }, []);

  return <>{children}</>;
}
