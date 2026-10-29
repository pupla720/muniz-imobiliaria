import Link from "next/link";
import Image from "next/image";
import type { PropertyStatus, PropertyType } from "@/generated/prisma/enums";
import { PlaceholderPhoto } from "@/components/placeholder-photo";
import { formatBRL } from "@/lib/format";

export interface PropertyCardData {
  codigo: string;
  status: PropertyStatus;
  type: PropertyType;
  modalidade?: "MENSAL" | "TEMPORADA";
  title: string;
  bairro: string;
  bedrooms: number;
  bathrooms: number;
  areaM2: number;
  vagas: number;
  priceMonthly: number;
  priceDaily?: number;
  condominio: number;
  iptu: number;
  depositAmount: number;
  photos: string; // JSON-encoded array
}

const statusLabels: Record<PropertyStatus, string> = {
  DISPONIVEL: "Oportunidade selecionada",
  RESERVADO: "Reservado",
  ALUGADO: "Indisponível",
};

export function PropertyCard({ property }: { property: PropertyCardData }) {
  const photos = JSON.parse(property.photos) as string[];
  const cover = photos[0];
  const disponivel = property.status === "DISPONIVEL";

  return (
    <Link
      href={`/imoveis/${property.codigo}`}
      className="group flex flex-col bg-cal-claro border border-carvao/12 rounded-md overflow-hidden transition-shadow duration-300 ease-out hover:shadow-[0_30px_60px_-34px_rgba(14,46,43,0.5)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-latao"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-anil">
        {cover ? (
          <Image
            src={cover}
            alt={property.title}
            fill
            sizes="(max-width: 620px) 100vw, (max-width: 960px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <PlaceholderPhoto className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-[1.04]" />
        )}
        <span className="absolute top-4 left-4 font-utility text-[11px] uppercase tracking-[0.24em] text-latao-claro">
          {property.codigo}
        </span>
        <span
          className={`absolute top-4 right-4 font-utility text-[10px] uppercase tracking-[0.16em] px-2.5 py-1 rounded-sm border border-latao-claro ${
            disponivel ? "text-cal-claro bg-anil/40 backdrop-blur-sm" : "text-latao-claro"
          }`}
        >
          {statusLabels[property.status]}
        </span>
      </div>

      <div className="p-6">
        <p className="font-utility text-xs uppercase tracking-[0.2em] text-latao">
          {property.bairro}
        </p>
        <h3 className="font-display font-medium text-2xl leading-tight tracking-tight mt-2.5 text-carvao group-hover:text-anil transition-colors">
          {property.title}
        </h3>
        <p className="text-grafite font-light text-sm mt-3">
          {property.bedrooms} quartos&nbsp;&nbsp;·&nbsp;&nbsp;{property.bathrooms} banheiros
          &nbsp;&nbsp;·&nbsp;&nbsp;{property.vagas} vagas&nbsp;&nbsp;·&nbsp;&nbsp;{property.areaM2} m²
        </p>

        <div className="h-px bg-carvao/12 my-5" />

        {property.modalidade === "TEMPORADA" && property.priceDaily ? (
          <p className="font-utility text-[13px] uppercase tracking-[0.12em] text-anil">
            {formatBRL(property.priceDaily)}{" "}
            <span className="text-grafite text-[11px]">/ diária</span>
          </p>
        ) : (
          <p className="font-utility text-[11px] uppercase tracking-[0.18em] text-grafite">
            Disponibilidade sob consulta exclusiva
          </p>
        )}
        <span className="mt-4 inline-flex items-center font-utility text-[13px] uppercase tracking-[0.12em] text-anil border-b border-latao pb-1 group-hover:text-latao transition-colors">
          Ver detalhes &amp; dossiê
        </span>
      </div>
    </Link>
  );
}
