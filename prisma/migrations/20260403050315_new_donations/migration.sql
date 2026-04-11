/*
  Warnings:

  - You are about to drop the column `isAnonymous` on the `page_donations` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `page_donations` table. All the data in the column will be lost.
  - You are about to drop the column `transaction_id` on the `page_donations` table. All the data in the column will be lost.
  - The `donationDate` column on the `page_donations` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- DropIndex
DROP INDEX "page_donations_transaction_id_key";

-- AlterTable
ALTER TABLE "page_donations" DROP COLUMN "isAnonymous",
DROP COLUMN "status",
DROP COLUMN "transaction_id",
DROP COLUMN "donationDate",
ADD COLUMN     "donationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- DropEnum
DROP TYPE "DonationStatus";
