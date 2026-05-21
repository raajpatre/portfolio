import { z } from "zod";

// ─── Origin ────────────────────────────────────────────────────────────
export const originSchema = z.object({
  name: z.string().min(1).max(80),
  class: z.string().min(1).max(80),
  level: z.coerce.number().int().min(0).max(99),
  bio: z.string().min(1).max(1000),
  location: z.string().min(1).max(120),
});

// ─── Guild ─────────────────────────────────────────────────────────────
export const guildSchema = z.object({
  institution: z.string().min(1).max(160),
  role: z.string().min(1).max(160),
  duration: z.string().min(1).max(80),
  location: z.string().min(1).max(120),
  flavor: z.string().min(1).max(400),
  logo: z.string().url().optional().nullable(),
});

// ─── Factions ──────────────────────────────────────────────────────────
export const factionEntrySchema = z.object({
  org: z.string().min(1).max(120),
  role: z.string().min(1).max(120),
  duration: z.string().min(1).max(80),
  blurb: z.string().min(1).max(600),
  cls: z.enum(["gold", "teal", "violet"]),
});
export const factionsSchema = z.array(factionEntrySchema).max(20);

// ─── Stats ─────────────────────────────────────────────────────────────
export const statCategorySchema = z.object({
  label: z.string().min(1).max(40),
  skills: z.array(z.string().min(1).max(40)).max(30),
});
export const statsSchema = z.array(statCategorySchema).max(20);

// ─── Save File ─────────────────────────────────────────────────────────
export const saveFileSchema = z.object({
  resumePath: z.string().min(1).max(300),
  version: z.string().min(1).max(40),
  lastUpdated: z.string().min(1).max(40),
  progressPct: z.coerce.number().int().min(0).max(100),
  estGraduation: z.string().min(1).max(40),
});

// ─── Combined ─────────────────────────────────────────────────────────
export const aboutSchema = z.object({
  origin: originSchema,
  guild: guildSchema,
  factions: factionsSchema,
  stats: statsSchema,
  save_file: saveFileSchema,
});

export type AboutPayload = z.infer<typeof aboutSchema>;
