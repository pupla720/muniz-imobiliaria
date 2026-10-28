import Link from "next/link";
import { getBusinessSettings } from "@/lib/business-settings";
import { WhatsAppLink } from "@/components/whatsapp-link";

export async function Hero() {
  const business = await getBusinessSettings();

  return (
    <section className="relative bg-anil text-cal-claro overflow-hidden">
      <HeroBackdrop />
      <div className="relative mx-auto max-w-6xl px-7 pt-20 pb-16 sm:pt-32 sm:pb-24">
        <p className="font-utility text-xs uppercase tracking-[0.3em] text-latao-claro">
          Curadoria imobiliária · {business.addressCity}
        </p>
        <h1 className="font-display font-medium text-[clamp(42px,7.5vw,82px)] leading-[1.03] tracking-tight mt-5 max-w-[17ch]">
          Alto padrão para quem valoriza{" "}
          <em className="italic text-latao-claro">patrimônio</em> e bem-estar.
        </h1>
        <p className="mt-7 max-w-[48ch] text-[#d7e2df] font-light text-base sm:text-lg leading-relaxed">
          Seleção exclusiva de imóveis em {business.addressCity}, com assessoria
          jurídica própria e sigilo absoluto — do primeiro contato à escritura.
        </p>

        <div className="flex flex-wrap gap-3.5 mt-9">
          <WhatsAppLink
            message={`Olá! Vim pelo site da ${business.name} e gostaria de um atendimento exclusivo para conhecer a seleção de imóveis.`}
            origin="hero"
            phone={business.whatsapp}
            className="inline-flex items-center justify-center rounded-md min-h-12 px-6 text-sm uppercase tracking-[0.12em] bg-latao text-[#20170a] hover:bg-latao-claro transition-colors duration-300"
          >
            Atendimento exclusivo
          </WhatsAppLink>
          <Link
            href="/imoveis"
            className="inline-flex items-center justify-center rounded-md min-h-12 px-6 text-sm uppercase tracking-[0.12em] border border-latao-claro text-cal-claro hover:bg-latao-claro hover:text-[#20170a] transition-colors duration-300"
          >
            Ver seleção
          </Link>
        </div>

        <dl className="flex flex-wrap gap-x-12 gap-y-6 mt-14 border-t border-white/15 pt-8 max-w-2xl">
          <HeroPillar t="Curadoria" d="rigorosa e sob medida" />
          <HeroPillar t="Assessoria jurídica" d="própria, do início ao fim" />
          <HeroPillar t="Sigilo" d="discrição absoluta" />
        </dl>
      </div>
    </section>
  );
}

function HeroPillar({ t, d }: { t: string; d: string }) {
  return (
    <div>
      <dt className="font-display text-2xl text-latao-claro leading-none">{t}</dt>
      <dd className="font-utility text-[11px] uppercase tracking-[0.16em] text-[#b9c7c3] mt-2">
        {d}
      </dd>
    </div>
  );
}

// Linha-fio de arquitetura (desenho próprio, não foto de banco de imagens).
function HeroBackdrop() {
  return (
    <svg
      viewBox="0 0 1200 600"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 w-full h-full opacity-[0.16]"
      aria-hidden="true"
    >
      <g stroke="#cbae6b" strokeWidth="1" fill="none">
        <rect x="760" y="120" width="300" height="420" />
        <line x1="760" y1="230" x2="1060" y2="230" />
        <line x1="760" y1="340" x2="1060" y2="340" />
        <line x1="760" y1="450" x2="1060" y2="450" />
        <line x1="860" y1="120" x2="860" y2="540" />
        <line x1="960" y1="120" x2="960" y2="540" />
        <rect x="150" y="260" width="180" height="280" />
        <line x1="150" y1="360" x2="330" y2="360" />
        <line x1="240" y1="260" x2="240" y2="540" />
      </g>
    </svg>
  );
}
