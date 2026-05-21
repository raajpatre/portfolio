import "server-only";
import { createClient } from "@/lib/supabase/server";
import {
  emptyAbout,
  emptyGuild,
  emptyOrigin,
  emptySaveFile,
  type AboutContent,
  type FactionEntry,
  type GuildEntry,
  type OriginData,
  type SaveFileData,
  type StatCategory,
} from "./about-types";

// Re-export types so existing imports of `@/data/about` types still resolve
// (but only on the server — client code should import from `@/data/about-types`).
export type {
  AboutContent,
  FactionEntry,
  GuildEntry,
  OriginData,
  SaveFileData,
  StatCategory,
};

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

export async function getAboutContent(): Promise<AboutContent> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("about_content")
      .select("origin, guild, factions, stats, save_file")
      .eq("id", "singleton")
      .single();

    if (error || !data) return emptyAbout;

    return {
      origin: isObject(data.origin)
        ? { ...emptyOrigin, ...(data.origin as Partial<OriginData>) }
        : emptyOrigin,
      guild: isObject(data.guild)
        ? { ...emptyGuild, ...(data.guild as Partial<GuildEntry>) }
        : emptyGuild,
      factions: Array.isArray(data.factions) ? (data.factions as FactionEntry[]) : [],
      stats: Array.isArray(data.stats) ? (data.stats as StatCategory[]) : [],
      saveFile: isObject(data.save_file)
        ? { ...emptySaveFile, ...(data.save_file as Partial<SaveFileData>) }
        : emptySaveFile,
    };
  } catch (e) {
    console.error("getAboutContent error:", e);
    return emptyAbout;
  }
}
