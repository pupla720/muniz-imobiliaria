import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { WhatsAppLink } from "@/components/whatsapp-link";

export async function TeamSection() {
  const brokers = await prisma.broker.findMany({
    where: { active: true },
    orderBy: { name: "asc" },
  });

  if (brokers.length === 0) return null;

  return (
    <section id="especialistas" className="bg-cal">
      <div className="mx-auto max-w-6xl px-7 py-20 sm:py-28">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <p className="font-utility text-xs uppercase tracking-[0.28em] text-latao">
            Especialistas
          </p>
          <div className="w-12 h-px bg-latao mx-auto mt-5 mb-5" />
          <h2 className="font-display font-medium text-[clamp(30px,4vw,48px)] tracking-tight text-carvao">
            Quem conduz o seu atendimento
          </h2>
          <p className="text-grafite font-light mt-4">
            Profissionais de mercado, com registro ativo e assessoria humana em
            cada etapa.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {brokers.map((broker) => (
            <div
              key={broker.id}
              className="bg-cal-claro border border-carvao/12 rounded-md p-8 text-center flex flex-col items-center"
            >
              <Image
                src={broker.photoUrl}
                alt={broker.name}
                width={112}
                height={112}
                loading="eager"
                className="rounded-full object-cover w-28 h-28"
              />
              <p className="font-display text-xl text-carvao mt-5">{broker.name}</p>
              <p className="font-utility text-xs uppercase tracking-[0.2em] text-latao mt-1.5">
                CRECI {broker.creci}
              </p>
              <WhatsAppLink
                message={`Olá ${broker.name.split(" ")[0]}! Vim pelo site da Muniz Imobiliária e gostaria de um atendimento exclusivo.`}
                origin="team_section"
                phone={broker.whatsapp}
                className="mt-6 inline-flex items-center justify-center rounded-md min-h-11 px-5 text-[13px] uppercase tracking-[0.12em] border border-anil text-anil hover:bg-anil hover:text-cal-claro transition-colors duration-300"
              >
                Falar com especialista
              </WhatsAppLink>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
