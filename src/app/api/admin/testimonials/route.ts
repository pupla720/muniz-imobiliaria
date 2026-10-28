import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { testimonialSchema } from "@/lib/testimonial-schema";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = testimonialSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dados inválidos", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { photoUrl, propertyCode, ...rest } = parsed.data;

  const testimonial = await prisma.testimonial.create({
    data: {
      ...rest,
      photoUrl: photoUrl || null,
      propertyCode: propertyCode || null,
    },
  });

  return NextResponse.json({ id: testimonial.id }, { status: 201 });
}
