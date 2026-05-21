"use client";

import { useEffect, useState, useCallback, useRef } from "react";

const CHAPTERS = [
  { n: "01", name: "ORIGIN" },
  { n: "02", name: "GUILD" },
  { n: "03", name: "FACTIONS" },
  { n: "04", name: "STATS" },
  { n: "05", name: "SAVE FILE" },
];

/**
 * Drives the Character Sheet about page:
 *  - IntersectionObserver tracks which chapter is in view (adds .in class)
 *  - Fixed left chapter tracker + mobile pip tracker (rendered here)
 *  - Parallax on chapter 1's mountain layers (rAF scroll listener)
 *  - Click to scroll smoothly between chapters
 */
export function AboutClient() {
  const [active, setActive] = useState(0);
  const seenRef = useRef<Set<number>>(new Set());
  const ch1Ref = useRef<HTMLElement | null>(null);

  // ── IntersectionObserver: track active chapter, add .in class ──────
  useEffect(() => {
    const chapters = Array.from(
      document.querySelectorAll<HTMLElement>("#about-root [data-chapter]")
    );
    if (chapters.length === 0) return;

    ch1Ref.current = chapters[0];

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          const idx = Number((e.target as HTMLElement).dataset.chapter);
          if (e.isIntersecting) {
            setActive(idx);
            if (!seenRef.current.has(idx)) {
              seenRef.current.add(idx);
              (e.target as HTMLElement).classList.add("in");
            }
          }
        });
      },
      { threshold: [0.45], rootMargin: "-15% 0px -25% 0px" }
    );

    chapters.forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, []);

  // ── Parallax for chapter 1 mountain layers ─────────────────────────
  useEffect(() => {
    let raf = 0;
    const handler = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const el = ch1Ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const y = Math.max(0, -rect.top);
        el.querySelectorAll<HTMLElement>("[data-parallax]").forEach((layer) => {
          const factor = parseFloat(layer.dataset.parallax || "0");
          layer.style.transform = `translateY(${y * factor}px)`;
        });
      });
    };
    window.addEventListener("scroll", handler, { passive: true });
    handler();
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // ── Click handler — scroll to chapter ─────────────────────────────
  const goTo = useCallback((idx: number) => {
    const target = document.querySelector<HTMLElement>(
      `#about-root [data-chapter="${idx}"]`
    );
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <>
      {/* Desktop chapter tracker (left rail) */}
      <aside className="cs-tracker" aria-label="Chapter navigation">
        <span className="line" />
        {CHAPTERS.map((c, i) => (
          <button
            key={c.n}
            className={i === active ? "active" : ""}
            onClick={() => goTo(i)}
            aria-label={`Jump to chapter ${c.n}: ${c.name}`}
            aria-current={i === active ? "true" : undefined}
          >
            <span className="dot" />
            {c.n}
          </button>
        ))}
      </aside>

      {/* Mobile pip tracker */}
      <div className="cs-mobile-tracker" aria-hidden="true">
        {CHAPTERS.map((c, i) => (
          <span key={c.n} className={`pip ${i === active ? "active" : ""}`} />
        ))}
      </div>
    </>
  );
}
