import { Metadata } from "next";
import { AuthCard } from "@/components/auth/AuthCard";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "ETHSLTD | Log In",
  description: "Log in to your ETHSLTD account.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 py-12">
      <AuthCard
        title="Welcome back"
        subtitle="Log in to your ETHSLTD account."
        footerText="Don't have an account?"
        footerActionText="Create one"
        footerActionLink="/register"
      >
        <LoginForm />
      </AuthCard>
    </div>
  );
}
