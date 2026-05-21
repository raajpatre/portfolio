"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProjectCard, ProjectData } from "./ProjectCard";
import { QuestDetailModal } from "./QuestDetailModal";
import { cn } from "@/lib/utils";

interface QuestBoardProps {
  projects: ProjectData[];
}

export function QuestBoard({ projects }: QuestBoardProps) {
  const [selectedTag, setSelectedTag] = useState<string>("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [openProject, setOpenProject] = useState<ProjectData | null>(null);

  // Top-N stack tags (by frequency) — matches design's `topTags`
  const topTags = useMemo(() => {
    const counts: Record<string, number> = {};
    projects.forEach((p) => p.stack.forEach((t) => { counts[t] = (counts[t] || 0) + 1; }));
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([t]) => t);
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const tagMatch = selectedTag === "All" || p.stack.includes(selectedTag);
      const statusMatch = selectedStatus === "All" || p.status === selectedStatus;
      return tagMatch && statusMatch;
    });
  }, [projects, selectedTag, selectedStatus]);

  const hasActiveFilter = selectedTag !== "All" || selectedStatus !== "All";
  const clearAll = () => {
    setSelectedTag("All");
    setSelectedStatus("All");
  };

  return (
    <div className="relative z-[1]">
      {/* Sticky filter bar */}
      <div className="sticky top-16 z-20 bg-bg-base border-b border-border-pixel px-5 sm:px-8 lg:px-16 py-3.5 flex items-center gap-3 flex-wrap">
        <span className="font-pixel text-[8px] text-text-muted tracking-[0.1em] mr-1">STATUS</span>
        {[
          { key: "All", label: "ALL", glyph: "◆" },
          { key: "shipped", label: "SHIPPED", glyph: "✓" },
          { key: "in_progress", label: "IN PROGRESS", glyph: "▶" },
        ].map((s) => (
          <button
            key={s.key}
            onClick={() => setSelectedStatus(s.key)}
            className={cn(
              "font-mono text-[11px] border px-2.5 py-1.5 transition-all duration-140 cursor-pointer rounded-sm tracking-[0.02em]",
              selectedStatus === s.key
                ? "bg-accent-violet text-bg-base border-accent-violet shadow-[0_0_10px_rgba(124,109,245,0.55),0_0_0_1px_#7c6df5]"
                : "bg-transparent text-text-muted border-border-pixel shadow-[0_0_0_1px_#2a2d4a] hover:text-accent-violet hover:border-accent-violet hover:shadow-[0_0_0_1px_#7c6df5]"
            )}
          >
            <span className="mr-1.5">{s.glyph}</span>
            {s.label}
          </button>
        ))}

        <div className="h-4 w-px bg-border-pixel mx-1 hidden sm:block" />

        <span className="font-pixel text-[8px] text-text-muted tracking-[0.1em] mr-1">STACK</span>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedTag("All")}
            className={cn(
              "font-mono text-[11px] border px-2.5 py-1.5 transition-all duration-140 cursor-pointer rounded-sm",
              selectedTag === "All"
                ? "bg-accent-violet text-bg-base border-accent-violet shadow-[0_0_10px_rgba(124,109,245,0.55),0_0_0_1px_#7c6df5]"
                : "bg-transparent text-text-muted border-border-pixel shadow-[0_0_0_1px_#2a2d4a] hover:text-accent-violet hover:border-accent-violet hover:shadow-[0_0_0_1px_#7c6df5]"
            )}
          >
            All
          </button>
          {topTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={cn(
                "font-mono text-[11px] border px-2.5 py-1.5 transition-all duration-140 cursor-pointer rounded-sm",
                selectedTag === tag
                  ? "bg-accent-violet text-bg-base border-accent-violet shadow-[0_0_10px_rgba(124,109,245,0.55),0_0_0_1px_#7c6df5]"
                  : "bg-transparent text-text-muted border-border-pixel shadow-[0_0_0_1px_#2a2d4a] hover:text-accent-violet hover:border-accent-violet hover:shadow-[0_0_0_1px_#7c6df5]"
              )}
            >
              {tag}
            </button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <span className="font-pixel text-[7px] bg-accent-gold text-bg-base shadow-[0_0_0_1px_#f5c542] px-2 py-1.5 tracking-[0.08em] rounded-sm whitespace-nowrap">
            {filteredProjects.length} QUEST{filteredProjects.length === 1 ? "" : "S"}
          </span>
          {hasActiveFilter && (
            <button
              onClick={clearAll}
              className="font-pixel text-[7px] text-text-muted border border-border-pixel shadow-[0_0_0_1px_#2a2d4a] px-2 py-1.5 hover:text-accent-violet hover:border-accent-violet hover:shadow-[0_0_0_1px_#7c6df5] transition-all cursor-pointer rounded-sm tracking-[0.08em]"
            >
              [ CLEAR ]
            </button>
          )}
        </div>
      </div>

      {/* Grid */}
      <div className="px-5 sm:px-8 lg:px-16 py-8 pb-20">
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 min-h-[400px]">
          <AnimatePresence mode="popLayout">
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project, index) => (
                <motion.div
                  layout
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.42, delay: index * 0.04 }}
                >
                  <ProjectCard
                    project={project}
                    className="h-full"
                    priority={index < 4}
                    onOpen={() => setOpenProject(project)}
                  />
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full flex flex-col items-center justify-center p-16 text-center"
              >
                <div className="w-32 h-32 border-2 border-dashed border-border-pixel bg-bg-surface flex items-center justify-center font-pixel text-[8px] text-text-muted mb-4 animate-[idleBounce_1.6s_ease-in-out_infinite]">
                  NO QUESTS
                </div>
                <p className="font-pixel text-sm text-text-muted mb-6">No quests match your filters.</p>
                <button
                  onClick={clearAll}
                  className="font-pixel text-[9px] text-bg-base bg-accent-violet border-2 border-accent-violet shadow-[0_0_0_1px_#7c6df5] px-4 py-3 hover:shadow-[0_0_16px_#7c6df5,0_0_0_1px_#7c6df5] hover:scale-[1.03] active:scale-[0.99] transition-all cursor-pointer rounded-sm tracking-[0.08em]"
                >
                  [ CLEAR FILTERS ]
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <QuestDetailModal project={openProject} onClose={() => setOpenProject(null)} />
    </div>
  );
}
