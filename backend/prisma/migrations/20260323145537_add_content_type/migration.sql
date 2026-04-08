-- CreateEnum
CREATE TYPE "ContenusType" AS ENUM ('ARTICLE', 'VIDEO', 'PAGE', 'SALON', 'DESTINATION');

-- AlterTable
ALTER TABLE "articles" ADD COLUMN     "type" "ContenusType" NOT NULL DEFAULT 'ARTICLE';
