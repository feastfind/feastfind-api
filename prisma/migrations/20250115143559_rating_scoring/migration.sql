-- AlterTable
ALTER TABLE "MenuItem" ADD COLUMN     "ratingScore" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Place" ADD COLUMN     "ratingScore" DOUBLE PRECISION NOT NULL DEFAULT 0;
