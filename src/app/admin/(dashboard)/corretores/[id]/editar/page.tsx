import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { BrokerForm } from "../../broker-form";

export default async function EditBrokerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const broker = await prisma.broker.findUnique({ where: { id } });

  if (!broker) {
    notFound();
  }

  return (
    <section className="max-w-xl">
      <h2 className="font-display font-medium text-2xl tracking-tight text-carvao mb-6">
        Editar corretor
      </h2>
      <BrokerForm brokerId={broker.id} defaultValues={broker} />
    </section>
  );
}
