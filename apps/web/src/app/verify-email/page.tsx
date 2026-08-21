import { Metadata } from "next";
import { AuthCard } from "@/components/auth/AuthCard";
import { EmailVerification } from "@/components/auth/EmailVerification";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

import { Suspense } from "react";
import { Loader2 } from "lucide-react";

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
        <Suspense fallback={<div className="flex justify-center p-6"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>}>
          <EmailVerification />
        </Suspense>
      </AuthCard>
      </main>
      <Footer />
    </div>
  );
}
