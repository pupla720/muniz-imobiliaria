export interface WhatsAppPropertyContext {
  codigo: string;
  titulo: string;
}

function withUtm(message: string, utm?: string | null) {
  if (!utm) return message;
  return `${message}\n\n(origem: ${utm})`;
}

export function buildInterestMessage(
  imovel: WhatsAppPropertyContext,
  utm?: string | null,
) {
  const msg = `Olá! Tenho interesse no imóvel ${imovel.codigo} - ${imovel.titulo}. Gostaria de receber o dossiê completo, com disponibilidade e condições.`;
  return withUtm(msg, utm);
}

export function buildVisitMessage(
  imovel: WhatsAppPropertyContext,
  utm?: string | null,
) {
  const msg = `Olá! Gostaria de agendar uma visita ao imóvel ${imovel.codigo} - ${imovel.titulo}, com atendimento exclusivo.`;
  return withUtm(msg, utm);
}

export function buildOwnerMessage(utm?: string | null) {
  const msg = "Olá! Sou proprietário(a) e gostaria de confiar meu imóvel à curadoria da imobiliária.";
  return withUtm(msg, utm);
}

export function whatsAppUrl(message: string, phone: string) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

/** Extrai um rótulo curto de origem a partir dos parâmetros utm_* da URL atual. */
export function utmLabelFromSearchParams(
  searchParams: URLSearchParams | Record<string, string | string[] | undefined>,
): string | null {
  const get = (key: string): string | undefined => {
    if (searchParams instanceof URLSearchParams) {
      return searchParams.get(key) ?? undefined;
    }
    const value = searchParams[key];
    return Array.isArray(value) ? value[0] : value;
  };

  const source = get("utm_source");
  const medium = get("utm_medium");
  const campaign = get("utm_campaign");

  const parts = [source, medium, campaign].filter(Boolean);
  return parts.length ? parts.join("/") : null;
}
