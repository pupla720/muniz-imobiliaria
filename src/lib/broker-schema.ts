import { z } from "zod";

export const brokerSchema = z.object({
  name: z.string().min(3),
  creci: z.string().min(1),
  whatsapp: z.string().min(10),
  photoUrl: z.string().min(1, "Envie uma foto do corretor."),
});
