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
  logo?: string; // optional path to logo in /public
}

export interface FactionEntry {
  org: string;
  role: string;
  duration: string;
  blurb: string;
}

export interface StatCategory {
  label: string;
  skills: string[];
}

export interface SaveFileData {
  resumePath: string;
  version: string;
  lastUpdated: string;
}

// ─── Chapter 1: Origin ─────────────────────────────────────────────────

export const origin: OriginData = {
  name: "Raaj Patre",
  class: "FULL-STACK DEVELOPER",
  level: 2,
  bio: "A passionate builder who thrives at the intersection of design and engineering. I craft pixel-perfect web experiences with a focus on performance, aesthetics, and scalable architecture. When I'm not shipping code, you'll find me exploring new frameworks, contributing to open source, or diving into game dev experiments.",
  location: "India",
};

// ─── Chapter 2: Guild ──────────────────────────────────────────────────

export const guild: GuildEntry = {
  institution: "Newton School of Technology",
  role: "Student · Batch 2",
  duration: "2024 — Present",
  location: "Bangalore, India",
};

// ─── Chapter 3: Factions ───────────────────────────────────────────────

export const factions: FactionEntry[] = [
  {
    org: "Aayam",
    role: "Marketing Manager",
    duration: "2024 — Present",
    blurb:
      "Leading marketing strategy and creative campaigns for the college's flagship tech fest, driving engagement across digital and on-ground channels.",
  },
  {
    org: "GirlScript Summer of Code",
    role: "Contributor",
    duration: "2025",
    blurb:
      "Open-source contributor working on community-driven projects, collaborating with developers across the globe to ship meaningful features.",
  },
  {
    org: "Google GenAI Academy APEC",
    role: "Cohort Member",
    duration: "2025",
    blurb:
      "Selected for the Google Generative AI Academy, exploring cutting-edge AI/ML applications and building projects with Google's latest GenAI tools.",
  },
];

// ─── Chapter 4: Stats ──────────────────────────────────────────────────

export const stats: StatCategory[] = [
  {
    label: "FRONTEND",
    skills: ["React", "Next.js", "Tailwind", "Framer Motion"],
  },
  {
    label: "BACKEND",
    skills: ["Node.js", "Supabase", "Postgres", "REST"],
  },
  {
    label: "LANGUAGES",
    skills: ["TypeScript", "JavaScript", "Python", "C++"],
  },
  {
    label: "TOOLS",
    skills: ["Git", "Docker", "Vercel", "Cloudinary"],
  },
];

// ─── Chapter 5: Save File ──────────────────────────────────────────────

export const saveFile: SaveFileData = {
  resumePath: "/resume/raaj-patre-resume.pdf",
  version: "v1.0.0",
  lastUpdated: "May 2026",
};
