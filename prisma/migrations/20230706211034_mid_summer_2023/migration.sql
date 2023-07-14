/*
  Warnings:

  - You are about to alter the column `amount` on the `page_donations` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.
  - You are about to alter the column `donation_goal` on the `pages` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.
  - You are about to alter the column `amount_raised` on the `pages` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.
  - Added the required column `profile_image_cuid` to the `pages` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "page_donations" ALTER COLUMN "amount" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "pages" ADD COLUMN     "amount_distributed" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "profile_image_cuid" TEXT NOT NULL,
ALTER COLUMN "donation_goal" SET DEFAULT 0,
ALTER COLUMN "donation_goal" SET DATA TYPE INTEGER,
ALTER COLUMN "amount_raised" SET DEFAULT 0,
ALTER COLUMN "amount_raised" SET DATA TYPE INTEGER;

-- CreateTable
CREATE TABLE "DonationPayout" (
    "cuid" TEXT NOT NULL,
    "family_cuid" TEXT NOT NULL,
    "page_cuid" TEXT NOT NULL,
    "transaction_id" TEXT NOT NULL,
    "amount" INTEGER NOT NULL DEFAULT 0,
    "distributionDate" TEXT NOT NULL,

    CONSTRAINT "DonationPayout_pkey" PRIMARY KEY ("cuid")
);

-- CreateIndex
CREATE UNIQUE INDEX "DonationPayout_transaction_id_key" ON "DonationPayout"("transaction_id");

-- AddForeignKey
ALTER TABLE "DonationPayout" ADD CONSTRAINT "DonationPayout_page_cuid_fkey" FOREIGN KEY ("page_cuid") REFERENCES "pages"("cuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DonationPayout" ADD CONSTRAINT "DonationPayout_family_cuid_fkey" FOREIGN KEY ("family_cuid") REFERENCES "user_accounts"("cuid") ON DELETE RESTRICT ON UPDATE CASCADE;
