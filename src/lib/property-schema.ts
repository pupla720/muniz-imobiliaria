import { z } from "zod";

export const propertySchema = z
  .object({
    codigo: z
      .string()
      .trim()
      .toUpperCase()
      .regex(
        /^[A-Z0-9][A-Z0-9-]{1,23}$/,
        "Código inválido. Use só letras, números e traço (ex.: FSA-0142).",
      ),
    type: z.enum(["CASA", "APARTAMENTO", "CHACARA", "SITIO", "CASA_PRAIA"]),
    modalidade: z.enum(["MENSAL", "TEMPORADA"]).default("MENSAL"),
    status: z.enum(["DISPONIVEL", "RESERVADO", "ALUGADO"]),
    title: z.string().min(3, "Informe um título (mín. 3 caracteres)"),
    description: z.string().min(10, "Descrição muito curta (mín. 10 caracteres)"),
    address: z.string().min(3, "Informe o endereço"),
    bairro: z.string().min(2, "Informe o bairro"),
    city: z.string().min(2, "Informe a cidade"),
    state: z.string().trim().toUpperCase().length(2, "UF deve ter 2 letras (ex.: BA)"),
    // Mensal usa priceMonthly; temporada usa priceDaily (+ priceWeekend).
    // Por isso os três são apenas não-negativos aqui — a exigência do valor
    // certo por modalidade é feita no refine abaixo.
    priceMonthly: z.coerce.number().nonnegative("Valor do aluguel inválido").optional().default(0),
    priceDaily: z.coerce.number().nonnegative("Valor da diária inválido").optional().default(0),
    priceWeekend: z.coerce.number().nonnegative("Valor do fim de semana inválido").optional().default(0),
    condominio: z.coerce.number().nonnegative("Condomínio não pode ser negativo").optional().default(0),
    iptu: z.coerce.number().nonnegative("IPTU não pode ser negativo").optional().default(0),
    depositAmount: z.coerce.number().nonnegative("Caução inválida").optional().default(0),
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
  })
  .superRefine((data, ctx) => {
    if (data.modalidade === "MENSAL" && !(data.priceMonthly > 0)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["priceMonthly"],
        message: "Informe o valor do aluguel mensal (maior que zero)",
      });
    }
    if (data.modalidade === "TEMPORADA" && !(data.priceDaily > 0)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["priceDaily"],
        message: "Informe o valor da diária (maior que zero)",
      });
    }
  });

export function photosTextToArray(photosText: string): string[] {
  return photosText
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}
