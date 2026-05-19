import { z } from "zod";

export const certificateSchema = z.object({
  title: z.string().min(1).max(200),
  issuer: z.string().min(1).max(120),
  issued_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  credential_url: z.string().url().optional().nullable(),
  image_url: z.string().url().optional().nullable(),
});
