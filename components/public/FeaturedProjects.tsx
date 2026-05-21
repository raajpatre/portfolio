"use client";

import { motion } from "framer-motion";
import { ProjectCard, ProjectData } from "./ProjectCard";
import Link from "next/link";

interface FeaturedProjectsProps {
  projects: ProjectData[];
}

export function FeaturedProjects({ projects }: FeaturedProjectsProps) {
  if (!projects || projects.length === 0) return null;

  return (
    <section className="relative z-[1] px-5 sm:px-8 lg:px-16 py-12 pb-24">
      <div className="flex items-center justify-between mb-6">
        <span className="font-pixel text-[10px] text-accent-gold tracking-[0.1em] uppercase">★ Featured Quests</span>
        <Link
          href="/projects"
          className="font-pixel text-[8px] text-text-muted border border-border-pixel shadow-[0_0_0_1px_#2a2d4a] px-2.5 py-2 hover:text-text-primary hover:border-text-muted transition-colors"
        >
          [ ALL QUESTS ▸ ]
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {projects.slice(0, 3).map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.48, delay: index * 0.08 }}
          >
            <ProjectCard project={project} className="h-full" />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
