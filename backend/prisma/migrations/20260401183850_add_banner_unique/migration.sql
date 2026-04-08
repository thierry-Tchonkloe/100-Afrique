/*
  Warnings:

  - A unique constraint covering the columns `[campaign,advertisingId]` on the table `banners` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "banners_campaign_advertisingId_key" ON "banners"("campaign", "advertisingId");
