/*
  Warnings:

  - You are about to drop the column `stripeId` on the `page_donations` table. All the data in the column will be lost.
  - The `donationDate` column on the `page_donations` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[checkoutId]` on the table `page_donations` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[paymentId]` on the table `page_donations` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `checkoutId` to the `page_donations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentId` to the `page_donations` table without a default value. This is not possible if the table is not empty.
  - Made the column `amount` on table `page_donations` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "page_donations_stripeId_key";

-- AlterTable
ALTER TABLE "page_donations" DROP COLUMN "stripeId",
ADD COLUMN     "checkoutId" TEXT NOT NULL,
ADD COLUMN     "fee" INTEGER,
ADD COLUMN     "net" INTEGER,
ADD COLUMN     "paymentId" TEXT NOT NULL,
ALTER COLUMN "amount" SET NOT NULL,
DROP COLUMN "donationDate",
ADD COLUMN     "donationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE UNIQUE INDEX "page_donations_checkoutId_key" ON "page_donations"("checkoutId");

-- CreateIndex
CREATE UNIQUE INDEX "page_donations_paymentId_key" ON "page_donations"("paymentId");
