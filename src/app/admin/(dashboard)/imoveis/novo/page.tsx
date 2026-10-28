import { prisma } from "@/lib/prisma";
import { PropertyForm } from "../property-form";

export default async function NewPropertyPage() {
  const brokers = await prisma.broker.findMany({
    where: { active: true },
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  return (
    <section className="max-w-2xl">
      <h2 className="font-display font-medium text-2xl tracking-tight text-carvao mb-6">
        Cadastrar novo imóvel
      </h2>
      <PropertyForm brokers={brokers} />
    </section>
  );
}
