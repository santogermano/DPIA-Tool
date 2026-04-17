import * as React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export const Checkbox: React.FC<{ checked: boolean; onChange: (v: boolean) => void; id?: string; className?: string; disabled?: boolean }> = ({ checked, onChange, id, className, disabled }) => (
  <button type="button" id={id} role="checkbox" aria-checked={checked} disabled={disabled} onClick={() => onChange(!checked)}
    className={cn(
      "peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 flex items-center justify-center",
      checked && "bg-primary text-primary-foreground",
      className,
    )}>
    {checked && <Check className="h-3 w-3" />}
  </button>
);
