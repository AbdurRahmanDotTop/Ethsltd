import { Metadata } from "next";
import { AuthCard } from "@/components/auth/AuthCard";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

export const metadata: Metadata = {
  title: "ETHSLTD | Reset Password",
  description: "Set a new password for your ETHSLTD account.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ResetPasswordPage() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 py-12">
      <AuthCard
        title="Create new password"
        subtitle="Please enter your new password below."
      >
        <ResetPasswordForm />
      </AuthCard>
    </div>
  );
}
