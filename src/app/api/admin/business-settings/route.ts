import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  name: z.string().min(2),
  creci: z.string().min(1),
  whatsapp: z.string().min(10),
  phoneDisplay: z.string().min(1),
  addressStreet: z.string().optional().default(""),
  addressNeighborhood: z.string().optional().default(""),
  addressCity: z.string().min(2),
  addressState: z.string().min(2).max(2),
  addressZip: z.string().optional().default(""),
  hours: z.string().optional().default(""),
  instagramUrl: z.string().url().optional().or(z.literal("")),
  facebookUrl: z.string().url().optional().or(z.literal("")),
});

export async function PUT(request: Request) {
  const body = await request.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dados inválidos", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { instagramUrl, facebookUrl, ...rest } = parsed.data;

  await prisma.businessSettings.upsert({
    where: { id: "default" },
    update: {
      ...rest,
      instagramUrl: instagramUrl || null,
      facebookUrl: facebookUrl || null,
    },
    create: {
      id: "default",
      ...rest,
      instagramUrl: instagramUrl || null,
      facebookUrl: facebookUrl || null,
    },
  });

  return NextResponse.json({ success: true });
}
