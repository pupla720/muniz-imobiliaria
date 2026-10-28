import { z } from "zod";

export const testimonialSchema = z.object({
  authorName: z.string().min(3),
  photoUrl: z.string().optional().default(""),
  propertyCode: z.string().optional().default(""),
  quote: z.string().min(10),
  published: z.coerce.boolean().optional().default(false),
});
