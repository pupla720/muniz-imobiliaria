import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ToggleActiveButton } from "./toggle-active-button";
import { adminHeading, adminBtnPrimary, adminBtnGhost } from "@/components/admin/ui";

export default async function AdminBrokersPage() {
  const brokers = await prisma.broker.findMany({ orderBy: { name: "asc" } });

  return (
    <section>
      <div className="flex items-center justify-between gap-4 mb-6">
        <h2 className={adminHeading}>Corretores</h2>
        <Link href="/admin/corretores/novo" className={adminBtnPrimary}>
          Novo corretor
        </Link>
      </div>
      <div className="bg-cal-claro border border-carvao/12 rounded-md divide-y divide-carvao/10">
        {brokers.length === 0 && (
          <p className="p-5 text-sm text-grafite font-light">
            Nenhum corretor cadastrado.
          </p>
        )}
        {brokers.map((broker) => (
          <div key={broker.id} className="p-5 flex items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={broker.photoUrl}
              alt={broker.name}
              className="w-12 h-12 rounded-full object-cover shrink-0 border border-carvao/15"
            />
            <div className="flex-1">
              <p className="font-display text-lg text-carvao">{broker.name}</p>
              <p className="text-sm text-grafite font-light mt-0.5">
                CRECI {broker.creci} · WhatsApp: {broker.whatsapp}
              </p>
            </div>
            <span
              className={`font-utility text-[10.5px] uppercase tracking-[0.12em] px-3 py-1.5 rounded-full shrink-0 ${
                broker.active
                  ? "bg-mangue/15 text-mangue-escuro"
                  : "bg-carvao/10 text-grafite"
              }`}
            >
              {broker.active ? "Ativo" : "Inativo"}
            </span>
            <Link
              href={`/admin/corretores/${broker.id}/editar`}
              className={`${adminBtnGhost} shrink-0`}
            >
              Editar
            </Link>
            <ToggleActiveButton brokerId={broker.id} active={broker.active} />
          </div>
        ))}
      </div>
    </section>
  );
}
