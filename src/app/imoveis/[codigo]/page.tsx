import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { DoorPlate } from "@/components/door-plate";
import { PropertyGallery } from "@/components/property-gallery";
import { PropertySpecs } from "@/components/property-specs";
import { PropertyNeighborhoodMap } from "@/components/property-neighborhood-map";
import { PropertyStickyCta } from "@/components/property-sticky-cta";
import { PropertyCard } from "@/components/property-card";
import { ViewTracker } from "@/components/view-tracker";
import { WhatsAppLink } from "@/components/whatsapp-link";
import { buildInterestMessage, buildVisitMessage } from "@/lib/whatsapp";
import { getBusinessSettings } from "@/lib/business-settings";

const typeLabels = { CASA: "Casa", APARTAMENTO: "Apartamento" };

async function getProperty(codigo: string) {
  return prisma.property.findUnique({ where: { codigo }, include: { broker: true } });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ codigo: string }>;
}): Promise<Metadata> {
  const { codigo } = await params;
  const property = await getProperty(codigo);
  if (!property) return { title: "Imóvel não encontrado" };

  const photos = JSON.parse(property.photos) as string[];
  const title = `${property.title} — ${property.codigo}`;
  const description = `${typeLabels[property.type]} em ${property.bairro}, ${property.city}/${property.state}. ${property.bedrooms} quartos, ${property.areaM2}m². Atendimento exclusivo — disponibilidade sob consulta.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: photos[0] ? [{ url: photos[0] }] : [],
    },
  };
}

export default async function PropertyPage({
  params,
}: {
  params: Promise<{ codigo: string }>;
}) {
  const { codigo } = await params;
  const property = await getProperty(codigo);

  if (!property) {
    notFound();
  }

  const photos = JSON.parse(property.photos) as string[];
  const similar = await prisma.property.findMany({
    where: {
      codigo: { not: property.codigo },
      OR: [{ bairro: property.bairro }, { type: property.type }],
    },
    take: 3,
    orderBy: { createdAt: "desc" },
  });

  const business = await getBusinessSettings();
  const contactPhone = property.broker?.whatsapp ?? business.whatsapp;

  const imovel = {
    codigo: property.codigo,
    titulo: property.title,
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: property.title,
    description: property.description,
    url: `${process.env.APP_URL ?? "http://localhost:3000"}/imoveis/${property.codigo}`,
    identifier: property.codigo,
    address: {
      "@type": "PostalAddress",
      streetAddress: property.address,
      addressLocality: property.city,
      addressRegion: property.state,
      addressCountry: "BR",
    },
    numberOfRooms: property.bedrooms,
    floorSize: { "@type": "QuantitativeValue", value: property.areaM2, unitCode: "MTK" },
  };

  return (
    <div className="pb-24">
      <ViewTracker codigo={property.codigo} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-5xl px-7 py-8 sm:py-12">
        <PropertyGallery photos={photos} title={property.title} />

        <div className="flex items-start justify-between gap-4 mt-8">
          <div>
            <p className="font-utility text-xs uppercase tracking-[0.2em] text-latao">
              {typeLabels[property.type]} · {property.bairro}, {property.city}/
              {property.state}
            </p>
            <h1 className="font-display font-medium text-[clamp(28px,4vw,44px)] tracking-tight text-carvao mt-2">
              {property.title}
            </h1>
          </div>
          <DoorPlate codigo={property.codigo} status={property.status} size="lg" />
        </div>

        <p className="text-carvao font-light leading-relaxed mt-5 max-w-[65ch]">
          {property.description}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-10">
          <div className="order-2 lg:order-1 lg:col-span-2">
            <PropertySpecs property={property} />

            <div className="mt-10">
              <PropertyNeighborhoodMap
                bairro={property.bairro}
                city={property.city}
                state={property.state}
              />
            </div>

            <div className="mt-10">
              <h2 className="font-display font-medium text-2xl tracking-tight text-carvao mb-4">
                Planta baixa
              </h2>
              {property.floorPlanUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={property.floorPlanUrl}
                  alt={`Planta baixa — ${property.title}`}
                  className="w-full rounded-md border border-carvao/12"
                />
              ) : (
                <div className="border border-carvao/15 rounded-md p-8 text-center text-grafite font-light text-sm">
                  Planta baixa disponível no dossiê completo.
                </div>
              )}
            </div>

            {property.broker && (
              <div className="mt-10 flex items-center gap-4 border border-carvao/12 rounded-md p-5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={property.broker.photoUrl}
                  alt={property.broker.name}
                  width={56}
                  height={56}
                  className="rounded-full object-cover w-14 h-14"
                />
                <div className="flex-1">
                  <p className="font-display text-lg text-carvao">
                    {property.broker.name}
                  </p>
                  <p className="font-utility text-[11px] uppercase tracking-[0.18em] text-latao mt-0.5">
                    Especialista · CRECI {property.broker.creci}
                  </p>
                </div>
                <WhatsAppLink
                  message={`Olá ${property.broker.name.split(" ")[0]}! Tenho interesse no imóvel ${property.codigo} - ${property.title} e gostaria de um atendimento exclusivo.`}
                  origin="ficha_broker_card"
                  codigo={property.codigo}
                  phone={property.broker.whatsapp}
                  className="shrink-0 inline-flex items-center justify-center rounded-md border border-anil text-anil text-[12px] uppercase tracking-[0.1em] px-4 min-h-11 hover:bg-anil hover:text-cal-claro transition-colors"
                >
                  Falar
                </WhatsAppLink>
              </div>
            )}
          </div>

          <aside className="order-1 lg:order-2 lg:col-span-1">
            <div className="lg:sticky lg:top-24 border border-carvao/12 rounded-md bg-cal-claro p-7">
              <p className="font-utility text-xs uppercase tracking-[0.22em] text-latao">
                Atendimento private
              </p>
              <p className="font-display font-medium text-2xl leading-snug tracking-tight text-carvao mt-3">
                Disponibilidade e condições sob consulta exclusiva.
              </p>
              <p className="text-grafite font-light text-sm mt-3 leading-relaxed">
                Receba o dossiê completo do {property.codigo} — documentação
                verificada e condições — apresentado por um especialista.
              </p>

              <div className="mt-6 flex flex-col gap-3">
                <WhatsAppLink
                  message={buildInterestMessage(imovel)}
                  origin="ficha_solicitar_dossie"
                  codigo={property.codigo}
                  phone={contactPhone}
                  className="inline-flex items-center justify-center rounded-md bg-latao text-[#20170a] text-[13px] uppercase tracking-[0.1em] px-5 min-h-12 hover:bg-latao-claro transition-colors"
                >
                  Solicitar dossiê completo
                </WhatsAppLink>
                <WhatsAppLink
                  message={buildVisitMessage(imovel)}
                  origin="ficha_agendar_visita"
                  codigo={property.codigo}
                  phone={contactPhone}
                  className="inline-flex items-center justify-center rounded-md border border-anil text-anil text-[13px] uppercase tracking-[0.1em] px-5 min-h-12 hover:bg-anil hover:text-cal-claro transition-colors"
                >
                  Agendar visita
                </WhatsAppLink>
              </div>

              <p className="text-[11px] text-grafite font-light mt-5 leading-relaxed">
                Seus dados estão protegidos. Respeitamos sua privacidade e não
                enviamos spam.
              </p>
            </div>
          </aside>
        </div>

        {similar.length > 0 && (
          <div className="mt-20">
            <h2 className="font-display font-medium text-2xl tracking-tight text-carvao mb-6">
              Seleções semelhantes
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {similar.map((p) => (
                <PropertyCard key={p.codigo} property={p} />
              ))}
            </div>
          </div>
        )}
      </div>

      <PropertyStickyCta imovel={imovel} phone={contactPhone} />
    </div>
  );
}
