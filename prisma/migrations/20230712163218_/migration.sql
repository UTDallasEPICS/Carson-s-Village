/*
  Warnings:

  - Added the required column `profile_image_cuid` to the `pages` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "pages" ADD COLUMN     "profile_image_cuid" TEXT NOT NULL;
