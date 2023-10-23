/*
  Warnings:

  - A unique constraint covering the columns `[familyCuid]` on the table `connected_accounts` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "connected_accounts" ADD COLUMN     "familyCuid" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "user_accounts" ADD COLUMN     "familyCuid" TEXT DEFAULT '';

-- CreateIndex
CREATE UNIQUE INDEX "connected_accounts_familyCuid_key" ON "connected_accounts"("familyCuid");

-- AddForeignKey
ALTER TABLE "user_accounts" ADD CONSTRAINT "user_accounts_familyCuid_fkey" FOREIGN KEY ("familyCuid") REFERENCES "Family"("cuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "connected_accounts" ADD CONSTRAINT "connected_accounts_familyCuid_fkey" FOREIGN KEY ("familyCuid") REFERENCES "Family"("cuid") ON DELETE RESTRICT ON UPDATE CASCADE;
