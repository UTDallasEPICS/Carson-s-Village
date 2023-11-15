/*
  Warnings:

  - You are about to drop the column `advocateCuid` on the `user_accounts` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "user_accounts" DROP CONSTRAINT "user_accounts_familyCuid_fkey";

-- AlterTable
ALTER TABLE "user_accounts" DROP COLUMN "advocateCuid",
ALTER COLUMN "familyCuid" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "user_accounts" ADD CONSTRAINT "user_accounts_familyCuid_fkey" FOREIGN KEY ("familyCuid") REFERENCES "Family"("cuid") ON DELETE SET NULL ON UPDATE CASCADE;
