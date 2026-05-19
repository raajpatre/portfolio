import { z } from "zod";

export const feedSchema = z.object({
  content: z.string().min(1),
  category: z.enum(['win', 'launch', 'event', 'contribution']),
  entry_date: z.string(),
  link_url: z.string().url().optional().or(z.literal('')),
});
