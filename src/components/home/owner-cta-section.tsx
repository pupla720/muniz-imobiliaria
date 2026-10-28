import { WhatsAppLink } from "@/components/whatsapp-link";
import { buildOwnerMessage } from "@/lib/whatsapp";
import { getBusinessSettings } from "@/lib/business-settings";

export async function OwnerCtaSection() {
  const business = await getBusinessSettings();

  return (
    <section id="contato" className="bg-carvao text-cal-claro">
      <div className="mx-auto max-w-6xl px-7 py-16 sm:py-20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
        <div>
          <p className="font-utility text-xs uppercase tracking-[0.28em] text-latao-claro">
            Proprietários
          </p>
          <p className="font-display font-medium text-[clamp(26px,3.5vw,40px)] tracking-tight mt-3">
            Confie seu patrimônio a uma curadoria especializada.
          </p>
          <p className="text-[#c3d1cd] font-light mt-2">
            Avaliação discreta e assessoria completa para locação em{" "}
            {business.addressCity}, com a {business.name}.
          </p>
        </div>
        <WhatsAppLink
          message={buildOwnerMessage()}
          origin="owner_cta"
          phone={business.whatsapp}
          className="inline-flex items-center justify-center rounded-md min-h-12 px-6 text-sm uppercase tracking-[0.12em] border border-latao-claro text-cal-claro hover:bg-latao-claro hover:text-[#20170a] transition-colors duration-300 whitespace-nowrap"
        >
          Falar com especialista
        </WhatsAppLink>
      </div>
    </section>
  );
}
