import { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface AuthCardProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footerText?: string;
  footerActionText?: string;
  footerActionLink?: string;
  className?: string;
}

export function AuthCard({
  title,
  subtitle,
  children,
  footerText,
  footerActionText,
  footerActionLink,
  className,
}: AuthCardProps) {
  return (
    <div className={cn("w-full max-w-md mx-auto bg-card border border-border rounded-xl shadow-xl overflow-hidden", className)}>
      <div className="p-8">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-block mb-6 font-display font-bold text-2xl tracking-tight text-foreground">
            ETHSLTD
          </Link>
          <h1 className="text-2xl font-bold tracking-tight mb-2">{title}</h1>
          <p className="text-muted-foreground text-sm">{subtitle}</p>
        </div>
        
        {children}

        {(footerText || footerActionText) && (
          <div className="mt-8 text-center text-sm text-muted-foreground">
            {footerText}{" "}
            {footerActionLink && footerActionText && (
              <Link href={footerActionLink} className="text-brand-foreground hover:text-brand-foreground/80 font-medium transition-colors">
                {footerActionText}
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
