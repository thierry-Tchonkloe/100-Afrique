-- AlterTable
ALTER TABLE "articles" ADD COLUMN     "relatedContentIds" INTEGER[] DEFAULT ARRAY[]::INTEGER[];
