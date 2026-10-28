interface SpecsProps {
  areaM2: number;
  bedrooms: number;
  bathrooms: number;
  vagas: number;
  andar: number | null;
  mobiliado: boolean;
  aceitaPet: boolean;
}

export function PropertySpecs({ property }: { property: SpecsProps }) {
  const items = [
    { label: "Área", value: `${property.areaM2}m²` },
    { label: "Quartos", value: property.bedrooms },
    { label: "Banheiros", value: property.bathrooms },
    { label: "Vagas", value: property.vagas },
    ...(property.andar != null ? [{ label: "Andar", value: property.andar }] : []),
    { label: "Mobiliado", value: property.mobiliado ? "Sim" : "Não" },
    { label: "Aceita pet", value: property.aceitaPet ? "Sim" : "Não" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {items.map((item) => (
        <div key={item.label} className="border border-carvao/10 rounded-lg p-3 text-center">
          <p className="font-utility tabular-nums text-lg font-bold text-carvao">
            {item.value}
          </p>
          <p className="text-xs text-grafite mt-0.5">{item.label}</p>
        </div>
      ))}
    </div>
  );
}
