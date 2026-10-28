import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { mpPayment } from "@/lib/mercadopago";

// Mercado Pago envia notificações de eventos (pagamento aprovado, rejeitado, etc.)
// Docs: https://www.mercadopago.com.br/developers/pt/docs/checkout-pro/additional-content/notifications/webhooks
export async function POST(request: Request) {
  const url = new URL(request.url);
  const topic = url.searchParams.get("topic") ?? url.searchParams.get("type");
  const paymentId = url.searchParams.get("id") ?? url.searchParams.get("data.id");

  if (topic !== "payment" || !paymentId) {
    return NextResponse.json({ received: true });
  }

  try {
    const payment = await mpPayment.get({ id: paymentId });
    const reservationId = payment.external_reference;

    if (!reservationId) {
      return NextResponse.json({ received: true });
    }

    const statusMap: Record<string, "APPROVED" | "REJECTED" | "PENDING" | "REFUNDED"> = {
      approved: "APPROVED",
      rejected: "REJECTED",
      pending: "PENDING",
      in_process: "PENDING",
      refunded: "REFUNDED",
      cancelled: "REJECTED",
    };
    const mappedStatus = statusMap[payment.status ?? ""] ?? "PENDING";

    await prisma.payment.update({
      where: { reservationId },
      data: {
        status: mappedStatus,
        providerPaymentId: String(payment.id),
      },
    });

    if (mappedStatus === "APPROVED") {
      await prisma.reservation.update({
        where: { id: reservationId },
        data: { status: "PAYMENT_CONFIRMED" },
      });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Erro ao processar webhook do Mercado Pago:", error);
    return NextResponse.json({ received: true });
  }
}
