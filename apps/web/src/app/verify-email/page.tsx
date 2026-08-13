import { Metadata } from "next";
import { AuthCard } from "@/components/auth/AuthCard";
import { VerifyEmailForm } from "@/components/auth/VerifyEmailForm";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "ETHSLTD | Verify Email",
  description: "Verify your ETHSLTD account email address.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function VerifyEmailPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4 py-12">
      <AuthCard
        title="Check your email"
        subtitle=""
      >
        <EmailVerification />
      </AuthCard>
      </main>
      <Footer />
    </div>
  );
}
