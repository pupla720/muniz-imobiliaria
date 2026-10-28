const steps = [
  {
    n: 1,
    title: "Converse com um especialista",
    text: "Entendemos seu perfil e seus objetivos em uma conversa reservada.",
  },
  {
    n: 2,
    title: "Curadoria sob medida",
    text: "Selecionamos imóveis alinhados ao seu patrimônio e estilo de vida.",
  },
  {
    n: 3,
    title: "Visita e due diligence",
    text: "Agende visitas e receba a análise documental completa de cada opção.",
  },
  {
    n: 4,
    title: "Assessoria até a escritura",
    text: "Acompanhamento jurídico e cartorário do contrato à entrega das chaves.",
  },
];

export function HowItWorks() {
  return (
    <section className="bg-cal">
      <div className="mx-auto max-w-6xl px-7 py-20 sm:py-28">
        <div className="max-w-2xl mb-12 sm:mb-16">
          <p className="font-utility text-xs uppercase tracking-[0.28em] text-latao">
            Como funciona
          </p>
          <div className="w-12 h-px bg-latao mt-5 mb-5" />
          <h2 className="font-display font-medium text-[clamp(30px,4vw,48px)] tracking-tight text-carvao">
            Do primeiro contato à escritura.
          </h2>
        </div>

        <ol className="grid grid-cols-1 sm:grid-cols-4 gap-10">
          {steps.map((step) => (
            <li key={step.n} className="border-t border-carvao/15 pt-5">
              <span className="font-display text-4xl leading-none text-latao">
                {String(step.n).padStart(2, "0")}
              </span>
              <p className="font-display text-xl text-carvao mt-3">{step.title}</p>
              <p className="text-grafite font-light text-sm mt-2 leading-relaxed">
                {step.text}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
