import type { Metadata } from "next";
import type { PropertyType } from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import { PropertySearchForm } from "@/components/property-search-form";
import { PropertyCard } from "@/components/property-card";
import { getBusinessSettings } from "@/lib/business-settings";

export async function generateMetadata(): Promise<Metadata> {
  const business = await getBusinessSettings();
  return {
    title: `Imóveis selecionados em ${business.addressCity}`,
    description: `Curadoria de imóveis em ${business.addressCity}, com assessoria jurídica própria e atendimento exclusivo. Disponibilidade sob consulta.`,
  };
}

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ bairro?: string; quartos?: string; tipo?: string }>;
}) {
  const params = await searchParams;
  const bairro = params.bairro?.trim();
  const quartos = params.quartos ? Number(params.quartos) : undefined;
  const tipo: PropertyType | undefined =
    params.tipo === "CASA" || params.tipo === "APARTAMENTO" ? params.tipo : undefined;

  const business = await getBusinessSettings();
  // Fonte da verdade: o banco. Reflete exatamente o que está cadastrado e
  // publicado no admin — nunca um arquivo estático de exemplo.
  const properties = await prisma.property.findMany({
    where: {
      modalidade: "MENSAL",
      ...(bairro ? { bairro } : {}),
      ...(quartos ? { bedrooms: { gte: quartos } } : {}),
      ...(tipo ? { type: tipo } : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-6xl px-7 py-14 sm:py-20">
      <p className="font-utility text-xs uppercase tracking-[0.28em] text-latao">
        Curadoria
      </p>
      <div className="w-12 h-px bg-latao mt-5 mb-5" />
      <h1 className="font-display font-medium text-[clamp(30px,4vw,48px)] tracking-tight text-carvao">
        Imóveis selecionados em {business.addressCity}
      </h1>
      <p className="text-grafite font-light mt-3">
        {properties.length}{" "}
        {properties.length === 1 ? "imóvel na seleção" : "imóveis na seleção"}
      </p>

      <div className="mt-8">
        <PropertySearchForm
          defaultBairro={bairro}
          defaultQuartos={params.quartos}
          defaultTipo={params.tipo}
        />
      </div>

      {properties.length === 0 ? (
        <div className="mt-12 border border-carvao/15 rounded-md p-10 text-center">
          <p className="font-display text-xl text-carvao">
            Nenhum imóvel encontrado com esses critérios.
          </p>
          <p className="text-grafite font-light text-sm mt-2">
            Fale com um de nossos especialistas — temos oportunidades fora da
            vitrine, apresentadas sob consulta exclusiva.
          </p>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((property) => (
            <PropertyCard key={property.codigo} property={property} />
          ))}
        </div>
      )}
    </div>
  );
}
