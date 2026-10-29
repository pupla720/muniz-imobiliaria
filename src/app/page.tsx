import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Hero } from "@/components/home/hero";
import { PropertySearchForm } from "@/components/property-search-form";
import { PropertyCard } from "@/components/property-card";
import { GuaranteeSection } from "@/components/home/guarantee-section";
import { HowItWorks } from "@/components/home/how-it-works";
import { TeamSection } from "@/components/home/team-section";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { OwnerCtaSection } from "@/components/home/owner-cta-section";

const statusPriority = { DISPONIVEL: 0, RESERVADO: 1, ALUGADO: 2 };

export default async function HomePage() {
  const properties = await prisma.property.findMany({
    where: { modalidade: "MENSAL" },
    orderBy: { createdAt: "desc" },
    take: 9,
  });

  const sorted = [...properties].sort(
    (a, b) => statusPriority[a.status] - statusPriority[b.status],
  );

  return (
    <>
      <Hero />

      <section className="mx-auto max-w-6xl px-4 -mt-6 sm:-mt-8 relative">
        <PropertySearchForm />
      </section>

      <section className="mx-auto max-w-6xl px-7 py-20 sm:py-28">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <p className="font-utility text-xs uppercase tracking-[0.28em] text-latao">
            Curadoria
          </p>
          <div className="w-12 h-px bg-latao mx-auto mt-5 mb-5" />
          <h2 className="font-display font-medium text-[clamp(30px,4vw,48px)] tracking-tight text-carvao">
            Oportunidades selecionadas
          </h2>
          <p className="text-grafite font-light mt-4">
            Imóveis com documentação verificada e disponibilidade apresentada
            sob consulta exclusiva.
          </p>
        </div>

        {sorted.length === 0 ? (
          <p className="text-grafite font-light text-center">
            Nenhum imóvel cadastrado ainda.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {sorted.map((property) => (
              <PropertyCard key={property.codigo} property={property} />
            ))}
          </div>
        )}

        <div className="text-center mt-14">
          <Link
            href="/imoveis"
            className="font-utility text-sm uppercase tracking-[0.14em] text-anil border-b border-latao pb-1 hover:text-latao transition-colors"
          >
            Ver seleção completa
          </Link>
        </div>
      </section>

      <GuaranteeSection />
      <HowItWorks />
      <TeamSection />
      <TestimonialsSection />
      <OwnerCtaSection />
    </>
  );
}
