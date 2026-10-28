import { prisma } from "@/lib/prisma";
import { adminHeading } from "@/components/admin/ui";

const statusLabels: Record<string, string> = {
  PENDING_PAYMENT: "Aguardando pagamento",
  PAYMENT_CONFIRMED: "Pagamento confirmado",
  CONTRACT_SIGNED: "Contrato assinado",
  CANCELLED: "Cancelada",
};

const statusColors: Record<string, string> = {
  PENDING_PAYMENT: "bg-latao/15 text-latao-escuro",
  PAYMENT_CONFIRMED: "bg-anil/10 text-anil",
  CONTRACT_SIGNED: "bg-mangue/15 text-mangue-escuro",
  CANCELLED: "bg-alerta/12 text-alerta",
};

export default async function AdminReservationsPage() {
  const reservations = await prisma.reservation.findMany({
    orderBy: { createdAt: "desc" },
    include: { property: true, renter: true, payment: true },
  });

  return (
    <section>
      <h2 className={`${adminHeading} mb-6`}>Reservas</h2>
      <div className="bg-cal-claro border border-carvao/12 rounded-md divide-y divide-carvao/10">
        {reservations.length === 0 && (
          <p className="p-5 text-sm text-grafite font-light">Nenhuma reserva ainda.</p>
        )}
        {reservations.map((reservation) => (
          <div
            key={reservation.id}
            className="p-5 flex items-center justify-between gap-4"
          >
            <div>
              <p className="font-display text-lg text-carvao">
                {reservation.property.title}
              </p>
              <p className="text-sm text-grafite font-light mt-1">
                {reservation.renter.name} · {reservation.renter.email} ·{" "}
                {reservation.renter.phone ?? "sem telefone"}
              </p>
              <p className="text-xs text-grafite/70 mt-0.5">
                Reservado em {reservation.createdAt.toLocaleString("pt-BR")}
              </p>
            </div>
            <span
              className={`font-utility text-[10.5px] uppercase tracking-[0.12em] px-3 py-1.5 rounded-full shrink-0 ${
                statusColors[reservation.status] ?? "bg-carvao/10 text-grafite"
              }`}
            >
              {statusLabels[reservation.status] ?? reservation.status}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
