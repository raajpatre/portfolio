"use client";

import { motion } from "framer-motion";
import { Trophy, Rocket, Calendar, GitPullRequest, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FeedEntryData {
  id: string;
  content: string;
  category: "win" | "launch" | "event" | "contribution";
  entry_date: string;
  link_url: string | null;
}

const CategoryIcon = ({ category, className }: { category: FeedEntryData["category"]; className?: string }) => {
  switch (category) {
    case "win":
      return <Trophy className={cn("text-accent-gold", className)} />;
    case "launch":
      return <Rocket className={cn("text-accent-violet", className)} />;
    case "event":
      return <Calendar className={cn("text-accent-teal", className)} />;
    case "contribution":
      return <GitPullRequest className={cn("text-accent-red", className)} />;
  }
};

function BattleLogEntry({ entry, index }: { entry: FeedEntryData; index: number }) {
  const formattedDate = new Date(entry.entry_date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative pl-8 sm:pl-12 py-6 group"
    >
      {/* Timeline Node */}
      <div className="absolute left-0 top-6 w-4 h-4 rounded-full bg-bg-base border-2 border-border-pixel group-hover:border-accent-gold transition-colors z-10 flex items-center justify-center translate-x-[-8px] sm:translate-x-[-8px]">
        <div className="w-1 h-1 bg-text-primary rounded-full group-hover:bg-accent-gold transition-colors" />
      </div>

      <div className="bg-bg-base border-2 border-border-pixel p-4 sm:p-6 rounded-sm group-hover:border-accent-violet/50 transition-colors">
        <div className="flex items-center gap-3 mb-3">
          <CategoryIcon category={entry.category} className="w-5 h-5" />
          <span className="font-mono text-xs text-text-primary/50 uppercase tracking-wider">{formattedDate}</span>
          <span className={cn(
            "ml-auto font-pixel text-[8px] uppercase tracking-wider px-2 py-1 rounded-sm border",
            entry.category === "win" && "text-accent-gold border-accent-gold/50 bg-accent-gold/10",
            entry.category === "launch" && "text-accent-violet border-accent-violet/50 bg-accent-violet/10",
            entry.category === "event" && "text-accent-teal border-accent-teal/50 bg-accent-teal/10",
            entry.category === "contribution" && "text-accent-red border-accent-red/50 bg-accent-red/10",
          )}>
            {entry.category}
          </span>
        </div>
        
        <p className="font-mono text-sm sm:text-base text-text-primary leading-relaxed whitespace-pre-wrap">
          {entry.content}
        </p>

        {entry.link_url && (
          <div className="mt-4 pt-4 border-t border-border-pixel/50">
            <a
              href={entry.link_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-mono uppercase text-accent-violet hover:text-accent-violet/80 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              View Details
            </a>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export function BattleLog({ entries }: { entries: FeedEntryData[] }) {
  if (!entries || entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-border-pixel">
        <p className="font-pixel text-sm text-text-primary/50">The battle log is empty.</p>
      </div>
    );
  }

  return (
    <div className="relative max-w-3xl mx-auto w-full">
      {/* Timeline Line */}
      <div className="absolute left-0 top-8 bottom-8 w-0.5 bg-border-pixel" />
      
      <div className="flex flex-col">
        {entries.map((entry, index) => (
          <BattleLogEntry key={entry.id} entry={entry} index={index} />
        ))}
      </div>
    </div>
  );
}
