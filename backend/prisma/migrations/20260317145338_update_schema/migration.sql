-- CreateEnum
CREATE TYPE "BannerType" AS ENUM ('IMAGE_JPG', 'HTML_JS');

-- CreateEnum
CREATE TYPE "BannerStatus" AS ENUM ('ACTIF', 'FUTUR', 'EXPIRE');

-- CreateTable
CREATE TABLE "advertisings" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "path" TEXT NOT NULL,
    "isEnabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "advertisings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "banners" (
    "id" SERIAL NOT NULL,
    "advertiser" TEXT NOT NULL,
    "campaign" TEXT NOT NULL,
    "type" "BannerType" NOT NULL,
    "imageUrl" TEXT,
    "publicId" TEXT,
    "htmlCode" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "status" "BannerStatus" NOT NULL DEFAULT 'FUTUR',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "advertisingId" INTEGER NOT NULL,

    CONSTRAINT "banners_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "third_party_codes" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "third_party_codes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "advertisings_slug_key" ON "advertisings"("slug");

-- AddForeignKey
ALTER TABLE "banners" ADD CONSTRAINT "banners_advertisingId_fkey" FOREIGN KEY ("advertisingId") REFERENCES "advertisings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
