import Link from "next/link";
import { getBusinessSettings } from "@/lib/business-settings";
import { WhatsAppLink } from "@/components/whatsapp-link";

export async function SiteHeader() {
  const business = await getBusinessSettings();

  return (
    <header className="sticky top-0 z-40 border-b border-carvao/12 bg-cal/85 backdrop-blur supports-[backdrop-filter]:bg-cal/75">
      <div className="mx-auto max-w-6xl px-7 py-4 flex items-center justify-between gap-6">
        <Link href="/" className="leading-none shrink-0">
          <span className="block font-display text-xl sm:text-2xl font-semibold tracking-[0.05em] text-anil">
            {business.name}
          </span>
          <span className="block font-utility text-[10.5px] uppercase tracking-[0.3em] text-grafite mt-1.5">
            CRECI {business.creci} · {business.addressCity}/{business.addressState}
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-9 font-utility text-[13px] tracking-wide text-carvao">
          <Link href="/imoveis" className="hover:text-anil transition-colors">
            Imóveis selecionados
          </Link>
          <Link href="/#confianca" className="hover:text-anil transition-colors">
            Assessoria &amp; diferenciais
          </Link>
          <Link href="/#especialistas" className="hover:text-anil transition-colors">
            Especialistas
          </Link>
        </nav>

        <WhatsAppLink
          message={`Olá! Vim pelo site da ${business.name} e gostaria de um atendimento exclusivo.`}
          origin="header"
          phone={business.whatsapp}
          className="shrink-0 inline-flex items-center justify-center rounded-md min-h-11 px-5 text-[12px] uppercase tracking-[0.12em] bg-latao text-[#20170a] hover:bg-latao-claro transition-colors duration-300"
        >
          Atendimento exclusivo
        </WhatsAppLink>
      </div>
    </header>
  );
}
