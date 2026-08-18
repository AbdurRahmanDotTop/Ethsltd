import { create } from "zustand";
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

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  status: "unauthenticated",
  hasHydrated: true,
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
}));
