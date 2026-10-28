import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { StatusSelect } from "../status-select";
import { adminHeading, adminBtnPrimary, adminBtnGhost } from "@/components/admin/ui";

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

const typeLabels: Record<string, string> = {
  CASA: "Casa",
  APARTAMENTO: "Apartamento",
};

export default async function AdminPropertiesPage() {
  const properties = await prisma.property.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <section>
      <div className="flex items-center justify-between gap-4 mb-6">
        <h2 className={adminHeading}>Imóveis cadastrados</h2>
        <Link href="/admin/imoveis/novo" className={adminBtnPrimary}>
          Novo imóvel
        </Link>
      </div>

      <div className="bg-cal-claro border border-carvao/12 rounded-md divide-y divide-carvao/10">
        {properties.length === 0 && (
          <p className="p-5 text-sm text-grafite font-light">
            Nenhum imóvel cadastrado.
          </p>
        )}
        {properties.map((property) => (
          <div
            key={property.id}
            className="p-5 flex items-center justify-between gap-4"
          >
            <div>
              <p className="text-carvao">
                <span className="font-utility text-[11px] tracking-[0.1em] bg-anil/10 text-anil px-2 py-0.5 rounded mr-2">
                  {property.codigo}
                </span>
                <span className="font-display text-lg">{property.title}</span>{" "}
                <span className="text-xs text-grafite">
                  ({typeLabels[property.type] ?? property.type})
                </span>
              </p>
              <p className="text-sm text-grafite font-light mt-1">
                {property.bairro}, {property.city} ·{" "}
                {formatBRL(property.priceMonthly)}/mês
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <StatusSelect propertyId={property.id} status={property.status} />
              <Link
                href={`/admin/imoveis/${property.id}/editar`}
                className={adminBtnGhost}
              >
                Editar
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
