import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type StatusVariant = "shipped" | "wip" | "gold" | "muted";

interface StatusBadgeProps {
  variant: StatusVariant;
  children: ReactNode;
  className?: string;
}

const variantStyles: Record<StatusVariant, string> = {
  shipped:
    "border-accent-teal text-accent-teal bg-accent-teal/10",
  wip:
    "border-accent-red text-accent-red bg-accent-red/10",
  gold:
    "border-accent-gold text-accent-gold bg-accent-gold/10",
  muted:
    "border-border-pixel text-text-muted bg-border-pixel/20",
};

export function StatusBadge({ variant, children, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 border-2 rounded-sm px-2 py-1 font-pixel text-[10px] uppercase tracking-wider",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
