// Pixel-art category icons for the Battle Log

interface IconProps {
  color: string;
  className?: string;
}

export function TrophyIcon({ color, className = "w-3.5 h-3.5" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" shapeRendering="crispEdges" aria-hidden="true">
      <g fill={color}>
        <rect x="4" y="2" width="8" height="1" />
        <rect x="3" y="3" width="10" height="1" />
        <rect x="3" y="4" width="1" height="3" />
        <rect x="12" y="4" width="1" height="3" />
        <rect x="4" y="7" width="8" height="1" />
        <rect x="5" y="8" width="6" height="1" />
        <rect x="7" y="9" width="2" height="2" />
        <rect x="5" y="11" width="6" height="1" />
        <rect x="4" y="12" width="8" height="1" />
        <rect x="1" y="4" width="2" height="1" />
        <rect x="1" y="5" width="1" height="2" />
        <rect x="2" y="6" width="1" height="1" />
        <rect x="13" y="4" width="2" height="1" />
        <rect x="14" y="5" width="1" height="2" />
        <rect x="13" y="6" width="1" height="1" />
      </g>
    </svg>
  );
}

export function RocketIcon({ color, className = "w-3.5 h-3.5" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" shapeRendering="crispEdges" aria-hidden="true">
      <g fill={color}>
        <rect x="7" y="1" width="2" height="1" />
        <rect x="6" y="2" width="4" height="1" />
        <rect x="5" y="3" width="6" height="1" />
        <rect x="5" y="4" width="6" height="6" />
        <rect x="4" y="6" width="1" height="3" />
        <rect x="11" y="6" width="1" height="3" />
        <rect x="3" y="8" width="1" height="2" />
        <rect x="12" y="8" width="1" height="2" />
        <rect x="6" y="10" width="4" height="1" />
        <rect x="6" y="11" width="1" height="2" />
        <rect x="9" y="11" width="1" height="2" />
        <rect x="7" y="13" width="2" height="1" />
      </g>
      <rect x="7" y="5" width="2" height="2" fill="#0a0c1a" />
    </svg>
  );
}

export function MicIcon({ color, className = "w-3.5 h-3.5" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" shapeRendering="crispEdges" aria-hidden="true">
      <g fill={color}>
        <rect x="6" y="1" width="4" height="1" />
        <rect x="5" y="2" width="6" height="6" />
        <rect x="6" y="8" width="4" height="1" />
        <rect x="4" y="6" width="1" height="2" />
        <rect x="11" y="6" width="1" height="2" />
        <rect x="5" y="9" width="1" height="1" />
        <rect x="10" y="9" width="1" height="1" />
        <rect x="6" y="10" width="4" height="1" />
        <rect x="7" y="11" width="2" height="2" />
        <rect x="5" y="13" width="6" height="1" />
      </g>
    </svg>
  );
}

export function MergeIcon({ color, className = "w-3.5 h-3.5" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" shapeRendering="crispEdges" aria-hidden="true">
      <g fill={color}>
        {/* Left branch dot + line */}
        <rect x="3" y="2" width="2" height="2" />
        <rect x="3" y="4" width="1" height="9" />
        {/* Right branch dot + line */}
        <rect x="11" y="2" width="2" height="2" />
        <rect x="12" y="4" width="1" height="3" />
        {/* Curve down to merge */}
        <rect x="11" y="7" width="1" height="1" />
        <rect x="10" y="8" width="1" height="1" />
        <rect x="9" y="9" width="1" height="1" />
        <rect x="5" y="10" width="4" height="1" />
        {/* Merge dot */}
        <rect x="3" y="13" width="2" height="2" />
      </g>
    </svg>
  );
}

export type CategoryKey = "win" | "launch" | "event" | "contribution";

export const CATEGORY_META: Record<
  CategoryKey,
  {
    label: string;
    glyph: string;
    color: string; // CSS color value
    Icon: typeof TrophyIcon;
    leftBorder: string; // tailwind class
    nodeBg: string; // tailwind class
  }
> = {
  win: {
    label: "WIN",
    glyph: "★",
    color: "#f5c542",
    Icon: TrophyIcon,
    leftBorder: "border-l-accent-gold",
    nodeBg: "bg-accent-gold",
  },
  launch: {
    label: "LAUNCH",
    glyph: "▲",
    color: "#3dd6ac",
    Icon: RocketIcon,
    leftBorder: "border-l-accent-teal",
    nodeBg: "bg-accent-teal",
  },
  event: {
    label: "EVENT",
    glyph: "♪",
    color: "#7c6df5",
    Icon: MicIcon,
    leftBorder: "border-l-accent-violet",
    nodeBg: "bg-accent-violet",
  },
  contribution: {
    label: "CONTRIBUTION",
    glyph: "⌥",
    color: "#f55c5c",
    Icon: MergeIcon,
    leftBorder: "border-l-accent-red",
    nodeBg: "bg-accent-red",
  },
};
