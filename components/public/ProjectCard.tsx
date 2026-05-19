"use client";

import Image from "next/image";
import { ExternalLink, Github, Star } from "lucide-react";
import { StackTag } from "./StackTag";
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
}

export function ProjectCard({ project, className, priority = false }: ProjectCardProps) {
  const isFeatured = project.featured;

  return (
    <div
      className={cn(
        "group relative flex flex-col bg-bg-base border-2 rounded-sm overflow-hidden transition-all duration-300",
        isFeatured ? "border-accent-gold" : "border-border-pixel",
        "hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]",
        isFeatured ? "hover:shadow-accent-gold/20" : "hover:shadow-border-pixel/50",
        className
      )}
    >
      {/* Featured Badge */}
      {isFeatured && (
        <div className="absolute top-0 right-0 z-10 bg-accent-gold text-bg-base px-2 py-1 flex items-center gap-1 rounded-bl-sm border-b-2 border-l-2 border-accent-gold">
          <Star className="w-3 h-3 fill-bg-base" />
          <span className="font-pixel text-[8px] uppercase tracking-wider">Legendary</span>
        </div>
      )}

      {/* Image Container */}
      <div className="relative w-full aspect-video bg-border-pixel/20 border-b-2 border-inherit">
        {project.screenshots && project.screenshots.length > 0 ? (
          <Image
            src={optimizeCloudinaryUrl(project.screenshots[0])}
            alt={project.title}
            fill
            priority={priority}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center font-mono text-xs text-text-primary/40">
            No image available
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute bottom-2 left-2 z-10">
          <span
            className={cn(
              "px-2 py-1 text-[10px] font-mono uppercase tracking-wider rounded-sm backdrop-blur-md border",
              project.status === "shipped"
                ? "bg-accent-teal/20 text-accent-teal border-accent-teal/50"
                : "bg-accent-red/20 text-accent-red border-accent-red/50"
            )}
          >
            {project.status.replace("_", " ")}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-pixel text-sm text-text-primary mb-2 line-clamp-1">{project.title}</h3>
        <p className="font-mono text-xs text-text-primary/70 mb-4 line-clamp-2">{project.tagline}</p>
        
        {/* Stack Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {project.stack.slice(0, 4).map((tag) => (
            <StackTag key={tag} tag={tag} />
          ))}
          {project.stack.length > 4 && (
             <span className="text-xs font-mono text-text-primary/50 flex items-center">+{project.stack.length - 4}</span>
          )}
        </div>

        {/* Links */}
        <div className="mt-auto flex items-center gap-4 pt-4 border-t border-border-pixel/50">
          {project.live_url && (
            <a
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 text-xs font-mono uppercase text-accent-teal hover:text-accent-teal/80 transition-colors min-h-[44px] min-w-[44px]"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Live</span>
            </a>
          )}
          {project.repo_url && (
            <a
              href={project.repo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 text-xs font-mono uppercase text-text-primary/70 hover:text-text-primary transition-colors min-h-[44px] min-w-[44px]"
            >
              <Github className="w-4 h-4" />
              <span>Code</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
