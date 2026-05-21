// ─── Types & empty fallbacks for About content ─────────────────────────
// Safe to import from anywhere (client or server).

export interface OriginData {
  name: string;
  class: string;
  level: number;
  bio: string;
  location: string;
}

export interface GuildEntry {
  institution: string;
  role: string;
  duration: string;
  location: string;
  flavor: string;
  logo?: string | null;
}

export interface FactionEntry {
  org: string;
  role: string;
  duration: string;
  blurb: string;
  /** Color class: gold | teal | violet */
  cls: "gold" | "teal" | "violet";
}

export interface StatCategory {
  label: string;
  skills: string[];
}

export interface SaveFileData {
  resumePath: string;
  version: string;
  lastUpdated: string;
  /** % of XP to next level (0-100) */
  progressPct: number;
  estGraduation: string;
}

export interface AboutContent {
  origin: OriginData;
  guild: GuildEntry;
  factions: FactionEntry[];
  stats: StatCategory[];
  saveFile: SaveFileData;
}

export const emptyOrigin: OriginData = {
  name: "",
  class: "",
  level: 1,
  bio: "",
  location: "",
};

export const emptyGuild: GuildEntry = {
  institution: "",
  role: "",
  duration: "",
  location: "",
  flavor: "",
};

export const emptySaveFile: SaveFileData = {
  resumePath: "/resume/raaj-patre-resume.pdf",
  version: "v1.0.0",
  lastUpdated: "",
  progressPct: 0,
  estGraduation: "",
};

export const emptyAbout: AboutContent = {
  origin: emptyOrigin,
  guild: emptyGuild,
  factions: [],
  stats: [],
  saveFile: emptySaveFile,
};
