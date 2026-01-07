-- AlterEnum: Add TICKETS to Currency
DO $$ BEGIN
    ALTER TYPE "Currency" ADD VALUE IF NOT EXISTS 'TICKETS';
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- AlterEnum: Add new TransactionType values
DO $$ BEGIN
    ALTER TYPE "TransactionType" ADD VALUE IF NOT EXISTS 'MISSION_REWARD';
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    ALTER TYPE "TransactionType" ADD VALUE IF NOT EXISTS 'GACHA_SPEND';
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    ALTER TYPE "TransactionType" ADD VALUE IF NOT EXISTS 'STORE_BONUS';
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    ALTER TYPE "TransactionType" ADD VALUE IF NOT EXISTS 'LEVEL_UP';
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- CreateTable: gacha_banners
CREATE TABLE IF NOT EXISTS "gacha_banners" (
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
CREATE UNIQUE INDEX IF NOT EXISTS "gacha_banners_slug_key" ON "gacha_banners"("slug");
CREATE INDEX IF NOT EXISTS "gacha_banners_isActive_idx" ON "gacha_banners"("isActive");
CREATE INDEX IF NOT EXISTS "gacha_banners_startDate_endDate_idx" ON "gacha_banners"("startDate", "endDate");
CREATE INDEX IF NOT EXISTS "gacha_banners_slug_idx" ON "gacha_banners"("slug");

-- Insert default banner for existing gacha items
INSERT INTO "gacha_banners" ("id", "name", "slug", "description", "backgroundVideoUrl", "currencyType", "costPerPull", "startDate", "endDate", "isActive", "sortOrder", "createdAt", "updatedAt")
VALUES (
    'default-banner-001',
    'Beat like Dat',
    'beat-like-dat',
    'Default banner for existing items',
    '/videos/beat-like-dat-loop.mp4',
    'DIAMONDS',
    100,
    '2024-01-01 00:00:00',
    '2030-12-31 23:59:59',
    true,
    0,
    NOW(),
    NOW()
)
ON CONFLICT ("id") DO NOTHING;

-- AlterTable: Add bannerId to gacha_items
ALTER TABLE "gacha_items" ADD COLUMN IF NOT EXISTS "bannerId" TEXT;

-- Update existing gacha_items to use default banner
UPDATE "gacha_items" SET "bannerId" = 'default-banner-001' WHERE "bannerId" IS NULL;

-- Make bannerId NOT NULL after populating
ALTER TABLE "gacha_items" ALTER COLUMN "bannerId" SET NOT NULL;

-- CreateIndex for gacha_items.bannerId
CREATE INDEX IF NOT EXISTS "gacha_items_bannerId_idx" ON "gacha_items"("bannerId");

-- AddForeignKey for gacha_items.bannerId
ALTER TABLE "gacha_items" ADD CONSTRAINT "gacha_items_bannerId_fkey" FOREIGN KEY ("bannerId") REFERENCES "gacha_banners"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AlterTable: Add columns to gacha_pulls
ALTER TABLE "gacha_pulls" ADD COLUMN IF NOT EXISTS "bannerId" TEXT;
ALTER TABLE "gacha_pulls" ADD COLUMN IF NOT EXISTS "currencyUsed" "Currency";

-- Update existing gacha_pulls to use default banner and DIAMONDS
UPDATE "gacha_pulls" SET "bannerId" = 'default-banner-001' WHERE "bannerId" IS NULL;
UPDATE "gacha_pulls" SET "currencyUsed" = 'DIAMONDS' WHERE "currencyUsed" IS NULL;

-- Make columns NOT NULL after populating
ALTER TABLE "gacha_pulls" ALTER COLUMN "bannerId" SET NOT NULL;
ALTER TABLE "gacha_pulls" ALTER COLUMN "currencyUsed" SET NOT NULL;

-- CreateIndex for gacha_pulls.bannerId
CREATE INDEX IF NOT EXISTS "gacha_pulls_bannerId_idx" ON "gacha_pulls"("bannerId");

-- AddForeignKey for gacha_pulls.bannerId
ALTER TABLE "gacha_pulls" ADD CONSTRAINT "gacha_pulls_bannerId_fkey" FOREIGN KEY ("bannerId") REFERENCES "gacha_banners"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AlterTable: Add ticketsEarned to orders
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "ticketsEarned" INTEGER DEFAULT 0;

-- AlterTable: Add recurrence to tasks
ALTER TABLE "tasks" ADD COLUMN IF NOT EXISTS "recurrence" TEXT DEFAULT 'ONCE';

-- AlterTable: Update users table
-- Handle diamondBalance -> diamonds rename if column exists
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'diamondBalance') THEN
        ALTER TABLE "users" RENAME COLUMN "diamondBalance" TO "diamonds";
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'diamonds') THEN
        ALTER TABLE "users" ADD COLUMN "diamonds" INTEGER NOT NULL DEFAULT 0;
    END IF;
END $$;

ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "tickets" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "xp" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "streakCount" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "lastStreakDate" TIMESTAMP(3);
