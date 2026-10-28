import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

// Placeholder — trocar pelo WhatsApp real dos corretores em /admin.
const CENTRAL_WHATSAPP = "5579999999999";

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
    update: {},
    create: {
      id: "default",
      name: "Muniz Imobiliária",
      // Placeholders — editar os dados reais da empresa em /admin/empresa.
      creci: "0000PJ",
      whatsapp: "5579999999999",
      phoneDisplay: "(79) 99999-9999",
      addressCity: "Aracaju",
      addressState: "SE",
      // TODO: endereço, horário e redes sociais reais — editar em /admin/empresa.
    },
  });

  // Corretores reais, fotos em /public/corretores.
  // TODO: confirmar se cada corretor tem WhatsApp individual ou se todos usam
  // o número central da imobiliária (por ora, usando o central pra todos).
  const [alan, alessandra, diogo] = await Promise.all([
    prisma.broker.upsert({
      where: { id: "broker-alan-cabral" },
      update: {},
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
      update: {},
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
      update: {},
      create: {
        id: "broker-diogo-almeida",
        name: "Diogo Breda Frota De Almeida",
        creci: "8321",
        photoUrl: "/corretores/diogo-almeida.jpg",
        whatsapp: CENTRAL_WHATSAPP,
      },
    }),
  ]);

  // Imóveis de exemplo em bairros reais de Aracaju/SE.
  // TODO: fotos reais de cada imóvel — por ora `photos` fica vazio e a
  // interface mostra um placeholder marcado, nunca banco de imagens.
  const properties = [
    {
      codigo: "AJU-0101",
      type: "APARTAMENTO" as const,
      status: "DISPONIVEL" as const,
      title: "Apartamento 2 quartos no Jardins",
      description:
        "Apartamento andar alto, bem iluminado, a 5 minutos do Shopping Jardins. Prédio com portaria 24h.",
      address: "Rua Campos Sales, próx. ao Shopping Jardins",
      bairro: "Jardins",
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
      codigo: "AJU-0102",
      type: "CASA" as const,
      status: "DISPONIVEL" as const,
      title: "Casa 3 quartos na Coroa do Meirinho",
      description:
        "Casa térrea com quintal, garagem coberta para 2 carros e área de serviço externa.",
      address: "Rua Itabaiana, Coroa do Meirinho",
      bairro: "Coroa do Meirinho",
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
      codigo: "AJU-0103",
      type: "APARTAMENTO" as const,
      status: "RESERVADO" as const,
      title: "Apartamento 3 quartos na Atalaia",
      description:
        "A 400m da orla da Atalaia, suíte + 2 quartos, varanda gourmet. Condomínio com piscina.",
      address: "Av. Santos Dumont, Atalaia",
      bairro: "Atalaia",
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
      codigo: "AJU-0104",
      type: "CASA" as const,
      status: "DISPONIVEL" as const,
      title: "Casa 2 quartos na Farolândia",
      description: "Casa compacta, recém-reformada, próxima à UFS. Ideal para universitários.",
      address: "Rua Vereador José do Prado Franco, Farolândia",
      bairro: "Farolândia",
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
      codigo: "AJU-0105",
      type: "APARTAMENTO" as const,
      status: "DISPONIVEL" as const,
      title: "Apartamento 1 quarto no Grageru",
      description: "Studio funcional, próximo ao Shopping Jardins e Riomar. Ótimo para quem mora só.",
      address: "Av. Ministro Geraldo Barreto Sobral, Grageru",
      bairro: "Grageru",
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
      codigo: "AJU-0106",
      type: "CASA" as const,
      status: "ALUGADO" as const,
      title: "Casa 4 quartos na Luzia",
      description: "Casa duplex, 4 quartos sendo 1 suíte, quintal amplo com churrasqueira.",
      address: "Rua Itabaianinha, Luzia",
      bairro: "Luzia",
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
      codigo: "AJU-0107",
      type: "APARTAMENTO" as const,
      status: "DISPONIVEL" as const,
      title: "Apartamento 2 quartos no Salgado Filho",
      description: "Próximo ao Terminal de Ônibus e ao Mercado Municipal. Bom para quem usa transporte público.",
      address: "Av. Perimetral, Salgado Filho",
      bairro: "Salgado Filho",
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
      codigo: "AJU-0108",
      type: "CASA" as const,
      status: "DISPONIVEL" as const,
      title: "Casa 3 quartos no Aeroporto",
      description: "Casa em condomínio fechado, com portaria e área de lazer compartilhada.",
      address: "Rua Prof. José Silvério Leite Fontes, Aeroporto",
      bairro: "Aeroporto",
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
