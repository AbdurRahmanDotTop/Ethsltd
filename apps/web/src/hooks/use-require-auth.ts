import { useAuthStore } from "@/stores/auth-store";
import { useCallback } from "react";

export function useRequireAuth() {
  const { status, hasHydrated, openAuthModal } = useAuthStore();

  /**
   * Wraps an action with an authentication check.
   * If the user is authenticated, the action is executed.
   * Otherwise, the AuthModal is opened with the provided message.
   */
  const requireAuth = useCallback((action: () => void, message?: string) => {
    if (!hasHydrated) {
      // Don't do anything until hydrated
      return;
    }

    if (status === "authenticated") {
      action();
    } else {
      openAuthModal(message || "Please log in to perform this action.");
    }
  }, [hasHydrated, status, openAuthModal]);

  return requireAuth;
}
