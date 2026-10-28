import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const templateSchema = z.object({
  landlordName: z.string().min(2),
  rentDueDay: z.coerce.number().int().min(1).max(28),
  termsText: z.string().min(10),
});

export async function PUT(request: Request) {
  const body = await request.json();
  const parsed = templateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dados inválidos", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  await prisma.contractTemplate.upsert({
    where: { id: "default" },
    update: parsed.data,
    create: { id: "default", ...parsed.data },
  });

  return NextResponse.json({ success: true });
}
