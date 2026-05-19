"use client";

import { useState } from "react";
import { WelcomeScreen } from "./WelcomeScreen";
import { ParticleBackground } from "./ParticleBackground";
import { Hero } from "./Hero";
import { FeaturedProjects } from "./FeaturedProjects";
import { ProjectData } from "./ProjectCard";

export function HomeClient({ featuredProjects }: { featuredProjects: ProjectData[] }) {
  // Lazy initializer reads localStorage only on first render (client-side only)
  const [welcomeComplete, setWelcomeComplete] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem("rp-welcomed");
  });

  return (
    <>
      <WelcomeScreen onComplete={() => setWelcomeComplete(true)} />
      <ParticleBackground />
      <Hero />
      <FeaturedProjects projects={featuredProjects} />
    </>
  );
}

