import Link from "next/link";
import { Maximize2, BedDouble, Car, MapPin } from "lucide-react";
import type { Property } from "@/types/property";

interface PropertyCardProps {
  property: Property;
}

const brl = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value);

export function PropertyCard({ property }: PropertyCardProps) {
  const isRent = property.purpose === "rent";

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      {/* Imagem — usando <img> nativo para evitar bloqueio de hostname do next/image */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-100">
        {property.images.length > 0 ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={property.images[0]}
            alt={property.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-neutral-400">
            <Maximize2 className="h-10 w-10" />
          </div>
        )}

        {property.images.length > 1 && (
          <div className="absolute bottom-3 right-3 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
            1/{property.images.length}
          </div>
        )}

        <div className="absolute left-3 top-3 flex gap-2">
          <span className="rounded-md bg-emerald-600 px-2 py-1 text-xs font-bold text-white shadow-sm">
            -{property.pricing.discountPercent}%
          </span>
          {isRent && (
            <span className="rounded-md bg-white/90 px-2 py-1 text-xs font-semibold text-neutral-700 shadow-sm">
              Aluguel
            </span>
          )}
        </div>
      </div>

      {/* Conteúdo */}
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex items-start gap-1 text-xs text-neutral-500">
          <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span className="truncate">
            {property.location.neighborhood}, {property.location.city} - {property.location.state}
          </span>
        </div>

        <h3 className="mb-2 line-clamp-2 text-lg font-semibold leading-tight text-neutral-900 transition-colors group-hover:text-emerald-700">
          {property.title}
        </h3>

        <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-neutral-600">
          {property.description}
        </p>

        {/* Specs */}
        <div className="mb-4 flex flex-wrap gap-3 border-t border-neutral-100 pt-3 text-xs font-medium text-neutral-600">
          <div className="flex items-center gap-1.5">
            <Maximize2 className="h-3.5 w-3.5 text-neutral-400" />
            <span>{property.specs.areaM2} m²</span>
          </div>
          {property.specs.bedrooms > 0 && (
            <div className="flex items-center gap-1.5">
              <BedDouble className="h-3.5 w-3.5 text-neutral-400" />
              <span>{property.specs.bedrooms} Quartos</span>
            </div>
          )}
          {property.specs.parkingSpots > 0 && (
            <div className="flex items-center gap-1.5">
              <Car className="h-3.5 w-3.5 text-neutral-400" />
              <span>{property.specs.parkingSpots} Vagas</span>
            </div>
          )}
        </div>

        {/* Preço */}
        <div className="mt-auto space-y-1">
          <div className="text-xs text-neutral-400 line-through">
            De {brl(property.pricing.originalPrice)}
            {isRent ? "/mês" : ""}
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-emerald-700">
              {brl(property.pricing.displayPrice)}
            </span>
            {isRent && (
              <span className="text-sm font-medium text-neutral-500">/mês</span>
            )}
          </div>
          {(property.pricing.condoFee || property.pricing.iptuMonthly) && (
            <div className="text-[11px] text-neutral-400">
              {property.pricing.condoFee ? `+ Cond. ${brl(property.pricing.condoFee)}` : ""}
              {property.pricing.condoFee && property.pricing.iptuMonthly ? " · " : ""}
              {property.pricing.iptuMonthly ? `IPTU ${brl(property.pricing.iptuMonthly)}/mês` : ""}
            </div>
          )}
        </div>

        {/* CTA */}
        <Link
          href={`/imoveis/${property.id}`}
          className="mt-4 block w-full rounded-lg border border-neutral-200 bg-neutral-50 py-2.5 text-center text-sm font-medium text-neutral-700 transition-colors hover:border-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
        >
          Ver Detalhes
        </Link>
      </div>
    </div>
  );
}