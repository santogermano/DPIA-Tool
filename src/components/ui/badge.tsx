import * as React from "react";
import { cn } from "@/lib/utils";

export const Badge: React.FC<React.HTMLAttributes<HTMLSpanElement> & { variant?: "default" | "secondary" | "outline" | "destructive" }> = ({ className, variant = "default", ...props }) => (
  <span
    className={cn(
      "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
      variant === "default" && "bg-primary text-primary-foreground border-transparent",
      variant === "secondary" && "bg-secondary text-secondary-foreground border-transparent",
      variant === "destructive" && "bg-destructive text-destructive-foreground border-transparent",
      variant === "outline" && "text-foreground",
      className,
    )}
    {...props}
  />
);
