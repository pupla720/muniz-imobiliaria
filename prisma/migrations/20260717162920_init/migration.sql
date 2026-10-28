-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'RENTER');

-- CreateEnum
CREATE TYPE "PropertyType" AS ENUM ('CASA', 'APARTAMENTO');

-- CreateEnum
CREATE TYPE "PropertyStatus" AS ENUM ('DISPONIVEL', 'RESERVADO', 'ALUGADO');

-- CreateEnum
CREATE TYPE "ReservationStatus" AS ENUM ('PENDING_PAYMENT', 'PAYMENT_CONFIRMED', 'CONTRACT_SIGNED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'REFUNDED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT,
    "cpf" TEXT,
    "phone" TEXT,
    "role" "Role" NOT NULL DEFAULT 'RENTER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Property" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "type" "PropertyType" NOT NULL DEFAULT 'CASA',
    "status" "PropertyStatus" NOT NULL DEFAULT 'DISPONIVEL',
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "bairro" TEXT NOT NULL,
    "city" TEXT NOT NULL DEFAULT 'Aracaju',
    "state" TEXT NOT NULL DEFAULT 'SE',
    "priceMonthly" DOUBLE PRECISION NOT NULL,
    "condominio" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "iptu" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "depositAmount" DOUBLE PRECISION NOT NULL DEFAULT 300,
    "bedrooms" INTEGER NOT NULL,
    "bathrooms" INTEGER NOT NULL,
    "vagas" INTEGER NOT NULL DEFAULT 0,
    "areaM2" DOUBLE PRECISION NOT NULL,
    "andar" INTEGER,
    "mobiliado" BOOLEAN NOT NULL DEFAULT false,
    "aceitaPet" BOOLEAN NOT NULL DEFAULT false,
    "photos" TEXT NOT NULL,
    "floorPlanUrl" TEXT,
    "brokerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Property_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Broker" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "creci" TEXT NOT NULL,
    "photoUrl" TEXT NOT NULL,
    "whatsapp" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Broker_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Testimonial" (
    "id" TEXT NOT NULL,
    "authorName" TEXT NOT NULL,
    "photoUrl" TEXT,
    "propertyCode" TEXT,
    "quote" TEXT NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Testimonial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reservation" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "renterId" TEXT NOT NULL,
    "status" "ReservationStatus" NOT NULL DEFAULT 'PENDING_PAYMENT',
    "depositAmount" DOUBLE PRECISION NOT NULL DEFAULT 300,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reservation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "reservationId" TEXT NOT NULL,
    "provider" TEXT NOT NULL DEFAULT 'mercadopago',
    "providerPaymentId" TEXT,
    "preferenceId" TEXT,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "amount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contract" (
    "id" TEXT NOT NULL,
    "reservationId" TEXT NOT NULL,
    "pdfPath" TEXT,
    "signerName" TEXT,
    "signerCpf" TEXT,
    "signerIp" TEXT,
    "documentHash" TEXT,
    "signedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Contract_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BusinessSettings" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "name" TEXT NOT NULL DEFAULT 'Muniz Imobiliária',
    "creci" TEXT NOT NULL DEFAULT '0000PJ',
    "whatsapp" TEXT NOT NULL DEFAULT '5579999999999',
    "phoneDisplay" TEXT NOT NULL DEFAULT '(79) 99999-9999',
    "addressStreet" TEXT NOT NULL DEFAULT '',
    "addressNeighborhood" TEXT NOT NULL DEFAULT '',
    "addressCity" TEXT NOT NULL DEFAULT 'Aracaju',
    "addressState" TEXT NOT NULL DEFAULT 'SE',
    "addressZip" TEXT NOT NULL DEFAULT '',
    "hours" TEXT NOT NULL DEFAULT '',
    "instagramUrl" TEXT,
    "facebookUrl" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BusinessSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContractTemplate" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "landlordName" TEXT NOT NULL DEFAULT 'Muniz Imobiliária',
    "rentDueDay" INTEGER NOT NULL DEFAULT 5,
    "termsText" TEXT NOT NULL DEFAULT 'As demais condições deste contrato (prazo de vigência, reajuste, responsabilidade por encargos, condições de rescisão e demais cláusulas) deverão ser definidas e revisadas conforme a legislação vigente (Lei do Inquilinato — Lei nº 8.245/1991) e a política da imobiliária.',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContractTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Property_codigo_key" ON "Property"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_reservationId_key" ON "Payment"("reservationId");

-- CreateIndex
CREATE UNIQUE INDEX "Contract_reservationId_key" ON "Contract"("reservationId");

-- AddForeignKey
ALTER TABLE "Property" ADD CONSTRAINT "Property_brokerId_fkey" FOREIGN KEY ("brokerId") REFERENCES "Broker"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_renterId_fkey" FOREIGN KEY ("renterId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "Reservation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "Reservation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
