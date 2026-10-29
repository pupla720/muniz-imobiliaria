import { z } from "zod";

export const propertySchema = z.object({
  codigo: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-Z]{2,4}-\d{3,5}$/, "Use o formato FSA-0142 (2 a 4 letras, traço e 3 a 5 números)"),
  type: z.enum(["CASA", "APARTAMENTO"]),
  status: z.enum(["DISPONIVEL", "RESERVADO", "ALUGADO"]),
  title: z.string().min(3, "Informe um título (mín. 3 caracteres)"),
  description: z.string().min(10, "Descrição muito curta (mín. 10 caracteres)"),
  address: z.string().min(3, "Informe o endereço"),
  bairro: z.string().min(2, "Informe o bairro"),
  city: z.string().min(2, "Informe a cidade"),
  state: z.string().trim().toUpperCase().length(2, "UF deve ter 2 letras (ex.: BA)"),
  priceMonthly: z.coerce.number().positive("Informe o valor do aluguel (maior que zero)"),
  condominio: z.coerce.number().nonnegative("Condomínio não pode ser negativo"),
  iptu: z.coerce.number().nonnegative("IPTU não pode ser negativo"),
  depositAmount: z.coerce.number().positive("Informe o valor da caução (maior que zero)"),
  bedrooms: z.coerce.number().int().nonnegative("Nº de quartos inválido"),
  bathrooms: z.coerce.number().int().nonnegative("Nº de banheiros inválido"),
  vagas: z.coerce.number().int().nonnegative("Nº de vagas inválido"),
  areaM2: z.coerce.number().positive("Informe a área em m² (maior que zero)"),
  andar: z.string().optional().default(""),
  mobiliado: z.coerce.boolean().optional().default(false),
  aceitaPet: z.coerce.boolean().optional().default(false),
  floorPlanUrl: z.string().url("URL da planta inválida").optional().or(z.literal("")),
  brokerId: z.string().optional().or(z.literal("")),
  photosText: z.string().optional().default(""),
  photosTextManaged: z.string().optional(),
});

export function photosTextToArray(photosText: string): string[] {
  return photosText
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}
