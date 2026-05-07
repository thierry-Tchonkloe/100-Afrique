-- CreateEnum
CREATE TYPE "EmploiRole" AS ENUM ('CANDIDAT', 'RECRUITER');

-- CreateEnum
CREATE TYPE "OffreStatus" AS ENUM ('DRAFT', 'ACTIVE', 'PAUSED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('PENDING', 'SENT', 'VIEWED', 'IN_PROGRESS', 'SELECTED', 'INTERVIEW', 'ACCEPTED', 'REFUSED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "AlerteFreq" AS ENUM ('REALTIME', 'DAILY', 'WEEKLY');

-- CreateEnum
CREATE TYPE "NotifType" AS ENUM ('NEW_OFFER', 'PROFILE_VIEWED', 'APPLICATION_ACCEPTED', 'APPLICATION_REFUSED', 'NEW_APPLICATION');

-- CreateTable
CREATE TABLE "emploi_users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "avatar" TEXT,
    "role" "EmploiRole" NOT NULL DEFAULT 'CANDIDAT',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "emploi_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "etablissements" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "sector" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "logo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "etablissements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recruteur_etablissements" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "etablissementId" INTEGER NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "recruteur_etablissements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "candidat_profils" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "headline" TEXT,
    "city" TEXT,
    "mobility" TEXT,
    "bio" TEXT,
    "avatar" TEXT,
    "hardSkills" JSONB NOT NULL DEFAULT '[]',
    "softSkills" JSONB NOT NULL DEFAULT '[]',
    "languages" JSONB NOT NULL DEFAULT '[]',
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "availability" TEXT NOT NULL DEFAULT 'immediate',
    "profileStrength" INTEGER NOT NULL DEFAULT 0,
    "cvFileName" TEXT,
    "cvFileUrl" TEXT,
    "cvUpdatedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "candidat_profils_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "experiences" (
    "id" SERIAL NOT NULL,
    "profilId" INTEGER NOT NULL,
    "jobTitle" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "location" TEXT,
    "startDate" TEXT NOT NULL,
    "endDate" TEXT,
    "contractType" TEXT NOT NULL DEFAULT 'CDI',
    "missions" JSONB NOT NULL DEFAULT '[]',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "experiences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "formations" (
    "id" SERIAL NOT NULL,
    "profilId" INTEGER NOT NULL,
    "diploma" TEXT NOT NULL,
    "school" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "formations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "offres" (
    "id" SERIAL NOT NULL,
    "etablissementId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "sector" TEXT NOT NULL,
    "contractType" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "salaryMin" INTEGER,
    "salaryMax" INTEGER,
    "remote" TEXT NOT NULL DEFAULT 'none',
    "missions" TEXT,
    "profileDesc" TEXT,
    "advantages" TEXT,
    "requiredSkills" JSONB NOT NULL DEFAULT '[]',
    "requiredLangs" JSONB NOT NULL DEFAULT '[]',
    "requiredSoftwares" JSONB NOT NULL DEFAULT '[]',
    "status" "OffreStatus" NOT NULL DEFAULT 'DRAFT',
    "isPremium" BOOLEAN NOT NULL DEFAULT false,
    "views" INTEGER NOT NULL DEFAULT 0,
    "publishedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "offres_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "applications" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "offreId" INTEGER NOT NULL,
    "etablissementId" INTEGER NOT NULL,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'SENT',
    "matchScore" INTEGER NOT NULL DEFAULT 0,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "isFavorite" BOOLEAN NOT NULL DEFAULT false,
    "recruiterNotes" TEXT,
    "timeline" JSONB NOT NULL DEFAULT '[]',
    "appliedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alerte_jobs" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "keywords" JSONB NOT NULL DEFAULT '[]',
    "location" TEXT,
    "radius" INTEGER,
    "contractTypes" JSONB NOT NULL DEFAULT '[]',
    "sector" TEXT,
    "frequency" "AlerteFreq" NOT NULL DEFAULT 'DAILY',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastSentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "alerte_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vitrines" (
    "id" SERIAL NOT NULL,
    "etablissementId" INTEGER NOT NULL,
    "logoUrl" TEXT,
    "bannerUrl" TEXT,
    "slogan" TEXT,
    "location" TEXT,
    "sector" TEXT,
    "aboutUs" TEXT,
    "kpis" JSONB NOT NULL DEFAULT '[]',
    "values" JSONB NOT NULL DEFAULT '[]',
    "perks" JSONB NOT NULL DEFAULT '[]',
    "photos" JSONB NOT NULL DEFAULT '[]',
    "videos" JSONB NOT NULL DEFAULT '[]',
    "socials" JSONB NOT NULL DEFAULT '{}',
    "completionScore" INTEGER NOT NULL DEFAULT 0,
    "views" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vitrines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "emploi_notifications" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "type" "NotifType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "relatedId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "emploi_notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "emploi_settings" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT false,
    "profileVisible" BOOLEAN NOT NULL DEFAULT true,
    "hideLastName" BOOLEAN NOT NULL DEFAULT false,
    "hidePhoto" BOOLEAN NOT NULL DEFAULT false,
    "hideContactInfo" BOOLEAN NOT NULL DEFAULT false,
    "newsletter" BOOLEAN NOT NULL DEFAULT true,
    "serviceAlerts" BOOLEAN NOT NULL DEFAULT true,
    "linkedinConnected" BOOLEAN NOT NULL DEFAULT false,
    "linkedinEmail" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "emploi_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "emploi_users_email_key" ON "emploi_users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "recruteur_etablissements_userId_etablissementId_key" ON "recruteur_etablissements"("userId", "etablissementId");

-- CreateIndex
CREATE UNIQUE INDEX "candidat_profils_userId_key" ON "candidat_profils"("userId");

-- CreateIndex
CREATE INDEX "experiences_profilId_idx" ON "experiences"("profilId");

-- CreateIndex
CREATE INDEX "formations_profilId_idx" ON "formations"("profilId");

-- CreateIndex
CREATE INDEX "offres_etablissementId_idx" ON "offres"("etablissementId");

-- CreateIndex
CREATE INDEX "offres_status_idx" ON "offres"("status");

-- CreateIndex
CREATE INDEX "offres_sector_idx" ON "offres"("sector");

-- CreateIndex
CREATE INDEX "offres_location_idx" ON "offres"("location");

-- CreateIndex
CREATE INDEX "applications_userId_idx" ON "applications"("userId");

-- CreateIndex
CREATE INDEX "applications_offreId_idx" ON "applications"("offreId");

-- CreateIndex
CREATE INDEX "applications_etablissementId_idx" ON "applications"("etablissementId");

-- CreateIndex
CREATE INDEX "applications_status_idx" ON "applications"("status");

-- CreateIndex
CREATE UNIQUE INDEX "applications_userId_offreId_key" ON "applications"("userId", "offreId");

-- CreateIndex
CREATE INDEX "alerte_jobs_userId_idx" ON "alerte_jobs"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "vitrines_etablissementId_key" ON "vitrines"("etablissementId");

-- CreateIndex
CREATE INDEX "emploi_notifications_userId_idx" ON "emploi_notifications"("userId");

-- CreateIndex
CREATE INDEX "emploi_notifications_isRead_idx" ON "emploi_notifications"("isRead");

-- CreateIndex
CREATE UNIQUE INDEX "emploi_settings_userId_key" ON "emploi_settings"("userId");

-- AddForeignKey
ALTER TABLE "recruteur_etablissements" ADD CONSTRAINT "recruteur_etablissements_userId_fkey" FOREIGN KEY ("userId") REFERENCES "emploi_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recruteur_etablissements" ADD CONSTRAINT "recruteur_etablissements_etablissementId_fkey" FOREIGN KEY ("etablissementId") REFERENCES "etablissements"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "candidat_profils" ADD CONSTRAINT "candidat_profils_userId_fkey" FOREIGN KEY ("userId") REFERENCES "emploi_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "experiences" ADD CONSTRAINT "experiences_profilId_fkey" FOREIGN KEY ("profilId") REFERENCES "candidat_profils"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "formations" ADD CONSTRAINT "formations_profilId_fkey" FOREIGN KEY ("profilId") REFERENCES "candidat_profils"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "offres" ADD CONSTRAINT "offres_etablissementId_fkey" FOREIGN KEY ("etablissementId") REFERENCES "etablissements"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "emploi_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_offreId_fkey" FOREIGN KEY ("offreId") REFERENCES "offres"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_etablissementId_fkey" FOREIGN KEY ("etablissementId") REFERENCES "etablissements"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alerte_jobs" ADD CONSTRAINT "alerte_jobs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "emploi_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vitrines" ADD CONSTRAINT "vitrines_etablissementId_fkey" FOREIGN KEY ("etablissementId") REFERENCES "etablissements"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "emploi_notifications" ADD CONSTRAINT "emploi_notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "emploi_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "emploi_settings" ADD CONSTRAINT "emploi_settings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "emploi_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
