/*
  Warnings:

  - You are about to drop the column `familyCuid` on the `user_accounts` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "user_accounts" DROP CONSTRAINT "user_accounts_familyCuid_fkey";

-- AlterTable
ALTER TABLE "user_accounts" DROP COLUMN "familyCuid";
