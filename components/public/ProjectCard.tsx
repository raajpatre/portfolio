"use client";

import Image from "next/image";
import { ExternalLink, Github } from "lucide-react";
import { cn, optimizeCloudinaryUrl } from "@/lib/utils";

export interface ProjectData {
  id: string;
  title: string;
  tagline: string;
  description: string;
  stack: string[];
  live_url: string | null;
  repo_url: string | null;
  screenshots: string[];
  status: "shipped" | "in_progress";
  featured: boolean;
}

interface ProjectCardProps {
  project: ProjectData;
  className?: string;
  priority?: boolean;
  onOpen?: () => void;
}

export function ProjectCard({ project, className, priority = false, onOpen }: ProjectCardProps) {
  const isLegendary = project.featured;
  const isShipped = project.status === "shipped";
  const photoCount = project.screenshots?.length ?? 0;

  return (
    <article
      className={cn(
        "group relative flex flex-col bg-bg-surface border-2 overflow-hidden transition-all duration-200 rounded-sm",
        isLegendary
          ? "border-accent-gold shadow-[0_0_0_1px_#f5c542] animate-[goldShimmer_2s_linear_infinite] hover:-translate-y-1 hover:shadow-[0_0_24px_rgba(245,197,66,0.3),0_0_0_1px_#f5c542]"
          : "border-border-pixel shadow-[0_0_0_1px_#2a2d4a] hover:-translate-y-1 hover:border-accent-violet hover:shadow-[0_0_16px_rgba(124,109,245,0.25),0_0_0_1px_#7c6df5]",
        className
      )}
    >
      {/* Status bar (top edge) */}
      <div
        className={cn(
          "h-1 w-full",
          isLegendary ? "bg-accent-gold" : isShipped ? "bg-accent-teal" : "bg-accent-red"
        )}
      />

      {/* Legendary badge with notched corner */}
      {isLegendary && (
        <span
          className="absolute top-2 right-2 z-[2] font-pixel text-[7px] text-bg-base bg-accent-gold px-2 py-1 shadow-[0_0_0_1px_#0a0c1a] tracking-[0.08em]"
          style={{
            clipPath:
              "polygon(0 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%)",
          }}
        >
          ⭐ LEGENDARY
        </span>
      )}

      {/* Cover image — clickable, opens modal */}
      {photoCount > 0 ? (
        <button
          type="button"
          onClick={onOpen}
          title="Open quest details"
          className={cn(
            "relative aspect-video border-b overflow-hidden cursor-pointer text-left w-full",
            isLegendary ? "border-accent-gold/40" : "border-border-pixel"
          )}
          style={{
            background:
              "repeating-linear-gradient(45deg, rgba(124,109,245,0.06) 0 8px, rgba(124,109,245,0.02) 8px 16px), #1a1e38",
          }}
        >
          <Image
            src={optimizeCloudinaryUrl(project.screenshots[0])}
            alt={project.title}
            fill
            priority={priority}
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {/* Corner icon */}
          <span
            className="absolute left-2.5 top-2.5 w-7 h-7 flex items-center justify-center font-pixel text-[12px] text-accent-gold border border-border-pixel shadow-[0_0_0_1px_#2a2d4a] bg-bg-base/78 z-[2]"
            aria-hidden="true"
          >
            ◆
          </span>
          {/* Photo count badge */}
          {photoCount > 1 && (
            <span
              className={cn(
                "absolute right-2.5 bottom-2.5 font-pixel text-[7px] px-2 py-1.5 z-[2] bg-bg-base/78 backdrop-blur-sm tracking-[0.1em] border",
                isLegendary
                  ? "text-accent-gold border-accent-gold shadow-[0_0_0_1px_#f5c542]"
                  : "text-accent-violet border-accent-violet shadow-[0_0_0_1px_#7c6df5]"
              )}
            >
              ▸ {photoCount} PHOTOS
            </span>
          )}
        </button>
      ) : (
        <div
          className={cn(
            "relative aspect-video border-b overflow-hidden flex items-center justify-center",
            isLegendary ? "border-accent-gold/40" : "border-border-pixel"
          )}
          style={{
            background:
              "repeating-linear-gradient(45deg, rgba(124,109,245,0.06) 0 8px, rgba(124,109,245,0.02) 8px 16px), #1a1e38",
          }}
        >
          <span className="font-pixel text-[8px] text-text-muted">NO SCREENSHOT</span>
        </div>
      )}

      {/* Card header */}
      <div className="flex items-center justify-between px-4 pt-3 pb-1.5 gap-2">
        <span className="font-mono text-[10px] text-text-muted tracking-[0.06em] uppercase">
          QUEST #{project.id.slice(0, 6).toUpperCase()}
        </span>
        <span
          className={cn(
            "font-pixel text-[7px] px-1.5 py-1 tracking-[0.08em]",
            isShipped
              ? "text-accent-teal bg-accent-teal/15 shadow-[0_0_0_1px_rgba(61,214,172,0.4)]"
              : "text-accent-red bg-accent-red/15 shadow-[0_0_0_1px_rgba(245,92,92,0.4)]"
          )}
        >
          {isShipped ? "◆ SHIPPED" : "▶ IN PROGRESS"}
        </span>
      </div>

      {/* Title + tagline */}
      <div className="px-4 pt-1 pb-1">
        <h3 className="font-mono text-[17px] font-bold text-text-primary tracking-[0.01em] mb-1 line-clamp-1">
          {project.title}
        </h3>
        <p className="font-mono text-xs text-text-muted italic line-clamp-2 min-h-[34px] leading-[1.55]">
          {project.tagline}
        </p>
      </div>

      <div className="h-px bg-border-pixel mx-3 my-1" />

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 px-4 py-2">
        {project.stack.slice(0, 5).map((tag) => (
          <span
            key={tag}
            className="font-mono text-[10px] text-accent-violet bg-accent-violet/12 border border-accent-violet shadow-[0_0_0_1px_#7c6df5] px-1.5 py-0.5"
          >
            {tag}
          </span>
        ))}
        {project.stack.length > 5 && (
          <span className="font-mono text-[10px] text-text-muted border border-border-pixel shadow-[0_0_0_1px_#2a2d4a] px-1.5 py-0.5">
            +{project.stack.length - 5}
          </span>
        )}
      </div>

      {/* Spacer pushes footer to bottom */}
      <div className="flex-1" />

      {/* Footer links + INSPECT */}
      <div className="flex items-center justify-between px-4 py-3.5 border-t border-border-pixel gap-2">
        <div className="flex items-center gap-4">
          {project.repo_url && (
            <a
              href={project.repo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-mono text-[10px] text-text-muted hover:text-accent-violet transition-colors"
            >
              <Github className="w-3.5 h-3.5" />
              REPO
            </a>
          )}
          {project.live_url && (
            <a
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-mono text-[10px] text-text-muted hover:text-accent-teal transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              LIVE
            </a>
          )}
        </div>
        <button
          type="button"
          onClick={onOpen}
          className="font-pixel text-[7px] text-text-muted hover:text-accent-gold transition-colors cursor-pointer tracking-[0.08em]"
        >
          INSPECT →
        </button>
      </div>
    </article>
  );
}
