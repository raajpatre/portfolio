"use client";

import {
  AchievementCard,
  CertificateData,
  inferCategory,
  CATEGORY_LABELS,
  CATEGORY_ORDER,
} from "./AchievementCard";

interface AchievementGridProps {
  certificates: CertificateData[];
}

export function AchievementGrid({ certificates }: AchievementGridProps) {
  if (!certificates || certificates.length === 0) {
    return (
      <div className="px-5 sm:px-8 lg:px-16 py-12 pb-20">
        <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-border-pixel rounded-sm max-w-md mx-auto bg-bg-surface/60 backdrop-blur-sm">
          <div className="w-24 h-24 border-2 border-dashed border-border-pixel bg-bg-surface flex items-center justify-center font-pixel text-[8px] text-text-muted animate-[idleBounce_1.6s_ease-in-out_infinite] mb-4">
            EMPTY
          </div>
          <p className="font-pixel text-sm text-text-muted">No achievements unlocked yet.</p>
        </div>
      </div>
    );
  }

  // Group by category (use explicit category, else inferred)
  const groups = CATEGORY_ORDER.map((cat) => ({
    id: cat,
    label: CATEGORY_LABELS[cat],
    items: certificates.filter((c) => (c.category || inferCategory(c)) === cat),
  })).filter((g) => g.items.length > 0);

  // Use a running index across all groups so the stagger animation feels continuous
  let runningIndex = 0;

  return (
    <main className="relative z-[1] px-5 sm:px-8 lg:px-16 pt-9 pb-20">
      {groups.map((g) => (
        <section key={g.id}>
          {/* Section divider — ── CATEGORY ── */}
          <div
            className="flex items-center gap-4 my-7 font-pixel text-[8px] text-text-primary tracking-[0.18em] uppercase"
            style={{ textShadow: "0 0 12px rgba(10,12,26,0.9)" }}
          >
            <span className="flex-1 h-px bg-border-pixel" />
            ── {g.label} ──
            <span className="flex-1 h-px bg-border-pixel" />
          </div>

          {/* Card grid — fixed 260px columns */}
          <div
            className="grid justify-center gap-4"
            style={{ gridTemplateColumns: "repeat(auto-fit, 260px)" }}
          >
            {g.items.map((cert) => {
              const i = runningIndex++;
              return <AchievementCard key={cert.id} cert={cert} index={i} />;
            })}
          </div>
        </section>
      ))}
    </main>
  );
}
