"use client";

import { motion } from "framer-motion";
import { ProjectCard, ProjectData } from "./ProjectCard";
import Link from "next/link";
import { PixelButton } from "./PixelButton";

interface FeaturedProjectsProps {
  projects: ProjectData[];
}

export function FeaturedProjects({ projects }: FeaturedProjectsProps) {
  if (!projects || projects.length === 0) return null;

  return (
    <section className="w-full py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-between mb-12 gap-4"
        >
          <h2 className="font-pixel text-xl sm:text-2xl text-accent-gold">Legendary Drops</h2>
          <Link href="/projects">
            <PixelButton variant="secondary" className="px-4 py-2 text-[10px]">
              View All Quests
            </PixelButton>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.slice(0, 3).map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <ProjectCard project={project} className="h-full" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
