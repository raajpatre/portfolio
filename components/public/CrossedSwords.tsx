// Pixel-art crossed swords for the Quest Board banner
export function CrossedSwords({ flip = false, className = "w-10 h-10 sm:w-14 sm:h-14" }: { flip?: boolean; className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      style={{ transform: flip ? "scaleX(-1)" : "none", flexShrink: 0 }}
      aria-hidden="true"
    >
      <g shapeRendering="crispEdges">
        {/* Sword 1 — gold, top-left → bottom-right */}
        <rect x="2" y="2" width="1" height="1" fill="#f5c542" />
        <rect x="3" y="3" width="1" height="1" fill="#f5c542" />
        <rect x="4" y="4" width="1" height="1" fill="#f5c542" />
        <rect x="5" y="5" width="1" height="1" fill="#f5c542" />
        <rect x="6" y="6" width="1" height="1" fill="#f5c542" />
        <rect x="7" y="7" width="1" height="1" fill="#ffd970" />
        <rect x="8" y="8" width="1" height="1" fill="#f5c542" />
        <rect x="9" y="9" width="1" height="1" fill="#f5c542" />
        <rect x="10" y="10" width="1" height="1" fill="#f5c542" />
        <rect x="11" y="11" width="1" height="1" fill="#f5c542" />
        {/* hilt */}
        <rect x="10" y="12" width="3" height="1" fill="#7c6df5" />
        <rect x="11" y="13" width="1" height="1" fill="#7c6df5" />
        <rect x="12" y="13" width="1" height="1" fill="#7c6df5" />
        <rect x="11" y="11" width="2" height="1" fill="#f5c542" />
        <rect x="13" y="13" width="1" height="1" fill="#f5c542" />

        {/* Sword 2 — violet, top-right → bottom-left */}
        <rect x="13" y="2" width="1" height="1" fill="#7c6df5" />
        <rect x="12" y="3" width="1" height="1" fill="#7c6df5" />
        <rect x="11" y="4" width="1" height="1" fill="#7c6df5" />
        <rect x="10" y="5" width="1" height="1" fill="#7c6df5" />
        <rect x="9" y="6" width="1" height="1" fill="#9a8cff" />
        <rect x="6" y="9" width="1" height="1" fill="#7c6df5" />
        <rect x="5" y="10" width="1" height="1" fill="#7c6df5" />
        <rect x="4" y="11" width="1" height="1" fill="#7c6df5" />
        {/* hilt */}
        <rect x="3" y="11" width="2" height="1" fill="#f5c542" />
        <rect x="3" y="12" width="3" height="1" fill="#7c6df5" />
        <rect x="2" y="13" width="2" height="1" fill="#7c6df5" />
      </g>
    </svg>
  );
}
