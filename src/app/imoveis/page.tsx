"use client";

import { useState, useMemo } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { PropertyCard } from "@/components/PropertyCard";
import propertiesData from "@/data/mock-properties.json";
import type { Property } from "@/types/property";

const properties = propertiesData as Property[];

export default function ImoveisPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string>("all");
  const [minArea, setMinArea] = useState<number>(0);
  const [maxArea, setMaxArea] = useState<number>(99999);

  const neighborhoods = useMemo(() => {
    const unique = new Set(properties.map((p) => p.location.neighborhood));
    return Array.from(unique).sort();
  }, []);

  const filteredProperties = useMemo(() => {
    return properties.filter((property) => {
      const matchesSearch =
        searchTerm === "" ||
        property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.location.city.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesNeighborhood =
        selectedNeighborhood === "all" ||
        property.location.neighborhood === selectedNeighborhood;

      const matchesArea =
        property.specs.areaM2 >= minArea && property.specs.areaM2 <= maxArea;

      return matchesSearch && matchesNeighborhood && matchesArea;
    });
  }, [searchTerm, selectedNeighborhood, minArea, maxArea]);

  return (
    <main className="min-h-screen bg-neutral-50 pb-20">
      <div className="border-b border-neutral-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
            Imóveis para Locação
          </h1>
          <p className="mt-3 text-lg text-neutral-600">
            Oportunidades exclusivas com condição especial de lançamento (simulação -35%).
          </p>
        </div>
      </div>

      <div className="sticky top-0 z-30 border-b border-neutral-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative max-w-md flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Buscar por nome, cidade..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-neutral-200 bg-neutral-50 py-2.5 pl-10 pr-4 text-sm outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <SlidersHorizontal className="hidden h-4 w-4 text-neutral-400 sm:block" />
              <select
                value={selectedNeighborhood}
                onChange={(e) => setSelectedNeighborhood(e.target.value)}
                className="rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              >
                <option value="all">Todos os Bairros</option>
                {neighborhoods.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>

              <div className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2.5">
                <span className="whitespace-nowrap text-xs font-medium text-neutral-500">
                  Área (m²):
                </span>
                <input
                  type="number"
                  placeholder="Min"
                  min={0}
                  value={minArea || ""}
                  onChange={(e) => setMinArea(Number(e.target.value) || 0)}
                  className="w-16 bg-transparent text-sm outline-none placeholder:text-neutral-300"
                />
                <span className="text-neutral-300">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  min={0}
                  value={maxArea === 99999 ? "" : maxArea}
                  onChange={(e) => setMaxArea(Number(e.target.value) || 99999)}
                  className="w-16 bg-transparent text-sm outline-none placeholder:text-neutral-300"
                />
              </div>
            </div>
          </div>

          <div className="mt-3 text-xs font-medium text-neutral-500">
            {filteredProperties.length}{" "}
            {filteredProperties.length === 1 ? "imóvel encontrado" : "imóveis encontrados"}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-300 py-20 text-center">
            <Search className="mb-4 h-12 w-12 text-neutral-300" />
            <h3 className="text-lg font-medium text-neutral-900">Nenhum imóvel encontrado</h3>
            <p className="mt-1 text-sm text-neutral-500">
              Tente ajustar os filtros ou buscar por outros termos.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedNeighborhood("all");
                setMinArea(0);
                setMaxArea(99999);
              }}
              className="mt-4 text-sm font-medium text-emerald-600 hover:text-emerald-700 hover:underline"
            >
              Limpar todos os filtros
            </button>
          </div>
        )}
      </div>
    </main>
  );
}