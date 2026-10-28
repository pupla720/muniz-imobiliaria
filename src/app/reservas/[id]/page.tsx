import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default async function ReservationStatusPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const reservation = await prisma.reservation.findUnique({
    where: { id },
    include: { property: true, renter: true, payment: true, contract: true },
  });

  if (!reservation) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-2xl px-7 py-16 sm:py-20">
      <p className="font-utility text-xs uppercase tracking-[0.28em] text-latao">
        Atendimento private
      </p>
      <div className="w-12 h-px bg-latao mt-5 mb-5" />
      <h1 className="font-display font-medium text-[clamp(28px,4vw,42px)] tracking-tight text-carvao">
        Sua reserva
      </h1>
      <p className="text-grafite font-light mt-2">{reservation.property.title}</p>

      <div className="bg-cal-claro border border-carvao/12 rounded-md p-7 mt-8 space-y-6">
        <StatusStep
          done
          title="Reserva criada"
          description={`Caução: ${formatBRL(reservation.depositAmount)}`}
        />

        <StatusStep
          done={reservation.payment?.status === "APPROVED"}
          pending={reservation.payment?.status !== "APPROVED"}
          title="Pagamento da caução"
          description={
            reservation.payment?.status === "APPROVED"
              ? "Pagamento confirmado."
              : reservation.payment?.status === "REJECTED"
                ? "Pagamento não confirmado. Fale com o seu especialista."
                : "Aguardando confirmação do pagamento pelo Mercado Pago."
          }
        />

        <StatusStep
          done={reservation.status === "CONTRACT_SIGNED"}
          pending={reservation.status === "PAYMENT_CONFIRMED"}
          disabled={reservation.status === "PENDING_PAYMENT"}
          title="Assinatura do contrato"
          description={
            reservation.status === "CONTRACT_SIGNED"
              ? `Assinado em ${reservation.contract?.signedAt?.toLocaleString("pt-BR")}`
              : reservation.status === "PAYMENT_CONFIRMED"
                ? "Pronto para assinar o contrato."
                : "Disponível após a confirmação do pagamento."
          }
        />

        {reservation.status === "PAYMENT_CONFIRMED" && (
          <Link
            href={`/reservas/${reservation.id}/contrato`}
            className="flex w-full items-center justify-center rounded-md bg-anil text-cal-claro min-h-12 px-5 text-[13px] uppercase tracking-[0.12em] hover:bg-anil-escuro transition-colors duration-300"
          >
            Revisar e assinar contrato
          </Link>
        )}

        {reservation.status === "CONTRACT_SIGNED" && (
          <a
            href={`/api/contracts/${reservation.id}/pdf`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center rounded-md border border-anil text-anil min-h-12 px-5 text-[13px] uppercase tracking-[0.12em] hover:bg-anil hover:text-cal-claro transition-colors duration-300"
          >
            Baixar contrato assinado (PDF)
          </a>
        )}
      </div>
    </div>
  );
}

function StatusStep({
  title,
  description,
  done,
  pending,
  disabled,
}: {
  title: string;
  description: string;
  done?: boolean;
  pending?: boolean;
  disabled?: boolean;
}) {
  const color = done
    ? "bg-mangue"
    : pending
      ? "bg-latao"
      : disabled
        ? "bg-carvao/20"
        : "bg-carvao/20";

  return (
    <div className="flex gap-4">
      <div className={`mt-1.5 h-2.5 w-2.5 rounded-full shrink-0 ${color}`} />
      <div>
        <p className="font-display text-lg text-carvao leading-tight">{title}</p>
        <p className="text-sm text-grafite font-light mt-0.5">{description}</p>
      </div>
    </div>
  );
}
