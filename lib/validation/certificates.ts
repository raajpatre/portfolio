import { z } from "zod";

export const certificateSchema = z.object({
  title: z.string().min(1),
  issuer: z.string().min(1),
  issued_date: z.string(),
  credential_url: z.string().url().optional().or(z.literal('')),
  image_url: z.string().url().optional().or(z.literal('')),
});
