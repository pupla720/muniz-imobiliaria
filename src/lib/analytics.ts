type AnalyticsEvent =
  | { name: "view_property"; codigo: string }
  | { name: "click_whatsapp"; codigo?: string; origin: string };

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

/**
 * Envia o evento para o dataLayer (GTM/GA4) se existir, e sempre loga no
 * console em dev. Sem pixel nenhum instalado ainda — plugue o GTM/GA4 e os
 * eventos já vão fluir, sem tocar nos componentes que chamam trackEvent.
 */
export function trackEvent(event: AnalyticsEvent) {
  if (typeof window === "undefined") return;

  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event: event.name, ...event });

  if (process.env.NODE_ENV !== "production") {
    console.debug("[analytics]", event);
  }
}
