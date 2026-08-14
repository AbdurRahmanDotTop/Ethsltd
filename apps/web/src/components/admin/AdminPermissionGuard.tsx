"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";

export function AdminPermissionGuard({ children }: { children: React.ReactNode }) {
  const { user, status, hasHydrated } = useAuthStore();
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (!hasHydrated || status === "loading") return;

    if (!user) {
      router.push("/login?redirect=/admin");
      return;
    }

    // Basic RBAC check
    if (!user.role || user.role === "USER") {
      router.push("/");
      return;
    }

    setAuthorized(true);
  }, [user, status, hasHydrated, router]);

  if (!hasHydrated || !authorized) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return <>{children}</>;
}
