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
    useAuthStore.setState({
      user: initialUser,
      status: initialUser ? "authenticated" : "unauthenticated",
      hasHydrated: true,
    });
    initialized.current = true;
  }

  useEffect(() => {
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
