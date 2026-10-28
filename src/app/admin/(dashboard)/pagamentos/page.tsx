import { prisma } from "@/lib/prisma";
import { adminHeading } from "@/components/admin/ui";

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

const statusLabels: Record<string, string> = {
  PENDING: "Pendente",
  APPROVED: "Aprovado",
  REJECTED: "Rejeitado",
  REFUNDED: "Reembolsado",
};

const statusColors: Record<string, string> = {
  PENDING: "bg-latao/15 text-latao-escuro",
  APPROVED: "bg-mangue/15 text-mangue-escuro",
  REJECTED: "bg-alerta/12 text-alerta",
  REFUNDED: "bg-carvao/10 text-grafite",
};

export default async function AdminPaymentsPage() {
  const payments = await prisma.payment.findMany({
    orderBy: { createdAt: "desc" },
    include: { reservation: { include: { property: true, renter: true } } },
  });

  const totalApproved = payments
    .filter((payment) => payment.status === "APPROVED")
    .reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <section>
      <div className="flex items-center justify-between gap-4 mb-6">
        <h2 className={adminHeading}>Pagamentos</h2>
        <p className="text-sm text-grafite font-light">
          Total recebido em cauções:{" "}
          <strong className="text-carvao font-medium">{formatBRL(totalApproved)}</strong>
        </p>
      </div>
      <div className="bg-cal-claro border border-carvao/12 rounded-md divide-y divide-carvao/10">
        {payments.length === 0 && (
          <p className="p-5 text-sm text-grafite font-light">
            Nenhum pagamento registrado.
          </p>
        )}
        {payments.map((payment) => (
          <div key={payment.id} className="p-5 flex items-center justify-between gap-4">
            <div>
              <p className="font-display text-lg text-carvao">
                {payment.reservation.property.title}
              </p>
              <p className="text-sm text-grafite font-light mt-1">
                {payment.reservation.renter.name} ·{" "}
                {payment.reservation.renter.email}
              </p>
              <p className="text-xs text-grafite/70 mt-0.5">
                {payment.provider} · ID:{" "}
                {payment.providerPaymentId ?? "aguardando pagamento"} ·{" "}
                {payment.createdAt.toLocaleString("pt-BR")}
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="font-display text-lg text-carvao">
                {formatBRL(payment.amount)}
              </p>
              <span
                className={`font-utility text-[10.5px] uppercase tracking-[0.12em] px-3 py-1.5 rounded-full ${
                  statusColors[payment.status] ?? "bg-carvao/10 text-grafite"
                }`}
              >
                {statusLabels[payment.status] ?? payment.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
