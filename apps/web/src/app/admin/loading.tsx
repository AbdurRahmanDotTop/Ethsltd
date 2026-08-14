import { Loader2 } from "lucide-react";

export default function AdminLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full gap-4">
      <div className="p-4 bg-muted/20 rounded-full">
        <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
      </div>
      <p className="text-muted-foreground animate-pulse text-sm font-medium tracking-wide">Loading data...</p>
    </div>
  );
}
