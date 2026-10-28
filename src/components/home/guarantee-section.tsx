const pillars = [
  {
    title: "Curadoria rigorosa",
    text: "Apenas imóveis com documentação 100% checada entram na seleção.",
    icon: (
      <path d="M11 4 3 8l8 4 8-4-8-4ZM3 8v6l8 4 8-4V8" />
    ),
  },
  {
    title: "Segurança jurídica",
    text: "Acompanhamento cartorário e contratual do início ao fim.",
    icon: (
      <>
        <path d="M11 3 4 6v5c0 4 3 7 7 8 4-1 7-4 7-8V6l-7-3Z" />
        <path d="M8 11l2.2 2.2L15 9" />
      </>
    ),
  },
  {
    title: "Atendimento sigiloso",
    text: "Discrição absoluta e assessoria humana em cada etapa.",
    icon: (
      <>
        <rect x="5" y="10" width="12" height="9" rx="1.5" />
        <path d="M8 10V7a3 3 0 0 1 6 0v3" />
      </>
    ),
  },
  {
    title: "Especialistas locais",
    text: "Conhecimento profundo das regiões mais valorizadas da cidade.",
    icon: (
      <>
        <path d="M11 3c3.3 0 6 2.6 6 5.9 0 4.2-6 10.1-6 10.1S5 13.1 5 8.9C5 5.6 7.7 3 11 3Z" />
        <circle cx="11" cy="9" r="2" />
      </>
    ),
  },
];

export function GuaranteeSection() {
  return (
    <section id="confianca" className="bg-anil-escuro text-cal-claro">
      <div className="mx-auto max-w-6xl px-7 py-20 sm:py-28">
        <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-16">
          <p className="font-utility text-xs uppercase tracking-[0.28em] text-latao-claro">
            Por que confiar
          </p>
          <div className="w-12 h-px bg-latao-claro mx-auto mt-5 mb-5" />
          <h2 className="font-display font-medium text-[clamp(30px,4.5vw,50px)] leading-[1.08] tracking-tight">
            Segurança patrimonial em cada etapa.
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-12">
          {pillars.map((p) => (
            <div key={p.title}>
              <svg
                viewBox="0 0 22 22"
                width="34"
                height="34"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-latao-claro"
                aria-hidden="true"
              >
                {p.icon}
              </svg>
              <p className="font-display text-xl mt-5">{p.title}</p>
              <p className="text-[#c3d1cd] font-light text-sm mt-2.5 leading-relaxed">
                {p.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
