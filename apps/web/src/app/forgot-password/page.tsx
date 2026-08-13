import { Metadata } from "next";
import { AuthCard } from "@/components/auth/AuthCard";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "ETHSLTD | Forgot Password",
  description: "Reset your ETHSLTD account password.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 py-12">
      <AuthCard
        title="Reset your password"
        subtitle="Enter the email associated with your ETHSLTD account and we'll send you a password reset link."
        footerText="Remembered your password?"
        footerActionText="Log in"
        footerActionLink="/login"
      >
        <ForgotPasswordForm />
      </AuthCard>
    </div>
  );
}
