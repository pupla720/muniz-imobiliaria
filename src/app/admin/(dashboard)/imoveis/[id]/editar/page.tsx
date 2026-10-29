import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PropertyForm, type PropertyFormValues } from "../../property-form";

export default async function EditPropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [property, brokers] = await Promise.all([
    prisma.property.findUnique({ where: { id } }),
    prisma.broker.findMany({
      where: { active: true },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  if (!property) {
    notFound();
  }

  const photos = JSON.parse(property.photos) as string[];

  const defaultValues: PropertyFormValues = {
    codigo: property.codigo,
    type: property.type,
    modalidade: property.modalidade,
    status: property.status,
    title: property.title,
    description: property.description,
    address: property.address,
    bairro: property.bairro,
    city: property.city,
    state: property.state,
    priceMonthly: property.priceMonthly,
    priceDaily: property.priceDaily,
    priceWeekend: property.priceWeekend,
    condominio: property.condominio,
    iptu: property.iptu,
    depositAmount: property.depositAmount,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    vagas: property.vagas,
    areaM2: property.areaM2,
    andar: property.andar != null ? String(property.andar) : "",
    mobiliado: property.mobiliado,
    aceitaPet: property.aceitaPet,
    floorPlanUrl: property.floorPlanUrl ?? "",
    brokerId: property.brokerId ?? "",
    photosText: photos.join("\n"),
  };

  return (
    <section className="max-w-2xl">
      <h2 className="font-display font-medium text-2xl tracking-tight text-carvao mb-6">
        Editar imóvel
      </h2>
      <PropertyForm propertyId={property.id} defaultValues={defaultValues} brokers={brokers} />
    </section>
  );
}
