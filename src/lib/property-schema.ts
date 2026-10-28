import { z } from "zod";

export const propertySchema = z.object({
  codigo: z
    .string()
    .regex(/^[A-Z]{2,4}-\d{3,5}$/, "Use o formato AJU-0142"),
  type: z.enum(["CASA", "APARTAMENTO"]),
  status: z.enum(["DISPONIVEL", "RESERVADO", "ALUGADO"]),
  title: z.string().min(3),
  description: z.string().min(10),
  address: z.string().min(3),
  bairro: z.string().min(2),
  city: z.string().min(2),
  state: z.string().min(2).max(2),
  priceMonthly: z.coerce.number().positive(),
  condominio: z.coerce.number().nonnegative(),
  iptu: z.coerce.number().nonnegative(),
  depositAmount: z.coerce.number().positive(),
  bedrooms: z.coerce.number().int().nonnegative(),
  bathrooms: z.coerce.number().int().nonnegative(),
  vagas: z.coerce.number().int().nonnegative(),
  areaM2: z.coerce.number().positive(),
  andar: z.string().optional().default(""),
  mobiliado: z.coerce.boolean().optional().default(false),
  aceitaPet: z.coerce.boolean().optional().default(false),
  floorPlanUrl: z.string().url().optional().or(z.literal("")),
  brokerId: z.string().optional().or(z.literal("")),
  photosText: z.string().optional().default(""),
});

export function photosTextToArray(photosText: string): string[] {
  return photosText
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}
