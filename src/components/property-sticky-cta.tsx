import { WhatsAppLink } from "@/components/whatsapp-link";
import { buildInterestMessage, buildVisitMessage } from "@/lib/whatsapp";
import type { WhatsAppPropertyContext } from "@/lib/whatsapp";

export function PropertyStickyCta({
  imovel,
  phone,
}: {
  imovel: WhatsAppPropertyContext;
  phone: string;
}) {
  return (
    <div className="fixed bottom-0 inset-x-0 z-50 bg-cal-claro border-t border-carvao/12 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-6px_18px_rgba(14,46,43,0.12)]">
      <div className="mx-auto max-w-4xl grid grid-cols-2 gap-3">
        <WhatsAppLink
          message={buildVisitMessage(imovel)}
          origin="ficha_agendar_visita"
          codigo={imovel.codigo}
          phone={phone}
          className="flex items-center justify-center rounded-md border border-anil text-anil text-[13px] uppercase tracking-[0.1em] px-4 min-h-12 hover:bg-anil hover:text-cal-claro transition-colors"
        >
          Agendar visita
        </WhatsAppLink>
        <WhatsAppLink
          message={buildInterestMessage(imovel)}
          origin="ficha_solicitar_dossie"
          codigo={imovel.codigo}
          phone={phone}
          className="flex items-center justify-center rounded-md bg-latao text-[#20170a] text-[13px] uppercase tracking-[0.1em] px-4 min-h-12 hover:bg-latao-claro transition-colors"
        >
          Solicitar dossiê
        </WhatsAppLink>
      </div>
    </div>
  );
}
