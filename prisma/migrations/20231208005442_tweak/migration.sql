/*
  Warnings:

  - You are about to drop the column `family_cuid` on the `DonationPayout` table. All the data in the column will be lost.
  - You are about to drop the column `Stripe_Accont_cuid` on the `Family` table. All the data in the column will be lost.
  - You are about to drop the column `Stripe_Account_id` on the `Family` table. All the data in the column will be lost.
  - You are about to drop the column `families_cuid` on the `pages` table. All the data in the column will be lost.
  - You are about to drop the column `images` on the `pages` table. All the data in the column will be lost.
  - You are about to drop the `connected_accounts` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `familly_cuid` to the `DonationPayout` table without a default value. This is not possible if the table is not empty.
  - Added the required column `family_name` to the `Family` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_cuid` to the `page_donations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_cuid` to the `pages` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "DonationPayout" DROP CONSTRAINT "DonationPayout_family_cuid_fkey";

-- DropForeignKey
ALTER TABLE "page_donations" DROP CONSTRAINT "page_donations_family_cuid_fkey";

-- DropForeignKey
ALTER TABLE "pages" DROP CONSTRAINT "pages_families_cuid_fkey";

-- DropForeignKey
ALTER TABLE "pages" DROP CONSTRAINT "pages_family_cuid_fkey";

-- AlterTable
ALTER TABLE "DonationPayout" DROP COLUMN "family_cuid",
ADD COLUMN     "familly_cuid" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Family" DROP COLUMN "Stripe_Accont_cuid",
DROP COLUMN "Stripe_Account_id",
ADD COLUMN     "family_name" TEXT NOT NULL,
ADD COLUMN     "stripe_Account_id" TEXT;

-- AlterTable
ALTER TABLE "page_donations" ADD COLUMN     "user_cuid" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "pages" DROP COLUMN "families_cuid",
DROP COLUMN "images",
ADD COLUMN     "user_cuid" TEXT NOT NULL,
ALTER COLUMN "day_of_birth" DROP NOT NULL,
ALTER COLUMN "day_of_passing" DROP NOT NULL,
ALTER COLUMN "family_cuid" DROP NOT NULL;

-- AlterTable
ALTER TABLE "user_accounts" ADD COLUMN     "familyCuid" TEXT;

-- DropTable
DROP TABLE "connected_accounts";

-- AddForeignKey
ALTER TABLE "user_accounts" ADD CONSTRAINT "user_accounts_familyCuid_fkey" FOREIGN KEY ("familyCuid") REFERENCES "Family"("cuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Family" ADD CONSTRAINT "Family_advocate_cuid_fkey" FOREIGN KEY ("advocate_cuid") REFERENCES "user_accounts"("cuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DonationPayout" ADD CONSTRAINT "DonationPayout_familly_cuid_fkey" FOREIGN KEY ("familly_cuid") REFERENCES "Family"("cuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pages" ADD CONSTRAINT "pages_user_cuid_fkey" FOREIGN KEY ("user_cuid") REFERENCES "user_accounts"("cuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pages" ADD CONSTRAINT "pages_family_cuid_fkey" FOREIGN KEY ("family_cuid") REFERENCES "Family"("cuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "page_donations" ADD CONSTRAINT "page_donations_family_cuid_fkey" FOREIGN KEY ("family_cuid") REFERENCES "Family"("cuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "page_donations" ADD CONSTRAINT "page_donations_user_cuid_fkey" FOREIGN KEY ("user_cuid") REFERENCES "user_accounts"("cuid") ON DELETE RESTRICT ON UPDATE CASCADE;
