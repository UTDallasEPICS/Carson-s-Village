/*
  Warnings:

  - You are about to drop the column `donationDate` on the `page_donations` table. All the data in the column will be lost.
  - You are about to drop the `DonationPayout` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `donationInitiated` to the `page_donations` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "DonationPayout" DROP CONSTRAINT "DonationPayout_family_cuid_fkey";

-- DropForeignKey
ALTER TABLE "DonationPayout" DROP CONSTRAINT "DonationPayout_page_cuid_fkey";

-- AlterTable
ALTER TABLE "page_donations" DROP COLUMN "donationDate",
ADD COLUMN     "donationInitiated" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "donationProcessed" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "pages" ALTER COLUMN "last_donation_date" DROP DEFAULT;

-- DropTable
DROP TABLE "DonationPayout";
