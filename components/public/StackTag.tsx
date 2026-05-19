import { cn } from "@/lib/utils";

interface StackTagProps {
  tag: string;
  className?: string;
}

export function StackTag({ tag, className }: StackTagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-1 text-[10px] sm:text-xs font-mono uppercase tracking-wider",
        "border border-border-pixel rounded-sm bg-border-pixel/20 text-text-primary",
        className
      )}
    >
      <span className="text-accent-teal mr-1">#</span>
      {tag}
    </span>
  );
}
