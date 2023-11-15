/*
  Warnings:

  - You are about to drop the column `familyCuid` on the `connected_accounts` table. All the data in the column will be lost.
  - You are about to drop the column `familyCuid` on the `user_accounts` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "connected_accounts" DROP CONSTRAINT "connected_accounts_familyCuid_fkey";

-- DropForeignKey
ALTER TABLE "user_accounts" DROP CONSTRAINT "user_accounts_familyCuid_fkey";

-- DropIndex
DROP INDEX "connected_accounts_familyCuid_key";

-- AlterTable
ALTER TABLE "Family" ALTER COLUMN "updated_at" SET DEFAULT '';

-- AlterTable
ALTER TABLE "connected_accounts" DROP COLUMN "familyCuid";

-- AlterTable
ALTER TABLE "user_accounts" DROP COLUMN "familyCuid";
