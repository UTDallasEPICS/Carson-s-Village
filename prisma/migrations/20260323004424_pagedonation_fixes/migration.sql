/*
  Warnings:

  - You are about to drop the column `success` on the `page_donations` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "DonationStatus" AS ENUM ('AVAILABLE', 'INCOMING', 'PENDING', 'FAILED');

-- AlterTable
ALTER TABLE "page_donations" DROP COLUMN "success",
ADD COLUMN     "status" "DonationStatus" NOT NULL DEFAULT 'PENDING';
