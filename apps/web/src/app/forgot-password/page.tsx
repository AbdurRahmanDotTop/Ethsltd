import { Metadata } from "next";
import { AuthCard } from "@/components/auth/AuthCard";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

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
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4 py-12">
      <AuthCard
        title="Reset your password"
        subtitle="Enter the email associated with your ETHSLTD account and we'll send you a password reset link."
        footerText="Remembered your password?"
        footerActionText="Log in"
        footerActionLink="/login"
      >
        <ForgotPasswordForm />
      </AuthCard>
      </main>
      <Footer />
    </div>
  );
}
