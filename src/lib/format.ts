export function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function totalMensal(property: {
  priceMonthly: number;
  condominio: number;
  iptu: number;
}) {
  return property.priceMonthly + property.condominio + property.iptu;
}
