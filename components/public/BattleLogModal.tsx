"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { optimizeCloudinaryUrl } from "@/lib/utils";
import { CATEGORY_META } from "./BattleLogIcons";
import type { FeedEntryData } from "./BattleLogEntry";

interface Props {
  entry: FeedEntryData | null;
  onClose: () => void;
}

export function BattleLogModal({ entry, onClose }: Props) {
  const [idx, setIdx] = useState(0);
  const dragRef = useRef<{ active: boolean; x0: number }>({ active: false, x0: 0 });

  const photos = entry?.photos ?? [];
  const photoCount = photos.length;

  // Reset slide on entry change
  useEffect(() => {
    setIdx(0);
  }, [entry?.id]);

  const prev = () => setIdx((i) => (photoCount > 0 ? (i - 1 + photoCount) % photoCount : 0));
  const next = () => setIdx((i) => (photoCount > 0 ? (i + 1) % photoCount : 0));

  useEffect(() => {
    if (!entry) return;
    const k = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", k);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", k);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entry, photoCount]);

  const onDown = (clientX: number) => {
    dragRef.current = { active: true, x0: clientX };
  };
  const onUp = (clientX: number) => {
    if (!dragRef.current.active) return;
    const dx = clientX - dragRef.current.x0;
    dragRef.current.active = false;
    if (Math.abs(dx) > 50) (dx < 0 ? next : prev)();
  };

  if (!entry) {
    return <AnimatePresence />;
  }

  const meta = CATEGORY_META[entry.category];
  const Icon = meta.Icon;
  const cat = meta.color;

  const date = new Date(entry.entry_date);
  const stamp = `${date
    .toLocaleString("en-US", { month: "short" })
    .toUpperCase()} ${date.getFullYear()}`;
  const questId = `${entry.id.slice(0, 8).toUpperCase()}-${stamp.replace(/ /g, "-")}`;

  return (
    <AnimatePresence>
      <motion.div
        key="bl-overlay"
        className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-md"
        style={{ background: "rgba(10,12,26,0.86)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
        onClick={onClose}
        role="dialog"
        aria-modal="true"
      >
        <motion.div
          className="w-full max-w-[960px] max-h-[calc(100vh-48px)] bg-bg-surface border-2 rounded-sm flex flex-col overflow-hidden"
          style={{ borderColor: cat, boxShadow: `0 0 24px ${cat}, 0 0 0 1px ${cat}` }}
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.94 }}
          transition={{ duration: 0.22, ease: [0.2, 0.7, 0.2, 1] }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 sm:px-5 py-3.5 border-b border-border-pixel gap-3">
            <div className="flex items-center gap-3.5">
              <span
                className="font-pixel text-[8px] tracking-[0.12em] inline-flex items-center gap-2"
                style={{ color: cat }}
              >
                <Icon color={cat} className="w-4 h-4" />
                {meta.label}
              </span>
              <span className="font-pixel text-[8px] text-text-muted tracking-[0.1em]">
                [{stamp}]
              </span>
            </div>
            <button
              onClick={onClose}
              aria-label="Close (Esc)"
              className="font-pixel text-[8px] text-text-muted border border-border-pixel shadow-[0_0_0_1px_#2a2d4a] px-2.5 py-2 hover:text-text-primary hover:border-text-muted hover:shadow-[0_0_0_1px_#6b7094] transition-colors cursor-pointer inline-flex items-center gap-1.5 tracking-[0.1em] rounded-sm"
            >
              <X className="w-3 h-3" /> ESC
            </button>
          </div>

          {/* Body */}
          <div
            className={`grid overflow-auto ${
              photoCount > 0
                ? "grid-cols-1 lg:grid-cols-[minmax(0,1.4fr)_minmax(280px,1fr)]"
                : "grid-cols-1"
            }`}
          >
            {/* Carousel */}
            {photoCount > 0 && (
              <div
                className="relative bg-bg-base border-b lg:border-b-0 lg:border-r border-border-pixel flex items-center justify-center overflow-hidden select-none min-h-[260px] lg:min-h-[360px]"
                onMouseDown={(e) => onDown(e.clientX)}
                onMouseUp={(e) => onUp(e.clientX)}
                onTouchStart={(e) => onDown(e.touches[0].clientX)}
                onTouchEnd={(e) => onUp(e.changedTouches[0].clientX)}
              >
                <span className="absolute top-3 left-3 z-10 font-pixel text-[8px] text-text-muted bg-bg-base/70 shadow-[0_0_0_1px_#2a2d4a] px-2 py-1.5 tracking-[0.1em]">
                  PHOTO {idx + 1} / {photoCount}
                </span>

                <div
                  className="relative w-full aspect-[4/3] max-h-[520px]"
                  style={{
                    background:
                      "linear-gradient(rgba(124,109,245,0.04) 1px, transparent 1px) 0 0 / 32px 32px, linear-gradient(90deg, rgba(124,109,245,0.04) 1px, transparent 1px) 0 0 / 32px 32px, #0a0c1a",
                  }}
                >
                  <div className="absolute inset-3">
                    <Image
                      src={optimizeCloudinaryUrl(photos[idx])}
                      alt={`Photo ${idx + 1}`}
                      fill
                      className="object-contain"
                      sizes="(max-width:1024px) 100vw, 60vw"
                      priority
                    />
                  </div>
                </div>

                {photoCount > 1 && (
                  <>
                    <button
                      onClick={prev}
                      aria-label="Previous"
                      className="absolute top-1/2 -translate-y-1/2 left-2.5 w-9 h-9 flex items-center justify-center bg-bg-surface text-text-primary border-2 rounded-sm cursor-pointer transition-all hover:scale-105 z-10 font-pixel text-[12px]"
                      style={{ borderColor: cat, boxShadow: `0 0 10px ${cat}, 0 0 0 1px ${cat}` }}
                    >
                      ◀
                    </button>
                    <button
                      onClick={next}
                      aria-label="Next"
                      className="absolute top-1/2 -translate-y-1/2 right-2.5 w-9 h-9 flex items-center justify-center bg-bg-surface text-text-primary border-2 rounded-sm cursor-pointer transition-all hover:scale-105 z-10 font-pixel text-[12px]"
                      style={{ borderColor: cat, boxShadow: `0 0 10px ${cat}, 0 0 0 1px ${cat}` }}
                    >
                      ▶
                    </button>

                    <div className="absolute bottom-3.5 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                      {Array.from({ length: photoCount }).map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setIdx(i)}
                          aria-label={`Photo ${i + 1}`}
                          className="w-2 h-2 cursor-pointer"
                          style={{
                            background: i === idx ? cat : "transparent",
                            boxShadow:
                              i === idx
                                ? `0 0 8px ${cat}, 0 0 0 1px ${cat}`
                                : "0 0 0 1px #2a2d4a",
                          }}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Text side */}
            <div className="p-5 sm:p-6 overflow-auto flex flex-col gap-3.5">
              <h2 className="font-mono text-[16px] font-bold text-text-primary leading-[1.5] m-0">
                {entry.content}
              </h2>

              {entry.detail && (
                <div
                  className="font-mono text-[13px] text-text-muted leading-[1.75] pl-3 border-l-2"
                  style={{ borderColor: cat }}
                >
                  {entry.detail}
                </div>
              )}

              {photoCount > 1 && (
                <div>
                  <div className="font-pixel text-[7px] text-text-muted tracking-[0.1em] mb-1.5">
                    ▸ GALLERY ({photoCount})
                  </div>
                  <div className="grid grid-cols-3 gap-1.5">
                    {photos.map((src, i) => (
                      <button
                        key={i}
                        onClick={() => setIdx(i)}
                        aria-label={`Photo ${i + 1}`}
                        className="relative aspect-square bg-bg-elevated border overflow-hidden cursor-pointer transition-all"
                        style={{
                          borderColor: i === idx ? cat : "#2a2d4a",
                          boxShadow:
                            i === idx
                              ? `0 0 8px ${cat}, 0 0 0 1px ${cat}`
                              : "0 0 0 1px #2a2d4a",
                        }}
                      >
                        <Image
                          src={optimizeCloudinaryUrl(src)}
                          alt={`Thumb ${i + 1}`}
                          fill
                          className="object-cover"
                          sizes="120px"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {photoCount > 0 && (
                <div className="font-pixel text-[7px] text-text-muted tracking-[0.1em]">
                  <kbd className="inline-block bg-bg-elevated text-text-primary shadow-[0_0_0_1px_#2a2d4a] px-1.5 py-0.5 mx-0.5 font-pixel text-[7px]">
                    ←
                  </kbd>{" "}
                  <kbd className="inline-block bg-bg-elevated text-text-primary shadow-[0_0_0_1px_#2a2d4a] px-1.5 py-0.5 mx-0.5 font-pixel text-[7px]">
                    →
                  </kbd>{" "}
                  NAVIGATE ·{" "}
                  <kbd className="inline-block bg-bg-elevated text-text-primary shadow-[0_0_0_1px_#2a2d4a] px-1.5 py-0.5 mx-0.5 font-pixel text-[7px]">
                    ESC
                  </kbd>{" "}
                  CLOSE · DRAG/SWIPE
                </div>
              )}

              {entry.link_url && (
                <a
                  href={entry.link_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-pixel text-[8px] border-2 px-3 py-2.5 rounded-sm tracking-[0.1em] inline-flex items-center gap-2 cursor-pointer transition-colors w-fit"
                  style={{
                    color: cat,
                    borderColor: cat,
                    boxShadow: `0 0 0 1px ${cat}`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = cat;
                    e.currentTarget.style.color = "#0a0c1a";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = cat;
                  }}
                >
                  VIEW SOURCE →
                </a>
              )}

              <div className="flex justify-between font-pixel text-[7px] text-text-muted tracking-[0.1em] pt-3 border-t border-border-pixel mt-1">
                <span>QUEST ID</span>
                <span style={{ color: cat }}>{questId}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
