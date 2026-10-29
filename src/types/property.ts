export interface PropertyLocation {
  neighborhood: string;
  city: string;
  state: string;
}

export interface PropertySpecs {
  areaM2: number;
  bedrooms: number;
  suites: number;
  parkingSpots: number;
}

export interface PropertyPricing {
  /** Valor de referência de mercado (mensal) usado como base de comparação */
  originalPrice: number;
  /** Percentual fixo de desconto aplicado na simulação visual (35%) */
  discountPercent: number;
  /** Valor mensal exibido no card após o desconto */
  displayPrice: number;
  /** Condomínio mensal (quando aplicável) */
  condoFee?: number;
  /** IPTU mensal (quando aplicável) */
  iptuMonthly?: number;
}

export type PropertyPurpose = "rent" | "sale";

export interface Property {
  id: string;
  title: string;
  description: string;
  purpose: PropertyPurpose;
  location: PropertyLocation;
  specs: PropertySpecs;
  images: string[];
  pricing: PropertyPricing;
  createdAt: string;
}