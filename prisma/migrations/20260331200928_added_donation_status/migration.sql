/*
  Warnings:

  - You are about to drop the column `success` on the `page_donations` table. All the data in the column will be lost.
  - Added the required column `status` to the `page_donations` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "DonationStatus" AS ENUM ('SUCCESS', 'PENDING');

-- AlterTable
ALTER TABLE "page_donations" DROP COLUMN "success",
ADD COLUMN     "status" "DonationStatus" NOT NULL;
