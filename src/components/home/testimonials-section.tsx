import Image from "next/image";
import { prisma } from "@/lib/prisma";

// TODO: pedir pra imobiliária 3-5 depoimentos reais (nome, foto, imóvel
// alugado) e publicar via Testimonial.published = true. Até lá, mostramos um
// aviso honesto em vez de inventar depoimento.
export async function TestimonialsSection() {
  const testimonials = await prisma.testimonial.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    take: 6,
  });

  return (
    <section className="bg-cal">
      <div className="mx-auto max-w-6xl px-7 py-20 sm:py-28">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <p className="font-utility text-xs uppercase tracking-[0.28em] text-latao">
            Depoimentos
          </p>
          <div className="w-12 h-px bg-latao mx-auto mt-5 mb-5" />
          <h2 className="font-display font-medium text-[clamp(30px,4vw,48px)] tracking-tight text-carvao">
            Quem já alugou com a gente
          </h2>
        </div>

        {testimonials.length === 0 ? (
          <div className="border border-carvao/15 p-10 text-center text-grafite font-light max-w-xl mx-auto">
            Em breve, depoimentos de quem já alugou com a Muniz Imobiliária.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <figure
                key={t.id}
                className="bg-cal-claro border border-carvao/12 p-8 flex flex-col"
              >
                <blockquote className="font-display italic text-xl leading-snug text-carvao">
                  “{t.quote}”
                </blockquote>
                <figcaption className="flex items-center gap-3 mt-6 pt-5 border-t border-carvao/12">
                  {t.photoUrl && (
                    <Image
                      src={t.photoUrl}
                      alt={t.authorName}
                      width={44}
                      height={44}
                      className="rounded-full object-cover w-11 h-11"
                    />
                  )}
                  <div>
                    <p className="font-display text-base text-carvao">{t.authorName}</p>
                    {t.propertyCode && (
                      <p className="font-utility text-[11px] uppercase tracking-[0.18em] text-latao mt-0.5">
                        Alugou o {t.propertyCode}
                      </p>
                    )}
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
