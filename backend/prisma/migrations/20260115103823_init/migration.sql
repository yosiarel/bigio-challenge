-- CreateEnum
CREATE TYPE "Category" AS ENUM ('FINANCIAL', 'TECHNOLOGY', 'HEALTH');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('DRAFT', 'PUBLISH');

-- CreateTable
CREATE TABLE "stories" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "synopsis" TEXT NOT NULL,
    "category" "Category" NOT NULL,
    "coverUrl" TEXT,
    "tags" TEXT[],
    "status" "Status" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chapters" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "storyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "chapters_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "stories_title_author_idx" ON "stories"("title", "author");

-- CreateIndex
CREATE INDEX "stories_category_status_idx" ON "stories"("category", "status");

-- CreateIndex
CREATE INDEX "chapters_storyId_idx" ON "chapters"("storyId");

-- AddForeignKey
ALTER TABLE "chapters" ADD CONSTRAINT "chapters_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "stories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
