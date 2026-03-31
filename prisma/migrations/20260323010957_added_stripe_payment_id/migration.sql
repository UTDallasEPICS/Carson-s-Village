/*
  Warnings:

  - You are about to drop the column `transaction_id` on the `page_donations` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[payment_id]` on the table `page_donations` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `payment_id` to the `page_donations` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "page_donations_transaction_id_key";

-- AlterTable
ALTER TABLE "page_donations" DROP COLUMN "transaction_id",
ADD COLUMN     "payment_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "page_donations_payment_id_key" ON "page_donations"("payment_id");
