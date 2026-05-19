"use client";

import { useState } from "react";
import { WelcomeScreen } from "./WelcomeScreen";
import { ParticleBackground } from "./ParticleBackground";
import { Hero } from "./Hero";
import { FeaturedProjects } from "./FeaturedProjects";
import { ProjectData } from "./ProjectCard";

export function HomeClient({ featuredProjects }: { featuredProjects: ProjectData[] }) {
  const [welcomeComplete, setWelcomeComplete] = useState(false);

  return (
    <>
      {!welcomeComplete && (
        <WelcomeScreen onComplete={() => setWelcomeComplete(true)} />
      )}
      <ParticleBackground />
      <Hero />
      <FeaturedProjects projects={featuredProjects} />
    </>
  );
}
