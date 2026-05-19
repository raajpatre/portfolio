import { z } from "zod";

export const projectSchema = z.object({
  title: z.string().min(1).max(120),
  tagline: z.string().min(1).max(200),
  description: z.string().min(1).max(5000),
  stack: z.array(z.string().min(1).max(40)).max(20),
  live_url: z.string().url().optional().nullable(),
  repo_url: z.string().url().optional().nullable(),
  screenshots: z.array(z.string().url()).max(10),
  status: z.enum(['shipped', 'in_progress']),
  featured: z.boolean(),
});
