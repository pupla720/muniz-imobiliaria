import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { mpPreference } from "@/lib/mercadopago";

const reservationSchema = z.object({
  propertyId: z.string().min(1),
  name: z.string().min(3),
  email: z.string().email(),
  cpf: z.string().min(11),
  phone: z.string().min(8),
});

const DEPOSIT_AMOUNT = 300;

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = reservationSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dados inválidos", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { propertyId, name, email, cpf, phone } = parsed.data;

  const property = await prisma.property.findUnique({ where: { id: propertyId } });
  if (!property || property.status !== "DISPONIVEL") {
    return NextResponse.json({ error: "Imóvel indisponível" }, { status: 404 });
  }

  const renter = await prisma.user.upsert({
    where: { email },
    update: { name, cpf, phone },
    create: { name, email, cpf, phone, role: "RENTER" },
  });

  const reservation = await prisma.reservation.create({
    data: {
      propertyId: property.id,
      renterId: renter.id,
      depositAmount: DEPOSIT_AMOUNT,
      payment: {
        create: {
          amount: DEPOSIT_AMOUNT,
          status: "PENDING",
        },
      },
    },
  });

  const appUrl = process.env.APP_URL ?? "http://localhost:3000";

  try {
    const preference = await mpPreference.create({
      body: {
        items: [
          {
            id: reservation.id,
            title: `Caução - ${property.title}`,
            quantity: 1,
            unit_price: DEPOSIT_AMOUNT,
            currency_id: "BRL",
          },
        ],
        payer: { name, email },
        back_urls: {
          success: `${appUrl}/reservas/${reservation.id}`,
          pending: `${appUrl}/reservas/${reservation.id}`,
          failure: `${appUrl}/reservas/${reservation.id}`,
        },
        auto_return: "approved",
        notification_url: `${appUrl}/api/webhooks/mercadopago`,
        external_reference: reservation.id,
      },
    });

    await prisma.payment.update({
      where: { reservationId: reservation.id },
      data: { preferenceId: preference.id },
    });

    return NextResponse.json({
      reservationId: reservation.id,
      checkoutUrl: preference.init_point,
    });
  } catch (error) {
    console.error("Erro ao criar preferência no Mercado Pago:", error);
    return NextResponse.json({
      reservationId: reservation.id,
      checkoutUrl: null,
      warning:
        "Reserva criada, mas não foi possível iniciar o pagamento agora. Configure MERCADOPAGO_ACCESS_TOKEN.",
    });
  }
}
