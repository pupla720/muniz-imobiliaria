"use client";

import { whatsAppUrl, utmLabelFromSearchParams } from "@/lib/whatsapp";
import { trackEvent } from "@/lib/analytics";

export function WhatsAppLink({
  message,
  origin,
  codigo,
  phone,
  className,
  children,
}: {
  message: string;
  origin: string;
  codigo?: string;
  phone: string;
  className?: string;
  children: React.ReactNode;
}) {
  // href "base" (sem UTM) serve de fallback caso o JS não carregue a tempo;
  // no clique, recalculamos com a UTM da URL atual e navegamos manualmente.
  const baseHref = whatsAppUrl(message, phone);

  function handleClick(event: React.MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    trackEvent({ name: "click_whatsapp", codigo, origin });

    const utm = utmLabelFromSearchParams(new URLSearchParams(window.location.search));
    const fullMessage = utm ? `${message}\n\n(origem: ${utm})` : message;
    window.open(whatsAppUrl(fullMessage, phone), "_blank", "noopener,noreferrer");
  }

  return (
    <a href={baseHref} className={className} onClick={handleClick}>
      {children}
    </a>
  );
}
