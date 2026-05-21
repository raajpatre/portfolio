"use client";

import { useEffect, useRef } from "react";
import { MapPin, GraduationCap, Users, BarChart3, Save, Download } from "lucide-react";
import { origin, guild, factions, stats, saveFile } from "@/data/about";
import { PixelButton } from "@/components/ui/PixelButton";

// ─── Chapter Shell ──────────────────────────────────────────────────────

function Chapter({
  id,
  children,
  className,
}: {
  id: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={`chapter relative w-full min-h-screen flex items-center justify-center overflow-hidden ${className ?? ""}`}
    >
      <div className="chapter-inner mx-auto max-w-3xl w-full px-4 py-16">
        {children}
      </div>
    </section>
  );
}

function ChapterHeader({
  icon: Icon,
  label,
  className,
}: {
  icon: React.ElementType;
  label: string;
  className?: string;
}) {
  return (
    <div className={`chapter-header flex items-center gap-3 mb-10 opacity-0 ${className ?? ""}`}>
      <Icon className="w-5 h-5 text-accent-gold" />
      <h2 className="font-pixel text-xl sm:text-2xl uppercase tracking-wider text-accent-gold">
        {label}
      </h2>
    </div>
  );
}

// ─── Ch 1: Origin ───────────────────────────────────────────────────────

function DesktopOrigin() {
  return (
    <Chapter id="ch-origin" className="about-nightsky">
      <div className="flex flex-col items-center text-center space-y-6">
        <h1 className="chapter-el opacity-0 font-pixel text-5xl md:text-7xl text-text-primary">
          {origin.name}
        </h1>
        <p className="chapter-el opacity-0 font-pixel text-sm text-accent-violet uppercase tracking-widest">
          {origin.class} · LVL {origin.level}
        </p>
        <p className="chapter-el opacity-0 font-mono text-sm md:text-base text-text-primary/70 leading-relaxed max-w-xl">
          {origin.bio}
        </p>
        <div className="chapter-el opacity-0 flex items-center gap-2 text-text-primary/50 font-mono text-xs uppercase">
          <MapPin className="w-4 h-4 text-accent-teal" />
          {origin.location}
        </div>
      </div>
    </Chapter>
  );
}

// ─── Ch 2: Guild ────────────────────────────────────────────────────────

function DesktopGuild() {
  return (
    <Chapter id="ch-guild">
      <ChapterHeader icon={GraduationCap} label="Guild" />
      <div className="chapter-el opacity-0 border-2 border-border-pixel rounded-sm p-8 bg-bg-base/50">
        <h3 className="font-pixel text-base text-text-primary mb-6">
          {guild.institution}
        </h3>
        <div className="space-y-3 font-mono text-sm text-text-primary/70">
          <p><span className="text-accent-violet">Role:</span> {guild.role}</p>
          <p><span className="text-accent-teal">Duration:</span> {guild.duration}</p>
          <p><span className="text-accent-gold">Location:</span> {guild.location}</p>
        </div>
      </div>
    </Chapter>
  );
}

// ─── Ch 3: Factions ─────────────────────────────────────────────────────

function DesktopFactions() {
  return (
    <Chapter id="ch-factions">
      <ChapterHeader icon={Users} label="Factions" />
      <div className="flex flex-col gap-6">
        {factions.map((f) => (
          <div
            key={f.org}
            className="chapter-el opacity-0 border-2 border-border-pixel rounded-sm p-6 bg-bg-base/50 hover:border-accent-violet/50 transition-colors"
          >
            <h3 className="font-pixel text-sm text-text-primary mb-1">{f.org}</h3>
            <p className="font-mono text-xs text-accent-violet mb-1">{f.role}</p>
            <p className="font-mono text-[10px] text-text-primary/50 uppercase tracking-wider mb-4">
              {f.duration}
            </p>
            <p className="font-mono text-sm text-text-primary/70 leading-relaxed">
              {f.blurb}
            </p>
          </div>
        ))}
      </div>
    </Chapter>
  );
}

// ─── Ch 4: Stats ────────────────────────────────────────────────────────

function DesktopStats() {
  return (
    <Chapter id="ch-stats">
      <ChapterHeader icon={BarChart3} label="Stats" />
      <div className="space-y-4">
        {stats.map((cat) => (
          <div
            key={cat.label}
            className="chapter-el opacity-0 flex items-center gap-6 p-5 border-2 border-border-pixel rounded-sm bg-bg-base/50"
          >
            <span className="font-mono text-sm text-accent-teal uppercase tracking-wider w-32 shrink-0">
              {cat.label}
            </span>
            <span className="font-mono text-sm text-text-primary/70">
              [{cat.skills.join(", ")}]
            </span>
          </div>
        ))}
      </div>
    </Chapter>
  );
}

// ─── Ch 5: Save File ───────────────────────────────────────────────────

function DesktopSaveFile() {
  return (
    <Chapter id="ch-save">
      <div className="flex flex-col items-center text-center space-y-8">
        <ChapterHeader icon={Save} label="Save File" />
        <div className="chapter-el opacity-0">
          <a href={saveFile.resumePath} target="_blank" rel="noopener noreferrer">
            <PixelButton variant="accent" className="text-base px-10 py-5">
              <Download className="w-5 h-5 mr-3" />
              Export Save File 💾
            </PixelButton>
          </a>
        </div>
        <p className="chapter-el opacity-0 font-mono text-xs text-text-primary/40">
          {saveFile.version} · last updated {saveFile.lastUpdated}
        </p>
      </div>
    </Chapter>
  );
}

// ─── GSAP Orchestration ────────────────────────────────────────────────

export function AboutDesktop() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx: ReturnType<typeof import("gsap")["gsap"]["context"]> | undefined;

    // Dynamic import — GSAP only loads on this page, after first paint
    const initScrollTrigger = async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      if (!containerRef.current) return;

      ctx = gsap.context(() => {
        const chapters = gsap.utils.toArray<HTMLElement>(".chapter");

        chapters.forEach((chapter) => {
          const header = chapter.querySelector(".chapter-header");
          const els = chapter.querySelectorAll(".chapter-el");

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: chapter,
              start: "top top",
              end: "+=100%",
              pin: true,
              scrub: 0.8,
              anticipatePin: 1,
            },
          });

          // Animate header
          if (header) {
            tl.fromTo(
              header,
              { opacity: 0, y: 30 },
              { opacity: 1, y: 0, duration: 0.3 },
              0
            );
          }

          // Stagger content elements
          if (els.length > 0) {
            tl.fromTo(
              els,
              { opacity: 0, y: 20 },
              { opacity: 1, y: 0, duration: 0.3, stagger: 0.08 },
              header ? 0.15 : 0
            );
          }
        });

        // Optional: snap between chapters
        ScrollTrigger.create({
          snap: {
            snapTo: 1 / (chapters.length - 1),
            duration: { min: 0.2, max: 0.6 },
            delay: 0.1,
            ease: "power1.inOut",
          },
        });
      }, containerRef);
    };

    initScrollTrigger();

    return () => {
      ctx?.revert();
    };
  }, []);

  return (
    <div ref={containerRef}>
      <DesktopOrigin />
      <DesktopGuild />
      <DesktopFactions />
      <DesktopStats />
      <DesktopSaveFile />
    </div>
  );
}
