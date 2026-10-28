import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { testimonialSchema } from "@/lib/testimonial-schema";

const publishSchema = z.object({ published: z.boolean() });

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json();
  const parsed = testimonialSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dados inválidos", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { photoUrl, propertyCode, ...rest } = parsed.data;

  await prisma.testimonial.update({
    where: { id },
    data: { ...rest, photoUrl: photoUrl || null, propertyCode: propertyCode || null },
  });

  return NextResponse.json({ success: true });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json();
  const parsed = publishSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
  }

  await prisma.testimonial.update({
    where: { id },
    data: { published: parsed.data.published },
  });

  return NextResponse.json({ success: true });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  await prisma.testimonial.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
