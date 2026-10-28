"use client";

import { usePathname } from "next/navigation";
import { WhatsAppLink } from "@/components/whatsapp-link";

export function WhatsAppFloatButton({
  businessName,
  whatsapp,
}: {
  businessName: string;
  whatsapp: string;
}) {
  const pathname = usePathname();
  // Na ficha do imóvel já existe uma barra fixa própria (Tenho interesse /
  // Agendar visita) — evita duplicar CTA competindo por atenção.
  const isPropertyPage = /^\/imoveis\/[^/]+$/.test(pathname);
  const isAdminPage = pathname.startsWith("/admin");

  if (isPropertyPage || isAdminPage) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 sm:hidden">
      <WhatsAppLink
        message={`Olá! Vim pelo site da ${businessName} e quero saber mais sobre os imóveis disponíveis.`}
        origin="floating_button"
        phone={whatsapp}
        className="flex items-center gap-2 bg-mangue text-white font-semibold px-5 py-3 rounded-full shadow-lg shadow-carvao/20 min-h-11"
      >
        <WhatsAppIcon />
        Falar no WhatsApp
      </WhatsAppLink>
    </div>
  );
}

function WhatsAppIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.29-1.39a9.9 9.9 0 0 0 4.75 1.21h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2Zm0 18.06a8.14 8.14 0 0 1-4.15-1.14l-.3-.18-3.14.82.84-3.06-.19-.31a8.15 8.15 0 1 1 6.94 3.87Zm4.47-6.11c-.24-.12-1.44-.71-1.67-.79-.22-.08-.38-.12-.55.12-.16.24-.63.79-.77.95-.14.16-.28.18-.53.06-.24-.12-1.03-.38-1.96-1.21-.72-.64-1.21-1.44-1.35-1.68-.14-.24-.02-.37.11-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.55-1.32-.75-1.81-.2-.48-.4-.41-.55-.42-.14-.01-.3-.01-.46-.01-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.7 2.59 4.11 3.63.57.25 1.02.4 1.37.51.58.18 1.1.16 1.51.1.46-.07 1.44-.59 1.64-1.16.2-.57.2-1.05.14-1.16-.06-.11-.22-.17-.46-.29Z" />
    </svg>
  );
}
