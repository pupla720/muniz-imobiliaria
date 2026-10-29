-- CreateEnum
CREATE TYPE "RentalModalidade" AS ENUM ('MENSAL', 'TEMPORADA');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "PropertyType" ADD VALUE 'CHACARA';
ALTER TYPE "PropertyType" ADD VALUE 'SITIO';
ALTER TYPE "PropertyType" ADD VALUE 'CASA_PRAIA';

-- AlterTable
ALTER TABLE "Property" ADD COLUMN     "modalidade" "RentalModalidade" NOT NULL DEFAULT 'MENSAL',
ADD COLUMN     "priceDaily" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "priceWeekend" DOUBLE PRECISION NOT NULL DEFAULT 0,
ALTER COLUMN "priceMonthly" SET DEFAULT 0;

