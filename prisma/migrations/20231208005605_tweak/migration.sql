/*
  Warnings:

  - You are about to drop the column `stripe_Account_id` on the `Family` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Family" DROP COLUMN "stripe_Account_id",
ADD COLUMN     "stripe_account_id" TEXT;
