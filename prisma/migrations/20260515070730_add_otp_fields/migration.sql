/*
  Warnings:

  - Added the required column `updatedAt` to the `Lead` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "BookingType" AS ENUM ('WALKINBOOKING', 'ONLINEBOOKING', 'PHONEBOOKING', 'SCHEDULEDBYSALON');

-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('NEW', 'CONTACTED', 'QUALIFIED', 'UNQUALIFIED', 'CONVERTED', 'CLOSED');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "LeadType" ADD VALUE 'CALLBACK';
ALTER TYPE "LeadType" ADD VALUE 'WALKIN';
ALTER TYPE "LeadType" ADD VALUE 'WHATSAPP';

-- DropIndex
DROP INDEX "DiscountCode_code_key";

-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "BBABookingEmail" TEXT,
ADD COLUMN     "BBABookingName" TEXT,
ADD COLUMN     "BBABookingPhone" TEXT,
ADD COLUMN     "bookingType" TEXT,
ALTER COLUMN "customerId" DROP NOT NULL,
ALTER COLUMN "time" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Customer" ALTER COLUMN "phone" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Lead" ADD COLUMN     "assignedTo" TEXT,
ADD COLUMN     "contacted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "service" TEXT,
ADD COLUMN     "source" TEXT,
ADD COLUMN     "starred" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "status" "LeadStatus" NOT NULL DEFAULT 'NEW',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "ServiceVariant" ALTER COLUMN "totalDuration" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "otpAttempts" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "otpLastSentAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "OtpRateLimit" (
    "id" TEXT NOT NULL,
    "ip" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "email" TEXT,
    "firstHit" TIMESTAMP(3) NOT NULL,
    "lastHit" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OtpRateLimit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OtpRateLimit_ip_key" ON "OtpRateLimit"("ip");

-- CreateIndex
CREATE INDEX "Lead_status_idx" ON "Lead"("status");

-- CreateIndex
CREATE INDEX "Lead_createdAt_idx" ON "Lead"("createdAt");
