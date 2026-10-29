import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { PropertyCard } from "@/components/property-card";
import { getBusinessSettings } from "@/lib/business-settings";

export async function generateMetadata(): Promise<Metadata> {
  const business = await getBusinessSettings();
  return {
    title: `Aluguel de temporada em ${business.addressCity}`,
    description: `Chácaras, sítios e casas para aluguel de temporada em ${business.addressCity} e região. Diárias e pacotes de fim de semana. Reserve pelo WhatsApp.`,
  };
}

export default async function TemporadaPage() {
  const business = await getBusinessSettings();
  const properties = await prisma.property.findMany({
    where: { modalidade: "TEMPORADA" },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-6xl px-7 py-14 sm:py-20">
      <p className="font-utility text-xs uppercase tracking-[0.28em] text-latao">
        Temporada
      </p>
      <div className="w-12 h-px bg-latao mt-5 mb-5" />
      <h1 className="font-display font-medium text-[clamp(30px,4vw,48px)] tracking-tight text-carvao">
        Aluguel de temporada
      </h1>
      <p className="text-grafite font-light mt-3 max-w-2xl">
        Chácaras, sítios e casas para alugar por diária ou pacote de fim de
        semana em {business.addressCity} e região.
      </p>

      {properties.length === 0 ? (
        <div className="mt-12 border border-carvao/15 rounded-md p-10 text-center">
          <p className="font-display text-xl text-carvao">
            Nenhum imóvel de temporada disponível no momento.
          </p>
          <p className="text-grafite font-light text-sm mt-2">
            Fale com um de nossos especialistas para conhecer as próximas
            disponibilidades.
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
