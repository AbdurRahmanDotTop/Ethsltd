import { useState, useEffect } from "react";

export function FilePreview({ file, className = "" }: { file: File | string | null; className?: string }) {
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
    if (!file) {
      setPreviewUrl("");
      return;
    }
    
    if (typeof file === "string") {
      setPreviewUrl(file);
      return;
    }

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  if (!file || !previewUrl) return null;

  const isString = typeof file === "string";
  const type = isString ? (previewUrl.toLowerCase().endsWith(".pdf") ? "application/pdf" : "image/") : file.type;

  if (type.startsWith('image/') && !imageError) {
    return (
      <div className={`overflow-hidden rounded-md border border-border bg-muted/30 flex items-center justify-center ${className}`}>
        <img 
          src={previewUrl} 
          alt="Preview" 
          className="max-w-full max-h-full object-contain" 
          onError={() => setImageError(true)}
        />
      </div>
    );
  }

  if (type === 'application/pdf') {
    return (
      <div className={`overflow-hidden rounded-md border border-border ${className}`}>
        <iframe src={`${previewUrl}#toolbar=0&navpanes=0&scrollbar=0`} className="w-full h-full border-none" title="PDF Preview" />
      </div>
    );
  }

  return (
    <div className={`p-4 bg-muted/50 rounded-md text-sm truncate border border-border flex flex-col items-center justify-center ${className}`}>
      <svg className="w-8 h-8 text-muted-foreground mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
      {isString ? previewUrl.split('/').pop() : file.name}
    </div>
  );
}
