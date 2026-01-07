-- CreateEnum
CREATE TYPE "ProductType" AS ENUM ('MAIN', 'ACCESSORY', 'BUNDLE');

-- AlterTable
ALTER TABLE "merchandise" ADD COLUMN     "label" TEXT,
ADD COLUMN     "sizes" TEXT[],
ADD COLUMN     "type" "ProductType" NOT NULL DEFAULT 'MAIN';

-- CreateIndex
CREATE INDEX "merchandise_type_idx" ON "merchandise"("type");
