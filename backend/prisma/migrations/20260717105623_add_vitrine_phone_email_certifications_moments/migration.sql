-- AlterTable
ALTER TABLE "vitrines" ADD COLUMN     "certifications" JSONB NOT NULL DEFAULT '[]',
ADD COLUMN     "email" TEXT DEFAULT '',
ADD COLUMN     "moments" JSONB NOT NULL DEFAULT '[]',
ADD COLUMN     "phone" TEXT DEFAULT '';
