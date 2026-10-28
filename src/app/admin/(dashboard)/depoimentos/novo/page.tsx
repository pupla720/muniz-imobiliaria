import { TestimonialForm } from "../testimonial-form";

export default function NewTestimonialPage() {
  return (
    <section className="max-w-xl">
      <h2 className="font-display font-medium text-2xl tracking-tight text-carvao mb-6">
        Cadastrar depoimento
      </h2>
      <TestimonialForm />
    </section>
  );
}
