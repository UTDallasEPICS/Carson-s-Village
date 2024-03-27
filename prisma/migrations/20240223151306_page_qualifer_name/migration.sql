/*
  Warnings:

  - You are about to drop the column `first_name` on the `pages` table. All the data in the column will be lost.
  - Added the required column `page_first_name` to the `pages` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "pages" DROP COLUMN "first_name",
ADD COLUMN     "page_first_name" TEXT NOT NULL;
