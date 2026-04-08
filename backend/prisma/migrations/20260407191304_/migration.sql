-- CreateTable
CREATE TABLE "magazines" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "excerpt" TEXT,
    "content" TEXT,
    "coverImage" TEXT,
    "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "source" TEXT NOT NULL,
    "author" TEXT,
    "categoryId" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PUBLISHED',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "magazines_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "magazines_slug_key" ON "magazines"("slug");

-- CreateIndex
CREATE INDEX "magazines_slug_idx" ON "magazines"("slug");

-- CreateIndex
CREATE INDEX "magazines_source_idx" ON "magazines"("source");

-- CreateIndex
CREATE INDEX "magazines_publishedAt_idx" ON "magazines"("publishedAt");

-- CreateIndex
CREATE INDEX "magazines_categoryId_idx" ON "magazines"("categoryId");

-- AddForeignKey
ALTER TABLE "magazines" ADD CONSTRAINT "magazines_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
