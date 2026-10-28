import { cache } from "react";
import { prisma } from "@/lib/prisma";

export const getBusinessSettings = cache(async () => {
  return prisma.businessSettings.upsert({
    where: { id: "default" },
    update: {},
    create: { id: "default" },
  });
});

export type BusinessSettings = Awaited<ReturnType<typeof getBusinessSettings>>;
