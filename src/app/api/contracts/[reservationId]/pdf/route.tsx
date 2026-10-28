import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { prisma } from "@/lib/prisma";
import { ContractDocument, type ContractData } from "@/lib/contract-pdf";
import { getContractTemplate } from "@/lib/contract-template";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ reservationId: string }> },
) {
  const { reservationId } = await params;

  const reservation = await prisma.reservation.findUnique({
    where: { id: reservationId },
    include: { property: true, renter: true, contract: true },
  });

  if (!reservation) {
    return NextResponse.json({ error: "Reserva não encontrada" }, { status: 404 });
  }

  const template = await getContractTemplate();

  const data: ContractData = {
    reservationId: reservation.id,
    property: reservation.property,
    renter: reservation.renter,
    depositAmount: reservation.depositAmount,
    template,
    signed:
      reservation.contract?.signedAt && reservation.contract.signerName && reservation.contract.signerCpf
        ? {
            signerName: reservation.contract.signerName,
            signerCpf: reservation.contract.signerCpf,
            signerIp: reservation.contract.signerIp ?? "desconhecido",
            signedAt: reservation.contract.signedAt,
          }
        : undefined,
  };

  const buffer = await renderToBuffer(<ContractDocument data={data} />);

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="contrato-${reservation.id}.pdf"`,
    },
  });
}
