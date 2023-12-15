/*
  Warnings:

  - You are about to drop the column `family_member_cuids` on the `Family` table. All the data in the column will be lost.
  - You are about to drop the column `family_relationship` on the `Family` table. All the data in the column will be lost.
  - You are about to drop the column `family_role` on the `Family` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[pageCuid,url]` on the table `images` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Family" DROP CONSTRAINT "Family_advocate_cuid_fkey";

-- DropIndex
DROP INDEX "Family_advocate_cuid_key";

-- AlterTable
ALTER TABLE "Family" DROP COLUMN "family_member_cuids",
DROP COLUMN "family_relationship",
DROP COLUMN "family_role";

-- AlterTable
ALTER TABLE "user_accounts" ADD COLUMN     "advocateCuid" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "familyCuid" TEXT NOT NULL DEFAULT '';

-- CreateIndex
CREATE UNIQUE INDEX "images_pageCuid_url_key" ON "images"("pageCuid", "url");

-- AddForeignKey
ALTER TABLE "user_accounts" ADD CONSTRAINT "user_accounts_familyCuid_fkey" FOREIGN KEY ("familyCuid") REFERENCES "Family"("cuid") ON DELETE RESTRICT ON UPDATE CASCADE;
