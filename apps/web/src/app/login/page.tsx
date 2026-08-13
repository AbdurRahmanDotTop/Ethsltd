import { Metadata } from "next";
import { AuthCard } from "@/components/auth/AuthCard";
import { LoginForm } from "@/components/auth/LoginForm";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Suspense } from "react";

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
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4 py-12">
      <AuthCard
        title="Welcome back"
        subtitle="Log in to your ETHSLTD account."
        footerText="Don't have an account?"
        footerActionText="Create one"
        footerActionLink="/register"
      >
        <Suspense fallback={<div>Loading...</div>}>
          <LoginForm />
        </Suspense>
      </AuthCard>
      </main>
      <Footer />
    </div>
  );
}
