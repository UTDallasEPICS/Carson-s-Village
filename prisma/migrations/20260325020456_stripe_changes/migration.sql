/*
  Warnings:

  - The values [AVAILABLE,INCOMING] on the enum `DonationStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `payment_id` on the `page_donations` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[stripeId]` on the table `page_donations` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `stripeId` to the `page_donations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "DonationStatus_new" AS ENUM ('SUCCESS', 'PENDING', 'FAILED');
ALTER TABLE "page_donations" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "page_donations" ALTER COLUMN "status" TYPE "DonationStatus_new" USING ("status"::text::"DonationStatus_new");
ALTER TYPE "DonationStatus" RENAME TO "DonationStatus_old";
ALTER TYPE "DonationStatus_new" RENAME TO "DonationStatus";
DROP TYPE "DonationStatus_old";
ALTER TABLE "page_donations" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- DropIndex
DROP INDEX "page_donations_payment_id_key";

-- AlterTable
ALTER TABLE "page_donations" DROP COLUMN "payment_id",
ADD COLUMN     "availableOn" TIMESTAMP(3),
ADD COLUMN     "stripeId" TEXT NOT NULL,
ALTER COLUMN "amount" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "page_donations_stripeId_key" ON "page_donations"("stripeId");
