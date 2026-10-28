import { prisma } from "@/lib/prisma";

export async function PropertySearchForm({
  action = "/imoveis",
  defaultBairro,
  defaultQuartos,
  defaultTipo,
}: {
  action?: string;
  defaultBairro?: string;
  defaultQuartos?: string;
  defaultTipo?: string;
}) {
  const bairros = await prisma.property.findMany({
    distinct: ["bairro"],
    select: { bairro: true },
    orderBy: { bairro: "asc" },
  });

  const fieldCls =
    "bg-transparent px-5 min-h-14 text-sm text-carvao border-b sm:border-b-0 sm:border-r border-carvao/12 focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-latao";

  return (
    <form
      action={action}
      method="get"
      className="grid grid-cols-1 sm:grid-cols-4 bg-cal-claro border border-carvao/15 rounded-md overflow-hidden shadow-[0_24px_50px_-34px_rgba(14,46,43,0.5)]"
    >
      <select
        name="tipo"
        defaultValue={defaultTipo ?? ""}
        aria-label="Tipo de imóvel"
        className={fieldCls}
      >
        <option value="">Tipo de imóvel</option>
        <option value="CASA">Casa</option>
        <option value="APARTAMENTO">Apartamento</option>
      </select>

      <select
        name="bairro"
        defaultValue={defaultBairro ?? ""}
        aria-label="Região"
        className={fieldCls}
      >
        <option value="">Todas as regiões</option>
        {bairros.map(({ bairro }) => (
          <option key={bairro} value={bairro}>
            {bairro}
          </option>
        ))}
      </select>

      <select
        name="quartos"
        defaultValue={defaultQuartos ?? ""}
        aria-label="Dormitórios"
        className={fieldCls}
      >
        <option value="">Dormitórios</option>
        <option value="1">1+</option>
        <option value="2">2+</option>
        <option value="3">3+</option>
        <option value="4">4+</option>
      </select>

      <button
        type="submit"
        className="bg-anil text-cal-claro min-h-14 px-5 text-[13px] uppercase tracking-[0.12em] hover:bg-anil-escuro transition-colors duration-300"
      >
        Ver seleção
      </button>
    </form>
  );
}
