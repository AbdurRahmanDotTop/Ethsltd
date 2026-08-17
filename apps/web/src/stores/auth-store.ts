import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AuthUser, AuthStatus } from "@/lib/auth/types";

interface AuthState {
  user: AuthUser | null;
  status: AuthStatus;
  hasHydrated: boolean;
  isAuthModalOpen: boolean;
  authModalMessage: string;
  setHasHydrated: (state: boolean) => void;
  setUser: (user: AuthUser | null) => void;
  setStatus: (status: AuthStatus) => void;
  logout: () => void;
  updateUser: (data: Partial<AuthUser>) => void;
  openAuthModal: (message?: string) => void;
  closeAuthModal: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      status: "unauthenticated",
      hasHydrated: false,
      isAuthModalOpen: false,
      authModalMessage: "",
      setHasHydrated: (state) => set({ hasHydrated: state }),
      setUser: (user) =>
        set({ user, status: user ? "authenticated" : "unauthenticated" }),
      setStatus: (status) => set({ status }),
      logout: () => set({ user: null, status: "unauthenticated" }),
      updateUser: (data) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        })),
      openAuthModal: (message = "Please log in to continue.") => set({ isAuthModalOpen: true, authModalMessage: message }),
      closeAuthModal: () => set({ isAuthModalOpen: false, authModalMessage: "" }),
    }),
    {
      name: "ethsltd-auth-storage",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
      // In production, we wouldn't persist the user object here if we use strict HTTP-only cookies,
      // but for this UI prototype, persisting allows simulating an active session across reloads.
    }
  )
);
