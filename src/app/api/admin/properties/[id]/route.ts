import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { propertySchema, photosTextToArray } from "@/lib/property-schema";

const statusSchema = z.object({
  status: z.enum(["DISPONIVEL", "RESERVADO", "ALUGADO"]),
});

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const property = await prisma.property.findUnique({ where: { id } });

  if (!property) {
    return NextResponse.json({ error: "Imóvel não encontrado" }, { status: 404 });
  }

  return NextResponse.json(property);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json();
  const parsed = propertySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dados inválidos", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { photosText, andar, brokerId, floorPlanUrl, ...rest } = parsed.data;

  const codigoInUse = await prisma.property.findFirst({
    where: { codigo: parsed.data.codigo, id: { not: id } },
  });
  if (codigoInUse) {
    return NextResponse.json(
      { error: "Já existe outro imóvel com esse código." },
      { status: 400 },
    );
  }

  const property = await prisma.property.update({
    where: { id },
    data: {
      ...rest,
      andar: andar ? Number(andar) : null,
      brokerId: brokerId || null,
      floorPlanUrl: floorPlanUrl || null,
      photos: JSON.stringify(photosTextToArray(photosText)),
    },
  });

  return NextResponse.json({ id: property.id });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json();
  const parsed = statusSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
  }

  await prisma.property.update({
    where: { id },
    data: { status: parsed.data.status },
  });

  return NextResponse.json({ success: true });
}
