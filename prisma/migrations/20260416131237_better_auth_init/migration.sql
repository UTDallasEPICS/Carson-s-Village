/*
  Warnings:

  - You are about to drop the `user_accounts` table. If the table is not empty, all the data it contains will be lost.
  - The primary key for the `CC_Token` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `cuid` on the `CC_Token` table. All the data in the column will be lost.
  - The primary key for the `Family` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `cuid` on the `Family` table. All the data in the column will be lost.
  - The primary key for the `Reply` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `cuid` on the `Reply` table. All the data in the column will be lost.
  - The primary key for the `images` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `cuid` on the `images` table. All the data in the column will be lost.
  - The primary key for the `page_donations` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `cuid` on the `page_donations` table. All the data in the column will be lost.
  - The primary key for the `pages` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `cuid` on the `pages` table. All the data in the column will be lost.
  - Added the required column `id` to the `Family` table without a default value. This is not possible if the table is not empty.
  - Made the column `updated_at` on table `Family` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `id` to the `Reply` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `images` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `page_donations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `pages` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "user_accounts_email_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "user_accounts";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'family',
    "banned" BOOLEAN,
    "banReason" TEXT,
    "banExpires" DATETIME,
    "familyId" TEXT,
    "phone" TEXT NOT NULL DEFAULT '',
    "address" TEXT NOT NULL DEFAULT '',
    CONSTRAINT "user_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "Family" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "expiresAt" DATETIME NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    "impersonatedBy" TEXT,
    CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "account" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "verification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CC_Token" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT '0',
    "token" TEXT NOT NULL,
    "refresh_token" TEXT NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_CC_Token" ("date", "refresh_token", "token") SELECT "date", "refresh_token", "token" FROM "CC_Token";
DROP TABLE "CC_Token";
ALTER TABLE "new_CC_Token" RENAME TO "CC_Token";
CREATE TABLE "new_Family" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "family_name" TEXT NOT NULL,
    "stripe_account_id" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "advocate_cuid" TEXT NOT NULL,
    CONSTRAINT "Family_advocate_cuid_fkey" FOREIGN KEY ("advocate_cuid") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Family" ("advocate_cuid", "created_at", "family_name", "stripe_account_id", "updated_at") SELECT "advocate_cuid", "created_at", "family_name", "stripe_account_id", "updated_at" FROM "Family";
DROP TABLE "Family";
ALTER TABLE "new_Family" RENAME TO "Family";
CREATE TABLE "new_Reply" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "page_cuid" TEXT NOT NULL,
    "family_cuid" TEXT NOT NULL,
    "reply" TEXT NOT NULL DEFAULT '',
    "name" TEXT DEFAULT '',
    "suspended" BOOLEAN NOT NULL DEFAULT false,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Reply_page_cuid_fkey" FOREIGN KEY ("page_cuid") REFERENCES "pages" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Reply_family_cuid_fkey" FOREIGN KEY ("family_cuid") REFERENCES "Family" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Reply" ("date", "family_cuid", "name", "page_cuid", "reply", "suspended") SELECT "date", "family_cuid", "name", "page_cuid", "reply", "suspended" FROM "Reply";
DROP TABLE "Reply";
ALTER TABLE "new_Reply" RENAME TO "Reply";
CREATE TABLE "new_images" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "url" TEXT NOT NULL,
    "pageCuid" TEXT,
    CONSTRAINT "images_pageCuid_fkey" FOREIGN KEY ("pageCuid") REFERENCES "pages" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_images" ("pageCuid", "url") SELECT "pageCuid", "url" FROM "images";
DROP TABLE "images";
ALTER TABLE "new_images" RENAME TO "images";
CREATE UNIQUE INDEX "images_pageCuid_url_key" ON "images"("pageCuid", "url");
CREATE TABLE "new_page_donations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "family_cuid" TEXT NOT NULL,
    "page_cuid" TEXT NOT NULL,
    "donorFirstName" TEXT NOT NULL DEFAULT '',
    "donorLastName" TEXT NOT NULL DEFAULT '',
    "donorEmail" TEXT NOT NULL DEFAULT '',
    "comments" TEXT NOT NULL DEFAULT '',
    "donationInitiated" DATETIME NOT NULL,
    "donationProcessed" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "amount" INTEGER NOT NULL,
    CONSTRAINT "page_donations_family_cuid_fkey" FOREIGN KEY ("family_cuid") REFERENCES "Family" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "page_donations_page_cuid_fkey" FOREIGN KEY ("page_cuid") REFERENCES "pages" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_page_donations" ("amount", "comments", "donationInitiated", "donationProcessed", "donorEmail", "donorFirstName", "donorLastName", "family_cuid", "page_cuid") SELECT "amount", "comments", "donationInitiated", "donationProcessed", "donorEmail", "donorFirstName", "donorLastName", "family_cuid", "page_cuid" FROM "page_donations";
DROP TABLE "page_donations";
ALTER TABLE "new_page_donations" RENAME TO "page_donations";
CREATE TABLE "new_pages" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "day_of_birth" DATETIME,
    "day_of_passing" DATETIME,
    "visitation_date" DATETIME,
    "visitation_location" TEXT NOT NULL,
    "visitation_address" TEXT NOT NULL DEFAULT '',
    "visitation_description" TEXT NOT NULL,
    "funeral_date" DATETIME,
    "funeral_location" TEXT NOT NULL,
    "funeral_description" TEXT NOT NULL,
    "funeral_address" TEXT NOT NULL DEFAULT '',
    "obituary" TEXT NOT NULL,
    "donation_goal" INTEGER NOT NULL DEFAULT 0,
    "donation_description" TEXT NOT NULL DEFAULT '',
    "amount_raised" INTEGER NOT NULL DEFAULT 0,
    "deadline" DATETIME,
    "user_cuid" TEXT NOT NULL,
    "amount_distributed" INTEGER NOT NULL DEFAULT 0,
    "profile_image_cuid" TEXT NOT NULL,
    "family_cuid" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "donation_status" TEXT NOT NULL DEFAULT 'in progress',
    "duration" TEXT NOT NULL DEFAULT '0 days',
    "start_date" DATETIME NOT NULL,
    "goal_met_date" DATETIME,
    "page_first_name" TEXT NOT NULL DEFAULT '',
    "page_last_name" TEXT NOT NULL DEFAULT '',
    "last_donation_date" DATETIME,
    CONSTRAINT "pages_family_cuid_fkey" FOREIGN KEY ("family_cuid") REFERENCES "Family" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "pages_user_cuid_fkey" FOREIGN KEY ("user_cuid") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_pages" ("amount_distributed", "amount_raised", "day_of_birth", "day_of_passing", "deadline", "donation_description", "donation_goal", "donation_status", "duration", "family_cuid", "funeral_address", "funeral_date", "funeral_description", "funeral_location", "goal_met_date", "last_donation_date", "obituary", "page_first_name", "page_last_name", "profile_image_cuid", "start_date", "status", "user_cuid", "visitation_address", "visitation_date", "visitation_description", "visitation_location") SELECT "amount_distributed", "amount_raised", "day_of_birth", "day_of_passing", "deadline", "donation_description", "donation_goal", "donation_status", "duration", "family_cuid", "funeral_address", "funeral_date", "funeral_description", "funeral_location", "goal_met_date", "last_donation_date", "obituary", "page_first_name", "page_last_name", "profile_image_cuid", "start_date", "status", "user_cuid", "visitation_address", "visitation_date", "visitation_description", "visitation_location" FROM "pages";
DROP TABLE "pages";
ALTER TABLE "new_pages" RENAME TO "pages";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "account_provider_providerAccountId_key" ON "account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "verification_identifier_value_key" ON "verification"("identifier", "value");
