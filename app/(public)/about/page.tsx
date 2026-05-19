import { AboutClient } from "@/components/about/AboutClient";
import { origin, guild, factions, stats, saveFile } from "@/data/about";
import { MapPin, GraduationCap, Users, BarChart3, Save, Download } from "lucide-react";

export const metadata = {
  title: "About | Raaj Patre",
  description: `${origin.class} · LVL ${origin.level} — ${origin.bio.slice(0, 120)}…`,
};

/**
 * Architecture: all chapter content is rendered server-side in this page component.
 * AboutClient is a thin "use client" shell that:
 *   - adds the GSAP scroll driver (desktop)
 *   - adds the "Skip animation" button
 *   - switches to mobile layout via matchMedia
 * Content is visible in source HTML / without JS.
 */
export default function AboutPage() {
  return (
    <>
      {/* ── Server-rendered chapter content ── */}
      {/* This is what search engines and screen readers see.
          AboutClient reads data-chapter attributes and drives the animations.
          All text is present in the DOM regardless of JS. */}

      <div id="about-root" className="relative">

        {/* ── Chapter 1: Origin ── */}
        <section
          data-chapter="1"
          className="chapter about-nightsky relative w-full min-h-screen flex items-center justify-center overflow-hidden"
        >
          <div className="chapter-inner mx-auto max-w-3xl w-full px-4 py-16">
            <div className="flex flex-col items-center text-center space-y-6">
              <h1 className="chapter-el opacity-100 font-pixel text-5xl md:text-7xl text-text-primary">
                {origin.name}
              </h1>
              <p className="chapter-el font-pixel text-sm text-accent-violet uppercase tracking-widest">
                {origin.class} · LVL {origin.level}
              </p>
              <p className="chapter-el font-mono text-sm md:text-base text-text-primary/70 leading-relaxed max-w-xl">
                {origin.bio}
              </p>
              <div className="chapter-el flex items-center gap-2 text-text-primary/50 font-mono text-xs uppercase">
                <MapPin className="w-4 h-4 text-accent-teal" />
                {origin.location}
              </div>
            </div>
          </div>
        </section>

        {/* ── Chapter 2: Guild ── */}
        <section
          data-chapter="2"
          className="chapter relative w-full min-h-screen flex items-center justify-center"
        >
          <div className="chapter-inner mx-auto max-w-3xl w-full px-4 py-16">
            <div className="chapter-header flex items-center gap-3 mb-10">
              <GraduationCap className="w-5 h-5 text-accent-gold" />
              <h2 className="font-pixel text-xl sm:text-2xl uppercase tracking-wider text-accent-gold">
                Guild
              </h2>
            </div>
            <div className="chapter-el border-2 border-border-pixel rounded-sm p-8 bg-bg-base/50">
              <h3 className="font-pixel text-base text-text-primary mb-6">
                {guild.institution}
              </h3>
              <div className="space-y-3 font-mono text-sm text-text-primary/70">
                <p><span className="text-accent-violet">Role:</span> {guild.role}</p>
                <p><span className="text-accent-teal">Duration:</span> {guild.duration}</p>
                <p><span className="text-accent-gold">Location:</span> {guild.location}</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Chapter 3: Factions ── */}
        <section
          data-chapter="3"
          className="chapter relative w-full min-h-screen flex items-center justify-center"
        >
          <div className="chapter-inner mx-auto max-w-3xl w-full px-4 py-16">
            <div className="chapter-header flex items-center gap-3 mb-10">
              <Users className="w-5 h-5 text-accent-gold" />
              <h2 className="font-pixel text-xl sm:text-2xl uppercase tracking-wider text-accent-gold">
                Factions
              </h2>
            </div>
            <div className="flex flex-col gap-6">
              {factions.map((f) => (
                <div
                  key={f.org}
                  className="chapter-el border-2 border-border-pixel rounded-sm p-6 bg-bg-base/50"
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
          </div>
        </section>

        {/* ── Chapter 4: Stats ── */}
        <section
          data-chapter="4"
          className="chapter relative w-full min-h-screen flex items-center justify-center"
        >
          <div className="chapter-inner mx-auto max-w-3xl w-full px-4 py-16">
            <div className="chapter-header flex items-center gap-3 mb-10">
              <BarChart3 className="w-5 h-5 text-accent-gold" />
              <h2 className="font-pixel text-xl sm:text-2xl uppercase tracking-wider text-accent-gold">
                Stats
              </h2>
            </div>
            <div className="space-y-4">
              {stats.map((cat) => (
                <div
                  key={cat.label}
                  className="chapter-el flex items-center gap-6 p-5 border-2 border-border-pixel rounded-sm bg-bg-base/50"
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
          </div>
        </section>

        {/* ── Chapter 5: Save File ── */}
        <section
          data-chapter="5"
          className="chapter relative w-full min-h-screen flex items-center justify-center"
        >
          <div className="chapter-inner mx-auto max-w-3xl w-full px-4 py-16">
            <div className="chapter-header flex items-center gap-3 mb-10">
              <Save className="w-5 h-5 text-accent-gold" />
              <h2 className="font-pixel text-xl sm:text-2xl uppercase tracking-wider text-accent-gold">
                Save File
              </h2>
            </div>
            <div className="flex flex-col items-center text-center space-y-8">
              <div className="chapter-el">
                <a
                  href={saveFile.resumePath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 font-pixel text-sm uppercase tracking-wider px-10 py-5 border-2 border-accent-gold text-accent-gold hover:bg-accent-gold/10 transition-colors rounded-sm"
                >
                  <Download className="w-5 h-5" />
                  Export Save File 💾
                </a>
              </div>
              <p className="chapter-el font-mono text-xs text-text-primary/40">
                {saveFile.version} · last updated {saveFile.lastUpdated}
              </p>
            </div>
          </div>
        </section>

      </div>

      {/* ── Progressive Enhancement: GSAP scroll + mobile switch ── */}
      <AboutClient />
    </>
  );
}
