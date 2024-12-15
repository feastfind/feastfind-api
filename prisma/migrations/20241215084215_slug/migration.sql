/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `City` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `MenuItem` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `Place` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `City` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `MenuItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `Place` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "City" ADD COLUMN     "slug" VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE "MenuItem" ADD COLUMN     "slug" VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE "Place" ADD COLUMN     "slug" VARCHAR(255) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "City_slug_key" ON "City"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "MenuItem_slug_key" ON "MenuItem"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Place_slug_key" ON "Place"("slug");
