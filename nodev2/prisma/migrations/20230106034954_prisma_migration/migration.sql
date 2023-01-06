/*
  Warnings:

  - You are about to drop the column `status` on the `page_donations` table. All the data in the column will be lost.
  - You are about to drop the `page_details` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `amount` to the `page_donations` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "page_details" DROP CONSTRAINT "page_details_family_cuid_fkey";

-- DropForeignKey
ALTER TABLE "page_donations" DROP CONSTRAINT "page_donations_page_cuid_fkey";

-- AlterTable
ALTER TABLE "page_donations" DROP COLUMN "status",
ADD COLUMN     "amount" MONEY NOT NULL,
ADD COLUMN     "success" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "user_accounts" ALTER COLUMN "user_role" SET DEFAULT 'family',
ALTER COLUMN "first_name" SET DEFAULT '',
ALTER COLUMN "middle_name" SET DEFAULT '',
ALTER COLUMN "last_name" SET DEFAULT '',
ALTER COLUMN "phone" SET DEFAULT '';

-- DropTable
DROP TABLE "page_details";

-- CreateTable
CREATE TABLE "pages" (
    "cuid" TEXT NOT NULL,
    "page_name" TEXT NOT NULL,
    "day_of_birth" TEXT NOT NULL,
    "day_of_passing" TEXT NOT NULL,
    "visitation_date" TEXT NOT NULL,
    "visitation_location" TEXT NOT NULL,
    "visitation_description" TEXT NOT NULL,
    "funeral_date" TEXT NOT NULL,
    "funeral_location" TEXT NOT NULL,
    "funeral_description" TEXT NOT NULL,
    "obituary" TEXT NOT NULL,
    "images" TEXT[],
    "timezone" TEXT NOT NULL,
    "donation_goal" MONEY NOT NULL DEFAULT 0,
    "amount_raised" MONEY NOT NULL DEFAULT 0,
    "deadline" TEXT NOT NULL,
    "family_cuid" TEXT NOT NULL,

    CONSTRAINT "pages_pkey" PRIMARY KEY ("cuid")
);

-- CreateTable
CREATE TABLE "Image" (
    "cuid" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "pageCuid" TEXT NOT NULL,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("cuid")
);

-- CreateIndex
CREATE UNIQUE INDEX "Image_pageCuid_url_key" ON "Image"("pageCuid", "url");

-- AddForeignKey
ALTER TABLE "pages" ADD CONSTRAINT "pages_family_cuid_fkey" FOREIGN KEY ("family_cuid") REFERENCES "user_accounts"("cuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "page_donations" ADD CONSTRAINT "page_donations_page_cuid_fkey" FOREIGN KEY ("page_cuid") REFERENCES "pages"("cuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_pageCuid_fkey" FOREIGN KEY ("pageCuid") REFERENCES "pages"("cuid") ON DELETE RESTRICT ON UPDATE CASCADE;
