/*
  Warnings:

  - You are about to drop the column `climatDominant` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `codeTel` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `continent` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `fuseauHoraire` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `langue` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `meillerePeriode` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `monnaie` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `niveauGeographique` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `officeTourisme` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `population` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `regionAssociee` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `slogan` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `typeZone` on the `categories` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "categories" DROP COLUMN "climatDominant",
DROP COLUMN "codeTel",
DROP COLUMN "continent",
DROP COLUMN "fuseauHoraire",
DROP COLUMN "langue",
DROP COLUMN "meillerePeriode",
DROP COLUMN "monnaie",
DROP COLUMN "niveauGeographique",
DROP COLUMN "officeTourisme",
DROP COLUMN "population",
DROP COLUMN "regionAssociee",
DROP COLUMN "slogan",
DROP COLUMN "typeZone";

-- AlterTable
ALTER TABLE "destinations" ADD COLUMN     "climatDominant" TEXT,
ADD COLUMN     "codeTel" TEXT,
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
