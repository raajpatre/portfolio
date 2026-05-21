"use client";

import { motion } from "framer-motion";
import { MapPin, GraduationCap, Users, BarChart3, Save, Download } from "lucide-react";
import { origin, guild, factions, stats, saveFile } from "@/data/about";
import { PixelButton } from "@/components/ui/PixelButton";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.6 },
};

// ─── Chapter Wrapper ────────────────────────────────────────────────────

function ChapterCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`relative w-full py-16 px-4 ${className ?? ""}`}
    >
      <div className="mx-auto max-w-3xl w-full">{children}</div>
    </section>
  );
}

// ─── Chapter Headers ────────────────────────────────────────────────────

function ChapterHeader({
  icon: Icon,
  label,
}: {
  icon: React.ElementType;
  label: string;
}) {
  return (
    <motion.div
      {...fadeUp}
      className="flex items-center gap-3 mb-10"
    >
      <Icon className="w-5 h-5 text-accent-gold" />
      <h2 className="font-pixel text-lg sm:text-xl uppercase tracking-wider text-accent-gold">
        {label}
      </h2>
    </motion.div>
  );
}

// ─── Ch 1: Origin ───────────────────────────────────────────────────────

function MobileOrigin() {
  return (
    <ChapterCard className="pt-24 min-h-[90vh] flex items-center about-nightsky">
      <div className="flex flex-col items-center text-center space-y-6">
        <motion.h1
          {...fadeUp}
          className="font-pixel text-4xl sm:text-5xl text-text-primary"
        >
          {origin.name}
        </motion.h1>

        <motion.p
          {...fadeUp}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-pixel text-xs sm:text-sm text-accent-violet uppercase tracking-widest"
        >
          {origin.class} · LVL {origin.level}
        </motion.p>

        <motion.p
          {...fadeUp}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="font-mono text-sm text-text-primary/70 leading-relaxed max-w-xl"
        >
          {origin.bio}
        </motion.p>

        <motion.div
          {...fadeUp}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex items-center gap-2 text-text-primary/50 font-mono text-xs uppercase"
        >
          <MapPin className="w-4 h-4 text-accent-teal" />
          {origin.location}
        </motion.div>
      </div>
    </ChapterCard>
  );
}

// ─── Ch 2: Guild ────────────────────────────────────────────────────────

function MobileGuild() {
  return (
    <ChapterCard>
      <ChapterHeader icon={GraduationCap} label="Guild" />
      <motion.div
        {...fadeUp}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="border-2 border-border-pixel rounded-sm p-6 sm:p-8 bg-bg-base/50"
      >
        <h3 className="font-pixel text-sm text-text-primary mb-4">
          {guild.institution}
        </h3>
        <div className="space-y-2 font-mono text-xs text-text-primary/70">
          <p>
            <span className="text-accent-violet">Role:</span> {guild.role}
          </p>
          <p>
            <span className="text-accent-teal">Duration:</span> {guild.duration}
          </p>
          <p>
            <span className="text-accent-gold">Location:</span>{" "}
            {guild.location}
          </p>
        </div>
      </motion.div>
    </ChapterCard>
  );
}

// ─── Ch 3: Factions ─────────────────────────────────────────────────────

function MobileFactions() {
  return (
    <ChapterCard>
      <ChapterHeader icon={Users} label="Factions" />
      <div className="flex flex-col gap-6">
        {factions.map((f, i) => (
          <motion.div
            key={f.org}
            {...fadeUp}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="border-2 border-border-pixel rounded-sm p-6 bg-bg-base/50 hover:border-accent-violet/50 transition-colors"
          >
            <h3 className="font-pixel text-xs sm:text-sm text-text-primary mb-1">
              {f.org}
            </h3>
            <p className="font-mono text-xs text-accent-violet mb-1">
              {f.role}
            </p>
            <p className="font-mono text-[10px] text-text-primary/50 uppercase tracking-wider mb-4">
              {f.duration}
            </p>
            <p className="font-mono text-xs text-text-primary/70 leading-relaxed">
              {f.blurb}
            </p>
          </motion.div>
        ))}
      </div>
    </ChapterCard>
  );
}

// ─── Ch 4: Stats ────────────────────────────────────────────────────────

function MobileStats() {
  return (
    <ChapterCard>
      <ChapterHeader icon={BarChart3} label="Stats" />
      <div className="space-y-4">
        {stats.map((cat, i) => (
          <motion.div
            key={cat.label}
            {...fadeUp}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-4 border-2 border-border-pixel rounded-sm bg-bg-base/50"
          >
            <span className="font-mono text-xs text-accent-teal uppercase tracking-wider w-28 shrink-0">
              {cat.label}
            </span>
            <span className="font-mono text-xs text-text-primary/70">
              [{cat.skills.join(", ")}]
            </span>
          </motion.div>
        ))}
      </div>
    </ChapterCard>
  );
}

// ─── Ch 5: Save File ───────────────────────────────────────────────────

function MobileSaveFile() {
  return (
    <ChapterCard className="min-h-[60vh] flex items-center">
      <div className="flex flex-col items-center text-center space-y-8 w-full">
        <ChapterHeader icon={Save} label="Save File" />
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <a
            href={saveFile.resumePath}
            target="_blank"
            rel="noopener noreferrer"
          >
            <PixelButton variant="accent" className="text-sm px-8 py-4">
              <Download className="w-4 h-4 mr-3" />
              Export Save File 💾
            </PixelButton>
          </a>
        </motion.div>
        <motion.p
          {...fadeUp}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="font-mono text-xs text-text-primary/40"
        >
          {saveFile.version} · last updated {saveFile.lastUpdated}
        </motion.p>
      </div>
    </ChapterCard>
  );
}

// ─── Composed Mobile Layout ────────────────────────────────────────────

export function AboutMobile() {
  return (
    <div className="flex flex-col">
      <MobileOrigin />
      <MobileGuild />
      <MobileFactions />
      <MobileStats />
      <MobileSaveFile />
    </div>
  );
}
