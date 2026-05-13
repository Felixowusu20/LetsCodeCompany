-- CreateEnum
CREATE TYPE "PartnerApplicationStatus" AS ENUM ('NEW', 'IN_REVIEW', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "PartnershipType" AS ENUM ('TECHNOLOGY', 'RESELLER', 'AGENCY', 'REFERRAL', 'AFFILIATE', 'STRATEGIC', 'OTHER');

-- CreateEnum
CREATE TYPE "CompanySize" AS ENUM ('SOLO', 'SIZE_2_10', 'SIZE_11_50', 'SIZE_51_200', 'SIZE_201_1000', 'SIZE_1000_PLUS');

-- CreateEnum
CREATE TYPE "PartnerTimeline" AS ENUM ('IMMEDIATELY', 'WITHIN_30_DAYS', 'WITHIN_90_DAYS', 'EXPLORING');

-- CreateTable
CREATE TABLE "PartnerApplication" (
    "id" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "website" TEXT,
    "industry" TEXT,
    "companySize" "CompanySize" NOT NULL,
    "headquarters" TEXT,
    "contactName" TEXT NOT NULL,
    "contactRole" TEXT,
    "contactEmail" TEXT NOT NULL,
    "contactPhone" TEXT,
    "partnershipType" "PartnershipType" NOT NULL,
    "goals" TEXT NOT NULL,
    "audienceFit" TEXT,
    "expertise" TEXT,
    "timeline" "PartnerTimeline" NOT NULL,
    "budgetRange" TEXT,
    "referralSource" TEXT,
    "status" "PartnerApplicationStatus" NOT NULL DEFAULT 'NEW',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PartnerApplication_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PartnerApplication_createdAt_idx" ON "PartnerApplication" ("createdAt" DESC);

-- CreateIndex
CREATE INDEX "PartnerApplication_status_idx" ON "PartnerApplication" ("status");
