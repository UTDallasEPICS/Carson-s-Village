-- CreateTable
CREATE TABLE "user_accounts" (
    "cuid" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "user_role" TEXT NOT NULL DEFAULT 'family',
    "first_name" TEXT NOT NULL DEFAULT '',
    "middle_name" TEXT NOT NULL DEFAULT '',
    "last_name" TEXT NOT NULL DEFAULT '',
    "phone" TEXT NOT NULL DEFAULT '',
    "address" TEXT NOT NULL DEFAULT '',
    "familyCuid" TEXT,
    CONSTRAINT "user_accounts_familyCuid_fkey" FOREIGN KEY ("familyCuid") REFERENCES "Family" ("cuid") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Family" (
    "cuid" TEXT NOT NULL PRIMARY KEY,
    "family_name" TEXT NOT NULL,
    "stripe_account_id" TEXT,
    "created_at" DATETIME NOT NULL,
    "updated_at" DATETIME,
    "advocate_cuid" TEXT NOT NULL,
    CONSTRAINT "Family_advocate_cuid_fkey" FOREIGN KEY ("advocate_cuid") REFERENCES "user_accounts" ("cuid") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "pages" (
    "cuid" TEXT NOT NULL PRIMARY KEY,
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
    CONSTRAINT "pages_family_cuid_fkey" FOREIGN KEY ("family_cuid") REFERENCES "Family" ("cuid") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "pages_user_cuid_fkey" FOREIGN KEY ("user_cuid") REFERENCES "user_accounts" ("cuid") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "page_donations" (
    "cuid" TEXT NOT NULL PRIMARY KEY,
    "family_cuid" TEXT NOT NULL,
    "page_cuid" TEXT NOT NULL,
    "donorFirstName" TEXT NOT NULL DEFAULT '',
    "donorLastName" TEXT NOT NULL DEFAULT '',
    "donorEmail" TEXT NOT NULL DEFAULT '',
    "comments" TEXT NOT NULL DEFAULT '',
    "donationInitiated" DATETIME NOT NULL,
    "donationProcessed" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "amount" INTEGER NOT NULL,
    CONSTRAINT "page_donations_family_cuid_fkey" FOREIGN KEY ("family_cuid") REFERENCES "Family" ("cuid") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "page_donations_page_cuid_fkey" FOREIGN KEY ("page_cuid") REFERENCES "pages" ("cuid") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CC_Token" (
    "cuid" TEXT NOT NULL PRIMARY KEY DEFAULT '0',
    "token" TEXT NOT NULL,
    "refresh_token" TEXT NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Reply" (
    "cuid" TEXT NOT NULL PRIMARY KEY,
    "page_cuid" TEXT NOT NULL,
    "family_cuid" TEXT NOT NULL,
    "reply" TEXT NOT NULL DEFAULT '',
    "name" TEXT DEFAULT '',
    "suspended" BOOLEAN NOT NULL DEFAULT false,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Reply_page_cuid_fkey" FOREIGN KEY ("page_cuid") REFERENCES "pages" ("cuid") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "images" (
    "cuid" TEXT NOT NULL PRIMARY KEY,
    "url" TEXT NOT NULL,
    "pageCuid" TEXT,
    CONSTRAINT "images_pageCuid_fkey" FOREIGN KEY ("pageCuid") REFERENCES "pages" ("cuid") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "user_accounts_email_key" ON "user_accounts"("email");

-- CreateIndex
CREATE UNIQUE INDEX "images_pageCuid_url_key" ON "images"("pageCuid", "url");
