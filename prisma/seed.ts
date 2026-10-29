import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

// Placeholder — trocar pelo WhatsApp real em /admin. DDD 75 (Feira de Santana/BA).
const CENTRAL_WHATSAPP = "5575999999999";

async function main() {
  const adminPasswordHash = await bcrypt.hash("admin123", 10);

  await prisma.user.upsert({
    where: { email: "admin@munizimoveis.com" },
    update: {},
    create: {
      name: "Administrador",
      email: "admin@munizimoveis.com",
      passwordHash: adminPasswordHash,
      role: "ADMIN",
    },
  });

  await prisma.businessSettings.upsert({
    where: { id: "default" },
    update: {
      addressCity: "Feira de Santana",
      addressState: "BA",
      whatsapp: CENTRAL_WHATSAPP,
      phoneDisplay: "(75) 99999-9999",
    },
    create: {
      id: "default",
      name: "Muniz Imobiliária",
      // Placeholders — editar os dados reais da empresa em /admin/empresa.
      creci: "0000PJ",
      whatsapp: CENTRAL_WHATSAPP,
      phoneDisplay: "(75) 99999-9999",
      addressCity: "Feira de Santana",
      addressState: "BA",
    },
  });

  // Corretores de exemplo, fotos em /public/corretores.
  const [alan, alessandra, diogo] = await Promise.all([
    prisma.broker.upsert({
      where: { id: "broker-alan-cabral" },
      update: { whatsapp: CENTRAL_WHATSAPP },
      create: {
        id: "broker-alan-cabral",
        name: "Alan Cabral",
        creci: "3798",
        photoUrl: "/corretores/alan-cabral.jpg",
        whatsapp: CENTRAL_WHATSAPP,
      },
    }),
    prisma.broker.upsert({
      where: { id: "broker-alessandra-alves" },
      update: { whatsapp: CENTRAL_WHATSAPP },
      create: {
        id: "broker-alessandra-alves",
        name: "Alessandra Alves",
        creci: "10029",
        photoUrl: "/corretores/alessandra-alves.jpg",
        whatsapp: CENTRAL_WHATSAPP,
      },
    }),
    prisma.broker.upsert({
      where: { id: "broker-diogo-almeida" },
      update: { whatsapp: CENTRAL_WHATSAPP },
      create: {
        id: "broker-diogo-almeida",
        name: "Diogo Breda Frota De Almeida",
        creci: "8321",
        photoUrl: "/corretores/diogo-almeida.jpg",
        whatsapp: CENTRAL_WHATSAPP,
      },
    }),
  ]);

  // Remove os imóveis de exemplo antigos (Aracaju) antes de recriar, para não
  // deixar duplicado ao trocar a cidade.
  await prisma.property.deleteMany({ where: { codigo: { startsWith: "AJU-" } } });

  // Imóveis de exemplo em bairros reais de Feira de Santana/BA.
  const properties = [
    {
      codigo: "FSA-0101",
      type: "APARTAMENTO" as const,
      status: "DISPONIVEL" as const,
      title: "Apartamento 2 quartos no Ponto Central",
      description:
        "Apartamento bem iluminado, a poucos minutos do Shopping Boulevard. Prédio com portaria 24h.",
      address: "Av. Getúlio Vargas, próx. ao Shopping Boulevard",
      bairro: "Ponto Central",
      city: "Feira de Santana",
      state: "BA",
      priceMonthly: 1800,
      condominio: 350,
      iptu: 60,
      bedrooms: 2,
      bathrooms: 1,
      vagas: 1,
      areaM2: 65,
      andar: 6,
      mobiliado: false,
      aceitaPet: true,
      photos: JSON.stringify([]),
      brokerId: alan.id,
    },
    {
      codigo: "FSA-0102",
      type: "CASA" as const,
      status: "DISPONIVEL" as const,
      title: "Casa 3 quartos no Santa Mônica",
      description:
        "Casa térrea com quintal, garagem coberta para 2 carros e área de serviço externa.",
      address: "Rua da Gameleira, Santa Mônica",
      bairro: "Santa Mônica",
      city: "Feira de Santana",
      state: "BA",
      priceMonthly: 1600,
      condominio: 0,
      iptu: 45,
      bedrooms: 3,
      bathrooms: 2,
      vagas: 2,
      areaM2: 130,
      andar: null,
      mobiliado: false,
      aceitaPet: true,
      photos: JSON.stringify([]),
      brokerId: alessandra.id,
    },
    {
      codigo: "FSA-0103",
      type: "APARTAMENTO" as const,
      status: "RESERVADO" as const,
      title: "Apartamento 3 quartos no Capuchinhos",
      description:
        "Suíte + 2 quartos, varanda gourmet e condomínio com piscina, próximo à Av. Maria Quitéria.",
      address: "Av. Maria Quitéria, Capuchinhos",
      bairro: "Capuchinhos",
      city: "Feira de Santana",
      state: "BA",
      priceMonthly: 2600,
      condominio: 480,
      iptu: 95,
      bedrooms: 3,
      bathrooms: 2,
      vagas: 1,
      areaM2: 92,
      andar: 3,
      mobiliado: true,
      aceitaPet: false,
      photos: JSON.stringify([]),
      brokerId: diogo.id,
    },
    {
      codigo: "FSA-0104",
      type: "CASA" as const,
      status: "DISPONIVEL" as const,
      title: "Casa 2 quartos no Tomba",
      description:
        "Casa compacta, recém-reformada, próxima à UEFS. Ideal para universitários.",
      address: "Rua Juracy Magalhães, Tomba",
      bairro: "Tomba",
      city: "Feira de Santana",
      state: "BA",
      priceMonthly: 1100,
      condominio: 0,
      iptu: 30,
      bedrooms: 2,
      bathrooms: 1,
      vagas: 1,
      areaM2: 70,
      andar: null,
      mobiliado: false,
      aceitaPet: true,
      photos: JSON.stringify([]),
      brokerId: alan.id,
    },
    {
      codigo: "FSA-0105",
      type: "APARTAMENTO" as const,
      status: "DISPONIVEL" as const,
      title: "Apartamento 1 quarto no Centro",
      description:
        "Studio funcional, próximo ao Centro de Abastecimento e à Av. Senhor dos Passos. Ótimo para quem mora só.",
      address: "Av. Senhor dos Passos, Centro",
      bairro: "Centro",
      city: "Feira de Santana",
      state: "BA",
      priceMonthly: 1200,
      condominio: 280,
      iptu: 40,
      bedrooms: 1,
      bathrooms: 1,
      vagas: 1,
      areaM2: 42,
      andar: 8,
      mobiliado: true,
      aceitaPet: false,
      photos: JSON.stringify([]),
      brokerId: alessandra.id,
    },
    {
      codigo: "FSA-0106",
      type: "CASA" as const,
      status: "ALUGADO" as const,
      title: "Casa 4 quartos no SIM",
      description: "Casa duplex, 4 quartos sendo 1 suíte, quintal amplo com churrasqueira.",
      address: "Rua das Palmeiras, SIM",
      bairro: "SIM",
      city: "Feira de Santana",
      state: "BA",
      priceMonthly: 2200,
      condominio: 0,
      iptu: 70,
      bedrooms: 4,
      bathrooms: 3,
      vagas: 2,
      areaM2: 180,
      andar: null,
      mobiliado: false,
      aceitaPet: true,
      photos: JSON.stringify([]),
      brokerId: diogo.id,
    },
    {
      codigo: "FSA-0107",
      type: "APARTAMENTO" as const,
      status: "DISPONIVEL" as const,
      title: "Apartamento 2 quartos no Cidade Nova",
      description:
        "Próximo ao Terminal Rodoviário e a linhas de ônibus. Bom para quem usa transporte público.",
      address: "Av. Eduardo Fróes da Mota, Cidade Nova",
      bairro: "Cidade Nova",
      city: "Feira de Santana",
      state: "BA",
      priceMonthly: 950,
      condominio: 180,
      iptu: 25,
      bedrooms: 2,
      bathrooms: 1,
      vagas: 0,
      areaM2: 55,
      andar: 2,
      mobiliado: false,
      aceitaPet: true,
      photos: JSON.stringify([]),
      brokerId: alan.id,
    },
    {
      codigo: "FSA-0108",
      type: "CASA" as const,
      status: "DISPONIVEL" as const,
      title: "Casa 3 quartos no Brasília",
      description: "Casa em condomínio fechado, com portaria e área de lazer compartilhada.",
      address: "Rua Boa Esperança, Brasília",
      bairro: "Brasília",
      city: "Feira de Santana",
      state: "BA",
      priceMonthly: 1900,
      condominio: 220,
      iptu: 55,
      bedrooms: 3,
      bathrooms: 2,
      vagas: 2,
      areaM2: 110,
      andar: null,
      mobiliado: false,
      aceitaPet: true,
      photos: JSON.stringify([]),
      brokerId: alessandra.id,
    },
  ];

  for (const property of properties) {
    await prisma.property.upsert({
      where: { codigo: property.codigo },
      update: {},
      create: property,
    });
  }

  console.log("Seed concluído.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
