"use client";

import { useState, useEffect } from "react";
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
  const [kycProfile, setKycProfile] = useState<any>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  // Note: we can use react-hook-form but file inputs are easier handled manually or with custom components
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      country: "",
      documentType: "ID_CARD",
      documentNumber: "",
    }
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await apiClient.getKYC();
        if (res.success && res.data) {
          setKycProfile(res.data);
          
          // Pre-fill form fields with fetched data
          reset({
            firstName: res.data.firstName || "",
            lastName: res.data.lastName || "",
            dateOfBirth: res.data.dateOfBirth || "",
            country: res.data.country || "",
            documentType: res.data.documentType || "ID_CARD",
            documentNumber: res.data.documentNumber || "",
          });
        }
      } catch (err) {
        console.error("Failed to fetch KYC profile", err);
      } finally {
        setIsLoadingProfile(false);
      }
    };
    if (user) fetchProfile();
  }, [user, reset]);

  const [documentFront, setDocumentFront] = useState<File | null>(null);
  const [documentBack, setDocumentBack] = useState<File | null>(null);
  const [selfie, setSelfie] = useState<File | null>(null);

  if (!user || isLoadingProfile) return null;

  const onSubmit = async (data: any) => {
    try {
      setError("");
      setSuccess("");
      setIsSubmitting(true);

      if (!kycProfile && (!documentFront || !selfie)) {
        throw new Error("Document front and selfie are required for initial submission.");
      }

      const documentFrontBase64 = documentFront ? await fileToBase64(documentFront) : undefined;
      const documentBackBase64 = documentBack ? await fileToBase64(documentBack) : undefined;
      const selfieBase64 = selfie ? await fileToBase64(selfie) : undefined;

      const res = await apiClient.submitKYC({
        ...data,
        documentFrontBase64,
        documentBackBase64,
        selfieBase64
      });

      if (res.success) {
        setSuccess("KYC documents submitted successfully. Please wait for admin approval.");
        setKycProfile({ status: 'PENDING' }); // Optimistic update
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
        {kycProfile?.status === 'APPROVED' && (
          <div className="mb-6 p-4 rounded-md bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 font-medium flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p>Your KYC is Approved.</p>
              <p className="text-sm font-normal opacity-90 mt-1">You have full access to platform features.</p>
            </div>
          </div>
        )}

        {kycProfile?.status === 'PENDING' && (
          <div className="mb-6 p-4 rounded-md bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 font-medium flex items-start gap-3">
            <Loader2 className="w-5 h-5 shrink-0 mt-0.5 animate-spin" />
            <div>
              <p>Your KYC is Pending Approval.</p>
              <p className="text-sm font-normal opacity-90 mt-1">Please wait for an administrator to review your documents.</p>
            </div>
          </div>
        )}

        {kycProfile?.status === 'REJECTED' && (
          <div className="mb-6 p-4 rounded-md bg-destructive/10 text-destructive font-medium flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p>Your KYC was Rejected.</p>
              <p className="text-sm font-normal opacity-90 mt-1">Reason: {kycProfile.rejectionReason || 'Invalid documents.'}</p>
              <p className="text-sm font-normal opacity-90 mt-1">Please re-submit your documents below.</p>
            </div>
          </div>
        )}
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" disabled={kycProfile?.status === 'PENDING' || kycProfile?.status === 'APPROVED'} {...register("firstName", { required: true })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" disabled={kycProfile?.status === 'PENDING' || kycProfile?.status === 'APPROVED'} {...register("lastName", { required: true })} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dob">Date of Birth</Label>
                <Input id="dob" type="date" disabled={kycProfile?.status === 'PENDING' || kycProfile?.status === 'APPROVED'} {...register("dateOfBirth", { required: true })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input id="country" disabled={kycProfile?.status === 'PENDING' || kycProfile?.status === 'APPROVED'} {...register("country", { required: true })} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Document Type</Label>
                <select 
                  {...register("documentType", { required: true })}
                  disabled={kycProfile?.status === 'PENDING' || kycProfile?.status === 'APPROVED'}
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="ID_CARD">ID Card</option>
                  <option value="PASSPORT">Passport</option>
                  <option value="DRIVERS_LICENSE">Driver's License</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="docNumber">Document Number</Label>
                <Input id="docNumber" disabled={kycProfile?.status === 'PENDING' || kycProfile?.status === 'APPROVED'} {...register("documentNumber", { required: true })} />
              </div>
            </div>

          <div className="space-y-4 pt-4 border-t border-border">
            <h3 className="font-medium text-lg">Document Uploads</h3>
            
            <div className="grid grid-cols-1 gap-6">
                <div>
                  <Label>Document Front *</Label>
                  <label htmlFor="file-upload-front" className={`mt-2 flex justify-center rounded-lg border border-dashed border-border px-6 py-8 transition-colors ${kycProfile?.status === 'PENDING' || kycProfile?.status === 'APPROVED' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-muted/50 hover:border-primary/50'}`}>
                    <div className="text-center">
                      <FileText className="mx-auto h-12 w-12 text-muted-foreground" aria-hidden="true" />
                      <div className="mt-4 flex justify-center text-sm leading-6">
                        <span className="relative rounded-md font-semibold text-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 hover:text-primary/80">
                          <span>Upload a file</span>
                          <input id="file-upload-front" disabled={kycProfile?.status === 'PENDING' || kycProfile?.status === 'APPROVED'} name="file-upload-front" type="file" accept="image/*" className="sr-only" onChange={(e) => setDocumentFront(e.target.files?.[0] || null)} />
                        </span>
                        <p className="pl-1 text-muted-foreground">or drag and drop</p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">PNG, JPG up to 5MB</p>
                      {documentFront && <p className="text-xs text-green-500 mt-2 font-medium">{documentFront.name} selected</p>}
                      {kycProfile?.documentFrontUrl && !documentFront && <p className="text-xs text-green-500 mt-2 font-medium">Existing document on file</p>}
                    </div>
                  </label>
                </div>

                <div>
                  <Label>Document Back</Label>
                  <label htmlFor="file-upload-back" className={`mt-2 flex justify-center rounded-lg border border-dashed border-border px-6 py-8 transition-colors ${kycProfile?.status === 'PENDING' || kycProfile?.status === 'APPROVED' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-muted/50 hover:border-primary/50'}`}>
                    <div className="text-center">
                      <FileText className="mx-auto h-12 w-12 text-muted-foreground" aria-hidden="true" />
                      <div className="mt-4 flex justify-center text-sm leading-6">
                        <span className="relative rounded-md font-semibold text-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 hover:text-primary/80">
                          <span>Upload a file</span>
                          <input id="file-upload-back" disabled={kycProfile?.status === 'PENDING' || kycProfile?.status === 'APPROVED'} name="file-upload-back" type="file" accept="image/*" className="sr-only" onChange={(e) => setDocumentBack(e.target.files?.[0] || null)} />
                        </span>
                        <p className="pl-1 text-muted-foreground">or drag and drop</p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">PNG, JPG up to 5MB</p>
                      {documentBack && <p className="text-xs text-green-500 mt-2 font-medium">{documentBack.name} selected</p>}
                      {kycProfile?.documentBackUrl && !documentBack && <p className="text-xs text-green-500 mt-2 font-medium">Existing document on file</p>}
                    </div>
                  </label>
                </div>

                <div>
                  <Label>Selfie with Document *</Label>
                  <label htmlFor="file-upload-selfie" className={`mt-2 flex justify-center rounded-lg border border-dashed border-border px-6 py-8 transition-colors ${kycProfile?.status === 'PENDING' || kycProfile?.status === 'APPROVED' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-muted/50 hover:border-primary/50'}`}>
                    <div className="text-center">
                      <FileText className="mx-auto h-12 w-12 text-muted-foreground" aria-hidden="true" />
                      <div className="mt-4 flex justify-center text-sm leading-6">
                        <span className="relative rounded-md font-semibold text-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 hover:text-primary/80">
                          <span>Upload a file</span>
                          <input id="file-upload-selfie" disabled={kycProfile?.status === 'PENDING' || kycProfile?.status === 'APPROVED'} name="file-upload-selfie" type="file" accept="image/*" className="sr-only" onChange={(e) => setSelfie(e.target.files?.[0] || null)} />
                        </span>
                        <p className="pl-1 text-muted-foreground">or drag and drop</p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">PNG, JPG up to 5MB</p>
                      {selfie && <p className="text-xs text-green-500 mt-2 font-medium">{selfie.name} selected</p>}
                      {kycProfile?.selfieUrl && !selfie && <p className="text-xs text-green-500 mt-2 font-medium">Existing document on file</p>}
                    </div>
                  </label>
                </div>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting || kycProfile?.status === 'PENDING' || kycProfile?.status === 'APPROVED'}>
            {isSubmitting ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...</>
            ) : kycProfile?.status === 'PENDING' ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Under Review</>
            ) : kycProfile?.status === 'APPROVED' ? (
              <><CheckCircle2 className="w-4 h-4 mr-2" /> Verified</>
            ) : (
              <><Upload className="w-4 h-4 mr-2" /> Submit KYC Documents</>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
