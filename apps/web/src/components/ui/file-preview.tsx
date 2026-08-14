import { useState, useEffect } from "react";

export function FilePreview({ file, className = "" }: { file: File | string | null; className?: string }) {
  const [previewUrl, setPreviewUrl] = useState<string>("");

  useEffect(() => {
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

  if (type.startsWith('image/')) {
    return (
      <div className={`overflow-hidden rounded-md border border-border bg-muted/30 flex items-center justify-center ${className}`}>
        <img src={previewUrl} alt="Preview" className="max-w-full max-h-full object-contain" />
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
    <div className={`p-4 bg-muted/50 rounded-md text-sm truncate border border-border flex items-center justify-center ${className}`}>
      {isString ? previewUrl.split('/').pop() : file.name}
    </div>
  );
}
