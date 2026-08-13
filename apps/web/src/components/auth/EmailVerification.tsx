"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Mail } from "lucide-react";
import { MockAuthProvider } from "@/lib/auth/mock-provider";
import { Button } from "@/components/ui/button";

export function EmailVerification() {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(45);
  const [isResending, setIsResending] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    if (timeLeft > 0 && !isVerified) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, isVerified]);

  const handleResend = async () => {
    try {
      setIsResending(true);
      await MockAuthProvider.resendVerification();
      setTimeLeft(45);
    } finally {
      setIsResending(false);
    }
  };

  // Mocking verification after 5 seconds just for UI demonstration
  useEffect(() => {
    if (!isVerified) {
      const timer = setTimeout(() => {
        setIsVerified(true);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isVerified]);

  if (isVerified) {
    return (
      <div className="text-center space-y-6">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold">Email verified</h2>
        <p className="text-muted-foreground text-sm">
          Your email has been successfully verified.
        </p>
        <Button onClick={() => router.push("/account")} className="w-full mt-4">
          Continue to ETHSLTD
        </Button>
      </div>
    );
  }

  return (
    <div className="text-center space-y-6">
      <div className="w-16 h-16 bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 rounded-full flex items-center justify-center mx-auto mb-4">
        <Mail className="w-8 h-8" />
      </div>
      <p className="text-muted-foreground text-sm">
        We've sent a verification link to your email address.
        Verify your email to continue using your ETHSLTD account.
      </p>

      <div className="pt-4 space-y-4">
        <Button 
          variant="outline" 
          className="w-full"
          disabled={timeLeft > 0 || isResending}
          onClick={handleResend}
        >
          {isResending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          {timeLeft > 0 ? `Resend in 00:${timeLeft.toString().padStart(2, '0')}` : "Resend verification email"}
        </Button>
        <Button variant="ghost" className="w-full text-sm" onClick={() => router.push("/login")}>
          Change Email
        </Button>
      </div>
    </div>
  );
}
