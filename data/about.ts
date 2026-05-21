// ─── About Page Data ───────────────────────────────────────────────────
// This is the ONLY file Raaj edits to update bio content.
// No DB calls — entirely hardcoded by design.

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
  logo?: string;
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

// ─── Chapter 1: Origin ─────────────────────────────────────────────────

export const origin: OriginData = {
  name: "Raaj Patre",
  class: "FULL-STACK DEVELOPER",
  level: 2,
  bio: "Building web apps out of Bengaluru. Computer Science student at Newton School of Technology. I ship things, break things, and write READMEs about both.",
  location: "BENGALURU, IN",
};

// ─── Chapter 2: Guild ──────────────────────────────────────────────────

export const guild: GuildEntry = {
  institution: "Newton School of Technology",
  role: "Computer Science · Batch 2",
  duration: "2024 → PRESENT",
  location: "BENGALURU, INDIA",
  flavor: "Where code is the spell and the compiler is the dungeon master.",
};

// ─── Chapter 3: Factions ───────────────────────────────────────────────

export const factions: FactionEntry[] = [
  {
    org: "Aayam",
    role: "Marketing Manager",
    duration: "AUG 2024 → PRESENT",
    blurb: "National tech fest for Newton School of Technology.",
    cls: "gold",
  },
  {
    org: "GirlScript Summer of Code",
    role: "Open Source Contributor",
    duration: "SUMMER 2025",
    blurb: "Contributing to open source under the GSSoC program.",
    cls: "teal",
  },
  {
    org: "Google GenAI Academy APEC",
    role: "Cohort Member",
    duration: "SUMMER 2025",
    blurb: "AI/ML learning program via Hack2Skill.",
    cls: "violet",
  },
];

// ─── Chapter 4: Stats ──────────────────────────────────────────────────

export const stats: StatCategory[] = [
  {
    label: "FRONTEND",
    skills: ["React", "Next.js", "Tailwind CSS", "Framer Motion", "HTML", "CSS"],
  },
  {
    label: "BACKEND",
    skills: ["Node.js", "Express", "Supabase", "PostgreSQL", "REST APIs"],
  },
  {
    label: "LANGUAGES",
    skills: ["TypeScript", "JavaScript", "Python", "C++"],
  },
  {
    label: "TOOLS",
    skills: ["Git", "GitHub", "Vercel", "Cloudinary", "Docker (learning)"],
  },
];

// ─── Chapter 5: Save File ──────────────────────────────────────────────

export const saveFile: SaveFileData = {
  resumePath: "/resume/raaj-patre-resume.pdf",
  version: "v1.0.0",
  lastUpdated: "MAY 2026",
  progressPct: 60,
  estGraduation: "2027",
};
