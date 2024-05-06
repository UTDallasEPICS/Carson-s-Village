/*
  Warnings:

  - The `day_of_birth` column on the `pages` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `day_of_passing` column on the `pages` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `visitation_date` column on the `pages` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `funeral_date` column on the `pages` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `distributionDate` on the `DonationPayout` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `created_at` on the `Family` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `updated_at` on the `Family` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `deadline` on the `pages` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `start_date` on the `pages` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `goal_met_date` on the `pages` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "DonationPayout" DROP COLUMN "distributionDate",
ADD COLUMN     "distributionDate" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Family" DROP COLUMN "created_at",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL,
DROP COLUMN "updated_at",
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "page_donations" ADD COLUMN     "donationDate" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "pages" ADD COLUMN     "last_donation_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "day_of_birth",
ADD COLUMN     "day_of_birth" TIMESTAMP(3),
DROP COLUMN "day_of_passing",
ADD COLUMN     "day_of_passing" TIMESTAMP(3),
DROP COLUMN "visitation_date",
ADD COLUMN     "visitation_date" TIMESTAMP(3),
DROP COLUMN "funeral_date",
ADD COLUMN     "funeral_date" TIMESTAMP(3),
DROP COLUMN "deadline",
ADD COLUMN     "deadline" TIMESTAMP(3) NOT NULL,
DROP COLUMN "start_date",
ADD COLUMN     "start_date" TIMESTAMP(3) NOT NULL,
DROP COLUMN "goal_met_date",
ADD COLUMN     "goal_met_date" TIMESTAMP(3) NOT NULL;
