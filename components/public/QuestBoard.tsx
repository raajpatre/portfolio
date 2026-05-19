"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProjectCard, ProjectData } from "./ProjectCard";
import { PixelButton } from "./PixelButton";
import { cn } from "@/lib/utils";

interface QuestBoardProps {
  projects: ProjectData[];
}

export function QuestBoard({ projects }: QuestBoardProps) {
  const [selectedTag, setSelectedTag] = useState<string>("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");

  // Extract unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    projects.forEach((p) => p.stack.forEach((t) => tags.add(t)));
    return ["All", ...Array.from(tags).sort()];
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const tagMatch = selectedTag === "All" || p.stack.includes(selectedTag);
      const statusMatch = selectedStatus === "All" || p.status === selectedStatus;
      return tagMatch && statusMatch;
    });
  }, [projects, selectedTag, selectedStatus]);

  return (
    <div className="w-full flex flex-col gap-8">
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-6 p-4 border-2 border-border-pixel bg-bg-base/50 rounded-sm">
        <div className="flex-1">
          <h3 className="font-pixel text-xs text-text-primary/70 mb-3 uppercase tracking-wider">Filter by Stack</h3>
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={cn(
                  "px-3 py-1.5 text-xs font-mono uppercase tracking-wider border rounded-sm transition-all",
                  selectedTag === tag
                    ? "bg-accent-violet text-bg-base border-accent-violet shadow-[0_0_10px_rgba(124,109,245,0.5)]"
                    : "bg-transparent text-text-primary/70 border-border-pixel hover:border-accent-violet/50 hover:text-text-primary"
                )}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="w-full md:w-auto md:min-w-[200px] border-t md:border-t-0 md:border-l border-border-pixel pt-4 md:pt-0 md:pl-6">
          <h3 className="font-pixel text-xs text-text-primary/70 mb-3 uppercase tracking-wider">Status</h3>
          <div className="flex flex-wrap gap-2">
            {["All", "shipped", "in_progress"].map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={cn(
                  "px-3 py-1.5 text-xs font-mono uppercase tracking-wider border rounded-sm transition-all",
                  selectedStatus === status
                    ? "bg-text-primary text-bg-base border-text-primary"
                    : "bg-transparent text-text-primary/70 border-border-pixel hover:border-text-primary/50 hover:text-text-primary"
                )}
              >
                {status.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 min-h-[400px]">
        <AnimatePresence mode="popLayout">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
              <motion.div
                layout
                key={project.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <ProjectCard project={project} className="h-full" />
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-border-pixel"
            >
              <p className="font-pixel text-sm text-text-primary/50 mb-4">No quests found matching your filters.</p>
              <PixelButton variant="secondary" onClick={() => { setSelectedTag("All"); setSelectedStatus("All"); }}>
                Reset Filters
              </PixelButton>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
