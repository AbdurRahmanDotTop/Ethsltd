import { useAuthStore } from "@/stores/auth-store";

export function useRequireAuth() {
  const { status, openAuthModal } = useAuthStore();

  /**
   * Wraps an action with an authentication check.
   * If the user is authenticated, the action is executed.
   * Otherwise, the AuthModal is opened with the provided message.
   */
  const requireAuth = (action: () => void, message?: string) => {
    if (status === "authenticated") {
      action();
    } else {
      openAuthModal(message || "Please log in to perform this action.");
    }
  };

  return requireAuth;
}
