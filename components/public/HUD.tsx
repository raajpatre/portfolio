"use client";

import { useState, useEffect } from "react";

interface HUDProps {
  questsCompleted: number;
  shipped: number;
  inProgress: number;
  languages: number;
}

export function HUD({ questsCompleted, shipped, inProgress, languages }: HUDProps) {
  const [time, setTime] = useState("");

  useEffect(() => {
    const fmt = () => {
      const d = new Date();
      return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
    };
    setTime(fmt());
    const t = setInterval(() => setTime(fmt()), 10000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="relative z-[1] flex flex-wrap justify-between items-center px-5 sm:px-8 lg:px-16 py-3.5 border-t border-b border-border-pixel bg-bg-surface font-pixel text-[8px] text-text-muted tracking-[0.1em] gap-3">
      <span className="flex items-center gap-2 text-accent-gold">
        <span className="w-1.5 h-1.5 bg-accent-gold shadow-[0_0_8px_#f5c542] inline-block" />
        · ★ {questsCompleted} QUESTS COMPLETED
      </span>
      <span className="flex items-center gap-2 text-accent-teal">
        <span className="w-1.5 h-1.5 bg-accent-teal shadow-[0_0_8px_#3dd6ac] inline-block" />
        · ◆ {shipped} SHIPPED · {inProgress} IN PROGRESS
      </span>
      <span className="flex items-center gap-2 text-accent-violet">
        <span className="w-1.5 h-1.5 bg-accent-violet shadow-[0_0_8px_#7c6df5] inline-block" />
        · ⚡ {languages} LANGUAGES UNLOCKED
      </span>
      <span className="flex items-center gap-2">
        <span className="w-1.5 h-1.5 bg-text-muted inline-block" />
        SAVE: AUTO{time ? ` · ${time}` : ""}
      </span>
    </div>
  );
}
