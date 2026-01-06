-- AlterEnum: Add new values to TransactionType
ALTER TYPE "TransactionType" ADD VALUE 'MISSION_REWARD';
ALTER TYPE "TransactionType" ADD VALUE 'GACHA_SPEND';
ALTER TYPE "TransactionType" ADD VALUE 'STORE_BONUS';
ALTER TYPE "TransactionType" ADD VALUE 'LEVEL_UP';

-- AlterEnum: Add TICKETS to Currency enum
ALTER TYPE "Currency" ADD VALUE 'TICKETS';

-- AlterTable: Rename diamondBalance to diamonds, add xp and tickets to users table
ALTER TABLE "users" RENAME COLUMN "diamondBalance" TO "diamonds";
ALTER TABLE "users" ADD COLUMN "xp" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "users" ADD COLUMN "tickets" INTEGER NOT NULL DEFAULT 0;

-- Update comments for User fields (PostgreSQL doesn't support column comments in standard SQL, handled via Prisma)

-- CreateTable: GachaBanner
CREATE TABLE "gacha_banners" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "backgroundVideoUrl" TEXT NOT NULL,
    "currencyType" "Currency" NOT NULL,
    "costPerPull" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "gacha_banners_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "gacha_banners_slug_key" ON "gacha_banners"("slug");
CREATE INDEX "gacha_banners_isActive_idx" ON "gacha_banners"("isActive");
CREATE INDEX "gacha_banners_startDate_endDate_idx" ON "gacha_banners"("startDate", "endDate");
CREATE INDEX "gacha_banners_slug_idx" ON "gacha_banners"("slug");

-- AlterTable: Add bannerId to gacha_items
ALTER TABLE "gacha_items" ADD COLUMN "bannerId" TEXT;

-- CreateIndex
CREATE INDEX "gacha_items_bannerId_idx" ON "gacha_items"("bannerId");

-- AlterTable: Add bannerId and currencyUsed to gacha_pulls
ALTER TABLE "gacha_pulls" ADD COLUMN "bannerId" TEXT;
ALTER TABLE "gacha_pulls" ADD COLUMN "currencyUsed" "Currency";

-- CreateIndex
CREATE INDEX "gacha_pulls_bannerId_idx" ON "gacha_pulls"("bannerId");

-- NOTE: Before making bannerId NOT NULL, you need to:
-- 1. Create a default GachaBanner
-- 2. Update existing gacha_items to reference the default banner
-- 3. Update existing gacha_pulls to reference the default banner and set currencyUsed
--
-- Example data migration (run separately after creating a default banner):
-- INSERT INTO "gacha_banners" (id, name, slug, description, backgroundVideoUrl, currencyType, costPerPull, startDate, endDate, isActive, sortOrder, createdAt, updatedAt)
-- VALUES ('default-banner-id', 'Default Banner', 'default', 'Legacy banner for existing items', 'https://example.com/default-video.mp4', 'DIAMONDS', 100, NOW(), NOW() + INTERVAL '10 years', true, 0, NOW(), NOW());
--
-- UPDATE "gacha_items" SET "bannerId" = 'default-banner-id' WHERE "bannerId" IS NULL;
-- UPDATE "gacha_pulls" SET "bannerId" = 'default-banner-id', "currencyUsed" = 'DIAMONDS' WHERE "bannerId" IS NULL;
--
-- Then make the fields NOT NULL:
-- ALTER TABLE "gacha_items" ALTER COLUMN "bannerId" SET NOT NULL;
-- ALTER TABLE "gacha_pulls" ALTER COLUMN "bannerId" SET NOT NULL;
-- ALTER TABLE "gacha_pulls" ALTER COLUMN "currencyUsed" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "gacha_items" ADD CONSTRAINT "gacha_items_bannerId_fkey" FOREIGN KEY ("bannerId") REFERENCES "gacha_banners"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gacha_pulls" ADD CONSTRAINT "gacha_pulls_bannerId_fkey" FOREIGN KEY ("bannerId") REFERENCES "gacha_banners"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
