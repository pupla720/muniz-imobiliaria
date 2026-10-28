import { prisma } from "@/lib/prisma";

export async function getContractTemplate() {
  return prisma.contractTemplate.upsert({
    where: { id: "default" },
    update: {},
    create: { id: "default" },
  });
}
