/*
  Warnings:

  - The primary key for the `MenuItemReview` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `MenuItemReview` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[url]` on the table `MenuItemImage` will be added. If there are existing duplicate values, this will fail.
  - Made the column `menuItemId` on table `MenuItemReview` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "MenuItemReview" DROP CONSTRAINT "MenuItemReview_pkey",
DROP COLUMN "id",
ALTER COLUMN "menuItemId" SET NOT NULL,
ADD CONSTRAINT "MenuItemReview_pkey" PRIMARY KEY ("menuItemId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "MenuItemImage_url_key" ON "MenuItemImage"("url");
