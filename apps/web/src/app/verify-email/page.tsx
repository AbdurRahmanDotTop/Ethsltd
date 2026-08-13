import { Metadata } from "next";
import { AuthCard } from "@/components/auth/AuthCard";
import { EmailVerification } from "@/components/auth/EmailVerification";

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
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 py-12">
      <AuthCard
        title="Check your email"
        subtitle=""
      >
        <EmailVerification />
      </AuthCard>
    </div>
  );
}
