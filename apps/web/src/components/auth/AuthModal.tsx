"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";

export function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, authModalMessage } = useAuthStore();
  const [view, setView] = useState<"login" | "register">("login");

  // Reset view to login when modal opens
  useEffect(() => {
    if (isAuthModalOpen) {
      setView("login");
    }
  }, [isAuthModalOpen]);

  useEffect(() => {
    const handleAuthRequired = (e: Event) => {
      const customEvent = e as CustomEvent;
      useAuthStore.getState().openAuthModal(customEvent.detail?.message || "Please log in to continue.");
    };

    window.addEventListener("auth:required", handleAuthRequired);
    return () => window.removeEventListener("auth:required", handleAuthRequired);
  }, []);

  const handleSuccess = () => {
    closeAuthModal();
  };

  return (
    <Dialog open={isAuthModalOpen} onOpenChange={(open) => !open && closeAuthModal()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{view === "login" ? "Log In Required" : "Create Account"}</DialogTitle>
          <DialogDescription>
            {authModalMessage || (view === "login" ? "Please log in to your account to continue." : "Create a new account to continue.")}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {view === "login" ? (
            <LoginForm onSuccess={handleSuccess} />
          ) : (
            <RegisterForm onSuccess={handleSuccess} />
          )}
        </div>

        <div className="text-center text-sm mt-4">
          {view === "login" ? (
            <p className="text-muted-foreground">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => setView("register")}
                className="text-foreground font-medium hover:underline"
              >
                Create one
              </button>
            </p>
          ) : (
            <p className="text-muted-foreground">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setView("login")}
                className="text-foreground font-medium hover:underline"
              >
                Log in
              </button>
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
