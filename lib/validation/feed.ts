import { z } from "zod";

export const feedSchema = z.object({
  content: z.string().min(1).max(1000),
  category: z.enum(['win', 'launch', 'event', 'contribution']),
  entry_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  link_url: z.string().url().optional().nullable(),
});
