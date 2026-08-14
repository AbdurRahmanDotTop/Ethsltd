import { Loader2 } from "lucide-react";

export default function AccountLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] w-full gap-4">
      <div className="p-4 bg-muted/20 rounded-full">
        <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
      </div>
      <p className="text-muted-foreground animate-pulse text-sm font-medium tracking-wide">Fetching details...</p>
    </div>
  );
}
