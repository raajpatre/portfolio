"use client";

import { useState, useEffect } from "react";
import { WelcomeScreen } from "./WelcomeScreen";
import { Hero } from "./Hero";
import { FeaturedProjects } from "./FeaturedProjects";
import { HUD } from "./HUD";
import { ProjectData } from "./ProjectCard";
import type { FactionEntry, GuildEntry, OriginData, SaveFileData } from "@/data/about-types";

interface HomeClientProps {
  featuredProjects: ProjectData[];
  stats: {
    questsCompleted: number;
    shipped: number;
    inProgress: number;
  };
  about: {
    origin: OriginData;
    guild: GuildEntry;
    factions: FactionEntry[];
    saveFile: SaveFileData;
  };
}

export function HomeClient({ featuredProjects, stats, about }: HomeClientProps) {
  const [welcomeComplete, setWelcomeComplete] = useState(false);
  const [bgVisible, setBgVisible] = useState(false);

  useEffect(() => {
    // Sync with localStorage after hydration to avoid server/client mismatch
    if (localStorage.getItem("rp-welcomed")) {
      setWelcomeComplete(true);
    }
  }, []);

  useEffect(() => {
    if (welcomeComplete) {
      const t = setTimeout(() => setBgVisible(true), 100);
      return () => clearTimeout(t);
    }
  }, [welcomeComplete]);

  return (
    <>
      {/* Starfield (always present, fades out once bg gif shows) */}
      <div
        className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
        style={{
          background: `
            radial-gradient(ellipse at 20% 10%, rgba(124,109,245,0.06), transparent 50%),
            radial-gradient(ellipse at 80% 90%, rgba(61,214,172,0.04), transparent 50%),
            #0a0c1a
          `,
          opacity: bgVisible ? 0 : 1,
          transition: "opacity 800ms ease",
        }}
        aria-hidden="true"
      >
        {/* star layers via inline CSS animation */}
        <div className="absolute top-[-50%] left-0 w-full h-[200%]"
          style={{
            backgroundImage: `
              radial-gradient(1px 1px at 23px 47px, rgba(232,232,240,0.55), transparent 60%),
              radial-gradient(1px 1px at 89px 132px, rgba(232,232,240,0.4), transparent 60%),
              radial-gradient(1px 1px at 167px 211px, rgba(232,232,240,0.6), transparent 60%),
              radial-gradient(1px 1px at 234px 88px, rgba(232,232,240,0.35), transparent 60%),
              radial-gradient(1px 1px at 312px 256px, rgba(232,232,240,0.5), transparent 60%),
              radial-gradient(1px 1px at 401px 174px, rgba(232,232,240,0.45), transparent 60%),
              radial-gradient(1.5px 1.5px at 55px 90px, rgba(232,232,240,0.7), transparent 60%),
              radial-gradient(1.5px 1.5px at 220px 30px, rgba(124,109,245,0.6), transparent 60%),
              radial-gradient(2px 2px at 110px 60px, rgba(245,197,66,0.7), transparent 60%),
              radial-gradient(2px 2px at 340px 140px, rgba(232,232,240,0.85), transparent 60%)
            `,
            backgroundRepeat: "repeat",
            backgroundSize: "480px 480px",
            animation: "drift 90s linear infinite",
            opacity: 0.85,
          }}
        />
      </div>

      {/* Home background video (shown after entering) */}
      {welcomeComplete && (
        <div
          className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
          style={{
            opacity: bgVisible ? 1 : 0,
            transition: "opacity 800ms ease",
          }}
          aria-hidden="true"
        >
          <video
            src="/home-bg.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Dimming overlay for text readability */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to right, rgba(10,12,26,0.92) 0%, rgba(10,12,26,0.78) 30%, rgba(10,12,26,0.55) 60%, rgba(10,12,26,0.65) 100%)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(10,12,26,0.55) 0%, rgba(10,12,26,0) 200px), linear-gradient(to top, rgba(10,12,26,0.7) 0%, rgba(10,12,26,0) 220px)",
            }}
          />
        </div>
      )}

      {/* Welcome screen overlay */}
      {!welcomeComplete && (
        <WelcomeScreen onComplete={() => setWelcomeComplete(true)} />
      )}

      {/* Main content */}
      <Hero
        origin={about.origin}
        guild={about.guild}
        saveFile={about.saveFile}
      />
      <HUD {...stats} />
      <FeaturedProjects projects={featuredProjects} />
    </>
  );
}
