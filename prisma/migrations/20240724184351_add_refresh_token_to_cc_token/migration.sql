/*
  Warnings:

  - Added the required column `refresh_token` to the `CC_Token` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CC_Token" ADD COLUMN     "refresh_token" TEXT NOT NULL;
