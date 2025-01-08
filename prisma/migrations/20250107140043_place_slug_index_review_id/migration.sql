/*
  Warnings:

  - The primary key for the `MenuItemReview` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The required column `id` was added to the `MenuItemReview` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "MenuItemReview" DROP CONSTRAINT "MenuItemReview_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "MenuItemReview_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE INDEX "Place_id_slug_idx" ON "Place"("id", "slug");
