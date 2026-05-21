"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { cn, optimizeCloudinaryUrl } from "@/lib/utils";
import { CATEGORY_META, type CategoryKey } from "./BattleLogIcons";

export interface FeedEntryData {
  id: string;
  content: string;
  category: CategoryKey;
  entry_date: string;
  link_url: string | null;
  /** Optional photo URLs (Cloudinary). Renders thumb strip + carousel when present. */
  photos?: string[];
  /** Optional longer description shown in modal. */
  detail?: string;
}

interface BattleLogEntryProps {
  entry: FeedEntryData;
  index: number;
  onOpen?: (entry: FeedEntryData) => void;
}

export function BattleLogEntry({ entry, index, onOpen }: BattleLogEntryProps) {
  const meta = CATEGORY_META[entry.category];
  const Icon = meta.Icon;
  const photos = entry.photos ?? [];
  const thumbsToShow = Math.min(photos.length, 4);
  const extra = photos.length - thumbsToShow;

  const date = new Date(entry.entry_date);
  const formattedStamp = `${date
    .toLocaleString("en-US", { month: "short" })
    .toUpperCase()} ${date.getFullYear()}`;

  const handleOpen = () => onOpen?.(entry);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -8 }}
      transition={{ duration: 0.38, delay: index * 0.06 }}
      className="relative pb-4 group"
      style={{ ["--cat" as string]: meta.color }}
    >
      {/* Diamond node with pulse on enter */}
      <motion.span
        aria-hidden="true"
        initial={{ scale: 1 }}
        animate={{ scale: [1, 1.4, 1] }}
        transition={{ duration: 0.7, delay: 0.2 + index * 0.06, ease: "easeOut" }}
        className={cn(
          "absolute top-[18px] left-[-49px] w-2.5 h-2.5 rotate-45 z-[1]",
          meta.nodeBg
        )}
        style={{
          color: meta.color, // for box-shadow currentColor
          boxShadow: "0 0 0 1px #0a0c1a, 0 0 0 2px #2a2d4a",
        }}
      />

      {/* Connector line from node → card */}
      <span
        aria-hidden="true"
        className="absolute top-[22px] left-[-38px] w-[38px] h-px bg-border-pixel"
      />

      {/* Card */}
      <div
        className={cn(
          "bg-bg-surface border-2 border-border-pixel border-l-[3px] rounded-sm px-4 py-3.5 transition-all duration-150 group-hover:bg-bg-elevated group-hover:brightness-105",
          meta.leftBorder
        )}
        style={{
          // hover glow color injected via inline style on hover via :hover css — use group hover
        }}
      >
        {/* Card header */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <span
            className="font-pixel text-[7px] tracking-[0.12em] flex items-center gap-2"
            style={{ color: meta.color }}
          >
            <Icon color={meta.color} />
            {meta.label}
          </span>
          <span className="font-pixel text-[8px] text-text-muted tracking-[0.1em] whitespace-nowrap">
            [{formattedStamp}]
          </span>
        </div>

        {/* Body text */}
        <p className="font-mono text-[13px] text-text-primary leading-[1.7]">
          {entry.content}
        </p>

        {/* Photo thumb strip */}
        {photos.length > 0 && (
          <button
            type="button"
            onClick={handleOpen}
            className="mt-3 flex items-stretch gap-1.5 w-full"
            aria-label="Open photo gallery"
          >
            {photos.slice(0, thumbsToShow).map((src, i) => (
              <span
                key={i}
                className="relative w-16 h-16 bg-bg-elevated border border-border-pixel shadow-[0_0_0_1px_#2a2d4a] overflow-hidden rounded-sm flex-shrink-0 transition-all duration-150 hover:-translate-y-px"
                style={{
                  // hover glow via inline style — apply box-shadow on hover via Tailwind arbitrary
                }}
              >
                <Image
                  src={optimizeCloudinaryUrl(src)}
                  alt={`Photo ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </span>
            ))}
            {extra > 0 && (
              <span
                className="w-16 h-16 flex items-center justify-center font-pixel text-[9px] bg-bg-elevated border border-border-pixel shadow-[0_0_0_1px_#2a2d4a] rounded-sm flex-shrink-0"
                style={{ color: meta.color }}
              >
                +{extra}
              </span>
            )}
          </button>
        )}

        {/* Footer — [ VIEW → ] (always present, opens modal) */}
        <div className="mt-2.5">
          <button
            type="button"
            onClick={handleOpen}
            className="font-pixel text-[7px] text-text-muted tracking-[0.1em] inline-flex items-center gap-1.5 transition-colors duration-150 cursor-pointer hover:opacity-100"
            onMouseEnter={(e) => (e.currentTarget.style.color = meta.color)}
            onMouseLeave={(e) => (e.currentTarget.style.color = "")}
          >
            [ VIEW <span className="text-[9px]">→</span> ]
          </button>
        </div>
      </div>
    </motion.div>
  );
}
