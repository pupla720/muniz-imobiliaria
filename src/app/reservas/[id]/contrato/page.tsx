import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { SignForm } from "./sign-form";

export default async function ContractPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const reservation = await prisma.reservation.findUnique({
    where: { id },
    include: { renter: true },
  });

  if (!reservation) {
    notFound();
  }

  if (reservation.status === "PENDING_PAYMENT") {
    redirect(`/reservas/${id}`);
  }

  return (
    <div className="mx-auto max-w-4xl px-7 py-12 sm:py-16">
      <p className="font-utility text-xs uppercase tracking-[0.28em] text-latao">
        Assinatura
      </p>
      <div className="w-12 h-px bg-latao mt-5 mb-5" />
      <h1 className="font-display font-medium text-[clamp(28px,4vw,42px)] tracking-tight text-carvao mb-8">
        Revisão e assinatura do contrato
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div
          className="border border-carvao/12 rounded-md overflow-hidden bg-cal-claro"
          style={{ height: 520 }}
        >
          <iframe
            src={`/api/contracts/${id}/pdf`}
            className="w-full h-full"
            title="Contrato de locação"
          />
        </div>

        <div className="bg-cal-claro border border-carvao/12 rounded-md p-7 h-fit">
          {reservation.status === "CONTRACT_SIGNED" ? (
            <p className="font-display text-xl text-anil">
              Este contrato já foi assinado.
            </p>
          ) : (
            <SignForm
              reservationId={id}
              defaultName={reservation.renter.name}
              defaultCpf={reservation.renter.cpf ?? ""}
            />
          )}
        </div>
      </div>
    </div>
  );
}
