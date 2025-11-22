-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN', 'ARTIST');

-- CreateEnum
CREATE TYPE "TaskType" AS ENUM ('SOCIAL', 'CONTENT', 'DAILY', 'PROFILE', 'REFERRAL', 'PURCHASE', 'EVENT');

-- CreateEnum
CREATE TYPE "MissionType" AS ENUM ('FOLLOW', 'LIKE', 'REPOST', 'USE_AUDIO');

-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('EASY', 'MEDIUM', 'HARD');

-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('PENDING', 'APPROVED', 'FAILED');

-- CreateEnum
CREATE TYPE "Rarity" AS ENUM ('COMMON', 'RARE', 'EPIC', 'SSR', 'LEGENDARY');

-- CreateEnum
CREATE TYPE "PrizeType" AS ENUM ('PHYSICAL', 'DIGITAL', 'EXPERIENCE', 'DISCOUNT', 'EXCLUSIVE');

-- CreateEnum
CREATE TYPE "PrizeSource" AS ENUM ('GACHA', 'PURCHASE', 'REWARD', 'GIFT');

-- CreateEnum
CREATE TYPE "PullType" AS ENUM ('SINGLE', 'MULTI_10X');

-- CreateEnum
CREATE TYPE "TicketType" AS ENUM ('SINGLE', 'MULTI_10X');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('EARN', 'SPEND', 'PURCHASE', 'GIFT', 'REFUND', 'ADJUSTMENT');

-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('DIAMONDS', 'POINTS');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('KLARNA', 'STRIPE', 'PAYPAL');

-- CreateEnum
CREATE TYPE "PurchaseStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "MerchandiseCategory" AS ENUM ('CLOTHING', 'ACCESSORIES', 'MUSIC', 'COLLECTIBLES', 'OTHER');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "avatar" TEXT,
    "diamondBalance" INTEGER NOT NULL DEFAULT 0,
    "points" INTEGER NOT NULL DEFAULT 0,
    "level" INTEGER NOT NULL DEFAULT 1,
    "gachaPityCounter" INTEGER NOT NULL DEFAULT 0,
    "hasCompletedTenDraw" BOOLEAN NOT NULL DEFAULT false,
    "provider" TEXT,
    "providerId" TEXT,
    "tiktokUsername" TEXT,
    "tiktokUserId" TEXT,
    "tiktokAccessToken" TEXT,
    "tiktokRefreshToken" TEXT,
    "tiktokTokenExpiry" TIMESTAMP(3),
    "tiktokLinkedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastLoginAt" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification_tokens" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "tasks" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" "TaskType" NOT NULL,
    "difficulty" "Difficulty" NOT NULL DEFAULT 'EASY',
    "missionType" "MissionType",
    "targetTikTokAccount" TEXT,
    "targetVideoUrl" TEXT,
    "targetAudioId" TEXT,
    "autoVerify" BOOLEAN NOT NULL DEFAULT false,
    "verificationStatus" TEXT,
    "points" INTEGER NOT NULL DEFAULT 0,
    "diamonds" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "maxCompletions" INTEGER,
    "completionCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_tasks" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "pointsEarned" INTEGER NOT NULL,
    "diamondsEarned" INTEGER NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "verifiedAt" TIMESTAMP(3),
    "verifiedBy" TEXT,
    "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "user_tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prizes" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "rarity" "Rarity" NOT NULL,
    "image" TEXT,
    "value" INTEGER NOT NULL DEFAULT 0,
    "type" "PrizeType" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "stock" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "prizes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_prizes" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "prizeId" TEXT NOT NULL,
    "acquiredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "source" "PrizeSource" NOT NULL,
    "redeemed" BOOLEAN NOT NULL DEFAULT false,
    "redeemedAt" TIMESTAMP(3),

    CONSTRAINT "user_prizes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gacha_items" (
    "id" TEXT NOT NULL,
    "prizeId" TEXT NOT NULL,
    "probability" DOUBLE PRECISION NOT NULL,
    "pityCounter" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "gacha_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gacha_pulls" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "gachaItemId" TEXT NOT NULL,
    "prizeId" TEXT,
    "pulledAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cost" INTEGER NOT NULL,
    "pullType" "PullType" NOT NULL DEFAULT 'SINGLE',
    "batchId" TEXT,
    "pullIndex" INTEGER,
    "wasGuaranteed" BOOLEAN NOT NULL DEFAULT false,
    "won" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "gacha_pulls_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "draw_tickets" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "ticketType" "TicketType" NOT NULL DEFAULT 'SINGLE',
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "source" TEXT NOT NULL,
    "sourceRef" TEXT,
    "expiresAt" TIMESTAMP(3),
    "used" BOOLEAN NOT NULL DEFAULT false,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "draw_tickets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transactions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "TransactionType" NOT NULL,
    "amount" INTEGER NOT NULL,
    "currency" "Currency" NOT NULL,
    "description" TEXT NOT NULL,
    "reference" TEXT,
    "status" "TransactionStatus" NOT NULL DEFAULT 'COMPLETED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "premium_packs" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "guaranteedPrizeId" TEXT,
    "bonusTickets" INTEGER NOT NULL DEFAULT 0,
    "bonusDiamonds" INTEGER NOT NULL DEFAULT 0,
    "imageUrl" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "premium_packs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "purchases" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "packId" TEXT NOT NULL,
    "klarnaOrderId" TEXT,
    "stripeSessionId" TEXT,
    "paymentMethod" "PaymentMethod" NOT NULL DEFAULT 'KLARNA',
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "status" "PurchaseStatus" NOT NULL DEFAULT 'PENDING',
    "itemsGranted" BOOLEAN NOT NULL DEFAULT false,
    "ticketsGranted" BOOLEAN NOT NULL DEFAULT false,
    "diamondsGranted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "purchases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mission_verification_jobs" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "userTaskId" TEXT NOT NULL,
    "missionType" "MissionType" NOT NULL,
    "status" "JobStatus" NOT NULL DEFAULT 'PENDING',
    "tiktokUsername" TEXT,
    "targetData" TEXT,
    "verificationResult" BOOLEAN,
    "errorMessage" TEXT,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "maxAttempts" INTEGER NOT NULL DEFAULT 3,
    "nextRetryAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "mission_verification_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "merchandise" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "category" "MerchandiseCategory" NOT NULL,
    "material" TEXT,
    "features" TEXT[],
    "tags" TEXT[],
    "inStock" BOOLEAN NOT NULL DEFAULT true,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "imageUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "merchandise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "merchandise_variants" (
    "id" TEXT NOT NULL,
    "merchandiseId" TEXT NOT NULL,
    "size" TEXT,
    "color" TEXT,
    "sku" TEXT NOT NULL,
    "priceModifier" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "stockQuantity" INTEGER NOT NULL DEFAULT 0,
    "inStock" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "merchandise_variants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "merchandise_images" (
    "id" TEXT NOT NULL,
    "merchandiseId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "altText" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "merchandise_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "carts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "carts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cart_items" (
    "id" TEXT NOT NULL,
    "cartId" TEXT NOT NULL,
    "merchandiseId" TEXT NOT NULL,
    "variantId" TEXT,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cart_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "orderNumber" TEXT NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "shippingName" TEXT NOT NULL,
    "shippingEmail" TEXT NOT NULL,
    "shippingAddress" TEXT NOT NULL,
    "shippingCity" TEXT NOT NULL,
    "shippingState" TEXT,
    "shippingZip" TEXT NOT NULL,
    "shippingCountry" TEXT NOT NULL,
    "shippingPhone" TEXT,
    "paymentMethod" "PaymentMethod",
    "paymentId" TEXT,
    "stripeSessionId" TEXT,
    "stripePaymentIntentId" TEXT,
    "paidAt" TIMESTAMP(3),
    "trackingNumber" TEXT,
    "shippedAt" TIMESTAMP(3),
    "deliveredAt" TIMESTAMP(3),
    "customerNotes" TEXT,
    "adminNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_items" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "merchandiseId" TEXT NOT NULL,
    "variantId" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "quantity" INTEGER NOT NULL,
    "size" TEXT,
    "color" TEXT,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "order_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "releases" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "artist" TEXT NOT NULL,
    "description" TEXT,
    "videoUrl" TEXT NOT NULL,
    "videoId" TEXT,
    "thumbnailUrl" TEXT,
    "duration" TEXT,
    "views" TEXT,
    "releaseDate" TIMESTAMP(3) NOT NULL,
    "genre" TEXT,
    "tags" TEXT[],
    "spotifyUrl" TEXT,
    "appleMusicUrl" TEXT,
    "tidalUrl" TEXT,
    "soundcloudUrl" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "releases_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_provider_providerId_idx" ON "users"("provider", "providerId");

-- CreateIndex
CREATE INDEX "users_tiktokUsername_idx" ON "users"("tiktokUsername");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_providerAccountId_key" ON "accounts"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_sessionToken_key" ON "sessions"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_token_key" ON "verification_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_identifier_token_key" ON "verification_tokens"("identifier", "token");

-- CreateIndex
CREATE INDEX "tasks_type_idx" ON "tasks"("type");

-- CreateIndex
CREATE INDEX "tasks_isActive_idx" ON "tasks"("isActive");

-- CreateIndex
CREATE INDEX "tasks_missionType_idx" ON "tasks"("missionType");

-- CreateIndex
CREATE INDEX "user_tasks_userId_idx" ON "user_tasks"("userId");

-- CreateIndex
CREATE INDEX "user_tasks_taskId_idx" ON "user_tasks"("taskId");

-- CreateIndex
CREATE INDEX "user_tasks_verificationStatus_idx" ON "user_tasks"("verificationStatus");

-- CreateIndex
CREATE UNIQUE INDEX "user_tasks_userId_taskId_key" ON "user_tasks"("userId", "taskId");

-- CreateIndex
CREATE INDEX "prizes_rarity_idx" ON "prizes"("rarity");

-- CreateIndex
CREATE INDEX "prizes_isActive_idx" ON "prizes"("isActive");

-- CreateIndex
CREATE INDEX "user_prizes_userId_idx" ON "user_prizes"("userId");

-- CreateIndex
CREATE INDEX "user_prizes_prizeId_idx" ON "user_prizes"("prizeId");

-- CreateIndex
CREATE INDEX "gacha_items_isActive_idx" ON "gacha_items"("isActive");

-- CreateIndex
CREATE INDEX "gacha_pulls_userId_idx" ON "gacha_pulls"("userId");

-- CreateIndex
CREATE INDEX "gacha_pulls_gachaItemId_idx" ON "gacha_pulls"("gachaItemId");

-- CreateIndex
CREATE INDEX "gacha_pulls_batchId_idx" ON "gacha_pulls"("batchId");

-- CreateIndex
CREATE INDEX "draw_tickets_userId_idx" ON "draw_tickets"("userId");

-- CreateIndex
CREATE INDEX "draw_tickets_used_idx" ON "draw_tickets"("used");

-- CreateIndex
CREATE INDEX "draw_tickets_expiresAt_idx" ON "draw_tickets"("expiresAt");

-- CreateIndex
CREATE INDEX "transactions_userId_idx" ON "transactions"("userId");

-- CreateIndex
CREATE INDEX "transactions_type_idx" ON "transactions"("type");

-- CreateIndex
CREATE INDEX "transactions_createdAt_idx" ON "transactions"("createdAt");

-- CreateIndex
CREATE INDEX "premium_packs_isActive_idx" ON "premium_packs"("isActive");

-- CreateIndex
CREATE INDEX "premium_packs_featured_idx" ON "premium_packs"("featured");

-- CreateIndex
CREATE UNIQUE INDEX "purchases_klarnaOrderId_key" ON "purchases"("klarnaOrderId");

-- CreateIndex
CREATE UNIQUE INDEX "purchases_stripeSessionId_key" ON "purchases"("stripeSessionId");

-- CreateIndex
CREATE INDEX "purchases_userId_idx" ON "purchases"("userId");

-- CreateIndex
CREATE INDEX "purchases_packId_idx" ON "purchases"("packId");

-- CreateIndex
CREATE INDEX "purchases_status_idx" ON "purchases"("status");

-- CreateIndex
CREATE INDEX "purchases_klarnaOrderId_idx" ON "purchases"("klarnaOrderId");

-- CreateIndex
CREATE INDEX "purchases_stripeSessionId_idx" ON "purchases"("stripeSessionId");

-- CreateIndex
CREATE UNIQUE INDEX "mission_verification_jobs_userTaskId_key" ON "mission_verification_jobs"("userTaskId");

-- CreateIndex
CREATE INDEX "mission_verification_jobs_userId_idx" ON "mission_verification_jobs"("userId");

-- CreateIndex
CREATE INDEX "mission_verification_jobs_taskId_idx" ON "mission_verification_jobs"("taskId");

-- CreateIndex
CREATE INDEX "mission_verification_jobs_status_idx" ON "mission_verification_jobs"("status");

-- CreateIndex
CREATE INDEX "mission_verification_jobs_nextRetryAt_idx" ON "mission_verification_jobs"("nextRetryAt");

-- CreateIndex
CREATE INDEX "merchandise_category_idx" ON "merchandise"("category");

-- CreateIndex
CREATE INDEX "merchandise_featured_idx" ON "merchandise"("featured");

-- CreateIndex
CREATE INDEX "merchandise_inStock_idx" ON "merchandise"("inStock");

-- CreateIndex
CREATE UNIQUE INDEX "merchandise_variants_sku_key" ON "merchandise_variants"("sku");

-- CreateIndex
CREATE INDEX "merchandise_variants_merchandiseId_idx" ON "merchandise_variants"("merchandiseId");

-- CreateIndex
CREATE INDEX "merchandise_variants_sku_idx" ON "merchandise_variants"("sku");

-- CreateIndex
CREATE INDEX "merchandise_images_merchandiseId_idx" ON "merchandise_images"("merchandiseId");

-- CreateIndex
CREATE UNIQUE INDEX "carts_userId_key" ON "carts"("userId");

-- CreateIndex
CREATE INDEX "cart_items_cartId_idx" ON "cart_items"("cartId");

-- CreateIndex
CREATE INDEX "cart_items_merchandiseId_idx" ON "cart_items"("merchandiseId");

-- CreateIndex
CREATE UNIQUE INDEX "cart_items_cartId_merchandiseId_variantId_key" ON "cart_items"("cartId", "merchandiseId", "variantId");

-- CreateIndex
CREATE UNIQUE INDEX "orders_orderNumber_key" ON "orders"("orderNumber");

-- CreateIndex
CREATE INDEX "orders_userId_idx" ON "orders"("userId");

-- CreateIndex
CREATE INDEX "orders_orderNumber_idx" ON "orders"("orderNumber");

-- CreateIndex
CREATE INDEX "orders_status_idx" ON "orders"("status");

-- CreateIndex
CREATE INDEX "order_items_orderId_idx" ON "order_items"("orderId");

-- CreateIndex
CREATE INDEX "order_items_merchandiseId_idx" ON "order_items"("merchandiseId");

-- CreateIndex
CREATE INDEX "releases_artist_idx" ON "releases"("artist");

-- CreateIndex
CREATE INDEX "releases_releaseDate_idx" ON "releases"("releaseDate");

-- CreateIndex
CREATE INDEX "releases_featured_idx" ON "releases"("featured");

-- CreateIndex
CREATE INDEX "releases_isActive_idx" ON "releases"("isActive");

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_tasks" ADD CONSTRAINT "user_tasks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_tasks" ADD CONSTRAINT "user_tasks_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_prizes" ADD CONSTRAINT "user_prizes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_prizes" ADD CONSTRAINT "user_prizes_prizeId_fkey" FOREIGN KEY ("prizeId") REFERENCES "prizes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gacha_items" ADD CONSTRAINT "gacha_items_prizeId_fkey" FOREIGN KEY ("prizeId") REFERENCES "prizes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gacha_pulls" ADD CONSTRAINT "gacha_pulls_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gacha_pulls" ADD CONSTRAINT "gacha_pulls_gachaItemId_fkey" FOREIGN KEY ("gachaItemId") REFERENCES "gacha_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gacha_pulls" ADD CONSTRAINT "gacha_pulls_prizeId_fkey" FOREIGN KEY ("prizeId") REFERENCES "prizes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "draw_tickets" ADD CONSTRAINT "draw_tickets_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "premium_packs" ADD CONSTRAINT "premium_packs_guaranteedPrizeId_fkey" FOREIGN KEY ("guaranteedPrizeId") REFERENCES "prizes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchases" ADD CONSTRAINT "purchases_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchases" ADD CONSTRAINT "purchases_packId_fkey" FOREIGN KEY ("packId") REFERENCES "premium_packs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mission_verification_jobs" ADD CONSTRAINT "mission_verification_jobs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mission_verification_jobs" ADD CONSTRAINT "mission_verification_jobs_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mission_verification_jobs" ADD CONSTRAINT "mission_verification_jobs_userTaskId_fkey" FOREIGN KEY ("userTaskId") REFERENCES "user_tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "merchandise_variants" ADD CONSTRAINT "merchandise_variants_merchandiseId_fkey" FOREIGN KEY ("merchandiseId") REFERENCES "merchandise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "merchandise_images" ADD CONSTRAINT "merchandise_images_merchandiseId_fkey" FOREIGN KEY ("merchandiseId") REFERENCES "merchandise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "carts" ADD CONSTRAINT "carts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "carts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_merchandiseId_fkey" FOREIGN KEY ("merchandiseId") REFERENCES "merchandise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "merchandise_variants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_merchandiseId_fkey" FOREIGN KEY ("merchandiseId") REFERENCES "merchandise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "merchandise_variants"("id") ON DELETE SET NULL ON UPDATE CASCADE;
