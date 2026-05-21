"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Github, ExternalLink, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ProjectData } from "./ProjectCard";
import { optimizeCloudinaryUrl } from "@/lib/utils";

interface Props {
  project: ProjectData | null;
  onClose: () => void;
}

export function QuestDetailModal({ project, onClose }: Props) {
  const [idx, setIdx] = useState(0);
  const dragRef = useRef<{ active: boolean; x0: number }>({ active: false, x0: 0 });

  const photos = project?.screenshots ?? [];
  const photoCount = photos.length;

  // Reset slide index when project changes
  useEffect(() => {
    setIdx(0);
  }, [project?.id]);

  const prev = () => setIdx((i) => (photoCount > 0 ? (i - 1 + photoCount) % photoCount : 0));
  const next = () => setIdx((i) => (photoCount > 0 ? (i + 1) % photoCount : 0));

  useEffect(() => {
    if (!project) return;
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
  }, [project, photoCount]);

  const onDown = (clientX: number) => {
    dragRef.current = { active: true, x0: clientX };
  };
  const onUp = (clientX: number) => {
    if (!dragRef.current.active) return;
    const dx = clientX - dragRef.current.x0;
    dragRef.current.active = false;
    if (Math.abs(dx) > 50) (dx < 0 ? next : prev)();
  };

  // Border + glow color by status
  const isShipped = project?.status === "shipped";
  const isLegendary = project?.featured;
  const mcat = isLegendary ? "#f5c542" : isShipped ? "#3dd6ac" : "#f55c5c";

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          key="modal-overlay"
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
            className="w-full max-w-[1040px] max-h-[calc(100vh-48px)] bg-bg-surface border-2 rounded-sm flex flex-col overflow-hidden"
            style={{
              borderColor: mcat,
              boxShadow: `0 0 28px ${mcat}, 0 0 0 1px ${mcat}`,
            }}
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.94 }}
            transition={{ duration: 0.22, ease: [0.2, 0.7, 0.2, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 sm:px-5 py-3.5 border-b border-border-pixel gap-3">
              <div className="flex items-center gap-3 sm:gap-4 flex-wrap min-w-0">
                <span className="font-mono text-[11px] text-text-muted tracking-[0.06em] uppercase">
                  QUEST #{project.id.slice(0, 6).toUpperCase()}
                </span>
                <span className="font-mono text-[15px] sm:text-[17px] font-bold text-text-primary truncate">
                  {project.title}
                </span>
                {isLegendary && (
                  <span
                    className="font-pixel text-[7px] text-bg-base bg-accent-gold px-2 py-1 shadow-[0_0_0_1px_#0a0c1a] tracking-[0.08em]"
                  >
                    ⭐ LEGENDARY
                  </span>
                )}
                <span
                  className="font-pixel text-[7px] px-1.5 py-1 tracking-[0.08em]"
                  style={{
                    color: isShipped ? "#3dd6ac" : "#f55c5c",
                    background: isShipped ? "rgba(61,214,172,0.15)" : "rgba(245,92,92,0.15)",
                    boxShadow: `0 0 0 1px ${isShipped ? "rgba(61,214,172,0.4)" : "rgba(245,92,92,0.4)"}`,
                  }}
                >
                  {isShipped ? "◆ SHIPPED" : "▶ IN PROGRESS"}
                </span>
              </div>
              <button
                onClick={onClose}
                aria-label="Close (Esc)"
                className="font-pixel text-[8px] text-text-muted border border-border-pixel shadow-[0_0_0_1px_#2a2d4a] px-2.5 py-2 hover:text-text-primary hover:border-text-muted hover:shadow-[0_0_0_1px_#6b7094] transition-colors cursor-pointer flex-shrink-0 inline-flex items-center gap-1.5 tracking-[0.1em]"
              >
                <X className="w-3 h-3" /> ESC
              </button>
            </div>

            {/* Body */}
            <div
              className={`grid overflow-auto ${
                photoCount > 0
                  ? "grid-cols-1 lg:grid-cols-[minmax(0,1.4fr)_minmax(300px,1fr)]"
                  : "grid-cols-1"
              }`}
            >
              {/* Carousel */}
              {photoCount > 0 && (
                <div
                  className="relative bg-bg-base border-b lg:border-b-0 lg:border-r border-border-pixel flex items-center justify-center overflow-hidden select-none min-h-[280px]"
                  onMouseDown={(e) => onDown(e.clientX)}
                  onMouseUp={(e) => onUp(e.clientX)}
                  onTouchStart={(e) => onDown(e.touches[0].clientX)}
                  onTouchEnd={(e) => onUp(e.changedTouches[0].clientX)}
                >
                  {/* Photo number label */}
                  <span className="absolute top-3.5 left-3.5 z-10 font-pixel text-[7px] text-text-muted bg-bg-base/78 shadow-[0_0_0_1px_#2a2d4a] px-2 py-1.5 tracking-[0.1em]">
                    PHOTO {idx + 1} / {photoCount}
                  </span>

                  {/* Stage with grid bg */}
                  <div
                    className="relative w-full aspect-[16/10] max-h-[560px]"
                    style={{
                      background:
                        "linear-gradient(rgba(124,109,245,0.04) 1px, transparent 1px) 0 0 / 32px 32px, linear-gradient(90deg, rgba(124,109,245,0.04) 1px, transparent 1px) 0 0 / 32px 32px, #0a0c1a",
                    }}
                  >
                    <div className="absolute inset-3.5">
                      <Image
                        src={optimizeCloudinaryUrl(photos[idx])}
                        alt={`${project.title} screenshot ${idx + 1}`}
                        fill
                        className="object-contain"
                        sizes="(max-width:1024px) 100vw, 60vw"
                        priority
                      />
                    </div>
                  </div>

                  {/* Prev/Next buttons */}
                  {photoCount > 1 && (
                    <>
                      <button
                        onClick={prev}
                        aria-label="Previous photo"
                        className="absolute top-1/2 -translate-y-1/2 left-3 w-9 h-9 flex items-center justify-center bg-bg-surface text-text-primary border-2 rounded-sm cursor-pointer transition-all hover:scale-105 z-10 font-pixel text-[12px]"
                        style={{
                          borderColor: mcat,
                          boxShadow: `0 0 10px ${mcat}, 0 0 0 1px ${mcat}`,
                        }}
                      >
                        ◀
                      </button>
                      <button
                        onClick={next}
                        aria-label="Next photo"
                        className="absolute top-1/2 -translate-y-1/2 right-3 w-9 h-9 flex items-center justify-center bg-bg-surface text-text-primary border-2 rounded-sm cursor-pointer transition-all hover:scale-105 z-10 font-pixel text-[12px]"
                        style={{
                          borderColor: mcat,
                          boxShadow: `0 0 10px ${mcat}, 0 0 0 1px ${mcat}`,
                        }}
                      >
                        ▶
                      </button>

                      {/* Dots */}
                      <div className="absolute bottom-3.5 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                        {Array.from({ length: photoCount }).map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setIdx(i)}
                            aria-label={`Go to photo ${i + 1}`}
                            className="w-2 h-2 cursor-pointer"
                            style={{
                              background: i === idx ? mcat : "transparent",
                              boxShadow:
                                i === idx
                                  ? `0 0 8px ${mcat}, 0 0 0 1px ${mcat}`
                                  : "0 0 0 1px #2a2d4a",
                            }}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Text panel */}
              <div className="p-5 sm:p-6 overflow-auto flex flex-col gap-3.5">
                <div
                  className="font-mono text-[14px] text-text-primary italic leading-[1.6] pl-3 border-l-2"
                  style={{ borderColor: mcat }}
                >
                  {project.tagline}
                </div>

                {project.description && (
                  <div className="font-mono text-[13px] text-text-muted leading-[1.75]">
                    {project.description}
                  </div>
                )}

                <h4 className="font-pixel text-[8px] text-text-muted tracking-[0.12em] mt-1.5 mb-0">
                  STACK
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {project.stack.map((t) => (
                    <span
                      key={t}
                      className="font-mono text-[10px] text-accent-violet bg-accent-violet/12 border border-accent-violet shadow-[0_0_0_1px_#7c6df5] px-1.5 py-0.5"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {photoCount > 1 && (
                  <>
                    <h4 className="font-pixel text-[8px] text-text-muted tracking-[0.12em] mt-1.5 mb-0">
                      ▸ GALLERY ({photoCount})
                    </h4>
                    <div className="grid grid-cols-4 gap-1.5">
                      {photos.map((src, i) => (
                        <button
                          key={i}
                          onClick={() => setIdx(i)}
                          aria-label={`Open photo ${i + 1}`}
                          className="relative aspect-square bg-bg-elevated border overflow-hidden cursor-pointer transition-all"
                          style={{
                            borderColor: i === idx ? mcat : "#2a2d4a",
                            boxShadow:
                              i === idx
                                ? `0 0 8px ${mcat}, 0 0 0 1px ${mcat}`
                                : "0 0 0 1px #2a2d4a",
                          }}
                        >
                          <Image
                            src={optimizeCloudinaryUrl(src)}
                            alt={`Thumbnail ${i + 1}`}
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        </button>
                      ))}
                    </div>
                  </>
                )}

                {(project.repo_url || project.live_url) && (
                  <div className="flex gap-2.5 flex-wrap pt-1">
                    {project.repo_url && (
                      <a
                        href={project.repo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-pixel text-[8px] border-2 shadow-[0_0_0_1px] px-3 py-2.5 cursor-pointer transition-colors tracking-[0.1em] inline-flex items-center gap-2"
                        style={{
                          color: mcat,
                          borderColor: mcat,
                          // @ts-expect-error CSS var
                          "--ring": mcat,
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = mcat;
                          e.currentTarget.style.color = "#0a0c1a";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "transparent";
                          e.currentTarget.style.color = mcat;
                        }}
                      >
                        <Github className="w-3 h-3" /> REPO
                      </a>
                    )}
                    {project.live_url && (
                      <a
                        href={project.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-pixel text-[8px] border-2 shadow-[0_0_0_1px] px-3 py-2.5 cursor-pointer transition-colors tracking-[0.1em] inline-flex items-center gap-2"
                        style={{ color: mcat, borderColor: mcat }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = mcat;
                          e.currentTarget.style.color = "#0a0c1a";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "transparent";
                          e.currentTarget.style.color = mcat;
                        }}
                      >
                        <ExternalLink className="w-3 h-3" /> LIVE
                      </a>
                    )}
                  </div>
                )}

                {photoCount > 0 && (
                  <div className="font-pixel text-[7px] text-text-muted tracking-[0.1em] mt-2">
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
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
