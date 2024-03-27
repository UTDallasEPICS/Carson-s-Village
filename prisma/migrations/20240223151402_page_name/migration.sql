/*
  Warnings:

  - You are about to drop the column `last_name` on the `pages` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "pages" DROP COLUMN "last_name",
ADD COLUMN     "page_last_name" TEXT NOT NULL DEFAULT '',
ALTER COLUMN "page_first_name" SET DEFAULT '';
