import { Metadata } from "next";
import { AuthCard } from "@/components/auth/AuthCard";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "ETHSLTD | Create Account",
  description: "Create your ETHSLTD account.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function RegisterPage() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 py-12">
      <AuthCard
        title="Create your ETHSLTD account"
        subtitle="Start exploring digital assets, markets, and paper trading with ETHSLTD."
        footerText="Already have an account?"
        footerActionText="Log in"
        footerActionLink="/login"
      >
        <RegisterForm />
      </AuthCard>
    </div>
  );
}
