import fs from "node:fs";
import path from "node:path";
import axios from "axios";
import * as cheerio from "cheerio";
import type { Property } from "../src/types/property";

const DISCOUNT_PERCENT = 35;
const OUTPUT_PATH = path.resolve(process.cwd(), "src/data/mock-properties.json");

function sanitizeText(text: string): string {
  return text
    .replace(/[\r\n\t]+/g, " ")
    .replace(/\s{2,}/g, " ")
    .replace(/[^\w\s.,;:!?()\-\/àáâãéêíóôõúçÀÁÂÃÉÊÍÓÔÕÚÇ]/g, "")
    .trim();
}

function parsePrice(value: string): number {
  const numeric = value.replace(/[^\d,\.]/g, "").replace(/\./g, "").replace(",", ".");
  const parsed = parseFloat(numeric);
  return Number.isFinite(parsed) ? parsed : 0;
}

function applyDiscount(originalPrice: number) {
  const displayPrice = Math.round(originalPrice * (1 - DISCOUNT_PERCENT / 100));
  return {
    originalPrice,
    discountPercent: DISCOUNT_PERCENT,
    displayPrice,
  };
}

const FALLBACK_PROPERTIES: Property[] = [
  {
    id: "mock-001",
    purpose: "rent",
    title: "Apartamento de Alto Padrão no Centro",
    description:
      "Lindo apartamento reformado com acabamento premium, vista panorâmica da cidade, cozinha planejada em granito preto, sala ampla com varanda gourmet integrada e iluminação natural abundante. Condomínio conta com piscina aquecida, academia completa, salão de festas e portaria 24h.",
    location: { neighborhood: "Centro", city: "São Paulo", state: "SP" },
    specs: { areaM2: 145, bedrooms: 3, suites: 2, parkingSpots: 2 },
    images: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
    ],
    pricing: applyDiscount(1250000),
    createdAt: new Date().toISOString(),
  },
  {
    id: "mock-002",
    purpose: "rent",
    title: "Casa Térrea com Jardim Privativo",
    description:
      "Casa térrea espaçosa em bairro residencial tranquilo, ideal para famílias. Possui quintal amplo com jardim privativo, churrasqueira coberta, três dormitórios sendo uma suíte master com closet, cozinha americana e lavanderia separada. Rua arborizada e próxima a escolas e mercados.",
    location: { neighborhood: "Jardins", city: "Campinas", state: "SP" },
    specs: { areaM2: 210, bedrooms: 3, suites: 1, parkingSpots: 3 },
    images: [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?auto=format&fit=crop&w=1200&q=80",
    ],
    pricing: applyDiscount(890000),
    createdAt: new Date().toISOString(),
  },
  {
    id: "mock-003",
    purpose: "rent",
    title: "Studio Moderno Próximo ao Metrô",
    description:
      "Studio compacto e funcional entregue mobiliado com design contemporâneo. Excelente localização a 200 metros da estação de metrô, rodeado de cafés, restaurantes e serviços. Perfeito para investidores ou profissionais que buscam praticidade no dia a dia urbano.",
    location: { neighborhood: "Pinheiros", city: "São Paulo", state: "SP" },
    specs: { areaM2: 38, bedrooms: 1, suites: 1, parkingSpots: 0 },
    images: [
      "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
    ],
    pricing: applyDiscount(485000),
    createdAt: new Date().toISOString(),
  },
  {
    id: "mock-004",
    purpose: "rent",
    title: "Sobrado Reformado com Terraço Gourmet",
    description:
      "Sobrado totalmente reformado com arquitetura moderna, terraço gourmet envidraçado, piso porcelanato acetinado, escada em mármore branco e sistema de aquecimento solar. Garagem para dois carros com portão automatizado e espaço para home office no pavimento superior.",
    location: { neighborhood: "Mooca", city: "São Paulo", state: "SP" },
    specs: { areaM2: 180, bedrooms: 4, suites: 2, parkingSpots: 2 },
    images: [
      "https://images.unsplash.com/photo-1600596542815-27b88e31e140?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
    ],
    pricing: applyDiscount(1100000),
    createdAt: new Date().toISOString(),
  },
  {
    id: "mock-005",
    purpose: "rent",
    title: "Cobertura Duplex com Vista Mar",
    description:
      "Cobertura duplex espetacular com vista definitiva para o mar, terraço privativo com jacuzzi, sala dupla com pé direito alto e lareira. Acabamentos em madeira nobre, automação residencial completa e quatro vagas de garagem demarcadas. Oportunidade rara no litoral.",
    location: { neighborhood: "Praia do Forte", city: "Florianópolis", state: "SC" },
    specs: { areaM2: 320, bedrooms: 4, suites: 4, parkingSpots: 4 },
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80",
    ],
    pricing: applyDiscount(2800000),
    createdAt: new Date().toISOString(),
  },
  {
    id: "mock-006",
    purpose: "rent",
    title: "Galpão Industrial Logístico",
    description:
      "Galpão industrial com pé direito de 12 metros, piso reforçado para empilhadeiras, docas niveladoras e área administrativa climatizada. Localização estratégica próxima às principais rodovias, zoneamento industrial aprovado e segurança patrimonial terceirizada inclusa.",
    location: { neighborhood: "Distrito Industrial", city: "Guarulhos", state: "SP" },
    specs: { areaM2: 1200, bedrooms: 0, suites: 0, parkingSpots: 10 },
    images: [
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1565619624098-e65980107b2e?auto=format&fit=crop&w=1200&q=80",
    ],
    pricing: applyDiscount(3500000),
    createdAt: new Date().toISOString(),
  },
];

async function scrapeFromUrl(url: string): Promise<Property[]> {
  console.log(`🔍 Buscando imóveis em: ${url}`);
  try {
    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      timeout: 15000,
    });

    const $ = cheerio.load(response.data);
    const properties: Property[] = [];

    // Seletor genérico adaptável — ajuste conforme o portal alvo
    $(".listing-item, .card-imovel, .property-card").each((index, element) => {
      const el = $(element);
      const title = sanitizeText(el.find("h1, h2, h3, .title").first().text()) || "Imóvel sem título";
      const description = sanitizeText(el.find(".description, .descricao, p").first().text()) || "Descrição não disponível.";
      const priceRaw = el.find(".price, .valor, [data-price]").first().text() || "0";
      const originalPrice = parsePrice(priceRaw);

      const images: string[] = [];
      el.find("img[src], img[data-src]").each((_, img) => {
        const src = ($(img).attr("src") || $(img).attr("data-src") || "").trim();
        if (src && !src.includes("placeholder")) images.push(src);
      });

      properties.push({
        id: `scraped-${Date.now()}-${index}`,
        purpose: "rent",
        title,
        description,
        location: { neighborhood: "Centro", city: "São Paulo", state: "SP" },
        specs: { areaM2: 100, bedrooms: 2, suites: 1, parkingSpots: 1 },
        images: images.length > 0 ? images : FALLBACK_PROPERTIES[0].images,
        pricing: applyDiscount(originalPrice || 500000),
        createdAt: new Date().toISOString(),
      });
    });

    return properties;
  } catch (error) {
    console.error("❌ Erro ao fazer scraping:", error instanceof Error ? error.message : error);
    return [];
  }
}

async function main() {
  const targetUrl = process.argv[2];
  let properties: Property[] = [];

  if (targetUrl) {
    properties = await scrapeFromUrl(targetUrl);
  }

  if (properties.length === 0) {
    console.log("⚠️ Nenhum imóvel extraído. Usando dados de fallback locais.");
    properties = FALLBACK_PROPERTIES;
  }

  const outputDir = path.dirname(OUTPUT_PATH);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(properties, null, 2), "utf-8");
  console.log(`✅ ${properties.length} imóveis salvos em: ${OUTPUT_PATH}`);
}

main().catch((err) => {
  console.error("💥 Falha crítica na execução:", err);
  process.exit(1);
});