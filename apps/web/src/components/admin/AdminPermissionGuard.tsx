"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";

export function AdminPermissionGuard({ children }: { children: React.ReactNode }) {
  const { user, status, hasHydrated } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);

  useEffect(() => {
    if (!hasHydrated || status === "loading") return;

    if (!user) {
      router.push(`/login?redirect=${encodeURIComponent(pathname || '/')}`);
      return;
    }

    // Basic RBAC check
    if (!user.role || user.role === "USER") {
      setAccessDenied(true);
      return;
    }

    setAuthorized(true);
  }, [user, status, hasHydrated, router, pathname]);

  if (!hasHydrated || (!authorized && !accessDenied)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (accessDenied) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
        <p className="text-muted-foreground mb-6">You do not have the required permissions to view this page.</p>
        <Link href="/" className="px-6 py-2 bg-brand-primary text-black rounded-lg font-medium hover:bg-brand-primary/90 transition-colors">
          Return to Home
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}
