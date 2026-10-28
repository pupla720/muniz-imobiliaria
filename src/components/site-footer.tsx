import { getBusinessSettings } from "@/lib/business-settings";

export async function SiteFooter() {
  const business = await getBusinessSettings();

  const hasStreet = business.addressStreet.trim().length > 0;
  const mapQuery = hasStreet
    ? `${business.addressStreet}, ${business.addressNeighborhood}, ${business.addressCity} - ${business.addressState}`
    : `${business.addressCity}, ${business.addressState}`;

  return (
    <footer className="bg-anil text-cal-claro">
      <div className="mx-auto max-w-6xl px-7 py-16 grid grid-cols-1 sm:grid-cols-2 gap-12">
        <div>
          <p className="font-display text-2xl font-semibold tracking-[0.05em]">
            {business.name}
          </p>
          <p className="font-utility text-xs uppercase tracking-[0.22em] text-latao-claro mt-2">
            CRECI {business.creci}
          </p>

          <div className="mt-6 text-sm text-[#cfe0dd] font-light space-y-1.5">
            {hasStreet ? (
              <>
                <p>{business.addressStreet}</p>
                <p>
                  {business.addressNeighborhood} · {business.addressCity}/
                  {business.addressState}
                  {business.addressZip ? ` · ${business.addressZip}` : ""}
                </p>
              </>
            ) : (
              <p className="text-[#9db2ae]">
                Endereço em {business.addressCity}/{business.addressState} — em
                breve, endereço completo aqui.
              </p>
            )}
            {business.hours && (
              <p className="text-[#9db2ae] text-xs">{business.hours}</p>
            )}
          </div>

          <a
            href={`tel:+${business.whatsapp}`}
            className="inline-block mt-6 text-sm font-light border-b border-latao-claro/50 pb-0.5 hover:border-latao-claro transition-colors"
          >
            {business.phoneDisplay}
          </a>

          {(business.instagramUrl || business.facebookUrl) && (
            <div className="flex gap-5 mt-4 font-utility text-xs uppercase tracking-[0.16em]">
              {business.instagramUrl && (
                <a
                  href={business.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-latao-claro hover:text-cal-claro transition-colors"
                >
                  Instagram
                </a>
              )}
              {business.facebookUrl && (
                <a
                  href={business.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-latao-claro hover:text-cal-claro transition-colors"
                >
                  Facebook
                </a>
              )}
            </div>
          )}
        </div>

        <div>
          <p className="font-utility text-xs uppercase tracking-[0.22em] text-latao-claro mb-3">
            Onde estamos
          </p>
          <div className="overflow-hidden border border-white/15" style={{ height: 220 }}>
            <iframe
              title={`Mapa — ${business.addressCity}/${business.addressState}`}
              src={`https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>

      <div className="border-t border-white/12">
        <div className="mx-auto max-w-6xl px-7 py-5 font-utility text-[11px] uppercase tracking-[0.14em] text-[#9db2ae] flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {new Date().getFullYear()} {business.name} · CRECI {business.creci}
          </span>
          <nav className="flex flex-wrap gap-5">
            <a href="/politica-de-privacidade" className="hover:text-cal-claro transition-colors">
              Política de privacidade
            </a>
            <a href="/termos" className="hover:text-cal-claro transition-colors">
              Termos de uso
            </a>
            <a href="/ouvidoria" className="hover:text-cal-claro transition-colors">
              Ouvidoria
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
