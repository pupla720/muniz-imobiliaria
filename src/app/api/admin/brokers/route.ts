import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { brokerSchema } from "@/lib/broker-schema";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = brokerSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dados inválidos", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const broker = await prisma.broker.create({ data: parsed.data });

  return NextResponse.json({ id: broker.id }, { status: 201 });
}
