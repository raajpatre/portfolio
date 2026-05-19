import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface PixelButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "accent";
}

export const PixelButton = forwardRef<HTMLButtonElement, PixelButtonProps>(
  ({ className, variant = "primary", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "relative inline-flex items-center justify-center font-pixel text-[10px] sm:text-xs uppercase px-6 py-3 tracking-wider transition-transform active:scale-95 disabled:opacity-50 disabled:pointer-events-none",
          // Pixelated border via clip-path could be complex across browsers, so we use a simulated box-shadow border
          // or just standard borders with rounded-none
          "border-2 rounded-sm",
          {
            "border-accent-violet text-accent-violet hover:bg-accent-violet/10":
              variant === "primary",
            "border-border-pixel text-text-primary hover:bg-border-pixel/30":
              variant === "secondary",
            "border-accent-gold text-accent-gold hover:bg-accent-gold/10":
              variant === "accent",
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

PixelButton.displayName = "PixelButton";
