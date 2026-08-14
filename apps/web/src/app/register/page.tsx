import { Metadata } from "next";
import { AuthCard } from "@/components/auth/AuthCard";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

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
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4 py-12">
      <AuthCard
        title="Create your ETHSLTD account"
        subtitle="Start exploring digital assets, markets, and demo trading with ETHSLTD."
        footerText="Already have an account?"
        footerActionText="Log in"
        footerActionLink="/login"
      >
        <RegisterForm />
      </AuthCard>
      </main>
      <Footer />
    </div>
  );
}
