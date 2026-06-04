-- CreateEnum
CREATE TYPE "ComplexStatus" AS ENUM ('ACTIVE', 'TEMPORARILY_CLOSED', 'UNDER_RENOVATION', 'INACTIVE');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'TECHNICIAN', 'VIEWER');

-- CreateEnum
CREATE TYPE "InstallationCategory" AS ENUM ('DHW', 'HVAC', 'COOLING', 'VENTILATION', 'RENEWABLE');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'VIEWER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HotelComplex" (
    "id" SERIAL NOT NULL,
    "externalId" TEXT,
    "name" TEXT NOT NULL,
    "internalCode" TEXT NOT NULL,
    "hotelChain" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "province" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "rooms" INTEGER NOT NULL,
    "constructionYear" INTEGER,
    "lastRenovationYear" INTEGER,
    "status" "ComplexStatus" NOT NULL DEFAULT 'ACTIVE',
    "technicalManager" TEXT,
    "maintenanceManager" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HotelComplex_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TechnicalInstallation" (
    "id" SERIAL NOT NULL,
    "complexId" INTEGER NOT NULL,
    "category" "InstallationCategory" NOT NULL,
    "type" TEXT NOT NULL,
    "manufacturer" TEXT,
    "model" TEXT,
    "powerHeating" DOUBLE PRECISION,
    "powerCooling" DOUBLE PRECISION,
    "refrigerant" TEXT,
    "year" INTEGER,
    "status" TEXT,
    "metadata" JSONB,

    CONSTRAINT "TechnicalInstallation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ComplexImage" (
    "id" SERIAL NOT NULL,
    "complexId" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "title" TEXT,
    "category" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ComplexImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ComplexDocument" (
    "id" SERIAL NOT NULL,
    "complexId" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ComplexDocument_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "HotelComplex_externalId_key" ON "HotelComplex"("externalId");

-- CreateIndex
CREATE UNIQUE INDEX "HotelComplex_internalCode_key" ON "HotelComplex"("internalCode");

-- AddForeignKey
ALTER TABLE "TechnicalInstallation" ADD CONSTRAINT "TechnicalInstallation_complexId_fkey" FOREIGN KEY ("complexId") REFERENCES "HotelComplex"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComplexImage" ADD CONSTRAINT "ComplexImage_complexId_fkey" FOREIGN KEY ("complexId") REFERENCES "HotelComplex"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComplexDocument" ADD CONSTRAINT "ComplexDocument_complexId_fkey" FOREIGN KEY ("complexId") REFERENCES "HotelComplex"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
