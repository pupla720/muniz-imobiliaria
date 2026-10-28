import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { TestimonialRowActions } from "./testimonial-row-actions";
import { adminHeading, adminBtnPrimary, adminBtnGhost } from "@/components/admin/ui";

export default async function AdminTestimonialsPage() {
  const testimonials = await prisma.testimonial.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <section>
      <div className="flex items-center justify-between gap-4 mb-6">
        <h2 className={adminHeading}>Depoimentos</h2>
        <Link href="/admin/depoimentos/novo" className={adminBtnPrimary}>
          Novo depoimento
        </Link>
      </div>
      <div className="bg-cal-claro border border-carvao/12 rounded-md divide-y divide-carvao/10">
        {testimonials.length === 0 && (
          <p className="p-5 text-sm text-grafite font-light">
            Nenhum depoimento cadastrado.
          </p>
        )}
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="p-5 flex items-center gap-4">
            <div className="flex-1">
              <p className="font-display text-lg text-carvao">
                {testimonial.authorName}
              </p>
              <p className="text-sm text-grafite font-light line-clamp-1 mt-0.5">
                &quot;{testimonial.quote}&quot;
              </p>
              {testimonial.propertyCode && (
                <p className="font-utility text-[11px] tracking-[0.1em] text-latao mt-0.5">
                  {testimonial.propertyCode}
                </p>
              )}
            </div>
            <span
              className={`font-utility text-[10.5px] uppercase tracking-[0.12em] px-3 py-1.5 rounded-full shrink-0 ${
                testimonial.published
                  ? "bg-mangue/15 text-mangue-escuro"
                  : "bg-carvao/10 text-grafite"
              }`}
            >
              {testimonial.published ? "Publicado" : "Rascunho"}
            </span>
            <Link
              href={`/admin/depoimentos/${testimonial.id}/editar`}
              className={`${adminBtnGhost} shrink-0`}
            >
              Editar
            </Link>
            <TestimonialRowActions
              testimonialId={testimonial.id}
              published={testimonial.published}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
