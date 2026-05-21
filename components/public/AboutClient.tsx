"use client";

import { useEffect, useState } from "react";

/**
 * Behaviour-only client component. Renders no visible content itself.
 * - On ≥768px: dynamically imports GSAP and attaches ScrollTrigger
 *   pin/scrub behaviour to the already-server-rendered chapter sections.
 * - On <768px: adds the CSS class "about-mobile" to #about-root,
 *   which switches pin/height rules off and enables Framer-style stacking.
 * - "Skip animation" button: removes GSAP context and adds mobile class.
 */
export function AboutClient() {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  const [forceStacked, setForceStacked] = useState(false);

  // ── Viewport detection ──────────────────────────────────────────────
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // ── GSAP ScrollTrigger (desktop only) ──────────────────────────────
  useEffect(() => {
    if (isMobile === null) return; // wait for detection
    if (isMobile || forceStacked) {
      // Apply mobile stacked styles via CSS class
      document.getElementById("about-root")?.classList.add("about-mobile");
      return;
    }

    // Remove mobile class if switching back
    document.getElementById("about-root")?.classList.remove("about-mobile");

    let ctx: { revert: () => void } | undefined;

    const initGSAP = async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      const root = document.getElementById("about-root");
      if (!root) return;

      ctx = gsap.context(() => {
        const chapters = gsap.utils.toArray<HTMLElement>(".chapter", root);

        chapters.forEach((chapter) => {
          const header = chapter.querySelector<HTMLElement>(".chapter-header");
          const els = chapter.querySelectorAll<HTMLElement>(".chapter-el");

          // Skip initial-hide for first chapter (Origin) so there's no
          // blank flash while GSAP loads asynchronously. Only hide ch 2+.
          const chapterIndex = chapters.indexOf(chapter);
          if (chapterIndex > 0) {
            if (header) gsap.set(header, { opacity: 0, y: 30 });
            els.forEach((el) => gsap.set(el, { opacity: 0, y: 20 }));
          }

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: chapter,
              start: "top top",
              end: "+=80%",
              pin: true,
              scrub: 1,
              anticipatePin: 1,
            },
          });

          if (header) {
            tl.to(header, { opacity: 1, y: 0, duration: 0.3 }, 0);
          }
          if (els.length > 0) {
            tl.to(
              els,
              { opacity: 1, y: 0, duration: 0.3, stagger: 0.1 },
              header ? 0.2 : 0
            );
          }
        });

        // Snap between chapters
        ScrollTrigger.create({
          snap: {
            snapTo: 1 / Math.max(chapters.length - 1, 1),
            duration: { min: 0.2, max: 0.5 },
            delay: 0.05,
            ease: "power1.inOut",
          },
        });
      }, root);
    };

    initGSAP();

    return () => {
      ctx?.revert();
    };
  }, [isMobile, forceStacked]);

  // ── Skip animation handler ──────────────────────────────────────────
  const handleSkip = () => {
    setForceStacked(true);
  };

  const showSkip = isMobile === false && !forceStacked;

  return (
    <>
      {showSkip && (
        <div className="fixed top-20 right-4 z-50" aria-live="polite">
          <button
            onClick={handleSkip}
            className="font-mono text-[10px] uppercase tracking-wider text-text-primary/40 hover:text-accent-gold border border-border-pixel/50 hover:border-accent-gold/50 px-3 py-1.5 rounded-sm bg-bg-base/80 backdrop-blur-sm transition-colors focus:outline-none focus:ring-2 focus:ring-accent-gold"
            aria-label="Skip scroll animations and view all chapters at once"
          >
            Skip animation ↓
          </button>
        </div>
      )}
    </>
  );
}
