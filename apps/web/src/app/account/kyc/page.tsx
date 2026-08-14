"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Loader2, Upload, FileText, CheckCircle2 } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { apiClient } from "@ethsltd/api-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Helper to convert file to base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

export default function KYCPage() {
  const { user } = useAuthStore();
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Note: we can use react-hook-form but file inputs are easier handled manually or with custom components
  const { register, handleSubmit } = useForm({
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      dateOfBirth: "",
      country: "United States",
      documentType: "ID_CARD",
      documentNumber: "",
    }
  });

  const [documentFront, setDocumentFront] = useState<File | null>(null);
  const [documentBack, setDocumentBack] = useState<File | null>(null);
  const [selfie, setSelfie] = useState<File | null>(null);

  if (!user) return null;

  const onSubmit = async (data: any) => {
    try {
      setError("");
      setSuccess("");
      setIsSubmitting(true);

      if (!documentFront || !selfie) {
        throw new Error("Document front and selfie are required.");
      }

      const documentFrontBase64 = await fileToBase64(documentFront);
      const documentBackBase64 = documentBack ? await fileToBase64(documentBack) : undefined;
      const selfieBase64 = await fileToBase64(selfie);

      const res = await apiClient.submitKYC({
        ...data,
        documentFrontBase64,
        documentBackBase64,
        selfieBase64
      });

      if (res.success) {
        setSuccess("KYC documents submitted successfully. Please wait for admin approval.");
      } else {
        throw new Error(res.error || "Submission failed");
      }
    } catch (err: any) {
      setError(err.message || "Failed to submit KYC documents.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight mb-2">KYC Verification</h1>
        <p className="text-muted-foreground">Submit your documents to unlock full platform features.</p>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
        {user.status === 'BANNED' && (
          <div className="mb-6 p-4 rounded-md bg-destructive/10 text-destructive font-medium flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p>Your account is banned.</p>
              <p className="text-sm font-normal opacity-90 mt-1">Please contact support.</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {success && (
            <div className="p-3 rounded-md bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-sm font-medium">
              {success}
            </div>
          )}
          {error && (
            <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm font-medium">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>First Name</Label>
              <Input {...register("firstName")} required />
            </div>
            <div className="space-y-2">
              <Label>Last Name</Label>
              <Input {...register("lastName")} required />
            </div>
            <div className="space-y-2">
              <Label>Date of Birth</Label>
              <Input type="date" {...register("dateOfBirth")} required />
            </div>
            <div className="space-y-2">
              <Label>Country</Label>
              <Input {...register("country")} required />
            </div>
            <div className="space-y-2">
              <Label>Document Type</Label>
              <select 
                {...register("documentType")} 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="ID_CARD">ID Card</option>
                <option value="PASSPORT">Passport</option>
                <option value="DRIVERS_LICENSE">Driver's License</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Document Number</Label>
              <Input {...register("documentNumber")} required />
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-border">
            <h3 className="font-medium text-lg">Document Uploads</h3>
            
            <div className="space-y-2">
              <Label>Document Front *</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-4 flex flex-col items-center justify-center bg-muted/30">
                <Input type="file" accept="image/*,application/pdf" className="hidden" id="docFront" onChange={e => setDocumentFront(e.target.files?.[0] || null)} />
                <Label htmlFor="docFront" className="cursor-pointer flex flex-col items-center gap-2">
                  <Upload className="w-8 h-8 text-muted-foreground" />
                  <span className="text-sm font-medium text-brand-600 dark:text-brand-400">
                    {documentFront ? documentFront.name : "Click to upload Document Front"}
                  </span>
                </Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Document Back (Optional for Passport)</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-4 flex flex-col items-center justify-center bg-muted/30">
                <Input type="file" accept="image/*,application/pdf" className="hidden" id="docBack" onChange={e => setDocumentBack(e.target.files?.[0] || null)} />
                <Label htmlFor="docBack" className="cursor-pointer flex flex-col items-center gap-2">
                  <Upload className="w-8 h-8 text-muted-foreground" />
                  <span className="text-sm font-medium text-brand-600 dark:text-brand-400">
                    {documentBack ? documentBack.name : "Click to upload Document Back"}
                  </span>
                </Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Selfie with Document *</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-4 flex flex-col items-center justify-center bg-muted/30">
                <Input type="file" accept="image/*" className="hidden" id="selfie" onChange={e => setSelfie(e.target.files?.[0] || null)} />
                <Label htmlFor="selfie" className="cursor-pointer flex flex-col items-center gap-2">
                  <Upload className="w-8 h-8 text-muted-foreground" />
                  <span className="text-sm font-medium text-brand-600 dark:text-brand-400">
                    {selfie ? selfie.name : "Click to upload Selfie"}
                  </span>
                </Label>
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                "Submit Documents"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
