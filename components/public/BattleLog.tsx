"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BattleLogEntry, type FeedEntryData } from "./BattleLogEntry";
import { BattleLogModal } from "./BattleLogModal";
import { CATEGORY_META, type CategoryKey } from "./BattleLogIcons";
import { cn } from "@/lib/utils";

export type { FeedEntryData };

type TabKey = "ALL" | CategoryKey;

const TABS: { key: TabKey; label: string; glyph: string; color: string | null }[] = [
  { key: "ALL", label: "ALL", glyph: "◆", color: null },
  { key: "win", label: "WINS", glyph: "★", color: "#f5c542" },
  { key: "launch", label: "LAUNCHES", glyph: "▲", color: "#3dd6ac" },
  { key: "event", label: "EVENTS", glyph: "♪", color: "#7c6df5" },
  { key: "contribution", label: "CONTRIBUTIONS", glyph: "⌥", color: "#f55c5c" },
];

export function BattleLog({ entries }: { entries: FeedEntryData[] }) {
  const [tab, setTab] = useState<TabKey>("ALL");
  const [openEntry, setOpenEntry] = useState<FeedEntryData | null>(null);

  const counts = useMemo(() => {
    const c: Record<string, number> = { ALL: entries.length };
    entries.forEach((e) => {
      c[e.category] = (c[e.category] || 0) + 1;
    });
    return c;
  }, [entries]);

  const filtered = useMemo(() => {
    if (tab === "ALL") return entries;
    return entries.filter((e) => e.category === tab);
  }, [entries, tab]);

  // Group by year for separators
  const grouped = useMemo(() => {
    const years: number[] = [];
    const map: Record<number, FeedEntryData[]> = {};
    filtered.forEach((e) => {
      const y = new Date(e.entry_date).getFullYear();
      if (!map[y]) {
        map[y] = [];
        years.push(y);
      }
      map[y].push(e);
    });
    return years.map((y) => ({ year: y, items: map[y] }));
  }, [filtered]);

  // ── Empty state (no entries at all) ─────────────────────────────────
  if (!entries || entries.length === 0) {
    return (
      <div className="relative z-[1] flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="w-32 h-32 border-2 border-dashed border-border-pixel bg-bg-surface flex items-center justify-center font-pixel text-[8px] text-text-muted animate-[idleBounce_1.6s_ease-in-out_infinite] mb-4">
          EMPTY
        </div>
        <p className="font-pixel text-sm text-text-muted">The battle log is empty.</p>
      </div>
    );
  }

  return (
    <div className="relative z-[1]">
      {/* Filter bar — sticky under nav */}
      <div className="sticky top-16 z-20 border-b border-border-pixel bg-bg-base/78 backdrop-blur-md">
        {/* Mobile: native select dropdown */}
        <div className="sm:hidden px-5 py-3">
          <label className="relative block">
            <span className="sr-only">Filter battle log</span>
            <select
              value={tab}
              onChange={(e) => setTab(e.target.value as TabKey)}
              className="w-full appearance-none font-mono text-[13px] tracking-[0.03em] text-text-primary bg-bg-surface border-2 border-accent-violet shadow-[0_0_0_1px_#7c6df5] pl-3.5 pr-9 py-2.5 cursor-pointer focus:outline-none focus:shadow-[0_0_12px_#7c6df5,0_0_0_1px_#7c6df5]"
            >
              {TABS.map((t) => (
                <option key={t.key} value={t.key} className="bg-bg-surface text-text-primary">
                  {t.glyph}  {t.label} ({counts[t.key] ?? 0})
                </option>
              ))}
            </select>
            <span
              aria-hidden="true"
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 font-pixel text-[9px] text-accent-violet"
            >
              ▼
            </span>
          </label>
        </div>

        {/* Desktop: tab bar */}
        <div className="hidden sm:flex gap-1 flex-wrap px-5 sm:px-8 lg:px-16">
          {TABS.map((t) => {
            const isActive = tab === t.key;
            const count = counts[t.key] ?? 0;
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                role="tab"
                aria-selected={isActive}
                className={cn(
                  "inline-flex items-center gap-2 px-3.5 py-3 font-mono text-[12px] tracking-[0.03em] border-b-2 transition-all duration-150 cursor-pointer",
                  isActive
                    ? "text-text-primary border-accent-violet"
                    : "text-text-muted border-transparent hover:text-text-primary"
                )}
              >
                <span
                  className="text-[11px]"
                  style={{ color: t.color || "#6b7094" }}
                >
                  {t.glyph}
                </span>
                {t.label}
                <span
                  className={cn(
                    "font-mono text-[10px] bg-bg-elevated px-1.5 py-0.5 rounded-sm",
                    isActive
                      ? "text-accent-violet shadow-[0_0_0_1px_#7c6df5]"
                      : "text-text-muted shadow-[0_0_0_1px_#2a2d4a]"
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Timeline */}
      <main className="relative max-w-[880px] mx-auto px-5 sm:px-8 lg:px-16 py-8 pb-20">
        <div className="relative pl-14">
          {/* Spine */}
          <div className="absolute top-0 bottom-0 left-3.5 w-0.5 bg-border-pixel">
            {/* End caps */}
            <span className="absolute -left-1.5 top-0 w-2 h-0.5 bg-border-pixel" />
            <span className="absolute -left-1.5 bottom-0 w-2 h-0.5 bg-border-pixel" />
          </div>

          {grouped.length === 0 ? (
            <div className="py-10 px-5 text-center font-mono text-[13px] text-text-muted">
              No entries in this filter, adventurer.
            </div>
          ) : (
            <motion.div layout className="flex flex-col gap-0">
              <AnimatePresence mode="popLayout">
                {grouped.map((g, gi) => {
                  const flatBefore = grouped
                    .slice(0, gi)
                    .reduce((s, x) => s + x.items.length, 0);
                  return (
                    <motion.div
                      key={g.year}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      {/* Year divider */}
                      <div
                        className="relative flex items-center gap-3.5 my-6 -ml-14 pl-14 font-pixel text-[9px] text-accent-gold tracking-[0.16em]"
                      >
                        <span className="flex-1 h-px bg-border-pixel" />
                        <span className="px-2 bg-bg-base">── {g.year} ──</span>
                        <span className="flex-1 h-px bg-border-pixel" />
                      </div>

                      {g.items.map((entry, i) => (
                        <BattleLogEntry
                          key={entry.id}
                          entry={entry}
                          index={flatBefore + i}
                          onOpen={setOpenEntry}
                        />
                      ))}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </main>

      <BattleLogModal entry={openEntry} onClose={() => setOpenEntry(null)} />
    </div>
  );
}
