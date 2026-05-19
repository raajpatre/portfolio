import { z } from "zod";

export const projectSchema = z.object({
  title: z.string().min(1),
  tagline: z.string().min(1),
  description: z.string().min(1),
  stack: z.array(z.string()),
  live_url: z.string().url().optional().or(z.literal('')),
  repo_url: z.string().url().optional().or(z.literal('')),
  screenshots: z.array(z.string()),
  status: z.enum(['shipped', 'in_progress']),
  featured: z.boolean(),
});
