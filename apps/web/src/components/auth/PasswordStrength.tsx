"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface PasswordStrengthProps {
  password?: string;
}

export function PasswordStrength({ password = "" }: PasswordStrengthProps) {
  const requirements = useMemo(() => {
    return [
      { id: "length", text: "At least 12 characters", met: password.length >= 12 },
      { id: "uppercase", text: "One uppercase letter", met: /[A-Z]/.test(password) },
      { id: "lowercase", text: "One lowercase letter", met: /[a-z]/.test(password) },
      { id: "number", text: "One number", met: /[0-9]/.test(password) },
      { id: "special", text: "One special character", met: /[^A-Za-z0-9]/.test(password) },
    ];
  }, [password]);

  const metCount = requirements.filter((r) => r.met).length;
  const strengthLevel =
    metCount === 5 ? "Strong" : metCount >= 3 ? "Good" : metCount >= 1 ? "Fair" : "Weak";

  const getStrengthColor = () => {
    if (password.length === 0) return "bg-muted";
    if (strengthLevel === "Strong") return "bg-green-500";
    if (strengthLevel === "Good") return "bg-blue-500";
    if (strengthLevel === "Fair") return "bg-yellow-500";
    return "bg-destructive";
  };

  const getStrengthWidth = () => {
    if (password.length === 0) return "w-0";
    if (metCount === 0) return "w-[10%]";
    return `w-[${(metCount / 5) * 100}%]`;
  };

  return (
    <div className="space-y-3 mt-2">
      {/* Strength Bar */}
      <div className="flex items-center gap-2">
        <div className="h-1 flex-1 bg-muted rounded-full overflow-hidden">
          <div
            className={cn("h-full transition-all duration-300", getStrengthColor())}
            style={{ width: password.length === 0 ? "0%" : `${Math.max((metCount / 5) * 100, 10)}%` }}
          />
        </div>
        <span className="text-xs font-medium w-12 text-right text-muted-foreground">
          {password.length > 0 ? strengthLevel : ""}
        </span>
      </div>

      {/* Requirements List */}
      <div className="text-xs space-y-1.5 text-muted-foreground">
        <p className="font-medium text-foreground mb-2">Your password should contain:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
          {requirements.map((req) => (
            <div
              key={req.id}
              className={cn(
                "flex items-center gap-1.5",
                req.met ? "text-green-600 dark:text-green-500" : ""
              )}
            >
              <span>{req.met ? "✓" : "○"}</span>
              <span>{req.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
