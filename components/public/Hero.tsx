"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { origin, guild, factions, saveFile } from "@/data/about";

const SOCIALS = [
  {
    label: "GitHub",
    href: "https://github.com/raajpatre",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="w-4 h-4">
        <path d="M12 .5C5.7.5.6 5.6.6 11.9c0 5 3.3 9.3 7.8 10.8.6.1.8-.2.8-.6v-2.2c-3.2.7-3.9-1.4-3.9-1.4-.5-1.3-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.7 1.3 3.4 1 .1-.8.4-1.3.8-1.6-2.6-.3-5.3-1.3-5.3-5.8 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.2 1.2.9-.3 1.9-.4 2.9-.4s2 .1 2.9.4c2.2-1.5 3.2-1.2 3.2-1.2.6 1.6.2 2.8.1 3.1.7.8 1.2 1.9 1.2 3.1 0 4.5-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.2c0 .3.2.7.8.6 4.5-1.5 7.8-5.8 7.8-10.8C23.4 5.6 18.3.5 12 .5z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/raajpatre",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="w-4 h-4">
        <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.22 8h4.56v14H.22V8zm7.4 0h4.37v1.92h.07c.61-1.15 2.1-2.36 4.32-2.36 4.62 0 5.47 3.04 5.47 7v7.44h-4.56v-6.6c0-1.57-.03-3.59-2.19-3.59-2.2 0-2.53 1.72-2.53 3.49V22H7.62V8z" />
      </svg>
    ),
  },
  {
    label: "X / Twitter",
    href: "https://x.com/raajpatre",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="w-4 h-4">
        <path d="M18.244 2H21.5l-7.5 8.57L23 22h-6.844l-5.36-7.012L4.6 22H1.34l8.02-9.165L1 2h7.02l4.85 6.41L18.244 2zm-1.2 18h1.9L7.06 4H5.06l11.984 16z" />
      </svg>
    ),
  },
];

function StatCard() {
  const factionNames = factions
    .slice(0, 2)
    .map((f) => f.org.replace("GirlScript Summer of Code", "GSSoC").replace("Google GenAI Academy APEC", "GenAI Academy"))
    .join(" · ");

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className="bg-bg-surface border-2 border-accent-gold rounded-sm shadow-[0_0_20px_rgba(245,197,66,0.18),0_0_0_1px_#f5c542]"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border-pixel">
        <span className="font-pixel text-[9px] text-accent-gold tracking-widest uppercase">· PLAYER STATS</span>
        <span className="font-pixel text-[8px] text-text-muted flex items-center gap-1">
          HP&nbsp;
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className={`inline-block w-2 h-2 bg-accent-red${i === 3 ? " opacity-35" : ""}`} style={{ clipPath: "polygon(50% 100%, 0 35%, 25% 0, 50% 25%, 75% 0, 100% 35%)" }} />
          ))}
        </span>
      </div>

      {/* Stat Rows */}
      <div className="grid grid-cols-[88px_1fr] gap-x-4 gap-y-2.5 px-4 py-4">
        <span className="font-pixel text-[8px] text-text-muted tracking-wider self-center uppercase">Class</span>
        <span className="font-mono text-sm text-text-primary self-center">{origin.class.replace("FULL-STACK DEVELOPER", "Full-stack Dev")}</span>

        <span className="font-pixel text-[8px] text-text-muted tracking-wider self-center uppercase">Guild</span>
        <span className="font-mono text-sm text-text-primary self-center">{guild.institution}</span>

        <span className="font-pixel text-[8px] text-text-muted tracking-wider self-center uppercase">Faction</span>
        <span className="font-mono text-sm text-text-primary self-center">{factionNames}</span>

        <span className="font-pixel text-[8px] text-text-muted tracking-wider self-center uppercase">Status</span>
        <span className="font-mono text-sm text-text-primary self-center flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-none bg-accent-teal shadow-[0_0_10px_#3dd6ac] animate-pulse" />
          Available for quests
        </span>

        <span className="font-pixel text-[8px] text-text-muted tracking-wider self-center uppercase">Level</span>
        <span className="font-mono text-sm text-accent-gold self-center font-bold">0{origin.level}</span>
      </div>

      {/* XP Bar */}
      <div className="px-4 pb-4 border-t border-border-pixel pt-3">
        <div className="flex justify-between font-pixel text-[8px] text-text-muted mb-2">
          <span>XP TO LVL 0{origin.level + 1}</span>
          <span className="text-accent-gold">640 / 1000</span>
        </div>
        <div className="h-2.5 bg-bg-elevated border border-border-pixel relative overflow-hidden">
          <motion.div
            className="h-full bg-[repeating-linear-gradient(90deg,#f5c542_0_6px,#d9ad34_6px_8px)] shadow-[0_0_10px_rgba(245,197,66,0.5)]"
            initial={{ width: 0 }}
            animate={{ width: "64%" }}
            transition={{ duration: 1.4, ease: "easeOut", delay: 0.4 }}
          />
        </div>
      </div>

      {/* Socials */}
      <div className="flex items-center gap-2 px-4 py-3 border-t border-border-pixel">
        {SOCIALS.map((s) => (
          <a
            key={s.label}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={s.label}
            className="w-8 h-8 flex items-center justify-center text-text-muted border border-border-pixel hover:text-accent-violet hover:border-accent-violet hover:shadow-[0_0_10px_#7c6df5,0_0_0_1px_#7c6df5] transition-all duration-150"
          >
            {s.icon}
          </a>
        ))}
        <span className="flex-1" />
        <a
          href="mailto:raajpatre.dev@gmail.com"
          className="font-pixel text-[8px] text-text-muted border border-border-pixel px-2 py-1.5 hover:text-text-primary hover:border-text-muted transition-colors"
        >
          raajpatre.dev@gmail.com
        </a>
      </div>
    </motion.div>
  );
}

export function Hero() {
  const [pfpError, setPfpError] = useState(false);

  return (
    <section className="relative z-[1] grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-10 lg:gap-12 px-5 sm:px-8 lg:px-16 pt-10 sm:pt-16 pb-8 items-center">
      {/* Left column */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Avatar + meta */}
        <div className="flex items-end gap-4 mb-5">
          <div
            className="w-[160px] h-[160px] sm:w-[200px] sm:h-[200px] lg:w-[220px] lg:h-[220px] border-2 border-accent-violet shadow-[0_0_16px_rgba(124,109,245,0.35),0_0_0_1px_#7c6df5] bg-bg-surface relative rounded-sm overflow-hidden flex-shrink-0 animate-[idleBounce_1.6s_ease-in-out_infinite]"
            style={{
              backgroundImage:
                "linear-gradient(135deg, rgba(124,109,245,0.08), rgba(61,214,172,0.04))",
            }}
          >
            {pfpError ? (
              <div className="absolute inset-0 flex items-center justify-center font-pixel text-[8px] text-text-muted text-center px-2 leading-relaxed">
                [ PFP ]
              </div>
            ) : (
              <Image
                src="/pfp.jpg"
                alt="Raaj Patre"
                fill
                className="object-cover object-top"
                sizes="220px"
                priority
                onError={() => setPfpError(true)}
              />
            )}
            <div className="absolute inset-1 border border-dashed border-accent-violet/25 pointer-events-none z-[1]" />
          </div>
          <div className="flex flex-col gap-1.5 pb-2">
            <span className="font-pixel text-[7px] text-text-muted border border-border-pixel px-1.5 py-1 uppercase tracking-widest w-max">
              CHARACTER · MAGE/DEV
            </span>
            <span className="font-pixel text-[7px] text-accent-teal border border-accent-teal shadow-[0_0_0_1px_#3dd6ac] px-1.5 py-1 uppercase tracking-widest w-max flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-accent-teal shadow-[0_0_8px_#3dd6ac] animate-pulse inline-block" />
              ONLINE
            </span>
          </div>
        </div>

        {/* Eyebrow */}
        <div className="font-pixel text-[9px] text-accent-teal tracking-[0.12em] flex items-center gap-2.5 mb-4">
          <span className="w-2 h-2 bg-accent-teal shadow-[0_0_10px_#3dd6ac] inline-block" />
          PLAYER ONE
        </div>

        {/* Name */}
        <h1 className="font-pixel text-2xl sm:text-3xl lg:text-[clamp(22px,4vw,32px)] text-text-primary mb-3 leading-tight"
          style={{ textShadow: "0 0 20px rgba(124,109,245,0.4)" }}
        >
          {origin.name.toUpperCase()}
        </h1>

        {/* Role */}
        <div className="font-pixel text-[10px] text-text-muted tracking-wider mb-5">
          {origin.class}
          <span className="text-border-pixel mx-2">·</span>
          LVL {String(origin.level).padStart(2, "0")}
        </div>

        {/* One-liner */}
        <p className="font-mono text-base text-text-primary italic max-w-md leading-relaxed mb-7">
          <span className="text-accent-violet">»</span> Building web apps and breaking them in equal measure.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap gap-3">
          <Link href="/projects">
            <button className="font-pixel text-[9px] tracking-wider px-4 py-3.5 border-2 border-accent-gold bg-accent-gold text-bg-base shadow-[0_0_0_1px_#f5c542] hover:shadow-[0_0_16px_#f5c542,0_0_0_1px_#f5c542] hover:-translate-y-0.5 transition-all duration-150 cursor-pointer">
              [ VIEW QUESTS ]
            </button>
          </Link>
          <a href={saveFile.resumePath} target="_blank" rel="noopener noreferrer">
            <button className="font-pixel text-[9px] tracking-wider px-4 py-3.5 border-2 border-accent-violet bg-transparent text-accent-violet shadow-[0_0_0_1px_#7c6df5] hover:shadow-[0_0_16px_#7c6df5,0_0_0_1px_#7c6df5] hover:-translate-y-0.5 transition-all duration-150 cursor-pointer">
              [ DOWNLOAD RESUME ]
            </button>
          </a>
        </div>
      </motion.div>

      {/* Right column — stat card */}
      <StatCard />
    </section>
  );
}
