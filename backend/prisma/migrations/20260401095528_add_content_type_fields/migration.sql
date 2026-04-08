-- AlterTable
ALTER TABLE "articles" ADD COLUMN     "duration" TEXT,
ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "includeInFooter" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "includeInMainMenu" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "linkGroup" TEXT,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "pageTemplate" TEXT,
ADD COLUMN     "sortOrder" INTEGER,
ADD COLUMN     "sourceUrl" TEXT,
ADD COLUMN     "startDate" TIMESTAMP(3),
ADD COLUMN     "videoType" TEXT,
ADD COLUMN     "visibility" TEXT,
ADD COLUMN     "website" TEXT;

-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "climatDominant" TEXT,
ADD COLUMN     "codeTel" TEXT,
ADD COLUMN     "continent" TEXT,
ADD COLUMN     "fuseauHoraire" TEXT,
ADD COLUMN     "langue" TEXT,
ADD COLUMN     "meillerePeriode" TEXT,
ADD COLUMN     "monnaie" TEXT,
ADD COLUMN     "niveauGeographique" TEXT,
ADD COLUMN     "officeTourisme" TEXT,
ADD COLUMN     "population" TEXT,
ADD COLUMN     "regionAssociee" TEXT,
ADD COLUMN     "slogan" TEXT,
ADD COLUMN     "typeZone" TEXT;

-- CreateIndex
CREATE INDEX "articles_type_idx" ON "articles"("type");

-- CreateIndex
CREATE INDEX "articles_startDate_idx" ON "articles"("startDate");
