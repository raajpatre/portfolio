"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export interface CertificateData {
  id: string;
  title: string;
  issuer: string;
  issued_date: string;
  credential_url: string | null;
  image_url: string | null;
  /** Optional override; otherwise inferred from title/issuer */
  category?: "course" | "program" | "competition";
  /** Optional override; otherwise inferred from category */
  icon?: "book" | "shield" | "crown";
  /** Display as locked / coming soon */
  locked?: boolean;
}

// ─── Category inference ───────────────────────────────────────────────
// Heuristic based on title/issuer keywords (used when category not set).
export function inferCategory(c: Pick<CertificateData, "title" | "issuer">):
  "course" | "program" | "competition" {
  const text = `${c.title} ${c.issuer}`.toLowerCase();
  if (/(hackathon|competition|finalist|winner|top \d|champion)/i.test(text)) return "competition";
  if (/(cohort|program|fellowship|academy|bootcamp|summer of code|gsoc|gssoc)/i.test(text))
    return "program";
  return "course";
}

const CATEGORY_TO_ICON: Record<NonNullable<CertificateData["category"]>, "book" | "shield" | "crown"> = {
  course: "book",
  program: "shield",
  competition: "crown",
};

export const CATEGORY_LABELS: Record<NonNullable<CertificateData["category"]>, string> = {
  course: "COURSE · LEARNING",
  program: "PROGRAM · COHORT",
  competition: "COMPETITION · HACKATHON",
};

export const CATEGORY_ORDER: Array<NonNullable<CertificateData["category"]>> = [
  "course",
  "program",
  "competition",
];

// ─── Pixel trophy SVGs ────────────────────────────────────────────────

function BookTrophy() {
  return (
    <svg className="w-14 h-14 relative z-[1] [image-rendering:pixelated]" viewBox="0 0 16 16" shapeRendering="crispEdges" aria-hidden="true">
      <rect x="1" y="3" width="14" height="11" fill="#7c6df5" />
      <rect x="1" y="3" width="14" height="1" fill="#9a8cff" />
      <rect x="1" y="13" width="14" height="1" fill="#5b4cd0" />
      <rect x="2" y="4" width="12" height="9" fill="#0a0c1a" />
      <rect x="7" y="3" width="2" height="11" fill="#5b4cd0" />
      <rect x="7" y="3" width="2" height="1" fill="#9a8cff" />
      <rect x="3" y="6" width="3" height="1" fill="#7c6df5" />
      <rect x="3" y="8" width="4" height="1" fill="#7c6df5" />
      <rect x="3" y="10" width="2" height="1" fill="#7c6df5" />
      <rect x="10" y="6" width="3" height="1" fill="#7c6df5" />
      <rect x="10" y="8" width="4" height="1" fill="#7c6df5" />
      <rect x="10" y="10" width="2" height="1" fill="#7c6df5" />
      <rect x="11" y="11" width="1" height="1" fill="#f5c542" />
      <rect x="12" y="10" width="1" height="3" fill="#f5c542" />
      <rect x="13" y="11" width="1" height="1" fill="#f5c542" />
      <rect x="11" y="12" width="3" height="1" fill="#f5c542" />
    </svg>
  );
}

function ShieldTrophy() {
  return (
    <svg className="w-14 h-14 relative z-[1] [image-rendering:pixelated]" viewBox="0 0 16 16" shapeRendering="crispEdges" aria-hidden="true">
      <rect x="3" y="2" width="10" height="1" fill="#3dd6ac" />
      <rect x="2" y="3" width="12" height="6" fill="#3dd6ac" />
      <rect x="3" y="9" width="10" height="1" fill="#3dd6ac" />
      <rect x="4" y="10" width="8" height="1" fill="#3dd6ac" />
      <rect x="5" y="11" width="6" height="1" fill="#3dd6ac" />
      <rect x="6" y="12" width="4" height="1" fill="#3dd6ac" />
      <rect x="7" y="13" width="2" height="1" fill="#3dd6ac" />
      <rect x="3" y="2" width="10" height="1" fill="#6fe6c2" />
      <rect x="2" y="3" width="1" height="6" fill="#6fe6c2" />
      <rect x="13" y="3" width="1" height="6" fill="#2bb38c" />
      <rect x="7" y="5" width="2" height="6" fill="#0a0c1a" />
      <rect x="5" y="6" width="6" height="2" fill="#0a0c1a" />
      <rect x="7" y="6" width="2" height="2" fill="#f5c542" />
    </svg>
  );
}

function CrownTrophy() {
  return (
    <svg className="w-14 h-14 relative z-[1] [image-rendering:pixelated]" viewBox="0 0 16 16" shapeRendering="crispEdges" aria-hidden="true">
      <rect x="2" y="3" width="1" height="1" fill="#f5c542" />
      <rect x="7" y="2" width="2" height="1" fill="#f5c542" />
      <rect x="13" y="3" width="1" height="1" fill="#f5c542" />
      <rect x="2" y="2" width="1" height="1" fill="#f55c5c" />
      <rect x="13" y="2" width="1" height="1" fill="#7c6df5" />
      <rect x="7" y="1" width="2" height="1" fill="#3dd6ac" />
      <rect x="3" y="4" width="1" height="1" fill="#f5c542" />
      <rect x="4" y="5" width="1" height="1" fill="#f5c542" />
      <rect x="5" y="4" width="1" height="1" fill="#f5c542" />
      <rect x="6" y="3" width="1" height="1" fill="#f5c542" />
      <rect x="9" y="3" width="1" height="1" fill="#f5c542" />
      <rect x="10" y="4" width="1" height="1" fill="#f5c542" />
      <rect x="11" y="5" width="1" height="1" fill="#f5c542" />
      <rect x="12" y="4" width="1" height="1" fill="#f5c542" />
      <rect x="2" y="6" width="12" height="3" fill="#f5c542" />
      <rect x="2" y="6" width="12" height="1" fill="#ffd970" />
      <rect x="2" y="8" width="12" height="1" fill="#d9ad34" />
      <rect x="4" y="7" width="1" height="1" fill="#f55c5c" />
      <rect x="8" y="7" width="1" height="1" fill="#3dd6ac" />
      <rect x="11" y="7" width="1" height="1" fill="#7c6df5" />
      <rect x="2" y="10" width="12" height="2" fill="#d9ad34" />
      <rect x="3" y="12" width="10" height="1" fill="#a8841f" />
    </svg>
  );
}

function Padlock() {
  return (
    <svg className="w-14 h-14 relative z-[1] [image-rendering:pixelated]" viewBox="0 0 16 16" shapeRendering="crispEdges" aria-hidden="true">
      <rect x="5" y="3" width="6" height="1" fill="#6b7094" />
      <rect x="4" y="4" width="1" height="3" fill="#6b7094" />
      <rect x="11" y="4" width="1" height="3" fill="#6b7094" />
      <rect x="3" y="7" width="10" height="7" fill="#2a2d4a" />
      <rect x="3" y="7" width="10" height="1" fill="#3d4068" />
      <rect x="3" y="13" width="10" height="1" fill="#1a1e38" />
      <rect x="7" y="10" width="2" height="2" fill="#6b7094" />
      <rect x="7" y="11" width="2" height="3" fill="#6b7094" />
    </svg>
  );
}

const ICON_MAP: Record<"book" | "shield" | "crown", () => React.JSX.Element> = {
  book: BookTrophy,
  shield: ShieldTrophy,
  crown: CrownTrophy,
};

// ─── Card ─────────────────────────────────────────────────────────────

interface AchievementCardProps {
  cert: CertificateData;
  index?: number;
}

export function AchievementCard({ cert, index = 0 }: AchievementCardProps) {
  const [showTip, setShowTip] = useState(false);
  const category = cert.category || inferCategory(cert);
  const iconKey = cert.icon || CATEGORY_TO_ICON[category];
  const IconComp = ICON_MAP[iconKey];
  const isLocked = !!cert.locked;

  const formattedDate = cert.issued_date
    ? new Date(cert.issued_date)
        .toLocaleDateString("en-US", { month: "short", year: "numeric" })
        .toUpperCase()
    : "—";

  const handleLockedClick = () => {
    setShowTip(true);
    setTimeout(() => setShowTip(false), 1400);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.42, delay: index * 0.03, ease: "easeOut" }}
      className={`group relative w-[260px] h-[300px] perspective-1000 ${isLocked ? "" : "cursor-pointer"}`}
      onClick={isLocked ? handleLockedClick : undefined}
    >
      <div
        className={`relative w-full h-full preserve-3d transition-transform duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${
          isLocked ? "" : "group-hover:rotate-y-180"
        }`}
      >
        {/* ─── FRONT ───────────────────────────────────────────────── */}
        <div
          className={`absolute inset-0 backface-hidden rounded-sm overflow-hidden border-2 flex flex-col ${
            isLocked
              ? "border-border-pixel"
              : "border-border-pixel group-hover:border-accent-violet"
          }`}
          style={{
            background: "rgba(18,21,43,0.88)",
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
            boxShadow: isLocked
              ? "0 0 0 1px #2a2d4a, 0 6px 22px rgba(0,0,0,0.45)"
              : "0 0 0 1px #2a2d4a, 0 6px 22px rgba(0,0,0,0.45)",
          }}
        >
          {/* Icon area */}
          <div
            className={`flex-[1.5] relative flex items-center justify-center border-b border-border-pixel overflow-hidden ${
              isLocked ? "[filter:grayscale(0.85)_brightness(0.6)]" : ""
            }`}
            style={{
              background:
                "radial-gradient(ellipse at 50% 0%, rgba(245,197,66,0.18) 0%, transparent 70%), rgba(10,12,26,0.55)",
            }}
          >
            {/* Subtle inner grid */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(rgba(124,109,245,0.04) 1px, transparent 1px) 0 0 / 16px 16px, linear-gradient(90deg, rgba(124,109,245,0.04) 1px, transparent 1px) 0 0 / 16px 16px",
              }}
            />
            {/* Decorative ring */}
            <span
              className="absolute w-[110px] h-[110px] rounded-full opacity-60 border-2 border-border-pixel shadow-[0_0_0_1px_#2a2d4a]"
              aria-hidden="true"
            />
            {/* Trophy */}
            {isLocked ? <Padlock /> : <IconComp />}

            {/* Diagonal ribbon top-right */}
            <span
              className="absolute top-2 -right-9 w-[120px] py-1 text-center font-pixel text-[6px] tracking-[0.16em] overflow-hidden"
              style={{
                background: isLocked ? "rgba(107,112,148,0.12)" : "rgba(61,214,172,0.18)",
                color: isLocked ? "#6b7094" : "#3dd6ac",
                boxShadow: isLocked ? "0 0 0 1px #2a2d4a" : "0 0 0 1px #3dd6ac",
                transform: "rotate(35deg)",
              }}
            >
              {/* Shimmer sweep (only on unlocked) */}
              {!isLocked && (
                <span
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(120deg, transparent 0%, transparent 40%, rgba(61,214,172,0.45) 50%, transparent 60%, transparent 100%)",
                    animation: "ribbonShimmer 3s linear infinite",
                  }}
                />
              )}
              {isLocked ? "LOCKED" : "UNLOCKED"}
            </span>
          </div>

          {/* Front foot — title + issuer */}
          <div className="flex-1 px-3.5 py-3 bg-bg-surface flex flex-col justify-center">
            <div
              className={`font-mono text-[13px] font-bold leading-[1.4] line-clamp-2 mb-1.5 ${
                isLocked ? "text-text-muted" : "text-text-primary"
              }`}
            >
              {cert.title}
            </div>
            <div className="font-mono text-[11px] text-text-muted tracking-[0.04em]">
              {cert.issuer}
            </div>
            {isLocked && (
              <span className="font-pixel text-[8px] text-text-muted tracking-[0.12em] text-center block mt-1.5">
                ◆ LOCKED ◆
              </span>
            )}
          </div>
        </div>

        {/* ─── BACK ────────────────────────────────────────────────── */}
        {!isLocked && (
          <div
            className="absolute inset-0 backface-hidden rotate-y-180 rounded-sm overflow-hidden border-2 border-accent-violet flex flex-col justify-between p-4 text-center"
            style={{
              background: "rgba(26,30,56,0.94)",
              backdropFilter: "blur(6px)",
              WebkitBackdropFilter: "blur(6px)",
              boxShadow: "0 0 14px rgba(124,109,245,0.35), 0 0 0 1px #7c6df5",
            }}
          >
            <div className="font-pixel text-[7px] text-accent-violet tracking-[0.32em]">
              ▸ CREDENTIAL
            </div>
            <div className="flex flex-col gap-2 px-1">
              <div className="font-mono text-[14px] font-bold text-text-primary leading-[1.4]">
                {cert.title}
              </div>
              <div className="font-mono text-[12px] text-text-muted">{cert.issuer}</div>
              <div className="font-mono text-[12px] text-accent-teal tracking-[0.06em]">
                {formattedDate}
              </div>
            </div>
            {cert.credential_url ? (
              <a
                href={cert.credential_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="font-pixel text-[7px] text-accent-violet border-2 border-accent-violet shadow-[0_0_0_1px_#7c6df5] px-2.5 py-2.5 cursor-pointer rounded-sm tracking-[0.1em] transition-colors hover:bg-accent-violet hover:text-bg-base inline-block"
              >
                [ VIEW CREDENTIAL → ]
              </a>
            ) : (
              <span className="font-pixel text-[7px] text-text-muted tracking-[0.1em]">
                ◇ NO LINK
              </span>
            )}
          </div>
        )}
      </div>

      {/* "COMING SOON" tooltip */}
      {isLocked && (
        <span
          className={`absolute -bottom-8 left-1/2 -translate-x-1/2 bg-bg-elevated border border-accent-violet shadow-[0_0_0_1px_#7c6df5] text-accent-violet font-pixel text-[7px] px-2 py-1.5 tracking-[0.1em] whitespace-nowrap pointer-events-none transition-opacity duration-150 z-[5] ${
            showTip ? "opacity-100" : "opacity-0"
          }`}
        >
          COMING SOON
        </span>
      )}
    </motion.div>
  );
}
