/*
  Warnings:

  - You are about to drop the column `familly_cuid` on the `DonationPayout` table. All the data in the column will be lost.
  - Added the required column `family_cuid` to the `DonationPayout` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "DonationPayout" DROP CONSTRAINT "DonationPayout_familly_cuid_fkey";

-- AlterTable
ALTER TABLE "DonationPayout" DROP COLUMN "familly_cuid",
ADD COLUMN     "family_cuid" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "DonationPayout" ADD CONSTRAINT "DonationPayout_family_cuid_fkey" FOREIGN KEY ("family_cuid") REFERENCES "Family"("cuid") ON DELETE RESTRICT ON UPDATE CASCADE;
