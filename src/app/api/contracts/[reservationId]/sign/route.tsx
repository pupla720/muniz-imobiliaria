import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { z } from "zod";
import { renderToBuffer } from "@react-pdf/renderer";
import { prisma } from "@/lib/prisma";
import { ContractDocument, type ContractData } from "@/lib/contract-pdf";
import { getContractTemplate } from "@/lib/contract-template";

const signSchema = z.object({
  signerName: z.string().min(3),
  signerCpf: z.string().min(11),
  agree: z.literal(true),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ reservationId: string }> },
) {
  const { reservationId } = await params;
  const body = await request.json();
  const parsed = signSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dados inválidos", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const reservation = await prisma.reservation.findUnique({
    where: { id: reservationId },
    include: { property: true, renter: true, payment: true },
  });

  if (!reservation) {
    return NextResponse.json({ error: "Reserva não encontrada" }, { status: 404 });
  }

  if (reservation.status !== "PAYMENT_CONFIRMED" && reservation.status !== "CONTRACT_SIGNED") {
    return NextResponse.json(
      { error: "O pagamento da caução ainda não foi confirmado." },
      { status: 400 },
    );
  }

  const signerIp =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "desconhecido";
  const signedAt = new Date();
  const template = await getContractTemplate();

  const data: ContractData = {
    reservationId: reservation.id,
    property: reservation.property,
    renter: reservation.renter,
    depositAmount: reservation.depositAmount,
    template,
    signed: {
      signerName: parsed.data.signerName,
      signerCpf: parsed.data.signerCpf,
      signerIp,
      signedAt,
    },
  };

  const pdfBuffer = await renderToBuffer(<ContractDocument data={data} />);
  const documentHash = crypto.createHash("sha256").update(pdfBuffer).digest("hex");

  await prisma.contract.upsert({
    where: { reservationId },
    update: {
      signerName: parsed.data.signerName,
      signerCpf: parsed.data.signerCpf,
      signerIp,
      signedAt,
      documentHash,
    },
    create: {
      reservationId,
      signerName: parsed.data.signerName,
      signerCpf: parsed.data.signerCpf,
      signerIp,
      signedAt,
      documentHash,
    },
  });

  await prisma.reservation.update({
    where: { id: reservationId },
    data: { status: "CONTRACT_SIGNED" },
  });

  return NextResponse.json({ success: true, documentHash });
}
