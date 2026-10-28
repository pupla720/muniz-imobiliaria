import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { propertySchema, photosTextToArray } from "@/lib/property-schema";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = propertySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dados inválidos", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { photosText, andar, brokerId, floorPlanUrl, ...rest } = parsed.data;

  const existing = await prisma.property.findUnique({
    where: { codigo: parsed.data.codigo },
  });
  if (existing) {
    return NextResponse.json(
      { error: "Já existe um imóvel com esse código." },
      { status: 400 },
    );
  }

  const property = await prisma.property.create({
    data: {
      ...rest,
      andar: andar ? Number(andar) : null,
      brokerId: brokerId || null,
      floorPlanUrl: floorPlanUrl || null,
      photos: JSON.stringify(photosTextToArray(photosText)),
    },
  });

  return NextResponse.json({ codigo: property.codigo }, { status: 201 });
}
