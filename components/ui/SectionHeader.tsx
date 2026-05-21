import { cn } from "@/lib/utils";

type SectionHeaderVariant = "default" | "gold" | "teal" | "violet";

interface SectionHeaderProps {
  chapter?: string;
  label?: string;
  title: string;
  sub?: string;
  variant?: SectionHeaderVariant;
  className?: string;
}

const titleVariantStyles: Record<SectionHeaderVariant, string> = {
  default: "text-text-primary",
  gold: "text-accent-gold",
  teal: "text-accent-teal",
  violet: "text-accent-violet",
};

export function SectionHeader({
  chapter,
  label,
  title,
  sub,
  variant = "default",
  className,
}: SectionHeaderProps) {
  const hasMeta = Boolean(chapter || label);

  return (
    <div className={cn("flex flex-col gap-2 border-b-2 border-border-pixel pb-4", className)}>
      {hasMeta && (
        <div className="flex items-center gap-2 font-mono text-[10px] sm:text-xs uppercase tracking-[0.2em] text-text-muted">
          {chapter && (
            <>
              <span>CHAPTER {chapter}</span>
              <span className="text-accent-violet">/</span>
            </>
          )}
          {label && <span>{label}</span>}
        </div>
      )}
      <h2
        className={cn(
          "font-pixel text-lg sm:text-2xl md:text-3xl uppercase tracking-wider",
          titleVariantStyles[variant]
        )}
      >
        {title}
      </h2>
      {sub && (
        <p className="font-mono text-xs sm:text-sm text-text-muted">{sub}</p>
      )}
    </div>
  );
}
