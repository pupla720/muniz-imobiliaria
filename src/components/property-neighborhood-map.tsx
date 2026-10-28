export function PropertyNeighborhoodMap({
  bairro,
  city,
  state,
}: {
  bairro: string;
  city: string;
  state: string;
}) {
  const query = encodeURIComponent(`${bairro}, ${city} - ${state}`);

  return (
    <div>
      <h2 className="font-display text-xl font-semibold text-carvao mb-3">
        Localização — {bairro}
      </h2>
      {/* TODO: quando tivermos o endereço exato do imóvel, trocar o q= por
          ele. Por ora, centraliza no bairro. */}
      <div className="rounded-xl overflow-hidden border border-carvao/10" style={{ height: 260 }}>
        <iframe
          title={`Mapa — ${bairro}, ${city}`}
          src={`https://www.google.com/maps?q=${query}&output=embed`}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  );
}
